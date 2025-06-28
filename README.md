# Medical Intake Summarizer

An AI-powered web application that analyzes user symptoms and generates structured medical summaries using GPT technology.

## 🏗️ Project Structure

```
medical-intake-app/
├── frontend/                 # React + Tailwind CSS frontend
│   ├── src/
│   │   ├── App.jsx          # Main React application component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Tailwind CSS + custom medical theme styles
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind CSS configuration
├── backend/                  # FastAPI backend
│   ├── main.py              # Main FastAPI application
│   └── requirements.txt     # Python dependencies
├── .env.example             # Environment variables template
├── setup.sh                 # Automated setup script
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. Edit the `.env` file with your OpenAI API key:
   ```bash
   # Copy from example and add your API key
   cp .env.example .env
   # Edit .env file with your OpenAI API key
   ```

3. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   conda activate note_summarizer
   cd backend && python main.py
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

### Option 2: Manual Setup

#### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Conda (for environment management)
- OpenAI API key

#### Backend Setup

1. Create and activate conda environment:
   ```bash
   conda create -n note_summarizer python=3.11 -y
   conda activate note_summarizer
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp ../.env.example ../.env
   # Edit .env file with your OpenAI API key
   ```

5. Run the backend server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: GPT model to use (gpt-4 or gpt-3.5-turbo)
- `BACKEND_PORT`: Backend server port (default: 8000)
- `REACT_APP_API_URL`: Backend API URL for frontend

### Conda Environment

The project uses a dedicated conda environment called `note_summarizer` to isolate dependencies:

- **Activate**: `conda activate note_summarizer`
- **Deactivate**: `conda deactivate`
- **Remove**: `conda env remove -n note_summarizer`

## 📋 Features (Planned)

- [ ] Symptom input form with natural language processing
- [ ] AI-powered medical analysis using GPT
- [ ] Structured medical summary generation
- [ ] Potential condition identification
- [ ] Severity assessment
- [ ] Medical recommendations
- [ ] Responsive design with medical theme
- [ ] User authentication and history
- [ ] Export functionality for medical records

## 🛠️ Development

### Backend API Endpoints

- `GET /`: Health check
- `POST /analyze-symptoms`: Analyze symptoms and generate medical summary

### Frontend Components

- Main application layout
- Symptom input form
- Medical summary display
- Loading states and error handling

## 📝 TODO

- [ ] Implement GPT API integration
- [ ] Add proper error handling
- [ ] Implement rate limiting
- [ ] Add user authentication
- [ ] Create comprehensive test suite
- [ ] Add logging and monitoring
- [ ] Implement security measures
- [ ] Add database for user data persistence

## ⚠️ Disclaimer

This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## 📄 License

This project is licensed under the MIT License.