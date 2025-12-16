import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookOpen, FileText, HelpCircle, Info, ChevronRight, Zap, Shield } from "lucide-react";

interface InfoSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  articles: InfoArticle[];
}

interface InfoArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
}

const infoSections: InfoSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Essential information for new users",
    icon: "book",
    category: "Guide",
    articles: [
      {
        id: "1",
        title: "Welcome to Ghana National Resource System",
        summary: "Learn about our platform and how to get the most out of it",
        category: "Introduction",
      },
      {
        id: "2",
        title: "Creating Your Account",
        summary: "Step-by-step guide to setting up your profile",
        category: "Account",
      },
      {
        id: "3",
        title: "Navigating the Platform",
        summary: "Understanding the interface and key features",
        category: "Guide",
      },
    ],
  },
  {
    id: "education",
    title: "Education Resources",
    description: "Everything about educational tools and resources",
    icon: "education",
    category: "Education",
    articles: [
      {
        id: "4",
        title: "How to Access Past Questions",
        summary: "Complete guide to finding and using past examination papers",
        category: "Education",
      },
      {
        id: "5",
        title: "Using the CGPA Calculator",
        summary: "Calculate your GPA and understand grading systems",
        category: "Tools",
      },
      {
        id: "6",
        title: "Study Groups and Forums",
        summary: "Connect with other students and share knowledge",
        category: "Community",
      },
    ],
  },
  {
    id: "jobs",
    title: "Job Portal",
    description: "Finding employment opportunities",
    icon: "briefcase",
    category: "Jobs",
    articles: [
      {
        id: "7",
        title: "How to Search for Jobs",
        summary: "Tips and tricks for finding the right job opportunities",
        category: "Jobs",
      },
      {
        id: "8",
        title: "Creating a Professional Resume",
        summary: "Use our resume builder to create standout CVs",
        category: "Resume",
      },
      {
        id: "9",
        title: "Application Process",
        summary: "Step-by-step guide to applying for jobs",
        category: "Jobs",
      },
    ],
  },
  {
    id: "directories",
    title: "Directories",
    description: "Business and institution listings",
    icon: "directory",
    category: "Directory",
    articles: [
      {
        id: "10",
        title: "Finding Universities and Schools",
        summary: "Search and compare educational institutions",
        category: "Education",
      },
      {
        id: "11",
        title: "Business Directory Guide",
        summary: "How to find and review businesses",
        category: "Business",
      },
      {
        id: "12",
        title: "Writing Reviews",
        summary: "Share your experiences and help others",
        category: "Community",
      },
    ],
  },
];

