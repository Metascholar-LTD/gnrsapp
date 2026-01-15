// ============================================================================
// UNIVERSITY PROFILE PAGE
// ============================================================================
// Detailed view of a single university with stats, charts, and articles
// ============================================================================

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
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
} from 'lucide-react';
import { MovementIndicator } from '@/components/scholarly/MovementIndicator';
import { StatCard } from '@/components/scholarly/StatCard';
import {
  RankingHistoryChart,
  TrendLineChart,
  DisciplineBreakdown,
} from '@/components/scholarly/RankingCharts';
import { ArticleListItem } from '@/components/scholarly/ArticleCard';
import { generateUniversityProfile, formatNumber } from '@/utils/scholarlyRankingData';

const UniversityProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const profile = generateUniversityProfile(slug || '');

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
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 10px;
      padding: 20px 24px;
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

  const trendData = profile.monthlyArticleCounts
    ? profile.monthlyArticleCounts.map((count, idx) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx],
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
              value={profile.topAuthors.length * 39}
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
              {profile.recentArticles.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
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
