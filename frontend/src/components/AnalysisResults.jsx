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

const Section = ({ title, content, isList = false }) => {
  const [copied, setCopied] = useState(false);
  const textContent = Array.isArray(content) ? content.join('\n') : content;

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
        {isList && Array.isArray(content) ? (
          <ul className="list-disc list-inside">
            {content.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );
};

const AnalysisResults = ({ analysisResult, onReset }) => {
  const [activeTab, setActiveTab] = useState('soap');

  const tabs = [
    { id: 'soap', label: 'SOAP Structure' },
    { id: 'analysis', label: 'Clinical Analysis' },
    { id: 'codes', label: 'ICD-10 Codes' },
    { id: 'next_steps', label: 'Next Steps' },
  ];
  
  const allContent = `
SOAP STRUCTURE
Subjective: ${analysisResult.subjective}
Objective: ${analysisResult.objective}
Assessment: ${analysisResult.assessment}
Plan: ${analysisResult.plan}

CLINICAL ANALYSIS
Key Findings: ${analysisResult.key_findings}
Critical Points: ${analysisResult.critical_points.join('\n- ')}
Clinical Impressions: ${analysisResult.clinical_impressions}

SUGGESTED ICD-10 CODES
${analysisResult.cdi_codes.join('\n')}

RECOMMENDED NEXT STEPS
${analysisResult.next_steps.join('\n- ')}

FOLLOW-UP PRIORITIES
${analysisResult.follow_up_priorities.join('\n- ')}

RECOMMENDATIONS
${analysisResult.recommendations.join('\n- ')}

Disclaimer: ${analysisResult.disclaimer}
  `.trim();

  const [allCopied, setAllCopied] = useState(false);

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
      
      {/* Tab Content */}
      <div>
        {activeTab === 'soap' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Subjective" content={analysisResult.subjective} />
            <Section title="Objective" content={analysisResult.objective} />
            <Section title="Assessment" content={analysisResult.assessment} />
            <Section title="Plan" content={analysisResult.plan} />
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div>
            <Section title="Key Findings" content={analysisResult.key_findings} />
            <Section title="Critical Points" content={analysisResult.critical_points} isList />
            <Section title="Clinical Impressions" content={analysisResult.clinical_impressions} />
          </div>
        )}

        {activeTab === 'codes' && (
          <div>
            <Section title="Suggested ICD-10 Codes" content={analysisResult.cdi_codes} isList />
            <p className="text-sm text-gray-500 mt-4">These are suggestions based on the provided notes. Verify all codes against official documentation and clinical judgment.</p>
          </div>
        )}

        {activeTab === 'next_steps' && (
          <div>
            <Section title="Recommended Next Steps" content={analysisResult.next_steps} isList />
            <Section title="Follow-up Priorities" content={analysisResult.follow_up_priorities} isList />
            <Section title="General Recommendations" content={analysisResult.recommendations} isList />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t flex flex-col items-center">
        <button
          onClick={() => copyToClipboard(allContent, setAllCopied)}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all flex items-center space-x-2"
        >
          <ClipboardIcon copied={allCopied} />
          <span>{allCopied ? 'Copied to Clipboard!' : 'Copy Entire Report'}</span>
        </button>
        <p className="text-yellow-800 text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-6 text-center">{analysisResult.disclaimer}</p>
      </div>
    </div>
  );
};

export default AnalysisResults; 