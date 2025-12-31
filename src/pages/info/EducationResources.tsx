import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookOpen, GraduationCap, Calculator, Users, FileText, Award, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const EducationResources = () => {

  const resources = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Past Questions",
      description: "Access thousands of past examination papers from WAEC, NECO, and other examination bodies",
      link: "/education/past-questions",
      color: "#0066cc"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "CGPA Calculator",
      description: "Calculate your GPA and understand different grading systems used in Ghanaian institutions",
      link: "/education/cgpa-calculator",
      color: "#0066cc"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Study Groups",
      description: "Connect with other students, share knowledge, and prepare for exams together",
      link: "/education/study-groups",
      color: "#0066cc"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Scholarships",
      description: "Find and apply for scholarships available to Ghanaian students",
      link: "/scholarships",
      color: "#0066cc"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Institution Directory",
      description: "Search and compare universities, colleges, and schools across Ghana",
      link: "/directories/universities",
      color: "#0066cc"
    }
  ];

  const benefits = [
    {
      title: "Comprehensive Resources",
      description: "Access to thousands of past questions, study materials, and educational tools",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop"
    },
    {
      title: "Free Access",
      description: "All core educational resources are completely free for students",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
    },
    {
      title: "Community Support",
      description: "Join study groups and connect with peers for collaborative learning",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop"
    }
  ];

  const styles = `
    .education-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .edu-hero {
      background: #000000;
      color: white;
      padding: 8rem 2rem 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .edu-hero video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      z-index: 1;
      object-fit: cover;
    }

    .edu-hero::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 2;
    }

    .edu-hero-content {
      position: relative;
      z-index: 3;
      max-width: 800px;
      margin: 0 auto;
    }

    .edu-hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin: 0 0 1.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
      animation: fadeInUp 0.8s ease-out;
    }

    .edu-hero-subtitle {
      font-size: clamp(1.125rem, 2vw, 1.5rem);
      margin: 0 0 2rem;
      opacity: 0.95;
      line-height: 1.6;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .edu-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .edu-section {
      padding: 5rem 0;
    }

    .edu-section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      text-align: center;
      color: #000000;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
    }

    .edu-section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      color: #000000;
      margin: 0 0 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .edu-resource-card {
      background: white;
      border: 2px solid #f0f0f0;
      border-radius: 1rem;
      padding: 2rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .edu-resource-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--card-color);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .edu-resource-card:hover::before {
      transform: scaleY(1);
    }

    .edu-resource-card:hover {
      border-color: var(--card-color);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .edu-resource-icon {
      margin: 0 0 1rem;
      color: #000000;
      transition: transform 0.3s ease;
    }

    .edu-resource-card:hover .edu-resource-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .edu-resource-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-resource-desc {
      font-size: 0.9375rem;
      color: #000000;
      margin: 0 0 1rem;
      line-height: 1.6;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-resource-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #000000;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-benefits {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .edu-benefit-card {
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .edu-benefit-card:hover {
      transform: translateY(-5px);
    }

    .edu-benefit-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .edu-benefit-content {
      padding: 2rem;
      background: white;
    }

    .edu-benefit-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-benefit-desc {
      font-size: 1rem;
      color: #000000;
      line-height: 1.6;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }


    .edu-cta-section {
      background: #000000;
      color: white;
      padding: 4rem 2rem;
      border-radius: 1rem;
      text-align: center;
      margin-top: 4rem;
    }

    .edu-cta-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 700;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-cta-text {
      font-size: 1.125rem;
      margin: 0 0 2rem;
      opacity: 0.95;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: white;
      color: #000000;
      font-weight: 600;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .edu-cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .edu-resources-grid,
      .edu-benefits {
        grid-template-columns: 1fr;
      }

    }
  `;

  return (
    <div className="education-page">
      <style>{styles}</style>
      <Navigation />
      
      <section className="edu-hero">
        <video autoPlay loop muted playsInline>
          <source src="https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="edu-hero-content">
          <h1 className="edu-hero-title">Education Resources</h1>
          <p className="edu-hero-subtitle">
            Comprehensive educational tools and resources to support your academic journey
          </p>
        </div>
      </section>

      <div className="edu-wrapper">
        <section className="edu-section">
          <h2 className="edu-section-title">Available Resources</h2>
          <p className="edu-section-subtitle">
            Explore our wide range of educational tools and materials
          </p>
          
          <div className="edu-resources-grid">
            {resources.map((resource, index) => (
              <Link
                key={index}
                to={resource.link}
                className="edu-resource-card"
                style={{ '--card-color': resource.color } as React.CSSProperties}
              >
                <div className="edu-resource-icon">{resource.icon}</div>
                <h3 className="edu-resource-title">{resource.title}</h3>
                <p className="edu-resource-desc">{resource.description}</p>
                <span className="edu-resource-link">
                  Explore <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="edu-section">
          <h2 className="edu-section-title">Why Use Our Resources?</h2>
          <p className="edu-section-subtitle">
            Discover the benefits of using our educational platform
          </p>
          
          <div className="edu-benefits">
            {benefits.map((benefit, index) => (
              <div key={index} className="edu-benefit-card">
                <img src={benefit.image} alt={benefit.title} className="edu-benefit-image" />
                <div className="edu-benefit-content">
                  <h3 className="edu-benefit-title">{benefit.title}</h3>
                  <p className="edu-benefit-desc">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="edu-cta-section">
          <h2 className="edu-cta-title">Start Learning Today</h2>
          <p className="edu-cta-text">
            Access thousands of educational resources and tools to excel in your studies
          </p>
          <Link to="/education" className="edu-cta-button">
            Explore Resources
            <ArrowRight size={20} />
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default EducationResources;

