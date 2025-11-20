import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Briefcase, MapPin, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const BrowseJobs = () => {
  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
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
        <div className="absolute bottom-0 left-0 right-0">
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

      {/* Companies Hiring Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
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
              <div className="flex-shrink-0 w-full lg:w-[calc(25%-0.75rem)]">
                <div 
                  className="group relative bg-white rounded-2xl p-4 sm:p-6 border-4 border-red-600 cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl h-full"
                  onClick={() => {
                    const element = document.getElementById('jobs-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
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
                      src="https://logo.clearbit.com/microsoft.com" 
                      alt="Microsoft"
                      className="w-full h-full object-contain transition-transform duration-500 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://cdn.simpleicons.org/microsoft/0078D4";
                      }}
                    />
                  </div>
                  
                  {/* Company Name */}
                  <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-500 ease-out">
                    Microsoft
                  </h4>
                  
                  {/* Industry */}
                  <p className="text-xs text-slate-500 mb-3 transition-colors duration-500 ease-out group-hover:text-slate-600">Technology</p>
                  
                  {/* Job Count */}
                  <div className="flex items-center gap-2 text-slate-600 transition-colors duration-500 ease-out group-hover:text-slate-700">
                    <Briefcase className="w-4 h-4 transition-transform duration-500 ease-out group-hover:scale-110" />
                    <span className="text-sm font-medium">247 Open Positions</span>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-red-600 group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transform transition-all duration-500 ease-out group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

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
                {[
                  { 
                    name: "Adidas", 
                    logoUrl: "https://logo.clearbit.com/adidas.com",
                    fallbackUrl: "https://cdn.simpleicons.org/adidas/000000",
                    domain: "adidas.com",
                    jobs: 89,
                    industry: "Retail & Fashion"
                  },
                  { 
                    name: "Nike", 
                    logoUrl: "https://logo.clearbit.com/nike.com",
                    fallbackUrl: "https://cdn.simpleicons.org/nike/111111",
                    domain: "nike.com",
                    jobs: 156,
                    industry: "Retail & Fashion"
                  },
                  { 
                    name: "Apple", 
                    logoUrl: "https://logo.clearbit.com/apple.com",
                    fallbackUrl: "https://cdn.simpleicons.org/apple/000000",
                    domain: "apple.com",
                    jobs: 342,
                    industry: "Technology"
                  },
                  { 
                    name: "Google", 
                    logoUrl: "https://logo.clearbit.com/google.com",
                    fallbackUrl: "https://cdn.simpleicons.org/google/4285F4",
                    domain: "google.com",
                    jobs: 512,
                    industry: "Technology"
                  },
                  { 
                    name: "Amazon", 
                    logoUrl: "https://logo.clearbit.com/amazon.com",
                    fallbackUrl: "https://cdn.simpleicons.org/amazon/FF9900",
                    domain: "amazon.com",
                    jobs: 678,
                    industry: "E-commerce & Cloud"
                  },
                  { 
                    name: "Meta", 
                    logoUrl: "https://logo.clearbit.com/meta.com",
                    fallbackUrl: "https://cdn.simpleicons.org/meta/0081FB",
                    domain: "meta.com",
                    jobs: 234,
                    industry: "Technology"
                  },
                  { 
                    name: "Tesla", 
                    logoUrl: "https://logo.clearbit.com/tesla.com",
                    fallbackUrl: "https://cdn.simpleicons.org/tesla/CC0000",
                    domain: "tesla.com",
                    jobs: 189,
                    industry: "Automotive & Energy"
                  },
                  { 
                    name: "Netflix", 
                    logoUrl: "https://logo.clearbit.com/netflix.com",
                    fallbackUrl: "https://cdn.simpleicons.org/netflix/E50914",
                    domain: "netflix.com",
                    jobs: 145,
                    industry: "Entertainment"
                  },
                  { 
                    name: "LinkedIn", 
                    logoUrl: "https://logo.clearbit.com/linkedin.com",
                    fallbackUrl: "https://cdn.simpleicons.org/linkedin/0A66C2",
                    domain: "linkedin.com",
                    jobs: 267,
                    industry: "Technology"
                  },
                  { 
                    name: "Oracle", 
                    logoUrl: "https://logo.clearbit.com/oracle.com",
                    fallbackUrl: "https://cdn.simpleicons.org/oracle/F80000",
                    domain: "oracle.com",
                    jobs: 198,
                    industry: "Technology"
                  },
                  { 
                    name: "Samsung", 
                    logoUrl: "https://logo.clearbit.com/samsung.com",
                    fallbackUrl: "https://cdn.simpleicons.org/samsung/1428A0",
                    domain: "samsung.com",
                    jobs: 423,
                    industry: "Electronics"
                  },
                  { 
                    name: "Intel", 
                    logoUrl: "https://logo.clearbit.com/intel.com",
                    fallbackUrl: "https://cdn.simpleicons.org/intel/0071C5",
                    domain: "intel.com",
                    jobs: 312,
                    industry: "Semiconductors"
                  },
                ].map((company, index) => (
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
                        onClick={() => {
                          const element = document.getElementById('jobs-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
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

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-8 sm:mt-12 lg:mt-16"
          >
            <p className="text-slate-600 mb-4 sm:mb-6 text-base sm:text-lg px-4">
              Looking for your dream job? Use our search to find opportunities with these companies and more.
            </p>
            <Button
              onClick={() => {
                const element = document.getElementById('jobs-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Search All Jobs
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section Placeholder */}
      <section id="jobs-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Available Job Opportunities
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Browse through our curated list of job openings
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
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
          </div>
          
          {/* Placeholder for job listings */}
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="text-lg text-slate-600">
              Job listings will be displayed here
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BrowseJobs;

