import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Clock, ChevronRight } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  isFeatured?: boolean;
  isLive?: boolean;
}

const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Ghana's Digital Transformation Initiative Gains Momentum",
    summary: "The government announces new investments in digital infrastructure to boost economic growth and improve public services across the country.",
    category: "National News",
    author: "Kwame Asante",
    publishedAt: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    isFeatured: true,
  },
  {
    id: "2",
    title: "New Education Policy Aims to Bridge Skills Gap",
    summary: "Ministry of Education introduces comprehensive reforms to align curriculum with industry needs and enhance graduate employability.",
    category: "Education News",
    author: "Ama Mensah",
    publishedAt: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Ashanti Region Launches New Development Projects",
    summary: "Regional government announces major infrastructure investments to improve transportation and public services in the Ashanti Region.",
    category: "Regional News",
    author: "Dr. Kofi Owusu",
    publishedAt: "6 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop",
  },
  {
    id: "4",
    title: "Parliament Debates New Economic Policy Bill",
    summary: "Legislators engage in heated discussions over proposed economic reforms aimed at stimulating growth and reducing unemployment.",
    category: "Politics",
    author: "Yaa Bonsu",
    publishedAt: "8 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  },
  {
    id: "5",
    title: "Viral Social Media Campaign Promotes Local Tourism",
    summary: "Ghanaian tourism experiences surge in interest following viral social media campaign showcasing the country's natural beauty and culture.",
    category: "Trending News",
    author: "Michael Adjei",
    publishedAt: "10 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop",
  },
  {
    id: "6",
    title: "Major Companies Announce 5,000 New Job Openings",
    summary: "Leading employers in technology, finance, and manufacturing sectors announce massive recruitment drive to fill thousands of positions.",
    category: "Jobs & Recruitment News",
    author: "Efua Tetteh",
    publishedAt: "12 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop",
  },
  {
    id: "7",
    title: "Universities Partner with Industry for Skills Development",
    summary: "Higher education institutions sign agreements with major companies to provide practical training and improve graduate employability.",
    category: "Education News",
    author: "Nana Yaa",
    publishedAt: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop",
  },
  {
    id: "8",
    title: "Government Announces New Employment Initiatives",
    summary: "Ministry of Employment launches programs to create opportunities for youth and reduce unemployment rates across the country.",
    category: "Jobs & Recruitment News",
    author: "Kwabena Osei",
    publishedAt: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop",
  },
  {
    id: "9",
    title: "Central Region Hosts National Cultural Festival",
    summary: "Annual celebration brings together artists, musicians, and cultural enthusiasts from across Ghana to showcase traditional heritage.",
    category: "Regional News",
    author: "Akosua Boateng",
    publishedAt: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop",
  },
  {
    id: "10",
    title: "Opposition Party Proposes Alternative Budget Plan",
    summary: "Main opposition party presents comprehensive economic proposal as alternative to government's fiscal policy for the coming year.",
    category: "Politics",
    author: "Kojo Mensah",
    publishedAt: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  },
  {
    id: "11",
    title: "Tech Innovation Hub Opens in Accra",
    summary: "New state-of-the-art facility aims to support startups and tech entrepreneurs with resources, mentorship, and funding opportunities.",
    category: "National News",
    author: "Patience Adjei",
    publishedAt: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
  },
  {
    id: "12",
    title: "Students Protest Over Tuition Fee Increases",
    summary: "University students across the country organize demonstrations calling for review of recent tuition fee adjustments.",
    category: "Education News",
    author: "Emmanuel Asante",
    publishedAt: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop",
  },
  {
    id: "13",
    title: "Recruitment Drive Targets 10,000 Healthcare Workers",
    summary: "Ministry of Health launches nationwide campaign to recruit healthcare professionals to address staffing shortages in hospitals.",
    category: "Jobs & Recruitment News",
    author: "Dr. Sarah Owusu",
    publishedAt: "3 days ago",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop",
  },
  {
    id: "14",
    title: "Northern Region Receives Development Funding",
    summary: "International development partners commit millions in funding for infrastructure and economic development projects in the north.",
    category: "Regional News",
    author: "Ibrahim Mohammed",
    publishedAt: "3 days ago",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop",
  },
  {
    id: "15",
    title: "Social Media Influencers Drive Tourism Campaign",
    summary: "Popular content creators collaborate with tourism board to showcase Ghana's attractions, generating millions of views online.",
    category: "Trending News",
    author: "Maame Adwoa",
    publishedAt: "3 days ago",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop",
  },
];

