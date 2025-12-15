import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";

const articles: Record<string, {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  content: string[];
  relatedArticles: string[];
}> = {
  "1": {
    id: "1",
    title: "Ghana's Digital Transformation Initiative Gains Momentum",
    summary: "The government announces new investments in digital infrastructure to boost economic growth and improve public services across the country.",
    category: "National News",
    author: "Kwame Asante",
    publishedAt: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
    content: [
      "The government of Ghana has unveiled a comprehensive digital transformation strategy aimed at modernizing the nation's infrastructure and boosting economic competitiveness. The initiative, announced by the Minister of Communications and Digitalization, includes significant investments in broadband connectivity, digital skills training, and e-government services.",
      "According to the minister, the program will focus on three key pillars: infrastructure development, digital literacy, and innovation ecosystem support. Over the next five years, the government plans to invest over $500 million in expanding fiber optic networks and improving internet access in rural areas.",
      "The digital transformation initiative is expected to create thousands of jobs in the technology sector and improve access to essential services for millions of Ghanaians. The program will also support local tech startups and encourage foreign investment in the digital economy.",
      "Industry leaders have welcomed the announcement, noting that improved digital infrastructure will help Ghana compete more effectively in the global digital economy. The initiative aligns with the government's broader vision of positioning Ghana as a technology hub in West Africa.",
    ],
    relatedArticles: ["2", "4"],
  },
  "2": {
    id: "2",
    title: "New Education Policy Aims to Bridge Skills Gap",
    summary: "Ministry of Education introduces comprehensive reforms to align curriculum with industry needs and enhance graduate employability.",
    category: "Education News",
    author: "Ama Mensah",
    publishedAt: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop",
    content: [
      "The Ministry of Education has launched a groundbreaking education reform program designed to better prepare students for the demands of the modern workforce. The new policy emphasizes practical skills, critical thinking, and industry partnerships.",
      "Key components of the reform include curriculum updates across all levels of education, from primary schools to universities. The changes will integrate technology, entrepreneurship, and soft skills training into traditional academic programs.",
      "The ministry has also announced partnerships with leading companies to provide internship opportunities and mentorship programs for students. These initiatives aim to bridge the gap between academic learning and real-world application.",
      "Education experts have praised the reforms, noting that they address long-standing concerns about graduate employability. The policy is expected to be fully implemented over the next three years, with pilot programs beginning in select schools this academic year.",
    ],
    relatedArticles: ["1", "3"],
  },
};

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const article = id ? articles[id] : null;
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!article) {
    return (
      <div>
        <Navigation />
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>Article Not Found</h1>
          <Link to="/news" style={{ color: "#bb1919", textDecoration: "none" }}>
            Return to News
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const bbcStyles = `
    .bbc-article-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .bbc-article-wrapper {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .bbc-article-header {
      padding: 2rem 0 1rem 0;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 2rem;
    }

    .bbc-article-breadcrumb {
      font-size: 0.875rem;
      color: #666666;
      margin-bottom: 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-article-breadcrumb a {
      color: #000000;
      text-decoration: none;
    }

    .bbc-article-breadcrumb a:hover {
      text-decoration: underline;
    }

    .bbc-article-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: #bb1919;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-article-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
      line-height: 1.2;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
    }

    .bbc-article-summary {
      font-size: 1.25rem;
      color: #4a4a4a;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      font-weight: 400;
    }

    .bbc-article-meta {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: #666666;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .bbc-article-meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .bbc-article-image {
      width: 100%;
      height: auto;
      max-height: 500px;
      object-fit: cover;
      margin: 2rem 0;
      background: #f5f5f5;
    }

    .bbc-article-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .bbc-article-body {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #000000;
      margin-bottom: 2rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-article-body p {
      margin: 0 0 1.5rem 0;
    }

    .bbc-article-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 0;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      margin: 2rem 0;
    }

    .bbc-share-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid #e5e5e5;
      color: #000000;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-share-button:hover {
      background: #f5f5f5;
      border-color: #000000;
    }

    .bbc-share-menu {
      position: relative;
    }

    .bbc-share-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 0.5rem;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 150px;
      z-index: 10;
    }

    .bbc-share-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      color: #000000;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      transition: background 0.2s ease;
    }

    .bbc-share-item:hover {
      background: #f5f5f5;
    }

    .bbc-related-section {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 2px solid #e5e5e5;
    }

    .bbc-related-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 2rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .bbc-related-card {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s ease;
    }

    .bbc-related-card:hover {
      opacity: 0.8;
    }

    .bbc-related-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      margin-bottom: 1rem;
      background: #f5f5f5;
    }

    .bbc-related-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: #bb1919;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-related-title-text {
      font-size: 1.125rem;
      font-weight: 700;
      color: #000000;
      margin: 0;
      line-height: 1.3;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    @media (max-width: 767px) {
      .bbc-article-wrapper {
        padding: 0 1rem;
      }

      .bbc-article-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .bbc-article-image {
        margin: 1.5rem 0;
      }

      .bbc-related-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  const relatedArticles = article.relatedArticles
    .map(relatedId => articles[relatedId])
    .filter(Boolean);

  return (
    <div className="bbc-article-page">
      <style>{bbcStyles}</style>
      <Navigation />
      <div className="bbc-article-wrapper" style={{ paddingTop: '120px' }}>
        <div className="bbc-article-header">
          <div className="bbc-article-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/news">News</Link> / {article.category}
          </div>
          <div className="bbc-article-category">{article.category}</div>
          <h1 className="bbc-article-title">{article.title}</h1>
          <p className="bbc-article-summary">{article.summary}</p>
          <div className="bbc-article-meta">
            <div className="bbc-article-meta-item">
              <Clock size={16} />
              <span>{article.publishedAt}</span>
            </div>
            <div className="bbc-article-meta-item">
              <span>By {article.author}</span>
            </div>
          </div>
        </div>

        <img src={article.imageUrl} alt={article.title} className="bbc-article-image" />

        <div className="bbc-article-content">
          <div className="bbc-article-actions">
            <div className="bbc-share-menu">
              <button
                className="bbc-share-button"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 size={16} />
                Share
              </button>
              {showShareMenu && (
                <div className="bbc-share-dropdown">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bbc-share-item"
                  >
                    <Facebook size={16} />
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bbc-share-item"
                  >
                    <Twitter size={16} />
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bbc-share-item"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bbc-article-body">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="bbc-related-section">
            <h2 className="bbc-related-title">Related Articles</h2>
            <div className="bbc-related-grid">
              {relatedArticles.map((related) => (
                <Link key={related.id} to={`/news/${related.id}`} className="bbc-related-card">
                  <img src={related.imageUrl} alt={related.title} className="bbc-related-image" />
                  <div className="bbc-related-category">{related.category}</div>
                  <h3 className="bbc-related-title-text">{related.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsArticle;

