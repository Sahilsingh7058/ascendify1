# quiz_gen.py
import json
import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

# Pydantic models for request and response validation
class QuestionRequest(BaseModel):
    skill: str
    difficulty: str

class Question(BaseModel):
    question: str
    options: List[str]

class QuestionResponse(BaseModel):
    skill: str
    difficulty: str
    questions: List[Question]

# Create an APIRouter instance
router = APIRouter(
    prefix="/api/quiz",
    tags=["quiz"]
)

# Get the API key from environment variables for security
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

@router.post("/assessment/generate-questions", response_model=QuestionResponse)
async def generate_questions_endpoint(request: QuestionRequest):
    """
    Generates technical assessment questions based on skill and difficulty.
    """
    skill = request.skill
    difficulty = request.difficulty

    # The prompt for the generative model
    system_prompt = "You are a helpful assistant specialized in generating multiple-choice questions for technical assessments. Your task is to provide a JSON array of questions that strictly adheres to the provided schema."
    user_query = f"Generate 10 unique, multiple-choice questions for a {skill} assessment. Each question should have exactly 4 options, and the last option must be the correct answer. The difficulty level should be {difficulty}."

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={API_KEY}"

    payload = {
        "contents": [{"role": "user", "parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "question": {"type": "STRING"},
                        "options": {
                            "type": "ARRAY",
                            "items": {"type": "STRING"},
                            "minItems": 4,
                            "maxItems": 4
                        }
                    }
                }
            }
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, json=payload, timeout=30.0)
            response.raise_for_status()
            
            generated_data = response.json()
            generated_text = generated_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            if not generated_text:
                raise HTTPException(status_code=500, detail="Failed to parse API response.")

            questions_list = json.loads(generated_text)
            
            return QuestionResponse(
                skill=skill,
                difficulty=difficulty,
                questions=questions_list
            )

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {e.response.text}")
    except (json.JSONDecodeError, IndexError, KeyError) as e:
        raise HTTPException(status_code=500, detail=f"Invalid response from the model: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
