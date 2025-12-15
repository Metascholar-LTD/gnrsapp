import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Briefcase, Search, FileText, Send, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, TrendingUp, Users, Target } from "lucide-react";

const JobPortal = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I search for jobs?",
      answer: "Use the search bar at the top of the Jobs page to search by keywords, location, or job type. You can also use filters to narrow down results by industry, salary range, experience level, and employment type (full-time, part-time, contract). Save your search criteria to receive notifications when new matching jobs are posted."
    },
    {
      id: 2,
      question: "How do I create a professional resume?",
      answer: "Visit our Resume Builder tool which offers professional templates and step-by-step guidance. You can choose from various templates, add your work experience, education, skills, and achievements. The builder automatically formats your resume and allows you to download it in PDF format. You can also create multiple versions tailored for different job applications."
    },
    {
      id: 3,
      question: "Can I apply for jobs directly through the platform?",
      answer: "Yes! Most job listings allow you to apply directly through our platform. Simply click 'Apply Now' on any job posting. You'll be able to upload your resume, write a cover letter, and submit your application. Some employers may redirect you to their own application system, but we'll guide you through the process."
    },
    {
      id: 4,
      question: "How do I get notified about new job postings?",
      answer: "Create a free account and set up job alerts based on your preferences. You can specify job titles, locations, industries, and salary ranges. We'll send you email notifications when new jobs matching your criteria are posted. You can also follow specific companies to be notified when they post new positions."
    },
    {
      id: 5,
      question: "Is there a fee to use the job portal?",
      answer: "No! Our job portal is completely free for job seekers. You can search for jobs, create resumes, apply for positions, and access all features at no cost. Employers may have different pricing plans for posting jobs, but as a job seeker, everything is free."
    },
    {
      id: 6,
      question: "How do I improve my chances of getting hired?",
      answer: "Complete your profile with detailed information, upload a professional resume, and keep your skills updated. Apply to jobs that match your qualifications, customize your cover letter for each application, and follow up appropriately. Our platform also offers career tips and resources to help you stand out to employers."
    }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Search",
      description: "Find jobs using powerful filters and search tools",
      link: "/jobs",
      color: "#0066cc"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume Builder",
      description: "Create professional resumes with our easy-to-use builder",
      link: "/jobs/cv-builder",
      color: "#0066cc"
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: "Quick Apply",
      description: "Apply to multiple jobs with just a few clicks",
      link: "/jobs",
      color: "#0066cc"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Job Alerts",
      description: "Get notified when new jobs matching your criteria are posted",
      link: "/jobs",
      color: "#0066cc"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and complete your profile with your skills, experience, and career preferences",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
    },
    {
      number: "02",
      title: "Build Your Resume",
      description: "Use our resume builder to create a professional CV that stands out to employers",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
    },
    {
      number: "03",
      title: "Search & Apply",
      description: "Browse thousands of job listings and apply to positions that match your skills",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
    },
    {
      number: "04",
      title: "Track Applications",
      description: "Monitor your application status and manage your job search from your dashboard",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Jobs" },
    { number: "50,000+", label: "Job Seekers" },
    { number: "5,000+", label: "Companies" },
    { number: "95%", label: "Success Rate" }
  ];

  const styles = `
    .job-portal-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .job-hero {
      background: #000000;
      color: white;
      padding: 8rem 2rem 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .job-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop') center/cover;
      opacity: 0.15;
      animation: float 20s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }

    .job-hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      margin: 0 auto;
    }

    .job-hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin: 0 0 1.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
      animation: fadeInUp 0.8s ease-out;
    }

    .job-hero-subtitle {
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

    .job-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .job-section {
      padding: 5rem 0;
    }

    .job-section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      text-align: center;
      color: #000000;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
    }

    .job-section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      color: #000000;
      margin: 0 0 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .job-stat-card {
      text-align: center;
      padding: 2rem;
      background: #000000;
      color: white;
      border-radius: 1rem;
      transition: transform 0.3s ease;
    }

    .job-stat-card:hover {
      transform: translateY(-5px);
    }

    .job-stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-stat-label {
      font-size: 1rem;
      opacity: 0.9;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .job-feature-card {
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

    .job-feature-card::before {
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

    .job-feature-card:hover::before {
      transform: scaleY(1);
    }

    .job-feature-card:hover {
      border-color: var(--card-color);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .job-feature-icon {
      margin: 0 0 1rem;
      color: #000000;
      transition: transform 0.3s ease;
    }

    .job-feature-card:hover .job-feature-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .job-feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-feature-desc {
      font-size: 0.9375rem;
      color: #000000;
      margin: 0;
      line-height: 1.6;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-steps {
      display: grid;
      gap: 3rem;
      margin-bottom: 4rem;
    }

    .job-step {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .job-step:nth-child(even) {
      direction: rtl;
    }

    .job-step:nth-child(even) > * {
      direction: ltr;
    }

    .job-step:nth-child(1) { animation-delay: 0.1s; }
    .job-step:nth-child(2) { animation-delay: 0.2s; }
    .job-step:nth-child(3) { animation-delay: 0.3s; }
    .job-step:nth-child(4) { animation-delay: 0.4s; }

    .job-step-content {
      padding: 2rem;
    }

    .job-step-number {
      font-size: 4rem;
      font-weight: 700;
      color: #0066cc;
      opacity: 0.3;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-step-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-step-desc {
      font-size: 1.0625rem;
      color: #000000;
      line-height: 1.7;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-step-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .job-step:hover .job-step-image {
      transform: scale(1.05);
    }

    .job-faq-section {
      background: #f8f9fa;
      border-radius: 1rem;
      padding: 3rem;
      margin-top: 4rem;
    }

    .job-faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .job-faq-item {
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }

    .job-faq-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .job-faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.0625rem;
      color: #000000;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      transition: color 0.3s ease;
    }

    .job-faq-question:hover {
      color: #000000;
    }

    .job-faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
      padding: 0 1.5rem;
      color: #000000;
      line-height: 1.7;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-faq-item.open .job-faq-answer {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem;
    }

    .job-faq-icon {
      color: #000000;
      transition: transform 0.3s ease;
    }

    .job-faq-item.open .job-faq-icon {
      transform: rotate(180deg);
    }

    .job-cta-section {
      background: #000000;
      color: white;
      padding: 4rem 2rem;
      border-radius: 1rem;
      text-align: center;
      margin-top: 4rem;
    }

    .job-cta-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 700;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-cta-text {
      font-size: 1.125rem;
      margin: 0 0 2rem;
      opacity: 0.95;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .job-cta-button {
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

    .job-cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .job-step {
        grid-template-columns: 1fr;
      }

      .job-step:nth-child(even) {
        direction: ltr;
      }

      .job-features-grid,
      .job-stats {
        grid-template-columns: 1fr;
      }

      .job-faq-section {
        padding: 2rem 1rem;
      }
    }
  `;

  return (
    <div className="job-portal-page">
      <style>{styles}</style>
      <Navigation />
      
      <section className="job-hero">
        <div className="job-hero-content">
          <h1 className="job-hero-title">Job Portal</h1>
          <p className="job-hero-subtitle">
            Find your dream job with our comprehensive job search platform
          </p>
        </div>
      </section>

      <div className="job-wrapper">
        <section className="job-section">
          <div className="job-stats">
            {stats.map((stat, index) => (
              <div key={index} className="job-stat-card">
                <div className="job-stat-number">{stat.number}</div>
                <div className="job-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="job-section">
          <h2 className="job-section-title">Key Features</h2>
          <p className="job-section-subtitle">
            Everything you need to find and land your next job
          </p>
          
          <div className="job-features-grid">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="job-feature-card"
                style={{ '--card-color': feature.color } as React.CSSProperties}
              >
                <div className="job-feature-icon">{feature.icon}</div>
                <h3 className="job-feature-title">{feature.title}</h3>
                <p className="job-feature-desc">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="job-section">
          <h2 className="job-section-title">How It Works</h2>
          <p className="job-section-subtitle">
            Follow these steps to start your job search journey
          </p>
          
          <div className="job-steps">
            {steps.map((step, index) => (
              <div key={index} className="job-step">
                <div className="job-step-content">
                  <div className="job-step-number">{step.number}</div>
                  <h3 className="job-step-title">{step.title}</h3>
                  <p className="job-step-desc">{step.description}</p>
                </div>
                <img src={step.image} alt={step.title} className="job-step-image" />
              </div>
            ))}
          </div>
        </section>

        <section className="job-faq-section">
          <h2 className="job-section-title">Frequently Asked Questions</h2>
          <p className="job-section-subtitle">
            Find answers to common questions about our job portal
          </p>
          
          <div className="job-faq-list">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`job-faq-item ${openFaq === faq.id ? 'open' : ''}`}
              >
                <div
                  className="job-faq-question"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span>{faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="job-faq-icon" size={20} />
                  ) : (
                    <ChevronDown className="job-faq-icon" size={20} />
                  )}
                </div>
                <div className="job-faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="job-cta-section">
          <h2 className="job-cta-title">Ready to Find Your Next Job?</h2>
          <p className="job-cta-text">
            Join thousands of job seekers who have found success through our platform
          </p>
          <Link to="/jobs" className="job-cta-button">
            Start Job Search
            <ArrowRight size={20} />
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default JobPortal;

