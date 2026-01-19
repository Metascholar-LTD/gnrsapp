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
  Users,
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
      
      // Note: thumbnail_url is included in * selector

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

  const getArticleTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      research: 'Research Article',
      review: 'Review',
      'case-study': 'Case Study',
      methodology: 'Methodology',
      other: 'Article',
    };
    return labels[type] || 'Article';
  };

  const isNewPaper = (submittedAt: string): boolean => {
    const submittedDate = new Date(submittedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return submittedDate >= thirtyDaysAgo;
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
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .paper-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .paper-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .paper-card__content {
      flex: 1;
      min-width: 0;
    }

    .paper-card__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .paper-card__badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .paper-card__badge--new {
      background: #0F766E;
      color: #FFFFFF;
    }

    .paper-card__badge--article {
      background: #5EEAD4;
      color: #134E4A;
    }

    .paper-card__badge--fulltext {
      background: #FFFFFF;
      color: #134E4A;
      border: 1px solid #0F766E;
    }

    .paper-card__badge--status {
      background: #F5F5F4;
      color: #57534E;
      border: 1px solid #E7E5E4;
    }

    .paper-card__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .paper-card__date {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #78716C;
      margin: 0 0 16px 0;
    }

    .paper-card__authors {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .paper-card__author {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
    }

    .paper-card__author-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #F5F5F4;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .paper-card__author-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .paper-card__author-avatar svg {
      width: 14px;
      height: 14px;
      color: #78716C;
    }

    .paper-card__thumbnail {
      flex-shrink: 0;
      width: 120px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
      background: #F5F5F4;
      border: 1px solid #E7E5E4;
      position: relative;
    }

    .paper-card__thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .paper-card__thumbnail-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%);
    }

    .paper-card__thumbnail-placeholder svg {
      width: 48px;
      height: 48px;
      color: #A8A29E;
    }

    .paper-card__source {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      padding: 4px 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      color: #57534E;
      text-align: center;
    }

    @media (max-width: 768px) {
      .paper-card {
        flex-direction: column;
      }

      .paper-card__thumbnail {
        width: 100%;
        height: 200px;
      }

      .paper-card__title {
        font-size: 1.125rem;
      }
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
              const isNew = isNewPaper(article.submitted_at);
              const publishedDate = article.published_at || article.submitted_at;
              const dateObj = new Date(publishedDate);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

              return (
                <div
                  key={article.id}
                  className="paper-card"
                  onClick={() => navigate(`/scholar/papers/${article.id}`)}
                >
                  <div className="paper-card__content">
                    {/* Badges */}
                    <div className="paper-card__badges">
                      {isNew && (
                        <span className="paper-card__badge paper-card__badge--new">New</span>
                      )}
                      <span className="paper-card__badge paper-card__badge--article">
                        {getArticleTypeLabel(article.article_type)}
                      </span>
                      {article.pdf_url && (
                        <span className="paper-card__badge paper-card__badge--fulltext">Full-text available</span>
                      )}
                      <span className="paper-card__badge paper-card__badge--status">
                        <StatusIcon size={10} style={{ marginRight: '4px' }} />
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="paper-card__title">{article.title}</h3>

                    {/* Date */}
                    <p className="paper-card__date">{formattedDate}</p>

                    {/* Authors */}
                    {article.authors && article.authors.length > 0 ? (
                      <div className="paper-card__authors">
                        {article.authors.slice(0, 4).map((author: any, idx: number) => (
                          <div key={author.id || idx} className="paper-card__author">
                            <div className="paper-card__author-avatar">
                              {author.profile_id ? (
                                // Try to get profile image from profiles table if needed
                                <Users size={14} />
                              ) : (
                                <Users size={14} />
                              )}
                            </div>
                            <span>{author.name}</span>
                          </div>
                        ))}
                        {article.authors.length > 4 && (
                          <span className="paper-card__author" style={{ color: '#78716C' }}>
                            +{article.authors.length - 4} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="paper-card__authors">
                        <span className="paper-card__author" style={{ color: '#78716C' }}>
                          No authors listed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="paper-card__thumbnail">
                    {article.thumbnail_url ? (
                      <>
                        <img 
                          src={article.thumbnail_url} 
                          alt={article.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.nextElementSibling) {
                              (target.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="paper-card__thumbnail-placeholder" style={{ display: 'none' }}>
                          <FileText />
                        </div>
                        <div className="paper-card__source">Source</div>
                      </>
                    ) : article.pdf_url ? (
                      <>
                        {/* Fallback: Try to generate thumbnail URL from PDF URL */}
                        <img 
                          src={article.pdf_url.replace(/\.pdf$/i, '.jpg')} 
                          alt={article.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.nextElementSibling) {
                              (target.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="paper-card__thumbnail-placeholder" style={{ display: 'none' }}>
                          <FileText />
                        </div>
                        <div className="paper-card__source">Source</div>
                      </>
                    ) : (
                      <div className="paper-card__thumbnail-placeholder">
                        <FileText />
                      </div>
                    )}
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
