import { HomepageButton } from "@/components/ui/HomepageButton";

export const Contact = () => {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
            <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Contact</p>
            <h1 className="display-5 mb-4">If You Have Any Query, Please Contact Us</h1>
            <p className="mb-4">Have questions about our services? Need assistance accessing resources? Our team is here to help. Reach out to us through the form below or visit our office in Accra, Ghana.</p>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="name" placeholder="Your Name" />
                    <label htmlFor="name">Your Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Your Email" />
                    <label htmlFor="email">Your Email</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="subject" placeholder="Subject" />
                    <label htmlFor="subject">Subject</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: '100px' }}></textarea>
                    <label htmlFor="message">Message</label>
                  </div>
                </div>
                <div className="col-12">
                  <HomepageButton type="submit">Send Message</HomepageButton>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s" style={{ minHeight: '450px' }}>
            <div className="position-relative rounded overflow-hidden h-100">
              <iframe 
                className="position-relative w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.789965896123!2d-0.186964385258804!3d5.603295995936893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9c99b0100001%3A0x42107cf9ad32f202!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                style={{ minHeight: '450px', border: 0 }} 
                allowFullScreen={true} 
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
