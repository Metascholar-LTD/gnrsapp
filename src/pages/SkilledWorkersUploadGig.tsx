import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { InitScripts } from '@/components/InitScripts';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Briefcase,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  FileText,
  CheckCircle,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const PAYMENT_TYPES = [
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'daily', label: 'Daily Rate' },
  { value: 'weekly', label: 'Weekly Rate' },
  { value: 'monthly', label: 'Monthly Rate' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'negotiable', label: 'Negotiable' }
];

const STEPS = [
  { id: 1, label: 'Basic Info', icon: FileText },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: CheckCircle }
];

const SkilledWorkersUploadGig: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employer_name: '',
    employer_phone: '',
    employer_email: '',
    payment_type: '',
    payment_amount: '',
    start_date: '',
    end_date: '',
    requirements: '',
    what_to_expect: ''
  });

  const [requirements, setRequirements] = useState<string[]>(['']);

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
    setFormData({ ...formData, requirements: updated.filter(Boolean).join('\n') });
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    const updated = requirements.filter((_, i) => i !== index);
    setRequirements(updated.length > 0 ? updated : ['']);
    setFormData({ ...formData, requirements: updated.filter(Boolean).join('\n') });
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.location && formData.employer_name && formData.employer_phone);
      case 2:
        return !!(formData.payment_type && (formData.payment_amount || formData.payment_type === 'negotiable'));
      case 3:
        return isStepComplete(1) && isStepComplete(2); // Review step requires all previous steps to be complete
      default:
        return false;
    }
  };

  const canProceed = (): boolean => {
    return isStepComplete(currentStep);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase
    console.log('Form submitted:', { ...formData, requirements: requirements.filter(Boolean).join('\n') });
    alert('Gig submitted successfully! It will be reviewed before going live.');
    navigate('/skilled-workers');
  };

  const isolatedStyles = `
    .swug-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
      position: relative;
    }

    .swug-content-wrapper {
      position: relative;
      width: 100%;
      min-height: calc(100vh - 80px);
    }

    .swug-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem;
    }

    .swug-content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: start;
    }

    @media (min-width: 1200px) {
      .swug-content-grid {
        grid-template-columns: 5fr 7fr;
        gap: 4rem;
        align-items: center;
      }
    }

    .swug-animation-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: sticky;
      top: 50%;
      transform: translateY(-50%);
      align-self: center;
      height: fit-content;
    }

    @media (min-width: 1200px) {
      .swug-animation-section {
        position: sticky;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .swug-animation-wrapper {
      width: 100%;
      max-width: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .swug-header {
      text-align: center;
      margin-top: 2rem;
    }

    @media (min-width: 1200px) {
      .swug-header {
        text-align: left;
        margin-top: 1.5rem;
      }
    }

    .swug-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-subtitle {
      font-size: 1.125rem;
      color: hsl(220 20% 40%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .swug-stepper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      position: relative;
    }

    .swug-stepper::before {
      content: '';
      position: absolute;
      top: 1.5rem;
      left: 0;
      right: 0;
      height: 2px;
      background: hsl(220 13% 91%);
      z-index: 0;
    }

    .swug-step {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .swug-step-circle {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: white;
      border: 2px solid hsl(220 13% 91%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .swug-step.active .swug-step-circle {
      border-color: hsl(220 67% 41%);
      background: hsl(220 67% 41%);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .swug-step.complete .swug-step-circle {
      border-color: hsl(142 76% 36%);
      background: hsl(142 76% 36%);
      color: white;
    }

    .swug-step-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .swug-step-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: color 0.3s ease;
    }

    .swug-step.active .swug-step-label {
      color: hsl(220 67% 41%);
    }

    .swug-step.complete .swug-step-label {
      color: hsl(142 76% 36%);
    }

    .swug-form-card {
      background: white;
      border: 1px solid hsl(220 13% 91%);
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .swug-form-group {
      margin-bottom: 1.5rem;
    }

    .swug-form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-form-label-icon {
      width: 1rem;
      height: 1rem;
      color: hsl(220 20% 40%);
    }

    .swug-form-label-required {
      color: hsl(0 75% 60%);
      margin-left: 0.25rem;
    }

    .swug-form-input,
    .swug-form-select,
    .swug-form-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid hsl(220 13% 91%);
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      color: hsl(220 30% 15%);
      background: white;
      transition: all 0.2s ease;
    }

    .swug-form-input:focus,
    .swug-form-select:focus,
    .swug-form-textarea:focus {
      outline: none;
      border-color: hsl(220 67% 41%);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .swug-form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .swug-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .swug-form-group.full-width {
      grid-column: 1 / -1;
    }

    .swug-requirements-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .swug-requirement-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .swug-requirement-number {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: hsl(220 13% 96%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      flex-shrink: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-requirement-input {
      flex: 1;
    }

    .swug-requirement-remove {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      border: 1.5px solid hsl(220 13% 91%);
      background: white;
      color: hsl(220 20% 40%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .swug-requirement-remove:hover {
      border-color: hsl(0 75% 60%);
      color: hsl(0 75% 60%);
      background: hsl(0 75% 98%);
    }

    .swug-add-requirement {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1.5px dashed hsl(220 13% 91%);
      border-radius: 0.5rem;
      background: hsl(220 13% 98%);
      color: hsl(220 20% 40%);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      margin-top: 0.5rem;
    }

    .swug-add-requirement:hover {
      border-color: hsl(220 67% 41%);
      color: hsl(220 67% 41%);
      background: hsl(220 67% 98%);
    }

    .swug-form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid hsl(220 13% 91%);
    }

    .swug-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .swug-btn-primary {
      background: hsl(220 67% 41%);
      color: white;
    }

    .swug-btn-primary:hover:not(:disabled) {
      background: hsl(220 67% 35%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .swug-btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .swug-btn-secondary {
      background: white;
      color: hsl(220 20% 40%);
      border: 1.5px solid hsl(220 13% 91%);
    }

    .swug-btn-secondary:hover {
      background: hsl(220 13% 98%);
      border-color: hsl(220 20% 40%);
    }

    .swug-btn-icon {
      width: 1rem;
      height: 1rem;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .swug-content-wrapper {
        padding-top: 60px;
      }

      .swug-container {
        padding: 1rem;
      }

      .swug-content-grid {
        gap: 2rem;
      }

      .swug-animation-wrapper {
        max-width: 280px;
      }

      .swug-title {
        font-size: 1.75rem;
      }

      .swug-subtitle {
        font-size: 1rem;
      }

      .swug-stepper {
        margin-bottom: 2rem;
      }

      .swug-step-circle {
        width: 2.5rem;
        height: 2.5rem;
      }

      .swug-step-label {
        font-size: 0.75rem;
      }

      .swug-form-card {
        padding: 1.5rem;
      }

      .swug-form-grid {
        grid-template-columns: 1fr;
      }

      .swug-form-actions {
        flex-direction: column-reverse;
        gap: 1rem;
      }

      .swug-btn {
        width: 100%;
        justify-content: center;
      }
    }

    .swug-review-section {
      width: 100%;
    }

    .swug-review-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .swug-review-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-subtitle {
      font-size: 1rem;
      color: hsl(220 20% 40%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .swug-review-card {
      background: white;
      border: 1.5px solid hsl(220 13% 91%);
      border-radius: 0.75rem;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .swug-review-card:hover {
      border-color: hsl(220 67% 41%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .swug-review-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid hsl(220 13% 91%);
    }

    .swug-review-card-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: hsl(220 67% 41%);
    }

    .swug-review-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .swug-review-item {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 1rem;
      align-items: start;
    }

    .swug-review-item.full-width {
      grid-template-columns: 1fr;
      flex-direction: column;
    }

    .swug-review-label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-value {
      font-size: 0.9375rem;
      color: hsl(220 30% 15%);
      line-height: 1.6;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-list {
      margin: 0.5rem 0 0 0;
      padding-left: 1.5rem;
      list-style-type: disc;
    }

    .swug-review-list li {
      margin-bottom: 0.5rem;
      color: hsl(220 30% 15%);
      font-size: 0.9375rem;
      line-height: 1.6;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-warning,
    .swug-review-success {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .swug-review-warning {
      background: hsl(0 75% 98%);
      border: 1.5px solid hsl(0 75% 85%);
      color: hsl(0 75% 50%);
    }

    .swug-review-warning-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .swug-review-success {
      background: hsl(142 76% 98%);
      border: 1.5px solid hsl(142 76% 85%);
      color: hsl(142 76% 30%);
    }

    .swug-review-success-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    @media (max-width: 767px) {
      .swug-review-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .swug-review-label {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .swug-content-wrapper {
        padding-top: 70px;
      }

      .swug-container {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .swug-content-wrapper {
        padding-top: 120px;
      }

      .swug-container {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .swug-content-wrapper {
        padding-top: 120px;
      }

      .swug-container {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="swug-form-group">
              <label className="swug-form-label">
                <Briefcase className="swug-form-label-icon" />
                Gig Title
                <span className="swug-form-label-required">*</span>
              </label>
              <input
                type="text"
                className="swug-form-input"
                placeholder="e.g., Event Setup Assistant"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="swug-form-group">
              <label className="swug-form-label">
                <FileText className="swug-form-label-icon" />
                Description
              </label>
              <textarea
                className="swug-form-textarea"
                placeholder="Describe the gig in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="swug-form-grid">
              <div className="swug-form-group">
                <label className="swug-form-label">
                  <MapPin className="swug-form-label-icon" />
                  Location
                  <span className="swug-form-label-required">*</span>
                </label>
                <input
                  type="text"
                  className="swug-form-input"
                  placeholder="e.g., Accra, Greater Accra"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="swug-form-group">
                <label className="swug-form-label">
                  <User className="swug-form-label-icon" />
                  Your Name
                  <span className="swug-form-label-required">*</span>
                </label>
                <input
                  type="text"
                  className="swug-form-input"
                  placeholder="Employer name"
                  value={formData.employer_name}
                  onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                  required
                />
              </div>

              <div className="swug-form-group">
                <label className="swug-form-label">
                  <Phone className="swug-form-label-icon" />
                  Phone Number
                  <span className="swug-form-label-required">*</span>
                </label>
                <input
                  type="tel"
                  className="swug-form-input"
                  placeholder="+233 XX XXX XXXX"
                  value={formData.employer_phone}
                  onChange={(e) => setFormData({ ...formData, employer_phone: e.target.value })}
                  required
                />
              </div>

              <div className="swug-form-group">
                <label className="swug-form-label">
                  <Mail className="swug-form-label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="swug-form-input"
                  placeholder="your@email.com"
                  value={formData.employer_email}
                  onChange={(e) => setFormData({ ...formData, employer_email: e.target.value })}
                />
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
          <div className="swug-form-grid">
            <div className="swug-form-group full-width">
              <label className="swug-form-label">
                <CreditCard className="swug-form-label-icon" />
                Payment Type
                <span className="swug-form-label-required">*</span>
              </label>
              <select
                className="swug-form-select"
                value={formData.payment_type}
                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                required
              >
                <option value="">Select payment type</option>
                {PAYMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="swug-form-group">
              <label className="swug-form-label">
                <CreditCard className="swug-form-label-icon" />
                Payment Amount (GHS)
              </label>
              <input
                type="number"
                className="swug-form-input"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.payment_amount}
                onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                disabled={formData.payment_type === 'negotiable'}
              />
            </div>

            <div className="swug-form-group">
              <label className="swug-form-label">
                <Calendar className="swug-form-label-icon" />
                Start Date
              </label>
              <input
                type="date"
                className="swug-form-input"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="swug-form-group">
              <label className="swug-form-label">
                <Calendar className="swug-form-label-icon" />
                End Date
              </label>
              <input
                type="date"
                className="swug-form-input"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="swug-form-group">
            <label className="swug-form-label">
              <FileText className="swug-form-label-icon" />
              Requirements
            </label>
            <div className="swug-requirements-list">
              {requirements.map((req, index) => (
                <div key={index} className="swug-requirement-item">
                  <div className="swug-requirement-number">{index + 1}</div>
                  <input
                    type="text"
                    className="swug-form-input swug-requirement-input"
                    placeholder="Enter a requirement"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      className="swug-requirement-remove"
                      onClick={() => removeRequirement(index)}
                      aria-label="Remove requirement"
                    >
                      <X className="swug-btn-icon" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="swug-add-requirement"
              onClick={addRequirement}
            >
              <span>+</span>
              Add Requirement
            </button>
          </div>

          <div className="swug-form-group">
            <label className="swug-form-label">
              <FileText className="swug-form-label-icon" />
              What to Expect
            </label>
            <textarea
              className="swug-form-textarea"
              placeholder="Tell applicants what they can expect from this gig..."
              value={formData.what_to_expect}
              onChange={(e) => setFormData({ ...formData, what_to_expect: e.target.value })}
            />
          </div>
          </>
        );

      case 3:
        return (
          <div className="swug-review-section">
            <div className="swug-review-header">
              <h3 className="swug-review-title">Review Your Gig Details</h3>
              <p className="swug-review-subtitle">Please review all information before submitting</p>
            </div>

            <div className="swug-review-content">
              {/* Basic Information */}
              <div className="swug-review-card">
                <div className="swug-review-card-header">
                  <FileText className="swug-review-card-icon" />
                  <h4 className="swug-review-card-title">Basic Information</h4>
                </div>
                <div className="swug-review-details">
                  <div className="swug-review-item">
                    <span className="swug-review-label">Gig Title:</span>
                    <span className="swug-review-value">{formData.title || 'Not provided'}</span>
                  </div>
                  {formData.description && (
                    <div className="swug-review-item">
                      <span className="swug-review-label">Description:</span>
                      <span className="swug-review-value">{formData.description}</span>
                    </div>
                  )}
                  <div className="swug-review-item">
                    <span className="swug-review-label">Location:</span>
                    <span className="swug-review-value">{formData.location || 'Not provided'}</span>
                  </div>
                  <div className="swug-review-item">
                    <span className="swug-review-label">Your Name:</span>
                    <span className="swug-review-value">{formData.employer_name || 'Not provided'}</span>
                  </div>
                  <div className="swug-review-item">
                    <span className="swug-review-label">Phone:</span>
                    <span className="swug-review-value">{formData.employer_phone || 'Not provided'}</span>
                  </div>
                  {formData.employer_email && (
                    <div className="swug-review-item">
                      <span className="swug-review-label">Email:</span>
                      <span className="swug-review-value">{formData.employer_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="swug-review-card">
                <div className="swug-review-card-header">
                  <CreditCard className="swug-review-card-icon" />
                  <h4 className="swug-review-card-title">Payment Information</h4>
                </div>
                <div className="swug-review-details">
                  <div className="swug-review-item">
                    <span className="swug-review-label">Payment Type:</span>
                    <span className="swug-review-value">
                      {formData.payment_type ? PAYMENT_TYPES.find(t => t.value === formData.payment_type)?.label : 'Not provided'}
                    </span>
                  </div>
                  {formData.payment_type !== 'negotiable' && formData.payment_amount && (
                    <div className="swug-review-item">
                      <span className="swug-review-label">Amount:</span>
                      <span className="swug-review-value">GHS {formData.payment_amount}</span>
                    </div>
                  )}
                  {formData.start_date && (
                    <div className="swug-review-item">
                      <span className="swug-review-label">Start Date:</span>
                      <span className="swug-review-value">{new Date(formData.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {formData.end_date && (
                    <div className="swug-review-item">
                      <span className="swug-review-label">End Date:</span>
                      <span className="swug-review-value">{new Date(formData.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              {(formData.requirements || formData.what_to_expect) && (
                <div className="swug-review-card">
                  <div className="swug-review-card-header">
                    <Briefcase className="swug-review-card-icon" />
                    <h4 className="swug-review-card-title">Additional Details</h4>
                  </div>
                  <div className="swug-review-details">
                    {formData.requirements && (
                      <div className="swug-review-item full-width">
                        <span className="swug-review-label">Requirements:</span>
                        <ul className="swug-review-list">
                          {formData.requirements.split('\n').filter(Boolean).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formData.what_to_expect && (
                      <div className="swug-review-item full-width">
                        <span className="swug-review-label">What to Expect:</span>
                        <span className="swug-review-value">{formData.what_to_expect}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Validation Summary */}
              {!isStepComplete(1) || !isStepComplete(2) ? (
                <div className="swug-review-warning">
                  <X className="swug-review-warning-icon" />
                  <p>Please complete all required fields in previous steps before submitting.</p>
                </div>
              ) : (
                <div className="swug-review-success">
                  <CheckCircle className="swug-review-success-icon" />
                  <p>All required information is complete. You can submit your gig.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <InitScripts />
      <style>{isolatedStyles}</style>
      <div className="swug-page">
        <Navigation />
        <div className="swug-content-wrapper">
          <div className="swug-container">
            <div className="swug-content-grid">
              {/* Left Column - Animation */}
              <div className="swug-animation-section">
                <div className="swug-animation-wrapper">
                  <DotLottieReact
                    src="https://lottie.host/77544918-85d9-418f-9560-7b0a7478be23/Q6uZTcW8D4.lottie"
                    loop
                    autoplay
                    style={{ height: '400px', width: '400px' }}
                  />
                </div>
                <div className="swug-header">
                  <h1 className="swug-title">Post a Gig</h1>
                  <p className="swug-subtitle">
                    Share your opportunity and connect with skilled workers in your area
                  </p>
                </div>
              </div>

              {/* Right Column - Form */}
              <div>
                <div className="swug-stepper">
              {STEPS.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;
                const isCompleteState = isStepComplete(step.id);

                return (
                  <div
                    key={step.id}
                    className={`swug-step ${isActive ? 'active' : ''} ${isComplete || isCompleteState ? 'complete' : ''}`}
                  >
                    <div className="swug-step-circle">
                      {isComplete || (isCompleteState && !isActive) ? (
                        <CheckCircle className="swug-step-icon" />
                      ) : (
                        <StepIcon className="swug-step-icon" />
                      )}
                    </div>
                    <span className="swug-step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="swug-form-card">
                {renderStepContent()}

                <div className="swug-form-actions">
                  <button
                    type="button"
                    className="swug-btn swug-btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="swug-btn-icon" />
                    Previous
                  </button>

                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      className="swug-btn swug-btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext(e);
                      }}
                      disabled={!canProceed()}
                    >
                      Next
                      <ArrowRight className="swug-btn-icon" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="swug-btn swug-btn-primary"
                      disabled={!isStepComplete(1) || !isStepComplete(2)}
                    >
                      <CheckCircle className="swug-btn-icon" />
                      Submit Gig
                    </button>
                  )}
                </div>
              </div>
            </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SkilledWorkersUploadGig;
