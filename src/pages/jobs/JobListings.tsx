import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building2,
  Calendar,
  Star,
  TrendingUp,
  X,
  SlidersHorizontal,
  ArrowRight,
  Bookmark,
  Share2,
  Eye,
  Filter,
  CheckCircle2,
  Users,
  FileText,
  Target
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

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  region: string;
  municipality: string;
  town: string;
  jobType: "blue-collar" | "white-collar" | "remote";
  workType: string; // Full-time, Part-time, Contract
  salary: string;
  salaryType: string;
  postedDate: string;
  deadline: string;
  category: string;
  qualification: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  featured: boolean;
  urgent: boolean;
  views: number;
  applications: number;
}

// Ghana Regions with Municipalities and Towns
const GHANA_LOCATIONS: Record<string, { municipalities: Record<string, string[]> }> = {
  "Greater Accra": {
    municipalities: {
      "Accra Metropolitan": ["Accra Central", "Osu", "Cantonments", "Airport Residential"],
      "Tema Metropolitan": ["Tema", "Community 1", "Community 2", "Community 25"],
      "Ga West": ["Amasaman", "Ofankor", "Pokuase"],
      "Ga East": ["Madina", "Adenta", "Haasto"]
    }
  },
  "Ashanti": {
    municipalities: {
      "Kumasi Metropolitan": ["Kumasi Central", "Asokwa", "Suame", "Bantama"],
      "Obuasi Municipal": ["Obuasi", "Tutuka", "Anyinam"],
      "Ejisu Municipal": ["Ejisu", "Fumesua"]
    }
  },
  "Western": {
    municipalities: {
      "Sekondi-Takoradi Metropolitan": ["Sekondi", "Takoradi", "Kwesimintsim"],
      "Tarkwa-Nsuaem Municipal": ["Tarkwa", "Nsuaem"]
    }
  }
};

