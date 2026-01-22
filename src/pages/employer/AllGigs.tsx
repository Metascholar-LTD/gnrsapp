import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Loader2
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Gig {
  id: string;
  title: string;
  employer_name: string;
  status: 'active' | 'pending' | 'inactive';
  applications: number;
  views: number;
  postedDate: string;
  location: string;
  payment_amount: number;
  payment_type: string;
}

const AllGigs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    setLoading(true);
    try {
      // Get logged-in employer's information
      let employerName: string | null = null;
      let employerEmail: string | null = null;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get employer profile
          const { data: employerProfile, error: profileError } = await supabase
            .from('employers' as any)
            .select('full_name, company_name, email')
            .eq('user_id', user.id)
            .maybeSingle();

          if (profileError) {
            console.warn("Error fetching employer profile:", profileError);
          } else if (employerProfile) {
            employerName = employerProfile.full_name || employerProfile.company_name;
            employerEmail = employerProfile.email || user.email;
          } else {
            // Fallback to user email
            employerEmail = user.email || null;
          }
        }
      } catch (authError) {
        console.warn("Auth error:", authError);
      }

      // If no employer info found, show empty state
      if (!employerName && !employerEmail) {
        setGigs([]);
        setLoading(false);
        return;
      }

      // Load all gigs and filter in memory by employer_name or employer_email
      const { data: gigsData, error: gigsError } = await supabase
        .from('local_job_gigs' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (gigsError) {
        console.error("Error loading gigs:", gigsError);
        toast.error("Failed to load gigs");
        setGigs([]);
        return;
      }

      // Filter gigs by employer (case-insensitive)
      const filteredGigs = (gigsData || []).filter((gig: any) => {
        if (employerName) {
          return gig.employer_name && gig.employer_name.toLowerCase().trim() === employerName.toLowerCase().trim();
        } else if (employerEmail) {
          return gig.employer_email && gig.employer_email.toLowerCase().trim() === employerEmail.toLowerCase().trim();
        }
        return false;
      });

      // Transform to Gig interface
      const transformedGigs: Gig[] = filteredGigs.map((gig: any) => ({
        id: gig.id,
        title: gig.title,
        employer_name: gig.employer_name,
        status: gig.status || 'pending',
        applications: gig.applications || 0,
        views: gig.views || 0,
        postedDate: gig.created_at || new Date().toISOString(),
        location: gig.location || 'Not specified',
        payment_amount: gig.payment_amount || 0,
        payment_type: gig.payment_type || 'negotiable'
      }));

      setGigs(transformedGigs);
    } catch (error: any) {
      console.error("Error loading gigs:", error);
      toast.error("Failed to load gigs");
      setGigs([]);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (gigId: string, gigTitle: string) => {
    setGigToDelete({ id: gigId, title: gigTitle });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteModalOpen(false);
      setGigToDelete(null);
    }
  };

  const handleDeleteGig = async () => {
    if (!gigToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('local_job_gigs' as any)
        .delete()
        .eq('id', gigToDelete.id);

      if (error) throw error;

      toast.success('Gig deleted successfully');
      setDeleteModalOpen(false);
      setGigToDelete(null);
      loadGigs(); // Reload the list
    } catch (error: any) {
      console.error('Error deleting gig:', error);
      toast.error(`Failed to delete gig: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: 'rgba(113, 221, 55, 0.1)', color: '#71dd37', text: 'Active' },
      pending: { bg: 'rgba(255, 171, 0, 0.1)', color: '#ffab00', text: 'Pending' },
      inactive: { bg: 'rgba(133, 146, 163, 0.1)', color: '#8592a3', text: 'Inactive' }
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return (
      <span
        style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: style.bg,
          color: style.color,
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {style.text}
      </span>
    );
  };

  const formatPayment = (amount: number, type: string) => {
    if (type === 'negotiable') return 'Negotiable';
    return `GHS ${amount.toFixed(2)}`;
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gig.employer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (text: string) => {
    return text.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <style>{`
        .ej-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .ej-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-subtitle {
          font-size: 0.9375rem;
          color: #54577A;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-card {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          overflow: hidden;
        }

        .ej-search-filter {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .ej-search-wrapper {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .ej-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .ej-search-input:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .ej-search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8592a3;
        }

        .ej-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          background: #fff;
          color: #141522;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ej-filter-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .ej-table-wrapper {
          overflow-x: auto;
        }

        .ej-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ej-table thead {
          background: #f5f5f9;
        }

        .ej-table th {
          padding: 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #54577A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border-bottom: 1px solid #eceef1;
        }

        .ej-table td {
          padding: 1rem;
          border-bottom: 1px solid #eceef1;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-table tbody tr:hover {
          background: #f5f5f9;
        }

        .ej-table tbody tr:last-child td {
          border-bottom: none;
        }

        .ej-job-title {
          font-weight: 600;
          color: #141522;
          margin-bottom: 0.25rem;
        }

        .ej-job-company {
          font-size: 0.8125rem;
          color: #8592a3;
        }

        .ej-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #8592a3;
          margin-top: 0.25rem;
        }

        .ej-meta-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .ej-stats {
          display: flex;
          gap: 1rem;
        }

        .ej-stat {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: #8592a3;
        }

        .ej-stat-icon {
          width: 1rem;
          height: 1rem;
        }

        .ej-payment {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-weight: 600;
          color: #141522;
        }

        .ej-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .ej-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border: 1px solid #d9dee3;
          border-radius: 0.375rem;
          background: #fff;
          color: #8592a3;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ej-action-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .ej-btn-primary {
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
          background: #696cff;
          color: #fff;
          text-decoration: none;
        }

        .ej-btn-primary:hover {
          background: #5a5de0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
        }

        .ej-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #8592a3;
        }

        .ej-empty-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          color: #d9dee3;
        }

        .ej-filter-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: #fff;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          min-width: 200px;
          z-index: 10;
        }

        .ej-filter-option {
          padding: 0.625rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s ease;
        }

        .ej-filter-option:hover {
          background: #f5f5f9;
        }

        .ej-filter-option.active {
          background: rgba(105, 108, 255, 0.1);
          color: #696cff;
          font-weight: 600;
        }

        .ej-table-view {
          display: block;
        }

        .ej-mobile-view {
          display: none;
        }

        .ej-mobile-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.25rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ej-mobile-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #696cff;
        }

        .ej-mobile-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ej-mobile-avatar {
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
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-mobile-info {
          flex: 1;
        }

        .ej-mobile-title {
          font-size: 1rem;
          font-weight: 700;
          color: #141522;
          margin: 0 0 0.25rem 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-mobile-company {
          font-size: 0.875rem;
          color: #8592a3;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .ej-table-wrapper {
            display: none;
          }

          .ej-mobile-view {
            display: block;
          }
        }
      `}</style>
      <div className="ej-page">
        <div className="ej-header">
          <div>
            <h1 className="ej-title">All Gigs</h1>
            <p className="ej-subtitle">Manage and track all your gig postings</p>
          </div>
          <Link to="/employer/gigs-listing/post" className="ej-btn-primary">
            <Plus size={16} />
            Post New Gig
          </Link>
        </div>

        <div className="ej-card">
          <div style={{ padding: '1.5rem' }}>
            <div className="ej-search-filter">
              <div className="ej-search-wrapper">
                <Search className="ej-search-icon" size={16} />
                <input
                  type="text"
                  className="ej-search-input"
                  placeholder="Search gigs by title or employer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  className="ej-filter-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} />
                  Filter
                  {statusFilter !== 'all' && (
                    <span style={{
                      marginLeft: '0.25rem',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      background: '#696cff',
                      color: '#fff',
                      fontSize: '0.75rem'
                    }}>
                      1
                    </span>
                  )}
                </button>
                {showFilters && (
                  <div className="ej-filter-dropdown">
                    <div
                      className={`ej-filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter('all');
                        setShowFilters(false);
                      }}
                    >
                      All Status
                    </div>
                    <div
                      className={`ej-filter-option ${statusFilter === 'active' ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter('active');
                        setShowFilters(false);
                      }}
                    >
                      Active
                    </div>
                    <div
                      className={`ej-filter-option ${statusFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter('pending');
                        setShowFilters(false);
                      }}
                    >
                      Pending
                    </div>
                    <div
                      className={`ej-filter-option ${statusFilter === 'inactive' ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter('inactive');
                        setShowFilters(false);
                      }}
                    >
                      Inactive
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="ej-empty">
                <Loader2 className="ej-empty-icon" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Loading gigs...</p>
              </div>
            ) : filteredGigs.length === 0 ? (
              <div className="ej-empty">
                <Briefcase className="ej-empty-icon" />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {gigs.length === 0 ? 'No gigs posted yet' : 'No gigs found'}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {gigs.length === 0 
                    ? 'Start by posting your first gig' 
                    : 'Try adjusting your search or filters'}
                </p>
                {gigs.length === 0 && (
                  <Link to="/employer/gigs-listing/post" className="ej-btn-primary" style={{ marginTop: '1rem' }}>
                    <Plus size={16} />
                    Post Your First Gig
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="ej-table-view">
                  <div className="ej-table-wrapper">
                <table className="ej-table">
                  <thead>
                    <tr>
                      <th>Gig Title</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Payment</th>
                      <th>Applications</th>
                      <th>Views</th>
                      <th>Posted</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGigs.map((gig) => (
                      <tr key={gig.id}>
                        <td>
                          <div className="ej-job-title">{gig.title}</div>
                          <div className="ej-job-company">{gig.employer_name}</div>
                        </td>
                        <td>{getStatusBadge(gig.status)}</td>
                        <td>
                          <div className="ej-meta">
                            <MapPin className="ej-meta-icon" />
                            {gig.location}
                          </div>
                        </td>
                        <td>
                          <div className="ej-payment">
                            <CreditCard size={14} />
                            {formatPayment(gig.payment_amount, gig.payment_type)}
                          </div>
                        </td>
                        <td>
                          <div className="ej-stats">
                            <div className="ej-stat">
                              <Users className="ej-stat-icon" />
                              {gig.applications}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ej-stats">
                            <div className="ej-stat">
                              <Eye className="ej-stat-icon" />
                              {gig.views}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ej-meta">
                            <Calendar className="ej-meta-icon" />
                            {new Date(gig.postedDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="ej-actions" style={{ justifyContent: 'flex-end' }}>
                            <button 
                              className="ej-action-btn" 
                              title="Delete"
                              onClick={() => openDeleteModal(gig.id, gig.title)}
                              style={{ color: '#ff3e1d' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>

                <div className="ej-mobile-view">
                  {filteredGigs.map((gig) => (
                    <div key={gig.id} className="ej-mobile-card">
                      <div className="ej-mobile-card-header">
                        <div className="ej-mobile-avatar">
                          {getInitials(gig.title)}
                        </div>
                        <div className="ej-mobile-info">
                          <h3 className="ej-mobile-title">{gig.title}</h3>
                          <p className="ej-mobile-company">{gig.employer_name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="ej-modal-overlay" onClick={closeDeleteModal}>
          <div className="ej-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ej-modal-header">
              <h3 className="ej-modal-title">Delete Gig</h3>
              <p className="ej-modal-message">
                Are you sure you want to delete <span className="ej-modal-gig-title">"{gigToDelete?.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="ej-modal-actions">
              <button
                className="ej-modal-btn ej-modal-btn-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="ej-modal-btn ej-modal-btn-delete"
                onClick={handleDeleteGig}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllGigs;
