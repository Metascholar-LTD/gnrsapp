import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Zap, Clock, Search, FileText, ArrowRight, CheckCircle } from "lucide-react";

const FastExecutions = () => {
  const styles = `
    .fast-executions-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .fast-executions-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .fast-executions-hero {
      background: #ffffff;
      color: #000000;
      padding: 4rem 2rem;
      margin: 120px 0 3rem 0;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      text-align: center;
    }

    .fast-executions-hero-icon {
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

    .fast-executions-hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .fast-executions-hero-subtitle {
      font-size: 1.25rem;
      margin: 0;
      opacity: 0.95;
      line-height: 1.6;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .fast-executions-content {
      padding: 3rem 0;
    }

    .fast-executions-intro {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #4a4a4a;
      margin-bottom: 4rem;
      text-align: center;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .fast-executions-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .fast-executions-feature {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .fast-executions-feature:hover {
      border-color: #000000;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }

    .fast-executions-feature-icon {
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

    .fast-executions-feature-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem 0;
    }

    .fast-executions-feature-description {
      font-size: 1rem;
      line-height: 1.7;
      color: #4a4a4a;
      margin: 0;
    }

    .fast-executions-benefits {
      background: #f9fafb;
      border-radius: 12px;
      padding: 3rem 2rem;
      margin-bottom: 4rem;
    }

    .fast-executions-benefits-title {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 2rem 0;
      text-align: center;
    }

    .fast-executions-benefits-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .fast-executions-benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .fast-executions-benefit-icon {
      color: #000000;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .fast-executions-benefit-text {
      font-size: 1rem;
      line-height: 1.6;
      color: #4a4a4a;
      margin: 0;
    }

    .fast-executions-cta {
      background: #f5f5f5;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      color: #000000;
      border: 1px solid #e5e7eb;
    }

    .fast-executions-cta-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
    }

    .fast-executions-cta-text {
      font-size: 1.125rem;
      margin: 0 0 2rem 0;
      opacity: 0.95;
      line-height: 1.6;
    }

    .fast-executions-cta-button {
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

    .fast-executions-cta-button:hover {
      background: #333333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 767px) {
      .fast-executions-hero {
        padding: 3rem 1.5rem;
        margin: 100px 0 2rem 0;
      }

      .fast-executions-hero-title {
        font-size: 2rem;
      }

      .fast-executions-hero-subtitle {
        font-size: 1.125rem;
      }

      .fast-executions-features {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .fast-executions-benefits-list {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="fast-executions-page">
      <style>{styles}</style>
      <Navigation />
      <div className="fast-executions-wrapper">
        <div className="fast-executions-hero">
          <div className="fast-executions-hero-icon">
            <Zap size={40} />
          </div>
          <h1 className="fast-executions-hero-title">Fast Executions</h1>
          <p className="fast-executions-hero-subtitle">
            Our platform delivers quick and efficient access to resources. Whether you're searching for educational opportunities, job listings, or national information, we ensure rapid response times and streamlined processes that save you valuable time.
          </p>
        </div>

        <div className="fast-executions-content">
          <p className="fast-executions-intro">
            At Ghana National Resource System (GNRS), we understand that your time is valuable. That's why we've built our platform with speed and efficiency at its core. Every feature, every search, and every interaction is optimized to deliver results quickly, allowing you to focus on what matters most.
          </p>

          <div className="fast-executions-features">
            <div className="fast-executions-feature">
              <div className="fast-executions-feature-icon">
                <Search size={28} />
              </div>
              <h2 className="fast-executions-feature-title">Lightning-Fast Search</h2>
              <p className="fast-executions-feature-description">
                Our advanced search technology delivers results in milliseconds. Whether you're looking for scholarships, job opportunities, or educational institutions, find exactly what you need instantly with our powerful search engine.
              </p>
            </div>

            <div className="fast-executions-feature">
              <div className="fast-executions-feature-icon">
                <Clock size={28} />
              </div>
              <h2 className="fast-executions-feature-title">Instant Access</h2>
              <p className="fast-executions-feature-description">
                No waiting, no delays. Access all resources immediately after registration. Our streamlined onboarding process gets you started in minutes, not hours. Start exploring opportunities right away.
              </p>
            </div>

            <div className="fast-executions-feature">
              <div className="fast-executions-feature-icon">
                <FileText size={28} />
              </div>
              <h2 className="fast-executions-feature-title">Quick Applications</h2>
              <p className="fast-executions-feature-description">
                Apply for jobs, scholarships, and opportunities with just a few clicks. Our simplified application process eliminates unnecessary steps, making it easier than ever to pursue your goals.
              </p>
            </div>
          </div>

          <div className="fast-executions-benefits">
            <h2 className="fast-executions-benefits-title">Why Speed Matters</h2>
            <ul className="fast-executions-benefits-list">
              <li className="fast-executions-benefit-item">
                <CheckCircle size={24} className="fast-executions-benefit-icon" />
                <p className="fast-executions-benefit-text">
                  <strong>Time Savings:</strong> Spend less time searching and more time taking action. Our efficient platform helps you find opportunities faster than traditional methods.
                </p>
              </li>
              <li className="fast-executions-benefit-item">
                <CheckCircle size={24} className="fast-executions-benefit-icon" />
                <p className="fast-executions-benefit-text">
                  <strong>Competitive Advantage:</strong> Be among the first to discover and apply for new opportunities. Speed gives you an edge in competitive markets.
                </p>
              </li>
              <li className="fast-executions-benefit-item">
                <CheckCircle size={24} className="fast-executions-benefit-icon" />
                <p className="fast-executions-benefit-text">
                  <strong>Reduced Friction:</strong> Our streamlined processes eliminate unnecessary steps, making it easier to complete tasks and achieve your objectives.
                </p>
              </li>
              <li className="fast-executions-benefit-item">
                <CheckCircle size={24} className="fast-executions-benefit-icon" />
                <p className="fast-executions-benefit-text">
                  <strong>Better User Experience:</strong> Fast, responsive interfaces create a more enjoyable and productive experience, keeping you engaged and motivated.
                </p>
              </li>
              <li className="fast-executions-benefit-item">
                <CheckCircle size={24} className="fast-executions-benefit-icon" />
                <p className="fast-executions-benefit-text">
                  <strong>Real-Time Updates:</strong> Get instant notifications about new opportunities, application status, and important updates without delay.
                </p>
              </li>
              <li className="fast-executions-benefit-item">
                <CheckCircle size={24} className="fast-executions-benefit-icon" />
                <p className="fast-executions-benefit-text">
                  <strong>Mobile Optimization:</strong> Access our platform quickly from any device, anywhere. Our mobile-optimized design ensures fast loading times on smartphones and tablets.
                </p>
              </li>
            </ul>
          </div>

          <div className="fast-executions-cta">
            <h2 className="fast-executions-cta-title">Experience Fast Executions Today</h2>
            <p className="fast-executions-cta-text">
              Join thousands of Ghanaians who are already benefiting from our fast and efficient platform. Start exploring opportunities now and see the difference speed makes.
            </p>
            <Link to="/" className="fast-executions-cta-button">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FastExecutions;

