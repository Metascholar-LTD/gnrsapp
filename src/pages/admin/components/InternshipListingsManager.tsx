import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, X, Edit2, Trash2, 
  CheckCircle2, ChevronLeft, ChevronRight,
  Save, Loader2,
  Briefcase, Calendar, MapPin, Building2,
  FileText, Clock, DollarSign, TrendingUp,
  GraduationCap, Users, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Internship {
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
  location: string;
  duration: string;
  type: string;
  stipend: string;
  requirements?: string[];
  posted: string;
  imageUrl?: string;
  applicationUrl?: string;
  created_at?: string;
  updated_at?: string;
}

interface InternshipFormData {
  title: string;
  company: string;
  companyLogo: string;
  descriptionParagraphs: string; // Description tab - multiple paragraphs (separated by paragraph breaks)
  impactParagraphs: string; // Impact tab - paragraphs
  impactHighlights: string; // Impact tab - list items
  fieldOpsGroups: string; // Field Ops tab - structured groups (JSON string)
  skillsFormalQualifications: string; // Skills tab
  skillsAdditionalKnowledge: string; // Skills tab
  skillsExperience: string; // Skills tab
  skillsTechnical: string; // Skills tab
  behavioralAttributes: string; // Skills tab - list items
  skills: string; // Skills tab - key skills (comma-separated)
  cultureParagraphs: string; // Culture tab - paragraphs
  opportunityParagraphs: string; // Culture tab - paragraphs
  location: string;
  duration: string;
  type: string;
  stipend: string;
  requirements: string;
  imageUrl: string;
  applicationUrl: string;
}

