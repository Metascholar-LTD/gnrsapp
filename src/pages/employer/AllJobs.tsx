import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: string;
  status: 'active' | 'pending' | 'draft' | 'closed';
  applications: number;
  views: number;
  postedDate: string;
  location: string;
  category: string;
  is_draft?: boolean;
}

interface AllJobsProps {
  showDraftsOnly?: boolean;
}

const AllJobs: React.FC<AllJobsProps> = ({ showDraftsOnly = false }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<{ id: string; category: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [showDraftsOnly]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // Get employer's company
      let companyId: string | null = null;
      let companyName: string | null = null;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get employer profile to find associated company
          const { data: employerProfile, error: profileError } = await supabase
            .from('employers' as any)
            .select('company_id, company_name')
            .eq('user_id', user.id)
            .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors if no profile exists

          if (profileError) {
            console.warn("Error fetching employer profile:", profileError);
            // Continue without company filter - will show empty state
          } else if (employerProfile) {
            companyId = employerProfile.company_id;
            companyName = employerProfile.company_name;
          }
        }
      } catch (authError) {
        // Auth not connected yet - will work when auth is connected
        console.log("Auth not available, will show empty state");
      }

      // If no company found, show empty state
      if (!companyId && !companyName) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // Build queries filtered by company and exclude drafts
      let jobsQuery = supabase
        .from('jobs' as any)
        .select('*')
        .eq('is_draft', false) // Exclude drafts at database level
        .order('created_at', { ascending: false });

      // For tables without company_id, we'll load all and filter in memory to avoid URL encoding issues
      let internshipsQuery = supabase
        .from('internships' as any)
        .select('*')
        .eq('is_draft', false) // Exclude drafts at database level
        .order('created_at', { ascending: false });

      let nssQuery = supabase
        .from('nss_programs' as any)
        .select('*')
        .eq('is_draft', false) // Exclude drafts at database level
        .order('created_at', { ascending: false });

      let graduateQuery = supabase
        .from('graduate_programs' as any)
        .select('*')
        .eq('is_draft', false) // Exclude drafts at database level
        .order('created_at', { ascending: false });

      // Filter by company_id if available, otherwise by company name
      // For jobs table, try both company_id and company name to ensure we catch all jobs
      if (companyId && companyName) {
        // Try company_id first (more reliable), then fallback to company name if needed
        jobsQuery = jobsQuery.eq('company_id', companyId);
        // For other tables, don't filter at DB level - we'll filter in memory to avoid URL encoding issues
      } else if (companyId) {
        // Only company_id available
        jobsQuery = jobsQuery.eq('company_id', companyId);
      } else if (companyName) {
        // Only company name available - try exact match for jobs table
        jobsQuery = jobsQuery.eq('company', companyName);
        // For other tables, don't filter at DB level - we'll filter in memory
      }

      // Load jobs from jobs table
      let jobsData: any[] = [];
      let jobsError: any = null;
      
      // Try querying by company_id first
      if (companyId) {
        const result = await jobsQuery;
        jobsData = result.data || [];
        jobsError = result.error;
        
        // If no results with company_id and we have companyName, try company name as fallback
        if ((!jobsData || jobsData.length === 0) && companyName && !jobsError) {
          const fallbackQuery = supabase
            .from('jobs' as any)
            .select('*')
            .eq('is_draft', false)
            .eq('company', companyName)
            .order('created_at', { ascending: false });
          const fallbackResult = await fallbackQuery;
          if (fallbackResult.data) {
            jobsData = fallbackResult.data;
          }
          if (fallbackResult.error) {
            jobsError = fallbackResult.error;
          }
        }
      } else {
        // No company_id, use the query as is
        const result = await jobsQuery;
        jobsData = result.data || [];
        jobsError = result.error;
      }

      if (jobsError) {
        console.error("Error loading jobs:", jobsError);
        // Don't show error toast if it's just a filtering issue (no company found)
        if (jobsError.code !== 'PGRST116') {
          toast.error("Failed to load jobs");
        }
        setJobs([]);
        return;
      }

      // Debug: Log what we found
      if (jobsData && jobsData.length > 0) {
        console.log(`Found ${jobsData.length} jobs for company:`, { companyId, companyName });
      }

      // Load internships - filter in memory to avoid URL encoding issues with company names
      const { data: internshipsData, error: internshipsError } = await internshipsQuery;
      
      // Load NSS programs - filter in memory to avoid URL encoding issues with company names
      const { data: nssData, error: nssError } = await nssQuery;
      
      // Load graduate programs - filter in memory to avoid URL encoding issues with company names
      const { data: graduateData, error: graduateError } = await graduateQuery;

      // Transform all jobs into unified format
      const allJobs: Job[] = [];

      // Transform jobs
      if (jobsData) {
        jobsData.forEach((item: any) => {
          // Determine status
          let status: 'active' | 'pending' | 'draft' | 'closed' = 'pending';
          if (item.is_draft) {
            status = 'draft';
          } else if (item.verified) {
            status = 'active';
          } else {
            status = 'pending';
          }

          allJobs.push({
            id: item.id,
            title: item.title,
            company: item.company,
            status,
            applications: 0, // TODO: Get from applications table
            views: 0, // TODO: Track views
            postedDate: item.date || item.created_at,
            location: `${item.region || ''}${item.city ? `, ${item.city}` : ''}`.trim() || 'Not specified',
            category: item.job_category || 'Other',
            is_draft: item.is_draft || false
          });
        });
      }

      // Transform internships - filter by company name in memory
      if (internshipsData) {
        internshipsData
          .filter((item: any) => {
            // If we have a company name, filter by it (case-insensitive)
            if (companyName) {
              return item.company && item.company.toLowerCase().trim() === companyName.toLowerCase().trim();
            }
            // If we have company_id, we can't filter these tables by it (they don't have that column)
            // So we'll include all if only company_id is available
            return true;
          })
          .forEach((item: any) => {
            allJobs.push({
              id: item.id,
              title: item.title,
              company: item.company,
              status: item.is_draft ? 'draft' : 'pending',
              applications: 0,
              views: 0,
              postedDate: item.posted || item.created_at,
              location: item.location || 'Not specified',
              category: 'Internship',
              is_draft: item.is_draft || false
            });
          });
      }

      // Transform NSS programs - filter by company name in memory
      if (nssData) {
        nssData
          .filter((item: any) => {
            // If we have a company name, filter by it (case-insensitive)
            if (companyName) {
              return item.company && item.company.toLowerCase().trim() === companyName.toLowerCase().trim();
            }
            return true;
          })
          .forEach((item: any) => {
            allJobs.push({
              id: item.id,
              title: item.title,
              company: item.company,
              status: item.is_draft ? 'draft' : 'pending',
              applications: 0,
              views: 0,
              postedDate: item.posted || item.created_at,
              location: item.location || 'Not specified',
              category: 'NSS Program',
              is_draft: item.is_draft || false
            });
          });
      }

      // Transform graduate programs - filter by company name in memory
      if (graduateData) {
        graduateData
          .filter((item: any) => {
            // If we have a company name, filter by it (case-insensitive)
            if (companyName) {
              return item.company && item.company.toLowerCase().trim() === companyName.toLowerCase().trim();
            }
            return true;
          })
          .forEach((item: any) => {
            allJobs.push({
              id: item.id,
              title: item.title,
              company: item.company,
              status: item.is_draft ? 'draft' : 'pending',
              applications: 0,
              views: 0,
              postedDate: item.posted || item.created_at,
              location: item.location || 'Not specified',
              category: 'Graduate Program',
              is_draft: item.is_draft || false
            });
          });
      }

      // Filter based on showDraftsOnly prop
      if (showDraftsOnly) {
        // Only show drafts
        setJobs(allJobs.filter(job => job.is_draft === true || job.status === 'draft'));
      } else {
        // Filter out drafts from "all" view (drafts should only appear in Drafts page)
        setJobs(allJobs.filter(job => !job.is_draft && job.status !== 'draft'));
      }
    } catch (error: any) {
      console.error("Error loading jobs:", error);
      toast.error("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: 'rgba(113, 221, 55, 0.1)', color: '#71dd37', text: 'Active' },
      pending: { bg: 'rgba(255, 171, 0, 0.1)', color: '#ffab00', text: 'Pending' },
      draft: { bg: 'rgba(133, 146, 163, 0.1)', color: '#8592a3', text: 'Draft' },
      closed: { bg: 'rgba(255, 62, 29, 0.1)', color: '#ff3e1d', text: 'Closed' }
    };
    const style = styles[status as keyof typeof styles] || styles.draft;
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    // If showing drafts only, always show all drafts regardless of status filter
    if (showDraftsOnly) {
      return matchesSearch;
    }
    // Filter out drafts from "all" view - drafts should only appear in Drafts page
    const matchesStatus = statusFilter === 'all' 
      ? (job.status !== 'draft') // Exclude drafts from "all" view
      : job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (text: string) => {
    return text.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const openDeleteModal = (jobId: string, jobCategory: string, jobTitle: string) => {
    setJobToDelete({ id: jobId, category: jobCategory, title: jobTitle });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    setDeleting(true);
    try {
      // Determine which table to delete from based on job category
      let tableName = 'jobs';
      if (jobToDelete.category === 'Internship') {
        tableName = 'internships';
      } else if (jobToDelete.category === 'NSS Program') {
        tableName = 'nss_programs';
      } else if (jobToDelete.category === 'Graduate Program') {
        tableName = 'graduate_programs';
      }

      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', jobToDelete.id);

      if (error) throw error;

      toast.success('Job deleted successfully');
      setDeleteModalOpen(false);
      setJobToDelete(null);
      loadJobs(); // Reload the list
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(`Failed to delete job: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
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

        .ej-action-btn[style*="color: #ff3e1d"]:hover {
          background: rgba(255, 62, 29, 0.1);
          border-color: #ff3e1d;
          color: #ff3e1d;
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .ej-table-wrapper {
            display: none;
          }

          .ej-mobile-view {
            display: block;
          }
        }

        /* Delete Modal Styles */
        .ej-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .ej-modal-content {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          max-width: 400px;
          width: 100%;
          padding: 1.5rem;
          animation: ej-modal-fade-in 0.2s ease-out;
        }

        @keyframes ej-modal-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .ej-modal-header {
          margin-bottom: 1rem;
        }

        .ej-modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #141522;
          margin: 0 0 0.5rem 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-modal-message {
          font-size: 0.875rem;
          color: #54577A;
          margin: 0;
          line-height: 1.5;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ej-modal-job-title {
          font-weight: 600;
          color: #141522;
        }

        .ej-modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          justify-content: flex-end;
        }

        .ej-modal-btn {
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .ej-modal-btn-cancel {
          background: #f5f5f9;
          color: #54577A;
          border-color: #d9dee3;
        }

        .ej-modal-btn-cancel:hover {
          background: #eceef1;
          border-color: #c5c9d0;
        }

        .ej-modal-btn-delete {
          background: #ff3e1d;
          color: #fff;
        }

        .ej-modal-btn-delete:hover {
          background: #e6351a;
        }

        .ej-modal-btn-delete:disabled {
          background: #ff9a8a;
          cursor: not-allowed;
        }
      `}</style>
      <div className="ej-page">
        <div className="ej-header">
          <div>
            <h1 className="ej-title">{showDraftsOnly ? 'Drafts' : 'All Jobs'}</h1>
            <p className="ej-subtitle">{showDraftsOnly ? 'Continue editing your saved drafts' : 'Manage and track all your job postings'}</p>
          </div>
          <Link to="/employer/job-listings/post" className="ej-btn-primary">
            <Plus size={16} />
            Post New Job
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
                  placeholder="Search jobs by title or company..."
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
                      className={`ej-filter-option ${statusFilter === 'draft' ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter('draft');
                        setShowFilters(false);
                      }}
                    >
                      Draft
                    </div>
                    <div
                      className={`ej-filter-option ${statusFilter === 'closed' ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter('closed');
                        setShowFilters(false);
                      }}
                    >
                      Closed
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="ej-empty">
                <Loader2 className="ej-empty-icon" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="ej-empty">
                <Briefcase className="ej-empty-icon" />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {jobs.length === 0 ? 'No jobs posted yet' : 'No jobs found'}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {jobs.length === 0 
                    ? 'Start by posting your first job listing' 
                    : 'Try adjusting your search or filters'}
                </p>
                {jobs.length === 0 && (
                  <Link to="/employer/job-listings/post" className="ej-btn-primary" style={{ marginTop: '1rem' }}>
                    <Plus size={16} />
                    Post Your First Job
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
                          <th>Job Title</th>
                          <th>Status</th>
                          <th>Location</th>
                          <th>Applications</th>
                          <th>Views</th>
                          <th>Posted</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job) => (
                          <tr key={job.id}>
                            <td>
                              <div className="ej-job-title">{job.title}</div>
                              <div className="ej-job-company">{job.company}</div>
                              <div className="ej-meta">
                                <MapPin className="ej-meta-icon" />
                                {job.location}
                              </div>
                            </td>
                            <td>{getStatusBadge(job.status)}</td>
                            <td>
                              <div className="ej-meta">
                                <MapPin className="ej-meta-icon" />
                                {job.location}
                              </div>
                            </td>
                            <td>
                              <div className="ej-stats">
                                <div className="ej-stat">
                                  <Users className="ej-stat-icon" />
                                  {job.applications}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="ej-stats">
                                <div className="ej-stat">
                                  <Eye className="ej-stat-icon" />
                                  {job.views}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="ej-meta">
                                <Calendar className="ej-meta-icon" />
                                {new Date(job.postedDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="ej-actions" style={{ justifyContent: 'flex-end' }}>
                                <button 
                                  className="ej-action-btn" 
                                  title="Edit"
                                  onClick={() => navigate(`/employer/job-listings/edit/${job.id}`)}
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  className="ej-action-btn" 
                                  title="Delete"
                                  onClick={() => openDeleteModal(job.id, job.category, job.title)}
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
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="ej-mobile-card">
                      <div className="ej-mobile-card-header">
                        <div className="ej-mobile-avatar">
                          {getInitials(job.title)}
                        </div>
                        <div className="ej-mobile-info">
                          <h3 className="ej-mobile-title">{job.title}</h3>
                          <p className="ej-mobile-company">{job.company}</p>
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
              <h3 className="ej-modal-title">Delete Job</h3>
              <p className="ej-modal-message">
                Are you sure you want to delete <span className="ej-modal-job-title">"{jobToDelete?.title}"</span>? This action cannot be undone.
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
                onClick={handleDeleteJob}
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

export default AllJobs;
