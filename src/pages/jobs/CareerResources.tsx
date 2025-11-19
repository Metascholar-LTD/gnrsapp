import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  Target,
  Briefcase,
  Eye,
  Search,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Resource {
  id: string;
  title: string;
  type: "article" | "video" | "download" | "guide";
  category: string;
  description: string;
  image?: string;
  duration?: string;
  downloads?: number;
  views?: number;
  featured?: boolean;
}

const CareerResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const resourcesRef = useRef(null);
  const isResourcesInView = useInView(resourcesRef, { once: true });

  const categories = ["All", "Resume Tips", "Interview Prep", "Career Growth", "Salary Negotiation", "Networking", "Skills Development"];

  const resources: Resource[] = [
    {
      id: "1",
      title: "How to Write a Winning Resume",
      type: "article",
      category: "Resume Tips",
      description: "Learn the secrets to crafting a resume that gets you noticed by employers.",
      featured: true,
      views: 1234
    },
    {
      id: "2",
      title: "Ace Your Job Interview: Complete Guide",
      type: "video",
      category: "Interview Prep",
      description: "Watch our comprehensive video guide on how to prepare for and excel in job interviews.",
      duration: "15 min",
      featured: true,
      views: 2345
    },
    {
      id: "3",
      title: "Resume Template Pack",
      type: "download",
      category: "Resume Tips",
      description: "Download professional resume templates designed for the Ghanaian job market.",
      downloads: 567,
      featured: true
    },
    {
      id: "4",
      title: "Career Growth Strategies",
      type: "article",
      category: "Career Growth",
      description: "Discover proven strategies to advance your career and achieve your professional goals.",
      views: 890
    },
    {
      id: "5",
      title: "Salary Negotiation Masterclass",
      type: "video",
      category: "Salary Negotiation",
      description: "Learn how to negotiate your salary confidently and get what you deserve.",
      duration: "20 min",
      views: 1456
    },
    {
      id: "6",
      title: "Networking Guide for Professionals",
      type: "guide",
      category: "Networking",
      description: "A comprehensive guide to building meaningful professional connections.",
      views: 678
    },
    {
      id: "7",
      title: "Skills Development Roadmap",
      type: "article",
      category: "Skills Development",
      description: "Plan your skills development journey with our detailed roadmap.",
      views: 912
    },
    {
      id: "8",
      title: "Cover Letter Templates",
      type: "download",
      category: "Resume Tips",
      description: "Professional cover letter templates to help you stand out.",
      downloads: 423
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText width={24} height={24} />;
      case "video":
        return <Video width={24} height={24} />;
      case "download":
        return <Download width={24} height={24} />;
      case "guide":
        return <BookOpen width={24} height={24} />;
      default:
        return <FileText width={24} height={24} />;
    }
  };

  const tips = [
    {
      icon: Target,
      title: "Set Clear Goals",
      description: "Define your career objectives and create a roadmap to achieve them."
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Stay updated with industry trends and invest in your skills."
    },
    {
      icon: Users,
      title: "Build Your Network",
      description: "Connect with professionals in your field and attend industry events."
    },
    {
      icon: Award,
      title: "Showcase Achievements",
      description: "Highlight your accomplishments and quantify your impact."
    }
  ];

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
                <BookOpen className="me-2" width={16} height={16} />
                Career Development
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
              Career Resources
            </h1>
            <p 
              className="lead mb-0"
              style={{ 
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(255, 255, 255, 0.95)",
                lineHeight: "1.6"
              }}
            >
              Expert tips, guides, and resources to advance your career and achieve your professional goals.
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

export default CareerResources;

