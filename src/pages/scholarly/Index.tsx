// ============================================================================
// SCHOLARLY RANKING PLATFORM - LANDING PAGE
// ============================================================================
// Main entry point showcasing the platform's key features
// Academic, authoritative design communicating trust and credibility
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  Award,
  BookOpen,
  Building2,
  TrendingUp,
  Globe,
  Users,
  ChevronRight,
  BarChart3,
  FileText,
  Search,
} from 'lucide-react';
import { UniversityRankingCard } from '@/components/scholarly/UniversityRankingCard';
import { ArticleCard } from '@/components/scholarly/ArticleCard';
import { StatCard } from '@/components/scholarly/StatCard';
import {
  mockUniversities,
  mockArticles,
  mockPlatformStats,
  formatNumber,
} from '@/utils/scholarlyRankingData';

const ScholarlyIndex: React.FC = () => {
  const styles = `
    .sr-landing {
      min-height: 100vh;
      background: #FAFAF9;
    }

    /* Hero Section */
    .sr-landing-hero {
      position: relative;
      background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 50%, #1E3A5F 100%);
      color: #FFFFFF;
      padding: 120px 0 100px;
      overflow: hidden;
    }

    .sr-landing-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 50%);
      pointer-events: none;
    }

    .sr-landing-hero__container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .sr-landing-hero__content {
      max-width: 720px;
    }

    .sr-landing-hero__eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 24px;
    }

    .sr-landing-hero__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 3.5rem;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.15;
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .sr-landing-hero__title {
        font-size: 2.5rem;
      }
    }

    .sr-landing-hero__separator {
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.2));
      border-radius: 2px;
      margin-bottom: 24px;
    }

    .sr-landing-hero__description {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      margin: 0 0 36px 0;
    }

    .sr-landing-hero__actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .sr-landing-hero__btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .sr-landing-hero__btn--primary {
      background: #FFFFFF;
      color: #1E3A5F;
    }

    .sr-landing-hero__btn--primary:hover {
      background: #F5F5F4;
      transform: translateY(-1px);
    }

    .sr-landing-hero__btn--secondary {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #FFFFFF;
    }

    .sr-landing-hero__btn--secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* Stats Section */
    .sr-landing-stats {
      max-width: 1280px;
      margin: -50px auto 0;
      padding: 0 24px;
      position: relative;
      z-index: 10;
    }

    .sr-landing-stats__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    @media (max-width: 1024px) {
      .sr-landing-stats__grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .sr-landing-stats__grid {
        grid-template-columns: 1fr;
      }
    }

    /* Section Styles */
    .sr-landing-section {
      max-width: 1280px;
      margin: 0 auto;
      padding: 64px 24px;
    }

    .sr-landing-section--alt {
      background: #FFFFFF;
      max-width: none;
      padding: 64px 0;
    }

    .sr-landing-section--alt .sr-landing-section__inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .sr-landing-section__header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .sr-landing-section__title-group {
      max-width: 600px;
    }

    .sr-landing-section__eyebrow {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #1E3A5F;
      margin: 0 0 8px 0;
    }

    .sr-landing-section__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .sr-landing-section__subtitle {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #57534E;
      margin: 0;
      line-height: 1.6;
    }

    .sr-landing-section__link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #1E3A5F;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .sr-landing-section__link:hover {
      color: #2D4A6F;
    }

    /* Rankings Preview */
    .sr-landing-rankings {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Articles Grid */
    .sr-landing-articles {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .sr-landing-articles {
        grid-template-columns: 1fr;
      }
    }

    /* Features Grid */
    .sr-landing-features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 48px;
    }

    @media (max-width: 1024px) {
      .sr-landing-features {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .sr-landing-features {
        grid-template-columns: 1fr;
      }
    }

    .sr-landing-feature {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 28px;
      transition: all 0.2s ease;
    }

    .sr-landing-feature:hover {
      border-color: #D6D3D1;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    .sr-landing-feature__icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 58, 95, 0.08);
      border-radius: 10px;
      color: #1E3A5F;
      margin-bottom: 20px;
    }

    .sr-landing-feature__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    .sr-landing-feature__description {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      line-height: 1.65;
      margin: 0;
    }

    /* CTA Section */
    .sr-landing-cta {
      background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%);
      border-radius: 16px;
      padding: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      flex-wrap: wrap;
    }

    .sr-landing-cta__content {
      max-width: 560px;
    }

    .sr-landing-cta__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.75rem;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 12px 0;
    }

    .sr-landing-cta__description {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
      margin: 0;
    }

    .sr-landing-cta__btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: #FFFFFF;
      color: #1E3A5F;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .sr-landing-cta__btn:hover {
      background: #F5F5F4;
      transform: translateY(-1px);
    }

    /* Methodology */
    .sr-landing-methodology {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    @media (max-width: 1024px) {
      .sr-landing-methodology {
        grid-template-columns: 1fr;
      }
    }

    .sr-landing-methodology__content h3 {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.75rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
    }

    .sr-landing-methodology__content p {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.0625rem;
      color: #57534E;
      line-height: 1.75;
      margin: 0 0 20px 0;
    }

    .sr-landing-methodology__points {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sr-landing-methodology__point {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .sr-landing-methodology__point-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2D5A47;
      border-radius: 50%;
      color: #FFFFFF;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .sr-landing-methodology__point-text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #1C1917;
      line-height: 1.5;
      margin: 0;
    }

    .sr-landing-methodology__visual {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 32px;
    }

    .sr-landing-methodology__visual-title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #78716C;
      margin: 0 0 20px 0;
    }

    .sr-landing-methodology__formula {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #F5F5F4;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .sr-landing-methodology__metrics {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sr-landing-methodology__metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #E7E5E4;
    }

    .sr-landing-methodology__metric:last-child {
      border-bottom: none;
    }

    .sr-landing-methodology__metric-name {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
    }

    .sr-landing-methodology__metric-weight {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      color: #1E3A5F;
      font-weight: 500;
    }
  `;

  const topUniversities = mockUniversities.slice(0, 5);
  const recentArticles = mockArticles.slice(0, 4);

  const features = [
    {
      icon: <BarChart3 size={24} />,
      title: 'Real-Time Rankings',
      description:
        'Watch university positions update dynamically as new research is published. Movement indicators show ranking changes clearly.',
    },
    {
      icon: <FileText size={24} />,
      title: 'Scholarly Repository',
      description:
        'Access peer-reviewed research articles from leading institutions worldwide. Filter by discipline, university, or keywords.',
    },
    {
      icon: <Building2 size={24} />,
      title: 'University Profiles',
      description:
        'Detailed analytics for each institution including publication history, top authors, and discipline breakdowns.',
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Growth Analytics',
      description:
        'Track publication trends over time with clear visualizations. Identify rising institutions and research hotspots.',
    },
    {
      icon: <Search size={24} />,
      title: 'Advanced Search',
      description:
        'Find articles by title, author, keywords, or abstract. Filter by discipline, publication year, and institution.',
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Coverage',
      description:
        'Rankings include universities from around the world, providing a comprehensive view of global academic output.',
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="sr-landing">
        <Navigation />

        {/* Hero Section */}
        <header className="sr-landing-hero">
          <div className="sr-landing-hero__container">
            <div className="sr-landing-hero__content">
              <span className="sr-landing-hero__eyebrow">
                <Award size={14} />
                Scholarly Rankings Platform
              </span>
              <h1 className="sr-landing-hero__title">
                University Rankings Based on Research Excellence
              </h1>
              <div className="sr-landing-hero__separator" />
              <p className="sr-landing-hero__description">
                Transparent, data-driven rankings where universities rise based on the scholarly
                contributions of their researchers. Watch rankings update in real-time as new
                research is published.
              </p>
              <div className="sr-landing-hero__actions">
                <Link to="/scholarly/rankings" className="sr-landing-hero__btn sr-landing-hero__btn--primary">
                  <Award size={18} />
                  View Rankings
                </Link>
                <Link to="/scholarly/articles" className="sr-landing-hero__btn sr-landing-hero__btn--secondary">
                  <BookOpen size={18} />
                  Browse Articles
                </Link>
                <Link to="/scholarly/auth/sign-up" className="sr-landing-hero__btn sr-landing-hero__btn--secondary">
                  <Users size={18} />
                  Join as Scholar
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <div className="sr-landing-stats">
          <div className="sr-landing-stats__grid">
            <StatCard
              label="Ranked Universities"
              value={mockPlatformStats.totalUniversities}
              icon={<Building2 size={20} />}
            />
            <StatCard
              label="Published Articles"
              value={formatNumber(mockPlatformStats.totalArticles)}
              change={{ value: mockPlatformStats.articlesThisMonth, isPositive: true, label: 'this month' }}
              icon={<BookOpen size={20} />}
            />
            <StatCard
              label="Contributing Authors"
              value={formatNumber(mockPlatformStats.totalAuthors)}
              icon={<Users size={20} />}
            />
            <StatCard
              label="Countries"
              value={89}
              icon={<Globe size={20} />}
            />
          </div>
        </div>

        {/* Top Rankings */}
        <section className="sr-landing-section">
          <div className="sr-landing-section__header">
            <div className="sr-landing-section__title-group">
              <p className="sr-landing-section__eyebrow">Current Standings</p>
              <h2 className="sr-landing-section__title">Top Ranked Universities</h2>
              <p className="sr-landing-section__subtitle">
                Universities ranked by total peer-reviewed scholarly articles published
              </p>
            </div>
            <Link to="/scholarly/rankings" className="sr-landing-section__link">
              View Full Rankings
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="sr-landing-rankings">
            {topUniversities.map((university) => (
              <UniversityRankingCard key={university.id} university={university} variant="compact" />
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section className="sr-landing-section sr-landing-section--alt">
          <div className="sr-landing-section__inner">
            <div className="sr-landing-section__header">
              <div className="sr-landing-section__title-group">
                <p className="sr-landing-section__eyebrow">Latest Research</p>
                <h2 className="sr-landing-section__title">Recent Publications</h2>
                <p className="sr-landing-section__subtitle">
                  Newly published peer-reviewed articles from leading institutions
                </p>
              </div>
              <Link to="/scholarly/articles" className="sr-landing-section__link">
                Browse All Articles
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="sr-landing-articles">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="sr-landing-section">
          <div className="sr-landing-methodology">
            <div className="sr-landing-methodology__content">
              <h3>Transparent Ranking Methodology</h3>
              <p>
                Our rankings are calculated using objective, verifiable metrics that reflect genuine
                scholarly output. Universities earn their position through the research contributions
                of their affiliated academics.
              </p>
              <div className="sr-landing-methodology__points">
                <div className="sr-landing-methodology__point">
                  <div className="sr-landing-methodology__point-icon">
                    <FileText size={12} />
                  </div>
                  <p className="sr-landing-methodology__point-text">
                    <strong>Article Count:</strong> Primary metric based on total peer-reviewed
                    publications
                  </p>
                </div>
                <div className="sr-landing-methodology__point">
                  <div className="sr-landing-methodology__point-icon">
                    <TrendingUp size={12} />
                  </div>
                  <p className="sr-landing-methodology__point-text">
                    <strong>Real-Time Updates:</strong> Rankings refresh as new articles are published
                  </p>
                </div>
                <div className="sr-landing-methodology__point">
                  <div className="sr-landing-methodology__point-icon">
                    <Award size={12} />
                  </div>
                  <p className="sr-landing-methodology__point-text">
                    <strong>Future Metrics:</strong> Citation counts, views, and downloads coming soon
                  </p>
                </div>
              </div>
            </div>
            <div className="sr-landing-methodology__visual">
              <h4 className="sr-landing-methodology__visual-title">Ranking Formula</h4>
              <div className="sr-landing-methodology__formula">
                Score = Articles * 1.0 + Citations * 0.3 + Views * 0.1
              </div>
              <div className="sr-landing-methodology__metrics">
                <div className="sr-landing-methodology__metric">
                  <span className="sr-landing-methodology__metric-name">Article Count</span>
                  <span className="sr-landing-methodology__metric-weight">Weight: 1.0</span>
                </div>
                <div className="sr-landing-methodology__metric">
                  <span className="sr-landing-methodology__metric-name">Citation Count</span>
                  <span className="sr-landing-methodology__metric-weight">Weight: 0.3 (future)</span>
                </div>
                <div className="sr-landing-methodology__metric">
                  <span className="sr-landing-methodology__metric-name">View Count</span>
                  <span className="sr-landing-methodology__metric-weight">Weight: 0.1 (future)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="sr-landing-section sr-landing-section--alt">
          <div className="sr-landing-section__inner">
            <div className="sr-landing-section__header">
              <div className="sr-landing-section__title-group">
                <p className="sr-landing-section__eyebrow">Platform Features</p>
                <h2 className="sr-landing-section__title">Built for Academic Excellence</h2>
                <p className="sr-landing-section__subtitle">
                  A comprehensive platform designed for researchers, institutions, and academic enthusiasts
                </p>
              </div>
            </div>
            <div className="sr-landing-features">
              {features.map((feature, idx) => (
                <div key={idx} className="sr-landing-feature">
                  <div className="sr-landing-feature__icon">{feature.icon}</div>
                  <h4 className="sr-landing-feature__title">{feature.title}</h4>
                  <p className="sr-landing-feature__description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sr-landing-section">
          <div className="sr-landing-cta">
            <div className="sr-landing-cta__content">
              <h3 className="sr-landing-cta__title">Explore the Complete Rankings</h3>
              <p className="sr-landing-cta__description">
                Discover how universities worldwide stack up based on their scholarly output. Filter by
                country, search for specific institutions, and track ranking movements over time.
              </p>
            </div>
            <Link to="/scholarly/rankings" className="sr-landing-cta__btn">
              View Full Rankings
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ScholarlyIndex;
