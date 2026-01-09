import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Briefcase, MapPin, Building2, Sparkles, Layers, Factory, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AnimatedSelect from "@/components/ui/animated-select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Job Categories Data
const JOB_CATEGORIES = [
  { id: '1', label: 'Management', value: 'management', description: 'Leadership and executive roles', icon: '💼' },
  { id: '2', label: 'Services', value: 'services', description: 'Customer-facing service positions', icon: '🤝' },
  { id: '3', label: 'Production, maintenance, quality', value: 'production', description: 'Manufacturing and quality control', icon: '⚙️' },
  { id: '4', label: 'Accounting, controlling, finance', value: 'finance', description: 'Financial and accounting roles', icon: '💰' },
  { id: '5', label: 'HR, training', value: 'hr', description: 'Human resources and development', icon: '👥' },
  { id: '6', label: 'Tourism, hotel business and catering', value: 'tourism', description: 'Hospitality and tourism sector', icon: '🏨' },
  { id: '7', label: 'Health and social professions', value: 'health', description: 'Healthcare and social services', icon: '🏥' },
];

// Job Industries Data
const JOB_INDUSTRIES = [
  { id: '1', label: 'IT, software engineering, Internet', value: 'it', description: 'Technology and software development', icon: '💻' },
  { id: '2', label: 'Marketing, communication, media', value: 'marketing', description: 'Marketing and media roles', icon: '📢' },
  { id: '3', label: 'Distribution, selling, wholesale', value: 'distribution', description: 'Sales and distribution', icon: '📦' },
  { id: '4', label: 'Education, training', value: 'education', description: 'Teaching and training positions', icon: '📚' },
  { id: '5', label: 'Services other', value: 'services_other', description: 'Various service industries', icon: '🔧' },
  { id: '6', label: 'Banking, insurance, finance', value: 'banking', description: 'Financial services sector', icon: '🏦' },
  { id: '7', label: 'Agriculture, fisheries', value: 'agriculture', description: 'Agriculture and fisheries', icon: '🌾' },
];

// Job Regions Data
const JOB_REGIONS = [
  { id: '1', label: 'Ashanti', value: 'ashanti', description: 'Central Ghana region', icon: '📍' },
  { id: '2', label: 'Brong Ahafo', value: 'brong_ahafo', description: 'Western central region', icon: '📍' },
  { id: '3', label: 'Eastern', value: 'eastern', description: 'Eastern Ghana region', icon: '📍' },
  { id: '4', label: 'Upper West', value: 'upper_west', description: 'Northwestern region', icon: '📍' },
  { id: '5', label: 'Volta', value: 'volta', description: 'Eastern coastal region', icon: '📍' },
  { id: '6', label: 'Western', value: 'western', description: 'Southwestern region', icon: '📍' },
  { id: '7', label: 'Northern', value: 'northern', description: 'Northern Ghana region', icon: '📍' },
];

