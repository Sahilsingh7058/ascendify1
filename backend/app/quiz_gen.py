import json
import os
import httpx
import random
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from pymongo import MongoClient

# Pydantic models for request and response validation
class QuestionRequest(BaseModel):
    skill: str
    difficulty: str
    num_questions: Optional[int] = 10

class Question(BaseModel):
    question: str
    options: List[str]
    answer: int
    explanation: Optional[str] = None

class QuestionResponse(BaseModel):
    skill: str
    difficulty: str
    questions: List[Question]
    level: str
    topic: List[str]

# Create an APIRouter instance
router = APIRouter(
    prefix="/api/quiz",
    tags=["quiz"]
)

# MongoDB connection
client = MongoClient("mongodb+srv://rasikathakur303_db_user:ycHpj7gTS45vPSTA@career-assessment-roadm.gsqeija.mongodb.net/?retryWrites=true&w=majority&appName=career-assessment-roadmap")
db = client["career_assessment_roadmap"]
collection = db["roadmap_java"]

# Get the API key from environment variables for security
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    print("Warning: GOOGLE_API_KEY environment variable not set. AI generation may not work.")

class EnhancedQuizGenerator:
    def __init__(self):
        self.generic_distractors = [
            "Object Serialization",
            "Memory Management", 
            "Exception Handling",
            "Thread Synchronization",
            "Database Connectivity",
            "Network Programming",
            "File I/O Operations",
            "GUI Development"
        ]
        
    def get_sections_by_level(self, level: str) -> List[str]:
        """
        Fetch section titles from MongoDB grouped by level
        """
        try:
            query: Dict[str, Any] = {"level": {"$regex": f"^{re.escape(level)}$", "$options": "i"}}
            docs = list(collection.find(query))
            if not docs:
                return []
            all_sections = []
            for doc in docs:
                for section in doc.get("sections", []) or []:
                    section_title = section.get("sectionTitle")
                    if section_title:
                        all_sections.append(section_title)
            return all_sections
        except Exception as e:
            print(f"Error fetching sections by level: {e}")
            return []

    def _ensure_unique_options(self, options: List[str], desired: int = 4) -> List[str]:
        """Ensure unique options for multiple choice questions"""
        seen = set()
        unique = []
        for opt in options:
            norm = str(opt).strip()
            if norm and norm.lower() not in seen:
                unique.append(norm)
                seen.add(norm.lower())
        
        fillers = [
            "None of the above",
            "All of the above", 
            "Cannot be determined",
            "Depends on implementation",
        ]
        for f in fillers:
            if len(unique) >= desired:
                break
            if f.lower() not in seen:
                unique.append(f)
                seen.add(f.lower())
        
        return unique[:desired]

    def generate_structure_based_question(self, data: Dict[str, Any]) -> Optional[Question]:
        """
        Generate questions based on MongoDB structure (similar to quiz_java.py approach)
        """
        try:
            sections = data.get("sections", [])
            doc_titles = data.get("doc_titles", [])
            content_sources = data.get("content_sources", [])
            
            if not content_sources:
                return None
                
            content = random.choice(content_sources)
            section_title = content.get("sectionTitle", "")
            doc_title = content.get("docTitle", "")
            
            # Generate different types of questions
            question_types = [
                self._question_about_section_content,
                self._question_about_main_topics,
                self._question_about_subtopics,
                self._question_about_categories
            ]
            
            for question_gen in question_types:
                try:
                    question = question_gen(content, sections, doc_titles)
                    if question:
                        return question
                except Exception as e:
                    continue
                    
            # Fallback question
            if section_title:
                distractors = random.sample(sections[:3] if len(sections) > 3 else sections, 
                                          min(3, len(sections)))
                if section_title in distractors:
                    distractors.remove(section_title)
                distractors = distractors + self.generic_distractors[:3-len(distractors)]
                
                options = self._ensure_unique_options([section_title] + distractors, 4)
                try:
                    answer_index = options.index(section_title)
                except ValueError:
                    options[0] = section_title
                    answer_index = 0
                
                return Question(
                    question=f"Which section would cover fundamental concepts related to programming?",
                    options=options,
                    answer=answer_index,
                    explanation=f"The {section_title} section covers these concepts."
                )
                
        except Exception as e:
            print(f"Error generating structure-based question: {e}")
            
        return None

    def _question_about_section_content(self, content: Dict[str, Any], all_sections: List[str], doc_titles: List[str]) -> Optional[Question]:
        """Generate questions about what content belongs to which section"""
        section_title = content.get("sectionTitle")
        if not section_title:
            return None
            
        # Extract content elements
        content_elements = []
        
        if "syntax" in content:
            if isinstance(content["syntax"], list):
                content_elements.extend(content["syntax"])
            elif isinstance(content["syntax"], dict):
                for v in content["syntax"].values():
                    if isinstance(v, list):
                        content_elements.extend(v)
                    else:
                        content_elements.append(str(v))
        
        if "methods" in content and isinstance(content["methods"], list):
            content_elements.extend(content["methods"])
            
        if "types" in content and isinstance(content["types"], dict):
            for category, items in content["types"].items():
                if isinstance(items, list):
                    content_elements.extend(items)
        
        if not content_elements:
            return None
            
        correct = random.choice(content_elements)
        
        # Create distractors from other sections
        other_sections = [s for s in all_sections if s != section_title]
        if len(other_sections) >= 3:
            distractors = random.sample(other_sections, 3)
        else:
            distractors = other_sections + self.generic_distractors[:3-len(other_sections)]
        
        options = self._ensure_unique_options([section_title] + distractors, 4)
        try:
            answer_index = options.index(section_title)
        except ValueError:
            options[0] = section_title
            answer_index = 0
            
        question = f"Which section would you find information about '{correct[:100]}'?"
        explanation = f"'{correct}' is covered in the {section_title} section."
        
        return Question(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_main_topics(self, content: Dict[str, Any], all_sections: List[str], doc_titles: List[str]) -> Optional[Question]:
        """Generate questions about main topics/documents"""
        doc_title = content.get("docTitle")
        section_title = content.get("sectionTitle")
        
        if not doc_title or not section_title:
            return None
            
        # Create distractors from other documents
        other_docs = [d for d in doc_titles if d != doc_title]
        if len(other_docs) >= 3:
            distractors = random.sample(other_docs, 3)
        else:
            distractors = other_docs + self.generic_distractors[:3-len(other_docs)]
        
        options = self._ensure_unique_options([doc_title] + distractors, 4)
        try:
            answer_index = options.index(doc_title)
        except ValueError:
            options[0] = doc_title
            answer_index = 0
            
        question = f"Which main topic covers '{section_title}'?"
        explanation = f"'{section_title}' is a section under '{doc_title}'."
        
        return Question(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_subtopics(self, content: Dict[str, Any], all_sections: List[str], doc_titles: List[str]) -> Optional[Question]:
        """Generate questions about subtopics within a section"""
        section_title = content.get("sectionTitle")
        subtopics = content.get("subtopics", [])
        
        if not isinstance(subtopics, list) or not subtopics or not section_title:
            return None
            
        # Extract subtopic names
        subtopic_names = []
        for subtopic in subtopics:
            if isinstance(subtopic, dict) and "type" in subtopic:
                subtopic_names.append(subtopic["type"])
        
        if not subtopic_names:
            return None
            
        correct_subtopic = random.choice(subtopic_names)
        
        # Create distractors
        other_sections = [s for s in all_sections if s != section_title]
        distractors = random.sample(other_sections, min(3, len(other_sections)))
        
        if len(distractors) < 3:
            distractors.extend(self.generic_distractors[:3-len(distractors)])
        
        options = self._ensure_unique_options([correct_subtopic] + distractors, 4)
        try:
            answer_index = options.index(correct_subtopic)
        except ValueError:
            options[0] = correct_subtopic
            answer_index = 0
            
        question = f"Which of the following is a subtopic covered under '{section_title}'?"
        explanation = f"'{correct_subtopic}' is one of the subtopics discussed in the {section_title} section."
        
        return Question(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_categories(self, content: Dict[str, Any], all_sections: List[str], doc_titles: List[str]) -> Optional[Question]:
        """Generate questions about categories within content"""
        section_title = content.get("sectionTitle")
        categories = content.get("categories") or content.get("types")
        
        if not isinstance(categories, dict) or not categories or not section_title:
            return None
            
        category_names = list(categories.keys())
        if len(category_names) < 1:
            return None
            
        correct = random.choice(category_names)
        
        other_categories = [c for c in category_names if c != correct]
        distractors = other_categories + self.generic_distractors[:3-len(other_categories)]
        
        options = self._ensure_unique_options([correct] + distractors[:3], 4)
        try:
            answer_index = options.index(correct)
        except ValueError:
            options[0] = correct
            answer_index = 0
            
        question = f"Which category is discussed in the '{section_title}' section?"
        explanation = f"The {section_title} section covers the '{correct}' category."
        
        return Question(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    async def generate_ai_questions(self, skill: str, difficulty: str, sections: List[str], num_questions: int = 5) -> List[Question]:
        """
        Generate questions using AI based on sections from MongoDB
        """
        if not API_KEY:
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not configured")

        # Create context from sections
        sections_context = ", ".join(sections[:10])  # Limit context size
        
        system_prompt = """You are a helpful assistant specialized in generating multiple-choice questions for technical assessments. 
        Generate questions that test understanding of programming concepts and document structure.
        Each question should have exactly 4 options where the last option is the correct answer.
        Focus on practical knowledge and conceptual understanding."""
        
        user_query = f"""Generate {num_questions} unique, multiple-choice questions for a {skill} assessment at {difficulty} level.
        
        Base the questions on these topic sections: {sections_context}
        
        Each question should:
        - Have exactly 4 options
        - Make the 4th option the correct answer
        - Test practical knowledge about {skill}
        - Be at {difficulty} difficulty level
        - Focus on concepts that would be covered in these sections
        
        Return only a JSON array of questions."""

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
                response = await client.post(api_url, json=payload, timeout=60.0)
                try:
                    response.raise_for_status()
                except Exception as http_err:
                    print(f"HTTP error from Gemini API: {http_err}")
                    print(f"Response content: {response.text}")
                    raise
                generated_data = response.json()
                generated_text = generated_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if not generated_text:
                    print("Gemini API returned no text. Full response:", generated_data)
                    return []
                questions_data = json.loads(generated_text)
                questions = []
                for i, q_data in enumerate(questions_data):
                    question = Question(
                        question=q_data.get("question", f"Sample question {i+1}"),
                        options=q_data.get("options", ["Option 1", "Option 2", "Option 3", "Correct Answer"]),
                        answer=3,  # Last option is correct
                        explanation=f"This tests knowledge of {skill} concepts."
                    )
                    questions.append(question)
                return questions[:num_questions]
        except Exception as e:
            import traceback
            print(f"Error generating AI questions: {e}")
            traceback.print_exc()
            return []

    def create_fallback_questions(self, skill: str, difficulty: str, num_questions: int = 5) -> List[Question]:
        """Create fallback questions when other methods fail"""
        fallback_questions = []
        
        for i in range(num_questions):
            question = Question(
                question=f"Which concept is fundamental to {skill} programming?",
                options=["Advanced Concurrency", "Enterprise Patterns", "JVM Internals", f"{skill} Basics"],
                answer=3,
                explanation=f"Understanding {skill} basics is fundamental to programming in this language."
            )
            fallback_questions.append(question)
            
        return fallback_questions

    async def generate_enhanced_quiz(self, skill: str, difficulty: str, num_questions: int = 10) -> QuestionResponse:
        """
        Generate quiz using only Gemini API and section titles from MongoDB
        """
        try:
            # Map difficulty to level (similar to quiz_java.py)
            level_mapping = {
                "easy": "basic",
                "medium": "intermediate",
                "hard": "advanced",
                "basic": "basic",
                "intermediate": "intermediate",
                "advanced": "advanced"
            }
            level = level_mapping.get(difficulty.lower(), "basic")
            # Get section titles from MongoDB
            section_titles = self.get_sections_by_level(level)
            if not section_titles:
                raise HTTPException(status_code=404, detail="No topics found for the selected level.")
            # Generate all questions using Gemini API
            questions = await self.generate_ai_questions(skill, difficulty, section_titles, num_questions)
            return QuestionResponse(
                skill=skill,
                difficulty=difficulty,
                questions=questions[:num_questions],
                level=level,
                topic=section_titles
            )
        except Exception as e:
            print(f"Error in enhanced quiz generation: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

# Initialize the enhanced quiz generator
enhanced_quiz_generator = EnhancedQuizGenerator()

@router.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions_endpoint(request: QuestionRequest):
    """
    Endpoint that generates questions using only Gemini API and MongoDB section titles
    """
    try:
        skill = request.skill.strip()
        difficulty = request.difficulty.strip().lower()
        if difficulty not in {"easy", "medium", "hard", "basic", "intermediate", "advanced"}:
            raise HTTPException(status_code=400, detail="Invalid difficulty. Use easy, medium, hard, basic, intermediate, or advanced.")
        quiz = await enhanced_quiz_generator.generate_enhanced_quiz(
            skill=skill,
            difficulty=difficulty,
            num_questions=request.num_questions or 10
        )
        return quiz
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

@router.get("/available-levels")
async def get_available_levels():
    """Get available difficulty levels from MongoDB"""
    try:
        levels = collection.distinct("level")
        return {"levels": sorted(levels), "difficulties": ["easy", "medium", "hard", "basic", "intermediate", "advanced"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch levels: {str(e)}")

@router.get("/available-topics")
async def get_available_topics(level: Optional[str] = None):
    """Get available topics from MongoDB"""
    try:
        query: Dict[str, Any] = {}
        if level:
            # Map difficulty to level
            level_mapping = {
                "easy": "basic",
                "medium": "intermediate",
                "hard": "advanced"
            }
            mapped_level = level_mapping.get(level.lower(), level.lower())
            query["level"] = {"$regex": f"^{re.escape(mapped_level)}$", "$options": "i"}
        
        cursor = collection.find(query, {"title": 1, "sections.sectionTitle": 1})
        titles: set[str] = set()
        
        for doc in cursor:
            if (t := doc.get("title")):
                titles.add(t)
            for sec in doc.get("sections", []) or []:
                st = sec.get("sectionTitle")
                if st:
                    titles.add(st)
        
        return {"topics": sorted(titles)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch topics: {str(e)}")

@router.get("/sample-enhanced/{skill}/{difficulty}")
async def get_sample_enhanced_quiz(skill: str, difficulty: str, num_questions: int = 5):
    """Get a sample quiz using the enhanced generator"""
    try:
        request = QuestionRequest(skill=skill, difficulty=difficulty, num_questions=num_questions)
        return await generate_questions_endpoint(request)
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Failed to generate sample quiz: {str(e)}")
