# Use the official, lightweight Python 3.11 image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first (leveraging Docker cache)
COPY requirements.txt .

# XGBoost requires the 'libgomp1' C-library to run. 
# The 'slim' python image doesn't have it by default, so we install it here.
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code and model files
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the application
# We use 0.0.0.0 so the container is accessible from the outside
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]