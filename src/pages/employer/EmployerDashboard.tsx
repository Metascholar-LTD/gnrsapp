import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Eye,
  MessageSquare,
  Download,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Mail,
  ArrowRight,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';

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

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [applicationViewMode, setApplicationViewMode] = useState<'cards' | 'table'>('cards');
  const [isMobile, setIsMobile] = useState(false);

  // Chart configuration matching sneat-1.0.0 exactly
  const chartConfig = {
    colors: {
      primary: '#696cff',
      secondary: '#8592a3',
      success: '#71dd37',
      info: '#03c3ec',
      warning: '#ffab00',
      danger: '#ff3e1d',
      dark: '#233446',
      black: '#000',
      white: '#fff',
      body: '#f4f5fb',
      headingColor: '#566a7f',
      axisColor: '#a1acb8',
      borderColor: '#eceef1'
    }
  };

  const cardColor = chartConfig.colors.white;
  const headingColor = chartConfig.colors.headingColor;
  const axisColor = chartConfig.colors.axisColor;
  const borderColor = chartConfig.colors.borderColor;
  const shadeColor = 'light';

  useEffect(() => {
    // Load ApexCharts CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/sneat-assets/vendor/libs/apex-charts/apex-charts.css';
    document.head.appendChild(link);

    // Load ApexCharts dynamically
    const loadApexCharts = async () => {
      if (typeof window !== 'undefined' && !(window as any).ApexCharts) {
        const script = document.createElement('script');
        script.src = '/sneat-assets/vendor/libs/apex-charts/apexcharts.js';
        script.onload = () => {
          initializeCharts();
        };
        document.head.appendChild(script);
      } else if ((window as any).ApexCharts) {
        initializeCharts();
      }
    };

    const initializeCharts = () => {
      const ApexCharts = (window as any).ApexCharts;
      if (!ApexCharts) return;

    };

    loadApexCharts();
  }, []);

  // Force cards view on mobile
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
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [recentApplications] = useState([
    {
      id: 1,
      candidateName: 'Kwame Mensah',
      jobTitle: 'Senior Software Engineer',
      appliedDate: '2 hours ago',
      status: 'pending',
      matchScore: 92
    },
    {
      id: 2,
      candidateName: 'Ama Osei',
      jobTitle: 'Marketing Manager',
      appliedDate: '5 hours ago',
      status: 'shortlisted',
      matchScore: 88
    },
    {
      id: 3,
      candidateName: 'Kofi Asante',
      jobTitle: 'Data Analyst',
      appliedDate: '1 day ago',
      status: 'pending',
      matchScore: 85
    },
    {
      id: 4,
      candidateName: 'Efua Adjei',
      jobTitle: 'Product Designer',
      appliedDate: '2 days ago',
      status: 'shortlisted',
      matchScore: 90
    }
  ]);

  return (
    <>
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
                    Your employer dashboard is ready. Manage your job listings, track applications, and find the best candidates.
                  </p>
                   <Button 
                     variant="default" 
                     size="default"
                     onClick={(e) => {
                       e.preventDefault();
                       navigate('/employer/job-listings/post');
                     }}
                     style={{
                       fontFamily: "'Plus Jakarta Sans', sans-serif",
                     }}
                   >
                     Post New Job
                   </Button>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    src="/sneat-assets/img/illustrations/man-with-laptop-light.png"
                    height="140"
                    alt="Employer Dashboard"
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
                        <Briefcase size={24} color="#696cff" />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Active Jobs</span>
                  <h3 className="card-title mb-2">12</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +15.2%
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(113, 221, 55, 0.1)', borderRadius: '8px' }}>
                        <FileText size={24} color="#71dd37" />
                      </div>
                    </div>
                  </div>
                  <span>Applications</span>
                  <h3 className="card-title text-nowrap mb-1">145</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +28.4%
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
                        <Users size={24} color="#03c3ec" />
                      </div>
                    </div>
                  </div>
                  <span className="d-block mb-1">Shortlisted</span>
                  <h3 className="card-title text-nowrap mb-2">23</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +12.5%
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
                        <Eye size={24} color="#ffab00" />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Views</span>
                  <h3 className="card-title mb-2">1,240</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +18.7%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section and Calendar Row */}
      <div className="row mb-4">
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
                    onMouseEnter={(e) => {
                      if (applicationViewMode !== 'cards') {
                        e.currentTarget.style.background = '#F5F5F4';
                        e.currentTarget.style.color = '#57534E';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (applicationViewMode !== 'cards') {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#78716C';
                      }
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
                    onMouseEnter={(e) => {
                      if (applicationViewMode !== 'table') {
                        e.currentTarget.style.background = '#F5F5F4';
                        e.currentTarget.style.color = '#57534E';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (applicationViewMode !== 'table') {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#78716C';
                      }
                    }}
                  >
                    <ListIcon size={16} />
                  </button>
                      </div>
                {/* View All Button */}
                <Link 
                  to="/employer/applications/all"
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
                  <FileText size={48} style={{ color: '#A8A29E', margin: '0 auto 16px' }} />
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
                    Applications will appear here as candidates apply to your jobs
                  </p>
                </div>
              ) : (applicationViewMode === 'cards' || isMobile) ? (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentApplications.slice(0, 5).map((app) => (
                    <Link
                      key={app.id}
                      to={`/employer/applications/${app.id}`}
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
                      <div className="avatar flex-shrink-0">
                        <div className="avatar-initial rounded-circle bg-label-primary" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#696cff' }}>
                          {app.candidateName.split(' ').map((n: string) => n[0]).join('')}
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
                          {app.candidateName}
                        </h6>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          color: '#78716C',
                          margin: 0,
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {app.jobTitle}
                        </p>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.75rem',
                          color: '#A8A29E',
                          margin: 0,
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
                    gridTemplateColumns: '1fr 140px 120px 100px',
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
                    <span>Candidate</span>
                    <span style={{ textAlign: 'right' }}>Job Title</span>
                    <span style={{ textAlign: 'right' }}>Match</span>
                    <span style={{ textAlign: 'right' }}>Date</span>
                  </div>
                  {recentApplications.slice(0, 5).map((app, index) => (
                    <Link
                      key={app.id}
                      to={`/employer/applications/${app.id}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 140px 120px 100px',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: index === 0 ? 'linear-gradient(90deg, rgba(105, 108, 255, 0.03) 0%, transparent 50%)' : '#FFFFFF',
                        borderBottom: '1px solid #E7E5E4',
                        transition: 'background-color 0.15s ease',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAF9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index === 0 ? 'linear-gradient(90deg, rgba(105, 108, 255, 0.03) 0%, transparent 50%)' : '#FFFFFF';
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
                          {app.candidateName}
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
                          {app.appliedDate}
                        </p>
                </div>
                      <div style={{
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.875rem',
                        color: '#78716C',
                        textAlign: 'right',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {app.jobTitle}
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
                      }}>
                        {app.appliedDate}
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
                <div className="d-flex gap-2" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                  <Link 
                    to="/employer/job-listings/post" 
                    className="btn"
                    style={{ 
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      backgroundColor: '#696cff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5a5de0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#696cff';
                    }}
                  >
                    <Plus size={14} />
                    Post Job
                  </Link>
                  <Link 
                    to="/employer/applications/pending" 
                    className="btn"
                    style={{ 
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      backgroundColor: '#ffab00',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e69900';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffab00';
                    }}
                  >
                    <Clock size={14} />
                    Pending (8)
                  </Link>
                  <Link 
                    to="/employer/candidates/shortlist" 
                    className="btn"
                    style={{ 
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      backgroundColor: '#03c3ec',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#02a8c4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#03c3ec';
                    }}
                  >
                    <Users size={14} />
                    Shortlist
                  </Link>
                  <Link 
                    to="/employer/analytics" 
                    className="btn"
                    style={{ 
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      backgroundColor: '#8592a3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6d7a8a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#8592a3';
                    }}
                  >
                    <TrendingUp size={14} />
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default EmployerDashboard;
