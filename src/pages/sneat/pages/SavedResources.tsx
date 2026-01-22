import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  BookmarkMinus,
  FolderPlus,
  Folder,
  MoreVertical,
  Eye,
  Download,
  Share2,
  Trash2,
  Edit2,
  Plus,
  Clock,
  FileText,
  BookOpen,
  GraduationCap,
  Loader2,
  X,
  Check,
  Calendar,
  Target
} from 'lucide-react';

// Types
interface SavedResource {
  id: string;
  title: string;
  type: 'past-question' | 'lecture-note' | 'ebook' | 'trial-question';
  subject?: string;
  savedDate: string;
  lastAccessed: string;
  collection?: string;
  thumbnail?: string;
  size?: string;
  year?: string;
}

interface Collection {
  id: string;
  name: string;
  color: string;
  count: number;
}

// Mock data
const mockResources: SavedResource[] = [
  {
    id: '1',
    title: 'WASSCE Mathematics 2023 - Paper 1',
    type: 'past-question',
    subject: 'Mathematics',
    savedDate: '2024-01-15',
    lastAccessed: '2 hours ago',
    collection: 'Exam Prep',
    size: '2.4 MB',
    year: '2023'
  },
  {
    id: '2',
    title: 'Introduction to Data Structures',
    type: 'lecture-note',
    subject: 'Computer Science',
    savedDate: '2024-01-12',
    lastAccessed: '1 day ago',
    collection: 'CS Notes',
    size: '5.2 MB'
  },
  {
    id: '3',
    title: 'Advanced Calculus E-Book',
    type: 'ebook',
    subject: 'Mathematics',
    savedDate: '2024-01-10',
    lastAccessed: '3 days ago',
    size: '12.8 MB'
  },
  {
    id: '4',
    title: 'BECE English Language 2022',
    type: 'past-question',
    subject: 'English',
    savedDate: '2024-01-08',
    lastAccessed: '1 week ago',
    collection: 'Exam Prep',
    size: '1.8 MB',
    year: '2022'
  },
  {
    id: '5',
    title: 'Physics Trial Questions - Mechanics',
    type: 'trial-question',
    subject: 'Physics',
    savedDate: '2024-01-05',
    lastAccessed: '2 weeks ago',
    size: '3.1 MB'
  },
  {
    id: '6',
    title: 'Chemistry Organic Reactions',
    type: 'lecture-note',
    subject: 'Chemistry',
    savedDate: '2024-01-03',
    lastAccessed: '2 weeks ago',
    collection: 'Chemistry',
    size: '4.5 MB'
  }
];

const mockCollections: Collection[] = [
  { id: '1', name: 'Exam Prep', color: '#696cff', count: 8 },
  { id: '2', name: 'CS Notes', color: '#03c3ec', count: 5 },
  { id: '3', name: 'Chemistry', color: '#71dd37', count: 3 },
  { id: '4', name: 'Quick Review', color: '#ffab00', count: 4 }
];

