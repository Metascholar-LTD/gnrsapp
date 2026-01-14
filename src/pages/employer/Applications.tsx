import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Download,
  MessageSquare,
  Calendar,
  MapPin
} from 'lucide-react';

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  appliedDate: string;
  location: string;
}

const Applications: React.FC<{ status?: 'all' | 'pending' | 'shortlisted' | 'rejected' }> = ({ status: pageStatus = 'all' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(pageStatus);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const [applications] = useState<Application[]>([
    {
      id: '1',
      candidateName: 'John Mensah',
      candidateEmail: 'john.mensah@email.com',
      candidatePhone: '+233 24 123 4567',
      jobTitle: 'Senior Marketing Manager',
      status: 'pending',
      appliedDate: '2024-01-20',
      location: 'Accra, Greater Accra'
    },
    {
      id: '2',
      candidateName: 'Ama Asante',
      candidateEmail: 'ama.asante@email.com',
      candidatePhone: '+233 20 987 6543',
      jobTitle: 'Frontend Developer',
      status: 'shortlisted',
      appliedDate: '2024-01-18',
      location: 'Kumasi, Ashanti'
    },
    {
      id: '3',
      candidateName: 'Kwame Osei',
      candidateEmail: 'kwame.osei@email.com',
      candidatePhone: '+233 26 555 1234',
      jobTitle: 'HR Specialist',
      status: 'rejected',
      appliedDate: '2024-01-15',
      location: 'Accra, Greater Accra'
    },
    {
      id: '4',
      candidateName: 'Efua Boateng',
      candidateEmail: 'efua.boateng@email.com',
      candidatePhone: '+233 27 888 9999',
      jobTitle: 'Data Analyst',
      status: 'pending',
      appliedDate: '2024-01-22',
      location: 'Tema, Greater Accra'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: '#fff4e6', color: '#ffab00', text: 'Pending', icon: Clock },
      shortlisted: { bg: '#e8f5e9', color: '#71dd37', text: 'Shortlisted', icon: CheckCircle },
      rejected: { bg: '#ffebee', color: '#ff3e1d', text: 'Rejected', icon: XCircle }
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    const Icon = style.icon;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: style.bg,
          color: style.color,
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <Icon size={12} />
        {style.text}
      </span>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPageTitle = () => {
    switch (pageStatus) {
      case 'pending': return 'Pending Review';
      case 'shortlisted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      default: return 'All Applications';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <style>{`
        .ea-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
        }

        .ea-header {
          margin-bottom: 2rem;
        }

        .ea-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-subtitle {
          font-size: 0.9375rem;
          color: #8592a3;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .ea-search-wrapper {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .ea-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          background: #fff;
        }

        .ea-search-input:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .ea-search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8592a3;
        }

        .ea-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #fff;
          color: #141522;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ea-filter-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .ea-filter-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          min-width: 200px;
          z-index: 100;
        }

        .ea-filter-option {
          padding: 0.625rem 0.875rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ea-filter-option:hover {
          background: #f5f5f9;
        }

        .ea-filter-option.active {
          background: rgba(105, 108, 255, 0.1);
          color: #696cff;
          font-weight: 600;
        }

        .ea-info-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.875rem;
          color: #54577A;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-info-icon {
          width: 1rem;
          height: 1rem;
          color: #8592a3;
          flex-shrink: 0;
        }

        .ea-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #141522;
          min-width: auto;
        }

        .ea-action-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .ea-action-btn-primary {
          background: #696cff;
          color: #fff;
          border-color: #696cff;
        }

        .ea-action-btn-primary:hover {
          background: #5a5de0;
          border-color: #5a5de0;
        }

        .ea-table-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: #f5f5f9;
          color: #696cff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          font-weight: 700;
          flex-shrink: 0;
          border: 1px solid #e5e7eb;
        }

        .ea-table-view {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .ea-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ea-table thead {
          background: #f8f9fa;
        }

        .ea-table th {
          padding: 1rem 1.25rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #54577A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border-bottom: 1px solid #eceef1;
        }

        .ea-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #eceef1;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-table tbody tr {
          transition: all 0.2s ease;
        }

        .ea-table tbody tr:hover {
          background: #f8f9fa;
        }

        .ea-table tbody tr:last-child td {
          border-bottom: none;
        }

        .ea-empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .ea-empty-illustration {
          width: 100%;
          max-width: 400px;
          height: 300px;
          margin: 0 auto 2rem;
        }

        .ea-empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #141522;
          margin: 0 0 0.5rem 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-empty-text {
          font-size: 0.9375rem;
          color: #8592a3;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-mobile-view {
          display: none;
        }

        .ea-mobile-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.25rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ea-mobile-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #696cff;
        }

        .ea-mobile-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ea-mobile-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          background: #f5f5f9;
          color: #696cff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
          border: 1px solid #e5e7eb;
        }

        .ea-mobile-info {
          flex: 1;
        }

        .ea-mobile-name {
          font-size: 1rem;
          font-weight: 700;
          color: #141522;
          margin: 0 0 0.25rem 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ea-mobile-job {
          font-size: 0.875rem;
          color: #8592a3;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .ea-table-view {
            display: none;
          }

          .ea-mobile-view {
            display: block;
          }
        }
      `}</style>
      <div className="ea-page">
        <div className="ea-header">
          <h1 className="ea-title">{getPageTitle()}</h1>
          <p className="ea-subtitle">Review and manage candidate applications</p>
        </div>

        <div className="ea-controls">
          <div className="ea-search-wrapper">
            <input
              type="text"
              className="ea-search-input"
              placeholder="Search by name or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="ea-search-icon" size={18} />
          </div>

          {pageStatus === 'all' && (
            <div style={{ position: 'relative' }}>
              <button
                className="ea-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filter
                {statusFilter !== 'all' && (
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.25rem',
                    background: '#696cff',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    1
                  </span>
                )}
              </button>
              {showFilters && (
                <div className="ea-filter-dropdown">
                  <div
                    className={`ea-filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('all');
                      setShowFilters(false);
                    }}
                  >
                    <FileText size={16} />
                    All Status
                  </div>
                  <div
                    className={`ea-filter-option ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('pending');
                      setShowFilters(false);
                    }}
                  >
                    <Clock size={16} />
                    Pending
                  </div>
                  <div
                    className={`ea-filter-option ${statusFilter === 'shortlisted' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('shortlisted');
                      setShowFilters(false);
                    }}
                  >
                    <CheckCircle size={16} />
                    Shortlisted
                  </div>
                  <div
                    className={`ea-filter-option ${statusFilter === 'rejected' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('rejected');
                      setShowFilters(false);
                    }}
                  >
                    <XCircle size={16} />
                    Rejected
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="ea-empty-state">
            <div className="ea-empty-illustration">
              <DotLottieReact
                src="https://lottie.host/77544918-85d9-418f-9560-7b0a7478be23/Q6uZTcW8D4.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <h3 className="ea-empty-title">No applications found</h3>
            <p className="ea-empty-text">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="ea-table-view">
              <div className="ea-table-wrapper">
                <table className="ea-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Job Title</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Applied</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="ea-table-avatar">
                              {getInitials(app.candidateName)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#141522', marginBottom: '0.25rem' }}>
                                {app.candidateName}
                              </div>
                              <div style={{ fontSize: '0.8125rem', color: '#8592a3' }}>
                                {app.candidateEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, color: '#141522' }}>{app.jobTitle}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8125rem', color: '#8592a3' }}>
                            {app.candidatePhone}
                          </div>
                        </td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>
                          <div style={{ fontSize: '0.8125rem', color: '#8592a3' }}>
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button className="ea-action-btn" onClick={() => navigate(`/employer/applications/${app.id}`)}>
                              <Eye size={16} />
                            </button>
                            <button className="ea-action-btn">
                              <Download size={16} />
                            </button>
                            <button className="ea-action-btn">
                              <MessageSquare size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ea-mobile-view">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="ea-mobile-card"
                  onClick={() => navigate(`/employer/applications/${app.id}`)}
                >
                  <div className="ea-mobile-card-header">
                    <div className="ea-mobile-avatar">
                      {getInitials(app.candidateName)}
                    </div>
                    <div className="ea-mobile-info">
                      <h3 className="ea-mobile-name">{app.candidateName}</h3>
                      <p className="ea-mobile-job">{app.jobTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Applications;
