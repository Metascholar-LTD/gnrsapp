// ============================================================================
// ARTICLE CARD COMPONENT
// ============================================================================
// Displays scholarly articles in various layouts (compact, detailed)
// Follows academic journal styling conventions
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Quote, Calendar, FileText, ExternalLink } from 'lucide-react';
import type { Article } from '@/utils/scholarlyRankingTypes';

interface ArticleCardProps {
  article: Article;
  variant?: 'compact' | 'detailed' | 'list';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'detailed',
}) => {
  const styles = `
    .sr-article-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      padding: 24px;
      transition: all 0.2s ease;
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .sr-article-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .sr-article-card--compact {
      padding: 18px 20px;
    }

    .sr-article-card--list {
      padding: 20px 24px;
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-top: none;
    }

    .sr-article-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 12px;
    }

    .sr-article-card__type-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: #F5F5F4;
      border-radius: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #57534E;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    .sr-article-card__discipline {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      color: #1E3A5F;
      margin: 0;
    }

    .sr-article-card__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.375rem;
      font-weight: 600;
      color: #1C1917;
      line-height: 1.35;
      margin: 0 0 12px 0;
    }

    .sr-article-card--compact .sr-article-card__title {
      font-size: 1.125rem;
      margin-bottom: 8px;
    }

    .sr-article-card--list .sr-article-card__title {
      font-size: 1.1875rem;
    }

    .sr-article-card__authors {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      margin: 0 0 4px 0;
      line-height: 1.5;
    }

    .sr-article-card__affiliation {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0 0 16px 0;
    }

    .sr-article-card__affiliation sup {
      font-size: 0.7em;
      margin-right: 2px;
    }

    .sr-article-card__meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .sr-article-card__meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
    }

    .sr-article-card__meta-icon {
      color: #A8A29E;
      display: flex;
      align-items: center;
    }

    .sr-article-card__doi {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #78716C;
    }

    .sr-article-card__abstract {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      line-height: 1.65;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .sr-article-card--compact .sr-article-card__abstract {
      -webkit-line-clamp: 2;
      font-size: 0.875rem;
    }

    .sr-article-card__keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }

    .sr-article-card__keyword {
      padding: 3px 10px;
      background: #F5F5F4;
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      color: #57534E;
    }

    .sr-article-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid #F5F5F4;
    }

    .sr-article-card__stats {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sr-article-card__stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #57534E;
    }

    .sr-article-card__stat-icon {
      color: #A8A29E;
      display: flex;
      align-items: center;
    }

    .sr-article-card__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sr-article-card__action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      color: #57534E;
      background: transparent;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }

    .sr-article-card__action:hover {
      background: #F5F5F4;
      border-color: #D6D3D1;
    }

    .sr-article-card__action--primary {
      background: #1E3A5F;
      border-color: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-article-card__action--primary:hover {
      background: #2D4A6F;
      border-color: #2D4A6F;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .sr-article-card__footer {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .sr-article-card__actions {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAuthors = (): string => {
    return article.authors
      .map((author, idx) => {
        const superscript = `${author.affiliationNumber}`;
        return `${author.name}${author.isCorresponding ? '*' : ''}`;
      })
      .join(', ');
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

  return (
    <>
      <style>{styles}</style>
      <Link
        to={`/scholarly/articles/${article.id}`}
        className={`sr-article-card sr-article-card--${variant}`}
      >
        <div className="sr-article-card__header">
          <span className="sr-article-card__discipline">{article.disciplineName}</span>
          <span className="sr-article-card__type-badge">
            <FileText size={10} />
            {getArticleTypeLabel(article.articleType)}
          </span>
        </div>

        <h3 className="sr-article-card__title">{article.title}</h3>

        <p className="sr-article-card__authors">{formatAuthors()}</p>
        <p className="sr-article-card__affiliation">
          <sup>1</sup> {article.universityName}
        </p>

        <div className="sr-article-card__meta">
          <span className="sr-article-card__meta-item">
            <span className="sr-article-card__meta-icon">
              <Calendar size={12} />
            </span>
            {formatDate(article.publishedAt)}
          </span>
          {article.doi && (
            <span className="sr-article-card__doi">DOI: {article.doi}</span>
          )}
        </div>

        {variant === 'detailed' && (
          <>
            <p className="sr-article-card__abstract">{article.abstract}</p>

            {article.keywords.length > 0 && (
              <div className="sr-article-card__keywords">
                {article.keywords.slice(0, 5).map((keyword) => (
                  <span key={keyword} className="sr-article-card__keyword">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        <div className="sr-article-card__footer">
          <div className="sr-article-card__stats">
            <span className="sr-article-card__stat">
              <span className="sr-article-card__stat-icon">
                <Eye size={14} />
              </span>
              {article.viewCount.toLocaleString()} views
            </span>
            <span className="sr-article-card__stat">
              <span className="sr-article-card__stat-icon">
                <Quote size={14} />
              </span>
              {article.citationCount} citations
            </span>
            <span className="sr-article-card__stat">
              <span className="sr-article-card__stat-icon">
                <Download size={14} />
              </span>
              {article.downloadCount}
            </span>
          </div>

          <div className="sr-article-card__actions">
            <span className="sr-article-card__action">Cite</span>
            <span className="sr-article-card__action sr-article-card__action--primary">
              <Download size={12} style={{ marginRight: 4 }} />
              PDF
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

// -----------------------------------------------------------------------------
// ARTICLE LIST ITEM (Minimal variant for lists)
// -----------------------------------------------------------------------------

interface ArticleListItemProps {
  article: Article;
}

export const ArticleListItem: React.FC<ArticleListItemProps> = ({ article }) => {
  const styles = `
    .sr-article-list-item {
      display: block;
      padding: 16px 0;
      border-bottom: 1px solid #E7E5E4;
      text-decoration: none;
      color: inherit;
      transition: background-color 0.15s ease;
    }

    .sr-article-list-item:hover {
      background: #FAFAF9;
      margin: 0 -16px;
      padding: 16px;
    }

    .sr-article-list-item:last-child {
      border-bottom: none;
    }

    .sr-article-list-item__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.0625rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 6px 0;
      line-height: 1.4;
    }

    .sr-article-list-item__meta {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0;
    }

    .sr-article-list-item__meta span {
      margin-right: 8px;
    }

    .sr-article-list-item__stats {
      display: flex;
      gap: 12px;
      margin-top: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      color: #A8A29E;
    }

    .sr-article-list-item__stat {
      display: flex;
      align-items: center;
      gap: 3px;
    }
  `;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <style>{styles}</style>
      <Link
        to={`/scholarly/articles/${article.id}`}
        className="sr-article-list-item"
      >
        <h4 className="sr-article-list-item__title">{article.title}</h4>
        <p className="sr-article-list-item__meta">
          <span>{article.authors.map((a) => a.name).join(', ')}</span>
          <span>|</span>
          <span>{formatDate(article.publishedAt)}</span>
        </p>
        <div className="sr-article-list-item__stats">
          <span className="sr-article-list-item__stat">
            <Eye size={11} /> {article.viewCount}
          </span>
          <span className="sr-article-list-item__stat">
            <Quote size={11} /> {article.citationCount}
          </span>
        </div>
      </Link>
    </>
  );
};

export default ArticleCard;
