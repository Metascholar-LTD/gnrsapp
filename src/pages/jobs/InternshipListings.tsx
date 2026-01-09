import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Building2,
  GraduationCap,
  Search,
  Filter,
  ArrowRight,
  Users,
  Target,
  Award,
  Sparkles,
  TrendingUp,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Real-World Experience",
    description: "Work on actual projects and contribute to meaningful outcomes",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Professional Network",
    description: "Connect with industry professionals and build lasting relationships",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Skill Development",
    description: "Enhance your technical and soft skills through hands-on learning",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Career Advancement",
    description: "Boost your resume and increase your job prospects after graduation",
  },
];

const InternshipListings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading internships:", error);
        setInternships([]);
        return;
      }

      setInternships(data || []);
    } catch (error) {
      console.error("Error:", error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
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
          paddingTop: "140px",
          paddingBottom: "100px",
        }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop"
            alt="Internship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-sm font-semibold tracking-[0.18em] uppercase text-emerald-300"
            >
              Professional Development
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-50"
            >
              Internship Listings
            </motion.h1>
            <motion.hr
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="h-1 bg-emerald-400 border-none rounded-full mx-auto"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-100/90 max-w-3xl mx-auto leading-relaxed"
            >
              Discover internship opportunities that align with your career goals. Gain practical
              experience, build your network, and kickstart your professional journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => {
                  const el = document.getElementById("internship-listings");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse Internships
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why Internships Matter
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Internships provide invaluable opportunities to bridge the gap between academic learning
              and professional practice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Listings Section */}
      <section id="internship-listings" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Featured Internship Opportunities
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Browse our curated selection of high-quality internship positions from leading
              organizations.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100">
                  <Search className="w-5 h-5 text-slate-600" />
                </div>
                <Input
                  type="text"
                  placeholder="Search internships by title, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-12 text-sm focus:outline-none border-0 focus-visible:ring-0"
                />
                <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 h-12 rounded-xl font-semibold">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Internship Cards - Compact & Neat */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <Spinner />
              </div>
            ) : internships.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-600">
                No internships available at the moment.
              </div>
            ) : (
              internships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/jobs/${internship.id}`, { state: { job: internship } })}
              >
                {/* Image Section - Compact */}
                <div className="relative w-full h-40 overflow-hidden bg-slate-100">
                  <img
                    src={internship.image_url || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'}
                    alt={internship.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content Section - Tight Spacing */}
                <div className="p-4 space-y-2.5">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {internship.company}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {internship.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {internship.description}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-900">{internship.stipend}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{internship.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{internship.location.split(",")[0]}</span>
                    </div>
                    <span>•</span>
                    <span>{internship.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {internship.skills.slice(0, 2).map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-[10px] border-slate-200 text-slate-500 bg-slate-50 px-1.5 py-0 h-5"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {internship.skills.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-slate-200 text-slate-500 bg-slate-50 px-1.5 py-0 h-5"
                      >
                        +{internship.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-0.5">
                    Posted {internship.posted}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full px-8 py-6 text-base"
              onClick={() => navigate("/jobs/all")}
            >
              View All Internship Opportunities
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-3">
              How to Apply for Internships
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Follow these simple steps to secure your ideal internship position.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and complete your profile with your academic background and skills",
              },
              {
                step: "2",
                title: "Browse Opportunities",
                description: "Explore internships that match your interests and career goals",
              },
              {
                step: "3",
                title: "Apply with Confidence",
                description: "Submit your application with a tailored resume and cover letter",
              },
              {
                step: "4",
                title: "Get Hired",
                description: "Interview with employers and start your professional journey",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default InternshipListings;