const GHANA_REGIONS = Object.keys(GHANA_LOCATIONS);
const JOB_TYPES = ["blue-collar", "white-collar", "remote"];
const WORK_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const JOB_CATEGORIES = [
  "All Categories",
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Administration",
  "Agriculture",
  "Construction",
  "Hospitality",
  "Legal",
  "Media & Communications"
];
const QUALIFICATIONS = [
  "All Qualifications",
  "No Formal Education",
  "Primary Education",
  "JHS/SHS",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Professional Certificate"
];

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedMunicipality, setSelectedMunicipality] = useState("All Municipalities");
  const [selectedTown, setSelectedTown] = useState("All Towns");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  const [selectedWorkType, setSelectedWorkType] = useState("All Work Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedQualification, setSelectedQualification] = useState("All Qualifications");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // Get municipalities for selected region
  const municipalities = selectedRegion !== "All Regions" && GHANA_LOCATIONS[selectedRegion]
    ? Object.keys(GHANA_LOCATIONS[selectedRegion].municipalities)
    : [];

  // Get towns for selected municipality
  const towns = selectedMunicipality !== "All Municipalities" && 
                selectedRegion !== "All Regions" &&
                GHANA_LOCATIONS[selectedRegion]?.municipalities[selectedMunicipality]
    ? GHANA_LOCATIONS[selectedRegion].municipalities[selectedMunicipality]
    : [];

  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Senior Software Engineer",
        company: "Tech Solutions Ghana",
        companyLogo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg",
        location: "Accra Central",
        region: "Greater Accra",
        municipality: "Accra Metropolitan",
        town: "Accra Central",
        jobType: "white-collar",
        workType: "Full-time",
        salary: "8,000 - 12,000",
        salaryType: "Monthly",
        postedDate: "2024-01-15",
        deadline: "2024-02-15",
        category: "Technology",
        qualification: "Bachelor's Degree",
        description: "We are looking for an experienced software engineer to join our dynamic team...",
        requirements: ["5+ years experience", "React, Node.js", "Bachelor's degree"],
        responsibilities: ["Develop web applications", "Code reviews", "Mentor junior developers"],
        featured: true,
        urgent: false,
        views: 1245,
        applications: 45
      },
      {
        id: "2",
        title: "Construction Site Supervisor",
        company: "BuildRight Construction",
        location: "Tema",
        region: "Greater Accra",
        municipality: "Tema Metropolitan",
        town: "Tema",
        jobType: "blue-collar",
        workType: "Full-time",
        salary: "3,500 - 5,000",
        salaryType: "Monthly",
        postedDate: "2024-01-14",
        deadline: "2024-02-10",
        category: "Construction",
        qualification: "Diploma",
        description: "Supervise construction sites and manage workers...",
        requirements: ["3+ years experience", "Construction knowledge", "Leadership skills"],
        responsibilities: ["Site supervision", "Worker management", "Quality control"],
        featured: false,
        urgent: true,
        views: 892,
        applications: 32
      },
      {
        id: "3",
        title: "Remote Data Analyst",
        company: "Global Analytics Inc",
        location: "Remote",
        region: "All Regions",
        municipality: "Remote",
        town: "Remote",
        jobType: "remote",
        workType: "Full-time",
        salary: "6,000 - 9,000",
        salaryType: "Monthly",
        postedDate: "2024-01-13",
        deadline: "2024-02-20",
        category: "Technology",
        qualification: "Bachelor's Degree",
        description: "Work from anywhere as a data analyst...",
        requirements: ["2+ years experience", "SQL, Python", "Analytical skills"],
        responsibilities: ["Data analysis", "Report creation", "Insights generation"],
        featured: true,
        urgent: false,
        views: 1456,
        applications: 67
      }
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  // Filter jobs
  useEffect(() => {
    let filtered = [...jobs];

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter((job) => job.region === selectedRegion);
    }

    if (selectedMunicipality !== "All Municipalities") {
      filtered = filtered.filter((job) => job.municipality === selectedMunicipality);
    }

    if (selectedTown !== "All Towns") {
      filtered = filtered.filter((job) => job.town === selectedTown);
    }

    if (selectedJobType !== "All Types") {
      filtered = filtered.filter((job) => job.jobType === selectedJobType);
    }

    if (selectedWorkType !== "All Work Types") {
      filtered = filtered.filter((job) => job.workType === selectedWorkType);
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    if (selectedQualification !== "All Qualifications") {
      filtered = filtered.filter((job) => job.qualification === selectedQualification);
    }

    if (salaryMin) {
      const min = parseInt(salaryMin.replace(/,/g, ""));
      filtered = filtered.filter((job) => {
        const jobMin = parseInt(job.salary.split("-")[0]?.replace(/,/g, "") || "0");
        return jobMin >= min;
      });
    }

    if (salaryMax) {
      const max = parseInt(salaryMax.replace(/,/g, ""));
      filtered = filtered.filter((job) => {
        const jobMax = parseInt(job.salary.split("-")[1]?.replace(/,/g, "") || "999999");
        return jobMax <= max;
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedRegion, selectedMunicipality, selectedTown, selectedJobType, selectedWorkType, selectedCategory, selectedQualification, salaryMin, salaryMax]);

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
        duration: 0.5
      }
    }
  };

  const stats = [
    { label: "Active Jobs", value: "1,234", icon: Briefcase, color: "#006B3F" },
    { label: "Companies", value: "456", icon: Building2, color: "#2C5F7C" },
    { label: "Job Seekers", value: "8,901", icon: Users, color: "#4A7C59" },
    { label: "Success Rate", value: "87%", icon: TrendingUp, color: "#6B8E6B" }
  ];

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[70vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginTop: "100px",
          paddingTop: "80px"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(44, 44, 44, 0.75)" }} />
        
        {/* Content */}
        <div className="container-xxl relative z-10 py-20" style={{ paddingTop: "40px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
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
                <Briefcase className="me-2" width={16} height={16} />
                National Job Portal
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
              Find Your Dream Job
            </h1>
            <p 
              className="lead mb-5"
              style={{ 
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(255, 255, 255, 0.95)",
                lineHeight: "1.6"
              }}
            >
              Discover thousands of opportunities across Ghana. Search by region, municipality, and town to find the perfect job near you.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/jobs/post-job" className="text-decoration-none">
                <button
                  className="hero-cta-btn"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#006B3F",
                    border: "none",
                    padding: "10px 24px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    height: "auto",
                    minHeight: "auto",
                    boxShadow: "0 2px 8px rgba(0, 107, 63, 0.3)",
                    transition: "all 0.3s ease",
                    color: "white",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#005a33";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 107, 63, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#006B3F";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 107, 63, 0.3)";
                  }}
                >
                  <Briefcase width={16} height={16} />
                  Post a Job
                </button>
              </Link>
              <Link to="/jobs/find-talent" className="text-decoration-none">
                <button
                  className="hero-cta-btn-outline"
                  style={{
                    borderRadius: "8px",
                    border: "1.5px solid rgba(255, 255, 255, 0.9)",
                    color: "white",
                    padding: "10px 24px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    height: "auto",
                    minHeight: "auto",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.borderColor = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.9)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Users width={16} height={16} />
                  Find Talent
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>
      
      <style>{`
        .hero-cta-btn,
        .hero-cta-btn-outline {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          height: auto !important;
          min-height: auto !important;
          line-height: 1.5 !important;
        }
        
        .hero-cta-btn *,
        .hero-cta-btn-outline * {
          pointer-events: none !important;
        }
        
        .hero-cta-btn svg,
        .hero-cta-btn-outline svg {
          width: 16px !important;
          height: 16px !important;
          flex-shrink: 0 !important;
          margin-right: 0.5rem !important;
        }
        
        /* Override any default button padding/height from Button component */
        section .hero-cta-btn,
        section .hero-cta-btn-outline {
          padding: 10px 24px !important;
          font-size: 0.9rem !important;
          font-weight: 500 !important;
        }
      `}</style>
      
      <Footer />
      <InitScripts />
    </>
  );
};

export default JobListings;
