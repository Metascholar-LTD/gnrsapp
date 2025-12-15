import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { TrendingUp, Settings, Database, ThumbsUp, ThumbsDown, MoreVertical, List, Grid, ChevronDown, User, FolderPlus, Bookmark, Download, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Dataset {
  id: string;
  title: string;
  description: string;
  author: string;
  downloads: string;
  views: string;
  updatedDate: string;
  size: string;
  format: string[];
  tags: string[];
  category: string;
  license: string;
  featured?: boolean;
  trending?: boolean;
  image?: string;
  usability?: number;
  votes?: number;
  fileCount?: number;
  notebooks?: number;
  badge?: 'Bronze' | 'Silver' | 'Gold';
}

const DatasetCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock dataset data - in real app, fetch based on category
  const allDatasets: Dataset[] = [
    {
      id: '1',
      title: 'Ghana Population Census Data 2021',
      description: 'Comprehensive population census data for all regions and districts in Ghana.',
      author: 'Ghana Statistical Service',
      downloads: '12.5K',
      views: '45.2K',
      updatedDate: '2024-01-15',
      size: '125 MB',
      format: ['CSV', 'JSON', 'Excel'],
      tags: ['census', 'population', 'demographics'],
      category: 'Government',
      license: 'Open Data',
      featured: true,
      trending: true,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 142,
      fileCount: 1,
      notebooks: 3,
      badge: 'Gold'
    },
    {
      id: '2',
      title: 'Ghana Economic Indicators 2010-2024',
      description: 'Quarterly economic indicators including GDP, inflation rates, and currency exchange rates.',
      author: 'Bank of Ghana',
      downloads: '8.3K',
      views: '32.1K',
      updatedDate: '2024-03-20',
      size: '45 MB',
      format: ['CSV', 'Excel'],
      tags: ['economics', 'gdp', 'inflation'],
      category: 'Finance',
      license: 'Public Domain',
      trending: true,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
      usability: 9.5,
      votes: 98,
      fileCount: 1,
      notebooks: 2,
      badge: 'Silver'
    },
    {
      id: '3',
      title: 'Machine Learning Algorithms Dataset',
      description: 'Comprehensive dataset for training and testing various machine learning algorithms.',
      author: 'AI Research Lab',
      downloads: '15.2K',
      views: '62.8K',
      updatedDate: '2024-03-10',
      size: '245 MB',
      format: ['CSV', 'JSON', 'Pickle'],
      tags: ['machine learning', 'algorithms', 'classification'],
      category: 'Computer Science',
      license: 'MIT',
      trending: true,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
      usability: 9.8,
      votes: 312,
      fileCount: 3,
      notebooks: 5,
      badge: 'Gold'
    },
    {
      id: '4',
      title: 'Neural Network Training Data',
      description: 'Large-scale dataset for training deep neural networks with labeled examples.',
      author: 'Deep Learning Institute',
      downloads: '22.5K',
      views: '89.3K',
      updatedDate: '2024-03-05',
      size: '1.2 GB',
      format: ['HDF5', 'NPY', 'CSV'],
      tags: ['neural networks', 'deep learning', 'training'],
      category: 'Computer Science',
      license: 'Apache 2.0',
      featured: true,
      image: 'https://images.unsplash.com/photo-1527477396000-e27137b2a20b?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 456,
      fileCount: 5,
      notebooks: 12,
      badge: 'Gold'
    },
    {
      id: '5',
      title: 'Natural Language Processing Corpus',
      description: 'Extensive text corpus for NLP tasks including sentiment analysis and text classification.',
      author: 'NLP Research Group',
      downloads: '18.7K',
      views: '74.1K',
      updatedDate: '2024-02-28',
      size: '567 MB',
      format: ['TXT', 'JSON', 'CSV'],
      tags: ['NLP', 'text processing', 'sentiment analysis'],
      category: 'NLP',
      license: 'CC BY 4.0',
      trending: true,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop',
      usability: 9.6,
      votes: 289,
      fileCount: 2,
      notebooks: 8,
      badge: 'Silver'
    },
    {
      id: '6',
      title: 'Computer Vision Image Dataset',
      description: 'Large collection of labeled images for computer vision tasks.',
      author: 'CV Lab',
      downloads: '31.4K',
      views: '125.6K',
      updatedDate: '2024-03-12',
      size: '3.5 GB',
      format: ['JPEG', 'PNG', 'Annotations'],
      tags: ['computer vision', 'images', 'object detection'],
      category: 'Computer Vision',
      license: 'MIT',
      featured: true,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 678,
      fileCount: 8,
      notebooks: 25,
      badge: 'Gold'
    },
    {
      id: '7',
      title: 'Pre-trained BERT Model Weights',
      description: 'Pre-trained BERT model weights and configurations for fine-tuning.',
      author: 'Transformer Research',
      downloads: '45.8K',
      views: '198.2K',
      updatedDate: '2024-03-01',
      size: '2.1 GB',
      format: ['PyTorch', 'TensorFlow', 'ONNX'],
      tags: ['BERT', 'transformer', 'pre-trained'],
      category: 'Pre-Trained Model',
      license: 'Apache 2.0',
      trending: true,
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 892,
      fileCount: 3,
      notebooks: 18,
      badge: 'Gold'
    },
    {
      id: '8',
      title: 'Ghana Healthcare Facilities Database',
      description: 'Complete database of all healthcare facilities in Ghana.',
      author: 'Ministry of Health',
      downloads: '15.7K',
      views: '58.9K',
      updatedDate: '2024-02-10',
      size: '89 MB',
      format: ['CSV', 'JSON', 'GeoJSON'],
      tags: ['healthcare', 'hospitals', 'medical'],
      category: 'Health',
      license: 'Open Data',
      featured: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 201,
      fileCount: 1,
      notebooks: 4,
      badge: 'Silver'
    },
    {
      id: '9',
      title: 'Ghana Business Registry 2024',
      description: 'Comprehensive registry of registered businesses in Ghana.',
      author: 'Registrar General\'s Department',
      downloads: '7.9K',
      views: '25.7K',
      updatedDate: '2024-02-28',
      size: '234 MB',
      format: ['CSV', 'Excel'],
      tags: ['business', 'companies', 'registry'],
      category: 'Business',
      license: 'Public Domain',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop',
      usability: 8.5,
      votes: 67,
      fileCount: 1,
      notebooks: 2,
      badge: 'Bronze'
    }
  ];

  const getCategoryTitle = () => {
    if (!category) return 'Datasets';
    
    // Handle special cases
    if (category === 'trending') return 'Trending Datasets';
    if (category === 'llm') return 'LLM Fine-Tuning';
    
    // Convert slug to title (e.g., 'computer-science' -> 'Computer Science')
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryIcon = () => {
    if (category === 'trending') return <TrendingUp size={24} />;
    if (category === 'llm') return <Settings size={24} />;
    return <Database size={24} />;
  };

  const filteredDatasets = useMemo(() => {
    let filtered = allDatasets;
    
    if (!category) {
      return filtered;
    }
    
    if (category === 'trending') {
      filtered = allDatasets.filter(d => d.trending);
    } else if (category === 'llm') {
      filtered = allDatasets.filter(d => 
        d.category === 'Computer Science' || 
        d.category === 'NLP' || 
        d.category === 'Pre-Trained Model' ||
        d.category === 'Computer Vision'
      );
    } else {
      // Convert slug back to category name (e.g., 'computer-science' -> 'Computer Science')
      const categoryName = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Filter by exact category match
      filtered = allDatasets.filter(d => d.category === categoryName);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.author.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort logic
    if (sortBy === 'Most Downloaded') {
      filtered.sort((a, b) => {
        const aNum = parseFloat(a.downloads.replace('K', '000').replace('.', ''));
        const bNum = parseFloat(b.downloads.replace('K', '000').replace('.', ''));
        return bNum - aNum;
      });
    } else if (sortBy === 'Most Recent') {
      filtered.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
    } else if (sortBy === 'Most Upvoted') {
      filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }

    return filtered;
  }, [category, sortBy, searchQuery]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return '1 day ago';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };


  const isolatedStyles = `
    .dataset-category-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .dataset-category-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .dataset-category-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dataset-category-search {
      margin-bottom: 2rem;
      position: relative;
    }

    .dataset-category-search-wrapper {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .dataset-category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .dataset-category-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .dataset-category-title h1 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-category-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .dataset-sort-dropdown {
      position: relative;
    }

    .dataset-sort-select {
      appearance: none;
      padding: 0.5rem 2rem 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
      color: #1f2937;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-sort-select:focus {
      outline: none;
      border-color: #0ea5e9;
    }

    .dataset-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .dataset-view-button {
      padding: 0.5rem;
      border: none;
      background: white;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dataset-view-button.active {
      background: #f3f4f6;
    }

    .dataset-view-button:hover {
      background: #f9fafb;
    }

    .dataset-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .dataset-list-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
      transition: all 0.2s;
      cursor: pointer;
    }

    .dataset-list-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .dataset-thumbnail {
      width: 100px;
      height: 65px;
      border-radius: 0.375rem;
      overflow: hidden;
      flex-shrink: 0;
      background: #f3f4f6;
    }

    .dataset-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dataset-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .dataset-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.3;
    }

    .dataset-meta-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-author {
      font-weight: 500;
    }

    .dataset-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-stat-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .dataset-votes {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    .dataset-vote-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      color: #6b7280;
      transition: color 0.2s;
    }

    .dataset-vote-button:hover {
      color: #0ea5e9;
    }

    .dataset-vote-count {
      font-size: 0.75rem;
      font-weight: 500;
      color: #1f2937;
    }

    .dataset-menu-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      color: #6b7280;
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
    }

    .dataset-menu-button:hover {
      color: #1f2937;
      background: #f3f4f6;
    }

    .dataset-menu-button.active {
      color: #0ea5e9;
      background: #f0f9ff;
    }

    .dataset-menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      z-index: 1000;
      overflow: hidden;
      padding: 0.25rem 0;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dataset-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      color: #1f2937;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: background 0.2s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .dataset-menu-item:hover {
      background: #f3f4f6;
    }

    .dataset-menu-item svg {
      width: 18px;
      height: 18px;
      color: #1f2937;
      flex-shrink: 0;
    }

    .dataset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .dataset-grid-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: visible;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .dataset-grid-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .dataset-grid-thumbnail {
      width: 100%;
      height: 160px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .dataset-grid-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dataset-grid-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .dataset-grid-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      line-height: 1.4;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .dataset-grid-author {
      font-size: 0.8125rem;
      color: #6b7280;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-grid-info {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-grid-file-info {
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-grid-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .dataset-grid-votes {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    .dataset-grid-vote-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      color: #6b7280;
      transition: color 0.2s;
    }

    .dataset-grid-vote-button:hover {
      color: #0ea5e9;
    }

    .dataset-grid-vote-count {
      font-size: 0.75rem;
      font-weight: 500;
      color: #1f2937;
    }

    .dataset-grid-profile-icons {
      display: flex;
      gap: -0.5rem;
    }

    .dataset-grid-profile-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #cbd5e1;
      border: 2px solid white;
      margin-left: -0.5rem;
    }

    .dataset-grid-profile-icon:first-child {
      margin-left: 0;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .dataset-category-content-wrapper {
        padding-top: 60px;
      }

      .dataset-category-content {
        padding: 1rem;
      }

      .dataset-category-search-wrapper {
        max-width: 100%;
      }

      .dataset-category-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .dataset-list-item {
        flex-direction: column;
      }

      .dataset-thumbnail {
        width: 100%;
        height: 200px;
      }

      .dataset-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .dataset-category-content-wrapper {
        padding-top: 70px;
      }

      .dataset-category-content {
        padding: 1.5rem;
      }

      .dataset-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .dataset-category-content-wrapper {
        padding-top: 120px;
      }

      .dataset-category-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .dataset-category-content-wrapper {
        padding-top: 120px;
      }

      .dataset-category-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.dataset-menu-button') && !(event.target as Element).closest('.dataset-menu-dropdown')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  return (
    <div className="dataset-category-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="dataset-category-content-wrapper">
        <div className="dataset-category-content">
          <div className="dataset-category-search">
            <div className="dataset-category-search-wrapper" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <motion.div
                layoutId="search-input-container"
                transition={{
                  layout: {
                    duration: 0.5,
                    type: 'spring',
                    bounce: 0.2
                  }
                }}
                style={{
                  borderRadius: '30px'
                }}
                className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-lg overflow-visible border bg-neutral-100"
              >
                <div className="flex items-center w-full justify-start gap-2 px-4 h-12">
                  <motion.div layoutId="search-icon">
                    <Search className="size-5 stroke-[1.4]" />
                  </motion.div>
                  <div className="flex-1 relative">
                    {!searchQuery && (
                      <motion.div
                        layout
                        className="absolute text-gray-500 flex items-center pointer-events-none z-10"
                      >
                        <AnimatePresence mode="popLayout">
                          <motion.p
                            layoutId={`placeholder-search`}
                            key={`placeholder-search`}
                            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="text-base"
                          >
                            Search dataset
                          </motion.p>
                        </AnimatePresence>
                      </motion.div>
                    )}

                    <motion.input
                      layout="position"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent outline-none ring-none text-black text-base"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="dataset-category-header">
            <div className="dataset-category-title">
              {getCategoryIcon()}
              <h1>{getCategoryTitle()}</h1>
            </div>
          
          <div className="dataset-category-controls">
            <div className="dataset-sort-dropdown">
              <select
                className="dataset-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Relevance">Relevance</option>
                <option value="Most Downloaded">Most Downloaded</option>
                <option value="Most Recent">Most Recent</option>
                <option value="Most Upvoted">Most Upvoted</option>
              </select>
            </div>
            
            <div className="dataset-view-toggle">
              <button
                className={`dataset-view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
              <button
                className={`dataset-view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
            </div>
          </div>
          </div>

        {viewMode === 'list' ? (
          <div className="dataset-list">
            {filteredDatasets.map((dataset) => (
              <div key={dataset.id} className="dataset-list-item">
                <div className="dataset-thumbnail">
                  <img src={dataset.image || 'https://via.placeholder.com/120x80'} alt={dataset.title} />
                </div>
                
                <div className="dataset-content">
                  <h3 className="dataset-title">{dataset.title}</h3>
                  
                  <div className="dataset-meta-row">
                    <span className="dataset-author">{dataset.author}</span>
                    <span>•</span>
                    <span>Updated {formatTimeAgo(dataset.updatedDate)}</span>
                  </div>
                  
                  <div className="dataset-stats">
                    <span>{dataset.fileCount || 1} File ({dataset.format[0]}) • {dataset.size}</span>
                    <span>•</span>
                    <span>{dataset.downloads} downloads</span>
                    {dataset.notebooks && (
                      <>
                        <span>•</span>
                        <span>{dataset.notebooks} notebooks</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="dataset-votes">
                    <button className="dataset-vote-button">
                      <ThumbsUp size={16} />
                    </button>
                    <span className="dataset-vote-count">{dataset.votes || 0}</span>
                    <button className="dataset-vote-button">
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <button 
                      className={`dataset-menu-button ${openMenuId === dataset.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === dataset.id ? null : dataset.id);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === dataset.id && (
                      <div className="dataset-menu-dropdown">
                        <button 
                          className="dataset-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle add to collection
                            setOpenMenuId(null);
                          }}
                        >
                          <FolderPlus size={18} />
                          <span>Add to Collection</span>
                        </button>
                        <button 
                          className="dataset-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle bookmark
                            setOpenMenuId(null);
                          }}
                        >
                          <Bookmark size={18} />
                          <span>Bookmark</span>
                        </button>
                        <button 
                          className="dataset-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle download
                            setOpenMenuId(null);
                          }}
                        >
                          <Download size={18} />
                          <span>Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dataset-grid">
            {filteredDatasets.map((dataset) => (
              <div key={dataset.id} className="dataset-grid-card">
                <div className="dataset-grid-thumbnail">
                  <img src={dataset.image || 'https://via.placeholder.com/280x160'} alt={dataset.title} />
                </div>
                
                <div className="dataset-grid-content">
                  <h3 className="dataset-grid-title">{dataset.title}</h3>
                  <p className="dataset-grid-author">{dataset.author}</p>
                  
                  <div className="dataset-grid-info">
                    <span className="dataset-updated">Updated {formatTimeAgo(dataset.updatedDate)}</span>
                  </div>
                  
                  <div className="dataset-grid-file-info">
                    {dataset.fileCount || 1} File ({dataset.format[0]}) • {dataset.size} • {dataset.downloads} downloads
                  </div>
                  
                  {dataset.notebooks && (
                    <div className="dataset-grid-file-info">
                      {dataset.notebooks} notebooks
                    </div>
                  )}
                  
                  <div className="dataset-grid-footer">
                    <div className="dataset-grid-votes">
                      <button className="dataset-grid-vote-button">
                        <ThumbsUp size={14} />
                      </button>
                      <span className="dataset-grid-vote-count">{dataset.votes || 0}</span>
                      <button className="dataset-grid-vote-button">
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                    <button 
                      className={`dataset-menu-button ${openMenuId === dataset.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === dataset.id ? null : dataset.id);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                      {openMenuId === dataset.id && (
                        <div className="dataset-menu-dropdown">
                          <button 
                            className="dataset-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle add to collection
                              setOpenMenuId(null);
                            }}
                          >
                            <FolderPlus size={18} />
                            <span>Add to Collection</span>
                          </button>
                          <button 
                            className="dataset-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle bookmark
                              setOpenMenuId(null);
                            }}
                          >
                            <Bookmark size={18} />
                            <span>Bookmark</span>
                          </button>
                          <button 
                            className="dataset-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle download
                              setOpenMenuId(null);
                            }}
                          >
                            <Download size={18} />
                            <span>Download</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DatasetCategory;

