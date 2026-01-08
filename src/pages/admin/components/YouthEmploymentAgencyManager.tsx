import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, X, Edit2, Trash2, 
  ChevronLeft, ChevronRight,
  Save, Loader2,
  Users, MapPin, Clock, DollarSign,
  FileText, Handshake, Lightbulb, Target, Award,
  TrendingUp, Briefcase, GraduationCap, AlertCircle
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

interface YEAProgram {
  id: string;
  title: string;
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
  skills?: string[];
  cultureParagraphs?: string[];
  opportunityParagraphs?: string[];
  duration: string;
  stipend: string;
  locations: string[];
  requirements: string[];
  benefits: string[];
  icon: string;
  color: string;
  textColor: string;
  imageUrl: string;
  applicationUrl?: string;
  created_at?: string;
  updated_at?: string;
}

interface YEAProgramFormData {
  title: string;
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
  duration: string;
  stipend: string;
  locations: string;
  requirements: string;
  benefits: string;
  icon: string;
  color: string;
  imageUrl: string;
  applicationUrl: string;
}

const YouthEmploymentAgencyManager = () => {
  const [programs, setPrograms] = useState<YEAProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState("description");
  const [activeInlineEditor, setActiveInlineEditor] = useState<{ field: string; index: number } | null>(null);

  const [formData, setFormData] = useState<YEAProgramFormData>({
    title: "",
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
    duration: "",
    stipend: "",
    locations: "",
    requirements: "",
    benefits: "",
    icon: "🌳",
    color: "bg-emerald-50 border-emerald-200",
    imageUrl: "",
    applicationUrl: "",
  });

  const colorOptions = [
    { value: "bg-emerald-50 border-emerald-200", label: "Emerald", textColor: "text-emerald-900" },
    { value: "bg-blue-50 border-blue-200", label: "Blue", textColor: "text-blue-900" },
    { value: "bg-amber-50 border-amber-200", label: "Amber", textColor: "text-amber-900" },
    { value: "bg-purple-50 border-purple-200", label: "Purple", textColor: "text-purple-900" },
  ];

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('yea_programs' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading YEA programs:", error);
        toast.error("Failed to load YEA programs");
        setPrograms(getMockPrograms());
        return;
      }

      if (data) {
        const transformed: YEAProgram[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
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
          duration: item.duration,
          stipend: item.stipend,
          locations: item.locations || [],
          requirements: item.requirements || [],
          benefits: item.benefits || [],
          icon: item.icon,
          color: item.color,
          textColor: item.text_color,
          imageUrl: item.image_url,
          applicationUrl: item.application_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setPrograms(transformed);
      } else {
        setPrograms(getMockPrograms());
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load YEA programs");
      setPrograms(getMockPrograms());
    } finally {
      setLoading(false);
    }
  };

  const getMockPrograms = (): YEAProgram[] => [
    {
      id: "1",
      title: "Youth in Afforestation",
      description: "Join the national afforestation program...",
      duration: "12-24 months",
      stipend: "GHS 1,200/month",
      locations: ["All Regions", "Forest Reserves"],
      requirements: ["Ages 18-35", "Basic education", "Physical fitness"],
      benefits: ["Environmental impact", "Skill development", "Stable income"],
      icon: "🌳",
      color: "bg-emerald-50 border-emerald-200",
      textColor: "text-emerald-900",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Youth in Sanitation",
      description: "Work in waste management and sanitation...",
      duration: "12 months",
      stipend: "GHS 1,000/month",
      locations: ["Urban Areas", "Municipalities"],
      requirements: ["Ages 18-35", "Willingness to work"],
      benefits: ["Community service", "Regular income", "Skill training"],
      icon: "🧹",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-900",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop",
    },
  ];

  const filteredPrograms = useMemo(() => {
    let filtered = programs;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(query) ||
        (program.descriptionParagraphs?.[0] || program.description || "").toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [programs, searchQuery]);

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(start, start + itemsPerPage);
  }, [filteredPrograms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handleSave = async (programData: YEAProgramFormData, programId?: string) => {
    setSaving(true);
    try {
      const selectedColor = colorOptions.find(c => c.value === programData.color);
      
      // Parse field ops groups safely
      let fieldOpsGroupsParsed = [];
      if (programData.fieldOpsGroups) {
        try {
          fieldOpsGroupsParsed = JSON.parse(programData.fieldOpsGroups);
        } catch (e) {
          console.error("Error parsing field ops groups:", e);
        }
      }

      // Extract first paragraph as short description for listings (split by double newlines for paragraphs)
      const paragraphs = programData.descriptionParagraphs ? programData.descriptionParagraphs.split('\n\n').filter(Boolean) : [];
      const shortDescription = paragraphs[0] || "";

      const payload: any = {
        title: programData.title,
        description: shortDescription,
        description_paragraphs: paragraphs,
        impact_paragraphs: programData.impactParagraphs ? programData.impactParagraphs.split('\n').filter(Boolean) : [],
        impact_highlights: programData.impactHighlights ? programData.impactHighlights.split('\n').filter(Boolean) : [],
        field_ops_groups: fieldOpsGroupsParsed,
        skills_formal_qualifications: programData.skillsFormalQualifications ? programData.skillsFormalQualifications.split('\n').filter(Boolean) : [],
        skills_additional_knowledge: programData.skillsAdditionalKnowledge ? programData.skillsAdditionalKnowledge.split('\n').filter(Boolean) : [],
        skills_experience: programData.skillsExperience ? programData.skillsExperience.split('\n').filter(Boolean) : [],
        skills_technical: programData.skillsTechnical ? programData.skillsTechnical.split('\n').filter(Boolean) : [],
        behavioral_attributes: programData.behavioralAttributes ? programData.behavioralAttributes.split('\n').filter(Boolean) : [],
        skills: programData.skills ? programData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        culture_paragraphs: programData.cultureParagraphs ? programData.cultureParagraphs.split('\n').filter(Boolean) : [],
        opportunity_paragraphs: programData.opportunityParagraphs ? programData.opportunityParagraphs.split('\n').filter(Boolean) : [],
        duration: programData.duration,
        stipend: programData.stipend,
        locations: programData.locations.split(',').map(s => s.trim()).filter(Boolean),
        requirements: programData.requirements.split('\n').filter(Boolean),
        benefits: programData.benefits.split('\n').filter(Boolean),
        icon: programData.icon,
        color: programData.color,
        text_color: selectedColor?.textColor || "text-slate-900",
        image_url: programData.imageUrl,
        application_url: programData.applicationUrl,
      };

      if (programId) {
        const { error } = await supabase
          .from('yea_programs' as any)
          .update(payload)
          .eq('id', programId);
        if (error) throw error;
        toast.success("YEA program updated successfully");
      } else {
        const { error } = await supabase
          .from('yea_programs' as any)
          .insert([payload]);
        if (error) throw error;
        toast.success("YEA program created successfully");
      }

      await loadPrograms();
      setShowAddForm(false);
      setEditing(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving YEA program:", error);
      toast.error(error.message || "Failed to save YEA program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('yea_programs' as any)
        .delete()
        .eq('id', programId);
      if (error) throw error;
      toast.success("YEA program deleted successfully");
      await loadPrograms();
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (error: any) {
      console.error("Error deleting YEA program:", error);
      toast.error(error.message || "Failed to delete YEA program");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
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
      duration: "",
      stipend: "",
      locations: "",
      requirements: "",
      benefits: "",
      icon: "🌳",
      color: "bg-emerald-50 border-emerald-200",
      imageUrl: "",
      applicationUrl: "",
    });
  };

  const handleEdit = (program: YEAProgram) => {
    setEditing(program.id);
    setFormData({
      title: program.title,
      descriptionParagraphs: program.descriptionParagraphs ? program.descriptionParagraphs.join('\n\n') : program.description || "",
      impactParagraphs: program.impactParagraphs ? program.impactParagraphs.join('\n') : "",
      impactHighlights: program.impactHighlights ? program.impactHighlights.join('\n') : "",
      fieldOpsGroups: program.fieldOpsGroups ? JSON.stringify(program.fieldOpsGroups, null, 2) : "",
      skillsFormalQualifications: program.skillsFormalQualifications ? program.skillsFormalQualifications.join('\n') : "",
      skillsAdditionalKnowledge: program.skillsAdditionalKnowledge ? program.skillsAdditionalKnowledge.join('\n') : "",
      skillsExperience: program.skillsExperience ? program.skillsExperience.join('\n') : "",
      skillsTechnical: program.skillsTechnical ? program.skillsTechnical.join('\n') : "",
      behavioralAttributes: program.behavioralAttributes ? program.behavioralAttributes.join('\n') : "",
      skills: program.skills ? program.skills.join(', ') : "",
      cultureParagraphs: program.cultureParagraphs ? program.cultureParagraphs.join('\n') : "",
      opportunityParagraphs: program.opportunityParagraphs ? program.opportunityParagraphs.join('\n') : "",
      duration: program.duration,
      stipend: program.stipend,
      locations: program.locations.join(', '),
      requirements: program.requirements.join('\n'),
      benefits: program.benefits.join('\n'),
      icon: program.icon,
      color: program.color,
      imageUrl: program.imageUrl,
      applicationUrl: program.applicationUrl || "",
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
          <h3 className="text-xl font-bold text-slate-900">Youth Employment Agency Programs</h3>
          <p className="text-sm text-slate-600 mt-1">
            Manage YEA employment programs ({filteredPrograms.length} programs)
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowAddForm(true);
            setActiveFormTab("description");
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Program
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <Input
          type="text"
          placeholder="Search YEA programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : paginatedPrograms.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No YEA programs found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedPrograms.map((program) => {
              return (
                <motion.div
                  key={program.id}
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
                        {program.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                        {program.descriptionParagraphs?.[0] || program.description || ""}
                      </p>

                      {/* Info Icons */}
                      <div className="space-y-1.5 mb-3 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          <DollarSign className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                          <span className="font-semibold truncate">{program.stipend}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{program.locations[0]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{program.locations.length} location{program.locations.length > 1 ? 's' : ''}</span>
                        </div>
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
                              handleEdit(program);
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
                              setProgramToDelete(program.id);
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
              );
            })}
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
              <h2 className="sm-form-title">{editing ? 'Edit YEA Program' : 'Add New YEA Program'}</h2>
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
                        <label className="sm-form-label">Program Title *</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Youth in Afforestation"
                        />
                      </div>
                      <div className="sm-form-group">
                        <label className="sm-form-label">Duration *</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="e.g., 12-24 months"
                        />
                      </div>
                      <div className="sm-form-group">
                        <label className="sm-form-label">Stipend *</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.stipend}
                          onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                          placeholder="e.g., GHS 1,200/month"
                        />
                      </div>
                      <div className="sm-form-group full-width">
                        <label className="sm-form-label">Locations (comma-separated)</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.locations}
                          onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                          placeholder="e.g., All Regions, Forest Reserves"
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
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title">Description</h3>
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Description * (Enter paragraphs separated by double newlines)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.descriptionParagraphs}
                        onChange={(e) => setFormData({ ...formData, descriptionParagraphs: e.target.value })}
                        placeholder="Enter program description paragraphs. Press Enter twice to create a new paragraph."
                        rows={12}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Impact Tab - Same structure as InternshipListingsManager */}
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

              {/* Skills & Experience Tab - Using same "one per line" structure */}
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
                  {/* Additional Knowledge, Experience, Technical Skills, Behavioral Attributes - Same pattern */}
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
                        placeholder="e.g., Leadership, Teamwork, Communication"
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
                    <h3 className="sm-form-section-title">Requirements & Benefits</h3>
                    <div className="sm-form-grid">
                      <div className="sm-form-group">
                        <label className="sm-form-label">Requirements (one per line)</label>
                        <textarea
                          className="sm-form-textarea"
                          value={formData.requirements}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          placeholder="Enter requirements, one per line"
                          rows={6}
                        />
                      </div>
                      <div className="sm-form-group">
                        <label className="sm-form-label">Benefits (one per line)</label>
                        <textarea
                          className="sm-form-textarea"
                          value={formData.benefits}
                          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                          placeholder="Enter benefits, one per line"
                          rows={6}
                        />
                      </div>
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
                disabled={saving || !formData.title || !formData.descriptionParagraphs}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                    {editing ? "Update" : "Create"} Program
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
            setProgramToDelete(null);
          }
        }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '400px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#fee2e2', marginBottom: '1rem' }}>
                <AlertCircle style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete YEA Program</h3>
              <p style={{ color: '#6b7280' }}>Are you sure you want to delete this YEA program? This action cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="sm-btn sm-btn-secondary" style={{ flex: 1 }} onClick={() => {
                setDeleteModalOpen(false);
                setProgramToDelete(null);
              }}>
                Cancel
              </button>
              <button className="sm-btn" style={{ flex: 1, background: '#dc2626', color: 'white' }} onClick={() => programToDelete && handleDelete(programToDelete)}>
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

export default YouthEmploymentAgencyManager;

