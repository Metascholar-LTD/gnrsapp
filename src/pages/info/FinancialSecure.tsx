import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Lock, CreditCard, Eye, CheckCircle, ArrowRight } from "lucide-react";

const FinancialSecure = () => {
  const styles = `
    .financial-secure-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .financial-secure-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .financial-secure-hero {
      background: #ffffff;
      color: #000000;
      padding: 4rem 2rem;
      margin: 120px 0 3rem 0;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      text-align: center;
    }

    .financial-secure-hero-icon {
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

    .financial-secure-hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .financial-secure-hero-subtitle {
      font-size: 1.25rem;
      margin: 0;
      opacity: 0.95;
      line-height: 1.6;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .financial-secure-content {
      padding: 3rem 0;
    }

    .financial-secure-intro {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 4rem;
      text-align: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .financial-secure-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .financial-secure-feature {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .financial-secure-feature:hover {
      border-color: #006B3F;
      box-shadow: 0 8px 24px rgba(0, 107, 63, 0.1);
      transform: translateY(-4px);
    }

    .financial-secure-feature-icon {
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

    .financial-secure-feature-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
    }

    .financial-secure-feature-description {
      font-size: 1rem;
      line-height: 1.7;
      color: #4a4a4a;
      margin: 0;
    }

    .financial-secure-benefits {
      background: #f9fafb;
      border-radius: 12px;
      padding: 3rem 2rem;
      margin-bottom: 4rem;
    }

    .financial-secure-benefits-title {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 2rem 0;
      text-align: center;
    }

    .financial-secure-benefits-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .financial-secure-benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .financial-secure-benefit-icon {
      color: #000000;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .financial-secure-benefit-text {
      font-size: 1rem;
      line-height: 1.6;
      color: #4a4a4a;
      margin: 0;
    }

    .financial-secure-security {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 3rem 2rem;
      color: #000000;
      border: 1px solid #e5e7eb;
      margin-bottom: 4rem;
    }

    .financial-secure-security-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .financial-secure-security-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .financial-secure-security-feature {
      text-align: center;
    }

    .financial-secure-security-feature-icon {
      width: 64px;
      height: 64px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: #000000;
    }

    .financial-secure-security-feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .financial-secure-security-feature-text {
      font-size: 0.9375rem;
      opacity: 0.9;
      line-height: 1.6;
      margin: 0;
    }

    .financial-secure-cta {
      background: #f9fafb;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
    }

    .financial-secure-cta-title {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
    }

    .financial-secure-cta-text {
      font-size: 1.125rem;
      color: #4a4a4a;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .financial-secure-cta-button {
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

    .financial-secure-cta-button:hover {
      background: #333333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 767px) {
      .financial-secure-hero {
        padding: 3rem 1.5rem;
        margin: 100px 0 2rem 0;
      }

      .financial-secure-hero-title {
        font-size: 2rem;
      }

      .financial-secure-hero-subtitle {
        font-size: 1.125rem;
      }

      .financial-secure-features {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .financial-secure-benefits-list {
        grid-template-columns: 1fr;
      }

      .financial-secure-security-features {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="financial-secure-page">
      <style>{styles}</style>
      <Navigation />
      <div className="financial-secure-wrapper">
        <div className="financial-secure-hero">
          <div className="financial-secure-hero-icon">
            <Shield size={40} />
          </div>
          <h1 className="financial-secure-hero-title">Financial Secure</h1>
          <p className="financial-secure-hero-subtitle">
            All our services are completely free and secure. We ensure the highest standards of data protection and privacy, giving you peace of mind while accessing valuable national resources without any financial concerns.
          </p>
        </div>

        <div className="financial-secure-content">
          <p className="financial-secure-intro">
            At Ghana National Resource System (GNRS), we believe that access to essential resources should never be limited by financial barriers. Our platform is completely free to use, and we maintain the highest standards of security and privacy to protect your information and ensure your peace of mind.
          </p>

          <div className="financial-secure-features">
            <div className="financial-secure-feature">
              <div className="financial-secure-feature-icon">
                <CreditCard size={28} />
              </div>
              <h2 className="financial-secure-feature-title">100% Free Access</h2>
              <p className="financial-secure-feature-description">
                All services on our platform are completely free. No hidden fees, no subscription costs, no charges for accessing resources. We're committed to making national resources accessible to all Ghanaians, regardless of financial status.
              </p>
            </div>

            <div className="financial-secure-feature">
              <div className="financial-secure-feature-icon">
                <Lock size={28} />
              </div>
              <h2 className="financial-secure-feature-title">Bank-Level Security</h2>
              <p className="financial-secure-feature-description">
                Your data is protected with industry-leading encryption and security measures. We use the same security standards as major financial institutions to ensure your personal information remains safe and confidential.
              </p>
            </div>

            <div className="financial-secure-feature">
              <div className="financial-secure-feature-icon">
                <Eye size={28} />
              </div>
              <h2 className="financial-secure-feature-title">Privacy First</h2>
              <p className="financial-secure-feature-description">
                We respect your privacy and never share your personal information with third parties. Your data belongs to you, and we're committed to transparency about how we collect, use, and protect it.
              </p>
            </div>
          </div>

          <div className="financial-secure-benefits">
            <h2 className="financial-secure-benefits-title">Why Trust Us</h2>
            <ul className="financial-secure-benefits-list">
              <li className="financial-secure-benefit-item">
                <CheckCircle size={24} className="financial-secure-benefit-icon" />
                <p className="financial-secure-benefit-text">
                  <strong>No Financial Barriers:</strong> Access all resources, apply for opportunities, and use all features without any cost. Education, jobs, and information should be accessible to everyone.
                </p>
              </li>
              <li className="financial-secure-benefit-item">
                <CheckCircle size={24} className="financial-secure-benefit-icon" />
                <p className="financial-secure-benefit-text">
                  <strong>Secure Data Storage:</strong> All your information is stored securely using encrypted databases and protected by multiple layers of security protocols.
                </p>
              </li>
              <li className="financial-secure-benefit-item">
                <CheckCircle size={24} className="financial-secure-benefit-icon" />
                <p className="financial-secure-benefit-text">
                  <strong>Regular Security Audits:</strong> We conduct regular security assessments and updates to ensure our platform meets the highest security standards.
                </p>
              </li>
              <li className="financial-secure-benefit-item">
                <CheckCircle size={24} className="financial-secure-benefit-icon" />
                <p className="financial-secure-benefit-text">
                  <strong>Transparent Privacy Policy:</strong> Our privacy policy is clear and straightforward. We explain exactly how we handle your data and what rights you have.
                </p>
              </li>
              <li className="financial-secure-benefit-item">
                <CheckCircle size={24} className="financial-secure-benefit-icon" />
                <p className="financial-secure-benefit-text">
                  <strong>No Data Selling:</strong> We never sell your personal information to advertisers or third parties. Your privacy is not for sale.
                </p>
              </li>
              <li className="financial-secure-benefit-item">
                <CheckCircle size={24} className="financial-secure-benefit-icon" />
                <p className="financial-secure-benefit-text">
                  <strong>Compliance with Regulations:</strong> We comply with all relevant data protection regulations and continuously work to exceed industry standards.
                </p>
              </li>
            </ul>
          </div>

          <div className="financial-secure-security">
            <h2 className="financial-secure-security-title">Our Security Measures</h2>
            <div className="financial-secure-security-features">
              <div className="financial-secure-security-feature">
                <div className="financial-secure-security-feature-icon">
                  <Lock size={32} />
                </div>
                <h3 className="financial-secure-security-feature-title">SSL Encryption</h3>
                <p className="financial-secure-security-feature-text">
                  All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols.
                </p>
              </div>
              <div className="financial-secure-security-feature">
                <div className="financial-secure-security-feature-icon">
                  <Shield size={32} />
                </div>
                <h3 className="financial-secure-security-feature-title">Secure Authentication</h3>
                <p className="financial-secure-security-feature-text">
                  Multi-factor authentication and secure password policies protect your account from unauthorized access.
                </p>
              </div>
              <div className="financial-secure-security-feature">
                <div className="financial-secure-security-feature-icon">
                  <Eye size={32} />
                </div>
                <h3 className="financial-secure-security-feature-title">Privacy Controls</h3>
                <p className="financial-secure-security-feature-text">
                  You have full control over your privacy settings and can manage what information is visible to others.
                </p>
              </div>
            </div>
          </div>

          <div className="financial-secure-cta">
            <h2 className="financial-secure-cta-title">Start Using Our Secure Platform</h2>
            <p className="financial-secure-cta-text">
              Join thousands of Ghanaians who trust us with their information. Experience the peace of mind that comes with free, secure access to national resources.
            </p>
            <Link to="/" className="financial-secure-cta-button">
              Get Started Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FinancialSecure;

