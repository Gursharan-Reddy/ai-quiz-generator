import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base(metadata=MetaData(schema='quiz_app'))

class Quiz(Base):
    __tablename__ = "quiz_history"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(1024), index=True)
    title = Column(String(1024))
    date_generated = Column(DateTime, default=datetime.datetime.utcnow)
    full_quiz_data = Column(Text)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()