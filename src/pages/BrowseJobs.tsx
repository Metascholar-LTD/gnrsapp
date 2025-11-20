import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Briefcase, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

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

