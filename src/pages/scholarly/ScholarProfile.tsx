// ============================================================================
// SCHOLAR PROFILE PAGE (PUBLIC)
// ============================================================================
// Public academic profile page for scholars
// Inspired by Google Scholar × Nature author pages × ORCID
// ============================================================================

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  Building2,
  Mail,
  ExternalLink,
  Eye,
  Download,
  Quote,
  FileText,
  Calendar,
  Award,
  TrendingUp,
} from 'lucide-react';
import { ArticleCard } from '@/components/scholarly/ArticleCard';
import { mockArticles } from '@/utils/scholarlyRankingData';

const ScholarProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock scholar data
  const scholar = {
    id: id || 'scholar-001',
    name: 'Dr. Sarah Chen',
    title: 'Associate Professor',
    university: 'Massachusetts Institute of Technology',
    department: 'Department of Physics',
    email: 's.chen@mit.edu',
    orcidId: '0000-0001-2345-6789',
    bio: 'Specializing in quantum computing and topological systems. My research focuses on developing novel approaches to quantum error correction and exploring applications in quantum information processing.',
    researchInterests: [
      'Quantum Computing',
      'Topological Systems',
      'Quantum Error Correction',
      'Quantum Information Theory',
    ],
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    totalArticles: 67,
    totalCitations: 1234,
    totalViews: 45678,
    totalDownloads: 12345,
    hIndex: 18,
    i10Index: 12,
    joinedDate: '2020-01-15',
  };

  const scholarArticles = mockArticles.filter((a) =>
    a.authors.some((author) => author.id === 'auth-001')
  );

  const styles = `
    .sr-scholar-profile {
      min-height: 100vh;
      background: #FAFAF9;
    }

    .sr-scholar-header {
      background: #FFFFFF;
      border-bottom: 1px solid #E7E5E4;
      padding: 100px 0 0;
    }

    .sr-scholar-header__container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px 40px;
    }

    .sr-scholar-header__content {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 40px;
      align-items: start;
    }

    @media (max-width: 768px) {
      .sr-scholar-header__content {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .sr-scholar-header__avatar {
      width: 200px;
      height: 200px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid #E7E5E4;
    }

    @media (max-width: 768px) {
      .sr-scholar-header__avatar {
        width: 120px;
        height: 120px;
        margin: 0 auto;
      }
    }

    .sr-scholar-header__info {
      flex: 1;
    }

    .sr-scholar-header__title-group {
      margin-bottom: 16px;
    }

    .sr-scholar-header__name {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 8px 0;
    }

    @media (max-width: 768px) {
      .sr-scholar-header__name {
        font-size: 1.875rem;
        text-align: center;
      }
    }

    .sr-scholar-header__title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1.125rem;
      color: #57534E;
      margin: 0 0 4px 0;
    }

    @media (max-width: 768px) {
      .sr-scholar-header__title {
        text-align: center;
      }
    }

    .sr-scholar-header__affiliation {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1E3A5F;
      margin: 0 0 20px 0;
    }

    @media (max-width: 768px) {
      .sr-scholar-header__affiliation {
        justify-content: center;
      }
    }

    .sr-scholar-header__contact {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .sr-scholar-header__contact {
        justify-content: center;
      }
    }

    .sr-scholar-header__contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #57534E;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .sr-scholar-header__contact-item:hover {
      color: #1E3A5F;
    }

    .sr-scholar-header__bio {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 1rem;
      color: #1C1917;
      line-height: 1.7;
      margin: 0 0 24px 0;
    }

    .sr-scholar-header__interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .sr-scholar-header__interest {
      padding: 6px 14px;
      background: #F5F5F4;
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #57534E;
    }

    .sr-scholar-stats {
      background: #FFFFFF;
      border-bottom: 1px solid #E7E5E4;
      padding: 32px 0;
    }

    .sr-scholar-stats__container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .sr-scholar-stats__grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .sr-scholar-stats__grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 640px) {
      .sr-scholar-stats__grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .sr-scholar-stat {
      text-align: center;
    }

    .sr-scholar-stat__value {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 4px 0;
    }

    .sr-scholar-stat__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      margin: 0;
    }

    .sr-scholar-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }

    .sr-scholar-section {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
    }

    .sr-scholar-section__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 24px 0;
      padding-bottom: 16px;
      border-bottom: 2px solid #1E3A5F;
    }

    .sr-scholar-articles {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sr-scholar-empty {
      text-align: center;
      padding: 48px 24px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      color: #78716C;
    }
  `;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-scholar-profile">
        <Navigation />

        {/* Header */}
        <header className="sr-scholar-header">
          <div className="sr-scholar-header__container">
            <div className="sr-scholar-header__content">
              <img
                src={scholar.profileImage}
                alt={scholar.name}
                className="sr-scholar-header__avatar"
              />
              <div className="sr-scholar-header__info">
                <div className="sr-scholar-header__title-group">
                  <h1 className="sr-scholar-header__name">{scholar.name}</h1>
                  <p className="sr-scholar-header__title">{scholar.title}</p>
                  <div className="sr-scholar-header__affiliation">
                    <Building2 size={18} />
                    {scholar.university}
                  </div>
                </div>

                <div className="sr-scholar-header__contact">
                  <a
                    href={`mailto:${scholar.email}`}
                    className="sr-scholar-header__contact-item"
                  >
                    <Mail size={16} />
                    {scholar.email}
                  </a>
                  {scholar.orcidId && (
                    <a
                      href={`https://orcid.org/${scholar.orcidId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sr-scholar-header__contact-item"
                    >
                      <ExternalLink size={16} />
                      ORCID: {scholar.orcidId}
                    </a>
                  )}
                </div>

                <p className="sr-scholar-header__bio">{scholar.bio}</p>

                <div className="sr-scholar-header__interests">
                  {scholar.researchInterests.map((interest) => (
                    <span key={interest} className="sr-scholar-header__interest">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="sr-scholar-stats">
          <div className="sr-scholar-stats__container">
            <div className="sr-scholar-stats__grid">
              <div className="sr-scholar-stat">
                <p className="sr-scholar-stat__value">{scholar.totalArticles}</p>
                <p className="sr-scholar-stat__label">Articles</p>
              </div>
              <div className="sr-scholar-stat">
                <p className="sr-scholar-stat__value">{formatNumber(scholar.totalCitations)}</p>
                <p className="sr-scholar-stat__label">Citations</p>
              </div>
              <div className="sr-scholar-stat">
                <p className="sr-scholar-stat__value">{formatNumber(scholar.totalViews)}</p>
                <p className="sr-scholar-stat__label">Views</p>
              </div>
              <div className="sr-scholar-stat">
                <p className="sr-scholar-stat__value">{formatNumber(scholar.totalDownloads)}</p>
                <p className="sr-scholar-stat__label">Downloads</p>
              </div>
              <div className="sr-scholar-stat">
                <p className="sr-scholar-stat__value">{scholar.hIndex}</p>
                <p className="sr-scholar-stat__label">h-index</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="sr-scholar-content">
          <section className="sr-scholar-section">
            <h2 className="sr-scholar-section__title">Publications</h2>
            {scholarArticles.length > 0 ? (
              <div className="sr-scholar-articles">
                {scholarArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="detailed" />
                ))}
              </div>
            ) : (
              <div className="sr-scholar-empty">
                <FileText size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <p>No publications yet</p>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ScholarProfile;
