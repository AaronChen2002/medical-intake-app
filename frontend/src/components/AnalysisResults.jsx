import React, { useState } from 'react';

// Helper for clipboard functionality
const copyToClipboard = (text, setCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  });
};

// Simple Icon components for clarity
const ClipboardIcon = ({ copied }) => (
  copied ? (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
  )
);

const Section = ({ title, content }) => {
  const [copied, setCopied] = useState(false);
  
  // Robustly handle content that might be an array or a string
  const textContent = Array.isArray(content) ? content.join('\n- ') : (content || "N/A");

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button 
          onClick={() => copyToClipboard(textContent, setCopied)}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          title={`Copy ${title}`}
        >
          <ClipboardIcon copied={copied} />
        </button>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap font-mono text-sm">
        {Array.isArray(content) ? (
          <ul className="list-disc list-inside pl-2">
            {content.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        ) : (
          <p>{content || <span className="text-gray-400">No information provided.</span>}</p>
        )}
      </div>
    </div>
  );
};

const AnalysisResults = ({ analysisResult, onReset }) => {
  const { analysis, disclaimer, transcription } = analysisResult || {};
  
  const [activeTab, setActiveTab] = useState(transcription ? 'transcription' : 'analysis');
  const [allCopied, setAllCopied] = useState(false);

  if (!analysis) {
    return (
      <div className="medical-card text-center">
        <p className="text-gray-500">No analysis results to display.</p>
        <button
          onClick={onReset}
          className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          &larr; Start New Note
        </button>
      </div>
    );
  }

  // Dynamically generate the full text for the copy button
  const allContent = Object.entries(analysis)
    .map(([key, value]) => {
      const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const content = Array.isArray(value) ? value.map(v => `- ${v}`).join('\n') : value;
      return `${title.toUpperCase()}\n${content || 'N/A'}`;
    })
    .join('\n\n');

  // Add transcription to the copy-all text if it exists
  const fullReport = transcription 
    ? `TRANSCRIPTION\n${transcription}\n\n${allContent}` 
    : allContent;
  
  const tabs = [];
  if (transcription) {
    tabs.push({ id: 'transcription', label: 'Raw Transcription' });
  }
  tabs.push({ id: 'analysis', label: 'Structured Note' });

  return (
    <div className="medical-card bg-white animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Complete</h2>
        <button
          onClick={onReset}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          &larr; Start New Note
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Content */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(analysis).map(([key, value]) => {
            const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return <Section key={key} title={title} content={value} />;
          })}
        </div>
      )}

      {activeTab === 'transcription' && transcription && (
        <Section title="Full Encounter Transcription" content={transcription} />
      )}

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t flex flex-col items-center">
        <button
          onClick={() => copyToClipboard(fullReport, setAllCopied)}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all flex items-center space-x-2"
        >
          <ClipboardIcon copied={allCopied} />
          <span>{allCopied ? 'Copied to Clipboard!' : 'Copy Entire Report'}</span>
        </button>
        <p className="text-yellow-800 text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-6 text-center">{disclaimer}</p>
      </div>
    </div>
  );
};

export default AnalysisResults; 