const SavedResources: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#696cff');
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const colorOptions = ['#696cff', '#03c3ec', '#71dd37', '#ffab00', '#ff3e1d', '#8592a3'];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setResources(mockResources);
      setCollections(mockCollections);
      setLoading(false);
    }, 500);
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filteredResources = resources
    .filter(r => activeCollection === null || r.collection === activeCollection)
    .filter(r =>
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'past-question': return <FileText size={20} />;
      case 'lecture-note': return <BookOpen size={20} />;
      case 'ebook': return <BookOpen size={20} />;
      case 'trial-question': return <GraduationCap size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'past-question': return '#696cff';
      case 'lecture-note': return '#03c3ec';
      case 'ebook': return '#71dd37';
      case 'trial-question': return '#ffab00';
      default: return '#696cff';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'past-question': return 'rgba(105, 108, 255, 0.1)';
      case 'lecture-note': return 'rgba(3, 195, 236, 0.1)';
      case 'ebook': return 'rgba(113, 221, 55, 0.1)';
      case 'trial-question': return 'rgba(255, 171, 0, 0.1)';
      default: return 'rgba(105, 108, 255, 0.1)';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'past-question': return 'Past Question';
      case 'lecture-note': return 'Lecture Note';
      case 'ebook': return 'E-Book';
      case 'trial-question': return 'Trial Question';
      default: return type;
    }
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        color: selectedColor,
        count: 0
      };
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setShowNewCollectionModal(false);
    }
  };

  const handleUnsave = (resourceId: string) => {
    setResources(resources.filter(r => r.id !== resourceId));
    setContextMenu(null);
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Loading saved resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">
            <strong>Saved</strong> Resources
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Quick access to your bookmarked materials
          </p>
        </div>
        <button
          onClick={() => setShowNewCollectionModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#696cff',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: isMobile ? '12px' : 0
          }}
        >
          <FolderPlus size={16} />
          New Collection
        </button>
      </div>

      <div className="row g-4">
        {/* Collections Sidebar */}
        <div className="col-lg-3 col-md-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title m-0">Collections</h6>
            </div>
            <div className="card-body p-0">
              {/* All Saved */}
              <button
                onClick={() => setActiveCollection(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: activeCollection === null ? 'rgba(105, 108, 255, 0.08)' : 'transparent',
                  borderLeft: activeCollection === null ? '3px solid #696cff' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <Bookmark size={18} color={activeCollection === null ? '#696cff' : '#78716C'} />
                  <span style={{
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: activeCollection === null ? 600 : 400,
                    color: activeCollection === null ? '#696cff' : '#1C1917'
                  }}>
                    All Saved
                  </span>
                </div>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#78716C'
                }}>
                  {resources.length}
                </span>
              </button>

              {/* Collections List */}
              {collections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => setActiveCollection(collection.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: activeCollection === collection.name ? 'rgba(105, 108, 255, 0.08)' : 'transparent',
                    borderLeft: activeCollection === collection.name ? `3px solid ${collection.color}` : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <Folder size={18} color={collection.color} fill={activeCollection === collection.name ? collection.color : 'transparent'} />
                    <span style={{
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: activeCollection === collection.name ? 600 : 400,
                      color: activeCollection === collection.name ? collection.color : '#1C1917'
                    }}>
                      {collection.name}
                    </span>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: '#F5F5F5',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#78716C'
                  }}>
                    {collection.count}
                  </span>
                </button>
              ))}

              {/* Create Collection Button */}
              <button
                onClick={() => setShowNewCollectionModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#696cff',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                <Plus size={18} />
                Create Collection
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-md-8">
          {/* Search Bar */}
          <div className="card mb-4">
            <div className="card-body py-3">
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
                <input
                  type="text"
                  placeholder="Search saved resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
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
            </div>
          </div>

          {/* Resources Grid */}
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
                  <Bookmark size={40} color="#A8A29E" />
                </div>
                <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
                  {searchQuery ? 'No resources found' : 'No saved resources'}
                </h5>
                <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Start saving resources you find useful for quick access'
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
                    fontWeight: 600
                  }}
                >
                  <BookOpen size={18} />
                  Browse Resources
                </Link>
              </div>
            </div>
          ) : (
            <div className="saved-resources-grid">
              {filteredResources.map((resource, index) => {
                // Determine category from type
                const getCategory = (type: string, title: string): 'university-past-questions' | 'shs-bece' | 'lecture-notes' | 'ebooks' | 'trial-questions' => {
                  if (type === 'past-question') {
                    // Check if it's SHS/BECE based on title
                    const titleLower = title.toLowerCase();
                    if (titleLower.includes('bece') || titleLower.includes('shs') || titleLower.includes('wassce')) {
                      return 'shs-bece';
                    }
                    return 'university-past-questions';
                  }
                  if (type === 'lecture-note') return 'lecture-notes';
                  if (type === 'ebook') return 'ebooks';
                  if (type === 'trial-question') return 'trial-questions';
                  return 'university-past-questions';
                };

                const category = getCategory(resource.type, resource.title);

                // Render Past Questions card (University Past Questions & SHS/BECE)
                if (category === 'university-past-questions' || category === 'shs-bece') {
                  const examType = category === 'shs-bece' ? 'SHS' : 'End of Semester';
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
                          {/* Content Section */}
                          <div className="relative z-10 flex h-full flex-col p-4">
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
                              {/* Context Menu Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContextMenu({ id: resource.id, x: e.clientX, y: e.clientY });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#78716C'
                                }}
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>
                            
                            {/* Title */}
                            <div className="mb-3">
                              <h3 className="mb-2 text-base font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                                {resource.title}
                              </h3>
                            </div>

                            {/* Metadata */}
                            <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{resource.year || new Date().getFullYear()}</span>
                                {resource.size && (
                                  <>
                                    <span>•</span>
                                    <span>{resource.size}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Action Button - only Preview */}
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="group relative inline-block text-xs font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              >
                                <motion.span
                                  className="relative inline-block pb-0.5 flex items-center gap-1"
                                  whileHover={{ x: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Preview
                                  <span
                                    className="absolute bottom-0 left-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                                    style={{
                                      width: 'calc(100% + 8px)',
                                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                    }}
                                  />
                                </motion.span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsave(resource.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#ff3e1d'
                                }}
                              >
                                <BookmarkMinus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Render Lecture Notes card
                if (category === 'lecture-notes') {
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
                        {/* Top accent bar */}
                        <div className="h-1 w-full bg-[#bd9f67]" />
                        <div className="flex flex-col">
                          {/* Content Section */}
                          <div className="relative z-10 flex h-full flex-col p-4">
                            {/* Title and Type */}
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex-1">
                                <p className="mb-1 text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                                  {resource.type}
                                </p>
                                <h3 className="mb-2 text-base font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                                  {resource.title}
                                </h3>
                              </div>
                              {/* Context Menu Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContextMenu({ id: resource.id, x: e.clientX, y: e.clientY });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#78716C',
                                  marginLeft: '8px'
                                }}
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>

                            {/* Metadata */}
                            <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                              <div className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{resource.size || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Action Button - only Preview */}
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="group relative inline-block text-xs font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              >
                                <motion.span
                                  className="relative inline-block pb-0.5 flex items-center gap-1"
                                  whileHover={{ x: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Preview
                                  <span
                                    className="absolute bottom-0 left-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                                    style={{
                                      width: 'calc(100% + 8px)',
                                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                    }}
                                  />
                                </motion.span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsave(resource.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#ff3e1d'
                                }}
                              >
                                <BookmarkMinus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Render Trial Questions card
                if (category === 'trial-questions') {
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
                        {/* Top accent bar */}
                        <div className="h-1 w-full bg-[hsl(40_20%_88%)]" />
                        <div className="flex flex-col">
                          {/* Content Section */}
                          <div className="relative z-10 flex h-full flex-col p-4">
                            {/* Badge and Title */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-1 text-xs font-bold rounded-md border-0 bg-gray-100 text-black">
                                  {resource.subject || resource.type}
                                </span>
                              </div>
                              {/* Context Menu Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContextMenu({ id: resource.id, x: e.clientX, y: e.clientY });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#78716C'
                                }}
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>
                            <div className="mb-3">
                              <h3 className="mb-2 text-base font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                                {resource.title}
                              </h3>
                            </div>

                            {/* Metadata */}
                            <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                              <div className="flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" />
                                <span>{resource.size || 'N/A'}</span>
                                {resource.year && (
                                  <>
                                    <span>•</span>
                                    <span>{resource.year}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Action Button - only Preview */}
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="group relative inline-block text-xs font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              >
                                <motion.span
                                  className="relative inline-block pb-0.5 flex items-center gap-1"
                                  whileHover={{ x: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Preview
                                  <span
                                    className="absolute bottom-0 left-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                                    style={{
                                      width: 'calc(100% + 8px)',
                                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                    }}
                                  />
                                </motion.span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsave(resource.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#ff3e1d'
                                }}
                              >
                                <BookmarkMinus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Render E-books card
                if (category === 'ebooks') {
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
                        {/* Top accent bar */}
                        <div className="h-1 w-full bg-[hsl(40_20%_88%)]" />
                        <div className="flex flex-col">
                          {/* Content Section */}
                          <div className="relative z-10 flex h-full flex-col p-4">
                            {/* Title and Type */}
                            <div className="mb-3 flex items-start justify-between">
                              <div className="flex-1">
                                <p className="mb-1 text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                                  {resource.type}
                                </p>
                                <h3 className="mb-2 text-base font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                                  {resource.title}
                                </h3>
                              </div>
                              {/* Context Menu Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContextMenu({ id: resource.id, x: e.clientX, y: e.clientY });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#78716C',
                                  marginLeft: '8px'
                                }}
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>

                            {/* Metadata */}
                            <div className="mb-4 flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                              <div className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{resource.size || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Action Button - only Preview */}
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="group relative inline-block text-xs font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                              >
                                <motion.span
                                  className="relative inline-block pb-0.5 flex items-center gap-1"
                                  whileHover={{ x: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Preview
                                  <span
                                    className="absolute bottom-0 left-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                                    style={{
                                      width: 'calc(100% + 8px)',
                                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                    }}
                                  />
                                </motion.span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsave(resource.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  color: '#ff3e1d'
                                }}
                              >
                                <BookmarkMinus size={14} />
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
          )}
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E5E4',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '160px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#1C1917' }}>
              <Eye size={16} />
              View
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#1C1917' }}>
              <Download size={16} />
              Download
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#1C1917' }}>
              <Share2 size={16} />
              Share
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#1C1917' }}>
              <Folder size={16} />
              Move to Collection
            </button>
            <div style={{ height: '1px', backgroundColor: '#E7E5E4', margin: '4px 0' }} />
            <button
              onClick={() => handleUnsave(contextMenu.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#ff3e1d' }}
            >
              <BookmarkMinus size={16} />
              Remove from Saved
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Collection Modal */}
      <AnimatePresence>
        {showNewCollectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '20px'
            }}
            onClick={() => setShowNewCollectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '400px',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '20px', borderBottom: '1px solid #E7E5E4' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", margin: 0 }}>Create Collection</h5>
                  <button
                    onClick={() => setShowNewCollectionModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: '#78716C'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., Exam Prep, My Notes"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #E7E5E4',
                      borderRadius: '8px',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1C1917', marginBottom: '8px' }}>
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: selectedColor === color ? '3px solid #1C1917' : '3px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {selectedColor === color && <Check size={16} color="#FFFFFF" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 20px', backgroundColor: '#FAFAF9', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowNewCollectionModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: '#78716C'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: newCollectionName.trim() ? '#696cff' : '#E7E5E4',
                    color: newCollectionName.trim() ? '#FFFFFF' : '#A8A29E',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: newCollectionName.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Create Collection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .saved-resources-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        @media (min-width: 640px) {
          .saved-resources-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .saved-resources-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1280px) {
          .saved-resources-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SavedResources;