// Job Filter Card Component
const JobFilterCard = ({ 
  title, 
  icon, 
  data, 
  defaultValue 
}: { 
  title: string; 
  icon: React.ReactNode; 
  data: any[]; 
  defaultValue: string;
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[32px] shadow-xl p-5 sm:p-6 border border-rose-50 flex flex-col min-h-[200px]"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-700">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>
      </div>
      <div className="h-px w-full bg-slate-200 mb-4" />
      
      <div className="flex-1 flex items-start justify-center w-full overflow-visible">
        <div className="w-full">
          <AnimatedSelect 
            data={data} 
            defaultValue={defaultValue}
            id={title.toLowerCase().replace(/\s+/g, '-')}
            onChange={(value) => {
              setSelectedValue(value);
              console.log(`Selected ${title}:`, value);
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

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

const BrowseJobs = () => {
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Array<{ name: string; logoUrl: string; fallbackUrl: string; jobs: number; industry: string; featured?: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  useEffect(() => {
    loadRecentJobs();
    loadCompanies();
  }, []);

  const loadRecentJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('jobs')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error loading recent jobs:", error);
        setRecentJobs([]);
        return;
      }

      if (data) {
        const transformed: Job[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          companyLogo: item.company_logo,
          description: item.description || "",
          educationLevel: item.education_level || "Bachelor",
          experienceLevel: item.experience_level || "2 to 5 years",
          contractType: item.contract_type || "Permanent contract",
          region: item.region || "Greater Accra",
          city: item.city || "",
          skills: Array.isArray(item.skills) ? item.skills : [],
          date: item.date ? new Date(item.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
        }));
        setRecentJobs(transformed);
      }
    } catch (error) {
      console.error("Error:", error);
      setRecentJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    setCompaniesLoading(true);
    try {
      // Load featured companies
      const { data: companiesData, error: companiesError } = await (supabase as any)
        .from('companies')
        .select('id, name, logo_url, industry, featured')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(12);

      if (companiesError) {
        console.error("Error loading companies:", companiesError);
        setCompanies([]);
        return;
      }

      if (companiesData) {
        // Get job counts for each company
        const companiesWithJobs = await Promise.all(
          companiesData.map(async (comp: any) => {
            const { count } = await (supabase as any)
              .from('jobs')
              .select('*', { count: 'exact', head: true })
              .eq('company', comp.name)
              .eq('verified', true);

            return {
              name: comp.name,
              logoUrl: comp.logo_url || `https://logo.clearbit.com/${comp.name.toLowerCase().replace(/\s+/g, '')}.com`,
              fallbackUrl: `https://logo.clearbit.com/${comp.name.toLowerCase().replace(/\s+/g, '')}.com`,
              jobs: count || 0,
              industry: comp.industry || "",
              featured: comp.featured || false,
            };
          })
        );
        setCompanies(companiesWithJobs);
      }
    } catch (error) {
      console.error("Error:", error);
      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };
  
  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      <div className="browse-page">
        {/* Hero Section - Inspired by diced hero section design */}
        <section 
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
          style={{ 
            paddingTop: '140px',
          }}
        >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg)` 
          }}
        />
        
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Main Heading - Diced Hero Style */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                <span style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}>
                  Browse Jobs
                </span>
              </motion.h1>
              
              {/* Separator Line - Diced Hero Style */}
              <motion.hr
                initial={{ width: 0 }}
                animate={{ width: '6.25rem' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  height: '0.25rem',
                  background: '#ffffff',
                  border: 'none',
                  margin: '1.125rem 0 1.875rem',
                }}
              />
              
              {/* Subtitle - Diced Hero Style */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  maxWidth: '600px'
                }}
              >
                Discover thousands of career opportunities across various industries. 
                From entry-level positions to executive roles, find the perfect job that matches your skills and aspirations.
              </motion.p>
              
              {/* CTA Button - Join Us Button Style with White Colors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-4"
              >
                <button
                  onClick={() => {
                    const element = document.getElementById('jobs-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative overflow-hidden border-2 cursor-pointer transition-all duration-500 ease-out 
                              shadow-md hover:shadow-white/30 hover:scale-[1.02] active:scale-95
                              inline-flex items-center justify-center gap-2 px-4 py-2
                              border-white/40 bg-gradient-to-br from-white/40 via-white/30 to-white/50
                              self-center"
                  style={{ 
                    height: 'fit-content', 
                    lineHeight: '1.5',
                    borderRadius: '2rem'
                  }}
                >
                  {/* Moving gradient layer */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    style={{ borderRadius: '2rem' }}
                  ></div>

                  {/* Overlay glow */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ borderRadius: '2rem' }}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    {/* Icon */}
                    <div className="p-1 rounded-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm group-hover:from-white/60 group-hover:to-white/40 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-slate-900 group-hover:text-slate-800 transition-all duration-300 group-hover:scale-110 drop-shadow-lg" />
                    </div>

                    {/* Text */}
                    <span className="text-slate-900 font-bold text-sm group-hover:text-slate-800 transition-colors duration-300 drop-shadow-md whitespace-nowrap">
                      Explore Jobs
                    </span>
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Wave Decoration */}
        <div className="bottom-wave absolute bottom-0 left-0 right-0">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 120" 
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
        </section>

        {/* Available Job Opportunities Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Browse through our curated list of job openings
              </p>
            </motion.div>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100">
                    <Search className="w-5 h-5 text-slate-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or location..."
                    className="flex-1 h-12 text-sm focus:outline-none placeholder:text-slate-400"
                  />
                  <Button 
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 h-12 rounded-xl font-semibold"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Companies Hiring Section */}
        <section className="companies-section py-20 bg-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-3 sm:mb-4"
            >
              Companies Hiring
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4"
            >
              Join leading organizations that are actively recruiting top talent. 
              Explore opportunities with industry leaders and innovative startups.
            </motion.p>
          </motion.div>

          {/* Carousel Container with Static Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-start">
              {/* Static Featured Card - Takes up space on Left */}
              {companiesLoading ? (
                <div className="flex-shrink-0 w-full lg:w-[calc(25%-0.75rem)]">
                  <div className="bg-white rounded-2xl p-4 sm:p-6 border-4 border-red-600 h-full animate-pulse">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ) : companies.find(c => c.featured) ? (
                (() => {
                  const featuredCompany = companies.find(c => c.featured) || companies[0];
                  return (
                    <div className="flex-shrink-0 w-full lg:w-[calc(25%-0.75rem)]">
                      <div 
                        className="group relative bg-white rounded-2xl p-4 sm:p-6 border-4 border-red-600 cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl h-full"
                        onClick={() => navigate('/jobs/all', { state: { company: featuredCompany.name } })}
                      >
                        {/* Featured Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 transition-transform duration-500 ease-out group-hover:scale-110">
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            FEATURED
                          </div>
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-red-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 ease-out"></div>
                        
                        {/* Company Logo */}
                        <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-xl overflow-hidden p-2">
                          <img 
                            src={featuredCompany.logoUrl} 
                            alt={featuredCompany.name}
                            className="w-full h-full object-contain transition-transform duration-500 ease-out"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = featuredCompany.fallbackUrl;
                            }}
                          />
                        </div>
                        
                        {/* Company Name */}
                        <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-500 ease-out">
                          {featuredCompany.name}
                        </h4>
                        
                        {/* Industry */}
                        <p className="text-xs text-slate-500 mb-3 transition-colors duration-500 ease-out group-hover:text-slate-600">{featuredCompany.industry}</p>
                        
                        {/* Job Count */}
                        <div className="flex items-center gap-2 text-slate-600 transition-colors duration-500 ease-out group-hover:text-slate-700">
                          <Briefcase className="w-4 h-4 transition-transform duration-500 ease-out group-hover:scale-110" />
                          <span className="text-sm font-medium">{featuredCompany.jobs} Open Positions</span>
                        </div>
                        
                        {/* Arrow Indicator */}
                        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-red-600 group-hover:scale-110">
                          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transform transition-all duration-500 ease-out group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : null}

              {/* Carousel Container - Scrolls next to featured card */}
              <div className="flex-1 min-w-0 w-full lg:w-auto">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                {companiesLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4">
                      <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 h-full animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-xl mb-4"></div>
                        <div className="h-6 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    </CarouselItem>
                  ))
                ) : companies.filter(c => !c.featured).slice(0, 12).map((company, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="h-full"
                    >
                      <div
                        className="group relative h-full bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 hover:border-slate-900 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl"
                        onClick={() => navigate('/jobs/all', { state: { company: company.name } })}
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
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
                  {/* Custom Navigation Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <CarouselPrevious className="relative left-0 top-0 translate-y-0 w-12 h-12 rounded-full bg-white border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-lg" />
                    <CarouselNext className="relative right-0 top-0 translate-y-0 w-12 h-12 rounded-full bg-white border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-lg" />
                  </div>
                </Carousel>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

        {/* Jobs Overview Section */}
        <section className="jobs-overview-section py-20 relative overflow-hidden">
          {/* Gradient Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Committed to employment in Ghana and in Africa
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3 items-start">
              {/* Jobs by Category */}
              <JobFilterCard
                title="Jobs by Category"
                icon={<Layers className="w-5 h-5" />}
                data={JOB_CATEGORIES}
                defaultValue="management"
              />

              {/* Jobs by Industry */}
              <JobFilterCard
                title="Jobs by Industry"
                icon={<Factory className="w-5 h-5" />}
                data={JOB_INDUSTRIES}
                defaultValue="it"
              />

              {/* Jobs by Region */}
              <JobFilterCard
                title="Jobs by Region"
                icon={<Map className="w-5 h-5" />}
                data={JOB_REGIONS}
                defaultValue="ashanti"
              />
            </div>

            <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
              <Button className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-6 text-base rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                Create your account now
              </Button>
            </div>

            <div className="mt-10 rounded-[28px] bg-slate-50 border border-slate-200 text-slate-900 px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-lg">
              <p className="text-base sm:text-lg font-medium text-center md:text-left text-slate-800 w-full md:w-auto">
                Receive by email job offers that interest you!
              </p>
              <div className="h-8 w-px bg-slate-300 hidden md:block"></div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="email-input-blinking w-full sm:flex-1 md:w-[420px] bg-rose-50/50 text-slate-900 placeholder:text-slate-900/60 border-2 border-rose-300/50 rounded-xl px-4 sm:px-6 py-3 sm:py-4 focus-visible:ring-0 transition-all text-sm sm:text-base"
                />
                <Button className="bg-rose-500 text-white hover:bg-rose-600 font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full whitespace-nowrap shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base">
                  activate your email alert
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Last Jobs Section */}
        <section className="py-20 bg-slate-50 relative overflow-hidden">
          {/* Subtle Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Recently Added Jobs
              </h2>
            </motion.div>

            {/* Job Cards Grid */}
            {loading ? (
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-pulse">
                    <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
                    <div className="h-20 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No recent jobs available.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {recentJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
                  >
                    {/* Company Logo */}
                    <div className="flex items-center gap-4 mb-4">
                      {job.companyLogo ? (
                        <div className="w-16 h-16 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                          <img 
                            src={job.companyLogo} 
                            alt={job.company}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-blue-900 font-semibold leading-tight truncate">{job.company}</div>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-bold text-blue-900 mb-2 line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Date & Company */}
                    <div className="text-sm text-slate-600 mb-3">
                      <span>{job.date} | </span>
                      <span className="underline">{job.company}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-700 mb-4 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Region & City */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="text-sm font-semibold text-blue-900">
                        Region: <span className="font-normal text-slate-700">{job.region}</span>
                      </div>
                      {job.city && (
                        <>
                          <div className="h-px w-16 bg-slate-300"></div>
                          <div className="text-sm font-semibold text-blue-900">
                            Town/City: <span className="font-normal text-slate-700">{job.city}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Separator Line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="relative h-px bg-slate-300">
                <div className="absolute left-1/2 -translate-x-1/2 w-32 h-px bg-blue-900"></div>
              </div>
            </motion.div>

            {/* Show all Jobs Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <Button 
                onClick={() => navigate('/jobs/all')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 font-semibold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Show all Jobs
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default BrowseJobs;

