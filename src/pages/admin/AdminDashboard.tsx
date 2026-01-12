import { useEffect, useRef } from "react";
import feather from "feather-icons";
import Chart from "chart.js";

const ChartJS: any = Chart;

const AdminDashboard = () => {
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const worldMapRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Replace feather icons after render using safe replacement
    const timer = setTimeout(() => {
      if (feather && feather.icons) {
        const elements = document.querySelectorAll('[data-feather]');
        elements.forEach((el) => {
          try {
            const iconName = el.getAttribute('data-feather');
            if (iconName && feather.icons[iconName]) {
              const svg = feather.icons[iconName].toSvg({
                width: '16',
                height: '16',
              });
              el.outerHTML = svg;
            }
          } catch (e) {
            // Skip invalid icons silently
          }
        });
      }
    }, 200);

    // Initialize line chart
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 225);
        gradient.addColorStop(0, "rgba(215, 227, 244, 1)");
        gradient.addColorStop(1, "rgba(215, 227, 244, 0)");

        new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Sales ($)",
                fill: true,
                backgroundColor: gradient,
                borderColor: "#3B7DDD",
                data: [
                  2115, 1562, 1584, 1892, 1587, 1923, 2566, 2448, 2805, 3438,
                  2917, 3327,
                ],
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              intersect: false,
            },
            hover: {
              intersect: true,
            },
            plugins: {
              filler: {
                propagate: false,
              },
            },
            scales: {
              xAxes: [
                {
                  reverse: true,
                  gridLines: {
                    color: "rgba(0,0,0,0.0)",
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    stepSize: 1000,
                  },
                  display: true,
                  borderDash: [3, 3],
                  gridLines: {
                    color: "rgba(0,0,0,0.0)",
                  },
                },
              ],
            },
          },
        });
      }
    }

    // Initialize pie chart
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext("2d");
      if (ctx) {
        new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Chrome", "Firefox", "IE"],
            datasets: [
              {
                data: [4306, 3801, 1689],
                backgroundColor: ["#3B7DDD", "#fcb92c", "#dc3545"],
                borderWidth: 5,
              },
            ],
          },
          options: {
            responsive: !(window as any).MSInputMethodContext,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            cutoutPercentage: 75,
          },
        });
      }
    }

    // Initialize bar chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext("2d");
      if (ctx) {
        new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "This year",
                backgroundColor: "#3B7DDD",
                borderColor: "#3B7DDD",
                hoverBackgroundColor: "#3B7DDD",
                hoverBorderColor: "#3B7DDD",
                data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                  stacked: false,
                  ticks: {
                    stepSize: 20,
                  },
                },
              ],
              xAxes: [
                {
                  stacked: false,
                  gridLines: {
                    color: "transparent",
                  },
                },
              ],
            },
          },
        });
      }
    }

    // Initialize world map
    let resizeHandler: (() => void) | null = null;
    if (worldMapRef.current && (window as any).jsVectorMap) {
      const markers = [
        { coords: [31.230391, 121.473701], name: "Shanghai" },
        { coords: [28.70406, 77.102493], name: "Delhi" },
        { coords: [6.524379, 3.379206], name: "Lagos" },
        { coords: [35.689487, 139.691711], name: "Tokyo" },
        { coords: [23.12911, 113.264381], name: "Guangzhou" },
        { coords: [40.7127837, -74.0059413], name: "New York" },
        { coords: [34.052235, -118.243683], name: "Los Angeles" },
        { coords: [41.878113, -87.629799], name: "Chicago" },
        { coords: [51.507351, -0.127758], name: "London" },
        { coords: [40.416775, -3.70379], name: "Madrid" },
      ];

      try {
        const map = new (window as any).jsVectorMap({
          map: "world",
          selector: worldMapRef.current,
          zoomButtons: true,
          markers: markers,
          markerStyle: {
            initial: {
              r: 9,
              strokeWidth: 7,
              stokeOpacity: 0.4,
              fill: "#3B7DDD",
            },
            hover: {
              fill: "#3B7DDD",
              stroke: "#3B7DDD",
            },
          },
          zoomOnScroll: false,
        });

        resizeHandler = () => {
          if (map && typeof map.updateSize === 'function') {
            map.updateSize();
          }
        };
        window.addEventListener("resize", resizeHandler);
      } catch (error) {
        console.warn("Failed to initialize world map:", error);
      }
    }

    // Initialize calendar
    if (calendarRef.current && (window as any).flatpickr) {
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const defaultDate =
        date.getUTCFullYear() +
        "-" +
        (date.getUTCMonth() + 1) +
        "-" +
        date.getUTCDate();

      (window as any).flatpickr(calendarRef.current, {
        inline: true,
        prevArrow: '<span title="Previous month">&laquo;</span>',
        nextArrow: '<span title="Next month">&raquo;</span>',
        defaultDate: defaultDate,
      });
    }

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
    };
  }, []);

  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">
        <strong>Analytics</strong> Dashboard
      </h1>

      <div className="row">
        <div className="col-xl-6 col-xxl-5 d-flex">
          <div className="w-100">
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">Sales</h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <i className="align-middle" data-feather="truck"></i>
                        </div>
                      </div>
                    </div>
                    <h1 className="mt-1 mb-3">2.382</h1>
                    <div className="mb-0">
                      <span className="text-danger">
                        {" "}
                        <i className="mdi mdi-arrow-bottom-right"></i> -3.65%{" "}
                      </span>
                      <span className="text-muted">Since last week</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">Visitors</h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <i className="align-middle" data-feather="users"></i>
                        </div>
                      </div>
                    </div>
                    <h1 className="mt-1 mb-3">14.212</h1>
                    <div className="mb-0">
                      <span className="text-success">
                        {" "}
                        <i className="mdi mdi-arrow-bottom-right"></i> 5.25%{" "}
                      </span>
                      <span className="text-muted">Since last week</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">Earnings</h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <i className="align-middle" data-feather="dollar-sign"></i>
                        </div>
                      </div>
                    </div>
                    <h1 className="mt-1 mb-3">$21.300</h1>
                    <div className="mb-0">
                      <span className="text-success">
                        {" "}
                        <i className="mdi mdi-arrow-bottom-right"></i> 6.65%{" "}
                      </span>
                      <span className="text-muted">Since last week</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">Orders</h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <i className="align-middle" data-feather="shopping-cart"></i>
                        </div>
                      </div>
                    </div>
                    <h1 className="mt-1 mb-3">64</h1>
                    <div className="mb-0">
                      <span className="text-danger">
                        {" "}
                        <i className="mdi mdi-arrow-bottom-right"></i> -2.25%{" "}
                      </span>
                      <span className="text-muted">Since last week</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-xxl-7">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Movement</h5>
            </div>
            <div className="card-body py-3">
              <div className="chart chart-sm">
                <canvas ref={lineChartRef} id="chartjs-dashboard-line"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 col-xxl-3 d-flex order-2 order-xxl-3">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Browser Usage</h5>
            </div>
            <div className="card-body d-flex">
              <div className="align-self-center w-100">
                <div className="py-3">
                  <div className="chart chart-xs">
                    <canvas ref={pieChartRef} id="chartjs-dashboard-pie"></canvas>
                  </div>
                </div>

                <table className="table mb-0">
                  <tbody>
                    <tr>
                      <td>Chrome</td>
                      <td className="text-end">4306</td>
                    </tr>
                    <tr>
                      <td>Firefox</td>
                      <td className="text-end">3801</td>
                    </tr>
                    <tr>
                      <td>IE</td>
                      <td className="text-end">1689</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-12 col-xxl-6 d-flex order-3 order-xxl-2">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Real-Time</h5>
            </div>
            <div className="card-body px-4">
              <div ref={worldMapRef} id="world_map" style={{ height: "350px" }}></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title mb-0">Calendar</h5>
            </div>
            <div className="card-body d-flex">
              <div className="align-self-center w-100">
                <div className="chart">
                  <div ref={calendarRef} id="datetimepicker-dashboard"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-4 col-xxl-3 d-flex">
          <div className="card flex-fill w-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Monthly Sales</h5>
            </div>
            <div className="card-body d-flex w-100">
              <div className="align-self-center chart chart-lg">
                <canvas ref={barChartRef} id="chartjs-dashboard-bar"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

