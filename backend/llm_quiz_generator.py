import os
from dotenv import load_dotenv
from langchain_mistralai.chat_models import ChatMistralAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from backend.models import QuizOutput
from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

PROMPT_TEMPLATE = """
You are an expert AI assistant tasked with creating a high-quality quiz from a Wikipedia article.
Based on the article text provided, you must generate a complete quiz and summary package.
You must adhere strictly to the JSON format instructions.

ARTICLE TEXT:
{article_text}

JSON FORMAT INSTRUCTIONS:
{format_instructions}
"""

def get_llm_chain():
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY not found. Please set it in your .env file.")

    model = ChatMistralAI(
    model="mistral-small-latest",
    mistral_api_key=api_key,
    temperature=0.7
)
    
    parser = JsonOutputParser(pydantic_object=QuizOutput)
    
    prompt = PromptTemplate(
        template=PROMPT_TEMPLATE,
        input_variables=["article_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | model | parser
    return chain

def generate_quiz_from_text(text: str):
    try:
        chain = get_llm_chain()
        quiz_data = chain.invoke({"article_text": text})
        return quiz_data
    except Exception as e:
        print(f"Error in LLM chain invocation: {e}")
        raise