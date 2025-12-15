import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Clock, Share2, Facebook, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
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
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

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
      padding-top: 120px;
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

    .bbc-article-content-wrapper {
      display: flex;
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
      align-items: flex-start;
    }

    .bbc-article-content {
      flex: 1;
      max-width: 700px;
    }

    .bbc-article-body {
      color: #333333; 
      font-family: 'system-ui', sans-serif;
      font-weight: 500;
      font-size: 16px;
      line-height: 26px;
      text-transform: none;
      text-decoration: none;
      letter-spacing: -0.36px;
      margin-bottom: 2rem;
    }

    .bbc-article-body p {
      margin: 0 0 1.5rem 0;
      color: #333333 !important;
      font-family: 'system-ui', sans-serif !important;
      font-weight: 500 !important;
      font-size: 16px !important;
      line-height: 26px !important;
      text-transform: none;
      text-decoration: none;
      letter-spacing: -0.36px;
    }

    .bbc-share-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 140px;
      align-self: flex-start;
    }

    .bbc-share-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      text-align: left;
      transition: color 0.2s ease;
    }

    .bbc-share-title:hover {
      color: #666666;
    }

    .bbc-share-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-10px);
      transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
    }

    @media (min-width: 768px) {
      .bbc-share-section:hover .bbc-share-buttons {
        max-height: 500px;
        opacity: 1;
        transform: translateY(0);
      }
    }

    .bbc-share-button-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid #e5e5e5;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .bbc-share-button-circle:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .bbc-share-button-circle svg {
      width: 20px;
      height: 20px;
    }

    .bbc-share-facebook {
      color: #1877f2;
    }

    .bbc-share-facebook:hover {
      color: #1877f2;
    }

    .bbc-share-twitter {
      color: #1da1f2;
    }

    .bbc-share-twitter:hover {
      color: #1da1f2;
    }

    .bbc-share-linkedin {
      color: #0077b5;
    }

    .bbc-share-linkedin:hover {
      color: #0077b5;
    }

    .bbc-share-pinterest {
      color: #bd081c;
    }

    .bbc-share-pinterest:hover {
      color: #bd081c;
    }

    .bbc-share-email {
      color: #000000;
    }

    .bbc-share-email:hover {
      color: #000000;
    }

    .bbc-share-link {
      color: #000000;
    }

    .bbc-share-link:hover {
      color: #000000;
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

    @media (max-width: 1199px) {
      .bbc-article-wrapper {
        padding-top: 50px;
      }
    }

    @media (max-width: 767px) {
      .bbc-article-wrapper {
        padding: 0 1rem;
        padding-top: 50px;
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

      .bbc-article-content-wrapper {
        flex-direction: column;
        gap: 2rem;
      }

      .bbc-share-section {
        position: relative;
        top: 0;
        align-self: flex-start;
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding-top: 0.75rem;
        border-top: 1px solid #e5e5e5;
      }

      .bbc-share-title {
        display: none;
      }

      .bbc-share-buttons {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        max-height: none;
        opacity: 1;
        transform: none;
        overflow: visible;
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      .bbc-share-button-circle {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
      }

      .bbc-share-button-circle svg {
        width: 18px;
        height: 18px;
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
      <div className="bbc-article-wrapper">
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

        <div className="bbc-article-content-wrapper">
          <div className="bbc-article-content">
            <div className="bbc-article-body">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="bbc-share-section">
            <button className="bbc-share-title">SHARE</button>
            <div className="bbc-share-buttons">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bbc-share-button-circle bbc-share-facebook"
                title="Share on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bbc-share-button-circle bbc-share-twitter"
                title="Share on X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bbc-share-button-circle bbc-share-linkedin"
                title="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(article.title)}&media=${encodeURIComponent(article.imageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bbc-share-button-circle bbc-share-pinterest"
                title="Share on Pinterest"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c5.302 0 9.917-3.158 11.827-7.69-.163-.69-.771-3.6-.771-3.6s.193.77.193 1.54c0 1.54-.916 2.77-2.077 2.77-1.54 0-2.31-1.155-2.31-2.31 0-1.54 1.155-3.08 1.155-4.62 0-2.31-1.54-3.85-3.85-3.85-2.31 0-3.85 1.54-3.85 3.85 0 .77.193 1.54.77 2.31-.77 3.08-2.31 7.69-2.31 10.39 0 1.54.193 3.08.193 4.62 0 1.54-.193 3.08-.193 4.62h3.85c.193-1.54.193-3.08.193-4.62 0-1.54-.193-3.08-.193-4.62z"/>
                </svg>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`}
                className="bbc-share-button-circle bbc-share-email"
                title="Share via Email"
              >
                <Mail size={20} />
              </a>
              <button
                onClick={handleCopyLink}
                className="bbc-share-button-circle bbc-share-link"
                title={copiedLink ? "Link Copied!" : "Copy Link"}
              >
                <Link2 size={20} />
              </button>
            </div>
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

