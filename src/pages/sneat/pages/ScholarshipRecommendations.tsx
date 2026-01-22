import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ExternalLink,
  Loader2,
  GraduationCap,
  Award,
  Building2,
  Calendar,
  Target,
  Settings,
  AlertCircle,
  ArrowRight,
  DollarSign,
  MapPin,
  Users
} from 'lucide-react';
import PageWrapper, { colors } from './shared/PageWrapper';

// Types
interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerLogo?: string;
  amount: string;
  currency: string;
  coverageType: 'Full' | 'Partial' | 'Stipend';
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  eligibility: {
    criteria: string;
    matched: boolean;
  }[];
  fieldOfStudy: string[];
  levelOfStudy: string;
  location: string;
  applicants?: number;
  isSaved: boolean;
}

// Mock data
const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'GETFund Scholarship 2024',
    provider: 'Ghana Education Trust Fund',
    amount: '50,000',
    currency: 'GHS',
    coverageType: 'Full',
    deadline: '2024-03-15',
    matchScore: 95,
    matchReasons: ['Matches your field of study', 'Eligible GPA requirement', 'Open to Ghanaian students'],
    eligibility: [
      { criteria: 'Ghanaian citizenship', matched: true },
      { criteria: 'CGPA of 3.0 or above', matched: true },
      { criteria: 'Enrolled in accredited university', matched: true },
      { criteria: 'Financial need demonstrated', matched: true }
    ],
    fieldOfStudy: ['Engineering', 'Science', 'Technology'],
    levelOfStudy: 'Undergraduate',
    location: 'Ghana',
    applicants: 2500,
    isSaved: false
  },
  {
    id: '2',
    name: 'MTN Foundation Scholarship',
    provider: 'MTN Ghana Foundation',
    amount: '25,000',
    currency: 'GHS',
    coverageType: 'Partial',
    deadline: '2024-04-30',
    matchScore: 88,
    matchReasons: ['Strong academic performance', 'Community involvement bonus', 'STEM field preferred'],
    eligibility: [
      { criteria: 'Ghanaian citizenship', matched: true },
      { criteria: 'CGPA of 3.5 or above', matched: true },
      { criteria: 'STEM field of study', matched: true },
      { criteria: 'Leadership experience', matched: false }
    ],
    fieldOfStudy: ['Technology', 'Engineering', 'Mathematics'],
    levelOfStudy: 'Undergraduate',
    location: 'Ghana',
    applicants: 1800,
    isSaved: true
  },
  {
    id: '3',
    name: 'Mastercard Foundation Scholars Program',
    provider: 'Mastercard Foundation',
    amount: '150,000',
    currency: 'USD',
    coverageType: 'Full',
    deadline: '2024-05-15',
    matchScore: 82,
    matchReasons: ['Excellent academic record', 'Demonstrates financial need', 'Leadership potential'],
    eligibility: [
      { criteria: 'African citizenship', matched: true },
      { criteria: 'Financial need', matched: true },
      { criteria: 'Academic excellence', matched: true },
      { criteria: 'Community service record', matched: false }
    ],
    fieldOfStudy: ['All fields'],
    levelOfStudy: 'Undergraduate/Graduate',
    location: 'International',
    applicants: 5000,
    isSaved: false
  },
  {
    id: '4',
    name: 'GNPC Foundation Scholarship',
    provider: 'Ghana National Petroleum Corporation',
    amount: '75,000',
    currency: 'GHS',
    coverageType: 'Full',
    deadline: '2024-02-28',
    matchScore: 78,
    matchReasons: ['Engineering field match', 'Good academic standing', 'Energy sector focus'],
    eligibility: [
      { criteria: 'Ghanaian citizenship', matched: true },
      { criteria: 'Engineering/Science major', matched: true },
      { criteria: 'CGPA of 3.2 or above', matched: true },
      { criteria: 'Research interest in energy', matched: false }
    ],
    fieldOfStudy: ['Petroleum Engineering', 'Chemical Engineering', 'Geology'],
    levelOfStudy: 'Undergraduate/Graduate',
    location: 'Ghana',
    applicants: 1200,
    isSaved: false
  },
  {
    id: '5',
    name: 'Commonwealth Scholarship',
    provider: 'Commonwealth Secretariat',
    amount: '100,000',
    currency: 'GBP',
    coverageType: 'Full',
    deadline: '2024-06-30',
    matchScore: 72,
    matchReasons: ['Commonwealth citizen', 'Academic merit', 'Development impact focus'],
    eligibility: [
      { criteria: 'Commonwealth citizenship', matched: true },
      { criteria: 'Masters/PhD level', matched: false },
      { criteria: 'Work experience', matched: false },
      { criteria: 'Development impact plan', matched: true }
    ],
    fieldOfStudy: ['All fields'],
    levelOfStudy: 'Postgraduate',
    location: 'United Kingdom',
    applicants: 8000,
    isSaved: false
  }
];

