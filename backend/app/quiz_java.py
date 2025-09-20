from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import re
from pymongo import MongoClient

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

client = MongoClient("mongodb://localhost:27017/")
db = client["career_assessment_roadmap"]
collection = db["roadmap_java"]

class QuizRequest(BaseModel):
    level: str
    num_questions: Optional[int] = 5
    topic: Optional[str] = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: int
    explanation: Optional[str] = None

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]
    level: str
    topic: Optional[str] = None

def _truncate(text: str, max_len: int = 180) -> str:
    if not isinstance(text, str):
        return str(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text if len(text) <= max_len else text[: max_len - 1].rstrip() + "…"

def _ensure_unique_options(options: List[str], desired: int = 4) -> List[str]:
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

def _maybe_list(value: Any) -> List[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v) for v in value]
    if isinstance(value, dict):
        out: List[str] = []
        for v in value.values():
            if isinstance(v, list):
                out.extend([str(x) for x in v])
            else:
                out.append(str(v))
        return out
    return [str(value)]

class AIQuizGenerator:
    def __init__(self) -> None:
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

    def _question_about_section_content(self, section_title: str, content: Dict[str, Any], all_sections: List[str]) -> Optional[QuizQuestion]:
        """Generate questions asking what content belongs to which section"""
        # Get the actual content elements from this section
        content_elements = []
        
        # Extract meaningful content pieces
        if "syntax" in content:
            syntax_items = _maybe_list(content["syntax"])
            content_elements.extend(syntax_items)
        
        if "methods" in content and isinstance(content["methods"], list):
            content_elements.extend(content["methods"])
            
        if "types" in content and isinstance(content["types"], dict):
            for category, items in content["types"].items():
                if isinstance(items, list):
                    content_elements.extend(items)
                    
        if "categories" in content and isinstance(content["categories"], dict):
            for category, items in content["categories"].items():
                if isinstance(items, list):
                    content_elements.extend(items)
        
        # Look for subtopics
        if "subtopics" in content and isinstance(content["subtopics"], list):
            for subtopic in content["subtopics"]:
                if isinstance(subtopic, dict) and "type" in subtopic:
                    content_elements.append(subtopic["type"])
        
        if not content_elements:
            return None
            
        correct = random.choice(content_elements)
        
        # Create distractors from other sections
        other_sections = [s for s in all_sections if s != section_title]
        if len(other_sections) >= 3:
            distractors = random.sample(other_sections, 3)
        else:
            distractors = other_sections + self.generic_distractors[:3-len(other_sections)]
        
        options = _ensure_unique_options([section_title] + distractors, 4)
        try:
            answer_index = options.index(section_title)
        except ValueError:
            options[0] = section_title
            answer_index = 0
            
        question = f"Which section would you find information about '{_truncate(correct, 100)}'?"
        explanation = f"'{correct}' is covered in the {section_title} section."
        
        return QuizQuestion(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_main_topics(self, doc_title: str, section_titles: List[str], all_doc_titles: List[str]) -> Optional[QuizQuestion]:
        """Generate questions asking which topics belong to which main document"""
        if len(section_titles) < 1:
            return None
            
        correct_section = random.choice(section_titles)
        
        # Create distractors from other documents
        other_docs = [d for d in all_doc_titles if d != doc_title]
        if len(other_docs) >= 3:
            distractors = random.sample(other_docs, 3)
        else:
            distractors = other_docs + self.generic_distractors[:3-len(other_docs)]
        
        options = _ensure_unique_options([doc_title] + distractors, 4)
        try:
            answer_index = options.index(doc_title)
        except ValueError:
            options[0] = doc_title
            answer_index = 0
            
        question = f"Which main topic covers '{correct_section}'?"
        explanation = f"'{correct_section}' is a section under '{doc_title}'."
        
        return QuizQuestion(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_subtopics(self, section_title: str, content: Dict[str, Any], all_sections: List[str]) -> Optional[QuizQuestion]:
        """Generate questions about subtopics within a section"""
        subtopics = content.get("subtopics", [])
        if not isinstance(subtopics, list) or not subtopics:
            return None
            
        # Extract subtopic types/names
        subtopic_names = []
        for subtopic in subtopics:
            if isinstance(subtopic, dict) and "type" in subtopic:
                subtopic_names.append(subtopic["type"])
        
        if not subtopic_names:
            return None
            
        correct_subtopic = random.choice(subtopic_names)
        
        # Create distractors from other sections or generic terms
        other_sections = [s for s in all_sections if s != section_title]
        distractors = random.sample(other_sections, min(3, len(other_sections)))
        
        if len(distractors) < 3:
            distractors.extend(self.generic_distractors[:3-len(distractors)])
        
        options = _ensure_unique_options([correct_subtopic] + distractors, 4)
        try:
            answer_index = options.index(correct_subtopic)
        except ValueError:
            options[0] = correct_subtopic
            answer_index = 0
            
        question = f"Which of the following is a subtopic covered under '{section_title}'?"
        explanation = f"'{correct_subtopic}' is one of the subtopics discussed in the {section_title} section."
        
        return QuizQuestion(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_section_order(self, doc_title: str, sections: List[Dict[str, Any]]) -> Optional[QuizQuestion]:
        """Generate questions about the order or sequence of sections"""
        if len(sections) < 2:
            return None
            
        section_titles = [s.get("sectionTitle") for s in sections if s.get("sectionTitle")]
        if len(section_titles) < 2:
            return None
        
        # Pick a section and ask what comes before/after
        target_idx = random.randint(0, len(section_titles) - 1)
        target_section = section_titles[target_idx]
        
        if target_idx == 0:
            # First section - ask what comes after
            if len(section_titles) > 1:
                correct = section_titles[1]
                question = f"In '{doc_title}', which section typically comes after '{target_section}'?"
        elif target_idx == len(section_titles) - 1:
            # Last section - ask what comes before
            correct = section_titles[-2]
            question = f"In '{doc_title}', which section typically comes before '{target_section}'?"
        else:
            # Middle section - randomly pick before or after
            if random.choice([True, False]):
                correct = section_titles[target_idx + 1]
                question = f"In '{doc_title}', which section typically comes after '{target_section}'?"
            else:
                correct = section_titles[target_idx - 1]
                question = f"In '{doc_title}', which section typically comes before '{target_section}'?"
        
        # Create distractors from other sections
        other_sections = [s for s in section_titles if s != correct and s != target_section]
        distractors = random.sample(other_sections, min(3, len(other_sections)))
        
        if len(distractors) < 3:
            distractors.extend(self.generic_distractors[:3-len(distractors)])
        
        options = _ensure_unique_options([correct] + distractors, 4)
        try:
            answer_index = options.index(correct)
        except ValueError:
            options[0] = correct
            answer_index = 0
            
        explanation = f"In the learning sequence for {doc_title}, {correct} follows the described order."
        
        return QuizQuestion(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def _question_about_categories(self, section_title: str, content: Dict[str, Any]) -> Optional[QuizQuestion]:
        """Generate questions about categories within content"""
        categories = content.get("categories") or content.get("types")
        if not isinstance(categories, dict) or not categories:
            return None
            
        category_names = list(categories.keys())
        if len(category_names) < 2:
            return None
            
        # Pick a category and ask about it
        target_category = random.choice(category_names)
        
        question = f"In '{section_title}', which category includes items like data types, operators, or control structures?"
        
        # If we have specific categories, use them
        if any(cat.lower() in ["primitive", "operators", "control"] for cat in category_names):
            correct = target_category
        else:
            correct = target_category
            
        other_categories = [c for c in category_names if c != correct]
        distractors = other_categories + self.generic_distractors[:3-len(other_categories)]
        
        options = _ensure_unique_options([correct] + distractors[:3], 4)
        try:
            answer_index = options.index(correct)
        except ValueError:
            options[0] = correct
            answer_index = 0
            
        question = f"Which category is discussed in the '{section_title}' section?"
        explanation = f"The {section_title} section covers the '{correct}' category."
        
        return QuizQuestion(
            question=question,
            options=options,
            answer=answer_index,
            explanation=explanation
        )

    def generate_question_from_content(self, content: Dict[str, Any], level: str, all_sections: List[str], all_doc_titles: List[str]) -> Optional[QuizQuestion]:
        """Generate questions focused on titles, subtitles, and document structure"""
        try:
            section_title = content.get("sectionTitle", "")
            doc_title = content.get("docTitle", "")
            
            # Priority order for question generation
            question_generators = [
                lambda: self._question_about_section_content(section_title, content, all_sections),
                lambda: self._question_about_subtopics(section_title, content, all_sections),
                lambda: self._question_about_categories(section_title, content),
                lambda: self._question_about_main_topics(doc_title, [section_title], all_doc_titles) if doc_title else None,
            ]
            
            # Try each generator
            for generator in question_generators:
                try:
                    question = generator()
                    if question:
                        return question
                except Exception as e:
                    continue
            
            # Fallback question about the section itself
            if section_title:
                distractors = random.sample(all_sections[:3] if len(all_sections) > 3 else all_sections, min(3, len(all_sections)))
                if section_title in distractors:
                    distractors.remove(section_title)
                distractors = distractors + self.generic_distractors[:3-len(distractors)]
                
                options = _ensure_unique_options([section_title] + distractors, 4)
                try:
                    answer_index = options.index(section_title)
                except ValueError:
                    options[0] = section_title
                    answer_index = 0
                
                return QuizQuestion(
                    question=f"Which section covers fundamental programming concepts in Java?",
                    options=options,
                    answer=answer_index,
                    explanation=f"The {section_title} section covers these fundamental concepts."
                )
                
        except Exception as e:
            print(f"Error generating question: {e}")
            
        return None

    def create_fallback_question(self, level: str) -> QuizQuestion:
        fallback_questions = {
            "basic": {
                "question": "Which section typically covers the fundamentals of Java programming?",
                "options": ["Java Introduction", "Advanced Concurrency", "Enterprise Patterns", "JVM Internals"],
                "answer": 0,
                "explanation": "Java Introduction section covers the basic concepts and fundamentals."
            },
            "intermediate": {
                "question": "Which topic area would cover object-oriented programming concepts?",
                "options": ["Classes and Objects", "Network Programming", "Database Integration", "Performance Tuning"],
                "answer": 0,
                "explanation": "Classes and Objects section covers object-oriented programming fundamentals."
            },
            "advanced": {
                "question": "Which section would discuss memory management and garbage collection?",
                "options": ["JVM and Memory Management", "Basic Syntax", "Hello World", "Variable Declaration"],
                "answer": 0,
                "explanation": "JVM and Memory Management section covers advanced memory concepts."
            }
        }
        
        fallback = fallback_questions.get(level, fallback_questions["basic"])
        return QuizQuestion(**fallback)

    def generate_quiz(self, level: str, num_questions: int = 5, topic: Optional[str] = None) -> QuizResponse:
        query: Dict[str, Any] = {"level": {"$regex": f"^{re.escape(level)}$", "$options": "i"}}
        if topic:
            topic_regex = {"$regex": topic, "$options": "i"}
            query["$or"] = [{"title": topic_regex}, {"sections.sectionTitle": topic_regex}]

        docs = list(collection.find(query))
        if not docs:
            raise HTTPException(status_code=404, detail=f"No content found for level: {level}")

        # Collect all section titles and document titles for better question generation
        all_sections = []
        all_doc_titles = []
        content_sources: List[Dict[str, Any]] = []

        for doc in docs:
            doc_title = doc.get("title")
            if doc_title:
                all_doc_titles.append(doc_title)
                
            for section in doc.get("sections", []) or []:
                section_title = section.get("sectionTitle")
                if section_title:
                    all_sections.append(section_title)
                    
                merged: Dict[str, Any] = {}
                merged.update(section.get("content", {}))
                merged["sectionTitle"] = section_title
                merged["docTitle"] = doc_title
                content_sources.append(merged)

        if not content_sources:
            raise HTTPException(status_code=404, detail="No section content available to generate questions")

        questions: List[QuizQuestion] = []
        seen_questions = set()
        attempts = 0
        max_attempts = max(20, num_questions * 8)  # More attempts for better quality

        while len(questions) < num_questions and attempts < max_attempts:
            content = random.choice(content_sources)
            q = self.generate_question_from_content(content, level, all_sections, all_doc_titles)
            
            if q and q.question not in seen_questions:
                questions.append(q)
                seen_questions.add(q.question)
            attempts += 1

        # Fill remaining slots with fallback questions
        while len(questions) < num_questions:
            questions.append(self.create_fallback_question(level))

        return QuizResponse(questions=questions[:num_questions], level=level, topic=topic)

quiz_generator = AIQuizGenerator()

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        level = request.level.strip().lower()
        if level not in {"basic", "intermediate", "advanced"}:
            raise HTTPException(status_code=400, detail="Invalid level. Use basic, intermediate, or advanced.")
        
        quiz = quiz_generator.generate_quiz(
            level=level, 
            num_questions=request.num_questions or 5, 
            topic=request.topic
        )
        return quiz
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.get("/levels")
async def get_available_levels():
    try:
        levels = collection.distinct("level")
        return {"levels": sorted(levels)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch levels: {str(e)}")

@router.get("/topics")
async def get_available_topics(level: Optional[str] = None):
    try:
        query: Dict[str, Any] = {}
        if level:
            query["level"] = {"$regex": f"^{re.escape(level)}$", "$options": "i"}
        
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

@router.get("/sample/{level}")
async def get_sample_quiz(level: str, num_questions: int = 3):
    try:
        request = QuizRequest(level=level, num_questions=num_questions)
        return await generate_quiz(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate sample quiz: {str(e)}")