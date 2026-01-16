// ============================================================================
// SCHOLAR DASHBOARD (PRIVATE)
// ============================================================================
// Modern dashboard matching employer/admin dashboard quality
// Uses Bootstrap grid, ApexCharts, and Sneat CSS classes
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Quote,
  Building2,
  Award,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List as ListIcon,
  ArrowRight,
} from 'lucide-react';
import { mockArticles, mockUniversities } from '@/utils/scholarlyRankingData';
import { UniversityRankingCard, UniversityTableRow } from '@/components/scholarly/UniversityRankingCard';

const ScholarDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'papers' | 'views' | 'citations'>('papers');
  const [universityViewMode, setUniversityViewMode] = useState<'cards' | 'table'>('cards');
  const [paperViewMode, setPaperViewMode] = useState<'cards' | 'table'>('cards');
  const [isMobile, setIsMobile] = useState(false);

  // Force cards view on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Force cards view on mobile
      if (mobile) {
        setUniversityViewMode('cards');
        setPaperViewMode('cards');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const papersChartRef = useRef<HTMLDivElement>(null);
  const viewsChartRef = useRef<HTMLDivElement>(null);
  const citationsChartRef = useRef<HTMLDivElement>(null);
  const papersChartInstanceRef = useRef<any>(null);
  const viewsChartInstanceRef = useRef<any>(null);
  const citationsChartInstanceRef = useRef<any>(null);
  const papersWeekChartRef = useRef<HTMLDivElement>(null);
  const viewsWeekChartRef = useRef<HTMLDivElement>(null);
  const citationsWeekChartRef = useRef<HTMLDivElement>(null);
  const papersWeekChartInstanceRef = useRef<any>(null);
  const viewsWeekChartInstanceRef = useRef<any>(null);
  const citationsWeekChartInstanceRef = useRef<any>(null);

  // Chart configuration matching sneat-1.0.0 exactly
  const chartConfig = {
    colors: {
      primary: '#1E3A5F',
      secondary: '#8592a3',
      success: '#2D5A47',
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

      // Papers Chart
      if (papersChartRef.current && !papersChartInstanceRef.current) {
        const papersChartConfig = {
          series: [{ data: [2, 3, 1, 4, 2, 5, 3, 4] }],
          chart: {
            height: 215,
            parentHeightOffset: 0,
            parentWidthOffset: 0,
            toolbar: { show: false },
            type: 'area'
          },
          dataLabels: { enabled: false },
          stroke: { width: 2, curve: 'smooth' },
          legend: { show: false },
          markers: {
            size: 6,
            colors: 'transparent',
            strokeColors: 'transparent',
            strokeWidth: 4,
            discrete: [{
              fillColor: chartConfig.colors.white,
              seriesIndex: 0,
              dataPointIndex: 7,
              strokeColor: chartConfig.colors.primary,
              strokeWidth: 2,
              size: 6,
              radius: 8
            }],
            hover: { size: 7 }
          },
          colors: [chartConfig.colors.primary],
          fill: {
            type: 'gradient',
            gradient: {
              shade: shadeColor,
              shadeIntensity: 0.6,
              opacityFrom: 0.5,
              opacityTo: 0.25,
              stops: [0, 95, 100]
            }
          },
          grid: {
            borderColor: borderColor,
            strokeDashArray: 3,
            padding: { top: 10, bottom: 10, left: 15, right: 15 }
          },
          xaxis: {
            categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
              show: true,
              style: { fontSize: '13px', colors: axisColor }
            }
          },
          yaxis: {
            labels: { show: false },
            min: 0,
            max: 6,
            tickAmount: 4
          }
        };
        papersChartInstanceRef.current = new ApexCharts(papersChartRef.current, papersChartConfig);
        papersChartInstanceRef.current.render();
      }

      // Views Chart
      if (viewsChartRef.current && !viewsChartInstanceRef.current) {
        const viewsChartConfig = {
          series: [{ data: [145, 132, 158, 148, 172, 165, 185, 175] }],
          chart: {
            height: 215,
            parentHeightOffset: 0,
            parentWidthOffset: 0,
            toolbar: { show: false },
            type: 'area'
          },
          dataLabels: { enabled: false },
          stroke: { width: 2, curve: 'smooth' },
          legend: { show: false },
          markers: {
            size: 6,
            colors: 'transparent',
            strokeColors: 'transparent',
            strokeWidth: 4,
            discrete: [{
              fillColor: chartConfig.colors.white,
              seriesIndex: 0,
              dataPointIndex: 7,
              strokeColor: chartConfig.colors.info,
              strokeWidth: 2,
              size: 6,
              radius: 8
            }],
            hover: { size: 7 }
          },
          colors: [chartConfig.colors.info],
          fill: {
            type: 'gradient',
            gradient: {
              shade: shadeColor,
              shadeIntensity: 0.6,
              opacityFrom: 0.5,
              opacityTo: 0.25,
              stops: [0, 95, 100]
            }
          },
          grid: {
            borderColor: borderColor,
            strokeDashArray: 3,
            padding: { top: 10, bottom: 10, left: 15, right: 15 }
          },
          xaxis: {
            categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
              show: true,
              style: { fontSize: '13px', colors: axisColor }
            }
          },
          yaxis: {
            labels: { show: false },
            min: 120,
            max: 200,
            tickAmount: 4
          }
        };
        viewsChartInstanceRef.current = new ApexCharts(viewsChartRef.current, viewsChartConfig);
        viewsChartInstanceRef.current.render();
      }

      // Citations Chart
      if (citationsChartRef.current && !citationsChartInstanceRef.current) {
        const citationsChartConfig = {
          series: [{ data: [5, 4, 7, 6, 9, 8, 10, 9] }],
          chart: {
            height: 215,
            parentHeightOffset: 0,
            parentWidthOffset: 0,
            toolbar: { show: false },
            type: 'area'
          },
          dataLabels: { enabled: false },
          stroke: { width: 2, curve: 'smooth' },
          legend: { show: false },
          markers: {
            size: 6,
            colors: 'transparent',
            strokeColors: 'transparent',
            strokeWidth: 4,
            discrete: [{
              fillColor: chartConfig.colors.white,
              seriesIndex: 0,
              dataPointIndex: 7,
              strokeColor: chartConfig.colors.success,
              strokeWidth: 2,
              size: 6,
              radius: 8
            }],
            hover: { size: 7 }
          },
          colors: [chartConfig.colors.success],
          fill: {
            type: 'gradient',
            gradient: {
              shade: shadeColor,
              shadeIntensity: 0.6,
              opacityFrom: 0.5,
              opacityTo: 0.25,
              stops: [0, 95, 100]
            }
          },
          grid: {
            borderColor: borderColor,
            strokeDashArray: 3,
            padding: { top: 10, bottom: 10, left: 15, right: 15 }
          },
          xaxis: {
            categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
              show: true,
              style: { fontSize: '13px', colors: axisColor }
            }
          },
          yaxis: {
            labels: { show: false },
            min: 3,
            max: 12,
            tickAmount: 4
          }
        };
        citationsChartInstanceRef.current = new ApexCharts(citationsChartRef.current, citationsChartConfig);
        citationsChartInstanceRef.current.render();
      }

      // Week Radial Charts
      if (papersWeekChartRef.current && !papersWeekChartInstanceRef.current) {
        const papersWeekChartConfig = {
          series: [68],
          chart: { width: 60, height: 60, type: 'radialBar' },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              strokeWidth: '8',
              hollow: { margin: 2, size: '45%' },
              track: { strokeWidth: '50%', background: borderColor },
              dataLabels: {
                show: true,
                name: { show: false },
                value: {
                  formatter: (val: number) => parseInt(val.toString()) + '%',
                  offsetY: 5,
                  color: '#697a8d',
                  fontSize: '13px',
                  show: true
                }
              }
            }
          },
          fill: { type: 'solid', colors: chartConfig.colors.primary },
          stroke: { lineCap: 'round' },
          grid: { padding: { top: -10, bottom: -15, left: -10, right: -10 } },
          states: { hover: { filter: { type: 'none' } } }
        };
        papersWeekChartInstanceRef.current = new ApexCharts(papersWeekChartRef.current, papersWeekChartConfig);
        papersWeekChartInstanceRef.current.render();
      }

      if (viewsWeekChartRef.current && !viewsWeekChartInstanceRef.current) {
        const viewsWeekChartConfig = {
          series: [75],
          chart: { width: 60, height: 60, type: 'radialBar' },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              strokeWidth: '8',
              hollow: { margin: 2, size: '45%' },
              track: { strokeWidth: '50%', background: borderColor },
              dataLabels: {
                show: true,
                name: { show: false },
                value: {
                  formatter: (val: number) => parseInt(val.toString()) + '%',
                  offsetY: 5,
                  color: '#697a8d',
                  fontSize: '13px',
                  show: true
                }
              }
            }
          },
          fill: { type: 'solid', colors: chartConfig.colors.info },
          stroke: { lineCap: 'round' },
          grid: { padding: { top: -10, bottom: -15, left: -10, right: -10 } },
          states: { hover: { filter: { type: 'none' } } }
        };
        viewsWeekChartInstanceRef.current = new ApexCharts(viewsWeekChartRef.current, viewsWeekChartConfig);
        viewsWeekChartInstanceRef.current.render();
      }

      if (citationsWeekChartRef.current && !citationsWeekChartInstanceRef.current) {
        const citationsWeekChartConfig = {
          series: [62],
          chart: { width: 60, height: 60, type: 'radialBar' },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              strokeWidth: '8',
              hollow: { margin: 2, size: '45%' },
              track: { strokeWidth: '50%', background: borderColor },
              dataLabels: {
                show: true,
                name: { show: false },
                value: {
                  formatter: (val: number) => parseInt(val.toString()) + '%',
                  offsetY: 5,
                  color: '#697a8d',
                  fontSize: '13px',
                  show: true
                }
              }
            }
          },
          fill: { type: 'solid', colors: chartConfig.colors.success },
          stroke: { lineCap: 'round' },
          grid: { padding: { top: -10, bottom: -15, left: -10, right: -10 } },
          states: { hover: { filter: { type: 'none' } } }
        };
        citationsWeekChartInstanceRef.current = new ApexCharts(citationsWeekChartRef.current, citationsWeekChartConfig);
        citationsWeekChartInstanceRef.current.render();
      }

    };

    loadApexCharts();

    return () => {
      if (papersChartInstanceRef.current) {
        papersChartInstanceRef.current.destroy();
        papersChartInstanceRef.current = null;
      }
      if (viewsChartInstanceRef.current) {
        viewsChartInstanceRef.current.destroy();
        viewsChartInstanceRef.current = null;
      }
      if (citationsChartInstanceRef.current) {
        citationsChartInstanceRef.current.destroy();
        citationsChartInstanceRef.current = null;
      }
      if (papersWeekChartInstanceRef.current) {
        papersWeekChartInstanceRef.current.destroy();
        papersWeekChartInstanceRef.current = null;
      }
      if (viewsWeekChartInstanceRef.current) {
        viewsWeekChartInstanceRef.current.destroy();
        viewsWeekChartInstanceRef.current = null;
      }
      if (citationsWeekChartInstanceRef.current) {
        citationsWeekChartInstanceRef.current.destroy();
        citationsWeekChartInstanceRef.current = null;
      }
    };
  }, []);

  const stats = {
    totalPapers: 12,
    approved: 8,
    pending: 3,
    rejected: 1,
    totalViews: 45678,
    totalDownloads: 12345,
    totalCitations: 234,
    universityRanking: 1,
    contributionScore: 8.5,
  };

  const recentPapers = mockArticles.slice(0, 5);

  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">
        <strong>Scholar</strong> Dashboard
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
                    Your scholar dashboard is ready. Manage your publications, track your impact, and contribute to your university's ranking.
                  </p>
                  <Button 
                    variant="default" 
                    size="default"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/scholar/submit-paper');
                    }}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Submit New Paper
                  </Button>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    src="/sneat-assets/img/illustrations/man-with-laptop-light.png"
                    height="140"
                    alt="Scholar Dashboard"
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
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(30, 58, 95, 0.1)', borderRadius: '8px' }}>
                        <FileText size={24} color="#1E3A5F" />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Papers</span>
                  <h3 className="card-title mb-2">{stats.totalPapers}</h3>
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
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(45, 90, 71, 0.1)', borderRadius: '8px' }}>
                        <Quote size={24} color="#2D5A47" />
                      </div>
                    </div>
                  </div>
                  <span>Citations</span>
                  <h3 className="card-title text-nowrap mb-1">{stats.totalCitations.toLocaleString()}</h3>
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
                        <Eye size={24} color="#03c3ec" />
                      </div>
                    </div>
                  </div>
                  <span className="d-block mb-1">Total Views</span>
                  <h3 className="card-title text-nowrap mb-2">{(stats.totalViews / 1000).toFixed(1)}K</h3>
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
                        <Award size={24} color="#ffab00" />
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">University Rank</span>
                  <h3 className="card-title mb-2">#{stats.universityRanking}</h3>
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

      {/* Top 5 Universities Rankings & Recent Papers */}
      <div className="row mb-4">
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title m-0 me-2">Top 5 Universities</h5>
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
                    onClick={() => setUniversityViewMode('cards')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      border: 'none',
                      background: universityViewMode === 'cards' ? '#1E3A5F' : 'transparent',
                      color: universityViewMode === 'cards' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (universityViewMode !== 'cards') {
                        e.currentTarget.style.background = '#F5F5F4';
                        e.currentTarget.style.color = '#57534E';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (universityViewMode !== 'cards') {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#78716C';
                      }
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUniversityViewMode('table')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      border: 'none',
                      background: universityViewMode === 'table' ? '#1E3A5F' : 'transparent',
                      color: universityViewMode === 'table' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (universityViewMode !== 'table') {
                        e.currentTarget.style.background = '#F5F5F4';
                        e.currentTarget.style.color = '#57534E';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (universityViewMode !== 'table') {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#78716C';
                      }
                    }}
                  >
                    <ListIcon size={16} />
                  </button>
                </div>
                {/* View All Button - Matching Preview Button Style */}
                <Link 
                  to="/scholarly/rankings"
                  className="group relative inline-block text-sm font-medium text-[#1E3A5F] transition-colors duration-300 hover:text-[#2D4A6F]"
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
                      className="absolute bottom-0 left-0 h-[2px] bg-[#1E3A5F] transition-all duration-300 group-hover:bg-[#2D4A6F]"
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
              {universityViewMode === 'cards' ? (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mockUniversities.slice(0, 5).map((university) => (
                    <div key={university.id}>
                      <UniversityRankingCard 
                        university={university} 
                        variant="compact"
                        showTrend={false}
                      />
                    </div>
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
                    gridTemplateColumns: '80px 1fr 120px 120px 100px',
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
                    <span>Rank</span>
                    <span>University</span>
                    <span style={{ textAlign: 'right' }}>Articles</span>
                    <span style={{ textAlign: 'right' }}>This Month</span>
                    <span style={{ textAlign: 'right' }}>Trend</span>
                  </div>
                  {mockUniversities.slice(0, 5).map((university, index) => (
                    <UniversityTableRow
                      key={university.id}
                      university={university}
                      isFirst={index === 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Papers Section */}
        <div className="col-lg-6 col-md-12">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title m-0 me-2">Recent Papers</h5>
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
                    onClick={() => setPaperViewMode('cards')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      border: 'none',
                      background: paperViewMode === 'cards' ? '#1E3A5F' : 'transparent',
                      color: paperViewMode === 'cards' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (paperViewMode !== 'cards') {
                        e.currentTarget.style.background = '#F5F5F4';
                        e.currentTarget.style.color = '#57534E';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paperViewMode !== 'cards') {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#78716C';
                      }
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperViewMode('table')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      border: 'none',
                      background: paperViewMode === 'table' ? '#1E3A5F' : 'transparent',
                      color: paperViewMode === 'table' ? '#FFFFFF' : '#78716C',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (paperViewMode !== 'table') {
                        e.currentTarget.style.background = '#F5F5F4';
                        e.currentTarget.style.color = '#57534E';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paperViewMode !== 'table') {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#78716C';
                      }
                    }}
                  >
                    <ListIcon size={16} />
                  </button>
                </div>
                {/* View All Button - Matching Preview Button Style */}
                <Link 
                  to="/scholarly/articles"
                  className="group relative inline-block text-sm font-medium text-[#1E3A5F] transition-colors duration-300 hover:text-[#2D4A6F]"
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
                      className="absolute bottom-0 left-0 h-[2px] bg-[#1E3A5F] transition-all duration-300 group-hover:bg-[#2D4A6F]"
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
              {(paperViewMode === 'cards' || isMobile) ? (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentPapers.slice(0, 5).map((paper) => (
                    <Link
                      key={paper.id}
                      to={`/scholarly/articles/${paper.slug}`}
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
                          {paper.title}
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
                          {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
                          {paper.authors.length > 2 && ' et al.'}
                        </p>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.75rem',
                          color: '#A8A29E',
                          margin: '4px 0 0 0',
                        }}>
                          {new Date(paper.publishedAt).toLocaleDateString()}
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
                          {paper.viewCount.toLocaleString()}
                        </span>
                        <span style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.75rem',
                          color: '#78716C',
                        }}>
                          Views
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
                    gridTemplateColumns: '1fr 120px 100px 100px',
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
                    <span>Paper</span>
                    <span style={{ textAlign: 'right' }}>Views</span>
                    <span style={{ textAlign: 'right' }}>Citations</span>
                    <span style={{ textAlign: 'right' }}>Date</span>
                  </div>
                  {recentPapers.slice(0, 5).map((paper, index) => (
                    <Link
                      key={paper.id}
                      to={`/scholarly/articles/${paper.slug}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 120px 100px 100px',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: index === 0 ? 'linear-gradient(90deg, rgba(30, 58, 95, 0.03) 0%, transparent 50%)' : '#FFFFFF',
                        borderBottom: '1px solid #E7E5E4',
                        transition: 'background-color 0.15s ease',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAF9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index === 0 ? 'linear-gradient(90deg, rgba(30, 58, 95, 0.03) 0%, transparent 50%)' : '#FFFFFF';
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
                          {paper.title}
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
                          {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
                          {paper.authors.length > 2 && ' et al.'}
                        </p>
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.9375rem',
                        color: '#1C1917',
                        textAlign: 'right',
                      }}>
                        {paper.viewCount.toLocaleString()}
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.9375rem',
                        color: '#1C1917',
                        textAlign: 'right',
                      }}>
                        {paper.citationCount.toLocaleString()}
                      </div>
                      <div style={{
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.8125rem',
                        color: '#78716C',
                        textAlign: 'right',
                      }}>
                        {new Date(paper.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-lg-4 order-1 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <ul className="nav nav-pills" role="tablist">
                <li className="nav-item">
                  <button 
                    type="button" 
                    className={`nav-link ${activeTab === 'papers' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('papers')}
                  >
                    Papers
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    type="button" 
                    className={`nav-link ${activeTab === 'views' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('views')}
                  >
                    Views
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    type="button" 
                    className={`nav-link ${activeTab === 'citations' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('citations')}
                  >
                    Citations
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body px-0">
              <div className="tab-content p-0">
                {/* Papers Tab */}
                <div className={`tab-pane fade ${activeTab === 'papers' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <FileText size={20} color="#1E3A5F" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Papers</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">{stats.totalPapers}</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          15.2%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={papersChartRef} id="papersChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={papersWeekChartRef} id="papersWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Papers This Week</p>
                      <small className="text-muted">2 new submissions</small>
                    </div>
                  </div>
                </div>
                
                {/* Views Tab */}
                <div className={`tab-pane fade ${activeTab === 'views' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <Eye size={20} color="#03c3ec" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Views</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">{(stats.totalViews / 1000).toFixed(1)}K</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          18.7%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={viewsChartRef} id="viewsChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={viewsWeekChartRef} id="viewsWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Views This Week</p>
                      <small className="text-muted">25% more than last week</small>
                    </div>
                  </div>
                </div>
                
                {/* Citations Tab */}
                <div className={`tab-pane fade ${activeTab === 'citations' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <Quote size={20} color="#2D5A47" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Citations</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">{stats.totalCitations}</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          12.5%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={citationsChartRef} id="citationsChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={citationsWeekChartRef} id="citationsWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Citations This Week</p>
                      <small className="text-muted">12% more than last week</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarDashboard;