const filterOptions = [
  { id: 'all', label: 'All Matches' },
  { id: 'high', label: '80%+ Match' },
  { id: 'eligible', label: 'Fully Eligible' },
  { id: 'deadline', label: 'Closing Soon' }
];

const ScholarshipRecommendations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [profileComplete, setProfileComplete] = useState(75);

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
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (id: string) => {
    setScholarships(scholarships.map(s =>
      s.id === id ? { ...s, isSaved: !s.isSaved } : s
    ));
  };

  const filteredScholarships = scholarships
    .filter(s => {
      if (activeFilter === 'high') return s.matchScore >= 80;
      if (activeFilter === 'eligible') return s.eligibility.every(e => e.matched);
      if (activeFilter === 'deadline') {
        const daysLeft = Math.ceil((new Date(s.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 30;
      }
      return true;
    })
    .filter(s =>
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === 'amount') return parseInt(b.amount.replace(/,/g, '')) - parseInt(a.amount.replace(/,/g, ''));
      return 0;
    });

  const getMatchScoreColor = (score: number) => {
    return colors.primary;
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
            <p style={{ color: colors.textSecondary, fontFamily: "'Source Sans Pro', sans-serif" }}>Finding best matches...</p>
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
            <strong>Scholarship</strong> Recommendations
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Personalized scholarship matches based on your profile
          </p>
        </div>
        <Link
          to="/userprofile/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#696cff',
            border: '1px solid #696cff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            marginTop: isMobile ? '12px' : 0
          }}
        >
          <Settings size={16} />
          Update Profile
        </Link>
      </div>

      {/* Profile Completeness Alert */}
      {profileComplete < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-4"
          style={{ border: '1px solid rgba(255, 171, 0, 0.3)', backgroundColor: 'rgba(255, 171, 0, 0.05)' }}
        >
          <div className="card-body py-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bgLight,
                  borderRadius: '10px'
                }}>
                  <AlertCircle size={20} style={{ color: colors.textSecondary }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: 0 }}>
                    Complete your profile for better recommendations
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: '#78716C', margin: 0 }}>
                    Your profile is {profileComplete}% complete. Add more details to improve match accuracy.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '120px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#78716C' }}>Progress</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.textSecondary }}>{profileComplete}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: colors.borderLight, borderRadius: '3px' }}>
                    <div style={{ width: `${profileComplete}%`, height: '100%', backgroundColor: colors.primary, borderRadius: '3px' }} />
                  </div>
                </div>
                <Link
                  to="/userprofile/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: colors.primary,
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  Complete
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Summary */}
      <div className="row g-3 mb-4">
            <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primaryLight,
                  borderRadius: '10px'
                }}>
                  <Sparkles size={24} color={colors.primary} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>Total Matches</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{scholarships.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primaryLight,
                  borderRadius: '10px'
                }}>
                  <Target size={24} color={colors.primary} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>High Matches (80%+)</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>
                    {scholarships.filter(s => s.matchScore >= 80).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primaryLight,
                  borderRadius: '10px'
                }}>
                  <Clock size={24} color={colors.primary} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C' }}>Closing Soon</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>
                    {scholarships.filter(s => getDaysRemaining(s.deadline) <= 30).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row gap-3">
            {/* Search */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
              <input
                type="text"
                placeholder="Search scholarships..."
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

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filterOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '20px',
                    backgroundColor: activeFilter === opt.id ? '#696cff' : '#F5F5F5',
                    color: activeFilter === opt.id ? '#FFFFFF' : '#78716C',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 36px 10px 12px',
                border: '1px solid #E7E5E4',
                borderRadius: '8px',
                fontFamily: "'Source Sans Pro', sans-serif",
                fontSize: '0.875rem',
                backgroundColor: '#FFFFFF',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                cursor: 'pointer',
                minWidth: '140px'
              }}
            >
              <option value="match">Best Match</option>
              <option value="deadline">Deadline</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scholarships List */}
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
              <GraduationCap size={40} color="#A8A29E" />
            </div>
            <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
              No scholarships found
            </h5>
            <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
              Try adjusting your filters or complete your profile for better matches
            </p>
            <Link
              to="/userprofile/profile"
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
              <Settings size={18} />
              Update Profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {filteredScholarships.map((scholarship, index) => {
            const daysRemaining = getDaysRemaining(scholarship.deadline);
            const isExpanded = expandedCard === scholarship.id;
            const eligibleCount = scholarship.eligibility.filter(e => e.matched).length;

            return (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="card"
                  style={{
                    transition: 'all 0.2s ease',
                    border: '1px solid #E7E5E4'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="card-body">
                    <div className="row align-items-start">
                      {/* Match Score Circle */}
                      <div className="col-auto">
                        <div style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          background: `conic-gradient(${getMatchScoreColor(scholarship.matchScore)} ${scholarship.matchScore * 3.6}deg, #F5F5F5 0deg)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <span style={{
                              fontSize: '1.125rem',
                              fontWeight: 700,
                              color: getMatchScoreColor(scholarship.matchScore)
                            }}>
                              {scholarship.matchScore}%
                            </span>
                            <span style={{ fontSize: '0.625rem', color: '#A8A29E' }}>Match</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="col" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              {scholarship.matchScore >= 90 && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  backgroundColor: colors.bgLight,
                                  color: colors.textSecondary,
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }}>
                                  <Sparkles size={12} style={{ color: colors.textMuted }} />
                                  Top Match
                                </span>
                              )}
                              <span style={{
                                padding: '3px 8px',
                                backgroundColor: '#F5F5F5',
                                color: '#78716C',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 500
                              }}>
                                {scholarship.coverageType}
                              </span>
                            </div>
                            <h5 style={{
                              fontFamily: "'Crimson Text', Georgia, serif",
                              fontSize: '1.125rem',
                              fontWeight: 600,
                              color: '#1C1917',
                              margin: '4px 0'
                            }}>
                              {scholarship.name}
                            </h5>
                            <p style={{ fontSize: '0.875rem', color: '#78716C', margin: 0 }}>
                              {scholarship.provider}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSave(scholarship.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px',
                              cursor: 'pointer',
                              color: scholarship.isSaved ? '#696cff' : '#A8A29E'
                            }}
                          >
                            {scholarship.isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                          </button>
                        </div>

                        {/* Match Reasons */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {scholarship.matchReasons.slice(0, 3).map((reason, i) => (
                            <span
                              key={i}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                backgroundColor: colors.bgLight,
                                color: colors.textSecondary,
                                borderRadius: '4px',
                                fontSize: '0.75rem'
                              }}
                            >
                              <CheckCircle2 size={12} style={{ color: colors.textMuted }} />
                              {reason}
                            </span>
                          ))}
                        </div>

                        {/* Meta Row */}
                        <div className="d-flex flex-wrap gap-4" style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                          <span className="d-flex align-items-center gap-1">
                            <DollarSign size={14} />
                            {scholarship.currency} {scholarship.amount}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <Calendar size={14} />
                            {daysRemaining > 0 ? (
                              <span style={{ color: colors.textSecondary }}>
                                {daysRemaining} days left
                              </span>
                            ) : (
                              <span style={{ color: colors.textMuted }}>Expired</span>
                            )}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <MapPin size={14} />
                            {scholarship.location}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <GraduationCap size={14} />
                            {scholarship.levelOfStudy}
                          </span>
                          {scholarship.applicants && (
                            <span className="d-flex align-items-center gap-1">
                              <Users size={14} />
                              {scholarship.applicants.toLocaleString()} applicants
                            </span>
                          )}
                        </div>

                        {/* Expandable Eligibility Section */}
                        <div style={{ marginTop: '16px' }}>
                          <button
                            onClick={() => setExpandedCard(isExpanded ? null : scholarship.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: '#696cff',
                              fontSize: '0.8125rem',
                              fontWeight: 500
                            }}
                          >
                            <Target size={14} />
                            Eligibility: {eligibleCount}/{scholarship.eligibility.length} criteria met
                            <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                          </button>

                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F5F5F5' }}
                            >
                              <div className="row g-2">
                                {scholarship.eligibility.map((item, i) => (
                                  <div key={i} className="col-md-6">
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        backgroundColor: item.matched ? 'rgba(113, 221, 55, 0.08)' : 'rgba(255, 62, 29, 0.08)',
                                        borderRadius: '6px'
                                      }}
                                    >
                                      {item.matched ? (
                                        <CheckCircle2 size={16} color="#71dd37" />
                                      ) : (
                                        <XCircle size={16} color="#ff3e1d" />
                                      )}
                                      <span style={{
                                        fontSize: '0.8125rem',
                                        color: item.matched ? '#71dd37' : '#ff3e1d'
                                      }}>
                                        {item.criteria}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="col-auto mt-3 mt-lg-0">
                        <div className="d-flex flex-column gap-2">
                          <Link
                            to={`/scholarship/${scholarship.id}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '10px 20px',
                              backgroundColor: '#696cff',
                              color: '#FFFFFF',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              justifyContent: 'center'
                            }}
                          >
                            Apply Now
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '10px 20px',
                              backgroundColor: 'transparent',
                              color: '#696cff',
                              border: '1px solid #696cff',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              justifyContent: 'center'
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </PageWrapper>
  );
};

export default ScholarshipRecommendations;
