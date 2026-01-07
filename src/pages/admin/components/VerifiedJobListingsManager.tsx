import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, 
  CheckCircle2, XCircle, TrendingUp, ChevronLeft, ChevronRight,
  Grid3x3, List, Save, Loader2, Image as ImageIcon,
  Briefcase, DollarSign, Calendar, MapPin, Building2,
  AlertCircle, FileText, Clock, Info, Users, GraduationCap,
  ArrowRight, Star, Shield
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

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  fullDescription?: string;
  educationLevel: string;
  experienceLevel: string;
  contractType: string;
  region: string;
  city: string;
  skills: string[];
  date: string;
  verified: boolean;
  featured: boolean;
  salary?: string;
  imageUrl?: string;
  requirements?: string[];
  benefits?: string[];
  applicationUrl?: string;
  created_at?: string;
  updated_at?: string;
}

interface JobFormData {
  title: string;
  company: string;
  companyLogo: string;
  description: string;
  fullDescription: string;
  educationLevel: string;
  experienceLevel: string;
  contractType: string;
  region: string;
  city: string;
  skills: string;
  salary: string;
  verified: boolean;
  featured: boolean;
  imageUrl: string;
  requirements: string;
  benefits: string;
  applicationUrl: string;
}

const VerifiedJobListingsManager = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    region: "",
    contractType: "",
    educationLevel: "",
    verified: "",
    featured: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    companyLogo: "",
    description: "",
    fullDescription: "",
    educationLevel: "Bachelor",
    experienceLevel: "2 to 5 years",
    contractType: "Permanent contract",
    region: "Greater Accra",
    city: "",
    skills: "",
    salary: "",
    verified: true,
    featured: false,
    imageUrl: "",
    requirements: "",
    benefits: "",
    applicationUrl: "",
  });

  const regions = [
    "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
    "Northern", "Upper East", "Upper West", "Volta", "Brong Ahafo",
    "Western North", "Ahafo", "Bono", "Bono East", "Oti", "North East", "Savannah"
  ];

  const contractTypes = [
    "Permanent contract", "Fixed-term contract", "Freelance",
    "Part-time work", "Internship", "Temporary work"
  ];

  const educationLevels = [
    "High school", "HND", "Bachelor", "Master", "Doctorate",
    "College", "Technical school"
  ];

  const experienceLevels = [
    "No experience", "Less than 2 years", "2 to 5 years",
    "5 to 10 years", "More than 10 years"
  ];

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading jobs:", error);
        toast.error("Failed to load jobs");
        // Use mock data for now
        setJobs(getMockJobs());
        return;
      }

      if (data) {
        const transformed: Job[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          companyLogo: item.company_logo,
          description: item.description,
          fullDescription: item.full_description,
          educationLevel: item.education_level || "Bachelor",
          experienceLevel: item.experience_level || "2 to 5 years",
          contractType: item.contract_type || "Permanent contract",
          region: item.region || "Greater Accra",
          city: item.city || "",
          skills: item.skills || [],
          date: item.date || new Date().toISOString().split('T')[0],
          verified: item.verified || false,
          featured: item.featured || false,
          salary: item.salary,
          imageUrl: item.image_url,
          requirements: item.requirements || [],
          benefits: item.benefits || [],
          applicationUrl: item.application_url,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setJobs(transformed);
      } else {
        setJobs(getMockJobs());
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load jobs");
      setJobs(getMockJobs());
    } finally {
      setLoading(false);
    }
  };

  const getMockJobs = (): Job[] => [
    {
      id: "1",
      title: "Marketing Manager- Accra",
      company: "WESTERN GOVERNORS UNIVERSITY",
      companyLogo: "https://logo.clearbit.com/wgu.edu",
      description: "Western Governors University (WGU) is seeking an experienced and innovative Marketing Manager...",
      educationLevel: "Master",
      experienceLevel: "5 to 10 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "East Legon",
      skills: ["Marketing", "Strategy", "Communication"],
      date: "19.11.2025",
      verified: true,
      featured: true,
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "Microsoft",
      companyLogo: "https://logo.clearbit.com/microsoft.com",
      description: "Microsoft is seeking a talented Software Engineer to join our development team...",
      educationLevel: "Bachelor",
      experienceLevel: "2 to 5 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "Accra",
      skills: ["C#", ".NET", "Azure", "Software Development"],
      date: "20.11.2025",
      verified: true,
      featured: false,
    },
  ];

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.city.toLowerCase().includes(query) ||
        job.region.toLowerCase().includes(query)
      );
    }

    if (selectedFilters.region) {
      filtered = filtered.filter(job => job.region === selectedFilters.region);
    }

    if (selectedFilters.contractType) {
      filtered = filtered.filter(job => job.contractType === selectedFilters.contractType);
    }

    if (selectedFilters.educationLevel) {
      filtered = filtered.filter(job => job.educationLevel === selectedFilters.educationLevel);
    }

    if (selectedFilters.verified !== "") {
      filtered = filtered.filter(job => 
        selectedFilters.verified === "true" ? job.verified : !job.verified
      );
    }

    if (selectedFilters.featured !== "") {
      filtered = filtered.filter(job => 
        selectedFilters.featured === "true" ? job.featured : !job.featured
      );
    }

    return filtered;
  }, [jobs, searchQuery, selectedFilters]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handleSave = async (jobData: JobFormData, jobId?: string) => {
    setSaving(true);
    try {
      const jobPayload: any = {
        title: jobData.title,
        company: jobData.company,
        company_logo: jobData.companyLogo,
        description: jobData.description,
        full_description: jobData.fullDescription,
        education_level: jobData.educationLevel,
        experience_level: jobData.experienceLevel,
        contract_type: jobData.contractType,
        region: jobData.region,
        city: jobData.city,
        skills: jobData.skills.split(',').map(s => s.trim()).filter(Boolean),
        salary: jobData.salary,
        verified: jobData.verified,
        featured: jobData.featured,
        image_url: jobData.imageUrl,
        requirements: jobData.requirements.split('\n').filter(Boolean),
        benefits: jobData.benefits.split('\n').filter(Boolean),
        application_url: jobData.applicationUrl,
        date: new Date().toISOString().split('T')[0],
      };

      if (jobId) {
        const { error } = await supabase
          .from('jobs' as any)
          .update(jobPayload)
          .eq('id', jobId);

        if (error) throw error;
        toast.success("Job updated successfully");
      } else {
        const { error } = await supabase
          .from('jobs' as any)
          .insert([jobPayload]);

        if (error) throw error;
        toast.success("Job created successfully");
      }

      await loadJobs();
      setShowAddForm(false);
      setEditing(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast.error(error.message || "Failed to save job");
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
      toast.success("Job deleted successfully");
      await loadJobs();
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast.error(error.message || "Failed to delete job");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      companyLogo: "",
      description: "",
      fullDescription: "",
      educationLevel: "Bachelor",
      experienceLevel: "2 to 5 years",
      contractType: "Permanent contract",
      region: "Greater Accra",
      city: "",
      skills: "",
      salary: "",
      verified: true,
      featured: false,
      imageUrl: "",
      requirements: "",
      benefits: "",
      applicationUrl: "",
    });
  };

  const handleEdit = (job: Job) => {
    setEditing(job.id);
    setFormData({
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || "",
      description: job.description,
      fullDescription: job.fullDescription || "",
      educationLevel: job.educationLevel,
      experienceLevel: job.experienceLevel,
      contractType: job.contractType,
      region: job.region,
      city: job.city,
      skills: job.skills.join(', '),
      salary: job.salary || "",
      verified: job.verified,
      featured: job.featured,
      imageUrl: job.imageUrl || "",
      requirements: job.requirements?.join('\n') || "",
      benefits: job.benefits?.join('\n') || "",
      applicationUrl: job.applicationUrl || "",
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Verified Job Listings</h3>
          <p className="text-sm text-slate-600 mt-1">
            Manage verified and featured job listings ({filteredJobs.length} jobs)
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
          Add New Job
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedFilters.region || "all"}
              onValueChange={(value) => setSelectedFilters({ ...selectedFilters, region: value === "all" ? "" : value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedFilters.contractType || "all"}
              onValueChange={(value) => setSelectedFilters({ ...selectedFilters, contractType: value === "all" ? "" : value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Contract Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {contractTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFilters.verified === "true" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilters({ ...selectedFilters, verified: selectedFilters.verified === "true" ? "" : "true" })}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Verified
          </Button>
          <Button
            variant={selectedFilters.featured === "true" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilters({ ...selectedFilters, featured: selectedFilters.featured === "true" ? "" : "true" })}
          >
            <Star className="w-4 h-4 mr-1" />
            Featured
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedFilters({
                region: "",
                contractType: "",
                educationLevel: "",
                verified: "",
                featured: "",
              });
            }}
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="bg-white rounded-lg border border-slate-200 p-1 inline-flex">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : paginatedJobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No jobs found</p>
        </div>
      ) : (
        <>
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {paginatedJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all ${
                  viewMode === "list" ? "p-6" : "p-4"
                }`}
              >
                <div className="flex items-start gap-4">
                  {viewMode === "list" && (
                    <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{job.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {job.verified && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {job.featured && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3" />
                        <span>{job.city}, {job.region}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <GraduationCap className="w-3 h-3" />
                        <span>{job.educationLevel}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="w-3 h-3" />
                        <span>{job.experienceLevel}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-xs text-slate-500">Posted: {job.date}</span>
                      <div className="flex gap-2">
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
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
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

      {/* Add/Edit Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Job" : "Add New Job"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update job listing details" : "Create a new verified job listing"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Job Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Marketing Manager"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Company *</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Microsoft"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Company Logo URL</label>
                <Input
                  value={formData.companyLogo}
                  onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Salary</label>
                <Input
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., GHS 3,000 - 5,000"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Short Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description (shown in listings)"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Full Description</label>
              <Textarea
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Detailed job description"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Education Level *</label>
                <Select
                  value={formData.educationLevel}
                  onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Experience Level *</label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Contract Type *</label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => setFormData({ ...formData, contractType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Region *</label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData({ ...formData, region: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">City *</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Accra"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Skills (comma-separated)</label>
              <Input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., Marketing, Strategy, Communication"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Requirements (one per line)</label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Enter requirements, one per line"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Benefits (one per line)</label>
              <Textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Enter benefits, one per line"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Application URL</label>
              <Input
                value={formData.applicationUrl}
                onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                placeholder="https://..."
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData({ ...formData, verified: checked === true })}
                />
                <label htmlFor="verified" className="text-sm font-medium cursor-pointer">
                  Verified
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked === true })}
                />
                <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                  Featured
                </label>
              </div>
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
                  {editing ? "Update" : "Create"} Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteModalOpen(false);
              setJobToDelete(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => jobToDelete && handleDelete(jobToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifiedJobListingsManager;

