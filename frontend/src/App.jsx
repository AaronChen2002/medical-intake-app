// Medical SOAP Note Summarizer - Frontend React App
// This file will contain the main React application component

import React, { useState } from 'react';
import EncounterNotesForm from './components/EncounterNotesForm';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('Submitting encounter notes:', formData);
      
      // Call the backend API
      const response = await axios.post('http://localhost:8000/analyze-soap', {
        encounter_notes: formData.encounterNotes,
        patient_age: formData.patientAge ? parseInt(formData.patientAge) : null,
        patient_gender: formData.patientGender || null,
        additional_context: formData.additionalContext || null
      });
      
      console.log('API response:', response.data);
      setAnalysisResult(response.data);
      
    } catch (err) {
      console.error('API call error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        let errorMessage = 'An unknown server error occurred';
        const errorDetail = err.response.data?.detail;

        if (errorDetail) {
          if (Array.isArray(errorDetail)) {
            // Handle FastAPI validation errors which are an array of objects
            errorMessage = errorDetail.map(e => `Invalid input for '${e.loc[1]}': ${e.msg}`).join('; ');
          } else if (typeof errorDetail === 'string') {
            // Handle simple string errors
            errorMessage = errorDetail;
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          }
        }
        setError(`Error: ${errorMessage}`);
      } else if (err.request) {
        // Network error
        setError('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main container for the medical intake application */}
      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Medical SOAP Note Summarizer
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered encounter note analysis and SOAP structuring for healthcare providers
          </p>
        </header>

        {/* Main content area */}
        <main className="max-w-6xl mx-auto space-y-8">
          {/* Encounter Notes Input Form */}
          <EncounterNotesForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {/* Error Display */}
          {error && (
            <div className="medical-card bg-red-50 border-red-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {analysisResult && (
            <div className="space-y-6">
              {/* SOAP Structure */}
              <div className="medical-card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Structured SOAP Notes
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Subjective</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{analysisResult.subjective}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Objective</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{analysisResult.objective}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{analysisResult.assessment}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Plan</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{analysisResult.plan}</p>
                  </div>
                </div>
              </div>

              {/* Clinical Analysis */}
              <div className="medical-card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Clinical Analysis
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Key Findings</h3>
                    <p className="text-gray-700">{analysisResult.key_findings}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Critical Points</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {analysisResult.critical_points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Clinical Impressions</h3>
                    <p className="text-gray-700">{analysisResult.clinical_impressions}</p>
                  </div>
                </div>
              </div>

              {/* CDI Codes */}
              <div className="medical-card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Suggested ICD-10 Codes
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="list-disc list-inside text-blue-800">
                    {analysisResult.cdi_codes.map((code, index) => (
                      <li key={index} className="mb-1">{code}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="medical-card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Recommended Next Steps
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <ul className="list-disc list-inside text-green-800">
                    {analysisResult.next_steps.map((step, index) => (
                      <li key={index} className="mb-1">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up Priorities */}
              <div className="medical-card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Follow-up Priorities</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {analysisResult.follow_up_priorities.map((priority, index) => (
                    <li key={index}>{priority}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="medical-card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">General Recommendations</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">{analysisResult.disclaimer}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App; 