import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Briefcase,
  ArrowLeft,
  Bookmark,
  Share2,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Users,
  Eye,
  FileText,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  region: string;
  type: string;
  salary: string;
  salaryType: string;
  postedDate: string;
  deadline: string;
  category: string;
  description: string;
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  featured: boolean;
  urgent: boolean;
  views: number;
  applications: number;
  genderPreference?: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite?: string;
  companyAddress: string;
  companyDescription?: string;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    cv: null as File | null
  });

  useEffect(() => {
    // Mock job data - in real app, fetch from API
    const mockJob: Job = {
      id: id || "1",
      title: "Senior Software Engineer",
      company: "Tech Solutions Ghana",
      companyLogo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg",
      location: "Accra",
      region: "Greater Accra",
      type: "Full-time",
      salary: "8,000 - 12,000",
      salaryType: "Monthly",
      postedDate: "2024-01-15",
      deadline: "2024-02-15",
      category: "Technology",
      description: "We are looking for an experienced software engineer...",
      fullDescription: `We are seeking a highly skilled Senior Software Engineer to join our dynamic development team. The ideal candidate will have extensive experience in modern web technologies and a passion for creating innovative solutions.

In this role, you will be responsible for designing, developing, and maintaining high-quality software applications. You will work closely with cross-functional teams to deliver exceptional products that meet our clients' needs.

Our company values innovation, collaboration, and continuous learning. We offer a supportive work environment with opportunities for professional growth and development.`,
      requirements: [
        "5+ years of professional software development experience",
        "Strong proficiency in React, Node.js, and TypeScript",
        "Experience with cloud platforms (AWS, Azure, or GCP)",
        "Bachelor's degree in Computer Science or related field",
        "Excellent problem-solving and communication skills",
        "Experience with Agile/Scrum methodologies"
      ],
      responsibilities: [
        "Design and develop scalable web applications",
        "Write clean, maintainable, and well-documented code",
        "Participate in code reviews and provide constructive feedback",
        "Mentor junior developers and share knowledge",
        "Collaborate with product managers and designers",
        "Troubleshoot and debug applications"
      ],
      qualifications: [
        "Bachelor's degree in Computer Science, Engineering, or related field",
        "Proven track record of delivering high-quality software",
        "Strong understanding of software architecture and design patterns",
        "Experience with version control systems (Git)",
        "Knowledge of database systems (SQL and NoSQL)"
      ],
      benefits: [
        "Competitive salary package",
        "Health insurance coverage",
        "Flexible working hours",
        "Remote work options",
        "Professional development opportunities",
        "Annual performance bonuses",
        "Team building activities",
        "Modern office facilities"
      ],
      featured: true,
      urgent: false,
      views: 1245,
      applications: 45,
      companyEmail: "careers@techsolutionsgh.com",
      companyPhone: "+233 24 123 4567",
      companyWebsite: "https://techsolutionsgh.com",
      companyAddress: "123 Independence Avenue, Accra, Ghana",
      companyDescription: "Tech Solutions Ghana is a leading technology company specializing in innovative software solutions for businesses across Africa."
    };

    setTimeout(() => {
      setJob(mockJob);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleApply = () => {
    // Handle application submission
    console.log("Application submitted:", applicationData);
    setShowApplyDialog(false);
    // Show success message
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container-xxl py-5" style={{ paddingTop: "120px" }}>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <Footer />
        <InitScripts />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navigation />
        <div className="container-xxl py-5" style={{ paddingTop: "120px" }}>
          <Card className="p-5 text-center border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <AlertCircle style={{ width: "64px", height: "64px", color: "#ccc", margin: "0 auto 20px" }} />
            <h4 className="mb-2" style={{ color: "#2C2C2C" }}>Job Not Found</h4>
            <p className="text-muted mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs/listings">
              <Button style={{ borderRadius: "12px", backgroundColor: "#006B3F", border: "none" }}>
                <ArrowLeft className="me-2" width={18} height={18} />
                Back to Jobs
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
        <InitScripts />
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center overflow-hidden"
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
        <div className="container-xxl relative z-10 py-12" style={{ paddingTop: "40px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              style={{ 
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                marginBottom: "20px"
              }}
            >
              <ArrowLeft className="me-2" width={18} height={18} />
              Back to Jobs
            </Button>
            <h1 className="display-4 mb-3 text-white fw-bold" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
              {job.title}
            </h1>
            <p className="lead text-white mb-0" style={{ fontSize: "1.2rem", opacity: 0.95 }}>
              {job.company} • {job.location}, {job.region}
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

export default JobDetails;

