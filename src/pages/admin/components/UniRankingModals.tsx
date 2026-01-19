import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  X,
  GraduationCap,
  MapPin,
  Building2,
  FileText,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  Award,
  Calendar,
  Globe,
  Mail,
  Phone,
  Upload,
  Loader2
} from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Institution {
  id: string | number;
  name: string;
  abbreviation?: string;
  region?: string;
  type?: string;
  logo?: string;
  description?: string;
  website?: string;
  city?: string;
  country?: string;
  foundedYear?: number;
  totalArticles?: number;
  articlesThisMonth?: number;
  currentRank?: number;
  previousRank?: number;
  movement?: string;
  verified?: boolean;
  status?: string;
  created_at?: string;
}

interface Article {
  id: string | number;
  title: string;
  author?: string;
  institution?: string;
  status?: string;
  submitted_at?: string;
  abstract?: string;
  keywords?: string[];
  references?: string[];
  created_at?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ViewInstitutionModalProps extends ModalProps {
  institution: Institution | null;
}

interface ViewArticleModalProps extends ModalProps {
  article: Article | null;
}

interface ApprovalModalProps extends ModalProps {
  onApprove: (id: string | number) => void;
  onReject: (id: string | number, reason: string) => void;
  article: Article | null;
  mode?: "approve" | "reject" | "both";
}

interface RejectConfirmModalProps extends ModalProps {
  onConfirm: (id: string | number, reason: string) => void;
  article: Article | null;
}

interface DeleteConfirmModalProps extends ModalProps {
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "institution" | "article";
}

interface EditInstitutionModalProps extends ModalProps {
  institution: Institution | null;
  onSave: (data: Partial<Institution>) => Promise<void>;
}

interface EditArticleModalProps extends ModalProps {
  article: Article | null;
  onSave: (data: Partial<Article>) => Promise<void>;
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
// STYLES (Reusing from LocalGigsModals)
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

  /* Modal Header */
  .lgm-modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #3b82f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1e293b;
    color: white;
  }

  .lgm-modal-header-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .lgm-modal-profile-initials {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    color: white;
    flex-shrink: 0;
  }

