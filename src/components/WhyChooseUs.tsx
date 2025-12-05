import { HomepageButton } from "@/components/ui/HomepageButton";

export const WhyChooseUs = () => {
  return (
    <div className="container-fluid py-5">
      <div className="container" style={{ maxWidth: '100%', paddingLeft: 'clamp(15px, 5vw, 80px)', paddingRight: 'clamp(15px, 5vw, 80px)' }}>
        <div className="row g-5 align-items-center">
          {/* Left Side - Text Content */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <p 
              className="d-inline-block border rounded fw-semi-bold py-1 px-3 mb-3"
              style={{
                backgroundColor: '#F5F5F5',
                borderColor: '#E0E0E0',
                color: '#555555',
                fontSize: '0.875rem',
                letterSpacing: '0.5px'
              }}
            >
              Why Choosing Us!
            </p>
            <div style={{ 
              width: '100%', 
              height: '1px', 
              backgroundColor: 'rgba(44, 44, 44, 0.1)', 
              marginBottom: '24px',
              maxWidth: '200px'
            }}></div>
            <h1 
              className="display-5 mb-4"
              style={{
                color: '#2C2C2C',
                fontWeight: 700,
                lineHeight: '1.2'
              }}
            >
              Few Reasons Why People Choosing Us!
            </h1>
            <p 
              className="mb-4"
              style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: '#555555'
              }}
            >
              The Ghana National Resource System (GNRS) stands out as the premier platform for accessing essential national resources. We provide comprehensive, reliable, and accessible services that connect every Ghanaian with opportunities for education, employment, and national information. Our commitment to excellence and user satisfaction makes us the trusted choice for millions of citizens across Ghana.
            </p>
            <HomepageButton href="#services">
              Explore More
            </HomepageButton>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
            <div className="d-flex flex-column gap-4">
              {/* Card 1: Fast Executions */}
              <div 
                className="border rounded p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0E0E0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#355EFC',
                      marginRight: '16px'
                    }}
                  >
                    <i className="fa fa-check text-white" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 
                      className="mb-2"
                      style={{
                        color: '#2C2C2C',
                        fontWeight: 600,
                        fontSize: '1.25rem'
                      }}
                    >
                      Fast Executions
                    </h4>
                    <p 
                      className="mb-3"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}
                    >
                      Our platform delivers quick and efficient access to resources. Whether you're searching for educational opportunities, job listings, or national information, we ensure rapid response times and streamlined processes that save you valuable time.
                    </p>
                    <a 
                      href="#"
                      style={{
                        color: '#355EFC',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      Read More <i className="fa fa-arrow-right" style={{ fontSize: '12px' }}></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Guide & Support */}
              <div 
                className="border rounded p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0E0E0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#355EFC',
                      marginRight: '16px'
                    }}
                  >
                    <i className="fa fa-check text-white" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 
                      className="mb-2"
                      style={{
                        color: '#2C2C2C',
                        fontWeight: 600,
                        fontSize: '1.25rem'
                      }}
                    >
                      Guide & Support
                    </h4>
                    <p 
                      className="mb-3"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}
                    >
                      Our dedicated support team is always ready to assist you. From navigating the platform to finding specific resources, we provide comprehensive guidance and support to ensure you have the best experience accessing national resources.
                    </p>
                    <a 
                      href="#"
                      style={{
                        color: '#355EFC',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      Read More <i className="fa fa-arrow-right" style={{ fontSize: '12px' }}></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3: Financial Secure */}
              <div 
                className="border rounded p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0E0E0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#355EFC',
                      marginRight: '16px'
                    }}
                  >
                    <i className="fa fa-check text-white" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 
                      className="mb-2"
                      style={{
                        color: '#2C2C2C',
                        fontWeight: 600,
                        fontSize: '1.25rem'
                      }}
                    >
                      Financial Secure
                    </h4>
                    <p 
                      className="mb-3"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}
                    >
                      All our services are completely free and secure. We ensure the highest standards of data protection and privacy, giving you peace of mind while accessing valuable national resources without any financial concerns.
                    </p>
                    <a 
                      href="#"
                      style={{
                        color: '#355EFC',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      Read More <i className="fa fa-arrow-right" style={{ fontSize: '12px' }}></i>
                    </a>
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

