// ============================================================================
// INDIVIDUAL ARTICLE VIEW PAGE
// ============================================================================
// Full article display with academic journal styling
// Inspired by Nature, ScienceDirect, IEEE Xplore, JSTOR
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Calendar,
  Eye,
  Download,
  Quote,
  Share2,
  Bookmark,
  FileText,
  ExternalLink,
  Mail,
  Building2,
  Loader2,
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

const ArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Load article with authors and institution
      const { data: articleData, error: articleError } = await supabase
        .from('articles' as any)
        .select(`
          *,
          article_authors(*),
          institutions(name, abbreviation)
        `)
        .eq('id', id)
        .eq('is_current_version', true)
        .single();

      if (articleError) throw articleError;
      if (!articleData) {
        setLoading(false);
        return;
      }

      setArticle(articleData);
      setInstitution(articleData.institutions);

      // Increment view count
      await supabase
        .from('articles' as any)
        .update({ views: (articleData.views || 0) + 1 })
        .eq('id', id);
    } catch (error: any) {
      console.error('Error loading article:', error);
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
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

    .sr-article-cited-by {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      padding: 24px;
    }

    .sr-article-cited-by__title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 16px 0;
    }

    .sr-article-cited-by__list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sr-article-cited-by__item {
      padding-bottom: 16px;
      border-bottom: 1px solid #F5F5F4;
    }

    .sr-article-cited-by__item:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    .sr-article-cited-by__item-title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 4px 0;
    }

    .sr-article-cited-by__item-meta {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0;
    }

    .sr-article-cited-by__view-all {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 16px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1E3A5F;
      text-decoration: none;
    }

    .sr-article-cited-by__view-all:hover {
      color: #2D4A6F;
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
          <Navigation />
          <main className="sr-article-not-found">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            <p className="sr-article-not-found__text">Loading article...</p>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <style>{styles}</style>
        <div className="sr-article-page">
          <Navigation />
          <main className="sr-article-not-found">
            <h1 className="sr-article-not-found__title">Article Not Found</h1>
            <p className="sr-article-not-found__text">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/scholarly/articles" className="sr-article-not-found__link">
              <ChevronLeft size={18} />
              Browse Articles
            </Link>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const formatDate = (dateString: string): string => {
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
      commentary: 'Commentary',
      letter: 'Letter',
    };
    return labels[type] || 'Article';
  };


  // Mock cited by data
  const citedByArticles = [
    {
      title: 'Extending Topological Codes to Higher Dimensions',
      authors: 'Wang et al.',
      university: 'Stanford University',
      year: 2026,
    },
    {
      title: 'Practical Quantum Memory Using Surface Codes',
      authors: 'Nakamura et al.',
      university: 'University of Tokyo',
      year: 2026,
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="sr-article-page">
        <Navigation />

        {/* Article Header */}
        <header className="sr-article-header">
          <div className="sr-article-header__container">
            <Link to="/scholarly/articles" className="sr-article-header__back">
              <ChevronLeft size={16} />
              Back to Articles
            </Link>

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
                {article.article_authors && article.article_authors.length > 0 ? (
                  article.article_authors.map((author: any, idx: number) => (
                    <span key={author.id || idx}>
                      <a href="#">{author.name}</a>
                      {author.affiliation && <sup>1</sup>}
                      {author.is_corresponding && '*'}
                      {idx < article.article_authors.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  <span>No authors listed</span>
                )}
              </p>
            </div>

            {institution && (
              <p className="sr-article-header__affiliations">
                <sup>1</sup> {institution.name}
              </p>
            )}

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
              <button className="sr-article-actions__btn">
                <Share2 size={14} />
                Share
              </button>
              <button className="sr-article-actions__btn">
                <Bookmark size={14} />
                Save
              </button>
              <button className="sr-article-actions__btn">
                <Quote size={14} />
                Cite
              </button>
              {article.pdf_url && (
                <a
                  href={article.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sr-article-actions__btn sr-article-actions__btn--primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Download size={14} />
                  PDF
                </a>
              )}
              <Link
                to="/scholarly/auth/sign-in"
                className="sr-article-actions__btn"
                style={{ textDecoration: 'none' }}
                title="Sign in to claim authorship"
              >
                Claim Authorship
              </Link>
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

          {/* References - Load from article_references table */}
          {article.id && (
            <ReferencesSection articleId={article.id} />
          )}

          {/* Cited By - TODO: Implement citation tracking */}
          {article.citations > 0 && (
            <section className="sr-article-section">
              <div className="sr-article-cited-by">
                <h3 className="sr-article-cited-by__title">
                  Cited By ({article.citations} articles)
                </h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", color: '#78716C', margin: 0 }}>
                  Citation tracking coming soon.
                </p>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ArticleView;
