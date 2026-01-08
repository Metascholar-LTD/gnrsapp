import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, X, Edit2, Trash2, 
  ChevronLeft, ChevronRight,
  Save, Loader2, Grid3x3, List,
  Building2, Briefcase,
  AlertCircle, Globe, Mail, Phone,
  Calendar, Users, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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

      if (data) {
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

  const getMockCompanies = (): Company[] => [
    {
      id: "1",
      name: "Adidas",
      logoUrl: "https://logo.clearbit.com/adidas.com",
      description: "Adidas is a leading organization committed to excellence and innovation. We provide exceptional opportunities for talented professionals to grow their careers and make a meaningful impact.",
      industry: "Retail & Fashion",
      employees: "500-1000",
      founded: "2010",
      website: "https://example.com",
      email: "careers@example.com",
      phone: "+233 XX XXX XXXX",
      location: "Greater Accra, Ghana",
      jobCount: 89,
    },
    {
      id: "2",
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
      jobCount: 512,
    },
  ];

  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.description.toLowerCase().includes(query)
      );
    }
    return filtered;
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
    .cm-form-modal {
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

    .cm-form-content {
      background: white;
      border-radius: 0.75rem;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .cm-form-header {
      padding: 1.5rem 2rem;
      border-bottom: 2px solid #60a5fa;
      background: #111827;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cm-form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .cm-form-body {
      padding: 1.5rem 2rem;
      overflow-y: auto;
      flex: 1;
    }

    .cm-form-section {
      margin-bottom: 2rem;
    }

    .cm-form-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .cm-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .cm-form-group {
      display: flex;
      flex-direction: column;
    }

    .cm-form-group.full-width {
      grid-column: 1 / -1;
    }

    .cm-form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .cm-form-input,
    .cm-form-select,
    .cm-form-textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .cm-form-input:focus,
    .cm-form-select:focus,
    .cm-form-textarea:focus {
      outline: none;
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    .cm-form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .cm-form-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #f9fafb;
    }

    .cm-icon-btn {
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

    .cm-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .cm-btn {
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

    .cm-btn-primary {
      background: #60a5fa;
      color: #ffffff;
    }

    .cm-btn-primary:hover:not(:disabled) {
      background: #3b82f6;
    }

    .cm-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .cm-btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .cm-btn-secondary:hover {
      background: #e5e7eb;
    }

    @media (max-width: 767px) {
      .cm-form-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{isolatedStyles}</style>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Companies</h3>
            <p className="text-sm text-slate-600 mt-1">
              Manage company profiles ({filteredCompanies.length} companies)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List size={18} />
              </button>
            </div>
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
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
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
          <div className="cm-form-modal" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddForm(false);
              setEditing(null);
            }
          }}>
            <div className="cm-form-content">
              <div className="cm-form-header">
                <h2 className="cm-form-title">{editing ? 'Edit Company' : 'Add New Company'}</h2>
                <button className="cm-icon-btn" style={{ color: 'white' }} onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}>
                  <X size={20} />
                </button>
              </div>

              <div className="cm-form-body">
                {/* About Section */}
                <div className="cm-form-section">
                  <h3 className="cm-form-section-title">About Company</h3>
                  <div className="cm-form-grid">
                    <div className="cm-form-group full-width">
                      <label className="cm-form-label">Company Name *</label>
                      <input
                        type="text"
                        className="cm-form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Adidas"
                      />
                    </div>
                    <div className="cm-form-group full-width">
                      <label className="cm-form-label">Company Logo URL</label>
                      <input
                        type="url"
                        className="cm-form-input"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://logo.clearbit.com/adidas.com"
                      />
                    </div>
                    <div className="cm-form-group full-width">
                      <label className="cm-form-label">Description *</label>
                      <textarea
                        className="cm-form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter company description"
                        rows={5}
                      />
                    </div>
                    <div className="cm-form-group">
                      <label className="cm-form-label">Location</label>
                      <input
                        type="text"
                        className="cm-form-input"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Greater Accra, Ghana"
                      />
                    </div>
                    <div className="cm-form-group full-width">
                      <label className="cm-form-label flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
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
                <div className="cm-form-section">
                  <h3 className="cm-form-section-title">Company Details</h3>
                  <div className="cm-form-grid">
                    <div className="cm-form-group">
                      <label className="cm-form-label">Industry *</label>
                      <select
                        className="cm-form-select"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      >
                        <option value="">Select Industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    <div className="cm-form-group">
                      <label className="cm-form-label">Employees *</label>
                      <select
                        className="cm-form-select"
                        value={formData.employees}
                        onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                      >
                        <option value="">Select Range</option>
                        {employeeRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div className="cm-form-group">
                      <label className="cm-form-label">Founded *</label>
                      <input
                        type="text"
                        className="cm-form-input"
                        value={formData.founded}
                        onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                        placeholder="e.g., 2010"
                      />
                    </div>
                    <div className="cm-form-group">
                      <label className="cm-form-label">Website *</label>
                      <input
                        type="url"
                        className="cm-form-input"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="cm-form-group">
                      <label className="cm-form-label">Email *</label>
                      <input
                        type="email"
                        className="cm-form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="careers@example.com"
                      />
                    </div>
                    <div className="cm-form-group">
                      <label className="cm-form-label">Phone *</label>
                      <input
                        type="tel"
                        className="cm-form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="cm-form-footer">
                <button
                  className="cm-btn cm-btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditing(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="cm-btn cm-btn-primary"
                  onClick={() => handleSave(formData, editing || undefined)}
                  disabled={saving || !formData.name || !formData.description || !formData.industry || !formData.employees || !formData.founded || !formData.website || !formData.email || !formData.phone}
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

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="cm-form-modal" onClick={(e) => {
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
                <button className="cm-btn cm-btn-secondary" style={{ flex: 1 }} onClick={() => {
                  setDeleteModalOpen(false);
                  setCompanyToDelete(null);
                }}>
                  Cancel
                </button>
                <button className="cm-btn" style={{ flex: 1, background: '#dc2626', color: 'white' }} onClick={() => companyToDelete && handleDelete(companyToDelete)}>
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

