import React, { useState } from 'react';

const SymptomForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    symptoms: '',
    patientAge: '',
    patientGender: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Please describe your symptoms';
    }
    
    if (formData.patientAge && (formData.patientAge < 0 || formData.patientAge > 120)) {
      newErrors.patientAge = 'Please enter a valid age (0-120)';
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

  return (
    <div className="medical-card" role="main" aria-labelledby="form-title">
      <h2 id="form-title" className="text-2xl font-semibold text-gray-900 mb-6">
        Symptom Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Symptoms Textarea */}
        <div>
          <label 
            htmlFor="symptoms" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Describe Your Symptoms <span className="text-red-500" aria-label="required">*</span>
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            rows={4}
            className={`medical-input ${errors.symptoms ? 'border-red-500' : ''}`}
            placeholder="Please describe your symptoms in detail. For example: 'I have been experiencing headaches for the past 3 days, along with nausea and sensitivity to light.'"
            disabled={isLoading}
            aria-describedby={errors.symptoms ? "symptoms-error" : "symptoms-help"}
            aria-invalid={!!errors.symptoms}
            aria-required="true"
          />
          {errors.symptoms && (
            <p id="symptoms-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.symptoms}
            </p>
          )}
          <p id="symptoms-help" className="mt-1 text-sm text-gray-500">
            Be as detailed as possible about your symptoms, including duration, severity, and any triggers.
          </p>
        </div>

        {/* Age and Gender Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age Input */}
          <div>
            <label 
              htmlFor="patientAge" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Age (optional)
            </label>
            <input
              type="number"
              id="patientAge"
              name="patientAge"
              value={formData.patientAge}
              onChange={handleInputChange}
              min="0"
              max="120"
              className={`medical-input ${errors.patientAge ? 'border-red-500' : ''}`}
              placeholder="Enter your age"
              disabled={isLoading}
              aria-describedby={errors.patientAge ? "age-error" : undefined}
              aria-invalid={!!errors.patientAge}
            />
            {errors.patientAge && (
              <p id="age-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.patientAge}
              </p>
            )}
          </div>

          {/* Gender Select */}
          <div>
            <label 
              htmlFor="patientGender" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gender (optional)
            </label>
            <select
              id="patientGender"
              name="patientGender"
              value={formData.patientGender}
              onChange={handleInputChange}
              className="medical-input"
              disabled={isLoading}
              aria-describedby="gender-help"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            <p id="gender-help" className="mt-1 text-sm text-gray-500">
              This information helps provide more accurate analysis.
            </p>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label 
            htmlFor="additionalNotes" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Notes (optional)
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            rows={3}
            className="medical-input"
            placeholder="Any additional information that might be relevant (medications, recent injuries, family history, etc.)"
            disabled={isLoading}
            aria-describedby="notes-help"
          />
          <p id="notes-help" className="mt-1 text-sm text-gray-500">
            Include any relevant medical history, medications, or recent changes that might be related to your symptoms.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`medical-button w-full ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-describedby={isLoading ? "loading-status" : undefined}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Symptoms...</span>
              </div>
            ) : (
              'Analyze Symptoms'
            )}
          </button>
          {isLoading && (
            <p id="loading-status" className="mt-2 text-sm text-gray-600" role="status">
              Please wait while we analyze your symptoms. This may take a few moments.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SymptomForm; 