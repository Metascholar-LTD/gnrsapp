import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calculator,
  MoreVertical,
  Eye,
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  X,
  Clock,
  Award,
  BookOpen,
  School,
  GraduationCap,
  ChevronRight,
  Filter
} from 'lucide-react';

// Types
interface CGPACalculation {
  id: string;
  semester: string;
  academicYear: string;
  calculatedDate: string;
  cgpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  courses: CourseEntry[];
  trend?: 'up' | 'down' | 'stable';
  gradingSystem: 'CGPA' | 'SGPA' | 'CWA';
  schoolName?: string;
  program?: string;
  level?: string;
}

interface CourseEntry {
  id: string;
  course: string;
  credits: number;
  grade: string;
  gradePoints?: number;
}

// Mock data with updated structure
const mockCalculations: CGPACalculation[] = [
  {
    id: '1',
    semester: 'First Semester',
    academicYear: '2023/2024',
    calculatedDate: '2024-01-15',
    cgpa: 3.72,
    totalCredits: 18,
    totalQualityPoints: 66.96,
    trend: 'up',
    gradingSystem: 'CGPA',
    schoolName: 'University of Ghana',
    program: 'BSc Computer Science',
    level: 'Level 300',
    courses: [
      { id: '1', course: 'Advanced Calculus', credits: 3, grade: 'A', gradePoints: 4.0 },
      { id: '2', course: 'Thermodynamics', credits: 2, grade: 'B+', gradePoints: 3.5 },
      { id: '3', course: 'Technical Communication', credits: 2, grade: 'A', gradePoints: 4.0 },
      { id: '4', course: 'Data Structures', credits: 3, grade: 'A', gradePoints: 4.0 },
      { id: '5', course: 'Physics Lab', credits: 1, grade: 'B', gradePoints: 3.0 },
      { id: '6', course: 'Chemistry', credits: 3, grade: 'A', gradePoints: 4.0 },
      { id: '7', course: 'Statistics', credits: 2, grade: 'B+', gradePoints: 3.5 },
      { id: '8', course: 'Elective Course', credits: 2, grade: 'A', gradePoints: 4.0 }
    ]
  },
  {
    id: '2',
    semester: 'Second Semester',
    academicYear: '2022/2023',
    calculatedDate: '2023-06-20',
    cgpa: 75.5,
    totalCredits: 16,
    totalQualityPoints: 1208,
    trend: 'stable',
    gradingSystem: 'CWA',
    schoolName: 'Kwame Nkrumah University',
    program: 'BSc Engineering',
    level: 'Level 200',
    courses: [
      { id: '1', course: 'Linear Algebra', credits: 3, grade: 'B', gradePoints: 65.0 },
      { id: '2', course: 'Organic Chemistry', credits: 3, grade: 'A', gradePoints: 85.0 },
      { id: '3', course: 'English Composition', credits: 2, grade: 'A', gradePoints: 85.0 },
      { id: '4', course: 'Computer Programming', credits: 3, grade: 'B', gradePoints: 65.0 },
      { id: '5', course: 'Biology Lab', credits: 1, grade: 'A', gradePoints: 85.0 },
      { id: '6', course: 'History', credits: 2, grade: 'B', gradePoints: 65.0 },
      { id: '7', course: 'Elective Course', credits: 2, grade: 'A', gradePoints: 85.0 }
    ]
  },
  {
    id: '3',
    semester: 'First Semester',
    academicYear: '2022/2023',
    calculatedDate: '2023-01-10',
    cgpa: 3.45,
    totalCredits: 15,
    totalQualityPoints: 51.75,
    trend: 'down',
    gradingSystem: 'SGPA',
    schoolName: 'University of Cape Coast',
    program: 'BSc Mathematics',
    level: 'Level 100',
    courses: [
      { id: '1', course: 'Introduction to Physics', credits: 3, grade: 'B', gradePoints: 3.0 },
      { id: '2', course: 'General Chemistry', credits: 3, grade: 'B+', gradePoints: 3.5 },
      { id: '3', course: 'Mathematics I', credits: 3, grade: 'A', gradePoints: 4.0 },
      { id: '4', course: 'Introduction to Computing', credits: 3, grade: 'B+', gradePoints: 3.5 },
      { id: '5', course: 'Communication Skills', credits: 2, grade: 'A', gradePoints: 4.0 },
      { id: '6', course: 'Elective Course', credits: 1, grade: 'B', gradePoints: 3.0 }
    ]
  }
];

