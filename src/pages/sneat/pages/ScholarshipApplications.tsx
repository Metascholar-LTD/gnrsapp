import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  ExternalLink,
  Loader2,
  GraduationCap,
  Award,
  Building2,
  DollarSign,
  Upload,
  AlertTriangle
} from 'lucide-react';
import PageWrapper, { colors } from './shared/PageWrapper';

// Types
interface Application {
  id: string;
  scholarshipName: string;
  provider: string;
  providerLogo?: string;
  applicationDate: string;
  deadline: string;
  status: 'applied' | 'under-review' | 'shortlisted' | 'accepted' | 'rejected';
  amount: string;
  currency: string;
  coverageType: 'Full' | 'Partial' | 'Stipend';
  documents: {
    name: string;
    status: 'uploaded' | 'pending' | 'expired';
  }[];
  timeline: {
    date: string;
    event: string;
    status: 'completed' | 'current' | 'upcoming';
  }[];
}

// Mock data
const mockApplications: Application[] = [
  {
    id: '1',
    scholarshipName: 'GETFund Scholarship 2024',
    provider: 'Ghana Education Trust Fund',
    applicationDate: '2024-01-05',
    deadline: '2024-02-28',
    status: 'under-review',
    amount: '50,000',
    currency: 'GHS',
    coverageType: 'Full',
    documents: [
      { name: 'Academic Transcript', status: 'uploaded' },
      { name: 'Recommendation Letter', status: 'uploaded' },
      { name: 'Personal Statement', status: 'uploaded' },
      { name: 'Financial Statement', status: 'pending' }
    ],
    timeline: [
      { date: '2024-01-05', event: 'Application Submitted', status: 'completed' },
      { date: '2024-01-15', event: 'Documents Verified', status: 'completed' },
      { date: '2024-02-01', event: 'Under Review', status: 'current' },
      { date: '2024-02-28', event: 'Decision Announcement', status: 'upcoming' }
    ]
  },
  {
    id: '2',
    scholarshipName: 'MTN Foundation Scholarship',
    provider: 'MTN Ghana Foundation',
    applicationDate: '2024-01-10',
    deadline: '2024-03-15',
    status: 'shortlisted',
    amount: '25,000',
    currency: 'GHS',
    coverageType: 'Partial',
    documents: [
      { name: 'Academic Transcript', status: 'uploaded' },
      { name: 'Recommendation Letter', status: 'uploaded' },
      { name: 'Personal Statement', status: 'uploaded' },
      { name: 'ID Card', status: 'uploaded' }
    ],
    timeline: [
      { date: '2024-01-10', event: 'Application Submitted', status: 'completed' },
      { date: '2024-01-20', event: 'Initial Screening', status: 'completed' },
      { date: '2024-02-05', event: 'Shortlisted', status: 'completed' },
      { date: '2024-02-20', event: 'Interview', status: 'current' },
      { date: '2024-03-15', event: 'Final Decision', status: 'upcoming' }
    ]
  },
  {
    id: '3',
    scholarshipName: 'GNPC Foundation Scholarship',
    provider: 'Ghana National Petroleum Corporation',
    applicationDate: '2023-12-01',
    deadline: '2024-01-15',
    status: 'accepted',
    amount: '75,000',
    currency: 'GHS',
    coverageType: 'Full',
    documents: [
      { name: 'Academic Transcript', status: 'uploaded' },
      { name: 'Recommendation Letter', status: 'uploaded' },
      { name: 'Personal Statement', status: 'uploaded' },
      { name: 'Acceptance Letter', status: 'uploaded' }
    ],
    timeline: [
      { date: '2023-12-01', event: 'Application Submitted', status: 'completed' },
      { date: '2023-12-15', event: 'Documents Verified', status: 'completed' },
      { date: '2024-01-05', event: 'Interview Completed', status: 'completed' },
      { date: '2024-01-15', event: 'Accepted', status: 'completed' }
    ]
  },
  {
    id: '4',
    scholarshipName: 'Commonwealth Scholarship',
    provider: 'Commonwealth Secretariat',
    applicationDate: '2023-11-15',
    deadline: '2024-01-30',
    status: 'rejected',
    amount: '100,000',
    currency: 'USD',
    coverageType: 'Full',
    documents: [
      { name: 'Academic Transcript', status: 'uploaded' },
      { name: 'Recommendation Letter', status: 'uploaded' },
      { name: 'Personal Statement', status: 'uploaded' }
    ],
    timeline: [
      { date: '2023-11-15', event: 'Application Submitted', status: 'completed' },
      { date: '2023-12-01', event: 'Under Review', status: 'completed' },
      { date: '2024-01-30', event: 'Application Unsuccessful', status: 'completed' }
    ]
  },
  {
    id: '5',
    scholarshipName: 'Mastercard Foundation Scholars',
    provider: 'Mastercard Foundation',
    applicationDate: '2024-01-20',
    deadline: '2024-04-30',
    status: 'applied',
    amount: '150,000',
    currency: 'USD',
    coverageType: 'Full',
    documents: [
      { name: 'Academic Transcript', status: 'uploaded' },
      { name: 'Recommendation Letter', status: 'pending' },
      { name: 'Personal Statement', status: 'uploaded' },
      { name: 'Financial Need Statement', status: 'pending' }
    ],
    timeline: [
      { date: '2024-01-20', event: 'Application Submitted', status: 'completed' },
      { date: '2024-02-15', event: 'Document Review', status: 'upcoming' },
      { date: '2024-03-30', event: 'Interview (if selected)', status: 'upcoming' },
      { date: '2024-04-30', event: 'Final Decision', status: 'upcoming' }
    ]
  }
];

