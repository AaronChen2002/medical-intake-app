// Medical SOAP Note Summarizer - Frontend React App
// This file will contain the main React application component

import React, { useState } from 'react';
import EncounterNotesForm from './components/EncounterNotesForm';
import AnalysisResults from './components/AnalysisResults';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleAnalysisComplete = (analysisData) => {
    setIsLoading(true); // Keep loading state while results are displayed
    setError(null);
    
    if (analysisData) {
      setAnalysisResult(analysisData);
    } else {
      setError('Received an empty analysis. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <svg 
              className="w-8 h-8 text-blue-600" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4v-2c0-1.1.9-2 2-2s2 .9 2 2v2h-4z" fill="currentColor"/>
              <path d="M11 13v2h2v-2h-2zm0-4h2v2h-2v-2z" opacity="0.3" fill="currentColor"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Acorn
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {!analysisResult ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                AI-Powered SOAP Note Assistant
              </h2>
              <p className="text-lg text-gray-600">
                Instantly structure your encounter notes, identify key insights, and get coding suggestions.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <EncounterNotesForm 
                onSubmit={handleAnalysisComplete} 
                isLoading={isLoading} 
                apiUrl={apiUrl}
              />
              {error && (
                <div className="medical-card bg-red-50 border-red-200 mt-6 animate-fade-in">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            <AnalysisResults 
              analysisResult={analysisResult} 
              onReset={handleReset} 
            />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-16 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Acorn AI. For clinical decision support only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;