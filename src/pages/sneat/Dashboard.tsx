import React, { useEffect } from 'react';

const Dashboard: React.FC = () => {
  useEffect(() => {
    // Load ApexCharts for dashboard
    const script = document.createElement('script');
    script.src = '/sneat-assets/vendor/libs/apex-charts/apexcharts.js';
    script.async = true;
    script.onload = () => {
      const dashScript = document.createElement('script');
      dashScript.src = '/sneat-assets/js/dashboards-analytics.js';
      document.body.appendChild(dashScript);
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* Welcome Card - Full Width */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="d-flex align-items-end row">
              <div className="col-sm-7">
                <div className="card-body">
                  <h5 className="card-title text-primary">Welcome Back! 🎉</h5>
                  <p className="mb-4">
                    Your dashboard is ready. Check your analytics and performance metrics below.
                  </p>
                  <a href="#" className="btn btn-sm btn-outline-primary">View Details</a>
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
      </div>

      {/* Stats Cards Row - Revenue, Sales, Payments, Transactions */}
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title d-flex align-items-start justify-content-between">
                <div className="avatar flex-shrink-0">
                  <img src="/sneat-assets/img/icons/unicons/chart-success.png" alt="chart success" className="rounded" />
                </div>
              </div>
              <span className="fw-semibold d-block mb-1">Revenue</span>
              <h3 className="card-title mb-2">$12,628</h3>
              <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title d-flex align-items-start justify-content-between">
                <div className="avatar flex-shrink-0">
                  <img src="/sneat-assets/img/icons/unicons/wallet-info.png" alt="wallet" className="rounded" />
                </div>
              </div>
              <span>Sales</span>
              <h3 className="card-title text-nowrap mb-1">$4,679</h3>
              <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.42%</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title d-flex align-items-start justify-content-between">
                <div className="avatar flex-shrink-0">
                  <img src="/sneat-assets/img/icons/unicons/paypal.png" alt="paypal" className="rounded" />
                </div>
              </div>
              <span className="d-block mb-1">Payments</span>
              <h3 className="card-title text-nowrap mb-2">$2,456</h3>
              <small className="text-danger fw-semibold"><i className="bx bx-down-arrow-alt"></i> -14.82%</small>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title d-flex align-items-start justify-content-between">
                <div className="avatar flex-shrink-0">
                  <img src="/sneat-assets/img/icons/unicons/cc-primary.png" alt="credit card" className="rounded" />
                </div>
              </div>
              <span className="fw-semibold d-block mb-1">Transactions</span>
              <h3 className="card-title mb-2">$14,857</h3>
              <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.14%</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
          <div className="card">
            <div className="row row-bordered g-0">
              <div className="col-md-8">
                <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
                <div id="totalRevenueChart" className="px-2"></div>
              </div>
              <div className="col-md-4">
                <div className="card-body">
                  <div className="text-center">
                    <h6 className="mb-1">Growth Report</h6>
                  </div>
                </div>
                <div id="growthChart"></div>
                <div className="text-center fw-semibold pt-3 mb-2">62% Company Growth</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="row">
        <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between pb-0">
              <div className="card-title mb-0">
                <h5 className="m-0 me-2">Order Statistics</h5>
                <small className="text-muted">42.82k Total Sales</small>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex flex-column align-items-center gap-1">
                  <h2 className="mb-2">8,258</h2>
                  <span>Total Orders</span>
                </div>
                <div id="orderStatisticsChart"></div>
              </div>
              <ul className="p-0 m-0">
                <li className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                    <span className="avatar-initial rounded bg-label-primary"><i className="bx bx-mobile-alt"></i></span>
                  </div>
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <h6 className="mb-0">Electronic</h6>
                      <small className="text-muted">Mobile, Earbuds, TV</small>
                    </div>
                    <div className="user-progress">
                      <small className="fw-semibold">82.5k</small>
                    </div>
                  </div>
                </li>
                <li className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                    <span className="avatar-initial rounded bg-label-success"><i className="bx bx-closet"></i></span>
                  </div>
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <h6 className="mb-0">Fashion</h6>
                      <small className="text-muted">T-shirt, Jeans, Shoes</small>
                    </div>
                    <div className="user-progress">
                      <small className="fw-semibold">23.8k</small>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 order-1 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <ul className="nav nav-pills" role="tablist">
                <li className="nav-item">
                  <button type="button" className="nav-link active" role="tab">Income</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link" role="tab">Expenses</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link" role="tab">Profit</button>
                </li>
              </ul>
            </div>
            <div className="card-body px-0">
              <div className="tab-content p-0">
                <div className="tab-pane fade show active">
                  <div className="d-flex p-4 pt-3">
                    <div className="avatar flex-shrink-0 me-3">
                      <img src="/sneat-assets/img/icons/unicons/wallet.png" alt="wallet" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Balance</small>
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-1">$459.10</h6>
                        <small className="text-success fw-semibold">
                          <i className="bx bx-chevron-up"></i>
                          42.9%
                        </small>
                      </div>
                    </div>
                  </div>
                  <div id="incomeChart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 order-2 mb-4">
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
