import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, Download, 
  Upload, FileText, CheckCircle2, XCircle, Calendar, 
  Building2, BookOpen, GraduationCap, Users, TrendingUp,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  FileCheck, AlertCircle, Loader2, Grid3x3, List, 
  MoreVertical, CheckSquare, Square, FileX, RefreshCw, Save
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmationModal } from "@/components/admin";

interface PastQuestion {
  id: string;
  title: string; // Title/Course Name
  courseCode: string;
  faculty: string;
  year: number;
  semester: "1st" | "2nd";
  university: string;
  universityShort: string;
  examType: string;
  fileUrl: string;
  fileSize: number;
  downloads: number;
  views: number;
  verified: boolean;
  uploadDate: string;
  created_at?: string;
  updated_at?: string;
}

interface PastQuestionFormData {
  title: string; // Title/Course Name
  courseCode: string;
  faculty: string;
  year: number | string;
  semester: "1st" | "2nd" | "";
  university: string;
  universityShort: string;
  examType: string;
  fileUrl: string;
  fileSize: number; // File size in bytes
  verified: boolean;
}

const PastQuestionsManager = () => {
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
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
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<PastQuestionFormData>({
    title: "",
    courseCode: "",
    faculty: "",
    year: new Date().getFullYear(),
    semester: "",
    university: "",
    universityShort: "",
    examType: "End of Semester",
    fileUrl: "",
    fileSize: 0,
    verified: false,
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
  ];

  const examTypes = [
    "End of Semester",
    "Mid Semester",
    "Quiz",
    "Assignment",
    "Project",
  ];

  useEffect(() => {
    fetchPastQuestions();
  }, []);

  const fetchPastQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('past_questions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPastQuestions(data.map((item: any) => ({
          id: item.id,
          title: item.title || "",
          courseCode: item.course_code || "",
          faculty: item.faculty || "",
          year: item.year || new Date().getFullYear(),
          semester: item.semester || "1st",
          university: item.university || "",
          universityShort: item.university_short || "",
          examType: item.exam_type || "End of Semester",
          fileUrl: item.file_url || "",
          fileSize: item.file_size || 0,
          downloads: item.downloads || 0,
          views: item.views || 0,
          verified: item.verified || false,
          uploadDate: item.upload_date || item.created_at || "",
          created_at: item.created_at,
          updated_at: item.updated_at,
        })));
      }
    } catch (error: any) {
      console.error("Error fetching past questions:", error);
      toast.error("Failed to load past questions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredQuestions = useMemo(() => {
    return pastQuestions.filter((question) => {
      const matchesSearch = 
        !searchQuery ||
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }, [pastQuestions, searchQuery, selectedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: pastQuestions.length,
      verified: pastQuestions.filter(q => q.verified).length,
      unverified: pastQuestions.filter(q => !q.verified).length,
      totalDownloads: pastQuestions.reduce((sum, q) => sum + q.downloads, 0),
      totalViews: pastQuestions.reduce((sum, q) => sum + q.views, 0),
      totalSize: pastQuestions.reduce((sum, q) => sum + q.fileSize, 0),
    };
  }, [pastQuestions]);

  // File upload handler
  const handleFileUpload = async (file: File) => {
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
      const fileName = `past-questions/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('past-questions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('past-questions')
        .getPublicUrl(fileName);

      // Update form data with file URL and size
      setFormData(prev => ({
        ...prev,
        fileUrl: publicUrl,
        fileSize: file.size,
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
      handleFileUpload(file);
    }
  }, []);

  // Save past question
  const savePastQuestion = async () => {
    if (!formData.title || !formData.courseCode || !formData.faculty || 
        !formData.year || !formData.semester || !formData.university || !formData.fileUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        title: formData.title,
        course_code: formData.courseCode,
        faculty: formData.faculty,
        year: Number(formData.year),
        semester: formData.semester,
        university: formData.university,
        university_short: formData.universityShort,
        exam_type: formData.examType,
        file_url: formData.fileUrl,
        file_size: formData.fileSize || 0,
        verified: formData.verified,
        downloads: 0,
        views: 0,
        upload_date: new Date().toISOString().split('T')[0],
      };

      if (editing && pastQuestions.find(q => q.id === editing)) {
        // Update existing
        const { error } = await supabase
          .from('past_questions' as any)
          .update(dataToSave)
          .eq('id', editing);

        if (error) throw error;
        toast.success("Past question updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('past_questions' as any)
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        toast.success("Past question added successfully");
      }

      setEditing(null);
      setShowAddForm(false);
      setFormData({
        title: "",
        courseCode: "",
        faculty: "",
        year: new Date().getFullYear(),
        semester: "",
        university: "",
        universityShort: "",
        examType: "End of Semester",
        fileUrl: "",
        fileSize: 0,
        verified: false,
      });
      await fetchPastQuestions();
    } catch (error: any) {
      console.error("Error saving past question:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete past question
  const deletePastQuestion = (id: string) => {
    setQuestionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (questionToDelete) {
      try {
        // Get the question to delete file
        const question = pastQuestions.find(q => q.id === questionToDelete);
        
        // Delete from database
        const { error } = await supabase
          .from('past_questions' as any)
          .delete()
          .eq('id', questionToDelete);

        if (error) throw error;

        // Delete file from storage if exists
        if (question?.fileUrl) {
          const fileName = question.fileUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('past-questions')
              .remove([fileName]);
          }
        }

        toast.success("Past question deleted successfully");
        setQuestionToDelete(null);
        setDeleteModalOpen(false);
        await fetchPastQuestions();
      } catch (error: any) {
        console.error("Error deleting past question:", error);
        toast.error(`Failed to delete: ${error.message}`);
      }
    }
  };

  // Preview PDF
  const previewPDF = (url: string) => {
    setPreviewUrl(url);
    setPreviewModalOpen(true);
  };

  // Start editing
  const startEditing = (question: PastQuestion) => {
    setEditing(question.id);
    setFormData({
      title: question.title,
      courseCode: question.courseCode,
      faculty: question.faculty,
      year: question.year,
      semester: question.semester,
      university: question.university,
      universityShort: question.universityShort,
      examType: question.examType,
      fileUrl: question.fileUrl,
      fileSize: question.fileSize,
      verified: question.verified,
    });
    setShowAddForm(true);
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedQuestions.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedQuestions.map(q => q.id)));
    }
  };

  // Bulk operations
  const bulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select items to delete");
      return;
    }

    try {
      const ids = Array.from(selectedItems);
      const { error } = await supabase
        .from('past_questions' as any)
        .delete()
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} past question(s) deleted successfully`);
      setSelectedItems(new Set());
      await fetchPastQuestions();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  const bulkVerify = async (verify: boolean) => {
    if (selectedItems.size === 0) {
      toast.error("Please select items to verify");
      return;
    }

    try {
      const ids = Array.from(selectedItems);
      const { error } = await supabase
        .from('past_questions' as any)
        .update({ verified: verify })
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} past question(s) ${verify ? 'verified' : 'unverified'} successfully`);
      setSelectedItems(new Set());
      await fetchPastQuestions();
    } catch (error: any) {
      console.error("Error bulk verifying:", error);
      toast.error(`Failed to update: ${error.message}`);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const isolatedStyles = `
    .pqm-wrapper {
      width: 100%;
      padding: 2rem;
      background: #f9fafb;
      min-height: 100vh;
    }

    .pqm-header {
      margin-bottom: 2rem;
    }

    .pqm-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .pqm-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .pqm-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .pqm-stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .pqm-stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .pqm-stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .pqm-stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .pqm-stat-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .pqm-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .pqm-search-wrapper {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .pqm-search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .pqm-search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .pqm-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 1.25rem;
      height: 1.25rem;
    }

    .pqm-filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;
      min-width: 150px;
    }

    .pqm-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .pqm-btn-primary {
      background: #3b82f6;
      color: white;
    }

    .pqm-btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .pqm-btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .pqm-btn-secondary:hover {
      background: #f9fafb;
    }

    .pqm-btn-danger {
      background: #ef4444;
      color: white;
    }

    .pqm-btn-danger:hover {
      background: #dc2626;
    }

    .pqm-btn-success {
      background: #10b981;
      color: white;
    }

    .pqm-btn-success:hover {
      background: #059669;
    }

    .pqm-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }

    .pqm-view-btn {
      padding: 0.5rem;
      border: none;
      background: white;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .pqm-view-btn.active {
      background: #f3f4f6;
      color: #3b82f6;
    }

    .pqm-table-wrapper {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      max-height: calc(100vh - 400px);
      overflow-y: auto;
    }

    .pqm-table {
      width: 100%;
      border-collapse: collapse;
    }

    .pqm-table thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .pqm-table th {
      padding: 0.625rem 0.75rem;
      text-align: left;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      position: sticky;
      top: 0;
      background: #f9fafb;
      z-index: 10;
    }

    .pqm-table td {
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.8125rem;
      color: #374151;
      vertical-align: middle;
    }

    .pqm-table tbody tr {
      transition: background-color 0.15s;
    }

    .pqm-table tbody tr:hover {
      background: #f3f4f6;
    }

    .pqm-table tbody tr:has(input[type="checkbox"]:checked) {
      background: #eff6ff;
    }

    .pqm-table tbody tr:last-child td {
      border-bottom: none;
    }

    .pqm-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .pqm-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
      position: relative;
    }

    .pqm-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .pqm-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .pqm-card-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-height: 1.4;
    }

    .pqm-card-meta {
      font-size: 0.6875rem;
      color: #6b7280;
      margin: 0;
    }

    .pqm-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .pqm-badge-verified {
      background: #d1fae5;
      color: #065f46;
    }

    .pqm-badge-unverified {
      background: #fee2e2;
      color: #991b1b;
    }

    .pqm-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .pqm-icon-btn {
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

    .pqm-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .pqm-form-modal {
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

    .pqm-form-content {
      background: white;
      border-radius: 0.5rem;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .pqm-form-header {
      padding: 1.5rem 2rem;
      border-bottom: 3px solid #dc2626;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pqm-form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .pqm-form-header .pqm-icon-btn {
      color: #ffffff;
    }

    .pqm-form-header .pqm-icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .pqm-form-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .pqm-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .pqm-form-group {
      display: flex;
      flex-direction: column;
    }

    .pqm-form-group.full-width {
      grid-column: 1 / -1;
    }

    .pqm-form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .pqm-form-input,
    .pqm-form-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .pqm-form-input:focus,
    .pqm-form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .pqm-upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #f9fafb;
    }

    .pqm-upload-zone:hover,
    .pqm-upload-zone.dragging {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .pqm-upload-progress {
      margin-top: 1rem;
      height: 0.5rem;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }

    .pqm-upload-progress-bar {
      height: 100%;
      background: #3b82f6;
      transition: width 0.3s;
    }

    .pqm-form-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #f9fafb;
    }

    .pqm-preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .pqm-preview-content {
      width: 100%;
      max-width: 1200px;
      height: 90vh;
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .pqm-preview-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f9fafb;
    }

    .pqm-preview-body {
      flex: 1;
      overflow: auto;
      padding: 1rem;
    }

    .pqm-preview-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .pqm-pagination-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .pqm-pagination {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pqm-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .pqm-wrapper {
        padding: 1rem;
      }

      .pqm-form-grid {
        grid-template-columns: 1fr;
      }

      .pqm-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .pqm-grid {
        grid-template-columns: 1fr;
      }

      .pqm-table-wrapper {
        overflow-x: auto;
      }

      .pqm-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .pqm-search-wrapper {
        width: 100%;
      }
    }
  `;

  return (
    <div className="pqm-wrapper">
      <style>{isolatedStyles}</style>
      
      {/* Header */}
      <div className="pqm-header">
        <h1 className="pqm-title">
          <GraduationCap size={32} />
          University Past Questions Manager
        </h1>
        <p className="pqm-subtitle">
          Manage and organize university examination past papers. Upload PDFs, verify content, and track statistics.
        </p>
      </div>

      {/* Statistics */}
      <div className="pqm-stats-grid">
        <div className="pqm-stat-card">
          <div className="pqm-stat-icon" style={{ background: "#dbeafe" }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <p className="pqm-stat-label">Total Questions</p>
          <p className="pqm-stat-value">{stats.total}</p>
        </div>
        <div className="pqm-stat-card">
          <div className="pqm-stat-icon" style={{ background: "#d1fae5" }}>
            <CheckCircle2 size={24} color="#10b981" />
          </div>
          <p className="pqm-stat-label">Verified</p>
          <p className="pqm-stat-value">{stats.verified}</p>
        </div>
        <div className="pqm-stat-card">
          <div className="pqm-stat-icon" style={{ background: "#fee2e2" }}>
            <XCircle size={24} color="#ef4444" />
          </div>
          <p className="pqm-stat-label">Unverified</p>
          <p className="pqm-stat-value">{stats.unverified}</p>
        </div>
        <div className="pqm-stat-card">
          <div className="pqm-stat-icon" style={{ background: "#fef3c7" }}>
            <Download size={24} color="#f59e0b" />
          </div>
          <p className="pqm-stat-label">Total Downloads</p>
          <p className="pqm-stat-value">{stats.totalDownloads.toLocaleString()}</p>
        </div>
         <div className="pqm-stat-card">
           <div className="pqm-stat-icon" style={{ background: "#e0e7ff" }}>
             <Eye size={24} color="#6366f1" />
           </div>
           <p className="pqm-stat-label">Total Views</p>
           <p className="pqm-stat-value">{stats.totalViews.toLocaleString()}</p>
         </div>
      </div>

      {/* Controls */}
      <div className="pqm-controls">
        <div className="pqm-search-wrapper">
          <Search className="pqm-search-icon" />
          <input
            type="text"
            className="pqm-search-input"
            placeholder="Search by title, course code, or university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="pqm-filter-select"
          value={selectedFilters.university}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, university: e.target.value }))}
        >
          <option value="">All Universities</option>
          {universities.map(uni => (
            <option key={uni.short} value={uni.short}>{uni.short}</option>
          ))}
        </select>
        <select
          className="pqm-filter-select"
          value={selectedFilters.faculty}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, faculty: e.target.value }))}
        >
          <option value="">All Faculties</option>
          {faculties.map(faculty => (
            <option key={faculty} value={faculty}>{faculty}</option>
          ))}
        </select>
        <select
          className="pqm-filter-select"
          value={selectedFilters.verified}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, verified: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <div className="pqm-view-toggle">
          <button
            className={`pqm-view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            className={`pqm-view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
        <button
          className="pqm-btn pqm-btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditing(null);
            setFormData({
              title: "",
              courseCode: "",
              faculty: "",
              year: new Date().getFullYear(),
              semester: "",
              university: "",
              universityShort: "",
              examType: "End of Semester",
              fileUrl: "",
              fileSize: 0,
              verified: false,
            });
          }}
        >
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div style={{ 
          padding: "1rem", 
          background: "#eff6ff", 
          border: "1px solid #3b82f6", 
          borderRadius: "0.5rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <span style={{ fontWeight: 600, color: "#1e40af" }}>
            {selectedItems.size} item(s) selected
          </span>
          <button
            className="pqm-btn pqm-btn-success"
            onClick={() => bulkVerify(true)}
          >
            <CheckCircle2 size={16} />
            Verify Selected
          </button>
          <button
            className="pqm-btn pqm-btn-secondary"
            onClick={() => bulkVerify(false)}
          >
            <XCircle size={16} />
            Unverify Selected
          </button>
          <button
            className="pqm-btn pqm-btn-danger"
            onClick={bulkDelete}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
          <button
            className="pqm-btn pqm-btn-secondary"
            onClick={() => setSelectedItems(new Set())}
          >
            <X size={16} />
            Clear Selection
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Loader2 className="animate-spin" size={48} color="#3b82f6" />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading past questions...</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="pqm-table-wrapper">
          <table className="pqm-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    className="pqm-checkbox"
                    checked={selectedItems.size === paginatedQuestions.length && paginatedQuestions.length > 0}
                    onChange={toggleSelectAll}
                    style={{ margin: 0 }}
                  />
                </th>
                <th style={{ textAlign: "left" }}>Title</th>
                <th style={{ textAlign: "left" }}>Course Code</th>
                <th style={{ textAlign: "left" }}>University</th>
                <th style={{ textAlign: "left" }}>Faculty</th>
                <th style={{ textAlign: "center" }}>Year</th>
                <th style={{ textAlign: "center" }}>Semester</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "right" }}>Downloads</th>
                <th style={{ textAlign: "right" }}>Views</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuestions.map((question) => (
                <tr key={question.id}>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      className="pqm-checkbox"
                      checked={selectedItems.has(question.id)}
                      onChange={() => toggleSelection(question.id)}
                      style={{ margin: 0 }}
                    />
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <div style={{ maxWidth: "300px" }}>
                      <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.8125rem", marginBottom: "0.125rem" }}>
                        {question.title.length > 50 ? `${question.title.substring(0, 50)}...` : question.title}
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "#9ca3af" }}>{question.examType}</div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.75rem", textAlign: "left" }}>{question.courseCode}</td>
                  <td style={{ fontSize: "0.75rem", textAlign: "left" }}>{question.universityShort}</td>
                  <td style={{ fontSize: "0.75rem", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                    {question.faculty}
                  </td>
                  <td style={{ fontSize: "0.75rem", textAlign: "center" }}>{question.year}</td>
                  <td style={{ fontSize: "0.75rem", textAlign: "center" }}>{question.semester}</td>
                  <td style={{ textAlign: "left" }}>
                    <span className={`pqm-badge ${question.verified ? "pqm-badge-verified" : "pqm-badge-unverified"}`}>
                      {question.verified ? (
                        <>
                          <CheckCircle2 size={12} style={{ marginRight: "0.25rem" }} />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle size={12} style={{ marginRight: "0.25rem" }} />
                          Unverified
                        </>
                      )}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.75rem", textAlign: "right", fontFamily: "monospace" }}>
                    {question.downloads.toLocaleString()}
                  </td>
                  <td style={{ fontSize: "0.75rem", textAlign: "right", fontFamily: "monospace" }}>
                    {question.views.toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end" }}>
                      <button
                        className="pqm-icon-btn"
                        onClick={() => previewPDF(question.fileUrl)}
                        title="Preview"
                        style={{ padding: "0.375rem" }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="pqm-icon-btn"
                        onClick={() => startEditing(question)}
                        title="Edit"
                        style={{ padding: "0.375rem" }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="pqm-icon-btn"
                        onClick={() => deletePastQuestion(question.id)}
                        title="Delete"
                        style={{ color: "#ef4444", padding: "0.375rem" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pqm-grid">
          {paginatedQuestions.map((question) => (
            <div key={question.id} className="pqm-card">
              <div className="pqm-card-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="pqm-card-title" style={{ marginBottom: "0.25rem" }}>
                    {question.title.length > 60 ? `${question.title.substring(0, 60)}...` : question.title}
                  </h3>
                  <p className="pqm-card-meta">
                    {question.courseCode} • {question.universityShort} • {question.year} {question.semester}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="pqm-checkbox"
                  checked={selectedItems.has(question.id)}
                  onChange={() => toggleSelection(question.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginLeft: "0.5rem", flexShrink: 0 }}
                />
              </div>
              <div style={{ marginBottom: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                <span className={`pqm-badge ${question.verified ? "pqm-badge-verified" : "pqm-badge-unverified"}`} style={{ fontSize: "0.6875rem", padding: "0.125rem 0.5rem" }}>
                  {question.verified ? (
                    <>
                      <CheckCircle2 size={10} style={{ marginRight: "0.25rem" }} />
                      Verified
                    </>
                  ) : (
                    <>
                      <XCircle size={10} style={{ marginRight: "0.25rem" }} />
                      Unverified
                    </>
                  )}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "#6b7280", marginBottom: "0.75rem", padding: "0.5rem", background: "#f9fafb", borderRadius: "0.25rem" }}>
                <span>📥 {question.downloads.toLocaleString()}</span>
                <span>👁️ {question.views.toLocaleString()}</span>
              </div>
              <div className="pqm-card-actions" style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => previewPDF(question.fileUrl)}
                  className="group relative inline-block text-sm font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <motion.span
                    className="relative inline-block pb-1 flex items-center gap-1.5"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Eye size={14} />
                    Preview
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                      style={{
                        width: 'calc(100% + 14px)',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                      }}
                    />
                  </motion.span>
                </button>
                <button
                  type="button"
                  onClick={() => startEditing(question)}
                  className="group relative inline-block text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <motion.span
                    className="relative inline-block pb-1 flex items-center gap-1.5"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Edit2 size={14} />
                    Edit
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                      style={{
                        width: 'calc(100% + 14px)',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                      }}
                    />
                  </motion.span>
                </button>
                <button
                  className="pqm-icon-btn"
                  onClick={() => deletePastQuestion(question.id)}
                  style={{ color: "#ef4444", padding: "0.5rem" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredQuestions.length > 0 && (
        <div className="pqm-pagination-wrapper">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="pqm-filter-select"
              style={{ minWidth: "80px", padding: "0.5rem 0.75rem" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredQuestions.length)} of {filteredQuestions.length}
            </span>
          </div>
          {totalPages > 1 && (
            <div className="pqm-pagination">
              <button
                className="pqm-btn pqm-btn-secondary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "0.5rem 0.75rem" }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`pqm-btn ${currentPage === pageNum ? "pqm-btn-primary" : "pqm-btn-secondary"}`}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{ 
                        padding: "0.5rem 0.75rem",
                        minWidth: "2.5rem"
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                className="pqm-btn pqm-btn-secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: "0.5rem 0.75rem" }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="pqm-form-modal" onClick={() => setShowAddForm(false)}>
          <div className="pqm-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="pqm-form-header">
              <h2 className="pqm-form-title">
                {editing ? "Edit Past Question" : "Add New Past Question"}
              </h2>
              <button
                className="pqm-icon-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="pqm-form-body">
              <div className="pqm-form-grid">
                <div className="pqm-form-group full-width">
                  <label className="pqm-form-label">Title/Course Name *</label>
                  <input
                    type="text"
                    className="pqm-form-input"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Advanced Engineering Mathematics"
                  />
                </div>
                <div className="pqm-form-group">
                  <label className="pqm-form-label">Course Code *</label>
                  <input
                    type="text"
                    className="pqm-form-input"
                    value={formData.courseCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                    placeholder="e.g., MATH 253"
                  />
                </div>
                <div className="pqm-form-group">
                  <label className="pqm-form-label">University *</label>
                  <select
                    className="pqm-form-select"
                    value={formData.university}
                    onChange={(e) => {
                      const selected = universities.find(u => u.name === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        university: e.target.value,
                        universityShort: selected?.short || "",
                      }));
                    }}
                  >
                    <option value="">Select University</option>
                    {universities.map(uni => (
                      <option key={uni.short} value={uni.name}>{uni.name}</option>
                    ))}
                  </select>
                </div>
                <div className="pqm-form-group">
                  <label className="pqm-form-label">Faculty *</label>
                  <select
                    className="pqm-form-select"
                    value={formData.faculty}
                    onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(faculty => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>
                <div className="pqm-form-group">
                  <label className="pqm-form-label">Year *</label>
                  <input
                    type="number"
                    className="pqm-form-input"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || "" }))}
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="pqm-form-group">
                  <label className="pqm-form-label">Semester *</label>
                  <select
                    className="pqm-form-select"
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value as "1st" | "2nd" }))}
                  >
                    <option value="">Select Semester</option>
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                  </select>
                </div>
                <div className="pqm-form-group">
                  <label className="pqm-form-label">Exam Type *</label>
                  <select
                    className="pqm-form-select"
                    value={formData.examType}
                    onChange={(e) => setFormData(prev => ({ ...prev, examType: e.target.value }))}
                  >
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="pqm-form-group full-width">
                  <label className="pqm-form-label">PDF File *</label>
                  <div
                    ref={dropZoneRef}
                    className={`pqm-upload-zone ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.fileUrl ? (
                      <div>
                        <FileCheck size={48} color="#10b981" style={{ marginBottom: "1rem" }} />
                        <p style={{ fontWeight: 600, color: "#10b981", marginBottom: "0.5rem" }}>
                          File uploaded successfully
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          {formData.fileUrl.split('/').pop()}
                        </p>
                        <button
                          className="pqm-btn pqm-btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, fileUrl: "", fileSize: 0 }));
                          }}
                          style={{ marginTop: "1rem" }}
                        >
                          <FileX size={16} />
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={48} color="#6b7280" style={{ marginBottom: "1rem" }} />
                        <p style={{ fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                          {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          PDF files only (max 50MB)
                        </p>
                        {uploading && (
                          <div className="pqm-upload-progress">
                            <div 
                              className="pqm-upload-progress-bar" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="pqm-form-group full-width">
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                    />
                    <span className="pqm-form-label" style={{ margin: 0 }}>Mark as verified</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="pqm-form-footer">
              <button
                className="pqm-btn pqm-btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>
              <button
                className="pqm-btn pqm-btn-primary"
                onClick={savePastQuestion}
                disabled={saving || uploading}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editing ? "Update" : "Add"} Question
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewModalOpen && previewUrl && (
        <div className="pqm-preview-modal" onClick={() => setPreviewModalOpen(false)}>
          <div className="pqm-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="pqm-preview-header">
              <h3 style={{ margin: 0, fontWeight: 600 }}>PDF Preview</h3>
              <button
                className="pqm-icon-btn"
                onClick={() => setPreviewModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="pqm-preview-body">
              <iframe
                src={previewUrl}
                className="pqm-preview-iframe"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Past Question"
        description="Are you sure you want to delete this past question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default PastQuestionsManager;

