// ============================================================================
// ARTICLES BROWSE PAGE
// ============================================================================
// Central repository of all scholarly articles with filters and search
// Inspired by academic journal layouts (Nature, ScienceDirect, IEEE)
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, BookOpen, FileText, Users, Filter, X, Loader2 } from 'lucide-react';
import { ArticleCard } from '@/components/scholarly/ArticleCard';
import { ArticleFilters } from '@/components/scholarly/ArticleFilters';
import { StatCard } from '@/components/scholarly/StatCard';
import { mockDisciplines } from '@/utils/scholarlyRankingData';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const Articles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | undefined>(
    searchParams.get('discipline') || undefined
  );
  const [selectedUniversity, setSelectedUniversity] = useState<string | undefined>(
    searchParams.get('university') || undefined
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState({
    totalArticles: 0,
    articlesThisMonth: 0,
    totalDisciplines: 0,
    totalAuthors: 0,
  });

  const itemsPerPage = 10;

  // Load data from Supabase
  useEffect(() => {
    loadArticles();
    loadInstitutions();
    loadPlatformStats();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('articles' as any)
        .select(`
          *,
          article_authors(*),
          institutions(name, abbreviation),
          profiles!articles_submitted_by_fkey(full_name)
        `)
        .eq('is_current_version', true)
        .eq('status', 'approved'); // Only show approved articles

      // Apply filters
      if (selectedDiscipline) {
        query = query.eq('discipline', selectedDiscipline);
      }
      if (selectedUniversity) {
        query = query.eq('university_id', selectedUniversity);
      }
      if (selectedYear) {
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;
        query = query.gte('submitted_at', startDate).lte('submitted_at', endDate);
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,keywords.cs.{${searchQuery}}`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'recent':
          query = query.order('submitted_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('submitted_at', { ascending: true });
          break;
        case 'views':
          query = query.order('views', { ascending: false });
          break;
        case 'citations':
          query = query.order('citations', { ascending: false });
          break;
        default:
          query = query.order('submitted_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Transform articles to match expected format
        const transformedArticles = data.map((article: any) => ({
          ...article,
          slug: article.id,
          authors: article.article_authors || [],
          publishedAt: article.published_at || article.submitted_at,
          viewCount: article.views || 0,
          citationCount: article.citations || 0,
          downloadCount: article.downloads || 0,
          universityName: article.institutions?.name || 'Unknown',
          disciplineName: article.discipline || 'General',
        }));
        setArticles(transformedArticles);
      }
    } catch (error: any) {
      console.error('Error loading articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions' as any)
        .select('id, name, abbreviation')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) setInstitutions(data);
    } catch (error: any) {
      console.error('Error loading institutions:', error);
    }
  };

  const loadPlatformStats = async () => {
    try {
      // Get total approved articles
      const { count: totalArticles } = await supabase
        .from('articles' as any)
        .select('*', { count: 'exact', head: true })
        .eq('is_current_version', true)
        .eq('status', 'approved');

      // Get articles this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count: articlesThisMonth } = await supabase
        .from('articles' as any)
        .select('*', { count: 'exact', head: true })
        .eq('is_current_version', true)
        .eq('status', 'approved')
        .gte('submitted_at', startOfMonth.toISOString());

      // Get unique disciplines count
      const { data: disciplinesData } = await supabase
        .from('articles' as any)
        .select('discipline')
        .eq('is_current_version', true)
        .eq('status', 'approved')
        .not('discipline', 'is', null);
      
      const uniqueDisciplines = new Set(disciplinesData?.map(d => d.discipline) || []);

      // Get unique authors count
      const { data: authorsData } = await supabase
        .from('article_authors' as any)
        .select('id', { count: 'exact' });

      setPlatformStats({
        totalArticles: totalArticles || 0,
        articlesThisMonth: articlesThisMonth || 0,
        totalDisciplines: uniqueDisciplines.size,
        totalAuthors: authorsData?.length || 0,
      });
    } catch (error: any) {
      console.error('Error loading platform stats:', error);
    }
  };

  // Reload articles when filters change
  useEffect(() => {
    loadArticles();
  }, [selectedDiscipline, selectedUniversity, selectedYear, searchQuery, sortBy]);

  const styles = `
    .sr-articles-page {
      min-height: 100vh;
      background: #FAFAF9;
    }

    .sr-articles-hero {
      background: linear-gradient(180deg, #1E3A5F 0%, #2D4A6F 100%);
      color: #FFFFFF;
      padding: 100px 0 60px;
    }

    .sr-articles-hero__container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .sr-articles-hero__eyebrow {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 16px 0;
    }

    .sr-articles-hero__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 3rem;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .sr-articles-hero__separator {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
      border-radius: 2px;
      margin-bottom: 20px;
    }

    .sr-articles-hero__description {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.85);
      max-width: 600px;
      line-height: 1.6;
      margin: 0;
    }

    .sr-articles-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    .sr-articles-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: -50px;
      margin-bottom: 40px;
      position: relative;
      z-index: 10;
    }

    @media (max-width: 768px) {
      .sr-articles-stats {
        grid-template-columns: 1fr;
      }

      .sr-articles-hero__title {
        font-size: 2.25rem;
      }
    }

    .sr-articles-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;
    }

    @media (max-width: 1024px) {
      .sr-articles-layout {
        grid-template-columns: 1fr;
      }
    }

    .sr-articles-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    @media (max-width: 1024px) {
      .sr-articles-sidebar {
        display: none;
      }

      .sr-articles-sidebar--mobile {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        padding: 20px;
        overflow-y: auto;
      }

      .sr-articles-sidebar--mobile .sr-filters {
        max-width: 400px;
        margin: 0 auto;
      }
    }

    .sr-articles-mobile-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FFFFFF;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .sr-articles-main {
      flex: 1;
      min-width: 0;
    }

    .sr-articles-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .sr-articles-header__title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      margin: 0;
    }

    .sr-articles-header__count {
      font-weight: 600;
      color: #1C1917;
    }

    .sr-articles-mobile-filter-btn {
      display: none;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1C1917;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .sr-articles-mobile-filter-btn:hover {
      border-color: #D6D3D1;
      background: #FAFAF9;
    }

    @media (max-width: 1024px) {
      .sr-articles-mobile-filter-btn {
        display: flex;
      }
    }

    .sr-articles-search-bar {
      position: relative;
      margin-bottom: 24px;
    }

    .sr-articles-search-bar__icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #A8A29E;
      pointer-events: none;
    }

    .sr-articles-search-bar__input {
      width: 100%;
      padding: 14px 16px 14px 48px;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .sr-articles-search-bar__input::placeholder {
      color: #A8A29E;
    }

    .sr-articles-search-bar__input:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-articles-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sr-articles-empty {
      text-align: center;
      padding: 60px 24px;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
    }

    .sr-articles-empty__icon {
      color: #A8A29E;
      margin-bottom: 16px;
    }

    .sr-articles-empty__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .sr-articles-empty__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #57534E;
      margin: 0;
    }

    .sr-articles-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
    }

    .sr-articles-pagination__btn {
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

    .sr-articles-pagination__btn:hover:not(:disabled) {
      border-color: #D6D3D1;
      background: #FAFAF9;
    }

    .sr-articles-pagination__btn--active {
      background: #1E3A5F;
      border-color: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-articles-pagination__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .sr-articles-pagination__ellipsis {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #78716C;
      padding: 0 4px;
    }
  `;

  // Pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // University options for filters
  const universityOptions = institutions.map((u) => ({
    slug: u.id,
    name: u.name,
    abbreviation: u.abbreviation || '',
  }));

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedDiscipline(undefined);
    setSelectedUniversity(undefined);
    setSelectedYear(undefined);
    setSearchQuery('');
    setSortBy('recent');
    setCurrentPage(1);
  };

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
      <div className="sr-articles-page">
        <Navigation />

        {/* Hero Section */}
        <header className="sr-articles-hero">
          <div className="sr-articles-hero__container">
            <p className="sr-articles-hero__eyebrow">Scholarly Repository</p>
            <h1 className="sr-articles-hero__title">Research Articles</h1>
            <div className="sr-articles-hero__separator" />
            <p className="sr-articles-hero__description">
              Browse peer-reviewed research from leading institutions in Ghana. Discover groundbreaking
              research across multiple disciplines.
            </p>
          </div>
        </header>

        <main className="sr-articles-content">
          {/* Statistics */}
          <div className="sr-articles-stats">
            <StatCard
              label="Total Articles"
              value={formatNumber(platformStats.totalArticles)}
              change={{ value: platformStats.articlesThisMonth, isPositive: true, label: 'this month' }}
              icon={<BookOpen size={20} />}
            />
            <StatCard
              label="Disciplines"
              value={platformStats.totalDisciplines}
              icon={<FileText size={20} />}
            />
            <StatCard
              label="Contributing Authors"
              value={formatNumber(platformStats.totalAuthors)}
              icon={<Users size={20} />}
            />
          </div>

          {/* Main Layout */}
          <div className="sr-articles-layout">
            {/* Sidebar Filters (Desktop) */}
            <aside className="sr-articles-sidebar">
              <ArticleFilters
                disciplines={mockDisciplines}
                universities={universityOptions}
                selectedDiscipline={selectedDiscipline}
                selectedUniversity={selectedUniversity}
                selectedYear={selectedYear}
                sortBy={sortBy}
                searchQuery={searchQuery}
                onDisciplineChange={(d) => {
                  setSelectedDiscipline(d);
                  handleFilterChange();
                }}
                onUniversityChange={(u) => {
                  setSelectedUniversity(u);
                  handleFilterChange();
                }}
                onYearChange={(y) => {
                  setSelectedYear(y);
                  handleFilterChange();
                }}
                onSortChange={(s) => {
                  setSortBy(s);
                  handleFilterChange();
                }}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  handleFilterChange();
                }}
                onClearAll={handleClearAll}
              />
            </aside>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div className="sr-articles-sidebar sr-articles-sidebar--mobile">
                <button
                  className="sr-articles-mobile-close"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X size={20} />
                </button>
                <ArticleFilters
                  disciplines={mockDisciplines}
                  universities={universityOptions}
                  selectedDiscipline={selectedDiscipline}
                  selectedUniversity={selectedUniversity}
                  selectedYear={selectedYear}
                  sortBy={sortBy}
                  searchQuery={searchQuery}
                  onDisciplineChange={(d) => {
                    setSelectedDiscipline(d);
                    handleFilterChange();
                  }}
                  onUniversityChange={(u) => {
                    setSelectedUniversity(u);
                    handleFilterChange();
                  }}
                  onYearChange={(y) => {
                    setSelectedYear(y);
                    handleFilterChange();
                  }}
                  onSortChange={(s) => {
                    setSortBy(s);
                    handleFilterChange();
                  }}
                  onSearchChange={(q) => {
                    setSearchQuery(q);
                    handleFilterChange();
                  }}
                  onClearAll={handleClearAll}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="sr-articles-main">
              {/* Search Bar (Desktop) */}
              <div className="sr-articles-search-bar" style={{ display: 'none' }}>
                <Search size={20} className="sr-articles-search-bar__icon" />
                <input
                  type="text"
                  className="sr-articles-search-bar__input"
                  placeholder="Search articles, authors, keywords..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div>

              {/* Header */}
              <div className="sr-articles-header">
                <p className="sr-articles-header__title">
                  Showing{' '}
                  <span className="sr-articles-header__count">
                    {articles.length.toLocaleString()}
                  </span>{' '}
                  articles
                </p>
                <button
                  className="sr-articles-mobile-filter-btn"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              {/* Articles List */}
              {loading ? (
                <div className="sr-articles-empty">
                  <Loader2 size={48} className="sr-articles-empty__icon" style={{ animation: 'spin 1s linear infinite' }} />
                  <p className="sr-articles-empty__text">Loading articles...</p>
                </div>
              ) : paginatedArticles.length > 0 ? (
                <div className="sr-articles-list">
                  {paginatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="detailed" />
                  ))}
                </div>
              ) : (
                <div className="sr-articles-empty">
                  <BookOpen size={48} className="sr-articles-empty__icon" />
                  <h3 className="sr-articles-empty__title">No Articles Found</h3>
                  <p className="sr-articles-empty__text">
                    Try adjusting your filters or search query to find more articles.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="sr-articles-pagination">
                  <button
                    className="sr-articles-pagination__btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="sr-articles-pagination__ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`sr-articles-pagination__btn ${
                          currentPage === page ? 'sr-articles-pagination__btn--active' : ''
                        }`}
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    className="sr-articles-pagination__btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Articles;
