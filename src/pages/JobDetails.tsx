import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DestinationCard } from "@/components/ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Bookmark,
  BookmarkPlus,
  Share2,
  ExternalLink,
  Check,
  Link as LinkIcon,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  descriptionParagraphs?: string[];
  impactParagraphs?: string[];
  impactHighlights?: string[];
  fieldOpsGroups?: Array<{ title: string; items: string[] }>;
  skillsFormalQualifications?: string[];
  skillsAdditionalKnowledge?: string[];
  skillsExperience?: string[];
  skillsTechnical?: string[];
  behavioralAttributes?: string[];
  educationLevel: string;
  experienceLevel: string;
  contractType: string;
  region: string;
  city: string;
  skills: string[];
  cultureParagraphs?: string[];
  opportunityParagraphs?: string[];
  date: string;
  applicationUrl?: string;
}

const JobDetails = () => {
  const [activeNav, setActiveNav] = useState("description");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const loadJob = async () => {
      // Always fetch from database by ID to get complete data
      if (id) {
        setLoading(true);
        try {
          const { data, error } = await (supabase as any)
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error("Error loading job:", error);
            setLoading(false);
            return;
          }

          if (data) {
            const transformed: Job = {
              id: data.id,
              title: data.title,
              company: data.company,
              companyLogo: data.company_logo,
              description: data.description || "",
              descriptionParagraphs: data.description_paragraphs || [],
              impactParagraphs: data.impact_paragraphs || [],
              impactHighlights: data.impact_highlights || [],
              fieldOpsGroups: data.field_ops_groups || [],
              skillsFormalQualifications: data.skills_formal_qualifications || [],
              skillsAdditionalKnowledge: data.skills_additional_knowledge || [],
              skillsExperience: data.skills_experience || [],
              skillsTechnical: data.skills_technical || [],
              behavioralAttributes: data.behavioral_attributes || [],
              skills: Array.isArray(data.skills) ? data.skills : [],
              cultureParagraphs: data.culture_paragraphs || [],
              opportunityParagraphs: data.opportunity_paragraphs || [],
              educationLevel: data.education_level || "Bachelor",
              experienceLevel: data.experience_level || "2 to 5 years",
              contractType: data.contract_type || "Permanent contract",
              region: data.region || "Greater Accra",
              city: data.city || "",
              date: data.date ? new Date(data.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
              applicationUrl: data.application_url || "",
            };
            setJob(transformed);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const goBack = () => navigate("/jobs/all");

  const handleShare = (platform: string) => {
    const url = window.location.href;
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    setShowShareMenu(false);
  };

  const handleApply = () => {
    if (!job?.applicationUrl) return;
    
    // Normalize URL - add https:// if no protocol is present
    let url = job.applicationUrl.trim();
    if (!url.match(/^https?:\/\//i)) {
      url = `https://${url}`;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Use company logo or a default job-related image
  const heroImageUrl = job?.companyLogo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60";

  if (loading) {
    return (
      <>
        <InitScripts />
        <Spinner />
        <Navigation />
        <main className="min-h-screen bg-slate-50 pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center py-20">
              <Spinner />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <InitScripts />
        <Spinner />
        <Navigation />
        <main className="min-h-screen bg-slate-50 pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Building2 className="w-12 h-12 text-slate-400" />
                <h1 className="text-2xl font-bold text-slate-900">
                  Job details unavailable
                </h1>
                <p className="text-slate-600">
                  We couldn&apos;t load the job you tried to view{ id ? ` (ID: ${id})` : "" }. Please go back and
                  select a job again.
                </p>
                <Button onClick={goBack} className="bg-slate-900 hover:bg-slate-800 text-white px-6">
                  Back to all jobs
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const navItems = [
    { id: "description", label: "Description" },
    { id: "impact", label: "Impact" },
    { id: "field-ops", label: "Field Ops" },
    { id: "skills", label: "Skills & Experience" },
    { id: "culture", label: "Culture & Apply" },
  ];

  const renderList = (items: string[]) => (
    <ul className="list-disc space-y-2 pl-5 text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  const descriptionParagraphs = job?.descriptionParagraphs && job.descriptionParagraphs.length > 0
    ? job.descriptionParagraphs
    : [job?.description || ""];

  const impactParagraphs = job?.impactParagraphs || [];
  const impactHighlights = job?.impactHighlights || [];
  const fieldOperationGroups = job?.fieldOpsGroups || [];
  const cultureParagraphs = job?.cultureParagraphs || [];
  const opportunityParagraphs = job?.opportunityParagraphs || [];

  const skillsData = [
    {
      title: "Formal Qualifications",
      items: job?.skillsFormalQualifications || [],
    },
    {
      title: "Additional Knowledge",
      items: job?.skillsAdditionalKnowledge || [],
    },
    {
      title: "Experience",
      items: job?.skillsExperience || [],
    },
    {
      title: "Technical Skills",
      items: job?.skillsTechnical || [],
    },
  ];

  const behavioralAttributes = job?.behavioralAttributes || [];

  const renderTabContent = () => {
    switch (activeNav) {
      case "description":
        return (
          <section className="space-y-5">
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        );
      case "impact":
        return (
          <section className="space-y-5">
            {impactParagraphs.length > 0 ? (
              <div className="space-y-4 text-slate-700 leading-relaxed">
                {impactParagraphs.map((paragraph, index) => (
                  <p key={`impact-para-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No impact information available yet.</p>
            )}
            {impactHighlights.length > 0 && (
              <div className="rounded-2xl bg-sky-50 border border-sky-100 p-5">
                <p className="text-sm font-semibold text-sky-900 uppercase tracking-wide mb-3">
                  As part of our team you will
                </p>
                {renderList(impactHighlights)}
              </div>
            )}
          </section>
        );
      case "field-ops":
        return (
          <section className="space-y-5">
            {fieldOperationGroups.length > 0 ? (
              <>
                <p className="text-slate-600">
                  Day-to-day operations span safety leadership, data mastery and precise execution.
                </p>
                <div className="space-y-4">
                  {fieldOperationGroups.map((group, index) => (
                    <div key={`field-ops-${index}`} className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                      <h3 className="text-base font-semibold text-slate-900 mb-2">{group.title}</h3>
                      {renderList(group.items)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-slate-500 italic">No field operations information available yet.</p>
            )}
          </section>
        );
      case "skills":
        const hasSkillsData = skillsData.some(block => block.items && block.items.length > 0);
        const hasBehavioralAttributes = behavioralAttributes && behavioralAttributes.length > 0;
        const hasKeySkills = job.skills && job.skills.length > 0;
        
        return (
          <section className="space-y-6">
            {hasSkillsData && (
              <div className="grid gap-4 md:grid-cols-2">
                {skillsData.map((block, index) => (
                  block.items && block.items.length > 0 && (
                    <div key={`skill-block-${index}`} className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                      <h3 className="text-base font-semibold text-slate-900 mb-2">{block.title}</h3>
                      {renderList(block.items)}
                    </div>
                  )
                ))}
              </div>
            )}
            {hasBehavioralAttributes && (
              <div className="rounded-2xl bg-sky-50 border border-sky-100 p-5">
                <h3 className="text-base font-semibold text-sky-900 mb-2">Behavioural Attributes</h3>
                {renderList(behavioralAttributes)}
              </div>
            )}
            {hasKeySkills && (
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-3">Key Skills In Demand</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge
                      key={`skill-${index}`}
                      variant="outline"
                      className="rounded-full border-slate-300 text-slate-700 px-3 py-1 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {!hasSkillsData && !hasBehavioralAttributes && !hasKeySkills && (
              <p className="text-slate-500 italic">No skills information available yet.</p>
            )}
          </section>
        );
      case "culture":
      default:
        const hasCultureContent = cultureParagraphs && cultureParagraphs.length > 0;
        const hasOpportunityContent = opportunityParagraphs && opportunityParagraphs.length > 0;
        
        return (
          <section className="space-y-6">
            {hasCultureContent && (
              <div className="space-y-4 text-slate-700 leading-relaxed">
                {cultureParagraphs.map((paragraph, index) => (
                  <p key={`culture-para-${index}`}>{paragraph}</p>
                ))}
              </div>
            )}
            {hasOpportunityContent && (
              <div className="space-y-4 text-slate-700 leading-relaxed">
                {opportunityParagraphs.map((paragraph, index) => (
                  <p key={`opportunity-para-${index}`}>{paragraph}</p>
                ))}
              </div>
            )}
            {!hasCultureContent && !hasOpportunityContent && (
              <p className="text-slate-500 italic">No culture information available yet.</p>
            )}
            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Get notified for similar jobs</h3>
                <p className="text-sm text-slate-600">Sign up to receive job alerts tailored to your interests.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input type="email" placeholder="name@email.com" className="h-12 rounded-xl" />
                <Button className="h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-6">Notify me</Button>
              </div>
              <p className="text-xs text-slate-500">Get tailored job recommendations based on your interests.</p>
            </div>
          </section>
        );
    }
  };

  const tabContent = renderTabContent();

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero Section with Image */}
      <section className="relative h-[500px] overflow-hidden pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImageUrl})`,
            filter: "brightness(0.4) blur(0px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900" />

        <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="outline"
                onClick={goBack}
                className="mb-6 group inline-flex bg-white/95 backdrop-blur-sm border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 hover:text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-3 py-1.5 font-semibold"
              >
                <ArrowLeft className="mr-1.5 w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to all jobs
              </Button>


              <div className="flex items-center gap-6 mb-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {job.title}
                  </h1>
                </div>

                <div className="hidden md:block w-px h-16 bg-white/30"></div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Button
                    size="lg"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg px-8 py-6 shadow-xl"
                    onClick={handleApply}
                    disabled={!job?.applicationUrl}
                    title={job?.applicationUrl ? 'Apply for this position' : 'Application link not available'}
                  >
                    Apply Now
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white p-3 h-auto aspect-square"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    title={isBookmarked ? "Remove from saved" : "Save job"}
                  >
                    {isBookmarked ? (
                      <Bookmark className="w-5 h-5 fill-white" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </Button>
                  <div className="relative">
                    <Button
                      size="default"
                      variant="outline"
                      className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white p-3 h-auto aspect-square"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      title="Share job"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 bg-white rounded-lg shadow-xl p-4 z-50 min-w-[200px]"
                      >
                        <div className="space-y-2">
                          <button
                            onClick={() => handleShare("copy")}
                            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            {copiedLink ? (
                              <>
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-green-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <LinkIcon className="w-5 h-5 text-slate-600" />
                                <span className="text-slate-700">Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className="flex items-center gap-2 text-sky-400 text-xl mb-6 cursor-pointer hover:text-sky-300 transition-colors"
                onClick={() => navigate(`/companies/${encodeURIComponent(job.company)}`)}
              >
                <Building2 className="w-5 h-5" />
                <span className="font-semibold hover:underline">{job.company}</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <MapPin className="w-5 h-5 inline mr-2 text-sky-400" />
                    <span className="font-semibold text-lg">
                      {job.city}, {job.region}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Briefcase className="w-5 h-5 inline mr-2 text-sky-400" />
                    <span className="font-semibold">{job.contractType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <GraduationCap className="w-5 h-5 inline mr-2 text-sky-400" />
                    <span className="font-semibold">{job.educationLevel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Clock className="w-5 h-5 inline mr-2 text-sky-400" />
                    <span className="font-semibold">{job.experienceLevel}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="job-details-page min-h-screen bg-slate-50 pb-20">
        <div className="container mx-auto px-4">
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8 relative z-10">

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8">
              <div className="space-y-6">
                <nav className="bg-white border border-sky-100 rounded-2xl p-2 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                        className={`flex-1 min-w-[140px] rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          activeNav === item.id
                            ? "bg-sky-500 text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </nav>

                <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
                  {tabContent}
                </section>
              </div>

              <aside className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl p-6 bg-gradient-to-br from-white via-slate-50/50 to-sky-50/30 border border-slate-200/60 shadow-lg shadow-slate-200/50 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-6">
                  
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Job Snapshot</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-100 hover:border-sky-200/60 hover:shadow-md transition-all duration-300 ease-out cursor-pointer">
                      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300 ease-out mt-0.5">
                        <Briefcase className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Contract Type</p>
                        <p className="text-sm font-semibold text-slate-900">{job.contractType}</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-100 hover:border-sky-200/60 hover:shadow-md transition-all duration-300 ease-out cursor-pointer">
                      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300 ease-out mt-0.5">
                        <Clock className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Experience</p>
                        <p className="text-sm font-semibold text-slate-900">{job.experienceLevel}</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-100 hover:border-sky-200/60 hover:shadow-md transition-all duration-300 ease-out cursor-pointer">
                      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300 ease-out mt-0.5">
                        <DollarSign className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Compensation</p>
                        <p className="text-sm font-semibold text-slate-900">Competitive</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-100 hover:border-sky-200/60 hover:shadow-md transition-all duration-300 ease-out cursor-pointer">
                      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300 ease-out mt-0.5">
                        <MapPin className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Location</p>
                        <p className="text-sm font-semibold text-slate-900">{job.city}</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-100 hover:border-sky-200/60 hover:shadow-md transition-all duration-300 ease-out cursor-pointer">
                      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300 ease-out mt-0.5">
                        <Calendar className="w-4 h-4 text-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Posted</p>
                        <p className="text-sm font-semibold text-slate-900">{job.date}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <DestinationCard
                  imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop&q=60"
                  className="h-[380px]"
                >
                  <div className="space-y-4">
                    <p className="text-base leading-relaxed text-white/95">
                    Share your CV with us and open the door to an exciting career opportunity
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="w-full h-12 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
                        onClick={handleApply}
                        disabled={!job?.applicationUrl}
                        title={job?.applicationUrl ? 'Apply for this position' : 'Application link not available'}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 text-base font-semibold border-2 border-white/60 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/80"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </DestinationCard>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default JobDetails;

