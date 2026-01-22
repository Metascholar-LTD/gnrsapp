import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Play,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Calendar,
  Award,
  Loader2,
  FileQuestion,
  RefreshCw,
  Zap,
  BookOpen
} from 'lucide-react';

// Types
interface QuestionSet {
  id: string;
  title: string;
  examType: 'WASSCE' | 'BECE' | 'University';
  subject: string;
  year: string;
  paper: string;
  totalQuestions: number;
  completedQuestions: number;
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  lastAttempt?: string;
  timeSpent?: string;
}

interface PerformanceData {
  subject: string;
  score: number;
  attempts: number;
  trend: 'up' | 'down' | 'stable';
}

// Mock data
const mockQuestionSets: QuestionSet[] = [
  {
    id: '1',
    title: 'WASSCE Mathematics 2023',
    examType: 'WASSCE',
    subject: 'Mathematics',
    year: '2023',
    paper: 'Paper 1',
    totalQuestions: 50,
    completedQuestions: 50,
    status: 'completed',
    score: 85,
    lastAttempt: '2 days ago',
    timeSpent: '1h 45m'
  },
  {
    id: '2',
    title: 'WASSCE English Language 2023',
    examType: 'WASSCE',
    subject: 'English Language',
    year: '2023',
    paper: 'Paper 2',
    totalQuestions: 60,
    completedQuestions: 35,
    status: 'in-progress',
    lastAttempt: '1 week ago',
    timeSpent: '45m'
  },
  {
    id: '3',
    title: 'BECE Integrated Science 2022',
    examType: 'BECE',
    subject: 'Integrated Science',
    year: '2022',
    paper: 'Paper 1',
    totalQuestions: 40,
    completedQuestions: 0,
    status: 'not-started'
  },
  {
    id: '4',
    title: 'KNUST Engineering Math 2022',
    examType: 'University',
    subject: 'Mathematics',
    year: '2022',
    paper: 'Mid-Semester',
    totalQuestions: 30,
    completedQuestions: 30,
    status: 'completed',
    score: 72,
    lastAttempt: '3 weeks ago',
    timeSpent: '2h 10m'
  },
  {
    id: '5',
    title: 'WASSCE Physics 2023',
    examType: 'WASSCE',
    subject: 'Physics',
    year: '2023',
    paper: 'Paper 1',
    totalQuestions: 45,
    completedQuestions: 20,
    status: 'in-progress',
    lastAttempt: '5 days ago',
    timeSpent: '30m'
  }
];

const mockPerformance: PerformanceData[] = [
  { subject: 'Mathematics', score: 85, attempts: 12, trend: 'up' },
  { subject: 'English', score: 78, attempts: 8, trend: 'stable' },
  { subject: 'Physics', score: 72, attempts: 6, trend: 'up' },
  { subject: 'Chemistry', score: 65, attempts: 4, trend: 'down' },
  { subject: 'Biology', score: 80, attempts: 5, trend: 'up' }
];

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'WASSCE', label: 'WASSCE' },
  { id: 'BECE', label: 'BECE' },
  { id: 'University', label: 'University' }
];