  .lgm-modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: white;
  }

  .lgm-modal-subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0.25rem 0 0 0;
  }

  .lgm-close-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .lgm-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Modal Tabs */
  .lgm-modal-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background: white;
    padding: 0 2rem;
    gap: 0.5rem;
  }

  .lgm-modal-tab {
    padding: 0.875rem 1rem;
    border: none;
    background: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .lgm-modal-tab:hover {
    color: #3b82f6;
    background: #f9fafb;
  }

  .lgm-modal-tab.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  /* Modal Body */
  .lgm-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    background: #f9fafb;
  }

  .lgm-tab-content {
    animation: fadeIn 0.2s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .lgm-detail-section {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e5e7eb;
  }

  .lgm-detail-section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }

  .lgm-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .lgm-detail-row:last-child {
    border-bottom: none;
  }

  .lgm-detail-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  .lgm-detail-value {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #111827;
    text-align: right;
  }

  .lgm-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
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

  /* Modal Footer */
  .lgm-modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    background: white;
  }

  .lgm-btn {
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .lgm-btn-secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .lgm-btn-secondary:hover {
    background: #e5e7eb;
  }

  .lgm-btn-success {
    background: #10b981;
    color: white;
  }

  .lgm-btn-success:hover {
    background: #059669;
  }

  .lgm-btn-danger {
    background: #ef4444;
    color: white;
  }

  .lgm-btn-danger:hover {
    background: #dc2626;
  }

  .lgm-form-group {
    margin-bottom: 1.5rem;
  }

  .lgm-form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .lgm-form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;
  }

  .lgm-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .lgm-form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .lgm-form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .lgm-logo-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .lgm-logo-preview {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #e5e7eb;
    background: #f9fafb;
  }

  .lgm-upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lgm-upload-btn:hover {
    background: #2563eb;
  }

  .lgm-upload-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .lgm-file-input {
    display: none;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* References Preview Scrollbar */
  .sr-references-preview::-webkit-scrollbar {
    width: 6px;
  }

  .sr-references-preview::-webkit-scrollbar-track {
    background: #F5F5F4;
    border-radius: 3px;
  }

  .sr-references-preview::-webkit-scrollbar-thumb {
    background: #A8A29E;
    border-radius: 3px;
  }

  .sr-references-preview::-webkit-scrollbar-thumb:hover {
    background: #78716C;
  }
`;

// ============================================================================
// VIEW INSTITUTION MODAL
// ============================================================================

export const ViewInstitutionModal = ({ isOpen, onClose, institution }: ViewInstitutionModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !institution) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: GraduationCap },
    { id: "details", label: "Details", icon: Building2 },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <div className="lgm-modal-header-profile">
              {institution.logo ? (
                <img src={institution.logo} alt={institution.name} style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover" }} />
              ) : (
                <div className="lgm-modal-profile-initials">{getInitials(institution.name)}</div>
              )}
              <div>
                <h2 className="lgm-modal-title">
                  {institution.name}
                </h2>
                <p className="lgm-modal-subtitle">
                  {institution.city || institution.region || "Ghana"}
                </p>
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
                    Institution Information
                  </h3>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <GraduationCap size={16} />
                      Name
                    </span>
                    <span className="lgm-detail-value">{institution.name}</span>
                  </div>
                  {institution.abbreviation && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Award size={16} />
                        Abbreviation
                      </span>
                      <span className="lgm-detail-value">{institution.abbreviation}</span>
                    </div>
                  )}
                  {institution.region && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <MapPin size={16} />
                        Region
                      </span>
                      <span className="lgm-detail-value">{institution.region}</span>
                    </div>
                  )}
                  {institution.type && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Building2 size={16} />
                        Type
                      </span>
                      <span className="lgm-detail-value">{institution.type}</span>
                    </div>
                  )}
                  {institution.currentRank && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Award size={16} />
                        Current Rank
                      </span>
                      <span className="lgm-detail-value">#{institution.currentRank}</span>
                    </div>
                  )}
                  {institution.totalArticles !== undefined && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <FileText size={16} />
                        Total Articles
                      </span>
                      <span className="lgm-detail-value">{institution.totalArticles}</span>
                    </div>
                  )}
                  {institution.articlesThisMonth !== undefined && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Calendar size={16} />
                        Articles This Month
                      </span>
                      <span className="lgm-detail-value">{institution.articlesThisMonth}</span>
                    </div>
                  )}
                  {institution.status && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <CheckCircle size={16} />
                        Status
                      </span>
                      <span className="lgm-detail-value">
                        <span className={`lgm-badge ${institution.status || "active"}`}>
                          {institution.status || "Active"}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {institution.description && (
                  <div className="lgm-detail-section">
                    <h3 className="lgm-detail-section-title">
                      Description
                    </h3>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {institution.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div className="lgm-tab-content">
                <div className="lgm-detail-section">
                  <h3 className="lgm-detail-section-title">
                    Additional Details
                  </h3>
                  {institution.website && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Globe size={16} />
                        Website
                      </span>
                      <span className="lgm-detail-value">
                        <a href={institution.website} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>
                          {institution.website}
                        </a>
                      </span>
                    </div>
                  )}
                  {institution.city && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <MapPin size={16} />
                        City
                      </span>
                      <span className="lgm-detail-value">{institution.city}</span>
                    </div>
                  )}
                  {institution.country && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Globe size={16} />
                        Country
                      </span>
                      <span className="lgm-detail-value">{institution.country}</span>
                    </div>
                  )}
                  {institution.created_at && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Calendar size={16} />
                        Created At
                      </span>
                      <span className="lgm-detail-value">
                        {new Date(institution.created_at).toLocaleDateString()}
                      </span>
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
// VIEW ARTICLE MODAL
// ============================================================================

export const ViewArticleModal = ({ isOpen, onClose, article }: ViewArticleModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !article) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "references", label: "References", icon: FileText },
  ];

  const references = article.references || [];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <div className="lgm-modal-header-profile">
              <div className="lgm-modal-profile-initials">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="lgm-modal-title">
                  {article.title || "Article Details"}
                </h2>
                <p className="lgm-modal-subtitle">
                  {article.institution || "Unknown Institution"}
                </p>
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
                  {tab.id === "references" && references.length > 0 && (
                    <span style={{ 
                      marginLeft: "0.5rem", 
                      fontSize: "0.75rem", 
                      background: "rgba(255,255,255,0.2)", 
                      padding: "0.125rem 0.375rem", 
                      borderRadius: "10px" 
                    }}>
                      {references.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="lgm-modal-body">
            {activeTab === "overview" && (
              <div className="lgm-tab-content">
                <div className="lgm-detail-section">
                  <h3 className="lgm-detail-section-title">Article Information</h3>
                  <div className="lgm-detail-row">
                    <span className="lgm-detail-label">
                      <FileText size={16} />
                      Title
                    </span>
                    <span className="lgm-detail-value">{article.title}</span>
                  </div>
                  {article.author && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Users size={16} />
                        Author
                      </span>
                      <span className="lgm-detail-value">{article.author}</span>
                    </div>
                  )}
                  {article.institution && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Building2 size={16} />
                        Institution
                      </span>
                      <span className="lgm-detail-value">{article.institution}</span>
                    </div>
                  )}
                  {article.status && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <CheckCircle size={16} />
                        Status
                      </span>
                      <span className="lgm-detail-value">
                        <span className={`lgm-badge ${article.status || "pending"}`}>
                          {article.status || "Pending"}
                        </span>
                      </span>
                    </div>
                  )}
                  {article.submitted_at && (
                    <div className="lgm-detail-row">
                      <span className="lgm-detail-label">
                        <Calendar size={16} />
                        Submitted
                      </span>
                      <span className="lgm-detail-value">
                        {new Date(article.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {article.abstract && (
                  <div className="lgm-detail-section">
                    <h3 className="lgm-detail-section-title">Abstract</h3>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {article.abstract}
                    </p>
                  </div>
                )}

                {article.keywords && article.keywords.length > 0 && (
                  <div className="lgm-detail-section">
                    <h3 className="lgm-detail-section-title">Keywords</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {article.keywords.map((keyword, idx) => (
                        <span key={idx} style={{
                          padding: "5px 14px",
                          background: "#F5F5F4",
                          borderRadius: "100px",
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: "0.875rem",
                          color: "#57534E"
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "references" && (
              <div className="lgm-tab-content">
                <div className="lgm-detail-section">
                  <h3 className="lgm-detail-section-title">
                    References ({references.length})
                  </h3>
                  {references.length > 0 ? (
                    <div className="sr-references-preview" style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      maxHeight: '500px',
                      overflowY: 'auto',
                      paddingRight: '8px',
                      marginTop: '16px'
                    }}>
                      {references.map((ref, idx) => (
                        <div key={idx} style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.9375rem',
                          color: '#57534E',
                          lineHeight: '1.6',
                          paddingLeft: '28px',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.8125rem',
                            color: '#78716C'
                          }}>
                            [{idx + 1}]
                          </span>
                          {ref}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#78716C", fontStyle: "italic", margin: "1rem 0 0 0" }}>
                      No references provided
                    </p>
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
  article,
  mode = "approve",
}: ApprovalModalProps) => {
  if (!isOpen || !article) return null;

  const handleApprove = () => {
    if (article.id) {
      onApprove(article.id);
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
              Approve Article
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-body">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {article.title}
              </h3>
              {article.institution && (
                <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
                  {article.institution}
                </p>
              )}
            </div>
            <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
              Are you sure you want to approve <strong>{article.title}</strong>? This will make
              the article visible on the rankings platform.
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
  article,
}: RejectConfirmModalProps) => {
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !article) return null;

  const handleConfirm = () => {
    if (article.id && rejectReason.trim()) {
      onConfirm(article.id, rejectReason);
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
              Reject Article
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-body">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {article.title}
              </h3>
              {article.institution && (
                <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
                  {article.institution}
                </p>
              )}
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
// EDIT INSTITUTION MODAL
// ============================================================================

export const EditInstitutionModal = ({
  isOpen,
  onClose,
  institution,
  onSave,
}: EditInstitutionModalProps) => {
  const [formData, setFormData] = useState<Partial<Institution>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when institution changes
  useEffect(() => {
    if (institution) {
      setFormData({
        description: institution.description || "",
        logo: institution.logo || "",
        website: institution.website || "",
        foundedYear: institution.foundedYear || undefined,
        city: institution.city || "",
      });
    }
  }, [institution]);

  if (!isOpen || !institution) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `university-logos/${institution.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('university-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, try a generic bucket or use object URL
        console.warn('Storage upload failed, using object URL:', uploadError);
        const objectUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, logo: objectUrl }));
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('university-logos')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, logo: publicUrl }));
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      // Fallback to object URL
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, logo: objectUrl }));
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    try {
      await onSave({
        id: institution.id,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error('Error saving institution:', error);
      alert('Failed to save institution');
    }
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content lg" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              Edit Institution
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-body">
            <div className="lgm-form-group">
              <label className="lgm-form-label">About / Description</label>
              <textarea
                className="lgm-form-textarea"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter institution description..."
                rows={6}
              />
            </div>

            <div className="lgm-form-group">
              <label className="lgm-form-label">University Logo</label>
              <div className="lgm-logo-upload">
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="lgm-logo-preview"
                  />
                )}
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="lgm-file-input"
                  />
                  <button
                    className="lgm-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {formData.logo ? "Change Logo" : "Upload Logo"}
                      </>
                    )}
                  </button>
                  {formData.logo && (
                    <input
                      type="text"
                      className="lgm-form-input"
                      value={formData.logo}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                      placeholder="Or enter logo URL"
                      style={{ flex: 1 }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lgm-form-group">
              <label className="lgm-form-label">Year Founded</label>
              <input
                type="number"
                className="lgm-form-input"
                value={formData.foundedYear || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) || undefined }))}
                placeholder="e.g., 1948"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="lgm-form-group">
              <label className="lgm-form-label">School Website</label>
              <input
                type="url"
                className="lgm-form-input"
                value={formData.website || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.edu.gh"
              />
            </div>

            <div className="lgm-form-group">
              <label className="lgm-form-label">School Location</label>
              <input
                type="text"
                className="lgm-form-input"
                value={formData.city || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., Legon, Accra"
              />
            </div>
          </div>

          <div className="lgm-modal-footer">
            <button className="lgm-btn lgm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="lgm-btn lgm-btn-success" onClick={handleSave}>
              <CheckCircle size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// EDIT ARTICLE MODAL
// ============================================================================

export const EditArticleModal = ({
  isOpen,
  onClose,
  article,
  onSave,
}: EditArticleModalProps) => {
  const [formData, setFormData] = useState<Partial<Article>>({});
  const [referencesInput, setReferencesInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'references'>('details');

  // Smart reference parser - handles multiple formats intelligently
  const parseReferences = (input: string | string[]): string[] => {
    // If already an array, return it
    if (Array.isArray(input)) {
      return input.filter(ref => ref && ref.trim());
    }
    
    if (!input || typeof input !== 'string' || !input.trim()) return [];
    
    let lines = input.split(/\r?\n/).filter(line => line.trim());
    const cleanedReferences: string[] = [];
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      // Remove common numbering patterns: [1], 1., (1), 1), etc.
      // Also handles patterns like "1)", "1.", "[1]", "(1)", "1-", etc.
      line = line.replace(/^(\[?\d+\]?[.)\-]\s*|\(\d+\)\s*|\d+[.)]\s*)/, '');
      
      // Remove leading/trailing whitespace and special characters
      line = line.trim();
      
      // Skip if line is just a number or very short
      if (line && line.length > 5 && !/^\d+$/.test(line)) {
        cleanedReferences.push(line);
      }
    }
    
    return cleanedReferences;
  };

  // Initialize form data when article changes
  useEffect(() => {
    if (article) {
      // Handle references - could be array or string
      const references = parseReferences(article.references || []);
      setFormData({
        title: article.title || '',
        abstract: article.abstract || '',
        keywords: article.keywords || [],
      });
      // If references is already a string, use it; otherwise join array
      if (typeof article.references === 'string') {
        setReferencesInput(article.references);
      } else {
        setReferencesInput(references.join('\n'));
      }
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleReferencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReferencesInput(value);
    const parsed = parseReferences(value);
    setFormData(prev => ({ ...prev, references: parsed }));
  };

  const handleSave = async () => {
    try {
      await onSave({
        id: article.id,
        ...formData,
        references: parseReferences(referencesInput),
      });
      onClose();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    }
  };

  const parsedReferences = parseReferences(referencesInput);

  return (
    <>
      <style>{modalStyles}</style>
      <div className="lgm-modal-overlay" onClick={onClose}>
        <div className="lgm-modal-content xl" onClick={(e) => e.stopPropagation()}>
          <div className="lgm-modal-header">
            <h2 className="lgm-modal-title">
              Edit Article
            </h2>
            <button className="lgm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="lgm-modal-tabs">
            <button
              className={`lgm-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <FileText size={16} />
              Details
            </button>
            <button
              className={`lgm-modal-tab ${activeTab === 'references' ? 'active' : ''}`}
              onClick={() => setActiveTab('references')}
            >
              <FileText size={16} />
              References ({parsedReferences.length})
            </button>
          </div>

          <div className="lgm-modal-body">
            {activeTab === 'details' && (
              <div className="lgm-tab-content">
                <div className="lgm-form-group">
                  <label className="lgm-form-label">Title</label>
                  <input
                    type="text"
                    className="lgm-form-input"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Article title"
                  />
                </div>

                <div className="lgm-form-group">
                  <label className="lgm-form-label">Abstract</label>
                  <textarea
                    className="lgm-form-textarea"
                    value={formData.abstract || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                    placeholder="Article abstract"
                    rows={8}
                  />
                </div>

                <div className="lgm-form-group">
                  <label className="lgm-form-label">Keywords</label>
                  <input
                    type="text"
                    className="lgm-form-input"
                    value={(formData.keywords || []).join(', ')}
                    onChange={(e) => {
                      const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
                      setFormData(prev => ({ ...prev, keywords }));
                    }}
                    placeholder="Comma-separated keywords"
                  />
                </div>
              </div>
            )}

            {activeTab === 'references' && (
              <div className="lgm-tab-content">
                <div className="lgm-form-group">
                  <label className="lgm-form-label">References</label>
                  <p style={{ 
                    fontFamily: "'Source Sans Pro', system-ui, sans-serif", 
                    fontSize: '0.8125rem', 
                    color: '#78716C', 
                    margin: '0 0 12px 0',
                    lineHeight: '1.5'
                  }}>
                    Edit your references below. Each reference should be on a new line. 
                    Numbered references (like [1], 1., etc.) will be automatically cleaned.
                  </p>
                  <textarea
                    className="lgm-form-textarea"
                    value={referencesInput}
                    onChange={handleReferencesChange}
                    placeholder="Paste your references here, one per line..."
                    rows={16}
                    style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem' }}
                  />
                  
                  {/* References Preview */}
                  {parsedReferences.length > 0 && (
                    <div style={{ 
                      marginTop: '20px', 
                      padding: '20px', 
                      background: '#F5F5F4', 
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4'
                    }}>
                      <p style={{ 
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif", 
                        fontSize: '0.875rem', 
                        fontWeight: 600, 
                        color: '#1C1917', 
                        margin: '0 0 16px 0' 
                      }}>
                        Preview ({parsedReferences.length} reference{parsedReferences.length !== 1 ? 's' : ''})
                      </p>
                      <div className="sr-references-preview" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        paddingRight: '8px'
                      }}>
                        {parsedReferences.map((ref, idx) => (
                          <div key={idx} style={{
                            fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                            fontSize: '0.9375rem',
                            color: '#57534E',
                            lineHeight: '1.6',
                            paddingLeft: '28px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              top: '0',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.8125rem',
                              color: '#78716C'
                            }}>
                              [{idx + 1}]
                            </span>
                            {ref}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lgm-modal-footer">
            <button className="lgm-btn lgm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="lgm-btn lgm-btn-success" onClick={handleSave}>
              <CheckCircle size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// DELETE CONFIRM MODAL
// ============================================================================

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "institution",
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
            <p style={{ color: "#374151", marginBottom: "1.5rem" }}>
              {message}
            </p>
            <div className="lgm-modal-footer">
              <button
                className="lgm-btn lgm-btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="lgm-btn lgm-btn-danger"
                onClick={onConfirm}
              >
                <XCircle size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
