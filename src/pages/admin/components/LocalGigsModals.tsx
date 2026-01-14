import { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Upload,
  Info,
  FileText,
  Plus,
  Eye,
  Users,
  Award,
  TrendingUp
} from "lucide-react";


const PAYMENT_TYPES = [
  { value: '', label: 'Select payment type' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'hourly', label: 'Hourly' },
];

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Gig {
  id: number | string;
  title: string;
  description?: string;
  location: string;
  employer_name: string;
  employer_phone: string;
  employer_email?: string;
  payment_amount?: number;
  payment_type?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  slots_available?: number;
  created_at?: string;
  requirements?: string;
  benefits?: string;
  what_to_expect?: string;
  verified?: boolean;
  views?: number;
  applications?: number;
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  approvedBy?: number;
  rejectedBy?: number;
}

interface Category {
  id: number | string;
  name: string;
  count: number;
  description?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddGigModalProps extends ModalProps {
  onSave: (gig: any) => void;
}

interface EditGigModalProps extends ModalProps {
  onSave: (gig: any) => void;
  gig: Gig | null;
}

interface ViewGigModalProps extends ModalProps {
  gig: Gig | null;
}

interface ApprovalModalProps extends ModalProps {
  onApprove: (id: number | string) => void;
  onReject: (id: number | string, reason: string) => void;
  gig: Gig | null;
  mode?: "approve" | "reject" | "both";
}

interface RejectConfirmModalProps extends ModalProps {
  onConfirm: (id: number | string, reason: string) => void;
  gig: Gig | null;
}

interface AddCategoryModalProps extends ModalProps {
  onSave: (category: any) => void;
}

interface EditCategoryModalProps extends ModalProps {
  onSave: (category: any) => void;
  category: Category | null;
}

interface DeleteConfirmModalProps extends ModalProps {
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "gig" | "category";
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ============================================================================
// STYLES
// ============================================================================

const modalStyles = `
  /* Modal Overlay */
  .lgm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: lgm-fadeIn 0.2s ease-out;
  }

  @keyframes lgm-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Modal Content */
  .lgm-modal-content {
    background: white;
    border-radius: 0.75rem;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: lgm-slideUp 0.3s ease-out;
    position: relative;
  }

  @keyframes lgm-slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .lgm-modal-content.sm {
    max-width: 420px;
  }

  .lgm-modal-content.md {
    max-width: 640px;
  }

  .lgm-modal-content.lg {
    max-width: 900px;
  }

  .lgm-modal-content.xl {
    max-width: 1200px;
  }

  /* Modal Header - Black Design */
  .lgm-modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #3b82f6;
    background: #111827;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .lgm-modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .lgm-modal-subtitle {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: #d1d5db;
    opacity: 0.9;
  }

  .lgm-modal-header-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .lgm-modal-profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .lgm-modal-profile-initials {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .lgm-close-btn {
    padding: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 0.375rem;
    color: #ffffff;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lgm-close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Modal Tabs */
  .lgm-modal-tabs {
    border-bottom: 2px solid #e5e7eb;
    background: #f9fafb;
    padding: 0 2rem;
    display: flex;
    gap: 0;
    overflow-x: auto;
    flex-shrink: 0;
  }

  .lgm-modal-tab {
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
    position: relative;
  }

  .lgm-modal-tab:hover {
    color: #111827;
    background: rgba(59, 130, 246, 0.05);
  }

  .lgm-modal-tab.active {
    color: #111827;
    font-weight: 600;
    border-bottom-color: #3b82f6;
  }

  .lgm-modal-tab.completed {
    color: #059669;
  }

  .lgm-tab-badge {
    background: #10b981;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    margin-left: 0.25rem;
    transition: all 0.3s ease;
  }

  .lgm-tab-badge.incomplete {
    background: #d1d5db;
    color: #6b7280;
  }

  /* Modal Body */
  .lgm-modal-body {
    padding: 2rem;
    overflow-y: auto;
    flex: 1;
    max-height: calc(90vh - 280px);
    min-height: 200px;
  }

  .lgm-tab-content {
    animation: lgm-fadeIn 0.3s ease-in-out;
  }

  /* Modal Footer */
  .lgm-modal-footer {
    padding: 1.5rem 2rem;
    border-top: 2px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background: #f9fafb;
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    z-index: 10;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  /* Form Elements */
  .lgm-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .lgm-form-group {
    display: flex;
    flex-direction: column;
  }

  .lgm-form-group.full-width {
    grid-column: 1 / -1;
  }

  .lgm-form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .lgm-form-input,
  .lgm-form-select,
  .lgm-form-textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .lgm-form-input:focus,
  .lgm-form-select:focus,
  .lgm-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .lgm-form-textarea {
    min-height: 100px;
    resize: vertical;
  }

  .lgm-form-checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .lgm-form-checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #3b82f6;
  }

  .lgm-form-checkbox-label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Buttons */
  .lgm-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .lgm-btn-primary {
    background: #3b82f6;
    color: white;
  }

  .lgm-btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .lgm-btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .lgm-btn-secondary:hover {
    background: #f9fafb;
  }

  .lgm-btn-danger {
    background: #ef4444;
    color: white;
  }

  .lgm-btn-danger:hover {
    background: #dc2626;
  }

  .lgm-btn-success {
    background: #10b981;
    color: white;
  }

  .lgm-btn-success:hover {
    background: #059669;
  }

  /* View Modal - Detail Rows */
  .lgm-detail-section {
    margin-bottom: 2rem;
  }

  .lgm-detail-section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .lgm-detail-row {
    display: flex;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
  }

  .lgm-detail-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    min-width: 140px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .lgm-detail-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
    flex: 1;
  }

  .lgm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .lgm-badge.verified {
    background: #dcfce7;
    color: #16a34a;
  }

  .lgm-badge.active {
    background: #dcfce7;
    color: #16a34a;
  }

  .lgm-badge.pending {
    background: #fef3c7;
    color: #d97706;
  }

  .lgm-badge.inactive {
    background: #fee2e2;
    color: #dc2626;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .lgm-form-grid {
      grid-template-columns: 1fr;
    }

    .lgm-modal-body {
      padding: 1.5rem;
    }

    .lgm-modal-header {
      padding: 1rem 1.5rem;
    }

    .lgm-modal-footer {
      padding: 1rem 1.5rem;
    }

    .lgm-modal-tabs {
      padding: 0 1rem;
    }

    .lgm-modal-tab {
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
    }
  }
`;

// ============================================================================
// ADD GIG MODAL
// ============================================================================

export const AddGigModal = ({ isOpen, onClose, onSave }: AddGigModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employer_name: "",
    employer_phone: "",
    employer_email: "",
    payment_amount: "",
    payment_type: "",
    duration: "",
    start_date: "",
    end_date: "",
    requirements: "",
    what_to_expect: "",
    verified: false,
  });