const statusFilters = [
  { id: 'all', label: 'All Status' },
  { id: 'not-started', label: 'Not Started' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' }
];

const PastQuestionsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuestionSets(mockQuestionSets);
      setPerformance(mockPerformance);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSets = questionSets
    .filter(q => examFilter === 'all' || q.examType === examFilter)
    .filter(q => statusFilter === 'all' || q.status === statusFilter)
    .filter(q =>
      searchQuery === '' ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    totalAttempted: questionSets.filter(q => q.status !== 'not-started').length,
    completed: questionSets.filter(q => q.status === 'completed').length,
    inProgress: questionSets.filter(q => q.status === 'in-progress').length,
    averageScore: Math.round(
      questionSets
        .filter(q => q.score)
        .reduce((sum, q) => sum + (q.score || 0), 0) /
      (questionSets.filter(q => q.score).length || 1)
    )
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'not-started': { bg: '#F5F5F5', text: '#78716C', border: '#E7E5E4' },
      'in-progress': { bg: 'rgba(255, 171, 0, 0.1)', text: '#ffab00', border: 'rgba(255, 171, 0, 0.3)' },
      'completed': { bg: 'rgba(113, 221, 55, 0.1)', text: '#71dd37', border: 'rgba(113, 221, 55, 0.3)' }
    };
    return colors[status] || colors['not-started'];
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={14} color="#71dd37" />;
    if (trend === 'down') return <TrendingUp size={14} color="#ff3e1d" style={{ transform: 'rotate(180deg)' }} />;
    return <span style={{ width: '14px', height: '2px', backgroundColor: '#78716C', display: 'inline-block' }} />;
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Loading past questions...</p>
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
            <strong>Past</strong> Questions
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Track your exam preparation progress
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button
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
              cursor: 'pointer'
            }}
          >
            <Zap size={16} />
            Quick Practice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(105, 108, 255, 0.1)',
                  borderRadius: '10px'
                }}>
                  <FileQuestion size={24} color="#696cff" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attempted</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.totalAttempted}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(113, 221, 55, 0.1)',
                  borderRadius: '10px'
                }}>
                  <CheckCircle2 size={24} color="#71dd37" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.completed}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 171, 0, 0.1)',
                  borderRadius: '10px'
                }}>
                  <Clock size={24} color="#ffab00" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.inProgress}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(3, 195, 236, 0.1)',
                  borderRadius: '10px'
                }}>
                  <Target size={24} color="#03c3ec" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Score</p>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#1C1917' }}>{stats.averageScore}%</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Question Sets Column */}
        <div className="col-lg-8">
          {/* Search and Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row gap-3">
                {/* Search */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E' }} />
                  <input
                    type="text"
                    placeholder="Search question sets..."
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

                {/* Exam Type Filter */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {filterOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setExamFilter(opt.id)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: examFilter === opt.id ? '#696cff' : '#F5F5F5',
                        color: examFilter === opt.id ? '#FFFFFF' : '#78716C',
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
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {statusFilters.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setStatusFilter(opt.id)}
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${statusFilter === opt.id ? '#696cff' : '#E7E5E4'}`,
                      borderRadius: '20px',
                      backgroundColor: statusFilter === opt.id ? 'rgba(105, 108, 255, 0.1)' : 'transparent',
                      color: statusFilter === opt.id ? '#696cff' : '#78716C',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Sets List */}
          {filteredSets.length === 0 ? (
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
                  <FileQuestion size={40} color="#A8A29E" />
                </div>
                <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
                  No question sets found
                </h5>
                <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
                  Start practicing to track your progress here
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
                  Browse Questions
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredSets.map((set, index) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="card"
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
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
                      <div className="d-flex align-items-start justify-content-between">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Header */}
                          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: set.examType === 'WASSCE' ? 'rgba(105, 108, 255, 0.1)' : set.examType === 'BECE' ? 'rgba(255, 171, 0, 0.1)' : 'rgba(3, 195, 236, 0.1)',
                              color: set.examType === 'WASSCE' ? '#696cff' : set.examType === 'BECE' ? '#ffab00' : '#03c3ec',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {set.examType}
                            </span>
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: getStatusColor(set.status).bg,
                              color: getStatusColor(set.status).text,
                              border: `1px solid ${getStatusColor(set.status).border}`,
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}>
                              {getStatusLabel(set.status)}
                            </span>
                          </div>

                          {/* Title */}
                          <h6 style={{
                            fontFamily: "'Crimson Text', Georgia, serif",
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#1C1917',
                            marginBottom: '8px'
                          }}>
                            {set.title}
                          </h6>

                          {/* Meta */}
                          <div className="d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                            <span>{set.subject}</span>
                            <span>•</span>
                            <span>{set.paper}</span>
                            <span>•</span>
                            <span>{set.year}</span>
                            {set.lastAttempt && (
                              <>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} />
                                  {set.lastAttempt}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {set.status !== 'not-started' && (
                            <div style={{ marginTop: '16px' }}>
                              <div className="d-flex justify-content-between mb-1">
                                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>
                                  {set.completedQuestions} of {set.totalQuestions} questions
                                </span>
                                {set.score !== undefined && (
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: set.score >= 70 ? '#71dd37' : set.score >= 50 ? '#ffab00' : '#ff3e1d' }}>
                                    Score: {set.score}%
                                  </span>
                                )}
                              </div>
                              <div style={{
                                height: '6px',
                                backgroundColor: '#F5F5F5',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${(set.completedQuestions / set.totalQuestions) * 100}%`,
                                  height: '100%',
                                  backgroundColor: set.status === 'completed' ? '#71dd37' : '#696cff',
                                  borderRadius: '3px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div style={{ marginLeft: '16px', flexShrink: 0 }}>
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '10px 16px',
                              backgroundColor: set.status === 'not-started' ? '#696cff' : set.status === 'in-progress' ? '#ffab00' : '#71dd37',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              fontFamily: "'Source Sans Pro', sans-serif",
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {set.status === 'not-started' && <Play size={14} />}
                            {set.status === 'in-progress' && <RefreshCw size={14} />}
                            {set.status === 'completed' && <RefreshCw size={14} />}
                            {set.status === 'not-started' ? 'Start' : set.status === 'in-progress' ? 'Continue' : 'Retake'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Analytics Column */}
        <div className="col-lg-4">
          {/* Performance Overview */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title m-0 d-flex align-items-center gap-2">
                <BarChart3 size={18} color="#696cff" />
                Performance Analytics
              </h6>
            </div>
            <div className="card-body">
              {performance.length === 0 ? (
                <div className="text-center py-4">
                  <BarChart3 size={40} color="#A8A29E" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#78716C', fontSize: '0.875rem' }}>Complete more questions to see analytics</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {performance.map((item, index) => (
                    <div key={item.subject}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1917' }}>{item.subject}</span>
                        <div className="d-flex align-items-center gap-2">
                          {getTrendIcon(item.trend)}
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#696cff' }}>{item.score}%</span>
                        </div>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          style={{
                            height: '100%',
                            backgroundColor: item.score >= 70 ? '#71dd37' : item.score >= 50 ? '#ffab00' : '#ff3e1d',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>{item.attempts} attempts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title m-0">Insights</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Award size={16} color="#71dd37" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917' }}>Strongest Subject</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#78716C', margin: 0, paddingLeft: '24px' }}>
                  Mathematics - You're excelling here!
                </p>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Target size={16} color="#ff3e1d" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917' }}>Needs Improvement</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#78716C', margin: 0, paddingLeft: '24px' }}>
                  Chemistry - Focus more practice here
                </p>
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="card-title m-0">Recent Attempts</h6>
              <Link to="#" style={{ fontSize: '0.8125rem', color: '#696cff', textDecoration: 'none' }}>View All</Link>
            </div>
            <div className="card-body p-0">
              {questionSets.filter(q => q.lastAttempt).slice(0, 3).map((set, index) => (
                <div
                  key={set.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: index < 2 ? '1px solid #F5F5F5' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#1C1917',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {set.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: 0 }}>{set.lastAttempt}</p>
                  </div>
                  {set.score !== undefined && (
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: set.score >= 70 ? 'rgba(113, 221, 55, 0.1)' : 'rgba(255, 171, 0, 0.1)',
                      color: set.score >= 70 ? '#71dd37' : '#ffab00',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginLeft: '8px',
                      flexShrink: 0
                    }}>
                      {set.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PastQuestionsPage;
