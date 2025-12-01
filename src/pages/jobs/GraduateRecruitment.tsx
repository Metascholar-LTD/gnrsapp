import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Search,
  ArrowRight,
  Users,
  Target,
  Award,
  Sparkles,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const graduatePrograms = [
  {
    id: "grad-1",
    title: "Management Trainee Program",
    company: "First National Bank",
    location: "Accra, Greater Accra",
    type: "Full-time",
    duration: "18 months",
    salary: "Competitive",
    posted: "3 days ago",
    description: "Join our prestigious management trainee program designed for fresh graduates. Receive comprehensive training, mentorship, and fast-track career development opportunities.",
    requirements: [
      "First Class or Second Class Upper degree",
      "Strong leadership potential",
      "Excellent communication skills",
      "Age: 25-28 years",
    ],
    benefits: [
      "Comprehensive training program",
      "Mentorship from senior executives",
      "Career progression opportunities",
      "Competitive salary and benefits",
    ],
    skills: ["Leadership", "Analytical Thinking", "Communication", "Problem Solving"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop",
  },
  {
    id: "grad-2",
    title: "Graduate Engineering Program",
    company: "Ghana Engineering Corporation",
    location: "Kumasi, Ashanti",
    type: "Full-time",
    duration: "24 months",
    salary: "GHS 3,500 - 4,500",
    posted: "1 week ago",
    description: "Launch your engineering career with our structured graduate program. Work on real projects, develop technical expertise, and build a strong professional foundation.",
    requirements: [
      "Engineering degree (Civil, Mechanical, Electrical)",
      "Minimum 2:1 classification",
      "Professional registration preferred",
      "Strong technical skills",
    ],
    benefits: [
      "Hands-on project experience",
      "Professional development",
      "Technical training",
      "Industry certifications",
    ],
    skills: ["Engineering", "Project Management", "Technical Design", "CAD"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop",
  },
  {
    id: "grad-3",
    title: "Graduate Analyst Program",
    company: "Tech Solutions Ghana",
    location: "Accra, Greater Accra",
    type: "Full-time",
    duration: "12 months",
    salary: "GHS 2,800 - 3,500",
    posted: "2 weeks ago",
    description: "Perfect for fresh graduates interested in data analysis, business intelligence, and technology. Develop analytical skills and work with cutting-edge tools.",
    requirements: [
      "Degree in IT, Mathematics, Statistics, or related field",
      "Strong analytical skills",
      "Proficiency in Excel and SQL",
      "Problem-solving mindset",
    ],
    benefits: [
      "Data analytics training",
      "Exposure to modern tools",
      "Career mentorship",
      "Growth opportunities",
    ],
    skills: ["Data Analysis", "SQL", "Excel", "Python", "Business Intelligence"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
  },
];

const advantages = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Structured Development",
    description: "Follow a clear career path with defined milestones and progression",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Mentorship & Support",
    description: "Learn from experienced professionals and receive ongoing guidance",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Competitive Packages",
    description: "Enjoy attractive salaries, benefits, and growth opportunities",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Career Acceleration",
    description: "Fast-track your career with accelerated learning and responsibilities",
  },
];

const GraduateRecruitment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
            alt="Graduate Recruitment"
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
              Career Launch Programs
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-50"
            >
              Graduate Recruitment
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
              Launch your career with structured graduate programs designed for fresh graduates.
              Receive training, mentorship, and fast-track opportunities with leading organizations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => {
                  const el = document.getElementById("graduate-programs");
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

      {/* Advantages Section */}
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
              Why Graduate Programs?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Graduate programs offer structured pathways to build your career from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{advantage.title}</h3>
                <p className="text-slate-600 leading-relaxed">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section id="graduate-programs" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Featured Graduate Programs
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Discover top graduate programs from leading organizations in Ghana.
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
                  placeholder="Search graduate programs by title, company, or field..."
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

          {/* Program Cards - Compact & Neat */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {graduatePrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/jobs/${program.id}`, { state: { job: program } })}
              >
                {/* Image Section - Compact */}
                <div className="relative w-full h-40 overflow-hidden bg-slate-100">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content Section - Tight Spacing */}
                <div className="p-4 space-y-2.5">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {program.company}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-900">{program.salary}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{program.location.split(",")[0]}</span>
                    </div>
                    <span>•</span>
                    <span>{program.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {program.skills.slice(0, 2).map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-[10px] border-slate-200 text-slate-500 bg-slate-50 px-1.5 py-0 h-5"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {program.skills.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-slate-200 text-slate-500 bg-slate-50 px-1.5 py-0 h-5"
                      >
                        +{program.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
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
              View All Graduate Programs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Application Tips Section */}
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
              Application Tips for Graduates
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Maximize your chances of success with these expert tips.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Tailor Your Application",
                description: "Customize your CV and cover letter for each program. Highlight relevant coursework, projects, and experiences.",
                icon: <FileText className="w-6 h-6" />,
              },
              {
                title: "Showcase Your Potential",
                description: "Emphasize your leadership experience, problem-solving abilities, and willingness to learn.",
                icon: <Target className="w-6 h-6" />,
              },
              {
                title: "Prepare for Assessments",
                description: "Practice aptitude tests, case studies, and interviews. Research the company and program thoroughly.",
                icon: <BookOpen className="w-6 h-6" />,
              },
              {
                title: "Demonstrate Enthusiasm",
                description: "Show genuine interest in the organization and program. Ask thoughtful questions during interviews.",
                icon: <Sparkles className="w-6 h-6" />,
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">{tip.title}</h3>
                <p className="text-slate-300 leading-relaxed">{tip.description}</p>
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
              Ready to Launch Your Career?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore graduate programs and find the perfect opportunity to start your professional
              journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => navigate("/jobs/all")}
              >
                Browse All Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold rounded-full px-8 py-6 text-base"
                onClick={() => navigate("/jobs/browse")}
              >
                View Job Listings
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GraduateRecruitment;

