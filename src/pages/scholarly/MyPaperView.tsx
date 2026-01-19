// ============================================================================
// MY PAPER VIEW PAGE (Scholar's Own Paper)
// ============================================================================
// Dedicated view page for scholars to view their own papers within dashboard
// Uses the same design as public ArticleView but with scholar-specific features
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Calendar,
  Eye,
  Download,
  Quote,
  Edit,
  FileText,
  Building2,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Mail,
  Share2,
} from 'lucide-react';

// References Section Component
const ReferencesSection: React.FC<{ articleId: string }> = ({ articleId }) => {
  const [references, setReferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferences();
  }, [articleId]);

  const loadReferences = async () => {
    try {
      const { data, error } = await supabase
        .from('article_references' as any)
        .select('*')
        .eq('article_id', articleId)
        .order('reference_order', { ascending: true });

      if (error) throw error;
      setReferences(data || []);
    } catch (error: any) {
      console.error('Error loading references:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!references || references.length === 0) return null;

  return (
    <section className="sr-article-section">
      <h2 className="sr-article-section__title">References</h2>
      <div className="sr-article-references">
        {references.map((ref, idx) => (
          <div key={ref.id || idx} className="sr-article-reference">
            <span className="sr-article-reference__number">[{idx + 1}]</span>
            {ref.reference_text}
          </div>
        ))}
      </div>
    </section>
  );
};

const MyPaperView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);

  // Compute unique affiliations and mapping
  const getAffiliationData = () => {
    if (!article?.article_authors || article.article_authors.length === 0) {
      return { uniqueAffiliations: [], affiliationMap: {} };
    }

    const uniqueAffiliations: string[] = [];
    const affiliationMap: Record<string, number> = {};
    
    article.article_authors.forEach((author: any) => {
      if (author.affiliation && !uniqueAffiliations.includes(author.affiliation)) {
        uniqueAffiliations.push(author.affiliation);
        affiliationMap[author.affiliation] = uniqueAffiliations.length;
      }
    });

    return { uniqueAffiliations, affiliationMap };
  };

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/scholarly/auth/sign-in');
        return;
      }

      // Fetch article with all related data
      const { data: articleData, error: articleError } = await supabase
        .from('articles' as any)
        .select(`
          *,
          article_authors(*),
          article_references(*),
          institutions(name, abbreviation)
        `)
        .eq('id', id)
        .eq('submitted_by', session.user.id) // Ensure it's the user's own paper
        .single();

      if (articleError) throw articleError;
      if (!articleData) {
        toast.error('Paper not found or you do not have permission to view it');
        navigate('/scholar/papers');
        return;
      }

      setArticle(articleData);
      setInstitution(articleData.institutions);
    } catch (error: any) {
      console.error('Error loading article:', error);
      toast.error('Failed to load paper');
      navigate('/scholar/papers');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { 
          label: 'Approved', 
          icon: CheckCircle2, 
          textColor: 'text-emerald-700',
          iconColor: 'text-emerald-600'
        };
      case 'under-review':
        return { 
          label: 'Under Review', 
          icon: Clock, 
          textColor: 'text-amber-700',
          iconColor: 'text-amber-600'
        };
      case 'revision-requested':
        return { 
          label: 'Revision Requested', 
          icon: AlertCircle, 
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'rejected':
        return { 
          label: 'Rejected', 
          icon: XCircle, 
          textColor: 'text-red-700',
          iconColor: 'text-red-600'
        };
      default:
        return { 
          label: status, 
          icon: Clock, 
          textColor: 'text-slate-700',
          iconColor: 'text-slate-600'
        };
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const styles = `
    .sr-article-page {
      min-height: 100vh;
      background: #FAFAF9;
    }

    .sr-article-header {
      background: #FFFFFF;
      border-bottom: 1px solid #E7E5E4;
      padding: 100px 0 0;
    }

    .sr-article-header__container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px 40px;
      position: relative;
    }

    .sr-article-header__back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1E3A5F;
      text-decoration: none;
      margin-bottom: 32px;
      transition: color 0.15s ease;
    }

    .sr-article-header__back:hover {
      color: #2D4A6F;
    }

    .sr-article-header__status-badge {
      position: absolute;
      top: 0;
      right: 24px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .sr-article-header__meta-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .sr-article-header__discipline {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #1E3A5F;
    }

    .sr-article-header__type {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: #F5F5F4;
      border-radius: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #57534E;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sr-article-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2.5rem;
      font-weight: 600;
      color: #1C1917;
      line-height: 1.25;
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .sr-article-header__title {
        font-size: 1.875rem;
      }
    }

    .sr-article-header__authors {
      margin-bottom: 8px;
    }

    .sr-article-header__author-list {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.0625rem;
      color: #1C1917;
      line-height: 1.6;
      margin: 0;
    }

    .sr-article-header__author-list a {
      color: #1E3A5F;
      text-decoration: none;
    }

    .sr-article-header__author-list a:hover {
      text-decoration: underline;
    }

    .sr-article-header__affiliations {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }

    .sr-article-header__affiliations sup {
      font-size: 0.7em;
      margin-right: 2px;
    }

    .sr-article-header__corresponding {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #78716C;
      margin-bottom: 24px;
    }

    .sr-article-header__corresponding a {
      color: #1E3A5F;
      text-decoration: none;
    }

    .sr-article-header__corresponding a:hover {
      text-decoration: underline;
    }

    .sr-article-header__meta-line {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      padding-top: 20px;
      border-top: 1px solid #E7E5E4;
    }

    .sr-article-header__meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
    }

    .sr-article-header__meta-icon {
      color: #A8A29E;
    }

    .sr-article-header__doi {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #1E3A5F;
      text-decoration: none;
    }

    .sr-article-header__doi:hover {
      text-decoration: underline;
    }

    .sr-article-actions {
      background: #FFFFFF;
      border-bottom: 1px solid #E7E5E4;
      position: sticky;
      top: 64px;
      z-index: 100;
    }

    .sr-article-actions__container {
      max-width: 960px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .sr-article-actions__stats {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .sr-article-actions__stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
    }

    .sr-article-actions__stat-icon {
      color: #A8A29E;
    }

    .sr-article-actions__buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sr-article-actions__btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #57534E;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }

    .sr-article-actions__btn:hover {
      background: #F5F5F4;
      border-color: #D6D3D1;
    }

    .sr-article-actions__btn--primary {
      background: #1E3A5F;
      border-color: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-article-actions__btn--primary:hover {
      background: #2D4A6F;
      border-color: #2D4A6F;
    }

    .sr-article-content {
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }

    .sr-article-section {
      margin-bottom: 40px;
    }

    .sr-article-section__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.375rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #1E3A5F;
    }

    .sr-article-section__content {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.0625rem;
      color: #1C1917;
      line-height: 1.8;
    }

    .sr-article-section__content p {
      margin: 0 0 20px 0;
    }

    .sr-article-section__content p:last-child {
      margin-bottom: 0;
    }

    .sr-article-keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .sr-article-keyword {
      padding: 5px 14px;
      background: #F5F5F4;
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
    }

    .sr-article-references {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sr-article-reference {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      line-height: 1.6;
      padding-left: 28px;
      position: relative;
    }

    .sr-article-reference__number {
      position: absolute;
      left: 0;
      top: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #78716C;
    }

    .sr-article-not-found {
      text-align: center;
      padding: 120px 24px;
    }

    .sr-article-not-found__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
    }

    .sr-article-not-found__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #57534E;
      margin: 0 0 24px 0;
    }

    .sr-article-not-found__link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #1E3A5F;
      color: #FFFFFF;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .sr-article-not-found__link:hover {
      background: #2D4A6F;
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="sr-article-page">
          <main className="sr-article-not-found">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            <p className="sr-article-not-found__text">Loading paper...</p>
          </main>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <style>{styles}</style>
        <div className="sr-article-page">
          <main className="sr-article-not-found">
            <h1 className="sr-article-not-found__title">Paper Not Found</h1>
            <p className="sr-article-not-found__text">
              The paper you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/scholar/papers" className="sr-article-not-found__link">
              <ChevronLeft size={18} />
              Back to Papers
            </Link>
          </main>
        </div>
      </>
    );
  }

  const statusConfig = getStatusConfig(article.status);
  const StatusIcon = statusConfig.icon;
  const { uniqueAffiliations, affiliationMap } = getAffiliationData();

  return (
    <>
      <style>{styles}</style>
      <div className="sr-article-page">
        {/* Article Header */}
        <header className="sr-article-header">
          <div className="sr-article-header__container">
            <Link to="/scholar/papers" className="sr-article-header__back">
              <ChevronLeft size={16} />
              Back to Papers
            </Link>

            {/* Status Badge - Positioned top right like scholarship cards */}
            <div className={`sr-article-header__status-badge ${statusConfig.textColor}`}>
              <StatusIcon size={10} className={statusConfig.iconColor} />
              {statusConfig.label}
            </div>

            <div className="sr-article-header__meta-top">
              <span className="sr-article-header__discipline">
                {article.discipline || 'General'} | {institution?.name || 'Unknown Institution'}
              </span>
              <span className="sr-article-header__type">
                <FileText size={10} />
                {getArticleTypeLabel(article.article_type)}
              </span>
            </div>

            <h1 className="sr-article-header__title">{article.title}</h1>

            <div className="sr-article-header__authors">
              <p className="sr-article-header__author-list">
                {article.article_authors && article.article_authors.length > 0 ? (() => {
                  return article.article_authors.map((author: any, idx: number) => (
                    <span key={author.id || idx}>
                      <a href="#">{author.name}</a>
                      {author.affiliation && (
                        <sup>{affiliationMap[author.affiliation]}</sup>
                      )}
                      {author.is_corresponding && '*'}
                      {idx < article.article_authors.length - 1 && ', '}
                    </span>
                  ));
                })() : (
                  <span>No authors listed</span>
                )}
              </p>
            </div>

            {(() => {
              if (uniqueAffiliations.length > 0) {
                return (
                  <div className="sr-article-header__affiliations">
                    {uniqueAffiliations.map((affiliation, idx) => (
                      <div key={idx} style={{ marginBottom: idx < uniqueAffiliations.length - 1 ? '0.25rem' : '0' }}>
                        <sup>{idx + 1}</sup> {affiliation}
                      </div>
                    ))}
                  </div>
                );
              } else if (institution) {
                return (
                  <div className="sr-article-header__affiliations">
                    <div><sup>1</sup> {institution.name}</div>
                  </div>
                );
              }
              return null;
            })()}

            {article.article_authors && article.article_authors.find((a: any) => a.is_corresponding && a.email) && (
              <div className="sr-article-header__corresponding">
                <Mail size={14} />
                <span>
                  * Corresponding author:{' '}
                  <a href={`mailto:${article.article_authors.find((a: any) => a.is_corresponding)?.email}`}>
                    {article.article_authors.find((a: any) => a.is_corresponding)?.email}
                  </a>
                </span>
              </div>
            )}

            <div className="sr-article-header__meta-line">
              <span className="sr-article-header__meta-item">
                <Calendar size={14} className="sr-article-header__meta-icon" />
                {article.published_at 
                  ? `Published: ${formatDate(article.published_at)}`
                  : `Submitted: ${formatDate(article.submitted_at)}`}
              </span>
              {article.identifier_type === 'doi' && article.identifier_value && (
                <a
                  href={article.identifier_url || `https://doi.org/${article.identifier_value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sr-article-header__doi"
                >
                  DOI: {article.identifier_value}
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="sr-article-actions">
          <div className="sr-article-actions__container">
            <div className="sr-article-actions__stats">
              <span className="sr-article-actions__stat">
                <Eye size={16} className="sr-article-actions__stat-icon" />
                {(article.views || 0).toLocaleString()} views
              </span>
              <span className="sr-article-actions__stat">
                <Quote size={16} className="sr-article-actions__stat-icon" />
                {(article.citations || 0)} citations
              </span>
              <span className="sr-article-actions__stat">
                <Download size={16} className="sr-article-actions__stat-icon" />
                {(article.downloads || 0)} downloads
              </span>
            </div>

            <div className="sr-article-actions__buttons">
              {(article.status === 'under-review' || article.status === 'revision-requested') && (
                <Link
                  to={`/scholar/submit-paper?edit=${article.id}`}
                  className="sr-article-actions__btn sr-article-actions__btn--primary"
                >
                  <Edit size={14} />
                  Edit Paper
                </Link>
              )}
              {article.pdf_url && (
                <a
                  href={article.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sr-article-actions__btn sr-article-actions__btn--primary"
                >
                  <Download size={14} />
                  PDF
                </a>
              )}
              {article.status === 'approved' && (
                <Link
                  to={`/scholarly/articles/${article.id}`}
                  className="sr-article-actions__btn"
                >
                  <ExternalLink size={14} />
                  View Public Page
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Article Content */}
        <main className="sr-article-content">
          {/* Abstract */}
          <section className="sr-article-section">
            <h2 className="sr-article-section__title">Abstract</h2>
            <div className="sr-article-section__content">
              <p>{article.abstract}</p>
            </div>
          </section>

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <section className="sr-article-section">
              <h2 className="sr-article-section__title">Keywords</h2>
              <div className="sr-article-keywords">
                {article.keywords.map((keyword: string, idx: number) => (
                  <span key={idx} className="sr-article-keyword">
                    {keyword}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Full Text Access Notice */}
          {(article.identifier_type === 'doi' && article.identifier_value) || article.pdf_url ? (
            <section className="sr-article-section">
              <div style={{
                background: '#F5F5F4',
                border: '1px solid #E7E5E4',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                  fontSize: '0.9375rem',
                  color: '#57534E',
                  margin: '0 0 12px 0',
                  lineHeight: '1.6'
                }}>
                  {article.pdf_url 
                    ? 'Download the PDF to access the full text of this article.'
                    : 'To access the full text of this article, please use the DOI link above.'}
                </p>
                {article.identifier_type === 'doi' && article.identifier_value && (
                  <a
                    href={article.identifier_url || `https://doi.org/${article.identifier_value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#1E3A5F',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#2D4A6F'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#1E3A5F'}
                  >
                    <ExternalLink size={16} />
                    Access Full Text via DOI
                  </a>
                )}
              </div>
            </section>
          ) : null}

          {/* References */}
          {article.id && (
            <ReferencesSection articleId={article.id} />
          )}
        </main>
      </div>
    </>
  );
};

export default MyPaperView;
