import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, X, Edit2, Trash2, 
  ChevronLeft, ChevronRight,
  Save, Loader2, Grid3x3, List,
  Building2, Briefcase,
  AlertCircle, Globe, Mail, Phone,
  Calendar, Users, Sparkles, FileText,
  TrendingUp, GraduationCap, Info, Clock,
  DollarSign, MapPin, CheckCircle2, XCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Company Interface
interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  industry: string;
  employees: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  location?: string;
  jobCount?: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CompanyFormData {
  name: string;
  logoUrl: string;
  description: string;
  industry: string;
  employees: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  featured: boolean;
}

// Company Positions Manager Component
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
    skills: string[];
    cultureParagraphs?: string[];
    opportunityParagraphs?: string[];
    jobCategory: string;
    industry: string;
    educationLevel: string;
    experienceLevel: string;
    contractType: string;
    region: string;
    city: string;
    date: string;
    verified: boolean;
    featured: boolean;
    salary?: string;
    imageUrl?: string;
    applicationUrl?: string;
    company_id?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  interface JobFormData {
    title: string;
    company: string;
    companyLogo: string;
    descriptionParagraphs: string;
    impactParagraphs: string;
    impactHighlights: string;
    fieldOpsGroups: string;
    skillsFormalQualifications: string;
    skillsAdditionalKnowledge: string;
    skillsExperience: string;
    skillsTechnical: string;
    behavioralAttributes: string;
    skills: string;
    cultureParagraphs: string;
    opportunityParagraphs: string;
    jobCategory: string;
    industry: string;
    educationLevel: string;
    experienceLevel: string;
    contractType: string;
    region: string;
    city: string;
    salary: string;
    verified: boolean;
    featured: boolean;
    imageUrl: string;
    applicationUrl: string;
  }
  
  interface CompanyPositionsManagerProps {
    company: Company;
    onClose: () => void;
  }
  
  const CompanyPositionsManager = ({ company, onClose }: CompanyPositionsManagerProps) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);
    const [activeFormTab, setActiveFormTab] = useState<"description" | "impact" | "field-ops" | "skills" | "culture">("description");
    const [activeInlineEditor, setActiveInlineEditor] = useState<{ field: string; index: number } | null>(null);
  
    const [formData, setFormData] = useState<JobFormData>({
      title: "",
      company: company.name,
      companyLogo: company.logoUrl || "",
      descriptionParagraphs: "",
      impactParagraphs: "",
      impactHighlights: "",
      fieldOpsGroups: "",
      skillsFormalQualifications: "",
      skillsAdditionalKnowledge: "",
      skillsExperience: "",
      skillsTechnical: "",
      behavioralAttributes: "",
      skills: "",
      cultureParagraphs: "",
      opportunityParagraphs: "",
      jobCategory: "",
      industry: company.industry || "",
      educationLevel: "Bachelor",
      experienceLevel: "2 to 5 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "",
      salary: "",
      verified: true,
      featured: false,
      imageUrl: "",
      applicationUrl: "",
    });
  
    // Import all the dropdown options from VerifiedJobListingsManager
    const jobCategories = [
      "Accounting, controlling, finance",
      "Health and social professions",
      "HR, training",
      "IT, new technologies",
      "Legal",
      "Management",
      "Marketing, communication",
      "Production, maintenance, quality",
      "Public buildings and works professions",
      "Purchases",
      "R&D, project management",
      "Sales",
      "Secretarial work, assistantship",
      "Services",
      "Telemarketing, teleassistance",
      "Tourism, hotel business and catering",
      "Transport, logistics",
    ];
  
    const industries = [
      "Advice, audit, accounting",
      "Aeronautics, naval",
      "Agriculture, fishing, aquaculture",
      "Airport and shipping services",
      "Associative activities",
      "Banking, insurance, finance",
      "Call centers, hotlines",
      "Chemistry, petrochemistry, raw materials, mining",
      "Cleaning, security, surveillance",
      "Consumer goods",
      "Distribution, selling, wholesale",
      "Edition, printing",
      "Education, training",
      "Electric, electronic, optical and precision equipments",
      "Electricity, water, gas, nuclear, energy",
      "Engineering, development studies",
      "Environment, recycling",
      "Event, receptionist",
      "Food-processing industry",
      "Furnishing, decoration",
      "Government services",
      "Greenways, forests, hunting",
      "Handling",
      "Health, pharmacy, hospitals, medical equipment",
      "Hotel business, catering",
      "Import-export business",
      "Industry, production, manufacturing and other",
      "IT, software engineering, Internet",
      "Luxury, cosmetics",
      "Maintenance, servicing, after-sales services",
      "Marketing, communication, media",
      "Mechanical equipment, machines",
      "Metallurgy, steel industry",
      "Motor, transportation equipment, reparation",
      "Paper, wood, rubber, plastic, glass, tobacco",
      "Pharmaceutical industry",
      "Public buildings and works sector, construction",
      "Quality, methods",
      "Real-estate, architecture, town planning",
      "Rental",
      "Research and development",
      "Secretarial work",
      "Services other",
      "Social, public and human services",
      "Sports, cultural and social action",
      "Telecom",
      "Temporary work, recruitment",
      "Textile, leather, shoes, clothing industry",
      "Tourism, leisure activities",
      "Transport, logistics, postal services",
    ];
  
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
  
    useEffect(() => {
      loadJobs();
    }, [company.id]);
  
    const loadJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs' as any)
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });
  
        if (error) {
          console.error("Error loading jobs:", error);
          toast.error("Failed to load positions");
          setJobs([]);
          return;
        }
  
        if (data) {
          const transformed: Job[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            company: item.company || company.name,
            companyLogo: item.company_logo || company.logoUrl,
            description: item.description || "",
            descriptionParagraphs: item.description_paragraphs || [],
            impactParagraphs: item.impact_paragraphs || [],
            impactHighlights: item.impact_highlights || [],
            fieldOpsGroups: item.field_ops_groups || [],
            skillsFormalQualifications: item.skills_formal_qualifications || [],
            skillsAdditionalKnowledge: item.skills_additional_knowledge || [],
            skillsExperience: item.skills_experience || [],
            skillsTechnical: item.skills_technical || [],
            behavioralAttributes: item.behavioral_attributes || [],
            skills: item.skills || [],
            cultureParagraphs: item.culture_paragraphs || [],
            opportunityParagraphs: item.opportunity_paragraphs || [],
            jobCategory: item.job_category || "",
            industry: item.industry || company.industry || "",
            educationLevel: item.education_level || "Bachelor",
            experienceLevel: item.experience_level || "2 to 5 years",
            contractType: item.contract_type || "Permanent contract",
            region: item.region || "Greater Accra",
            city: item.city || "",
            date: item.date || new Date().toISOString().split('T')[0],
            verified: item.verified || false,
            featured: item.featured || false,
            salary: item.salary,
            imageUrl: item.image_url,
            applicationUrl: item.application_url,
            company_id: item.company_id || company.id,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));
          setJobs(transformed);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load positions");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
  
    const filteredJobs = useMemo(() => {
      if (!searchQuery) return jobs;
      const query = searchQuery.toLowerCase();
      return jobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.city.toLowerCase().includes(query) ||
        job.region.toLowerCase().includes(query)
      );
    }, [jobs, searchQuery]);
  
    const handleSave = async (jobData: JobFormData, jobId?: string) => {
      setSaving(true);
      try {
        // Parse field ops groups safely
        let fieldOpsGroupsParsed = [];
        if (jobData.fieldOpsGroups) {
          try {
            fieldOpsGroupsParsed = JSON.parse(jobData.fieldOpsGroups);
          } catch (e) {
            console.error("Error parsing field ops groups:", e);
          }
        }
  
        // Extract first paragraph as short description for listings (split by double newlines for paragraphs)
        const paragraphs = jobData.descriptionParagraphs ? jobData.descriptionParagraphs.split('\n\n').filter(Boolean) : [];
        const firstParagraph = paragraphs[0] || '';
  
        const jobPayload: any = {
          title: jobData.title,
          company: jobData.company || company.name,
          company_logo: jobData.companyLogo || company.logoUrl,
          description: firstParagraph || '',
          description_paragraphs: paragraphs,
          impact_paragraphs: jobData.impactParagraphs ? jobData.impactParagraphs.split('\n').filter(Boolean) : [],
          impact_highlights: jobData.impactHighlights ? jobData.impactHighlights.split('\n').filter(Boolean) : [],
          field_ops_groups: fieldOpsGroupsParsed,
          skills_formal_qualifications: jobData.skillsFormalQualifications ? jobData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
          skills_additional_knowledge: jobData.skillsAdditionalKnowledge ? jobData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
          skills_experience: jobData.skillsExperience ? jobData.skillsExperience.split('\n').filter(Boolean) : [],
          skills_technical: jobData.skillsTechnical ? jobData.skillsTechnical.split('\n').filter(Boolean) : [],
          behavioral_attributes: jobData.behavioralAttributes ? jobData.behavioralAttributes.split('\n').filter(Boolean) : [],
          skills: jobData.skills.split(',').map(s => s.trim()).filter(Boolean),
          culture_paragraphs: jobData.cultureParagraphs ? jobData.cultureParagraphs.split('\n').filter(Boolean) : [],
          opportunity_paragraphs: jobData.opportunityParagraphs ? jobData.opportunityParagraphs.split('\n').filter(Boolean) : [],
          job_category: jobData.jobCategory,
          industry: jobData.industry || company.industry,
          education_level: jobData.educationLevel,
          experience_level: jobData.experienceLevel,
          contract_type: jobData.contractType,
          region: jobData.region,
          city: jobData.city,
          salary: jobData.salary,
          verified: jobData.verified,
          featured: jobData.featured,
          image_url: jobData.imageUrl,
          application_url: jobData.applicationUrl,
          company_id: company.id, // Always associate with the selected company
          date: new Date().toISOString().split('T')[0],
        };
  
        if (jobId) {
          const { error } = await supabase
            .from('jobs' as any)
            .update(jobPayload)
            .eq('id', jobId);
  
          if (error) throw error;
          toast.success("Position updated successfully");
        } else {
          const { error } = await supabase
            .from('jobs' as any)
            .insert([jobPayload]);
  
          if (error) throw error;
          toast.success("Position created successfully");
        }
  
        await loadJobs();
        setShowAddForm(false);
        setEditing(null);
        resetForm();
      } catch (error: any) {
        console.error("Error saving position:", error);
        toast.error(error.message || "Failed to save position");
      } finally {
        setSaving(false);
      }
    };
  
    const handleDelete = async (jobId: string) => {
      try {
        const { error } = await supabase
          .from('jobs' as any)
          .delete()
          .eq('id', jobId);
  
        if (error) throw error;
        toast.success("Position deleted successfully");
        await loadJobs();
        setDeleteModalOpen(false);
        setJobToDelete(null);
        onClose(); // Refresh company list to update job counts
      } catch (error: any) {
        console.error("Error deleting position:", error);
        toast.error(error.message || "Failed to delete position");
      }
    };
  
    const resetForm = () => {
      setFormData({
        title: "",
        company: company.name,
        companyLogo: company.logoUrl || "",
        descriptionParagraphs: "",
        impactParagraphs: "",
        impactHighlights: "",
        fieldOpsGroups: "",
        skillsFormalQualifications: "",
        skillsAdditionalKnowledge: "",
        skillsExperience: "",
        skillsTechnical: "",
        behavioralAttributes: "",
        skills: "",
        cultureParagraphs: "",
        opportunityParagraphs: "",
        jobCategory: "",
        industry: company.industry || "",
        educationLevel: "Bachelor",
        experienceLevel: "2 to 5 years",
        contractType: "Permanent contract",
        region: "Greater Accra",
        city: "",
        salary: "",
        verified: true,
        featured: false,
        imageUrl: "",
        applicationUrl: "",
      });
      setActiveFormTab("description");
    };
  
    const handleEdit = (job: Job) => {
      setEditing(job.id);
      setFormData({
        title: job.title,
        company: job.company || company.name,
        companyLogo: job.companyLogo || company.logoUrl || "",
        descriptionParagraphs: job.descriptionParagraphs?.join('\n\n') || "",
        impactParagraphs: job.impactParagraphs?.join('\n') || "",
        impactHighlights: job.impactHighlights?.join('\n') || "",
        fieldOpsGroups: job.fieldOpsGroups ? JSON.stringify(job.fieldOpsGroups, null, 2) : "",
        skillsFormalQualifications: job.skillsFormalQualifications?.join('\n') || "",
        skillsAdditionalKnowledge: job.skillsAdditionalKnowledge?.join('\n') || "",
        skillsExperience: job.skillsExperience?.join('\n') || "",
        skillsTechnical: job.skillsTechnical?.join('\n') || "",
        behavioralAttributes: job.behavioralAttributes?.join('\n') || "",
        skills: job.skills.join(', '),
        cultureParagraphs: job.cultureParagraphs?.join('\n') || "",
        opportunityParagraphs: job.opportunityParagraphs?.join('\n') || "",
        jobCategory: job.jobCategory || "",
        industry: job.industry || company.industry || "",
        educationLevel: job.educationLevel,
        experienceLevel: job.experienceLevel,
        contractType: job.contractType,
        region: job.region,
        city: job.city,
        salary: job.salary || "",
        verified: job.verified,
        featured: job.featured,
        imageUrl: job.imageUrl || "",
        applicationUrl: job.applicationUrl || "",
      });
      setActiveFormTab("description");
      setShowAddForm(true);
    };
  
    // Import the same isolated styles from VerifiedJobListingsManager
    const isolatedStyles = `
      .sm-form-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        overflow-y: auto;
      }
  
      .sm-form-content {
        background: white;
        border-radius: 0.75rem;
        width: 100%;
        max-width: 1200px;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        position: relative;
      }
  
      .sm-form-header {
        padding: 1.5rem 2rem;
        border-bottom: 2px solid #60a5fa;
        background: #111827;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 10;
      }
  
      .sm-form-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }
  
      .sm-form-body {
        padding: 2rem;
        overflow-y: auto;
        flex: 1;
        background: #ffffff;
        min-height: 300px;
      }
  
      .sm-form-section {
        margin-bottom: 2rem;
      }
  
      .sm-form-section-title {
        font-size: 1rem;
        font-weight: 600;
        color: #111827;
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e5e7eb;
      }
  
      .sm-form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
      }
  
      .sm-form-group {
        display: flex;
        flex-direction: column;
      }
  
      .sm-form-group.full-width {
        grid-column: 1 / -1;
      }
  
      .sm-form-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
      }
  
      .sm-form-input,
      .sm-form-select,
      .sm-form-textarea {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        transition: all 0.2s;
      }
  
      .sm-form-input:focus,
      .sm-form-select:focus,
      .sm-form-textarea:focus {
        outline: none;
        border-color: #60a5fa;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
      }
  
      .sm-form-textarea {
        min-height: 100px;
        resize: vertical;
      }
  
      .sm-form-footer {
        padding: 1.5rem 2rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        background: #f9fafb;
        margin-left: 280px;
        position: relative;
        z-index: 10;
      }
  
      .sm-icon-btn {
        padding: 0.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 0.375rem;
        color: #6b7280;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      .sm-icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
  
      .sm-form-layout {
        display: flex;
        flex: 1;
        overflow: hidden;
        position: relative;
      }

      .sm-form-sidebar {
        width: 280px;
        background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        position: absolute;
        top: 73px;
        left: 0;
        right: auto;
        bottom: 0;
        z-index: 1;
      }

      .sm-form-sidebar::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent 0%, rgba(96, 165, 250, 0.3) 50%, transparent 100%);
      }

      .sm-form-sidebar::-webkit-scrollbar {
        width: 6px;
      }

      .sm-form-sidebar::-webkit-scrollbar-track {
        background: transparent;
      }

      .sm-form-sidebar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }

      .sm-form-sidebar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .sm-form-tabs {
        display: flex;
        flex-direction: column;
        padding: 1rem 0.5rem;
        gap: 0.25rem;
      }
  
      .sm-form-tab {
        padding: 1rem 1.25rem;
        background: transparent;
        border: none;
        border-left: 3px solid transparent;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        white-space: nowrap;
        border-radius: 0.5rem;
        margin: 0 0.5rem;
      }

      .sm-form-tab::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #60a5fa;
        transform: scaleY(0);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 0 3px 3px 0;
      }
  
      .sm-form-tab:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(4px);
      }
  
      .sm-form-tab.active {
        color: #ffffff;
        font-weight: 600;
        background: linear-gradient(90deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.05) 100%);
        border-left-color: #60a5fa;
        box-shadow: 0 2px 12px rgba(96, 165, 250, 0.25), inset 0 0 20px rgba(96, 165, 250, 0.1);
      }

      .sm-form-tab.active::before {
        transform: scaleY(1);
      }

      .sm-form-tab svg {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .sm-form-tab.active svg {
        transform: scale(1.1);
        color: #60a5fa;
      }

      .sm-form-content-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-left: 280px;
        min-height: 0;
      }
  
      .sm-form-tab-content {
        animation: fadeIn 0.3s ease-in-out;
        min-height: 300px;
      }
  
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
  
      .sm-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
      }
  
      .sm-btn-primary {
        background: #60a5fa;
        color: #ffffff;
      }
  
      .sm-btn-primary:hover:not(:disabled) {
        background: #3b82f6;
      }
  
      .sm-btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
  
      .sm-btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }
  
      .sm-btn-secondary:hover {
        background: #e5e7eb;
      }
  
      @media (max-width: 767px) {
        .sm-form-grid {
          grid-template-columns: 1fr;
        }
  
        .sm-form-layout {
          flex-direction: column;
        }

        .sm-form-sidebar {
          position: relative;
          width: 100%;
          max-height: 200px;
          border-right: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sm-form-content-area {
          margin-left: 0;
        }

        .sm-form-footer {
          margin-left: 0;
        }

        .sm-form-tabs {
          flex-direction: row;
          padding: 0.5rem;
          overflow-x: auto;
          overflow-y: hidden;
        }
  
        .sm-form-tab {
          padding: 0.75rem 1rem;
          font-size: 0.8125rem;
          white-space: nowrap;
          border-left: none;
          border-bottom: 3px solid transparent;
          margin: 0;
        }

        .sm-form-tab::before {
          display: none;
        }

        .sm-form-tab.active {
          border-left: none;
          border-bottom-color: #60a5fa;
        }

        .sm-form-tab:hover {
          transform: none;
        }
      }
    `;
  
    return (
      <>
        <style>{isolatedStyles}</style>
        {!showAddForm && (
          <div className="sm-form-modal" onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}>
            <div className="sm-form-content" style={{ maxWidth: '1200px' }}>

              {/* Header */}
              <div className="sm-form-header">
              <div>
                <h2 className="sm-form-title">Manage Positions - {company.name}</h2>
                <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.875rem', color: '#d1d5db' }}>
                  {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button className="sm-icon-btn" style={{ color: 'white' }} onClick={onClose}>
                <X size={20} />
              </button>
            </div>
  
            {/* Content */}
            <div className="sm-form-body">
              {/* Search and Actions */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Input
                  type="text"
                  placeholder="Search positions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    resetForm();
                    setEditing(null);
                    setShowAddForm(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Position
                </Button>
              </div>
  
              {/* Jobs List */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No positions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.city}, {job.region}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary || "Salary not specified"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.contractType}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(job)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setJobToDelete(job.id);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="sm-form-modal" style={{ zIndex: 1000 }} onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddForm(false);
              setEditing(null);
            }
          }}>
              <div className="sm-form-content" style={{ maxWidth: '1200px' }}>
                <div className="sm-form-header">
                  <h2 className="sm-form-title">{editing ? 'Edit Position' : 'Add New Position'}</h2>
                  <button className="sm-icon-btn" style={{ color: 'white' }} onClick={() => {
                    setShowAddForm(false);
                    setEditing(null);
                  }}>
                    <X size={20} />
                  </button>
                </div>
  
                {/* Sidebar Navigation - Positioned absolutely to extend to bottom */}
                <div className="sm-form-sidebar">
                  <div style={{ 
                    padding: '1.5rem 1rem 1rem 1rem', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0
                    }}>
                      Navigation
                    </h3>
                  </div>
                  <div className="sm-form-tabs">
                    <button
                      onClick={() => {
                        setActiveFormTab("description");
                        setActiveInlineEditor(null);
                      }}
                      className={`sm-form-tab ${activeFormTab === "description" ? "active" : ""}`}
                    >
                      <FileText size={18} />
                      <span>Description</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFormTab("impact");
                        setActiveInlineEditor(null);
                      }}
                      className={`sm-form-tab ${activeFormTab === "impact" ? "active" : ""}`}
                    >
                      <TrendingUp size={18} />
                      <span>Impact</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFormTab("field-ops");
                        setActiveInlineEditor(null);
                      }}
                      className={`sm-form-tab ${activeFormTab === "field-ops" ? "active" : ""}`}
                    >
                      <Briefcase size={18} />
                      <span>Field Ops</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFormTab("skills");
                        setActiveInlineEditor(null);
                      }}
                      className={`sm-form-tab ${activeFormTab === "skills" ? "active" : ""}`}
                    >
                      <GraduationCap size={18} />
                      <span>Skills & Experience</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFormTab("culture");
                        setActiveInlineEditor(null);
                      }}
                      className={`sm-form-tab ${activeFormTab === "culture" ? "active" : ""}`}
                    >
                      <Users size={18} />
                      <span>Culture & Apply</span>
                    </button>
                  </div>
                </div>

                {/* Sidebar Layout */}
                <div className="sm-form-layout">
                  {/* Content Area */}
                  <div className="sm-form-content-area">
                    <div className="sm-form-body">
                  {/* Description Tab */}
                  {activeFormTab === "description" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="sm-form-tab-content"
                    >
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Basic Information</h3>
                        <div className="sm-form-grid">
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Job Title *</label>
                            <input
                              type="text"
                              className="sm-form-input"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="e.g., Marketing Manager"
                            />
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Company *</label>
                            <input
                              type="text"
                              className="sm-form-input"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder="Company name"
                              readOnly
                              style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Company Logo URL</label>
                            <input
                              type="url"
                              className="sm-form-input"
                              value={formData.companyLogo}
                              onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">City *</label>
                            <input
                              type="text"
                              className="sm-form-input"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="e.g., Accra"
                            />
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Region *</label>
                            <select
                              className="sm-form-select"
                              value={formData.region}
                              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            >
                              {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Salary</label>
                            <input
                              type="text"
                              className="sm-form-input"
                              value={formData.salary}
                              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                              placeholder="e.g., GHS 5,000 - 8,000"
                            />
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Job Category</label>
                            <select
                              className="sm-form-select"
                              value={formData.jobCategory}
                              onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                            >
                              <option value="">Select category</option>
                              {jobCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Industry</label>
                            <select
                              className="sm-form-select"
                              value={formData.industry}
                              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            >
                              <option value="">Select industry</option>
                              {industries.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Education Level</label>
                            <select
                              className="sm-form-select"
                              value={formData.educationLevel}
                              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                            >
                              {educationLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Experience Level</label>
                            <select
                              className="sm-form-select"
                              value={formData.experienceLevel}
                              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                            >
                              {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Contract Type</label>
                            <select
                              className="sm-form-select"
                              value={formData.contractType}
                              onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                            >
                              {contractTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Description</h3>
                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">Description Paragraphs *</label>
                          <p className="text-xs text-slate-500 mb-2">Enter paragraphs separated by double line breaks (press Enter twice)</p>
                          <textarea
                            className="sm-form-textarea"
                            value={formData.descriptionParagraphs}
                            onChange={(e) => setFormData({ ...formData, descriptionParagraphs: e.target.value })}
                            placeholder="Enter job description paragraphs...&#10;&#10;Separate paragraphs with double line breaks."
                            rows={10}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
  
                  {/* Impact Tab */}
                  {activeFormTab === "impact" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="sm-form-tab-content"
                    >
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Impact Paragraphs</h3>
                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">Impact Paragraphs (one per line)</label>
                          {(() => {
                            const items = formData.impactParagraphs ? formData.impactParagraphs.split("\n") : [""];
                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {items.map((item, index) => {
                                  const isActive =
                                    activeInlineEditor?.field === "impactParagraphs" &&
                                    activeInlineEditor.index === index;
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        flexDirection: isActive ? "column" : "row",
                                        alignItems: isActive ? "stretch" : "center",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f3f4f6",
                                            borderRadius: "0.25rem",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "#374151",
                                          }}
                                        >
                                          {index + 1}
                                        </span>
                                        {!isActive && (
                                          <span
                                            style={{
                                              flex: 1,
                                              padding: "0.5rem",
                                              background: "#f9fafb",
                                              borderRadius: "0.375rem",
                                              fontSize: "0.875rem",
                                              color: "#374151",
                                            }}
                                            onClick={() => setActiveInlineEditor({ field: "impactParagraphs", index })}
                                          >
                                            {item || "Click to edit..."}
                                          </span>
                                        )}
                                        {isActive && (
                                          <textarea
                                            value={item}
                                            onChange={(e) => {
                                              const next = [...items];
                                              next[index] = e.target.value;
                                              setFormData({
                                                ...formData,
                                                impactParagraphs: next.join("\n"),
                                              });
                                            }}
                                            onBlur={() => setActiveInlineEditor(null)}
                                            autoFocus
                                            style={{
                                              flex: 1,
                                              padding: "0.5rem",
                                              border: "1px solid #60a5fa",
                                              borderRadius: "0.375rem",
                                              fontSize: "0.875rem",
                                              minHeight: "60px",
                                            }}
                                          />
                                        )}
                                      </div>
                                      {!isActive && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const next = items.filter((_, i) => i !== index);
                                            setFormData({
                                              ...formData,
                                              impactParagraphs: next.join("\n"),
                                            });
                                          }}
                                          style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#9ca3af",
                                            cursor: "pointer",
                                            padding: "0.25rem",
                                          }}
                                          aria-label="Remove paragraph"
                                        >
                                          <X size={14} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...items, ""];
                                    setFormData({
                                      ...formData,
                                      impactParagraphs: next.join("\n"),
                                    });
                                  }}
                                  style={{
                                    alignSelf: "flex-start",
                                    marginTop: "0.25rem",
                                    fontSize: "0.75rem",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "9999px",
                                    border: "1px dashed #d1d5db",
                                    background: "#f9fafb",
                                    color: "#374151",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  <span style={{ fontSize: "0.9rem" }}>+</span>
                                  Add paragraph
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Impact Highlights</h3>
                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">Impact Highlights (one per line)</label>
                          {(() => {
                            const items = formData.impactHighlights ? formData.impactHighlights.split("\n") : [""];
                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {items.map((item, index) => {
                                  const isActive =
                                    activeInlineEditor?.field === "impactHighlights" &&
                                    activeInlineEditor.index === index;
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        flexDirection: isActive ? "column" : "row",
                                        alignItems: isActive ? "stretch" : "center",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f3f4f6",
                                            borderRadius: "0.25rem",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "#374151",
                                          }}
                                        >
                                          {index + 1}
                                        </span>
                                        {!isActive && (
                                          <span
                                            style={{
                                              flex: 1,
                                              padding: "0.5rem",
                                              background: "#f9fafb",
                                              borderRadius: "0.375rem",
                                              fontSize: "0.875rem",
                                              color: "#374151",
                                            }}
                                            onClick={() => setActiveInlineEditor({ field: "impactHighlights", index })}
                                          >
                                            {item || "Click to edit..."}
                                          </span>
                                        )}
                                        {isActive && (
                                          <textarea
                                            value={item}
                                            onChange={(e) => {
                                              const next = [...items];
                                              next[index] = e.target.value;
                                              setFormData({
                                                ...formData,
                                                impactHighlights: next.join("\n"),
                                              });
                                            }}
                                            onBlur={() => setActiveInlineEditor(null)}
                                            autoFocus
                                            style={{
                                              flex: 1,
                                              padding: "0.5rem",
                                              border: "1px solid #60a5fa",
                                              borderRadius: "0.375rem",
                                              fontSize: "0.875rem",
                                              minHeight: "60px",
                                            }}
                                          />
                                        )}
                                      </div>
                                      {!isActive && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const next = items.filter((_, i) => i !== index);
                                            setFormData({
                                              ...formData,
                                              impactHighlights: next.join("\n"),
                                            });
                                          }}
                                          style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#9ca3af",
                                            cursor: "pointer",
                                            padding: "0.25rem",
                                          }}
                                          aria-label="Remove highlight"
                                        >
                                          <X size={14} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...items, ""];
                                    setFormData({
                                      ...formData,
                                      impactHighlights: next.join("\n"),
                                    });
                                  }}
                                  style={{
                                    alignSelf: "flex-start",
                                    marginTop: "0.25rem",
                                    fontSize: "0.75rem",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "9999px",
                                    border: "1px dashed #d1d5db",
                                    background: "#f9fafb",
                                    color: "#374151",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  <span style={{ fontSize: "0.9rem" }}>+</span>
                                  Add highlight
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  )}
  
                  {/* Field Ops Tab - Using the same structure as VerifiedJobListingsManager */}
                  {activeFormTab === "field-ops" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="sm-form-tab-content"
                    >
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Field Operations</h3>
                        <div className="sm-form-group full-width">
                          {(() => {
                            let groups: Array<{ title: string; items: string[] }> = [];
                            try {
                              if (formData.fieldOpsGroups) {
                                groups = JSON.parse(formData.fieldOpsGroups);
                              }
                            } catch (e) {
                              // If parsing fails, create empty array
                            }
  
                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {groups.map((group, groupIndex) => (
                                  <div
                                    key={groupIndex}
                                    style={{
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "0.5rem",
                                      padding: "1rem",
                                      background: "#f9fafb",
                                      position: "relative",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = groups.filter((_, i) => i !== groupIndex);
                                        setFormData({
                                          ...formData,
                                          fieldOpsGroups: JSON.stringify(next, null, 2),
                                        });
                                      }}
                                      style={{
                                        position: "absolute",
                                        top: "0.5rem",
                                        right: "0.5rem",
                                        border: "none",
                                        background: "transparent",
                                        color: "#9ca3af",
                                        cursor: "pointer",
                                        padding: "0.25rem",
                                      }}
                                      aria-label="Remove group"
                                    >
                                      <X size={16} />
                                    </button>
                                    <div style={{ marginBottom: "1rem" }}>
                                      <label className="sm-form-label">Operation Head</label>
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        value={group.title}
                                        onChange={(e) => {
                                          const next = [...groups];
                                          next[groupIndex] = { ...next[groupIndex], title: e.target.value };
                                          setFormData({
                                            ...formData,
                                            fieldOpsGroups: JSON.stringify(next, null, 2),
                                          });
                                        }}
                                        placeholder="e.g., Health, Safety and Environment"
                                      />
                                    </div>
                                    <div>
                                      <label className="sm-form-label">Operation List (one per line)</label>
                                      {group.items.map((item, itemIndex) => {
                                        const isActive =
                                          activeInlineEditor?.field === `fieldOps-${groupIndex}-${itemIndex}` &&
                                          activeInlineEditor.index === itemIndex;
                                        return (
                                          <div
                                            key={itemIndex}
                                            style={{
                                              display: "flex",
                                              flexDirection: isActive ? "column" : "row",
                                              alignItems: isActive ? "stretch" : "center",
                                              gap: "0.5rem",
                                              marginBottom: "0.5rem",
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                flex: 1,
                                              }}
                                            >
                                              <span
                                                style={{
                                                  width: "1.5rem",
                                                  height: "1.5rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  background: "#f3f4f6",
                                                  borderRadius: "0.25rem",
                                                  fontSize: "0.75rem",
                                                  fontWeight: 600,
                                                  color: "#374151",
                                                }}
                                              >
                                                {itemIndex + 1}
                                              </span>
                                              {!isActive && (
                                                <span
                                                  style={{
                                                    flex: 1,
                                                    padding: "0.5rem",
                                                    background: "#ffffff",
                                                    borderRadius: "0.375rem",
                                                    fontSize: "0.875rem",
                                                    color: "#374151",
                                                    border: "1px solid #e5e7eb",
                                                  }}
                                                  onClick={() => setActiveInlineEditor({ field: `fieldOps-${groupIndex}-${itemIndex}`, index: itemIndex })}
                                                >
                                                  {item || "Click to edit..."}
                                                </span>
                                              )}
                                              {isActive && (
                                                <textarea
                                                  value={item}
                                                  onChange={(e) => {
                                                    const next = [...groups];
                                                    next[groupIndex] = {
                                                      ...next[groupIndex],
                                                      items: next[groupIndex].items.map((it, idx) =>
                                                        idx === itemIndex ? e.target.value : it
                                                      ),
                                                    };
                                                    setFormData({
                                                      ...formData,
                                                      fieldOpsGroups: JSON.stringify(next, null, 2),
                                                    });
                                                  }}
                                                  onBlur={() => setActiveInlineEditor(null)}
                                                  autoFocus
                                                  style={{
                                                    flex: 1,
                                                    padding: "0.5rem",
                                                    border: "1px solid #60a5fa",
                                                    borderRadius: "0.375rem",
                                                    fontSize: "0.875rem",
                                                    minHeight: "60px",
                                                  }}
                                                />
                                              )}
                                            </div>
                                            {!isActive && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const next = [...groups];
                                                  next[groupIndex] = {
                                                    ...next[groupIndex],
                                                    items: next[groupIndex].items.filter((_, idx) => idx !== itemIndex),
                                                  };
                                                  setFormData({
                                                    ...formData,
                                                    fieldOpsGroups: JSON.stringify(next, null, 2),
                                                  });
                                                }}
                                                style={{
                                                  border: "none",
                                                  background: "transparent",
                                                  color: "#9ca3af",
                                                  cursor: "pointer",
                                                  padding: "0.25rem",
                                                }}
                                                aria-label="Remove item"
                                              >
                                                <X size={14} />
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = [...groups];
                                          next[groupIndex] = {
                                            ...next[groupIndex],
                                            items: [...next[groupIndex].items, ""],
                                          };
                                          setFormData({
                                            ...formData,
                                            fieldOpsGroups: JSON.stringify(next, null, 2),
                                          });
                                        }}
                                        style={{
                                          alignSelf: "flex-start",
                                          marginTop: "0.25rem",
                                          fontSize: "0.75rem",
                                          padding: "0.25rem 0.5rem",
                                          borderRadius: "9999px",
                                          border: "1px dashed #d1d5db",
                                          background: "#ffffff",
                                          color: "#374151",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.25rem",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <span style={{ fontSize: "0.9rem" }}>+</span>
                                        Add item
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...groups, { title: "", items: [""] }];
                                    setFormData({
                                      ...formData,
                                      fieldOpsGroups: JSON.stringify(next, null, 2),
                                    });
                                  }}
                                  style={{
                                    alignSelf: "flex-start",
                                    fontSize: "0.75rem",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    border: "1px dashed #d1d5db",
                                    background: "#ffffff",
                                    color: "#374151",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  <span style={{ fontSize: "0.9rem" }}>+</span>
                                  Add Operation Group
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  )}
  
                  {/* Skills Tab - Continue with similar structure */}
                  {activeFormTab === "skills" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="sm-form-tab-content"
                    >
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Skills & Experience</h3>
                        <div className="sm-form-grid">
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Key Skills (comma-separated)</label>
                            <input
                              type="text"
                              className="sm-form-input"
                              value={formData.skills}
                              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                              placeholder="e.g., JavaScript, React, Node.js"
                            />
                          </div>
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Formal Qualifications (one per line)</label>
                            {(() => {
                              const items = formData.skillsFormalQualifications ? formData.skillsFormalQualifications.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "skillsFormalQualifications" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "skillsFormalQualifications", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  skillsFormalQualifications: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                skillsFormalQualifications: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove qualification"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        skillsFormalQualifications: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add qualification
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Additional Knowledge (one per line)</label>
                            {(() => {
                              const items = formData.skillsAdditionalKnowledge ? formData.skillsAdditionalKnowledge.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "skillsAdditionalKnowledge" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "skillsAdditionalKnowledge", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  skillsAdditionalKnowledge: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                skillsAdditionalKnowledge: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove knowledge"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        skillsAdditionalKnowledge: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add knowledge
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Experience Requirements (one per line)</label>
                            {(() => {
                              const items = formData.skillsExperience ? formData.skillsExperience.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "skillsExperience" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "skillsExperience", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  skillsExperience: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                skillsExperience: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove experience"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        skillsExperience: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add experience
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Technical Skills (one per line)</label>
                            {(() => {
                              const items = formData.skillsTechnical ? formData.skillsTechnical.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "skillsTechnical" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "skillsTechnical", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  skillsTechnical: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                skillsTechnical: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove technical skill"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        skillsTechnical: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add technical skill
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Behavioral Attributes (one per line)</label>
                            {(() => {
                              const items = formData.behavioralAttributes ? formData.behavioralAttributes.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "behavioralAttributes" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "behavioralAttributes", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  behavioralAttributes: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                behavioralAttributes: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove attribute"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        behavioralAttributes: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add attribute
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
  
                  {/* Culture Tab */}
                  {activeFormTab === "culture" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="sm-form-tab-content"
                    >
                      <div className="sm-form-section">
                        <h3 className="sm-form-section-title">Culture & Apply</h3>
                        <div className="sm-form-grid">
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Culture Paragraphs (one per line)</label>
                            {(() => {
                              const items = formData.cultureParagraphs ? formData.cultureParagraphs.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "cultureParagraphs" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "cultureParagraphs", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  cultureParagraphs: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                cultureParagraphs: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove paragraph"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        cultureParagraphs: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add paragraph
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="sm-form-group full-width">
                            <label className="sm-form-label">Opportunity Paragraphs (one per line)</label>
                            {(() => {
                              const items = formData.opportunityParagraphs ? formData.opportunityParagraphs.split("\n") : [""];
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {items.map((item, index) => {
                                    const isActive =
                                      activeInlineEditor?.field === "opportunityParagraphs" &&
                                      activeInlineEditor.index === index;
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          display: "flex",
                                          flexDirection: isActive ? "column" : "row",
                                          alignItems: isActive ? "stretch" : "center",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "1.5rem",
                                              height: "1.5rem",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              background: "#f3f4f6",
                                              borderRadius: "0.25rem",
                                              fontSize: "0.75rem",
                                              fontWeight: 600,
                                              color: "#374151",
                                            }}
                                          >
                                            {index + 1}
                                          </span>
                                          {!isActive && (
                                            <span
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                background: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                              }}
                                              onClick={() => setActiveInlineEditor({ field: "opportunityParagraphs", index })}
                                            >
                                              {item || "Click to edit..."}
                                            </span>
                                          )}
                                          {isActive && (
                                            <textarea
                                              value={item}
                                              onChange={(e) => {
                                                const next = [...items];
                                                next[index] = e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  opportunityParagraphs: next.join("\n"),
                                                });
                                              }}
                                              onBlur={() => setActiveInlineEditor(null)}
                                              autoFocus
                                              style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                border: "1px solid #60a5fa",
                                                borderRadius: "0.375rem",
                                                fontSize: "0.875rem",
                                                minHeight: "60px",
                                              }}
                                            />
                                          )}
                                        </div>
                                        {!isActive && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== index);
                                              setFormData({
                                                ...formData,
                                                opportunityParagraphs: next.join("\n"),
                                              });
                                            }}
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                              color: "#9ca3af",
                                              cursor: "pointer",
                                              padding: "0.25rem",
                                            }}
                                            aria-label="Remove paragraph"
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...items, ""];
                                      setFormData({
                                        ...formData,
                                        opportunityParagraphs: next.join("\n"),
                                      });
                                    }}
                                    style={{
                                      alignSelf: "flex-start",
                                      marginTop: "0.25rem",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "9999px",
                                      border: "1px dashed #d1d5db",
                                      background: "#f9fafb",
                                      color: "#374151",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>+</span>
                                    Add paragraph
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Application URL</label>
                            <input
                              type="url"
                              className="sm-form-input"
                              value={formData.applicationUrl}
                              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="sm-form-group">
                            <label className="sm-form-label">Image URL</label>
                            <input
                              type="url"
                              className="sm-form-input"
                              value={formData.imageUrl}
                              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="sm-form-group full-width">
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={formData.verified}
                                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                                  className="sm-checkbox"
                                />
                                <span className="sm-form-label" style={{ margin: 0 }}>Verified</span>
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={formData.featured}
                                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                  className="sm-checkbox"
                                />
                                <span className="sm-form-label" style={{ margin: 0 }}>Featured</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                    </div>
                  </div>
                </div>
  
                {/* Footer */}
                <div className="sm-form-footer">
                  <button
                    className="sm-btn sm-btn-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditing(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="sm-btn sm-btn-primary"
                    onClick={() => handleSave(formData, editing || undefined)}
                    disabled={saving || !formData.title}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                        {editing ? "Update" : "Create"} Position
                      </>
                    )}
                   </button>
                </div>
              </div>
            </div>
          )}
   
          {/* Delete Confirmation Modal */}
          {deleteModalOpen && (
            <div className="sm-form-modal" style={{ zIndex: 2001 }} onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDeleteModalOpen(false);
                setJobToDelete(null);
              }
            }}>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#fee2e2', marginBottom: '1rem' }}>
                    <AlertCircle style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Position</h3>
                  <p style={{ color: '#6b7280' }}>Are you sure you want to delete this position? This action cannot be undone.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="sm-btn sm-btn-secondary" style={{ flex: 1 }} onClick={() => {
                    setDeleteModalOpen(false);
                    setJobToDelete(null);
                  }}>
                    Cancel
                  </button>
                  <button className="sm-btn sm-btn-primary" style={{ flex: 1, background: '#dc2626', color: 'white' }} onClick={() => jobToDelete && handleDelete(jobToDelete)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
      </>
    );
  };

// Main CompanyManager Component
const CompanyManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [selectedCompanyForPositions, setSelectedCompanyForPositions] = useState<Company | null>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    logoUrl: "",
    description: "",
    industry: "",
    employees: "",
    founded: "",
    website: "",
    email: "",
    phone: "",
    location: "",
    featured: false,
  });

  const industries = [
    "Technology",
    "Retail & Fashion",
    "E-commerce & Cloud",
    "Automotive & Energy",
    "Entertainment",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Consulting",
    "Telecommunications",
    "Real Estate",
    "Food & Beverage",
    "Hospitality",
    "Media & Advertising",
    "Energy",
    "Construction",
    "Transportation",
    "Agriculture",
    "Government",
  ];

  const employeeRanges = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10000+",
  ];

  useEffect(() => {
    loadCompanies();
  }, []);

  const getMockCompanies = (): Company[] => [
    {
      id: "1",
      name: "Microsoft",
      logoUrl: "https://logo.clearbit.com/microsoft.com",
      description: "Microsoft is a technology company empowering every person and organization on the planet to achieve more.",
      industry: "Technology",
      employees: "1001-5000",
      founded: "2005",
      website: "https://microsoft.com",
      email: "careers@microsoft.com",
      phone: "+233 XX XXX XXXX",
      location: "Greater Accra, Ghana",
      jobCount: 245,
      featured: true,
    },
    {
      id: "2",
      name: "Adidas",
      logoUrl: "https://logo.clearbit.com/adidas.com",
      description: "Adidas is a German multinational corporation, founded and headquartered in Herzogenaurach, Germany, that designs and manufactures shoes, clothing and accessories.",
      industry: "Retail & Fashion",
      employees: "1001-5000",
      founded: "1949",
      website: "https://adidas.com",
      email: "careers@adidas.com",
      phone: "+233 XX XXX XXXX",
      location: "Greater Accra, Ghana",
      jobCount: 89,
      featured: false,
    },
    {
      id: "3",
      name: "Google",
      logoUrl: "https://logo.clearbit.com/google.com",
      description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
      industry: "Technology",
      employees: "5001-10000",
      founded: "2008",
      website: "https://google.com",
      email: "careers@google.com",
      phone: "+233 XX XXX XXXX",
      location: "Greater Accra, Ghana",
      jobCount: 156,
      featured: false,
    },
    {
      id: "4",
      name: "Apple",
      logoUrl: "https://logo.clearbit.com/apple.com",
      description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.",
      industry: "Technology",
      employees: "5001-10000",
      founded: "1976",
      website: "https://apple.com",
      email: "careers@apple.com",
      phone: "+233 XX XXX XXXX",
      location: "Greater Accra, Ghana",
      jobCount: 342,
      featured: false,
    },
    {
      id: "5",
      name: "Amazon",
      logoUrl: "https://logo.clearbit.com/amazon.com",
      description: "Amazon is committed to being Earth's most customer-centric company, where people can find and discover anything they might want to buy online.",
      industry: "E-commerce & Cloud",
      employees: "10000+",
      founded: "1994",
      website: "https://amazon.com",
      email: "careers@amazon.com",
      phone: "+233 XX XXX XXXX",
      location: "Greater Accra, Ghana",
      jobCount: 678,
      featured: false,
    },
  ];

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading companies:", error);
        toast.error("Failed to load companies");
        setCompanies(getMockCompanies());
        return;
      }

      if (data && data.length > 0) {
        const transformed: Company[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          logoUrl: item.logo_url,
          description: item.description || "",
          industry: item.industry || "",
          employees: item.employees || "",
          founded: item.founded || "",
          website: item.website || "",
          email: item.email || "",
          phone: item.phone || "",
          location: item.location || "",
          jobCount: item.job_count || 0,
          featured: item.featured || false,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setCompanies(transformed);
      } else {
        // No data from database, use mock data
        setCompanies(getMockCompanies());
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load companies");
      setCompanies(getMockCompanies());
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies;
    const query = searchQuery.toLowerCase();
    return companies.filter(company =>
      company.name.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query) ||
      company.location?.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(start, start + itemsPerPage);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const handleSave = async (companyData: CompanyFormData, companyId?: string) => {
    setSaving(true);
    try {
      // If marking as featured, unfeature all other companies
      if (companyData.featured) {
        const { error: unfeatureError } = await supabase
          .from('companies' as any)
          .update({ featured: false })
          .neq('id', companyId || '');
        if (unfeatureError) throw unfeatureError;
      }

      const payload: any = {
        name: companyData.name,
        logo_url: companyData.logoUrl,
        description: companyData.description,
        industry: companyData.industry,
        employees: companyData.employees,
        founded: companyData.founded,
        website: companyData.website,
        email: companyData.email,
        phone: companyData.phone,
        location: companyData.location,
        featured: companyData.featured || false,
      };

      if (companyId) {
        const { error } = await supabase
          .from('companies' as any)
          .update(payload)
          .eq('id', companyId);
        if (error) throw error;
        toast.success("Company updated successfully");
      } else {
        const { error } = await supabase
          .from('companies' as any)
          .insert([payload]);
        if (error) throw error;
        toast.success("Company created successfully");
      }

      await loadCompanies();
      setShowAddForm(false);
      setEditing(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving company:", error);
      toast.error(error.message || "Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('companies' as any)
        .delete()
        .eq('id', companyId);
      if (error) throw error;
      toast.success("Company deleted successfully");
      await loadCompanies();
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    } catch (error: any) {
      console.error("Error deleting company:", error);
      toast.error(error.message || "Failed to delete company");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      logoUrl: "",
      description: "",
      industry: "",
      employees: "",
      founded: "",
      website: "",
      email: "",
      phone: "",
      location: "",
      featured: false,
    });
  };

  const handleEdit = (company: Company) => {
    setEditing(company.id);
    setFormData({
      name: company.name,
      logoUrl: company.logoUrl || "",
      description: company.description,
      industry: company.industry,
      employees: company.employees,
      founded: company.founded,
      website: company.website,
      email: company.email,
      phone: company.phone,
      location: company.location || "",
      featured: company.featured || false,
    });
    setShowAddForm(true);
  };

  const isolatedStyles = `
    .sm-form-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      overflow-y: auto;
    }

    .sm-form-content {
      background: white;
      border-radius: 0.75rem;
      width: 100%;
      max-width: 1000px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .sm-form-header {
      padding: 1.5rem 2rem;
      border-bottom: 2px solid #60a5fa;
      background: #111827;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sm-form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .sm-form-body {
      padding: 1.5rem 2rem;
      overflow-y: auto;
      flex: 1;
    }

    .sm-form-section {
      margin-bottom: 2rem;
    }

    .sm-form-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .sm-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .sm-form-group {
      display: flex;
      flex-direction: column;
    }

    .sm-form-group.full-width {
      grid-column: 1 / -1;
    }

    .sm-form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .sm-form-input,
    .sm-form-select,
    .sm-form-textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .sm-form-input:focus,
    .sm-form-select:focus,
    .sm-form-textarea:focus {
      outline: none;
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    .sm-form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .sm-form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .sm-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
      accent-color: #60a5fa;
    }

    .sm-form-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #f9fafb;
    }

    .sm-icon-btn {
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 0.375rem;
      color: #6b7280;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sm-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .sm-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .sm-btn-primary {
      background: #60a5fa;
      color: #ffffff;
    }

    .sm-btn-primary:hover:not(:disabled) {
      background: #3b82f6;
    }

    .sm-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .sm-btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .sm-btn-secondary:hover {
      background: #e5e7eb;
    }

    @media (max-width: 767px) {
      .sm-form-grid {
        grid-template-columns: 1fr;
      }

      .sm-form-tabs {
        padding: 0 1rem;
        overflow-x: auto;
      }

      .sm-form-tab {
        padding: 0.75rem 1rem;
        font-size: 0.8125rem;
        white-space: nowrap;
      }
    }
  `;

  return (
    <>
      <style>{isolatedStyles}</style>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Company Manager</h3>
            <p className="text-sm text-slate-600 mt-1">
              Manage company profiles ({filteredCompanies.length} companies)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <>
                  <List className="w-4 h-4 mr-2" />
                  List View
                </>
              ) : (
                <>
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Grid View
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setEditing(null);
                setShowAddForm(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Company
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : paginatedCompanies.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No companies found</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedCompanies.map((company) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative h-full bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-200 hover:border-slate-900 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col"
                  >
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-slate-900 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
                    
                    {/* Content Wrapper */}
                    <div className="relative z-10 flex flex-col flex-1">
                    {/* Featured Badge */}
                    {company.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          FEATURED
                        </div>
                      </div>
                    )}
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-xl overflow-hidden p-2">
                      {company.logoUrl ? (
                        <img 
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "";
                            target.style.display = "none";
                          }}
                        />
                      ) : null}
                      {!company.logoUrl && <Building2 className="w-8 h-8 text-slate-400" />}
                    </div>
                    
                    {/* Company Name */}
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-300">
                      {company.name}
                    </h4>
                    
                    {/* Industry */}
                    <p className="text-xs text-slate-500 mb-3">{company.industry}</p>
                    
                    {/* Job Count */}
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">{company.jobCount || 0} Open Positions</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompanyForPositions(company);
                          setShowPositionsModal(true);
                        }}
                        title="Manage Positions"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(company);
                          }}
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompanyToDelete(company.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" />
                        </Button>
                      </div>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedCompanies.map((company) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="group bg-white rounded-lg border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 relative"
                  >
                    {/* Featured Badge */}
                    {company.featured && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-lg">
                          <Sparkles className="w-2.5 h-2.5" />
                          FEATURED
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {/* Company Logo */}
                      <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                        {company.logoUrl ? (
                          <img 
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "";
                              target.style.display = "none";
                            }}
                          />
                        ) : null}
                        {!company.logoUrl && <Building2 className="w-8 h-8 text-slate-400" />}
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900 mb-1">
                              {company.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {company.industry}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {company.employees}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {company.jobCount || 0} Positions
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {company.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCompanyForPositions(company);
                                setShowPositionsModal(true);
                              }}
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Manage Positions
                            </Button>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(company);
                                }}
                              >
                                <Edit2 className="w-4 h-4 text-slate-600 hover:text-slate-900" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCompanyToDelete(company.id);
                                  setDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-slate-600 hover:text-slate-900" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="sm-form-modal" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddForm(false);
              setEditing(null);
            }
          }}>
            <div className="sm-form-content">
              <div className="sm-form-header">
                <h2 className="sm-form-title">{editing ? 'Edit Company' : 'Add New Company'}</h2>
                <button className="sm-icon-btn" style={{ color: 'white' }} onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}>
                  <X size={20} />
                </button>
              </div>

              <div className="sm-form-body">
                {/* About Section */}
                <div className="sm-form-section">
                  <h3 className="sm-form-section-title">About Company</h3>
                  <div className="sm-form-grid">
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Company Name *</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Adidas"
                      />
                    </div>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Company Logo URL</label>
                      <input
                        type="url"
                        className="sm-form-input"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://logo.clearbit.com/adidas.com"
                      />
                    </div>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Description *</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter company description"
                        rows={5}
                      />
                    </div>
                    <div className="sm-form-group">
                      <label className="sm-form-label">Location</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Greater Accra, Ghana"
                      />
                    </div>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="sm-checkbox"
                        />
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-red-600" />
                          Mark as Featured Company
                        </span>
                      </label>
                      <p className="text-xs text-slate-500 mt-1">
                        Only one company can be featured at a time. Selecting this will unfeature any other featured company.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Details Section */}
                <div className="sm-form-section">
                  <h3 className="sm-form-section-title">Company Details</h3>
                  <div className="sm-form-grid">
                    <div className="sm-form-group">
                      <label className="sm-form-label">Industry *</label>
                      <select
                        className="sm-form-select"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      >
                        <option value="">Select Industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm-form-group">
                      <label className="sm-form-label">Employees *</label>
                      <select
                        className="sm-form-select"
                        value={formData.employees}
                        onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                      >
                        <option value="">Select Range</option>
                        {employeeRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm-form-group">
                      <label className="sm-form-label">Founded</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.founded}
                        onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                        placeholder="e.g., 2005"
                      />
                    </div>
                    <div className="sm-form-group">
                      <label className="sm-form-label">Website</label>
                      <input
                        type="url"
                        className="sm-form-input"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="sm-form-group">
                      <label className="sm-form-label">Email</label>
                      <input
                        type="email"
                        className="sm-form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="sm-form-group">
                      <label className="sm-form-label">Phone</label>
                      <input
                        type="tel"
                        className="sm-form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm-form-footer">
                <button
                  className="sm-btn sm-btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditing(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="sm-btn sm-btn-primary"
                  onClick={() => handleSave(formData, editing || undefined)}
                  disabled={saving || !formData.name || !formData.industry || !formData.employees}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                      {editing ? "Update" : "Create"} Company
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Positions Manager Modal */}
        {showPositionsModal && selectedCompanyForPositions && (
          <CompanyPositionsManager
            company={selectedCompanyForPositions}
            onClose={() => {
              setShowPositionsModal(false);
              setSelectedCompanyForPositions(null);
              loadCompanies(); // Refresh company data to update job counts
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="sm-form-modal" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteModalOpen(false);
              setCompanyToDelete(null);
            }
          }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '400px', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#fee2e2', marginBottom: '1rem' }}>
                  <AlertCircle style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Company</h3>
                <p style={{ color: '#6b7280' }}>Are you sure you want to delete this company? This action cannot be undone.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="sm-btn sm-btn-secondary" style={{ flex: 1 }} onClick={() => {
                  setDeleteModalOpen(false);
                  setCompanyToDelete(null);
                }}>
                  Cancel
                </button>
                <button className="sm-btn sm-btn-primary" style={{ flex: 1, background: '#dc2626', color: 'white' }} onClick={() => companyToDelete && handleDelete(companyToDelete)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
  
  export default CompanyManager;