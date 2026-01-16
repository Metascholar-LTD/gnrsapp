// ============================================================================
// PAPER SUBMISSION WORKFLOW
// ============================================================================
// Elegant, step-by-step paper submission system
// Inspired by Elsevier, Springer, IEEE submission portals
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Tag,
  FileCheck,
} from 'lucide-react';

const SubmitPaper: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: [] as string[],
    keywordInput: '',
    discipline: '',
    articleType: 'research',
    authors: [
      { name: 'Dr. Sarah Chen', email: 's.chen@mit.edu', affiliation: 'Massachusetts Institute of Technology', isCorresponding: true },
    ],
    university: 'Massachusetts Institute of Technology',
    pdfFile: null as File | null,
  });

  const totalSteps = 4;

  const styles = `
    .sr-submit-page {
      min-height: auto;
      background: transparent;
    }

    .sr-submit-header {
      background: transparent;
      border-bottom: 1px solid #E7E5E4;
      padding: 0 0 24px;
      margin-bottom: 24px;
    }

    .sr-submit-header__container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px 32px;
    }

    .sr-submit-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 24px 0;
    }

    .sr-submit-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .sr-submit-progress__step {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sr-submit-progress__step-number {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .sr-submit-progress__step--active .sr-submit-progress__step-number {
      background: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-submit-progress__step--completed .sr-submit-progress__step-number {
      background: #2D5A47;
      color: #FFFFFF;
    }

    .sr-submit-progress__step--pending .sr-submit-progress__step-number {
      background: #F5F5F4;
      color: #78716C;
      border: 2px solid #E7E5E4;
    }

    .sr-submit-progress__step-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      display: none;
    }

    @media (min-width: 768px) {
      .sr-submit-progress__step-label {
        display: block;
      }
    }

    .sr-submit-progress__step--active .sr-submit-progress__step-label {
      color: #1C1917;
      font-weight: 500;
    }

    .sr-submit-progress__connector {
      flex: 1;
      height: 2px;
      background: #E7E5E4;
      margin: 0 8px;
    }

    .sr-submit-progress__connector--completed {
      background: #2D5A47;
    }

    .sr-submit-content {
      max-width: 960px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }

    .sr-submit-form {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 40px;
    }

    @media (max-width: 640px) {
      .sr-submit-form {
        padding: 24px;
      }
    }

    .sr-submit-form__group {
      margin-bottom: 32px;
    }

    .sr-submit-form__label {
      display: block;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin-bottom: 8px;
    }

    .sr-submit-form__label-required {
      color: #7C2D36;
    }

    .sr-submit-form__input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: all 0.2s ease;
    }

    .sr-submit-form__input:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-submit-form__input--error {
      border-color: #7C2D36;
    }

    .sr-submit-form__textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      resize: vertical;
      transition: all 0.2s ease;
    }

    .sr-submit-form__textarea:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-submit-form__select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2357534E' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 40px;
    }

    .sr-submit-form__select:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-submit-form__keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .sr-submit-form__keyword {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #F5F5F4;
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #57534E;
    }

    .sr-submit-form__keyword-remove {
      background: none;
      border: none;
      color: #78716C;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      transition: color 0.15s ease;
    }

    .sr-submit-form__keyword-remove:hover {
      color: #1C1917;
    }

    .sr-submit-form__file-upload {
      border: 2px dashed #E7E5E4;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .sr-submit-form__file-upload:hover {
      border-color: #1E3A5F;
      background: rgba(30, 58, 95, 0.02);
    }

    .sr-submit-form__file-upload--has-file {
      border-color: #2D5A47;
      background: rgba(45, 90, 71, 0.05);
    }

    .sr-submit-form__file-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 58, 95, 0.08);
      border-radius: 8px;
      color: #1E3A5F;
      margin: 0 auto 16px;
    }

    .sr-submit-form__file-text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      margin: 0 0 8px 0;
    }

    .sr-submit-form__file-name {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
      font-weight: 500;
      margin: 0;
    }

    .sr-submit-form__error {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #7C2D36;
      margin-top: 8px;
    }

    .sr-submit-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px solid #E7E5E4;
    }

    .sr-submit-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .sr-submit-btn--primary {
      background: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-submit-btn--primary:hover:not(:disabled) {
      background: #2D4A6F;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.2);
    }

    .sr-submit-btn--secondary {
      background: transparent;
      border: 1px solid #E7E5E4;
      color: #57534E;
    }

    .sr-submit-btn--secondary:hover {
      background: #F5F5F4;
      border-color: #D6D3D1;
    }

    .sr-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    input[type="file"] {
      display: none;
    }
  `;

  const handleKeywordAdd = () => {
    if (formData.keywordInput.trim() && !formData.keywords.includes(formData.keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, prev.keywordInput.trim()],
        keywordInput: '',
      }));
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, pdfFile: file }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.abstract.trim()) {
        newErrors.abstract = 'Abstract is required';
      } else if (formData.abstract.length < 100) {
        newErrors.abstract = 'Abstract must be at least 100 characters';
      }
      if (formData.keywords.length === 0) {
        newErrors.keywords = 'At least one keyword is required';
      }
    }

    if (step === 2) {
      if (!formData.discipline) {
        newErrors.discipline = 'Discipline is required';
      }
    }

    if (step === 3) {
      if (!formData.pdfFile) {
        newErrors.pdfFile = 'PDF file is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/scholar/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Paper Title <span className="sr-submit-form__label-required">*</span>
              </label>
              <input
                type="text"
                className={`sr-submit-form__input ${errors.title ? 'sr-submit-form__input--error' : ''}`}
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter the full title of your paper"
              />
              {errors.title && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.title}
                </div>
              )}
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Abstract <span className="sr-submit-form__label-required">*</span>
              </label>
              <textarea
                className={`sr-submit-form__textarea ${errors.abstract ? 'sr-submit-form__input--error' : ''}`}
                value={formData.abstract}
                onChange={(e) => setFormData((prev) => ({ ...prev, abstract: e.target.value }))}
                placeholder="Provide a comprehensive abstract of your research (minimum 100 characters)"
              />
              {errors.abstract && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.abstract}
                </div>
              )}
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Keywords <span className="sr-submit-form__label-required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="sr-submit-form__input"
                  value={formData.keywordInput}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keywordInput: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleKeywordAdd();
                    }
                  }}
                  placeholder="Enter keyword and press Enter"
                />
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--secondary"
                  onClick={handleKeywordAdd}
                >
                  Add
                </button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="sr-submit-form__keywords">
                  {formData.keywords.map((keyword) => (
                    <span key={keyword} className="sr-submit-form__keyword">
                      {keyword}
                      <button
                        type="button"
                        className="sr-submit-form__keyword-remove"
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.keywords && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.keywords}
                </div>
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Discipline <span className="sr-submit-form__label-required">*</span>
              </label>
              <select
                className={`sr-submit-form__select ${errors.discipline ? 'sr-submit-form__input--error' : ''}`}
                value={formData.discipline}
                onChange={(e) => setFormData((prev) => ({ ...prev, discipline: e.target.value }))}
              >
                <option value="">Select a discipline</option>
                <option value="physics">Physics</option>
                <option value="computer-science">Computer Science</option>
                <option value="biology">Biology</option>
                <option value="engineering">Engineering</option>
                <option value="mathematics">Mathematics</option>
                <option value="chemistry">Chemistry</option>
                <option value="economics">Economics</option>
                <option value="social-sciences">Social Sciences</option>
              </select>
              {errors.discipline && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.discipline}
                </div>
              )}
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">Article Type</label>
              <select
                className="sr-submit-form__select"
                value={formData.articleType}
                onChange={(e) => setFormData((prev) => ({ ...prev, articleType: e.target.value }))}
              >
                <option value="research">Research Article</option>
                <option value="review">Review</option>
                <option value="case-study">Case Study</option>
                <option value="commentary">Commentary</option>
                <option value="letter">Letter</option>
              </select>
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">University Affiliation</label>
              <input
                type="text"
                className="sr-submit-form__input"
                value={formData.university}
                onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
                readOnly
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Upload PDF <span className="sr-submit-form__label-required">*</span>
              </label>
              <label
                htmlFor="pdf-upload"
                className={`sr-submit-form__file-upload ${formData.pdfFile ? 'sr-submit-form__file-upload--has-file' : ''}`}
              >
                <div className="sr-submit-form__file-icon">
                  <Upload size={24} />
                </div>
                {formData.pdfFile ? (
                  <>
                    <p className="sr-submit-form__file-name">{formData.pdfFile.name}</p>
                    <p className="sr-submit-form__file-text">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="sr-submit-form__file-text">
                      Click to upload or drag and drop
                    </p>
                    <p className="sr-submit-form__file-text" style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                      PDF files only (max 10MB)
                    </p>
                  </>
                )}
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
              />
              {errors.pdfFile && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.pdfFile}
                </div>
              )}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(45, 90, 71, 0.1)', borderRadius: '12px', color: '#2D5A47' }}>
                <FileCheck size={32} />
              </div>
              <h2 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: '1.5rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0' }}>
                Review Your Submission
              </h2>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#57534E', margin: 0 }}>
                Please review all information before submitting
              </p>
            </div>

            <div className="sr-submit-form__group">
              <div style={{ background: '#F5F5F4', borderRadius: '8px', padding: '20px' }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 8px 0' }}>Title</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#57534E', margin: '0 0 16px 0' }}>{formData.title || 'Not provided'}</p>

                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 8px 0' }}>Discipline</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#57534E', margin: '0 0 16px 0' }}>{formData.discipline || 'Not provided'}</p>

                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 8px 0' }}>Keywords</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#57534E', margin: '0 0 16px 0' }}>{formData.keywords.join(', ') || 'Not provided'}</p>

                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 8px 0' }}>PDF File</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#57534E', margin: 0 }}>{formData.pdfFile?.name || 'Not provided'}</p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-submit-page">
        <header className="sr-submit-header">
          <div className="sr-submit-header__container">
            <h1 className="sr-submit-header__title">Submit Paper</h1>
            <div className="sr-submit-progress">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`sr-submit-progress__step ${
                      step < currentStep
                        ? 'sr-submit-progress__step--completed'
                        : step === currentStep
                        ? 'sr-submit-progress__step--active'
                        : 'sr-submit-progress__step--pending'
                    }`}
                  >
                    <div className="sr-submit-progress__step-number">
                      {step < currentStep ? <CheckCircle2 size={16} /> : step}
                    </div>
                    <span className="sr-submit-progress__step-label">
                      {step === 1 && 'Details'}
                      {step === 2 && 'Category'}
                      {step === 3 && 'Upload'}
                      {step === 4 && 'Review'}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`sr-submit-progress__connector ${
                        step < currentStep ? 'sr-submit-progress__connector--completed' : ''
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>

        <main className="sr-submit-content">
          <div className="sr-submit-form">
            {renderStepContent()}

            <div className="sr-submit-actions">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--primary"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Paper'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SubmitPaper;
