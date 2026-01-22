import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, X, Edit2, Trash2, 
  Save, Loader2,
  Building2, Briefcase, ArrowRight,
  AlertCircle, Globe, Mail, Phone,
  Calendar, Users, Sparkles, MapPin,
  CheckCircle2, ChevronRight, ChevronLeft,
  List, FileText
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperSeparator } from "@/components/ui/stepper";

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

const EmployerCompanyManagement = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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

  const steps = [
    { number: 0, title: "About Company" },
    { number: 1, title: "Company Details" },
    { number: 2, title: "Contact Information" },
  ];

  useEffect(() => {
    if (activeTab === 'list') {
      loadCompanies();
    }
  }, [activeTab]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to view companies");
        setLoading(false);
        return;
      }

          const { data: employerProfile } = await (supabase as any)
            .from('employers')
            .select('company_id, company_name')
            .eq('user_id', user.id)
            .maybeSingle(); // Use maybeSingle() to avoid errors if profile doesn't exist

      let query = (supabase as any)
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (employerProfile?.company_id) {
        query = query.eq('id', employerProfile.company_id);
      } else {
        if (employerProfile?.company_name) {
          query = query.eq('name', employerProfile.company_name);
        } else {
          setCompanies([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading companies:", error);
        toast.error(`Failed to load companies: ${error.message || 'Unknown error'}`);
        setCompanies([]);
        return;
      }

      if (data) {
        const companiesWithJobs = await Promise.all(
          data.map(async (item: any) => {
            const { count } = await (supabase as any)
              .from('jobs')
              .select('*', { count: 'exact', head: true })
              .eq('company', item.name)
              .eq('verified', true);

            return {
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
              jobCount: count || 0,
              featured: item.featured || false,
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
          })
        );
        setCompanies(companiesWithJobs);
      } else {
        setCompanies([]);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Failed to load companies: ${error.message || 'Unknown error'}`);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return companies.slice(start, start + itemsPerPage);
  }, [companies, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(companies.length / itemsPerPage);

  const handleSave = async (companyData: CompanyFormData, companyId?: string) => {
    setSaving(true);
    try {
      // Featured status is managed by admin only, so always set to false
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
        featured: false, // Always false - only admin can set featured
      };

      if (companyId) {
        const { error } = await (supabase as any)
          .from('companies')
          .update(payload)
          .eq('id', companyId);
        if (error) throw error;
        toast.success("Company updated successfully");
      } else {
        // Get current user to link company to employer
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please log in to create a company");
          setSaving(false);
          return;
        }

        const { data, error } = await (supabase as any)
          .from('companies')
          .insert([payload])
          .select();
        if (error) throw error;
        
        // Link the created company to the employer profile
        if (data && data[0] && user) {
          const { error: updateError } = await supabase
            .from('employers' as any)
            .update({ 
              company_id: data[0].id, 
              company_name: data[0].name 
            })
            .eq('user_id', user.id);

          if (updateError) {
            console.error("Error linking company to employer:", updateError);
            // Don't fail the whole operation, just log the error
            toast.warning("Company created but failed to link to your profile. Please contact support.");
          }
        }
        
        toast.success("Company created successfully");
      }

      await loadCompanies();
      setActiveTab('list');
      setEditing(null);
      setCurrentStep(0);
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
      const { error: jobsError } = await (supabase as any)
        .from('jobs')
        .delete()
        .eq('company_id', companyId);

      if (jobsError) {
        console.warn("Error deleting associated jobs:", jobsError);
      }

      const { error } = await (supabase as any)
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      toast.success("Company deleted successfully");
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
      await loadCompanies();
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
    setCurrentStep(0);
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
    setCurrentStep(0);
    setActiveTab('form');
  };

  const handleAddNew = () => {
    resetForm();
    setEditing(null);
    setActiveTab('form');
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return !!(formData.name && formData.description);
      case 1:
        return !!(formData.industry && formData.employees);
      case 2:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="ecm-form-section">
            <div className="ecm-form-group">
              <label className="ecm-form-label">
                Company Name <span className="ecm-form-label-required">*</span>
              </label>
              <input
                type="text"
                className="ecm-form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Adidas"
              />
            </div>
            <div className="ecm-form-group">
              <label className="ecm-form-label">Company Logo URL</label>
              <input
                type="url"
                className="ecm-form-input"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://logo.clearbit.com/adidas.com"
              />
              {formData.logoUrl && (
                <div className="ecm-logo-preview">
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo preview" 
                    className="ecm-logo-preview-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="ecm-form-group full-width">
              <label className="ecm-form-label">
                Description <span className="ecm-form-label-required">*</span>
              </label>
              <textarea
                className="ecm-form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter company description"
                rows={5}
              />
            </div>
            <div className="ecm-form-group">
              <label className="ecm-form-label">Location</label>
              <input
                type="text"
                className="ecm-form-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Greater Accra, Ghana"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="ecm-form-section">
            <div className="ecm-form-group">
              <label className="ecm-form-label">
                Industry <span className="ecm-form-label-required">*</span>
              </label>
              <select
                className="ecm-form-select"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div className="ecm-form-group">
              <label className="ecm-form-label">
                Employees <span className="ecm-form-label-required">*</span>
              </label>
              <select
                className="ecm-form-select"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
              >
                <option value="">Select Range</option>
                {employeeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            <div className="ecm-form-group">
              <label className="ecm-form-label">Founded</label>
              <input
                type="text"
                className="ecm-form-input"
                value={formData.founded}
                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                placeholder="e.g., 2005"
              />
            </div>
            <div className="ecm-form-group">
              <label className="ecm-form-label">Website</label>
              <input
                type="url"
                className="ecm-form-input"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="ecm-form-section">
            <div className="ecm-form-group">
              <label className="ecm-form-label">Email</label>
              <input
                type="email"
                className="ecm-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
            <div className="ecm-form-group">
              <label className="ecm-form-label">Phone</label>
              <input
                type="tel"
                className="ecm-form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .ecm-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 2rem;
          background: #f5f5f9;
          min-height: calc(100vh - 4rem);
        }

        .ecm-container {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .ecm-header {
          margin-bottom: 2rem;
        }

        .ecm-header-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ecm-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ecm-subtitle {
          font-size: 0.9375rem;
          color: #54577A;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ecm-card {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          overflow: hidden;
        }

        .ecm-tabs {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eceef1;
          background: #fff;
          flex-wrap: wrap;
        }

        .ecm-tab {
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

        .ecm-tab:hover {
          background: #f5f5f9;
          color: #141522;
        }

        .ecm-tab.active {
          background: rgba(105, 108, 255, 0.1);
          color: #696cff;
        }

        .ecm-tab-content {
          padding: 2rem 1.5rem;
        }

        /* List View Styles */
        .ecm-companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .ecm-company-card {
          position: relative;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .ecm-company-card:hover {
          border-color: #696cff;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(105, 108, 255, 0.15);
        }

        .ecm-company-logo {
          width: 64px;
          height: 64px;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          overflow: hidden;
          background: white;
        }

        .ecm-company-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 0.5rem;
        }

        .ecm-company-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #141522;
          margin-bottom: 0.5rem;
        }

        .ecm-company-industry {
          font-size: 0.875rem;
          color: #54577A;
          margin-bottom: 1rem;
        }

        .ecm-company-jobs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #54577A;
          margin-bottom: 1rem;
        }

        .ecm-company-actions {
          display: flex;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #eceef1;
        }

        .ecm-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .ecm-btn-primary {
          background: #696cff;
          color: #fff;
        }

        .ecm-btn-primary:hover:not(:disabled) {
          background: #5a5de0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
        }

        .ecm-btn-secondary {
          background: #f5f5f9;
          color: #141522;
          border: 1px solid #d9dee3;
        }

        .ecm-btn-secondary:hover {
          background: #eceef1;
        }

        .ecm-btn-danger {
          background: #fff5f5;
          color: #ff3e1d;
          border: 1px solid #ffe0e0;
        }

        .ecm-btn-danger:hover {
          background: #ffe0e0;
        }

        /* Form View Styles */
        .ecm-stepper-container {
          margin-bottom: 2rem;
        }

        .ecm-stepper-title {
          display: block;
        }

        @media (max-width: 768px) {
          .ecm-stepper-title {
            display: none;
          }

          .ecm-stepper-container {
            margin-bottom: 1.5rem;
          }

          .ecm-stepper-container [data-orientation="horizontal"] {
            gap: 0.5rem;
          }

          .ecm-stepper-container [data-orientation="horizontal"] > * {
            flex: 1;
          }
        }

        .ecm-form-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .ecm-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ecm-form-group.full-width {
          grid-column: 1 / -1;
        }

        .ecm-form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ecm-form-label-required {
          color: #ff3e1d;
          font-size: 0.75rem;
        }

        .ecm-form-input,
        .ecm-form-textarea,
        .ecm-form-select {
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

        .ecm-form-input:focus,
        .ecm-form-textarea:focus,
        .ecm-form-select:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .ecm-form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .ecm-logo-preview {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #f5f5f9;
          border-radius: 0.5rem;
          display: inline-block;
        }

        .ecm-logo-preview-img {
          height: 64px;
          width: 64px;
          object-fit: contain;
        }

        .ecm-featured-checkbox {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background: #fffbf0;
          border: 2px solid #fef3c7;
          border-radius: 0.5rem;
        }

        .ecm-checkbox {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
          accent-color: #696cff;
          margin-top: 0.25rem;
        }

        .ecm-checkbox-label {
          display: flex;
          gap: 0.75rem;
          cursor: pointer;
          flex: 1;
        }

        .ecm-checkbox-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .ecm-checkbox-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #141522;
          display: block;
          margin-bottom: 0.25rem;
        }

        .ecm-checkbox-desc {
          font-size: 0.75rem;
          color: #54577A;
          margin: 0;
        }

        .ecm-form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-top: 1px solid #eceef1;
          background: #fff;
          margin-top: 2rem;
        }

        .ecm-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ecm-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
        }

        .ecm-empty-icon {
          width: 64px;
          height: 64px;
          color: #d9dee3;
          margin: 0 auto 1rem;
        }

        .ecm-empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #141522;
          margin-bottom: 0.5rem;
        }

        .ecm-empty-desc {
          font-size: 0.875rem;
          color: #54577A;
          margin-bottom: 1.5rem;
        }

        .ecm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .ecm-modal-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
        }

        .ecm-modal-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fee2e2;
        }

        .ecm-modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #141522;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .ecm-modal-desc {
          font-size: 0.875rem;
          color: #54577A;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .ecm-modal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .ecm-modal-actions .ecm-btn {
          flex: 1;
        }

        @media (max-width: 768px) {
          .ecm-page {
            padding: 1rem;
          }

          .ecm-form-section {
            grid-template-columns: 1fr;
          }

          .ecm-companies-grid {
            grid-template-columns: 1fr;
          }

          .ecm-stepper-container [data-orientation="horizontal"] .mx-4 {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
          }
        }
      `}</style>

      <div className="ecm-page">
        <div className="ecm-container">
          <div className="ecm-header">
            <div className="ecm-header-top">
              <div>
                <h1 className="ecm-title">Company Management</h1>
                <p className="ecm-subtitle">Manage your company profile and information</p>
              </div>
            </div>
          </div>

          <div className="ecm-card">
            <div className="ecm-tabs">
              <button
                className={`ecm-tab ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                <List className="w-4 h-4" />
                My Company
              </button>
              <button
                className={`ecm-tab ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => {
                  if (activeTab !== 'form') {
                    handleAddNew();
                  }
                }}
              >
                <FileText className="w-4 h-4" />
                {editing ? 'Edit Company' : 'Add Company'}
              </button>
            </div>

            <div className="ecm-tab-content">
              {activeTab === 'list' ? (
                <>
                  {loading ? (
                    <div className="ecm-empty-state">
                      <Loader2 className="ecm-empty-icon animate-spin" />
                      <p className="ecm-empty-desc">Loading companies...</p>
                    </div>
                  ) : paginatedCompanies.length === 0 ? (
                    <div className="ecm-empty-state">
                      <Building2 className="ecm-empty-icon" />
                      <h3 className="ecm-empty-title">No companies found</h3>
                      <p className="ecm-empty-desc">
                        Get started by adding your first company
                      </p>
                      <button
                        onClick={handleAddNew}
                        className="ecm-btn ecm-btn-primary"
                      >
                        <Plus className="w-4 h-4" />
                        Add Company
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="ecm-companies-grid">
                        {paginatedCompanies.map((company, index) => (
                          <motion.div
                            key={company.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="ecm-company-card"
                          >
                            {company.featured && (
                              <Badge className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-bold">
                                <Sparkles className="w-3 h-3 mr-1" />
                                FEATURED
                              </Badge>
                            )}
                            <div className="ecm-company-logo">
                              {company.logoUrl ? (
                                <img 
                                  src={company.logoUrl}
                                  alt={`${company.name} logo`}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Building2 className="w-8 h-8 text-slate-400" />
                              )}
                            </div>
                            <h3 className="ecm-company-name">{company.name}</h3>
                            <p className="ecm-company-industry">{company.industry}</p>
                            <div className="ecm-company-jobs">
                              <Briefcase className="w-4 h-4" />
                              <span>{company.jobCount || 0} Open Positions</span>
                            </div>
                            <div className="ecm-company-actions">
                              <button
                                onClick={() => handleEdit(company)}
                                className="ecm-btn ecm-btn-secondary"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setCompanyToDelete(company.id);
                                  setDeleteModalOpen(true);
                                }}
                                className="ecm-btn ecm-btn-danger"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-6">
                          <button
                            className="ecm-btn ecm-btn-secondary"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-slate-600 px-4">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            className="ecm-btn ecm-btn-secondary"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div>
                  <div className="ecm-stepper-container">
                    <Stepper value={currentStep} onValueChange={setCurrentStep} orientation="horizontal">
                      {steps.map((step, index) => (
                        <StepperItem
                          key={step.number}
                          step={step.number}
                          completed={currentStep > step.number}
                        >
                          <StepperTrigger className="cursor-pointer">
                            <StepperIndicator />
                            <StepperTitle className="ecm-stepper-title ml-2 text-sm font-medium">
                              {step.title}
                            </StepperTitle>
                          </StepperTrigger>
                          {index < steps.length - 1 && <StepperSeparator className="mx-4" />}
                        </StepperItem>
                      ))}
                    </Stepper>
                  </div>

                  <div className="ecm-form-section">
                    {renderStepContent()}
                  </div>

                  <div className="ecm-form-footer">
                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <button
                          className="ecm-btn ecm-btn-secondary"
                          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                      )}
                      <button
                        className="ecm-btn ecm-btn-secondary"
                        onClick={() => {
                          setActiveTab('list');
                          resetForm();
                          setEditing(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {currentStep < steps.length - 1 ? (
                        <button
                          className="ecm-btn ecm-btn-primary"
                          onClick={() => {
                            if (canProceedToNextStep()) {
                              setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
                            } else {
                              toast.error("Please complete required fields before proceeding");
                            }
                          }}
                          disabled={!canProceedToNextStep()}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="ecm-btn ecm-btn-primary"
                          onClick={() => handleSave(formData, editing || undefined)}
                          disabled={saving || !formData.name || !formData.industry || !formData.employees}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {editing ? "Update" : "Create"} Company
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="ecm-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setDeleteModalOpen(false);
            setCompanyToDelete(null);
          }
        }}>
          <div className="ecm-modal-content">
            <div className="ecm-modal-icon">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="ecm-modal-title">Delete Company</h3>
            <p className="ecm-modal-desc">
              Are you sure you want to delete this company? This action cannot be undone.
            </p>
            <div className="ecm-modal-actions">
              <button
                className="ecm-btn ecm-btn-secondary"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setCompanyToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="ecm-btn ecm-btn-primary"
                onClick={() => companyToDelete && handleDelete(companyToDelete)}
                style={{ background: '#ff3e1d', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployerCompanyManagement;
