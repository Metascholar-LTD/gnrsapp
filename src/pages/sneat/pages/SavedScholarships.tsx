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
  Share2,
  Plus,
  Clock,
  Award,
  GraduationCap,
  Loader2,
  X,
  Check,
  Calendar,
  ExternalLink,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

// Types
interface SavedScholarship {
  id: string;
  title: string;
  provider: string;
  amount?: string;
  deadline?: string;
  savedDate: string;
  lastAccessed: string;
  collection?: string;
  externalUrl?: string;
  level?: string;
  field?: string;
  location?: string;
  imageUrl?: string;
  verified?: boolean;
  isMTN?: boolean;
  category?: string;
}

interface Collection {
  id: string;
  name: string;
  color: string;
  count: number;
}

// Helper function to calculate days until deadline
const getDaysUntilDeadline = (deadline?: string): number => {
  if (!deadline) return -1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Mock data
const mockScholarships: SavedScholarship[] = [
  {
    id: '1',
    title: 'Mastercard Foundation Scholars Program',
    provider: 'Mastercard Foundation',
    amount: '$50,000',
    deadline: '2024-03-15',
    savedDate: '2024-01-15',
    lastAccessed: '2 hours ago',
    collection: 'Graduate Studies',
    externalUrl: 'https://example.com/scholarship1',
    level: 'Graduate',
    field: 'All Fields',
    location: 'Ghana',
    imageUrl: '/placeholder.svg',
    verified: true,
    category: 'International'
  },
  {
    id: '2',
    title: 'Chevening Scholarships',
    provider: 'UK Government',
    amount: 'Full Tuition',
    deadline: '2024-11-01',
    savedDate: '2024-01-12',
    lastAccessed: '1 day ago',
    collection: 'International',
    externalUrl: 'https://example.com/scholarship2',
    level: 'Graduate',
    field: 'All Fields',
    location: 'United Kingdom',
    imageUrl: '/placeholder.svg',
    verified: true,
    category: 'International'
  },
  {
    id: '3',
    title: 'Ghana Education Trust Fund (GETFund)',
    provider: 'GETFund',
    amount: 'Partial',
    deadline: '2024-05-30',
    savedDate: '2024-01-10',
    lastAccessed: '3 days ago',
    externalUrl: 'https://example.com/scholarship3',
    level: 'Undergraduate',
    field: 'All Fields',
    location: 'Ghana',
    imageUrl: '/placeholder.svg',
    verified: true,
    category: 'Local'
  },
  {
    id: '4',
    title: 'DAAD Scholarships for Development',
    provider: 'DAAD',
    amount: 'Full Tuition',
    deadline: '2024-08-15',
    savedDate: '2024-01-08',
    lastAccessed: '1 week ago',
    collection: 'International',
    externalUrl: 'https://example.com/scholarship4',
    level: 'Graduate',
    field: 'Development Studies',
    location: 'Germany',
    imageUrl: '/placeholder.svg',
    verified: true,
    category: 'International'
  },
  {
    id: '5',
    title: 'Commonwealth Scholarships',
    provider: 'Commonwealth Commission',
    amount: 'Full Tuition + Living',
    deadline: '2024-10-20',
    savedDate: '2024-01-05',
    lastAccessed: '2 weeks ago',
    externalUrl: 'https://example.com/scholarship5',
    level: 'Graduate',
    field: 'All Fields',
    location: 'Multiple Countries',
    imageUrl: '/placeholder.svg',
    verified: true,
    category: 'International'
  },
  {
    id: '6',
    title: 'KNUST Endowment Fund Scholarships',
    provider: 'KNUST',
    amount: 'Partial',
    deadline: '2024-06-30',
    savedDate: '2024-01-03',
    lastAccessed: '2 weeks ago',
    collection: 'Local',
    externalUrl: 'https://example.com/scholarship6',
    level: 'Undergraduate',
    field: 'All Fields',
    location: 'Ghana',
    imageUrl: '/placeholder.svg',
    verified: true,
    category: 'Local'
  }
];

const mockCollections: Collection[] = [
  { id: '1', name: 'Graduate Studies', color: '#696cff', count: 3 },
  { id: '2', name: 'International', color: '#03c3ec', count: 2 },
  { id: '3', name: 'Local', color: '#71dd37', count: 1 }
];

const SavedScholarships: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<SavedScholarship[]>([]);
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
      setScholarships(mockScholarships);
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

  const filteredScholarships = scholarships
    .filter(s => activeCollection === null || s.collection === activeCollection)
    .filter(s =>
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.field?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

  const handleUnsave = (scholarshipId: string) => {
    setScholarships(scholarships.filter(s => s.id !== scholarshipId));
    setContextMenu(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Loading saved scholarships...</p>
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
            <strong>Saved</strong> Scholarships
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Quick access to your bookmarked scholarship opportunities
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
                  {scholarships.length}
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
              {scholarships.slice(0, 3).map(scholarship => (
                <div
                  key={scholarship.id}
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
                    backgroundColor: 'rgba(105, 108, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#696cff',
                    flexShrink: 0
                  }}>
                    <Award size={16} />
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
                      {scholarship.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: 0 }}>
                      {scholarship.lastAccessed}
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
                  placeholder="Search saved scholarships..."
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

          {/* Scholarships Grid */}
          {filteredScholarships.length === 0 ? (
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
                  {searchQuery ? 'No scholarships found' : 'No saved scholarships'}
                </h5>
                <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Start saving scholarships you find interesting for quick access'
                  }
                </p>
                <Link
                  to="/scholarships"
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
                  <Award size={18} />
                  Browse Scholarships
                </Link>
              </div>
            </div>
          ) : (
            <div className="saved-scholarships-grid">
              {filteredScholarships.map((scholarship, index) => {
                const isMTN = scholarship.isMTN || scholarship.provider?.toLowerCase().includes('mtn');
                const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                const isDeadlineSoon = daysLeft > 0 && daysLeft <= 30;

                return (
                  <motion.div
                    key={scholarship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group cursor-pointer"
                  >
                    {/* Compact Card Style - Matching global scholarship page design */}
                    <div className="relative w-full overflow-hidden rounded-2xl border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                      style={{
                        borderColor: isMTN ? "#fbbf24" : "#e5e7eb"
                      }}
                    >
                      {/* Top accent bar - Only yellow for MTN */}
                      <div className="h-1 w-full"
                        style={{
                          backgroundColor: isMTN ? "#fbbf24" : "#bd9f67"
                        }}
                      />

                      {/* Image Section */}
                      {scholarship.imageUrl && (
                        <div className="relative h-32 overflow-hidden bg-slate-100">
                          <motion.img
                            src={scholarship.imageUrl}
                            alt={scholarship.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          
                          {/* Badges on Image */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                            {scholarship.verified && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/95 backdrop-blur-sm border border-green-300 shadow-md">
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                              </div>
                            )}
                            {isMTN && (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-yellow-400 text-black shadow-md">
                                MTN
                              </span>
                            )}
                            {isDeadlineSoon && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-red-500 text-white shadow-md">
                                Soon
                              </span>
                            )}
                            {/* Context Menu Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setContextMenu({ id: scholarship.id, x: e.clientX, y: e.clientY });
                              }}
                              className="flex items-center justify-center w-6 h-6 rounded-full bg-white/95 backdrop-blur-sm border border-white/20 shadow-md"
                              style={{
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <MoreVertical className="w-3 h-3 text-slate-700" />
                            </button>
                          </div>
                          
                          {/* Category badge on image */}
                          {scholarship.category && (
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/95 backdrop-blur-sm border border-white/50 text-slate-700">
                                {scholarship.category}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-4">
                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-[#bd9f67] transition-colors">
                          {scholarship.title}
                        </h3>

                        {/* Provider */}
                        <p className="text-xs text-slate-600 mb-3 font-medium">
                          {scholarship.provider}
                        </p>

                        {/* Info Icons */}
                        <div className="space-y-1.5 mb-3 flex-1">
                          {scholarship.amount && (
                            <div className="flex items-center gap-2 text-xs text-slate-700">
                              <DollarSign className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                              <span className="font-semibold truncate">
                                {scholarship.amount}
                              </span>
                            </div>
                          )}
                          {scholarship.location && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{scholarship.location}</span>
                            </div>
                          )}
                          {scholarship.level && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{scholarship.level}</span>
                            </div>
                          )}
                          {daysLeft > 0 && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span>{daysLeft} days left</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button - Matching questions page style */}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <a
                            href={scholarship.externalUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group relative inline-block text-xs font-semibold text-[#bd9f67] transition-colors duration-300 hover:text-[#a88a59]"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: 'none' }}
                          >
                            <motion.span
                              className="relative inline-block pb-0.5 flex items-center gap-1"
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                              View Details
                              <span
                                className="absolute bottom-0 left-0 h-[1px] bg-[#bd9f67] transition-all duration-300 group-hover:bg-[#a88a59]"
                                style={{
                                  width: 'calc(100% + 8px)',
                                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                }}
                              />
                            </motion.span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnsave(scholarship.id);
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
                  </motion.div>
                );
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
            <a
              href={scholarships.find(s => s.id === contextMenu.id)?.externalUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#1C1917', textDecoration: 'none' }}
            >
              <ExternalLink size={16} />
              Apply Now
            </a>
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
                    placeholder="e.g., Graduate Studies, International"
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
        
        .saved-scholarships-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        @media (min-width: 640px) {
          .saved-scholarships-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .saved-scholarships-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1280px) {
          .saved-scholarships-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SavedScholarships;
