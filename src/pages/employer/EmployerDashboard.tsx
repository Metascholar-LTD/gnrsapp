import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
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
  Mail
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
  const [activeTab, setActiveTab] = useState<'applications' | 'views' | 'hires'>('applications');
  const applicationsChartRef = useRef<HTMLDivElement>(null);
  const viewsChartRef = useRef<HTMLDivElement>(null);
  const hiresChartRef = useRef<HTMLDivElement>(null);
  const applicationsChartInstanceRef = useRef<any>(null);
  const viewsChartInstanceRef = useRef<any>(null);
  const hiresChartInstanceRef = useRef<any>(null);
  const applicationsWeekChartRef = useRef<HTMLDivElement>(null);
  const viewsWeekChartRef = useRef<HTMLDivElement>(null);
  const hiresWeekChartRef = useRef<HTMLDivElement>(null);
  const applicationsWeekChartInstanceRef = useRef<any>(null);
  const viewsWeekChartInstanceRef = useRef<any>(null);
  const hiresWeekChartInstanceRef = useRef<any>(null);
  const jobPerformanceChartRef = useRef<HTMLDivElement>(null);
  const growthChartRef = useRef<HTMLDivElement>(null);
  const jobPerformanceChartInstanceRef = useRef<any>(null);
  const growthChartInstanceRef = useRef<any>(null);

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

      // Applications Chart Configuration
      if (applicationsChartRef.current && !applicationsChartInstanceRef.current) {
        const applicationsChartConfig = {
          series: [
            {
              data: [18, 15, 22, 20, 28, 24, 30, 26]
            }
          ],
          chart: {
            height: 215,
            parentHeightOffset: 0,
            parentWidthOffset: 0,
            toolbar: {
              show: false
            },
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 2,
            curve: 'smooth'
          },
          legend: {
            show: false
          },
          markers: {
            size: 6,
            colors: 'transparent',
            strokeColors: 'transparent',
            strokeWidth: 4,
            discrete: [
              {
                fillColor: chartConfig.colors.white,
                seriesIndex: 0,
                dataPointIndex: 7,
                strokeColor: chartConfig.colors.primary,
                strokeWidth: 2,
                size: 6,
                radius: 8
              }
            ],
            hover: {
              size: 7
            }
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
            padding: {
              top: 10,
              bottom: 10,
              left: 15,
              right: 15
            }
          },
          xaxis: {
            categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            labels: {
              show: true,
              style: {
                fontSize: '13px',
                colors: axisColor
              }
            }
          },
          yaxis: {
            labels: {
              show: false
            },
            min: 10,
            max: 35,
            tickAmount: 4
          }
        };
        applicationsChartInstanceRef.current = new ApexCharts(applicationsChartRef.current, applicationsChartConfig);
        applicationsChartInstanceRef.current.render();
      }

      // Views Chart Configuration
      if (viewsChartRef.current && !viewsChartInstanceRef.current) {
        const viewsChartConfig = {
          series: [
            {
              data: [145, 132, 158, 148, 172, 165, 185, 175]
            }
          ],
          chart: {
            height: 215,
            parentHeightOffset: 0,
            parentWidthOffset: 0,
            toolbar: {
              show: false
            },
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 2,
            curve: 'smooth'
          },
          legend: {
            show: false
          },
          markers: {
            size: 6,
            colors: 'transparent',
            strokeColors: 'transparent',
            strokeWidth: 4,
            discrete: [
              {
                fillColor: chartConfig.colors.white,
                seriesIndex: 0,
                dataPointIndex: 7,
                strokeColor: chartConfig.colors.info,
                strokeWidth: 2,
                size: 6,
                radius: 8
              }
            ],
            hover: {
              size: 7
            }
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
            padding: {
              top: 10,
              bottom: 10,
              left: 15,
              right: 15
            }
          },
          xaxis: {
            categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            labels: {
              show: true,
              style: {
                fontSize: '13px',
                colors: axisColor
              }
            }
          },
          yaxis: {
            labels: {
              show: false
            },
            min: 120,
            max: 200,
            tickAmount: 4
          }
        };
        viewsChartInstanceRef.current = new ApexCharts(viewsChartRef.current, viewsChartConfig);
        viewsChartInstanceRef.current.render();
      }

      // Hires Chart Configuration
      if (hiresChartRef.current && !hiresChartInstanceRef.current) {
        const hiresChartConfig = {
          series: [
            {
              data: [5, 4, 7, 6, 9, 8, 10, 9]
            }
          ],
          chart: {
            height: 215,
            parentHeightOffset: 0,
            parentWidthOffset: 0,
            toolbar: {
              show: false
            },
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 2,
            curve: 'smooth'
          },
          legend: {
            show: false
          },
          markers: {
            size: 6,
            colors: 'transparent',
            strokeColors: 'transparent',
            strokeWidth: 4,
            discrete: [
              {
                fillColor: chartConfig.colors.white,
                seriesIndex: 0,
                dataPointIndex: 7,
                strokeColor: chartConfig.colors.success,
                strokeWidth: 2,
                size: 6,
                radius: 8
              }
            ],
            hover: {
              size: 7
            }
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
            padding: {
              top: 10,
              bottom: 10,
              left: 15,
              right: 15
            }
          },
          xaxis: {
            categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            labels: {
              show: true,
              style: {
                fontSize: '13px',
                colors: axisColor
              }
            }
          },
          yaxis: {
            labels: {
              show: false
            },
            min: 3,
            max: 12,
            tickAmount: 4
          }
        };
        hiresChartInstanceRef.current = new ApexCharts(hiresChartRef.current, hiresChartConfig);
        hiresChartInstanceRef.current.render();
      }

      // Applications Week Radial Chart
      if (applicationsWeekChartRef.current && !applicationsWeekChartInstanceRef.current) {
        const applicationsWeekChartConfig = {
          series: [68],
          chart: {
            width: 60,
            height: 60,
            type: 'radialBar'
          },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              strokeWidth: '8',
              hollow: {
                margin: 2,
                size: '45%'
              },
              track: {
                strokeWidth: '50%',
                background: borderColor
              },
              dataLabels: {
                show: true,
                name: {
                  show: false
                },
                value: {
                  formatter: function (val: number) {
                    return parseInt(val.toString()) + '%';
                  },
                  offsetY: 5,
                  color: '#697a8d',
                  fontSize: '13px',
                  show: true
                }
              }
            }
          },
          fill: {
            type: 'solid',
            colors: chartConfig.colors.primary
          },
          stroke: {
            lineCap: 'round'
          },
          grid: {
            padding: {
              top: -10,
              bottom: -15,
              left: -10,
              right: -10
            }
          },
          states: {
            hover: {
              filter: {
                type: 'none'
              }
            }
          }
        };
        applicationsWeekChartInstanceRef.current = new ApexCharts(applicationsWeekChartRef.current, applicationsWeekChartConfig);
        applicationsWeekChartInstanceRef.current.render();
      }

      // Views Week Radial Chart
      if (viewsWeekChartRef.current && !viewsWeekChartInstanceRef.current) {
        const viewsWeekChartConfig = {
          series: [75],
          chart: {
            width: 60,
            height: 60,
            type: 'radialBar'
          },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              strokeWidth: '8',
              hollow: {
                margin: 2,
                size: '45%'
              },
              track: {
                strokeWidth: '50%',
                background: borderColor
              },
              dataLabels: {
                show: true,
                name: {
                  show: false
                },
                value: {
                  formatter: function (val: number) {
                    return parseInt(val.toString()) + '%';
                  },
                  offsetY: 5,
                  color: '#697a8d',
                  fontSize: '13px',
                  show: true
                }
              }
            }
          },
          fill: {
            type: 'solid',
            colors: chartConfig.colors.info
          },
          stroke: {
            lineCap: 'round'
          },
          grid: {
            padding: {
              top: -10,
              bottom: -15,
              left: -10,
              right: -10
            }
          },
          states: {
            hover: {
              filter: {
                type: 'none'
              }
            }
          }
        };
        viewsWeekChartInstanceRef.current = new ApexCharts(viewsWeekChartRef.current, viewsWeekChartConfig);
        viewsWeekChartInstanceRef.current.render();
      }

      // Hires Week Radial Chart
      if (hiresWeekChartRef.current && !hiresWeekChartInstanceRef.current) {
        const hiresWeekChartConfig = {
          series: [62],
          chart: {
            width: 60,
            height: 60,
            type: 'radialBar'
          },
          plotOptions: {
            radialBar: {
              startAngle: 0,
              endAngle: 360,
              strokeWidth: '8',
              hollow: {
                margin: 2,
                size: '45%'
              },
              track: {
                strokeWidth: '50%',
                background: borderColor
              },
              dataLabels: {
                show: true,
                name: {
                  show: false
                },
                value: {
                  formatter: function (val: number) {
                    return parseInt(val.toString()) + '%';
                  },
                  offsetY: 5,
                  color: '#697a8d',
                  fontSize: '13px',
                  show: true
                }
              }
            }
          },
          fill: {
            type: 'solid',
            colors: chartConfig.colors.success
          },
          stroke: {
            lineCap: 'round'
          },
          grid: {
            padding: {
              top: -10,
              bottom: -15,
              left: -10,
              right: -10
            }
          },
          states: {
            hover: {
              filter: {
                type: 'none'
              }
            }
          }
        };
        hiresWeekChartInstanceRef.current = new ApexCharts(hiresWeekChartRef.current, hiresWeekChartConfig);
        hiresWeekChartInstanceRef.current.render();
      }

      // Job Performance Chart Configuration
      if (jobPerformanceChartRef.current && !jobPerformanceChartInstanceRef.current) {
        const jobPerformanceChartOptions = {
          series: [
            {
              name: '2025',
              data: [12, 8, 15, 22, 18, 14, 10]
            },
            {
              name: '2024',
              data: [-8, -12, -6, -10, -5, -9, -7]
            }
          ],
          chart: {
            height: 300,
            stacked: true,
            type: 'bar',
            toolbar: { show: false }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '33%',
              borderRadius: 12,
              startingShape: 'rounded',
              endingShape: 'rounded'
            }
          },
          colors: [chartConfig.colors.primary, chartConfig.colors.info],
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 6,
            lineCap: 'round',
            colors: [cardColor]
          },
          legend: {
            show: true,
            horizontalAlign: 'left',
            position: 'top',
            markers: {
              height: 8,
              width: 8,
              radius: 12,
              offsetX: -3
            },
            labels: {
              colors: axisColor
            },
            itemMargin: {
              horizontal: 10
            }
          },
          grid: {
            borderColor: borderColor,
            padding: {
              top: 0,
              bottom: -8,
              left: 20,
              right: 20
            }
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            labels: {
              style: {
                fontSize: '13px',
                colors: axisColor
              }
            },
            axisTicks: {
              show: false
            },
            axisBorder: {
              show: false
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '13px',
                colors: axisColor
              }
            }
          },
          responsive: [
            {
              breakpoint: 1700,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '32%'
                  }
                }
              }
            },
            {
              breakpoint: 1580,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '35%'
                  }
                }
              }
            },
            {
              breakpoint: 1440,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '42%'
                  }
                }
              }
            },
            {
              breakpoint: 1300,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '48%'
                  }
                }
              }
            },
            {
              breakpoint: 1200,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '40%'
                  }
                }
              }
            },
            {
              breakpoint: 1040,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 11,
                    columnWidth: '48%'
                  }
                }
              }
            },
            {
              breakpoint: 991,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '30%'
                  }
                }
              }
            },
            {
              breakpoint: 840,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '35%'
                  }
                }
              }
            },
            {
              breakpoint: 768,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '28%'
                  }
                }
              }
            },
            {
              breakpoint: 640,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '32%'
                  }
                }
              }
            },
            {
              breakpoint: 576,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '37%'
                  }
                }
              }
            },
            {
              breakpoint: 480,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '45%'
                  }
                }
              }
            },
            {
              breakpoint: 420,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '52%'
                  }
                }
              }
            },
            {
              breakpoint: 380,
              options: {
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    columnWidth: '60%'
                  }
                }
              }
            }
          ],
          states: {
            hover: {
              filter: {
                type: 'none'
              }
            },
            active: {
              filter: {
                type: 'none'
              }
            }
          }
        };
        jobPerformanceChartInstanceRef.current = new ApexCharts(jobPerformanceChartRef.current, jobPerformanceChartOptions);
        jobPerformanceChartInstanceRef.current.render();
      }

      // Growth Chart Configuration
      if (growthChartRef.current && !growthChartInstanceRef.current) {
        const growthChartOptions = {
          series: [82],
          labels: ['Growth'],
          chart: {
            height: 240,
            type: 'radialBar'
          },
          plotOptions: {
            radialBar: {
              size: 150,
              offsetY: 10,
              startAngle: -150,
              endAngle: 150,
              hollow: {
                size: '55%'
              },
              track: {
                background: cardColor,
                strokeWidth: '100%'
              },
              dataLabels: {
                name: {
                  offsetY: 15,
                  color: headingColor,
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'Public Sans'
                },
                value: {
                  offsetY: -25,
                  color: headingColor,
                  fontSize: '22px',
                  fontWeight: '500',
                  fontFamily: 'Public Sans'
                }
              }
            }
          },
          colors: [chartConfig.colors.primary],
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              shadeIntensity: 0.5,
              gradientToColors: [chartConfig.colors.primary],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 0.6,
              stops: [30, 70, 100]
            }
          },
          stroke: {
            dashArray: 5
          },
          grid: {
            padding: {
              top: -35,
              bottom: -10
            }
          },
          states: {
            hover: {
              filter: {
                type: 'none'
              }
            },
            active: {
              filter: {
                type: 'none'
              }
            }
          }
        };
        growthChartInstanceRef.current = new ApexCharts(growthChartRef.current, growthChartOptions);
        growthChartInstanceRef.current.render();
      }
    };

    loadApexCharts();

    // Cleanup function
    return () => {
      if (applicationsChartInstanceRef.current) {
        applicationsChartInstanceRef.current.destroy();
        applicationsChartInstanceRef.current = null;
      }
      if (viewsChartInstanceRef.current) {
        viewsChartInstanceRef.current.destroy();
        viewsChartInstanceRef.current = null;
      }
      if (hiresChartInstanceRef.current) {
        hiresChartInstanceRef.current.destroy();
        hiresChartInstanceRef.current = null;
      }
      if (applicationsWeekChartInstanceRef.current) {
        applicationsWeekChartInstanceRef.current.destroy();
        applicationsWeekChartInstanceRef.current = null;
      }
      if (viewsWeekChartInstanceRef.current) {
        viewsWeekChartInstanceRef.current.destroy();
        viewsWeekChartInstanceRef.current = null;
      }
      if (hiresWeekChartInstanceRef.current) {
        hiresWeekChartInstanceRef.current.destroy();
        hiresWeekChartInstanceRef.current = null;
      }
      if (jobPerformanceChartInstanceRef.current) {
        jobPerformanceChartInstanceRef.current.destroy();
        jobPerformanceChartInstanceRef.current = null;
      }
      if (growthChartInstanceRef.current) {
        growthChartInstanceRef.current.destroy();
        growthChartInstanceRef.current = null;
      }
    };
  }, []);

  // Re-render chart when tab changes
  useEffect(() => {
    const ApexCharts = (window as any).ApexCharts;
    if (!ApexCharts) return;

    const timer = setTimeout(() => {
      if (activeTab === 'applications' && applicationsChartRef.current && !applicationsChartInstanceRef.current) {
        // Re-initialize if needed
      } else if (activeTab === 'views' && viewsChartRef.current && !viewsChartInstanceRef.current) {
        // Re-initialize if needed
      } else if (activeTab === 'hires' && hiresChartRef.current && !hiresChartInstanceRef.current) {
        // Re-initialize if needed
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab]);

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

      {/* Job Performance Section and Calendar Row */}
      <div className="row mb-4">
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="row row-bordered g-0">
              <div className="col-md-8">
                <h5 className="card-header m-0 me-2 pb-3">Job Performance</h5>
                <div ref={jobPerformanceChartRef} id="jobPerformanceChart" className="px-2"></div>
              </div>
              <div className="col-md-4">
                <div className="card-body">
                  <div className="text-center">
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                        type="button"
                        id="growthReportId"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        2025
                      </button>
                      <div className="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                        <a className="dropdown-item" href="javascript:void(0);">2024</a>
                        <a className="dropdown-item" href="javascript:void(0);">2023</a>
                        <a className="dropdown-item" href="javascript:void(0);">2022</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div ref={growthChartRef} id="growthChart"></div>
                <div className="text-center fw-semibold pt-3 mb-2">82% Growth Rate</div>

                <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                  <div className="d-flex">
                    <div className="me-2">
                      <span className="badge bg-label-primary p-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                        <Briefcase size={16} color="#696cff" />
                      </span>
                    </div>
                    <div className="d-flex flex-column">
                      <small>2025</small>
                      <h6 className="mb-0">12</h6>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="me-2">
                      <span className="badge bg-label-info p-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                        <FileText size={16} color="#03c3ec" />
                      </span>
                    </div>
                    <div className="d-flex flex-column">
                      <small>2024</small>
                      <h6 className="mb-0">8</h6>
                    </div>
                  </div>
                </div>
              </div>
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

      <div className="row">
        <div className="col-md-6 col-lg-4 order-1 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <ul className="nav nav-pills" role="tablist">
                <li className="nav-item">
                  <button 
                    type="button" 
                    className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('applications')}
                  >
                    Applications
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
                    className={`nav-link ${activeTab === 'hires' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('hires')}
                  >
                    Hires
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body px-0">
              <div className="tab-content p-0">
                {/* Applications Tab */}
                <div className={`tab-pane fade ${activeTab === 'applications' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <FileText size={20} color="#696cff" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Applications</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">145</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          28.4%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={applicationsChartRef} id="applicationsChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={applicationsWeekChartRef} id="applicationsWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Applications This Week</p>
                      <small className="text-muted">18% more than last week</small>
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
                        <h6 className="mb-0 me-1">1,240</h6>
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
                
                {/* Hires Tab */}
                <div className={`tab-pane fade ${activeTab === 'hires' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <UserCheck size={20} color="#71dd37" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Hires</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">8</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          12.5%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={hiresChartRef} id="hiresChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={hiresWeekChartRef} id="hiresWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Hires This Week</p>
                      <small className="text-muted">12% more than last week</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title m-0 me-2">Recent Applications</h5>
              <Link to="/employer/applications/all" className="btn btn-sm btn-label-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <ul className="p-0 m-0">
                {recentApplications.map((app) => (
                  <li key={app.id} className="d-flex mb-4 pb-1">
                    <div className="avatar flex-shrink-0 me-3">
                      <div className="avatar-initial rounded-circle bg-label-primary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#696cff' }}>
                        {app.candidateName.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <small className="text-muted d-block mb-1">{app.candidateName}</small>
                        <h6 className="mb-0">{app.jobTitle}</h6>
                        <small className="text-muted">{app.appliedDate}</small>
                      </div>
                      <div className="user-progress d-flex align-items-center gap-1">
                        <span className={`badge ${app.matchScore >= 90 ? 'bg-label-success' : 'bg-label-warning'}`}>
                          {app.matchScore}%
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default EmployerDashboard;
