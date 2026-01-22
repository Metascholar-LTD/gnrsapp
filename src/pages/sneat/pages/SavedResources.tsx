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
  Check
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
    collection: 'Exam Prep'
  },
  {
    id: '2',
    title: 'Introduction to Data Structures',
    type: 'lecture-note',
    subject: 'Computer Science',
    savedDate: '2024-01-12',
    lastAccessed: '1 day ago',
    collection: 'CS Notes'
  },
  {
    id: '3',
    title: 'Advanced Calculus E-Book',
    type: 'ebook',
    subject: 'Mathematics',
    savedDate: '2024-01-10',
    lastAccessed: '3 days ago'
  },
  {
    id: '4',
    title: 'BECE English Language 2022',
    type: 'past-question',
    subject: 'English',
    savedDate: '2024-01-08',
    lastAccessed: '1 week ago',
    collection: 'Exam Prep'
  },
  {
    id: '5',
    title: 'Physics Trial Questions - Mechanics',
    type: 'trial-question',
    subject: 'Physics',
    savedDate: '2024-01-05',
    lastAccessed: '2 weeks ago'
  },
  {
    id: '6',
    title: 'Chemistry Organic Reactions',
    type: 'lecture-note',
    subject: 'Chemistry',
    savedDate: '2024-01-03',
    lastAccessed: '2 weeks ago',
    collection: 'Chemistry'
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

          {/* Quick Access */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="card-title m-0">Quick Access</h6>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.8125rem', color: '#78716C', marginBottom: '12px' }}>Recently saved</p>
              {resources.slice(0, 3).map(resource => (
                <div
                  key={resource.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    borderBottom: '1px solid #F5F5F5',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getTypeBgColor(resource.type),
                    borderRadius: '6px',
                    color: getTypeColor(resource.type),
                    flexShrink: 0
                  }}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#1C1917',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {resource.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: 0 }}>
                      {resource.lastAccessed}
                    </p>
                  </div>
                </div>
              ))}
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
            <div className="row g-3">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  className="col-lg-4 col-md-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="card h-100"
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      height: '100px',
                      backgroundColor: getTypeBgColor(resource.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px 10px 0 0',
                      color: getTypeColor(resource.type)
                    }}>
                      {React.cloneElement(getTypeIcon(resource.type) as React.ReactElement, { size: 40 })}
                    </div>

                    {/* Context Menu Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu({ id: resource.id, x: e.clientX, y: e.clientY });
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#78716C'
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>

                    <div className="card-body">
                      {/* Type & Collection Badge */}
                      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: getTypeBgColor(resource.type),
                          color: getTypeColor(resource.type),
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {getTypeLabel(resource.type)}
                        </span>
                        {resource.collection && (
                          <span style={{
                            padding: '3px 8px',
                            backgroundColor: '#F5F5F5',
                            color: '#78716C',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Folder size={10} />
                            {resource.collection}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h6 style={{
                        fontFamily: "'Crimson Text', Georgia, serif",
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#1C1917',
                        marginBottom: '8px',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {resource.title}
                      </h6>

                      {/* Meta */}
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                        <Clock size={12} />
                        <span>{resource.lastAccessed}</span>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2 mt-3">
                        <button
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px',
                            backgroundColor: '#696cff',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleUnsave(resource.id)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            border: '1px solid #E7E5E4',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#ff3e1d'
                          }}
                        >
                          <BookmarkMinus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
      `}</style>
    </div>
  );
};

export default SavedResources;
