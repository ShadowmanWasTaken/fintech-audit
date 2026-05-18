# FinTech AI Audit System

An enterprise-grade, containerized Machine Learning application designed to assess credit risk and generate regulatory-compliant explanations for algorithmic decisions using Explainable AI (XAI) techniques.

## Key Features

* **Real-Time Credit Auditing:** Predicts the probability of default using historical financial data.
* **Granular Explainability (XAI):** Generates local feature attributions (SHAP values) on the fly, explicitly quantifying how much each variable increased or decreased the applicant's risk score.
* **Contextual Data Handling:** Automatically manages historical currency conversions (USD to 2005 NTD) under the hood to preserve model integrity while providing localized UX.
* **Production-Ready Architecture:** Fully decoupled frontend and backend services, containerized using Docker and Docker Compose.
* **Multi-Stage Build:** Utilizes Nginx to serve optimized, static React assets.

## Tech Stack

**Machine Learning & Data Science**
* `Python 3.11`, `Pandas`, `Scikit-Learn`
* `XGBoost` (Gradient boosting architecture)
* `SHAP` (Game-theoretic post-hoc interpretability)

**Backend Architecture**
* `FastAPI` (High-performance API framework)
* `Uvicorn` (ASGI web server)
* `Pydantic` (Data validation)

**Frontend Architecture**
* `React.js` (Component-based UI)
* `Vite` (Next-generation frontend tooling)
* `Tailwind CSS v4` (Utility-first styling)

**DevOps & Deployment**
* `Docker` & `Docker Compose`
* `Nginx` (Static file serving)

---

## Getting Started

This application is fully containerized. You do not need to install Python, Node.js, or any ML libraries locally to run this system. 

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Installation & Execution

1. **Clone the repository & run:**
   ```bash
   cd fintech-audit

2. **Spin up the application**

   Run the following command from the root directory to build the images and start the containers:
   ```bash
   docker-compose up --build

3. **Access the Application**

   * **Frontend Dashboard:** Open your browser and navigate to http://localhost
   * **Backend API Docs (Swagger UI):** Navigate to http://localhost:8000/docs to interact directly with the FastAPI endpoints.

To stop the application, simply press `Ctrl + C` in your terminal, or run `docker-compose down`.
