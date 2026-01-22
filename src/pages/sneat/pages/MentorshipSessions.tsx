import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Filter,
  Loader2,
  Plus,
  ExternalLink,
  MapPin,
  CalendarDays
} from 'lucide-react';

// Types
interface Session {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorAvatar?: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  meetingType: 'video' | 'in-person' | 'chat';
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
  actionItems?: string[];
  recordingUrl?: string;
}

// Mock data
const mockSessions: Session[] = [
  {
    id: '1',
    mentorName: 'Dr. Kwame Asante',
    mentorTitle: 'Software Engineering Lead at Google',
    topic: 'Career Path in Tech: From Junior to Senior',
    date: '2024-01-25',
    time: '10:00 AM',
    duration: '60 min',
    status: 'scheduled',
    meetingType: 'video',
    notes: 'Prepare questions about transitioning from backend to full-stack development'
  },
  {
    id: '2',
    mentorName: 'Prof. Ama Serwaa',
    mentorTitle: 'Research Scientist at MIT',
    topic: 'Graduate School Application Strategy',
    date: '2024-01-28',
    time: '2:00 PM',
    duration: '45 min',
    status: 'scheduled',
    meetingType: 'video'
  },
  {
    id: '3',
    mentorName: 'Mr. Kofi Mensah',
    mentorTitle: 'Entrepreneur & Founder at TechGhana',
    topic: 'Building Your First Startup',
    date: '2024-01-20',
    time: '11:00 AM',
    duration: '60 min',
    status: 'completed',
    meetingType: 'video',
    feedback: {
      rating: 5,
      comment: 'Excellent insights on MVP development and fundraising!'
    },
    actionItems: [
      'Draft business plan outline',
      'Research target market',
      'Create pitch deck first draft'
    ],
    recordingUrl: '#'
  },
  {
    id: '4',
    mentorName: 'Dr. Abena Owusu',
    mentorTitle: 'Data Science Manager at Meta',
    topic: 'Introduction to Data Science Career',
    date: '2024-01-15',
    time: '3:00 PM',
    duration: '45 min',
    status: 'completed',
    meetingType: 'video',
    feedback: {
      rating: 4,
      comment: 'Great overview of data science skills needed'
    },
    actionItems: [
      'Complete Python for Data Science course',
      'Start working on portfolio project'
    ]
  },
  {
    id: '5',
    mentorName: 'Ms. Efua Darko',
    mentorTitle: 'Product Manager at Microsoft',
    topic: 'Product Management Fundamentals',
    date: '2024-01-12',
    time: '4:00 PM',
    duration: '30 min',
    status: 'cancelled',
    meetingType: 'video',
    notes: 'Rescheduled due to mentor availability'
  }
];