const InfoHub = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Handle hash scrolling when component mounts or hash changes
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the # symbol
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  const bbcStyles = `
    .bbc-info-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .bbc-info-wrapper {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .bbc-info-header {
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      padding: 2rem 0 1rem 0;
      margin-bottom: 3rem;
    }

    .bbc-info-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
    }

    .bbc-info-subtitle {
      font-size: 1.125rem;
      color: #4a4a4a;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
    }

    .bbc-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .bbc-info-card {
      background: #ffffff;
      border: 1px solid #e5e5e5;
      padding: 2rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .bbc-info-card:hover {
      border-color: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .bbc-info-card-icon {
      width: 48px;
      height: 48px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      color: #bb1919;
    }

    .bbc-info-card-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: #bb1919;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-info-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.75rem 0;
      line-height: 1.3;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-info-card-description {
      font-size: 0.9375rem;
      color: #4a4a4a;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-info-card-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #000000;
      text-decoration: none;
      margin-top: auto;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-info-card-link:hover {
      color: #bb1919;
    }

    .bbc-articles-section {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 2px solid #e5e5e5;
    }

    .bbc-articles-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 2rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-articles-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .bbc-article-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e5e5e5;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }

    .bbc-article-item:hover {
      border-color: #000000;
      background: #fafafa;
    }

    .bbc-article-icon {
      width: 40px;
      height: 40px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bb1919;
      flex-shrink: 0;
    }

    .bbc-article-content {
      flex: 1;
      min-width: 0;
    }

    .bbc-article-category {
      font-size: 0.75rem;
      font-weight: 700;
      color: #bb1919;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-article-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-article-summary {
      font-size: 0.9375rem;
      color: #4a4a4a;
      line-height: 1.6;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-article-arrow {
      color: #bb1919;
      flex-shrink: 0;
    }

    .bbc-help-section {
      background: #f5f5f5;
      padding: 3rem 2rem;
      margin-top: 4rem;
      border-top: 2px solid #e5e5e5;
    }

    .bbc-help-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-help-text {
      font-size: 1rem;
      color: #4a4a4a;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-help-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #000000;
      color: #ffffff;
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-help-button:hover {
      background: #333333;
    }

    @media (max-width: 767px) {
      .bbc-info-wrapper {
        padding: 0 1rem;
      }

      .bbc-info-title {
        font-size: 1.75rem;
      }

      .bbc-info-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .bbc-article-item {
        flex-direction: column;
        gap: 1rem;
      }
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      .bbc-info-wrapper {
        padding: 0 1.5rem;
      }

      .bbc-info-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1200px) {
      .bbc-info-wrapper {
        padding: 0 2rem;
      }
    }
  `;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "book":
        return <BookOpen size={24} />;
      case "education":
        return <FileText size={24} />;
      case "briefcase":
        return <Info size={24} />;
      case "directory":
        return <HelpCircle size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  const allArticles = infoSections.flatMap(section => 
    section.articles.map(article => ({ ...article, sectionId: section.id }))
  );

  const filteredArticles = selectedCategory
    ? allArticles.filter(article => article.category === selectedCategory)
    : allArticles;

  return (
    <div className="bbc-info-page">
      <style>{bbcStyles}</style>
      <Navigation />
      <div className="bbc-info-wrapper" style={{ paddingTop: '120px' }}>
        <div className="bbc-info-header">
          <h1 className="bbc-info-title">Information Hub</h1>
          <p className="bbc-info-subtitle">
            Find answers to common questions and learn how to make the most of our platform
          </p>
        </div>

        <div className="bbc-info-grid">
          {infoSections.map((section) => (
            <Link
              key={section.id}
              to={`/info/${section.id}`}
              className="bbc-info-card"
            >
              <div className="bbc-info-card-icon">
                {getIcon(section.icon)}
              </div>
              <div className="bbc-info-card-category">{section.category}</div>
              <h2 className="bbc-info-card-title">{section.title}</h2>
              <p className="bbc-info-card-description">{section.description}</p>
              <div className="bbc-info-card-link">
                Learn more <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>

        <div id="platform-features" className="bbc-features-section" style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '2px solid #e5e5e5', scrollMarginTop: '80px' }}>
          <h2 className="bbc-articles-title" style={{ marginBottom: '2rem' }}>Platform Features</h2>
          <div className="bbc-info-grid">
            <Link to="/info/fast-executions" className="bbc-info-card">
              <div className="bbc-info-card-icon">
                <Zap size={24} />
              </div>
              <div className="bbc-info-card-category">Performance</div>
              <h2 className="bbc-info-card-title">Fast Executions</h2>
              <p className="bbc-info-card-description">
                Our platform delivers quick and efficient access to resources. Whether you're searching for educational opportunities, job listings, or national information, we ensure rapid response times and streamlined processes that save you valuable time.
              </p>
              <div className="bbc-info-card-link">
                Read More <ChevronRight size={16} />
              </div>
            </Link>

            <Link to="/info/guide-support" className="bbc-info-card">
              <div className="bbc-info-card-icon">
                <HelpCircle size={24} />
              </div>
              <div className="bbc-info-card-category">Support</div>
              <h2 className="bbc-info-card-title">Guide & Support</h2>
              <p className="bbc-info-card-description">
                Our dedicated support team is always ready to assist you. From navigating the platform to finding specific resources, we provide comprehensive guidance and support to ensure you have the best experience accessing national resources.
              </p>
              <div className="bbc-info-card-link">
                Read More <ChevronRight size={16} />
              </div>
            </Link>

            <Link to="/info/financial-secure" className="bbc-info-card">
              <div className="bbc-info-card-icon">
                <Shield size={24} />
              </div>
              <div className="bbc-info-card-category">Security</div>
              <h2 className="bbc-info-card-title">Financial Secure</h2>
              <p className="bbc-info-card-description">
                All our services are completely free and secure. We ensure the highest standards of data protection and privacy, giving you peace of mind while accessing valuable national resources without any financial concerns.
              </p>
              <div className="bbc-info-card-link">
                Read More <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>

        <div className="bbc-articles-section">
          <h2 className="bbc-articles-title">All Articles</h2>
          <div className="bbc-articles-list">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/info/article/${article.id}`}
                className="bbc-article-item"
              >
                <div className="bbc-article-icon">
                  <FileText size={20} />
                </div>
                <div className="bbc-article-content">
                  <div className="bbc-article-category">{article.category}</div>
                  <h3 className="bbc-article-title">{article.title}</h3>
                  <p className="bbc-article-summary">{article.summary}</p>
                </div>
                <ChevronRight size={20} className="bbc-article-arrow" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bbc-help-section">
          <h2 className="bbc-help-title">Still need help?</h2>
          <p className="bbc-help-text">
            Can't find what you're looking for? Our support team is here to help you. Visit our homepage to access contact information and support resources.
          </p>
          <Link to="/" className="bbc-help-button">
            <HelpCircle size={18} />
            Visit Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InfoHub;

