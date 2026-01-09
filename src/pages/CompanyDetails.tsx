import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyInfoCard } from "@/components/ui/company-info-card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Building2,
  MapPin,
  ExternalLink,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  educationLevel: string;
  experienceLevel: string;
  contractType: string;
  region: string;
  city: string;
  skills: string[];
  date: string;
}

interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  employees: string;
  founded: string;
}

const CompanyDetails = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const companyName = name ? decodeURIComponent(name) : "";
  const [logoError, setLogoError] = useState(false);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [otherCompanies, setOtherCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, [companyName]);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      // Load company
      const { data: company, error: companyError } = await (supabase as any)
        .from('companies')
        .select('*')
        .eq('name', companyName)
        .single();

      if (companyError || !company) {
        console.error("Error loading company:", companyError);
        setLoading(false);
        return;
      }

      const transformedCompany: Company = {
        id: company.id,
        name: company.name,
        logoUrl: company.logo_url,
        description: company.description || "",
        industry: company.industry || "",
        location: company.location || "",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        employees: company.employees || "",
        founded: company.founded || "",
      };
      setCompanyData(transformedCompany);

      // Load jobs for this company
      const { data: jobs, error: jobsError } = await (supabase as any)
        .from('jobs')
        .select('*')
        .eq('company', companyName)
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (!jobsError && jobs) {
        const transformedJobs: Job[] = jobs.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          companyLogo: item.company_logo,
          description: item.description || "",
          educationLevel: item.education_level || "Bachelor",
          experienceLevel: item.experience_level || "2 to 5 years",
          contractType: item.contract_type || "Permanent contract",
          region: item.region || "Greater Accra",
          city: item.city || "",
          skills: Array.isArray(item.skills) ? item.skills : [],
          date: item.date ? new Date(item.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
        }));
        setCompanyJobs(transformedJobs);
      }

      // Load other companies (excluding current)
      const { data: companies, error: companiesError } = await (supabase as any)
        .from('companies')
        .select('id, name, logo_url, industry')
        .neq('name', companyName)
        .limit(8);

      if (!companiesError && companies) {
        // Get job counts for each company
        const companiesWithJobs = await Promise.all(
          companies.map(async (comp: any) => {
            const { count } = await (supabase as any)
              .from('jobs')
              .select('*', { count: 'exact', head: true })
              .eq('company', comp.name)
              .eq('verified', true);

            return {
              name: comp.name,
              logoUrl: comp.logo_url,
              fallbackUrl: `https://logo.clearbit.com/${comp.name.toLowerCase().replace(/\s+/g, '')}.com`,
              jobs: count || 0,
              industry: comp.industry || "",
            };
          })
        );
        setOtherCompanies(companiesWithJobs);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Other companies data (excluding current company) - now loaded from Supabase
  const otherCompaniesList = otherCompanies;

  const handleViewJobs = () => {
    navigate("/jobs/all", { state: { company: companyName } });
  };

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

  if (!companyData) {
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
                  Company not found
                </h1>
                <p className="text-slate-600">
                  We couldn&apos;t find the company you&apos;re looking for.
                </p>
                <Button onClick={() => navigate("/jobs/all")} className="bg-slate-900 hover:bg-slate-800 text-white px-6">
                  Back to jobs
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden pt-20 sm:pt-24 md:pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${companyData.logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60"})`,
            filter: "brightness(0.4) blur(0px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900" />

        <div className="container mx-auto px-4 sm:px-6 h-full relative z-10 flex items-center">
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-4 sm:mb-6 group inline-flex bg-white/95 backdrop-blur-sm border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 hover:text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-3 py-1.5 text-sm sm:text-base font-semibold"
              >
                <ArrowLeft className="mr-1.5 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back
              </Button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-white border-2 sm:border-4 border-white shadow-xl flex items-center justify-center overflow-hidden p-2 flex-shrink-0">
                  {!logoError && companyData.logoUrl ? (
                    <img 
                      src={companyData.logoUrl} 
                      alt={companyData.name}
                      className="w-full h-full object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-700" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {companyData.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sky-400">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base md:text-lg font-semibold">{companyData.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-slate-50 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto -mt-8 sm:-mt-16 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 md:p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Company Info */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">About {companyData.name}</h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4 sm:mb-6">
                    {companyData.description}
                  </p>

                  <div className="relative md:mr-[-2rem]">
                    <CompanyInfoCard
                      industry={companyData.industry}
                      employees={companyData.employees}
                      founded={companyData.founded}
                      website={companyData.website}
                      email={companyData.email}
                      phone={companyData.phone}
                      className="md:rounded-r-none"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Open Positions</h3>
                  <div className="bg-sky-50 rounded-xl p-4 sm:p-6 border border-sky-100 md:rounded-l-none md:-ml-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                          {companyJobs.length}
                        </div>
                        <p className="text-sm sm:text-base text-slate-600">Available Jobs</p>
                      </div>
                      
                      <div className="hidden sm:block h-16 w-px bg-sky-200"></div>
                      
                      <div className="flex items-center w-full sm:w-auto">
                        <button
                          onClick={handleViewJobs}
                          className="group relative overflow-hidden border-2 cursor-pointer transition-all duration-500 ease-out 
                                    shadow-md hover:shadow-sky-300/30 hover:scale-[1.02] active:scale-95
                                    inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2
                                    border-sky-300 bg-gradient-to-br from-sky-100 via-sky-50 to-white
                                    rounded-2xl w-full sm:w-auto"
                        >
                          {/* Moving gradient layer */}
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl"
                          ></div>

                          {/* Content */}
                          <div className="relative z-10 flex items-center gap-2">
                            <span className="text-sky-700 font-bold text-xs sm:text-sm group-hover:text-sky-800 transition-colors duration-300 whitespace-nowrap">
                              View All Open Positions
                            </span>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-sky-700 group-hover:text-sky-800 transition-colors duration-300 group-hover:scale-110" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Companies Section - Full Width */}
        <div className="w-full py-8 sm:py-12 bg-slate-200/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                  Other Companies
                </h2>
                <p className="text-slate-600 text-base sm:text-lg">
                  Explore opportunities with other leading organizations
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {otherCompaniesList.slice(0, 8).map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative h-full bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 hover:border-slate-900 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl"
                    onClick={() => navigate(`/companies/${encodeURIComponent(company.name)}`)}
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CompanyDetails;

