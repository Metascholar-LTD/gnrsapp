import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Download,
  Eye,
  Share2,
  Trash2,
  BookOpen,
  FileText,
  GraduationCap,
  Clock,
  HardDrive,
  TrendingUp,
  ChevronDown,
  X,
  Loader2,
  FolderOpen,
  Calendar,
  User,
  CheckCircle2,
  Target
} from 'lucide-react';
import PageWrapper, { colors } from './shared/PageWrapper';

// Types
interface Resource {
  id: string;
  title: string;
  category: 'university-past-questions' | 'shs-bece' | 'lecture-notes' | 'ebooks' | 'trial-questions';
  type: string;
  thumbnail: string;
  downloadDate: string;
  lastAccessed: string;
  size: string;
  progress?: number;
  subject?: string;
  year?: string;
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'WASSCE Mathematics 2023',
    category: 'shs-bece',
    type: 'Past Question',
    thumbnail: '/placeholder.svg',
    downloadDate: '2024-01-15',
    lastAccessed: '2 hours ago',
    size: '2.4 MB',
    progress: 75,
    subject: 'Mathematics',
    year: '2023'
  },
  {
    id: '2',
    title: 'Introduction to Computer Science',
    category: 'lecture-notes',
    type: 'Lecture Notes',
    thumbnail: '/placeholder.svg',
    downloadDate: '2024-01-10',
    lastAccessed: '1 day ago',
    size: '5.2 MB',
    subject: 'Computer Science'
  },
  {
    id: '3',
    title: 'KNUST Engineering Mathematics Past Questions',
    category: 'university-past-questions',
    type: 'University Past Question',
    thumbnail: '/placeholder.svg',
    downloadDate: '2024-01-08',
    lastAccessed: '3 days ago',
    size: '3.1 MB',
    progress: 100,
    subject: 'Mathematics',
    year: '2022'
  },
  {
    id: '4',
    title: 'Python Programming Fundamentals',
    category: 'ebooks',
    type: 'E-Book',
    thumbnail: '/placeholder.svg',
    downloadDate: '2024-01-05',
    lastAccessed: '1 week ago',
    size: '12.8 MB',
    progress: 45
  },
  {
    id: '5',
    title: 'BECE English Language 2023',
    category: 'shs-bece',
    type: 'Past Question',
    thumbnail: '/placeholder.svg',
    downloadDate: '2024-01-03',
    lastAccessed: '2 weeks ago',
    size: '1.8 MB',
    subject: 'English',
    year: '2023'
  },
  {
    id: '6',
    title: 'Trial Questions - Integrated Science',
    category: 'trial-questions',
    type: 'Trial Questions',
    thumbnail: '/placeholder.svg',
    downloadDate: '2024-01-01',
    lastAccessed: '3 weeks ago',
    size: '4.5 MB',
    progress: 30,
    subject: 'Integrated Science'
  }
];

const categories = [
  { id: 'all', label: 'All Resources', icon: FolderOpen },
  { id: 'university-past-questions', label: 'University Past Questions', icon: GraduationCap },
  { id: 'shs-bece', label: 'SHS/BECE Past Questions', icon: FileText },
  { id: 'lecture-notes', label: 'Lecture Notes', icon: BookOpen },
  { id: 'ebooks', label: 'E-Books', icon: BookOpen },
  { id: 'trial-questions', label: 'Trial Questions', icon: FileText }
];

const sortOptions = [
  { id: 'recent', label: 'Recently Accessed' },
  { id: 'name', label: 'Name (A-Z)' },
  { id: 'type', label: 'Resource Type' },
  { id: 'date', label: 'Date Downloaded' }
];

