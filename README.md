# Medical SOAP Note Summarizer

An AI-powered web application that helps healthcare providers analyze and summarize their SOAP notes from patient encounters using GPT technology.

## 🏗️ Project Structure

```
medical-intake-app/
├── frontend/                 # React + Tailwind CSS frontend
│   ├── src/
│   │   ├── App.jsx          # Main React application component
│   │   ├── index.js         # React entry point
│   │   ├── index.css        # Tailwind CSS + custom medical theme styles
│   │   └── components/
│   │       └── SOAPForm.jsx # SOAP note input form component
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

## 📋 Features

### Current Features
- ✅ SOAP note input form with all four sections (Subjective, Objective, Assessment, Plan)
- ✅ AI-powered analysis of SOAP notes using GPT-4
- ✅ Structured output with key findings, critical points, and follow-up priorities
- ✅ Clinical impressions and evidence-based recommendations
- ✅ Provider-focused interface and terminology
- ✅ Responsive design optimized for clinical workflow
- ✅ Accessibility features for healthcare environments

### Planned Features
- [ ] SOAP note templates and common phrases
- [ ] Integration with EHR systems
- [ ] Batch processing of multiple encounters
- [ ] Clinical decision support alerts
- [ ] Export functionality for medical records
- [ ] User authentication and encounter history
- [ ] Specialty-specific SOAP analysis (cardiology, pediatrics, etc.)

## 🛠️ Development

### Backend API Endpoints

- `GET /`: Health check
- `POST /analyze-soap`: Analyze SOAP notes and generate clinical summary

### Frontend Components

- Main application layout
- SOAP note input form with four sections
- Clinical analysis results display
- Loading states and error handling

## 📝 Development Progress

### Completed Steps
- [x] **Step 1**: Project scaffolding and setup
- [x] **Step 2**: Frontend React app with Tailwind CSS
- [x] **Step 3**: FastAPI backend with OpenAI integration
- [x] **Step 4**: Basic frontend-backend connection
- [x] **Step 5**: SOAP note input form with validation
- [x] **Step 6**: OpenAI integration for SOAP analysis

### Next Steps
- [ ] **Step 7**: Enhanced results display with clinical insights
- [ ] **Step 8**: Advanced features (templates, EHR integration)
- [ ] **Step 9**: Testing and quality assurance
- [ ] **Step 10**: Deployment preparation

## 🏥 SOAP Note Format

The application follows the standard SOAP note format:

- **Subjective**: Patient-reported symptoms, history, and subjective information
- **Objective**: Measurable, observable findings from examination and tests
- **Assessment**: Clinical interpretation and diagnostic reasoning
- **Plan**: Treatment plan, interventions, and follow-up recommendations

## ⚠️ Disclaimer

This application is designed for clinical decision support and should be used in conjunction with professional medical judgment. It is not a substitute for clinical expertise or professional medical practice. Always verify AI-generated insights against clinical guidelines and best practices.

## 📄 License

This project is licensed under the MIT License.