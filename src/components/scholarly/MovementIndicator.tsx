// ============================================================================
// MOVEMENT INDICATOR COMPONENT
// ============================================================================
// Displays ranking movement (up/down/stable/new) with visual indicators
// Follows academic, minimal design principles
// ============================================================================

import React from 'react';
import { ChevronUp, ChevronDown, Minus, Sparkles } from 'lucide-react';
import type { MovementIndicatorProps } from '@/utils/scholarlyRankingTypes';

export const MovementIndicator: React.FC<MovementIndicatorProps> = ({
  movement,
  delta = 0,
  size = 'md',
  showLabel = false,
}) => {
  const styles = `
    .sr-movement-indicator {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
      font-weight: 600;
      line-height: 1;
    }

    .sr-movement-indicator--sm {
      font-size: 0.75rem;
    }

    .sr-movement-indicator--md {
      font-size: 0.875rem;
    }

    .sr-movement-indicator--lg {
      font-size: 1rem;
    }

    .sr-movement-indicator--up {
      color: #2D5A47;
    }

    .sr-movement-indicator--up .sr-movement-icon {
      color: #10B981;
    }

    .sr-movement-indicator--up .sr-movement-label {
      color: #FFFFFF;
    }

    .sr-movement-indicator--down {
      color: #7C2D36;
    }

    .sr-movement-indicator--down .sr-movement-icon {
      color: #EF4444;
    }

    .sr-movement-indicator--down .sr-movement-label {
      color: #FFFFFF;
    }

    .sr-movement-indicator--stable {
      color: #78716C;
    }

    .sr-movement-indicator--new {
      color: #1E3A5F;
    }

    .sr-movement-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sr-movement-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sr-movement-badge--new {
      background-color: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-movement-label {
      font-size: 0.75rem;
      font-weight: 500;
      margin-left: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
    }
  `;

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const iconSize = iconSizes[size];

  const renderContent = () => {
    switch (movement) {
      case 'up':
        return (
          <>
            <span className="sr-movement-icon">
              <ChevronUp size={iconSize} strokeWidth={2.5} />
            </span>
            {delta > 0 && <span>{delta}</span>}
            {showLabel && <span className="sr-movement-label">positions up</span>}
          </>
        );
      case 'down':
        return (
          <>
            <span className="sr-movement-icon">
              <ChevronDown size={iconSize} strokeWidth={2.5} />
            </span>
            {delta > 0 && <span>{delta}</span>}
            {showLabel && <span className="sr-movement-label">positions down</span>}
          </>
        );
      case 'stable':
        return (
          <>
            <span className="sr-movement-icon">
              <Minus size={iconSize} strokeWidth={2.5} />
            </span>
            {showLabel && <span className="sr-movement-label">unchanged</span>}
          </>
        );
      case 'new':
        return (
          <span className="sr-movement-badge sr-movement-badge--new">
            <Sparkles size={10} />
            New
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <span
        className={`sr-movement-indicator sr-movement-indicator--${size} sr-movement-indicator--${movement}`}
        aria-label={`Ranking ${movement}${delta > 0 ? ` by ${delta} positions` : ''}`}
      >
        {renderContent()}
      </span>
    </>
  );
};

export default MovementIndicator;