const MentorshipSessions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
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
      setSessions(mockSessions);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
      'scheduled': { color: '#696cff', bg: 'rgba(105, 108, 255, 0.1)', icon: <Clock size={14} />, label: 'Scheduled' },
      'in-progress': { color: '#71dd37', bg: 'rgba(113, 221, 55, 0.1)', icon: <Play size={14} />, label: 'In Progress' },
      'completed': { color: '#03c3ec', bg: 'rgba(3, 195, 236, 0.1)', icon: <CheckCircle2 size={14} />, label: 'Completed' },
      'cancelled': { color: '#ff3e1d', bg: 'rgba(255, 62, 29, 0.1)', icon: <XCircle size={14} />, label: 'Cancelled' }
    };
    return configs[status] || configs['scheduled'];
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={14} />;
      case 'in-person': return <MapPin size={14} />;
      case 'chat': return <MessageSquare size={14} />;
      default: return <Video size={14} />;
    }
  };

  const filteredSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return sessionDate >= today && s.status !== 'cancelled';
    }
    if (activeTab === 'past') {
      return sessionDate < today || s.status === 'completed' || s.status === 'cancelled';
    }
    return true;
  });

  const upcomingCount = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessionDate >= today && s.status !== 'cancelled';
  }).length;

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  // Calendar generation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calendarDays = getDaysInMonth(selectedMonth);

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Loading sessions...</p>
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
            <strong>My</strong> Sessions
          </h1>
          <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif", margin: 0 }}>
            Manage your mentorship sessions and meetings
          </p>
        </div>
        <Link
          to="/userprofile/mentorship/find-mentor"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#696cff',
            color: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            marginTop: isMobile ? '12px' : 0
          }}
        >
          <Plus size={16} />
          Book New Session
        </Link>
      </div>

      <div className="row g-4">
        {/* Calendar Section */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              {/* Month Navigation */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
                  style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#78716C' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <h6 style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h6>
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
                  style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#78716C' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} style={{
                    textAlign: 'center',
                    padding: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#A8A29E'
                  }}>
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const sessionsOnDay = getSessionsForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const hasSession = sessionsOnDay.length > 0;

                  return (
                    <div
                      key={i}
                      style={{
                        textAlign: 'center',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: hasSession ? 'pointer' : 'default',
                        backgroundColor: isToday ? '#696cff' : hasSession ? 'rgba(105, 108, 255, 0.1)' : 'transparent',
                        color: isToday ? '#FFFFFF' : hasSession ? '#696cff' : '#1C1917',
                        fontWeight: isToday || hasSession ? 600 : 400,
                        fontSize: '0.875rem',
                        position: 'relative'
                      }}
                    >
                      {day.getDate()}
                      {hasSession && !isToday && (
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#696cff'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-body">
              <h6 style={{ fontWeight: 600, color: '#1C1917', marginBottom: '16px' }}>Session Summary</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(105, 108, 255, 0.1)', borderRadius: '8px' }}>
                      <Calendar size={16} color="#696cff" />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#78716C' }}>Upcoming</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1C1917' }}>{upcomingCount}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(3, 195, 236, 0.1)', borderRadius: '8px' }}>
                      <CheckCircle2 size={16} color="#03c3ec" />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#78716C' }}>Completed</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1C1917' }}>
                    {sessions.filter(s => s.status === 'completed').length}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 171, 0, 0.1)', borderRadius: '8px' }}>
                      <Clock size={16} color="#ffab00" />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#78716C' }}>Total Hours</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1C1917' }}>12h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="col-lg-8">
          {/* Tabs */}
          <div className="card mb-4">
            <div className="card-body py-3">
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['upcoming', 'past', 'all'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: activeTab === tab ? '#696cff' : 'transparent',
                      color: activeTab === tab ? '#FFFFFF' : '#78716C',
                      fontFamily: "'Source Sans Pro', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                    {tab === 'upcoming' && upcomingCount > 0 && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 8px',
                        backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(105, 108, 255, 0.1)',
                        borderRadius: '10px',
                        fontSize: '0.75rem'
                      }}>
                        {upcomingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sessions */}
          {filteredSessions.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <CalendarDays size={48} color="#A8A29E" style={{ marginBottom: '16px' }} />
                <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", color: '#1C1917', marginBottom: '8px' }}>
                  No {activeTab} sessions
                </h5>
                <p style={{ fontFamily: "'Source Sans Pro', sans-serif", color: '#78716C', marginBottom: '24px' }}>
                  {activeTab === 'upcoming' ? 'Book a session with a mentor to get started' : 'Your past sessions will appear here'}
                </p>
                <Link
                  to="/userprofile/mentorship/find-mentor"
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
                  <User size={18} />
                  Find a Mentor
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredSessions.map((session, index) => {
                const statusConfig = getStatusConfig(session.status);

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className="card"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: session.status === 'cancelled' ? 0.7 : 1
                      }}
                      onClick={() => setSelectedSession(session)}
                      onMouseEnter={(e) => {
                        if (session.status !== 'cancelled') {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          {/* Mentor Avatar */}
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
                            fontSize: '1.125rem',
                            flexShrink: 0
                          }}>
                            {session.mentorName.split(' ').map(n => n[0]).join('')}
                          </div>

                          {/* Session Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 10px',
                                backgroundColor: statusConfig.bg,
                                color: statusConfig.color,
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}>
                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                backgroundColor: '#F5F5F5',
                                color: '#78716C',
                                borderRadius: '4px',
                                fontSize: '0.75rem'
                              }}>
                                {getMeetingTypeIcon(session.meetingType)}
                                {session.meetingType}
                              </span>
                            </div>

                            <h6 style={{
                              fontFamily: "'Crimson Text', Georgia, serif",
                              fontSize: '1.0625rem',
                              fontWeight: 600,
                              color: '#1C1917',
                              margin: '8px 0 4px'
                            }}>
                              {session.topic}
                            </h6>

                            <p style={{ fontSize: '0.875rem', color: '#78716C', margin: '0 0 8px' }}>
                              with <span style={{ fontWeight: 500 }}>{session.mentorName}</span>
                              <span style={{ color: '#A8A29E' }}> • {session.mentorTitle}</span>
                            </p>

                            <div className="d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                              <span className="d-flex align-items-center gap-1">
                                <Calendar size={14} />
                                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                              <span className="d-flex align-items-center gap-1">
                                <Clock size={14} />
                                {session.time} ({session.duration})
                              </span>
                            </div>

                            {/* Feedback for completed sessions */}
                            {session.feedback && (
                              <div style={{
                                marginTop: '12px',
                                padding: '10px 12px',
                                backgroundColor: '#FAFAF9',
                                borderRadius: '8px'
                              }}>
                                <div className="d-flex align-items-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      fill={i < session.feedback!.rating ? '#ffab00' : 'none'}
                                      color={i < session.feedback!.rating ? '#ffab00' : '#E7E5E4'}
                                    />
                                  ))}
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: '#78716C', margin: 0 }}>
                                  "{session.feedback.comment}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div style={{ flexShrink: 0 }}>
                            {session.status === 'scheduled' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '10px 16px',
                                  backgroundColor: '#696cff',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '0.8125rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                <Video size={14} />
                                Join
                              </button>
                            )}
                            {session.status === 'completed' && session.recordingUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '10px 16px',
                                  backgroundColor: 'transparent',
                                  color: '#696cff',
                                  border: '1px solid #696cff',
                                  borderRadius: '8px',
                                  fontSize: '0.8125rem',
                                  fontWeight: 500,
                                  cursor: 'pointer'
                                }}
                              >
                                <Play size={14} />
                                Recording
                              </button>
                            )}
                          </div>
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

      {/* Session Detail Modal */}
      {selectedSession && (
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
          onClick={() => setSelectedSession(null)}
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
            <div style={{ padding: '20px', borderBottom: '1px solid #E7E5E4' }}>
              <div className="d-flex align-items-center justify-content-between">
                <h5 style={{ fontFamily: "'Crimson Text', Georgia, serif", margin: 0 }}>Session Details</h5>
                <button
                  onClick={() => setSelectedSession(null)}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#78716C' }}
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              {/* Mentor Info */}
              <div className="d-flex align-items-center gap-3 mb-4">
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
                  {selectedSession.mentorName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: 600, color: '#1C1917' }}>{selectedSession.mentorName}</h6>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#78716C' }}>{selectedSession.mentorTitle}</p>
                </div>
              </div>

              {/* Topic */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '4px' }}>Topic</label>
                <p style={{ margin: 0, fontWeight: 500, color: '#1C1917' }}>{selectedSession.topic}</p>
              </div>

              {/* Date & Time */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div style={{ padding: '12px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '4px' }}>Date</label>
                    <p style={{ margin: 0, fontWeight: 500, color: '#1C1917' }}>
                      {new Date(selectedSession.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div style={{ padding: '12px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '4px' }}>Time</label>
                    <p style={{ margin: 0, fontWeight: 500, color: '#1C1917' }}>{selectedSession.time} ({selectedSession.duration})</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedSession.notes && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '8px' }}>Preparation Notes</label>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#78716C', padding: '12px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                    {selectedSession.notes}
                  </p>
                </div>
              )}

              {/* Action Items */}
              {selectedSession.actionItems && selectedSession.actionItems.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#A8A29E', marginBottom: '8px' }}>Action Items</label>
                  <div className="d-flex flex-column gap-2">
                    {selectedSession.actionItems.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        backgroundColor: '#FAFAF9',
                        borderRadius: '8px'
                      }}>
                        <CheckCircle2 size={16} color="#71dd37" />
                        <span style={{ fontSize: '0.875rem', color: '#1C1917' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E7E5E4', backgroundColor: '#FAFAF9', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedSession(null)}
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
                Close
              </button>
              {selectedSession.status === 'scheduled' && (
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#696cff',
                    color: '#FFFFFF',
                    fontFamily: "'Source Sans Pro', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Video size={14} />
                  Join Session
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MentorshipSessions;
