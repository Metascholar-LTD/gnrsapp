import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Briefcase, Newspaper, Database, Clock, GraduationCap, UserCheck } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Ghana's Digital Transformation Initiative Gains Momentum",
    summary: "The government announces new investments in digital infrastructure to boost economic growth.",
    category: "National News",
    author: "Kwame Asante",
    publishedAt: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
  },
  {
    id: "2",
    title: "New Education Policy Aims to Bridge Skills Gap",
    summary: "Ministry of Education introduces comprehensive reforms to align curriculum with industry needs.",
    category: "Education News",
    author: "Ama Mensah",
    publishedAt: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop",
  },
  {
    id: "3",
    title: "Ashanti Region Launches New Development Projects",
    summary: "Regional government announces major infrastructure investments to improve transportation.",
    category: "Regional News",
    author: "Dr. Kofi Owusu",
    publishedAt: "6 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop",
  },
  {
    id: "4",
    title: "Parliament Debates New Economic Policy Bill",
    summary: "Legislators engage in heated discussions over proposed economic reforms aimed at stimulating growth.",
    category: "Politics",
    author: "Yaa Bonsu",
    publishedAt: "8 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  },
  {
    id: "5",
    title: "Viral Social Media Campaign Promotes Local Tourism",
    summary: "Ghanaian tourism experiences surge in interest following viral social media campaign.",
    category: "Trending News",
    author: "Michael Adjei",
    publishedAt: "10 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop",
  },
  {
    id: "6",
    title: "Major Companies Announce 5,000 New Job Openings",
    summary: "Leading employers announce massive recruitment drive to fill thousands of positions.",
    category: "Jobs & Recruitment News",
    author: "Efua Tetteh",
    publishedAt: "12 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop",
  },
];

export const ImageGallery = () => {
  return (
    <div 
      id="gallery" 
      className="container-fluid py-5 position-relative overflow-hidden"
      style={{ 
        backgroundColor: '#EEEEEE',
        position: 'relative'
      }}
    >
      {/* Animated background elements */}
      <div 
        className="position-absolute"
        style={{
          top: '-50%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252, 209, 22, 0.08) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0
        }}
      />
      <div 
        className="position-absolute"
        style={{
          bottom: '-30%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.06) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
          zIndex: 0
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .news-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          width: 100%;
        }

        .news-card-small {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          padding: 0.875rem;
          border: 1px solid #e5e5e5;
          background: #ffffff;
          transition: all 0.15s ease;
          border-radius: 4px;
        }

        .news-card-small:hover {
          background: #fafafa;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .news-card-image-wrapper {
          width: 100%;
          margin-bottom: 0.625rem;
          position: relative;
          overflow: hidden;
          background: #f5f5f5;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 2px;
        }

        .news-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
          background: #f5f5f5;
        }

        .news-card-small:hover .news-card-image {
          transform: scale(1.02);
        }

        .news-card-category {
          font-size: 0.625rem;
          font-weight: 700;
          color: #bb1919;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.375rem;
          font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
          line-height: 1.2;
        }

        .news-card-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.5rem 0;
          line-height: 1.35;
          font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.2rem;
        }

        .news-card-summary {
          font-size: 0.75rem;
          color: #4a4a4a;
          line-height: 1.5;
          margin: 0 0 0.5rem 0;
          font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.25rem;
        }

        .news-card-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid #f0f0f0;
        }

        .news-card-meta-icon {
          color: #6b7280;
          flex-shrink: 0;
        }

        .news-card-meta-text {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.6875rem;
          color: #6b7280;
          font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
        }

        @media (max-width: 991px) {
          .news-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .news-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container position-relative" style={{ 
        maxWidth: '100%', 
        paddingLeft: 'clamp(15px, 5vw, 80px)', 
        paddingRight: 'clamp(15px, 5vw, 80px)',
        zIndex: 1
      }}>
        <div className="row g-5 align-items-center">
          {/* Left Side - Content */}
          <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="mb-4">
              <span 
                className="d-inline-flex align-items-center fw-semi-bold"
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'rgba(252, 209, 22, 0.08)',
                  border: '1px solid rgba(252, 209, 22, 0.2)',
                  borderRadius: '30px',
                  color: '#2C2C2C',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                <Sparkles className="me-2" size={16} style={{ color: '#2C2C2C' }} />
                News Hub
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '1px', 
              backgroundColor: 'rgba(44, 44, 44, 0.1)', 
              marginBottom: '24px',
              maxWidth: '200px'
            }}></div>
            <h1 
              className="display-5 mb-4"
              style={{
                color: '#2C2C2C',
                fontWeight: 700,
                lineHeight: '1.2',
                letterSpacing: '-0.5px'
              }}
            >
              Explore Latest News in Ghana
            </h1>
            
            <p 
              className="mb-5"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.8',
                color: 'rgba(44, 44, 44, 0.85)'
              }}
            >
              Discover the latest news, updates, and stories from across Ghana. Stay informed with our comprehensive news coverage. Drag to rotate and click any image to learn more.
            </p>

            {/* Feature Icons */}
            <div className="row g-4 mb-4">
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <BookOpen size={20} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>National News</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Latest National Updates</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Briefcase size={20} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Regional News</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Regional Updates</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Newspaper size={20} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Politics</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Political News</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Database size={20} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Trending News</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Trending Stories</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <GraduationCap size={20} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Education News</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Education Updates</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <UserCheck size={20} style={{ color: '#000000' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Jobs & Recruitment</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Job Opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              to="/news"
              className="d-inline-flex align-items-center px-4 py-3 rounded text-decoration-none"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
              }}
            >
              <span style={{ color: '#2C2C2C', fontSize: '0.95rem' }}>
                <strong style={{ color: '#2C2C2C' }}>Read more</strong>
              </span>
            </Link>
          </div>

          {/* Right Side - News Cards */}
          <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.3s">
            <div className="news-cards-grid">
              {newsArticles.slice(0, 6).map((article) => (
                <Link key={article.id} to={`/news/${article.id}`} className="news-card-small">
                  <div className="news-card-image-wrapper">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="news-card-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="news-card-category">{article.category}</div>
                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-summary">{article.summary}</p>
                  <div className="news-card-meta">
                    <Clock size={12} className="news-card-meta-icon" />
                    <div className="news-card-meta-text">
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

