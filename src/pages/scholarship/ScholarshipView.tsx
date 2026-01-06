import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchScholarshipById, fetchAllScholarships, getDaysUntilDeadline, type Scholarship } from "@/utils/scholarshipUtils";
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
  ArrowRight,
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

// Scholarship interface is imported from utils

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
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [relatedScholarships, setRelatedScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch scholarship data from Supabase
  useEffect(() => {
    const loadScholarship = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch the main scholarship
        const data = await fetchScholarshipById(id);
        setScholarship(data);

        if (data) {
          // Fetch related scholarships (same level or location)
          const allScholarships = await fetchAllScholarships();
          const related = allScholarships
            .filter(s => s.id !== id && (s.level === data.level || s.location === data.location))
            .slice(0, 3);
          setRelatedScholarships(related);
        }
      } catch (error) {
        console.error("Error loading scholarship:", error);
        setScholarship(null);
      } finally {
        setLoading(false);
      }
    };

    loadScholarship();
  }, [id]);

  // FAQs from scholarship data or fallback
  const faqs: FAQ[] = scholarship?.faqs && scholarship.faqs.length > 0 
    ? scholarship.faqs.map(faq => ({ question: faq.question, answer: faq.answer }))
    : [
    {
      question: "Can I apply if I'm already studying?",
      answer: "This depends on the specific scholarship requirements. Some scholarships only accept new applicants, while others may support current students. Please check the eligibility criteria carefully."
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
      answer: "Most scholarships require a minimum GPA of 3.0 (B average) to maintain eligibility and renewal. Some prestigious scholarships may require higher GPAs. Check your scholarship agreement for specific requirements."
    },
    {
      question: "Will the scholarship cover my family expenses?",
      answer: "Most scholarships cover only the individual student's expenses. However, some comprehensive scholarships may provide additional support for scholars with dependents. Check the coverage details section for specifics."
    }
  ];

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

  const handleShare = (platform: string) => {
    if (!scholarship) return;
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

  const daysLeft = scholarship ? getDaysUntilDeadline(scholarship.deadline) : 0;
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedScholarships.map((relScholarship) => {
                  const isMTN = relScholarship.provider?.toLowerCase().includes("mtn") || relScholarship.title?.toLowerCase().includes("mtn");
                  const daysLeft = getDaysUntilDeadline(relScholarship.deadline);
                  const isDeadlineSoon = daysLeft > 0 && daysLeft <= 30;

                  return (
                    <motion.div
                      key={relScholarship.id}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/scholarship/${relScholarship.id}`)}
                    >
                      {/* Compact Card Style - Matching global scholarship page design */}
                      <div className="relative w-full overflow-hidden rounded-2xl border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                        style={{
                          borderColor: isMTN ? "#fbbf24" : "#e5e7eb"
                        }}
                      >
                        {/* Top accent bar - Only yellow for MTN */}
                        <div className="h-1 w-full"
                          style={{
                            backgroundColor: isMTN ? "#fbbf24" : "#bd9f67"
                          }}
                        />

                        {/* Image Section */}
                        {relScholarship.imageUrl && (
                          <div className="relative h-32 overflow-hidden bg-slate-100">
                            <motion.img
                              src={relScholarship.imageUrl}
                              alt={relScholarship.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            
                            {/* Badges on Image */}
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                              {relScholarship.verified && (
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/95 backdrop-blur-sm border border-green-300 shadow-md">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                              )}
                              {isMTN && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-yellow-400 text-black shadow-md">
                                  MTN
                                </span>
                              )}
                              {isDeadlineSoon && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-red-500 text-white shadow-md">
                                  Soon
                                </span>
                              )}
                            </div>
                            
                            {/* Category badge on image */}
                            <div className="absolute top-2 right-2">
                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-auto bg-white/95 backdrop-blur-sm border-white/50">
                                {relScholarship.category}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="flex flex-col flex-1 p-4">
                          {/* Title */}
                          <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-[#bd9f67] transition-colors">
                            {relScholarship.title}
                          </h3>

                          {/* Provider */}
                          <p className="text-xs text-slate-600 mb-3 font-medium">
                            {relScholarship.provider}
                          </p>

                          {/* Info Icons */}
                          <div className="space-y-1.5 mb-3 flex-1">
                            <div className="flex items-center gap-2 text-xs text-slate-700">
                              <DollarSign className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                              <span className="font-semibold truncate">
                                {relScholarship.amount} {relScholarship.currency !== relScholarship.amount && relScholarship.currency}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{relScholarship.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{relScholarship.level}</span>
                            </div>
                            {daysLeft > 0 && (
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span>{daysLeft} days left</span>
                              </div>
                            )}
                          </div>

                          {/* Action Button - Matching questions page style */}
                          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/scholarship/${relScholarship.id}`);
                              }}
                              className="group relative inline-block text-xs font-semibold text-[#bd9f67] transition-colors duration-300 hover:text-[#a88a59]"
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                            >
                              <motion.span
                                className="relative inline-block pb-0.5 flex items-center gap-1"
                                whileHover={{ x: 2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                View Details
                                <span
                                  className="absolute bottom-0 left-0 h-[1px] bg-[#bd9f67] transition-all duration-300 group-hover:bg-[#a88a59]"
                                  style={{
                                    width: 'calc(100% + 8px)',
                                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                  }}
                                />
                              </motion.span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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

