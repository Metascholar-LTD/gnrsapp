import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, Download, 
  Upload, FileText, CheckCircle2, XCircle, Calendar, 
  Building2, BookOpen, School, Users, TrendingUp,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  FileCheck, AlertCircle, Loader2, Grid3x3, List, 
  MoreVertical, CheckSquare, Square, FileX, RefreshCw, Save,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmationModal } from "@/components/admin";

interface ShsBeceQuestion {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  year: number;
  examType: "BECE" | "SHS";
  fileUrl: string;
  fileSize: number;
  downloads: number;
  views: number;
  verified: boolean;
  uploadDate: string;
  created_at?: string;
  updated_at?: string;
}

interface ShsBeceQuestionFormData {
  title: string;
  subject: string;
  subjectCode: string;
  year: number | string;
  examType: "BECE" | "SHS" | "";
  fileUrl: string;
  fileSize: number;
  verified: boolean;
}

const ShsBeceQuestionsManager = () => {
  const [questions, setQuestions] = useState<ShsBeceQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    subject: "",
    year: "",
    examType: "",
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

  const [formData, setFormData] = useState<ShsBeceQuestionFormData>({
    title: "",
    subject: "",
    subjectCode: "",
    year: new Date().getFullYear(),
    examType: "",
    fileUrl: "",
    fileSize: 0,
    verified: false,
  });

  // Subject options for SHS/BECE
  const subjects = [
    { name: "Core Mathematics", code: "MATH" },
    { name: "English Language", code: "ENG" },
    { name: "Integrated Science", code: "SCI" },
    { name: "Social Studies", code: "SOC" },
    { name: "Physics", code: "PHY" },
    { name: "Chemistry", code: "CHEM" },
    { name: "Biology", code: "BIO" },
    { name: "Elective Mathematics", code: "EMATH" },
    { name: "Economics", code: "ECON" },
    { name: "Geography", code: "GEO" },
    { name: "History", code: "HIST" },
    { name: "Government", code: "GOVT" },
    { name: "Literature in English", code: "LIT" },
    { name: "French", code: "FRENCH" },
    { name: "ICT", code: "ICT" },
    { name: "Business Management", code: "BUS" },
    { name: "Accounting", code: "ACC" },
    { name: "Religious Studies", code: "RS" },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shs_bece_questions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setQuestions(data.map((item: any) => ({
          id: item.id,
          title: item.title || "",
          subject: item.subject || "",
          subjectCode: item.subject_code || "",
          year: item.year || new Date().getFullYear(),
          examType: item.exam_type || "BECE",
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
      console.error("Error fetching SHS/BECE questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = 
        !searchQuery ||
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = !selectedFilters.subject || question.subject === selectedFilters.subject;
      const matchesYear = !selectedFilters.year || question.year.toString() === selectedFilters.year;
      const matchesExamType = !selectedFilters.examType || question.examType === selectedFilters.examType;
      const matchesVerified = selectedFilters.verified === "" || 
        (selectedFilters.verified === "verified" && question.verified) ||
        (selectedFilters.verified === "unverified" && !question.verified);

      return matchesSearch && matchesSubject && matchesYear && matchesExamType && matchesVerified;
    });
  }, [questions, searchQuery, selectedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: questions.length,
      verified: questions.filter(q => q.verified).length,
      unverified: questions.filter(q => !q.verified).length,
      totalDownloads: questions.reduce((sum, q) => sum + q.downloads, 0),
      totalViews: questions.reduce((sum, q) => sum + q.views, 0),
      beceCount: questions.filter(q => q.examType === "BECE").length,
      shsCount: questions.filter(q => q.examType === "SHS").length,
    };
  }, [questions]);

  // File upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `shs-bece-questions/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shs-bece-questions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('shs-bece-questions')
        .getPublicUrl(fileName);

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

  // Save question
  const saveQuestion = async () => {
    if (!formData.title || !formData.subject || !formData.subjectCode || 
        !formData.year || !formData.examType || !formData.fileUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        title: formData.title,
        subject: formData.subject,
        subject_code: formData.subjectCode,
        year: Number(formData.year),
        exam_type: formData.examType,
        file_url: formData.fileUrl,
        file_size: formData.fileSize || 0,
        verified: formData.verified,
        downloads: 0,
        views: 0,
        upload_date: new Date().toISOString().split('T')[0],
      };

      if (editing && questions.find(q => q.id === editing)) {
        const { error } = await supabase
          .from('shs_bece_questions' as any)
          .update(dataToSave)
          .eq('id', editing);

        if (error) throw error;
        toast.success("Question updated successfully");
      } else {
        const { error } = await supabase
          .from('shs_bece_questions' as any)
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        toast.success("Question added successfully");
      }

      setEditing(null);
      setShowAddForm(false);
      setFormData({
        title: "",
        subject: "",
        subjectCode: "",
        year: new Date().getFullYear(),
        examType: "",
        fileUrl: "",
        fileSize: 0,
        verified: false,
      });
      await fetchQuestions();
    } catch (error: any) {
      console.error("Error saving question:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    setQuestionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (questionToDelete) {
      try {
        const question = questions.find(q => q.id === questionToDelete);
        
        const { error } = await supabase
          .from('shs_bece_questions' as any)
          .delete()
          .eq('id', questionToDelete);

        if (error) throw error;

        if (question?.fileUrl) {
          const fileName = question.fileUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('shs-bece-questions')
              .remove([fileName]);
          }
        }

        toast.success("Question deleted successfully");
        setQuestionToDelete(null);
        setDeleteModalOpen(false);
        await fetchQuestions();
      } catch (error: any) {
        console.error("Error deleting question:", error);
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
  const startEditing = (question: ShsBeceQuestion) => {
    setEditing(question.id);
    setFormData({
      title: question.title,
      subject: question.subject,
      subjectCode: question.subjectCode,
      year: question.year,
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
        .from('shs_bece_questions' as any)
        .delete()
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} question(s) deleted successfully`);
      setSelectedItems(new Set());
      await fetchQuestions();
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
        .from('shs_bece_questions' as any)
        .update({ verified: verify })
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} question(s) ${verify ? 'verified' : 'unverified'} successfully`);
      setSelectedItems(new Set());
      await fetchQuestions();
    } catch (error: any) {
      console.error("Error bulk verifying:", error);
      toast.error(`Failed to update: ${error.message}`);
    }
  };

  const isolatedStyles = `
    .sbqm-wrapper {
      width: 100%;
      padding: 2rem;
      background: #f9fafb;
      min-height: 100vh;
    }

    .sbqm-header {
      margin-bottom: 2rem;
    }

    .sbqm-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sbqm-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .sbqm-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .sbqm-stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .sbqm-stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .sbqm-stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .sbqm-stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .sbqm-stat-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .sbqm-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .sbqm-search-wrapper {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .sbqm-search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .sbqm-search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .sbqm-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 1.25rem;
      height: 1.25rem;
    }

    .sbqm-filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;
      min-width: 150px;
    }

    .sbqm-btn {
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

    .sbqm-btn-primary {
      background: #3b82f6;
      color: white;
    }

    .sbqm-btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .sbqm-btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .sbqm-btn-secondary:hover {
      background: #f9fafb;
    }

    .sbqm-btn-danger {
      background: #ef4444;
      color: white;
    }

    .sbqm-btn-danger:hover {
      background: #dc2626;
    }

    .sbqm-btn-success {
      background: #10b981;
      color: white;
    }

    .sbqm-btn-success:hover {
      background: #059669;
    }

    .sbqm-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }

    .sbqm-view-btn {
      padding: 0.5rem;
      border: none;
      background: white;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .sbqm-view-btn.active {
      background: #f3f4f6;
      color: #3b82f6;
    }

    .sbqm-table-wrapper {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      max-height: calc(100vh - 400px);
      overflow-y: auto;
    }

    .sbqm-table {
      width: 100%;
      border-collapse: collapse;
    }

    .sbqm-table thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .sbqm-table th {
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

    .sbqm-table td {
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.8125rem;
      color: #374151;
      vertical-align: middle;
    }

    .sbqm-table tbody tr {
      transition: background-color 0.15s;
    }

    .sbqm-table tbody tr:hover {
      background: #f3f4f6;
    }

    .sbqm-table tbody tr:has(input[type="checkbox"]:checked) {
      background: #eff6ff;
    }

    .sbqm-table tbody tr:last-child td {
      border-bottom: none;
    }

    .sbqm-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .sbqm-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
      position: relative;
    }

    .sbqm-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .sbqm-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .sbqm-card-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-height: 1.4;
    }

    .sbqm-card-meta {
      font-size: 0.6875rem;
      color: #6b7280;
      margin: 0;
    }

    .sbqm-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .sbqm-badge-verified {
      background: #d1fae5;
      color: #065f46;
    }

    .sbqm-badge-unverified {
      background: #fee2e2;
      color: #991b1b;
    }

    .sbqm-badge-bece {
      background: #dbeafe;
      color: #1e40af;
    }

    .sbqm-badge-shs {
      background: #fef3c7;
      color: #92400e;
    }

    .sbqm-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .sbqm-icon-btn {
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

    .sbqm-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .sbqm-form-modal {
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

    .sbqm-form-content {
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

    .sbqm-form-header {
      padding: 1.5rem 2rem;
      border-bottom: 3px solid #dc2626;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sbqm-form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .sbqm-form-header .sbqm-icon-btn {
      color: #ffffff;
    }

    .sbqm-form-header .sbqm-icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .sbqm-form-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .sbqm-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .sbqm-form-group {
      display: flex;
      flex-direction: column;
    }

    .sbqm-form-group.full-width {
      grid-column: 1 / -1;
    }

    .sbqm-form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .sbqm-form-input,
    .sbqm-form-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .sbqm-form-input:focus,
    .sbqm-form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .sbqm-upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #f9fafb;
    }

    .sbqm-upload-zone:hover,
    .sbqm-upload-zone.dragging {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .sbqm-upload-progress {
      margin-top: 1rem;
      height: 0.5rem;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }

    .sbqm-upload-progress-bar {
      height: 100%;
      background: #3b82f6;
      transition: width 0.3s;
    }

    .sbqm-form-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #f9fafb;
    }

    .sbqm-preview-modal {
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

    .sbqm-preview-content {
      width: 100%;
      max-width: 1200px;
      height: 90vh;
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .sbqm-preview-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f9fafb;
    }

    .sbqm-preview-body {
      flex: 1;
      overflow: auto;
      padding: 1rem;
    }

    .sbqm-preview-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .sbqm-pagination-wrapper {
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

    .sbqm-pagination {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sbqm-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .sbqm-wrapper {
        padding: 1rem;
      }

      .sbqm-form-grid {
        grid-template-columns: 1fr;
      }

      .sbqm-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .sbqm-grid {
        grid-template-columns: 1fr;
      }

      .sbqm-table-wrapper {
        overflow-x: auto;
      }

      .sbqm-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .sbqm-search-wrapper {
        width: 100%;
      }
    }
  `;

  return (
    <div className="sbqm-wrapper">
      <style>{isolatedStyles}</style>
      
      {/* Header */}
      <div className="sbqm-header">
        <h1 className="sbqm-title">
          <School size={32} />
          SHS & BECE Past Questions Manager
        </h1>
        <p className="sbqm-subtitle">
          Manage and organize Senior High School and BECE examination past papers. Upload PDFs, verify content, and track statistics.
        </p>
      </div>

      {/* Statistics */}
      <div className="sbqm-stats-grid">
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#dbeafe" }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <p className="sbqm-stat-label">Total Questions</p>
          <p className="sbqm-stat-value">{stats.total}</p>
        </div>
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#d1fae5" }}>
            <CheckCircle2 size={24} color="#10b981" />
          </div>
          <p className="sbqm-stat-label">Verified</p>
          <p className="sbqm-stat-value">{stats.verified}</p>
        </div>
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#fee2e2" }}>
            <XCircle size={24} color="#ef4444" />
          </div>
          <p className="sbqm-stat-label">Unverified</p>
          <p className="sbqm-stat-value">{stats.unverified}</p>
        </div>
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#dbeafe" }}>
            <BookOpen size={24} color="#1e40af" />
          </div>
          <p className="sbqm-stat-label">BECE</p>
          <p className="sbqm-stat-value">{stats.beceCount}</p>
        </div>
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#fef3c7" }}>
            <GraduationCap size={24} color="#92400e" />
          </div>
          <p className="sbqm-stat-label">SHS</p>
          <p className="sbqm-stat-value">{stats.shsCount}</p>
        </div>
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#fef3c7" }}>
            <Download size={24} color="#f59e0b" />
          </div>
          <p className="sbqm-stat-label">Total Downloads</p>
          <p className="sbqm-stat-value">{stats.totalDownloads.toLocaleString()}</p>
        </div>
        <div className="sbqm-stat-card">
          <div className="sbqm-stat-icon" style={{ background: "#e0e7ff" }}>
            <Eye size={24} color="#6366f1" />
          </div>
          <p className="sbqm-stat-label">Total Views</p>
          <p className="sbqm-stat-value">{stats.totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="sbqm-controls">
        <div className="sbqm-search-wrapper">
          <Search className="sbqm-search-icon" />
          <input
            type="text"
            className="sbqm-search-input"
            placeholder="Search by title, subject, or subject code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="sbqm-filter-select"
          value={selectedFilters.subject}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, subject: e.target.value }))}
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.code} value={subject.name}>{subject.name}</option>
          ))}
        </select>
        <select
          className="sbqm-filter-select"
          value={selectedFilters.examType}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, examType: e.target.value }))}
        >
          <option value="">All Types</option>
          <option value="BECE">BECE</option>
          <option value="SHS">SHS</option>
        </select>
        <select
          className="sbqm-filter-select"
          value={selectedFilters.verified}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, verified: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <div className="sbqm-view-toggle">
          <button
            className={`sbqm-view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            className={`sbqm-view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
        <button
          className="sbqm-btn sbqm-btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditing(null);
            setFormData({
              title: "",
              subject: "",
              subjectCode: "",
              year: new Date().getFullYear(),
              examType: "",
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
            className="sbqm-btn sbqm-btn-success"
            onClick={() => bulkVerify(true)}
          >
            <CheckCircle2 size={16} />
            Verify Selected
          </button>
          <button
            className="sbqm-btn sbqm-btn-secondary"
            onClick={() => bulkVerify(false)}
          >
            <XCircle size={16} />
            Unverify Selected
          </button>
          <button
            className="sbqm-btn sbqm-btn-danger"
            onClick={bulkDelete}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
          <button
            className="sbqm-btn sbqm-btn-secondary"
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
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading questions...</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="sbqm-table-wrapper">
          <table className="sbqm-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    className="sbqm-checkbox"
                    checked={selectedItems.size === paginatedQuestions.length && paginatedQuestions.length > 0}
                    onChange={toggleSelectAll}
                    style={{ margin: 0 }}
                  />
                </th>
                <th style={{ textAlign: "left" }}>Title</th>
                <th style={{ textAlign: "left" }}>Subject</th>
                <th style={{ textAlign: "left" }}>Subject Code</th>
                <th style={{ textAlign: "center" }}>Year</th>
                <th style={{ textAlign: "left" }}>Type</th>
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
                      className="sbqm-checkbox"
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
                    </div>
                  </td>
                  <td style={{ fontSize: "0.75rem", textAlign: "left" }}>{question.subject}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.75rem", textAlign: "left" }}>{question.subjectCode}</td>
                  <td style={{ fontSize: "0.75rem", textAlign: "center" }}>{question.year}</td>
                  <td style={{ textAlign: "left" }}>
                    <span className={`sbqm-badge ${question.examType === "BECE" ? "sbqm-badge-bece" : "sbqm-badge-shs"}`} style={{ fontSize: "0.6875rem", padding: "0.125rem 0.5rem" }}>
                      {question.examType}
                    </span>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <span className={`sbqm-badge ${question.verified ? "sbqm-badge-verified" : "sbqm-badge-unverified"}`}>
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
                        className="sbqm-icon-btn"
                        onClick={() => previewPDF(question.fileUrl)}
                        title="Preview"
                        style={{ padding: "0.375rem" }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="sbqm-icon-btn"
                        onClick={() => startEditing(question)}
                        title="Edit"
                        style={{ padding: "0.375rem" }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="sbqm-icon-btn"
                        onClick={() => deleteQuestion(question.id)}
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
        <div className="sbqm-grid">
          {paginatedQuestions.map((question) => (
            <div key={question.id} className="sbqm-card">
              <div className="sbqm-card-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="sbqm-card-title" style={{ marginBottom: "0.25rem" }}>
                    {question.title.length > 60 ? `${question.title.substring(0, 60)}...` : question.title}
                  </h3>
                  <p className="sbqm-card-meta">
                    {question.subjectCode} • {question.year} • {question.examType}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="sbqm-checkbox"
                  checked={selectedItems.has(question.id)}
                  onChange={() => toggleSelection(question.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginLeft: "0.5rem", flexShrink: 0 }}
                />
              </div>
              <div style={{ marginBottom: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                <span className={`sbqm-badge ${question.examType === "BECE" ? "sbqm-badge-bece" : "sbqm-badge-shs"}`} style={{ fontSize: "0.6875rem", padding: "0.125rem 0.5rem" }}>
                  {question.examType}
                </span>
                <span className={`sbqm-badge ${question.verified ? "sbqm-badge-verified" : "sbqm-badge-unverified"}`} style={{ fontSize: "0.6875rem", padding: "0.125rem 0.5rem" }}>
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
              <div className="sbqm-card-actions" style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "flex-end" }}>
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
                  className="sbqm-icon-btn"
                  onClick={() => deleteQuestion(question.id)}
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
        <div className="sbqm-pagination-wrapper">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="sbqm-filter-select"
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
            <div className="sbqm-pagination">
              <button
                className="sbqm-btn sbqm-btn-secondary"
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
                      className={`sbqm-btn ${currentPage === pageNum ? "sbqm-btn-primary" : "sbqm-btn-secondary"}`}
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
                className="sbqm-btn sbqm-btn-secondary"
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
        <div className="sbqm-form-modal" onClick={() => setShowAddForm(false)}>
          <div className="sbqm-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="sbqm-form-header">
              <h2 className="sbqm-form-title">
                {editing ? "Edit Question" : "Add New Question"}
              </h2>
              <button
                className="sbqm-icon-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="sbqm-form-body">
              <div className="sbqm-form-grid">
                <div className="sbqm-form-group full-width">
                  <label className="sbqm-form-label">Title *</label>
                  <input
                    type="text"
                    className="sbqm-form-input"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Core Mathematics - Paper 2"
                  />
                </div>
                <div className="sbqm-form-group">
                  <label className="sbqm-form-label">Subject *</label>
                  <select
                    className="sbqm-form-select"
                    value={formData.subject}
                    onChange={(e) => {
                      const selected = subjects.find(s => s.name === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        subject: e.target.value,
                        subjectCode: selected?.code || "",
                      }));
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.code} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sbqm-form-group">
                  <label className="sbqm-form-label">Subject Code *</label>
                  <input
                    type="text"
                    className="sbqm-form-input"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjectCode: e.target.value }))}
                    placeholder="e.g., MATH"
                  />
                </div>
                <div className="sbqm-form-group">
                  <label className="sbqm-form-label">Year *</label>
                  <input
                    type="number"
                    className="sbqm-form-input"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || "" }))}
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="sbqm-form-group">
                  <label className="sbqm-form-label">Exam Type *</label>
                  <select
                    className="sbqm-form-select"
                    value={formData.examType}
                    onChange={(e) => setFormData(prev => ({ ...prev, examType: e.target.value as "BECE" | "SHS" }))}
                  >
                    <option value="">Select Type</option>
                    <option value="BECE">BECE</option>
                    <option value="SHS">SHS</option>
                  </select>
                </div>
                <div className="sbqm-form-group full-width">
                  <label className="sbqm-form-label">PDF File *</label>
                  <div
                    ref={dropZoneRef}
                    className={`sbqm-upload-zone ${isDragging ? "dragging" : ""}`}
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
                          className="sbqm-btn sbqm-btn-secondary"
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
                          <div className="sbqm-upload-progress">
                            <div 
                              className="sbqm-upload-progress-bar" 
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
                <div className="sbqm-form-group full-width">
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                    />
                    <span className="sbqm-form-label" style={{ margin: 0 }}>Mark as verified</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="sbqm-form-footer">
              <button
                className="sbqm-btn sbqm-btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>
              <button
                className="sbqm-btn sbqm-btn-primary"
                onClick={saveQuestion}
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
        <div className="sbqm-preview-modal" onClick={() => setPreviewModalOpen(false)}>
          <div className="sbqm-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="sbqm-preview-header">
              <h3 style={{ margin: 0, fontWeight: 600 }}>PDF Preview</h3>
              <button
                className="sbqm-icon-btn"
                onClick={() => setPreviewModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="sbqm-preview-body">
              <iframe
                src={previewUrl}
                className="sbqm-preview-iframe"
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
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ShsBeceQuestionsManager;

