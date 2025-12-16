import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HelpCircle, MessageCircle, BookOpen, Users, Mail, Phone, ArrowRight, CheckCircle } from "lucide-react";

const GuideSupport = () => {
  const styles = `
    .guide-support-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .guide-support-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .guide-support-hero {
      background: #ffffff;
      color: #000000;
      padding: 4rem 2rem;
      margin: 120px 0 3rem 0;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      text-align: center;
    }

    .guide-support-hero-icon {
      width: 80px;
      height: 80px;
      background: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      color: #000000;
    }

    .guide-support-hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .guide-support-hero-subtitle {
      font-size: 1.25rem;
      margin: 0;
      opacity: 0.95;
      line-height: 1.6;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .guide-support-content {
      padding: 3rem 0;
    }

    .guide-support-intro {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 4rem;
      text-align: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .guide-support-services {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .guide-support-service {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .guide-support-service:hover {
      border-color: #006B3F;
      box-shadow: 0 8px 24px rgba(0, 107, 63, 0.1);
      transform: translateY(-4px);
    }

    .guide-support-service-icon {
      width: 56px;
      height: 56px;
      background: #f5f5f5;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      margin-bottom: 1.5rem;
    }

    .guide-support-service-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
    }

    .guide-support-service-description {
      font-size: 1rem;
      line-height: 1.7;
      color: #4a4a4a;
      margin: 0;
    }

    .guide-support-resources {
      background: #f9fafb;
      border-radius: 12px;
      padding: 3rem 2rem;
      margin-bottom: 4rem;
    }

    .guide-support-resources-title {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 2rem 0;
      text-align: center;
    }

    .guide-support-resources-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .guide-support-resource-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .guide-support-resource-icon {
      color: #000000;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .guide-support-resource-text {
      font-size: 1rem;
      line-height: 1.6;
      color: #4a4a4a;
      margin: 0;
    }

    .guide-support-contact {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      color: #000000;
      border: 1px solid #e5e7eb;
      margin-bottom: 4rem;
    }

    .guide-support-contact-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
    }

    .guide-support-contact-text {
      font-size: 1.125rem;
      margin: 0 0 2rem 0;
      opacity: 0.95;
      line-height: 1.6;
    }

    .guide-support-contact-methods {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .guide-support-contact-method {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      text-decoration: none;
      color: #000000;
      transition: all 0.3s ease;
    }

    .guide-support-contact-method:hover {
      background: #f5f5f5;
      border-color: #000000;
      transform: translateY(-2px);
    }

    .guide-support-cta {
      background: #f9fafb;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
    }

    .guide-support-cta-title {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
    }

    .guide-support-cta-text {
      font-size: 1.125rem;
      color: #4a4a4a;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .guide-support-cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: #000000;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .guide-support-cta-button:hover {
      background: #333333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 767px) {
      .guide-support-hero {
        padding: 3rem 1.5rem;
        margin: 100px 0 2rem 0;
      }

      .guide-support-hero-title {
        font-size: 2rem;
      }

      .guide-support-hero-subtitle {
        font-size: 1.125rem;
      }

      .guide-support-services {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .guide-support-resources-list {
        grid-template-columns: 1fr;
      }

      .guide-support-contact-methods {
        flex-direction: column;
        align-items: center;
      }
    }
  `;

  return (
    <div className="guide-support-page">
      <style>{styles}</style>
      <Navigation />
      <div className="guide-support-wrapper">
        <div className="guide-support-hero">
          <div className="guide-support-hero-icon">
            <HelpCircle size={40} />
          </div>
          <h1 className="guide-support-hero-title">Guide & Support</h1>
          <p className="guide-support-hero-subtitle">
            Our dedicated support team is always ready to assist you. From navigating the platform to finding specific resources, we provide comprehensive guidance and support to ensure you have the best experience accessing national resources.
          </p>
        </div>

        <div className="guide-support-content">
          <p className="guide-support-intro">
            At Ghana National Resource System (GNRS), we believe that everyone should have access to the support they need to succeed. Our comprehensive support system includes detailed guides, responsive customer service, and a wealth of resources designed to help you make the most of our platform.
          </p>

          <div className="guide-support-services">
            <div className="guide-support-service">
              <div className="guide-support-service-icon">
                <BookOpen size={28} />
              </div>
              <h2 className="guide-support-service-title">Comprehensive Guides</h2>
              <p className="guide-support-service-description">
                Access detailed step-by-step guides covering every aspect of our platform. From creating your account to applying for opportunities, our guides walk you through each process with clear instructions and helpful tips.
              </p>
            </div>

            <div className="guide-support-service">
              <div className="guide-support-service-icon">
                <MessageCircle size={28} />
              </div>
              <h2 className="guide-support-service-title">Live Support</h2>
              <p className="guide-support-service-description">
                Get real-time assistance from our support team. Whether you have questions about features, need help with an application, or encounter any issues, our team is here to help you every step of the way.
              </p>
            </div>

            <div className="guide-support-service">
              <div className="guide-support-service-icon">
                <Users size={28} />
              </div>
              <h2 className="guide-support-service-title">Community Forums</h2>
              <p className="guide-support-service-description">
                Connect with other users, share experiences, and learn from the community. Our forums are a great place to ask questions, get advice, and discover tips and tricks from fellow Ghanaians.
              </p>
            </div>
          </div>

          <div className="guide-support-resources">
            <h2 className="guide-support-resources-title">Available Support Resources</h2>
            <ul className="guide-support-resources-list">
              <li className="guide-support-resource-item">
                <CheckCircle size={24} className="guide-support-resource-icon" />
                <p className="guide-support-resource-text">
                  <strong>Getting Started Guides:</strong> New to the platform? Our comprehensive getting started guides will help you navigate and understand all features.
                </p>
              </li>
              <li className="guide-support-resource-item">
                <CheckCircle size={24} className="guide-support-resource-icon" />
                <p className="guide-support-resource-text">
                  <strong>Video Tutorials:</strong> Watch step-by-step video tutorials that demonstrate how to use various features and complete common tasks.
                </p>
              </li>
              <li className="guide-support-resource-item">
                <CheckCircle size={24} className="guide-support-resource-icon" />
                <p className="guide-support-resource-text">
                  <strong>FAQ Section:</strong> Find answers to frequently asked questions covering topics from account management to application processes.
                </p>
              </li>
              <li className="guide-support-resource-item">
                <CheckCircle size={24} className="guide-support-resource-icon" />
                <p className="guide-support-resource-text">
                  <strong>Help Center:</strong> Browse our extensive help center with articles, troubleshooting guides, and best practices for using the platform.
                </p>
              </li>
              <li className="guide-support-resource-item">
                <CheckCircle size={24} className="guide-support-resource-icon" />
                <p className="guide-support-resource-text">
                  <strong>Email Support:</strong> Send us an email with your questions or concerns, and our team will respond within 24 hours with detailed assistance.
                </p>
              </li>
              <li className="guide-support-resource-item">
                <CheckCircle size={24} className="guide-support-resource-icon" />
                <p className="guide-support-resource-text">
                  <strong>Phone Support:</strong> Speak directly with our support team during business hours for immediate assistance with urgent matters.
                </p>
              </li>
            </ul>
          </div>

          <div className="guide-support-contact">
            <h2 className="guide-support-contact-title">Get in Touch</h2>
            <p className="guide-support-contact-text">
              Have a question or need assistance? Our support team is here to help. Choose your preferred method of contact.
            </p>
            <div className="guide-support-contact-methods">
              <a href="mailto:support@gnrs.gov.gh" className="guide-support-contact-method">
                <Mail size={20} />
                <span>Email Support</span>
              </a>
              <a href="tel:+233XXXXXXXXX" className="guide-support-contact-method">
                <Phone size={20} />
                <span>Call Us</span>
              </a>
              <Link to="/info" className="guide-support-contact-method">
                <HelpCircle size={20} />
                <span>Visit Help Center</span>
              </Link>
            </div>
          </div>

          <div className="guide-support-cta">
            <h2 className="guide-support-cta-title">Ready to Get Started?</h2>
            <p className="guide-support-cta-text">
              Explore our platform with confidence knowing that comprehensive support is always available. Start your journey today and discover the resources you need.
            </p>
            <Link to="/" className="guide-support-cta-button">
              Explore Platform <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GuideSupport;

