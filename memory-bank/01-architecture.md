# 01 - Architecture & Tech Stack

This project is a modern full-stack web application with a decoupled frontend and backend.

## Frontend
- **Framework:** React (using Create React App)
- **Styling:** Tailwind CSS
- **Language:** JavaScript (JSX)
- **Key Libraries:**
    - `axios` for API communication.
- **Deployment Host:** Vercel

## Backend
- **Framework:** FastAPI
- **Language:** Python 3.11
- **Key Libraries:**
    - `openai` for interacting with the GPT-4 API.
    - `pydantic` for data validation and serialization.
    - `gunicorn` as the production web server.
    - `python-dotenv` for environment variable management.
- **Deployment Host:** Render

## Communication
- The React frontend makes asynchronous API calls to the FastAPI backend.
- The backend URL is managed via a `REACT_APP_API_URL` environment variable on Vercel, allowing for easy switching between local development and the live production API.
- All data is exchanged in JSON format. 