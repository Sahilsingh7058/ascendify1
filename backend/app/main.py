from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from quiz_gen import router as quiz_gen_router
from quiz_ml import router as quiz_ml_router
from quiz_cloud import router as quiz_gen_cloud_router
from quiz_gen2 import router as quiz_router
app = FastAPI()

# CORS setup (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(quiz_router)
# Register routers for all quiz types
app.include_router(quiz_gen_router)
app.include_router(quiz_ml_router)
app.include_router(quiz_gen_cloud_router)
app.include_router(quiz_router)
# MongoDB connection
client = MongoClient("mongodb+srv://rasikathakur303_db_user:ycHpj7gTS45vPSTA@career-assessment-roadm.gsqeija.mongodb.net/?retryWrites=true&w=majority&appName=career-assessment-roadmap")
db = client["career_assessment_roadmap"]
collection = db["roadmap_java"]
collection2 = db["roadmap_ml"]
collection3 = db["roadmap_cloud"]


# Helper to convert ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.get("/api/java-course")
def get_java_course():
    docs = list(collection.find())
    return [serialize_doc(doc) for doc in docs]

@app.get("/api/ml-course")
def get_ml_course():
    docs = list(collection2.find())
    return [serialize_doc(doc) for doc in docs]

@app.get("/api/cloud-course")
def get_cloud_course():
    docs = list(collection3.find())
    return [serialize_doc(doc) for doc in docs]

@app.get("/")
def read_root():
    return {
        "message": "Course API", 
        "endpoints": {
            "course": "/api/java-course",
            "ml_course": "/api/ml-course",
            "cloud_course": "/api/cloud-course",
            "quiz_generate": "/api/quiz/generate",
            "quiz_levels": "/api/quiz/levels",
            "quiz_topics": "/api/quiz/topics",
            "sample_quiz": "/api/quiz/sample/{level}",
            "generate_questions": "/api/quiz/generate-questions",
            "generate_questions_ml": "/api/quiz/ml/generate-questions",
            "generate_questions_cloud": "/api/quiz/cloud/generate-questions",
            "generate_questions_assessment": "/api/quiz/assessment/generate-questions"
             
        }
    }