const CGPAHistory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState<CGPACalculation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filterSystem, setFilterSystem] = useState<'all' | 'CGPA' | 'SGPA' | 'CWA'>('all');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCalculations(mockCalculations);
      setLoading(false);
    }, 500);
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filteredCalculations = calculations.filter(calc => {
    const matchesSearch = searchQuery === '' ||
      calc.semester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.academicYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.schoolName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.program?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.courses.some(course => course.course.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterSystem === 'all' || calc.gradingSystem === filterSystem;
    
    return matchesSearch && matchesFilter;
  });

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} className="text-emerald-600" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-600" />;
      default:
        return <Minus size={14} className="text-slate-400" />;
    }
  };

  const getCGPAColor = (cgpa: number, system: 'CGPA' | 'SGPA' | 'CWA') => {
    const value = system === 'CWA' ? cgpa : cgpa;
    if (system === 'CWA') {
      if (value >= 70) return 'text-emerald-600';
      if (value >= 60) return 'text-blue-600';
      if (value >= 50) return 'text-amber-600';
      return 'text-red-600';
    } else {
      if (value >= 3.5) return 'text-emerald-600';
      if (value >= 3.0) return 'text-blue-600';
      if (value >= 2.5) return 'text-amber-600';
      return 'text-red-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatResult = (cgpa: number, system: 'CGPA' | 'SGPA' | 'CWA') => {
    if (system === 'CWA') {
      return `${cgpa.toFixed(2)}%`;
    }
    return cgpa.toFixed(2);
  };

  const handleDelete = (id: string) => {
    setCalculations(calculations.filter(calc => calc.id !== id));
    setContextMenu(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading CGPA history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 1.5rem' }}>
        {/* Modern Header Section with Padding */}
        <div style={{ 
          padding: isMobile ? '1.5rem 0 1rem' : '2rem 0 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}>
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <h1 className="h3 mb-2" style={{ 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              color: '#111827',
              fontSize: isMobile ? '1.5rem' : '1.75rem'
            }}>
              Academic History
            </h1>
            {!isMobile && (
              <p style={{ 
                color: '#6b7280', 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                margin: 0,
                fontSize: '0.9375rem'
              }}>
                Track your academic performance across semesters
              </p>
            )}
          </div>
          <Link
            to="/education/calculate-cgpa"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.625rem 1.25rem',
              backgroundColor: '#696cff',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a5fef';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#696cff';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          >
            <Calculator size={16} />
            New Calculation
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
        <div className="d-flex flex-column flex-md-row gap-3">
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Search by semester, school, program, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem 0.625rem 2.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#696cff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(105, 108, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
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
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Filter */}
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af',
              pointerEvents: 'none',
              zIndex: 1
            }} />
            <select
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value as 'all' | 'CGPA' | 'SGPA' | 'CWA')}
              style={{
                padding: isMobile ? '0.625rem 0.75rem 0.625rem 2.5rem' : '0.625rem 0.875rem 0.625rem 2.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: isMobile ? '0.8125rem' : '0.875rem',
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                appearance: 'none',
                minWidth: isMobile ? '120px' : '140px',
                width: isMobile ? '100%' : 'auto'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#696cff';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(105, 108, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="all">All Systems</option>
              <option value="CGPA">CGPA</option>
              <option value="SGPA">SGPA</option>
              <option value="CWA">CWA</option>
            </select>
            <ChevronRight 
              size={14} 
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%) rotate(90deg)', 
                color: '#9ca3af',
                pointerEvents: 'none'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Timeline History View */}
      {filteredCalculations.length === 0 ? (
        <div style={{
          padding: isMobile ? '3rem 1.5rem' : '4rem 2rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: isMobile ? '0.5rem' : '0.75rem'
        }}>
          <div style={{
            width: isMobile ? '64px' : '80px',
            height: isMobile ? '64px' : '80px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '50%',
            border: '2px solid #e5e7eb'
          }}>
            <Calculator size={isMobile ? 32 : 40} color="#9ca3af" />
          </div>
          <h5 style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            color: '#111827', 
            marginBottom: '0.5rem',
            fontWeight: 600,
            fontSize: '1.125rem'
          }}>
            {searchQuery || filterSystem !== 'all' ? 'No calculations found' : 'No CGPA calculations yet'}
          </h5>
          <p style={{ 
            fontFamily: "'Plus Jakarta Sans', sans-serif", 
            color: '#6b7280', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {searchQuery || filterSystem !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start tracking your academic performance by calculating your CGPA'}
          </p>
          <Link
            to="/education/calculate-cgpa"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#696cff',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a5fef';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#696cff';
            }}
          >
            <Calculator size={18} />
            Calculate CGPA
          </Link>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Timeline Line - Hidden on Mobile */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              left: '24px',
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: '#e5e7eb',
              zIndex: 0
            }} />
          )}

          {/* History Items */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {filteredCalculations.map((calculation, index) => (
              <motion.div
                key={calculation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ marginBottom: isMobile ? '1.5rem' : '2rem', position: 'relative' }}
              >
                {/* Timeline Dot - Hidden on Mobile */}
                {!isMobile && (
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '24px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid #696cff',
                    zIndex: 2,
                    boxShadow: '0 0 0 4px #ffffff'
                  }} />
                )}

                {/* Card */}
                <div style={{
                  marginLeft: isMobile ? '0' : '3rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: isMobile ? '0.5rem' : '0.75rem',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                >
                  {/* Card Header */}
                  <div style={{
                    padding: isMobile ? '1rem' : '1.25rem 1.5rem',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'flex-start',
                    justifyContent: 'space-between',
                    gap: isMobile ? '1rem' : '1rem',
                    position: 'relative'
                  }}>
                    <div style={{ flex: 1, minWidth: 0, width: isMobile ? 'auto' : 'auto' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <h5 style={{ 
                          fontFamily: "'Plus Jakarta Sans', sans-serif", 
                          color: '#111827',
                          fontWeight: 600,
                          fontSize: isMobile ? '0.9375rem' : '1rem',
                          margin: 0
                        }}>
                          {calculation.semester}
                        </h5>
                        {!isMobile && getTrendIcon(calculation.trend)}
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          backgroundColor: calculation.gradingSystem === 'CWA' ? '#fef3c7' : '#dbeafe',
                          color: calculation.gradingSystem === 'CWA' ? '#92400e' : '#1e40af'
                        }}>
                          {calculation.gradingSystem}
                        </span>
                      </div>
                      
                      {/* School/Program Info - Hidden on Mobile */}
                      {!isMobile && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          {calculation.schoolName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <School size={12} className="text-slate-500" />
                              <span style={{ 
                                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                                fontSize: '0.8125rem', 
                                color: '#6b7280'
                              }}>
                                {calculation.schoolName}
                              </span>
                            </div>
                          )}
                          {calculation.program && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <GraduationCap size={12} className="text-slate-500" />
                              <span style={{ 
                                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                                fontSize: '0.8125rem', 
                                color: '#6b7280'
                              }}>
                                {calculation.program}
                              </span>
                            </div>
                          )}
                          {calculation.level && (
                            <span style={{ 
                              fontFamily: "'Plus Jakarta Sans', sans-serif", 
                              fontSize: '0.8125rem', 
                              color: '#6b7280'
                            }}>
                              {calculation.level}
                            </span>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Calendar size={isMobile ? 10 : 12} className="text-slate-500" />
                          <span style={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif", 
                            fontSize: isMobile ? '0.75rem' : '0.8125rem', 
                            color: '#6b7280'
                          }}>
                            {calculation.academicYear}
                          </span>
                        </div>
                        {!isMobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Clock size={12} className="text-slate-500" />
                            <span style={{ 
                              fontFamily: "'Plus Jakarta Sans', sans-serif", 
                              fontSize: '0.8125rem', 
                              color: '#6b7280'
                            }}>
                              {formatDate(calculation.calculatedDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CGPA Display - Top Right on Mobile */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: isMobile ? '0.75rem' : '1rem',
                      width: isMobile ? 'auto' : 'auto',
                      justifyContent: 'flex-end',
                      position: isMobile ? 'absolute' : 'relative',
                      top: isMobile ? '1rem' : 'auto',
                      right: isMobile ? '1rem' : 'auto'
                    }}>
                      {/* Thin Divider Line - Mobile Only */}
                      {isMobile && (
                        <div style={{
                          width: '1px',
                          height: '2.5rem',
                          backgroundColor: '#e5e7eb',
                          alignSelf: 'flex-start',
                          marginTop: '0.125rem'
                        }} />
                      )}
                      
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'flex-end' : 'flex-end',
                        gap: '0.25rem',
                        textAlign: 'right'
                      }}>
                        {/* CGPA Number */}
                        <span className={getCGPAColor(calculation.cgpa, calculation.gradingSystem)} style={{ 
                          fontFamily: "'Plus Jakarta Sans', sans-serif", 
                          fontWeight: 700,
                          fontSize: isMobile ? '1.75rem' : '1.75rem',
                          lineHeight: 1
                        }}>
                          {formatResult(calculation.cgpa, calculation.gradingSystem)}
                        </span>
                      </div>
                    </div>

                    {/* Context Menu Button - Hidden on Mobile */}
                    {!isMobile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({ id: calculation.id, x: e.clientX, y: e.clientY });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.375rem',
                          color: '#6b7280',
                          borderRadius: '0.375rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: isMobile ? '0.5rem' : '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        marginBottom: '0.25rem',
                        fontWeight: 500
                      }}>
                        Total Credits
                      </div>
                      <div style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 600, 
                        color: '#111827', 
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}>
                        {calculation.totalCredits}
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        marginBottom: '0.25rem',
                        fontWeight: 500
                      }}>
                        {calculation.gradingSystem === 'CWA' ? 'Weighted Points' : 'Quality Points'}
                      </div>
                      <div style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 600, 
                        color: '#111827', 
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}>
                        {calculation.totalQualityPoints.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        marginBottom: '0.25rem',
                        fontWeight: 500
                      }}>
                        Courses
                      </div>
                      <div style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 600, 
                        color: '#111827', 
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}>
                        {calculation.courses.length}
                      </div>
                    </div>
                  </div>

                  {/* Expand Button - Mobile Optimized */}
                  <button
                    onClick={() => toggleExpand(calculation.id)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.5rem',
                      border: 'none',
                      backgroundColor: expandedId === calculation.id ? '#f3f4f6' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: isMobile ? '0.8125rem' : '0.875rem',
                      color: '#696cff',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      borderTop: '1px solid #f3f4f6',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.backgroundColor = expandedId === calculation.id ? '#f3f4f6' : 'transparent';
                      }
                    }}
                  >
                    <BookOpen size={isMobile ? 12 : 14} />
                    {expandedId === calculation.id ? 'Hide' : 'View'} Details
                    <ChevronRight 
                      size={isMobile ? 12 : 14} 
                      style={{ 
                        transform: expandedId === calculation.id ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </button>

                  {/* Expanded Course Table */}
                  <AnimatePresence>
                    {expandedId === calculation.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ 
                          padding: isMobile ? '1rem' : '1.5rem',
                          borderTop: '1px solid #f3f4f6',
                          backgroundColor: '#fafafa'
                        }}>
                          <h6 style={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif", 
                            fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                            fontWeight: 600, 
                            color: '#111827',
                            marginBottom: isMobile ? '0.75rem' : '1rem'
                          }}>
                            Course Breakdown
                          </h6>
                          
                          {/* Modern Table - Scrollable on Mobile */}
                          <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: isMobile ? '0.375rem' : '0.5rem',
                            overflow: isMobile ? 'auto' : 'hidden',
                            backgroundColor: '#ffffff',
                            WebkitOverflowScrolling: 'touch'
                          }}>
                            <table style={{ 
                              width: '100%', 
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              borderCollapse: 'collapse',
                              minWidth: isMobile ? '500px' : 'auto'
                            }}>
                              <thead>
                                <tr style={{ 
                                  backgroundColor: '#f9fafb',
                                  borderBottom: '1px solid #e5e7eb'
                                }}>
                                  <th style={{ 
                                    padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem', 
                                    textAlign: 'left', 
                                    fontSize: isMobile ? '0.6875rem' : '0.75rem', 
                                    fontWeight: 600, 
                                    color: '#6b7280', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                  }}>
                                    Course
                                  </th>
                                  <th style={{ 
                                    padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem', 
                                    textAlign: 'center', 
                                    fontSize: isMobile ? '0.6875rem' : '0.75rem', 
                                    fontWeight: 600, 
                                    color: '#6b7280', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                  }}>
                                    Credits
                                  </th>
                                  <th style={{ 
                                    padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 1rem', 
                                    textAlign: 'center', 
                                    fontSize: isMobile ? '0.6875rem' : '0.75rem', 
                                    fontWeight: 600, 
                                    color: '#6b7280', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                  }}>
                                    Grade
                                  </th>
                                  {calculation.gradingSystem !== 'CWA' && (
                                    <th style={{ 
                                      padding: '0.75rem 1rem', 
                                      textAlign: 'center', 
                                      fontSize: '0.75rem', 
                                      fontWeight: 600, 
                                      color: '#6b7280', 
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em'
                                    }}>
                                      Points
                                    </th>
                                  )}
                                  {calculation.gradingSystem === 'CWA' && (
                                    <th style={{ 
                                      padding: '0.75rem 1rem', 
                                      textAlign: 'center', 
                                      fontSize: '0.75rem', 
                                      fontWeight: 600, 
                                      color: '#6b7280', 
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em'
                                    }}>
                                      Percentage
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {calculation.courses.map((course, idx) => (
                                  <tr 
                                    key={course.id}
                                    style={{ 
                                      borderBottom: idx < calculation.courses.length - 1 ? '1px solid #f3f4f6' : 'none',
                                      transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <td style={{ 
                                      padding: isMobile ? '0.75rem 0.75rem' : '0.875rem 1rem', 
                                      fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                                      color: '#111827',
                                      fontWeight: 500
                                    }}>
                                      {course.course}
                                    </td>
                                    <td style={{ 
                                      padding: isMobile ? '0.75rem 0.75rem' : '0.875rem 1rem', 
                                      textAlign: 'center', 
                                      fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                                      color: '#111827'
                                    }}>
                                      {course.credits}
                                    </td>
                                    <td style={{ 
                                      padding: isMobile ? '0.75rem 0.75rem' : '0.875rem 1rem', 
                                      textAlign: 'center', 
                                      fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                                      fontWeight: 600, 
                                      color: '#111827'
                                    }}>
                                      {course.grade}
                                    </td>
                                    {calculation.gradingSystem !== 'CWA' && course.gradePoints !== undefined && (
                                      <td style={{ 
                                        padding: '0.875rem 1rem', 
                                        textAlign: 'center', 
                                        fontSize: '0.875rem', 
                                        color: '#111827'
                                      }}>
                                        {course.gradePoints.toFixed(1)}
                                      </td>
                                    )}
                                    {calculation.gradingSystem === 'CWA' && course.gradePoints !== undefined && (
                                      <td style={{ 
                                        padding: '0.875rem 1rem', 
                                        textAlign: 'center', 
                                        fontSize: '0.875rem', 
                                        color: '#111827'
                                      }}>
                                        {course.gradePoints.toFixed(1)}%
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
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
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '160px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                width: '100%', 
                padding: '0.625rem 0.875rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                color: '#111827',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Eye size={16} />
              View Details
            </button>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />
            <button
              onClick={() => handleDelete(contextMenu.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                width: '100%', 
                padding: '0.625rem 0.875rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                color: '#dc2626',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
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

export default CGPAHistory;
