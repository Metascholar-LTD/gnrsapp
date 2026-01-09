import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  X,
  Building2,
  GraduationCap,
  Clock,
  FileText,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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

const AllJobs = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all-jobs");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(
    (state as { company?: string })?.company || null
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedCategories, setCheckedCategories] = useState<Record<number, boolean>>({
    6: true, // Marketing, communication
    11: true, // Sales
    13: true, // Services
    15: true, // Tourism, hotel business and catering
  });
  const [checkedEducationLevels, setCheckedEducationLevels] = useState<Record<number, boolean>>({});
  const [checkedIndustries, setCheckedIndustries] = useState<Record<number, boolean>>({});
  const [checkedJobTypes, setCheckedJobTypes] = useState<Record<number, boolean>>({});
  const [checkedRegions, setCheckedRegions] = useState<Record<number, boolean>>({});
  const [checkedExperienceLevels, setCheckedExperienceLevels] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('jobs')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading jobs:", error);
        setJobs([]);
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
        setJobs(transformed);
      }
    } catch (error) {
      console.error("Error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const jobCategories = [
    { name: "Accounting, controlling, finance", count: 2, checked: false },
    { name: "Health and social professions", count: 0, checked: false },
    { name: "HR, training", count: 0, checked: false },
    { name: "IT, new technologies", count: 0, checked: false },
    { name: "Legal", count: 0, checked: false },
    { name: "Management", count: 0, checked: false },
    { name: "Marketing, communication", count: 1, checked: true },
    { name: "Production, maintenance, quality", count: 0, checked: false },
    { name: "Public buildings and works professions", count: 0, checked: false },
    { name: "Purchases", count: 0, checked: false },
    { name: "R&D, project management", count: 0, checked: false },
    { name: "Sales", count: 1, checked: true },
    { name: "Secretarial work, assistantship", count: 0, checked: false },
    { name: "Services", count: 1, checked: true },
    { name: "Telemarketing, teleassistance", count: 0, checked: false },
    { name: "Tourism, hotel business and catering", count: 0, checked: true },
    { name: "Transport, logistics", count: 0, checked: false },
  ];

  const educationLevels = [
    { name: "Bachelor", count: 11 },
    { name: "College", count: 9 },
    { name: "Doctorate", count: 7 },
    { name: "High school", count: 7 },
    { name: "HND", count: 10 },
    { name: "Master", count: 9 },
    { name: "Technical school", count: 8 },
  ];

  const industries = [
    { name: "Advice, audit, accounting", count: 5 },
    { name: "Aeronautics, naval", count: 0 },
    { name: "Agriculture, fishing, aquaculture", count: 1 },
    { name: "Airport and shipping services", count: 0 },
    { name: "Associative activities", count: 2 },
    { name: "Banking, insurance, finance", count: 11 },
    { name: "Call centers, hotlines", count: 1 },
    { name: "Chemistry, petrochemistry, raw materials, mining", count: 0 },
    { name: "Cleaning, security, surveillance", count: 2 },
    { name: "Consumer goods", count: 0 },
    { name: "Distribution, selling, wholesale", count: 4 },
    { name: "Edition, printing", count: 0 },
    { name: "Education, training", count: 3 },
    { name: "Electric, electronic, optical and precision equipments", count: 0 },
    { name: "Electricity, water, gas, nuclear, energy", count: 0 },
    { name: "Engineering, development studies", count: 0 },
    { name: "Environment, recycling", count: 0 },
    { name: "Event, receptionist", count: 0 },
    { name: "Food-processing industry", count: 2 },
    { name: "Furnishing, decoration", count: 0 },
    { name: "Government services", count: 0 },
    { name: "Greenways, forests, hunting", count: 0 },
    { name: "Handling", count: 0 },
    { name: "Health, pharmacy, hospitals, medical equipment", count: 0 },
    { name: "Hotel business, catering", count: 0 },
    { name: "Import-export business", count: 0 },
    { name: "Industry, production, manufacturing and other", count: 0 },
    { name: "IT, software engineering, Internet", count: 2 },
    { name: "Luxury, cosmetics", count: 0 },
    { name: "Maintenance, servicing, after-sales services", count: 0 },
    { name: "Marketing, communication, media", count: 3 },
    { name: "Mechanical equipment, machines", count: 0 },
    { name: "Metallurgy, steel industry", count: 0 },
    { name: "Motor, transportation equipment, reparation", count: 0 },
    { name: "Paper, wood, rubber, plastic, glass, tobacco", count: 0 },
    { name: "Pharmaceutical industry", count: 2 },
    { name: "Public buildings and works sector, construction", count: 1 },
    { name: "Quality, methods", count: 0 },
    { name: "Real-estate, architecture, town planning", count: 0 },
    { name: "Rental", count: 0 },
    { name: "Research and development", count: 1 },
    { name: "Secretarial work", count: 1 },
    { name: "Services other", count: 2 },
    { name: "Social, public and human services", count: 0 },
    { name: "Sports, cultural and social action", count: 0 },
    { name: "Telecom", count: 0 },
    { name: "Temporary work, recruitment", count: 1 },
    { name: "Textile, leather, shoes, clothing industry", count: 0 },
    { name: "Tourism, leisure activities", count: 0 },
    { name: "Transport, logistics, postal services", count: 0 },
  ];

  const jobTypes = [
    { name: "Permanent contract", count: 13 },
    { name: "Fixed-term contract", count: 2 },
    { name: "Freelance", count: 2 },
    { name: "Part-time work", count: 2 },
    { name: "Cooperative Education Program", count: 0 },
    { name: "Internship", count: 0 },
    { name: "Temporary work", count: 0 },
  ];

  const regions = [
    { name: "Ahafo", count: 0 },
    { name: "Ashanti", count: 0 },
    { name: "Bono", count: 0 },
    { name: "Bono East", count: 0 },
    { name: "Central", count: 0 },
    { name: "Eastern", count: 0 },
    { name: "Greater Accra", count: 0 },
    { name: "North East", count: 0 },
    { name: "Northern", count: 0 },
    { name: "Oti", count: 0 },
    { name: "Savannah", count: 0 },
    { name: "Upper East", count: 0 },
    { name: "Upper West", count: 0 },
    { name: "Volta", count: 0 },
    { name: "Western", count: 0 },
    { name: "Western North", count: 0 },
  ];

  const experienceLevels = [
    { name: "No experience", count: 2 },
    { name: "Less than 2 years", count: 6 },
    { name: "2 to 5 years", count: 7 },
    { name: "5 to 10 years", count: 10 },
    { name: "More than 10 years", count: 8 },
  ];

  // Get active filters based on current selections
  const getActiveFilters = () => {
    const filters: string[] = [];
    
    // Add search query if exists
    if (searchQuery.trim()) {
      filters.push(`Search: "${searchQuery}"`);
    }
    
    // Add checked categories
    jobCategories.forEach((category, index) => {
      if (checkedCategories[index]) {
        filters.push(category.name);
      }
    });
    
    // Add checked education levels
    educationLevels.forEach((level, index) => {
      if (checkedEducationLevels[index]) {
        filters.push(level.name);
      }
    });
    
    // Add checked industries
    industries.forEach((industry, index) => {
      if (checkedIndustries[index]) {
        filters.push(industry.name);
      }
    });
    
    // Add checked job types
    jobTypes.forEach((jobType, index) => {
      if (checkedJobTypes[index]) {
        filters.push(jobType.name);
      }
    });
    
    // Add checked regions
    regions.forEach((region, index) => {
      if (checkedRegions[index]) {
        filters.push(region.name);
      }
    });
    
    // Add checked experience levels
    experienceLevels.forEach((level, index) => {
      if (checkedExperienceLevels[index]) {
        filters.push(level.name);
      }
    });
    
    // Add company filter if selected
    if (selectedCompany) {
      filters.push(selectedCompany);
    }
    
    return filters;
  };

  // Get active filters based on current selections
  const activeFilters = getActiveFilters();

  // Filter jobs based on active filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by education level if any are selected
    const hasEducationFilter = Object.values(checkedEducationLevels).some(checked => checked);
    if (hasEducationFilter) {
      const selectedEducationLevels = educationLevels
        .filter((_, index) => checkedEducationLevels[index])
        .map(level => level.name);
      if (!selectedEducationLevels.includes(job.educationLevel)) {
        return false;
      }
    }
    
    // Filter by job type if any are selected
    const hasJobTypeFilter = Object.values(checkedJobTypes).some(checked => checked);
    if (hasJobTypeFilter) {
      const selectedJobTypes = jobTypes
        .filter((_, index) => checkedJobTypes[index])
        .map(jobType => jobType.name);
      if (!selectedJobTypes.includes(job.contractType)) {
        return false;
      }
    }
    
    // Filter by region if any are selected
    const hasRegionFilter = Object.values(checkedRegions).some(checked => checked);
    if (hasRegionFilter) {
      const selectedRegions = regions
        .filter((_, index) => checkedRegions[index])
        .map(region => region.name);
      if (!selectedRegions.includes(job.region)) {
        return false;
      }
    }
    
    // Filter by experience level if any are selected
    const hasExperienceFilter = Object.values(checkedExperienceLevels).some(checked => checked);
    if (hasExperienceFilter) {
      const selectedExperienceLevels = experienceLevels
        .filter((_, index) => checkedExperienceLevels[index])
        .map(level => level.name);
      if (!selectedExperienceLevels.includes(job.experienceLevel)) {
        return false;
      }
    }
    
    // Filter by company if selected
    if (selectedCompany && job.company !== selectedCompany) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.city.toLowerCase().includes(query) ||
        job.region.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      // Clear search query
      setSearchQuery("");
    } else {
      // Remove category filter
      const categoryIndex = jobCategories.findIndex(cat => cat.name === filter);
      if (categoryIndex !== -1) {
        setCheckedCategories(prev => ({
          ...prev,
          [categoryIndex]: false
        }));
        return;
      }
      
      // Remove education level filter
      const educationIndex = educationLevels.findIndex(level => level.name === filter);
      if (educationIndex !== -1) {
        setCheckedEducationLevels(prev => ({
          ...prev,
          [educationIndex]: false
        }));
        return;
      }
      
      // Remove industry filter
      const industryIndex = industries.findIndex(industry => industry.name === filter);
      if (industryIndex !== -1) {
        setCheckedIndustries(prev => ({
          ...prev,
          [industryIndex]: false
        }));
        return;
      }
      
      // Remove job type filter
      const jobTypeIndex = jobTypes.findIndex(jobType => jobType.name === filter);
      if (jobTypeIndex !== -1) {
        setCheckedJobTypes(prev => ({
          ...prev,
          [jobTypeIndex]: false
        }));
        return;
      }
      
      // Remove region filter
      const regionIndex = regions.findIndex(region => region.name === filter);
      if (regionIndex !== -1) {
        setCheckedRegions(prev => ({
          ...prev,
          [regionIndex]: false
        }));
        return;
      }
      
      // Remove experience level filter
      const experienceIndex = experienceLevels.findIndex(level => level.name === filter);
      if (experienceIndex !== -1) {
        setCheckedExperienceLevels(prev => ({
          ...prev,
          [experienceIndex]: false
        }));
        return;
      }
      
      // Remove company filter
      if (selectedCompany && filter === selectedCompany) {
        setSelectedCompany(null);
      }
    }
  };

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      <div className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-4 text-center leading-tight">
              Search Jobs
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100">
                      <Search className="w-5 h-5 text-slate-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search jobs by title, company, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
          </motion.div>

          {/* Separator Line */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="h-px bg-slate-300"></div>
          </div>

          {/* My Search Criteria - Outside Sidebar */}
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
              style={{
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
              }}
            >
              <h2 className="text-xl font-bold text-red-700 mb-3">
                My Search Criteria
              </h2>
              <div className="flex flex-wrap gap-3">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    className="bg-teal-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2.5 text-base font-medium"
                  >
                    <span>{filter}</span>
                    <X
                      className="w-5 h-5 cursor-pointer text-white"
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-96 flex-shrink-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:sticky lg:top-32"
              >

                {/* Filter Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="job-category" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Job category</span>
                    </AccordionTrigger>
                     <AccordionContent className="pt-2 pb-2">
                       <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                         {jobCategories.map((category, index) => {
                           const isChecked = checkedCategories[index] || false;
                           return (
                             <div 
                               key={index} 
                               className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition-colors"
                               onClick={() => {
                                 setCheckedCategories(prev => ({
                                   ...prev,
                                   [index]: !prev[index]
                                 }));
                               }}
                             >
                               <Checkbox
                                 id={`category-${index}`}
                                 checked={isChecked}
                                 onCheckedChange={(checked) => {
                                   setCheckedCategories(prev => ({
                                     ...prev,
                                     [index]: checked === true
                                   }));
                                 }}
                                 onClick={(e) => e.stopPropagation()}
                                 className="border-slate-300 pointer-events-none"
                               />
                               <label
                                 htmlFor={`category-${index}`}
                                 className="flex-1 text-base text-slate-700 cursor-pointer flex items-center gap-2 pointer-events-none"
                               >
                                 <span className={isChecked ? "font-semibold" : ""}>
                                   {category.name}
                                 </span>
                                 <span className="text-slate-500 text-sm">
                                   ({category.count})
                                 </span>
                               </label>
                             </div>
                           );
                         })}
                       </div>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="industries" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Industries</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2">
                      <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                        {industries.map((industry, index) => {
                          const isChecked = checkedIndustries[index] || false;
                          return (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition-colors"
                              onClick={() => {
                                setCheckedIndustries(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                            >
                              <Checkbox
                                id={`industry-${index}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setCheckedIndustries(prev => ({
                                    ...prev,
                                    [index]: checked === true
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="border-slate-300 pointer-events-none"
                              />
                              <label
                                htmlFor={`industry-${index}`}
                                className="flex-1 text-base text-slate-700 cursor-pointer flex items-center gap-2 pointer-events-none"
                              >
                                <span className={isChecked ? "font-semibold" : ""}>
                                  {industry.name}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  ({industry.count})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="education-level" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Education Level</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2">
                      <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                        {educationLevels.map((level, index) => {
                          const isChecked = checkedEducationLevels[index] || false;
                          return (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition-colors"
                              onClick={() => {
                                setCheckedEducationLevels(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                            >
                              <Checkbox
                                id={`education-${index}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setCheckedEducationLevels(prev => ({
                                    ...prev,
                                    [index]: checked === true
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="border-slate-300 pointer-events-none"
                              />
                              <label
                                htmlFor={`education-${index}`}
                                className="flex-1 text-base text-slate-700 cursor-pointer flex items-center gap-2 pointer-events-none"
                              >
                                <span className={isChecked ? "font-semibold" : ""}>
                                  {level.name}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  ({level.count})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="experience-level" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Experience level</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2">
                      <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                        {experienceLevels.map((level, index) => {
                          const isChecked = checkedExperienceLevels[index] || false;
                          return (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition-colors"
                              onClick={() => {
                                setCheckedExperienceLevels(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                            >
                              <Checkbox
                                id={`experience-${index}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setCheckedExperienceLevels(prev => ({
                                    ...prev,
                                    [index]: checked === true
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="border-slate-300 pointer-events-none"
                              />
                              <label
                                htmlFor={`experience-${index}`}
                                className="flex-1 text-base text-slate-700 cursor-pointer flex items-center gap-2 pointer-events-none"
                              >
                                <span className={isChecked ? "font-semibold" : ""}>
                                  {level.name}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  ({level.count})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="job-type" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Job type</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2">
                      <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                        {jobTypes.map((jobType, index) => {
                          const isChecked = checkedJobTypes[index] || false;
                          return (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition-colors"
                              onClick={() => {
                                setCheckedJobTypes(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                            >
                              <Checkbox
                                id={`jobType-${index}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setCheckedJobTypes(prev => ({
                                    ...prev,
                                    [index]: checked === true
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="border-slate-300 pointer-events-none"
                              />
                              <label
                                htmlFor={`jobType-${index}`}
                                className="flex-1 text-base text-slate-700 cursor-pointer flex items-center gap-2 pointer-events-none"
                              >
                                <span className={isChecked ? "font-semibold" : ""}>
                                  {jobType.name}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  ({jobType.count})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="regions" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Regions</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2">
                      <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                        {regions.map((region, index) => {
                          const isChecked = checkedRegions[index] || false;
                          return (
                            <div 
                              key={index} 
                              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1.5 rounded-lg transition-colors"
                              onClick={() => {
                                setCheckedRegions(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                            >
                              <Checkbox
                                id={`region-${index}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setCheckedRegions(prev => ({
                                    ...prev,
                                    [index]: checked === true
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="border-slate-300 pointer-events-none"
                              />
                              <label
                                htmlFor={`region-${index}`}
                                className="flex-1 text-base text-slate-700 cursor-pointer flex items-center gap-2 pointer-events-none"
                              >
                                <span className={isChecked ? "font-semibold" : ""}>
                                  {region.name}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  ({region.count})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {["All Jobs", "Management Jobs", "IT Jobs", "Sales Jobs"].map((filter) => {
                    const filterKey = filter.toLowerCase().replace(" ", "-");
                    return (
                      <Button
                        key={filter}
                        onClick={() => setSelectedFilter(filterKey)}
                        className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                          selectedFilter === filterKey || (filterKey === "all-jobs" && selectedFilter === "all")
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {filter}
                      </Button>
                    );
                  })}
                </div>

                {/* Job Count */}
                <div className="mb-6">
                  <p className="text-lg font-semibold text-slate-900">
                    {loading ? "Loading..." : `${filteredJobs.length} Job ads found`}
                  </p>
                </div>

                {/* Job Listings */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner />
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No jobs found matching your criteria.</p>
                  </div>
                ) : (
                <div className="space-y-6">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.3 } }}
                      className="group relative h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                      onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          {/* Company Logo */}
                          <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm mx-auto sm:mx-0">
                            {job.companyLogo ? (
                              <img 
                                src={job.companyLogo} 
                                alt={job.company}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-slate-400" />
                            )}
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-3">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-tight mb-1">
                                {job.title}
                              </h3>
                              <p 
                                className="text-sm font-medium text-slate-600 mb-1.5 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/companies/${encodeURIComponent(job.company)}`);
                                }}
                              >
                                {job.company}
                              </p>
                            </div>

                            <p className="text-sm text-slate-700 mb-4 line-clamp-2 leading-relaxed">
                              {job.description}{" "}
                              <span className="text-blue-600 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1">
                                +plus
                                <TrendingUp className="w-3 h-3" />
                              </span>
                            </p>

                            {/* Job Info Table Card */}
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-0.5">Education level</p>
                                    <p className="text-sm text-slate-900 font-semibold">{job.educationLevel}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-0.5">Experience level</p>
                                    <p className="text-sm text-slate-900 font-semibold">{job.experienceLevel}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-0.5">Proposed contract</p>
                                    <p className="text-sm text-slate-900 font-semibold">{job.contractType}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-500 mb-0.5">Region of</p>
                                    <p className="text-sm text-slate-900 font-semibold">{job.region}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Key Skills */}
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                Key Skills
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-2 border-t border-slate-200">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Posted: {job.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllJobs;

