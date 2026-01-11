import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AccountSettings: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();

  return (
    <>
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Account Settings /</span> {currentTab === 'account' ? 'Account' : currentTab === 'notifications' ? 'Notifications' : 'Connections'}
      </h4>

      <div className="row">
        <div className="col-md-12">
          <ul className="nav nav-pills flex-column flex-md-row mb-3">
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'account' ? 'active' : ''}`} to="/userprofile/account-settings/account">
                <i className="bx bx-user me-1"></i> Account
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'notifications' ? 'active' : ''}`} to="/userprofile/account-settings/notifications">
                <i className="bx bx-bell me-1"></i> Notifications
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${currentTab === 'connections' ? 'active' : ''}`} to="/userprofile/account-settings/connections">
                <i className="bx bx-link-alt me-1"></i> Connections
              </Link>
            </li>
          </ul>

          {currentTab === 'account' && (
            <div className="card mb-4">
              <h5 className="card-header">Profile Details</h5>
              <div className="card-body">
                <div className="d-flex align-items-start align-items-sm-center gap-4">
                  <img src="/sneat-assets/img/avatars/1.png" alt="user-avatar" className="d-block rounded" height="100" width="100" />
                  <div className="button-wrapper">
                    <label htmlFor="upload" className="btn btn-primary me-2 mb-4" tabIndex={0}>
                      <span className="d-none d-sm-block">Upload new photo</span>
                      <i className="bx bx-upload d-block d-sm-none"></i>
                      <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" />
                    </label>
                    <button type="button" className="btn btn-outline-secondary account-image-reset mb-4">
                      <i className="bx bx-reset d-block d-sm-none"></i>
                      <span className="d-none d-sm-block">Reset</span>
                    </button>
                    <p className="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input className="form-control" type="text" id="firstName" name="firstName" defaultValue="John" autoFocus />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input className="form-control" type="text" name="lastName" id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="email" className="form-label">E-mail</label>
                      <input className="form-control" type="text" id="email" name="email" defaultValue="john.doe@example.com" placeholder="john.doe@example.com" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="organization" className="form-label">Organization</label>
                      <input type="text" className="form-control" id="organization" name="organization" defaultValue="Company" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                      <div className="input-group input-group-merge">
                        <span className="input-group-text">US (+1)</span>
                        <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="202 555 0111" />
                      </div>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input type="text" className="form-control" id="address" name="address" placeholder="Address" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <button type="submit" className="btn btn-primary me-2">Save changes</button>
                    <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentTab === 'notifications' && (
            <div className="card">
              <h5 className="card-header">Notifications</h5>
              <div className="card-body">
                <span>You can manage your notification preferences here.</span>
                <div className="mt-3">
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="emailNotifications">Email Notifications</label>
                  </div>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="smsNotifications" />
                    <label className="form-check-label" htmlFor="smsNotifications">SMS Notifications</label>
                  </div>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="pushNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="pushNotifications">Push Notifications</label>
                  </div>
                </div>
                <div className="mt-4">
                  <button type="button" className="btn btn-primary me-2">Save changes</button>
                  <button type="button" className="btn btn-outline-secondary">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'connections' && (
            <div className="card">
              <h5 className="card-header">Connected Accounts</h5>
              <div className="card-body">
                <div className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <img src="/sneat-assets/img/icons/brands/google.png" alt="google" className="me-3" height="30" />
                  </div>
                  <div className="flex-grow-1 row">
                    <div className="col-9 mb-sm-0 mb-2">
                      <h6 className="mb-0">Google</h6>
                      <small className="text-muted">Calendar and Contacts</small>
                    </div>
                    <div className="col-3 text-end">
                      <button className="btn btn-sm btn-outline-danger">Disconnect</button>
                    </div>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <img src="/sneat-assets/img/icons/brands/github.png" alt="github" className="me-3" height="30" />
                  </div>
                  <div className="flex-grow-1 row">
                    <div className="col-9 mb-sm-0 mb-2">
                      <h6 className="mb-0">Github</h6>
                      <small className="text-muted">Manage your Git repositories</small>
                    </div>
                    <div className="col-3 text-end">
                      <button className="btn btn-sm btn-primary">Connect</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
