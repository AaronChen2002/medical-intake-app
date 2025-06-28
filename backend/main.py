# Medical SOAP Note Summarizer - Backend FastAPI Application
# This file will contain the main FastAPI application and API endpoints

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
import logging
import openai

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize FastAPI app
app = FastAPI(
    title="Medical SOAP Note Summarizer API",
    description="AI-powered SOAP note summarization for healthcare providers",
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
class EncounterNotesRequest(BaseModel):
    """Model for incoming encounter notes from provider"""
    encounter_notes: str
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    additional_context: Optional[str] = None

class SOAPAnalysisResponse(BaseModel):
    """Model for AI-generated SOAP analysis response"""
    subjective: str = ""
    objective: str = ""
    assessment: str = ""
    plan: str = ""
    key_findings: str = ""
    critical_points: List[str] = Field(default_factory=list)
    clinical_impressions: str = ""
    cdi_codes: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)
    follow_up_priorities: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    disclaimer: str = "This analysis is for clinical decision support only and should not replace professional medical judgment."

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Medical SOAP Note Summarizer API is running"}

@app.post("/analyze-soap", response_model=SOAPAnalysisResponse)
async def analyze_soap_notes(request: EncounterNotesRequest):
    """
    Analyze natural encounter notes and structure them into SOAP format
    with clinical insights, CDI codes, and next steps recommendations.
    """
    try:
        # Build context for the AI
        context_parts = [f"Encounter Notes: {request.encounter_notes}"]
        
        if request.patient_age:
            context_parts.append(f"Patient Age: {request.patient_age}")
        if request.patient_gender:
            context_parts.append(f"Patient Gender: {request.patient_gender}")
        if request.additional_context:
            context_parts.append(f"Additional Context: {request.additional_context}")
        
        context = "\n".join(context_parts)
        
        # Create the prompt for comprehensive SOAP analysis
        prompt = f"""
You are an expert medical AI assistant. Analyze the following encounter notes and provide a comprehensive SOAP note structure along with clinical insights, ICD-10 codes, and next steps.

{context}

Please provide your response in the following JSON format:
{{
    "subjective": "Patient's reported symptoms, history, and concerns",
    "objective": "Observable findings, vital signs, physical exam, lab results",
    "assessment": "Differential diagnoses and clinical reasoning",
    "plan": "Treatment plan, medications, follow-up, referrals",
    "key_findings": "Summary of most important clinical findings",
    "critical_points": [
        "Critical point 1",
        "Critical point 2",
        "Critical point 3"
    ],
    "clinical_impressions": "Overall clinical assessment and impressions",
    "cdi_codes": [
        "ICD-10 code 1 - Description",
        "ICD-10 code 2 - Description",
        "ICD-10 code 3 - Description"
    ],
    "next_steps": [
        "Immediate next step 1",
        "Immediate next step 2",
        "Immediate next step 3"
    ],
    "follow_up_priorities": [
        "Follow-up priority 1",
        "Follow-up priority 2",
        "Follow-up priority 3"
    ],
    "recommendations": [
        "General recommendation 1",
        "General recommendation 2",
        "General recommendation 3"
    ],
    "disclaimer": "This analysis is for clinical decision support only and should not replace professional medical judgment. Always verify all information and consult with appropriate specialists as needed."
}}

Guidelines:
1. Be thorough but concise in each section
2. Include relevant ICD-10 codes for conditions mentioned
3. Provide actionable next steps for the clinician
4. Highlight any critical findings that require immediate attention
5. Consider patient demographics in your assessment
6. Focus on evidence-based recommendations
7. Ensure all medical information is accurate and appropriate
8. IMPORTANT: If no information is available for a field, return an empty string ("") for text fields or an empty list ([]) for list fields. Do not omit any keys from the final JSON structure.

Respond only with the JSON object, no additional text.
"""

        # Call OpenAI API
        logger.info("Calling OpenAI API for SOAP analysis...")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert medical AI assistant specializing in SOAP note analysis and clinical documentation improvement."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        # Extract the response content
        ai_response = response.choices[0].message.content.strip()
        
        # Parse the JSON response
        try:
            result = json.loads(ai_response)
            
            logger.info("Successfully parsed OpenAI SOAP analysis response")
            return SOAPAnalysisResponse(**result)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response as JSON: {e}")
            logger.error(f"Raw response: {ai_response}")
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Invalid response format: {str(e)}")
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/transcribe-audio")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No audio file sent.")

    try:
        # The whisper API requires a file-like object with a name.
        # We pass the UploadFile directly, but we need to ensure it has a name.
        # FastAPI's UploadFile has a 'filename' attribute.
        audio_data = file.file
        
        # Call the OpenAI Audio API for transcription
        transcription_response = client.audio.transcriptions.create(
            model="whisper-1",
            file=(file.filename, audio_data, file.content_type)
        )
        
        transcription_text = transcription_response.text
        return {"transcription": transcription_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to transcribe audio: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 