import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText
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

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  currency: string;
  category: string;
  deadline: string;
  location: string;
  level: string; // Undergraduate, Graduate, PhD
  description: string;
  requirements: string[];
  verified: boolean;
  imageUrl?: string;
  featured: boolean;
}

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
  const [showFilters, setShowFilters] = useState(false);

  // Statistics refs for counter animation
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [counters, setCounters] = useState({ scholarships: 0, students: 0, awarded: 0, countries: 0 });

  // Mock scholarships data
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
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
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
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg"
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
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
    },
    { 
      id: "4", 
      title: "Fulbright Foreign Student Program", 
      provider: "US Department of State",
      amount: "Full Coverage",
      currency: "USD",
      category: "Merit-Based",
      deadline: "2024-09-30",
      location: "United States",
      level: "Graduate",
      description: "Fully-funded scholarships for graduate study in the United States.",
      requirements: ["Bachelor's degree", "English proficiency", "Academic excellence"],
      verified: true,
      featured: false,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
    },
    { 
      id: "5", 
      title: "DAAD Scholarships", 
      provider: "German Academic Exchange Service",
      amount: "850",
      currency: "EUR",
      category: "Merit-Based",
      deadline: "2024-10-15",
      location: "Germany",
      level: "Graduate",
      description: "Monthly stipend and tuition coverage for Master's and PhD programs in Germany.",
      requirements: ["Bachelor's degree", "Academic excellence", "Research proposal"],
      verified: true,
      featured: false,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
    },
    { 
      id: "6", 
      title: "Commonwealth Scholarships", 
      provider: "Commonwealth Scholarship Commission",
      amount: "Full Coverage",
      currency: "GBP",
      category: "Merit-Based",
      deadline: "2024-12-01",
      location: "United Kingdom",
      level: "Graduate",
      description: "Fully-funded scholarships for Master's and PhD programs in the UK.",
      requirements: ["Commonwealth citizen", "Bachelor's degree", "Academic excellence"],
      verified: true,
      featured: false,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg"
    },
    { 
      id: "7", 
      title: "Erasmus Mundus Scholarships", 
      provider: "European Union",
      amount: "Full Coverage",
      currency: "EUR",
      category: "Merit-Based",
      deadline: "2024-11-20",
      location: "Europe",
      level: "Graduate",
      description: "Joint Master's and PhD programs across multiple European universities.",
      requirements: ["Bachelor's degree", "Academic excellence", "Language proficiency"],
      verified: true,
      featured: false,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
    },
    { 
      id: "8", 
      title: "Agence Universitaire de la Francophonie", 
      provider: "AUF",
      amount: "Full Coverage",
      currency: "EUR",
      category: "Merit-Based",
      deadline: "2024-10-10",
      location: "France",
      level: "Graduate",
      description: "Scholarships for French-speaking students pursuing higher education.",
      requirements: ["French proficiency", "Bachelor's degree", "Academic excellence"],
      verified: true,
      featured: false,
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Ama Osei",
      university: "University of Ghana",
      program: "Master of Public Health",
      scholarship: "Chevening Scholarship",
      rating: 5,
      comment: "The Chevening Scholarship transformed my life. I'm now pursuing my dream Master's degree in the UK. The application process was straightforward, and the support was incredible.",
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
    },
    {
      id: "2",
      name: "Kwame Mensah",
      university: "KNUST",
      program: "PhD in Engineering",
      scholarship: "DAAD Scholarship",
      rating: 5,
      comment: "Thanks to the DAAD scholarship, I'm conducting cutting-edge research in Germany. The monthly stipend covers all my expenses, and I'm gaining invaluable international experience.",
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
    },
  ];

  // Get unique values for filters
  const categories = Array.from(new Set(scholarships.map(s => s.category))).sort();
  const levels = Array.from(new Set(scholarships.map(s => s.level))).sort();
  const locations = Array.from(new Set(scholarships.map(s => s.location))).sort();

  // Filtering logic
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = 
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || scholarship.category === selectedCategory;
    const matchesLevel = !selectedLevel || scholarship.level === selectedLevel;
    const matchesLocation = !selectedLocation || scholarship.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesLocation;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSelectedLocation(null);
  };

  const hasActiveFilters = selectedCategory || selectedLevel || selectedLocation;

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

      animateCounter('scholarships', 250);
      animateCounter('students', 5000);
      animateCounter('awarded', 1200);
      animateCounter('countries', 45);
    }
  }, [isStatsInView]);

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
            topText="Discover"
            mainText="Scholarship Excellence"
            subMainText="Unlock your potential with access to thousands of prestigious scholarship opportunities from around the world. From fully-funded Master's programs to undergraduate grants, discover the perfect funding solution for your academic journey and transform your educational dreams into reality."
            buttonText="Explore Scholarships"
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
                Featured Scholarship Opportunities
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Discover the most prestigious and comprehensive scholarship programs available for students
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
                              value={selectedCategory || undefined}
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
                              value={selectedLevel || undefined}
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
                              value={selectedLocation || undefined}
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

          {/* Scholarships Grid */}
          {filteredScholarships.length === 0 ? (
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredScholarships.map((scholarship) => (
                <motion.div
                  key={scholarship.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.5 } }}
                  className="group"
                >
                  <div 
                    className="relative h-full overflow-hidden flex flex-col scholarship-card-alt group"
                    style={{
                      background: '#243137',
                      borderRadius: '10px',
                      transition: 'all 0.5s ease-in-out',
                    }}
                  >
                    {/* Animated Border */}
                    <div 
                      className="absolute inset-0 border-2 border-[#bd9f67] opacity-0 group-hover:opacity-100 group-hover:inset-[15px] transition-all duration-500 ease-in-out border-rotate"
                    />

                    {/* Image Section with Title Overlay */}
                    {scholarship.imageUrl && (
                      <div className="relative h-56 overflow-hidden">
                        <motion.img
                          src={scholarship.imageUrl}
                          alt={scholarship.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#243137] via-[#243137]/80 to-[#243137]/40"></div>
                        
                        {/* Title and Provider Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                          <h3 className="text-lg font-bold mb-1 text-white line-clamp-2 group-hover:text-[#bd9f67] transition-colors duration-500 drop-shadow-lg">
                            {scholarship.title}
                          </h3>
                          <p className="text-xs text-[#bd9f67] font-medium drop-shadow-md">{scholarship.provider}</p>
                        </div>
                        
                        {scholarship.verified && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="bg-[#243137]/90 backdrop-blur-sm rounded-full p-1 shadow-lg border border-[#bd9f67]">
                              <CheckCircle2 className="w-5 h-5 text-[#bd9f67]" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="px-5 pt-4 pb-5 flex flex-col flex-1 relative z-10">

                      <div className="space-y-1.5 mb-3 flex-1">
                        <div className="flex items-center gap-3 text-sm text-[#bd9f67]/90">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 text-[#bd9f67]" />
                            <span className="font-semibold text-white text-xs">
                              {scholarship.amount} {scholarship.currency !== scholarship.amount && scholarship.currency}
                            </span>
                          </div>
                          <span className="text-[#bd9f67]/60">•</span>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#bd9f67]" />
                            <span className="text-white text-xs">{scholarship.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#bd9f67]/90">
                          <GraduationCap className="w-3.5 h-3.5 text-[#bd9f67]" />
                          <span className="text-white">{scholarship.level}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#bd9f67]/90">
                          <Calendar className="w-3.5 h-3.5 text-[#bd9f67]" />
                          <span className="text-white">Deadline: {formatDate(scholarship.deadline)}</span>
                        </div>
                        {getDaysUntilDeadline(scholarship.deadline) > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-3.5 h-3.5 text-[#bd9f67]" />
                            <span className="text-[#bd9f67] font-semibold">
                              {getDaysUntilDeadline(scholarship.deadline)} days left
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#bd9f67]/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs bg-[#243137] border-[#bd9f67] text-[#bd9f67] py-0.5 px-2">
                            {scholarship.category}
                          </Badge>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="w-full bg-[#bd9f67] hover:bg-[#bd9f67]/90 text-[#243137] font-semibold shadow-md hover:shadow-lg transition-all group-hover:scale-105 h-9 text-xs"
                          onClick={() => window.location.href = `/scholarship/${scholarship.id}`}
                        >
                          View Details
                          <ArrowRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Text Animation */}
                    <span 
                      className="absolute left-1/2 bottom-3 transform -translate-x-1/2 text-[6px] uppercase text-[#bd9f67] bg-[#243137] px-2 opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        letterSpacing: '7px',
                      }}
                    >
                      {scholarship.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
            {testimonials.map((testimonial) => (
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

