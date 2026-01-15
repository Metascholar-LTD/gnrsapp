// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
// Displays statistical metrics with optional change indicators
// Academic, minimal design with clear typography hierarchy
// ============================================================================

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  size = 'md',
}) => {
  const styles = `
    .sr-stat-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .sr-stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      border-color: #D6D3D1;
    }

    .sr-stat-card--sm {
      padding: 16px 20px;
    }

    .sr-stat-card--lg {
      padding: 24px 28px;
    }

    .sr-stat-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sr-stat-card__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #57534E;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0;
    }

    .sr-stat-card__icon {
      color: #A8A29E;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sr-stat-card__value {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2.25rem;
      font-weight: 600;
      color: #1C1917;
      line-height: 1.1;
      margin: 0;
    }

    .sr-stat-card--sm .sr-stat-card__value {
      font-size: 1.75rem;
    }

    .sr-stat-card--lg .sr-stat-card__value {
      font-size: 2.75rem;
    }

    .sr-stat-card__change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      margin-top: 4px;
    }

    .sr-stat-card__change--positive {
      color: #2D5A47;
    }

    .sr-stat-card__change--negative {
      color: #7C2D36;
    }

    .sr-stat-card__change-icon {
      display: flex;
      align-items: center;
    }

    .sr-stat-card__change-label {
      color: #78716C;
      font-weight: 400;
      margin-left: 2px;
    }
  `;

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`sr-stat-card sr-stat-card--${size}`}>
        <div className="sr-stat-card__header">
          <p className="sr-stat-card__label">{label}</p>
          {icon && <span className="sr-stat-card__icon">{icon}</span>}
        </div>
        <p className="sr-stat-card__value">{formatValue(value)}</p>
        {change && (
          <div
            className={`sr-stat-card__change sr-stat-card__change--${
              change.isPositive ? 'positive' : 'negative'
            }`}
          >
            <span className="sr-stat-card__change-icon">
              {change.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
            </span>
            <span>
              {change.isPositive ? '+' : ''}
              {change.value}
            </span>
            {change.label && (
              <span className="sr-stat-card__change-label">{change.label}</span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StatCard;