const statusFilters = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'applied', label: 'Applied', count: 1 },
  { id: 'under-review', label: 'Under Review', count: 1 },
  { id: 'shortlisted', label: 'Shortlisted', count: 1 },
  { id: 'accepted', label: 'Accepted', count: 1 },
  { id: 'rejected', label: 'Rejected', count: 1 }
];

const ScholarshipApplications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 500);
  }, []);

  const filteredApplications = applications
    .filter(a => activeStatus === 'all' || a.status === activeStatus)
    .filter(a =>
      searchQuery === '' ||
      a.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
      'applied': { icon: <Clock size={14} />, color: colors.textSecondary, bg: colors.bgLight, label: 'Applied' },
      'under-review': { icon: <AlertCircle size={14} />, color: colors.textSecondary, bg: colors.bgLight, label: 'Under Review' },
      'shortlisted': { icon: <Award size={14} />, color: colors.textSecondary, bg: colors.bgLight, label: 'Shortlisted' },
      'accepted': { icon: <CheckCircle2 size={14} />, color: colors.textSecondary, bg: colors.bgLight, label: 'Accepted' },
      'rejected': { icon: <XCircle size={14} />, color: colors.textSecondary, bg: colors.bgLight, label: 'Rejected' }
    };
    return configs[status] || configs['applied'];
  };

  const getDocumentStatusColor = (status: string) => {
    return colors.textMuted;
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => ['applied', 'under-review'].includes(a.status)).length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    accepted: applications.filter(a => a.status === 'accepted').length
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2
              size={32}
              className="mb-3"
              style={{ animation: 'spin 1s linear infinite', color: colors.primary }}
            />
            <p style={{ color: colors.textSecondary, fontFamily: "'Source Sans Pro', sans-serif" }}>Loading applications...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">
            <strong>Scholarship</strong> Applications
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Track and manage your scholarship applications
          </p>
        </div>
        <Link
          to="/scholarship-hub"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#696cff',
            color: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            marginTop: isMobile ? '12px' : 0
          }}
        >
          <GraduationCap size={16} />
          Browse Scholarships
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(105, 108, 255, 0.1)', borderRadius: '10px' }}>
                  <FileText size={24} color="#696cff" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase' }}>Total</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.total}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(3, 195, 236, 0.1)', borderRadius: '10px' }}>
                  <Clock size={24} color="#03c3ec" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase' }}>Pending</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.pending}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 171, 0, 0.1)', borderRadius: '10px' }}>
                  <Award size={24} color="#ffab00" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase' }}>Shortlisted</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.shortlisted}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(113, 221, 55, 0.1)', borderRadius: '10px' }}>
                  <CheckCircle2 size={24} color="#71dd37" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase' }}>Accepted</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.accepted}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs & Search */}
      <div className="card mb-4">
        <div className="card-body p-0">
          {/* Status Tabs */}
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #E7E5E4', padding: '0 16px' }} className="hide-scrollbar">
            {statusFilters.map(filter => {
              const config = filter.id !== 'all' ? getStatusConfig(filter.id) : null;
              const isActive = activeStatus === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveStatus(filter.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px 20px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: isActive ? '2px solid #696cff' : '2px solid transparent',
                    color: isActive ? '#696cff' : '#78716C',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {config && config.icon}
                  {filter.label}
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: isActive ? 'rgba(105, 108, 255, 0.1)' : '#F5F5F5',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ padding: '16px' }}>
            <div style={{ position: 'relative', maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', borderRadius: '50%' }}>
              <GraduationCap size={40} color="#A8A29E" />
            </div>
            <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
              No applications found
            </h5>
            <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
              Start applying to scholarships to track them here
            </p>
            <Link
              to="/scholarship-hub"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#696cff',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: "'Source Sans Pro', sans-serif",
                fontWeight: 600
              }}
            >
              <GraduationCap size={18} />
              Browse Scholarships
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredApplications.map((app, index) => {
            const statusConfig = getStatusConfig(app.status);
            const daysRemaining = getDaysRemaining(app.deadline);
            const pendingDocs = app.documents.filter(d => d.status === 'pending').length;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="card"
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => setSelectedApplication(app)}
                >
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* Main Info */}
                      <div className="col-lg-5 col-md-6 mb-3 mb-md-0">
                        <div className="d-flex align-items-start gap-3">
                          <div style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(105, 108, 255, 0.1)',
                            borderRadius: '10px',
                            flexShrink: 0
                          }}>
                            <Building2 size={24} color="#696cff" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 10px',
                                backgroundColor: statusConfig.bg,
                                color: statusConfig.color,
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}>
                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                              {pendingDocs > 0 && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  backgroundColor: colors.bgLight,
                                  color: colors.textSecondary,
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 500
                                }}>
                                  <AlertTriangle size={12} style={{ color: colors.textMuted }} />
                                  {pendingDocs} docs pending
                                </span>
                              )}
                            </div>
                            <h6 style={{
                              fontFamily: "'Crimson Text', Georgia, serif",
                              fontSize: '1.0625rem',
                              fontWeight: 600,
                              color: '#1C1917',
                              margin: '4px 0'
                            }}>
                              {app.scholarshipName}
                            </h6>
                            <p style={{ fontSize: '0.8125rem', color: '#78716C', margin: 0 }}>
                              {app.provider}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="col-6 col-lg-2 col-md-3">
                        <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: '0 0 4px 0' }}>Amount</p>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1917', margin: 0 }}>
                          {app.currency} {app.amount}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          backgroundColor: '#F5F5F5',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          color: '#78716C',
                          marginTop: '4px'
                        }}>
                          {app.coverageType}
                        </span>
                      </div>

                      {/* Deadline */}
                      <div className="col-6 col-lg-2 col-md-3">
                        <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: '0 0 4px 0' }}>Deadline</p>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1C1917', margin: 0 }}>
                          {new Date(app.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {daysRemaining > 0 && app.status !== 'accepted' && app.status !== 'rejected' && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            color: colors.textSecondary,
                            marginTop: '4px'
                          }}>
                            <Clock size={12} style={{ color: colors.textMuted }} />
                            {daysRemaining} days left
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-lg-3 col-md-12 mt-3 mt-lg-0">
                        <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplication(app);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 16px',
                              backgroundColor: '#696cff',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px 12px',
                              backgroundColor: 'transparent',
                              border: '1px solid #E7E5E4',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#78716C'
                            }}
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Preview */}
                    {app.status !== 'rejected' && (
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #F5F5F5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        overflowX: 'auto'
                      }} className="hide-scrollbar">
                        {app.timeline.map((event, i) => (
                          <React.Fragment key={i}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 12px',
                              backgroundColor: colors.bgLight,
                              borderRadius: '20px',
                              whiteSpace: 'nowrap'
                            }}>
                              {event.status === 'completed' && <CheckCircle2 size={14} style={{ color: colors.textMuted }} />}
                              {event.status === 'current' && <Clock size={14} style={{ color: colors.textMuted }} />}
                              {event.status === 'upcoming' && <Calendar size={14} style={{ color: colors.textMuted }} />}
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: event.status === 'current' ? 600 : 400,
                                color: colors.textSecondary
                              }}>
                                {event.event}
                              </span>
                            </div>
                            {i < app.timeline.length - 1 && (
                              <ChevronRight size={16} style={{ color: colors.border, flexShrink: 0 }} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px'
          }}
          onClick={() => setSelectedApplication(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #E7E5E4', position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 10 }}>
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    backgroundColor: getStatusConfig(selectedApplication.status).bg,
                    color: getStatusConfig(selectedApplication.status).color,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}>
                    {getStatusConfig(selectedApplication.status).icon}
                    {getStatusConfig(selectedApplication.status).label}
                  </span>
                  <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", margin: 0 }}>
                    {selectedApplication.scholarshipName}
                  </h5>
                  <p style={{ fontSize: '0.875rem', color: '#78716C', margin: '4px 0 0 0' }}>
                    {selectedApplication.provider}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#78716C' }}
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              {/* Amount & Deadline */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div style={{ padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: '0 0 4px 0' }}>Amount</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C1917', margin: 0 }}>
                      {selectedApplication.currency} {selectedApplication.amount}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#78716C' }}>{selectedApplication.coverageType} Coverage</span>
                  </div>
                </div>
                <div className="col-6">
                  <div style={{ padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: '0 0 4px 0' }}>Deadline</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1C1917', margin: 0 }}>
                      {new Date(selectedApplication.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    {getDaysRemaining(selectedApplication.deadline) > 0 && (
                      <span style={{ fontSize: '0.75rem', color: getDaysRemaining(selectedApplication.deadline) <= 7 ? '#ff3e1d' : '#71dd37' }}>
                        {getDaysRemaining(selectedApplication.deadline)} days remaining
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div style={{ marginBottom: '24px' }}>
                <h6 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '12px' }}>Documents</h6>
                <div className="d-flex flex-column gap-2">
                  {selectedApplication.documents.map((doc, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#FAFAF9',
                        borderRadius: '8px',
                        border: doc.status === 'pending' ? `1px dashed ${colors.border}` : `1px solid ${colors.borderLight}`
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <FileText size={18} style={{ color: colors.textMuted }} />
                        <span style={{ fontSize: '0.875rem', color: '#1C1917' }}>{doc.name}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {doc.status === 'uploaded' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: colors.textSecondary }}>
                            <CheckCircle2 size={14} style={{ color: colors.textMuted }} />
                            Uploaded
                          </span>
                        )}
                        {doc.status === 'pending' && (
                          <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: colors.primary,
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}>
                            <Upload size={12} />
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h6 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '12px' }}>Application Timeline</h6>
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  {selectedApplication.timeline.map((event, i) => (
                    <div key={i} style={{ position: 'relative', paddingBottom: i < selectedApplication.timeline.length - 1 ? '24px' : 0 }}>
                      {/* Line */}
                      {i < selectedApplication.timeline.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '-16px',
                          top: '24px',
                          bottom: 0,
                          width: '2px',
                          backgroundColor: colors.borderLight
                        }} />
                      )}
                      {/* Dot */}
                      <div style={{
                        position: 'absolute',
                        left: '-20px',
                        top: '4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: event.status === 'current' ? colors.primary : colors.borderLight,
                        border: event.status === 'current' ? `3px solid ${colors.primaryLight}` : 'none'
                      }} />
                      {/* Content */}
                      <div>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: event.status === 'current' ? 600 : 400,
                          color: event.status === 'upcoming' ? colors.textMuted : '#1C1917',
                          margin: '0 0 4px 0'
                        }}>
                          {event.event}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: 0 }}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E7E5E4', backgroundColor: '#FAFAF9', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedApplication(null)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#78716C'
                }}
              >
                Close
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#696cff',
                  color: '#FFFFFF',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ExternalLink size={14} />
                Track Status
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </PageWrapper>
  );
};

export default ScholarshipApplications;
