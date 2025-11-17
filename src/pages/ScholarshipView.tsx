import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  BookmarkPlus,
  Share2,
  Globe,
  FileText,
  Award,
  Users,
  TrendingUp,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  ChevronRight,
  Download,
  Info,
  Target,
  BookOpen,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  currency: string;
  category: string;
  deadline: string;
  location: string;
  level: string;
  description: string;
  requirements: string[];
  verified: boolean;
  imageUrl?: string;
  featured: boolean;
  website?: string;
  email?: string;
  phone?: string;
  fullDescription?: string;
  benefits?: string[];
  eligibility?: string[];
  applicationProcess?: string[];
  documents?: string[];
  selectionCriteria?: string[];
  coverageDetails?: string[];
  duration?: string;
  renewability?: string;
  numberOfAwards?: string;
  fieldOfStudy?: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

const ScholarshipView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Mock scholarship data - In production, fetch from API
  const scholarships: Scholarship[] = [
    {
      id: "1",
      title: "Mastercard Foundation Scholars Program",
      provider: "Mastercard Foundation",
      amount: "Full Tuition",
      currency: "USD",
      category: "Merit-Based",
      deadline: "2024-12-31",
      location: "Ghana",
      level: "Undergraduate",
      description: "Comprehensive scholarship covering tuition, accommodation, and living expenses for outstanding students.",
      requirements: ["Minimum GPA 3.5", "Financial need", "Leadership potential"],
      verified: true,
      featured: true,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg",
      website: "https://mastercardfdn.org/scholars-program/",
      email: "scholars@mastercardfdn.org",
      phone: "+233 30 278 0300",
      fullDescription: "The Mastercard Foundation Scholars Program is a comprehensive scholarship initiative that identifies and supports academically talented young people from disadvantaged communities across Africa. The program provides financial support, mentorship, and leadership development opportunities to help scholars achieve their full potential and become transformative leaders in their communities.",
      benefits: [
        "Full tuition coverage for the entire program duration",
        "Accommodation expenses (on-campus or off-campus housing)",
        "Monthly living allowance for food and personal expenses",
        "Textbooks and learning materials",
        "Health insurance coverage",
        "Leadership development workshops and training",
        "Mentorship from industry professionals",
        "Networking opportunities with global scholars",
        "Career development and internship support",
        "Alumni network access after graduation"
      ],
      eligibility: [
        "Must be a citizen of an African country",
        "Demonstrated academic excellence (minimum GPA 3.5 on a 4.0 scale)",
        "Evidence of financial need",
        "Strong leadership potential and community involvement",
        "Must have received admission to a partner university",
        "Age 18-25 at the time of application",
        "Proficiency in English (for English-taught programs)",
        "Commitment to returning to Africa after studies to contribute to development"
      ],
      applicationProcess: [
        "Visit the official Mastercard Foundation Scholars Program website",
        "Create an account on the application portal",
        "Complete the online application form with personal details",
        "Upload all required documents (transcripts, recommendation letters, etc.)",
        "Write and submit required essays on leadership and community impact",
        "Submit the application before the deadline",
        "Shortlisted candidates will be contacted for interviews",
        "Final selection and scholarship award notification"
      ],
      documents: [
        "Completed application form",
        "Academic transcripts from secondary school and/or university",
        "Two letters of recommendation (from teachers or community leaders)",
        "Personal statement (500-1000 words)",
        "Leadership essay describing community involvement",
        "Proof of financial need (family income statement)",
        "Copy of national ID or passport",
        "Admission letter from partner university (if available)",
        "Recent passport-size photograph"
      ],
      selectionCriteria: [
        "Academic excellence and potential (40%)",
        "Leadership qualities and community engagement (30%)",
        "Financial need (20%)",
        "Interview performance (10%)"
      ],
      coverageDetails: [
        "100% tuition fees coverage",
        "Room and board expenses",
        "Monthly stipend of $300-500 depending on location",
        "One-time laptop/technology allowance",
        "Books and supplies budget of $500 per semester",
        "Health insurance premium coverage",
        "Round-trip airfare to study location",
        "Visa and travel documentation costs"
      ],
      duration: "Full duration of undergraduate program (4 years)",
      renewability: "Renewable annually based on satisfactory academic performance (minimum GPA 3.0)",
      numberOfAwards: "150+ scholarships annually across partner institutions",
      fieldOfStudy: [
        "Engineering & Technology",
        "Health Sciences",
        "Business & Economics",
        "Agriculture & Environmental Sciences",
        "Education",
        "Social Sciences",
        "All other undergraduate programs at partner universities"
      ]
    },
    {
      id: "2",
      title: "Ghana Education Trust Fund (GETFund)",
      provider: "Government of Ghana",
      amount: "50000",
      currency: "GHS",
      category: "Need-Based",
      deadline: "2024-11-15",
      location: "Ghana",
      level: "Graduate",
      description: "Government scholarship for Ghanaian students pursuing higher education.",
      requirements: ["Ghanaian citizenship", "Admission to accredited university", "Financial need"],
      verified: true,
      featured: true,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
      website: "https://getfund.gov.gh",
      email: "info@getfund.gov.gh",
      phone: "+233 30 225 1234",
      fullDescription: "The Ghana Education Trust Fund (GETFund) Scholarship Scheme provides financial assistance to qualified Ghanaian students to pursue tertiary education both locally and abroad. The scheme aims to increase access to quality education and develop human capital for national development.",
      benefits: [
        "Annual scholarship award of GHS 50,000",
        "Partial or full tuition coverage depending on program",
        "Study allowance for books and materials",
        "Research funding for graduate students",
        "Access to GETFund educational programs and workshops"
      ],
      eligibility: [
        "Must be a Ghanaian citizen with valid national ID",
        "Admitted to an accredited tertiary institution in Ghana or abroad",
        "Demonstrated financial need with supporting documentation",
        "Good academic standing (minimum 2nd class lower division)",
        "Not receiving any other full scholarship",
        "Bond agreement to serve Ghana after completion"
      ],
      applicationProcess: [
        "Visit the GETFund website and download the application form",
        "Complete all sections of the application form",
        "Attach all required supporting documents",
        "Submit application to the GETFund Secretariat or online portal",
        "Wait for verification and assessment",
        "Attend interview if shortlisted",
        "Sign bond agreement upon selection",
        "Receive scholarship award letter"
      ],
      documents: [
        "Completed GETFund application form",
        "Ghana Card or valid national identification",
        "Academic transcripts and certificates",
        "Admission letter from institution",
        "Two passport-size photographs",
        "Financial need statement",
        "Two recommendation letters",
        "Birth certificate",
        "Guarantor forms (for bond agreement)"
      ],
      selectionCriteria: [
        "Academic performance (35%)",
        "Financial need (35%)",
        "Program relevance to national development (20%)",
        "Interview and documentation (10%)"
      ],
      coverageDetails: [
        "Up to GHS 50,000 per academic year",
        "Tuition contribution based on program cost",
        "Study allowance paid in installments",
        "No coverage for accommodation or living expenses"
      ],
      duration: "Duration of graduate program (typically 1-3 years)",
      renewability: "Renewable annually upon satisfactory progress and compliance with bond terms",
      numberOfAwards: "500+ scholarships annually",
      fieldOfStudy: [
        "All fields of study at accredited institutions",
        "Priority given to STEM, Health, Education, and Agriculture"
      ]
    },
    {
      id: "3",
      title: "Chevening Scholarships",
      provider: "UK Government",
      amount: "Full Coverage",
      currency: "GBP",
      category: "Merit-Based",
      deadline: "2024-10-31",
      location: "United Kingdom",
      level: "Graduate",
      description: "Fully-funded scholarships for one-year Master's degrees at UK universities.",
      requirements: ["2+ years work experience", "Bachelor's degree", "English proficiency"],
      verified: true,
      featured: true,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg",
      website: "https://www.chevening.org",
      email: "chevening@fco.gov.uk",
      phone: "+44 20 7008 1500",
      fullDescription: "Chevening Scholarships are the UK government's global scholarship programme, funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations. The scholarships support study at UK universities for individuals with demonstrable leadership potential who will shape the future of their countries across the world.",
      benefits: [
        "Full tuition fees for one-year Master's program",
        "Monthly living allowance (stipend)",
        "Round-trip airfare to the UK",
        "Arrival allowance",
        "Homeward departure allowance",
        "Cost of one visa application",
        "Travel grant to attend Chevening events in the UK",
        "Access to exclusive Chevening alumni network",
        "Professional networking events and opportunities"
      ],
      eligibility: [
        "Citizen of a Chevening-eligible country",
        "Hold an undergraduate degree that enables entry to a postgraduate program at a UK university",
        "Have at least two years (2,800 hours) of work experience",
        "Apply to three different eligible UK university courses and receive an unconditional offer from one",
        "Meet the Chevening English language requirement",
        "Not hold British or dual British citizenship",
        "Not be a current employee or ex-employee of FCDO or FCDO sponsored organizations",
        "Return to your country of citizenship for a minimum of two years after scholarship ends"
      ],
      applicationProcess: [
        "Check eligibility on the Chevening website",
        "Create an account on the Chevening application system",
        "Complete the online application form (personal details, work experience, study plan)",
        "Select three UK university courses you wish to apply to",
        "Write four essays (Leadership, Networking, Study Plans, Career Plans)",
        "Provide two references",
        "Submit application before November 7 deadline",
        "Apply to your chosen UK universities (conditional offers accepted)",
        "If shortlisted, attend interview at British Embassy/High Commission",
        "Receive final scholarship decision in June"
      ],
      documents: [
        "Valid passport",
        "Academic transcripts and degree certificates",
        "Two reference letters",
        "English language test results (IELTS, TOEFL, etc.)",
        "University conditional offer letters",
        "Work experience certificates and CV",
        "Essay responses (submitted online)",
        "No financial documents required"
      ],
      selectionCriteria: [
        "Leadership and influence (essential)",
        "Networking skills and relationship building (essential)",
        "Academic excellence and study plan (important)",
        "Career trajectory and impact potential (important)",
        "Interview performance (final stage)"
      ],
      coverageDetails: [
        "Full tuition fees (no upper limit)",
        "Monthly stipend of approximately £1,236",
        "Economy class return airfare",
        "£1,500 arrival allowance",
        "£1,250 departure allowance",
        "Visa application fee",
        "Travel costs for mandatory events"
      ],
      duration: "One academic year (Master's degree program)",
      renewability: "Non-renewable. Scholars must return home for 2 years before being eligible for another Chevening award",
      numberOfAwards: "1,500+ scholarships globally each year",
      fieldOfStudy: [
        "All Master's degree subjects available at UK universities",
        "Must be a full-time one-year program or part-time over two years",
        "Distance learning and online courses not eligible"
      ]
    },
  ];

  const scholarship = scholarships.find((s) => s.id === id);

  const faqs: FAQ[] = [
    {
      question: "Can I apply if I'm already studying?",
      answer: "This depends on the specific scholarship requirements. Some scholarships like Mastercard Foundation only accept new applicants, while others like GETFund may support current students. Please check the eligibility criteria carefully."
    },
    {
      question: "How long does the application process take?",
      answer: "The application review process typically takes 2-4 months from the application deadline. Shortlisted candidates will be contacted for interviews, and final decisions are usually made 1-2 months after interviews."
    },
    {
      question: "Can I apply to multiple scholarships at once?",
      answer: "Yes, you can apply to multiple scholarships simultaneously. However, if you receive multiple scholarship offers, you may need to choose one as some scholarships don't allow concurrent funding."
    },
    {
      question: "What happens if I don't meet all requirements?",
      answer: "If you don't meet all the stated requirements, your application may not be considered. However, some scholarships have flexible requirements for exceptional candidates. Contact the scholarship provider directly to clarify."
    },
    {
      question: "Is there an application fee?",
      answer: "Most legitimate scholarships do not charge application fees. If you're asked to pay a fee, verify the legitimacy of the scholarship program carefully."
    },
    {
      question: "Can I defer my scholarship to the next academic year?",
      answer: "Deferment policies vary by scholarship. Some allow one-year deferrals with valid reasons (medical, family emergencies), while others require you to reapply. Contact the scholarship provider for specific deferment policies."
    },
    {
      question: "What GPA do I need to maintain during my studies?",
      answer: "Most scholarships require a minimum GPA of 3.0 (B average) to maintain eligibility and renewal. Some prestigious scholarships like Mastercard Foundation may require higher GPAs. Check your scholarship agreement for specific requirements."
    },
    {
      question: "Will the scholarship cover my family expenses?",
      answer: "Most scholarships cover only the individual student's expenses. However, some comprehensive scholarships like Mastercard Foundation may provide additional support for scholars with dependents. Check the coverage details section for specifics."
    }
  ];

  const relatedScholarships = scholarships.filter(
    (s) => s.id !== id && (s.level === scholarship?.level || s.location === scholarship?.location)
  ).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  if (!scholarship) {
    return (
      <>
        <InitScripts />
        <Spinner />
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Scholarship Not Found</h2>
            <p className="text-slate-600 mb-6">The scholarship you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/scholarship-hub")}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Scholarships
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getDaysUntilDeadline = (dateString: string): number => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this scholarship: ${scholarship.title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        break;
    }
    setShowShareMenu(false);
  };

  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
  const isDeadlineSoon = daysLeft > 0 && daysLeft <= 30;

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero Section with Image */}
      <section className="relative h-[500px] overflow-hidden" style={{ paddingTop: '80px' }}>
        {scholarship.imageUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${scholarship.imageUrl})`,
                filter: 'brightness(0.4) blur(0px)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#243137]/80 via-[#243137]/70 to-[#243137]" />
          </>
        )}
        
        <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/scholarship-hub")}
                className="mb-6 text-white hover:text-[#bd9f67] hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Scholarships
              </Button>

              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="outline" className="px-3 py-1.5 border-white/30 text-white font-semibold">
                  {scholarship.category}
                </Badge>
                {isDeadlineSoon && (
                  <Badge className="px-3 py-1.5 bg-red-500 text-white font-semibold animate-pulse">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Deadline Soon
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-6 mb-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {scholarship.title}
                  </h1>
                </div>
                
                <div className="hidden md:block w-px h-16 bg-white/30"></div>
                
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Button 
                    size="lg"
                    className="bg-[#bd9f67] hover:bg-[#a88a59] text-[#243137] font-bold text-lg px-8 py-6 shadow-xl"
                    onClick={() => window.open(scholarship.website, '_blank')}
                  >
                    Apply Now
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white p-3 h-auto aspect-square"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    title={isBookmarked ? "Remove from saved" : "Save scholarship"}
                  >
                    {isBookmarked ? (
                      <Bookmark className="w-5 h-5 fill-white" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </Button>
                  <div className="relative">
                    <Button
                      size="default"
                      variant="outline"
                      className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white p-3 h-auto aspect-square"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      title="Share scholarship"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 bg-white rounded-lg shadow-xl p-4 z-50 min-w-[200px]"
                    >
                      <div className="space-y-2">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <span className="text-slate-700">Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-sky-500" />
                          <span className="text-slate-700">Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-blue-700" />
                          <span className="text-slate-700">LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <LinkIcon className="w-5 h-5 text-slate-600" />
                              <span className="text-slate-700">Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#bd9f67] text-xl mb-6">
                <Building2 className="w-5 h-5" />
                <span className="font-semibold">{scholarship.provider}</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <DollarSign className="w-5 h-5 inline mr-2 text-[#bd9f67]" />
                    <span className="font-semibold text-lg">
                      {scholarship.amount} {scholarship.currency !== scholarship.amount && scholarship.currency}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <MapPin className="w-5 h-5 inline mr-2 text-[#bd9f67]" />
                    <span className="font-semibold">{scholarship.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <GraduationCap className="w-5 h-5 inline mr-2 text-[#bd9f67]" />
                    <span className="font-semibold">{scholarship.level}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deadline Alert Banner */}
      {daysLeft > 0 && (
        <div className="bg-[#bd9f67] text-[#243137] py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">
                Application Deadline: {formatDate(scholarship.deadline)} ({daysLeft} days remaining)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[80px] z-40 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center md:justify-start gap-0">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-6 md:px-8 py-4 font-semibold text-base md:text-lg transition-all relative ${
                activeSection === "overview"
                  ? "text-[#243137]"
                  : "text-slate-600 hover:text-[#243137]"
              }`}
            >
              Overview
              {activeSection === "overview" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#bd9f67]"
                  initial={false}
                />
              )}
            </button>
            <div className="w-px h-8 bg-slate-200"></div>
            <button
              onClick={() => setActiveSection("application-tips")}
              className={`px-6 md:px-8 py-4 font-semibold text-base md:text-lg transition-all relative ${
                activeSection === "application-tips"
                  ? "text-[#243137]"
                  : "text-slate-600 hover:text-[#243137]"
              }`}
            >
              Application Tips
              {activeSection === "application-tips" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#bd9f67]"
                  initial={false}
                />
              )}
            </button>
            <div className="w-px h-8 bg-slate-200"></div>
            <button
              onClick={() => setActiveSection("faqs")}
              className={`px-6 md:px-8 py-4 font-semibold text-base md:text-lg transition-all relative ${
                activeSection === "faqs"
                  ? "text-[#243137]"
                  : "text-slate-600 hover:text-[#243137]"
              }`}
            >
              FAQs
              {activeSection === "faqs" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#bd9f67]"
                  initial={false}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab Content */}
              {activeSection === "overview" && (
                <>
                  {/* Overview */}
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                  >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#243137] p-3 rounded-lg">
                    <Info className="w-6 h-6 text-[#bd9f67]" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Overview</h2>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {scholarship.fullDescription || scholarship.description}
                </p>
              </motion.div>

              {/* Tabbed Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
              >
                <Tabs defaultValue="benefits" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-slate-100 p-1">
                    <TabsTrigger value="benefits" className="text-sm py-2.5">
                      <Award className="w-4 h-4 mr-2" />
                      Benefits
                    </TabsTrigger>
                    <TabsTrigger value="eligibility" className="text-sm py-2.5">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Eligibility
                    </TabsTrigger>
                    <TabsTrigger value="application" className="text-sm py-2.5">
                      <FileText className="w-4 h-4 mr-2" />
                      Application
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-sm py-2.5">
                      <Download className="w-4 h-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="benefits" className="mt-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Scholarship Benefits</h3>
                    <div className="space-y-3">
                      {scholarship.benefits?.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="bg-[#bd9f67] rounded-full p-1 mt-0.5">
                            <Check className="w-4 h-4 text-[#243137]" />
                          </div>
                          <span className="text-slate-700 flex-1">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="eligibility" className="mt-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Eligibility Criteria</h3>
                    <div className="space-y-3">
                      {scholarship.eligibility?.map((criterion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg"
                        >
                          <ChevronRight className="w-5 h-5 text-[#bd9f67] mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{criterion}</span>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="application" className="mt-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Application Process</h3>
                    <div className="space-y-4">
                      {scholarship.applicationProcess?.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex gap-4 p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#243137] text-[#bd9f67] font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1.5">
                            <p className="text-slate-700">{step}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Required Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {scholarship.documents?.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#bd9f67] transition-colors"
                        >
                          <FileText className="w-5 h-5 text-[#bd9f67] flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{doc}</span>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Selection Criteria */}
              {scholarship.selectionCriteria && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#243137] p-3 rounded-lg">
                      <Target className="w-6 h-6 text-[#bd9f67]" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Selection Criteria</h2>
                  </div>
                  <div className="space-y-4">
                    {scholarship.selectionCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-700 font-medium">{criterion}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: criterion.match(/(\d+)%/)?.[1] + "%" || "0%" }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-[#bd9f67] to-[#a88a59]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Information and Coverage - Moved from Sidebar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-[#243137] rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {scholarship.email && (
                      <a 
                        href={`mailto:${scholarship.email}`}
                        className="flex items-center gap-3 text-white hover:text-[#bd9f67] transition-colors group"
                      >
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#bd9f67] transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-sm break-all">{scholarship.email}</span>
                      </a>
                    )}
                    {scholarship.phone && (
                      <a 
                        href={`tel:${scholarship.phone}`}
                        className="flex items-center gap-3 text-white hover:text-[#bd9f67] transition-colors group"
                      >
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#bd9f67] transition-colors">
                          <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{scholarship.phone}</span>
                      </a>
                    )}
                    {scholarship.website && (
                      <a 
                        href={scholarship.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-white hover:text-[#bd9f67] transition-colors group"
                      >
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#bd9f67] transition-colors">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="text-sm break-all">Official Website</span>
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Coverage Details */}
                {scholarship.coverageDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gradient-to-br from-[#bd9f67] to-[#a88a59] rounded-2xl p-6 shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">What's Covered</h3>
                    <div className="space-y-2">
                      {scholarship.coverageDetails.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-white text-sm">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
                </>
              )}

              {/* Application Tips Tab Content */}
              {activeSection === "application-tips" && (
                <motion.div
                  key="application-tips"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-[#bd9f67] to-[#a88a59] rounded-2xl p-8 shadow-lg text-white"
                >
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">Application Tips</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg p-5 border border-amber-100/50">
                    <h4 className="font-bold text-lg mb-2 text-[#243137]">Start Early</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Begin your application at least 2-3 months before the deadline to gather all required documents and write compelling essays.
                    </p>
                  </div>
                  <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg p-5 border border-amber-100/50">
                    <h4 className="font-bold text-lg mb-2 text-[#243137]">Follow Instructions</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Read and follow all application instructions carefully. Missing documents or incorrect formats can lead to disqualification.
                    </p>
                  </div>
                  <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg p-5 border border-amber-100/50">
                    <h4 className="font-bold text-lg mb-2 text-[#243137]">Strong Essays</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Write authentic, personal essays that showcase your unique experiences, goals, and how you'll contribute to your community.
                    </p>
                  </div>
                  <div className="bg-amber-50/90 backdrop-blur-sm rounded-lg p-5 border border-amber-100/50">
                    <h4 className="font-bold text-lg mb-2 text-[#243137]">Get Feedback</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Have teachers, mentors, or advisors review your application materials before submission to catch errors and improve clarity.
                    </p>
                  </div>
                </div>
                </motion.div>
              )}

              {/* FAQs Tab Content */}
              {activeSection === "faqs" && (
                <motion.div
                  key="faqs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#243137] p-3 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-[#bd9f67]" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-slate-900 font-semibold hover:text-[#bd9f67]">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-700 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#bd9f67] mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Deadline</p>
                      <p className="font-semibold text-slate-900">{formatDate(scholarship.deadline)}</p>
                      {daysLeft > 0 && (
                        <p className="text-xs text-[#bd9f67] font-medium mt-1">{daysLeft} days left</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-[#bd9f67] mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Award Amount</p>
                      <p className="font-semibold text-slate-900">
                        {scholarship.amount} {scholarship.currency !== scholarship.amount && scholarship.currency}
                      </p>
                    </div>
                  </div>

                  {scholarship.duration && (
                    <>
                      <div className="h-px bg-slate-200" />
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#bd9f67] mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Duration</p>
                          <p className="font-semibold text-slate-900">{scholarship.duration}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {scholarship.numberOfAwards && (
                    <>
                      <div className="h-px bg-slate-200" />
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-[#bd9f67] mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Number of Awards</p>
                          <p className="font-semibold text-slate-900">{scholarship.numberOfAwards}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {scholarship.renewability && (
                    <>
                      <div className="h-px bg-slate-200" />
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#bd9f67] mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Renewability</p>
                          <p className="font-semibold text-slate-900 text-sm">{scholarship.renewability}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {scholarship.fieldOfStudy && scholarship.fieldOfStudy.length > 0 && (
                    <>
                      <div className="h-px bg-slate-200" />
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#bd9f67] mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Fields of Study</p>
                          <div className="flex flex-wrap gap-2">
                            {scholarship.fieldOfStudy.slice(0, 3).map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {scholarship.fieldOfStudy.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{scholarship.fieldOfStudy.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full bg-[#243137] hover:bg-[#1a2329] text-white font-semibold"
                    size="lg"
                    onClick={() => window.open(scholarship.website, '_blank')}
                  >
                    Visit Official Website
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#bd9f67] text-[#bd9f67] hover:bg-[#bd9f67] hover:text-white font-semibold"
                    size="lg"
                    onClick={() => window.open(scholarship.website, '_blank')}
                  >
                    Download Application Form
                    <Download className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Scholarships */}
          {relatedScholarships.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Scholarships</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedScholarships.map((relScholarship) => (
                  <motion.div
                    key={relScholarship.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/scholarship/${relScholarship.id}`)}
                  >
                    {relScholarship.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relScholarship.imageUrl}
                          alt={relScholarship.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
                        {relScholarship.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">{relScholarship.provider}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#bd9f67]">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-sm">{relScholarship.amount}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {relScholarship.level}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ScholarshipView;