const categories = ["All", "National News", "Regional News", "Politics", "Trending News", "Education News", "Jobs & Recruitment News"];

const NewsHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const allArticles = newsArticles;
  const filteredArticles = selectedCategory === "All" 
    ? allArticles 
    : allArticles.filter(article => article.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const bbcStyles = `
    .bbc-news-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .bbc-content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0;
      display: flex;
    }

    .bbc-main-content-area {
      flex: 1;
      min-width: 0;
      padding: 2rem 2rem 2rem 3rem;
      border-right: 1px solid #e5e5e5;
    }

    .bbc-sidebar-area {
      width: 320px;
      flex-shrink: 0;
      padding: 2rem 3rem 2rem 2rem;
      background: #ffffff;
    }

    .bbc-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .bbc-header-title {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.01em;
    }

    .bbc-header-subtitle {
      font-size: 0.875rem;
      color: #666666;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-categories {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .bbc-category-btn {
      padding: 0.375rem 0.75rem;
      background: transparent;
      border: 1px solid #e5e5e5;
      color: #000000;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-category-btn:hover {
      background: #f5f5f5;
      border-color: #000000;
    }

    .bbc-category-btn.active {
      background: #000000;
      color: #ffffff;
      border-color: #000000;
    }

    .bbc-articles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      border-top: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
    }

    .bbc-article-card {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      background: #ffffff;
      transition: background-color 0.15s ease;
    }

    .bbc-article-card:nth-child(3n) {
      border-right: none;
    }

    .bbc-article-card:hover {
      background: #fafafa;
    }

    .bbc-article-image-wrapper {
      width: 100%;
      margin-bottom: 0.875rem;
      position: relative;
      overflow: hidden;
      background: #f5f5f5;
      padding-bottom: 56.25%;
      height: 0;
      border-radius: 2px;
    }

    .bbc-article-image {
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

    .bbc-article-image[src=""],
    .bbc-article-image:not([src]) {
      opacity: 0;
    }

    .bbc-article-card:hover .bbc-article-image {
      transform: scale(1.02);
    }

    .bbc-article-category {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #bb1919;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.2;
    }

    .bbc-article-title {
      font-size: 1rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.625rem 0;
      line-height: 1.35;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 4.05rem;
    }

    .bbc-article-summary {
      font-size: 0.8125rem;
      color: #4a4a4a;
      line-height: 1.5;
      margin: 0 0 0.75rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.4375rem;
    }

    .bbc-article-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #666666;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      padding-top: 0.5rem;
      border-top: 1px solid #f0f0f0;
    }

    .bbc-article-meta-icon {
      width: 12px;
      height: 12px;
      color: #999999;
      flex-shrink: 0;
    }

    .bbc-article-meta-text {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .bbc-article-meta-separator {
      color: #cccccc;
    }

    .bbc-sidebar-section {
      margin-bottom: 2.5rem;
    }

    .bbc-sidebar-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .bbc-sidebar-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .bbc-sidebar-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 0;
      border-bottom: 1px solid #e5e5e5;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s ease;
    }

    .bbc-sidebar-item:last-child {
      border-bottom: none;
    }

    .bbc-sidebar-item:hover {
      opacity: 0.7;
    }

    .bbc-sidebar-text {
      flex: 1;
      min-width: 0;
    }

    .bbc-sidebar-title-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #000000;
      margin: 0 0 0.25rem 0;
      line-height: 1.3;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .bbc-sidebar-meta {
      font-size: 0.75rem;
      color: #666666;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    @media (max-width: 1023px) {
      .bbc-content-wrapper {
        flex-direction: column;
      }

      .bbc-main-content-area {
        padding: 1.5rem;
        border-right: none;
        border-bottom: 1px solid #e5e5e5;
      }

      .bbc-sidebar-area {
        width: 100%;
        padding: 1.5rem;
      }

      .bbc-articles-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .bbc-article-card:nth-child(3n) {
        border-right: 1px solid #e5e5e5;
      }

      .bbc-article-card:nth-child(2n) {
        border-right: none;
      }
    }

    @media (max-width: 767px) {
      .bbc-main-content-area {
        padding: 1rem;
      }

      .bbc-sidebar-area {
        padding: 1rem;
      }

      .bbc-header-title {
        font-size: 1.5rem;
      }

      .bbc-articles-grid {
        grid-template-columns: 1fr;
      }

      .bbc-article-card {
        border-right: none;
      }

      .bbc-article-card:nth-child(3n),
      .bbc-article-card:nth-child(2n) {
        border-right: none;
      }

      .bbc-article-title {
        min-height: auto;
        -webkit-line-clamp: 2;
      }

      .bbc-article-summary {
        min-height: auto;
      }
    }

    @media (min-width: 1024px) and (max-width: 1279px) {
      .bbc-sidebar-area {
        width: 280px;
      }

      .bbc-main-content-area {
        padding: 1.5rem 1.5rem 1.5rem 2rem;
      }

      .bbc-sidebar-area {
        padding: 1.5rem 2rem 1.5rem 1.5rem;
      }
    }
  `;

  return (
    <div className="bbc-news-page">
      <style>{bbcStyles}</style>
      <Navigation />
      <div className="bbc-content-wrapper" style={{ paddingTop: '120px' }}>
        <main className="bbc-main-content-area">
          <div className="bbc-header">
            <h1 className="bbc-header-title">News</h1>
            <p className="bbc-header-subtitle">
              {selectedCategory === "All" 
                ? "Latest news and updates from across Ghana" 
                : `Latest ${selectedCategory.toLowerCase()} from across Ghana`}
            </p>
            <div className="bbc-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`bbc-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="bbc-articles-grid">
            {filteredArticles.map((article) => (
              <Link key={article.id} to={`/news/${article.id}`} className="bbc-article-card">
                <div className="bbc-article-image-wrapper">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="bbc-article-image"
                    loading="lazy"
                  />
                </div>
                <div className="bbc-article-category">{article.category}</div>
                <h3 className="bbc-article-title">{article.title}</h3>
                <p className="bbc-article-summary">{article.summary}</p>
                <div className="bbc-article-meta">
                  <Clock size={12} className="bbc-article-meta-icon" />
                  <div className="bbc-article-meta-text">
                    <span>{article.publishedAt}</span>
                    <span className="bbc-article-meta-separator">|</span>
                    <span>{article.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <aside className="bbc-sidebar-area">
          <div className="bbc-sidebar-section">
            <h3 className="bbc-sidebar-title">Most Read</h3>
            <div className="bbc-sidebar-list">
              {newsArticles.slice(0, 5).map((article) => (
                <Link key={article.id} to={`/news/${article.id}`} className="bbc-sidebar-item">
                  <div className="bbc-sidebar-text">
                    <div className="bbc-sidebar-title-text">{article.title}</div>
                    <div className="bbc-sidebar-meta">
                      <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                      {article.publishedAt}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bbc-sidebar-section">
            <h3 className="bbc-sidebar-title">Categories</h3>
            <div className="bbc-sidebar-list">
              {categories.slice(1).map((category) => (
                <Link
                  key={category}
                  to={`/news?category=${encodeURIComponent(category)}`}
                  className="bbc-sidebar-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange(category);
                  }}
                >
                  <div className="bbc-sidebar-text">
                    <div className="bbc-sidebar-title-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {category}
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default NewsHub;

