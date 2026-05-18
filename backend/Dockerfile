# Use the official, lightweight Python 3.11 image
FROM python:3.11-slim

# Create a non-root user (Hugging Face requirement)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set the working directory
WORKDIR /app

# Copy files and set ownership to the new user
COPY --chown=user:user requirements.txt .

# Install the C-library (temporarily switch to root to install, then back to user)
USER root
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*
USER user

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY --chown=user:user . .

# Start the server
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]