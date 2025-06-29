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

const EncounterNotesForm = ({ onSubmit, isLoading, apiUrl }) => {
  const [activeTab, setActiveTab] = useState('record');
  const [specialty, setSpecialty] = useState('Default');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
        handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure you have given permission in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'encounter-audio.webm');
    formData.append('specialty', specialty);

    try {
      const response = await axios.post(`${apiUrl}/transcribe/`, formData);
      onSubmit(response.data);
    } catch (err) {
      console.error("Error uploading and analyzing audio:", err);
      alert("There was an error processing the audio. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!notes.trim()) {
      alert("Please enter some notes to analyze.");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await axios.post(`${apiUrl}/analyze-text/`, {
        notes: notes,
        specialty: specialty
      });
      onSubmit(response.data);
    } catch (err) {
      console.error("Error analyzing text:", err);
      alert("There was an error analyzing the text. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isButtonDisabled = isLoading || isRecording || isProcessing;

  const TabButton = ({ tabId, children }) => (
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === tabId}
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors 
        ${activeTab === tabId 
          ? 'bg-white border-b-0 text-blue-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="medical-card" role="main" aria-labelledby="form-title">
      <div className="flex justify-between items-center mb-6">
        <h2 id="form-title" className="text-2xl font-semibold text-gray-900">
          Create Clinical Note
        </h2>
        <div className="w-full max-w-xs">
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 sr-only">
            Clinical Specialty
          </label>
          <select
            id="specialty"
            name="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="medical-input w-full"
            disabled={isButtonDisabled}
          >
            <option value="Default">General (SOAP)</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="-mb-px flex space-x-2" role="tablist">
          <TabButton tabId="record">Record Audio</TabButton>
          <TabButton tabId="type">Type Notes</TabButton>
        </div>
      </div>
      
      <div className="py-6">
        {/* Record Audio Tab Panel */}
        {activeTab === 'record' && (
          <div role="tabpanel" className="flex flex-col items-center justify-center">
            <p className="text-gray-600 mb-6 text-center">
              Click the button to start recording your encounter.
            </p>
            <button
              type="button"
              onClick={handleRecordButtonClick}
              disabled={isButtonDisabled}
              className={`flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4
                ${isRecording 
                  ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'}
                ${isButtonDisabled && !isRecording ? 'bg-gray-400 cursor-not-allowed' : ''}
              `}
              aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            >
              <MicrophoneIcon className="w-10 h-10 text-white" />
            </button>
            <div className="mt-4 text-center h-6">
              {isRecording && <p className="text-red-600 animate-pulse font-medium">Recording...</p>}
              {isProcessing && !isRecording && <p className="text-gray-600 animate-pulse font-medium">Processing Audio...</p>}
              {!isRecording && !isProcessing && <p className="text-gray-500">{isButtonDisabled ? 'Waiting...' : 'Click to start'}</p>}
            </div>
          </div>
        )}

        {/* Type Notes Tab Panel */}
        {activeTab === 'type' && (
          <div role="tabpanel">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className="medical-input w-full"
              placeholder="Type or paste your clinical encounter notes here..."
              disabled={isButtonDisabled}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleTextAnalysis}
                disabled={isButtonDisabled || !notes.trim()}
                className="medical-button"
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Notes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncounterNotesForm;