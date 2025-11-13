export const Footer = () => {
  return (
    <>
      <div className="container-fluid text-light footer mt-5 py-5 wow fadeIn" style={{background: 'linear-gradient(135deg, #2C2C2C 0%, #1a1a1a 100%)'}} data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Our Office</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Accra, Ghana</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+233 XX XXX XXXX</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@gnrs.gov.gh</p>
              <div className="d-flex pt-2">
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href=""><i className="fab fa-twitter"></i></a>
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href=""><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href=""><i className="fab fa-youtube"></i></a>
                <a className="btn btn-square btn-outline-light rounded-circle me-2" href=""><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Services</h4>
              <a className="btn btn-link" href="/education">Education Resources</a>
              <a className="btn btn-link" href="/jobs">Job Opportunities</a>
              <a className="btn btn-link" href="/news">News & Updates</a>
              <a className="btn btn-link" href="/contact">National Resources</a>
              <a className="btn btn-link" href="/contact">Contact Us</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Quick Links</h4>
              <a className="btn btn-link" href="#about">About Us</a>
              <a className="btn btn-link" href="/contact">Contact Us</a>
              <a className="btn btn-link" href="#services">Our Services</a>
              <a className="btn btn-link" href="">Terms & Condition</a>
              <a className="btn btn-link" href="">Support</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-4">Newsletter</h4>
              <p>Stay updated with the latest news, job opportunities, and educational resources from GNRS.</p>
              <div className="position-relative w-100">
                <input className="form-control bg-white border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="#">Ghana National Resource System (GNRS)</a>, All Right Reserved.
            </div>
            <div className="col-md-6 text-center text-md-end">
              {/*/*** The author's attribution link below must remain intact on your website. ***/}
              {/*/*** If you wish to remove this credit link, please purchase the Pro Version from https://htmlcodex.com . ***/}
              Designed By <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
            </div>
          </div>
        </div>
      </div>

      <a 
        href="#" 
        className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
      >
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  );
};
