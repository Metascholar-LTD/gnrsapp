import { useState, useMemo, useCallback, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Download, 
  Eye, 
  FileText,
  Filter,
  X,
  CheckCircle2,
  Building2,
  BookOpen,
  Calendar,
  Grid3x3,
  List,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ExamPaperCard } from "@/components/ui/card-7";
import { ExamPaperListItem } from "@/components/ui/exam-paper-list-item";
import { PartneringUniversities } from "@/components/PartneringUniversities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface ExamPaper {
  id: string;
  title: string;
  courseCode: string;
  courseName: string; // Kept for backward compatibility but will use title
  faculty: string;
  year: number;
  semester: "1st" | "2nd";
  university: string;
  universityShort: string;
  examType: string;
  downloads: number;
  views: number;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
  fileUrl?: string; // For PDF download/preview
}

// Helper function to format file size from bytes to string
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

// Transform Supabase data to ExamPaper format
const transformFromSupabase = (data: any): ExamPaper => {
  return {
    id: data.id,
    title: data.title || "",
    courseCode: data.course_code || "",
    courseName: data.title || "", // Use title as courseName for compatibility
    faculty: data.faculty || "",
    year: data.year || new Date().getFullYear(),
    semester: data.semester || "1st",
    university: data.university || "",
    universityShort: data.university_short || "",
    examType: data.exam_type || "End of Semester",
    downloads: data.downloads || 0,
    views: data.views || 0,
    fileSize: formatFileSize(data.file_size || 0),
    uploadDate: data.upload_date || data.created_at?.split('T')[0] || "",
    verified: data.verified || false,
    fileUrl: data.file_url || "",
  };
};

// University logo mapping
const universityLogos: Record<string, string> = {
  "UG": "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png",
  "KNUST": "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png",
  "UCC": "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png",
  "UEW": "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png",
  "UMaT": "https://res.cloudinary.com/dsypclqxk/image/upload/v1759428982/WhatsApp_Image_2025-10-02_at_15.46.11_f720a723_lzrtfp.jpg",
  "UDS": "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379766/0a0d9027-8f25-4d2f-a291-8fae7914dec3.png",
  "GIMPA": "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png",
  "CUG": "https://res.cloudinary.com/dsypclqxk/image/upload/v1756722559/catholic-university-ghana-logo_onhrgj.jpg",
  "PUC": "https://res.cloudinary.com/dsypclqxk/image/upload/v1756722725/OIP_czwzp0.webp",
  "UENR": "https://res.cloudinary.com/dsypclqxk/image/upload/v1758510525/download_uxkc4q.jpg",
  "AIT": "https://res.cloudinary.com/dsypclqxk/image/upload/v1759428988/WhatsApp_Image_2025-10-02_at_15.47.06_33dd4bda_pj0a6t.jpg",
};

const PastQuestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isFilterSidebarCollapsed, setIsFilterSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "grouped">("grouped");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedUniversities, setExpandedUniversities] = useState<Record<string, boolean>>({});
  const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const itemsPerPage = 24;

  // Fetch exam papers from Supabase
  useEffect(() => {
    fetchExamPapers();
  }, []);

  const fetchExamPapers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('past_questions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        const transformed = data.map(transformFromSupabase);
        setExamPapers(transformed);
      } else {
        setExamPapers([]);
      }
    } catch (error: any) {
      console.error("Error fetching exam papers:", error);
      // Fallback to empty array on error
      setExamPapers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF preview
  const handlePreview = (paper: ExamPaper) => {
    if (paper.fileUrl) {
      setPreviewUrl(paper.fileUrl);
      setPreviewModalOpen(true);
      // Increment views
      incrementViews(paper.id);
    }
  };

  // Handle PDF download
  const handleDownload = async (paper: ExamPaper) => {
    if (paper.fileUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = paper.fileUrl;
      link.download = `${paper.courseCode}_${paper.year}_${paper.semester}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Increment downloads
      incrementDownloads(paper.id);
    }
  };

  // Increment views
  const incrementViews = async (id: string) => {
    try {
      const paper = examPapers.find(p => p.id === id);
      if (!paper) return;

      const { error } = await supabase
        .from('past_questions' as any)
        .update({ views: (paper.views || 0) + 1 })
        .eq('id', id);

      if (!error) {
        setExamPapers(prev => prev.map(p => 
          p.id === id ? { ...p, views: (p.views || 0) + 1 } : p
        ));
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  // Increment downloads
  const incrementDownloads = async (id: string) => {
    try {
      const paper = examPapers.find(p => p.id === id);
      if (!paper) return;

      const { error } = await supabase
        .from('past_questions' as any)
        .update({ downloads: (paper.downloads || 0) + 1 })
        .eq('id', id);

      if (!error) {
        setExamPapers(prev => prev.map(p => 
          p.id === id ? { ...p, downloads: (p.downloads || 0) + 1 } : p
        ));
      }
    } catch (error) {
      console.error("Error incrementing downloads:", error);
    }
  };

  // Mock exam papers data (fallback - will be removed once Supabase is connected)
  const mockExamPapers: ExamPaper[] = [
    { 
      id: "1", 
      title: "Advanced Engineering Mathematics", 
      courseCode: "MATH 253",
      courseName: "Advanced Engineering Mathematics",
      faculty: "Engineering", 
      year: 2023, 
      semester: "2nd",
      university: "University of Ghana", 
      universityShort: "UG",
      examType: "End of Semester", 
      downloads: 2840, 
      views: 5620,
      fileSize: "3.2 MB", 
      uploadDate: "2024-01-15",
      verified: true
    },
    { 
      id: "2", 
      title: "Human Anatomy and Physiology", 
      courseCode: "MEDC 221",
      courseName: "Human Anatomy and Physiology",
      faculty: "Medicine & Health Sciences", 
      year: 2023, 
      semester: "1st",
      university: "Kwame Nkrumah University of Science and Technology", 
      universityShort: "KNUST",
      examType: "Mid Semester", 
      downloads: 3150, 
      views: 6890,
      fileSize: "4.1 MB", 
      uploadDate: "2024-02-08",
      verified: true
    },
    { 
      id: "3", 
      title: "Financial Accounting", 
      courseCode: "ACCT 152",
      courseName: "Financial Accounting",
      faculty: "Business & Economics", 
      year: 2023, 
      semester: "2nd",
      university: "University of Cape Coast", 
      universityShort: "UCC",
      examType: "End of Semester", 
      downloads: 1980, 
      views: 4230,
      fileSize: "2.8 MB", 
      uploadDate: "2024-01-22",
      verified: true
    },
    { 
      id: "4", 
      title: "Structural Engineering Design", 
      courseCode: "CENG 351",
      courseName: "Structural Engineering Design",
      faculty: "Engineering", 
      year: 2023, 
      semester: "1st",
      university: "Kwame Nkrumah University of Science and Technology", 
      universityShort: "KNUST",
      examType: "End of Semester", 
      downloads: 2560, 
      views: 5100,
      fileSize: "5.3 MB", 
      uploadDate: "2023-12-18",
      verified: true
    },
    { 
      id: "5", 
      title: "Constitutional Law", 
      courseCode: "LAW 241",
      courseName: "Constitutional Law",
      faculty: "Law", 
      year: 2023, 
      semester: "2nd",
      university: "University of Ghana", 
      universityShort: "UG",
      examType: "End of Semester", 
      downloads: 1670, 
      views: 3450,
      fileSize: "2.1 MB", 
      uploadDate: "2024-01-30",
      verified: true
    },
    { 
      id: "6", 
      title: "Data Structures and Algorithms", 
      courseCode: "COMP 232",
      courseName: "Data Structures and Algorithms",
      faculty: "Computing & IT", 
      year: 2023, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      examType: "End of Semester", 
      downloads: 3890, 
      views: 7250,
      fileSize: "3.7 MB", 
      uploadDate: "2023-11-25",
      verified: true
    },
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get unique values for filters
  const universities = useMemo(() => 
    Array.from(new Set(examPapers.map(p => p.universityShort))).sort(),
    [examPapers]
  );
  const faculties = useMemo(() => 
    Array.from(new Set(examPapers.map(p => p.faculty))).sort(),
    [examPapers]
  );
  const years = useMemo(() => 
    Array.from(new Set(examPapers.map(p => p.year))).sort((a, b) => b - a),
    [examPapers]
  );
  const semesters = ["1st", "2nd"];

  // Memoized filtering logic
  const filteredPapers = useMemo(() => {
    return examPapers.filter(paper => {
      const matchesSearch = 
        !debouncedSearchQuery ||
        paper.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        paper.courseCode.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        paper.university.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        paper.faculty.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      const matchesUniversity = !selectedUniversity || paper.universityShort === selectedUniversity;
      const matchesFaculty = !selectedFaculty || paper.faculty === selectedFaculty;
      const matchesYear = !selectedYear || paper.year === selectedYear;
      const matchesSemester = !selectedSemester || paper.semester === selectedSemester;
      
      return matchesSearch && matchesUniversity && matchesFaculty && matchesYear && matchesSemester;
    });
  }, [examPapers, debouncedSearchQuery, selectedUniversity, selectedFaculty, selectedYear, selectedSemester]);

  // Group papers by university
  const groupedPapers = useMemo(() => {
    const groups: Record<string, ExamPaper[]> = {};
    filteredPapers.forEach(paper => {
      if (!groups[paper.universityShort]) {
        groups[paper.universityShort] = [];
      }
      groups[paper.universityShort].push(paper);
    });
    return groups;
  }, [filteredPapers]);

  // Pagination
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const paginatedPapers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPapers.slice(start, end);
  }, [filteredPapers, currentPage]);

  // Toggle university expansion
  const toggleUniversity = useCallback((uni: string) => {
    setExpandedUniversities(prev => {
      const newState = {
        ...prev,
        [uni]: prev[uni] === undefined ? false : !prev[uni]
      };
      return newState;
    });
  }, []);

  // Expand all / Collapse all
  const toggleAllUniversities = useCallback(() => {
    const allUnis = Object.keys(groupedPapers);
    const allExpanded = allUnis.every(uni => expandedUniversities[uni] === true);
    
    if (allExpanded) {
      // Collapse all
      const newState: Record<string, boolean> = {};
      allUnis.forEach(uni => {
        newState[uni] = false;
      });
      setExpandedUniversities(newState);
    } else {
      // Expand all
      const newState: Record<string, boolean> = {};
      allUnis.forEach(uni => {
        newState[uni] = true;
      });
      setExpandedUniversities(newState);
    }
  }, [expandedUniversities, groupedPapers]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedUniversity(null);
    setSelectedFaculty(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = selectedUniversity || selectedFaculty || selectedYear || selectedSemester;

  const isolatedStyles = `
    .past-questions-page {
      min-height: 100vh;
      background: white;
    }

    .past-questions-content-wrapper {
      min-height: calc(100vh - 80px);
      display: flex;
      gap: 0;
      width: 100%;
    }

    .past-questions-main-content {
      flex: 1;
      padding: 2rem;
      max-width: 100%;
      margin: 0;
      transition: margin-left 0.3s ease;
      min-width: 0;
      width: 100%;
    }

    .past-questions-header {
      margin-bottom: 2rem;
    }

    .past-questions-title {
      font-size: 2rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.2;
    }

    .past-questions-subtitle {
      font-size: 16px;
      color: hsl(220 20% 40%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .past-questions-search-filter-wrapper {
      margin-bottom: 1.5rem;
    }

    .past-questions-search-view-toggle-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
      width: 100%;
    }

    .past-questions-search-wrapper {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .past-questions-search-input-container {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .past-questions-results-count {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .past-questions-results-count-mobile {
      display: none;
    }

    .past-questions-filter-btn-mobile {
      display: flex;
    }

    @media (min-width: 1024px) {
      .past-questions-filter-btn-mobile {
        display: none !important;
      }

      .past-questions-results-count-mobile {
        display: none !important;
      }
    }

    .past-questions-active-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .past-questions-active-filters-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .past-questions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    @media (min-width: 640px) {
      .past-questions-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .past-questions-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
    }

    @media (min-width: 1280px) {
      .past-questions-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
    }

    .past-questions-empty-state {
      text-align: center;
      padding: 3rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .past-questions-list-view {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 2rem;
    }

    .past-questions-grouped-view {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .past-questions-university-content {
      overflow: hidden;
      transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
    }

    .past-questions-university-content.collapsed {
      max-height: 0;
      opacity: 0;
    }

    .past-questions-university-content.expanded {
      max-height: 5000px;
      opacity: 1;
    }

    /* Filter Sidebar Styles */
    .past-questions-filter-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 40;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .past-questions-filter-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .past-questions-filter-sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid hsl(40 20% 88%);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      position: relative;
      z-index: 10;
      height: 100%;
      max-height: calc(100vh - 80px);
    }

    .past-questions-filter-sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .past-questions-filter-sidebar.collapsed {
      width: 60px;
    }

    .past-questions-filter-sidebar.collapsed .past-questions-filter-sidebar-content,
    .past-questions-filter-sidebar.collapsed .past-questions-filter-actions {
      opacity: 0;
      pointer-events: none;
    }

    .past-questions-filter-sidebar.collapsed .past-questions-filter-sidebar-header h3 span {
      display: none;
    }

    .past-questions-filter-sidebar.collapsed .past-questions-filter-sidebar-header {
      justify-content: center;
      padding: 1.5rem 0.75rem;
    }

    .past-questions-filter-sidebar.collapsed .past-questions-filter-sidebar-header h3 {
      justify-content: center;
      margin: 0;
    }

    @media (max-width: 1023px) {
      .past-questions-filter-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        max-width: 85vw;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
        z-index: 50;
        transform: translateX(-100%);
        width: 280px;
      }

      .past-questions-filter-sidebar.open {
        transform: translateX(0);
      }

      .past-questions-main-content {
        margin-left: 0 !important;
        width: 100%;
      }

      .past-questions-content-wrapper {
        flex-direction: column;
      }
    }

    @media (min-width: 1024px) {
      .past-questions-filter-sidebar {
        display: flex !important;
      }

      .past-questions-filter-overlay {
        display: none !important;
      }
    }

    .past-questions-filter-sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid hsl(40 20% 88%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, hsl(220 30% 15%) 0%, hsl(220 20% 25%) 100%);
      color: white;
      position: sticky;
      top: 0;
      z-index: 10;
      min-height: 70px;
    }

    .past-questions-filter-sidebar-header * {
      color: white !important;
    }

    .past-questions-filter-sidebar-header h3 {
      color: white !important;
    }

    .past-questions-filter-sidebar-header h3 span {
      color: white !important;
    }

    .past-questions-filter-sidebar-header svg {
      color: white !important;
    }

    .past-questions-filter-sidebar.collapsed .past-questions-filter-sidebar-header {
      justify-content: center;
      padding: 1.5rem 0.75rem;
    }

    .past-questions-filter-sidebar-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .past-questions-filter-sidebar-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }

    .past-questions-filter-sidebar-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .past-questions-filter-collapse-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
      margin-left: auto;
      margin-right: 0.5rem;
    }

    .past-questions-filter-collapse-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .past-questions-filter-sidebar.collapsed .past-questions-filter-collapse-btn {
      margin: 0;
    }

    .past-questions-filter-mobile-close {
      display: none;
    }

    @media (max-width: 1023px) {
      .past-questions-filter-collapse-btn {
        display: none;
      }

      .past-questions-filter-mobile-close {
        display: flex;
      }
    }

    .past-questions-filter-section {
      margin-bottom: 2rem;
    }

    .past-questions-filter-section:last-child {
      margin-bottom: 0;
    }

    .past-questions-filter-section-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .past-questions-filter-section-title::before {
      content: '';
      width: 3px;
      height: 1rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
    }

    .past-questions-filter-group {
      margin-bottom: 1.5rem;
    }

    .past-questions-filter-group:last-child {
      margin-bottom: 0;
    }

    .past-questions-filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      margin-bottom: 0.75rem;
      display: block;
    }

    .past-questions-filter-actions {
      padding: 1.5rem;
      border-top: 1px solid hsl(40 20% 88%);
      background: hsl(40 33% 96%);
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }

    .past-questions-filter-btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .past-questions-filter-btn-primary {
      background: #3b82f6;
      color: white;
    }

    .past-questions-filter-btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .past-questions-filter-btn-secondary {
      background: white;
      color: hsl(220 30% 15%);
      border: 1px solid hsl(40 20% 88%);
    }

    .past-questions-filter-btn-secondary:hover {
      background: hsl(40 20% 95%);
    }

    @media (min-width: 1024px) {
      .past-questions-filter-overlay {
        display: none;
      }

      .past-questions-content-area {
        flex: 1;
        min-width: 0;
      }

      .past-questions-main-content {
        margin-left: 0;
      }

      .past-questions-filter-sidebar.collapsed ~ .past-questions-main-content {
        margin-left: 0;
      }
    }

    .past-questions-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      overflow: hidden;
      background: white;
    }

    .past-questions-view-button {
      padding: 0.5rem;
      border: none;
      background: white;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
    }

    .past-questions-view-button.active {
      background: #f3f4f6;
      color: #1f2937;
    }

    .past-questions-view-button:hover {
      background: #f9fafb;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .past-questions-content-wrapper {
        padding-top: 60px;
        flex-direction: column;
      }

      .past-questions-main-content {
        padding: 1rem;
        width: 100%;
      }

      .past-questions-header {
        margin-bottom: 1.5rem;
      }

      .past-questions-title {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }

      .past-questions-subtitle {
        font-size: 14px;
        margin-bottom: 1.25rem;
        line-height: 1.5;
      }

      .past-questions-search-filter-wrapper {
        margin-bottom: 1rem;
      }

      .past-questions-search-view-toggle-wrapper {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }

      .past-questions-search-wrapper {
        width: 100%;
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }

      .past-questions-search-input-container {
        width: 100%;
        min-width: 0;
      }

      .past-questions-results-count {
        display: none;
      }

      .past-questions-view-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .past-questions-results-count-mobile {
        display: block;
        font-size: 0.8125rem;
        color: hsl(220 20% 40%);
        white-space: nowrap;
        font-weight: 500;
      }

      .past-questions-results-count-mobile span {
        font-weight: 700;
        color: hsl(220 30% 15%);
      }

      .past-questions-view-toggle {
        width: 100%;
        justify-content: center;
      }

      .past-questions-filter-sidebar {
        width: 100%;
        max-width: 320px;
      }

      .past-questions-grid {
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .past-questions-list-view {
        margin-top: 1.5rem;
        gap: 0.5rem;
      }

      .past-questions-active-filters {
        padding: 0.75rem;
        margin-top: 1rem;
        gap: 0.5rem;
      }

      .past-questions-filter-sidebar-header {
        padding: 1rem;
        min-height: 60px;
      }

      .past-questions-filter-sidebar-content {
        padding: 1rem;
      }

      .past-questions-filter-actions {
        padding: 1rem;
        flex-direction: column;
      }

      .past-questions-filter-btn {
        width: 100%;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .past-questions-content-wrapper {
        padding-top: 70px;
      }

      .past-questions-main-content {
        padding: 1.5rem;
      }

      .past-questions-header {
        margin-bottom: 2rem;
      }

      .past-questions-title {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }

      .past-questions-subtitle {
        font-size: 17px;
        margin-bottom: 1.75rem;
      }

      .past-questions-search-filter-wrapper {
        margin-bottom: 1.75rem;
      }

      .past-questions-search-view-toggle-wrapper {
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .past-questions-search-wrapper {
        flex: 1 1 auto;
        min-width: 300px;
      }

      .past-questions-search-input-container {
        flex: 1;
        min-width: 250px;
      }

      .past-questions-results-count {
        font-size: 0.875rem;
      }

      .past-questions-filter-sidebar {
        width: 280px;
      }

      .past-questions-grid {
        gap: 1.25rem;
        margin-top: 2rem;
      }

      .past-questions-filter-sidebar-header {
        padding: 1.25rem;
      }

      .past-questions-filter-sidebar-content {
        padding: 1.25rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .past-questions-content-wrapper {
        padding-top: 120px;
      }

      .past-questions-main-content {
        padding: 2rem;
      }

      .past-questions-header {
        margin-bottom: 2.5rem;
      }

      .past-questions-title {
        font-size: 2.75rem;
        margin-bottom: 0.875rem;
      }

      .past-questions-subtitle {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .past-questions-search-filter-wrapper {
        margin-bottom: 2rem;
      }

      .past-questions-filter-sidebar {
        width: 300px;
      }

      .past-questions-grid {
        gap: 1.5rem;
        margin-top: 2.5rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .past-questions-content-wrapper {
        padding-top: 120px;
      }

      .past-questions-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }

      .past-questions-header {
        margin-bottom: 3rem;
      }

      .past-questions-title {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .past-questions-subtitle {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .past-questions-search-filter-wrapper {
        margin-bottom: 2rem;
      }

      .past-questions-filter-sidebar {
        width: 320px;
      }

      .past-questions-grid {
        gap: 1.5rem;
        margin-top: 3rem;
      }
    }

    /* PDF Preview Modal Styles */
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

    .pqm-icon-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s;
    }

    .pqm-icon-btn:hover {
      background: #e5e7eb;
      color: #111827;
    }

    @media (max-width: 768px) {
      .pqm-preview-modal {
        padding: 1rem;
      }

      .pqm-preview-content {
        height: 95vh;
      }

      .pqm-preview-header {
        padding: 0.75rem 1rem;
      }

      .pqm-preview-body {
        padding: 0.5rem;
      }
    }
  `;

  return (
    <>
      <InitScripts />
      <Spinner />
      <div className="past-questions-page">
        <style>{isolatedStyles}</style>
        <Navigation />
        
        <div className="past-questions-content-wrapper">
          {/* Filter Overlay */}
          <div 
            className={`past-questions-filter-overlay ${isFilterSidebarOpen ? 'active' : ''}`}
            onClick={() => setIsFilterSidebarOpen(false)}
          />

          {/* Filter Sidebar */}
          <div className={`past-questions-filter-sidebar ${isFilterSidebarOpen ? 'open' : ''} ${isFilterSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="past-questions-filter-sidebar-header">
              <h3></h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="past-questions-filter-collapse-btn"
                  onClick={() => setIsFilterSidebarCollapsed(!isFilterSidebarCollapsed)}
                  type="button"
                  title={isFilterSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isFilterSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                  className="past-questions-filter-sidebar-close past-questions-filter-mobile-close"
                  onClick={() => setIsFilterSidebarOpen(false)}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="past-questions-filter-sidebar-content">
              <div className="past-questions-filter-section">
                <div className="past-questions-filter-section-title">Filter Options</div>
                
                <div className="past-questions-filter-group">
                  <label className="past-questions-filter-label">University</label>
                  <Select
                    value={selectedUniversity ?? ""}
                    onValueChange={(value) => setSelectedUniversity(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Universities" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="past-questions-filter-group">
                  <label className="past-questions-filter-label">Faculty</label>
                  <Select
                    value={selectedFaculty ?? ""}
                    onValueChange={(value) => setSelectedFaculty(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Faculties" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty} value={faculty}>
                          {faculty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="past-questions-filter-group">
                  <label className="past-questions-filter-label">Year</label>
                  <Select
                    value={selectedYear !== null ? selectedYear.toString() : ""}
                    onValueChange={(value) => setSelectedYear(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="past-questions-filter-group">
                  <label className="past-questions-filter-label">Semester</label>
                  <Select
                    value={selectedSemester ?? ""}
                    onValueChange={(value) => setSelectedSemester(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="past-questions-filter-actions">
              <button
                className="past-questions-filter-btn past-questions-filter-btn-secondary"
                onClick={clearAllFilters}
                type="button"
              >
                Clear All
              </button>
              <button
                className="past-questions-filter-btn past-questions-filter-btn-primary"
                onClick={() => setIsFilterSidebarOpen(false)}
                type="button"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <div className="past-questions-main-content">
            <div className="past-questions-content-area">
            <div className="past-questions-header">
              <h1 className="past-questions-title">University Past Questions</h1>
              <p className="past-questions-subtitle">
                Access comprehensive exam materials from Ghana's leading universities. 
                Study smarter, perform better with our extensive collection of past examination papers.
              </p>
              
              {/* Search Bar and View Toggle */}
              <div className="past-questions-search-filter-wrapper">
                <div className="past-questions-search-view-toggle-wrapper">
                  <div className="past-questions-search-wrapper">
                    <div className="past-questions-search-input-container">
                      <motion.div
                        layoutId="search-input-container"
                        transition={{
                          layout: {
                            duration: 0.5,
                            type: 'spring',
                            bounce: 0.2
                          }
                        }}
                        style={{
                          borderRadius: '30px'
                        }}
                        className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-lg overflow-visible border bg-neutral-100"
                      >
                        <div className="flex items-center w-full justify-start gap-2 px-4 h-12">
                          <motion.div layoutId="search-icon">
                            <Search className="size-5 stroke-[1.4]" />
                          </motion.div>
                          <div className="flex-1 relative">
                            {!searchQuery && (
                              <motion.div
                                layout
                                className="absolute text-gray-500 flex items-center pointer-events-none z-10"
                              >
                                <AnimatePresence mode="popLayout">
                                  <motion.p
                                    layoutId={`placeholder-search`}
                                    key={`placeholder-search`}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                    className="text-base"
                                  >
                                    Search papers...
                                  </motion.p>
                                </AnimatePresence>
                              </motion.div>
                            )}

                            <motion.input
                              layout="position"
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-transparent outline-none ring-none text-black text-base"
                            />
                          </div>
                          <Button 
                            variant="outline"
                            className="h-8 px-3 md:px-4 rounded-xl border-slate-200 hover:bg-slate-50 relative past-questions-filter-btn-mobile flex-shrink-0"
                            onClick={() => setIsFilterSidebarOpen(true)}
                          >
                            <Filter className="w-4 h-4 md:mr-1.5" />
                            <span className="hidden md:inline text-sm">Filters</span>
                            {hasActiveFilters && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                {[selectedUniversity, selectedFaculty, selectedYear, selectedSemester].filter(Boolean).length}
                              </span>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                    <div className="past-questions-results-count">
                      <span className="font-semibold text-[hsl(220_30%_15%)]">{filteredPapers.length}</span>{" "}
                      {filteredPapers.length === 1 ? "paper" : "papers"} found
                    </div>
                  </div>
                  <div className="past-questions-view-toggle">
                    <span className="past-questions-results-count-mobile">
                      <span>{filteredPapers.length}</span> {filteredPapers.length === 1 ? "paper" : "papers"}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        className={`past-questions-view-button ${viewMode === "grouped" ? "active" : ""}`}
                        onClick={() => setViewMode("grouped")}
                        title="Grouped View"
                      >
                        <Building2 size={18} />
                      </button>
                      <button
                        className={`past-questions-view-button ${viewMode === "grid" ? "active" : ""}`}
                        onClick={() => setViewMode("grid")}
                        title="Grid View"
                      >
                        <Grid3x3 size={18} />
                      </button>
                      <button
                        className={`past-questions-view-button ${viewMode === "list" ? "active" : ""}`}
                        onClick={() => setViewMode("list")}
                        title="List View"
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="past-questions-active-filters">
                    <span className="past-questions-active-filters-label">Active Filters:</span>
                    
                    {selectedUniversity && (
                      <Badge className="px-3 py-1.5 flex items-center gap-2 bg-blue-600 text-white">
                        {selectedUniversity}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setSelectedUniversity(null)}
                        />
                      </Badge>
                    )}
                    
                    {selectedFaculty && (
                      <Badge className="px-3 py-1.5 flex items-center gap-2 bg-purple-600 text-white">
                        {selectedFaculty}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setSelectedFaculty(null)}
                        />
                      </Badge>
                    )}
                    
                    {selectedYear && (
                      <Badge className="px-3 py-1.5 flex items-center gap-2 bg-pink-600 text-white">
                        {selectedYear}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setSelectedYear(null)}
                        />
                      </Badge>
                    )}
                    
                    {selectedSemester && (
                      <Badge className="px-3 py-1.5 flex items-center gap-2 bg-green-600 text-white">
                        {selectedSemester}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setSelectedSemester(null)}
                        />
                      </Badge>
                    )}

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-slate-600"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <div style={{ 
                textAlign: "center", 
                padding: "4rem 2rem",
                gridColumn: '1 / -1'
              }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white" style={{ border: '1px solid hsl(40 20% 88%)' }}>
                  <FileText className="w-8 h-8 animate-pulse" style={{ color: 'hsl(220 20% 40%)' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(220 30% 15%)' }}>
                  Loading past questions...
                </h3>
                <p className="text-sm" style={{ color: 'hsl(220 20% 40%)' }}>
                  Please wait while we fetch the latest papers
                </p>
              </div>
            ) : filteredPapers.length > 0 ? (
              <>
                {viewMode === "grouped" ? (
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[hsl(220_30%_15%)]">
                        Organized by University
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleAllUniversities}
                        className="text-xs"
                      >
                        {Object.keys(groupedPapers).every(uni => expandedUniversities[uni] === true)
                          ? "Collapse All"
                          : "Expand All"}
                      </Button>
                    </div>
                    {Object.entries(groupedPapers)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([uni, papers]) => {
                        const isExpanded = expandedUniversities[uni] !== false; // Default to expanded if not set
                        return (
                          <div
                            key={uni}
                            className="bg-[hsl(40_33%_96%)] rounded-xl border border-[hsl(40_20%_88%)] overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleUniversity(uni);
                              }}
                              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[hsl(40_20%_90%)] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {universityLogos[uni] && (
                                  <img
                                    src={universityLogos[uni]}
                                    alt={uni}
                                    className="w-10 h-10 object-contain"
                                  />
                                )}
                                <div className="text-left">
                                  <h4 className="font-semibold text-[hsl(220_30%_15%)]">{uni}</h4>
                                  <p className="text-sm text-[hsl(220_20%_40%)]">
                                    {papers.length} {papers.length === 1 ? "paper" : "papers"}
                                  </p>
                                </div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-[hsl(220_20%_40%)]" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[hsl(220_20%_40%)]" />
                              )}
                            </button>
                            <div className={`past-questions-university-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                              <div className="px-6 pb-6">
                                <div className="past-questions-grid mt-4">
                                  {papers.map((paper) => (
                                    <ExamPaperCard
                                      key={paper.id}
                                      title={paper.title}
                                      courseCode={paper.courseCode}
                                      university={paper.university}
                                      universityShort={paper.universityShort}
                                      faculty={paper.faculty}
                                      year={paper.year}
                                      semester={paper.semester}
                                      downloads={paper.downloads}
                                      views={paper.views}
                                      fileSize={paper.fileSize}
                                      verified={paper.verified}
                                      examType={paper.examType}
                                      universityLogo={universityLogos[paper.universityShort]}
                                      hideUniversityBadge={true}
                                      onPreview={() => handlePreview(paper)}
                                      onDownload={() => handleDownload(paper)}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : viewMode === "grid" ? (
                  <>
                    <div className="past-questions-grid mt-6">
                      {paginatedPapers.map((paper) => (
                        <ExamPaperCard
                          key={paper.id}
                          title={paper.title}
                          courseCode={paper.courseCode}
                          university={paper.university}
                          universityShort={paper.universityShort}
                          faculty={paper.faculty}
                          year={paper.year}
                          semester={paper.semester}
                          downloads={paper.downloads}
                          views={paper.views}
                          fileSize={paper.fileSize}
                          verified={paper.verified}
                          examType={paper.examType}
                          universityLogo={universityLogos[paper.universityShort]}
                          hideUniversityBadge={true}
                          onPreview={() => handlePreview(paper)}
                          onDownload={() => handleDownload(paper)}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
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
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-[hsl(220_20%_40%)] ml-2">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="past-questions-list-view">
                      {paginatedPapers.map((paper) => (
                        <ExamPaperListItem
                          key={paper.id}
                          title={paper.title}
                          courseCode={paper.courseCode}
                          universityShort={paper.universityShort}
                          faculty={paper.faculty}
                          year={paper.year}
                          semester={paper.semester}
                          downloads={paper.downloads}
                          views={paper.views}
                          fileSize={paper.fileSize}
                          verified={paper.verified}
                          universityLogo={universityLogos[paper.universityShort]}
                          onPreview={() => handlePreview(paper)}
                          onDownload={() => handleDownload(paper)}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
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
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-[hsl(220_20%_40%)] ml-2">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="past-questions-empty-state" style={{ gridColumn: '1 / -1' }}>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-white" style={{ border: '1px solid hsl(40 20% 88%)' }}>
                  <FileText className="w-12 h-12" style={{ color: 'hsl(220 20% 40%)' }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'hsl(220 30% 15%)' }}>
                  No papers found
                </h3>
                <p className="text-lg mb-6" style={{ color: 'hsl(220 20% 40%)' }}>
                  Try adjusting your filters or search query
                </p>
                <Button 
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>

        <PartneringUniversities />

        <Footer />

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
      </div>
    </>
  );
};

export default PastQuestions;
