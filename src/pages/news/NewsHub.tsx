import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Clock, ChevronRight, ChevronLeft } from "lucide-react";

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
    imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1756304758/finance_fgi2jq.jpg",
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

const discoverItems = [
  {
    id: "discover-1",
    title: "Royal Watch",
    description: "The full story on the Royal Family, in your inbox every Thursday.",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=350&fit=crop",
    cta: "See the latest newsletter"
  },
  {
    id: "discover-2",
    title: "Download the MetaNews app",
    description: "Click here to download the MetaNews app for Apple and Android devices.",
    imageUrl: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=600&h=350&fit=crop",
    cta: "Download the app"
  },
  {
    id: "discover-3",
    title: "US Politics Unspun",
    description: "No noise. No agenda. Just expert analysis of the issues that matter most.",
    imageUrl: "https://images.unsplash.com/photo-1528756514091-dee5ecaa3278?w=600&h=350&fit=crop",
    cta: "Read the newsletter"
  },
  {
    id: "discover-4",
    title: "Register for a MetaNews account",
    description: "Save articles and videos for later and stay signed in across devices.",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600&h=350&fit=crop",
    cta: "Create an account"
  },
  {
    id: "discover-5",
    title: "Sign up for the Best of MetaNews",
    description: "Top stories picked by MetaNews editors, in your inbox twice a week.",
    imageUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&h=350&fit=crop",
    cta: "Subscribe now"
  }
];

const NewsHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");
  // Removed scrollPosition and isResetting state - now using direct DOM manipulation to prevent Navigation re-renders
  const breakingNewsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakingNewsWrapperRef = useRef<HTMLDivElement | null>(null);
  const breakingNewsItems = newsArticles.slice(0, 8);
  const discoverViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Step-by-step breaking news animation - OPTIMIZED to prevent Navigation re-renders
  useEffect(() => {
    if (!breakingNewsWrapperRef.current) return;
    
    // Approximate item height (including padding and border)
    const itemHeight = 85; // Adjust based on your item height
    const totalHeight = breakingNewsItems.length * itemHeight;
    const wrapperElement = breakingNewsWrapperRef.current;
    
    let currentPosition = 0;
    
    breakingNewsIntervalRef.current = setInterval(() => {
      currentPosition += itemHeight;
      
      // Reset when we've scrolled through one full set of items
      if (currentPosition >= totalHeight) {
        // Instant reset (no transition) for seamless loop
        wrapperElement.classList.add('no-transition');
        currentPosition = 0;
        wrapperElement.style.transform = `translateY(-${currentPosition}px)`;
        
        setTimeout(() => {
          wrapperElement.classList.remove('no-transition');
        }, 50);
      } else {
        wrapperElement.style.transform = `translateY(-${currentPosition}px)`;
      }
    }, 3500); // Move every 3.5 seconds (1s move + 2.5s pause)

    return () => {
      if (breakingNewsIntervalRef.current) {
        clearInterval(breakingNewsIntervalRef.current);
      }
    };
  }, [breakingNewsItems.length]);

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

  const handleDiscoverNav = (direction: "prev" | "next") => {
    const viewport = discoverViewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector(".bbc-discover-card") as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 260;
    const gap = 16; // matches the 1rem gap in CSS
    const scrollAmount = cardWidth + gap;

    viewport.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
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

    .bbc-breaking-news-container {
      position: relative;
      height: 350px;
      overflow: hidden;
    }

    .bbc-breaking-news-wrapper {
      display: flex;
      flex-direction: column;
      transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    .bbc-breaking-news-wrapper.no-transition {
      transition: none;
    }

    .bbc-breaking-news-container:hover .bbc-breaking-news-wrapper {
      transition-duration: 0.3s;
    }

    .bbc-breaking-news-item {
      flex-shrink: 0;
      width: 100%;
      padding: 0.875rem 0;
      border-bottom: 1px solid #e5e5e5;
    }

    .bbc-breaking-news-item:last-child {
      border-bottom: none;
    }

    .bbc-discover-section {
      margin: 3rem auto 0;
      padding: 0 3rem 3rem 3rem;
      max-width: 1400px;
      background: #111;
      color: #fff;
    }

    .bbc-discover-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 1.5rem;
    }

    .bbc-discover-title {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: #fff;
    }

    .bbc-discover-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .bbc-discover-nav button {
      width: 36px;
      height: 36px;
      border: 1px solid rgba(255,255,255,0.15);
      background: transparent;
      color: #fff;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .bbc-discover-nav button:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.4);
    }

    .bbc-discover-viewport {
      overflow-x: auto;
      overflow-y: hidden;
      position: relative;
      scrollbar-width: none;
      -ms-overflow-style: none;
      scroll-snap-type: x mandatory;
    }

    .bbc-discover-viewport::-webkit-scrollbar {
      display: none;
    }

    .bbc-discover-track {
      display: flex;
      gap: 1rem;
      padding-bottom: 0.5rem;
    }

    .bbc-discover-card {
      background: #1a1a1a;
      color: #f5f5f5;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 260px;
      min-width: 230px;
      max-width: 280px;
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .bbc-discover-image {
      width: 100%;
      height: 140px;
      object-fit: cover;
      display: block;
    }

    .bbc-discover-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .bbc-discover-card-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
      color: #fff;
      line-height: 1.3;
    }

    .bbc-discover-card-text {
      font-size: 0.875rem;
      color: #d9d9d9;
      line-height: 1.5;
      margin: 0;
      flex: 1;
    }

    .bbc-discover-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #f5f5f5;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      margin-top: 0.25rem;
    }

    .bbc-discover-cta:hover {
      text-decoration: underline;
    }

    /* Mobile/tablet breaking news ticker */
    .bbc-breaking-ticker {
      display: none;
      background: #bb1919;
      color: #fff;
      padding: 0.75rem 1rem;
      overflow: hidden;
    }

    .bbc-breaking-ticker-header {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-size: 0.85rem;
      margin-bottom: 0.35rem;
      position: relative;
      display: inline-block;
    }

    .bbc-breaking-ticker-header::after {
      content: "";
      display: block;
      height: 1px;
      width: 140px;
      background: linear-gradient(90deg, rgba(255,255,255,0.65), rgba(255,255,255,0.2));
      border-radius: 999px;
      margin-top: 4px;
    }

    .bbc-breaking-ticker-track {
      display: flex;
      gap: 2.5rem;
      animation: ticker-rtl 32s linear infinite;
      will-change: transform;
    }

    .bbc-breaking-ticker-track:hover {
      animation-play-state: paused;
    }

    .bbc-breaking-ticker-item {
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      font-weight: 600;
      padding-right: 1rem;
      border-right: 1px solid rgba(255,255,255,0.35);
      margin-right: 1rem;
    }

    .bbc-breaking-ticker-item:last-child {
      border-right: none;
      margin-right: 0;
      padding-right: 0;
    }

    .bbc-breaking-ticker-time {
      font-weight: 500;
      font-size: 0.85rem;
      opacity: 0.9;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    @keyframes ticker-rtl {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @media (max-width: 1023px) {
      .bbc-discover-section {
        padding: 0 1.25rem 2.5rem 1.25rem;
      }

      .bbc-sidebar-area {
        display: none;
      }

      .bbc-breaking-ticker {
        display: block;
      }

      /* Reduce top padding on tablet and below */
      .bbc-content-wrapper {
        padding-top: 80px !important;
      }
    }

    .bbc-breaking-news-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #bb1919;
      margin: 0 0 1rem 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #bb1919;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .bbc-breaking-news-badge {
      display: inline-block;
      background: #bb1919;
      color: #ffffff;
      padding: 0.125rem 0.5rem;
      border-radius: 2px;
      font-size: 0.625rem;
      font-weight: 700;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
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
      <div className="bbc-breaking-ticker">
        <div className="bbc-breaking-ticker-header">Breaking News</div>
        <div className="bbc-breaking-ticker-track">
          {[...breakingNewsItems, ...breakingNewsItems].map((article, index) => (
            <div key={`ticker-${article.id}-${index}`} className="bbc-breaking-ticker-item">
              <span className="bbc-breaking-ticker-time">
                <Clock size={12} />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span>{article.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bbc-content-wrapper" style={{ paddingTop: '120px' }}>
        <main className="bbc-main-content-area">
          <div className="bbc-header">
            <h1 className="bbc-header-title">MetaNews</h1>
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
            <h3 className="bbc-breaking-news-title">
              <span className="bbc-breaking-news-badge">LIVE</span>
              Breaking News
            </h3>
            <div className="bbc-breaking-news-container">
              <div 
                className="bbc-breaking-news-wrapper"
                ref={breakingNewsWrapperRef}
              >
                {/* First set of items */}
                {newsArticles.slice(0, 8).map((article, index) => (
                  <Link 
                    key={`breaking-1-${article.id}`} 
                    to={`/news/${article.id}`} 
                    className="bbc-breaking-news-item bbc-sidebar-item"
                  >
                    <div className="bbc-sidebar-text">
                      <div className="bbc-sidebar-title-text">{article.title}</div>
                      <div className="bbc-sidebar-meta">
                        <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                        {article.publishedAt}
                      </div>
                    </div>
                  </Link>
                ))}
                {/* Duplicate set for seamless loop */}
                {newsArticles.slice(0, 8).map((article, index) => (
                  <Link 
                    key={`breaking-2-${article.id}`} 
                    to={`/news/${article.id}`} 
                    className="bbc-breaking-news-item bbc-sidebar-item"
                  >
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
          </div>

        </aside>
      </div>
      <section className="bbc-discover-section">
        <div className="bbc-discover-header">
          <div className="bbc-discover-title">Discover more from MetaNews</div>
          <div className="bbc-discover-nav">
            <button aria-label="Previous" onClick={() => handleDiscoverNav("prev")}>
              <ChevronLeft size={16} />
            </button>
            <button aria-label="Next" onClick={() => handleDiscoverNav("next")}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="bbc-discover-viewport" ref={discoverViewportRef}>
          <div className="bbc-discover-track">
            {discoverItems.map((item) => (
              <div key={item.id} className="bbc-discover-card">
                <img src={item.imageUrl} alt={item.title} className="bbc-discover-image" />
                <div className="bbc-discover-body">
                  <h4 className="bbc-discover-card-title">{item.title}</h4>
                  <p className="bbc-discover-card-text">{item.description}</p>
                  <span className="bbc-discover-cta">
                    {item.cta}
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NewsHub;

