import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Building2,
  FileText,
  TrendingUp,
  GraduationCap,
  Users,
  X,
  CheckCircle,
  CheckCircle2,
  ArrowLeft,
  Plus,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants from admin
const jobCategories = [
  "Accounting, controlling, finance", "Administrative, secretarial", "Agriculture, fishing, forestry",
  "Architecture, town planning", "Art, design, creative", "Audit, consulting, advisory",
  "Automotive, transport, logistics", "Banking, insurance, finance", "Beauty, wellness, health",
  "Business development", "Commercial, sales", "Communication, marketing, PR",
  "Construction, public works", "Customer service, support", "Education, training",
  "Electricity, water, gas", "Engineering, methods", "Environment, recycling",
  "Food, beverage, hospitality", "HR, recruitment", "IT, new technologies",
  "Legal", "Management", "Manufacturing, production",
  "Marketing, advertising", "Medical, pharmaceutical", "Other",
  "Paper, wood, rubber, plastic, glass, tobacco", "Pharmaceutical industry",
  "Public buildings and works sector, construction", "Quality, methods",
  "Real-estate, architecture, town planning", "Rental", "Research and development",
  "Secretarial work", "Services other", "Social, public and human services",
  "Sports, cultural and social action", "Telecom", "Temporary work, recruitment",
  "Textile, leather, shoes, clothing industry", "Tourism, leisure activities",
  "Transport, logistics, postal services"
];

const industries = jobCategories; // Same as categories
const regions = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central",
  "Eastern", "Greater Accra", "North East", "Northern",
  "Oti", "Savannah", "Upper East", "Upper West", "Volta",
  "Western", "Western North"
];

const contractTypes = [
  "Permanent contract", "Fixed-term contract", "Freelance",
  "Part-time work", "Cooperative Education Program", "Internship", "Temporary work"
];

const educationLevels = [
  "Bachelor", "College", "Doctorate", "High school",
  "HND", "Master", "Technical school"
];

const experienceLevels = [
  "No experience", "Less than 2 years", "2 to 5 years",
  "5 to 10 years", "More than 10 years"
];

interface Company {
  id: string;
  name: string;
  logo_url?: string;
  industry: string;
}

