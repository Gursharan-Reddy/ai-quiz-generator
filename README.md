AI Wikipedia Quiz Generator

This is a full-stack application that transforms any Wikipedia article into an engaging quiz using artificial intelligence.

You give it a Wikipedia URL, and the app's Python backend scrapes the article, sends the text to the Mistral AI API, and generates a complete quiz package. The React frontend then displays the quiz and saves every generated quiz to a PostgreSQL database so you can review it later in the "History" tab.

Live Project URL: https://ai-quiz-generator-blond.vercel.app

Features

AI Quiz Generation: Instantly get a quiz from any Wikipedia URL.

Structured Content: The AI generates a summary, key entities, and multiple-choice questions complete with answers and explanations.

Persistent History: All generated quizzes are automatically saved to a PostgreSQL database.

Quiz History Tab: Browse and review all previously generated quizzes at any time.

Tech Stack

Frontend: React (using Create React App) & Plain CSS

Backend: Python (FastAPI)

Database: PostgreSQL (Hosted on Render)

AI Model: Mistral AI (via langchain-mistralai)

Web Scraping: BeautifulSoup

Deployment

This project is deployed using a standard "Jamstack" architecture:

Backend: The FastAPI application is deployed as a Web Service on Render.

Database: The PostgreSQL database is also hosted on Render as a separate service.

Frontend: The React application is deployed on Vercel, which connects to the live Render backend.

An uptime bot (UptimeRobot) pings a /health endpoint on the backend every 5 minutes to prevent Render's free service from spinning down.

How to Run Locally

1. Backend Setup

# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install all required packages
pip install -r requirements.txt

# Create a .env file and add your keys


backend/.env file:

MISTRAL_API_KEY="your_mistral_key_here"
DATABASE_URL="your_local_postgresql_connection_string"


Run the backend:

# Run from the *root* folder (ai-quiz-generator)
uvicorn backend.main:app --reload


2. Frontend Setup

# Navigate to the frontend folder
cd frontend

# Install all packages
npm install

# Run the frontend
npm start


The app will open on http://localhost:3000.