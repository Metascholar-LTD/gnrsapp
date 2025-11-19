import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const GHANA_REGIONS = [
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

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
const JOB_CATEGORIES = [
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

const PostJob = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    location: "",
    region: "",
    jobType: "",
    category: "",
    salary: "",
    salaryType: "Monthly",
    deadline: "",
    description: "",
    responsibilities: "",
    requirements: "",
    qualifications: "",
    benefits: "",
    genderPreference: "Any",
    companyLogo: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Job Posted Successfully!",
        description: "Your job listing has been submitted and is pending approval.",
      });
      // Reset form
      setFormData({
        jobTitle: "",
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        location: "",
        region: "",
        jobType: "",
        category: "",
        salary: "",
        salaryType: "Monthly",
        deadline: "",
        description: "",
        responsibilities: "",
        requirements: "",
        qualifications: "",
        benefits: "",
        genderPreference: "Any",
        companyLogo: null
      });
    }, 2000);
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
                <Briefcase className="me-2" width={16} height={16} />
                Employer Portal
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
              Post a Job
            </h1>
            <p 
              className="lead mb-0"
              style={{ 
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "rgba(255, 255, 255, 0.95)",
                lineHeight: "1.6"
              }}
            >
              Reach thousands of qualified candidates across Ghana. Post your job listing and find the perfect talent.
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

export default PostJob;

