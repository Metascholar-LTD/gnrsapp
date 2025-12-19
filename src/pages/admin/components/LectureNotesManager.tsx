import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, Download, 
  Upload, FileText, CheckCircle2, XCircle, 
  TrendingUp,
  ChevronLeft, ChevronRight,
  FileCheck, Loader2, Grid3x3, List, 
  Save,
  User, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmationModal } from "@/components/admin";

interface LectureNote {
  id: string;
  title: string;
  field: string;
  lecturer: string;
  downloads: number;
  views: number;
  fileSize: number;
  uploadDate: string;
  verified: boolean;
  pages: number;
  imageUrl?: string;
  fileType?: string;
  fileUrl: string;
  created_at?: string;
  updated_at?: string;
}

interface LectureNoteFormData {
  title: string;
  field: string;
  lecturer: string;
  fileUrl: string;
  fileSize: number;
  verified: boolean;
  pages: number;
  imageUrl?: string;
  fileType?: string;
}

const LectureNotesManager = () => {
  const [lectureNotes, setLectureNotes] = useState<LectureNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    faculty: "",
    verified: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDetectingPages, setIsDetectingPages] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<LectureNoteFormData>({
    title: "",
    field: "",
    lecturer: "",
    fileUrl: "",
    fileSize: 0,
    verified: false,
    pages: 0,
    imageUrl: "",
    fileType: "",
  });


  const fields = [
    "Business",
    "Mobile",
    "Social Media",
    "Marketing",
    "Technology",
    "Art & Photos",
    "Career",
    "Design",
    "Education",
    "Presentations & Public Speaking",
    "Government & Nonprofit",
    "Healthcare",
    "Internet",
    "Law",
    "Leadership & Management",
    "Automotive",
    "Engineering",
    "Software",
    "Recruiting & HR",
    "Retail",
    "Sales",
    "Services",
    "Science",
    "Small Business & Entrepreneurship",
    "Food",
    "Environment",
    "Economy & Finance",
    "Data & Analytics",
    "Investor Relations",
    "Sports",
    "Spiritual",
    "News & Politics",
    "Travel",
    "Self Improvement",
    "Real Estate",
    "Entertainment & Humor",
    "Health & Medicine",
    "Devices & Hardware",
    "Lifestyle"
  ].sort();

  const fileTypes = ["PDF", "PPTX", "PPT"];

  useEffect(() => {
    fetchLectureNotes();
  }, []);

  const fetchLectureNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lecture_notes' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setLectureNotes(data.map((item: any) => ({
          id: item.id,
          title: item.title || "",
          field: item.field || item.faculty || "",
          lecturer: item.lecturer || "",
          fileUrl: item.file_url || "",
          fileSize: item.file_size || 0,
          downloads: item.downloads || 0,
          views: item.views || 0,
          verified: item.verified || false,
          pages: item.pages || 0,
          uploadDate: item.upload_date || item.created_at || "",
          imageUrl: item.image_url || "",
          fileType: item.file_type || "",
          created_at: item.created_at,
          updated_at: item.updated_at,
        })));
      }
    } catch (error: any) {
      console.error("Error fetching lecture notes:", error);
      toast.error("Failed to load lecture notes");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredNotes = useMemo(() => {
    return lectureNotes.filter((note) => {
      const matchesSearch = 
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesField = !selectedFilters.faculty || note.field === selectedFilters.faculty;
      const matchesVerified = selectedFilters.verified === "" || 
        (selectedFilters.verified === "verified" && note.verified) ||
        (selectedFilters.verified === "unverified" && !note.verified);

      return matchesSearch && matchesField && matchesVerified;
    });
  }, [lectureNotes, searchQuery, selectedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotes.slice(start, start + itemsPerPage);
  }, [filteredNotes, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: lectureNotes.length,
      verified: lectureNotes.filter(n => n.verified).length,
      unverified: lectureNotes.filter(n => !n.verified).length,
      totalDownloads: lectureNotes.reduce((sum, n) => sum + n.downloads, 0),
      totalViews: lectureNotes.reduce((sum, n) => sum + n.views, 0),
    };
  }, [lectureNotes]);

  // Helper function to extract page count from PDF
  const extractPDFPageCount = async (file: File): Promise<number> => {
    try {
      // Dynamically import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source - use a CDN version
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      return pdf.numPages;
    } catch (error) {
      console.error("Error extracting PDF page count:", error);
      return 0;
    }
  };

  // Helper function to extract slide count from PPTX
  const extractPPTXSlideCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await import('jszip');
      const JSZip = zip.default;
      const zipFile = await JSZip.loadAsync(arrayBuffer);
      
      // PPTX files contain slides in ppt/slides/slide*.xml
      const slideFiles = Object.keys(zipFile.files).filter(name => 
        name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
      );
      
      return slideFiles.length;
    } catch (error) {
      console.error("Error extracting PPTX slide count:", error);
      return 0;
    }
  };

  // Helper function to extract page count from DOCX
  const extractDOCXPageCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await import('jszip');
      const JSZip = zip.default;
      const zipFile = await JSZip.loadAsync(arrayBuffer);
      
      // DOCX files contain page breaks in word/document.xml
      const documentXml = await zipFile.files['word/document.xml']?.async('string');
      if (!documentXml) return 0;
      
      // Count page breaks (w:br with w:type="page")
      const pageBreakRegex = /<w:br[^>]*w:type="page"[^>]*\/>/gi;
      const matches = documentXml.match(pageBreakRegex);
      const pageCount = matches ? matches.length + 1 : 1; // +1 for the first page
      
      return pageCount;
    } catch (error) {
      console.error("Error extracting DOCX page count:", error);
      return 0;
    }
  };

  // File upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      'application/vnd.openxmlformats-officedocument.presentationml.template'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, PPTX, or PPT file");
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setUploading(true);
    setIsDetectingPages(true);
    setUploadProgress(10);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `lecture-notes/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Determine file type
      let detectedFileType = "PDF";
      let pageCount = 0;
      
      // Detect pages/slides BEFORE uploading
      if (file.type.includes('powerpoint') || file.type.includes('presentation')) {
        detectedFileType = fileExt?.toUpperCase() || "PPTX";
        setUploadProgress(20);
        
        // Extract slide count for PPTX files
        if (fileExt?.toLowerCase() === 'pptx' || file.type.includes('openxmlformats')) {
          try {
            pageCount = await extractPPTXSlideCount(file);
            setUploadProgress(40);
          } catch (error) {
            console.error("Error detecting PPTX slides:", error);
            toast.info("Could not auto-detect slide count. Please enter manually.");
          }
        } else {
          // For older PPT files, we can't easily extract slide count
          toast.info("Slide count detection not available for .ppt files. Please enter manually.");
          setUploadProgress(40);
        }
      } else if (file.type === 'application/pdf') {
        setUploadProgress(20);
        // Extract page count for PDF files
        try {
          pageCount = await extractPDFPageCount(file);
          setUploadProgress(40);
        } catch (error) {
          console.error("Error detecting PDF pages:", error);
          toast.info("Could not auto-detect page count. Please enter manually.");
        }
      }

      setIsDetectingPages(false);
      setUploadProgress(50);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lecture-notes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lecture-notes')
        .getPublicUrl(fileName);

      // Update form data with file URL, size, type, and auto-detected page count
      setFormData(prev => ({
        ...prev,
        fileUrl: publicUrl,
        fileSize: file.size,
        fileType: detectedFileType,
        pages: pageCount > 0 ? pageCount : prev.pages, // Only update if we got a valid count
      }));

      setUploadProgress(100);
      setIsDetectingPages(false);
      
      if (pageCount > 0) {
        toast.success(`File uploaded successfully. Auto-detected ${pageCount} ${detectedFileType === 'PDF' ? 'pages' : 'slides'}.`);
      } else {
        toast.success("File uploaded successfully. Please enter the page/slide count manually.");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload file: ${error.message}`);
      setIsDetectingPages(false);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
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
      const fileName = `lecture-notes/images/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lecture-notes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lecture-notes')
        .getPublicUrl(fileName);

      // Update form data with image URL
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
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        handleFileUpload(file);
      }
    }
  }, []);

  // Save lecture note
  const saveLectureNote = async () => {
    if (!formData.title || !formData.field || !formData.lecturer || !formData.fileUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        title: formData.title,
        field: formData.field,
        lecturer: formData.lecturer,
        file_url: formData.fileUrl,
        file_size: formData.fileSize || 0,
        verified: formData.verified,
        pages: formData.pages || 0,
        downloads: 0,
        views: 0,
        upload_date: new Date().toISOString().split('T')[0],
        image_url: formData.imageUrl || null,
        file_type: formData.fileType || null,
      };

      if (editing && lectureNotes.find(n => n.id === editing)) {
        // Update existing
        const { error } = await supabase
          .from('lecture_notes' as any)
          .update(dataToSave)
          .eq('id', editing);

        if (error) throw error;
        toast.success("Lecture note updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('lecture_notes' as any)
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        toast.success("Lecture note added successfully");
      }

      setEditing(null);
      setShowAddForm(false);
      setFormData({
        title: "",
        field: "",
        lecturer: "",
        fileUrl: "",
        fileSize: 0,
        verified: false,
        pages: 0,
        imageUrl: "",
        fileType: "",
      });
      await fetchLectureNotes();
    } catch (error: any) {
      console.error("Error saving lecture note:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete lecture note
  const deleteLectureNote = (id: string) => {
    setNoteToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      try {
        // Get the note to delete file
        const note = lectureNotes.find(n => n.id === noteToDelete);
        
        // Delete from database
        const { error } = await supabase
          .from('lecture_notes' as any)
          .delete()
          .eq('id', noteToDelete);

        if (error) throw error;

        // Delete file from storage if exists
        if (note?.fileUrl) {
          const fileName = note.fileUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('lecture-notes')
              .remove([fileName]);
          }
        }

        // Delete image from storage if exists
        if (note?.imageUrl) {
          const imageName = note.imageUrl.split('/').pop();
          if (imageName) {
            await supabase.storage
              .from('lecture-notes')
              .remove([`images/${imageName}`]);
          }
        }

        toast.success("Lecture note deleted successfully");
        setNoteToDelete(null);
        setDeleteModalOpen(false);
        await fetchLectureNotes();
      } catch (error: any) {
        console.error("Error deleting lecture note:", error);
        toast.error(`Failed to delete: ${error.message}`);
      }
    }
  };

  // Preview file
  const previewFile = (url: string) => {
    setPreviewUrl(url);
    setPreviewModalOpen(true);
  };

  // Start editing
  const startEditing = (note: LectureNote) => {
    setEditing(note.id);
    setFormData({
      title: note.title,
      field: note.field,
      lecturer: note.lecturer,
      fileUrl: note.fileUrl,
      fileSize: note.fileSize,
      verified: note.verified,
      pages: note.pages,
      imageUrl: note.imageUrl || "",
      fileType: note.fileType || "",
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
    if (selectedItems.size === paginatedNotes.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedNotes.map(n => n.id)));
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
        .from('lecture_notes' as any)
        .delete()
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} lecture note(s) deleted successfully`);
      setSelectedItems(new Set());
      await fetchLectureNotes();
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
        .from('lecture_notes' as any)
        .update({ verified: verify })
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} lecture note(s) ${verify ? 'verified' : 'unverified'} successfully`);
      setSelectedItems(new Set());
      await fetchLectureNotes();
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

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const isolatedStyles = `
    .lnm-wrapper {
      width: 100%;
      padding: 2rem;
      background: #f9fafb;
      min-height: 100vh;
    }

    .lnm-header {
      margin-bottom: 2rem;
    }

    .lnm-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .lnm-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .lnm-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .lnm-stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .lnm-stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .lnm-stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .lnm-stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .lnm-stat-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .lnm-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .lnm-search-wrapper {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .lnm-search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .lnm-search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .lnm-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 1.25rem;
      height: 1.25rem;
    }

    .lnm-filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;
      min-width: 150px;
    }

    .lnm-btn {
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

    .lnm-btn-primary {
      background: #3b82f6;
      color: white;
    }

    .lnm-btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .lnm-btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .lnm-btn-secondary:hover {
      background: #f9fafb;
    }

    .lnm-btn-danger {
      background: #ef4444;
      color: white;
    }

    .lnm-btn-danger:hover {
      background: #dc2626;
    }

    .lnm-btn-success {
      background: #10b981;
      color: white;
    }

    .lnm-btn-success:hover {
      background: #059669;
    }

    .lnm-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }

    .lnm-view-btn {
      padding: 0.5rem;
      border: none;
      background: white;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .lnm-view-btn.active {
      background: #f3f4f6;
      color: #3b82f6;
    }

    .lnm-table-wrapper {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      max-height: calc(100vh - 400px);
      overflow-y: auto;
    }

    .lnm-table {
      width: 100%;
      border-collapse: collapse;
    }

    .lnm-table thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .lnm-table th {
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

    .lnm-table td {
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.8125rem;
      color: #374151;
      vertical-align: middle;
    }

    .lnm-table tbody tr {
      transition: background-color 0.15s;
    }

    .lnm-table tbody tr:hover {
      background: #f3f4f6;
    }

    .lnm-table tbody tr:has(input[type="checkbox"]:checked) {
      background: #eff6ff;
    }

    .lnm-table tbody tr:last-child td {
      border-bottom: none;
    }

    .lnm-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .lnm-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
      position: relative;
    }

    .lnm-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .lnm-card-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      background: #f3f4f6;
    }

    .lnm-card-content {
      padding: 1rem;
    }

    .lnm-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      gap: 0.5rem;
    }

    .lnm-card-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-height: 1.4;
      flex: 1;
    }

    .lnm-card-meta {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0.25rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .lnm-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .lnm-badge-verified {
      background: #d1fae5;
      color: #065f46;
    }

    .lnm-badge-unverified {
      background: #fee2e2;
      color: #991b1b;
    }

    .lnm-badge-filetype {
      background: #e0e7ff;
      color: #3730a3;
    }

    .lnm-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .lnm-icon-btn {
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

    .lnm-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .lnm-form-modal {
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

    .lnm-form-content {
      background: white;
      border-radius: 0.75rem;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .lnm-form-header {
      padding: 1.5rem 2rem;
      border-bottom: 3px solid #dc2626;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .lnm-form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .lnm-form-header .lnm-icon-btn {
      color: #ffffff;
    }

    .lnm-form-header .lnm-icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .lnm-form-body {
      padding: 1.5rem 2rem;
      overflow-y: auto;
      flex: 1;
    }

    .lnm-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .lnm-form-group {
      display: flex;
      flex-direction: column;
    }

    .lnm-form-group.full-width {
      grid-column: 1 / -1;
    }

    .lnm-form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .lnm-form-input,
    .lnm-form-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .lnm-form-input:focus,
    .lnm-form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .lnm-upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #f9fafb;
    }

    .lnm-upload-zone:hover,
    .lnm-upload-zone.dragging {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .lnm-upload-progress {
      margin-top: 1rem;
      height: 0.5rem;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }

    .lnm-upload-progress-bar {
      height: 100%;
      background: #3b82f6;
      transition: width 0.3s;
    }

    .lnm-form-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #f9fafb;
    }

    .lnm-preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .lnm-preview-content {
      width: 100%;
      max-width: 90vw;
      max-height: 90vh;
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .lnm-preview-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f9fafb;
    }

    .lnm-preview-body {
      flex: 1;
      overflow: auto;
      padding: 2rem;
    }

    .lnm-preview-body iframe {
      width: 100%;
      height: 100%;
      min-height: 600px;
      border: none;
    }

    .lnm-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
    }

    .lnm-pagination-info {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .lnm-pagination-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .lnm-pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .lnm-pagination-btn:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .lnm-pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .lnm-form-grid {
        grid-template-columns: 1fr;
      }
      
      .lnm-grid {
        grid-template-columns: 1fr;
      }
      
      .lnm-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  if (loading) {
    return (
      <div className="lnm-wrapper">
        <style>{isolatedStyles}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#3b82f6' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="lnm-wrapper">
      <style>{isolatedStyles}</style>
      
      {/* Header */}
      <div className="lnm-header">
        <h1 className="lnm-title">
          <FileText className="w-8 h-8" style={{ color: '#3b82f6' }} />
          Lecture Notes & E-learning Management
        </h1>
        <p className="lnm-subtitle">
          Manage all lecture notes, presentations, and e-learning materials
        </p>
      </div>

      {/* Statistics */}
      <div className="lnm-stats-grid">
        <div className="lnm-stat-card">
          <div className="lnm-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <FileText className="w-6 h-6" />
          </div>
          <div className="lnm-stat-label">Total Notes</div>
          <div className="lnm-stat-value">{stats.total}</div>
        </div>
        <div className="lnm-stat-card">
          <div className="lnm-stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="lnm-stat-label">Verified</div>
          <div className="lnm-stat-value">{stats.verified}</div>
        </div>
        <div className="lnm-stat-card">
          <div className="lnm-stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <XCircle className="w-6 h-6" />
          </div>
          <div className="lnm-stat-label">Unverified</div>
          <div className="lnm-stat-value">{stats.unverified}</div>
        </div>
        <div className="lnm-stat-card">
          <div className="lnm-stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <Download className="w-6 h-6" />
          </div>
          <div className="lnm-stat-label">Total Downloads</div>
          <div className="lnm-stat-value">{formatNumber(stats.totalDownloads)}</div>
        </div>
        <div className="lnm-stat-card">
          <div className="lnm-stat-icon" style={{ background: '#e0e7ff', color: '#6366f1' }}>
            <Eye className="w-6 h-6" />
          </div>
          <div className="lnm-stat-label">Total Views</div>
          <div className="lnm-stat-value">{formatNumber(stats.totalViews)}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="lnm-controls">
        <div className="lnm-search-wrapper">
          <Search className="lnm-search-icon" />
          <input
            type="text"
            className="lnm-search-input"
            placeholder="Search notes by title, field, lecturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          className="lnm-filter-select"
          value={selectedFilters.faculty}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, faculty: e.target.value }))}
        >
          <option value="">All Fields</option>
          {fields.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>

        <select
          className="lnm-filter-select"
          value={selectedFilters.verified}
          onChange={(e) => setSelectedFilters(prev => ({ ...prev, verified: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>

        <div className="lnm-view-toggle">
          <button
            className={`lnm-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            className={`lnm-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
        </div>

        <button
          className="lnm-btn lnm-btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditing(null);
            setFormData({
              title: "",
              field: "",
              lecturer: "",
              fileUrl: "",
              fileSize: 0,
              verified: false,
              pages: 0,
              imageUrl: "",
              fileType: "",
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="lnm-controls" style={{ background: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ color: '#1e40af', fontWeight: 600 }}>
            {selectedItems.size} item(s) selected
          </span>
          <button
            className="lnm-btn lnm-btn-success"
            onClick={() => bulkVerify(true)}
          >
            <CheckCircle2 className="w-4 h-4" />
            Verify Selected
          </button>
          <button
            className="lnm-btn lnm-btn-secondary"
            onClick={() => bulkVerify(false)}
          >
            <XCircle className="w-4 h-4" />
            Unverify Selected
          </button>
          <button
            className="lnm-btn lnm-btn-danger"
            onClick={bulkDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
          <button
            className="lnm-btn lnm-btn-secondary"
            onClick={() => setSelectedItems(new Set())}
          >
            <X className="w-4 h-4" />
            Clear Selection
          </button>
        </div>
      )}

      {/* Table/Grid View */}
      {viewMode === 'list' ? (
        <div className="lnm-table-wrapper">
          <table className="lnm-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.size === paginatedNotes.length && paginatedNotes.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Title</th>
                <th>Field</th>
                <th>Lecturer</th>
                <th>File Type</th>
                <th>Pages</th>
                <th>Downloads</th>
                <th>Views</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotes.map((note) => (
                <tr key={note.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(note.id)}
                      onChange={() => toggleSelection(note.id)}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{note.title}</div>
                  </td>
                  <td>{note.field}</td>
                  <td>{note.lecturer}</td>
                  <td>
                    <span className="lnm-badge lnm-badge-filetype">{note.fileType || 'PDF'}</span>
                  </td>
                  <td>{note.pages}</td>
                  <td>{formatNumber(note.downloads)}</td>
                  <td>{formatNumber(note.views)}</td>
                  <td>
                    {note.verified ? (
                      <span className="lnm-badge lnm-badge-verified">Verified</span>
                    ) : (
                      <span className="lnm-badge lnm-badge-unverified">Unverified</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="lnm-icon-btn"
                        onClick={() => previewFile(note.fileUrl)}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="lnm-icon-btn"
                        onClick={() => startEditing(note)}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="lnm-icon-btn"
                        onClick={() => deleteLectureNote(note.id)}
                        title="Delete"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="lnm-grid">
          {paginatedNotes.map((note) => (
            <div key={note.id} className="lnm-card">
              {note.imageUrl ? (
                <img src={note.imageUrl} alt={note.title} className="lnm-card-image" />
              ) : (
                <div className="lnm-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                  <FileText className="w-16 h-16" style={{ color: '#9ca3af' }} />
                </div>
              )}
              <div className="lnm-card-content">
                <div className="lnm-card-header">
                  <div style={{ flex: 1 }}>
                    <h3 className="lnm-card-title">{note.title}</h3>
                    <div className="lnm-card-meta">
                      <span>{note.field}</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(note.id)}
                    onChange={() => toggleSelection(note.id)}
                    style={{ marginTop: '0.25rem' }}
                  />
                </div>
                <div className="lnm-card-meta">
                  <User className="w-3 h-3" />
                  <span>{note.lecturer}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="lnm-badge lnm-badge-filetype">{note.fileType || 'PDF'}</span>
                  {note.verified ? (
                    <span className="lnm-badge lnm-badge-verified">Verified</span>
                  ) : (
                    <span className="lnm-badge lnm-badge-unverified">Unverified</span>
                  )}
                </div>
                <div className="lnm-card-actions">
                  <button
                    className="lnm-icon-btn"
                    onClick={() => previewFile(note.fileUrl)}
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="lnm-icon-btn"
                    onClick={() => startEditing(note)}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="lnm-icon-btn"
                    onClick={() => deleteLectureNote(note.id)}
                    title="Delete"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span><Download className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle' }} /> {formatNumber(note.downloads)}</span>
                    <span><Eye className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle' }} /> {formatNumber(note.views)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="lnm-pagination">
          <div className="lnm-pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredNotes.length)} of {filteredNotes.length} notes
          </div>
          <div className="lnm-pagination-controls">
            <button
              className="lnm-pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span style={{ padding: '0 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="lnm-pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="lnm-form-modal" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddForm(false);
            setEditing(null);
          }
        }}>
          <div className="lnm-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="lnm-form-header">
              <h2 className="lnm-form-title">
                {editing ? 'Edit Lecture Note' : 'Add New Lecture Note'}
              </h2>
              <button
                className="lnm-icon-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="lnm-form-body">
              <div className="lnm-form-grid">
                <div className="lnm-form-group full-width">
                  <label className="lnm-form-label">Title *</label>
                  <input
                    type="text"
                    className="lnm-form-input"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>
                <div className="lnm-form-group">
                  <label className="lnm-form-label">Field *</label>
                  <select
                    className="lnm-form-select"
                    value={formData.field}
                    onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                  >
                    <option value="">Select Field</option>
                    {fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div className="lnm-form-group">
                  <label className="lnm-form-label">Lecturer *</label>
                  <input
                    type="text"
                    className="lnm-form-input"
                    value={formData.lecturer}
                    onChange={(e) => setFormData(prev => ({ ...prev, lecturer: e.target.value }))}
                    placeholder="e.g., Dr. Kwame Mensah"
                  />
                </div>
                <div className="lnm-form-group">
                  <label className="lnm-form-label">
                    Pages/Slides
                    {formData.pages > 0 && formData.fileUrl && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: '0.5rem', fontWeight: 'normal' }}>
                        (Auto-detected)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    className="lnm-form-input"
                    value={formData.pages}
                    onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 0 }))}
                    min="0"
                    placeholder={isDetectingPages ? "Detecting pages..." : "Auto-detected or enter manually"}
                    disabled={isDetectingPages}
                    style={{
                      backgroundColor: formData.pages > 0 && formData.fileUrl ? '#f0fdf4' : 'white',
                      borderColor: formData.pages > 0 && formData.fileUrl ? '#86efac' : undefined
                    }}
                  />
                  {isDetectingPages && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Analyzing file to detect page/slide count...
                    </div>
                  )}
                </div>
                <div className="lnm-form-group full-width">
                  <label className="lnm-form-label">File Upload *</label>
                  <div
                    ref={dropZoneRef}
                    className={`lnm-upload-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8" style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                    <p style={{ margin: '0 0 0.5rem', color: '#374151', fontWeight: 600 }}>
                      {formData.fileUrl ? 'File uploaded' : 'Click to upload or drag and drop'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                      PDF, PPTX, PPT (Max 100MB)
                    </p>
                    {formData.fileUrl && (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#d1fae5', borderRadius: '0.5rem', color: '#065f46' }}>
                        <FileCheck className="w-4 h-4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        {formData.fileUrl.split('/').pop()} ({formatFileSize(formData.fileSize)})
                      </div>
                    )}
                    {uploading && (
                      <div className="lnm-upload-progress">
                        <div className="lnm-upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,.pptx,.ppt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>
                <div className="lnm-form-group full-width">
                  <label className="lnm-form-label">Thumbnail Image (Optional)</label>
                  <div
                    className={`lnm-upload-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImageIcon className="w-8 h-8" style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                    <p style={{ margin: '0 0 0.5rem', color: '#374151', fontWeight: 600 }}>
                      {formData.imageUrl ? 'Image uploaded' : 'Click to upload or drag and drop'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                      JPG, PNG, WEBP (Max 5MB)
                    </p>
                    {formData.imageUrl && (
                      <div style={{ marginTop: '1rem' }}>
                        <img src={formData.imageUrl} alt="Thumbnail" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '0.5rem' }} />
                      </div>
                    )}
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
                <div className="lnm-form-group full-width" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                    style={{ flexShrink: 0 }}
                  />
                  <label htmlFor="verified" className="lnm-form-label" style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Mark as verified
                  </label>
                </div>
              </div>
            </div>
            <div className="lnm-form-footer">
              <button
                className="lnm-btn lnm-btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>
              <button
                className="lnm-btn lnm-btn-primary"
                onClick={saveLectureNote}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editing ? 'Update Note' : 'Add Note'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && previewUrl && (
        <div className="lnm-preview-modal" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setPreviewModalOpen(false);
            setPreviewUrl(null);
          }
        }}>
          <div className="lnm-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="lnm-preview-header">
              <h3 style={{ margin: 0, color: '#111827' }}>File Preview</h3>
              <button
                className="lnm-icon-btn"
                onClick={() => {
                  setPreviewModalOpen(false);
                  setPreviewUrl(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="lnm-preview-body">
              <iframe src={previewUrl} title="File Preview" />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setNoteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Lecture Note"
        description="Are you sure you want to delete this lecture note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default LectureNotesManager;

