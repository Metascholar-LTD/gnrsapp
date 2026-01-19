// ============================================================================
// UNIVERSITY PROFILE PAGE
// ============================================================================
// Detailed view of a single university with stats, charts, and articles
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ExternalLink,
  Globe,
  Calendar,
  Users,
  BookOpen,
  Eye,
  Quote,
  Building2,
  Loader2,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { MovementIndicator } from '@/components/scholarly/MovementIndicator';
import { StatCard } from '@/components/scholarly/StatCard';
import {
  RankingHistoryChart,
  TrendLineChart,
  DisciplineBreakdown,
} from '@/components/scholarly/RankingCharts';
import { ArticleListItem } from '@/components/scholarly/ArticleCard';
import { formatNumber } from '@/utils/scholarlyRankingData';
import type { UniversityProfile, RankingHistoryPoint, DisciplineCount } from '@/utils/scholarlyRankingTypes';

const UniversityProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<UniversityProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadInstitutionProfile(slug);
    }
  }, [slug]);

  const loadInstitutionProfile = async (institutionId: string) => {
    setLoading(true);
    try {
      // Fetch institution
      const { data: institutionData, error: institutionError } = await supabase
        .from('institutions' as any)
        .select('*')
        .eq('id', institutionId)
        .eq('status', 'active')
        .single();

      if (institutionError) throw institutionError;
      if (!institutionData) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const institution = institutionData as any;

      // Fetch all approved articles for this institution to calculate real counts
      const { data: allArticlesData } = await supabase
        .from('articles' as any)
        .select('id, published_at, created_at, submitted_at, discipline, views, downloads, citations')
        .eq('institution_id', institutionId)
        .eq('status', 'approved')
        .eq('is_current_version', true);

      // Calculate total articles (real count)
      const totalArticles = allArticlesData?.length || 0;

      // Calculate articles this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const articlesThisMonth = allArticlesData?.filter((article: any) => {
        const articleDate = new Date(article.created_at || article.published_at || article.submitted_at);
        return articleDate >= startOfMonth;
      }).length || 0;

      // Calculate total citations, views, downloads
      const totalCitations = allArticlesData?.reduce((sum: number, article: any) => sum + (article.citations || 0), 0) || 0;
      const totalViews = allArticlesData?.reduce((sum: number, article: any) => sum + (article.views || 0), 0) || 0;
      const totalDownloads = allArticlesData?.reduce((sum: number, article: any) => sum + (article.downloads || 0), 0) || 0;

      // Fetch recent articles for display (limit 5) with authors and thumbnails
      const { data: articlesData } = await supabase
        .from('articles' as any)
        .select(`
          *,
          article_authors(*)
        `)
        .eq('institution_id', institutionId)
        .eq('status', 'approved')
        .eq('is_current_version', true)
        .order('published_at', { ascending: false })
        .limit(5);

      // Calculate monthly article counts for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const { data: monthlyArticlesData } = await supabase
        .from('articles' as any)
        .select('published_at, created_at, discipline')
        .eq('institution_id', institutionId)
        .eq('status', 'approved')
        .eq('is_current_version', true)
        .gte('created_at', sixMonthsAgo.toISOString());

      // Fetch contributing authors - unique authors from articles belonging to this institution
      let contributingAuthorsCount = 0;
      if (allArticlesData && allArticlesData.length > 0) {
        const articleIds = allArticlesData.map((a: any) => a.id);
        const { data: authorsData } = await supabase
          .from('article_authors' as any)
          .select('name, email, affiliation, profile_id')
          .in('article_id', articleIds);

        // Get unique authors (by name and email combination, or by profile_id if available)
        const uniqueAuthorsMap = new Map<string, any>();
        authorsData?.forEach((author: any) => {
          const key = author.profile_id || `${author.name}_${author.email || ''}`;
          if (!uniqueAuthorsMap.has(key)) {
            uniqueAuthorsMap.set(key, {
              id: author.profile_id || `author_${key}`,
              name: author.name,
              email: author.email,
              affiliation: author.affiliation,
              profileId: author.profile_id,
            });
          }
        });
        contributingAuthorsCount = uniqueAuthorsMap.size;
      }

      // Generate last 6 months array
      const last6Months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        last6Months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
      }

      // Calculate monthly counts
      const monthlyCounts: { [key: string]: number } = {};
      monthlyArticlesData?.forEach((article: any) => {
        const date = article.published_at || article.created_at;
        if (!date) return;
        const articleDate = new Date(date);
        const monthKey = `${articleDate.getFullYear()}-${String(articleDate.getMonth() + 1).padStart(2, '0')}`;
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      });

      const monthlyArticleCounts = last6Months.map(month => monthlyCounts[month] || 0);

      // Calculate discipline breakdown
      const disciplineCounts: Record<string, number> = {};
      monthlyArticlesData?.forEach((article: any) => {
        if (article.discipline) {
          disciplineCounts[article.discipline] = (disciplineCounts[article.discipline] || 0) + 1;
        }
      });

      const disciplineBreakdown: DisciplineCount[] = Object.entries(disciplineCounts)
        .map(([discipline, count]) => ({
          discipline,
          count,
          percentage: totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Generate ranking history (simplified - last 6 months)
      const rankingHistory: RankingHistoryPoint[] = last6Months.map((month, idx) => ({
        date: month,
        rank: institution.current_rank || 0,
        articleCount: Math.max(0, totalArticles - (5 - idx) * 10), // Simplified progression
      }));

      // Transform articles to match expected format with full data for card display
      const recentArticles = (articlesData || []).map((article: any) => ({
        id: article.id,
        title: article.title,
        slug: article.id,
        abstract: article.abstract || '',
        authors: article.article_authors || [],
        publishedAt: article.published_at || article.submitted_at,
        submittedAt: article.submitted_at,
        viewCount: article.views || 0,
        citationCount: article.citations || 0,
        downloadCount: article.downloads || 0,
        universityId: institution.id,
        universityName: institution.name,
        universitySlug: institution.id,
        disciplineId: article.discipline || '',
        disciplineName: article.discipline || 'General',
        keywords: article.keywords || [],
        pdfUrl: article.pdf_url || '',
        thumbnailUrl: article.thumbnail_url || null,
        articleType: article.article_type || 'research',
        status: article.status || 'approved',
      })) as any[];

      // Build profile object
      const profileData: UniversityProfile & { contributingAuthorsCount?: number } = {
        id: institution.id,
        slug: institution.id,
        name: institution.name,
        abbreviation: institution.abbreviation || '',
        logo: institution.logo || '',
        country: institution.country || 'Ghana',
        city: institution.city || '',
        currentRank: institution.current_rank || 0,
        previousRank: institution.previous_rank || null,
        movement: institution.movement || 'stable',
        movementDelta: 0,
        totalArticles: totalArticles,
        articlesThisMonth: articlesThisMonth,
        articlesThisYear: 0,
        totalCitations: totalCitations,
        totalViews: totalViews,
        totalDownloads: totalDownloads,
        hIndex: 0,
        monthlyArticleCounts: monthlyArticleCounts,
        createdAt: institution.created_at,
        updatedAt: institution.updated_at,
        fullDescription: institution.description || `${institution.name} is a leading institution contributing to research and knowledge production in Ghana and beyond.`,
        rankingHistory,
        topAuthors: [], // Can be populated later if needed
        recentArticles: recentArticles as any,
        disciplineBreakdown,
        contributingAuthorsCount: contributingAuthorsCount,
      };

      setProfile(profileData);
    } catch (error: any) {
      console.error('Error loading institution profile:', error);
      toast.error('Failed to load university profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for article display
  const isNewPaper = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // New if published within last 30 days
  };

  const getArticleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      research: 'Research Article',
      review: 'Review',
      'case-study': 'Case Study',
      methodology: 'Methodology',
      other: 'Article',
    };
    return labels[type] || 'Article';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'under-review':
        return { label: 'Under Review', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      default:
        return { label: status, icon: Clock, color: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const styles = `
    .sr-profile-page {
      min-height: 100vh;
      background: #FAFAF9;
    }

    .sr-profile-hero {
      background: linear-gradient(180deg, #1E3A5F 0%, #2D4A6F 100%);
      color: #FFFFFF;
      padding: 100px 0 80px;
    }

    .sr-profile-hero__container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .sr-profile-hero__back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      margin-bottom: 24px;
      transition: color 0.15s ease;
    }

    .sr-profile-hero__back:hover {
      color: #FFFFFF;
    }

    .sr-profile-hero__header {
      display: flex;
      align-items: flex-start;
      gap: 24px;
    }

    .sr-profile-hero__logo {
      width: 96px;
      height: 96px;
      background: #FFFFFF;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 12px;
    }

    .sr-profile-hero__logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .sr-profile-hero__logo-placeholder {
      color: #A8A29E;
    }

    .sr-profile-hero__info {
      flex: 1;
    }

    .sr-profile-hero__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2.5rem;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .sr-profile-hero__location {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 16px 0;
    }

    .sr-profile-hero__meta {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .sr-profile-hero__meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .sr-profile-hero__website {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .sr-profile-hero__website:hover {
      color: #FFFFFF;
    }

    .sr-profile-hero__rank-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 12px 20px;
      margin-top: 24px;
    }

    .sr-profile-hero__rank-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sr-profile-hero__rank-value {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #FFFFFF;
    }

    .sr-profile-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    .sr-profile-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: -50px;
      margin-bottom: 40px;
      position: relative;
      z-index: 10;
    }

    @media (max-width: 1024px) {
      .sr-profile-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .sr-profile-stats {
        grid-template-columns: 1fr;
      }

      .sr-profile-hero__title {
        font-size: 1.75rem;
      }

      .sr-profile-hero__header {
        flex-direction: column;
        align-items: flex-start;
      }

      .sr-profile-hero__logo {
        width: 72px;
        height: 72px;
      }
    }

    .sr-profile-about {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 32px;
    }

    .sr-profile-about__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.375rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
    }

    .sr-profile-about__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #57534E;
      line-height: 1.7;
      margin: 0;
    }

    .sr-profile-charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
      .sr-profile-charts {
        grid-template-columns: 1fr;
      }
    }

    .sr-profile-section {
      margin-bottom: 32px;
    }

    .sr-profile-section__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .sr-profile-section__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.375rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
    }

    .sr-profile-section__link {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1E3A5F;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.15s ease;
    }

    .sr-profile-section__link:hover {
      color: #2D4A6F;
    }

    .sr-profile-articles {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .paper-card {
      position: relative;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .paper-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .paper-card__content {
      flex: 1;
      min-width: 0;
    }

    .paper-card__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .paper-card__badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .paper-card__badge--new {
      background: #0F766E;
      color: #FFFFFF;
    }

    .paper-card__badge--article {
      background: #5EEAD4;
      color: #134E4A;
    }

    .paper-card__badge--fulltext {
      background: #FFFFFF;
      color: #134E4A;
      border: 1px solid #0F766E;
    }

    .paper-card__badge--status {
      background: #F5F5F4;
      color: #57534E;
      border: 1px solid #E7E5E4;
    }

    .paper-card__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .paper-card__date {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #78716C;
      margin: 0 0 16px 0;
    }

    .paper-card__authors {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .paper-card__author {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
    }

    .paper-card__author-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #F5F5F4;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .paper-card__author-avatar svg {
      width: 14px;
      height: 14px;
      color: #78716C;
    }

    .paper-card__thumbnail {
      flex-shrink: 0;
      width: 120px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
      background: #F5F5F4;
      border: 1px solid #E7E5E4;
      position: relative;
    }

    .paper-card__thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .paper-card__thumbnail-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%);
    }

    .paper-card__thumbnail-placeholder svg {
      width: 48px;
      height: 48px;
      color: #A8A29E;
    }

    @media (max-width: 768px) {
      .paper-card {
        flex-direction: column;
      }

      .paper-card__thumbnail {
        width: 100%;
        height: 200px;
      }

      .paper-card__title {
        font-size: 1.125rem;
      }
    }


    .sr-profile-authors {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .sr-profile-authors {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .sr-profile-authors {
        grid-template-columns: 1fr;
      }
    }

    .sr-profile-author-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      transition: all 0.2s ease;
    }

    .sr-profile-author-card:hover {
      border-color: #D6D3D1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    .sr-profile-author-card__image {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 12px;
      background: #F5F5F4;
    }

    .sr-profile-author-card__name {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 4px 0;
    }

    .sr-profile-author-card__title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0 0 12px 0;
    }

    .sr-profile-author-card__stat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      color: #1E3A5F;
      font-weight: 500;
    }

    .sr-profile-not-found {
      text-align: center;
      padding: 80px 24px;
    }

    .sr-profile-not-found__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
    }

    .sr-profile-not-found__text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #57534E;
      margin: 0 0 24px 0;
    }

    .sr-profile-not-found__link {
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

    .sr-profile-not-found__link:hover {
      background: #2D4A6F;
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="sr-profile-page">
          <Navigation />
          <main className="sr-profile-not-found">
            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 16px', color: '#1E3A5F' }} />
            <p className="sr-profile-not-found__text">Loading university profile...</p>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <style>{styles}</style>
        <div className="sr-profile-page">
          <Navigation />
          <main className="sr-profile-not-found">
            <h1 className="sr-profile-not-found__title">University Not Found</h1>
            <p className="sr-profile-not-found__text">
              The university you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/scholarly/rankings" className="sr-profile-not-found__link">
              <ChevronLeft size={18} />
              Back to Rankings
            </Link>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // Generate month labels for the last 6 months
  const getMonthLabels = () => {
    const labels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels.push(monthNames[date.getMonth()]);
    }
    return labels;
  };

  const trendData = profile.monthlyArticleCounts
    ? profile.monthlyArticleCounts.map((count, idx) => ({
        month: getMonthLabels()[idx],
        articles: count,
      }))
    : [];

  return (
    <>
      <style>{styles}</style>
      <div className="sr-profile-page">
        <Navigation />

        {/* Hero Section */}
        <header className="sr-profile-hero">
          <div className="sr-profile-hero__container">
            <Link to="/scholarly/rankings" className="sr-profile-hero__back">
              <ChevronLeft size={16} />
              Back to Rankings
            </Link>

            <div className="sr-profile-hero__header">
              <div className="sr-profile-hero__logo">
                {profile.logo ? (
                  <img src={profile.logo} alt={`${profile.name} logo`} />
                ) : (
                  <Building2 size={40} className="sr-profile-hero__logo-placeholder" />
                )}
              </div>

              <div className="sr-profile-hero__info">
                <h1 className="sr-profile-hero__title">{profile.name}</h1>
                <p className="sr-profile-hero__location">
                  {profile.city}, {profile.country}
                </p>

                <div className="sr-profile-hero__meta">
                  {profile.foundedYear && (
                    <span className="sr-profile-hero__meta-item">
                      <Calendar size={14} />
                      Founded {profile.foundedYear}
                    </span>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sr-profile-hero__website"
                    >
                      <Globe size={14} />
                      {profile.website.replace(/^https?:\/\//, '')}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="sr-profile-hero__rank-badge">
                  <div>
                    <span className="sr-profile-hero__rank-label">Current Rank</span>
                    <p className="sr-profile-hero__rank-value">#{profile.currentRank}</p>
                  </div>
                  <MovementIndicator
                    movement={profile.movement}
                    delta={profile.movementDelta}
                    size="lg"
                    showLabel
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="sr-profile-content">
          {/* Statistics */}
          <div className="sr-profile-stats">
            <StatCard
              label="Total Articles"
              value={formatNumber(profile.totalArticles)}
              change={{ value: profile.articlesThisMonth, isPositive: true, label: 'this month' }}
              icon={<BookOpen size={20} />}
            />
            <StatCard
              label="Total Citations"
              value={formatNumber(profile.totalCitations || 0)}
              icon={<Quote size={20} />}
            />
            <StatCard
              label="Total Views"
              value={formatNumber(profile.totalViews || 0)}
              icon={<Eye size={20} />}
            />
            <StatCard
              label="Contributing Authors"
              value={(profile as any).contributingAuthorsCount || 0}
              icon={<Users size={20} />}
            />
          </div>

          {/* About */}
          <div className="sr-profile-about">
            <h2 className="sr-profile-about__title">About</h2>
            <p className="sr-profile-about__text">{profile.fullDescription}</p>
          </div>

          {/* Charts */}
          <div className="sr-profile-charts">
            <RankingHistoryChart
              data={profile.rankingHistory}
              title="Ranking History"
              height={220}
            />
            <TrendLineChart data={trendData} title="Publication Growth" height={220} />
          </div>

          <div className="sr-profile-charts">
            <DisciplineBreakdown
              data={profile.disciplineBreakdown}
              title="Disciplines Breakdown"
            />
          </div>

          {/* Recent Publications */}
          <div className="sr-profile-section">
            <div className="sr-profile-section__header">
              <h2 className="sr-profile-section__title">Recent Publications</h2>
              <Link
                to={`/scholarly/articles?university=${profile.slug}`}
                className="sr-profile-section__link"
              >
                View All {formatNumber(profile.totalArticles)} Publications
                <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
              </Link>
            </div>
            <div className="sr-profile-articles">
              {profile.recentArticles.map((article: any) => {
                const statusConfig = getStatusConfig(article.status || 'approved');
                const StatusIcon = statusConfig.icon;
                const isNew = isNewPaper(article.publishedAt || article.submittedAt);
                const publishedDate = article.publishedAt || article.submittedAt;
                const dateObj = new Date(publishedDate);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                return (
                  <div
                    key={article.id}
                    className="paper-card"
                    onClick={() => window.location.href = `/scholarly/articles/${article.id}`}
                  >
                    <div className="paper-card__content">
                      {/* Badges */}
                      <div className="paper-card__badges">
                        {isNew && (
                          <span className="paper-card__badge paper-card__badge--new">New</span>
                        )}
                        <span className="paper-card__badge paper-card__badge--article">
                          {getArticleTypeLabel(article.articleType || 'research')}
                        </span>
                        {article.pdfUrl && (
                          <span className="paper-card__badge paper-card__badge--fulltext">Full-text available</span>
                        )}
                        <span className="paper-card__badge paper-card__badge--status">
                          <StatusIcon size={10} style={{ marginRight: '4px' }} />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="paper-card__title">{article.title}</h3>

                      {/* Date */}
                      <p className="paper-card__date">{formattedDate}</p>

                      {/* Authors */}
                      {article.authors && article.authors.length > 0 ? (
                        <div className="paper-card__authors">
                          {article.authors.slice(0, 4).map((author: any, idx: number) => (
                            <div key={author.id || idx} className="paper-card__author">
                              <div className="paper-card__author-avatar">
                                <Users size={14} />
                              </div>
                              <span>{author.name}</span>
                            </div>
                          ))}
                          {article.authors.length > 4 && (
                            <span className="paper-card__author" style={{ color: '#78716C' }}>
                              +{article.authors.length - 4} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="paper-card__authors">
                          <span className="paper-card__author" style={{ color: '#78716C' }}>
                            No authors listed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="paper-card__thumbnail">
                      {article.thumbnailUrl ? (
                        <>
                          <img 
                            src={article.thumbnailUrl} 
                            alt={article.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          <div className="paper-card__thumbnail-placeholder" style={{ display: 'none' }}>
                            <FileText />
                          </div>
                        </>
                      ) : article.pdfUrl ? (
                        <>
                          <img 
                            src={article.pdfUrl.replace(/\.pdf$/i, '.jpg')} 
                            alt={article.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          <div className="paper-card__thumbnail-placeholder" style={{ display: 'none' }}>
                            <FileText />
                          </div>
                        </>
                      ) : (
                        <div className="paper-card__thumbnail-placeholder">
                          <FileText />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Authors */}
          <div className="sr-profile-section">
            <div className="sr-profile-section__header">
              <h2 className="sr-profile-section__title">Top Contributing Authors</h2>
            </div>
            <div className="sr-profile-authors">
              {profile.topAuthors.map((author) => (
                <div key={author.id} className="sr-profile-author-card">
                  {author.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name}
                      className="sr-profile-author-card__image"
                    />
                  ) : (
                    <div className="sr-profile-author-card__image" />
                  )}
                  <h3 className="sr-profile-author-card__name">{author.name}</h3>
                  <p className="sr-profile-author-card__title">{author.title}</p>
                  <span className="sr-profile-author-card__stat">
                    {author.totalArticles} publications
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UniversityProfile;
