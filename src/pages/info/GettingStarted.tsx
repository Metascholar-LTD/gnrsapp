import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Rocket, Users, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";

const GettingStarted = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click on the 'Join' button in the top navigation, fill in your details including your name, email address, and create a secure password. You'll receive a verification email to activate your account. Once verified, you can start exploring all our features."
    },
    {
      id: 2,
      question: "Is the platform free to use?",
      answer: "Yes! The Ghana National Resource System is completely free to use. All core features including accessing educational resources, job searches, directory listings, and news are available at no cost. We believe in making valuable resources accessible to everyone."
    },
    {
      id: 3,
      question: "What features are available?",
      answer: "Our platform offers comprehensive resources including: Educational tools (past questions, CGPA calculator), Job portal with resume builder, Business and institution directories, Latest news and updates, Scholarship information, and much more. Explore each section to discover all available features."
    },
    {
      id: 4,
      question: "How do I navigate the platform?",
      answer: "Use the main navigation menu at the top to access different sections. Each section has its own dedicated page with organized content. You can also use the search functionality to quickly find what you're looking for. The platform is designed to be intuitive and user-friendly."
    },
    {
      id: 5,
      question: "Can I save content for later?",
      answer: "Yes! Once you're logged in, you can bookmark articles, save job listings, and create personalized lists. Look for the bookmark or save icon on content items. Your saved items will be accessible from your profile dashboard."
    },
    {
      id: 6,
      question: "How do I update my profile?",
      answer: "After logging in, click on your profile icon in the top right corner. Select 'Profile Settings' to update your personal information, preferences, and notification settings. You can also upload a profile picture and manage your account security settings."
    }
  ];

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Quick Setup",
      description: "Get started in minutes with our simple registration process"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Join thousands of users accessing valuable resources daily"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Access",
      description: "Find what you need quickly with our intuitive search system"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Your data is protected with industry-standard security measures"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up with your email or social media account. It takes less than 2 minutes!",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
    },
    {
      number: "02",
      title: "Explore Features",
      description: "Browse through our sections: Education, Jobs, Directories, and News to discover resources.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"
    },
    {
      number: "03",
      title: "Customize Your Experience",
      description: "Set your preferences, save favorite content, and personalize your dashboard.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    },
    {
      number: "04",
      title: "Start Using Resources",
      description: "Access past questions, search for jobs, find institutions, and stay updated with news.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop"
    }
  ];

  const styles = `
    .getting-started-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .gs-hero {
      background: #000000;
      color: white;
      padding: 8rem 2rem 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .gs-hero video {
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

    .gs-hero::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 2;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }

    .gs-hero-content {
      position: relative;
      z-index: 3;
      max-width: 800px;
      margin: 0 auto;
    }

    .gs-hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin: 0 0 1.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
      animation: fadeInUp 0.8s ease-out;
    }

    .gs-hero-subtitle {
      font-size: clamp(1.125rem, 2vw, 1.5rem);
      margin: 0 0 2rem;
      opacity: 0.95;
      line-height: 1.6;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .gs-hero-cta {
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
      animation: fadeInUp 0.8s ease-out 0.4s both;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-hero-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
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

    .gs-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .gs-section {
      padding: 5rem 0;
    }

    .gs-section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      text-align: center;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
    }

    .gs-section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      color: #666;
      margin: 0 0 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .gs-feature-card {
      background: white;
      border: 2px solid #f0f0f0;
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .gs-feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.05);
      transition: left 0.5s ease;
    }

    .gs-feature-card:hover::before {
      left: 100%;
    }

    .gs-feature-card:hover {
      border-color: #667eea;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
    }

    .gs-feature-icon {
      color: #000000;
      margin: 0 auto 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .gs-feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-feature-desc {
      font-size: 0.9375rem;
      color: #000000;
      margin: 0;
      line-height: 1.6;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-steps {
      display: grid;
      gap: 3rem;
      margin-bottom: 4rem;
    }

    .gs-step {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .gs-step:nth-child(even) {
      direction: rtl;
    }

    .gs-step:nth-child(even) > * {
      direction: ltr;
    }

    .gs-step:nth-child(1) { animation-delay: 0.1s; }
    .gs-step:nth-child(2) { animation-delay: 0.2s; }
    .gs-step:nth-child(3) { animation-delay: 0.3s; }
    .gs-step:nth-child(4) { animation-delay: 0.4s; }

    .gs-step-content {
      padding: 2rem;
    }

    .gs-step-number {
      font-size: 4rem;
      font-weight: 700;
      color: #0066cc;
      opacity: 0.3;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-step-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-step-desc {
      font-size: 1.0625rem;
      color: #000000;
      line-height: 1.7;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-step-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .gs-step:hover .gs-step-image {
      transform: scale(1.05);
    }

    .gs-faq-section {
      background: #f8f9fa;
      border-radius: 1rem;
      padding: 3rem;
      margin-top: 4rem;
    }

    .gs-faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .gs-faq-item {
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }

    .gs-faq-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .gs-faq-question {
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

    .gs-faq-question:hover {
      color: #000000;
    }

    .gs-faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
      padding: 0 1.5rem;
      color: #666;
      line-height: 1.7;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-faq-item.open .gs-faq-answer {
      max-height: 500px;
      padding: 0 1.5rem 1.5rem;
    }

    .gs-faq-icon {
      color: #000000;
      transition: transform 0.3s ease;
    }

    .gs-faq-item.open .gs-faq-icon {
      transform: rotate(180deg);
    }

    .gs-cta-section {
      background: #000000;
      color: white;
      padding: 4rem 2rem;
      border-radius: 1rem;
      text-align: center;
      margin-top: 4rem;
    }

    .gs-cta-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 700;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-cta-text {
      font-size: 1.125rem;
      margin: 0 0 2rem;
      opacity: 0.95;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .gs-cta-button {
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

    .gs-cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .gs-step {
        grid-template-columns: 1fr;
      }

      .gs-step:nth-child(even) {
        direction: ltr;
      }

      .gs-features-grid {
        grid-template-columns: 1fr;
      }

      .gs-faq-section {
        padding: 2rem 1rem;
      }
    }
  `;

  return (
    <div className="getting-started-page">
      <style>{styles}</style>
      <Navigation />
      
      <section className="gs-hero">
        <video autoPlay loop muted playsInline>
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="gs-hero-content">
          <h1 className="gs-hero-title">Getting Started</h1>
          <p className="gs-hero-subtitle">
            Your comprehensive guide to navigating and maximizing the Ghana National Resource System
          </p>
          <Link to="/join" className="gs-hero-cta">
            <Rocket size={20} />
            Get Started Now
          </Link>
        </div>
      </section>

      <div className="gs-wrapper">
        <section className="gs-section">
          <h2 className="gs-section-title">Why Choose Our Platform?</h2>
          <p className="gs-section-subtitle">
            Discover powerful features designed to help you succeed
          </p>
          
          <div className="gs-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="gs-feature-card">
                <div className="gs-feature-icon">{feature.icon}</div>
                <h3 className="gs-feature-title">{feature.title}</h3>
                <p className="gs-feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="gs-section">
          <h2 className="gs-section-title">How It Works</h2>
          <p className="gs-section-subtitle">
            Follow these simple steps to get the most out of our platform
          </p>
          
          <div className="gs-steps">
            {steps.map((step, index) => (
              <div key={index} className="gs-step">
                <div className="gs-step-content">
                  <div className="gs-step-number">{step.number}</div>
                  <h3 className="gs-step-title">{step.title}</h3>
                  <p className="gs-step-desc">{step.description}</p>
                </div>
                <img src={step.image} alt={step.title} className="gs-step-image" />
              </div>
            ))}
          </div>
        </section>

        <section className="gs-faq-section">
          <h2 className="gs-section-title">Frequently Asked Questions</h2>
          <p className="gs-section-subtitle">
            Find answers to common questions about getting started
          </p>
          
          <div className="gs-faq-list">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`gs-faq-item ${openFaq === faq.id ? 'open' : ''}`}
              >
                <div
                  className="gs-faq-question"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <span>{faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="gs-faq-icon" size={20} />
                  ) : (
                    <ChevronDown className="gs-faq-icon" size={20} />
                  )}
                </div>
                <div className="gs-faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="gs-cta-section">
          <h2 className="gs-cta-title">Ready to Get Started?</h2>
          <p className="gs-cta-text">
            Join thousands of users who are already benefiting from our platform
          </p>
          <Link to="/join" className="gs-cta-button">
            Create Your Account
            <ArrowRight size={20} />
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default GettingStarted;

