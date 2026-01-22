import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ArrowRight,
  Plus,
  AlertCircle,
  ExternalLink,
  UserCheck,
  Clock
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
  const { jobId } = useParams<{ jobId?: string }>();
  const [activeTab, setActiveTab] = useState<'description' | 'impact' | 'field-ops' | 'skills' | 'culture'>('description');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeInlineEditor, setActiveInlineEditor] = useState<{ field: string; index: number } | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [showNoCompanyAlert, setShowNoCompanyAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobType, setEditingJobType] = useState<'job-listing' | 'internship' | 'nss' | 'graduate-recruitment'>('job-listing');
  const [wasVerified, setWasVerified] = useState(false);
  const [originalJobData, setOriginalJobData] = useState<any>(null);
  
  const [jobType, setJobType] = useState<'job-listing' | 'internship' | 'nss' | 'graduate-recruitment'>('job-listing');
  
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
    applicationUrl: '',
    // Additional fields for different job types
    duration: '',
    type: 'Full-time',
    stipend: '',
    requirements: ''
  });

  const tabs = [
    { id: 'description' as const, label: 'Description', icon: FileText },
    { id: 'impact' as const, label: 'Impact', icon: TrendingUp },
    { id: 'field-ops' as const, label: 'Field Ops', icon: Briefcase },
    { id: 'skills' as const, label: 'Skills & Experience', icon: GraduationCap },
    { id: 'culture' as const, label: 'Culture & Apply', icon: Users },
  ];

  // Get current tab index
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isLastTab = currentTabIndex >= 0 && currentTabIndex === tabs.length - 1;

  // Handle Next button - move to next tab
  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Double-check we're not on the last tab
    const currentIdx = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIdx >= 0 && currentIdx < tabs.length - 1) {
      const nextTab = tabs[currentIdx + 1];
      setActiveTab(nextTab.id);
      setActiveInlineEditor(null);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load employer's companies
  useEffect(() => {
    loadCompanies();
  }, []);

  // Load job for editing if jobId is present
  useEffect(() => {
    if (jobId && !isEditing) {
      loadJobForEdit(jobId);
    }
  }, [jobId]);

  // After companies are loaded and we're editing, match company by name if needed
  useEffect(() => {
    if (isEditing && !loadingCompanies && companies.length > 0 && formData.company && !formData.companyId) {
      const matchedCompany = companies.find(c => c.name === formData.company);
      if (matchedCompany) {
        setFormData(prev => ({
          ...prev,
          companyId: matchedCompany.id,
          companyLogo: matchedCompany.logo_url || prev.companyLogo
        }));
      }
    }
  }, [isEditing, loadingCompanies, companies, formData.company, formData.companyId]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Please log in to post jobs");
        navigate('/employer/auth');
        return;
      }

      // Get employer profile to find associated company
      const { data: employerProfile, error: profileError } = await supabase
        .from('employers' as any)
        .select('company_id, company_name')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle() to avoid errors if profile doesn't exist

      if (profileError) {
        console.error("Error loading employer profile:", profileError);
        setCompanies([]);
        setShowNoCompanyAlert(true);
        setLoadingCompanies(false);
        return;
      }

      if (!employerProfile) {
        setCompanies([]);
        setShowNoCompanyAlert(true);
        setLoadingCompanies(false);
        return;
      }

      // Build query to get only the employer's company
      let query = supabase
        .from('companies' as any)
        .select('id, name, logo_url, industry');

      const profile = employerProfile as any;

      // Filter by company_id if available (preferred method)
      if (profile?.company_id) {
        query = query.eq('id', profile.company_id);
      } else if (profile?.company_name) {
        // Fallback: filter by company name
        query = query.eq('name', profile.company_name);
      } else {
        // No company associated - show alert to create one
        setCompanies([]);
        setShowNoCompanyAlert(true);
        setLoadingCompanies(false);
        return;
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading companies:", error);
        toast.error("Failed to load companies");
        setCompanies([]);
        setShowNoCompanyAlert(true);
        return;
      }

      if (data && data.length > 0) {
        const companiesData = (data as unknown) as Company[];
        setCompanies(companiesData);
        // Auto-select the company (should only be one)
        if (companiesData.length === 1) {
          setFormData(prev => ({
            ...prev,
            company: companiesData[0].name,
            companyId: companiesData[0].id,
            companyLogo: companiesData[0].logo_url || ''
          }));
        }
      } else {
        // No company found - employer needs to create one
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

  const loadJobForEdit = async (id: string) => {
    setLoading(true);
    setIsEditing(true);
    try {
      // Try to load from jobs table first
      let { data: jobData, error: jobError } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (!jobError && jobData) {
        const job = jobData as any;
        setEditingJobType('job-listing');
        setJobType('job-listing');
        setWasVerified(job.verified || false);
        
        // Store original data for comparison
        setOriginalJobData({
          title: job.title || '',
          company: job.company || '',
          company_id: job.company_id || '',
          job_category: job.job_category || '',
          industry: job.industry || '',
          salary: job.salary || '',
          region: job.region || '',
          city: job.city || '',
          application_url: job.application_url || ''
        });
        
        setFormData({
          title: job.title || '',
          company: job.company || '',
          companyId: job.company_id || '',
          companyLogo: job.company_logo || '',
          descriptionParagraphs: Array.isArray(job.description_paragraphs) ? job.description_paragraphs.join('\n\n') : '',
          impactParagraphs: Array.isArray(job.impact_paragraphs) ? job.impact_paragraphs.join('\n') : '',
          impactHighlights: Array.isArray(job.impact_highlights) ? job.impact_highlights.join('\n') : '',
          fieldOpsGroups: job.field_ops_groups ? JSON.stringify(job.field_ops_groups, null, 2) : '',
          skillsFormalQualifications: Array.isArray(job.skills_formal_qualifications) ? job.skills_formal_qualifications.join('\n') : '',
          skillsAdditionalKnowledge: Array.isArray(job.skills_additional_knowledge) ? job.skills_additional_knowledge.join('\n') : '',
          skillsExperience: Array.isArray(job.skills_experience) ? job.skills_experience.join('\n') : '',
          skillsTechnical: Array.isArray(job.skills_technical) ? job.skills_technical.join('\n') : '',
          behavioralAttributes: Array.isArray(job.behavioral_attributes) ? job.behavioral_attributes.join('\n') : '',
          skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
          cultureParagraphs: Array.isArray(job.culture_paragraphs) ? job.culture_paragraphs.join('\n') : '',
          opportunityParagraphs: Array.isArray(job.opportunity_paragraphs) ? job.opportunity_paragraphs.join('\n') : '',
          jobCategory: job.job_category || '',
          industry: job.industry || '',
          educationLevel: job.education_level || 'Bachelor',
          experienceLevel: job.experience_level || '2 to 5 years',
          contractType: job.contract_type || 'Permanent contract',
          region: job.region || 'Greater Accra',
          city: job.city || '',
          salary: job.salary || '',
          imageUrl: job.image_url || '',
          applicationUrl: job.application_url || '',
          duration: '',
          type: 'Full-time',
          stipend: '',
          requirements: ''
        });
        setLoading(false);
        return;
      }

      // Try internships table
      let { data: internshipData, error: internshipError } = await supabase
        .from('internships' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (!internshipError && internshipData) {
        const internship = internshipData as any;
        setEditingJobType('internship');
        setJobType('internship');
        setWasVerified(false);
        
        // Store original data for internships (they don't have verified field, but store for consistency)
        setOriginalJobData({
          title: internship.title || '',
          company: internship.company || '',
          location: internship.location || '',
          application_url: internship.application_url || ''
        });
        
        const locationParts = (internship.location || '').split(',');
        // Try to find company by name if company_id not available
        let companyId = '';
        let companyLogo = internship.company_logo || '';
        if (internship.company && companies.length > 0) {
          const matchedCompany = companies.find(c => c.name === internship.company);
          if (matchedCompany) {
            companyId = matchedCompany.id;
            companyLogo = matchedCompany.logo_url || companyLogo;
          }
        }
        
        setFormData({
          title: internship.title || '',
          company: internship.company || '',
          companyId: companyId,
          companyLogo: companyLogo,
          descriptionParagraphs: Array.isArray(internship.description_paragraphs) ? internship.description_paragraphs.join('\n\n') : '',
          impactParagraphs: Array.isArray(internship.impact_paragraphs) ? internship.impact_paragraphs.join('\n') : '',
          impactHighlights: Array.isArray(internship.impact_highlights) ? internship.impact_highlights.join('\n') : '',
          fieldOpsGroups: internship.field_ops_groups ? JSON.stringify(internship.field_ops_groups, null, 2) : '',
          skillsFormalQualifications: Array.isArray(internship.skills_formal_qualifications) ? internship.skills_formal_qualifications.join('\n') : '',
          skillsAdditionalKnowledge: Array.isArray(internship.skills_additional_knowledge) ? internship.skills_additional_knowledge.join('\n') : '',
          skillsExperience: Array.isArray(internship.skills_experience) ? internship.skills_experience.join('\n') : '',
          skillsTechnical: Array.isArray(internship.skills_technical) ? internship.skills_technical.join('\n') : '',
          behavioralAttributes: Array.isArray(internship.behavioral_attributes) ? internship.behavioral_attributes.join('\n') : '',
          skills: Array.isArray(internship.skills) ? internship.skills.join(', ') : '',
          cultureParagraphs: Array.isArray(internship.culture_paragraphs) ? internship.culture_paragraphs.join('\n') : '',
          opportunityParagraphs: Array.isArray(internship.opportunity_paragraphs) ? internship.opportunity_paragraphs.join('\n') : '',
          jobCategory: '',
          industry: '',
          educationLevel: 'Bachelor',
          experienceLevel: '2 to 5 years',
          contractType: 'Permanent contract',
          region: locationParts[0]?.trim() || 'Greater Accra',
          city: locationParts[1]?.trim() || '',
          salary: '',
          imageUrl: internship.image_url || '',
          applicationUrl: internship.application_url || '',
          duration: internship.duration || '',
          type: internship.type || 'Full-time',
          stipend: internship.stipend || '',
          requirements: Array.isArray(internship.requirements) ? internship.requirements.join('\n') : ''
        });
        setLoading(false);
        return;
      }

      // Try nss_programs table
      let { data: nssData, error: nssError } = await supabase
        .from('nss_programs' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (!nssError && nssData) {
        const nss = nssData as any;
        setEditingJobType('nss');
        setJobType('nss');
        setWasVerified(false);
        
        // Store original data
        setOriginalJobData({
          title: nss.title || '',
          company: nss.company || '',
          location: nss.location || '',
          salary: nss.salary || '',
          duration: nss.duration || '',
          type: nss.type || '',
          application_url: nss.application_url || ''
        });
        
        const locationParts = (nss.location || '').split(',');
        
        // Try to find company by name if company_id not available
        let companyId = '';
        let companyLogo = nss.company_logo || '';
        if (nss.company) {
          const matchedCompany = companies.find(c => c.name === nss.company);
          if (matchedCompany) {
            companyId = matchedCompany.id;
            companyLogo = matchedCompany.logo_url || companyLogo;
          }
        }
        
        setFormData({
          title: nss.title || '',
          company: nss.company || '',
          companyId: companyId,
          companyLogo: companyLogo,
          descriptionParagraphs: Array.isArray(nss.description_paragraphs) ? nss.description_paragraphs.join('\n\n') : '',
          impactParagraphs: Array.isArray(nss.impact_paragraphs) ? nss.impact_paragraphs.join('\n') : '',
          impactHighlights: Array.isArray(nss.impact_highlights) ? nss.impact_highlights.join('\n') : '',
          fieldOpsGroups: nss.field_ops_groups ? JSON.stringify(nss.field_ops_groups, null, 2) : '',
          skillsFormalQualifications: Array.isArray(nss.skills_formal_qualifications) ? nss.skills_formal_qualifications.join('\n') : '',
          skillsAdditionalKnowledge: Array.isArray(nss.skills_additional_knowledge) ? nss.skills_additional_knowledge.join('\n') : '',
          skillsExperience: Array.isArray(nss.skills_experience) ? nss.skills_experience.join('\n') : '',
          skillsTechnical: Array.isArray(nss.skills_technical) ? nss.skills_technical.join('\n') : '',
          behavioralAttributes: Array.isArray(nss.behavioral_attributes) ? nss.behavioral_attributes.join('\n') : '',
          skills: Array.isArray(nss.skills) ? nss.skills.join(', ') : '',
          cultureParagraphs: Array.isArray(nss.culture_paragraphs) ? nss.culture_paragraphs.join('\n') : '',
          opportunityParagraphs: Array.isArray(nss.opportunity_paragraphs) ? nss.opportunity_paragraphs.join('\n') : '',
          jobCategory: '',
          industry: '',
          educationLevel: 'Bachelor',
          experienceLevel: '2 to 5 years',
          contractType: 'Permanent contract',
          region: locationParts[0]?.trim() || 'Greater Accra',
          city: locationParts[1]?.trim() || '',
          salary: nss.salary || '',
          imageUrl: nss.image_url || '',
          applicationUrl: nss.application_url || '',
          duration: nss.duration || '',
          type: nss.type || '',
          stipend: '',
          requirements: Array.isArray(nss.requirements) ? nss.requirements.join('\n') : ''
        });
        setLoading(false);
        return;
      }

      // Try graduate_programs table
      let { data: graduateData, error: graduateError } = await supabase
        .from('graduate_programs' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (!graduateError && graduateData) {
        const graduate = graduateData as any;
        setEditingJobType('graduate-recruitment');
        setJobType('graduate-recruitment');
        setWasVerified(false);
        
        // Store original data
        setOriginalJobData({
          title: graduate.title || '',
          company: graduate.company || '',
          location: graduate.location || '',
          salary: graduate.salary || '',
          duration: graduate.duration || '',
          type: graduate.type || '',
          application_url: graduate.application_url || ''
        });
        
        const locationParts = (graduate.location || '').split(',');
        
        // Try to find company by name if company_id not available
        let companyId = '';
        let companyLogo = graduate.company_logo || '';
        if (graduate.company) {
          const matchedCompany = companies.find(c => c.name === graduate.company);
          if (matchedCompany) {
            companyId = matchedCompany.id;
            companyLogo = matchedCompany.logo_url || companyLogo;
          }
        }
        
        setFormData({
          title: graduate.title || '',
          company: graduate.company || '',
          companyId: companyId,
          companyLogo: companyLogo,
          descriptionParagraphs: Array.isArray(graduate.description_paragraphs) ? graduate.description_paragraphs.join('\n\n') : '',
          impactParagraphs: Array.isArray(graduate.impact_paragraphs) ? graduate.impact_paragraphs.join('\n') : '',
          impactHighlights: Array.isArray(graduate.impact_highlights) ? graduate.impact_highlights.join('\n') : '',
          fieldOpsGroups: graduate.field_ops_groups ? JSON.stringify(graduate.field_ops_groups, null, 2) : '',
          skillsFormalQualifications: Array.isArray(graduate.skills_formal_qualifications) ? graduate.skills_formal_qualifications.join('\n') : '',
          skillsAdditionalKnowledge: Array.isArray(graduate.skills_additional_knowledge) ? graduate.skills_additional_knowledge.join('\n') : '',
          skillsExperience: Array.isArray(graduate.skills_experience) ? graduate.skills_experience.join('\n') : '',
          skillsTechnical: Array.isArray(graduate.skills_technical) ? graduate.skills_technical.join('\n') : '',
          behavioralAttributes: Array.isArray(graduate.behavioral_attributes) ? graduate.behavioral_attributes.join('\n') : '',
          skills: Array.isArray(graduate.skills) ? graduate.skills.join(', ') : '',
          cultureParagraphs: Array.isArray(graduate.culture_paragraphs) ? graduate.culture_paragraphs.join('\n') : '',
          opportunityParagraphs: Array.isArray(graduate.opportunity_paragraphs) ? graduate.opportunity_paragraphs.join('\n') : '',
          jobCategory: '',
          industry: '',
          educationLevel: 'Bachelor',
          experienceLevel: '2 to 5 years',
          contractType: 'Permanent contract',
          region: locationParts[0]?.trim() || 'Greater Accra',
          city: locationParts[1]?.trim() || '',
          salary: graduate.salary || '',
          imageUrl: graduate.image_url || '',
          applicationUrl: graduate.application_url || '',
          duration: graduate.duration || '',
          type: graduate.type || '',
          stipend: '',
          requirements: Array.isArray(graduate.requirements) ? graduate.requirements.join('\n') : ''
        });
        setLoading(false);
        return;
      }

      // If we get here, job not found in any table
      toast.error('Job not found');
      navigate('/employer/job-listings/all');
    } catch (error: any) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job for editing');
      navigate('/employer/job-listings/all');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Save as draft - no validation required
    setSubmitting(true);
    try {
      // Common data transformation
      const parseFieldOpsGroups = () => {
        if (!formData.fieldOpsGroups) return [];
        try {
          return JSON.parse(formData.fieldOpsGroups);
        } catch {
          return [];
        }
      };

      // Save to appropriate table based on job type
      if (jobType === 'job-listing') {
        // Professional job listing - save to jobs table as draft
        const jobData = {
          title: formData.title || 'Untitled Job',
          company: formData.company || 'Unknown Company',
          company_id: formData.companyId || null,
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          job_category: formData.jobCategory || null,
          industry: formData.industry || null,
          education_level: formData.educationLevel || null,
          experience_level: formData.experienceLevel || null,
          contract_type: formData.contractType || null,
          region: formData.region || null,
          city: formData.city || null,
          salary: formData.salary || null,
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          verified: false,
          featured: false,
          is_draft: true, // Mark as draft
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('jobs' as any)
          .insert(jobData);

        if (error) throw error;
        toast.success('Draft saved successfully!');
        navigate('/employer/job-listings/drafts');
      } else if (jobType === 'internship') {
        // Internship - save to internships table as draft
        const internshipData = {
          title: formData.title || 'Untitled Internship',
          company: formData.company || 'Unknown Company',
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          location: formData.region ? (formData.region + (formData.city ? `, ${formData.city}` : '')) : null,
          duration: formData.duration || null,
          type: formData.type || null,
          stipend: formData.stipend || null,
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          is_draft: true, // Mark as draft
          posted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('internships' as any)
          .insert(internshipData);

        if (error) throw error;
        toast.success('Draft saved successfully!');
        navigate('/employer/job-listings/drafts');
      } else if (jobType === 'nss') {
        // National Service Support - save to nss_programs table as draft
        const nssData = {
          title: formData.title || 'Untitled NSS Program',
          company: formData.company || 'Unknown Company',
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          location: formData.region ? (formData.region + (formData.city ? `, ${formData.city}` : '')) : null,
          duration: formData.duration || null,
          type: formData.type || null,
          salary: formData.salary || null,
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          is_draft: true, // Mark as draft
          posted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('nss_programs' as any)
          .insert(nssData);

        if (error) throw error;
        toast.success('Draft saved successfully!');
        navigate('/employer/job-listings/drafts');
      } else if (jobType === 'graduate-recruitment') {
        // Graduate Recruitment - save to graduate_programs table as draft
        const graduateData = {
          title: formData.title || 'Untitled Graduate Program',
          company: formData.company || 'Unknown Company',
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          location: formData.region ? (formData.region + (formData.city ? `, ${formData.city}` : '')) : null,
          duration: formData.duration || null,
          type: formData.type || null,
          salary: formData.salary || null,
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          is_draft: true, // Mark as draft
          posted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('graduate_programs' as any)
          .insert(graduateData);

        if (error) throw error;
        toast.success('Draft saved successfully!');
        navigate('/employer/job-listings/drafts');
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error('Error saving draft. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.companyId) {
      toast.error('Please select a company. If you don\'t have one, add it first in Company Management.');
      return;
    }

    // Validate based on job type
    if (jobType === 'job-listing' && (!formData.jobCategory || !formData.industry)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Common data transformation
      const parseFieldOpsGroups = () => {
        if (!formData.fieldOpsGroups) return [];
        try {
          return JSON.parse(formData.fieldOpsGroups);
        } catch {
          return [];
        }
      };

      // Save to appropriate table based on job type
      if (jobType === 'job-listing') {
        // Professional job listing - save to jobs table
        const jobData = {
          title: formData.title,
          company: formData.company,
          company_id: formData.companyId,
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
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
          is_draft: false, // Not a draft
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        if (isEditing && jobId) {
          // Check if critical fields changed - only require re-approval if critical fields changed
          const criticalFieldsChanged = originalJobData && wasVerified ? (
            originalJobData.title !== formData.title ||
            originalJobData.company !== formData.company ||
            originalJobData.company_id !== formData.companyId ||
            originalJobData.job_category !== formData.jobCategory ||
            originalJobData.industry !== formData.industry ||
            originalJobData.salary !== formData.salary ||
            originalJobData.region !== formData.region ||
            originalJobData.city !== formData.city ||
            originalJobData.application_url !== formData.applicationUrl
          ) : false;

          // Only set verified to false if it was verified AND critical fields changed
          if (wasVerified && criticalFieldsChanged) {
            jobData.verified = false;
          } else if (wasVerified) {
            // Keep verified status if only non-critical fields changed
            jobData.verified = true;
          }

          const { data, error } = await supabase
            .from('jobs' as any)
            .update(jobData)
            .eq('id', jobId)
            .select();

          if (error) throw error;
          
          if (wasVerified && criticalFieldsChanged) {
            toast.success('Job updated successfully! Since you changed critical information, it will be reviewed again before going live.');
          } else if (wasVerified) {
            toast.success('Job updated successfully! Your changes have been saved and the job remains active.');
          } else {
            toast.success('Job updated successfully!');
          }
        } else {
          const { data, error } = await supabase
            .from('jobs' as any)
            .insert(jobData)
            .select();

          if (error) throw error;
          toast.success('Job listing posted successfully! It will be reviewed before going live.');
        }
      } else if (jobType === 'internship') {
        // Internship - save to internships table
        const internshipData = {
          title: formData.title,
          company: formData.company,
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          location: formData.region + (formData.city ? `, ${formData.city}` : ''),
          duration: formData.duration || null,
          type: formData.type || 'Full-time',
          stipend: formData.stipend || null,
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          is_draft: false, // Not a draft
          posted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        if (isEditing && jobId) {
          const { data, error } = await supabase
            .from('internships' as any)
            .update(internshipData)
            .eq('id', jobId)
            .select();

          if (error) throw error;
          toast.success('Internship updated successfully!');
        } else {
        if (isEditing && jobId) {
          const { data, error } = await supabase
            .from('internships' as any)
            .update(internshipData)
            .eq('id', jobId)
            .select();

          if (error) throw error;
          toast.success('Internship updated successfully!');
        } else {
          const { data, error } = await supabase
            .from('internships' as any)
            .insert(internshipData)
            .select();

          if (error) throw error;
          toast.success('Internship listing posted successfully! It will be reviewed before going live.');
        }
        }
      } else if (jobType === 'nss') {
        // National Service Support - save to nss_programs table
        const nssData = {
          title: formData.title,
          company: formData.company,
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          location: formData.region + (formData.city ? `, ${formData.city}` : ''),
          duration: formData.duration || null,
          type: formData.type || null,
          salary: formData.salary || null,
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          is_draft: false, // Not a draft
          posted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        if (isEditing && jobId) {
          const { data, error } = await supabase
            .from('nss_programs' as any)
            .update(nssData)
            .eq('id', jobId)
            .select();

          if (error) throw error;
          toast.success('NSS program updated successfully!');
        } else {
        if (isEditing && jobId) {
          const { data, error } = await supabase
            .from('nss_programs' as any)
            .update(nssData)
            .eq('id', jobId)
            .select();

          if (error) throw error;
          toast.success('NSS program updated successfully!');
        } else {
          const { data, error } = await supabase
            .from('nss_programs' as any)
            .insert(nssData)
            .select();

          if (error) throw error;
          toast.success('NSS program posted successfully! It will be reviewed before going live.');
        }
        }
      } else if (jobType === 'graduate-recruitment') {
        // Graduate Recruitment - save to graduate_programs table
        const graduateData = {
          title: formData.title,
          company: formData.company,
          company_logo: formData.companyLogo || null,
          description_paragraphs: formData.descriptionParagraphs ? formData.descriptionParagraphs.split('\n').filter(Boolean) : [],
          impact_paragraphs: formData.impactParagraphs ? formData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: formData.impactHighlights ? formData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: parseFieldOpsGroups(),
          skills_formal_qualifications: formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: formData.skillsExperience ? formData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: formData.skillsTechnical ? formData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: formData.behavioralAttributes ? formData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          culture_paragraphs: formData.cultureParagraphs ? formData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: formData.opportunityParagraphs ? formData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          location: formData.region + (formData.city ? `, ${formData.city}` : ''),
          duration: formData.duration || null,
          type: formData.type || null,
          salary: formData.salary || null,
          requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
          image_url: formData.imageUrl || null,
          application_url: formData.applicationUrl || null,
          is_draft: false, // Not a draft
          posted: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        };

        if (isEditing && jobId) {
          const { data, error } = await supabase
            .from('graduate_programs' as any)
            .update(graduateData)
            .eq('id', jobId)
            .select();

          if (error) throw error;
          toast.success('Graduate program updated successfully!');
        } else {
          const { data, error } = await supabase
            .from('graduate_programs' as any)
            .insert(graduateData)
            .select();

          if (error) throw error;
          toast.success('Graduate program posted successfully! It will be reviewed before going live.');
        }
      }

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

        /* Desktop: 1024px and above */
        @media (min-width: 1024px) {
          .epnj-page {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
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

        /* Desktop: 1024px and above */
        @media (min-width: 1024px) {
          .epnj-form-container {
            padding: 2rem 3rem;
          }
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
          <h1 className="epnj-title">{isEditing ? 'Edit Job' : 'Post New Job'}</h1>
          <p className="epnj-subtitle">{isEditing ? 'Update your job listing details' : 'Create a comprehensive job listing for candidates to apply'}</p>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          // Prevent Enter key from submitting form when not on last tab
          if (e.key === 'Enter' && !isLastTab) {
            e.preventDefault();
          }
        }}>
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
                          Job Type <span className="epnj-form-label-required">*</span>
                        </label>
                        <select
                          className="epnj-form-select"
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value as 'job-listing' | 'internship' | 'nss' | 'graduate-recruitment')}
                          required
                        >
                          <option value="job-listing">Professional Job</option>
                          <option value="internship">Internship Listings</option>
                          <option value="nss">National Service Support</option>
                          <option value="graduate-recruitment">Graduate Recruitment</option>
                        </select>
                      </div>
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
                      {/* Job Category and Industry - Only for Job Listing */}
                      {jobType === 'job-listing' && (
                        <>
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
                        </>
                      )}

                      {/* Duration, Type, Stipend - For Internship, NSS, Graduate */}
                      {jobType !== 'job-listing' && (
                        <>
                          <div className="epnj-form-group">
                            <label className="epnj-form-label">Duration</label>
                            <input
                              type="text"
                              className="epnj-form-input"
                              placeholder={jobType === 'internship' ? 'e.g., 3-6 months' : 'e.g., 12 months'}
                              value={formData.duration}
                              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                          </div>
                          <div className="epnj-form-group">
                            <label className="epnj-form-label">Type</label>
                            <select
                              className="epnj-form-select"
                              value={formData.type}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Remote">Remote</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>
                          {jobType === 'internship' && (
                            <div className="epnj-form-group">
                              <label className="epnj-form-label">Stipend</label>
                              <input
                                type="text"
                                className="epnj-form-input"
                                placeholder="e.g., GHS 500/month"
                                value={formData.stipend}
                                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                              />
                            </div>
                          )}
                        </>
                      )}
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
                type="button"
                className="epnj-btn epnj-btn-secondary"
                onClick={handleSaveDraft}
                disabled={submitting}
                style={{ marginRight: '0.5rem' }}
              >
                {submitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Clock size={16} />
                    Save as Draft
                  </>
                )}
              </button>
              {isLastTab ? (
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
              ) : (
                <button
                  type="button"
                  className="epnj-btn epnj-btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext(e);
                  }}
                >
                  <ArrowRight size={16} />
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostNewJob;
