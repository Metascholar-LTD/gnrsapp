import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  identifier: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all-jobs");
  const [checkedCategories, setCheckedCategories] = useState<Record<number, boolean>>({
    6: true, // Marketing, communication
    11: true, // Sales
    13: true, // Services
    15: true, // Tourism, hotel business and catering
  });

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
    
    return filters;
  };

  const activeFilters = getActiveFilters();

  // Mock job data
  const jobs: Job[] = [
    {
      id: "1",
      title: "Accounts and Finance Analyst",
      identifier: "3MM",
      company: "Finance Corp",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&auto=format",
      description: "We are looking for an Accounts and Finance Analyst to join our client's team. The ideal candidate will be responsible for financial analysis, budgeting, and reporting.",
      educationLevel: "Bachelor",
      experienceLevel: "5 to 10 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "East Legon",
      skills: ["Accounting", "Budgeting", "Controlling", "Finance", "Financial Statements", "Internal Control", "Investment", "Risk Management"],
      date: "19.11.2025",
    },
    {
      id: "2",
      title: "Business Information Analyst",
      identifier: "3MM",
      company: "Tech Solutions",
      companyLogo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&auto=format",
      description: "We are looking for a Business Information Analyst to join our client's team. The role involves analyzing business data and providing insights to support decision-making.",
      educationLevel: "Bachelor",
      experienceLevel: "2 to 5 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "East Legon",
      skills: ["Communication", "Marketing", "Marketing Communication"],
      date: "19.11.2025",
    },
    {
      id: "3",
      title: "Business Consultant",
      identifier: "3MM",
      company: "Consulting Group",
      companyLogo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&auto=format",
      description: "We are looking for an experienced Business Consultant to provide strategic advice and solutions to our clients.",
      educationLevel: "Master",
      experienceLevel: "5 to 10 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "East Legon",
      skills: ["Strategy", "Consulting", "Business Analysis", "Project Management"],
      date: "19.11.2025",
    },
  ];

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
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4 text-center">
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
            <aside className="w-full lg:w-96 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sticky top-32"
              >

                {/* Filter Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="job-category" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Job category</span>
                    </AccordionTrigger>
                     <AccordionContent className="pt-4">
                       <div className="space-y-2 max-h-[400px] overflow-y-auto">
                         {jobCategories.map((category, index) => {
                           const isChecked = checkedCategories[index] || false;
                           return (
                             <div 
                               key={index} 
                               className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
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
                    <AccordionContent className="pt-4">
                      <p className="text-sm text-slate-500">Filter by industry</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="education-level" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Education Level</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-sm text-slate-500">Filter by education level</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="experience-level" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Experience level</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-sm text-slate-500">Filter by experience level</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="job-type" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Job type</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-sm text-slate-500">Filter by job type</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="regions" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Regions</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-sm text-slate-500">Filter by region</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="spoken-language" className="border-b-0 mb-1.5">
                    <AccordionTrigger className="bg-red-50 hover:bg-red-100 rounded-lg px-4 py-3 text-slate-900 font-semibold data-[state=closed]:bg-red-50">
                      <span>Spoken Language</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-sm text-slate-500">Filter by language</p>
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
                    {jobs.length} Job ads found
                  </p>
                </div>

                {/* Job Listings */}
                <div className="space-y-5">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.3 } }}
                      className="group relative h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                    >
                      <div className="p-5">
                        <div className="flex gap-4">
                          {/* Company Logo */}
                          <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm">
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
                              <p className="text-sm font-medium text-slate-600 mb-1.5">
                                {job.company}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{job.region}</span>
                              </div>
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
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
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
                              <div className="flex flex-wrap gap-1.5">
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

