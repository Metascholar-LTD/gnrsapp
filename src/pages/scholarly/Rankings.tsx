// ============================================================================
// UNIVERSITY RANKINGS PAGE
// ============================================================================
// Main rankings page displaying universities ranked by scholarly output
// Features filters, statistics, and visualizations
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Filter, LayoutGrid, List, Award, BookOpen, Building2, Globe, Loader2 } from 'lucide-react';
import { UniversityRankingCard, UniversityTableRow } from '@/components/scholarly/UniversityRankingCard';
import { StatCard } from '@/components/scholarly/StatCard';
import { RankingBarChart, TrendLineChart } from '@/components/scholarly/RankingCharts';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const Rankings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState({
    totalInstitutions: 0,
    totalArticles: 0,
    totalCitations: 0,
    totalViews: 0,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    loadInstitutions();
    loadPlatformStats();
  }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('institutions' as any)
        .select('*')
        .eq('status', 'active')
        .order('current_rank', { ascending: true });

      if (error) throw error;
      if (data) {
        const institutionIds = data.map((inst: any) => inst.id);
        
        // Fetch ALL articles for these institutions to calculate total counts
        const { data: allArticlesData } = await supabase
          .from('articles' as any)
          .select('institution_id, published_at, created_at')
          .eq('status', 'approved')
          .eq('is_current_version', true)
          .in('institution_id', institutionIds);

        // Fetch monthly article counts for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const { data: articlesData } = await supabase
          .from('articles' as any)
          .select('institution_id, published_at, created_at')
          .eq('status', 'approved')
          .eq('is_current_version', true)
          .in('institution_id', institutionIds)
          .gte('created_at', sixMonthsAgo.toISOString());

        // Calculate current month boundaries
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Calculate total articles per institution
        const totalArticlesByInstitution: { [key: string]: number } = {};
        if (allArticlesData) {
          allArticlesData.forEach((article: any) => {
            const instId = article.institution_id;
            if (!instId) return;
            totalArticlesByInstitution[instId] = (totalArticlesByInstitution[instId] || 0) + 1;
          });
        }

        // Calculate articles this month per institution
        const articlesThisMonthByInstitution: { [key: string]: number } = {};
        if (allArticlesData) {
          allArticlesData.forEach((article: any) => {
            const instId = article.institution_id;
            if (!instId) return;
            
            const date = article.published_at || article.created_at;
            if (!date) return;
            
            const articleDate = new Date(date);
            if (articleDate >= currentMonthStart) {
              articlesThisMonthByInstitution[instId] = (articlesThisMonthByInstitution[instId] || 0) + 1;
            }
          });
        }

        // Group articles by institution and month for trend chart
        const monthlyCountsByInstitution: { [key: string]: { [key: string]: number } } = {};
        
        if (articlesData) {
          articlesData.forEach((article: any) => {
            const instId = article.institution_id;
            if (!instId) return;
            
            const date = article.published_at || article.created_at;
            if (!date) return;
            
            const articleDate = new Date(date);
            const monthKey = `${articleDate.getFullYear()}-${String(articleDate.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyCountsByInstitution[instId]) {
              monthlyCountsByInstitution[instId] = {};
            }
            monthlyCountsByInstitution[instId][monthKey] = (monthlyCountsByInstitution[instId][monthKey] || 0) + 1;
          });
        }

        // Generate last 6 months array
        const last6Months: string[] = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          last6Months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        }

        // Transform to match expected format and ensure sequential ranks
        // If ranks have gaps, recalculate them sequentially (1, 2, 3, 4...)
        const transformed = data.map((inst: any, index: number) => {
          // Use sequential rank based on position in ordered list
          // This ensures no gaps even if database has gaps temporarily
          const sequentialRank = index + 1;
          const dbRank = inst.current_rank;
          
          // Get monthly article counts for this institution
          const instMonthlyCounts = monthlyCountsByInstitution[inst.id] || {};
          const monthlyArticleCounts = last6Months.map(month => instMonthlyCounts[month] || 0);
          
          // Use calculated values from database instead of hardcoded
          const totalArticles = totalArticlesByInstitution[inst.id] || 0;
          const articlesThisMonth = articlesThisMonthByInstitution[inst.id] || 0;
          
          return {
            id: inst.id,
            slug: inst.id,
            name: inst.name,
            abbreviation: inst.abbreviation,
            logo: inst.logo,
            country: inst.country || 'Ghana',
            city: inst.city || '',
            currentRank: sequentialRank, // Always sequential
            previousRank: inst.previous_rank,
            movement: inst.movement || 'stable',
            movementDelta: 0,
            totalArticles: totalArticles, // Calculated from actual articles
            articlesThisMonth: articlesThisMonth, // Calculated from current month articles
            articlesThisYear: 0,
            totalCitations: 0,
            totalViews: 0,
            totalDownloads: 0,
            hIndex: 0,
            monthlyArticleCounts: monthlyArticleCounts, // Real data or flat line (all zeros)
            createdAt: inst.created_at,
            updatedAt: inst.updated_at,
          };
        });
        setInstitutions(transformed);
        
        // If there are rank gaps in the database, trigger recalculation
        const hasGaps = data.some((inst: any, index: number) => {
          const expectedRank = index + 1;
          return inst.current_rank !== expectedRank && inst.current_rank !== null;
        });
        
        if (hasGaps && data.length > 0) {
          // Trigger database recalculation in background
          (async () => {
            try {
              await (supabase.rpc as any)('recalculate_institution_ranks');
            } catch (err: any) {
              console.warn('Could not trigger rank recalculation:', err);
            }
          })();
        }
      }
    } catch (error: any) {
      console.error('Error loading institutions:', error);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const loadPlatformStats = async () => {
    try {
      // Get total institutions
      const { count: totalInstitutions } = await supabase
        .from('institutions' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total articles
      const { count: totalArticles } = await supabase
        .from('articles' as any)
        .select('*', { count: 'exact', head: true })
        .eq('is_current_version', true)
        .eq('status', 'approved');

      // Get total citations and views
      const { data: articlesData } = await supabase
        .from('articles' as any)
        .select('citations, views')
        .eq('is_current_version', true)
        .eq('status', 'approved');

      const articles = (articlesData as any) || [];
      const totalCitations = articles.reduce((sum: number, a: any) => sum + (a.citations || 0), 0) || 0;
      const totalViews = articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0) || 0;

      setPlatformStats({
        totalInstitutions: totalInstitutions || 0,
        totalArticles: totalArticles || 0,
        totalCitations,
        totalViews,
      });
    } catch (error: any) {
      console.error('Error loading platform stats:', error);
    }
  };

  const styles = `
    .sr-rankings-page {
      min-height: 100vh;
      background: #FAFAF9;
    }

    .sr-rankings-hero {
      background: linear-gradient(180deg, #1E3A5F 0%, #2D4A6F 100%);
      color: #FFFFFF;
      padding: 100px 0 60px;
    }

    .sr-rankings-hero__container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .sr-rankings-hero__eyebrow {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 16px 0;
    }

    .sr-rankings-hero__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 3rem;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .sr-rankings-hero__separator {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
      border-radius: 2px;
      margin-bottom: 20px;
    }

    .sr-rankings-hero__description {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.85);
      max-width: 600px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .sr-rankings-hero__updated {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .sr-rankings-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    .sr-rankings-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: -60px;
      margin-bottom: 40px;
      position: relative;
      z-index: 10;
    }

    @media (max-width: 1024px) {
      .sr-rankings-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .sr-rankings-stats {
        grid-template-columns: 1fr;
      }

      .sr-rankings-hero__title {
        font-size: 2.25rem;
      }
    }

    .sr-rankings-charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 40px;
    }

    @media (max-width: 1024px) {
      .sr-rankings-charts {
        grid-template-columns: 1fr;
      }
    }

    .sr-rankings-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .sr-rankings-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .sr-rankings-search {
      position: relative;
      min-width: 280px;
    }

    .sr-rankings-search__icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .sr-rankings-search__input {
      width: 100%;
      padding: 12px 14px 12px 42px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .sr-rankings-search__input::placeholder {
      color: #A8A29E;
    }

    .sr-rankings-search__input:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-rankings-select {
      padding: 12px 40px 12px 14px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A8A29E' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
    }

    .sr-rankings-select:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-rankings-view-toggle {
      display: flex;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      overflow: hidden;
    }

    .sr-rankings-view-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 14px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #78716C;
      transition: all 0.15s ease;
    }

    .sr-rankings-view-btn:hover {
      background: #F5F5F4;
      color: #57534E;
    }

    .sr-rankings-view-btn--active {
      background: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-rankings-view-btn--active:hover {
      background: #2D4A6F;
      color: #FFFFFF;
    }

    .sr-rankings-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sr-rankings-table {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      overflow: hidden;
    }

    .sr-rankings-table__header {
      display: grid;
      grid-template-columns: 80px 1fr 120px 120px 100px;
      align-items: center;
      padding: 14px 20px;
      background: #FAFAF9;
      border-bottom: 1px solid #E7E5E4;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sr-rankings-table__header span:nth-child(3),
    .sr-rankings-table__header span:nth-child(4) {
      text-align: right;
    }

    .sr-rankings-table__header span:last-child {
      text-align: right;
    }

    .sr-rankings-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
    }

    .sr-rankings-pagination__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      padding: 0 12px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      background: #FFFFFF;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .sr-rankings-pagination__btn:hover:not(:disabled) {
      border-color: #D6D3D1;
      background: #FAFAF9;
    }

    .sr-rankings-pagination__btn--active {
      background: #1E3A5F;
      border-color: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-rankings-pagination__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .sr-rankings-pagination__ellipsis {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      padding: 0 4px;
    }

    .sr-rankings-methodology {
      margin-top: 48px;
      padding: 24px;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
    }

    .sr-rankings-methodology__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 12px 0;
    }

    .sr-rankings-methodology__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      line-height: 1.7;
      margin: 0;
    }
  `;

  // Get unique countries
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(institutions.map((u) => u.country)));
    return uniqueCountries.sort();
  }, [institutions]);

  // Filter institutions
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (uni.abbreviation && uni.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCountry = !selectedCountry || uni.country === selectedCountry;
      return matchesSearch && matchesCountry;
    });
  }, [institutions, searchQuery, selectedCountry]);

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const paginatedInstitutions = filteredInstitutions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-rankings-page">
        <Navigation />

        {/* Hero Section */}
        <header className="sr-rankings-hero">
          <div className="sr-rankings-hero__container">
            <p className="sr-rankings-hero__eyebrow">Scholarly Rankings</p>
            <h1 className="sr-rankings-hero__title">University Rankings</h1>
            <div className="sr-rankings-hero__separator" />
            <p className="sr-rankings-hero__description">
              Academic institutions ranked by scholarly contributions. Rankings are calculated based on
              the total volume of peer-reviewed articles published by affiliated researchers.
            </p>
            <p className="sr-rankings-hero__updated">
              Last updated: January 15, 2026 at 14:32 UTC
            </p>
          </div>
        </header>

        <main className="sr-rankings-content">
          {/* Statistics Cards */}
          <div className="sr-rankings-stats">
            <StatCard
              label="Universities"
              value={platformStats.totalInstitutions}
              icon={<Building2 size={20} />}
            />
            <StatCard
              label="Articles Published"
              value={formatNumber(platformStats.totalArticles)}
              icon={<BookOpen size={20} />}
            />
            <StatCard
              label="Total Citations"
              value={formatNumber(platformStats.totalCitations)}
              icon={<Award size={20} />}
            />
            <StatCard
              label="Countries"
              value={countries.length}
              icon={<Globe size={20} />}
            />
          </div>

          {/* Charts Section - TODO: Implement real chart data */}
          {/* <div className="sr-rankings-charts">
            <RankingBarChart data={mockBarChartData} title="Top 10 Universities by Articles" height={320} />
            <TrendLineChart data={mockTrendData} title="Publication Growth (2025)" height={280} />
          </div> */}

          {/* Controls */}
          <div className="sr-rankings-controls">
            <div className="sr-rankings-filters">
              <div className="sr-rankings-search">
                <Search size={18} className="sr-rankings-search__icon" />
                <input
                  type="text"
                  className="sr-rankings-search__input"
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                className="sr-rankings-select"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="sr-rankings-view-toggle">
              <button
                className={`sr-rankings-view-btn ${viewMode === 'cards' ? 'sr-rankings-view-btn--active' : ''}`}
                onClick={() => setViewMode('cards')}
                aria-label="Card view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`sr-rankings-view-btn ${viewMode === 'table' ? 'sr-rankings-view-btn--active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Rankings List */}
          {viewMode === 'cards' ? (
            <div className="sr-rankings-list">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                  <p>Loading rankings...</p>
                </div>
              ) : paginatedInstitutions.length > 0 ? (
                paginatedInstitutions.map((university) => (
                  <UniversityRankingCard key={university.id} university={university} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <p>No institutions found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="sr-rankings-table">
              <div className="sr-rankings-table__header">
                <span>Rank</span>
                <span>University</span>
                <span>Articles</span>
                <span>This Month</span>
                <span>Trend</span>
              </div>
              {paginatedInstitutions.map((university, index) => (
                <UniversityTableRow
                  key={university.id}
                  university={university}
                  isFirst={index === 0 && currentPage === 1}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sr-rankings-pagination">
              <button
                className="sr-rankings-pagination__btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="sr-rankings-pagination__ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    className={`sr-rankings-pagination__btn ${
                      currentPage === page ? 'sr-rankings-pagination__btn--active' : ''
                    }`}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="sr-rankings-pagination__btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {/* Methodology */}
          <div className="sr-rankings-methodology">
            <h2 className="sr-rankings-methodology__title">Ranking Methodology</h2>
            <p className="sr-rankings-methodology__text">
              University rankings are determined primarily by the total number of peer-reviewed scholarly
              articles published by affiliated researchers. Rankings are updated in real-time as new
              articles are submitted and approved. Movement indicators show changes compared to the
              previous ranking period. Future iterations will incorporate additional metrics including
              citation counts, view statistics, and h-index calculations to provide a more comprehensive
              measure of academic impact.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Rankings;
