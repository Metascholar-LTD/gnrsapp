import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, Download, 
  Upload, FileText, CheckCircle2, XCircle, Calendar, 
  Building2, BookOpen, GraduationCap, Users, TrendingUp,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  FileCheck, AlertCircle, Loader2, Grid3x3, List, 
  MoreVertical, CheckSquare, Square, FileX, RefreshCw, Save,
  Target, HelpCircle, FilePlus
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmationModal } from "@/components/admin";

interface MCQ {
  id: string;
  question: string;
  options: { id: string; label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface SectionBDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string; // String format like "2.4 MB"
  uploadDate: string;
  downloadCount: number; // Matches user view
}

interface TrialQuestion {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  year: number;
  semester: "1st" | "2nd";
  university: string;
  universityShort: string;
  questions: number;
  downloads: number;
  views: number;
  verified: boolean;
  uploadDate: string;
  imageUrl?: string;
  mcqs?: MCQ[];
  sectionBDocuments?: SectionBDocument[];
  created_at?: string;
  updated_at?: string;
}

interface TrialQuestionFormData {
  title: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  year: number | string;
  semester: "1st" | "2nd" | "";
  university: string;
  universityShort: string;
  verified: boolean;
  imageUrl: string;
}

const TrialQuestionsManager = () => {
  const [trialQuestions, setTrialQuestions] = useState<TrialQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    university: "",
    faculty: "",
    year: "",
    semester: "",
    verified: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [managingMCQs, setManagingMCQs] = useState<string | null>(null);
  const [managingSectionB, setManagingSectionB] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"mcq" | "sectionB">("mcq"); // Toggle between Section A and B
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<TrialQuestionFormData>({
    title: "",
    courseCode: "",
    courseName: "",
    faculty: "",
    year: new Date().getFullYear(),
    semester: "",
    university: "",
    universityShort: "",
    verified: false,
    imageUrl: "",
  });

  // MCQ Management State
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [editingMCQ, setEditingMCQ] = useState<string | null>(null);
  const [mcqForm, setMcqForm] = useState<MCQ>({
    id: "",
    question: "",
    options: [
      { id: "A", label: "A", text: "" },
      { id: "B", label: "B", text: "" },
      { id: "C", label: "C", text: "" },
      { id: "D", label: "D", text: "" },
    ],
    correctAnswer: "",
    explanation: "",
  });

  // Section B Management State
  const [sectionBDocuments, setSectionBDocuments] = useState<SectionBDocument[]>([]);
  const [editingSectionB, setEditingSectionB] = useState<string | null>(null);
  const [sectionBForm, setSectionBForm] = useState<SectionBDocument>({
    id: "",
    title: "",
    description: "",
    fileUrl: "",
    fileSize: "0 MB",
    uploadDate: new Date().toISOString().split('T')[0],
    downloadCount: 0,
  });

  // University options
  const universities = [
    { name: "University of Ghana", short: "UG" },
    { name: "Kwame Nkrumah University of Science and Technology", short: "KNUST" },
    { name: "University of Cape Coast", short: "UCC" },
    { name: "University of Education, Winneba", short: "UEW" },
    { name: "University of Mines and Technology", short: "UMaT" },
    { name: "University for Development Studies", short: "UDS" },
    { name: "Ghana Institute of Management and Public Administration", short: "GIMPA" },
    { name: "Catholic University of Ghana", short: "CUG" },
    { name: "Pentecost University College", short: "PUC" },
    { name: "University of Energy and Natural Resources", short: "UENR" },
    { name: "Accra Institute of Technology", short: "AIT" },
  ];

  const faculties = [
    "Engineering",
    "Medicine & Health Sciences",
    "Business & Economics",
    "Law",
    "Computing & IT",
    "Arts & Humanities",
    "Natural Sciences",
    "Education",
    "Agriculture",
    "Social Sciences",
    "Physical & Biological Sciences",
  ];


  useEffect(() => {
    fetchTrialQuestions();
  }, []);

  const fetchTrialQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trial_questions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTrialQuestions(data.map((item: any) => ({
          id: item.id,
          title: item.title || "",
          courseCode: item.course_code || "",
          courseName: item.course_name || "",
          faculty: item.faculty || "",
          year: item.year || new Date().getFullYear(),
          semester: item.semester || "1st",
          university: item.university || "",
          universityShort: item.university_short || "",
          questions: item.questions || 0,
          downloads: item.downloads || 0,
          views: item.views || 0,
          verified: item.verified || false,
          uploadDate: item.upload_date || item.created_at || "",
          imageUrl: item.image_url || "",
          created_at: item.created_at,
          updated_at: item.updated_at,
        })));
      }
    } catch (error: any) {
      console.error("Error fetching trial questions:", error);
      toast.error("Failed to load trial questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchMCQs = async (trialQuestionId: string) => {
    try {
      const { data, error } = await supabase
        .from('trial_question_mcqs' as any)
        .select('*')
        .eq('trial_question_id', trialQuestionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMcqs(data.map((item: any) => ({
          id: item.id,
          question: item.question || "",
          options: item.options || [
            { id: "A", label: "A", text: "" },
            { id: "B", label: "B", text: "" },
            { id: "C", label: "C", text: "" },
            { id: "D", label: "D", text: "" },
          ],
          correctAnswer: item.correct_answer || "",
          explanation: item.explanation || "",
        })));
      }
    } catch (error: any) {
      console.error("Error fetching MCQs:", error);
      toast.error("Failed to load MCQs");
    }
  };

  const fetchSectionBDocuments = async (trialQuestionId: string) => {
    try {
      const { data, error } = await supabase
        .from('trial_question_section_b' as any)
        .select('*')
        .eq('trial_question_id', trialQuestionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setSectionBDocuments(data.map((item: any) => ({
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          fileUrl: item.file_url || "",
          fileSize: typeof item.file_size === 'number' ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : (item.file_size || "0 MB"),
          uploadDate: item.upload_date || item.created_at || "",
          downloadCount: item.downloads || item.download_count || 0,
        })));
      }
    } catch (error: any) {
      console.error("Error fetching Section B documents:", error);
      toast.error("Failed to load Section B documents");
    }
  };

  // Filter and search logic
  const filteredQuestions = useMemo(() => {
    return trialQuestions.filter((question) => {
      const matchesSearch = 
        !searchQuery ||
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.university.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUniversity = !selectedFilters.university || question.universityShort === selectedFilters.university;
      const matchesFaculty = !selectedFilters.faculty || question.faculty === selectedFilters.faculty;
      const matchesYear = !selectedFilters.year || question.year.toString() === selectedFilters.year;
      const matchesSemester = !selectedFilters.semester || question.semester === selectedFilters.semester;
      const matchesVerified = selectedFilters.verified === "" || 
        (selectedFilters.verified === "verified" && question.verified) ||
        (selectedFilters.verified === "unverified" && !question.verified);

      return matchesSearch && matchesUniversity && matchesFaculty && matchesYear && matchesSemester && matchesVerified;
    });
  }, [trialQuestions, searchQuery, selectedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: trialQuestions.length,
      verified: trialQuestions.filter(q => q.verified).length,
      unverified: trialQuestions.filter(q => !q.verified).length,
      totalDownloads: trialQuestions.reduce((sum, q) => sum + q.downloads, 0),
      totalViews: trialQuestions.reduce((sum, q) => sum + q.views, 0),
      totalQuestions: trialQuestions.reduce((sum, q) => sum + q.questions, 0),
    };
  }, [trialQuestions]);

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `trial-questions/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('trial-questions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trial-questions')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        imageUrl: publicUrl,
      }));

      setUploadProgress(100);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Section B file upload handler
  const handleSectionBFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `trial-questions/section-b/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('trial-questions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trial-questions')
        .getPublicUrl(fileName);

      setSectionBForm(prev => ({
        ...prev,
        fileUrl: publicUrl,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));

      setUploadProgress(100);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload file: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, []);

  // Save trial question
  const saveTrialQuestion = async () => {
    if (!formData.title || !formData.courseCode || !formData.courseName || 
        !formData.faculty || !formData.year || !formData.semester || 
        !formData.university) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        title: formData.title,
        course_code: formData.courseCode,
        course_name: formData.courseName,
        faculty: formData.faculty,
        year: Number(formData.year),
        semester: formData.semester,
        university: formData.university,
        university_short: formData.universityShort,
        questions: mcqs.length,
        verified: formData.verified,
        downloads: 0,
        views: 0,
        image_url: formData.imageUrl || "",
        upload_date: new Date().toISOString().split('T')[0],
      };

      let trialQuestionId: string;

      if (editing && trialQuestions.find(q => q.id === editing)) {
        // Update existing
        const { error } = await supabase
          .from('trial_questions' as any)
          .update(dataToSave)
          .eq('id', editing);

        if (error) throw error;
        trialQuestionId = editing;
        toast.success("Trial question updated successfully");
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('trial_questions' as any)
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        trialQuestionId = (data as any)?.id || editing;
        toast.success("Trial question added successfully");
      }

      // Save MCQs
      if (mcqs.length > 0 && managingMCQs === trialQuestionId) {
        // Delete existing MCQs
        await supabase
          .from('trial_question_mcqs' as any)
          .delete()
          .eq('trial_question_id', trialQuestionId);

        // Insert new MCQs
        const mcqsToSave = mcqs.map(mcq => ({
          trial_question_id: trialQuestionId,
          question: mcq.question,
          options: mcq.options,
          correct_answer: mcq.correctAnswer,
          explanation: mcq.explanation,
        }));

        const { error: mcqError } = await supabase
          .from('trial_question_mcqs' as any)
          .insert(mcqsToSave);

        if (mcqError) throw mcqError;
      }

      setEditing(null);
      setShowAddForm(false);
      setManagingMCQs(null);
      setManagingSectionB(null);
      setActiveSection("mcq");
      setMcqs([]);
      setSectionBDocuments([]);
      setFormData({
        title: "",
        courseCode: "",
        courseName: "",
        faculty: "",
        year: new Date().getFullYear(),
        semester: "",
        university: "",
    universityShort: "",
    verified: false,
        imageUrl: "",
      });
      fetchTrialQuestions();
    } catch (error: any) {
      console.error("Error saving trial question:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Edit trial question
  const editTrialQuestion = (id: string) => {
    const question = trialQuestions.find(q => q.id === id);
    if (!question) return;

    setEditing(id);
    setFormData({
      title: question.title,
      courseCode: question.courseCode,
      courseName: question.courseName,
      faculty: question.faculty,
      year: question.year,
      semester: question.semester,
      university: question.university,
      universityShort: question.universityShort,
      verified: question.verified,
      imageUrl: question.imageUrl || "",
    });
    setShowAddForm(true);
    setActiveSection("mcq");
    setManagingMCQs(id);
    setManagingSectionB(id); // Set both so toggle appears
    fetchMCQs(id);
    fetchSectionBDocuments(id);
  };

  // Delete trial question
  const deleteTrialQuestion = async (id: string) => {
    try {
      // Delete MCQs first
      await supabase
        .from('trial_question_mcqs' as any)
        .delete()
        .eq('trial_question_id', id);

      // Delete Section B documents
      await supabase
        .from('trial_question_section_b' as any)
        .delete()
        .eq('trial_question_id', id);

      // Delete trial question
      const { error } = await supabase
        .from('trial_questions' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Trial question deleted successfully");
      fetchTrialQuestions();
    } catch (error: any) {
      console.error("Error deleting trial question:", error);
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  // MCQ Management
  const addMCQ = () => {
    setEditingMCQ(null);
    setMcqForm({
      id: "",
      question: "",
      options: [
        { id: "A", label: "A", text: "" },
        { id: "B", label: "B", text: "" },
        { id: "C", label: "C", text: "" },
        { id: "D", label: "D", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
    });
  };

  const saveMCQ = () => {
    if (!mcqForm.question || !mcqForm.correctAnswer || !mcqForm.explanation) {
      toast.error("Please fill in all MCQ fields");
      return;
    }

    if (editingMCQ) {
      setMcqs(mcqs.map(m => m.id === editingMCQ ? mcqForm : m));
      toast.success("MCQ updated");
    } else {
      setMcqs([...mcqs, { ...mcqForm, id: `mcq-${Date.now()}` }]);
      toast.success("MCQ added");
    }
    setEditingMCQ(null);
    setMcqForm({
      id: "",
      question: "",
      options: [
        { id: "A", label: "A", text: "" },
        { id: "B", label: "B", text: "" },
        { id: "C", label: "C", text: "" },
        { id: "D", label: "D", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
    });
  };

  const editMCQ = (id: string) => {
    const mcq = mcqs.find(m => m.id === id);
    if (mcq) {
      setEditingMCQ(id);
      setMcqForm(mcq);
    }
  };

  const deleteMCQ = (id: string) => {
    setMcqs(mcqs.filter(m => m.id !== id));
    toast.success("MCQ deleted");
  };

  // Section B Management
  const addSectionBDocument = () => {
    setEditingSectionB(null);
    setSectionBForm({
      id: "",
      title: "",
      description: "",
      fileUrl: "",
      fileSize: "0 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    });
  };

  const saveSectionBDocument = async () => {
    if (!sectionBForm.title || !sectionBForm.description || !sectionBForm.fileUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!managingSectionB) {
      toast.error("Please select a trial question first");
      return;
    }

    setSaving(true);
    try {
      // Convert fileSize string to bytes for storage
      const fileSizeBytes = sectionBForm.fileSize.includes('MB') 
        ? parseFloat(sectionBForm.fileSize) * 1024 * 1024
        : parseFloat(sectionBForm.fileSize) * 1024;

      const dataToSave = {
        trial_question_id: managingSectionB,
        title: sectionBForm.title,
        description: sectionBForm.description,
        file_url: sectionBForm.fileUrl,
        file_size: fileSizeBytes,
        upload_date: sectionBForm.uploadDate,
        downloads: sectionBForm.downloadCount || 0,
      };

      if (editingSectionB) {
        const { error } = await supabase
          .from('trial_question_section_b' as any)
          .update(dataToSave)
          .eq('id', editingSectionB);

        if (error) throw error;
        toast.success("Section B document updated");
      } else {
        const { error } = await supabase
          .from('trial_question_section_b' as any)
          .insert(dataToSave);

        if (error) throw error;
        toast.success("Section B document added");
      }

      setEditingSectionB(null);
      addSectionBDocument();
      fetchSectionBDocuments(managingSectionB);
    } catch (error: any) {
      console.error("Error saving Section B document:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const editSectionBDocument = (id: string) => {
    const doc = sectionBDocuments.find(d => d.id === id);
    if (doc) {
      setEditingSectionB(id);
      setSectionBForm(doc);
    }
  };

  const deleteSectionBDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trial_question_section_b' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Section B document deleted");
      if (managingSectionB) {
        fetchSectionBDocuments(managingSectionB);
      }
    } catch (error: any) {
      console.error("Error deleting Section B document:", error);
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  const openManageMCQs = (id: string) => {
    const q = trialQuestions.find(tq => tq.id === id);
    if (!q) return;
    
    setEditing(id);
    setFormData({
      title: q.title,
      courseCode: q.courseCode,
      courseName: q.courseName,
      faculty: q.faculty,
      year: q.year,
      semester: q.semester,
      university: q.university,
      universityShort: q.universityShort,
      verified: q.verified,
      imageUrl: q.imageUrl || "",
    });
    setMcqs(q.mcqs || []);
    setSectionBDocuments(q.sectionBDocuments || []);
    setShowAddForm(true);
    setActiveSection("mcq");
    setManagingMCQs(id);
    setManagingSectionB(id); // Set both so toggle appears
    fetchMCQs(id);
    fetchSectionBDocuments(id);
  };


  const handleUniversityChange = (university: string) => {
    const selected = universities.find(u => u.name === university);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        university: selected.name,
        universityShort: selected.short,
      }));
    }
  };

  return (
    <div style={{ padding: '0', margin: '0' }}>
      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <motion.div
          whileHover={{ y: -4 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Target size={20} style={{ color: '#0066cc' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Total Questions</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#000000' }}>{stats.total}</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={20} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Verified</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#000000' }}>{stats.verified}</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Download size={20} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Total Downloads</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#000000' }}>{stats.totalDownloads.toLocaleString()}</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Eye size={20} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Total Views</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#000000' }}>{stats.totalViews.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <select
            value={selectedFilters.university}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, university: e.target.value }))}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e5e5',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '150px',
            }}
          >
            <option value="">All Universities</option>
            {universities.map(u => (
              <option key={u.short} value={u.short}>{u.short}</option>
            ))}
          </select>

          <select
            value={selectedFilters.faculty}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, faculty: e.target.value }))}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e5e5',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '150px',
            }}
          >
            <option value="">All Faculties</option>
            {faculties.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e5e5',
              borderRadius: '0.375rem',
              background: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid3x3 size={18} />}
          </button>

          <button
            onClick={() => {
              setShowAddForm(true);
              setEditing(null);
              setActiveSection("mcq");
              setManagingMCQs("new");
              setManagingSectionB("new");
              setFormData({
                title: "",
                courseCode: "",
                courseName: "",
                faculty: "",
                year: new Date().getFullYear(),
                semester: "",
                university: "",
                universityShort: "",
                verified: false,
                imageUrl: "",
              });
              setMcqs([]);
              setSectionBDocuments([]);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              background: '#0066cc',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', margin: 0 }}>
              {editing ? 'Edit Trial Question' : 'Add New Trial Question'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditing(null);
                setManagingMCQs(null);
                setManagingSectionB(null);
                setActiveSection("mcq");
                setMcqs([]);
                setSectionBDocuments([]);
              }}
              style={{
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Mathematics Practice Set 1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Course Code *
              </label>
              <input
                type="text"
                value={formData.courseCode}
                onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                placeholder="e.g., MATH 101"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Course Name *
              </label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                placeholder="e.g., Basic Mathematics"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Faculty *
              </label>
              <select
                value={formData.faculty}
                onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Select Faculty</option>
                {faculties.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                University *
              </label>
              <select
                value={formData.university}
                onChange={(e) => handleUniversityChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Select University</option>
                {universities.map(u => (
                  <option key={u.short} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Year *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value as "1st" | "2nd" }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Image URL
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Image URL or upload"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0.375rem',
                    background: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="verified" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                Verified
              </label>
            </div>
          </div>

          {/* Section Toggle - Only show when managing */}
          {(managingMCQs || managingSectionB) && (
            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '2rem', 
              borderTop: '2px solid #e5e5e5',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                background: '#f8fafc',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e5e5',
                width: 'fit-content',
              }}>
                <button
                  onClick={() => {
                    setActiveSection("mcq");
                    if (!managingMCQs && (editing || showAddForm)) {
                      const currentId = editing || "new";
                      setManagingMCQs(currentId);
                      if (currentId !== "new") fetchMCQs(currentId);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1.25rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    background: activeSection === "mcq" ? '#0066cc' : 'transparent',
                    color: activeSection === "mcq" ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Target size={16} />
                  Section A (MCQs)
                </button>
                <button
                  onClick={() => {
                    setActiveSection("sectionB");
                    if (!managingSectionB && (editing || showAddForm)) {
                      const currentId = editing || "new";
                      setManagingSectionB(currentId);
                      if (currentId !== "new") fetchSectionBDocuments(currentId);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1.25rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    background: activeSection === "sectionB" ? '#0066cc' : 'transparent',
                    color: activeSection === "sectionB" ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FileText size={16} />
                  Section B
                </button>
              </div>
            </div>
          )}

          {/* MCQ Management Section - Only show when activeSection is "mcq" */}
          {activeSection === "mcq" && (managingMCQs || showAddForm) && (
            <div style={{ marginTop: '0', paddingTop: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                  Section A - MCQs ({mcqs.length})
                </h4>
                <button
                  onClick={addMCQ}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #0066cc',
                    borderRadius: '0.375rem',
                    background: '#ffffff',
                    color: '#0066cc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  <Plus size={16} />
                  Add MCQ
                </button>
              </div>

            {/* MCQ Form */}
            {(editingMCQ !== null || mcqs.length === 0) && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e5e5e5',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Question *
                  </label>
                  <textarea
                    value={mcqForm.question}
                    onChange={(e) => setMcqForm(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter the question..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Options *
                  </label>
                  {mcqForm.options.map((option, idx) => (
                    <div key={option.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, minWidth: '24px' }}>{option.label}:</span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const newOptions = [...mcqForm.options];
                          newOptions[idx].text = e.target.value;
                          setMcqForm(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${option.label}`}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid #e5e5e5',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                        }}
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={mcqForm.correctAnswer === option.id}
                        onChange={() => setMcqForm(prev => ({ ...prev, correctAnswer: option.id }))}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Correct</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    Explanation *
                  </label>
                  <textarea
                    value={mcqForm.explanation}
                    onChange={(e) => setMcqForm(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Enter explanation for the correct answer..."
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={saveMCQ}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      background: '#0066cc',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {editingMCQ ? 'Update MCQ' : 'Add MCQ'}
                  </button>
                  {editingMCQ && (
                    <button
                      onClick={() => {
                        setEditingMCQ(null);
                        addMCQ();
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0.375rem',
                        background: '#ffffff',
                        color: '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* MCQ List */}
            {mcqs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mcqs.map((mcq, idx) => (
                  <div
                    key={mcq.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'start' }}>
                        <span style={{ fontWeight: 700, color: '#0066cc' }}>{idx + 1}.</span>
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>{mcq.question}</span>
                      </div>
                      <div style={{ marginLeft: '1.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        Correct Answer: <strong>{mcq.correctAnswer}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => editMCQ(mcq.id)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #e5e5e5',
                          borderRadius: '0.375rem',
                          background: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteMCQ(mcq.id)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #e5e5e5',
                          borderRadius: '0.375rem',
                          background: '#ffffff',
                          cursor: 'pointer',
                          color: '#dc2626',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Section B Management Section - Only show when activeSection is "sectionB" */}
          {activeSection === "sectionB" && (managingSectionB || showAddForm) && (
            <div style={{ marginTop: '0', paddingTop: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                  Section B - Documents ({sectionBDocuments.length})
                </h4>
                <button
                  onClick={addSectionBDocument}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #0066cc',
                    borderRadius: '0.375rem',
                    background: '#ffffff',
                    color: '#0066cc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  <Plus size={16} />
                  Add Document
                </button>
              </div>

              {/* Section B Form */}
              {(editingSectionB !== null || sectionBDocuments.length === 0) && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      value={sectionBForm.title}
                      onChange={(e) => setSectionBForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Section B - Set 1"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Description *
                    </label>
                    <textarea
                      value={sectionBForm.description}
                      onChange={(e) => setSectionBForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the document..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Document File *
                    </label>
                    <div
                      ref={dropZoneRef}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleSectionBFileUpload(file);
                      }}
                      style={{
                        border: `2px dashed ${isDragging ? '#0066cc' : '#e5e5e5'}`,
                        borderRadius: '0.375rem',
                        padding: '2rem',
                        textAlign: 'center',
                        background: isDragging ? '#f0f7ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {sectionBForm.fileUrl ? (
                        <div>
                          <FileCheck size={32} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
                          <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 0.25rem 0' }}>
                            File uploaded: {sectionBForm.fileUrl.split('/').pop()}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                            Size: {sectionBForm.fileSize}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload size={32} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
                          <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 0.25rem 0' }}>
                            Click to upload or drag and drop
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                            PDF files only (max 50MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSectionBFileUpload(file);
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                    {uploading && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ background: '#e5e5e5', borderRadius: '9999px', height: '4px', overflow: 'hidden' }}>
                          <div style={{
                            background: '#0066cc',
                            height: '100%',
                            width: `${uploadProgress}%`,
                            transition: 'width 0.3s',
                          }} />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={saveSectionBDocument}
                      disabled={saving}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '0.375rem',
                        background: '#0066cc',
                        color: '#ffffff',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      {editingSectionB ? 'Update Document' : 'Add Document'}
                    </button>
                    {editingSectionB && (
                      <button
                        onClick={() => {
                          setEditingSectionB(null);
                          addSectionBDocument();
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid #e5e5e5',
                          borderRadius: '0.375rem',
                          background: '#ffffff',
                          color: '#374151',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Section B Documents List */}
              {sectionBDocuments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sectionBDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#000000', marginBottom: '0.25rem' }}>
                          {doc.title}
                        </h5>
                        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem' }}>
                          {doc.description}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <span>📄 {doc.fileSize}</span>
                          <span>📥 {doc.downloadCount} downloads</span>
                          <span>📅 {new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => editSectionBDocument(doc.id)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e5e5',
                            borderRadius: '0.375rem',
                            background: '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteSectionBDocument(doc.id)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e5e5',
                            borderRadius: '0.375rem',
                            background: '#ffffff',
                            cursor: 'pointer',
                            color: '#dc2626',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #e5e5e5' }}>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditing(null);
                setManagingMCQs(null);
                setManagingSectionB(null);
                setActiveSection("mcq");
                setMcqs([]);
                setSectionBDocuments([]);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '0.375rem',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveTrialQuestion}
              disabled={saving}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                background: '#0066cc',
                color: '#ffffff',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                opacity: saving ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editing ? 'Update Question' : 'Save Question'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Questions List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <p>Loading trial questions...</p>
        </div>
      ) : paginatedQuestions.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '2px dashed #cbd5e1',
          borderRadius: '0.5rem',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}>
          <FileText size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
            No trial questions found
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {searchQuery || Object.values(selectedFilters).some(f => f) 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first trial question'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paginatedQuestions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: '#0066cc',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {question.courseCode}
                    </span>
                    {question.verified && (
                      <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                    )}
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {question.universityShort} • {question.year} • {question.semester}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000000', marginBottom: '0.25rem' }}>
                    {question.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    {question.courseName} • {question.faculty}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => editTrialQuestion(question.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0.375rem',
                      background: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setQuestionToDelete(question.id);
                      setDeleteModalOpen(true);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0.375rem',
                      background: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button
                    onClick={() => openManageMCQs(question.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #0066cc',
                      borderRadius: '0.375rem',
                      background: '#0066cc',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Target size={16} />
                    Manage Questions
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#64748b', marginTop: '0.75rem' }}>
                <span>📥 {question.downloads} downloads</span>
                <span>👁️ {question.views} views</span>
                <span>❓ {question.questions} questions</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e5e5',
              borderRadius: '0.375rem',
              background: currentPage === 1 ? '#f3f4f6' : '#ffffff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e5e5',
              borderRadius: '0.375rem',
              background: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setQuestionToDelete(null);
        }}
        onConfirm={() => {
          if (questionToDelete) {
            deleteTrialQuestion(questionToDelete);
            setDeleteModalOpen(false);
            setQuestionToDelete(null);
          }
        }}
        title="Delete Trial Question"
        description="Are you sure you want to delete this trial question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default TrialQuestionsManager;
          