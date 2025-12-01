import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  UserCheck,
  MapPin,
  Calendar,
  Clock,
  Building2,
  GraduationCap,
  ArrowRight,
  Users,
  Target,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileText,
  Shield,
  Briefcase,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const nssPrograms = [
  {
    id: "nss-1",
    title: "Teaching Service",
    description: "Serve as a teacher in public schools across Ghana. Make a difference in education while fulfilling your national service obligation.",
    duration: "12 months",
    locations: ["All Regions", "Urban & Rural"],
    requirements: ["Education degree", "Teaching certification preferred"],
    benefits: ["Teaching experience", "Professional development", "Community impact"],
    icon: <GraduationCap className="w-8 h-8" />,
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-900",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
  },
  {
    id: "nss-2",
    title: "Health Service",
    description: "Work in healthcare facilities, supporting medical professionals and serving communities. Ideal for health sciences graduates.",
    duration: "12 months",
    locations: ["Hospitals", "Clinics", "Health Centers"],
    requirements: ["Health sciences degree", "Professional registration"],
    benefits: ["Clinical experience", "Professional network", "Healthcare exposure"],
    icon: <Shield className="w-8 h-8" />,
    color: "bg-red-50 border-red-200",
    textColor: "text-red-900",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop",
  },
  {
    id: "nss-3",
    title: "Public Administration",
    description: "Serve in government ministries, departments, and agencies. Gain insight into public service and governance.",
    duration: "12 months",
    locations: ["Government Offices", "District Assemblies"],
    requirements: ["Any degree", "Interest in public service"],
    benefits: ["Government experience", "Policy exposure", "Administrative skills"],
    icon: <Building2 className="w-8 h-8" />,
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-900",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop",
  },
  {
    id: "nss-4",
    title: "Private Sector",
    description: "Complete your service in private companies and organizations. Apply your skills in corporate environments.",
    duration: "12 months",
    locations: ["Corporate Offices", "Private Companies"],
    requirements: ["Relevant degree", "Company approval"],
    benefits: ["Corporate experience", "Industry exposure", "Career opportunities"],
    icon: <Briefcase className="w-8 h-8" />,
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-900",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
  },
];

const nssBenefits = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Mandatory Requirement",
    description: "Fulfill your national service obligation as required for all graduates",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Professional Experience",
    description: "Gain valuable work experience in your field of study",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Career Development",
    description: "Build your professional network and enhance your resume",
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: "National Contribution",
    description: "Serve your country and contribute to national development",
  },
];

const applicationSteps = [
  {
    step: "1",
    title: "Register Online",
    description: "Create an account on the NSS portal and complete your registration",
    details: "Visit nss.gov.gh and register with your student ID and personal details",
  },
  {
    step: "2",
    title: "Submit Documents",
    description: "Upload required documents including your degree certificate and transcripts",
    details: "Ensure all documents are clear and properly scanned before submission",
  },
  {
    step: "3",
    title: "Select Placement",
    description: "Choose your preferred region and service area based on availability",
    details: "Consider your career goals and personal preferences when selecting",
  },
  {
    step: "4",
    title: "Begin Service",
    description: "Report to your assigned institution and start your national service",
    details: "Attend orientation and familiarize yourself with your new environment",
  },
];

const NationalServiceSupport = () => {
  const navigate = useNavigate();

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
            alt="National Service"
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
              National Service Scheme
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-50"
            >
              National Service Support
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
              Complete your mandatory national service with confidence. Find placement opportunities,
              get support, and make the most of your service year.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => {
                  const el = document.getElementById("nss-programs");
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

      {/* About NSS Section */}
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
                <Shield className="h-4 w-4" />
                <span>About NSS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Serving Ghana, Building Careers
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                The National Service Scheme (NSS) is a mandatory one-year service program for all
                Ghanaian graduates. It provides an opportunity to serve your country while gaining
                valuable professional experience.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our platform helps you navigate the NSS process, find suitable placements, and access
                resources to make your service year productive and rewarding.
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
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop"
                  alt="National Service"
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
              Why National Service Matters
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              National service offers numerous benefits for your personal and professional development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nssBenefits.map((benefit, index) => (
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

      {/* NSS Programs Section */}
      <section id="nss-programs" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Service Areas & Programs
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Explore the various service areas available for your national service placement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {nssPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Image Section - Compact */}
                <div className="relative w-full h-40 overflow-hidden bg-slate-100">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <div className={`w-10 h-10 rounded-lg ${program.color} flex items-center justify-center text-xl shadow-sm`}>
                      {program.icon}
                    </div>
                  </div>
                </div>

                {/* Content Section - Tight Spacing */}
                <div className="p-4 space-y-2.5">
                  <h3 className={`text-base font-bold ${program.textColor} leading-snug`}>
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{program.locations[0]}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {program.benefits.slice(0, 3).map((benefit, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 px-1.5 py-0 h-5"
                      >
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
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
              Application Process
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Follow these steps to complete your NSS registration and placement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applicationSteps.map((step, index) => (
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
              NSS Resources & Support
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Access helpful resources to guide you through your national service journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Application Guide",
                description: "Step-by-step guide to completing your NSS registration",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Service Handbook",
                description: "Comprehensive handbook covering all aspects of national service",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Support Community",
                description: "Connect with other service personnel and share experiences",
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
              Ready to Begin Your National Service?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start your registration process today and find the perfect placement for your service year.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => window.open("https://www.nss.gov.gh", "_blank")}
              >
                Visit NSS Portal
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

export default NationalServiceSupport;

