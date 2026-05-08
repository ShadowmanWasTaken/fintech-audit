import shap
import pandas as pd
import numpy as np
import xgboost as xgb
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# Load data from CSV
print("Loading dataset...")
df = pd.read_csv('UCI_Credit_Card.csv', index_col=0)

# Clean up ghost categories
df['EDUCATION'] = df['EDUCATION'].replace({0: 4, 5: 4, 6: 4})
df['MARRIAGE'] = df['MARRIAGE'].replace({0: 3})

# Rename columns
df = df.rename(columns={
    'PAY_0': 'PAY_1',
    'default.payment.next.month': 'DEFAULT'
})

# Change data type for categories
cat_cols = ['SEX', 'EDUCATION', 'MARRIAGE', 'PAY_1', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6']

for col in cat_cols:
    df[col] = df[col].astype('category')

# Separate features from target to be predicted
X = df.drop('DEFAULT', axis=1)
y = df['DEFAULT']

# Perform stratified test/train split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Calculate scale_pos_weight for XGBoost model
neg_count = (y_train == 0).sum()
pos_count = (y_train == 1).sum()
scale_pos_weight_value = neg_count / pos_count

print("Preprocessing complete!")

# Initialize XGBoost model
xgb_model = xgb.XGBClassifier(
    scale_pos_weight=scale_pos_weight_value,
    enable_categorical=True,
    tree_method='hist',
    random_state=42,
    max_depth=5,
    learning_rate=0.1,
    n_estimators=100
)

print("Training XGBoost model...")

xgb_model.fit(X_train, y_train)

print("Training complete!")

# Make predictions
y_pred = xgb_model.predict(X_test)
y_pred_proba = xgb_model.predict_proba(X_test)[:, 1]

# Evaluate the model for business value
print("\nModel Evaluation:")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

auc_score = roc_auc_score(y_test, y_pred_proba)
print(f"ROC-AUC Score: {auc_score:.4f}")

cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix Business Breakdown:")
print(f"True Negatives (Correctly Approved): {cm[0][0]}")
print(f"False Positives (Incorrectly Denied - Lost Revenue): {cm[0][1]}")
print(f"False Negatives (Incorrectly Approved - Financial Loss): {cm[1][0]}")
print(f"True Positives (Correctly Denied - Risk Avoided): {cm[1][1]}")

# Initialize SHAP explainer
explainer = shap.TreeExplainer(xgb_model)

# Calculate SHAP values
print("Calculating SHAP values... (this might take a few seconds)")
shap_values = explainer(X_test)

# Generate global explanation
print("\nGenerating global explanation...")
plt.figure(figsize=(10, 6))
shap.plots.beeswarm(shap_values, max_display=10)

# Generate local explanation
print("\nGenerating local explanation for a specific denied customer...")
true_positive = (y_test == 1) & (y_pred == 1)
ex_customer_idx = np.where(true_positive)[0][0]
customer_id = X_test.index[ex_customer_idx]

print(f"Generating explanation for Customer ID: {customer_id}")
plt.figure(figsize=(8, 5))
shap.plots.waterfall(shap_values[ex_customer_idx])