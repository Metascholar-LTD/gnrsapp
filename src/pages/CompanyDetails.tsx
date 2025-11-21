import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyInfoCard } from "@/components/ui/company-info-card";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  MapPin,
  ExternalLink,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  educationLevel: string;
  experienceLevel: string;
  contractType: string;
  region: string;
  city: string;
  skills: string[];
  date: string;
}

const CompanyDetails = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const companyName = name ? decodeURIComponent(name) : "";
  const [logoError, setLogoError] = useState(false);

  // Other companies data (excluding current company)
  const otherCompanies = [
    { 
      name: "Microsoft", 
      logoUrl: "https://logo.clearbit.com/microsoft.com",
      fallbackUrl: "https://cdn.simpleicons.org/microsoft/0078D4",
      jobs: 245,
      industry: "Technology"
    },
    { 
      name: "Adidas", 
      logoUrl: "https://logo.clearbit.com/adidas.com",
      fallbackUrl: "https://cdn.simpleicons.org/adidas/000000",
      jobs: 89,
      industry: "Retail & Fashion"
    },
    { 
      name: "Nike", 
      logoUrl: "https://logo.clearbit.com/nike.com",
      fallbackUrl: "https://cdn.simpleicons.org/nike/111111",
      jobs: 156,
      industry: "Retail & Fashion"
    },
    { 
      name: "Apple", 
      logoUrl: "https://logo.clearbit.com/apple.com",
      fallbackUrl: "https://cdn.simpleicons.org/apple/000000",
      jobs: 342,
      industry: "Technology"
    },
    { 
      name: "Google", 
      logoUrl: "https://logo.clearbit.com/google.com",
      fallbackUrl: "https://cdn.simpleicons.org/google/4285F4",
      jobs: 512,
      industry: "Technology"
    },
    { 
      name: "Amazon", 
      logoUrl: "https://logo.clearbit.com/amazon.com",
      fallbackUrl: "https://cdn.simpleicons.org/amazon/FF9900",
      jobs: 678,
      industry: "E-commerce & Cloud"
    },
    { 
      name: "Meta", 
      logoUrl: "https://logo.clearbit.com/meta.com",
      fallbackUrl: "https://cdn.simpleicons.org/meta/0081FB",
      jobs: 234,
      industry: "Technology"
    },
    { 
      name: "Tesla", 
      logoUrl: "https://logo.clearbit.com/tesla.com",
      fallbackUrl: "https://cdn.simpleicons.org/tesla/CC0000",
      jobs: 189,
      industry: "Automotive & Energy"
    },
    { 
      name: "Netflix", 
      logoUrl: "https://logo.clearbit.com/netflix.com",
      fallbackUrl: "https://cdn.simpleicons.org/netflix/E50914",
      jobs: 145,
      industry: "Entertainment"
    },
  ].filter(company => company.name.toLowerCase() !== companyName.toLowerCase());

  // Get company logo based on company name
  const getCompanyLogo = (company: string): string => {
    const companyLower = company.toLowerCase();
    if (companyLower.includes("microsoft")) {
      return "https://logo.clearbit.com/microsoft.com";
    } else if (companyLower.includes("western governors") || companyLower.includes("wgu")) {
      return "https://logo.clearbit.com/wgu.edu";
    } else if (companyLower.includes("adidas")) {
      return "https://logo.clearbit.com/adidas.com";
    } else if (companyLower.includes("nike")) {
      return "https://logo.clearbit.com/nike.com";
    } else if (companyLower.includes("apple")) {
      return "https://logo.clearbit.com/apple.com";
    } else if (companyLower.includes("google")) {
      return "https://logo.clearbit.com/google.com";
    } else if (companyLower.includes("amazon")) {
      return "https://logo.clearbit.com/amazon.com";
    } else if (companyLower.includes("meta")) {
      return "https://logo.clearbit.com/meta.com";
    } else if (companyLower.includes("tesla")) {
      return "https://logo.clearbit.com/tesla.com";
    } else if (companyLower.includes("netflix")) {
      return "https://logo.clearbit.com/netflix.com";
    } else if (companyLower.includes("finance")) {
      return "https://cdn.simpleicons.org/visa/1A1F71";
    } else if (companyLower.includes("tech")) {
      return "https://cdn.simpleicons.org/google/4285F4";
    } else if (companyLower.includes("consulting")) {
      return "https://cdn.simpleicons.org/accenture/A100FF";
    }
    // Default fallback
    return `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  // Mock company data - in real app, this would come from an API
  const companyData = {
    name: companyName,
    logo: getCompanyLogo(companyName),
    description: `${companyName} is a leading organization committed to excellence and innovation. We provide exceptional opportunities for talented professionals to grow their careers and make a meaningful impact.`,
    industry: "Technology",
    location: "Greater Accra, Ghana",
    website: "https://example.com",
    email: "careers@example.com",
    phone: "+233 XX XXX XXXX",
    employees: "500-1000",
    founded: "2010",
  };

  // Get jobs for this company - matching jobs from AllJobs data
  // In a real app, this would come from an API
  const getAllJobsForCompany = (company: string): Job[] => {
    // This is a simplified version - in real app, fetch from API
    // For now, return sample jobs based on company name
    const companyLower = company.toLowerCase();
    
    if (companyLower.includes("microsoft")) {
      return [
        {
          id: "ms-1",
          title: "Software Engineer",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/microsoft.com",
          description: "Microsoft is seeking a talented Software Engineer to join our development team. You'll work on cutting-edge cloud technologies and help build solutions that empower millions of users worldwide.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["C#", ".NET", "Azure", "Software Development", "Cloud Computing"],
          date: "20.11.2025",
        },
        {
          id: "ms-2",
          title: "Cloud Solutions Architect",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/microsoft.com",
          description: "Join Microsoft as a Cloud Solutions Architect and help businesses transform their operations using Azure cloud services. You'll design scalable solutions and work with enterprise clients.",
          educationLevel: "Master",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Azure", "Cloud Architecture", "Solution Design", "Enterprise Solutions"],
          date: "19.11.2025",
        },
        {
          id: "ms-3",
          title: "Product Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/microsoft.com",
          description: "Microsoft is looking for a Product Manager to drive product strategy and development for our enterprise software solutions in the African market.",
          educationLevel: "Master",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Product Management", "Strategy", "Agile", "Business Analysis"],
          date: "18.11.2025",
        },
      ];
    } else if (companyLower.includes("western governors") || companyLower.includes("wgu")) {
      return [
        {
          id: "wgu-1",
          title: "Marketing Manager- Accra",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/wgu.edu",
          description: "Western Governors University (WGU) is seeking an experienced and innovative Marketing Manager to lead the development and execution of marketing strategies that promote the university's mission and offerings.",
          educationLevel: "Master",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "East Legon",
          skills: ["Marketing", "Strategy", "Digital Marketing", "Brand Management", "Communication"],
          date: "19.11.2025",
        },
        {
          id: "wgu-2",
          title: "Student Success Coordinator",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/wgu.edu",
          description: "Join WGU as a Student Success Coordinator to support and guide students throughout their educational journey. You'll work closely with students to ensure they achieve their academic goals.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Student Services", "Counseling", "Education", "Communication"],
          date: "18.11.2025",
        },
        {
          id: "wgu-3",
          title: "IT Support Specialist",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/wgu.edu",
          description: "WGU is looking for an IT Support Specialist to provide technical assistance to students and staff, ensuring smooth operation of our online learning platform and systems.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["IT Support", "Technical Troubleshooting", "Customer Service"],
          date: "17.11.2025",
        },
      ];
    } else if (companyLower.includes("adidas")) {
      return [
        {
          id: "adidas-1",
          title: "Retail Store Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/adidas.com",
          description: "Adidas is seeking an experienced Retail Store Manager to lead our flagship store in Accra. You'll be responsible for driving sales, managing staff, and ensuring exceptional customer experience.",
          educationLevel: "Bachelor",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Retail Management", "Sales", "Team Leadership", "Customer Service"],
          date: "20.11.2025",
        },
        {
          id: "adidas-2",
          title: "Marketing Coordinator",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/adidas.com",
          description: "Join Adidas as a Marketing Coordinator to support marketing campaigns and brand initiatives across Ghana. You'll work on digital marketing, events, and brand partnerships.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Marketing", "Digital Marketing", "Brand Management", "Events"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("nike")) {
      return [
        {
          id: "nike-1",
          title: "Brand Marketing Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/nike.com",
          description: "Nike is seeking a Brand Marketing Manager to develop and execute marketing strategies that connect with athletes and sports enthusiasts across Ghana.",
          educationLevel: "Bachelor",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Brand Marketing", "Sports Marketing", "Digital Marketing", "Strategy"],
          date: "20.11.2025",
        },
        {
          id: "nike-2",
          title: "Retail Operations Specialist",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/nike.com",
          description: "Join Nike as a Retail Operations Specialist to ensure smooth operations across our retail locations and optimize the customer shopping experience.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Retail Operations", "Operations Management", "Process Improvement"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("apple")) {
      return [
        {
          id: "apple-1",
          title: "iOS Developer",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/apple.com",
          description: "Apple is looking for an iOS Developer to create innovative mobile applications. You'll work with cutting-edge technologies and help build apps that millions of users love.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["iOS Development", "Swift", "Objective-C", "Mobile Development"],
          date: "20.11.2025",
        },
        {
          id: "apple-2",
          title: "Customer Experience Specialist",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/apple.com",
          description: "Join Apple as a Customer Experience Specialist to provide exceptional support to customers and help them get the most out of their Apple products.",
          educationLevel: "High school",
          experienceLevel: "Less than 2 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Customer Service", "Technical Support", "Communication"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("google")) {
      return [
        {
          id: "google-1",
          title: "Software Engineer - Backend",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/google.com",
          description: "Google is looking for a Backend Software Engineer to build scalable systems and services that power Google's products used by billions of people.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Backend Development", "Python", "Java", "Distributed Systems"],
          date: "20.11.2025",
        },
        {
          id: "google-2",
          title: "Product Marketing Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/google.com",
          description: "Join Google as a Product Marketing Manager to drive product adoption and market growth for Google's suite of products in Africa.",
          educationLevel: "Master",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Product Marketing", "Go-to-Market Strategy", "Analytics"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("amazon")) {
      return [
        {
          id: "amazon-1",
          title: "Software Development Engineer",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/amazon.com",
          description: "Amazon is looking for a Software Development Engineer to build and maintain systems that power our e-commerce platform serving customers across Africa.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Software Development", "Java", "AWS", "System Design"],
          date: "20.11.2025",
        },
        {
          id: "amazon-2",
          title: "Operations Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/amazon.com",
          description: "Join Amazon as an Operations Manager to oversee fulfillment center operations and ensure efficient delivery of orders to customers.",
          educationLevel: "Bachelor",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Tema",
          skills: ["Operations Management", "Logistics", "Process Optimization"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("meta")) {
      return [
        {
          id: "meta-1",
          title: "Frontend Engineer",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/meta.com",
          description: "Meta is looking for a Frontend Engineer to build user interfaces for our social media platforms. You'll work with React and modern web technologies.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["React", "JavaScript", "TypeScript", "Frontend Development"],
          date: "20.11.2025",
        },
        {
          id: "meta-2",
          title: "Data Scientist",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/meta.com",
          description: "Join Meta as a Data Scientist to analyze user behavior, build machine learning models, and provide insights that drive product decisions.",
          educationLevel: "Master",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Data Science", "Machine Learning", "Python", "Statistics"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("tesla")) {
      return [
        {
          id: "tesla-1",
          title: "Electrical Engineer",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/tesla.com",
          description: "Tesla is seeking an Electrical Engineer to work on electric vehicle charging infrastructure and energy solutions in Ghana.",
          educationLevel: "Bachelor",
          experienceLevel: "2 to 5 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Electrical Engineering", "Power Systems", "Renewable Energy"],
          date: "20.11.2025",
        },
        {
          id: "tesla-2",
          title: "Sales Advisor",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/tesla.com",
          description: "Join Tesla as a Sales Advisor to help customers discover and purchase our electric vehicles and energy products.",
          educationLevel: "Bachelor",
          experienceLevel: "Less than 2 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Sales", "Customer Service", "Product Knowledge"],
          date: "19.11.2025",
        },
      ];
    } else if (companyLower.includes("netflix")) {
      return [
        {
          id: "netflix-1",
          title: "Content Acquisition Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/netflix.com",
          description: "Netflix is looking for a Content Acquisition Manager to identify and acquire local content for our streaming platform in Africa.",
          educationLevel: "Bachelor",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Content Acquisition", "Media", "Negotiation", "Entertainment Industry"],
          date: "20.11.2025",
        },
        {
          id: "netflix-2",
          title: "Marketing Manager",
          company: companyName,
          companyLogo: "https://logo.clearbit.com/netflix.com",
          description: "Join Netflix as a Marketing Manager to develop and execute marketing campaigns that grow our subscriber base in Ghana.",
          educationLevel: "Bachelor",
          experienceLevel: "5 to 10 years",
          contractType: "Permanent contract",
          region: "Greater Accra",
          city: "Accra",
          skills: ["Marketing", "Digital Marketing", "Campaign Management", "Brand Marketing"],
          date: "19.11.2025",
        },
      ];
    }
    
    // Default jobs for any other company
    return [
      {
        id: "default-1",
        title: "Senior Software Engineer",
        company: companyName,
        companyLogo: companyData.logo,
        description: "We are looking for an experienced Senior Software Engineer to join our team.",
        educationLevel: "Bachelor",
        experienceLevel: "5 to 10 years",
        contractType: "Permanent contract",
        region: "Greater Accra",
        city: "Accra",
        skills: ["React", "TypeScript", "Node.js"],
        date: "19.11.2025",
      },
      {
        id: "default-2",
        title: "Product Manager",
        company: companyName,
        companyLogo: companyData.logo,
        description: "Join us as a Product Manager to drive innovation and product strategy.",
        educationLevel: "Master",
        experienceLevel: "5 to 10 years",
        contractType: "Permanent contract",
        region: "Greater Accra",
        city: "Accra",
        skills: ["Product Management", "Strategy", "Agile"],
        date: "18.11.2025",
      },
    ];
  };

  const companyJobs = getAllJobsForCompany(companyName);

  const handleViewJobs = () => {
    navigate("/jobs/all", { state: { company: companyName } });
  };

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden pt-20 sm:pt-24 md:pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${companyData.logo})`,
            filter: "brightness(0.4) blur(0px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900" />

        <div className="container mx-auto px-4 sm:px-6 h-full relative z-10 flex items-center">
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-4 sm:mb-6 group inline-flex bg-white/95 backdrop-blur-sm border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 hover:text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-3 py-1.5 text-sm sm:text-base font-semibold"
              >
                <ArrowLeft className="mr-1.5 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back
              </Button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-white border-2 sm:border-4 border-white shadow-xl flex items-center justify-center overflow-hidden p-2 flex-shrink-0">
                  {!logoError ? (
                    <img 
                      src={companyData.logo} 
                      alt={companyData.name}
                      className="w-full h-full object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-700" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {companyData.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sky-400">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base md:text-lg font-semibold">{companyData.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-slate-50 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto -mt-8 sm:-mt-16 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 md:p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Company Info */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">About {companyData.name}</h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4 sm:mb-6">
                    {companyData.description}
                  </p>

                  <div className="relative md:mr-[-2rem]">
                    <CompanyInfoCard
                      industry={companyData.industry}
                      employees={companyData.employees}
                      founded={companyData.founded}
                      website={companyData.website}
                      email={companyData.email}
                      phone={companyData.phone}
                      className="md:rounded-r-none"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Open Positions</h3>
                  <div className="bg-sky-50 rounded-xl p-4 sm:p-6 border border-sky-100 md:rounded-l-none md:-ml-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                          {companyJobs.length}
                        </div>
                        <p className="text-sm sm:text-base text-slate-600">Available Jobs</p>
                      </div>
                      
                      <div className="hidden sm:block h-16 w-px bg-sky-200"></div>
                      
                      <div className="flex items-center w-full sm:w-auto">
                        <button
                          onClick={handleViewJobs}
                          className="group relative overflow-hidden border-2 cursor-pointer transition-all duration-500 ease-out 
                                    shadow-md hover:shadow-sky-300/30 hover:scale-[1.02] active:scale-95
                                    inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2
                                    border-sky-300 bg-gradient-to-br from-sky-100 via-sky-50 to-white
                                    rounded-2xl w-full sm:w-auto"
                        >
                          {/* Moving gradient layer */}
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl"
                          ></div>

                          {/* Content */}
                          <div className="relative z-10 flex items-center gap-2">
                            <span className="text-sky-700 font-bold text-xs sm:text-sm group-hover:text-sky-800 transition-colors duration-300 whitespace-nowrap">
                              View All Open Positions
                            </span>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-sky-700 group-hover:text-sky-800 transition-colors duration-300 group-hover:scale-110" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Companies Section - Full Width */}
        <div className="w-full py-8 sm:py-12 bg-slate-200/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                  Other Companies
                </h2>
                <p className="text-slate-600 text-base sm:text-lg">
                  Explore opportunities with other leading organizations
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {otherCompanies.slice(0, 8).map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative h-full bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 hover:border-slate-900 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl"
                    onClick={() => navigate(`/companies/${encodeURIComponent(company.name)}`)}
                  >
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-slate-900 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-xl overflow-hidden p-2">
                      <img 
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = company.fallbackUrl;
                        }}
                      />
                    </div>
                    
                    {/* Company Name */}
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-300">
                      {company.name}
                    </h4>
                    
                    {/* Industry */}
                    <p className="text-xs text-slate-500 mb-3">{company.industry}</p>
                    
                    {/* Job Count */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">{company.jobs} Open Positions</span>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CompanyDetails;

