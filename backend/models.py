from pydantic import BaseModel, Field
from typing import List, Dict, Any

class QuizQuestion(BaseModel):
    question: str = Field(description="The multiple-choice question text")
    options: List[str] = Field(description="A list of exactly four options")
    answer: str = Field(description="The correct answer, which must be one of the provided options")
    difficulty: str = Field(description="Difficulty level (easy, medium, hard)")
    explanation: str = Field(description="A short explanation for why the answer is correct")

class QuizOutput(BaseModel):
    title: str = Field(description="The title of the Wikipedia article")
    summary: str = Field(description="A concise summary of the article")
    key_entities: Dict[str, List[str]] = Field(description="A dictionary of key entities, e.g., {'people': ['Alan Turing'], 'locations': ['Bletchley Park']}")
    sections: List[str] = Field(description="A list of main section headings from the article")
    quiz: List[QuizQuestion] = Field(description="A list of 5-10 multiple-choice questions")
    related_topics: List[str] = Field(description="A list of 3-5 related Wikipedia topics for further reading")

class GenerateRequest(BaseModel):
    url: str