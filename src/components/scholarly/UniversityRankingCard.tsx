// ============================================================================
// UNIVERSITY RANKING CARD COMPONENT
// ============================================================================
// Displays a single university in the rankings list with movement indicators
// Academic, minimal design with hover effects and trend visualization
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2 } from 'lucide-react';
import { MovementIndicator } from './MovementIndicator';
import { Sparkline } from './RankingCharts';
import type { RankedUniversity } from '@/utils/scholarlyRankingTypes';
import { formatNumber } from '@/utils/scholarlyRankingData';

interface UniversityRankingCardProps {
  university: RankedUniversity;
  showTrend?: boolean;
  variant?: 'default' | 'compact';
}

export const UniversityRankingCard: React.FC<UniversityRankingCardProps> = ({
  university,
  showTrend = true,
  variant = 'default',
}) => {
  const styles = `
    .sr-ranking-card {
      display: flex;
      align-items: center;
      gap: 20px;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      padding: 20px 24px;
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .sr-ranking-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .sr-ranking-card:hover .sr-ranking-card__accent {
      opacity: 1;
    }

    .sr-ranking-card--compact {
      padding: 16px 20px;
      gap: 16px;
    }

    .sr-ranking-card__accent {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #1E3A5F;
      border-radius: 10px 0 0 10px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .sr-ranking-card__rank-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 56px;
      flex-shrink: 0;
    }

    .sr-ranking-card__rank {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2.5rem;
      font-weight: 600;
      color: #1C1917;
      line-height: 1;
      margin: 0;
    }

    .sr-ranking-card--compact .sr-ranking-card__rank {
      font-size: 2rem;
    }

    .sr-ranking-card__movement {
      margin-top: 4px;
    }

    .sr-ranking-card__main {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sr-ranking-card__logo-container {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      background: #F5F5F4;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sr-ranking-card--compact .sr-ranking-card__logo-container {
      width: 44px;
      height: 44px;
    }

    .sr-ranking-card__logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 6px;
    }

    .sr-ranking-card__logo-placeholder {
      color: #A8A29E;
    }

    .sr-ranking-card__info {
      flex: 1;
      min-width: 0;
    }

    .sr-ranking-card__name {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sr-ranking-card--compact .sr-ranking-card__name {
      font-size: 1.0625rem;
    }

    .sr-ranking-card__location {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      margin: 0;
    }

    .sr-ranking-card__stats {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-shrink: 0;
    }

    .sr-ranking-card__stat {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .sr-ranking-card__stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1C1917;
      line-height: 1.2;
    }

    .sr-ranking-card__stat-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sr-ranking-card__growth {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #2D5A47;
      margin-top: 2px;
    }

    .sr-ranking-card__growth-icon {
      display: flex;
      align-items: center;
    }

    .sr-ranking-card__trend {
      flex-shrink: 0;
      opacity: 0.7;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .sr-ranking-card {
        flex-wrap: wrap;
        gap: 12px;
      }

      .sr-ranking-card__stats {
        width: 100%;
        justify-content: space-between;
        padding-top: 12px;
        border-top: 1px solid #F5F5F4;
      }

      .sr-ranking-card__trend {
        display: none;
      }

      .sr-ranking-card__stat {
        align-items: flex-start;
        text-align: left;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <Link
        to={`/scholarly/universities/${university.slug}`}
        className={`sr-ranking-card ${variant === 'compact' ? 'sr-ranking-card--compact' : ''}`}
        style={{ position: 'relative' }}
      >
        <div className="sr-ranking-card__accent" />

        {/* Rank Section */}
        <div className="sr-ranking-card__rank-section">
          <p className="sr-ranking-card__rank">{university.currentRank}</p>
          <div className="sr-ranking-card__movement">
            <MovementIndicator
              movement={university.movement}
              delta={university.movementDelta}
              size="sm"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="sr-ranking-card__main">
          <div className="sr-ranking-card__logo-container">
            {university.logo ? (
              <img
                src={university.logo}
                alt={`${university.name} logo`}
                className="sr-ranking-card__logo"
              />
            ) : (
              <Building2 size={24} className="sr-ranking-card__logo-placeholder" />
            )}
          </div>

          <div className="sr-ranking-card__info">
            <h3 className="sr-ranking-card__name">{university.name}</h3>
            <p className="sr-ranking-card__location">
              {university.city}, {university.country}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="sr-ranking-card__stats">
          <div className="sr-ranking-card__stat">
            <span className="sr-ranking-card__stat-value">
              {formatNumber(university.totalArticles)}
            </span>
            <span className="sr-ranking-card__stat-label">Articles</span>
          </div>

          <div className="sr-ranking-card__stat">
            <span className="sr-ranking-card__stat-value">
              +{university.articlesThisMonth}
            </span>
            <span className="sr-ranking-card__stat-label">This Month</span>
            {university.articlesThisMonth > 30 && (
              <div className="sr-ranking-card__growth">
                <span className="sr-ranking-card__growth-icon">
                  <TrendingUp size={12} />
                </span>
                <span>Growing</span>
              </div>
            )}
          </div>
        </div>

        {/* Trend Sparkline */}
        {showTrend && university.monthlyArticleCounts && (
          <div className="sr-ranking-card__trend">
            <Sparkline
              data={university.monthlyArticleCounts}
              width={80}
              height={32}
              color="#1E3A5F"
            />
          </div>
        )}
      </Link>
    </>
  );
};

// -----------------------------------------------------------------------------
// RANKING TABLE ROW VARIANT
// -----------------------------------------------------------------------------

interface UniversityTableRowProps {
  university: RankedUniversity;
  isFirst?: boolean;
}

export const UniversityTableRow: React.FC<UniversityTableRowProps> = ({
  university,
  isFirst = false,
}) => {
  const styles = `
    .sr-table-row {
      display: grid;
      grid-template-columns: 80px 1fr 120px 120px 100px;
      align-items: center;
      padding: 16px 20px;
      background: #FFFFFF;
      border-bottom: 1px solid #E7E5E4;
      transition: background-color 0.15s ease;
      text-decoration: none;
      color: inherit;
    }

    .sr-table-row:hover {
      background: #FAFAF9;
    }

    .sr-table-row--first {
      background: linear-gradient(90deg, rgba(30, 58, 95, 0.03) 0%, transparent 50%);
    }

    .sr-table-row__rank-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .sr-table-row__rank {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
    }

    .sr-table-row__university-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .sr-table-row__logo {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      object-fit: contain;
      background: #F5F5F4;
      padding: 4px;
      flex-shrink: 0;
    }

    .sr-table-row__university-info {
      min-width: 0;
    }

    .sr-table-row__name {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sr-table-row__location {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0;
    }

    .sr-table-row__stat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9375rem;
      color: #1C1917;
      text-align: right;
    }

    .sr-table-row__trend {
      display: flex;
      justify-content: flex-end;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <Link
        to={`/scholarly/universities/${university.slug}`}
        className={`sr-table-row ${isFirst ? 'sr-table-row--first' : ''}`}
      >
        <div className="sr-table-row__rank-cell">
          <span className="sr-table-row__rank">{university.currentRank}</span>
          <MovementIndicator
            movement={university.movement}
            delta={university.movementDelta}
            size="sm"
          />
        </div>

        <div className="sr-table-row__university-cell">
          {university.logo && (
            <img
              src={university.logo}
              alt=""
              className="sr-table-row__logo"
            />
          )}
          <div className="sr-table-row__university-info">
            <h4 className="sr-table-row__name">{university.name}</h4>
            <p className="sr-table-row__location">
              {university.city}, {university.country}
            </p>
          </div>
        </div>

        <div className="sr-table-row__stat">
          {formatNumber(university.totalArticles)}
        </div>

        <div className="sr-table-row__stat">+{university.articlesThisMonth}</div>

        <div className="sr-table-row__trend">
          {university.monthlyArticleCounts && (
            <Sparkline
              data={university.monthlyArticleCounts}
              width={70}
              height={24}
            />
          )}
        </div>
      </Link>
    </>
  );
};

export default UniversityRankingCard;
