import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  ArrowUp, 
  BookOpen, 
  Download, 
  Eye, 
  FileText,
  Briefcase,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  MessageSquare,
  Calendar,
  Star,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { colors } from './pages/shared/PageWrapper';

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

// WeekCalendar Component
const WeekCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startOfCurrentWeek = dayjs(selectedDate).startOf('week');

  const daysOfWeek = Array.from({ length: 7 }, (_, index) =>
    startOfCurrentWeek.add(index, 'day')
  );

  const daysOfWeekLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => {
    const newDate = dayjs(selectedDate).subtract(1, 'month');
    setSelectedDate(newDate.toDate());
  };

  const handleNextMonth = () => {
    const newDate = dayjs(selectedDate).add(1, 'month');
    setSelectedDate(newDate.toDate());
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={handlePrevMonth}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#54577A',
          }}
        >
          <span style={{ fontSize: '1rem' }}>‹</span>
        </button>
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#141522',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {dayjs(selectedDate).format('MMMM YYYY')}
        </div>
        <button
          onClick={handleNextMonth}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#54577A',
          }}
        >
          <span style={{ fontSize: '1rem' }}>›</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {daysOfWeek.map((day, index) => {
          const isToday = day.isSame(new Date(), 'day');
          return (
            <div
              key={day.format('YYYY-MM-DD')}
              onClick={() => setSelectedDate(day.toDate())}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '40px',
                padding: '0.75rem 0',
                gap: '1.25rem',
                borderRadius: '1rem',
                backgroundColor: isToday ? '#141522' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  fontSize: '0.875rem',
                  color: isToday ? '#FFFFFF' : '#141522',
                  fontWeight: 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {daysOfWeekLetters[index]}
              </div>
              <div
                style={{
                  height: '32px',
                  width: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: isToday ? '#546FFF' : '#F5F5F7',
                }}
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isToday ? '#FFFFFF' : '#141522',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {day.format('D')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [applicationViewMode, setApplicationViewMode] = useState<'cards' | 'table'>('cards');
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - In production, fetch from Supabase
  const [recentApplications] = useState([
    {
      id: '1',
      jobTitle: 'Software Developer',
      company: 'Tech Solutions Inc.',
      appliedDate: '2 days ago',
      status: 'pending',
      matchScore: 85
    },
    {
      id: '2',
      jobTitle: 'Marketing Manager',
      company: 'Creative Agency Ltd',
      appliedDate: '5 days ago',
      status: 'shortlisted',
      matchScore: 92
    },
    {
      id: '3',
      jobTitle: 'Data Analyst',
      company: 'Analytics Pro',
      appliedDate: '1 week ago',
      status: 'pending',
      matchScore: 78
    },
    {
      id: '4',
      jobTitle: 'Project Coordinator',
      company: 'Global Enterprises',
      appliedDate: '1 week ago',
      status: 'rejected',
      matchScore: 65
    },
  ]);

  // Stats
  const stats = {
    totalApplications: 12,
    pending: 5,
    shortlisted: 4,
    rejected: 3,
    savedJobs: 8,
    savedScholarships: 6,
    coursesInProgress: 2,
    completedCourses: 5,
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setApplicationViewMode('cards');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
          <Loader2
            size={32}
            className="mb-3"
            style={{ animation: 'spin 1s linear infinite', color: colors.primary }}
          />
          <p style={{ color: colors.textSecondary }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="h3 mb-3">
        <strong>User</strong> Dashboard
      </h1>

      {/* Welcome Card and Metrics Row */}
      <div className="row mb-4">
        {/* Welcome Card - Left Side */}
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="d-flex align-items-end row">
              <div className="col-sm-7">
                <div className="card-body">
                  <h5 className="card-title text-primary">Welcome Back! 🎉</h5>
                  <p className="mb-4">
                    Track your job applications, manage your learning progress, and explore new opportunities all in one place.
                  </p>
                  <Button 
                    variant="default" 
                    size="default"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/jobs');
                    }}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Browse Jobs
                  </Button>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    src="/sneat-assets/img/illustrations/man-with-laptop-light.png"
                    height="140"
                    alt="User Dashboard"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards - Right Side (2x2 Grid) */}
        <div className="col-lg-6 col-md-12">
          <div className="row g-3">
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(105, 108, 255, 0.1)', borderRadius: '8px' }}>
                        <Briefcase size={24} style={{ color: colors.textSecondary }} />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Job Applications</span>
                  <h3 className="card-title mb-2">{stats.totalApplications}</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +25%
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 171, 0, 0.1)', borderRadius: '8px' }}>
                        <Award size={24} style={{ color: colors.textSecondary }} />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Saved Scholarships</span>
                  <h3 className="card-title mb-2">{stats.savedScholarships}</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +10%
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(3, 195, 236, 0.1)', borderRadius: '8px' }}>
                        <BookOpen size={24} style={{ color: colors.textSecondary }} />
                      </div>
                    </div>
                  </div>
                  <span className="d-block mb-1">Courses</span>
                  <h3 className="card-title text-nowrap mb-2">{stats.coursesInProgress} Active</h3>
                  <small className="text-muted fw-semibold">
                    {stats.completedCourses} Completed
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(45, 90, 71, 0.1)', borderRadius: '8px' }}>
                        <Star size={24} style={{ color: colors.textSecondary }} />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Saved Jobs</span>
                  <h3 className="card-title mb-2">{stats.savedJobs}</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <TrendingUp size={14} style={{ display: 'inline-block' }} />
                    Keep saving!
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications & Calendar Row */}
      <div className="row mb-4">
        {/* Recent Applications Section */}
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title m-0 me-2">Recent Applications</h5>
              <div className="d-flex align-items-center gap-2">
                {/* View Toggle - Hidden on mobile */}
                <div
                  className="d-none d-md-flex"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#FFFFFF',
                    border: '1px solid #E7E5E4',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setApplicationViewMode('cards')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      border: 'none',
                      background: applicationViewMode === 'cards' ? '#696cff' : 'transparent',
                      color: applicationViewMode === 'cards' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicationViewMode('table')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      border: 'none',
                      background: applicationViewMode === 'table' ? '#696cff' : 'transparent',
                      color: applicationViewMode === 'table' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ListIcon size={16} />
                  </button>
                </div>
                <Link
                  to="/userprofile/jobs/applications"
                  className="group relative inline-block text-sm font-medium text-[#696cff] transition-colors duration-300 hover:text-[#5a5de0]"
                  style={{ textDecoration: 'none' }}
                >
                  <motion.span
                    className="relative inline-block pb-1 flex items-center gap-1.5"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <ArrowRight size={14} />
                    View All
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-[#696cff] transition-all duration-300 group-hover:bg-[#5a5de0]"
                      style={{
                        width: 'calc(100% + 14px)',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                      }}
                    />
                  </motion.span>
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              {recentApplications.length === 0 ? (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: '#FAFAF9',
                  borderRadius: '0 0 10px 10px',
                }}>
                  <Briefcase size={48} style={{ color: '#A8A29E', margin: '0 auto 16px' }} />
                  <h6 style={{
                    fontFamily: "'Crimson Text', Georgia, serif",
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1C1917',
                    margin: '0 0 8px 0',
                  }}>
                    No applications yet
                  </h6>
                  <p style={{
                    fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                    fontSize: '0.875rem',
                    color: '#78716C',
                    margin: '0 0 20px 0',
                  }}>
                    Start applying to jobs to track your progress here!
                  </p>
                  <Link
                    to="/jobs"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#696cff',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (applicationViewMode === 'cards' || isMobile) ? (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentApplications.slice(0, 5).map((app) => (
                    <Link
                      key={app.id}
                      to={`/userprofile/jobs/applications/${app.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: '#FFFFFF',
                        border: '1px solid #E7E5E4',
                        borderRadius: '10px',
                        padding: '20px 24px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D6D3D1';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E7E5E4';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="avatar flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                        <div className="avatar-initial rounded-circle" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, backgroundColor: colors.bgLight, color: colors.textSecondary }}>
                          {app.company.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6 style={{
                          fontFamily: "'Crimson Text', Georgia, serif",
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1C1917',
                          margin: 0,
                          marginBottom: '4px',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {app.jobTitle}
                        </h6>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          color: '#78716C',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {app.company}
                        </p>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.75rem',
                          color: '#A8A29E',
                          margin: '4px 0 0 0',
                        }}>
                          {app.appliedDate}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '4px',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.875rem',
                          color: '#1C1917',
                        }}>
                          {app.matchScore}%
                        </span>
                        <span style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.75rem',
                          color: '#78716C',
                        }}>
                          Match
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #E7E5E4',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 100px',
                    alignItems: 'center',
                    padding: '14px 20px',
                    background: '#FAFAF9',
                    borderBottom: '1px solid #E7E5E4',
                    fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#78716C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    <span>Application</span>
                    <span style={{ textAlign: 'right' }}>Match</span>
                    <span style={{ textAlign: 'right' }}>Status</span>
                  </div>
                  {recentApplications.slice(0, 5).map((app, index) => (
                    <Link
                      key={app.id}
                      to={`/userprofile/jobs/applications/${app.id}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 120px 100px',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        borderBottom: '1px solid #E7E5E4',
                        transition: 'background-color 0.15s ease',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAF9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <h6 style={{
                          fontFamily: "'Crimson Text', Georgia, serif",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#1C1917',
                          margin: 0,
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {app.jobTitle}
                        </h6>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          color: '#78716C',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {app.company}
                        </p>
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.9375rem',
                        color: '#1C1917',
                        textAlign: 'right',
                      }}>
                        {app.matchScore}%
                      </div>
                      <div style={{
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.8125rem',
                        color: '#78716C',
                        textAlign: 'right',
                        textTransform: 'capitalize',
                      }}>
                        {app.status}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="row g-3">
            <div className="col-12">
              <WeekCalendar />
            </div>
            <div className="col-12">
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <h5 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#141522',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  Quick Actions
                </h5>
                <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                  <Link
                    to="/jobs"
                    className="btn"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      backgroundColor: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <Briefcase size={14} />
                    Browse Jobs
                  </Link>
                  <Link
                    to="/scholarship-hub"
                    className="btn"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      backgroundColor: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <Award size={14} />
                    Scholarships
                  </Link>
                  <Link
                    to="/userprofile/courses"
                    className="btn"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      backgroundColor: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <BookOpen size={14} />
                    My Courses
                  </Link>
                  <Link
                    to="/jobs/cv-builder"
                    className="btn"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      backgroundColor: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <FileText size={14} />
                    CV Builder
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Scholarships Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title m-0 me-2">Saved Scholarships</h5>
              <Link
                to="/userprofile/scholarships/saved"
                className="group relative inline-block text-sm font-medium text-[#696cff] transition-colors duration-300 hover:text-[#5a5de0]"
                style={{ textDecoration: 'none' }}
              >
                <motion.span
                  className="relative inline-block pb-1 flex items-center gap-1.5"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight size={14} />
                  View All
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-[#696cff] transition-all duration-300 group-hover:bg-[#5a5de0]"
                    style={{
                      width: 'calc(100% + 14px)',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    }}
                  />
                </motion.span>
              </Link>
            </div>
            <div className="card-body">
              {stats.savedScholarships === 0 ? (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: '#FAFAF9',
                  borderRadius: '8px',
                }}>
                  <Award size={48} style={{ color: '#A8A29E', margin: '0 auto 16px' }} />
                  <h6 style={{
                    fontFamily: "'Crimson Text', Georgia, serif",
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1C1917',
                    margin: '0 0 8px 0',
                  }}>
                    No saved scholarships yet
                  </h6>
                  <p style={{
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    color: '#78716C',
                    margin: '0 0 16px 0',
                  }}>
                    Start saving scholarships you're interested in for quick access
                  </p>
                  <Link
                    to="/scholarships"
                    className="btn"
                    style={{
                      fontSize: '0.875rem',
                      padding: '0.625rem 1.25rem',
                      backgroundColor: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Award size={16} />
                    Browse Scholarships
                  </Link>
                  </div>
              ) : (
                <div className="row g-3">
                  {/* Mock saved scholarships - replace with actual data */}
                  {[
                    { id: '1', title: 'Mastercard Foundation Scholars Program', provider: 'Mastercard Foundation', deadline: '2024-03-15' },
                    { id: '2', title: 'Chevening Scholarships', provider: 'UK Government', deadline: '2024-11-01' },
                    { id: '3', title: 'Ghana Education Trust Fund (GETFund)', provider: 'GETFund', deadline: '2024-05-30' },
                  ].slice(0, 3).map((scholarship) => (
                    <div key={scholarship.id} className="col-md-4 col-sm-6">
                      <div className="card h-100" style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
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
                          <div className="d-flex align-items-start justify-content-between mb-2">
                            <div style={{
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(105, 108, 255, 0.1)',
                              borderRadius: '8px',
                              flexShrink: 0
                            }}>
                              <Award size={20} style={{ color: colors.primary }} />
                    </div>
                  </div>
                          <h6 style={{
                            fontFamily: "'Crimson Text', Georgia, serif",
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: '#1C1917',
                            marginBottom: '4px',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {scholarship.title}
                          </h6>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#78716C',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {scholarship.provider}
                          </p>
                          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                            <Calendar size={12} />
                            <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                    </div>
                  </div>
                  </div>
                  ))}
                    </div>
              )}
                  </div>
                  </div>
            </div>
          </div>

    </>
  );
};

export default Dashboard;
