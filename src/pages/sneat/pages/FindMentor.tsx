import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  MessageSquare,
  ChevronDown,
  X,
  Loader2,
  User,
  Award,
  GraduationCap,
  Building2,
  CheckCircle2,
  Heart,
  Video
} from 'lucide-react';

// Types
interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  sessionCount: number;
  isAvailable: boolean;
  bio: string;
  location: string;
  languages: string[];
  hourlyRate?: number;
  isFeatured?: boolean;
  nextAvailable?: string;
}

// Mock data
const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Kwame Asante',
    title: 'Software Engineering Lead',
    company: 'Google',
    expertise: ['Software Engineering', 'Career Development', 'System Design'],
    rating: 4.9,
    reviewCount: 127,
    sessionCount: 250,
    isAvailable: true,
    bio: 'Passionate about helping aspiring engineers navigate their career paths. 15+ years of experience in tech.',
    location: 'Accra, Ghana',
    languages: ['English', 'Twi'],
    isFeatured: true,
    nextAvailable: 'Tomorrow'
  },
  {
    id: '2',
    name: 'Prof. Ama Serwaa',
    title: 'Research Scientist',
    company: 'MIT',
    expertise: ['Research', 'Graduate School', 'Data Science'],
    rating: 4.8,
    reviewCount: 89,
    sessionCount: 180,
    isAvailable: true,
    bio: 'Helping students achieve their academic dreams. Specializing in STEM research and graduate applications.',
    location: 'Cambridge, USA',
    languages: ['English'],
    isFeatured: true,
    nextAvailable: 'This week'
  },
  {
    id: '3',
    name: 'Mr. Kofi Mensah',
    title: 'Founder & CEO',
    company: 'TechGhana',
    expertise: ['Entrepreneurship', 'Startups', 'Business Strategy'],
    rating: 4.7,
    reviewCount: 65,
    sessionCount: 120,
    isAvailable: false,
    bio: 'Serial entrepreneur with 3 successful exits. Passionate about African tech ecosystem.',
    location: 'Accra, Ghana',
    languages: ['English', 'Twi', 'Ga'],
    nextAvailable: 'Next week'
  },
  {
    id: '4',
    name: 'Dr. Abena Owusu',
    title: 'Data Science Manager',
    company: 'Meta',
    expertise: ['Data Science', 'Machine Learning', 'Analytics'],
    rating: 4.9,
    reviewCount: 92,
    sessionCount: 200,
    isAvailable: true,
    bio: 'Building the next generation of data scientists. Expert in ML and AI applications.',
    location: 'London, UK',
    languages: ['English'],
    nextAvailable: 'Today'
  },
  {
    id: '5',
    name: 'Ms. Efua Darko',
    title: 'Product Manager',
    company: 'Microsoft',
    expertise: ['Product Management', 'UX Design', 'Strategy'],
    rating: 4.6,
    reviewCount: 54,
    sessionCount: 90,
    isAvailable: true,
    bio: 'Helping aspiring PMs break into tech. Passionate about user-centric product development.',
    location: 'Seattle, USA',
    languages: ['English', 'French'],
    nextAvailable: 'Tomorrow'
  },
  {
    id: '6',
    name: 'Eng. Samuel Osei',
    title: 'Engineering Director',
    company: 'Amazon',
    expertise: ['Leadership', 'Cloud Computing', 'Architecture'],
    rating: 4.8,
    reviewCount: 78,
    sessionCount: 150,
    isAvailable: true,
    bio: 'Guiding engineers to leadership roles. Expert in cloud architecture and team building.',
    location: 'Vancouver, Canada',
    languages: ['English'],
    nextAvailable: 'This week'
  }
];

const expertiseFilters = [
  'All',
  'Software Engineering',
  'Data Science',
  'Product Management',
  'Entrepreneurship',
  'Research',
  'Career Development'
];

