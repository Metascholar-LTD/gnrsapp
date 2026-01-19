// ============================================================================
// APPROVED PAPERS PAGE
// ============================================================================
// Beautiful page showcasing approved research papers
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Eye,
  Download,
  Quote,
  Building2,
  TrendingUp,
  Users,
  ChevronRight,
  Loader2,
  Award,
} from 'lucide-react';

const Approved: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'title'>('newest');

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
        .eq('status', 'approved')
        .order('published_at', { ascending: false });

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

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.abstract?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.published_at || b.submitted_at).getTime() - new Date(a.published_at || a.submitted_at).getTime();
    }
  });

  const styles = `
    .approved-page {
      min-height: 100vh;
      background: #FAFAF9;
      padding: 24px;
    }

    .approved-header {
      max-width: 1280px;
      margin: 0 auto 32px;
    }

    .approved-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .approved-header__subtitle {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      margin: 0;
    }

    .approved-stats {
      max-width: 1280px;
      margin: 0 auto 32px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .approved-stat {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .approved-stat__value {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1E3A5F;
      margin: 0 0 4px 0;
    }

    .approved-stat__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0;
    }

    .approved-controls {
      max-width: 1280px;
      margin: 0 auto 24px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .approved-search {
      flex: 1;
      min-width: 280px;
      position: relative;
    }

    .approved-search__icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .approved-search__input {
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

    .approved-search__input:focus {
      outline: none;
      border-color: #1E3A5F;
    }

    .approved-sort {
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      background: #FFFFFF;
      cursor: pointer;
    }

    .approved-grid {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    @media (max-width: 768px) {
      .approved-grid {
        grid-template-columns: 1fr;
      }
    }

    .approved-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .approved-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #10B981;
    }

    .approved-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .approved-card__badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      background: #D1FAE5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .approved-card__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .approved-card__abstract {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      line-height: 1.6;
      margin: 0 0 20px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .approved-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #F5F5F4;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
    }

    .approved-card__meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .approved-card__stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .approved-card__stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #57534E;
    }

    .approved-card__actions {
      display: flex;
      gap: 12px;
    }

    .approved-card__action {
      flex: 1;
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
      justify-content: center;
      gap: 8px;
    }

    .approved-card__action:hover {
      border-color: #1E3A5F;
      color: #1E3A5F;
      background: #FAFAF9;
    }

    .approved-card__action--primary {
      background: #1E3A5F;
      color: #FFFFFF;
      border-color: #1E3A5F;
    }

    .approved-card__action--primary:hover {
      background: #2D4A6F;
      border-color: #2D4A6F;
    }

    .approved-empty {
      max-width: 1280px;
      margin: 80px auto;
      text-align: center;
      padding: 48px 24px;
    }

    .approved-empty__icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      color: #A8A29E;
    }

    .approved-empty__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .approved-empty__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      margin: 0 0 24px 0;
    }
  `;

  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalDownloads = articles.reduce((sum, a) => sum + (a.downloads || 0), 0);
  const totalCitations = articles.reduce((sum, a) => sum + (a.citations || 0), 0);

  return (
    <>
      <style>{styles}</style>
      <div className="approved-page">
        <div className="approved-header">
          <h1 className="approved-header__title">Approved Papers</h1>
          <p className="approved-header__subtitle">Your published research papers</p>
        </div>

        {articles.length > 0 && (
          <div className="approved-stats">
            <div className="approved-stat">
              <div className="approved-stat__value">{articles.length}</div>
              <div className="approved-stat__label">Published Papers</div>
            </div>
            <div className="approved-stat">
              <div className="approved-stat__value">{totalViews.toLocaleString()}</div>
              <div className="approved-stat__label">Total Views</div>
            </div>
            <div className="approved-stat">
              <div className="approved-stat__value">{totalDownloads.toLocaleString()}</div>
              <div className="approved-stat__label">Downloads</div>
            </div>
            <div className="approved-stat">
              <div className="approved-stat__value">{totalCitations.toLocaleString()}</div>
              <div className="approved-stat__label">Citations</div>
            </div>
          </div>
        )}

        <div className="approved-controls">
          <div className="approved-search">
            <Search size={18} className="approved-search__icon" />
            <input
              type="text"
              className="approved-search__input"
              placeholder="Search approved papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="approved-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#1E3A5F' }} />
            <p style={{ color: '#78716C' }}>Loading papers...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="approved-grid">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="approved-card"
                onClick={() => navigate(`/scholarly/articles/${article.id}`)}
              >
                <span className="approved-card__badge">
                  <CheckCircle2 size={12} />
                  Published
                </span>

                <h3 className="approved-card__title">{article.title}</h3>
                <p className="approved-card__abstract">{article.abstract}</p>

                <div className="approved-card__meta">
                  <div className="approved-card__meta-item">
                    <Calendar size={14} />
                    {formatDate(article.published_at || article.submitted_at)}
                  </div>
                  <div className="approved-card__meta-item">
                    <Building2 size={14} />
                    {article.institutionName}
                  </div>
                </div>

                <div className="approved-card__stats">
                  <div className="approved-card__stat">
                    <Eye size={14} />
                    {article.views || 0} views
                  </div>
                  <div className="approved-card__stat">
                    <Download size={14} />
                    {article.downloads || 0} downloads
                  </div>
                  <div className="approved-card__stat">
                    <Quote size={14} />
                    {article.citations || 0} citations
                  </div>
                </div>

                <div className="approved-card__actions">
                  <button
                    className="approved-card__action"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/scholarly/articles/${article.id}`);
                    }}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    className="approved-card__action approved-card__action--primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/scholarly/articles/${article.id}`);
                    }}
                  >
                    <TrendingUp size={16} />
                    Stats
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="approved-empty">
            <Award size={64} className="approved-empty__icon" />
            <h2 className="approved-empty__title">No approved papers yet</h2>
            <p className="approved-empty__text">
              {searchQuery
                ? 'No papers match your search'
                : 'Your approved papers will appear here once they\'ve been reviewed and published'}
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
                Submit Your First Paper
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Approved;
