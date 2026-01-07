import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, X, Edit2, Trash2, 
  ChevronLeft, ChevronRight,
  Save, Loader2,
  GraduationCap, MapPin, Clock, DollarSign, Building2,
  FileText, TrendingUp, Users, Award, Target
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

interface GraduateProgram {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  imageUrl?: string;
  applicationUrl?: string;
  created_at?: string;
  updated_at?: string;
}

interface GraduateProgramFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  skills: string;
  imageUrl: string;
  applicationUrl: string;
}

const GraduateRecruitmentManager = () => {
  const [programs, setPrograms] = useState<GraduateProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const [formData, setFormData] = useState<GraduateProgramFormData>({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    duration: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: "",
    imageUrl: "",
    applicationUrl: "",
  });

  const types = ["Full-time", "Part-time", "Contract"];
  const durations = ["12 months", "18 months", "24 months", "36 months"];

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('graduate_programs' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading graduate programs:", error);
        toast.error("Failed to load graduate programs");
        setPrograms(getMockPrograms());
        return;
      }

      if (data) {
        const transformed: GraduateProgram[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          location: item.location,
          type: item.type,
          duration: item.duration,
          salary: item.salary,
          posted: item.posted || new Date().toISOString().split('T')[0],
          description: item.description,
          requirements: item.requirements || [],
          benefits: item.benefits || [],
          skills: item.skills || [],
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
      toast.error("Failed to load graduate programs");
      setPrograms(getMockPrograms());
    } finally {
      setLoading(false);
    }
  };

  const getMockPrograms = (): GraduateProgram[] => [
    {
      id: "1",
      title: "Management Trainee Program",
      company: "First National Bank",
      location: "Accra, Greater Accra",
      type: "Full-time",
      duration: "18 months",
      salary: "Competitive",
      posted: "3 days ago",
      description: "Join our prestigious management trainee program...",
      requirements: ["First Class or Second Class Upper degree", "Strong leadership potential"],
      benefits: ["Comprehensive training program", "Mentorship from senior executives"],
      skills: ["Leadership", "Analytical Thinking", "Communication"],
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop",
    },
  ];

  const filteredPrograms = useMemo(() => {
    let filtered = programs;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(query) ||
        program.company.toLowerCase().includes(query) ||
        program.location.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [programs, searchQuery]);

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(start, start + itemsPerPage);
  }, [filteredPrograms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handleSave = async (programData: GraduateProgramFormData, programId?: string) => {
    setSaving(true);
    try {
      const payload: any = {
        title: programData.title,
        company: programData.company,
        location: programData.location,
        type: programData.type,
        duration: programData.duration,
        salary: programData.salary,
        description: programData.description,
        requirements: programData.requirements.split('\n').filter(Boolean),
        benefits: programData.benefits.split('\n').filter(Boolean),
        skills: programData.skills.split(',').map(s => s.trim()).filter(Boolean),
        image_url: programData.imageUrl,
        application_url: programData.applicationUrl,
        posted: new Date().toISOString().split('T')[0],
      };

      if (programId) {
        const { error } = await supabase
          .from('graduate_programs' as any)
          .update(payload)
          .eq('id', programId);
        if (error) throw error;
        toast.success("Graduate program updated successfully");
      } else {
        const { error } = await supabase
          .from('graduate_programs' as any)
          .insert([payload]);
        if (error) throw error;
        toast.success("Graduate program created successfully");
      }

      await loadPrograms();
      setShowAddForm(false);
      setEditing(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving graduate program:", error);
      toast.error(error.message || "Failed to save graduate program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('graduate_programs' as any)
        .delete()
        .eq('id', programId);
      if (error) throw error;
      toast.success("Graduate program deleted successfully");
      await loadPrograms();
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (error: any) {
      console.error("Error deleting graduate program:", error);
      toast.error(error.message || "Failed to delete graduate program");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      duration: "",
      salary: "",
      description: "",
      requirements: "",
      benefits: "",
      skills: "",
      imageUrl: "",
      applicationUrl: "",
    });
  };

  const handleEdit = (program: GraduateProgram) => {
    setEditing(program.id);
    setFormData({
      title: program.title,
      company: program.company,
      location: program.location,
      type: program.type,
      duration: program.duration,
      salary: program.salary,
      description: program.description,
      requirements: program.requirements.join('\n'),
      benefits: program.benefits.join('\n'),
      skills: program.skills.join(', '),
      imageUrl: program.imageUrl || "",
      applicationUrl: program.applicationUrl || "",
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Graduate Recruitment Programs</h3>
          <p className="text-sm text-slate-600 mt-1">
            Manage graduate recruitment programs ({filteredPrograms.length} programs)
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
            placeholder="Search graduate programs..."
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
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No graduate programs found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPrograms.map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-1 w-full bg-slate-300" />
                <div className="relative h-32 overflow-hidden bg-slate-100">
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-[10px] bg-white/95">
                      {program.type}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{program.title}</h4>
                      <p className="text-xs text-slate-600 font-medium">{program.company}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(program)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProgramToDelete(program.id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">{program.description}</p>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold">{program.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{program.location.split(',')[0]}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">Posted: {program.posted}</div>
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

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Graduate Program" : "Add New Graduate Program"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update graduate program details" : "Create a new graduate recruitment program"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Company *</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Duration *</label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(duration => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Salary</label>
                <Input
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., Competitive"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
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
              <label className="text-sm font-medium mb-1 block">Skills (comma-separated)</label>
              <Input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
              disabled={saving || !formData.title || !formData.company}
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
            <DialogTitle>Delete Graduate Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this graduate program? This action cannot be undone.
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

export default GraduateRecruitmentManager;

