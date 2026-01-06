import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScholarshipCard } from "@/components/ui/scholarship-card";
import { fetchAllScholarships, getDaysUntilDeadline, type Scholarship } from "@/utils/scholarshipUtils";
import { 
  Search, 
  Filter,
  X,
  CheckCircle2,
  DollarSign,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  BookOpen,
  Globe,
  Clock,
  FileText,
  Sparkles,
  Globe2,
  Briefcase
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, useInView } from "framer-motion";
import { DicedHeroSection } from "@/components/ui/diced-hero-section";

// Scholarship interface is imported from utils

interface Testimonial {
  id: string;
  name: string;
  university: string;
  program: string;
  scholarship: string;
  imageUrl?: string;
  rating: number;
  comment: string;
}

const ScholarshipHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // Statistics refs for counter animation
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [counters, setCounters] = useState({ scholarships: 0, students: 0, awarded: 0, countries: 0 });

  // Fetch scholarships from Supabase
  useEffect(() => {
    const loadScholarships = async () => {
      setLoading(true);
      try {
        const data = await fetchAllScholarships();
        setScholarships(data);
        
        // Update counters
        setCounters({
          scholarships: data.length,
          students: Math.floor(data.length * 150), // Estimated
          awarded: Math.floor(data.length * 200), // Estimated
          countries: new Set(data.map(s => s.location)).size
        });
      } catch (error) {
        console.error("Error loading scholarships:", error);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();
  }, []);

  // Get unique values for filters
  const categories = Array.from(new Set(scholarships.map(s => s.category))).sort();
  const levels = Array.from(new Set(scholarships.map(s => s.level))).sort();
  const locations = Array.from(new Set(scholarships.map(s => s.location))).sort();
  const sources = Array.from(new Set(scholarships.map(s => s.source).filter(Boolean))).sort();
  const sourceNames: Record<string, string> = {
    "mtn": "MTN Ghana Foundation",
    "getfund": "Ghana Education Trust Fund",
    "gnpc": "GNPC Foundation",
    "other-local": "Ghana Scholarships Secretariat",
    "field-based": "International & Field-Based"
  };

  // Filtering logic
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = 
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || scholarship.category === selectedCategory;
    const matchesLevel = !selectedLevel || scholarship.level === selectedLevel;
    const matchesLocation = !selectedLocation || scholarship.location === selectedLocation;
    const matchesSource = !selectedSource || scholarship.source === selectedSource;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesLocation && matchesSource;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSelectedLocation(null);
    setSelectedSource(null);
  };

  const hasActiveFilters = selectedCategory || selectedLevel || selectedLocation || selectedSource;

  // Counter animation
  useEffect(() => {
    if (isStatsInView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      const animateCounter = (key: keyof typeof counters, target: number) => {
        let current = 0;
        const increment = target / steps;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, interval);
      };

      animateCounter('scholarships', scholarships.length);
      animateCounter('students', 5000);
      animateCounter('awarded', 1200);
      animateCounter('countries', 45);
    }
  }, [isStatsInView]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      }
    },
  };

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      {/* Hero Section with DicedHeroSection */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100"
        style={{ 
          paddingTop: '140px',
          paddingBottom: '100px',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <DicedHeroSection
            topText="Global Scholarship Bank"
            mainText="All Scholarships in One Place"
            subMainText="Comprehensive collection of all scholarship opportunities from MTN, GETFund, GNPC, Ghana Scholarships Secretariat, and international programs. Find the perfect funding solution for your academic journey."
            buttonText="Browse All Scholarships"
            slides={[
              {
                title: "International Students",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
              },
              {
                title: "Graduate Programs",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg"
              },
              {
                title: "Research Opportunities",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
              },
              {
                title: "Global Education",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
              },
            ]}
            onMainButtonClick={() => {
              const element = document.getElementById('scholarships-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            onGridImageHover={(index) => {
              console.log(`Scholarship image ${index} hovered`);
            }}
            onGridImageClick={(index) => {
              const element = document.getElementById('scholarships-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            topTextStyle={{ 
              color: "var(--diced-hero-section-top-text)",
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}
            mainTextStyle={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              gradient: "linear-gradient(135deg, var(--diced-hero-section-main-gradient-from), var(--diced-hero-section-main-gradient-to))",
            }}
            subMainTextStyle={{ 
              color: "var(--diced-hero-section-sub-text)",
              fontSize: "1.125rem",
              lineHeight: 1.8,
              maxWidth: "600px"
            }}
            buttonStyle={{
              backgroundColor: "#f1f3f5",
              color: "#1e293b",
              borderRadius: "0.75rem",
              hoverColor: "#e9ecef",
              hoverForeground: "#0f172a",
            }}
            separatorColor="var(--diced-hero-section-separator)"
            maxContentWidth="1400px"
            mobileBreakpoint={1024}
            fontFamily="'Source Sans Pro', system-ui, sans-serif"
            backgroundColor="transparent"
          />
        </div>
      </section>

      {/* Statistics Section - Inspired by coffee-master counter section */}
      <section 
        ref={statsRef}
        className="py-20"
        style={{ backgroundColor: '#243137' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#bd9f67] mb-2">
                {counters.scholarships}+
              </h1>
              <p className="text-white/90 text-lg font-medium">Active Scholarships</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#bd9f67] mb-2">
                {counters.students.toLocaleString()}+
              </h1>
              <p className="text-white/90 text-lg font-medium">Students Helped</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#bd9f67] mb-2">
                {counters.awarded.toLocaleString()}+
              </h1>
              <p className="text-white/90 text-lg font-medium">Scholarships Awarded</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#bd9f67] mb-2">
                {counters.countries}+
              </h1>
              <p className="text-white/90 text-lg font-medium">Countries</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Section - Inspired by coffee-master menu section */}
      <section id="scholarships-section" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Global Scholarship Bank
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                All scholarships from all pages organized by provider. Each scholarship maintains its original card design.
              </p>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50">
                    <Search className="w-4 h-4 text-slate-500" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-slate-400"
                  />
                  <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline"
                        className="h-10 px-4 rounded-xl border-slate-200 hover:bg-slate-50"
                      >
                        <Filter className="w-4 h-4 mr-1.5" />
                        <span className="text-sm">Filters</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">Filter Scholarships</h3>
                          {hasActiveFilters && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="h-8 text-xs"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                            <Select
                              value={selectedCategory ?? ""}
                              onValueChange={(value) => setSelectedCategory(value || null)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Level</label>
                            <Select
                              value={selectedLevel ?? ""}
                              onValueChange={(value) => setSelectedLevel(value || null)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Levels" />
                              </SelectTrigger>
                              <SelectContent>
                                {levels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
                            <Select
                              value={selectedLocation ?? ""}
                              onValueChange={(value) => setSelectedLocation(value || null)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Locations" />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.map((loc) => (
                                  <SelectItem key={loc} value={loc}>
                                    {loc}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Provider/Source</label>
                            <Select
                              value={selectedSource ?? ""}
                              onValueChange={(value) => setSelectedSource(value || null)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Providers" />
                              </SelectTrigger>
                              <SelectContent>
                                {sources.map((src) => (
                                  <SelectItem key={src} value={src}>
                                    {sourceNames[src] || src}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-3 items-center"
              >
                <span className="text-sm font-medium text-slate-600">Active Filters:</span>
                
                {selectedCategory && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedCategory}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedCategory(null)}
                    />
                  </Badge>
                )}
                
                {selectedLevel && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedLevel}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedLevel(null)}
                    />
                  </Badge>
                )}
                
                {selectedLocation && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedLocation}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedLocation(null)}
                    />
                  </Badge>
                )}
                
                {selectedSource && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {sourceNames[selectedSource] || selectedSource}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedSource(null)}
                    />
                  </Badge>
                )}

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-slate-600"
                >
                  Clear All
                </Button>
              </motion.div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd9f67]"></div>
              <p className="mt-4 text-slate-600">Loading scholarships...</p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-slate-100">
                <Award className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-700">
                No scholarships found
              </h3>
              <p className="text-lg mb-6 text-slate-500">
                Try adjusting your filters or search query
              </p>
              <Button 
                onClick={clearAllFilters}
                className="bg-slate-700 hover:bg-slate-800 text-white"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {/* Group scholarships by source */}
              {["mtn", "getfund", "gnpc", "other-local", "field-based"].map((source) => {
                const sourceScholarships = filteredScholarships.filter(s => s.source === source);
                if (sourceScholarships.length === 0) return null;

                const sourceNames: Record<string, string> = {
                  "mtn": "MTN Ghana Foundation",
                  "getfund": "Ghana Education Trust Fund (GETFund)",
                  "gnpc": "GNPC Foundation",
                  "other-local": "Ghana Scholarships Secretariat",
                  "field-based": "International & Field-Based Scholarships"
                };

                return (
                  <motion.div
                    key={source}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                        {source === "mtn" && <Briefcase className="h-6 w-6 text-yellow-500" />}
                        {source === "getfund" && <GraduationCap className="h-6 w-6 text-blue-600" />}
                        {source === "gnpc" && <Award className="h-6 w-6 text-emerald-600" />}
                        {source === "other-local" && <Globe2 className="h-6 w-6 text-emerald-500" />}
                        {source === "field-based" && <Globe className="h-6 w-6 text-slate-600" />}
                        {sourceNames[source]}
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    </div>

                    {/* Render cards - Compact design with images, matching questions page style */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                      {sourceScholarships.map((scholarship) => {
                        const isMTN = scholarship.source === "mtn";
                        const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                        const isDeadlineSoon = daysLeft > 0 && daysLeft <= 30;

                        return (
                          <motion.div
                            key={scholarship.id}
                            variants={cardVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="group cursor-pointer"
                            onClick={() => {
                              if (scholarship.route) {
                                window.location.href = scholarship.route;
                              } else if (scholarship.source === "mtn") {
                                window.location.href = "/scholarship/mtn-bright-scholarship";
                              } else {
                                window.location.href = `/scholarship/${scholarship.id}`;
                              }
                            }}
                          >
                            {/* Compact Card Style - Matching questions page design */}
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
                              {scholarship.imageUrl && (
                                <div className="relative h-32 overflow-hidden bg-slate-100">
                                  <motion.img
                                    src={scholarship.imageUrl}
                                    alt={scholarship.title}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                  
                                  {/* Badges on Image */}
                                  <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                                    {scholarship.verified && (
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
                                      {scholarship.category}
                                    </Badge>
                                  </div>
                                </div>
                              )}

                              {/* Card Content */}
                              <div className="flex flex-col flex-1 p-4">
                                {/* Title */}
                                <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-[#bd9f67] transition-colors">
                                  {scholarship.title}
                                </h3>

                                {/* Provider */}
                                <p className="text-xs text-slate-600 mb-3 font-medium">
                                  {scholarship.provider}
                                </p>

                                {/* Info Icons */}
                                <div className="space-y-1.5 mb-3 flex-1">
                                  <div className="flex items-center gap-2 text-xs text-slate-700">
                                    <DollarSign className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                                    <span className="font-semibold truncate">
                                      {scholarship.amount} {scholarship.currency !== scholarship.amount && scholarship.currency}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{scholarship.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{scholarship.level}</span>
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
                                      if (scholarship.route) {
                                        window.location.href = scholarship.route;
                                      } else if (scholarship.source === "mtn") {
                                        window.location.href = "/scholarship/mtn-bright-scholarship";
                                      } else {
                                        window.location.href = `/scholarship/${scholarship.id}`;
                                      }
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
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section - Inspired by coffee-master review section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                Success Stories
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Hear from students who have successfully secured scholarships through our platform
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[].map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.imageUrl && (
                    <img 
                      src={testimonial.imageUrl} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 mb-1">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{testimonial.university}</p>
                    <p className="text-sm text-slate-500">{testimonial.program}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Badge variant="outline" className="text-xs">
                    {testimonial.scholarship}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ScholarshipHub;