  if (!isOpen) return null;

  // Tab completion validation
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount as string) : null,
    });
    onClose();
    // Reset form
    setFormData({
      title: "",
      description: "",
      location: "",
      employer_name: "",
      employer_phone: "",
      employer_email: "",
      payment_amount: "",
      payment_type: "",
      duration: "",
      start_date: "",
      end_date: "",
      requirements: "",
      what_to_expect: "",
      verified: false,
    });
    setActiveTab("overview");
  };

  const tabs = [
    { id: "overview", label: "Basic Info", icon: Info, isComplete: isBasicInfoComplete },
    { id: "payment", label: "Payment & Duration", icon: DollarSign, isComplete: isPaymentComplete },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <div>
              <h2 className="lgm-modal-title">
                <Briefcase size={24} />
                Add New Gig
              </h2>
              <p className="lgm-modal-subtitle">Create a new local job gig posting</p>
            </div>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isComplete = tab.isComplete();
              return (
                <button
                  key={tab.id}
                  className={`lgm-modal-tab ${activeTab === tab.id ? "active" : ""} ${isComplete ? "completed" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                  <span className={`lgm-tab-badge ${isComplete ? "" : "incomplete"}`}>
                    {isComplete ? <CheckCircle2 size={12} /> : "!"}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lgm-modal-body">
              {activeTab === "overview" && (
                <div className="lgm-tab-content">
                  <div className="lgm-form-grid">
                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <Briefcase size={16} />
                        Gig Title *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Delivery Driver Needed"
                      />
                    </div>

                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <FileText size={16} />
                        Description
                      </label>
                      <textarea
                        className="lgm-form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the gig in detail..."
                        rows={4}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <MapPin size={16} />
                        Location *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Accra, Greater Accra"
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Building2 size={16} />
                        Employer Name *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        required
                        value={formData.employer_name}
                        onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                        placeholder="Company or individual name"
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Phone size={16} />
                        Employer Phone *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="tel"
                        required
                        value={formData.employer_phone}
                        onChange={(e) => setFormData({ ...formData, employer_phone: e.target.value })}
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Mail size={16} />
                        Employer Email
                      </label>
                      <input
                        className="lgm-form-input"
                        type="email"
                        value={formData.employer_email}
                        onChange={(e) => setFormData({ ...formData, employer_email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <FileText size={16} />
                        Requirements
                      </label>
                      <textarea
                        className="lgm-form-textarea"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="List any requirements or qualifications..."
                        rows={3}
                      />
                    </div>

                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <Info size={16} />
                        What to Expect
                      </label>
                      <textarea
                        className="lgm-form-textarea"
                        value={formData.what_to_expect}
                        onChange={(e) => setFormData({ ...formData, what_to_expect: e.target.value })}
                        placeholder="Describe what applicants can expect from this opportunity..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "payment" && (
                <div className="lgm-tab-content">
                  <div className="lgm-form-grid">
                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <DollarSign size={16} />
                        Payment Type *
                      </label>
                      <select
                        className="lgm-form-select"
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

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <DollarSign size={16} />
                        Payment Amount (₦)
                      </label>
                      <input
                        className="lgm-form-input"
                        type="number"
                        min="0"
                        value={formData.payment_amount}
                        onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                        placeholder="0.00"
                        disabled={formData.payment_type === 'negotiable'}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Clock size={16} />
                        Duration
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 2 days, 1 week, 3 months"
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Calendar size={16} />
                        Start Date
                      </label>
                      <input
                        className="lgm-form-input"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Calendar size={16} />
                        End Date
                      </label>
                      <input
                        className="lgm-form-input"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lgm-modal-footer">
              <button type="button" className="lgm-btn lgm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="lgm-btn lgm-btn-primary" disabled={!canSubmit()}>
                <CheckCircle size={16} />
                Create Gig
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// EDIT GIG MODAL
// ============================================================================

export const EditGigModal = ({ isOpen, onClose, onSave, gig }: EditGigModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employer_name: "",
    employer_phone: "",
    employer_email: "",
    payment_amount: "",
    payment_type: "",
    duration: "",
    start_date: "",
    end_date: "",
    requirements: "",
    what_to_expect: "",
  });

  // Update form data when gig changes
  useEffect(() => {
    if (gig && isOpen) {
      const gigData = gig as any;
      setFormData({
        title: gigData.title || "",
        description: gigData.description || "",
        location: gigData.location || "",
        employer_name: gigData.employer_name || "",
        employer_phone: gigData.employer_phone || "",
        employer_email: gigData.employer_email || "",
        payment_amount: gigData.payment_amount?.toString() || "",
        payment_type: gigData.payment_type || "",
        duration: gigData.duration || "",
        start_date: gigData.start_date || "",
        end_date: gigData.end_date || "",
        requirements: gigData.requirements || "",
        what_to_expect: gigData.what_to_expect || "",
      });
      setActiveTab("overview");
    }
  }, [gig, isOpen]);

  if (!isOpen || !gig) return null;

  // Tab completion validation
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...gig,
      ...formData,
      payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount as string) : null,
      // Preserve read-only fields from original gig
      views: (gig as any).views,
      applications: (gig as any).applications,
      created_at: (gig as any).created_at,
      verified: (gig as any).verified,
      status: (gig as any).status,
      slots_available: (gig as any).slots_available,
    });
    onClose();
  };

  const tabs = [
    { id: "overview", label: "Basic Info", icon: Info, isComplete: isBasicInfoComplete },
    { id: "payment", label: "Payment & Duration", icon: DollarSign, isComplete: isPaymentComplete },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <div>
              <h2 className="lgm-modal-title">
                <Briefcase size={24} />
                Edit Gig
              </h2>
              <p className="lgm-modal-subtitle">Update gig information</p>
            </div>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isComplete = tab.isComplete();
              return (
                <button
                  key={tab.id}
                  className={`lgm-modal-tab ${activeTab === tab.id ? "active" : ""} ${isComplete ? "completed" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                  <span className={`lgm-tab-badge ${isComplete ? "" : "incomplete"}`}>
                    {isComplete ? <CheckCircle2 size={12} /> : "!"}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lgm-modal-body">
              {activeTab === "overview" && (
                <div className="lgm-tab-content">
                  <div className="lgm-form-grid">
                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <Briefcase size={16} />
                        Gig Title *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <FileText size={16} />
                        Description
                      </label>
                      <textarea
                        className="lgm-form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <MapPin size={16} />
                        Location *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Building2 size={16} />
                        Employer Name *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        required
                        value={formData.employer_name}
                        onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Phone size={16} />
                        Employer Phone *
                      </label>
                      <input
                        className="lgm-form-input"
                        type="tel"
                        required
                        value={formData.employer_phone}
                        onChange={(e) => setFormData({ ...formData, employer_phone: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Mail size={16} />
                        Employer Email
                      </label>
                      <input
                        className="lgm-form-input"
                        type="email"
                        value={formData.employer_email}
                        onChange={(e) => setFormData({ ...formData, employer_email: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <FileText size={16} />
                        Requirements
                      </label>
                      <textarea
                        className="lgm-form-textarea"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="List any requirements or qualifications..."
                        rows={3}
                      />
                    </div>

                    <div className="lgm-form-group full-width">
                      <label className="lgm-form-label">
                        <Info size={16} />
                        What to Expect
                      </label>
                      <textarea
                        className="lgm-form-textarea"
                        value={formData.what_to_expect}
                        onChange={(e) => setFormData({ ...formData, what_to_expect: e.target.value })}
                        placeholder="Describe what applicants can expect from this opportunity..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "payment" && (
                <div className="lgm-tab-content">
                  <div className="lgm-form-grid">
                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <DollarSign size={16} />
                        Payment Type *
                      </label>
                      <select
                        className="lgm-form-select"
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

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <DollarSign size={16} />
                        Payment Amount (₦)
                      </label>
                      <input
                        className="lgm-form-input"
                        type="number"
                        min="0"
                        value={formData.payment_amount}
                        onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                        placeholder="Enter amount or leave empty for negotiable"
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Clock size={16} />
                        Duration
                      </label>
                      <input
                        className="lgm-form-input"
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Calendar size={16} />
                        Start Date
                      </label>
                      <input
                        className="lgm-form-input"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>

                    <div className="lgm-form-group">
                      <label className="lgm-form-label">
                        <Calendar size={16} />
                        End Date
                      </label>
                      <input
                        className="lgm-form-input"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lgm-modal-footer">
              <button type="button" className="lgm-btn lgm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="lgm-btn lgm-btn-primary" disabled={!canSubmit()}>
                <CheckCircle size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// VIEW GIG MODAL
// ============================================================================

export const ViewGigModal = ({ isOpen, onClose, gig }: ViewGigModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !gig) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Briefcase },
    { id: "employer", label: "Employer Info", icon: Building2 },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <div className="lgm-modal-header-profile">
              <div className="lgm-modal-profile-initials">{getInitials(gig.title)}</div>
              <div>
                <h2 className="lgm-modal-title">
                  {gig.title}
                </h2>
                <p className="lgm-modal-subtitle">{gig.location}</p>
              </div>
            </div>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`lgm-modal-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="lgm-modal-body">
            {activeTab === "overview" && (
              <div className="lgm-tab-content">
                <div className="lgm-detail-section">
                  <h3 className="lgm-detail-section-title">
                    Gig Information
                  </h3>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Briefcase size={16} />
                      Title
                    </span>
                    <span className="lgm-detail-value">{gig.title}</span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <MapPin size={16} />
                      Location
                    </span>
                    <span className="lgm-detail-value">{gig.location}</span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <DollarSign size={16} />
                      Estimated Pay
                    </span>
                    <span className="lgm-detail-value">
                      {gig.payment_amount ? `₦${gig.payment_amount.toLocaleString()}` : "Negotiable"} 
                      {gig.payment_type && ` (${gig.payment_type})`}
                    </span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Clock size={16} />
                      Duration
                    </span>
                    <span className="lgm-detail-value">{gig.duration || "Not specified"}</span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Calendar size={16} />
                      Start Date
                    </span>
                    <span className="lgm-detail-value">{gig.start_date || "Not specified"}</span>
                  </div>
                  {gig.end_date && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Calendar size={16} />
                        End Date
                      </span>
                      <span className="lgm-detail-value">{gig.end_date}</span>
                    </div>
                  )}
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <CheckCircle size={16} />
                      Status
                    </span>
                    <span className="lgm-detail-value">
                      <span className={`lgm-badge ${gig.status || "active"}`}>
                        {gig.status || "Active"}
                      </span>
                    </span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Eye size={16} />
                      Views
                    </span>
                    <span className="lgm-detail-value">{gig.views || 0}</span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Users size={16} />
                      Applications
                    </span>
                    <span className="lgm-detail-value">{gig.applications || 0}</span>
                  </div>
                </div>

                {gig.description && (
                  <div className="lgm-detail-section">
                    <h3 className="lgm-detail-section-title">
                      Description
                    </h3>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {gig.description}
                    </p>
                  </div>
                )}

                {gig.requirements && (
                  <div className="lgm-detail-section">
                    <h3 className="lgm-detail-section-title">
                      Requirements
                    </h3>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {gig.requirements}
                    </p>
                  </div>
                )}

                {gig.what_to_expect && (
                  <div className="lgm-detail-section">
                    <h3 className="lgm-detail-section-title">
                      What to Expect
                    </h3>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {gig.what_to_expect}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "employer" && (
              <div className="lgm-tab-content">
                <div className="lgm-detail-section">
                  <h3 className="lgm-detail-section-title">
                    Employer Information
                  </h3>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Building2 size={16} />
                      Name
                    </span>
                    <span className="lgm-detail-value">{gig.employer_name}</span>
                  </div>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <Phone size={16} />
                      Phone
                    </span>
                    <span className="lgm-detail-value">{gig.employer_phone}</span>
                  </div>
                  {gig.employer_email && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Mail size={16} />
                        Email
                      </span>
                      <span className="lgm-detail-value">{gig.employer_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lgm-modal-footer">
            <button className="lgm-btn lgm-btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// APPROVAL MODAL
// ============================================================================

export const ApprovalModal = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  gig,
  mode = "approve",
}: ApprovalModalProps) => {
  if (!isOpen || !gig) return null;

  const handleApprove = () => {
    if (gig.id) {
      onApprove(gig.id);
      onClose();
    }
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              Approve Gig
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-body">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {gig.title}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
                {gig.location}
              </p>
            </div>
            <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
              Are you sure you want to approve <strong>{gig.title}</strong>? This will make
              the gig visible to job seekers.
            </p>
            <div className="lgm-modal-footer">
              <button
                className="lgm-btn lgm-btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="lgm-btn lgm-btn-success"
                onClick={handleApprove}
              >
                <CheckCircle size={16} />
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// REJECT CONFIRM MODAL
// ============================================================================

export const RejectConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  gig,
}: RejectConfirmModalProps) => {
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !gig) return null;

  const handleConfirm = () => {
    if (gig.id && rejectReason.trim()) {
      onConfirm(gig.id, rejectReason);
      setRejectReason("");
      onClose();
    }
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              Reject Gig
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-body">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {gig.title}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
                {gig.location}
              </p>
            </div>
            <div className="lgm-form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="lgm-form-label">Rejection Reason *</label>
              <textarea
                className="lgm-form-textarea"
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
              />
            </div>
            <div className="lgm-modal-footer">
              <button
                className="lgm-btn lgm-btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="lgm-btn lgm-btn-danger"
                onClick={handleConfirm}
                disabled={!rejectReason.trim()}
              >
                <XCircle size={16} />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// ADD CATEGORY MODAL
// ============================================================================

export const AddCategoryModal = ({ isOpen, onClose, onSave }: AddCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: "", description: "" });
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              Add New Category
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lgm-modal-body">
              <div className="lgm-form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="lgm-form-label">Category Name *</label>
                <input
                  className="lgm-form-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Delivery Services"
                />
              </div>

              <div className="lgm-form-group">
                <label className="lgm-form-label">Description (Optional)</label>
                <textarea
                  className="lgm-form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                />
              </div>
            </div>

            <div className="lgm-modal-footer">
              <button type="button" className="lgm-btn lgm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="lgm-btn lgm-btn-primary">
                <CheckCircle size={16} />
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// EDIT CATEGORY MODAL
// ============================================================================

export const EditCategoryModal = ({ isOpen, onClose, onSave, category }: EditCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });

  if (!isOpen || !category) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...category, ...formData });
    onClose();
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              Edit Category
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lgm-modal-body">
              <div className="lgm-form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="lgm-form-label">Category Name *</label>
                <input
                  className="lgm-form-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="lgm-form-group">
                <label className="lgm-form-label">Description (Optional)</label>
                <textarea
                  className="lgm-form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                />
              </div>
            </div>

            <div className="lgm-modal-footer">
              <button type="button" className="lgm-btn lgm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="lgm-btn lgm-btn-primary">
                <CheckCircle size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              {title}
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-body">
            <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>{message}</p>
          </div>

          <div className="lgm-modal-footer">
            <button className="lgm-btn lgm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="lgm-btn lgm-btn-danger" onClick={onConfirm}>
              <XCircle size={16} />
              Delete {type === "gig" ? "Gig" : "Category"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
