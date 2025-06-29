# Medical SOAP Note Summarizer - Backend FastAPI Application
# This file will contain the main FastAPI application and API endpoints

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI
import json
import logging
import traceback
from io import BytesIO
import openai

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure OpenAI
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize FastAPI app
app = FastAPI(
    title="Medical SOAP Note Summarizer API",
    description="AI-powered SOAP note summarization for healthcare providers",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
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

class Specialty(str, Enum):
    DEFAULT = "Default"
    CARDIOLOGY = "Cardiology"
    PSYCHIATRY = "Psychiatry"
    DERMATOLOGY = "Dermatology"

TEMPLATES = {
    Specialty.DEFAULT: {
        "subjective": "Patient's reported symptoms, history, and concerns.",
        "objective": "Observable findings, vital signs, physical exam, lab results.",
        "assessment": "Differential diagnoses and clinical reasoning.",
        "plan": "Treatment plan, medications, follow-up, referrals.",
        "key_findings": "Summary of the most important clinical findings.",
        "cdi_codes": ["List of relevant ICD-10 codes with descriptions."],
        "next_steps": ["List of actionable next steps for the clinician."]
    },
    Specialty.CARDIOLOGY: {
        "subjective": "Chief Complaint, HPI, Past Cardiac History, Cardiac Risk Factors (Hypertension, Diabetes, etc.), Review of Systems.",
        "objective": "Vitals, Physical Exam (Cardiovascular focus: JVP, heart sounds, edema), EKG Findings, Lab Results (Troponin, etc.).",
        "assessment": "Primary cardiac diagnosis (e.g., Acute Coronary Syndrome, Atrial Fibrillation).",
        "plan": "Medications (e.g., DAPT, GDMT), Planned Procedures (e.g., Cardiac Catheterization), Follow-up plan.",
        "critical_points": ["List of critical findings requiring immediate attention."],
        "cdi_codes": ["List of relevant ICD-10 codes for cardiac conditions."],
        "next_steps": ["List of cardiology-specific next steps (e.g., 'Schedule Stress Test')."]
    },
    Specialty.PSYCHIATRY: {
        "subjective": "Chief Complaint, HPI, Past Psychiatric History, Psychiatric ROS, Substance Use History.",
        "objective": "Mental Status Exam (MSE: Appearance, Behavior, Speech, Mood, Affect, Thought Process), Physical Exam Findings, Diagnostic scales (e.g., PHQ-9).",
        "assessment": "DSM-5 Diagnosis, Differential Diagnosis, Risk Assessment (Suicide/Homicide risk).",
        "plan": "Medication Plan, Therapy Recommendations (e.g., CBT, DBT), Safety Plan, Follow-up.",
        "critical_points": ["List of critical findings, especially related to risk assessment."],
        "cdi_codes": ["List of relevant DSM-5 and ICD-10 codes."],
        "next_steps": ["List of psychiatry-specific next steps (e.g., 'Refer for weekly therapy')."]
    },
    Specialty.DERMATOLOGY: {
        "subjective": "Chief Complaint (e.g., 'new rash'), HPI (location, duration, symptoms like itching/pain), Past Dermatologic History.",
        "objective": "Physical Exam (detailed description of lesions: type, morphology, distribution), Diagnostic Tests (e.g., Biopsy results, KOH prep).",
        "assessment": "Primary Diagnosis (e.g., Atopic Dermatitis, Psoriasis), Differential Diagnosis.",
        "plan": "Topical medications, Oral medications, Procedures (e.g., Cryotherapy), Patient Education, Follow-up.",
        "key_findings": "Summary of the most important dermatological findings.",
        "cdi_codes": ["List of relevant ICD-10 codes for skin conditions."],
        "next_steps": ["List of dermatology-specific next steps (e.g., 'Schedule biopsy')."]
    }
}

class TextAnalysisRequest(BaseModel):
    notes: str
    specialty: Specialty = Specialty.DEFAULT

class SOAPAnalysisResponse(BaseModel):
    """Model for AI-generated SOAP analysis response"""
    analysis: dict
    transcription: Optional[str] = None
    disclaimer: str = "This analysis is for clinical decision support only and should not replace professional medical judgment."

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Acorn AI API is running"}

@app.post("/transcribe/", response_model=SOAPAnalysisResponse)
async def transcribe_and_analyze(
    file: UploadFile = File(...),
    specialty: Specialty = Specialty.DEFAULT
):
    """
    Transcribes audio and generates a structured SOAP note based on the
    selected medical specialty.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No audio file sent.")

    # 1. Transcription Block
    try:
        audio_data = await file.read()

        transcription_response = await client.audio.transcriptions.create(
            model="whisper-1",
            file=(file.filename, audio_data, file.content_type)
        )
        
        # The API returns a Transcription object; we need its .text attribute
        transcription_text = transcription_response.text
        logger.info("Successfully transcribed audio.")

    except Exception as e:
        logger.error("❌ Error during Whisper transcription:\n" + traceback.format_exc())
        raise HTTPException(status_code=500, detail="Error during audio transcription.")

    # 2. Note Generation Block
    try:
        analysis_json = await generate_note_from_text(transcription_text, specialty)
        logger.info("Successfully generated clinical note.")
        return SOAPAnalysisResponse(
            analysis=analysis_json,
            transcription=transcription_text
        )

    except Exception as e:
        logger.error("❌ Error generating clinical note from transcription:\n" + traceback.format_exc())
        raise HTTPException(status_code=500, detail="Error generating clinical note.")

@app.post("/analyze-text/", response_model=SOAPAnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """
    Generates a structured SOAP note from text based on the selected medical specialty.
    """
    try:
        logger.info(f"Generating note from text for specialty: {request.specialty.value}")
        analysis_json = await generate_note_from_text(request.notes, request.specialty)
        return SOAPAnalysisResponse(analysis=analysis_json)
    except Exception as e:
        logger.error("❌ Error generating clinical note from text:\n" + traceback.format_exc())
        raise HTTPException(status_code=500, detail="An unexpected error occurred during text analysis.")

async def generate_note_from_text(text: str, specialty: Specialty):
    """Helper function to generate a note from text using OpenAI."""
    template = TEMPLATES.get(specialty, TEMPLATES[Specialty.DEFAULT])
    prompt = f"""
You are an expert medical AI assistant. Based on the following clinical text,
please generate a structured clinical note in JSON format for the specialty: {specialty.value}.

Clinical Text:
"{text}"

Use the following JSON structure as a template:
{json.dumps(template, indent=4)}

Guidelines:
1.  Populate the JSON with information extracted from the text.
2.  If information for a field is not available, use an empty string "" or an empty list [].
3.  Respond ONLY with the populated JSON object.
"""

    logger.info(f"Generating SOAP note for specialty: {specialty.value}")
    analysis_response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a highly skilled medical scribe AI."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=2000,
    )

    ai_response_content = analysis_response.choices[0].message.content.strip()
    
    try:
        analysis_json = json.loads(ai_response_content)
        logger.info("Successfully parsed OpenAI analysis response.")
        return analysis_json
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response as JSON: {e}")
        logger.error(f"Raw AI response: {ai_response_content}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 