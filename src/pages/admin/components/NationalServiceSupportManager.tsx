import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, X, Edit2, Trash2, 
  ChevronLeft, ChevronRight,
  Save, Loader2,
  Shield, MapPin, Clock, Users, FileText,
  GraduationCap, Building2, Briefcase, Globe2
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NSSProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  locations: string[];
  requirements: string[];
  benefits: string[];
  icon: string;
  color: string;
  textColor: string;
  imageUrl: string;
  created_at?: string;
  updated_at?: string;
}

interface NSSProgramFormData {
  title: string;
  description: string;
  duration: string;
  locations: string;
  requirements: string;
  benefits: string;
  icon: string;
  color: string;
  imageUrl: string;
}

const NationalServiceSupportManager = () => {
  const [programs, setPrograms] = useState<NSSProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const [formData, setFormData] = useState<NSSProgramFormData>({
    title: "",
    description: "",
    duration: "12 months",
    locations: "",
    requirements: "",
    benefits: "",
    icon: "GraduationCap",
    color: "bg-blue-50 border-blue-200",
    imageUrl: "",
  });

  const iconOptions = [
    { value: "GraduationCap", label: "Teaching" },
    { value: "Shield", label: "Health" },
    { value: "Building2", label: "Administration" },
    { value: "Briefcase", label: "Private Sector" },
  ];

  const colorOptions = [
    { value: "bg-blue-50 border-blue-200", label: "Blue", textColor: "text-blue-900" },
    { value: "bg-red-50 border-red-200", label: "Red", textColor: "text-red-900" },
    { value: "bg-emerald-50 border-emerald-200", label: "Emerald", textColor: "text-emerald-900" },
    { value: "bg-purple-50 border-purple-200", label: "Purple", textColor: "text-purple-900" },
  ];

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('nss_programs' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading NSS programs:", error);
        toast.error("Failed to load NSS programs");
        setPrograms(getMockPrograms());
        return;
      }

      if (data) {
        const transformed: NSSProgram[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          duration: item.duration,
          locations: item.locations || [],
          requirements: item.requirements || [],
          benefits: item.benefits || [],
          icon: item.icon,
          color: item.color,
          textColor: item.text_color,
          imageUrl: item.image_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setPrograms(transformed);
      } else {
        setPrograms(getMockPrograms());
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load NSS programs");
      setPrograms(getMockPrograms());
    } finally {
      setLoading(false);
    }
  };

  const getMockPrograms = (): NSSProgram[] => [
    {
      id: "1",
      title: "Teaching Service",
      description: "Serve as a teacher in public schools across Ghana...",
      duration: "12 months",
      locations: ["All Regions", "Urban & Rural"],
      requirements: ["Education degree", "Teaching certification preferred"],
      benefits: ["Teaching experience", "Professional development", "Community impact"],
      icon: "GraduationCap",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-900",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Health Service",
      description: "Work in healthcare facilities, supporting medical professionals...",
      duration: "12 months",
      locations: ["Hospitals", "Clinics", "Health Centers"],
      requirements: ["Health sciences degree", "Professional registration"],
      benefits: ["Clinical experience", "Professional network", "Healthcare exposure"],
      icon: "Shield",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-900",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop",
    },
  ];

  const filteredPrograms = useMemo(() => {
    let filtered = programs;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [programs, searchQuery]);

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(start, start + itemsPerPage);
  }, [filteredPrograms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handleSave = async (programData: NSSProgramFormData, programId?: string) => {
    setSaving(true);
    try {
      const selectedColor = colorOptions.find(c => c.value === programData.color);
      const payload: any = {
        title: programData.title,
        description: programData.description,
        duration: programData.duration,
        locations: programData.locations.split(',').map(s => s.trim()).filter(Boolean),
        requirements: programData.requirements.split('\n').filter(Boolean),
        benefits: programData.benefits.split('\n').filter(Boolean),
        icon: programData.icon,
        color: programData.color,
        text_color: selectedColor?.textColor || "text-slate-900",
        image_url: programData.imageUrl,
      };

      if (programId) {
        const { error } = await supabase
          .from('nss_programs' as any)
          .update(payload)
          .eq('id', programId);
        if (error) throw error;
        toast.success("NSS program updated successfully");
      } else {
        const { error } = await supabase
          .from('nss_programs' as any)
          .insert([payload]);
        if (error) throw error;
        toast.success("NSS program created successfully");
      }

      await loadPrograms();
      setShowAddForm(false);
      setEditing(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving NSS program:", error);
      toast.error(error.message || "Failed to save NSS program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('nss_programs' as any)
        .delete()
        .eq('id', programId);
      if (error) throw error;
      toast.success("NSS program deleted successfully");
      await loadPrograms();
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (error: any) {
      console.error("Error deleting NSS program:", error);
      toast.error(error.message || "Failed to delete NSS program");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "12 months",
      locations: "",
      requirements: "",
      benefits: "",
      icon: "GraduationCap",
      color: "bg-blue-50 border-blue-200",
      imageUrl: "",
    });
  };

  const handleEdit = (program: NSSProgram) => {
    setEditing(program.id);
    setFormData({
      title: program.title,
      description: program.description,
      duration: program.duration,
      locations: program.locations.join(', '),
      requirements: program.requirements.join('\n'),
      benefits: program.benefits.join('\n'),
      icon: program.icon,
      color: program.color,
      imageUrl: program.imageUrl,
    });
    setShowAddForm(true);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return <GraduationCap className="w-8 h-8" />;
      case "Shield": return <Shield className="w-8 h-8" />;
      case "Building2": return <Building2 className="w-8 h-8" />;
      case "Briefcase": return <Briefcase className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">National Service Support Programs</h3>
          <p className="text-sm text-slate-600 mt-1">
            Manage NSS service areas and programs ({filteredPrograms.length} programs)
          </p>
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
          Add New Program
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search NSS programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : paginatedPrograms.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No NSS programs found</p>
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
                      {/* Icon Badge */}
                      <div className="mb-2">
                        <div className={`w-8 h-8 rounded-lg ${program.color} flex items-center justify-center shadow-sm inline-flex`}>
                          {getIconComponent(program.icon)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-[#bd9f67] transition-colors">
                        {program.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                        {program.description}
                      </p>

                      {/* Info Icons */}
                      <div className="space-y-1.5 mb-3 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#bd9f67] flex-shrink-0" />
                          <span className="font-semibold truncate">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{program.locations[0]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{program.locations.length} location{program.locations.length > 1 ? 's' : ''}</span>
                        </div>
                        {program.requirements.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{program.requirements.length} requirement{program.requirements.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
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

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit NSS Program" : "Add New NSS Program"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update NSS program details" : "Create a new NSS service area program"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Teaching Service"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Duration *</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 12 months"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Icon</label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color Theme</label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(color => (
                    <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Locations (comma-separated)</label>
              <Input
                value={formData.locations}
                onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                placeholder="e.g., All Regions, Urban & Rural"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Requirements (one per line)</label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Benefits (one per line)</label>
              <Textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Image URL</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddForm(false);
              setEditing(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(formData, editing || undefined)}
              disabled={saving || !formData.title || !formData.description}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editing ? "Update" : "Create"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete NSS Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this NSS program? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteModalOpen(false);
              setProgramToDelete(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => programToDelete && handleDelete(programToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NationalServiceSupportManager;

