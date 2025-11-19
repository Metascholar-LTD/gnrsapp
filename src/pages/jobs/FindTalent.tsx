import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  X,
  Eye,
  MessageCircle,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Talent {
  id: string;
  name: string;
  type: "individual" | "company";
  location: string;
  region: string;
  phone: string;
  email: string;
  services: string[];
  description: string;
  availability: "Available" | "Busy";
  rating: number;
  reviews: number;
  image?: string;
  logo?: string;
  yearsExperience?: number;
  portfolio?: string;
}

const GHANA_REGIONS = [
  "All Regions",
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "North East",
  "Savannah"
];

const FindTalent = () => {
  const [activeTab, setActiveTab] = useState<"individuals" | "companies">("individuals");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([]);

  useEffect(() => {
    // Mock data
    const mockTalents: Talent[] = [
      {
        id: "1",
        name: "John Mensah",
        type: "individual",
        location: "Accra",
        region: "Greater Accra",
        phone: "+233 24 123 4567",
        email: "john.mensah@email.com",
        services: ["Web Development", "Mobile Apps", "UI/UX Design"],
        description: "Experienced full-stack developer with 8+ years in web and mobile development.",
        availability: "Available",
        rating: 4.8,
        reviews: 24,
        yearsExperience: 8
      },
      {
        id: "2",
        name: "Tech Solutions Ghana",
        type: "company",
        location: "Kumasi",
        region: "Ashanti",
        phone: "+233 24 765 4321",
        email: "info@techsolutionsgh.com",
        services: ["Software Development", "IT Consulting", "Digital Transformation"],
        description: "Leading technology company providing innovative software solutions.",
        availability: "Available",
        rating: 4.9,
        reviews: 156,
        logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg"
      },
      {
        id: "3",
        name: "Sarah Adjei",
        type: "individual",
        location: "Tema",
        region: "Greater Accra",
        phone: "+233 24 987 6543",
        email: "sarah.adjei@email.com",
        services: ["Graphic Design", "Branding", "Marketing"],
        description: "Creative graphic designer specializing in brand identity and marketing materials.",
        availability: "Available",
        rating: 4.7,
        reviews: 18,
        yearsExperience: 5
      },
      {
        id: "4",
        name: "Digital Marketing Pro",
        type: "company",
        location: "Accra",
        region: "Greater Accra",
        phone: "+233 24 111 2222",
        email: "contact@digitalmarketingpro.com",
        services: ["SEO", "Social Media Marketing", "Content Creation"],
        description: "Full-service digital marketing agency helping businesses grow online.",
        availability: "Busy",
        rating: 4.6,
        reviews: 89,
        logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg"
      }
    ];

    setTalents(mockTalents);
    setFilteredTalents(mockTalents);
  }, []);

  useEffect(() => {
    let filtered = talents.filter(t => t.type === (activeTab === "individuals" ? "individual" : "company"));

    if (searchQuery) {
      filtered = filtered.filter(
        t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(t => t.region === selectedRegion);
    }

    if (selectedAvailability !== "All") {
      filtered = filtered.filter(t => t.availability === selectedAvailability);
    }

    setFilteredTalents(filtered);
  }, [talents, activeTab, searchQuery, selectedRegion, selectedAvailability]);

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
                <Users className="me-2" width={16} height={16} />
                Talent Directory
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
              Find Talent
            </h1>
            <p 
              className="lead mb-0"
              style={{ 
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(255, 255, 255, 0.95)",
                lineHeight: "1.6"
              }}
            >
              Connect with skilled professionals and companies across Ghana. Find the right talent for your projects.
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

export default FindTalent;

