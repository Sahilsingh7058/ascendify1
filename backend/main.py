from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from quiz_java import router as quiz_router

app = FastAPI()

# CORS setup (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(quiz_router)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["career_assessment_roadmap"]
collection = db["roadmap_java"]

# Helper to convert ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.get("/api/java-course")
def get_java_course():
    docs = list(collection.find())
    return [serialize_doc(doc) for doc in docs]

@app.get("/")
def read_root():
    return {
        "message": "Java Course API", 
        "endpoints": {
            "course": "/api/java-course",
            "quiz_generate": "/api/quiz/generate",
            "quiz_levels": "/api/quiz/levels",
            "quiz_topics": "/api/quiz/topics",
            "sample_quiz": "/api/quiz/sample/{level}"
        }
    }