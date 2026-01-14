import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  CreditCard,
  Calendar,
  Building2,
  Phone,
  Mail,
  FileText,
  Info,
  X,
  CheckCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const PAYMENT_TYPES = [
  { value: '', label: 'Select payment type' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'negotiable', label: 'Negotiable' },
];

const PostNewGig: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'payment'>('basic');
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

  const isBasicInfoComplete = () => {
    return !!(
      formData.title &&
      formData.location &&
      formData.employer_name &&
      formData.employer_phone
    );
  };

  const isPaymentComplete = () => {
    return !!(formData.payment_type && (formData.payment_amount || formData.payment_type === 'negotiable'));
  };

  const canSubmit = () => {
    return isBasicInfoComplete() && isPaymentComplete();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;

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

      // Success - navigate back to gig listings
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

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info', icon: Info, isComplete: isBasicInfoComplete },
    { id: 'payment' as const, label: 'Payment', icon: CreditCard, isComplete: isPaymentComplete },
  ];

  return (
    <>
      <style>{`
        .epnj-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-header {
          margin-bottom: 2rem;
        }

        .epnj-header-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .epnj-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          color: #566a7f;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .epnj-back-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .epnj-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-subtitle {
          font-size: 0.9375rem;
          color: #54577A;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-card {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          overflow: hidden;
        }

        .epnj-tabs {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eceef1;
          background: #fff;
        }

        .epnj-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #54577A;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }

        .epnj-tab:hover {
          background: #f5f5f9;
          color: #141522;
        }

        .epnj-tab.active {
          background: rgba(105, 108, 255, 0.1);
          color: #696cff;
        }

        .epnj-tab-badge {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          background: #e4e6ef;
          color: #8e92bc;
        }

        .epnj-tab.completed .epnj-tab-badge {
          background: #71dd37;
          color: #fff;
        }

        .epnj-tab.active .epnj-tab-badge {
          background: #696cff;
          color: #fff;
        }

        .epnj-form-container {
          padding: 2rem 1.5rem;
        }

        .epnj-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .epnj-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .epnj-form-group.full-width {
          grid-column: 1 / -1;
        }

        .epnj-form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .epnj-form-label-icon {
          width: 1rem;
          height: 1rem;
          color: #54577A;
        }

        .epnj-form-label-required {
          color: #ff3e1d;
          font-size: 0.75rem;
        }

        .epnj-form-input,
        .epnj-form-textarea,
        .epnj-form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background: #fff;
        }

        .epnj-form-input:focus,
        .epnj-form-textarea:focus,
        .epnj-form-select:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .epnj-form-input:disabled {
          background: #f5f5f9;
          color: #8e92bc;
          cursor: not-allowed;
        }

        .epnj-form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .epnj-requirements-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .epnj-requirement-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .epnj-requirement-number {
          width: 1.75rem;
          height: 1.75rem;
          flex-shrink: 0;
          border-radius: 50%;
          background: #696cff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-requirement-input {
          flex: 1;
        }

        .epnj-requirement-remove {
          background: none;
          border: none;
          color: #ff3e1d;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          transition: background 0.2s ease;
        }

        .epnj-requirement-remove:hover {
          background: rgba(255, 62, 29, 0.1);
        }

        .epnj-add-requirement {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1.5px dashed #d9dee3;
          border-radius: 0.5rem;
          background: transparent;
          color: #54577A;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .epnj-add-requirement:hover {
          border-color: #696cff;
          color: #696cff;
          background: rgba(105, 108, 255, 0.05);
        }

        .epnj-form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-top: 1px solid #eceef1;
          background: #fff;
        }

        .epnj-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .epnj-btn-primary {
          background: #696cff;
          color: #fff;
        }

        .epnj-btn-primary:hover:not(:disabled) {
          background: #5a5de0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
        }

        .epnj-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .epnj-btn-secondary {
          background: #f5f5f9;
          color: #141522;
          border: 1px solid #d9dee3;
        }

        .epnj-btn-secondary:hover {
          background: #eceef1;
        }
      `}</style>
      <div className="epnj-page">
        <div className="epnj-header">
          <div className="epnj-header-top">
            <button 
              className="epnj-back-btn"
              onClick={() => navigate('/employer/gigs-listing/all')}
            >
              <ArrowLeft size={16} />
              Back to Gigs
            </button>
          </div>
          <h1 className="epnj-title">Post New Gig</h1>
          <p className="epnj-subtitle">Create a new gig listing for workers to apply</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="epnj-card">
            <div className="epnj-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isComplete = tab.isComplete();
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`epnj-tab ${activeTab === tab.id ? 'active' : ''} ${isComplete ? 'completed' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={16} />
                    {tab.label}
                    <span className="epnj-tab-badge">
                      {isComplete ? <CheckCircle2 size={12} /> : '!'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="epnj-form-container">
              {activeTab === 'basic' && (
                <div className="epnj-form-grid">
                  <div className="epnj-form-group full-width">
                    <label className="epnj-form-label">
                      <Briefcase className="epnj-form-label-icon" />
                      Gig Title
                      <span className="epnj-form-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="epnj-form-input"
                      placeholder="e.g., Delivery Driver Needed"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="epnj-form-group full-width">
                    <label className="epnj-form-label">
                      <FileText className="epnj-form-label-icon" />
                      Description
                    </label>
                    <textarea
                      className="epnj-form-textarea"
                      placeholder="Describe the gig in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <MapPin className="epnj-form-label-icon" />
                      Location
                      <span className="epnj-form-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="epnj-form-input"
                      placeholder="e.g., Accra, Greater Accra"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <Building2 className="epnj-form-label-icon" />
                      Your Name / Company
                      <span className="epnj-form-label-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="epnj-form-input"
                      placeholder="Company or individual name"
                      value={formData.employer_name}
                      onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <Phone className="epnj-form-label-icon" />
                      Phone Number
                      <span className="epnj-form-label-required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="epnj-form-input"
                      placeholder="+233 XX XXX XXXX"
                      value={formData.employer_phone}
                      onChange={(e) => setFormData({ ...formData, employer_phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <Mail className="epnj-form-label-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="epnj-form-input"
                      placeholder="email@example.com"
                      value={formData.employer_email}
                      onChange={(e) => setFormData({ ...formData, employer_email: e.target.value })}
                    />
                  </div>

                  <div className="epnj-form-group full-width">
                    <label className="epnj-form-label">Requirements (each point)</label>
                    <div className="epnj-requirements-list">
                      {requirements.map((req, index) => (
                        <div key={index} className="epnj-requirement-item">
                          <div className="epnj-requirement-number">{index + 1}</div>
                          <input
                            type="text"
                            className="epnj-form-input epnj-requirement-input"
                            placeholder="Enter a requirement"
                            value={req}
                            onChange={(e) => updateRequirement(index, e.target.value)}
                          />
                          {requirements.length > 1 && (
                            <button
                              type="button"
                              className="epnj-requirement-remove"
                              onClick={() => removeRequirement(index)}
                              aria-label="Remove requirement"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="epnj-add-requirement"
                      onClick={addRequirement}
                    >
                      <span>+</span>
                      Add Requirement
                    </button>
                  </div>

                  <div className="epnj-form-group full-width">
                    <label className="epnj-form-label">
                      <Info className="epnj-form-label-icon" />
                      What to Expect
                    </label>
                    <textarea
                      className="epnj-form-textarea"
                      placeholder="Describe what applicants can expect from this opportunity..."
                      value={formData.what_to_expect}
                      onChange={(e) => setFormData({ ...formData, what_to_expect: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="epnj-form-grid">
                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <CreditCard className="epnj-form-label-icon" />
                      Payment Type
                      <span className="epnj-form-label-required">*</span>
                    </label>
                    <select
                      className="epnj-form-select"
                      required
                      value={formData.payment_type}
                      onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                    >
                      {PAYMENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <CreditCard className="epnj-form-label-icon" />
                      Payment Amount (GHS)
                    </label>
                    <input
                      type="number"
                      className="epnj-form-input"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.payment_amount}
                      onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                      disabled={formData.payment_type === 'negotiable' || !formData.payment_type}
                    />
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <Calendar className="epnj-form-label-icon" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="epnj-form-input"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>

                  <div className="epnj-form-group">
                    <label className="epnj-form-label">
                      <Calendar className="epnj-form-label-icon" />
                      End Date
                    </label>
                    <input
                      type="date"
                      className="epnj-form-input"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="epnj-form-footer">
              <button
                type="button"
                className="epnj-btn epnj-btn-secondary"
                onClick={() => navigate('/employer/gigs-listing/all')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="epnj-btn epnj-btn-primary"
                disabled={!canSubmit() || submitting}
              >
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Post Gig
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostNewGig;
