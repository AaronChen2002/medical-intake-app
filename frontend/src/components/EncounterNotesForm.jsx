import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const exampleNote = `Patient: John Doe, 45-year-old male
Subjective: Patient presents with a 3-day history of a persistent, dry cough and progressive shortness of breath. He reports feeling feverish and fatigued. Notes occasional headaches and muscle aches. No significant past medical history. Non-smoker.

Objective:
Vital Signs: T 101.2°F, HR 98 bpm, RR 22/min, BP 130/85 mmHg, SpO2 94% on room air.
Physical Exam: General appearance shows mild respiratory distress. Lungs reveal crackles in the lower lobes bilaterally. Heart sounds are regular.

Assessment: Suspected community-acquired pneumonia. Differential includes bronchitis and COVID-19.

Plan:
1. Order chest X-ray to confirm pneumonia.
2. Start empirical antibiotics (Azithromycin).
3. Administer antipyretics for fever.
4. Swab for COVID-19 and influenza.
5. Advise patient to monitor symptoms and follow up in 2 days.`;

const MicrophoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
  </svg>
);

const EncounterNotesForm = ({ onSubmit, isLoading, analysisResult, error, apiUrl }) => {
  const [formData, setFormData] = useState({
    encounterNotes: '',
    patientAge: '',
    patientGender: '',
    additionalContext: ''
  });

  const [errors, setErrors] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const encounterNotesRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Autofocus the main textarea on component mount
  useEffect(() => {
    if (encounterNotesRef.current) {
      encounterNotesRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.encounterNotes.trim()) {
      newErrors.encounterNotes = 'Encounter notes are required.';
    }
    if (formData.patientAge && (formData.patientAge < 0 || formData.patientAge > 120)) {
      newErrors.patientAge = 'Please enter a valid age (0-120).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClearForm = () => {
    setFormData({
      encounterNotes: '',
      patientAge: '',
      patientGender: '',
      additionalContext: ''
    });
    setErrors({});
    if (encounterNotesRef.current) {
      encounterNotesRef.current.focus();
    }
  };

  const handleLoadExample = () => {
    setFormData(prev => ({
      ...prev,
      encounterNotes: exampleNote
    }));
  };

  const handleRecordButtonClick = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // You could set an error state here to show a message to the user
      alert("Could not access microphone. Please ensure you have given permission in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (audioBlob) => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'encounter-audio.webm');

    try {
      // By not setting the 'Content-Type' header, we allow the browser to
      // automatically set it to 'multipart/form-data' with the correct
      // boundary, which is crucial for file uploads.
      const response = await axios.post(`${apiUrl}/transcribe-audio`, formData);
      const transcribedText = response.data.transcription;
      if (transcribedText) {
        setFormData(prev => ({
          ...prev,
          encounterNotes: prev.encounterNotes 
            ? `${prev.encounterNotes}\n${transcribedText}` 
            : transcribedText
        }));
      }
    } catch (err) {
      console.error("Error transcribing audio:", err);
      alert("There was an error transcribing the audio. Please check the console for details.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const isSubmitDisabled = isLoading || !formData.encounterNotes.trim() || isRecording || isTranscribing;

  return (
    <div className="medical-card" role="main" aria-labelledby="form-title">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Form Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="form-title" className="text-2xl font-semibold text-gray-900">
            Enter Encounter Notes
          </h2>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleLoadExample}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              disabled={isLoading}
            >
              Load Example
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </div>
        
        {/* Encounter Notes Textarea */}
        <div>
          <label 
            htmlFor="encounterNotes" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Encounter Notes <span className="text-red-500" aria-label="required">*</span>
          </label>
          <textarea
            ref={encounterNotesRef}
            id="encounterNotes"
            name="encounterNotes"
            value={formData.encounterNotes}
            onChange={handleInputChange}
            rows={10}
            className={`medical-input transition-colors ${errors.encounterNotes ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
            placeholder="Write or paste your clinical encounter notes here. Our AI will structure them, pull out key insights, and suggest relevant codes."
            disabled={isLoading}
            aria-describedby={errors.encounterNotes ? "notes-error" : "notes-help"}
            aria-invalid={!!errors.encounterNotes}
            aria-required="true"
          />
          {errors.encounterNotes && (
            <div id="notes-error" className="flex items-center mt-2 text-sm text-red-600 animate-fade-in-fast" role="alert">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              <span>{errors.encounterNotes}</span>
            </div>
          )}
        </div>

        {/* Patient Demographics & Context Expansion */}
        <details className="group">
          <summary className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer list-none flex items-center">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">&ndash;</span>
            <span className="ml-2">Add Patient Demographics & Context (Optional)</span>
          </summary>
          <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age Input */}
              <div>
                <label 
                  htmlFor="patientAge" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Patient Age
                </label>
                <input
                  type="number"
                  id="patientAge"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                  min="0"
                  max="120"
                  className={`medical-input transition-colors ${errors.patientAge ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  placeholder="e.g., 45"
                  disabled={isLoading}
                  aria-describedby={errors.patientAge ? "age-error" : undefined}
                  aria-invalid={!!errors.patientAge}
                />
                {errors.patientAge && (
                  <div id="age-error" className="flex items-center mt-2 text-sm text-red-600 animate-fade-in-fast" role="alert">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <span>{errors.patientAge}</span>
                  </div>
                )}
              </div>

              {/* Gender Select */}
              <div>
                <label 
                  htmlFor="patientGender" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Patient Gender
                </label>
                <select
                  id="patientGender"
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleInputChange}
                  className="medical-input transition-colors focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            {/* Additional Context Textarea */}
            <div>
              <label 
                htmlFor="additionalContext" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Context
              </label>
              <textarea
                id="additionalContext"
                name="additionalContext"
                value={formData.additionalContext}
                onChange={handleInputChange}
                rows={2}
                className="medical-input transition-colors focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., family history, recent travel, specific concerns..."
                disabled={isLoading}
              />
            </div>
          </div>
        </details>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleRecordButtonClick}
              className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              disabled={isLoading || isTranscribing}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            {isTranscribing && (
              <div className="flex items-center text-sm text-gray-600 animate-fade-in">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Transcribing...</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="medical-button"
            disabled={isSubmitDisabled}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            <span>{isLoading ? 'Analyzing...' : 'Analyze Notes'}</span>
          </button>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg text-red-800 text-sm" role="alert">
            <p>An error occurred while processing your request. Please try again.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EncounterNotesForm;