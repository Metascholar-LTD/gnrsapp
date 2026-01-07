import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, X, Edit2, Trash2, 
  CheckCircle2, ChevronLeft, ChevronRight,
  List, Save, Loader2,
  Briefcase, Calendar, MapPin, Building2,
  FileText, Clock, Award, DollarSign
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  location: string;
  duration: string;
  type: string;
  stipend: string;
  skills: string[];
  requirements: string[];
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
  description: string;
  location: string;
  duration: string;
  type: string;
  stipend: string;
  skills: string;
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

  const [formData, setFormData] = useState<InternshipFormData>({
    title: "",
    company: "",
    companyLogo: "",
    description: "",
    location: "",
    duration: "",
    type: "Full-time",
    stipend: "",
    skills: "",
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
          description: item.description,
          location: item.location,
          duration: item.duration,
          type: item.type,
          stipend: item.stipend,
          skills: item.skills || [],
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
      const payload: any = {
        title: internshipData.title,
        company: internshipData.company,
        company_logo: internshipData.companyLogo,
        description: internshipData.description,
        location: internshipData.location,
        duration: internshipData.duration,
        type: internshipData.type,
        stipend: internshipData.stipend,
        skills: internshipData.skills.split(',').map(s => s.trim()).filter(Boolean),
        requirements: internshipData.requirements.split('\n').filter(Boolean),
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
      description: "",
      location: "",
      duration: "",
      type: "Full-time",
      stipend: "",
      skills: "",
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
      description: internship.description,
      location: internship.location,
      duration: internship.duration,
      type: internship.type,
      stipend: internship.stipend,
      skills: internship.skills.join(', '),
      requirements: internship.requirements.join('\n'),
      imageUrl: internship.imageUrl || "",
      applicationUrl: internship.applicationUrl || "",
    });
    setShowAddForm(true);
  };

  return (
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
            setShowAddForm(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Internship
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search internships..."
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
      ) : paginatedInternships.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No internships found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedInternships.map((internship) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {internship.companyLogo ? (
                      <img src={internship.companyLogo} alt={internship.company} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{internship.title}</h4>
                        <p className="text-sm text-slate-600">{internship.company}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(internship)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setInternshipToDelete(internship.id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{internship.description}</p>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <DollarSign className="w-3 h-3" />
                        <span>{internship.stipend}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="w-3 h-3" />
                        <span>{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3" />
                        <span>{internship.location}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {internship.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {internship.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-3">Posted: {internship.posted}</div>
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

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Internship" : "Add New Internship"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update internship details" : "Create a new internship listing"}
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
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="text-sm font-medium mb-1 block">Stipend</label>
                <Input
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  placeholder="e.g., GHS 1,200/month"
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
              <label className="text-sm font-medium mb-1 block">Skills (comma-separated)</label>
              <Input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
            <DialogTitle>Delete Internship</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this internship? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteModalOpen(false);
              setInternshipToDelete(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => internshipToDelete && handleDelete(internshipToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternshipListingsManager;

