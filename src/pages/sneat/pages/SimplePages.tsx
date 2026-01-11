import React from 'react';

// Generic page component for all UI component pages
export const GenericPage: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  return (
    <>
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Components /</span> {title}
      </h4>
      <div className="card">
        <h5 className="card-header">{title}</h5>
        <div className="card-body">
          <p>{description || `This is the ${title} page. Refer to the original HTML file at pages/sneat-1.0.0/html/ for detailed content.`}</p>
          <p className="text-muted">
            The Sneat template includes comprehensive examples and components. 
            You can find the full implementation in your <code>pages/sneat-1.0.0/html/</code> folder.
          </p>
        </div>
      </div>
    </>
  );
};

// Cards Page
export const CardsPage: React.FC = () => (
  <>
    <h4 className="fw-bold py-3 mb-4">Cards</h4>
    <div className="row">
      <div className="col-md-6 col-lg-4 mb-3">
        <div className="card">
          <img className="card-img-top" src="/sneat-assets/img/elements/2.jpg" alt="Card" />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>
            <a href="#" className="btn btn-outline-primary">Go somewhere</a>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <h6 className="card-subtitle text-muted">Support card subtitle</h6>
          </div>
          <img className="card-img-bottom" src="/sneat-assets/img/elements/1.jpg" alt="Card" />
        </div>
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <div className="card">
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Card with header</h5>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    </div>
    <p className="text-muted">For more card examples, refer to pages/sneat-1.0.0/html/cards-basic.html</p>
  </>
);

// Tables Page
export const TablesPage: React.FC = () => (
  <>
    <h4 className="fw-bold py-3 mb-4">Tables</h4>
    <div className="card">
      <h5 className="card-header">Table Basic</h5>
      <div className="table-responsive text-nowrap">
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-border-bottom-0">
            <tr>
              <td><strong>Angular Project</strong></td>
              <td>Albert Cook</td>
              <td>
                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                  <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" className="avatar avatar-xs pull-up" title="Lilian Fuller">
                    <img src="/sneat-assets/img/avatars/5.png" alt="Avatar" className="rounded-circle" />
                  </li>
                </ul>
              </td>
              <td><span className="badge bg-label-primary me-1">Active</span></td>
              <td>
                <div className="dropdown">
                  <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i className="bx bx-dots-vertical-rounded"></i>
                  </button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#"><i className="bx bx-edit-alt me-1"></i> Edit</a>
                    <a className="dropdown-item" href="#"><i className="bx bx-trash me-1"></i> Delete</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td><strong>React Project</strong></td>
              <td>Barry Hunter</td>
              <td>
                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                  <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" className="avatar avatar-xs pull-up" title="Lilian Fuller">
                    <img src="/sneat-assets/img/avatars/6.png" alt="Avatar" className="rounded-circle" />
                  </li>
                </ul>
              </td>
              <td><span className="badge bg-label-success me-1">Completed</span></td>
              <td>
                <div className="dropdown">
                  <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i className="bx bx-dots-vertical-rounded"></i>
                  </button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#"><i className="bx bx-edit-alt me-1"></i> Edit</a>
                    <a className="dropdown-item" href="#"><i className="bx bx-trash me-1"></i> Delete</a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p className="text-muted mt-3">For more table examples, refer to pages/sneat-1.0.0/html/tables-basic.html</p>
  </>
);

// Icons Page
export const IconsPage: React.FC = () => (
  <>
    <h4 className="fw-bold py-3 mb-4">Boxicons</h4>
    <div className="card">
      <h5 className="card-header">Icon Examples</h5>
      <div className="card-body">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <i className="bx bx-home me-2"></i> bx-home
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <i className="bx bx-user me-2"></i> bx-user
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <i className="bx bx-bell me-2"></i> bx-bell
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <i className="bx bx-heart me-2"></i> bx-heart
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <i className="bx bx-star me-2"></i> bx-star
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <i className="bx bx-search me-2"></i> bx-search
          </div>
        </div>
        <p className="text-muted">For complete icon list, refer to pages/sneat-1.0.0/html/icons-boxicons.html</p>
      </div>
    </div>
  </>
);