const MyResources: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setResources(mockResources);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and sort resources
  const filteredResources = resources
    .filter(r => activeCategory === 'all' || r.category === activeCategory)
    .filter(r =>
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime();
        default:
          return 0;
      }
    });

  // Stats
  const stats = {
    total: resources.length,
    storageUsed: '32.8 MB',
    mostAccessed: resources[0]?.title || 'N/A'
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'university-past-questions': '#696cff',
      'shs-bece': '#ffab00',
      'lecture-notes': '#03c3ec',
      'ebooks': '#71dd37',
      'trial-questions': '#ff3e1d'
    };
    return colors[category] || '#696cff';
  };

  const getCategoryBgColor = (category: string) => {
    const colors: Record<string, string> = {
      'university-past-questions': 'rgba(105, 108, 255, 0.1)',
      'shs-bece': 'rgba(255, 171, 0, 0.1)',
      'lecture-notes': 'rgba(3, 195, 236, 0.1)',
      'ebooks': 'rgba(113, 221, 55, 0.1)',
      'trial-questions': 'rgba(255, 62, 29, 0.1)'
    };
    return colors[category] || 'rgba(105, 108, 255, 0.1)';
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2
              size={32}
              className="mb-3"
              style={{ animation: 'spin 1s linear infinite', color: colors.primary }}
            />
            <p style={{ color: colors.textSecondary, fontFamily: "'Source Sans Pro', sans-serif" }}>Loading resources...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">
            <strong>My</strong> Resources
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Access all your downloaded educational materials
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row g-3 mb-4">
        <div className="col-md-4 col-sm-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bgLight,
                  borderRadius: '10px'
                }}>
                  <Download size={24} style={{ color: colors.textSecondary }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716C' }}>Total Resources</p>
                  <h4 style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>{stats.total}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bgLight,
                  borderRadius: '10px'
                }}>
                  <HardDrive size={24} style={{ color: colors.textSecondary }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716C' }}>Storage Used</p>
                  <h4 style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>{stats.storageUsed}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bgLight,
                  borderRadius: '10px'
                }}>
                  <TrendingUp size={24} style={{ color: colors.textSecondary }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716C' }}>Most Accessed</p>
                  <h6 style={{
                    margin: 0,
                    fontWeight: 600,
                    color: '#1C1917',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {stats.mostAccessed}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '4px',
              padding: '12px 16px',
              borderBottom: '1px solid #E7E5E4'
            }}
            className="hide-scrollbar"
          >
            {categories.map(cat => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#696cff' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#78716C',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <IconComponent size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search and Controls */}
          <div className="p-3">
            <div className="d-flex flex-column flex-md-row gap-3">
              {/* Search Input */}
              <div style={{ flex: 1, position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#A8A29E'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#696cff'}
                  onBlur={(e) => e.target.style.borderColor = '#E7E5E4'}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: '#A8A29E'
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowFilterDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    color: '#1C1917',
                    cursor: 'pointer',
                    minWidth: '160px',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{sortOptions.find(s => s.id === sortBy)?.label}</span>
                  <ChevronDown size={16} style={{ color: '#78716C' }} />
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7E5E4',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        minWidth: '180px',
                        overflow: 'hidden'
                      }}
                    >
                      {sortOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setShowSortDropdown(false);
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            backgroundColor: sortBy === option.id ? '#F5F5F5' : 'transparent',
                            fontFamily: "'Source Sans Pro', sans-serif",
                            fontSize: '0.875rem',
                            color: '#1C1917',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View Toggle */}
              {!isMobile && (
                <div style={{
                  display: 'flex',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 14px',
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? '#696cff' : 'transparent',
                      color: viewMode === 'grid' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer'
                    }}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 14px',
                      border: 'none',
                      backgroundColor: viewMode === 'list' ? '#696cff' : 'transparent',
                      color: viewMode === 'list' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer'
                    }}
                  >
                    <List size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resources Display */}
      {filteredResources.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: '50%'
            }}>
              <FolderOpen size={40} color="#A8A29E" />
            </div>
            <h5 style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              color: '#1C1917',
              marginBottom: '8px'
            }}>
              {searchQuery ? 'No resources found' : 'No resources yet'}
            </h5>
            <p style={{
              fontFamily: "'Source Sans Pro', sans-serif",
              color: '#78716C',
              marginBottom: '24px',
              maxWidth: '400px',
              margin: '0 auto 24px'
            }}>
              {searchQuery
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start exploring our educational resources to build your learning library.'
              }
            </p>
            <Link
              to="/education/past-questions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#696cff',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: "'Source Sans Pro', sans-serif",
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              <BookOpen size={18} />
              Explore Resources
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' || isMobile ? (
        <div className="my-resources-grid">
          {filteredResources.map((resource, index) => {
            // Render Past Questions card (University Past Questions & SHS/BECE) - EXACT same size as ExamPaperCard
            if (resource.category === 'university-past-questions' || resource.category === 'shs-bece') {
              const examType = resource.category === 'shs-bece' ? 'SHS' : 'End of Semester';
              const borderColor = examType === "SHS" 
                ? "border-yellow-500" 
                : "border-[hsl(40_20%_88%)]";
              const accentColor = examType === "SHS"
                ? "bg-yellow-500"
                : "bg-[hsl(40_20%_88%)]";
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-white text-[hsl(220_30%_15%)] shadow-lg ${borderColor}`}>
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${accentColor}`} />
                    <div className="flex flex-col">
                      {/* Content Section - same padding as ExamPaperCard */}
                      <div className="relative z-10 flex h-full flex-col p-6">
                        {/* Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 text-xs font-bold rounded-md border-0 bg-gray-100 text-black">
                              {resource.subject || resource.type}
                            </span>
                            {examType === "SHS" && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-500 text-yellow-900">
                                {examType}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Title */}
                        <div className="mb-3">
                          <h3 className="mb-2 text-lg font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                            {resource.title}
                          </h3>
                        </div>

                        {/* Metadata */}
                        <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{resource.year || new Date().getFullYear()}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                          </div>
                        </div>

                        {/* Action Button - only Preview, no Download */}
                        <div className="mt-auto flex items-center justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="group relative inline-block text-xs font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <motion.span
                              className="relative inline-block pb-1 flex items-center gap-1.5"
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                              <span
                                className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                                style={{
                                  width: 'calc(100% + 14px)',
                                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                                }}
                              />
                            </motion.span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Render Lecture Notes card - EXACT same size as ExamPaperCard
            if (resource.category === 'lecture-notes') {
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-white text-[hsl(220_30%_15%)] shadow-lg"
                    style={{ borderColor: "hsl(40 20% 88%)" }}
                  >
                    {/* Top accent bar - same as ExamPaperCard */}
                    <div className="h-1 w-full bg-[#bd9f67]" />
                    <div className="flex flex-col">
                      {/* Content Section - same padding as ExamPaperCard */}
                      <div className="relative z-10 flex h-full flex-col p-6">
                        {/* Title and Type */}
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                            {resource.type}
                          </p>
                          <h3 className="mb-2 text-lg font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                            {resource.title}
                          </h3>
                        </div>

                        {/* Metadata */}
                        <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{resource.size}</span>
                          </div>
                        </div>

                        {/* Action Button - only Preview, no Download */}
                        <div className="mt-auto flex items-center justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="group relative inline-block text-xs font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <motion.span
                              className="relative inline-block pb-1 flex items-center gap-1.5"
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                              <span
                                className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                                style={{
                                  width: 'calc(100% + 14px)',
                                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                                }}
                              />
                            </motion.span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Render Trial Questions card - EXACT same size as ExamPaperCard
            if (resource.category === 'trial-questions') {
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-white text-[hsl(220_30%_15%)] shadow-lg"
                    style={{ borderColor: "hsl(40 20% 88%)" }}
                  >
                    {/* Top accent bar - same as ExamPaperCard */}
                    <div className="h-1 w-full bg-[hsl(40_20%_88%)]" />
                    <div className="flex flex-col">
                      {/* Content Section - same padding as ExamPaperCard */}
                      <div className="relative z-10 flex h-full flex-col p-6">
                        {/* Badge and Title */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 text-xs font-bold rounded-md border-0 bg-gray-100 text-black">
                              {resource.subject || resource.type}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <h3 className="mb-2 text-lg font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                            {resource.title}
                          </h3>
                        </div>

                        {/* Metadata */}
                        <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                          <div className="flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            <span>{resource.size}</span>
                            {resource.year && (
                              <>
                                <span>•</span>
                                <span>{resource.year}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Button - only Preview, no Download */}
                        <div className="mt-auto flex items-center justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="group relative inline-block text-xs font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <motion.span
                              className="relative inline-block pb-1 flex items-center gap-1.5"
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                              <span
                                className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                                style={{
                                  width: 'calc(100% + 14px)',
                                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                                }}
                              />
                            </motion.span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Render E-books card - EXACT same size as ExamPaperCard
            if (resource.category === 'ebooks') {
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-white text-[hsl(220_30%_15%)] shadow-lg"
                    style={{ borderColor: "hsl(40 20% 88%)" }}
                  >
                    {/* Top accent bar - same as ExamPaperCard */}
                    <div className="h-1 w-full bg-[hsl(40_20%_88%)]" />
                    <div className="flex flex-col">
                      {/* Content Section - same padding as ExamPaperCard */}
                      <div className="relative z-10 flex h-full flex-col p-6">
                        {/* Title and Type */}
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                            {resource.type}
                          </p>
                          <h3 className="mb-2 text-lg font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                            {resource.title}
                          </h3>
                        </div>

                        {/* Metadata */}
                        <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{resource.size}</span>
                          </div>
                        </div>

                        {/* Action Button - only Preview, no Download */}
                        <div className="mt-auto flex items-center justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="group relative inline-block text-xs font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <motion.span
                              className="relative inline-block pb-1 flex items-center gap-1.5"
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                              <span
                                className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                                style={{
                                  width: 'calc(100% + 14px)',
                                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                                }}
                              />
                            </motion.span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return null;
          })}
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 120px 100px 140px',
              padding: '14px 20px',
              backgroundColor: '#FAFAF9',
              borderBottom: '1px solid #E7E5E4',
              fontFamily: "'Source Sans Pro', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#78716C',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span>Resource</span>
              <span>Type</span>
              <span>Size</span>
              <span>Progress</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>
            {/* Table Body */}
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 120px 100px 140px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #E7E5E4',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.bgLight,
                    borderRadius: '8px',
                    flexShrink: 0
                  }}>
                    <FileText size={20} style={{ color: colors.textSecondary }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h6 style={{
                      fontFamily: "'Crimson Text', Georgia, serif",
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#1C1917',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {resource.title}
                    </h6>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#78716C',
                      margin: 0
                    }}>
                      {resource.lastAccessed}
                    </p>
                  </div>
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: colors.bgLight,
                  color: colors.textSecondary,
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  {resource.type}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#78716C' }}>
                  {resource.size}
                </span>
                <div>
                  {resource.progress !== undefined ? (
                    <div style={{
                      width: '60px',
                      height: '6px',
                      backgroundColor: colors.borderLight,
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${resource.progress}%`,
                        height: '100%',
                        backgroundColor: colors.primary,
                        borderRadius: '3px'
                      }} />
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>—</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    style={{
                      padding: '6px 10px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: colors.primary,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Eye size={12} />
                    View
                  </button>
                  <button
                    style={{
                      padding: '6px 8px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: colors.textSecondary,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} style={{ color: colors.textMuted }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CSS for hiding scrollbar and grid layout */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .my-resources-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        @media (min-width: 640px) {
          .my-resources-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .my-resources-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1280px) {
          .my-resources-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>
    </PageWrapper>
  );
};

export default MyResources;
