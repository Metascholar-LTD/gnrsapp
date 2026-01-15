// ============================================================================
// ARTICLE FILTERS COMPONENT
// ============================================================================
// Sidebar filters for browsing scholarly articles
// Includes discipline tree, university selector, year, and sort options
// ============================================================================

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, X, Filter } from 'lucide-react';
import type { Discipline } from '@/utils/scholarlyRankingTypes';

interface ArticleFiltersProps {
  disciplines: Discipline[];
  universities: { slug: string; name: string; abbreviation?: string }[];
  selectedDiscipline?: string;
  selectedUniversity?: string;
  selectedYear?: number;
  sortBy?: string;
  searchQuery?: string;
  onDisciplineChange: (discipline: string | undefined) => void;
  onUniversityChange: (university: string | undefined) => void;
  onYearChange: (year: number | undefined) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
}

export const ArticleFilters: React.FC<ArticleFiltersProps> = ({
  disciplines,
  universities,
  selectedDiscipline,
  selectedUniversity,
  selectedYear,
  sortBy = 'recent',
  searchQuery = '',
  onDisciplineChange,
  onUniversityChange,
  onYearChange,
  onSortChange,
  onSearchChange,
  onClearAll,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const styles = `
    .sr-filters {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      overflow: hidden;
    }

    .sr-filters__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #E7E5E4;
      background: #FAFAF9;
    }

    .sr-filters__title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sr-filters__clear {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      color: #1E3A5F;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
    }

    .sr-filters__clear:hover {
      color: #2D4A6F;
    }

    .sr-filters__section {
      padding: 16px 20px;
      border-bottom: 1px solid #F5F5F4;
    }

    .sr-filters__section:last-child {
      border-bottom: none;
    }

    .sr-filters__section-title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 12px 0;
    }

    .sr-filters__search {
      position: relative;
    }

    .sr-filters__search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .sr-filters__search-input {
      width: 100%;
      padding: 10px 12px 10px 38px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .sr-filters__search-input::placeholder {
      color: #A8A29E;
    }

    .sr-filters__search-input:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-filters__disciplines {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sr-filters__discipline-parent {
      display: flex;
      flex-direction: column;
    }

    .sr-filters__discipline-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .sr-filters__discipline-header:hover {
      color: #1E3A5F;
    }

    .sr-filters__discipline-toggle {
      color: #A8A29E;
      display: flex;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .sr-filters__discipline-toggle--expanded {
      transform: rotate(90deg);
    }

    .sr-filters__discipline-name {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
      flex: 1;
    }

    .sr-filters__discipline-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #A8A29E;
    }

    .sr-filters__discipline-children {
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .sr-filters__discipline-child {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .sr-filters__discipline-child:hover {
      color: #1E3A5F;
    }

    .sr-filters__discipline-child--active {
      color: #1E3A5F;
      font-weight: 500;
    }

    .sr-filters__discipline-radio {
      width: 14px;
      height: 14px;
      border: 1.5px solid #D6D3D1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sr-filters__discipline-radio--active {
      border-color: #1E3A5F;
    }

    .sr-filters__discipline-radio--active::after {
      content: '';
      width: 6px;
      height: 6px;
      background: #1E3A5F;
      border-radius: 50%;
    }

    .sr-filters__select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
      background: #FFFFFF;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A8A29E' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }

    .sr-filters__select:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-filters__active-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .sr-filters__active-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #1E3A5F;
      color: #FFFFFF;
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .sr-filters__active-tag-remove {
      display: flex;
      align-items: center;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.15s ease;
    }

    .sr-filters__active-tag-remove:hover {
      opacity: 1;
    }

    .sr-filters__sort-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sr-filters__sort-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
    }

    .sr-filters__sort-option:hover {
      border-color: #D6D3D1;
      background: #FAFAF9;
    }

    .sr-filters__sort-option--active {
      border-color: #1E3A5F;
      background: rgba(30, 58, 95, 0.05);
      color: #1E3A5F;
    }

    .sr-filters__sort-radio {
      width: 14px;
      height: 14px;
      border: 1.5px solid #D6D3D1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sr-filters__sort-option--active .sr-filters__sort-radio {
      border-color: #1E3A5F;
    }

    .sr-filters__sort-option--active .sr-filters__sort-radio::after {
      content: '';
      width: 6px;
      height: 6px;
      background: #1E3A5F;
      border-radius: 50%;
    }
  `;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'citations', label: 'Most Cited' },
    { value: 'downloads', label: 'Most Downloaded' },
  ];

  const hasActiveFilters = selectedDiscipline || selectedUniversity || selectedYear;

  return (
    <>
      <style>{styles}</style>
      <div className="sr-filters">
        <div className="sr-filters__header">
          <h3 className="sr-filters__title">
            <Filter size={14} />
            Filters
          </h3>
          {hasActiveFilters && (
            <button className="sr-filters__clear" onClick={onClearAll}>
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="sr-filters__section">
          <div className="sr-filters__search">
            <Search size={16} className="sr-filters__search-icon" />
            <input
              type="text"
              className="sr-filters__search-input"
              placeholder="Search articles, authors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="sr-filters__section">
            <div className="sr-filters__active-filters">
              {selectedDiscipline && (
                <span className="sr-filters__active-tag">
                  {selectedDiscipline}
                  <span
                    className="sr-filters__active-tag-remove"
                    onClick={() => onDisciplineChange(undefined)}
                  >
                    <X size={12} />
                  </span>
                </span>
              )}
              {selectedUniversity && (
                <span className="sr-filters__active-tag">
                  {universities.find((u) => u.slug === selectedUniversity)?.abbreviation ||
                    selectedUniversity}
                  <span
                    className="sr-filters__active-tag-remove"
                    onClick={() => onUniversityChange(undefined)}
                  >
                    <X size={12} />
                  </span>
                </span>
              )}
              {selectedYear && (
                <span className="sr-filters__active-tag">
                  {selectedYear}
                  <span
                    className="sr-filters__active-tag-remove"
                    onClick={() => onYearChange(undefined)}
                  >
                    <X size={12} />
                  </span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Disciplines */}
        <div className="sr-filters__section">
          <h4 className="sr-filters__section-title">Disciplines</h4>
          <div className="sr-filters__disciplines">
            {disciplines.map((parent) => (
              <div key={parent.id} className="sr-filters__discipline-parent">
                <div
                  className="sr-filters__discipline-header"
                  onClick={() => toggleCategory(parent.id)}
                >
                  <span
                    className={`sr-filters__discipline-toggle ${
                      expandedCategories.includes(parent.id)
                        ? 'sr-filters__discipline-toggle--expanded'
                        : ''
                    }`}
                  >
                    <ChevronRight size={14} />
                  </span>
                  <span className="sr-filters__discipline-name">{parent.name}</span>
                  <span className="sr-filters__discipline-count">
                    {parent.articleCount.toLocaleString()}
                  </span>
                </div>
                {expandedCategories.includes(parent.id) && parent.children && (
                  <div className="sr-filters__discipline-children">
                    {parent.children.map((child) => (
                      <div
                        key={child.id}
                        className={`sr-filters__discipline-child ${
                          selectedDiscipline === child.name
                            ? 'sr-filters__discipline-child--active'
                            : ''
                        }`}
                        onClick={() =>
                          onDisciplineChange(
                            selectedDiscipline === child.name ? undefined : child.name
                          )
                        }
                      >
                        <span
                          className={`sr-filters__discipline-radio ${
                            selectedDiscipline === child.name
                              ? 'sr-filters__discipline-radio--active'
                              : ''
                          }`}
                        />
                        <span className="sr-filters__discipline-name">{child.name}</span>
                        <span className="sr-filters__discipline-count">
                          {child.articleCount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* University */}
        <div className="sr-filters__section">
          <h4 className="sr-filters__section-title">University</h4>
          <select
            className="sr-filters__select"
            value={selectedUniversity || ''}
            onChange={(e) => onUniversityChange(e.target.value || undefined)}
          >
            <option value="">All Universities</option>
            {universities.map((uni) => (
              <option key={uni.slug} value={uni.slug}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="sr-filters__section">
          <h4 className="sr-filters__section-title">Publication Year</h4>
          <select
            className="sr-filters__select"
            value={selectedYear || ''}
            onChange={(e) =>
              onYearChange(e.target.value ? parseInt(e.target.value) : undefined)
            }
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="sr-filters__section">
          <h4 className="sr-filters__section-title">Sort By</h4>
          <div className="sr-filters__sort-options">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`sr-filters__sort-option ${
                  sortBy === option.value ? 'sr-filters__sort-option--active' : ''
                }`}
                onClick={() => onSortChange(option.value)}
              >
                <span className="sr-filters__sort-radio" />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleFilters;
