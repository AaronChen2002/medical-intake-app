// Medical Intake Summarizer - Frontend React App
// This file will contain the main React application component

import React, { useState } from 'react';
import SymptomForm from './components/SymptomForm';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // TODO: Replace with actual API call to backend
      console.log('Form submitted with data:', formData);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder response
      setAnalysisResult({
        summary: "This is a placeholder response. The actual AI analysis will be implemented in the next step.",
        potential_conditions: ["Placeholder condition 1", "Placeholder condition 2"],
        severity_level: "moderate",
        recommendations: ["This is a placeholder recommendation", "Another placeholder recommendation"],
        disclaimer: "This is not a substitute for professional medical advice"
      });
    } catch (err) {
      setError('An error occurred while analyzing symptoms. Please try again.');
      console.error('Form submission error:', err);
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
            Medical Intake Summarizer
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your symptoms and get an AI-powered medical summary
          </p>
        </header>

        {/* Main content area */}
        <main className="max-w-4xl mx-auto space-y-8">
          {/* Symptom Input Form */}
          <SymptomForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
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

          {/* Results Display - Placeholder for now */}
          {analysisResult && (
            <div className="medical-card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Analysis Results
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                  <p className="text-gray-700">{analysisResult.summary}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Potential Conditions</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {analysisResult.potential_conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Severity Level</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    analysisResult.severity_level === 'high' ? 'bg-red-100 text-red-800' :
                    analysisResult.severity_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {analysisResult.severity_level}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">{analysisResult.disclaimer}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App; 