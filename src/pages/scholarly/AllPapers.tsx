// ============================================================================
// ALL PAPERS PAGE
// ============================================================================
// Modern, clean page showing all papers submitted by the scholar
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  Building2,
} from 'lucide-react';

const AllPapers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/scholarly/auth/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('articles' as any)
        .select(`
          *,
          institutions(name, abbreviation),
          article_authors(*)
        `)
        .eq('submitted_by', session.user.id)
        .eq('is_current_version', true)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformed = data.map((article: any) => ({
          ...article,
          authors: article.article_authors || [],
          institutionName: article.institutions?.name || 'Unknown',
        }));
        setArticles(transformed);
      }
    } catch (error: any) {
      console.error('Error loading articles:', error);
      toast.error('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'under-review':
        return { label: 'Under Review', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'revision-requested':
        return { label: 'Revision Requested', icon: AlertCircle, color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
      case 'rejected':
        return { label: 'Rejected', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
      default:
        return { label: status, icon: Clock, color: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.abstract?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    }
  });

  const styles = `
    .papers-page {
      min-height: 100vh;
      background: #FAFAF9;
      padding: 24px;
    }

    .papers-header {
      max-width: 1280px;
      margin: 0 auto 32px;
    }

    .papers-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .papers-header__subtitle {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      margin: 0;
    }

    .papers-controls {
      max-width: 1280px;
      margin: 0 auto 24px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .papers-search {
      flex: 1;
      min-width: 280px;
      position: relative;
    }

    .papers-search__icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .papers-search__input {
      width: 100%;
      padding: 12px 14px 12px 42px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: border-color 0.15s ease;
    }

    .papers-search__input:focus {
      outline: none;
      border-color: #1E3A5F;
    }

    .papers-filter {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .papers-filter__btn {
      padding: 10px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #57534E;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .papers-filter__btn:hover {
      border-color: #D6D3D1;
      background: #FAFAF9;
    }

    .papers-filter__btn--active {
      border-color: #1E3A5F;
      background: #1E3A5F;
      color: #FFFFFF;
    }

    .papers-grid {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .papers-grid {
        grid-template-columns: 1fr;
      }
    }

    .paper-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .paper-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .paper-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .paper-card__status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid;
    }

    .paper-card__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .paper-card__abstract {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      line-height: 1.6;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .paper-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
    }

    .paper-card__meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .paper-card__actions {
      display: flex;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid #F5F5F4;
    }

    .paper-card__action {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #57534E;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .paper-card__action:hover {
      border-color: #1E3A5F;
      color: #1E3A5F;
      background: #FAFAF9;
    }

    .papers-empty {
      max-width: 1280px;
      margin: 80px auto;
      text-align: center;
      padding: 48px 24px;
    }

    .papers-empty__icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      color: #A8A29E;
    }

    .papers-empty__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .papers-empty__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      margin: 0 0 24px 0;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="papers-page">
        <div className="papers-header">
          <h1 className="papers-header__title">All Papers</h1>
          <p className="papers-header__subtitle">Manage and track all your submitted research papers</p>
        </div>

        <div className="papers-controls">
          <div className="papers-search">
            <Search size={18} className="papers-search__icon" />
            <input
              type="text"
              className="papers-search__input"
              placeholder="Search papers by title or abstract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="papers-filter">
            <button
              className={`papers-filter__btn ${statusFilter === 'all' ? 'papers-filter__btn--active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`papers-filter__btn ${statusFilter === 'under-review' ? 'papers-filter__btn--active' : ''}`}
              onClick={() => setStatusFilter('under-review')}
            >
              Under Review
            </button>
            <button
              className={`papers-filter__btn ${statusFilter === 'approved' ? 'papers-filter__btn--active' : ''}`}
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`papers-filter__btn ${statusFilter === 'revision-requested' ? 'papers-filter__btn--active' : ''}`}
              onClick={() => setStatusFilter('revision-requested')}
            >
              Revision
            </button>
            <button
              className={`papers-filter__btn ${statusFilter === 'rejected' ? 'papers-filter__btn--active' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#1E3A5F' }} />
            <p style={{ color: '#78716C' }}>Loading papers...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="papers-grid">
            {filteredArticles.map((article) => {
              const statusConfig = getStatusConfig(article.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={article.id}
                  className="paper-card"
                  onClick={() => navigate(`/scholarly/articles/${article.id}`)}
                >
                  <div className="paper-card__header">
                    <FileText size={20} style={{ color: '#1E3A5F' }} />
                    <span className={`paper-card__status ${statusConfig.color}`}>
                      <StatusIcon size={12} />
                      {statusConfig.label}
                    </span>
                  </div>

                  <h3 className="paper-card__title">{article.title}</h3>
                  <p className="paper-card__abstract">{article.abstract}</p>

                  <div className="paper-card__meta">
                    <div className="paper-card__meta-item">
                      <Calendar size={14} />
                      {formatDate(article.submitted_at)}
                    </div>
                    <div className="paper-card__meta-item">
                      <Building2 size={14} />
                      {article.institutionName}
                    </div>
                    {article.views > 0 && (
                      <div className="paper-card__meta-item">
                        <Eye size={14} />
                        {article.views}
                      </div>
                    )}
                  </div>

                  <div className="paper-card__actions">
                    <button
                      className="paper-card__action"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/scholarly/articles/${article.id}`);
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                    {article.status === 'under-review' || article.status === 'revision-requested' ? (
                      <button
                        className="paper-card__action"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/scholar/submit-paper?edit=${article.id}`);
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="papers-empty">
            <FileText size={64} className="papers-empty__icon" />
            <h2 className="papers-empty__title">No papers found</h2>
            <p className="papers-empty__text">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by submitting your first research paper'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                to="/scholar/submit-paper"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#1E3A5F',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                }}
              >
                Submit Paper
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AllPapers;
