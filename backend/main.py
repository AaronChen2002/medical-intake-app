# Medical Intake Summarizer - Backend FastAPI Application
# This file will contain the main FastAPI application and API endpoints

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize FastAPI app
app = FastAPI(
    title="Medical Intake Summarizer API",
    description="AI-powered medical symptom analysis and summary generation",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class SymptomRequest(BaseModel):
    """Model for incoming symptom data from frontend"""
    symptoms: str
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    additional_notes: Optional[str] = None

class MedicalSummaryResponse(BaseModel):
    """Model for AI-generated medical summary response"""
    summary: str
    potential_conditions: list[str]
    severity_level: str
    recommendations: list[str]
    disclaimer: str

# API Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Medical Intake Summarizer API is running"}

@app.post("/analyze-symptoms", response_model=MedicalSummaryResponse)
async def analyze_symptoms(request: SymptomRequest):
    """
    Main endpoint for analyzing symptoms and generating medical summary
    TODO: Integrate with GPT API for symptom analysis
    TODO: Add proper error handling and validation
    TODO: Implement rate limiting and security measures
    """
    try:
        # TODO: Call GPT API with symptoms
        # TODO: Parse and structure the response
        # TODO: Return formatted medical summary
        
        # Placeholder response
        return MedicalSummaryResponse(
            summary="AI-generated medical summary will appear here",
            potential_conditions=["Condition 1", "Condition 2"],
            severity_level="moderate",
            recommendations=["Recommendation 1", "Recommendation 2"],
            disclaimer="This is not a substitute for professional medical advice"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 