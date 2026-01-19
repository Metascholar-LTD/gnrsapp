// ============================================================================
// PENDING REVIEW PAGE
// ============================================================================
// Clean page showing papers awaiting review or revision
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Clock,
  AlertCircle,
  Calendar,
  Building2,
  Edit,
  Eye,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const PendingReview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
        .in('status', ['under-review', 'revision-requested'])
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysSinceSubmission = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.abstract?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = `
    .pending-page {
      min-height: 100vh;
      background: #FAFAF9;
      padding: 24px;
    }

    .pending-header {
      max-width: 1280px;
      margin: 0 auto 32px;
    }

    .pending-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .pending-header__subtitle {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      margin: 0;
    }

    .pending-search {
      max-width: 1280px;
      margin: 0 auto 24px;
      position: relative;
    }

    .pending-search__icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .pending-search__input {
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

    .pending-search__input:focus {
      outline: none;
      border-color: #1E3A5F;
    }

    .pending-list {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pending-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .pending-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .pending-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 16px;
      gap: 16px;
    }

    .pending-card__status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .pending-card__status--review {
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
    }

    .pending-card__status--revision {
      background: #DBEAFE;
      color: #1E40AF;
      border: 1px solid #BFDBFE;
    }

    .pending-card__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .pending-card__abstract {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      line-height: 1.6;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pending-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #F5F5F4;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
    }

    .pending-card__meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pending-card__actions {
      display: flex;
      gap: 12px;
    }

    .pending-card__action {
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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pending-card__action:hover {
      border-color: #1E3A5F;
      color: #1E3A5F;
      background: #FAFAF9;
    }

    .pending-card__action--primary {
      background: #1E3A5F;
      color: #FFFFFF;
      border-color: #1E3A5F;
    }

    .pending-card__action--primary:hover {
      background: #2D4A6F;
      border-color: #2D4A6F;
    }

    .pending-empty {
      max-width: 1280px;
      margin: 80px auto;
      text-align: center;
      padding: 48px 24px;
    }

    .pending-empty__icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      color: #A8A29E;
    }

    .pending-empty__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .pending-empty__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      margin: 0 0 24px 0;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="pending-page">
        <div className="pending-header">
          <h1 className="pending-header__title">Pending Review</h1>
          <p className="pending-header__subtitle">Papers awaiting admin review or revision</p>
        </div>

        <div className="pending-search">
          <Search size={18} className="pending-search__icon" />
          <input
            type="text"
            className="pending-search__input"
            placeholder="Search pending papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#1E3A5F' }} />
            <p style={{ color: '#78716C' }}>Loading papers...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="pending-list">
            {filteredArticles.map((article) => {
              const daysSince = getDaysSinceSubmission(article.submitted_at);
              const isRevision = article.status === 'revision-requested';

              return (
                <div
                  key={article.id}
                  className="pending-card"
                  onClick={() => navigate(`/scholarly/articles/${article.id}`)}
                >
                  <div className="pending-card__header">
                    <div style={{ flex: 1 }}>
                      <span className={`pending-card__status ${isRevision ? 'pending-card__status--revision' : 'pending-card__status--review'}`}>
                        {isRevision ? <AlertCircle size={12} /> : <Clock size={12} />}
                        {isRevision ? 'Revision Requested' : 'Under Review'}
                      </span>
                    </div>
                  </div>

                  <h3 className="pending-card__title">{article.title}</h3>
                  <p className="pending-card__abstract">{article.abstract}</p>

                  <div className="pending-card__meta">
                    <div className="pending-card__meta-item">
                      <Calendar size={14} />
                      Submitted {formatDate(article.submitted_at)}
                    </div>
                    <div className="pending-card__meta-item">
                      <Clock size={14} />
                      {daysSince} {daysSince === 1 ? 'day' : 'days'} ago
                    </div>
                    <div className="pending-card__meta-item">
                      <Building2 size={14} />
                      {article.institutionName}
                    </div>
                  </div>

                  <div className="pending-card__actions">
                    <button
                      className="pending-card__action"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/scholarly/articles/${article.id}`);
                      }}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button
                      className="pending-card__action pending-card__action--primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/scholar/submit-paper?edit=${article.id}`);
                      }}
                    >
                      <Edit size={16} />
                      {isRevision ? 'Make Revisions' : 'Edit Paper'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="pending-empty">
            <CheckCircle2 size={64} className="pending-empty__icon" />
            <h2 className="pending-empty__title">No pending papers</h2>
            <p className="pending-empty__text">
              {searchQuery
                ? 'No papers match your search'
                : 'All your papers have been reviewed. Great work!'}
            </p>
            {!searchQuery && (
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
                Submit New Paper
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PendingReview;