const InternshipListingsManager = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState("description");
  const [activeInlineEditor, setActiveInlineEditor] = useState<{ field: string; index: number } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<InternshipFormData>({
    title: "",
    company: "",
    companyLogo: "",
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
    location: "",
    duration: "",
    type: "Full-time",
    stipend: "",
    requirements: "",
    imageUrl: "",
    applicationUrl: "",
  });

  const types = ["Full-time", "Part-time", "Remote", "Hybrid"];
  const durations = ["1-3 months", "3-6 months", "6-12 months", "12+ months"];

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internships' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading internships:", error);
        toast.error("Failed to load internships");
        setInternships(getMockInternships());
        return;
      }

      if (data) {
        const transformed: Internship[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          companyLogo: item.company_logo,
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
          location: item.location,
          duration: item.duration,
          type: item.type,
          stipend: item.stipend,
          requirements: item.requirements || [],
          posted: item.posted || new Date().toISOString().split('T')[0],
          imageUrl: item.image_url,
          applicationUrl: item.application_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setInternships(transformed);
      } else {
        setInternships(getMockInternships());
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load internships");
      setInternships(getMockInternships());
    } finally {
      setLoading(false);
    }
  };

  const getMockInternships = (): Internship[] => [
    {
      id: "1",
      title: "Software Development Intern",
      company: "Tech Solutions Ghana",
      location: "Accra, Greater Accra",
      duration: "3-6 months",
      type: "Full-time",
      stipend: "GHS 1,200/month",
      description: "Join our dynamic team to develop innovative software solutions...",
      skills: ["JavaScript", "React", "Node.js", "Git"],
      requirements: ["Computer Science student", "Basic programming knowledge"],
      posted: "2 days ago",
    },
    {
      id: "2",
      title: "Marketing Communications Intern",
      company: "Digital Marketing Agency",
      location: "Kumasi, Ashanti",
      duration: "4 months",
      type: "Part-time",
      stipend: "GHS 800/month",
      description: "Gain hands-on experience in digital marketing...",
      skills: ["Social Media", "Content Writing", "Analytics"],
      requirements: ["Marketing/Communications student", "Creative mindset"],
      posted: "5 days ago",
    },
  ];

  const filteredInternships = useMemo(() => {
    let filtered = internships;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(query) ||
        internship.company.toLowerCase().includes(query) ||
        internship.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [internships, searchQuery]);

  const paginatedInternships = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInternships.slice(start, start + itemsPerPage);
  }, [filteredInternships, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);

  const handleSave = async (internshipData: InternshipFormData, internshipId?: string) => {
    setSaving(true);
    try {
      // Parse field ops groups safely
      let fieldOpsGroupsParsed = [];
      if (internshipData.fieldOpsGroups) {
        try {
          fieldOpsGroupsParsed = JSON.parse(internshipData.fieldOpsGroups);
        } catch (e) {
          console.error("Error parsing field ops groups:", e);
        }
      }

      // Extract first paragraph as short description for listings (split by double newlines for paragraphs)
      const paragraphs = internshipData.descriptionParagraphs ? internshipData.descriptionParagraphs.split('\n\n').filter(Boolean) : [];
      const firstParagraph = paragraphs[0] || '';

      const payload: any = {
        title: internshipData.title,
        company: internshipData.company,
        company_logo: internshipData.companyLogo,
        description: firstParagraph || '',
        description_paragraphs: paragraphs,
        impact_paragraphs: internshipData.impactParagraphs ? internshipData.impactParagraphs.split('\n').filter(Boolean) : [],
        impact_highlights: internshipData.impactHighlights ? internshipData.impactHighlights.split('\n').filter(Boolean) : [],
        field_ops_groups: fieldOpsGroupsParsed,
        skills_formal_qualifications: internshipData.skillsFormalQualifications ? internshipData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
        skills_additional_knowledge: internshipData.skillsAdditionalKnowledge ? internshipData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
        skills_experience: internshipData.skillsExperience ? internshipData.skillsExperience.split('\n').filter(Boolean) : [],
        skills_technical: internshipData.skillsTechnical ? internshipData.skillsTechnical.split('\n').filter(Boolean) : [],
        behavioral_attributes: internshipData.behavioralAttributes ? internshipData.behavioralAttributes.split('\n').filter(Boolean) : [],
        skills: internshipData.skills.split(',').map(s => s.trim()).filter(Boolean),
        culture_paragraphs: internshipData.cultureParagraphs ? internshipData.cultureParagraphs.split('\n').filter(Boolean) : [],
        opportunity_paragraphs: internshipData.opportunityParagraphs ? internshipData.opportunityParagraphs.split('\n').filter(Boolean) : [],
        location: internshipData.location,
        duration: internshipData.duration,
        type: internshipData.type,
        stipend: internshipData.stipend,
        requirements: internshipData.requirements ? internshipData.requirements.split('\n').filter(Boolean) : [],
        image_url: internshipData.imageUrl,
        application_url: internshipData.applicationUrl,
        posted: new Date().toISOString().split('T')[0],
      };

      if (internshipId) {
        const { error } = await supabase
          .from('internships' as any)
          .update(payload)
          .eq('id', internshipId);
        if (error) throw error;
        toast.success("Internship updated successfully");
      } else {
        const { error } = await supabase
          .from('internships' as any)
          .insert([payload]);
        if (error) throw error;
        toast.success("Internship created successfully");
      }

      await loadInternships();
      setShowAddForm(false);
      setEditing(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving internship:", error);
      toast.error(error.message || "Failed to save internship");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (internshipId: string) => {
    try {
      const { error } = await supabase
        .from('internships' as any)
        .delete()
        .eq('id', internshipId);
      if (error) throw error;
      toast.success("Internship deleted successfully");
      await loadInternships();
      setDeleteModalOpen(false);
      setInternshipToDelete(null);
    } catch (error: any) {
      console.error("Error deleting internship:", error);
      toast.error(error.message || "Failed to delete internship");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      companyLogo: "",
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
      location: "",
      duration: "",
      type: "Full-time",
      stipend: "",
      requirements: "",
      imageUrl: "",
      applicationUrl: "",
    });
  };

  const handleEdit = (internship: Internship) => {
    setEditing(internship.id);
    setFormData({
      title: internship.title,
      company: internship.company,
      companyLogo: internship.companyLogo || "",
      descriptionParagraphs: internship.descriptionParagraphs?.join('\n\n') || internship.description || "",
      impactParagraphs: internship.impactParagraphs?.join('\n') || "",
      impactHighlights: internship.impactHighlights?.join('\n') || "",
      fieldOpsGroups: internship.fieldOpsGroups ? JSON.stringify(internship.fieldOpsGroups, null, 2) : "",
      skillsFormalQualifications: internship.skillsFormalQualifications?.join('\n') || "",
      skillsAdditionalKnowledge: internship.skillsAdditionalKnowledge?.join('\n') || "",
      skillsExperience: internship.skillsExperience?.join('\n') || "",
      skillsTechnical: internship.skillsTechnical?.join('\n') || "",
      behavioralAttributes: internship.behavioralAttributes?.join('\n') || "",
      skills: internship.skills.join(', '),
      cultureParagraphs: internship.cultureParagraphs?.join('\n') || "",
      opportunityParagraphs: internship.opportunityParagraphs?.join('\n') || "",
      location: internship.location,
      duration: internship.duration,
      type: internship.type,
      stipend: internship.stipend,
      requirements: internship.requirements?.join('\n') || "",
      imageUrl: internship.imageUrl || "",
      applicationUrl: internship.applicationUrl || "",
    });
    setShowAddForm(true);
    setActiveFormTab("description");
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

    .sm-form-tabs {
      border-bottom: 2px solid #e5e7eb;
      background: #f9fafb;
      padding: 0 2rem;
      display: flex;
      gap: 0;
    }

    .sm-form-tab {
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: #6b7280;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sm-form-tab:hover {
      color: #111827;
      background: rgba(96, 165, 250, 0.05);
    }

    .sm-form-tab.active {
      color: #111827;
      font-weight: 600;
      border-bottom-color: #60a5fa;
    }

    .sm-form-tab-content {
      animation: fadeIn 0.3s ease-in-out;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Internship Listings</h3>
          <p className="text-sm text-slate-600 mt-1">
            Manage internship opportunities ({filteredInternships.length} internships)
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditing(null);
            setActiveFormTab("description");
            setShowAddForm(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Internship
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <Input
          type="text"
          placeholder="Search internships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : paginatedInternships.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No internships found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedInternships.map((internship) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring" as const,
                  stiffness: 100,
                  damping: 15,
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
              >
                {/* Compact Card Style - Matching global scholarship page design */}
                <div className="relative w-full overflow-hidden rounded-2xl border-2 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  style={{
                    borderColor: "#e5e7eb"
                  }}
                >
                  {/* Top accent bar - Whitish grey */}
                  <div className="h-1 w-full bg-slate-300" />

                  {/* Card Content - No Image Section */}
                  <div className="flex flex-col flex-1 p-4">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-[#bd9f67] transition-colors">
                      {internship.title}
                    </h3>

                    {/* Company */}
                    <p className="text-xs text-slate-600 mb-3 font-medium">
                      {internship.company}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                      {internship.descriptionParagraphs?.[0] || internship.description || ""}
                    </p>

                    {/* Info Icons */}
                    <div className="space-y-1.5 mb-3 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <DollarSign className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                        <span className="font-semibold truncate">{internship.stipend}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{internship.type}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {internship.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {internship.skills.slice(0, 2).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0 border-slate-300 text-slate-600 bg-slate-50">
                            {skill}
                          </Badge>
                        ))}
                        {internship.skills.length > 2 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-slate-300 text-slate-600 bg-slate-50">
                            +{internship.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Posted Date */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>Posted: {internship.posted}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(internship);
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
                            setInternshipToDelete(internship.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-slate-900" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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
              <h2 className="sm-form-title">{editing ? 'Edit Internship' : 'Add New Internship'}</h2>
              <button className="sm-icon-btn" style={{ color: 'white' }} onClick={() => {
                setShowAddForm(false);
                setEditing(null);
              }}>
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="sm-form-tabs">
              <button
                onClick={() => {
                  setActiveFormTab("description");
                  setActiveInlineEditor(null);
                }}
                className={`sm-form-tab ${activeFormTab === "description" ? "active" : ""}`}
              >
                <FileText size={16} />
                <span>Description</span>
              </button>
              <button
                onClick={() => {
                  setActiveFormTab("impact");
                  setActiveInlineEditor(null);
                }}
                className={`sm-form-tab ${activeFormTab === "impact" ? "active" : ""}`}
              >
                <TrendingUp size={16} />
                <span>Impact</span>
              </button>
              <button
                onClick={() => {
                  setActiveFormTab("field-ops");
                  setActiveInlineEditor(null);
                }}
                className={`sm-form-tab ${activeFormTab === "field-ops" ? "active" : ""}`}
              >
                <Briefcase size={16} />
                <span>Field Ops</span>
              </button>
              <button
                onClick={() => {
                  setActiveFormTab("skills");
                  setActiveInlineEditor(null);
                }}
                className={`sm-form-tab ${activeFormTab === "skills" ? "active" : ""}`}
              >
                <GraduationCap size={16} />
                <span>Skills & Experience</span>
              </button>
              <button
                onClick={() => {
                  setActiveFormTab("culture");
                  setActiveInlineEditor(null);
                }}
                className={`sm-form-tab ${activeFormTab === "culture" ? "active" : ""}`}
              >
                <Users size={16} />
                <span>Culture & Apply</span>
              </button>
            </div>

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
                        <label className="sm-form-label">Internship Title *</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Software Development Intern"
                        />
                      </div>
                      <div className="sm-form-group full-width">
                        <label className="sm-form-label">Company *</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g., Tech Solutions Ghana"
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
                        <label className="sm-form-label">Stipend</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.stipend}
                          onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                          placeholder="e.g., GHS 1,200/month"
                        />
                      </div>
                      <div className="sm-form-group">
                        <label className="sm-form-label">Location *</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Accra, Greater Accra"
                        />
                      </div>
                      <div className="sm-form-group">
                        <label className="sm-form-label">Duration *</label>
                        <select
                          className="sm-form-select"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        >
                          <option value="">Select Duration</option>
                          {durations.map(duration => (
                            <option key={duration} value={duration}>{duration}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm-form-group">
                        <label className="sm-form-label">Type *</label>
                        <select
                          className="sm-form-select"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          {types.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Description</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Description * (Enter paragraphs separated by double newlines)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.descriptionParagraphs}
                        onChange={(e) => setFormData({ ...formData, descriptionParagraphs: e.target.value })}
                        placeholder="Enter internship description paragraphs. Press Enter twice to create a new paragraph."
                        rows={12}
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
                      <label className="sm-form-label">Impact Paragraphs (each paragraph)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter an impact paragraph"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            impactParagraphs: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter an impact paragraph"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "impactParagraphs",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            impactParagraphs: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                      <label className="sm-form-label">Impact Highlights (each point)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter an impact highlight"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            impactHighlights: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter an impact highlight"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "impactHighlights",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            impactHighlights: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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

              {/* Field Ops Tab */}
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
                      <label className="sm-form-label">Field Operation Groups</label>
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
                          groups = [{ title: "", items: [""] }];
                        }
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {groups.map((group, groupIndex) => (
                              <div
                                key={groupIndex}
                                style={{
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "0.5rem",
                                  padding: "1.5rem",
                                  background: "#f9fafb",
                                }}
                              >
                                <div style={{ marginBottom: "1rem", position: "relative" }}>
                                  {groups.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = groups.filter((_, i) => i !== groupIndex);
                                        setFormData({
                                          ...formData,
                                          fieldOpsGroups: updated.length > 0 ? JSON.stringify(updated) : "",
                                        });
                                      }}
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        padding: "0.5rem",
                                        border: "none",
                                        background: "transparent",
                                        color: "#dc2626",
                                        cursor: "pointer",
                                        borderRadius: "0.375rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 1,
                                      }}
                                      aria-label="Remove operation group"
                                    >
                                      <X size={18} />
                                    </button>
                                  )}
                                  <label className="sm-form-label" style={{ marginBottom: "0.5rem", display: "block" }}>
                                    Operation Head {groups.length > 1 && `#${groupIndex + 1}`}
                                  </label>
                                  <input
                                    type="text"
                                    className="sm-form-input"
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
                                    style={{ width: "100%" }}
                                  />
                                </div>
                                <div>
                                  <label className="sm-form-label" style={{ marginBottom: "0.5rem" }}>
                                    Operation List (each point)
                                  </label>
                                  {(() => {
                                    const items = group.items.length > 0 ? group.items : [""];
                                    return (
                                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {items.map((item, itemIndex) => {
                                          const isActive =
                                            activeInlineEditor?.field === `fieldOpsItems_${groupIndex}` &&
                                            activeInlineEditor.index === itemIndex;
                                          return (
                                            <div
                                              key={itemIndex}
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
                                                    borderRadius: "9999px",
                                                    background: "#f3f4f6",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "0.75rem",
                                                    color: "#4b5563",
                                                  }}
                                                >
                                                  {itemIndex + 1}
                                                </span>
                                                {isActive ? (
                                                  <textarea
                                                    className="sm-form-textarea"
                                                    style={{ width: "100%" }}
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
                                                    className="sm-form-input"
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
                                                      updated[groupIndex] = { ...updated[groupIndex], items: updatedItems.length > 0 ? updatedItems : [""] };
                                                      setFormData({
                                                        ...formData,
                                                        fieldOpsGroups: JSON.stringify(updated),
                                                      });
                                                    }}
                                                    style={{
                                                      border: "none",
                                                      background: "transparent",
                                                      color: "#9ca3af",
                                                      cursor: "pointer",
                                                      padding: "0.25rem",
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
                                            const updatedItems = [...items, ""];
                                            updated[groupIndex] = { ...updated[groupIndex], items: updatedItems };
                                            setFormData({
                                              ...formData,
                                              fieldOpsGroups: JSON.stringify(updated),
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
                                const updated = [...groups, { title: "", items: [""] }];
                                setFormData({
                                  ...formData,
                                  fieldOpsGroups: JSON.stringify(updated),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                padding: "0.625rem 1.25rem",
                                fontSize: "0.875rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #60a5fa",
                                background: "white",
                                color: "#60a5fa",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                cursor: "pointer",
                                fontWeight: 500,
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#eff6ff";
                                e.currentTarget.style.borderColor = "#3b82f6";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.borderColor = "#60a5fa";
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
                </motion.div>
              )}

              {/* Skills & Experience Tab */}
              {activeFormTab === "skills" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="sm-form-tab-content"
                >
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Formal Qualifications</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Formal Qualifications (each point)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a qualification"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsFormalQualifications: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a qualification"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "skillsFormalQualifications",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsFormalQualifications: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Additional Knowledge</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Additional Knowledge (each point)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter knowledge point"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsAdditionalKnowledge: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter knowledge point"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "skillsAdditionalKnowledge",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsAdditionalKnowledge: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                                        aria-label="Remove knowledge point"
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
                              Add knowledge point
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Experience</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Experience (each point)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter experience point"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsExperience: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter experience point"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "skillsExperience",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsExperience: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                                        aria-label="Remove experience point"
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
                              Add experience point
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Technical Skills</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Technical Skills (each point)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a technical skill"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsTechnical: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a technical skill"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "skillsTechnical",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            skillsTechnical: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Behavioural Attributes</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Behavioural Attributes (each point)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a behavioural attribute"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            behavioralAttributes: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a behavioural attribute"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "behavioralAttributes",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            behavioralAttributes: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Key Skills In Demand</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Key Skills (comma-separated)</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="e.g., JavaScript, React, Communication"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Culture & Apply Tab */}
              {activeFormTab === "culture" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="sm-form-tab-content"
                >
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Culture Paragraphs</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Culture Paragraphs (each paragraph)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a culture paragraph"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            cultureParagraphs: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a culture paragraph"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "cultureParagraphs",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            cultureParagraphs: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Opportunity Paragraphs</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Opportunity Paragraphs (each paragraph)</label>
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
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter an opportunity paragraph"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            opportunityParagraphs: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter an opportunity paragraph"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "opportunityParagraphs",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            opportunityParagraphs: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
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
                  </div>
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Application & Media</h3>
                    <div className="sm-form-grid">
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
                    </div>
                  </div>
                </motion.div>
              )}
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
                disabled={saving || !formData.title || !formData.company || !formData.descriptionParagraphs}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                    {editing ? "Update" : "Create"} Internship
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="sm-form-modal" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setDeleteModalOpen(false);
            setInternshipToDelete(null);
          }
        }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '400px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#fee2e2', marginBottom: '1rem' }}>
                <AlertCircle style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Internship</h3>
              <p style={{ color: '#6b7280' }}>Are you sure you want to delete this internship? This action cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="sm-btn sm-btn-secondary" style={{ flex: 1 }} onClick={() => {
                setDeleteModalOpen(false);
                setInternshipToDelete(null);
              }}>
                Cancel
              </button>
              <button className="sm-btn" style={{ flex: 1, background: '#dc2626', color: 'white' }} onClick={() => internshipToDelete && handleDelete(internshipToDelete)}>
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

export default InternshipListingsManager;

