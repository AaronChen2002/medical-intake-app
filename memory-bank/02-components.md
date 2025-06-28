# 02 - Key Components & Features

This file outlines the most important code components and user-facing features of the application.

## Frontend Components (`frontend/src/components/`)

### `EncounterNotesForm.jsx`
- **Purpose:** The primary user input interface.
- **Features:**
    - A large textarea for entering unstructured encounter notes.
    - Optional fields for patient demographics (age, gender) and additional context.
    - A "Load Example" button to demonstrate functionality to new users.
    - A "Clear" button to reset the form.
    - Autofocus on the main textarea when the page loads.
    - The submit button is dynamically disabled if the notes field is empty.

### `AnalysisResults.jsx`
- **Purpose:** Displays the structured output from the AI analysis.
- **Features:**
    - Replaces the input form upon successful analysis, creating a two-step "input -> review" workflow.
    - A tabbed interface to organize the results into:
        1.  SOAP Structure (Subjective, Objective, Assessment, Plan)
        2.  Clinical Analysis (Key Findings, Critical Points, etc.)
        3.  ICD-10 Codes
        4.  Next Steps
    - "Copy to Clipboard" functionality for each individual section and for the entire report.
    - A "Start New Note" button to reset the application state and return to the form.

## Backend Endpoint (`backend/main.py`)

### `POST /analyze-soap`
- **Purpose:** The single, core API endpoint for the application.
- **Functionality:**
    - Accepts a JSON object containing the raw `encounter_notes` and any optional context.
    - Constructs a detailed prompt for the OpenAI GPT-4 model, instructing it to analyze the text and return a structured JSON response.
    - The Pydantic response model (`SOAPAnalysisResponse`) is configured with default values, making the API resilient to incomplete AI outputs.
    - Returns the structured analysis back to the frontend. 