// Forms Pages
export const FormsBasicInputs: React.FC = () => (
  <>
    <h4 className="fw-bold py-3 mb-4">Basic Inputs</h4>
    <div className="row">
      <div className="col-md-6">
        <div className="card mb-4">
          <h5 className="card-header">Default</h5>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="defaultInput" className="form-label">Default Input</label>
              <input type="text" className="form-control" id="defaultInput" placeholder="Default input" />
            </div>
            <div className="mb-3">
              <label htmlFor="helperText" className="form-label">With Helper Text</label>
              <input type="text" id="helperText" className="form-control" placeholder="Helper text" />
              <div className="form-text">This is some helper text</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card mb-4">
          <h5 className="card-header">Disabled / Readonly</h5>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="disabledInput" className="form-label">Disabled</label>
              <input type="text" className="form-control" id="disabledInput" placeholder="Disabled input" disabled />
            </div>
            <div className="mb-3">
              <label htmlFor="readonlyInput" className="form-label">Readonly</label>
              <input type="text" className="form-control" id="readonlyInput" value="Readonly input" readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="text-muted">For more form examples, refer to pages/sneat-1.0.0/html/forms-basic-inputs.html</p>
  </>
);

export const FormLayouts: React.FC<{ layout: 'vertical' | 'horizontal' }> = ({ layout }) => (
  <>
    <h4 className="fw-bold py-3 mb-4">{layout === 'vertical' ? 'Vertical' : 'Horizontal'} Form</h4>
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-4">
          <h5 className="card-header">{layout === 'vertical' ? 'Vertical' : 'Horizontal'} Form</h5>
          <div className="card-body">
            <form>
              <div className={layout === 'horizontal' ? 'row mb-3' : 'mb-3'}>
                <label className={layout === 'horizontal' ? 'col-sm-2 col-form-label' : 'form-label'} htmlFor="basic-default-name">Name</label>
                <div className={layout === 'horizontal' ? 'col-sm-10' : ''}>
                  <input type="text" className="form-control" id="basic-default-name" placeholder="John Doe" />
                </div>
              </div>
              <div className={layout === 'horizontal' ? 'row mb-3' : 'mb-3'}>
                <label className={layout === 'horizontal' ? 'col-sm-2 col-form-label' : 'form-label'} htmlFor="basic-default-email">Email</label>
                <div className={layout === 'horizontal' ? 'col-sm-10' : ''}>
                  <div className="input-group input-group-merge">
                    <input type="text" id="basic-default-email" className="form-control" placeholder="john.doe" />
                    <span className="input-group-text">@example.com</span>
                  </div>
                </div>
              </div>
              <div className={layout === 'horizontal' ? 'row justify-content-end' : ''}>
                <div className={layout === 'horizontal' ? 'col-sm-10' : ''}>
                  <button type="submit" className="btn btn-primary">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <p className="text-muted">For more examples, refer to pages/sneat-1.0.0/html/form-layouts-{layout}.html</p>
  </>
);

// Misc Pages
export const ErrorPage: React.FC = () => (
  <div className="container-xxl container-p-y">
    <div className="misc-wrapper">
      <h2 className="mb-2 mx-2">Page Not Found :(</h2>
      <p className="mb-4 mx-2">Oops! The requested page was not found on this server.</p>
      <a href="/userprofile" className="btn btn-primary">Back to home</a>
      <div className="mt-3">
        <img src="/sneat-assets/img/illustrations/page-misc-error-light.png" alt="page-misc-error-light" width="500" className="img-fluid" />
      </div>
    </div>
  </div>
);

export const MaintenancePage: React.FC = () => (
  <div className="container-xxl container-p-y">
    <div className="misc-wrapper">
      <h2 className="mb-2 mx-2">Under Maintenance!</h2>
      <p className="mb-4 mx-2">Sorry for the inconvenience but we're performing some maintenance at the moment</p>
      <a href="/userprofile" className="btn btn-primary">Back to home</a>
      <div className="mt-4">
        <img src="/sneat-assets/img/illustrations/girl-doing-yoga-light.png" alt="girl-doing-yoga-light" width="500" className="img-fluid" />
      </div>
    </div>
  </div>
);
