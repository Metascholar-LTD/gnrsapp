import { useState } from "react";
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
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  ShieldCheck,
  TrendingUp
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
import { motion } from "framer-motion";
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
  level: string;
  description: string;
  requirements: string[];
  verified: boolean;
  imageUrl?: string;
  featured: boolean;
  fieldOfStudy?: string[];
}

const FieldBasedScholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Available fields of study
  const availableFields = [
    "Engineering & Technology",
    "Health Sciences & Medicine",
    "Business & Economics",
    "Arts & Humanities",
    "Agriculture & Environmental Sciences",
    "Education",
    "Social Sciences",
    "Natural Sciences",
    "Computer Science & IT",
    "Law & Legal Studies",
    "All Fields"
  ];

  // Mock scholarships data with fieldOfStudy
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
      fieldOfStudy: ["Engineering & Technology", "Health Sciences & Medicine", "Business & Economics", "Agriculture & Environmental Sciences", "Education", "Social Sciences"],
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
      fieldOfStudy: ["All Fields"],
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
      fieldOfStudy: ["Business & Economics", "Social Sciences", "Arts & Humanities", "Law & Legal Studies"],
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
      fieldOfStudy: ["All Fields"],
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
      fieldOfStudy: ["Engineering & Technology", "Natural Sciences", "Computer Science & IT"],
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
      fieldOfStudy: ["Health Sciences & Medicine", "Education", "Social Sciences"],
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
      fieldOfStudy: ["Engineering & Technology", "Business & Economics", "Arts & Humanities"],
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
      fieldOfStudy: ["All Fields"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
    },
    { 
      id: "9", 
      title: "Rhodes Scholarships", 
      provider: "Rhodes Trust",
      amount: "Full Coverage",
      currency: "GBP",
      category: "Merit-Based",
      deadline: "2024-10-15",
      location: "United Kingdom",
      level: "Graduate",
      description: "World's oldest and most prestigious international scholarship program.",
      requirements: ["Academic excellence", "Leadership potential", "Service to others"],
      verified: true,
      featured: true,
      fieldOfStudy: ["All Fields"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
    },
    { 
      id: "10", 
      title: "Gates Cambridge Scholarships", 
      provider: "Bill & Melinda Gates Foundation",
      amount: "Full Coverage",
      currency: "GBP",
      category: "Merit-Based",
      deadline: "2024-10-11",
      location: "United Kingdom",
      level: "Graduate",
      description: "Full-cost scholarships for outstanding applicants from outside the UK.",
      requirements: ["Academic excellence", "Leadership potential", "Commitment to improving lives"],
      verified: true,
      featured: true,
      fieldOfStudy: ["All Fields"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg"
    },
    { 
      id: "11", 
      title: "MIT-Africa Program", 
      provider: "Massachusetts Institute of Technology",
      amount: "Full Tuition",
      currency: "USD",
      category: "Merit-Based",
      deadline: "2024-11-30",
      location: "United States",
      level: "Graduate",
      description: "Scholarships for African students pursuing STEM fields at MIT.",
      requirements: ["African citizenship", "STEM background", "Academic excellence"],
      verified: true,
      featured: false,
      fieldOfStudy: ["Engineering & Technology", "Natural Sciences", "Computer Science & IT"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
    },
    { 
      id: "12", 
      title: "WHO Scholarships for Health Sciences", 
      provider: "World Health Organization",
      amount: "Full Coverage",
      currency: "USD",
      category: "Merit-Based",
      deadline: "2024-12-15",
      location: "Global",
      level: "Graduate",
      description: "Scholarships for students pursuing public health and medical research.",
      requirements: ["Health sciences background", "Commitment to public health", "Academic excellence"],
      verified: true,
      featured: false,
      fieldOfStudy: ["Health Sciences & Medicine"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
    },
    { 
      id: "13", 
      title: "African Women in STEM Scholarship", 
      provider: "TechWomen Africa",
      amount: "15000",
      currency: "USD",
      category: "Merit-Based",
      deadline: "2024-11-25",
      location: "South Africa",
      level: "Graduate",
      description: "Supporting African women pursuing STEM degrees with financial assistance and mentorship.",
      requirements: ["Female", "African citizenship", "STEM program enrollment", "Academic excellence"],
      verified: false,
      featured: false,
      fieldOfStudy: ["Engineering & Technology", "Natural Sciences", "Computer Science & IT"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
    },
    { 
      id: "14", 
      title: "Local Community Arts Grant", 
      provider: "Ghana Arts Council",
      amount: "8000",
      currency: "GHS",
      category: "Need-Based",
      deadline: "2024-12-10",
      location: "Ghana",
      level: "Undergraduate",
      description: "Supporting local students pursuing arts and creative programs.",
      requirements: ["Ghanaian citizenship", "Arts program enrollment", "Financial need"],
      verified: false,
      featured: false,
      fieldOfStudy: ["Arts & Humanities"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
    },
    { 
      id: "15", 
      title: "Startup Business Scholarship", 
      provider: "Entrepreneurship Foundation",
      amount: "12000",
      currency: "USD",
      category: "Merit-Based",
      deadline: "2024-11-20",
      location: "Kenya",
      level: "Graduate",
      description: "For aspiring entrepreneurs pursuing business degrees with innovative ideas.",
      requirements: ["Business plan submission", "Entrepreneurial experience", "Academic excellence"],
      verified: false,
      featured: false,
      fieldOfStudy: ["Business & Economics"],
      imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
    },
  ];

  // Get unique values for filters
  const levels = Array.from(new Set(scholarships.map(s => s.level))).sort();
  const locations = Array.from(new Set(scholarships.map(s => s.location))).sort();

  // Filtering logic - Show all scholarships by default, with optional verified filter
  const filteredScholarships = scholarships.filter(scholarship => {
    // Optional verified filter - only apply if user selects "Verified Only"
    if (verifiedOnly && !scholarship.verified) return false;

    const matchesSearch = 
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesField = !selectedField || 
      selectedField === "All Fields" ||
      (scholarship.fieldOfStudy && scholarship.fieldOfStudy.includes(selectedField)) ||
      (scholarship.fieldOfStudy && scholarship.fieldOfStudy.includes("All Fields"));
    
    const matchesLevel = !selectedLevel || scholarship.level === selectedLevel;
    const matchesLocation = !selectedLocation || scholarship.location === selectedLocation;
    
    return matchesSearch && matchesField && matchesLevel && matchesLocation;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedField(null);
    setSelectedLevel(null);
    setSelectedLocation(null);
    setVerifiedOnly(false);
  };

  const hasActiveFilters = selectedField || selectedLevel || selectedLocation || verifiedOnly;

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
      
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #243137 0%, #1a2529 100%)',
          paddingTop: '140px',
          paddingBottom: '100px',
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <DicedHeroSection
            topText="Browse by Field"
            mainText="Field-Based Scholarships"
            subMainText="Discover scholarship opportunities tailored to your field of study. From Engineering to Medicine, Business to Arts—find the perfect funding solution for your academic journey. Filter by field, level, or location. Use the verified filter to see verified opportunities only."
            buttonText="Browse by Field"
            slides={[
              {
                title: "Engineering & Technology",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg"
              },
              {
                title: "Health Sciences",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg"
              },
              {
                title: "Business & Economics",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg"
              },
              {
                title: "Arts & Humanities",
                image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg"
              },
            ]}
            onMainButtonClick={() => {
              const element = document.getElementById('scholarships-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            onGridImageHover={(index) => {
              console.log(`Field image ${index} hovered`);
            }}
            onGridImageClick={(index) => {
              const element = document.getElementById('scholarships-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            topTextStyle={{ 
              color: "#bd9f67",
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}
            mainTextStyle={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              gradient: "linear-gradient(135deg, #bd9f67, #d4b87a)",
              color: "#ffffff",
            }}
            subMainTextStyle={{ 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.125rem",
              lineHeight: 1.8,
              maxWidth: "600px"
            }}
            buttonStyle={{
              backgroundColor: "#bd9f67",
              color: "#243137",
              borderRadius: "0.75rem",
              hoverColor: "#d4b87a",
              hoverForeground: "#1a2529",
            }}
            separatorColor="#bd9f67"
            maxContentWidth="1400px"
            mobileBreakpoint={1024}
            fontFamily="'Source Sans Pro', system-ui, sans-serif"
            backgroundColor="transparent"
          />
        </div>
      </section>

      {/* Field Categories Section */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Browse by Field of Study
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Select a field to filter scholarships by your area of study
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {availableFields.map((field) => (
              <motion.button
                key={field}
                onClick={() => setSelectedField(field === selectedField ? null : field)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selectedField === field
                    ? 'bg-[#bd9f67] text-[#243137] shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-[#bd9f67] hover:text-[#bd9f67]'
                }`}
                style={{
                  boxShadow: selectedField === field ? '0 4px 12px rgba(189, 159, 103, 0.3)' : 'none'
                }}
              >
                {field}
                {selectedField === field && (
                  <CheckCircle2 className="inline-block ml-2 w-4 h-4" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships Section */}
      <section id="scholarships-section" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
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
                  <button
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      verifiedOnly 
                        ? 'bg-[#bd9f67] text-[#243137]' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${verifiedOnly ? 'text-[#243137]' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold">Verified Only</span>
                  </button>
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
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 bg-slate-50">
                            <input
                              type="checkbox"
                              id="verified-only"
                              checked={verifiedOnly}
                              onChange={(e) => setVerifiedOnly(e.target.checked)}
                              className="w-4 h-4 text-[#bd9f67] border-slate-300 rounded focus:ring-[#bd9f67]"
                            />
                            <label htmlFor="verified-only" className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#bd9f67]" />
                              Show verified scholarships only
                            </label>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Field of Study</label>
                            <Select
                              value={selectedField || undefined}
                              onValueChange={(value) => setSelectedField(value || null)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Fields" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFields.map((field) => (
                                  <SelectItem key={field} value={field}>
                                    {field}
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
                
                {verifiedOnly && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-[#bd9f67] text-[#243137]">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Only
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setVerifiedOnly(false)}
                    />
                  </Badge>
                )}
                
                {selectedField && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-[#bd9f67] text-[#243137]">
                    {selectedField}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedField(null)}
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-600">
              Showing <span className="font-bold text-[#bd9f67]">{filteredScholarships.length}</span> scholarship{filteredScholarships.length !== 1 ? 's' : ''}
              {verifiedOnly && <span className="ml-2 text-sm text-slate-500">(verified only)</span>}
            </p>
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
                Try adjusting your filters or search query{verifiedOnly && " (or turn off 'Verified Only' filter)"}
              </p>
              <Button 
                onClick={clearAllFilters}
                className="bg-[#bd9f67] hover:bg-[#d4b87a] text-[#243137] font-semibold"
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
                    className="relative h-full overflow-hidden flex flex-col"
                    style={{
                      background: '#243137',
                      borderRadius: '10px',
                      transition: 'all 0.5s ease-in-out',
                    }}
                  >
                    {/* Animated Border */}
                    <div 
                      className="absolute inset-0 border-2 border-[#bd9f67] opacity-0 group-hover:opacity-100 group-hover:inset-[15px] transition-all duration-500 ease-in-out"
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
                        
                        {/* Verified Badge - Only show if verified */}
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
                      {/* Field of Study Tags */}
                      {scholarship.fieldOfStudy && scholarship.fieldOfStudy.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {scholarship.fieldOfStudy.slice(0, 2).map((field, idx) => (
                            <Badge 
                              key={idx}
                              variant="outline" 
                              className="text-[9px] bg-[#bd9f67]/20 border-[#bd9f67] text-[#bd9f67] py-0.5 px-2"
                            >
                              {field}
                            </Badge>
                          ))}
                          {scholarship.fieldOfStudy.length > 2 && (
                            <Badge 
                              variant="outline" 
                              className="text-[9px] bg-[#bd9f67]/20 border-[#bd9f67] text-[#bd9f67] py-0.5 px-2"
                            >
                              +{scholarship.fieldOfStudy.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

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
                          className="w-full bg-[#bd9f67] hover:bg-[#d4b87a] text-[#243137] font-semibold shadow-md hover:shadow-lg transition-all group-hover:scale-105 h-9 text-xs"
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
                      Verified
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default FieldBasedScholarships;

