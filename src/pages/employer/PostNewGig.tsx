import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Building2
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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

const PostNewGig: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
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
        return isStepComplete(1) && isStepComplete(2);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed() || !isStepComplete(1) || !isStepComplete(2)) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('local_job_gigs' as any)
        .insert({
          title: formData.title,
          description: formData.description || null,
          location: formData.location,
          employer_name: formData.employer_name,
          employer_phone: formData.employer_phone,
          employer_email: formData.employer_email || null,
          payment_type: formData.payment_type,
          payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          requirements: formData.requirements || null,
          what_to_expect: formData.what_to_expect || null,
          status: 'pending',
          verified: false,
          views: 0,
          applications: 0,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      navigate('/employer/gigs-listing/all', { 
        state: { message: 'Gig posted successfully! It will be reviewed before going live.' } 
      });
    } catch (error: any) {
      console.error('Error posting gig:', error);
      alert('Error posting gig. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isolatedStyles = `
    .epng-page {
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 2rem;
      background: #f5f5f9;
      min-height: calc(100vh - 4rem);
    }

    .epng-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .epng-content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: start;
    }

    @media (min-width: 1200px) {
      .epng-content-grid {
        grid-template-columns: 5fr 7fr;
        gap: 4rem;
        align-items: center;
      }
    }

    .epng-animation-section {
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
      .epng-animation-section {
        position: sticky;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .epng-animation-wrapper {
      width: 100%;
      max-width: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .epng-header {
      text-align: center;
      margin-top: 2rem;
    }

    @media (min-width: 1200px) {
      .epng-header {
        text-align: left;
        margin-top: 1.5rem;
      }
    }

    .epng-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.75rem 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-subtitle {
      font-size: 1.125rem;
      color: hsl(220 20% 40%);
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      line-height: 1.6;
    }

    .epng-stepper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      position: relative;
    }

    .epng-stepper::before {
      content: '';
      position: absolute;
      top: 1.5rem;
      left: 0;
      right: 0;
      height: 2px;
      background: hsl(220 13% 91%);
      z-index: 0;
    }

    .epng-step {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .epng-step-circle {
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

    .epng-step.active .epng-step-circle {
      border-color: #696cff;
      background: #696cff;
      color: white;
      box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
    }

    .epng-step.complete .epng-step-circle {
      border-color: #71dd37;
      background: #71dd37;
      color: white;
    }

    .epng-step-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .epng-step-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: color 0.3s ease;
    }

    .epng-step.active .epng-step-label {
      color: #696cff;
    }

    .epng-step.complete .epng-step-label {
      color: #71dd37;
    }

    .epng-form-card {
      background: white;
      border: 1px solid #d9dee3;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .epng-form-group {
      margin-bottom: 1.5rem;
    }

    .epng-form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #141522;
      margin-bottom: 0.5rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-form-label-icon {
      width: 1rem;
      height: 1rem;
      color: #54577A;
    }

    .epng-form-label-required {
      color: #ff3e1d;
      margin-left: 0.25rem;
    }

    .epng-form-input,
    .epng-form-select,
    .epng-form-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #d9dee3;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #141522;
      background: white;
      transition: all 0.2s ease;
    }

    .epng-form-input:focus,
    .epng-form-select:focus,
    .epng-form-textarea:focus {
      outline: none;
      border-color: #696cff;
      box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
    }

    .epng-form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .epng-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .epng-form-group.full-width {
      grid-column: 1 / -1;
    }

    .epng-requirements-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .epng-requirement-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .epng-requirement-number {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #696cff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      flex-shrink: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-requirement-input {
      flex: 1;
    }

    .epng-requirement-remove {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      border: 1.5px solid #d9dee3;
      background: white;
      color: #54577A;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .epng-requirement-remove:hover {
      border-color: #ff3e1d;
      color: #ff3e1d;
      background: #fff5f5;
    }

    .epng-add-requirement {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1.5px dashed #d9dee3;
      border-radius: 0.5rem;
      background: #f5f5f9;
      color: #54577A;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin-top: 0.5rem;
    }

    .epng-add-requirement:hover {
      border-color: #696cff;
      color: #696cff;
      background: rgba(105, 108, 255, 0.05);
    }

    .epng-form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid #eceef1;
    }

    .epng-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .epng-btn-primary {
      background: #696cff;
      color: white;
    }

    .epng-btn-primary:hover:not(:disabled) {
      background: #5a5de0;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
    }

    .epng-btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .epng-btn-secondary {
      background: white;
      color: #141522;
      border: 1.5px solid #d9dee3;
    }

    .epng-btn-secondary:hover:not(:disabled) {
      background: #f5f5f9;
      border-color: #54577A;
    }

    .epng-btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .epng-btn-icon {
      width: 1rem;
      height: 1rem;
    }

    .epng-review-section {
      width: 100%;
    }

    .epng-review-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .epng-review-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #141522;
      margin: 0 0 0.5rem 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-subtitle {
      font-size: 1rem;
      color: #54577A;
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .epng-review-card {
      background: white;
      border: 1.5px solid #eceef1;
      border-radius: 0.75rem;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .epng-review-card:hover {
      border-color: #696cff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .epng-review-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eceef1;
    }

    .epng-review-card-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: #696cff;
    }

    .epng-review-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #141522;
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .epng-review-item {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 1rem;
      align-items: start;
    }

    .epng-review-item.full-width {
      grid-template-columns: 1fr;
      flex-direction: column;
    }

    .epng-review-label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #54577A;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-value {
      font-size: 0.9375rem;
      color: #141522;
      line-height: 1.6;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-list {
      margin: 0.5rem 0 0 0;
      padding-left: 1.5rem;
      list-style-type: disc;
    }

    .epng-review-list li {
      margin-bottom: 0.5rem;
      color: #141522;
      font-size: 0.9375rem;
      line-height: 1.6;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-warning,
    .epng-review-success {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .epng-review-warning {
      background: #fff5f5;
      border: 1.5px solid #ffe0e0;
      color: #ff3e1d;
    }

    .epng-review-warning-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .epng-review-success {
      background: #f0fdf4;
      border: 1.5px solid #bbf7d0;
      color: #16a34a;
    }

    .epng-review-success-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    @media (max-width: 767px) {
      .epng-page {
        padding: 1rem;
      }

      .epng-content-grid {
        gap: 2rem;
      }

      .epng-animation-wrapper {
        max-width: 280px;
      }

      .epng-title {
        font-size: 1.75rem;
      }

      .epng-subtitle {
        font-size: 1rem;
      }

      .epng-stepper {
        margin-bottom: 2rem;
      }

      .epng-step-circle {
        width: 2.5rem;
        height: 2.5rem;
      }

      .epng-step-label {
        font-size: 0.75rem;
      }

      .epng-form-card {
        padding: 1.5rem;
      }

      .epng-form-grid {
        grid-template-columns: 1fr;
      }

      .epng-form-actions {
        flex-direction: column-reverse;
        gap: 1rem;
      }

      .epng-btn {
        width: 100%;
        justify-content: center;
      }

      .epng-review-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .epng-review-label {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
    }
  `;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="epng-form-group">
              <label className="epng-form-label">
                <Briefcase className="epng-form-label-icon" />
                Gig Title
                <span className="epng-form-label-required">*</span>
              </label>
              <input
                type="text"
                className="epng-form-input"
                placeholder="e.g., Event Setup Assistant"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="epng-form-group">
              <label className="epng-form-label">
                <FileText className="epng-form-label-icon" />
                Description
              </label>
              <textarea
                className="epng-form-textarea"
                placeholder="Describe the gig in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="epng-form-grid">
              <div className="epng-form-group">
                <label className="epng-form-label">
                  <MapPin className="epng-form-label-icon" />
                  Location
                  <span className="epng-form-label-required">*</span>
                </label>
                <input
                  type="text"
                  className="epng-form-input"
                  placeholder="e.g., Accra, Greater Accra"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="epng-form-group">
                <label className="epng-form-label">
                  <Building2 className="epng-form-label-icon" />
                  Your Name / Company
                  <span className="epng-form-label-required">*</span>
                </label>
                <input
                  type="text"
                  className="epng-form-input"
                  placeholder="Company or individual name"
                  value={formData.employer_name}
                  onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                  required
                />
              </div>

              <div className="epng-form-group">
                <label className="epng-form-label">
                  <Phone className="epng-form-label-icon" />
                  Phone Number
                  <span className="epng-form-label-required">*</span>
                </label>
                <input
                  type="tel"
                  className="epng-form-input"
                  placeholder="+233 XX XXX XXXX"
                  value={formData.employer_phone}
                  onChange={(e) => setFormData({ ...formData, employer_phone: e.target.value })}
                  required
                />
              </div>

              <div className="epng-form-group">
                <label className="epng-form-label">
                  <Mail className="epng-form-label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="epng-form-input"
                  placeholder="your@email.com"
                  value={formData.employer_email}
                  onChange={(e) => setFormData({ ...formData, employer_email: e.target.value })}
                />
              </div>
            </div>

            <div className="epng-form-group">
              <label className="epng-form-label">
                <FileText className="epng-form-label-icon" />
                Requirements
              </label>
              <div className="epng-requirements-list">
                {requirements.map((req, index) => (
                  <div key={index} className="epng-requirement-item">
                    <div className="epng-requirement-number">{index + 1}</div>
                    <input
                      type="text"
                      className="epng-form-input epng-requirement-input"
                      placeholder="Enter a requirement"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        className="epng-requirement-remove"
                        onClick={() => removeRequirement(index)}
                        aria-label="Remove requirement"
                      >
                        <X className="epng-btn-icon" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="epng-add-requirement"
                onClick={addRequirement}
              >
                <span>+</span>
                Add Requirement
              </button>
            </div>

            <div className="epng-form-group">
              <label className="epng-form-label">
                <FileText className="epng-form-label-icon" />
                What to Expect
              </label>
              <textarea
                className="epng-form-textarea"
                placeholder="Tell applicants what they can expect from this gig..."
                value={formData.what_to_expect}
                onChange={(e) => setFormData({ ...formData, what_to_expect: e.target.value })}
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="epng-form-grid">
              <div className="epng-form-group full-width">
                <label className="epng-form-label">
                  <CreditCard className="epng-form-label-icon" />
                  Payment Type
                  <span className="epng-form-label-required">*</span>
                </label>
                <select
                  className="epng-form-select"
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

              <div className="epng-form-group">
                <label className="epng-form-label">
                  <CreditCard className="epng-form-label-icon" />
                  Payment Amount (GHS)
                </label>
                <input
                  type="number"
                  className="epng-form-input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.payment_amount}
                  onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                  disabled={formData.payment_type === 'negotiable'}
                />
              </div>

              <div className="epng-form-group">
                <label className="epng-form-label">
                  <Calendar className="epng-form-label-icon" />
                  Start Date
                </label>
                <input
                  type="date"
                  className="epng-form-input"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="epng-form-group">
                <label className="epng-form-label">
                  <Calendar className="epng-form-label-icon" />
                  End Date
                </label>
                <input
                  type="date"
                  className="epng-form-input"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <div className="epng-review-section">
            <div className="epng-review-header">
              <h3 className="epng-review-title">Review Your Gig Details</h3>
              <p className="epng-review-subtitle">Please review all information before submitting</p>
            </div>

            <div className="epng-review-content">
              <div className="epng-review-card">
                <div className="epng-review-card-header">
                  <FileText className="epng-review-card-icon" />
                  <h4 className="epng-review-card-title">Basic Information</h4>
                </div>
                <div className="epng-review-details">
                  <div className="epng-review-item">
                    <span className="epng-review-label">Gig Title:</span>
                    <span className="epng-review-value">{formData.title || 'Not provided'}</span>
                  </div>
                  {formData.description && (
                    <div className="epng-review-item">
                      <span className="epng-review-label">Description:</span>
                      <span className="epng-review-value">{formData.description}</span>
                    </div>
                  )}
                  <div className="epng-review-item">
                    <span className="epng-review-label">Location:</span>
                    <span className="epng-review-value">{formData.location || 'Not provided'}</span>
                  </div>
                  <div className="epng-review-item">
                    <span className="epng-review-label">Your Name:</span>
                    <span className="epng-review-value">{formData.employer_name || 'Not provided'}</span>
                  </div>
                  <div className="epng-review-item">
                    <span className="epng-review-label">Phone:</span>
                    <span className="epng-review-value">{formData.employer_phone || 'Not provided'}</span>
                  </div>
                  {formData.employer_email && (
                    <div className="epng-review-item">
                      <span className="epng-review-label">Email:</span>
                      <span className="epng-review-value">{formData.employer_email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="epng-review-card">
                <div className="epng-review-card-header">
                  <CreditCard className="epng-review-card-icon" />
                  <h4 className="epng-review-card-title">Payment Information</h4>
                </div>
                <div className="epng-review-details">
                  <div className="epng-review-item">
                    <span className="epng-review-label">Payment Type:</span>
                    <span className="epng-review-value">
                      {formData.payment_type ? PAYMENT_TYPES.find(t => t.value === formData.payment_type)?.label : 'Not provided'}
                    </span>
                  </div>
                  {formData.payment_type !== 'negotiable' && formData.payment_amount && (
                    <div className="epng-review-item">
                      <span className="epng-review-label">Amount:</span>
                      <span className="epng-review-value">GHS {formData.payment_amount}</span>
                    </div>
                  )}
                  {formData.start_date && (
                    <div className="epng-review-item">
                      <span className="epng-review-label">Start Date:</span>
                      <span className="epng-review-value">{new Date(formData.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {formData.end_date && (
                    <div className="epng-review-item">
                      <span className="epng-review-label">End Date:</span>
                      <span className="epng-review-value">{new Date(formData.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {(formData.requirements || formData.what_to_expect) && (
                <div className="epng-review-card">
                  <div className="epng-review-card-header">
                    <Briefcase className="epng-review-card-icon" />
                    <h4 className="epng-review-card-title">Additional Details</h4>
                  </div>
                  <div className="epng-review-details">
                    {formData.requirements && (
                      <div className="epng-review-item full-width">
                        <span className="epng-review-label">Requirements:</span>
                        <ul className="epng-review-list">
                          {formData.requirements.split('\n').filter(Boolean).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formData.what_to_expect && (
                      <div className="epng-review-item full-width">
                        <span className="epng-review-label">What to Expect:</span>
                        <span className="epng-review-value">{formData.what_to_expect}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isStepComplete(1) || !isStepComplete(2) ? (
                <div className="epng-review-warning">
                  <X className="epng-review-warning-icon" />
                  <p>Please complete all required fields in previous steps before submitting.</p>
                </div>
              ) : (
                <div className="epng-review-success">
                  <CheckCircle className="epng-review-success-icon" />
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
      <style>{isolatedStyles}</style>
      <div className="epng-page">
        <div className="epng-container">
          <div className="epng-content-grid">
            {/* Left Column - Animation */}
            <div className="epng-animation-section">
              <div className="epng-animation-wrapper">
                <DotLottieReact
                  src="https://lottie.host/77544918-85d9-418f-9560-7b0a7478be23/Q6uZTcW8D4.lottie"
                  loop
                  autoplay
                  style={{ height: '400px', width: '400px' }}
                />
              </div>
              <div className="epng-header">
                <h1 className="epng-title">Post a Gig</h1>
                <p className="epng-subtitle">
                  Share your opportunity and connect with skilled workers in your area
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <div className="epng-stepper">
                {STEPS.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isComplete = currentStep > step.id;
                  const isCompleteState = isStepComplete(step.id);

                  return (
                    <div
                      key={step.id}
                      className={`epng-step ${isActive ? 'active' : ''} ${isComplete || isCompleteState ? 'complete' : ''}`}
                    >
                      <div className="epng-step-circle">
                        {isComplete || (isCompleteState && !isActive) ? (
                          <CheckCircle className="epng-step-icon" />
                        ) : (
                          <StepIcon className="epng-step-icon" />
                        )}
                      </div>
                      <span className="epng-step-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="epng-form-card">
                  {renderStepContent()}

                  <div className="epng-form-actions">
                    <button
                      type="button"
                      className="epng-btn epng-btn-secondary"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="epng-btn-icon" />
                      Previous
                    </button>

                    {currentStep < STEPS.length ? (
                      <button
                        type="button"
                        className="epng-btn epng-btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNext(e);
                        }}
                        disabled={!canProceed()}
                      >
                        Next
                        <ArrowRight className="epng-btn-icon" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="epng-btn epng-btn-primary"
                        disabled={!isStepComplete(1) || !isStepComplete(2) || submitting}
                      >
                        {submitting ? 'Submitting...' : (
                          <>
                            <CheckCircle className="epng-btn-icon" />
                            Submit Gig
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostNewGig;