import { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Loader2, Briefcase, DollarSign, Calendar, MapPin, Building2,
  Eye, Trash2, Clock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  description: string;
  job_category: string;
  industry: string;
  region: string;
  city?: string;
  salary?: string;
  verified: boolean;
  created_at: string;
  updated_at?: string;
}

const JobsApprovalsManager = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('verified', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading jobs:", error);
        toast.error(`Failed to load jobs: ${error.message || 'Unknown error'}`);
        setJobs([]);
        return;
      }

      if (data) {
        const transformed: Job[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          company_logo: item.company_logo,
          description: item.description || "",
          job_category: item.job_category || "",
          industry: item.industry || "",
          region: item.region || "",
          city: item.city || "",
          salary: item.salary || "",
          verified: item.verified || false,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setJobs(transformed);
      } else {
        setJobs([]);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Failed to load jobs: ${error.message || 'Unknown error'}`);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    setApproving(jobId);
    try {
      const { error } = await supabase
        .from('jobs' as any)
        .update({ verified: true })
        .eq('id', jobId);

      if (error) throw error;

      toast.success("Job approved successfully!");
      await loadJobs();
      setSelectedItems(new Set());
    } catch (error: any) {
      console.error("Error approving job:", error);
      toast.error(`Failed to approve job: ${error.message || 'Unknown error'}`);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (jobId: string) => {
    if (!confirm("Are you sure you want to reject this job? This action cannot be undone.")) {
      return;
    }

    setRejecting(jobId);
    try {
      const { error } = await supabase
        .from('jobs' as any)
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast.success("Job rejected and deleted successfully!");
      await loadJobs();
      setSelectedItems(new Set());
    } catch (error: any) {
      console.error("Error rejecting job:", error);
      toast.error(`Failed to reject job: ${error.message || 'Unknown error'}`);
    } finally {
      setRejecting(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one job to approve");
      return;
    }

    if (!confirm(`Are you sure you want to approve ${selectedItems.size} job(s)?`)) {
      return;
    }

    try {
      const jobIds = Array.from(selectedItems);
      const { error } = await supabase
        .from('jobs' as any)
        .update({ verified: true })
        .in('id', jobIds);

      if (error) throw error;

      toast.success(`${selectedItems.size} job(s) approved successfully!`);
      await loadJobs();
      setSelectedItems(new Set());
    } catch (error: any) {
      console.error("Error approving jobs:", error);
      toast.error(`Failed to approve jobs: ${error.message || 'Unknown error'}`);
    }
  };

  const toggleSelection = (jobId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredJobs.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    
    const query = searchQuery.toLowerCase();
    return jobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.job_category.toLowerCase().includes(query) ||
      job.industry.toLowerCase().includes(query) ||
      job.region.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .jam-container {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          overflow: hidden;
        }

        .jam-header {
          padding: 1.5rem;
          border-bottom: 1px solid #eceef1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .jam-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jam-header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .jam-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          background: #fff;
          min-width: 250px;
        }

        .jam-search input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.875rem;
          color: #141522;
        }

        .jam-stats {
          padding: 1rem 1.5rem;
          background: #f5f5f9;
          border-bottom: 1px solid #eceef1;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .jam-stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .jam-stat-label {
          font-size: 0.75rem;
          color: #54577A;
          font-weight: 600;
        }

        .jam-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #141522;
        }

        .jam-table-container {
          overflow-x: auto;
        }

        .jam-table {
          width: 100%;
          border-collapse: collapse;
        }

        .jam-table thead {
          background: #f5f5f9;
        }

        .jam-table th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #54577A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
        }

        .jam-table td {
          padding: 1rem;
          border-bottom: 1px solid #eceef1;
          font-size: 0.875rem;
          color: #141522;
        }

        .jam-table tbody tr:hover {
          background: #f9fafb;
        }

        .jam-table tbody tr:last-child td {
          border-bottom: none;
        }

        .jam-checkbox {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          accent-color: #696cff;
        }

        .jam-job-title {
          font-weight: 600;
          color: #141522;
          margin-bottom: 0.25rem;
        }

        .jam-job-company {
          font-size: 0.8125rem;
          color: #54577A;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .jam-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .jam-badge-pending {
          background: #fff3cd;
          color: #856404;
        }

        .jam-actions {
          display: flex;
          gap: 0.5rem;
        }

        .jam-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .jam-btn-approve {
          background: #71dd37;
          color: #fff;
        }

        .jam-btn-approve:hover {
          background: #5fc52a;
        }

        .jam-btn-reject {
          background: #ff3e1d;
          color: #fff;
        }

        .jam-btn-reject:hover {
          background: #e6351a;
        }

        .jam-btn-bulk {
          background: #696cff;
          color: #fff;
        }

        .jam-btn-bulk:hover {
          background: #5a5de8;
        }

        .jam-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .jam-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid #eceef1;
          background: #f9fafb;
        }

        .jam-pagination-info {
          font-size: 0.875rem;
          color: #54577A;
        }

        .jam-pagination-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .jam-pagination-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          background: #fff;
          color: #141522;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jam-pagination-btn:hover:not(:disabled) {
          background: #f5f5f9;
          border-color: #696cff;
        }

        .jam-pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .jam-empty {
          text-align: center;
          padding: 3rem 1.5rem;
          color: #54577A;
        }

        .jam-empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          color: #d9dee3;
        }

        .jam-meta-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: #54577A;
          margin-top: 0.25rem;
        }
      `}</style>

      <div className="jam-container">
        <div className="jam-header">
          <h2 className="jam-title">
            <Clock size={24} />
            Jobs Pending Approval
          </h2>
          <div className="jam-header-actions">
            {selectedItems.size > 0 && (
              <button
                className="jam-btn jam-btn-bulk"
                onClick={handleBulkApprove}
              >
                <CheckCircle2 size={16} />
                Approve Selected ({selectedItems.size})
              </button>
            )}
            <div className="jam-search">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="jam-stats">
          <div className="jam-stat">
            <div className="jam-stat-label">Total Pending</div>
            <div className="jam-stat-value">{jobs.length}</div>
          </div>
          <div className="jam-stat">
            <div className="jam-stat-label">Filtered</div>
            <div className="jam-stat-value">{filteredJobs.length}</div>
          </div>
          <div className="jam-stat">
            <div className="jam-stat-label">Selected</div>
            <div className="jam-stat-value">{selectedItems.size}</div>
          </div>
        </div>

        <div className="jam-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader2 className="animate-spin" style={{ margin: '0 auto' }} size={32} />
              <p style={{ marginTop: '1rem', color: '#54577A' }}>Loading jobs...</p>
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="jam-empty">
              <CheckCircle2 className="jam-empty-icon" size={64} />
              <h3 style={{ margin: '0 0 0.5rem', color: '#141522' }}>
                {searchQuery ? 'No jobs found' : 'No pending approvals'}
              </h3>
              <p style={{ margin: 0 }}>
                {searchQuery 
                  ? 'Try adjusting your search query' 
                  : 'All jobs have been reviewed. New jobs posted by employers will appear here.'}
              </p>
            </div>
          ) : (
            <table className="jam-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="jam-checkbox"
                      checked={selectedItems.size === filteredJobs.length && filteredJobs.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Posted Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center', width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="jam-checkbox"
                        checked={selectedItems.has(job.id)}
                        onChange={() => toggleSelection(job.id)}
                      />
                    </td>
                    <td>
                      <div className="jam-job-title">{job.title}</div>
                      {job.description && (
                        <div style={{ fontSize: '0.75rem', color: '#54577A', marginTop: '0.25rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="jam-job-company">
                        <Building2 size={14} />
                        {job.company}
                      </div>
                    </td>
                    <td>
                      <div>{job.job_category || '-'}</div>
                      {job.industry && (
                        <div style={{ fontSize: '0.75rem', color: '#54577A', marginTop: '0.25rem' }}>
                          {job.industry}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="jam-meta-item">
                        <MapPin size={14} />
                        {job.region}{job.city ? `, ${job.city}` : ''}
                      </div>
                    </td>
                    <td>
                      {job.salary ? (
                        <div className="jam-meta-item">
                          <DollarSign size={14} />
                          {job.salary}
                        </div>
                      ) : (
                        <span style={{ color: '#d9dee3' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div className="jam-meta-item">
                        <Calendar size={14} />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="jam-badge jam-badge-pending">Pending</span>
                    </td>
                    <td>
                      <div className="jam-actions">
                        <button
                          className="jam-btn jam-btn-approve"
                          onClick={() => handleApprove(job.id)}
                          disabled={approving === job.id || rejecting === job.id}
                          title="Approve Job"
                        >
                          {approving === job.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Approve
                        </button>
                        <button
                          className="jam-btn jam-btn-reject"
                          onClick={() => handleReject(job.id)}
                          disabled={approving === job.id || rejecting === job.id}
                          title="Reject Job"
                        >
                          {rejecting === job.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <XCircle size={14} />
                          )}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="jam-pagination">
            <div className="jam-pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
            </div>
            <div className="jam-pagination-controls">
              <button
                className="jam-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span style={{ padding: '0 1rem', color: '#54577A', fontSize: '0.875rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="jam-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsApprovalsManager;