const FindMentor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMentors(mockMentors);
      setLoading(false);
    }, 500);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredMentors = mentors
    .filter(m => selectedExpertise === 'All' || m.expertise.includes(selectedExpertise))
    .filter(m => !showAvailableOnly || m.isAvailable)
    .filter(m =>
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'sessions') return b.sessionCount - a.sessionCount;
      return 0;
    });

  const featuredMentors = filteredMentors.filter(m => m.isFeatured);
  const regularMentors = filteredMentors.filter(m => !m.isFeatured);

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Finding mentors...</p>
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
            <strong>Find a</strong> Mentor
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Connect with experienced professionals to guide your journey
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-5">
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
                <input
                  type="text"
                  placeholder="Search by name, expertise, or company..."
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
              </div>
            </div>
            <div className="col-lg-4">
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }} className="hide-scrollbar">
                {expertiseFilters.slice(0, isMobile ? 3 : 5).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSelectedExpertise(filter)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '20px',
                      backgroundColor: selectedExpertise === filter ? '#696cff' : '#F5F5F5',
                      color: selectedExpertise === filter ? '#FFFFFF' : '#78716C',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-3">
              <div className="d-flex gap-2">
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1
                }}>
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    style={{ accentColor: '#696cff' }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: '#78716C' }}>Available now</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.8125rem',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="sessions">Most Sessions</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Mentors */}
      {featuredMentors.length > 0 && (
        <div className="mb-4">
          <h6 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '16px' }}>
            <Award size={18} color="#ffab00" style={{ marginRight: '8px' }} />
            Featured Mentors
          </h6>
          <div className="row g-3">
            {featuredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                className="col-lg-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="card h-100"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 171, 0, 0.3)',
                    backgroundColor: 'rgba(255, 171, 0, 0.02)'
                  }}
                  onClick={() => setSelectedMentor(mentor)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex gap-3">
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(105, 108, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#696cff',
                        fontWeight: 600,
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <div>
                            <h6 style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>{mentor.name}</h6>
                            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#78716C' }}>
                              {mentor.title} at {mentor.company}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(mentor.id);
                            }}
                            style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                          >
                            <Heart
                              size={20}
                              fill={favorites.has(mentor.id) ? '#ff3e1d' : 'none'}
                              color={favorites.has(mentor.id) ? '#ff3e1d' : '#A8A29E'}
                            />
                          </button>
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '0.8125rem' }}>
                          <span className="d-flex align-items-center gap-1">
                            <Star size={14} fill="#ffab00" color="#ffab00" />
                            <span style={{ fontWeight: 600 }}>{mentor.rating}</span>
                            <span style={{ color: '#A8A29E' }}>({mentor.reviewCount})</span>
                          </span>
                          <span style={{ color: '#A8A29E' }}>•</span>
                          <span style={{ color: '#78716C' }}>{mentor.sessionCount} sessions</span>
                        </div>
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {mentor.expertise.slice(0, 3).map(exp => (
                            <span key={exp} style={{
                              padding: '3px 8px',
                              backgroundColor: 'rgba(105, 108, 255, 0.08)',
                              color: '#696cff',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 500
                            }}>
                              {exp}
                            </span>
                          ))}
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            color: mentor.isAvailable ? '#71dd37' : '#A8A29E'
                          }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: mentor.isAvailable ? '#71dd37' : '#A8A29E'
                            }} />
                            {mentor.isAvailable ? `Available ${mentor.nextAvailable}` : 'Not available'}
                          </span>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '6px 16px',
                              backgroundColor: '#696cff',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Book Session
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Mentors */}
      <div>
        <h6 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '16px' }}>
          All Mentors ({regularMentors.length})
        </h6>
        {regularMentors.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <User size={48} color="#A8A29E" style={{ marginBottom: '16px' }} />
              <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
                No mentors found
              </h5>
              <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C' }}>
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {regularMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                className="col-lg-4 col-md-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="card h-100"
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setSelectedMentor(mentor)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(105, 108, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#696cff',
                          fontWeight: 600,
                          fontSize: '1.125rem'
                        }}>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h6 style={{ margin: 0, fontWeight: 600, color: '#1C1917', fontSize: '0.9375rem' }}>{mentor.name}</h6>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>
                            {mentor.title}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>
                            {mentor.company}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(mentor.id);
                        }}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                      >
                        <Heart
                          size={18}
                          fill={favorites.has(mentor.id) ? '#ff3e1d' : 'none'}
                          color={favorites.has(mentor.id) ? '#ff3e1d' : '#A8A29E'}
                        />
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.8125rem' }}>
                      <span className="d-flex align-items-center gap-1">
                        <Star size={14} fill="#ffab00" color="#ffab00" />
                        <span style={{ fontWeight: 600 }}>{mentor.rating}</span>
                      </span>
                      <span style={{ color: '#A8A29E' }}>({mentor.reviewCount} reviews)</span>
                    </div>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {mentor.expertise.slice(0, 2).map(exp => (
                        <span key={exp} style={{
                          padding: '3px 8px',
                          backgroundColor: '#F5F5F5',
                          color: '#78716C',
                          borderRadius: '4px',
                          fontSize: '0.7rem'
                        }}>
                          {exp}
                        </span>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: '#F5F5F5',
                          color: '#78716C',
                          borderRadius: '4px',
                          fontSize: '0.7rem'
                        }}>
                          +{mentor.expertise.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-auto">
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: mentor.isAvailable ? '#71dd37' : '#A8A29E'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: mentor.isAvailable ? '#71dd37' : '#A8A29E'
                        }} />
                        {mentor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMentor(mentor);
                        }}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: mentor.isAvailable ? '#696cff' : '#F5F5F5',
                          color: mentor.isAvailable ? '#FFFFFF' : '#A8A29E',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          cursor: mentor.isAvailable ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!mentor.isAvailable}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          onClick={() => setSelectedMentor(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid #E7E5E4' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(105, 108, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#696cff',
                fontWeight: 600,
                fontSize: '1.75rem',
                margin: '0 auto 16px'
              }}>
                {selectedMentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", margin: '0 0 4px' }}>{selectedMentor.name}</h5>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716C' }}>
                {selectedMentor.title} at {selectedMentor.company}
              </p>
              <div className="d-flex align-items-center justify-content-center gap-3 mt-3" style={{ fontSize: '0.875rem' }}>
                <span className="d-flex align-items-center gap-1">
                  <Star size={16} fill="#ffab00" color="#ffab00" />
                  <span style={{ fontWeight: 600 }}>{selectedMentor.rating}</span>
                </span>
                <span style={{ color: '#A8A29E' }}>|</span>
                <span style={{ color: '#78716C' }}>{selectedMentor.reviewCount} reviews</span>
                <span style={{ color: '#A8A29E' }}>|</span>
                <span style={{ color: '#78716C' }}>{selectedMentor.sessionCount} sessions</span>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '8px' }}>About</label>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1C1917', lineHeight: 1.6 }}>
                  {selectedMentor.bio}
                </p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '8px' }}>Expertise</label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedMentor.expertise.map(exp => (
                    <span key={exp} style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(105, 108, 255, 0.08)',
                      color: '#696cff',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 500
                    }}>
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div style={{ padding: '12px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#1C1917' }}>{selectedMentor.location}</p>
                  </div>
                </div>
                <div className="col-6">
                  <div style={{ padding: '12px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Languages</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#1C1917' }}>{selectedMentor.languages.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E7E5E4', backgroundColor: '#FAFAF9', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSelectedMentor(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #E7E5E4',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#78716C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <MessageSquare size={16} />
                Message
              </button>
              <button
                disabled={!selectedMentor.isAvailable}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: selectedMentor.isAvailable ? '#696cff' : '#E7E5E4',
                  color: selectedMentor.isAvailable ? '#FFFFFF' : '#A8A29E',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: selectedMentor.isAvailable ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Video size={16} />
                Book Session
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FindMentor;
