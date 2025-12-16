import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Calculator, Users, FileText, Sparkles, Brain, Library, Target, MessageSquare, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { QuantumTimeline } from "@/components/ui/premium-process-timeline";
import { supabase } from "@/integrations/supabase/client";

interface EducationHubImage {
  step_id: string;
  image_url: string | null;
}

export const EducationHubSummary = () => {
  const [images, setImages] = useState<EducationHubImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Default images fallback
  const defaultImages: Record<string, string> = {
    '01': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=600&fit=crop&q=80&auto=format',
    '02': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756304758/finance_fgi2jq.jpg',
    '03': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=600&fit=crop&q=80&auto=format',
    '04': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=600&fit=crop&q=80&auto=format',
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('education_hub_images' as any)
        .select('step_id, image_url')
        .order('step_id', { ascending: true });

      if (error) {
        console.error('Error fetching education hub images:', error);
        // Use default images if fetch fails
        setImages(Object.entries(defaultImages).map(([step_id, image_url]) => ({
          step_id,
          image_url,
        })));
      } else if (data && data.length > 0) {
        // Map fetched images, using defaults for missing steps
        const fetchedImages = (data as any[]).map((img: any) => ({
          step_id: img.step_id,
          image_url: img.image_url || defaultImages[img.step_id] || '',
        }));
        setImages(fetchedImages);
      } else {
        // Use default images if no data
        setImages(Object.entries(defaultImages).map(([step_id, image_url]) => ({
          step_id,
          image_url,
        })));
      }
    } catch (error) {
      console.error('Error fetching education hub images:', error);
      setImages(Object.entries(defaultImages).map(([step_id, image_url]) => ({
        step_id,
        image_url,
      })));
    } finally {
      setLoading(false);
    }
  };

  const getImageForStep = (stepId: string) => {
    const image = images.find(img => img.step_id === stepId);
    return image?.image_url || defaultImages[stepId] || '';
  };

  const timelineSteps = [
    {
      id: "01",
      title: "Academic Resources",
      subtitle: "Your Foundation for Success",
      description: "Access comprehensive academic materials including past questions, lecture notes, study guides, and ebooks. Everything you need to excel in your studies is at your fingertips.",
      details: [
        "Past Questions Library",
        "Lecture Notes Archive",
        "Study Guides Collection",
        "Ebooks & Textbooks"
      ],
      duration: "Available 24/7",
      image: getImageForStep("01"),
    },
    {
      id: "02",
      title: "Learning Tools",
      subtitle: "Smart Solutions for Students",
      description: "Leverage cutting-edge AI-powered tools including an AI Tutor, CGPA Calculator, Timetable Builder, and personalized Learning Path recommendations to optimize your academic journey.",
      details: [
        "AI-Powered Tutor",
        "CGPA Calculator",
        "Timetable Builder",
        "Personalized Learning Paths"
      ],
      duration: "Instant Access",
      image: getImageForStep("02"),
    },
    {
      id: "03",
      title: "Community & Support",
      subtitle: "Connect, Learn, Grow Together",
      description: "Join vibrant discussion forums, form study groups, connect with mentors, and network with alumni. Build lasting relationships while advancing your education.",
      details: [
        "Discussion Forums",
        "Study Groups",
        "Mentorship Programs",
        "Alumni Network"
      ],
      duration: "Always Active",
      image: getImageForStep("03"),
    },
    {
      id: "04",
      title: "Career Development",
      subtitle: "Shape Your Professional Future",
      description: "Get personalized course recommendations, internship guidance, access departmental resources, and research tools. Prepare for your career with expert support and comprehensive resources.",
      details: [
        "Course Recommendations",
        "Internship Guidance",
        "Departmental Resources",
        "Research Tools"
      ],
      duration: "Career-Ready",
      image: getImageForStep("04"),
    },
  ];

  const quickLinks = [
    { to: "/education/past-questions", icon: FileText, label: "Past Questions" },
    { to: "/education/lecture-notes", icon: BookOpen, label: "Lecture Notes" },
    { to: "/education/ai-tutor", icon: Brain, label: "AI Tutor" },
    { to: "/education/cgpa-calculator", icon: Calculator, label: "CGPA Calculator" },
    { to: "/education/discussion-forums", icon: MessageSquare, label: "Forums" },
    { to: "/education/campus-announcements", icon: Calendar, label: "Announcements" },
  ];

  return (
    <section 
      className="py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
        backgroundColor: 'hsl(40 33% 96%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        #ehs-section-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        #ehs-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(15px, 5vw, 80px);
        }

        #ehs-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        #ehs-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 20px;
          background-color: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 30px;
          color: #2563eb;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        #ehs-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2C2C2C;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin-bottom: 1rem;
          font-family: 'Playfair Display', serif;
        }

        @media (min-width: 768px) {
          #ehs-title {
            font-size: 3rem;
          }
        }

        #ehs-description {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(44, 44, 44, 0.85);
          max-width: 700px;
          margin: 0 auto 2rem;
        }

        #ehs-categories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 768px) {
          #ehs-categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          #ehs-categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        .ehs-category-card {
          background-color: #ffffff;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .ehs-category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          border-color: #2563eb;
        }

        .ehs-category-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ehs-category-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ehs-category-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2C2C2C;
          margin: 0;
        }

        .ehs-category-description {
          font-size: 0.9375rem;
          color: rgba(44, 44, 44, 0.7);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .ehs-category-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ehs-category-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #374151;
          font-size: 0.9375rem;
          transition: all 0.2s ease;
        }

        .ehs-category-link:hover {
          background-color: #eff6ff;
          color: #2563eb;
          transform: translateX(4px);
        }

        .ehs-category-link-icon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #2563eb;
          flex-shrink: 0;
        }

        #ehs-quick-links {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 1rem;
          padding: 2rem 1.5rem;
          margin-top: 3rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        #ehs-quick-links-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2C2C2C;
          margin-bottom: 1.25rem;
          text-align: center;
          font-family: 'Playfair Display', serif;
        }

        #ehs-quick-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          #ehs-quick-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }

        @media (min-width: 1024px) {
          #ehs-quick-links-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 0.875rem;
          }
        }

        .ehs-quick-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.75rem;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          text-decoration: none;
          color: #374151;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .ehs-quick-link:hover {
          background-color: #ffffff;
          border-color: #2563eb;
          color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .ehs-quick-link-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .ehs-quick-link:hover .ehs-quick-link-icon {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .ehs-quick-link-label {
          font-size: 0.8125rem;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

      `}</style>

      <div id="ehs-section-wrapper">
        <div id="ehs-container">
          {/* Header */}
          <motion.div
            id="ehs-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span id="ehs-badge">
              <Sparkles size={16} className="me-2" />
              Education Hub
            </span>
            <div style={{ 
              width: '100%', 
              height: '1px', 
              backgroundColor: 'rgba(44, 44, 44, 0.1)', 
              margin: '16px auto 24px auto',
              maxWidth: '200px'
            }}></div>
            <h1 id="ehs-title">
              Your Complete Academic Resource Center
            </h1>
            <p id="ehs-description">
              Access comprehensive educational resources, learning tools, and community support to excel in your academic journey. Everything you need for success in one place.
            </p>
          </motion.div>

          {/* Timeline Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '3rem' }}
          >
            <QuantumTimeline steps={timelineSteps} />
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            id="ehs-quick-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 id="ehs-quick-links-title">Quick Access</h2>
            <div id="ehs-quick-links-grid">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="ehs-quick-link"
                  >
                    <div className="ehs-quick-link-icon">
                      <IconComponent size={24} />
                    </div>
                    <span className="ehs-quick-link-label">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