const PostNewJob: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'description' | 'impact' | 'field-ops' | 'skills' | 'culture'>('description');
  const [submitting, setSubmitting] = useState(false);
  const [activeInlineEditor, setActiveInlineEditor] = useState<{ field: string; index: number } | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [showNoCompanyAlert, setShowNoCompanyAlert] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyId: '',
    companyLogo: '',
    descriptionParagraphs: '',
    impactParagraphs: '',
    impactHighlights: '',
    fieldOpsGroups: '',
    skillsFormalQualifications: '',
    skillsAdditionalKnowledge: '',
    skillsExperience: '',
    skillsTechnical: '',
    behavioralAttributes: '',
    skills: '',
    cultureParagraphs: '',
    opportunityParagraphs: '',
    jobCategory: '',
    industry: '',
    educationLevel: 'Bachelor',
    experienceLevel: '2 to 5 years',
    contractType: 'Permanent contract',
    region: 'Greater Accra',
    city: '',
    salary: '',
    imageUrl: '',
    applicationUrl: ''
  });

  const tabs = [
    { id: 'description' as const, label: 'Description', icon: FileText },
    { id: 'impact' as const, label: 'Impact', icon: TrendingUp },
    { id: 'field-ops' as const, label: 'Field Ops', icon: Briefcase },
    { id: 'skills' as const, label: 'Skills & Experience', icon: GraduationCap },
    { id: 'culture' as const, label: 'Culture & Apply', icon: Users },
  ];

  // Load employer's companies
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to post jobs");
        navigate('/employer/auth');
        return;
      }

      // Get employer profile to find associated company
      const { data: employerProfile } = await supabase
        .from('employers')
        .select('company_id, company_name')
        .eq('user_id', user.id)
        .single();

      // Only load the employer's company - limit to one company
      let query = supabase
        .from('companies')
        .select('id, name, logo_url, industry')
        .order('created_at', { ascending: false })
        .limit(1); // Limit to only one company

      // If employer has a company_id, filter by it
      if (employerProfile?.company_id) {
        query = query.eq('id', employerProfile.company_id);
      } else {
        // If no company_id, try to find by company_name
        if (employerProfile?.company_name) {
          query = query.eq('name', employerProfile.company_name);
        } else {
          // No company associated
          setCompanies([]);
          setLoadingCompanies(false);
          setShowNoCompanyAlert(true);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading companies:", error);
        toast.error("Failed to load companies");
        setCompanies([]);
        return;
      }

      if (data && data.length > 0) {
        setCompanies(data);
        // Auto-select first company if only one exists
        if (data.length === 1) {
          setFormData(prev => ({
            ...prev,
            company: data[0].name,
            companyId: data[0].id,
            companyLogo: data[0].logo_url || ''
          }));
        }
      } else {
        setCompanies([]);
        setShowNoCompanyAlert(true);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to load companies");
      setCompanies([]);
      setShowNoCompanyAlert(true);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find(c => c.id === companyId);
    if (selectedCompany) {
      setFormData(prev => ({
        ...prev,
        company: selectedCompany.name,
        companyId: selectedCompany.id,
        companyLogo: selectedCompany.logo_url || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.jobCategory || !formData.industry) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.companyId) {
      toast.error('Please select a company. If you don\'t have one, add it first in Company Management.');
      return;
    }

    setSubmitting(true);
    try {
      // Transform data for Supabase
      const jobData = {
        title: formData.title,
        company: formData.company,
        company_id: formData.companyId,
        company_logo: formData.companyLogo || null,
        description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
        impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
        impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
        field_ops_groups: formData.fieldOpsGroups ? JSON.parse(formData.fieldOpsGroups) : [],
        skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
        skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
        skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
        skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
        behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
        opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
        job_category: formData.jobCategory,
        industry: formData.industry,
        education_level: formData.educationLevel,
        experience_level: formData.experienceLevel,
        contract_type: formData.contractType,
        region: formData.region,
        city: formData.city || null,
        salary: formData.salary || null,
        image_url: formData.imageUrl || null,
        application_url: formData.applicationUrl || null,
        verified: false,
        featured: false,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('jobs' as any)
        .insert(jobData)
        .select();

      if (error) throw error;

      toast.success('Job posted successfully! It will be reviewed before going live.');
      navigate('/employer/job-listings/all');
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error('Error posting job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addListItem = (field: string) => {
    const current = formData[field as keyof typeof formData] as string;
    const items = current ? current.split('\n') : [''];
    setFormData({ ...formData, [field]: [...items, ''].join('\n') });
  };

  const removeListItem = (field: string, index: number) => {
    const current = formData[field as keyof typeof formData] as string;
    const items = current ? current.split('\n') : [''];
    const updated = items.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated.join('\n') });
  };

  const updateListItem = (field: string, index: number, value: string) => {
    const current = formData[field as keyof typeof formData] as string;
    const items = current ? current.split('\n') : [''];
    const updated = [...items];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated.join('\n') });
  };

  return (
    <>
      <style>{`
        .epnj-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-header {
          margin-bottom: 2rem;
        }

        .epnj-header-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .epnj-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          color: #566a7f;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .epnj-back-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .epnj-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-subtitle {
          font-size: 0.9375rem;
          color: #54577A;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-card {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          overflow: hidden;
        }

        .epnj-tabs {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eceef1;
          background: #fff;
          flex-wrap: wrap;
        }

        .epnj-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #54577A;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-tab:hover {
          background: #f5f5f9;
          color: #141522;
        }

        .epnj-tab.active {
          background: rgba(105, 108, 255, 0.1);
          color: #696cff;
        }

        .epnj-form-container {
          padding: 2rem 1.5rem;
        }

        .epnj-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .epnj-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .epnj-form-group.full-width {
          grid-column: 1 / -1;
        }

        .epnj-form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-form-label-required {
          color: #ff3e1d;
          font-size: 0.75rem;
        }

        .epnj-form-input,
        .epnj-form-textarea,
        .epnj-form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background: #fff;
        }

        .epnj-form-input:focus,
        .epnj-form-textarea:focus,
        .epnj-form-select:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .epnj-form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .epnj-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .epnj-list-number {
          width: 1.75rem;
          height: 1.75rem;
          flex-shrink: 0;
          border-radius: 50%;
          background: #696cff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-list-input {
          flex: 1;
        }

        .epnj-list-remove {
          background: none;
          border: none;
          color: #ff3e1d;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          transition: background 0.2s ease;
        }

        .epnj-list-remove:hover {
          background: rgba(255, 62, 29, 0.1);
        }

        .epnj-add-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1.5px dashed #d9dee3;
          border-radius: 0.5rem;
          background: transparent;
          color: #54577A;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .epnj-add-item:hover {
          border-color: #696cff;
          color: #696cff;
          background: rgba(105, 108, 255, 0.05);
        }

        .epnj-form-section {
          margin-bottom: 2rem;
        }

        .epnj-form-section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #141522;
          margin-bottom: 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .epnj-form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-top: 1px solid #eceef1;
          background: #fff;
        }

        .epnj-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .epnj-btn-primary {
          background: #696cff;
          color: #fff;
        }

        .epnj-btn-primary:hover:not(:disabled) {
          background: #5a5de0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
        }

        .epnj-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .epnj-btn-secondary {
          background: #f5f5f9;
          color: #141522;
          border: 1px solid #d9dee3;
        }

        .epnj-btn-secondary:hover {
          background: #eceef1;
        }
      `}</style>
      <div className="epnj-page">
        <div className="epnj-header">
          <div className="epnj-header-top">
            <button 
              className="epnj-back-btn"
              onClick={() => navigate('/employer/job-listings/all')}
            >
              <ArrowLeft size={16} />
              Back to Jobs
            </button>
          </div>
          <h1 className="epnj-title">Post New Job</h1>
          <p className="epnj-subtitle">Create a comprehensive job listing for candidates to apply</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="epnj-card">
            <div className="epnj-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`epnj-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setActiveInlineEditor(null);
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="epnj-form-container">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Basic Information</h3>
                    <div className="epnj-form-grid">
                      <div className="epnj-form-group full-width">
                        <label className="epnj-form-label">
                          Job Title <span className="epnj-form-label-required">*</span>
                        </label>
                        <input
                          type="text"
                          className="epnj-form-input"
                          placeholder="e.g., Marketing Manager"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="epnj-form-group full-width">
                        <label className="epnj-form-label">
                          Company <span className="epnj-form-label-required">*</span>
                        </label>
                        {loadingCompanies ? (
                          <div className="epnj-form-input flex items-center gap-2 text-slate-500">
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                            Loading companies...
                          </div>
                        ) : companies.length === 0 ? (
                          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-amber-900 mb-1">
                                  No Company Found
                                </p>
                                <p className="text-xs text-amber-700 mb-3">
                                  You need to add a company before posting a job. Jobs must be affiliated with a company.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => navigate('/employer/company')}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Company
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <select
                              className="epnj-form-select"
                              value={formData.companyId}
                              onChange={(e) => handleCompanyChange(e.target.value)}
                              required
                            >
                              <option value="">Select Company</option>
                              {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                              ))}
                            </select>
                            {formData.companyId && (
                              <p className="text-xs text-slate-500 mt-1">
                                Selected: <span className="font-medium">{formData.company}</span>
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Company Logo URL</label>
                        <input
                          type="url"
                          className="epnj-form-input"
                          placeholder="https://..."
                          value={formData.companyLogo}
                          onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                          disabled={!!formData.companyId}
                        />
                        {formData.companyId && formData.companyLogo && (
                          <div className="mt-2 p-2 bg-slate-50 rounded-lg inline-block">
                            <img 
                              src={formData.companyLogo} 
                              alt="Company logo" 
                              className="h-12 w-12 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {formData.companyId && (
                          <p className="text-xs text-slate-500 mt-1">
                            Logo is auto-filled from company profile. You can override it if needed.
                          </p>
                        )}
                      </div>
                      {companies.length > 0 && (
                        <div className="epnj-form-group full-width">
                          <button
                            type="button"
                            onClick={() => navigate('/employer/company')}
                            className="text-sm text-slate-600 hover:text-slate-900 underline flex items-center gap-1"
                          >
                            <Building2 className="w-4 h-4" />
                            Manage Companies
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Salary</label>
                        <input
                          type="text"
                          className="epnj-form-input"
                          placeholder="e.g., GHS 3,000 - 5,000"
                          value={formData.salary}
                          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        />
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">
                          Job Category <span className="epnj-form-label-required">*</span>
                        </label>
                        <select
                          className="epnj-form-select"
                          value={formData.jobCategory}
                          onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                          required
                        >
                          <option value="">Select Job Category</option>
                          {jobCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">
                          Industry <span className="epnj-form-label-required">*</span>
                        </label>
                        <select
                          className="epnj-form-select"
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          required
                        >
                          <option value="">Select Industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Education Level</label>
                        <select
                          className="epnj-form-select"
                          value={formData.educationLevel}
                          onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                        >
                          {educationLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Experience Level</label>
                        <select
                          className="epnj-form-select"
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        >
                          {experienceLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Contract Type</label>
                        <select
                          className="epnj-form-select"
                          value={formData.contractType}
                          onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                        >
                          {contractTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Region</label>
                        <select
                          className="epnj-form-select"
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        >
                          {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">City</label>
                        <input
                          type="text"
                          className="epnj-form-input"
                          placeholder="e.g., Accra"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Description</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Description Paragraphs (Enter paragraphs separated by line breaks)</label>
                      <textarea
                        className="epnj-form-textarea"
                        placeholder="Enter job description paragraphs. Press Enter to create a new paragraph."
                        value={formData.descriptionParagraphs}
                        onChange={(e) => setFormData({ ...formData, descriptionParagraphs: e.target.value })}
                        rows={12}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Impact Tab */}
              {activeTab === 'impact' && (
                <>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Impact Paragraphs</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Impact Paragraphs (each paragraph)</label>
                      {(() => {
                        const items = formData.impactParagraphs ? formData.impactParagraphs.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <textarea
                                  className="epnj-form-textarea epnj-list-input"
                                  value={item}
                                  placeholder="Enter an impact paragraph"
                                  onChange={(e) => updateListItem('impactParagraphs', index, e.target.value)}
                                  rows={3}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('impactParagraphs', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('impactParagraphs')}
                            >
                              <Plus size={14} />
                              Add Paragraph
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Impact Highlights</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Impact Highlights (each point)</label>
                      {(() => {
                        const items = formData.impactHighlights ? formData.impactHighlights.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <input
                                  type="text"
                                  className="epnj-form-input epnj-list-input"
                                  value={item}
                                  placeholder="Enter an impact highlight"
                                  onChange={(e) => updateListItem('impactHighlights', index, e.target.value)}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('impactHighlights', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('impactHighlights')}
                            >
                              <Plus size={14} />
                              Add Highlight
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}

              {/* Field Ops Tab */}
              {activeTab === 'field-ops' && (
                <div className="epnj-form-section">
                  <h3 className="epnj-form-section-title">Field Operations</h3>
                  <div className="epnj-form-group full-width">
                    <label className="epnj-form-label">Field Operation Groups</label>
                    {(() => {
                      let groups: Array<{ title: string; items: string[] }> = [];
                      try {
                        if (formData.fieldOpsGroups) {
                          groups = JSON.parse(formData.fieldOpsGroups);
                        }
                      } catch (e) {
                        groups = [];
                      }
                      if (groups.length === 0) {
                        groups = [{ title: '', items: [''] }];
                      }
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {groups.map((group, groupIndex) => (
                            <div
                              key={groupIndex}
                              style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                padding: '1.5rem',
                                background: '#f9fafb',
                                position: 'relative'
                              }}
                            >
                              {groups.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = groups.filter((_, i) => i !== groupIndex);
                                    setFormData({
                                      ...formData,
                                      fieldOpsGroups: updated.length > 0 ? JSON.stringify(updated) : '',
                                    });
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    padding: '0.5rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    borderRadius: '0.375rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                  }}
                                  aria-label="Remove operation group"
                                >
                                  <X size={18} />
                                </button>
                              )}
                              <div style={{ marginBottom: '1rem' }}>
                                <label className="epnj-form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                                  Operation Head {groups.length > 1 && `#${groupIndex + 1}`}
                                </label>
                                <input
                                  type="text"
                                  className="epnj-form-input"
                                  value={group.title}
                                  placeholder="e.g., Health, Safety and Environment"
                                  onChange={(e) => {
                                    const updated = [...groups];
                                    updated[groupIndex] = { ...updated[groupIndex], title: e.target.value };
                                    setFormData({
                                      ...formData,
                                      fieldOpsGroups: JSON.stringify(updated),
                                    });
                                  }}
                                  style={{ width: '100%' }}
                                />
                              </div>
                              <div>
                                <label className="epnj-form-label" style={{ marginBottom: '0.5rem' }}>
                                  Operation List (each point)
                                </label>
                                {(() => {
                                  const items = group.items.length > 0 ? group.items : [''];
                                  return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      {items.map((item, itemIndex) => {
                                        const isActive =
                                          activeInlineEditor?.field === `fieldOpsItems_${groupIndex}` &&
                                          activeInlineEditor.index === itemIndex;
                                        return (
                                          <div
                                            key={itemIndex}
                                            style={{
                                              display: 'flex',
                                              flexDirection: isActive ? 'column' : 'row',
                                              alignItems: isActive ? 'stretch' : 'center',
                                              gap: '0.5rem',
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                width: '100%'
                                              }}
                                            >
                                              <span
                                                style={{
                                                  width: '1.5rem',
                                                  height: '1.5rem',
                                                  borderRadius: '50%',
                                                  background: '#696cff',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  fontSize: '0.75rem',
                                                  color: 'white',
                                                  fontWeight: 600,
                                                  flexShrink: 0
                                                }}
                                              >
                                                {itemIndex + 1}
                                              </span>
                                              {isActive ? (
                                                <textarea
                                                  className="epnj-form-textarea"
                                                  style={{ width: '100%' }}
                                                  value={item}
                                                  autoFocus
                                                  rows={4}
                                                  placeholder="Enter an operation item"
                                                  onChange={(e) => {
                                                    const updated = [...groups];
                                                    const updatedItems = [...items];
                                                    updatedItems[itemIndex] = e.target.value;
                                                    updated[groupIndex] = { ...updated[groupIndex], items: updatedItems };
                                                    setFormData({
                                                      ...formData,
                                                      fieldOpsGroups: JSON.stringify(updated),
                                                    });
                                                  }}
                                                  onBlur={() => setActiveInlineEditor(null)}
                                                />
                                              ) : (
                                                <input
                                                  type="text"
                                                  className="epnj-form-input"
                                                  style={{ flex: 1 }}
                                                  value={item}
                                                  placeholder="Enter an operation item"
                                                  onFocus={() =>
                                                    setActiveInlineEditor({
                                                      field: `fieldOpsItems_${groupIndex}`,
                                                      index: itemIndex,
                                                    })
                                                  }
                                                  onChange={(e) => {
                                                    const updated = [...groups];
                                                    const updatedItems = [...items];
                                                    updatedItems[itemIndex] = e.target.value;
                                                    updated[groupIndex] = { ...updated[groupIndex], items: updatedItems };
                                                    setFormData({
                                                      ...formData,
                                                      fieldOpsGroups: JSON.stringify(updated),
                                                    });
                                                  }}
                                                />
                                              )}
                                              {!isActive && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const updated = [...groups];
                                                    const updatedItems = items.filter((_, i) => i !== itemIndex);
                                                    updated[groupIndex] = { ...updated[groupIndex], items: updatedItems.length > 0 ? updatedItems : [''] };
                                                    setFormData({
                                                      ...formData,
                                                      fieldOpsGroups: JSON.stringify(updated),
                                                    });
                                                  }}
                                                  style={{
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: '#ff3e1d',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '0.25rem',
                                                    transition: 'background 0.2s ease',
                                                    flexShrink: 0
                                                  }}
                                                  onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 62, 29, 0.1)';
                                                  }}
                                                  onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                  }}
                                                  aria-label="Remove operation item"
                                                >
                                                  <X size={14} />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...groups];
                                          const updatedItems = [...items, ''];
                                          updated[groupIndex] = { ...updated[groupIndex], items: updatedItems };
                                          setFormData({
                                            ...formData,
                                            fieldOpsGroups: JSON.stringify(updated),
                                          });
                                        }}
                                        className="epnj-add-item"
                                      >
                                        <Plus size={14} />
                                        Add operation item
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...groups, { title: '', items: [''] }];
                              setFormData({
                                ...formData,
                                fieldOpsGroups: JSON.stringify(updated),
                              });
                            }}
                            style={{
                              alignSelf: 'flex-start',
                              padding: '0.625rem 1.25rem',
                              fontSize: '0.875rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #696cff',
                              background: 'white',
                              color: '#696cff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(105, 108, 255, 0.1)';
                              e.currentTarget.style.borderColor = '#5a5de0';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#696cff';
                            }}
                          >
                            <Plus size={16} />
                            Add Operation Group
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Formal Qualifications</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Formal Qualifications (each qualification)</label>
                      {(() => {
                        const items = formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <input
                                  type="text"
                                  className="epnj-form-input epnj-list-input"
                                  value={item}
                                  placeholder="Enter a qualification"
                                  onChange={(e) => updateListItem('skillsFormalQualifications', index, e.target.value)}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('skillsFormalQualifications', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('skillsFormalQualifications')}
                            >
                              <Plus size={14} />
                              Add Qualification
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Additional Knowledge</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Additional Knowledge (each item)</label>
                      {(() => {
                        const items = formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <input
                                  type="text"
                                  className="epnj-form-input epnj-list-input"
                                  value={item}
                                  placeholder="Enter knowledge item"
                                  onChange={(e) => updateListItem('skillsAdditionalKnowledge', index, e.target.value)}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('skillsAdditionalKnowledge', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('skillsAdditionalKnowledge')}
                            >
                              <Plus size={14} />
                              Add Knowledge Item
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Experience</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Experience Requirements (each item)</label>
                      {(() => {
                        const items = formData.skillsExperience ? formData.skillsExperience.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <input
                                  type="text"
                                  className="epnj-form-input epnj-list-input"
                                  value={item}
                                  placeholder="Enter experience requirement"
                                  onChange={(e) => updateListItem('skillsExperience', index, e.target.value)}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('skillsExperience', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('skillsExperience')}
                            >
                              <Plus size={14} />
                              Add Experience Item
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Technical Skills</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Technical Skills (each skill)</label>
                      {(() => {
                        const items = formData.skillsTechnical ? formData.skillsTechnical.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <input
                                  type="text"
                                  className="epnj-form-input epnj-list-input"
                                  value={item}
                                  placeholder="Enter technical skill"
                                  onChange={(e) => updateListItem('skillsTechnical', index, e.target.value)}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('skillsTechnical', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('skillsTechnical')}
                            >
                              <Plus size={14} />
                              Add Technical Skill
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Behavioral Attributes</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Behavioral Attributes (each attribute)</label>
                      {(() => {
                        const items = formData.behavioralAttributes ? formData.behavioralAttributes.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <input
                                  type="text"
                                  className="epnj-form-input epnj-list-input"
                                  value={item}
                                  placeholder="Enter behavioral attribute"
                                  onChange={(e) => updateListItem('behavioralAttributes', index, e.target.value)}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('behavioralAttributes', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('behavioralAttributes')}
                            >
                              <Plus size={14} />
                              Add Attribute
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Key Skills</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Key Skills (comma-separated)</label>
                      <input
                        type="text"
                        className="epnj-form-input"
                        placeholder="e.g., JavaScript, React, Node.js"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Culture Tab */}
              {activeTab === 'culture' && (
                <>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Culture Paragraphs</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Culture Paragraphs (each paragraph)</label>
                      {(() => {
                        const items = formData.cultureParagraphs ? formData.cultureParagraphs.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <textarea
                                  className="epnj-form-textarea epnj-list-input"
                                  value={item}
                                  placeholder="Enter a culture paragraph"
                                  onChange={(e) => updateListItem('cultureParagraphs', index, e.target.value)}
                                  rows={3}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('cultureParagraphs', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('cultureParagraphs')}
                            >
                              <Plus size={14} />
                              Add Paragraph
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Opportunity Paragraphs</h3>
                    <div className="epnj-form-group full-width">
                      <label className="epnj-form-label">Opportunity Paragraphs (each paragraph)</label>
                      {(() => {
                        const items = formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n') : [''];
                        return (
                          <>
                            {items.map((item, index) => (
                              <div key={index} className="epnj-list-item">
                                <div className="epnj-list-number">{index + 1}</div>
                                <textarea
                                  className="epnj-form-textarea epnj-list-input"
                                  value={item}
                                  placeholder="Enter an opportunity paragraph"
                                  onChange={(e) => updateListItem('opportunityParagraphs', index, e.target.value)}
                                  rows={3}
                                />
                                {items.length > 1 && (
                                  <button
                                    type="button"
                                    className="epnj-list-remove"
                                    onClick={() => removeListItem('opportunityParagraphs', index)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="epnj-add-item"
                              onClick={() => addListItem('opportunityParagraphs')}
                            >
                              <Plus size={14} />
                              Add Paragraph
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="epnj-form-section">
                    <h3 className="epnj-form-section-title">Application</h3>
                    <div className="epnj-form-grid">
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Image URL</label>
                        <input
                          type="url"
                          className="epnj-form-input"
                          placeholder="https://..."
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                      </div>
                      <div className="epnj-form-group">
                        <label className="epnj-form-label">Application URL</label>
                        <input
                          type="url"
                          className="epnj-form-input"
                          placeholder="https://..."
                          value={formData.applicationUrl}
                          onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="epnj-form-footer">
              <button
                type="button"
                className="epnj-btn epnj-btn-secondary"
                onClick={() => navigate('/employer/job-listings/all')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="epnj-btn epnj-btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Post Job
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostNewJob;
