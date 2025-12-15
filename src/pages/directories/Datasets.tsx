import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Download, Eye, Calendar, User, Tag, TrendingUp, Star, Database, Search, ChevronRight, ArrowUp, Settings, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
}

const Datasets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSearchResult, setHoveredSearchResult] = useState<number | null>(null);

  const categories = [
    'Business',
    'Health',
    'Education',
    'Government',
    'Science',
    'Finance',
    'Technology',
    'Social',
    'Environment',
    'Computer Science',
    'Classification',
    'Computer Vision',
    'NLP',
    'Data Visualization',
    'Pre-Trained Model'
  ];

  // Mock dataset data - replace with actual API data
  const datasets: Dataset[] = [
    {
      id: '1',
      title: 'Ghana Population Census Data 2021',
      description: 'Comprehensive population census data for all regions and districts in Ghana, including demographics, age distribution, and household information.',
      author: 'Ghana Statistical Service',
      downloads: '12.5K',
      views: '45.2K',
      updatedDate: '2024-01-15',
      size: '125 MB',
      format: ['CSV', 'JSON', 'Excel'],
      tags: ['census', 'population', 'demographics', 'ghana'],
      category: 'Government',
      license: 'Open Data',
      featured: true,
      trending: true,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 142,
      fileCount: 1
    },
    {
      id: '2',
      title: 'Ghana Economic Indicators 2010-2024',
      description: 'Quarterly economic indicators including GDP, inflation rates, unemployment, trade balance, and currency exchange rates for Ghana.',
      author: 'Bank of Ghana',
      downloads: '8.3K',
      views: '32.1K',
      updatedDate: '2024-03-20',
      size: '45 MB',
      format: ['CSV', 'Excel'],
      tags: ['economics', 'gdp', 'inflation', 'finance'],
      category: 'Finance',
      license: 'Public Domain',
      trending: true,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
      usability: 9.5,
      votes: 98,
      fileCount: 1
    },
    {
      id: '3',
      title: 'Ghana Healthcare Facilities Database',
      description: 'Complete database of all healthcare facilities in Ghana including hospitals, clinics, pharmacies, and CHPS compounds with locations and services.',
      author: 'Ministry of Health',
      downloads: '15.7K',
      views: '58.9K',
      updatedDate: '2024-02-10',
      size: '89 MB',
      format: ['CSV', 'JSON', 'GeoJSON'],
      tags: ['healthcare', 'hospitals', 'medical', 'ghana'],
      category: 'Health',
      license: 'Open Data',
      featured: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 201,
      fileCount: 1
    },
    {
      id: '4',
      title: 'Ghana Education Statistics 2015-2024',
      description: 'Educational statistics including enrollment rates, school infrastructure, teacher-student ratios, and examination results across all levels.',
      author: 'Ministry of Education',
      downloads: '9.2K',
      views: '28.4K',
      updatedDate: '2024-01-30',
      size: '67 MB',
      format: ['CSV', 'Excel'],
      tags: ['education', 'schools', 'students', 'statistics'],
      category: 'Education',
      license: 'Open Data',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
      usability: 8.8,
      votes: 76,
      fileCount: 1
    },
    {
      id: '5',
      title: 'Ghana Agricultural Production Data',
      description: 'Annual agricultural production data including crop yields, livestock numbers, and farming practices across all regions of Ghana.',
      author: 'Ministry of Food and Agriculture',
      downloads: '6.8K',
      views: '21.3K',
      updatedDate: '2023-12-15',
      size: '52 MB',
      format: ['CSV', 'Excel'],
      tags: ['agriculture', 'farming', 'crops', 'production'],
      category: 'Business',
      license: 'Open Data',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop',
      usability: 9.2,
      votes: 54,
      fileCount: 1
    },
    {
      id: '6',
      title: 'Ghana Climate Data 1980-2024',
      description: 'Historical climate data including temperature, rainfall, humidity, and weather patterns for major cities and regions in Ghana.',
      author: 'Ghana Meteorological Agency',
      downloads: '11.4K',
      views: '39.6K',
      updatedDate: '2024-03-01',
      size: '156 MB',
      format: ['CSV', 'JSON'],
      tags: ['climate', 'weather', 'temperature', 'rainfall'],
      category: 'Environment',
      license: 'Open Data',
      trending: true,
      image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=300&h=200&fit=crop',
      usability: 9.7,
      votes: 123,
      fileCount: 1
    },
    {
      id: '7',
      title: 'Ghana Business Registry 2024',
      description: 'Comprehensive registry of registered businesses in Ghana including company names, sectors, locations, and registration dates.',
      author: 'Registrar General\'s Department',
      downloads: '7.9K',
      views: '25.7K',
      updatedDate: '2024-02-28',
      size: '234 MB',
      format: ['CSV', 'Excel'],
      tags: ['business', 'companies', 'registry', 'commerce'],
      category: 'Business',
      license: 'Public Domain',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop',
      usability: 8.5,
      votes: 67,
      fileCount: 1
    },
    {
      id: '8',
      title: 'Ghana Internet and Mobile Penetration',
      description: 'Data on internet usage, mobile phone penetration, and digital connectivity across Ghana by region and demographic groups.',
      author: 'National Communications Authority',
      downloads: '5.6K',
      views: '18.9K',
      updatedDate: '2024-01-20',
      size: '34 MB',
      format: ['CSV', 'JSON'],
      tags: ['technology', 'internet', 'mobile', 'connectivity'],
      category: 'Technology',
      license: 'Open Data',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
      usability: 9.0,
      votes: 89,
      fileCount: 1
    },
    {
      id: '9',
      title: 'Ghana Social Media Usage Statistics',
      description: 'Social media platform usage statistics, user demographics, and engagement metrics for major platforms in Ghana.',
      author: 'Research Institute',
      downloads: '4.2K',
      views: '14.5K',
      updatedDate: '2023-11-30',
      size: '28 MB',
      format: ['CSV', 'Excel'],
      tags: ['social media', 'technology', 'demographics', 'engagement'],
      category: 'Social',
      license: 'CC BY 4.0',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
      usability: 8.2,
      votes: 45,
      fileCount: 1
    },
    {
      id: '10',
      title: 'Ghana Road Network and Infrastructure',
      description: 'Complete dataset of road networks, infrastructure projects, and transportation facilities across Ghana with geographic coordinates.',
      author: 'Ministry of Roads and Highways',
      downloads: '10.1K',
      views: '36.8K',
      updatedDate: '2024-02-15',
      size: '178 MB',
      format: ['CSV', 'GeoJSON', 'Shapefile'],
      tags: ['infrastructure', 'roads', 'transportation', 'geography'],
      category: 'Government',
      license: 'Open Data',
      featured: true,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop',
      usability: 9.8,
      votes: 156,
      fileCount: 2
    },
    {
      id: '11',
      title: 'Ghana Energy Consumption Data',
      description: 'Energy consumption patterns, electricity generation, and renewable energy statistics for Ghana from 2010 to 2024.',
      author: 'Energy Commission',
      downloads: '6.3K',
      views: '22.4K',
      updatedDate: '2024-01-25',
      size: '41 MB',
      format: ['CSV', 'Excel'],
      tags: ['energy', 'electricity', 'renewable', 'consumption'],
      category: 'Environment',
      license: 'Open Data',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop',
      usability: 8.9,
      votes: 72,
      fileCount: 1
    },
    {
      id: '12',
      title: 'Ghana Tourism Statistics',
      description: 'Tourism data including visitor numbers, popular destinations, hotel occupancy rates, and tourism revenue by region.',
      author: 'Ghana Tourism Authority',
      downloads: '8.7K',
      views: '31.2K',
      updatedDate: '2024-02-05',
      size: '59 MB',
      format: ['CSV', 'Excel'],
      tags: ['tourism', 'travel', 'visitors', 'destinations'],
      category: 'Business',
      license: 'Open Data',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop',
      usability: 9.3,
      votes: 94,
      fileCount: 1
    },
    {
      id: '13',
      title: 'Machine Learning Algorithms Dataset',
      description: 'Comprehensive dataset for training and testing various machine learning algorithms including classification, regression, and clustering models.',
      author: 'AI Research Lab',
      downloads: '15.2K',
      views: '62.8K',
      updatedDate: '2024-03-10',
      size: '245 MB',
      format: ['CSV', 'JSON', 'Pickle'],
      tags: ['machine learning', 'algorithms', 'classification', 'regression'],
      category: 'Computer Science',
      license: 'MIT',
      trending: true,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop',
      usability: 9.8,
      votes: 312,
      fileCount: 3
    },
    {
      id: '14',
      title: 'Neural Network Training Data',
      description: 'Large-scale dataset for training deep neural networks with labeled examples across multiple domains.',
      author: 'Deep Learning Institute',
      downloads: '22.5K',
      views: '89.3K',
      updatedDate: '2024-03-05',
      size: '1.2 GB',
      format: ['HDF5', 'NPY', 'CSV'],
      tags: ['neural networks', 'deep learning', 'training', 'AI'],
      category: 'Computer Science',
      license: 'Apache 2.0',
      featured: true,
      image: 'https://images.unsplash.com/photo-1527477396000-e27137b2a20b?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 456,
      fileCount: 5
    },
    {
      id: '15',
      title: 'Natural Language Processing Corpus',
      description: 'Extensive text corpus for NLP tasks including sentiment analysis, named entity recognition, and text classification.',
      author: 'NLP Research Group',
      downloads: '18.7K',
      views: '74.1K',
      updatedDate: '2024-02-28',
      size: '567 MB',
      format: ['TXT', 'JSON', 'CSV'],
      tags: ['NLP', 'text processing', 'sentiment analysis', 'corpus'],
      category: 'NLP',
      license: 'CC BY 4.0',
      trending: true,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop',
      usability: 9.6,
      votes: 289,
      fileCount: 2
    },
    {
      id: '16',
      title: 'Computer Vision Image Dataset',
      description: 'Large collection of labeled images for computer vision tasks including object detection, image classification, and segmentation.',
      author: 'CV Lab',
      downloads: '31.4K',
      views: '125.6K',
      updatedDate: '2024-03-12',
      size: '3.5 GB',
      format: ['JPEG', 'PNG', 'Annotations'],
      tags: ['computer vision', 'images', 'object detection', 'classification'],
      category: 'Computer Vision',
      license: 'MIT',
      featured: true,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 678,
      fileCount: 8
    },
    {
      id: '17',
      title: 'Pre-trained BERT Model Weights',
      description: 'Pre-trained BERT model weights and configurations for fine-tuning on downstream NLP tasks.',
      author: 'Transformer Research',
      downloads: '45.8K',
      views: '198.2K',
      updatedDate: '2024-03-01',
      size: '2.1 GB',
      format: ['PyTorch', 'TensorFlow', 'ONNX'],
      tags: ['BERT', 'transformer', 'pre-trained', 'NLP'],
      category: 'Pre-Trained Model',
      license: 'Apache 2.0',
      trending: true,
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=200&fit=crop',
      usability: 10.0,
      votes: 892,
      fileCount: 3
    },
    {
      id: '18',
      title: 'Data Visualization Templates',
      description: 'Collection of data visualization templates and examples for creating interactive charts and dashboards.',
      author: 'Viz Studio',
      downloads: '12.3K',
      views: '48.7K',
      updatedDate: '2024-02-20',
      size: '89 MB',
      format: ['JSON', 'SVG', 'HTML'],
      tags: ['visualization', 'charts', 'dashboards', 'interactive'],
      category: 'Data Visualization',
      license: 'MIT',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      usability: 9.1,
      votes: 156,
      fileCount: 12
    },
    {
      id: '19',
      title: 'Classification Benchmark Dataset',
      description: 'Standard benchmark dataset for evaluating classification algorithms with multiple classes and features.',
      author: 'ML Benchmark',
      downloads: '19.6K',
      views: '78.4K',
      updatedDate: '2024-03-08',
      size: '156 MB',
      format: ['CSV', 'ARFF'],
      tags: ['classification', 'benchmark', 'evaluation', 'ML'],
      category: 'Classification',
      license: 'Public Domain',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop',
      usability: 9.4,
      votes: 234,
      fileCount: 1
    },
    {
      id: '20',
      title: 'Algorithm Performance Benchmark',
      description: 'Comprehensive benchmark dataset for comparing performance of various algorithms across different problem domains.',
      author: 'CS Research Lab',
      downloads: '14.3K',
      views: '56.2K',
      updatedDate: '2024-03-15',
      size: '198 MB',
      format: ['CSV', 'JSON'],
      tags: ['algorithms', 'benchmark', 'performance', 'computer science'],
      category: 'Computer Science',
      license: 'MIT',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop',
      usability: 9.5,
      votes: 187,
      fileCount: 2
    },
    {
      id: '21',
      title: 'Data Structures Implementation Dataset',
      description: 'Dataset containing implementations and test cases for various data structures including trees, graphs, and hash tables.',
      author: 'CS Department',
      downloads: '11.8K',
      views: '44.7K',
      updatedDate: '2024-03-12',
      size: '87 MB',
      format: ['CSV', 'Code'],
      tags: ['data structures', 'algorithms', 'implementation', 'CS'],
      category: 'Computer Science',
      license: 'MIT',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      usability: 9.3,
      votes: 145,
      fileCount: 4
    }
  ];

  const filteredDatasets = useMemo(() => {
    let filtered = datasets.filter(dataset => {
      const matchesSearch = 
        dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dataset.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });

    // Sort datasets by trending (default)
    filtered = filtered.sort((a, b) => {
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return parseInt(b.downloads.replace('K', '000').replace('.', '')) - parseInt(a.downloads.replace('K', '000').replace('.', ''));
    });

    return filtered;
  }, [searchQuery]);

  // Group datasets by category for sections
  const trendingDatasets = datasets.filter(d => d.trending).slice(0, 4);
  const llmDatasets = datasets.filter(d => d.category === 'Computer Science' || d.category === 'NLP' || d.category === 'Pre-Trained Model' || d.category === 'Computer Vision' || d.category === 'Classification').slice(0, 4);
  const businessDatasets = datasets.filter(d => d.category === 'Business').slice(0, 4);
  const computerScienceDatasets = datasets.filter(d => d.category === 'Computer Science').slice(0, 4);

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

  // Convert datasets to search results format for Apple Spotlight
  const spotlightSearchResults = useMemo(() => {
    return filteredDatasets.slice(0, 10).map(dataset => ({
      icon: <Database />,
      label: dataset.title,
      description: `${dataset.author} • ${dataset.downloads} downloads • ${dataset.category}`,
      link: `#dataset-${dataset.id}`
    }));
  }, [filteredDatasets]);

  const handleResultClick = (datasetId: string) => {
    const element = document.getElementById(`dataset-${datasetId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isolatedStyles = `
    .datasets-page {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .datasets-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .datasets-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .datasets-breadcrumbs {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .datasets-breadcrumbs a {
      color: #1f2937;
      text-decoration: none;
    }

    .datasets-breadcrumbs a:hover {
      color: #0ea5e9;
      text-decoration: underline;
    }

    .datasets-header {
      margin-bottom: 2rem;
    }

    .datasets-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .datasets-subtitle {
      font-size: 1.125rem;
      color: #4b5563;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .datasets-controls {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .datasets-search-section {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

     .datasets-search-wrapper {
       position: relative;
       flex: 1;
       max-width: 400px;
     }

    .datasets-search-trigger {
      border: none;
      background: transparent;
      padding: 0;
    }

    .datasets-search-trigger:hover > div {
      border-color: #0ea5e9;
    }

    .datasets-filters-section {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .datasets-category-filters {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .datasets-category-button {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      color: #1f2937;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .datasets-category-button:hover {
      border-color: #0ea5e9;
      background: #f0f9ff;
      color: #0ea5e9;
    }



    .datasets-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .datasets-stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .datasets-stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .datasets-stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-section {
      margin-bottom: 3rem;
    }

    .dataset-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .dataset-section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .dataset-section-title h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-section-title svg {
      color: #1f2937;
    }

    .dataset-section-see-all {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #0ea5e9;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: color 0.2s ease;
    }

    .dataset-section-see-all:hover {
      color: #0284c7;
    }

    .dataset-cards-scroll {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }

    .dataset-cards-scroll::-webkit-scrollbar {
      height: 6px;
    }

    .dataset-cards-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .dataset-cards-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .dataset-cards-scroll::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .dataset-card-compact {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      width: 280px;
      flex-shrink: 0;
      overflow: hidden;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .dataset-card-compact:hover {
      border-color: #0ea5e9;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
      transform: translateY(-2px);
    }

    .dataset-card-image {
      width: 100%;
      height: 160px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .dataset-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dataset-card-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .dataset-card-title-compact {
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

    .dataset-card-author {
      font-size: 0.8125rem;
      color: #6b7280;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-card-info {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-usability {
      font-weight: 500;
    }

    .dataset-updated {
      color: #9ca3af;
    }

    .dataset-card-file-info {
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-card-footer-compact {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid #e5e7eb;
    }

    .dataset-vote-button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.75rem;
      background: #f3f4f6;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #1f2937;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .dataset-vote-button:hover {
      background: #e5e7eb;
    }

    .dataset-profile-icons {
      display: flex;
      gap: -0.5rem;
    }

    .dataset-profile-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #cbd5e1;
      border: 2px solid white;
      margin-left: -0.5rem;
    }

    .dataset-profile-icon:first-child {
      margin-left: 0;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .datasets-content-wrapper {
        padding-top: 60px;
      }

      .datasets-main-content {
        padding: 1rem;
      }

      .datasets-title {
        font-size: 2rem;
      }

      .datasets-subtitle {
        font-size: 1rem;
      }

      .datasets-search-wrapper {
        max-width: 100%;
      }

      .datasets-grid {
        grid-template-columns: 1fr;
      }

      .datasets-stats {
        flex-direction: column;
        gap: 1rem;
      }

    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .datasets-content-wrapper {
        padding-top: 70px;
      }

      .datasets-main-content {
        padding: 1.5rem;
      }

      .datasets-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .datasets-content-wrapper {
        padding-top: 120px;
      }

      .datasets-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .datasets-content-wrapper {
        padding-top: 120px;
      }

      .datasets-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  return (
    <div className="datasets-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="datasets-content-wrapper">
        <div className="datasets-main-content">
          <div className="datasets-breadcrumbs">
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>

          <div className="datasets-header">
            <h1 className="datasets-title">Datasets</h1>
            <p className="datasets-subtitle">
              Discover and download high-quality datasets for research, analysis, and machine learning projects.
            </p>
          </div>

          <div className="datasets-stats">
            <div className="datasets-stat-item">
              <div className="datasets-stat-value">{datasets.length}</div>
              <div className="datasets-stat-label">Total Datasets</div>
            </div>
            <div className="datasets-stat-item">
              <div className="datasets-stat-value">
                {datasets.reduce((sum, d) => sum + parseInt(d.downloads.replace('K', '000').replace('.', '')), 0).toLocaleString()}
              </div>
              <div className="datasets-stat-label">Total Downloads</div>
            </div>
            <div className="datasets-stat-item">
              <div className="datasets-stat-value">
                {datasets.reduce((sum, d) => sum + parseInt(d.views.replace('K', '000').replace('.', '')), 0).toLocaleString()}
              </div>
              <div className="datasets-stat-label">Total Views</div>
            </div>
          </div>

          <div className="datasets-controls">
             <div className="datasets-search-section">
               <div className="datasets-search-wrapper" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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

                   {searchQuery && spotlightSearchResults.length > 0 && (
                     <motion.div
                       layout
                       onMouseLeave={() => setHoveredSearchResult(null)}
                       className="absolute top-full left-0 right-0 mt-1 px-2 border-t flex flex-col bg-neutral-100 max-h-96 overflow-y-auto w-full py-2 rounded-b-3xl shadow-lg z-50"
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       transition={{ duration: 0.2 }}
                     >
                       {spotlightSearchResults.map((result, index) => {
                         const datasetId = result.link.replace('#dataset-', '');
                         return (
                           <motion.div
                             key={`search-result-${index}`}
                             onMouseEnter={() => setHoveredSearchResult(index)}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             transition={{
                               delay: index * 0.1,
                               duration: 0.2,
                               ease: 'easeOut'
                             }}
                           >
                             <a
                               href={result.link}
                               onClick={(e) => {
                                 e.preventDefault();
                                 handleResultClick(datasetId);
                               }}
                               className="overflow-hidden w-full group/card"
                             >
                               <div
                                 className={cn(
                                   'flex items-center text-black justify-start hover:bg-white gap-3 py-2 px-2 rounded-xl hover:shadow-md w-full',
                                   index === spotlightSearchResults.length - 1 && 'rounded-b-3xl'
                                 )}
                               >
                                 <div className="size-8 [&_svg]:stroke-[1.5] [&_svg]:size-6 aspect-square flex items-center justify-center">
                                   {result.icon}
                                 </div>
                                 <div className="flex flex-col">
                                   <p className="font-medium">{result.label}</p>
                                   <p className="text-xs opacity-50">{result.description}</p>
                                 </div>
                                 <div className="flex-1 flex items-center justify-end opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                                   <ChevronRight className="size-6" />
                                 </div>
                               </div>
                             </a>
                           </motion.div>
                         );
                       })}
                     </motion.div>
                   )}
                 </motion.div>
               </div>
             </div>

            <div className="datasets-filters-section">
              <div className="datasets-category-filters">
                {categories.map(category => {
                  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={category}
                      to={`/directories/datasets/${categorySlug}`}
                      className="datasets-category-button"
                    >
                      {category}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trending Datasets Section */}
          {trendingDatasets.length > 0 && (
            <div className="dataset-section">
              <div className="dataset-section-header">
                <div className="dataset-section-title">
                  <TrendingUp size={20} />
                  <h2>Trending Datasets</h2>
                </div>
                <Link to="/directories/datasets/trending" className="dataset-section-see-all">
                  See All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="dataset-cards-scroll">
                {trendingDatasets.map((dataset) => (
                  <div key={dataset.id} className="dataset-card-compact">
                    <div className="dataset-card-image">
                      <img src={dataset.image || 'https://via.placeholder.com/280x160'} alt={dataset.title} />
                    </div>
                    <div className="dataset-card-content">
                      <h3 className="dataset-card-title-compact">{dataset.title}</h3>
                      <p className="dataset-card-author">{dataset.author}</p>
                      <div className="dataset-card-info">
                        <span className="dataset-usability">Usability {dataset.usability || 10.0}</span>
                        <span className="dataset-updated">Updated {formatTimeAgo(dataset.updatedDate)}</span>
                      </div>
                      <div className="dataset-card-file-info">
                        {dataset.fileCount || 1} File ({dataset.format[0]}) • {dataset.size} • {dataset.downloads} downloads
                      </div>
                      <div className="dataset-card-footer-compact">
                        <button className="dataset-vote-button">
                          <ArrowUp size={14} />
                          {dataset.votes || 0}
                        </button>
                        <div className="dataset-profile-icons">
                          <div className="dataset-profile-icon"></div>
                          <div className="dataset-profile-icon"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM Fine-Tuning Section */}
          {llmDatasets.length > 0 && (
            <div className="dataset-section">
              <div className="dataset-section-header">
                <div className="dataset-section-title">
                  <Settings size={20} />
                  <h2>LLM Fine-Tuning</h2>
                </div>
                <Link to="/directories/datasets/trending" className="dataset-section-see-all">
                  See All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="dataset-cards-scroll">
                {llmDatasets.map((dataset) => (
                  <div key={dataset.id} className="dataset-card-compact">
                    <div className="dataset-card-image">
                      <img src={dataset.image || 'https://via.placeholder.com/280x160'} alt={dataset.title} />
                    </div>
                    <div className="dataset-card-content">
                      <h3 className="dataset-card-title-compact">{dataset.title}</h3>
                      <p className="dataset-card-author">{dataset.author}</p>
                      <div className="dataset-card-info">
                        <span className="dataset-usability">Usability {dataset.usability || 10.0}</span>
                        <span className="dataset-updated">Updated {formatTimeAgo(dataset.updatedDate)}</span>
                      </div>
                      <div className="dataset-card-file-info">
                        {dataset.fileCount || 1} File ({dataset.format[0]}) • {dataset.size} • {dataset.downloads} downloads
                      </div>
                      <div className="dataset-card-footer-compact">
                        <button className="dataset-vote-button">
                          <ArrowUp size={14} />
                          {dataset.votes || 0}
                        </button>
                        <div className="dataset-profile-icons">
                          <div className="dataset-profile-icon"></div>
                          <div className="dataset-profile-icon"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Section */}
          {businessDatasets.length > 0 && (
            <div className="dataset-section">
              <div className="dataset-section-header">
                <div className="dataset-section-title">
                  <Database size={20} />
                  <h2>Business</h2>
                </div>
                <Link to="/directories/datasets/business" className="dataset-section-see-all">
                  See All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="dataset-cards-scroll">
                {businessDatasets.map((dataset) => (
                  <div key={dataset.id} className="dataset-card-compact">
                    <div className="dataset-card-image">
                      <img src={dataset.image || 'https://via.placeholder.com/280x160'} alt={dataset.title} />
                    </div>
                    <div className="dataset-card-content">
                      <h3 className="dataset-card-title-compact">{dataset.title}</h3>
                      <p className="dataset-card-author">{dataset.author}</p>
                      <div className="dataset-card-info">
                        <span className="dataset-usability">Usability {dataset.usability || 10.0}</span>
                        <span className="dataset-updated">Updated {formatTimeAgo(dataset.updatedDate)}</span>
                      </div>
                      <div className="dataset-card-file-info">
                        {dataset.fileCount || 1} File ({dataset.format[0]}) • {dataset.size} • {dataset.downloads} downloads
                      </div>
                      <div className="dataset-card-footer-compact">
                        <button className="dataset-vote-button">
                          <ArrowUp size={14} />
                          {dataset.votes || 0}
                        </button>
                        <div className="dataset-profile-icons">
                          <div className="dataset-profile-icon"></div>
                          <div className="dataset-profile-icon"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Computer Science Section */}
          {computerScienceDatasets.length > 0 && (
            <div className="dataset-section">
              <div className="dataset-section-header">
                <div className="dataset-section-title">
                  <Database size={20} />
                  <h2>Computer Science</h2>
                </div>
                <Link to="/directories/datasets/computer-science" className="dataset-section-see-all">
                  See All <ArrowRight size={16} />
                </Link>
              </div>
              <div className="dataset-cards-scroll">
                {computerScienceDatasets.map((dataset) => (
                  <div key={dataset.id} className="dataset-card-compact">
                    <div className="dataset-card-image">
                      <img src={dataset.image || 'https://via.placeholder.com/280x160'} alt={dataset.title} />
                    </div>
                    <div className="dataset-card-content">
                      <h3 className="dataset-card-title-compact">{dataset.title}</h3>
                      <p className="dataset-card-author">{dataset.author}</p>
                      <div className="dataset-card-info">
                        <span className="dataset-usability">Usability {dataset.usability || 10.0}</span>
                        <span className="dataset-updated">Updated {formatTimeAgo(dataset.updatedDate)}</span>
                      </div>
                      <div className="dataset-card-file-info">
                        {dataset.fileCount || 1} File ({dataset.format[0]}) • {dataset.size} • {dataset.downloads} downloads
                      </div>
                      <div className="dataset-card-footer-compact">
                        <button className="dataset-vote-button">
                          <ArrowUp size={14} />
                          {dataset.votes || 0}
                        </button>
                        <div className="dataset-profile-icons">
                          <div className="dataset-profile-icon"></div>
                          <div className="dataset-profile-icon"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Datasets;

