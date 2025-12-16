import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface WhyChooseUsContent {
  id: string;
  title: string | null;
  description: string | null;
  fast_executions_description: string | null;
  guide_support_description: string | null;
  financial_secure_description: string | null;
}

export const WhyChooseUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<WhyChooseUsContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhyChooseUsContent();
  }, []);

  const fetchWhyChooseUsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('why_choose_us_section' as any)
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching why choose us section:', error);
      } else if (data) {
        setContent(data as WhyChooseUsContent);
      }
    } catch (error) {
      console.error('Error fetching why choose us section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If already on the info page, just scroll to the section
    if (location.pathname === '/info') {
      const element = document.getElementById('platform-features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to info page with hash, the useEffect in InfoHub will handle scrolling
      navigate('/info#platform-features');
    }
  };
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
              {content?.title || 'Few Reasons Why People Choosing Us!'}
            </h1>
            <p 
              className="mb-4"
              style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: '#555555'
              }}
            >
              {content?.description || 'The Ghana National Resource System (GNRS) stands out as the premier platform for accessing essential national resources. We provide comprehensive, reliable, and accessible services that connect every Ghanaian with opportunities for education, employment, and national information. Our commitment to excellence and user satisfaction makes us the trusted choice for millions of citizens across Ghana.'}
            </p>
            <a 
              href="/info#platform-features"
              onClick={handleReadMoreClick}
              style={{
                color: '#2C2C2C',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-block',
                position: 'relative',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                letterSpacing: '0.3px',
                paddingBottom: '2px'
              }}
              onMouseEnter={(e) => {
                const link = e.currentTarget;
                const underline = link.querySelector('.underline-animation') as HTMLElement;
                link.style.color = '#1a1a1a';
                if (underline) {
                  underline.style.width = '100%';
                }
              }}
              onMouseLeave={(e) => {
                const link = e.currentTarget;
                const underline = link.querySelector('.underline-animation') as HTMLElement;
                link.style.color = '#2C2C2C';
                if (underline) {
                  underline.style.width = '0%';
                }
              }}
            >
              Read More
              <span 
                className="underline-animation"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: 0,
                  width: '0%',
                  height: '2.5px',
                  backgroundColor: '#2C2C2C',
                  transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '2px'
                }}
              ></span>
            </a>
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
                      backgroundColor: '#F5F5F5',
                      marginRight: '16px'
                    }}
                  >
                    <i className="fa fa-check" style={{ fontSize: '20px', color: '#2C2C2C' }}></i>
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
                      className="mb-0"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}
                    >
                      {content?.fast_executions_description || 'Our platform delivers quick and efficient access to resources. Whether you\'re searching for educational opportunities, job listings, or national information, we ensure rapid response times and streamlined processes that save you valuable time.'}
                    </p>
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
                      backgroundColor: '#F5F5F5',
                      marginRight: '16px'
                    }}
                  >
                    <i className="fa fa-check" style={{ fontSize: '20px', color: '#2C2C2C' }}></i>
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
                      className="mb-0"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}
                    >
                      {content?.guide_support_description || 'Our dedicated support team is always ready to assist you. From navigating the platform to finding specific resources, we provide comprehensive guidance and support to ensure you have the best experience accessing national resources.'}
                    </p>
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
                      backgroundColor: '#F5F5F5',
                      marginRight: '16px'
                    }}
                  >
                    <i className="fa fa-check" style={{ fontSize: '20px', color: '#2C2C2C' }}></i>
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
                      className="mb-0"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}
                    >
                      {content?.financial_secure_description || 'All our services are completely free and secure. We ensure the highest standards of data protection and privacy, giving you peace of mind while accessing valuable national resources without any financial concerns.'}
                    </p>
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

