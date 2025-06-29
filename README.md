# Acorn AI - Ambient Clinical Assistant

An AI-powered web application that listens to clinician-patient conversations and automatically generates structured clinical notes tailored to different medical specialties.

## Features

- **Ambient Note Generation:** Simply record the conversation; Acorn transcribes and structures it for you.
- **Specialty-Specific Templates:** Generates notes for General Medicine (SOAP), Cardiology, Psychiatry, and Dermatology.
- **Manual Entry:** Option to type or paste text for analysis.
- **Speaker Diarization (In Progress):** AI-powered identification of "Clinician" and "Patient" speakers in the transcript.
- **Secure & Private:** All processing is done in memory; no patient data is stored.
- **Easy Deployment:** Ready for deployment on Render (backend) and Vercel (frontend).

## Project Structure
```
acorn-ai/
├── frontend/                 # React + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── EncounterNotesForm.jsx # Main form for audio/text input
│   │   │   └── AnalysisResults.jsx    # Component to display results
│   │   ├── App.jsx          # Main React application component
│   │   └── index.css        # Tailwind CSS styles
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind CSS configuration
├── backend/                  # FastAPI backend
│   ├── main.py              # Main FastAPI application
│   └── requirements.txt     # Python dependencies
├── .env.example             # Environment variables template
├── README.md                # Project documentation
```

## Quick Start (Manual Setup)

#### Prerequisites

- Node.js (v16 or higher)
- Python (v3.9 or higher)
- An active OpenAI API key

#### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Set up environment variables by copying the example file:
    ```bash
    cp ../.env.example ../.env
    ```
4.  Edit the new `.env` file and add your OpenAI API key.

5.  Run the backend server:
    ```bash
    python main.py
    ```
    The backend will be available at `http://localhost:8000`.

#### Frontend Setup

1.  In a **new terminal**, navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The frontend will be available at `http://localhost:3000`.

## 🚀 Deployment

This project is optimized for deployment on Render (backend) and Vercel (frontend).

### Backend (Render)

1.  From the Render dashboard, create a **New Web Service**.
2.  Connect your GitHub repository.
3.  Use the following settings:
    *   **Name**: `acorn-backend` (or your preferred name)
    *   **Root Directory**: `backend`
    *   **Environment**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  Under **Advanced**, add your `OPENAI_API_KEY` as an environment variable.
5.  Create the service. Once deployed, copy the provided `.onrender.com` URL.

### Frontend (Vercel)

1.  From the Vercel dashboard, create a **New Project**.
2.  Import your GitHub repository.
3.  Use the following settings:
    *   **Framework Preset**: `Create React App`
    *   **Root Directory**: `frontend`
4.  Expand **Environment Variables** and add `REACT_APP_API_URL`, pasting the backend URL from Render as the value.
5.  Deploy.

## Backend API Endpoints

- `GET /`: Health check.
- `POST /transcribe/`: Takes an audio file and specialty, returns a transcribed and structured clinical note.
- `POST /analyze-text/`: Takes raw text and a specialty, returns a structured clinical note.

