from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np

# Initialize the app
app = FastAPI(title="FinTech XAI Auditor")

# Allow communication with React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML models
try:
    xgb_model = joblib.load('xgb_model.joblib')
    explainer = joblib.load('shap_explainer.joblib')
except Exception as e:
    print(f"Error loading models: {e}")

# Define input data schema
class CustomerData(BaseModel):
    LIMIT_BAL: float
    SEX: int
    EDUCATION: int
    MARRIAGE: int
    AGE: int
    PAY_1: int
    PAY_2: int
    PAY_3: int
    PAY_4: int
    PAY_5: int
    PAY_6: int
    BILL_AMT1: float
    BILL_AMT2: float
    BILL_AMT3: float
    BILL_AMT4: float
    BILL_AMT5: float
    BILL_AMT6: float
    PAY_AMT1: float
    PAY_AMT2: float
    PAY_AMT3: float
    PAY_AMT4: float
    PAY_AMT5: float
    PAY_AMT6: float

# Health check for Hugging Face pings
@app.get("/")
def health_check():
    return {"status": "healthy", "message": "API is running"}

# Create prediction endpoint
@app.post("/predict")
async def get_pred_and_exp(data: CustomerData):
    try:
        # Convert input JSON data into pandas DF
        input_dict = data.model_dump()
        df = pd.DataFrame([input_dict])

        # Cast categorical columns
        cat_cols = ['SEX', 'EDUCATION', 'MARRIAGE', 'PAY_1', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6']
        for col in cat_cols:
            df[col] = df[col].astype('category')

        # Get prediction probability
        prob = xgb_model.predict_proba(df)[0][1]

        # Get SHAP values
        shap_values = explainer(df)

        # Extract only feature names and values
        feature_names = df.columns.tolist()
        shap_contrib = shap_values.values[0].tolist()
        base_value = float(shap_values.base_values[0])

        # Formulate explanation
        explanation = {feature_names[i]: shap_contrib[i] for i in range(len(feature_names))}

        # Return final JSON response to frontend
        return {
            "status": "success",
            "default_probability": float(prob),
            "base_value": base_value,
            "explanation": explanation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))