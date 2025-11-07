import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from backend.database import engine, get_db, Base, Quiz
from backend.models import GenerateRequest
from backend.scraper import scrape_wikipedia
from backend.llm_quiz_generator import generate_quiz_from_text

Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- THIS IS THE FIX ---
# We are adding BOTH of your Vercel URLs to the "allow list".
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https.ai-quiz-generator-j2i5isms-gursharans-reddys-projects.vercel.app",
        "https.ai-quiz-generator-blond.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_quiz")
def api_generate_quiz(request: GenerateRequest, db: Session = Depends(get_db)):
    try:
        title, content = scrape_wikipedia(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error scraping URL: {str(e)}")
        
    if not content:
        raise HTTPException(status_code=404, detail="Could not extract sufficient content from URL")

    try:
        quiz_data = generate_quiz_from_text(content)
        
        if quiz_data.get('title'):
            title = quiz_data['title']
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz from LLM: {str(e)}")
        
    try:
        full_quiz_data_str = json.dumps(quiz_data)
        
        db_quiz = Quiz(
            url=request.url,
            title=title,
            full_quiz_data=full_quiz_data_str
        )
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
        
        response_data = {
            "id": db_quiz.id,
            "url": db_quiz.url,
            "date_generated": db_quiz.date_generated,
            **quiz_data
        }
        return response_data
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving to database: {str(e)}")

@app.get("/history")
def api_get_history(db: Session = Depends(get_db)):
    try:
        history_query = db.query(
            Quiz.id,
            Quiz.url,
            Quiz.title,
            Quiz.date_generated
        ).order_by(Quiz.date_generated.desc()).all()
        
        history = [
            {
                "id": item.id,
                "url": item.url,
                "title": item.title,
                "date_generated": item.date_generated
            }
            for item in history_query
        ]
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.get("/quiz/{quiz_id}")
def api_get_quiz_details(quiz_id: int, db: Session = Depends(get_db)):
    try:
        db_quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        
        if db_quiz is None:
            raise HTTPException(status_code=404, detail="Quiz not found")
            
        deserialized_data = json.loads(db_quiz.full_quiz_data)
        
        response_data = {
            "id": db_quiz.id,
            "url": db_quiz.url,
            "date_generated": db_quiz.date_generated,
            **deserialized_data
        }
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quiz details: {str(e)}")