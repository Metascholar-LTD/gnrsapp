import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Award,
  Image as ImageIcon,
  MessageSquare,
  DollarSign,
  Calendar,
  Shield,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Upload,
  Clock,
  TrendingUp,
  Info,
  FileText,
  Plus
} from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Worker {
  id: number;
  name: string;
  category: string;
  location: string;
  rating?: number;
  reviews?: number;
  phone: string;
  email: string;
  verified?: boolean;
  status?: string;
  joinedDate?: string;
  completedJobs?: number;
  about?: string;
  services?: Array<{ name: string; price: string }>;
  portfolio?: string[];
  yearsExperience?: number;
  responseTime?: string;
  badges?: string[];
}

interface Category {
  id: number;
  name: string;
  count: number;
  description?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddWorkerModalProps extends ModalProps {
  onSave: (worker: any) => void;
}

interface EditWorkerModalProps extends ModalProps {
  onSave: (worker: any) => void;
  worker: Worker | null;
}

interface ViewWorkerModalProps extends ModalProps {
  worker: Worker | null;
}

interface ApprovalModalProps extends ModalProps {
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  worker: Worker | null;
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
  type?: "worker" | "category";
}

// ============================================================================
// STYLES
// ============================================================================

const modalStyles = `
  /* Modal Overlay */
  .swm-modal-overlay {
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
    animation: swm-fadeIn 0.2s ease-out;
  }

  @keyframes swm-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Modal Content */
  .swm-modal-content {
    background: white;
    border-radius: 0.75rem;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: swm-slideUp 0.3s ease-out;
  }

  @keyframes swm-slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .swm-modal-content.sm {
    max-width: 420px;
  }

  .swm-modal-content.md {
    max-width: 640px;
  }

  .swm-modal-content.lg {
    max-width: 900px;
  }

  .swm-modal-content.xl {
    max-width: 1200px;
  }

  /* Modal Header - Black Design */
  .swm-modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #3b82f6;
    background: #111827;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .swm-modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .swm-modal-subtitle {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: #d1d5db;
    opacity: 0.9;
  }

  .swm-close-btn {
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

  .swm-close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Modal Tabs */
  .swm-modal-tabs {
    border-bottom: 2px solid #e5e7eb;
    background: #f9fafb;
    padding: 0 2rem;
    display: flex;
    gap: 0;
    overflow-x: auto;
    flex-shrink: 0;
  }

  .swm-modal-tab {
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
  }

  .swm-modal-tab:hover {
    color: #111827;
    background: rgba(59, 130, 246, 0.05);
  }

  .swm-modal-tab.active {
    color: #111827;
    font-weight: 600;
    border-bottom-color: #3b82f6;
  }

  /* Modal Body */
  .swm-modal-body {
    padding: 2rem;
    overflow-y: auto;
    flex: 1;
  }

  .swm-tab-content {
    animation: swm-fadeIn 0.3s ease-in-out;
  }

  /* Modal Footer */
  .swm-modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background: #f9fafb;
    flex-shrink: 0;
  }

  /* Form Elements */
  .swm-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .swm-form-group {
    display: flex;
    flex-direction: column;
  }

  .swm-form-group.full-width {
    grid-column: 1 / -1;
  }

  .swm-form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swm-form-input,
  .swm-form-select,
  .swm-form-textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .swm-form-input:focus,
  .swm-form-select:focus,
  .swm-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .swm-form-textarea {
    min-height: 100px;
    resize: vertical;
  }

  .swm-form-checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .swm-form-checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #3b82f6;
  }

  .swm-form-checkbox-label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Buttons */
  .swm-btn {
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

  .swm-btn-primary {
    background: #3b82f6;
    color: white;
  }

  .swm-btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .swm-btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .swm-btn-secondary:hover {
    background: #f9fafb;
  }

  .swm-btn-danger {
    background: #ef4444;
    color: white;
  }

  .swm-btn-danger:hover {
    background: #dc2626;
  }

  .swm-btn-success {
    background: #10b981;
    color: white;
  }

  .swm-btn-success:hover {
    background: #059669;
  }

  /* View Modal - Detail Rows */
  .swm-detail-section {
    margin-bottom: 2rem;
  }

  .swm-detail-section-title {
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

  .swm-detail-row {
    display: flex;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
  }

  .swm-detail-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    min-width: 140px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swm-detail-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
    flex: 1;
  }

  .swm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .swm-badge.verified {
    background: #dcfce7;
    color: #16a34a;
  }

  .swm-badge.active {
    background: #dcfce7;
    color: #16a34a;
  }

  .swm-badge.pending {
    background: #fef3c7;
    color: #d97706;
  }

  .swm-badge.inactive {
    background: #fee2e2;
    color: #dc2626;
  }

  .swm-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .swm-star {
    width: 16px;
    height: 16px;
    color: #fbbf24;
    fill: #fbbf24;
  }

  /* Services Grid */
  .swm-services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .swm-service-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.2s;
    position: relative;
  }

  .swm-service-card:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .swm-service-name {
    font-weight: 600;
    color: #111827;
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
  }

  .swm-service-price {
    font-size: 1rem;
    font-weight: 700;
    color: #3b82f6;
    margin: 0;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .swm-service-remove {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    display: none;
  }

  .swm-service-card:hover .swm-service-remove {
    display: block;
  }

  /* Portfolio Grid */
  .swm-portfolio-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .swm-portfolio-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }

  .swm-portfolio-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swm-portfolio-remove {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .swm-portfolio-item:hover .swm-portfolio-remove {
    opacity: 1;
  }

  /* Reviews */
  .swm-review {
    padding: 1.25rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
  }

  .swm-review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .swm-reviewer-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .swm-reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e5e7eb;
  }

  .swm-reviewer-name {
    font-weight: 600;
    color: #111827;
    font-size: 0.875rem;
    margin: 0;
  }

  .swm-review-date {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .swm-review-text {
    color: #374151;
    line-height: 1.6;
    margin: 0;
    font-size: 0.875rem;
  }

  /* Upload Area */
  .swm-upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .swm-upload-area:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .swm-upload-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    color: #9ca3af;
  }

  .swm-upload-text {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  /* Service Input Row */
  .swm-service-input-row {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .swm-form-grid {
      grid-template-columns: 1fr;
    }

    .swm-modal-body {
      padding: 1.5rem;
    }

    .swm-modal-header {
      padding: 1rem 1.5rem;
    }

    .swm-modal-footer {
      padding: 1rem 1.5rem;
    }

    .swm-modal-tabs {
      padding: 0 1rem;
    }

    .swm-modal-tab {
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
    }

    .swm-portfolio-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .swm-services-grid {
      grid-template-columns: 1fr;
    }

    .swm-service-input-row {
      grid-template-columns: 1fr;
    }
  }
`;

// ============================================================================
// ADD WORKER MODAL
// ============================================================================

export const AddWorkerModal = ({ isOpen, onClose, onSave }: AddWorkerModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    about: "",
    yearsExperience: "",
    verified: false,
    services: [] as Array<{ name: string; price: string }>,
    portfolio: [] as string[],
  });

  const [newService, setNewService] = useState({ name: "", price: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      name: "",
      category: "",
      location: "",
      phone: "",
      email: "",
      about: "",
      yearsExperience: "",
      verified: false,
      services: [],
      portfolio: [],
    });
    setActiveTab("overview");
    setNewService({ name: "", price: "" });
  };

  const addService = () => {
    if (newService.name && newService.price) {
      setFormData({
        ...formData,
        services: [...formData.services, newService]
      });
      setNewService({ name: "", price: "" });
    }
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const tabs = [
    { id: "overview", label: "Basic Info", icon: Info },
    { id: "services", label: "Services & Pricing", icon: DollarSign },
    { id: "portfolio", label: "Portfolio", icon: ImageIcon },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <div>
              <h2 className="swm-modal-title">
                <User size={24} />
                Add New Worker
              </h2>
              <p className="swm-modal-subtitle">Create a new worker profile</p>
            </div>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="swm-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`swm-modal-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="swm-modal-body">
              {activeTab === "overview" && (
                <div className="swm-tab-content">
                  <div className="swm-form-grid">
                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <User size={16} />
                        Full Name *
                      </label>
                      <input
                        className="swm-form-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Briefcase size={16} />
                        Category *
                      </label>
                      <select
                        className="swm-form-select"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Mason">Mason</option>
                        <option value="Welder">Welder</option>
                        <option value="Painter">Painter</option>
                        <option value="Tailor">Tailor</option>
                        <option value="Barber">Barber</option>
                        <option value="Hairdresser">Hairdresser</option>
                        <option value="Auto Mechanic">Auto Mechanic</option>
                        <option value="Caterer">Caterer</option>
                        <option value="Cleaner">Cleaner</option>
                      </select>
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Phone size={16} />
                        Phone Number *
                      </label>
                      <input
                        className="swm-form-input"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        className="swm-form-input"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="worker@example.com"
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <MapPin size={16} />
                        Location *
                      </label>
                      <input
                        className="swm-form-input"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Region"
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Award size={16} />
                        Years of Experience
                      </label>
                      <input
                        className="swm-form-input"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                        placeholder="0"
                      />
                    </div>

                    <div className="swm-form-group full-width">
                      <label className="swm-form-label">
                        <MessageSquare size={16} />
                        About / Bio
                      </label>
                      <textarea
                        className="swm-form-textarea"
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                        placeholder="Brief description about the worker..."
                        rows={4}
                      />
                    </div>

                    <div className="swm-form-group full-width">
                      <div className="swm-form-checkbox-group">
                        <input
                          className="swm-form-checkbox"
                          type="checkbox"
                          id="verified"
                          checked={formData.verified}
                          onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                        />
                        <label className="swm-form-checkbox-label" htmlFor="verified">
                          <Shield size={16} />
                          Mark as verified
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div className="swm-tab-content">
                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <DollarSign size={20} />
                      Add New Service
                    </h3>
                    <div className="swm-service-input-row">
                      <input
                        className="swm-form-input"
                        type="text"
                        placeholder="Service name (e.g., Basic Repair)"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      />
                      <input
                        className="swm-form-input"
                        type="text"
                        placeholder="Price (e.g., GHS 200+)"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      />
                      <button
                        type="button"
                        className="swm-btn swm-btn-primary"
                        onClick={addService}
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>

                  {formData.services.length > 0 && (
                    <div className="swm-detail-section">
                      <h3 className="swm-detail-section-title">
                        <Briefcase size={20} />
                        Services ({formData.services.length})
                      </h3>
                      <div className="swm-services-grid">
                        {formData.services.map((service, index) => (
                          <div key={index} className="swm-service-card">
                            <div className="swm-service-info">
                              <h4 className="swm-service-name">{service.name}</h4>
                              <p className="swm-service-price">{service.price}</p>
                            </div>
                            <button
                              type="button"
                              className="swm-btn-icon"
                              onClick={() => removeService(index)}
                              title="Remove service"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.services.length === 0 && (
                    <div className="swm-empty-state">
                      <Briefcase size={48} />
                      <p>No services added yet</p>
                      <p className="swm-empty-state-subtitle">Add services and pricing information above</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "portfolio" && (
                <div className="swm-tab-content">
                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <ImageIcon size={20} />
                      Upload Portfolio Images
                    </h3>
                    <div className="swm-upload-area">
                      <Upload className="swm-upload-icon" />
                      <p className="swm-upload-text">Click to upload or drag and drop</p>
                      <p className="swm-upload-hint">PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  {formData.portfolio.length > 0 && (
                    <div className="swm-detail-section">
                      <h3 className="swm-detail-section-title">
                        <ImageIcon size={20} />
                        Portfolio Images ({formData.portfolio.length})
                      </h3>
                      <div className="swm-portfolio-grid">
                        {formData.portfolio.map((image, index) => (
                          <div key={index} className="swm-portfolio-item">
                            <div className="swm-portfolio-image-placeholder">
                              <ImageIcon size={24} />
                            </div>
                            <button
                              type="button"
                              className="swm-btn-icon swm-portfolio-remove"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  portfolio: formData.portfolio.filter((_, i) => i !== index)
                                });
                              }}
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.portfolio.length === 0 && (
                    <div className="swm-empty-state">
                      <ImageIcon size={48} />
                      <p>No portfolio images added yet</p>
                      <p className="swm-empty-state-subtitle">Upload images to showcase the worker's work</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="swm-modal-footer">
              <button type="button" className="swm-btn swm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="swm-btn swm-btn-primary">
                <CheckCircle size={16} />
                Add Worker
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// EDIT WORKER MODAL (WITH TABS - LIKE SCHOLARSHIP MANAGER)
// ============================================================================

export const EditWorkerModal = ({ isOpen, onClose, onSave, worker }: EditWorkerModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: worker?.name || "",
    category: worker?.category || "",
    location: worker?.location || "",
    phone: worker?.phone || "",
    email: worker?.email || "",
    about: worker?.about || "",
    yearsExperience: worker?.yearsExperience || "",
    verified: worker?.verified || false,
    services: worker?.services || [],
    portfolio: worker?.portfolio || [],
  });

  const [newService, setNewService] = useState({ name: "", price: "" });

  if (!isOpen || !worker) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...worker, ...formData });
    onClose();
  };

  const addService = () => {
    if (newService.name && newService.price) {
      setFormData({
        ...formData,
        services: [...formData.services, newService]
      });
      setNewService({ name: "", price: "" });
    }
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const tabs = [
    { id: "overview", label: "Basic Info", icon: Info },
    { id: "services", label: "Services & Pricing", icon: DollarSign },
    { id: "portfolio", label: "Portfolio", icon: ImageIcon },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <div>
              <h2 className="swm-modal-title">
                <User size={24} />
                Edit Worker
              </h2>
              <p className="swm-modal-subtitle">{worker.name}</p>
            </div>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="swm-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`swm-modal-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="swm-modal-body">
              {activeTab === "overview" && (
                <div className="swm-tab-content">
                  <div className="swm-form-grid">
                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <User size={16} />
                        Full Name *
                      </label>
                      <input
                        className="swm-form-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Briefcase size={16} />
                        Category *
                      </label>
                      <select
                        className="swm-form-select"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Electrician">Electrician</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Mason">Mason</option>
                        <option value="Welder">Welder</option>
                        <option value="Painter">Painter</option>
                        <option value="Tailor">Tailor</option>
                        <option value="Barber">Barber</option>
                        <option value="Hairdresser">Hairdresser</option>
                        <option value="Auto Mechanic">Auto Mechanic</option>
                        <option value="Caterer">Caterer</option>
                        <option value="Cleaner">Cleaner</option>
                      </select>
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Phone size={16} />
                        Phone Number *
                      </label>
                      <input
                        className="swm-form-input"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        className="swm-form-input"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <MapPin size={16} />
                        Location *
                      </label>
                      <input
                        className="swm-form-input"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <div className="swm-form-group">
                      <label className="swm-form-label">
                        <Award size={16} />
                        Years of Experience
                      </label>
                      <input
                        className="swm-form-input"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      />
                    </div>

                    <div className="swm-form-group full-width">
                      <label className="swm-form-label">
                        <MessageSquare size={16} />
                        About / Bio
                      </label>
                      <textarea
                        className="swm-form-textarea"
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      />
                    </div>

                    <div className="swm-form-group full-width">
                      <div className="swm-form-checkbox-group">
                        <input
                          className="swm-form-checkbox"
                          type="checkbox"
                          id="verified-edit"
                          checked={formData.verified}
                          onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                        />
                        <label className="swm-form-checkbox-label" htmlFor="verified-edit">
                          <Shield size={16} />
                          Mark as verified
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div className="swm-tab-content">
                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <DollarSign size={20} />
                      Add New Service
                    </h3>
                    <div className="swm-service-input-row">
                      <input
                        className="swm-form-input"
                        type="text"
                        placeholder="Service name (e.g., Basic Repair)"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      />
                      <input
                        className="swm-form-input"
                        type="text"
                        placeholder="Price (e.g., GHS 200+)"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      />
                      <button
                        type="button"
                        className="swm-btn swm-btn-primary"
                        onClick={addService}
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <Briefcase size={20} />
                      Services List ({formData.services.length})
                    </h3>
                    {formData.services.length > 0 ? (
                      <div className="swm-services-grid">
                        {formData.services.map((service, index) => (
                          <div key={index} className="swm-service-card">
                            <button
                              type="button"
                              className="swm-service-remove"
                              onClick={() => removeService(index)}
                            >
                              <X size={14} />
                            </button>
                            <h4 className="swm-service-name">{service.name}</h4>
                            <p className="swm-service-price">{service.price}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
                        No services added yet
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "portfolio" && (
                <div className="swm-tab-content">
                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <ImageIcon size={20} />
                      Upload Portfolio Images
                    </h3>
                    <div className="swm-upload-area">
                      <Upload className="swm-upload-icon" />
                      <p className="swm-upload-text">Click to upload portfolio images</p>
                    </div>
                  </div>

                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <ImageIcon size={20} />
                      Current Portfolio ({formData.portfolio.length} images)
                    </h3>
                    {formData.portfolio.length > 0 ? (
                      <div className="swm-portfolio-grid">
                        {formData.portfolio.map((image, index) => (
                          <div key={index} className="swm-portfolio-item">
                            <img src={image} alt={`Portfolio ${index + 1}`} />
                            <button
                              type="button"
                              className="swm-portfolio-remove"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  portfolio: formData.portfolio.filter((_, i) => i !== index)
                                });
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
                        No portfolio images
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="swm-modal-footer">
              <button type="button" className="swm-btn swm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="swm-btn swm-btn-primary">
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
// VIEW WORKER MODAL (WITH TABS)
// ============================================================================

export const ViewWorkerModal = ({ isOpen, onClose, worker }: ViewWorkerModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !worker) return null;

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className="swm-star"
        fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
      />
    ));
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: ImageIcon },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <div>
              <h2 className="swm-modal-title">
                <User size={24} />
                {worker.name}
              </h2>
              <p className="swm-modal-subtitle">{worker.category} • {worker.location}</p>
            </div>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="swm-modal-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`swm-modal-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="swm-modal-body">
            {activeTab === "overview" && (
              <div className="swm-tab-content">
                <div className="swm-detail-section">
                  <h3 className="swm-detail-section-title">
                    <User size={20} />
                    Personal Information
                  </h3>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <User size={16} />
                      Name
                    </span>
                    <span className="swm-detail-value">{worker.name}</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Briefcase size={16} />
                      Category
                    </span>
                    <span className="swm-detail-value">{worker.category}</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <MapPin size={16} />
                      Location
                    </span>
                    <span className="swm-detail-value">{worker.location}</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Phone size={16} />
                      Phone
                    </span>
                    <span className="swm-detail-value">{worker.phone}</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Mail size={16} />
                      Email
                    </span>
                    <span className="swm-detail-value">{worker.email}</span>
                  </div>
                </div>

                <div className="swm-detail-section">
                  <h3 className="swm-detail-section-title">
                    <TrendingUp size={20} />
                    Performance & Status
                  </h3>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Star size={16} />
                      Rating
                    </span>
                    <span className="swm-detail-value">
                      <div className="swm-rating">
                        {renderStars(worker.rating || 0)}
                        <span style={{ marginLeft: "0.5rem", fontWeight: 700 }}>
                          {worker.rating || 0} ({worker.reviews || 0} reviews)
                        </span>
                      </div>
                    </span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <CheckCircle size={16} />
                      Jobs Completed
                    </span>
                    <span className="swm-detail-value">{worker.completedJobs || 0}</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Award size={16} />
                      Experience
                    </span>
                    <span className="swm-detail-value">{worker.yearsExperience || "N/A"} years</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Clock size={16} />
                      Response Time
                    </span>
                    <span className="swm-detail-value">{worker.responseTime || "N/A"}</span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Shield size={16} />
                      Verification
                    </span>
                    <span className="swm-detail-value">
                      <span className={`swm-badge ${worker.verified ? "verified" : "pending"}`}>
                        {worker.verified ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {worker.verified ? "Verified" : "Pending"}
                      </span>
                    </span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Calendar size={16} />
                      Status
                    </span>
                    <span className="swm-detail-value">
                      <span className={`swm-badge ${worker.status || "active"}`}>
                        {worker.status || "Active"}
                      </span>
                    </span>
                  </div>
                  <div className="swm-detail-row">
                    <span className="swm-detail-label">
                      <Calendar size={16} />
                      Joined Date
                    </span>
                    <span className="swm-detail-value">{worker.joinedDate || "N/A"}</span>
                  </div>
                </div>

                <div className="swm-detail-section">
                  <h3 className="swm-detail-section-title">
                    <MessageSquare size={20} />
                    About
                  </h3>
                  <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                    {worker.about || "No description provided."}
                  </p>
                </div>

                {worker.badges && worker.badges.length > 0 && (
                  <div className="swm-detail-section">
                    <h3 className="swm-detail-section-title">
                      <Award size={20} />
                      Badges
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {worker.badges.map((badge, index) => {
                        // Get the appropriate icon based on badge name
                        const getBadgeIcon = (badgeName: string) => {
                          const name = badgeName.toLowerCase();
                          if (name.includes("licensed")) {
                            return <Award size={12} />;
                          } else if (name.includes("insured")) {
                            return <Shield size={12} />;
                          } else if (name.includes("verified")) {
                            return <CheckCircle2 size={12} />;
                          }
                          // Default icon
                          return <Shield size={12} />;
                        };
                        
                        return (
                          <span key={index} className="swm-badge verified">
                            {getBadgeIcon(badge)}
                            {badge}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "services" && (
              <div className="swm-tab-content">
                <div className="swm-detail-section">
                  <h3 className="swm-detail-section-title">
                    <DollarSign size={20} />
                    Services & Pricing
                  </h3>
                  {worker.services && worker.services.length > 0 ? (
                    <div className="swm-services-grid">
                      {worker.services.map((service, index) => (
                        <div key={index} className="swm-service-card">
                          <h4 className="swm-service-name">{service.name}</h4>
                          <p className="swm-service-price">{service.price}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
                      No services listed
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="swm-tab-content">
                <div className="swm-detail-section">
                  <h3 className="swm-detail-section-title">
                    <ImageIcon size={20} />
                    Portfolio Gallery
                  </h3>
                  {worker.portfolio && worker.portfolio.length > 0 ? (
                    <div className="swm-portfolio-grid">
                      {worker.portfolio.map((image, index) => (
                        <div key={index} className="swm-portfolio-item">
                          <img src={image} alt={`Portfolio ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>
                      No portfolio images
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="swm-tab-content">
                <div className="swm-detail-section">
                  <h3 className="swm-detail-section-title">
                    <Star size={20} />
                    Customer Reviews ({worker.reviews || 0})
                  </h3>
                  <div className="swm-review">
                    <div className="swm-review-header">
                      <div className="swm-reviewer-info">
                        <div className="swm-reviewer-avatar"></div>
                        <div>
                          <p className="swm-reviewer-name">Sample Reviewer</p>
                          <p className="swm-review-date">2 weeks ago</p>
                        </div>
                      </div>
                      <div className="swm-rating">
                        {renderStars(5)}
                      </div>
                    </div>
                    <p className="swm-review-text">
                      Excellent work! Professional, punctual, and completed the job perfectly. Highly recommended!
                    </p>
                  </div>
                  <p style={{ color: "#6b7280", textAlign: "center", padding: "1rem" }}>
                    Review data will be loaded from database
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="swm-modal-footer">
            <button className="swm-btn swm-btn-secondary" onClick={onClose}>
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
  worker,
}: ApprovalModalProps) => {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !worker) return null;

  const handleApprove = () => {
    if (worker.id) {
      onApprove(worker.id);
      onClose();
    }
  };

  const handleReject = () => {
    if (worker.id && rejectReason.trim()) {
      onReject(worker.id, rejectReason);
      onClose();
    }
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <h2 className="swm-modal-title">
              <CheckCircle size={24} />
              Worker Approval
            </h2>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="swm-modal-body">
            {!action && (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    {worker.name}
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
                    {worker.category} • {worker.location}
                  </p>
                </div>
                <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
                  Would you like to approve or reject this worker's application?
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    className="swm-btn swm-btn-success"
                    style={{ flex: 1 }}
                    onClick={() => setAction("approve")}
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    className="swm-btn swm-btn-danger"
                    style={{ flex: 1 }}
                    onClick={() => setAction("reject")}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </>
            )}

            {action === "approve" && (
              <>
                <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
                  Are you sure you want to approve <strong>{worker.name}</strong>? This will make
                  their profile visible to clients.
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    className="swm-btn swm-btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setAction(null)}
                  >
                    Back
                  </button>
                  <button
                    className="swm-btn swm-btn-success"
                    style={{ flex: 1 }}
                    onClick={handleApprove}
                  >
                    <CheckCircle size={16} />
                    Confirm Approval
                  </button>
                </div>
              </>
            )}

            {action === "reject" && (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Rejection Reason *
                  </label>
                  <textarea
                    className="swm-form-textarea"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    style={{ minHeight: "120px" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    className="swm-btn swm-btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setAction(null)}
                  >
                    Back
                  </button>
                  <button
                    className="swm-btn swm-btn-danger"
                    style={{ flex: 1 }}
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                  >
                    <XCircle size={16} />
                    Confirm Rejection
                  </button>
                </div>
              </>
            )}
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
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <h2 className="swm-modal-title">
              <Briefcase size={24} />
              Add New Category
            </h2>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="swm-modal-body">
              <div className="swm-form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="swm-form-label">Category Name *</label>
                <input
                  className="swm-form-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Electrician"
                />
              </div>

              <div className="swm-form-group">
                <label className="swm-form-label">Description (Optional)</label>
                <textarea
                  className="swm-form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                />
              </div>
            </div>

            <div className="swm-modal-footer">
              <button type="button" className="swm-btn swm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="swm-btn swm-btn-primary">
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
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <h2 className="swm-modal-title">
              <Briefcase size={24} />
              Edit Category
            </h2>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="swm-modal-body">
              <div className="swm-form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="swm-form-label">Category Name *</label>
                <input
                  className="swm-form-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="swm-form-group">
                <label className="swm-form-label">Description (Optional)</label>
                <textarea
                  className="swm-form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                />
              </div>
            </div>

            <div className="swm-modal-footer">
              <button type="button" className="swm-btn swm-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="swm-btn swm-btn-primary">
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
      <div className="swm-modal-overlay" onClick={onClose}>
        <div className="swm-modal-content sm" onClick={(e) => e.stopPropagation()}>
          <div className="swm-modal-header">
            <h2 className="swm-modal-title">
              <XCircle size={24} />
              {title}
            </h2>
            <button className="swm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="swm-modal-body">
            <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>{message}</p>
          </div>

          <div className="swm-modal-footer">
            <button className="swm-btn swm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="swm-btn swm-btn-danger" onClick={onConfirm}>
              <XCircle size={16} />
              Delete {type === "worker" ? "Worker" : "Category"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
