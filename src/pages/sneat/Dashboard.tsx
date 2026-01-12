import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, BookOpen, Download, Eye, Database, FileText } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'resources' | 'downloads' | 'views'>('resources');
  const resourcesChartRef = useRef<HTMLDivElement>(null);
  const downloadsChartRef = useRef<HTMLDivElement>(null);
  const viewsChartRef = useRef<HTMLDivElement>(null);
  const resourcesChartInstanceRef = useRef<any>(null);
  const downloadsChartInstanceRef = useRef<any>(null);
  const viewsChartInstanceRef = useRef<any>(null);
  const resourcesWeekChartRef = useRef<HTMLDivElement>(null);
  const downloadsWeekChartRef = useRef<HTMLDivElement>(null);
  const viewsWeekChartRef = useRef<HTMLDivElement>(null);
  const resourcesWeekChartInstanceRef = useRef<any>(null);
  const downloadsWeekChartInstanceRef = useRef<any>(null);
  const viewsWeekChartInstanceRef = useRef<any>(null);
  const totalRevenueChartRef = useRef<HTMLDivElement>(null);
  const growthChartRef = useRef<HTMLDivElement>(null);
  const totalRevenueChartInstanceRef = useRef<any>(null);
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
  const shadeColor = 'light'; // Default shade for light theme

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

      // Resources Chart Configuration (exact copy from sneat-1.0.0)
      if (resourcesChartRef.current && !resourcesChartInstanceRef.current) {
        const resourcesChartConfig = {
          series: [
            {
              data: [24, 21, 30, 22, 42, 26, 35, 29]
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
            max: 50,
            tickAmount: 4
          }
        };
        resourcesChartInstanceRef.current = new ApexCharts(resourcesChartRef.current, resourcesChartConfig);
        resourcesChartInstanceRef.current.render();
      }

      // Downloads Chart Configuration (same as resources)
      if (downloadsChartRef.current && !downloadsChartInstanceRef.current) {
        const downloadsChartConfig = {
          series: [
            {
              data: [28, 25, 35, 28, 48, 32, 42, 35]
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
            max: 50,
            tickAmount: 4
          }
        };
        downloadsChartInstanceRef.current = new ApexCharts(downloadsChartRef.current, downloadsChartConfig);
        downloadsChartInstanceRef.current.render();
      }

      // Views Chart Configuration (same as resources)
      if (viewsChartRef.current && !viewsChartInstanceRef.current) {
        const viewsChartConfig = {
          series: [
            {
              data: [32, 28, 38, 30, 52, 36, 46, 40]
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
            max: 50,
            tickAmount: 4
          }
        };
        viewsChartInstanceRef.current = new ApexCharts(viewsChartRef.current, viewsChartConfig);
        viewsChartInstanceRef.current.render();
      }

      // Resources Week Radial Chart
      if (resourcesWeekChartRef.current && !resourcesWeekChartInstanceRef.current) {
        const resourcesWeekChartConfig = {
          series: [65],
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
        resourcesWeekChartInstanceRef.current = new ApexCharts(resourcesWeekChartRef.current, resourcesWeekChartConfig);
        resourcesWeekChartInstanceRef.current.render();
      }

      // Downloads Week Radial Chart
      if (downloadsWeekChartRef.current && !downloadsWeekChartInstanceRef.current) {
        const downloadsWeekChartConfig = {
          series: [72],
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
        downloadsWeekChartInstanceRef.current = new ApexCharts(downloadsWeekChartRef.current, downloadsWeekChartConfig);
        downloadsWeekChartInstanceRef.current.render();
      }

      // Views Week Radial Chart
      if (viewsWeekChartRef.current && !viewsWeekChartInstanceRef.current) {
        const viewsWeekChartConfig = {
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
        viewsWeekChartInstanceRef.current = new ApexCharts(viewsWeekChartRef.current, viewsWeekChartConfig);
        viewsWeekChartInstanceRef.current.render();
      }

      // Total Revenue Chart Configuration (exact copy from sneat-1.0.0)
      if (totalRevenueChartRef.current && !totalRevenueChartInstanceRef.current) {
        const totalRevenueChartOptions = {
          series: [
            {
              name: '2025',
              data: [18, 7, 15, 29, 18, 12, 9]
            },
            {
              name: '2024',
              data: [-13, -18, -9, -14, -5, -17, -15]
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
        totalRevenueChartInstanceRef.current = new ApexCharts(totalRevenueChartRef.current, totalRevenueChartOptions);
        totalRevenueChartInstanceRef.current.render();
      }

      // Growth Chart Configuration (exact copy from sneat-1.0.0)
      if (growthChartRef.current && !growthChartInstanceRef.current) {
        const growthChartOptions = {
          series: [78],
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
      if (resourcesChartInstanceRef.current) {
        resourcesChartInstanceRef.current.destroy();
        resourcesChartInstanceRef.current = null;
      }
      if (downloadsChartInstanceRef.current) {
        downloadsChartInstanceRef.current.destroy();
        downloadsChartInstanceRef.current = null;
      }
      if (viewsChartInstanceRef.current) {
        viewsChartInstanceRef.current.destroy();
        viewsChartInstanceRef.current = null;
      }
      if (resourcesWeekChartInstanceRef.current) {
        resourcesWeekChartInstanceRef.current.destroy();
        resourcesWeekChartInstanceRef.current = null;
      }
      if (downloadsWeekChartInstanceRef.current) {
        downloadsWeekChartInstanceRef.current.destroy();
        downloadsWeekChartInstanceRef.current = null;
      }
      if (viewsWeekChartInstanceRef.current) {
        viewsWeekChartInstanceRef.current.destroy();
        viewsWeekChartInstanceRef.current = null;
      }
      if (totalRevenueChartInstanceRef.current) {
        totalRevenueChartInstanceRef.current.destroy();
        totalRevenueChartInstanceRef.current = null;
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

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (activeTab === 'resources' && resourcesChartRef.current && !resourcesChartInstanceRef.current) {
        // Re-initialize if needed
      } else if (activeTab === 'downloads' && downloadsChartRef.current && !downloadsChartInstanceRef.current) {
        // Re-initialize if needed
      } else if (activeTab === 'views' && viewsChartRef.current && !viewsChartInstanceRef.current) {
        // Re-initialize if needed
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab]);

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
                    Your dashboard is ready. Check your analytics and performance metrics below.
                  </p>
                  <Button 
                    variant="default" 
                    size="default"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add your navigation logic here
                    }}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    src="/sneat-assets/img/illustrations/man-with-laptop-light.png"
                    height="140"
                    alt="View Badge User"
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
                      <img src="/sneat-assets/img/icons/unicons/chart-success.png" alt="chart success" className="rounded" />
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Profit</span>
                  <h3 className="card-title mb-2">$12,628</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +72.80%
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <img src="/sneat-assets/img/icons/unicons/wallet-info.png" alt="wallet" className="rounded" />
                    </div>
                  </div>
                  <span>Sales</span>
                  <h3 className="card-title text-nowrap mb-1">$4,679</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +28.42%
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <img src="/sneat-assets/img/icons/unicons/paypal.png" alt="paypal" className="rounded" />
                    </div>
                  </div>
                  <span className="d-block mb-1">Payments</span>
                  <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                  <small className="text-danger fw-semibold d-flex align-items-center gap-1">
                    <ArrowDown size={14} style={{ display: 'inline-block' }} />
                    -14.82%
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <img src="/sneat-assets/img/icons/unicons/cc-primary.png" alt="credit card" className="rounded" />
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Transactions</span>
                  <h3 className="card-title mb-2">$14,857</h3>
                  <small className="text-success fw-semibold d-flex align-items-center gap-1">
                    <ArrowUp size={14} style={{ display: 'inline-block' }} />
                    +28.14%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Resources Section and Calendar Row */}
      <div className="row mb-4">
        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="row row-bordered g-0">
              <div className="col-md-8">
                <h5 className="card-header m-0 me-2 pb-3">Total Resources</h5>
                <div ref={totalRevenueChartRef} id="totalRevenueChart" className="px-2"></div>
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
                <div className="text-center fw-semibold pt-3 mb-2">78% Platform Growth</div>

                <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                  <div className="d-flex">
                    <div className="me-2">
                      <span className="badge bg-label-primary p-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                        <Database size={16} color="#696cff" />
                      </span>
                    </div>
                    <div className="d-flex flex-column">
                      <small>2025</small>
                      <h6 className="mb-0">12.8k</h6>
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
                      <h6 className="mb-0">8.2k</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <WeekCalendar />
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
                    className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('resources')}
                  >
                    Resources
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    type="button" 
                    className={`nav-link ${activeTab === 'downloads' ? 'active' : ''}`} 
                    role="tab"
                    onClick={() => setActiveTab('downloads')}
                  >
                    Downloads
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
              </ul>
            </div>
            <div className="card-body px-0">
              <div className="tab-content p-0">
                {/* Resources Tab */}
                <div className={`tab-pane fade ${activeTab === 'resources' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <BookOpen size={20} color="#696cff" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Resources</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">1,247</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          18.2%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={resourcesChartRef} id="resourcesChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={resourcesWeekChartRef} id="resourcesWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Resources This Week</p>
                      <small className="text-muted">$39k less than last week</small>
                    </div>
                  </div>
                </div>
                
                {/* Downloads Tab */}
                <div className={`tab-pane fade ${activeTab === 'downloads' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <Download size={20} color="#696cff" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Downloads</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">8,459</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          24.8%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div ref={downloadsChartRef} id="downloadsChart" style={{ padding: '0 1rem' }}></div>
                  <div className="d-flex justify-content-center pt-4 gap-2">
                    <div className="flex-shrink-0">
                      <div ref={downloadsWeekChartRef} id="downloadsWeekChart"></div>
                    </div>
                    <div>
                      <p className="mb-n1 mt-1">Downloads This Week</p>
                      <small className="text-muted">$39k less than last week</small>
                    </div>
                  </div>
                </div>
                
                {/* Views Tab */}
                <div className={`tab-pane fade ${activeTab === 'views' ? 'show active' : ''}`}>
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                        <Eye size={20} color="#696cff" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Views</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">12,834</h6>
                        <small className="text-success fw-semibold d-flex align-items-center gap-1">
                          <ArrowUp size={12} style={{ display: 'inline-block' }} />
                          32.5%
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
                      <small className="text-muted">$39k less than last week</small>
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
              <h5 className="card-title m-0 me-2">Transactions</h5>
            </div>
            <div className="card-body">
              <ul className="p-0 m-0">
                <li className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                    <img src="/sneat-assets/img/icons/unicons/paypal.png" alt="paypal" className="rounded" />
                  </div>
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <small className="text-muted d-block mb-1">Paypal</small>
                      <h6 className="mb-0">Send money</h6>
                    </div>
                    <div className="user-progress d-flex align-items-center gap-1">
                      <h6 className="mb-0">+82.6</h6>
                      <span className="text-muted">USD</span>
                    </div>
                  </div>
                </li>
                <li className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                    <img src="/sneat-assets/img/icons/unicons/wallet.png" alt="wallet" className="rounded" />
                  </div>
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <small className="text-muted d-block mb-1">Wallet</small>
                      <h6 className="mb-0">Purchase</h6>
                    </div>
                    <div className="user-progress d-flex align-items-center gap-1">
                      <h6 className="mb-0">+270.69</h6>
                      <span className="text-muted">USD</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
