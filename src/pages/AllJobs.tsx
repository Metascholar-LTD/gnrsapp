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
  job_category?: string;
  industry?: string;
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
  const [checkedCategories, setCheckedCategories] = useState<Record<number, boolean>>({});
  const [checkedEducationLevels, setCheckedEducationLevels] = useState<Record<number, boolean>>({});
  const [checkedIndustries, setCheckedIndustries] = useState<Record<number, boolean>>({});
  const [checkedJobTypes, setCheckedJobTypes] = useState<Record<number, boolean>>({});
  const [checkedRegions, setCheckedRegions] = useState<Record<number, boolean>>({});
  const [checkedExperienceLevels, setCheckedExperienceLevels] = useState<Record<number, boolean>>({});

  // Dynamic filter options - will be calculated from jobs data
  const [jobCategories, setJobCategories] = useState<Array<{ name: string; count: number; checked: boolean }>>([]);
  const [educationLevels, setEducationLevels] = useState<Array<{ name: string; count: number }>>([]);
  const [industries, setIndustries] = useState<Array<{ name: string; count: number }>>([]);
  const [jobTypes, setJobTypes] = useState<Array<{ name: string; count: number }>>([]);
  const [regions, setRegions] = useState<Array<{ name: string; count: number }>>([]);
  const [experienceLevels, setExperienceLevels] = useState<Array<{ name: string; count: number }>>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  // Calculate filter counts from jobs data
  useEffect(() => {
    if (jobs.length === 0) {
      setJobCategories([]);
      setEducationLevels([]);
      setIndustries([]);
      setJobTypes([]);
      setRegions([]);
      setExperienceLevels([]);
      return;
    }

    // Get unique categories from Supabase - fetch distinct job_category values
    const uniqueCategories = Array.from(new Set(jobs.map(j => j.job_category).filter(Boolean)));
    const categoryList = uniqueCategories.map(cat => ({
      name: cat as string,
      count: jobs.filter(j => j.job_category === cat).length,
      checked: false
    }));

    // Calculate education level counts
    const educationCounts: Record<string, number> = {};
    jobs.forEach(job => {
      educationCounts[job.educationLevel] = (educationCounts[job.educationLevel] || 0) + 1;
    });
    const educationList = Object.keys(educationCounts).map(level => ({
      name: level,
      count: educationCounts[level]
    }));

    // Calculate industry counts
    const industryCounts: Record<string, number> = {};
    jobs.forEach(job => {
      if (job.industry) {
        industryCounts[job.industry] = (industryCounts[job.industry] || 0) + 1;
      }
    });
    const industryList = Object.keys(industryCounts).map(industry => ({
      name: industry,
      count: industryCounts[industry]
    }));

    // Calculate job type counts
    const jobTypeCounts: Record<string, number> = {};
    jobs.forEach(job => {
      jobTypeCounts[job.contractType] = (jobTypeCounts[job.contractType] || 0) + 1;
    });
    const jobTypeList = Object.keys(jobTypeCounts).map(type => ({
      name: type,
      count: jobTypeCounts[type]
    }));

    // Calculate region counts
    const regionCounts: Record<string, number> = {};
    jobs.forEach(job => {
      regionCounts[job.region] = (regionCounts[job.region] || 0) + 1;
    });
    const regionList = Object.keys(regionCounts).map(region => ({
      name: region,
      count: regionCounts[region]
    }));

    // Calculate experience level counts
    const experienceCounts: Record<string, number> = {};
    jobs.forEach(job => {
      experienceCounts[job.experienceLevel] = (experienceCounts[job.experienceLevel] || 0) + 1;
    });
    const experienceList = Object.keys(experienceCounts).map(level => ({
      name: level,
      count: experienceCounts[level]
    }));

    setJobCategories(categoryList);
    setEducationLevels(educationList);
    setIndustries(industryList);
    setJobTypes(jobTypeList);
    setRegions(regionList);
    setExperienceLevels(experienceList);
  }, [jobs]);

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
          job_category: item.job_category,
          industry: item.industry,
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
    // Filter by tab selection (All Jobs, Management Jobs, IT Jobs, Sales Jobs)
    if (selectedFilter && selectedFilter !== "all-jobs" && selectedFilter !== "all") {
      const jobCategoryLower = (job.job_category || "").toLowerCase();
      
      if (selectedFilter === "management-jobs") {
        // Match "Management" in job_category
        if (!jobCategoryLower.includes("management")) {
          return false;
        }
      } else if (selectedFilter === "it-jobs") {
        // Match "IT" or "new technologies" in job_category
        if (!jobCategoryLower.includes("it") && !jobCategoryLower.includes("new technologies")) {
          return false;
        }
      } else if (selectedFilter === "sales-jobs") {
        // Match "Sales" in job_category
        if (!jobCategoryLower.includes("sales")) {
          return false;
        }
      }
    }
    
    // Filter by job category if any are selected
    const hasCategoryFilter = Object.values(checkedCategories).some(checked => checked);
    if (hasCategoryFilter && jobCategories.length > 0) {
      const selectedCategories = jobCategories
        .filter((_, index) => checkedCategories[index])
        .map(cat => cat.name);
      if (job.job_category && !selectedCategories.includes(job.job_category)) {
        return false;
      }
    }
    
    // Filter by education level if any are selected
    const hasEducationFilter = Object.values(checkedEducationLevels).some(checked => checked);
    if (hasEducationFilter && educationLevels.length > 0) {
      const selectedEducationLevels = educationLevels
        .filter((_, index) => checkedEducationLevels[index])
        .map(level => level.name);
      if (!selectedEducationLevels.includes(job.educationLevel)) {
        return false;
      }
    }
    
    // Filter by industry if any are selected
    const hasIndustryFilter = Object.values(checkedIndustries).some(checked => checked);
    if (hasIndustryFilter && industries.length > 0) {
      const selectedIndustries = industries
        .filter((_, index) => checkedIndustries[index])
        .map(industry => industry.name);
      if (job.industry && !selectedIndustries.includes(job.industry)) {
        return false;
      }
    }
    
    // Filter by job type if any are selected
    const hasJobTypeFilter = Object.values(checkedJobTypes).some(checked => checked);
    if (hasJobTypeFilter && jobTypes.length > 0) {
      const selectedJobTypes = jobTypes
        .filter((_, index) => checkedJobTypes[index])
        .map(jobType => jobType.name);
      if (!selectedJobTypes.includes(job.contractType)) {
        return false;
      }
    }
    
    // Filter by region if any are selected
    const hasRegionFilter = Object.values(checkedRegions).some(checked => checked);
    if (hasRegionFilter && regions.length > 0) {
      const selectedRegions = regions
        .filter((_, index) => checkedRegions[index])
        .map(region => region.name);
      if (!selectedRegions.includes(job.region)) {
        return false;
      }
    }
    
    // Filter by experience level if any are selected
    const hasExperienceFilter = Object.values(checkedExperienceLevels).some(checked => checked);
    if (hasExperienceFilter && experienceLevels.length > 0) {
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
      if (jobCategories.length > 0) {
        const categoryIndex = jobCategories.findIndex(cat => cat.name === filter);
        if (categoryIndex !== -1) {
          setCheckedCategories(prev => ({
            ...prev,
            [categoryIndex]: false
          }));
          return;
        }
      }
      
      // Remove education level filter
      if (educationLevels.length > 0) {
        const educationIndex = educationLevels.findIndex(level => level.name === filter);
        if (educationIndex !== -1) {
          setCheckedEducationLevels(prev => ({
            ...prev,
            [educationIndex]: false
          }));
          return;
        }
      }
      
      // Remove industry filter
      if (industries.length > 0) {
        const industryIndex = industries.findIndex(industry => industry.name === filter);
        if (industryIndex !== -1) {
          setCheckedIndustries(prev => ({
            ...prev,
            [industryIndex]: false
          }));
          return;
        }
      }
      
      // Remove job type filter
      if (jobTypes.length > 0) {
        const jobTypeIndex = jobTypes.findIndex(jobType => jobType.name === filter);
        if (jobTypeIndex !== -1) {
          setCheckedJobTypes(prev => ({
            ...prev,
            [jobTypeIndex]: false
          }));
          return;
        }
      }
      
      // Remove region filter
      if (regions.length > 0) {
        const regionIndex = regions.findIndex(region => region.name === filter);
        if (regionIndex !== -1) {
          setCheckedRegions(prev => ({
            ...prev,
            [regionIndex]: false
          }));
          return;
        }
      }
      
      // Remove experience level filter
      if (experienceLevels.length > 0) {
        const experienceIndex = experienceLevels.findIndex(level => level.name === filter);
        if (experienceIndex !== -1) {
          setCheckedExperienceLevels(prev => ({
            ...prev,
            [experienceIndex]: false
          }));
          return;
        }
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
                    const filterKey = filter.toLowerCase().replace(/\s+/g, "-");
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

