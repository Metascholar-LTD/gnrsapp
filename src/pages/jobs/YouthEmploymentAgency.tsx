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
  Users,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Search,
  ArrowRight,
  Target,
  Award,
  Sparkles,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  BookOpen,
  GraduationCap,
  Handshake,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const yeaBenefits = [
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Employment Opportunities",
    description: "Access to various employment programs and job placements",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Skill Development",
    description: "Training programs to enhance your employability and entrepreneurship",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Financial Support",
    description: "Stipends and financial assistance during training and employment",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Career Pathways",
    description: "Clear pathways to sustainable employment and entrepreneurship",
  },
];

const registrationSteps = [
  {
    step: "1",
    title: "Register Online",
    description: "Create an account on the YEA portal and complete your registration",
    details: "Visit yea.gov.gh and register with your personal details and qualifications",
  },
  {
    step: "2",
    title: "Select Program",
    description: "Choose a program that matches your interests and career goals",
    details: "Browse available programs and select the one that best fits your aspirations",
  },
  {
    step: "3",
    title: "Attend Training",
    description: "Participate in orientation and training sessions for your selected program",
    details: "Complete required training and assessments to qualify for placement",
  },
  {
    step: "4",
    title: "Start Working",
    description: "Begin your placement and start earning while gaining experience",
    details: "Report to your assigned location and commence your employment",
  },
];

// Animation variants matching global scholarships page
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

const YouthEmploymentAgency = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('yea_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading YEA programs:", error);
        setPrograms([]);
        return;
      }

      setPrograms(data || []);
    } catch (error) {
      console.error("Error:", error);
      setPrograms([]);
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
            alt="Youth Employment"
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
              Youth Employment Agency
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-50"
            >
              Empowering Ghana's Youth
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
              The Youth Employment Agency (YEA) provides employment opportunities, skills training,
              and entrepreneurship support for Ghanaian youth. Join thousands of young people building
              their futures.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => {
                  const el = document.getElementById("yea-programs");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About YEA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.16em] mb-4">
                <Users className="h-4 w-4" />
                <span>About YEA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Creating Opportunities for Youth
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                The Youth Employment Agency (YEA) is Ghana's leading institution for youth
                employment and skills development. We connect young people with employment
                opportunities, provide training, and support entrepreneurship.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our programs span various sectors including environment, sanitation, trades, ICT, and
                more. Join us to build your skills, earn an income, and contribute to national
                development.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  alt="Youth Employment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why Join YEA Programs?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              YEA programs offer comprehensive support for your career and personal development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {yeaBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
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

      {/* YEA Programs Section */}
      <section id="yea-programs" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              YEA Employment Programs
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Explore our diverse range of employment and training programs designed for Ghanaian youth.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <Spinner />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              No YEA programs available at the moment.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {programs.map((program, index) => (
              <motion.div
                key={program.id}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
                onClick={() => navigate(`/jobs/yea-jobs/${program.id}`)}
              >
                {/* Compact Card Style - Matching global scholarship page design */}
                <div className="relative w-full overflow-hidden rounded-2xl border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  style={{
                    borderColor: "#e5e7eb"
                  }}
                >
                  {/* Top accent bar - Whitish grey */}
                  <div className="h-1 w-full bg-slate-300" />

                  {/* Image Section */}
                  <div className="relative h-32 overflow-hidden bg-slate-100">
                    <motion.img
                      src={program.image_url || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'}
                      alt={program.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Category badge on image */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-auto bg-white/95 backdrop-blur-sm border-white/50">
                        {program.title.split(' ')[0]}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 p-4">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-[#bd9f67] transition-colors">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Info Icons */}
                    <div className="space-y-1.5 mb-3 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <DollarSign className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                        <span className="font-semibold truncate">{program.stipend}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{program.locations[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{program.locations.length} location{program.locations.length > 1 ? 's' : ''}</span>
                      </div>
                      {program.requirements.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{program.requirements.length} requirement{program.requirements.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button - Matching global scholarship page style */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/yea-jobs/${program.id}`);
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
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Registration Process Section */}
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
              Registration Process
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Follow these simple steps to join a YEA program and start your employment journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {registrationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-xl mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed mb-3">{step.description}</p>
                <p className="text-sm text-slate-400 italic">{step.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
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
              YEA Resources & Support
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Access helpful resources to guide you through your YEA journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Registration Guide",
                description: "Step-by-step guide to completing your YEA registration",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Program Handbook",
                description: "Comprehensive information about all YEA programs",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Support Services",
                description: "Access counseling, mentorship, and career guidance",
              },
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{resource.description}</p>
                <div className="flex items-center text-sm font-semibold text-emerald-700 group-hover:text-emerald-600 transition-colors">
                  Learn more
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Ready to Start Your Employment Journey?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Register with YEA today and join thousands of young Ghanaians building their futures
              through employment and skills development.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => window.open("https://www.yea.gov.gh", "_blank")}
              >
                Visit YEA Portal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => navigate("/jobs/browse")}
              >
                Browse Job Opportunities
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default YouthEmploymentAgency;

