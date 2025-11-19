import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  GraduationCap,
  BookOpen,
  Video,
  Award,
  Clock,
  Users,
  Star,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Download,
  Calendar,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Course {
  id: string;
  title: string;
  provider: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  students: number;
  price: string;
  image?: string;
  description: string;
  featured?: boolean;
}

interface Training {
  id: string;
  title: string;
  provider: string;
  date: string;
  location: string;
  duration: string;
  price: string;
  seats: number;
  available: number;
  description: string;
  category: string;
}

const ProfessionalDevelopment = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "trainings" | "certifications">("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const coursesRef = useRef(null);
  const isCoursesInView = useInView(coursesRef, { once: true });

  const courses: Course[] = [
    {
      id: "1",
      title: "Digital Marketing Mastery",
      provider: "Ghana Tech Academy",
      category: "Marketing",
      duration: "8 weeks",
      level: "Intermediate",
      rating: 4.8,
      students: 1234,
      price: "Free",
      description: "Comprehensive digital marketing course covering SEO, social media, and content marketing.",
      featured: true
    },
    {
      id: "2",
      title: "Full-Stack Web Development",
      provider: "Code Academy Ghana",
      category: "Technology",
      duration: "12 weeks",
      level: "Beginner",
      rating: 4.9,
      students: 2345,
      price: "GH₵ 2,500",
      description: "Learn modern web development with React, Node.js, and MongoDB.",
      featured: true
    },
    {
      id: "3",
      title: "Project Management Professional",
      provider: "Business Skills Institute",
      category: "Management",
      duration: "6 weeks",
      level: "Advanced",
      rating: 4.7,
      students: 890,
      price: "GH₵ 3,000",
      description: "Master project management methodologies and tools.",
      featured: false
    },
    {
      id: "4",
      title: "Data Analytics Fundamentals",
      provider: "Data Science Ghana",
      category: "Technology",
      duration: "10 weeks",
      level: "Beginner",
      rating: 4.6,
      students: 1456,
      price: "GH₵ 2,000",
      description: "Introduction to data analysis using Python and Excel.",
      featured: false
    }
  ];

  const trainings: Training[] = [
    {
      id: "1",
      title: "Leadership Excellence Workshop",
      provider: "Ghana Leadership Institute",
      date: "2024-03-15",
      location: "Accra",
      duration: "2 days",
      price: "GH₵ 1,500",
      seats: 50,
      available: 12,
      description: "Intensive leadership training for managers and team leaders.",
      category: "Management"
    },
    {
      id: "2",
      title: "Effective Communication Skills",
      provider: "Professional Development Center",
      date: "2024-03-20",
      location: "Kumasi",
      duration: "1 day",
      price: "GH₵ 800",
      seats: 30,
      available: 5,
      description: "Improve your communication skills for better workplace relationships.",
      category: "Soft Skills"
    },
    {
      id: "3",
      title: "Financial Planning & Investment",
      provider: "Finance Academy",
      date: "2024-03-25",
      location: "Accra",
      duration: "3 days",
      price: "GH₵ 2,200",
      seats: 40,
      available: 18,
      description: "Learn personal finance management and investment strategies.",
      category: "Finance"
    }
  ];

  const certifications = [
    {
      id: "1",
      title: "Google Digital Marketing Certificate",
      provider: "Google",
      category: "Marketing",
      duration: "6 months",
      price: "Free",
      description: "Industry-recognized certification in digital marketing."
    },
    {
      id: "2",
      title: "AWS Certified Solutions Architect",
      provider: "Amazon Web Services",
      category: "Technology",
      duration: "3 months",
      price: "GH₵ 5,000",
      description: "Cloud computing certification for IT professionals."
    },
    {
      id: "3",
      title: "Certified Public Accountant (CPA)",
      provider: "ICAG",
      category: "Finance",
      duration: "12 months",
      price: "GH₵ 8,000",
      description: "Professional accounting certification."
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginTop: "100px",
          paddingTop: "80px"
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(44, 44, 44, 0.75)" }} />
        <div className="container-xxl relative z-10 py-16" style={{ paddingTop: "40px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <div className="inline-block mb-4">
              <Badge 
                style={{ 
                  backgroundColor: "rgba(0, 107, 63, 0.9)", 
                  color: "white",
                  padding: "8px 20px",
                  fontSize: "0.9rem",
                  borderRadius: "20px"
                }}
              >
                <GraduationCap className="me-2" width={16} height={16} />
                Skills Development
              </Badge>
            </div>
            <h1 
              className="display-3 mb-4 fw-bold"
              style={{ 
                color: "#FFFFFF",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: "1.2",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}
            >
              Professional Development
            </h1>
            <p 
              className="lead mb-0"
              style={{ 
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(255, 255, 255, 0.95)",
                lineHeight: "1.6"
              }}
            >
              Enhance your skills with courses, trainings, and certifications to advance your career.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </section>
      <Footer />
      <InitScripts />
    </>
  );
};

export default ProfessionalDevelopment;

