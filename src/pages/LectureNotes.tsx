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
  BookOpen,
  Calendar,
  File,
  User,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LectureNote {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  year: number;
  semester: "1st" | "2nd";
  university: string;
  universityShort: string;
  lecturer: string;
  downloads: number;
  views: number;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
  pages: number;
  imageUrl?: string;
}

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

const LectureNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isFilterSidebarCollapsed, setIsFilterSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock lecture notes data with images
  const lectureNotes: LectureNote[] = [
    { 
      id: "1", 
      title: "Introduction to Computer Science", 
      courseCode: "CS 101",
      courseName: "Introduction to Computer Science",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      lecturer: "Dr. Kwame Mensah",
      downloads: 3420, 
      views: 6890,
      fileSize: "12.5 MB", 
      uploadDate: "2024-02-15",
      verified: true,
      pages: 45,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "2", 
      title: "Organic Chemistry Fundamentals", 
      courseCode: "CHEM 201",
      courseName: "Organic Chemistry Fundamentals",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "1st",
      university: "Kwame Nkrumah University of Science and Technology", 
      universityShort: "KNUST",
      lecturer: "Prof. Ama Asante",
      downloads: 2890, 
      views: 5420,
      fileSize: "8.3 MB", 
      uploadDate: "2024-02-10",
      verified: true,
      pages: 32,
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "3", 
      title: "Business Ethics and Corporate Governance", 
      courseCode: "BUS 301",
      courseName: "Business Ethics and Corporate Governance",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "University of Cape Coast", 
      universityShort: "UCC",
      lecturer: "Dr. Kofi Adjei",
      downloads: 2150, 
      views: 4230,
      fileSize: "6.7 MB", 
      uploadDate: "2024-01-22",
      verified: true,
      pages: 28,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "4", 
      title: "Advanced Calculus", 
      courseCode: "MATH 401",
      courseName: "Advanced Calculus",
      faculty: "Engineering", 
      year: 2023, 
      semester: "2nd",
      university: "University of Mines and Technology", 
      universityShort: "UMaT",
      lecturer: "Prof. Yaw Boateng",
      downloads: 3670, 
      views: 7120,
      fileSize: "15.2 MB", 
      uploadDate: "2023-12-18",
      verified: true,
      pages: 58,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "5", 
      title: "Constitutional Law Principles", 
      courseCode: "LAW 201",
      courseName: "Constitutional Law Principles",
      faculty: "Law", 
      year: 2024, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      lecturer: "Dr. Efua Ofori",
      downloads: 1890, 
      views: 3650,
      fileSize: "9.1 MB", 
      uploadDate: "2024-02-05",
      verified: true,
      pages: 38,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "6", 
      title: "Database Management Systems", 
      courseCode: "CS 302",
      courseName: "Database Management Systems",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      lecturer: "Dr. Samuel Tetteh",
      downloads: 4120, 
      views: 8250,
      fileSize: "11.8 MB", 
      uploadDate: "2024-02-20",
      verified: true,
      pages: 42,
      imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80"
    },
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get unique values for filters
  const universities = useMemo(() => 
    Array.from(new Set(lectureNotes.map(n => n.universityShort))).sort(),
    []
  );
  const courses = useMemo(() => 
    Array.from(new Set(lectureNotes.map(n => n.faculty))).sort(),
    []
  );
  const semesters = ["1st", "2nd"];

  // Filtering logic
  const filteredNotes = useMemo(() => {
    return lectureNotes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        note.courseCode.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        note.courseName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        note.university.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        note.lecturer.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      const matchesUniversity = !selectedUniversity || note.universityShort === selectedUniversity;
      const matchesCourse = !selectedCourse || note.faculty === selectedCourse;
      const matchesSemester = !selectedSemester || note.semester === selectedSemester;
      
      return matchesSearch && matchesUniversity && matchesCourse && matchesSemester;
    });
  }, [debouncedSearchQuery, selectedUniversity, selectedCourse, selectedSemester]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedUniversity(null);
    setSelectedCourse(null);
    setSelectedSemester(null);
  }, []);

  const hasActiveFilters = selectedUniversity || selectedCourse || selectedSemester;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      }
    },
  };

  const isolatedStyles = `
    .lecture-notes-page {
      min-height: 100vh;
      background: white;
    }

    .lecture-notes-content-wrapper {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: flex-start;
      width: 100%;
    }

    .lecture-notes-main-content {
      flex: 1;
      padding: 2rem;
      min-width: 0;
    }

    .lecture-notes-header {
      margin-bottom: 2rem;
    }

    .lecture-notes-title {
      font-size: 2rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.2;
    }

    .lecture-notes-subtitle {
      font-size: 16px;
      color: hsl(220 20% 40%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .lecture-notes-search-filter-wrapper {
      margin-bottom: 1.5rem;
    }

    .lecture-notes-search-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .lecture-notes-search-input-container {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .lecture-notes-results-count {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .lecture-notes-results-count-mobile {
      display: none;
    }

    .lecture-notes-filter-btn-mobile {
      display: flex;
    }

    .lecture-notes-search-view-toggle-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .lecture-notes-view-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .lecture-notes-view-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid hsl(40 20% 88%);
      background: white;
      color: hsl(220 20% 40%);
      cursor: pointer;
      transition: all 0.2s;
    }

    .lecture-notes-view-button.active {
      background: #f3f4f6;
      color: #1f2937;
      border-color: #d1d5db;
    }

    .lecture-notes-view-button:hover {
      background: #f9fafb;
    }

    .lecture-notes-list-view {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 2rem;
    }

    .lecture-notes-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: white;
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      transition: all 0.2s;
    }

    .lecture-notes-list-item:hover {
      border-color: #60a5fa;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .lecture-notes-list-item-title {
      font-size: 1rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      flex: 1;
    }

    .lecture-notes-list-item-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .lecture-notes-active-filters {
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

    .lecture-notes-active-filters-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .lecture-notes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    @media (min-width: 640px) {
      .lecture-notes-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .lecture-notes-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
    }

    @media (min-width: 1280px) {
      .lecture-notes-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
    }

    .lecture-notes-empty-state {
      text-align: center;
      padding: 3rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    /* Filter Sidebar Styles */
    .lecture-notes-filter-overlay {
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

    .lecture-notes-filter-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .lecture-notes-filter-sidebar {
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

    .lecture-notes-filter-sidebar.collapsed {
      width: 60px;
    }

    .lecture-notes-filter-sidebar.collapsed .lecture-notes-filter-sidebar-content,
    .lecture-notes-filter-sidebar.collapsed .lecture-notes-filter-actions {
      opacity: 0;
      pointer-events: none;
    }

    .lecture-notes-filter-sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .lecture-notes-filter-sidebar.collapsed .lecture-notes-filter-sidebar-header h3 span {
      display: none;
    }

    .lecture-notes-filter-sidebar.collapsed .lecture-notes-filter-sidebar-header {
      justify-content: center;
      padding: 1.5rem 0.75rem;
    }

    .lecture-notes-filter-sidebar.collapsed .lecture-notes-filter-sidebar-header h3 {
      justify-content: center;
      margin: 0;
    }

    @media (max-width: 1023px) {
      .lecture-notes-filter-sidebar {
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

      .lecture-notes-filter-sidebar.open {
        transform: translateX(0);
      }

      .lecture-notes-main-content {
        margin-left: 0 !important;
        width: 100%;
      }

      .lecture-notes-content-wrapper {
        flex-direction: column;
      }
    }

    .lecture-notes-filter-sidebar-header {
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

    .lecture-notes-filter-sidebar-header * {
      color: white !important;
    }

    .lecture-notes-filter-sidebar-header h3 {
      color: white !important;
    }

    .lecture-notes-filter-sidebar-header h3 span {
      color: white !important;
    }

    .lecture-notes-filter-sidebar-header svg {
      color: white !important;
    }

    .lecture-notes-filter-sidebar-close {
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

    .lecture-notes-filter-sidebar-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .lecture-notes-filter-collapse-btn {
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

    .lecture-notes-filter-collapse-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .lecture-notes-filter-sidebar.collapsed .lecture-notes-filter-collapse-btn {
      margin: 0;
    }

    .lecture-notes-filter-mobile-close {
      display: none;
    }

    .lecture-notes-filter-section {
      margin-bottom: 2rem;
    }

    .lecture-notes-filter-section:last-child {
      margin-bottom: 0;
    }

    .lecture-notes-filter-section-title {
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

    .lecture-notes-filter-section-title::before {
      content: '';
      width: 3px;
      height: 1rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
    }

    .lecture-notes-filter-group {
      margin-bottom: 1.5rem;
    }

    .lecture-notes-filter-group:last-child {
      margin-bottom: 0;
    }

    .lecture-notes-filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      margin-bottom: 0.75rem;
      display: block;
    }

    .lecture-notes-filter-actions {
      padding: 1.5rem;
      border-top: 1px solid hsl(40 20% 88%);
      background: hsl(40 33% 96%);
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }

    .lecture-notes-filter-btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .lecture-notes-filter-btn-primary {
      background: #3b82f6;
      color: white;
    }

    .lecture-notes-filter-btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .lecture-notes-filter-btn-secondary {
      background: white;
      color: hsl(220 30% 15%);
      border: 1px solid hsl(40 20% 88%);
    }

    .lecture-notes-filter-btn-secondary:hover {
      background: hsl(40 20% 95%);
    }

    @media (min-width: 1024px) {
      .lecture-notes-filter-overlay {
        display: none;
      }

      .lecture-notes-content-area {
        flex: 1;
        min-width: 0;
      }

      .lecture-notes-main-content {
        margin-left: 0;
      }

      .lecture-notes-filter-sidebar.collapsed ~ .lecture-notes-main-content {
        margin-left: 0;
      }
    }

    @media (min-width: 1024px) {
      .lecture-notes-filter-btn-mobile {
        display: none !important;
      }

      .lecture-notes-results-count-mobile {
        display: none !important;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .lecture-notes-content-wrapper {
        padding-top: 60px;
        flex-direction: column;
      }

      .lecture-notes-main-content {
        padding: 1rem;
        width: 100%;
      }

      .lecture-notes-header {
        margin-bottom: 1.5rem;
      }

      .lecture-notes-title {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }

      .lecture-notes-subtitle {
        font-size: 14px;
        margin-bottom: 1.25rem;
        line-height: 1.5;
      }

      .lecture-notes-search-filter-wrapper {
        margin-bottom: 1rem;
      }

      .lecture-notes-search-wrapper {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }

      .lecture-notes-search-input-container {
        width: 100%;
        max-width: 100%;
      }

      .lecture-notes-search-view-toggle-wrapper {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }

      .lecture-notes-view-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .lecture-notes-results-count {
        display: none;
      }

      .lecture-notes-results-count-mobile {
        display: block;
        font-size: 0.8125rem;
        color: hsl(220 20% 40%);
        white-space: nowrap;
        font-weight: 500;
      }

      .lecture-notes-results-count-mobile span {
        font-weight: 700;
        color: hsl(220 30% 15%);
      }

      .lecture-notes-filter-sidebar {
        width: 100%;
        max-width: 320px;
      }

      .lecture-notes-grid {
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .lecture-notes-list-view {
        margin-top: 1.5rem;
        gap: 0.5rem;
      }

      .lecture-notes-list-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
      }

      .lecture-notes-list-item-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .lecture-notes-active-filters {
        padding: 0.75rem;
        margin-top: 1rem;
        gap: 0.5rem;
      }

      .lecture-notes-filter-sidebar-header {
        padding: 1rem;
        min-height: 60px;
      }

      .lecture-notes-filter-sidebar-content {
        padding: 1rem;
      }

      .lecture-notes-filter-actions {
        padding: 1rem;
        flex-direction: column;
      }

      .lecture-notes-filter-btn {
        width: 100%;
      }

      .lecture-notes-filter-collapse-btn {
        display: none;
      }

      .lecture-notes-filter-mobile-close {
        display: flex;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .lecture-notes-content-wrapper {
        padding-top: 70px;
      }

      .lecture-notes-main-content {
        padding: 1.5rem;
      }

      .lecture-notes-header {
        margin-bottom: 2rem;
      }

      .lecture-notes-title {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }

      .lecture-notes-subtitle {
        font-size: 17px;
        margin-bottom: 1.75rem;
      }

      .lecture-notes-search-filter-wrapper {
        margin-bottom: 1.75rem;
      }

      .lecture-notes-search-wrapper {
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .lecture-notes-filter-sidebar {
        width: 280px;
      }

      .lecture-notes-grid {
        gap: 1.25rem;
        margin-top: 2rem;
      }

      .lecture-notes-filter-sidebar-header {
        padding: 1.25rem;
      }

      .lecture-notes-filter-sidebar-content {
        padding: 1.25rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .lecture-notes-content-wrapper {
        padding-top: 120px;
      }

      .lecture-notes-main-content {
        padding: 2rem;
      }

      .lecture-notes-header {
        margin-bottom: 2.5rem;
      }

      .lecture-notes-title {
        font-size: 2.75rem;
        margin-bottom: 0.875rem;
      }

      .lecture-notes-subtitle {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .lecture-notes-search-filter-wrapper {
        margin-bottom: 2rem;
      }

      .lecture-notes-filter-sidebar {
        width: 300px;
      }

      .lecture-notes-grid {
        gap: 1.5rem;
        margin-top: 2.5rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .lecture-notes-content-wrapper {
        padding-top: 120px;
      }

      .lecture-notes-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }

      .lecture-notes-header {
        margin-bottom: 3rem;
      }

      .lecture-notes-title {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .lecture-notes-subtitle {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .lecture-notes-search-filter-wrapper {
        margin-bottom: 2rem;
      }

      .lecture-notes-filter-sidebar {
        width: 320px;
      }

      .lecture-notes-grid {
        gap: 1.5rem;
        margin-top: 3rem;
      }
    }
  `;

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      <div className="lecture-notes-page">
        <style>{isolatedStyles}</style>
        
        <div className="lecture-notes-content-wrapper">
          {/* Filter Overlay */}
          <div 
            className={`lecture-notes-filter-overlay ${isFilterSidebarOpen ? 'active' : ''}`}
            onClick={() => setIsFilterSidebarOpen(false)}
          />

          {/* Filter Sidebar */}
          <div className={`lecture-notes-filter-sidebar ${isFilterSidebarOpen ? 'open' : ''} ${isFilterSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="lecture-notes-filter-sidebar-header">
              <h3>
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="lecture-notes-filter-collapse-btn"
                  onClick={() => setIsFilterSidebarCollapsed(!isFilterSidebarCollapsed)}
                  type="button"
                  title={isFilterSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isFilterSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                  className="lecture-notes-filter-sidebar-close lecture-notes-filter-mobile-close"
                  onClick={() => setIsFilterSidebarOpen(false)}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="lecture-notes-filter-sidebar-content">
              <div className="lecture-notes-filter-section">
                <div className="lecture-notes-filter-section-title">Filter Options</div>
                
                <div className="lecture-notes-filter-group">
                  <label className="lecture-notes-filter-label">University</label>
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

                <div className="lecture-notes-filter-group">
                  <label className="lecture-notes-filter-label">Course</label>
                  <Select
                    value={selectedCourse ?? ""}
                    onValueChange={(value) => setSelectedCourse(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lecture-notes-filter-group">
                  <label className="lecture-notes-filter-label">Semester</label>
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

            <div className="lecture-notes-filter-actions">
              <button
                className="lecture-notes-filter-btn lecture-notes-filter-btn-secondary"
                onClick={clearAllFilters}
                type="button"
              >
                Clear All
              </button>
              <button
                className="lecture-notes-filter-btn lecture-notes-filter-btn-primary"
                onClick={() => setIsFilterSidebarOpen(false)}
                type="button"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <div className="lecture-notes-main-content">
            <div className="lecture-notes-content-area">
              <div className="lecture-notes-header">
                <h1 className="lecture-notes-title">Lecture Notes Repository</h1>
                <p className="lecture-notes-subtitle">
                  Access comprehensive lecture materials from Ghana's leading universities. 
                  Enhance your learning with quality notes.
                </p>
                
                {/* Search Bar */}
                <div className="lecture-notes-search-filter-wrapper">
                  <div className="lecture-notes-search-wrapper">
                    <div className="lecture-notes-search-input-container">
                      <motion.div
                        layoutId="search-input-container-lecture"
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
                          <motion.div layoutId="search-icon-lecture">
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
                                    layoutId={`placeholder-search-lecture`}
                                    key={`placeholder-search-lecture`}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                    className="text-base"
                                  >
                                    Search notes...
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
                            className="h-8 px-3 md:px-4 rounded-xl border-slate-200 hover:bg-slate-50 relative lecture-notes-filter-btn-mobile flex-shrink-0"
                            onClick={() => setIsFilterSidebarOpen(true)}
                          >
                            <Filter className="w-4 h-4 md:mr-1.5" />
                            <span className="hidden md:inline text-sm">Filters</span>
                            {hasActiveFilters && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                {[selectedUniversity, selectedCourse, selectedSemester].filter(Boolean).length}
                              </span>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                    <div className="lecture-notes-search-view-toggle-wrapper">
                      <div className="lecture-notes-results-count">
                        <span className="font-semibold text-[hsl(220_30%_15%)]">{filteredNotes.length}</span>{" "}
                        {filteredNotes.length === 1 ? "note" : "notes"} found
                      </div>
                      <div className="lecture-notes-view-toggle">
                        <span className="lecture-notes-results-count-mobile">
                          <span>{filteredNotes.length}</span> {filteredNotes.length === 1 ? "note" : "notes"}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            className={`lecture-notes-view-button ${viewMode === "grid" ? "active" : ""}`}
                            onClick={() => setViewMode("grid")}
                            title="Grid View"
                            type="button"
                          >
                            <Grid3x3 size={18} />
                          </button>
                          <button
                            className={`lecture-notes-view-button ${viewMode === "list" ? "active" : ""}`}
                            onClick={() => setViewMode("list")}
                            title="List View"
                            type="button"
                          >
                            <List size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {hasActiveFilters && (
                    <div className="lecture-notes-active-filters">
                      <span className="lecture-notes-active-filters-label">Active Filters:</span>
                      
                      {selectedUniversity && (
                        <Badge className="px-3 py-1.5 flex items-center gap-2 bg-blue-600 text-white">
                          {selectedUniversity}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => setSelectedUniversity(null)}
                          />
                        </Badge>
                      )}
                      
                      {selectedCourse && (
                        <Badge className="px-3 py-1.5 flex items-center gap-2 bg-purple-600 text-white">
                          {selectedCourse}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => setSelectedCourse(null)}
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

              {/* Notes Grid/List */}
              {filteredNotes.length === 0 ? (
                <div className="lecture-notes-empty-state" style={{ gridColumn: '1 / -1' }}>
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-white" style={{ border: '1px solid hsl(40 20% 88%)' }}>
                    <FileText className="w-12 h-12" style={{ color: 'hsl(220 20% 40%)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'hsl(220 30% 15%)' }}>
                    No notes found
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
              ) : viewMode === "list" ? (
                <div className="lecture-notes-list-view">
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="lecture-notes-list-item"
                    >
                      <div className="lecture-notes-list-item-title">
                        {note.courseName || note.title}
                      </div>
                      <div className="lecture-notes-list-item-actions">
                        <button
                          type="button"
                          onClick={() => console.log('Preview:', note.id)}
                          className="group relative inline-block text-sm font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
                        >
                          <motion.span
                            className="relative inline-block pb-1 flex items-center gap-1.5"
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Eye className="w-4 h-4" />
                            View
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
                          onClick={() => console.log('Download:', note.id)}
                          className="group relative inline-block text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700"
                        >
                          <motion.span
                            className="relative inline-block pb-1 flex items-center gap-1.5"
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Download className="w-4 h-4" />
                            Download
                            <span
                              className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                              style={{
                                width: 'calc(100% + 14px)',
                                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                              }}
                            />
                          </motion.span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="lecture-notes-grid"
                >
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      variants={cardVariants}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group"
                    >
                      <div className="relative h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                        {/* Image Section with Overlay */}
                        <div className="relative h-48 overflow-hidden">
                          <motion.img
                            src={note.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"}
                            alt={note.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent"></div>
                          
                          {/* University Logo and Name - Top Right */}
                          {universityLogos[note.universityShort] && (
                            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                              <div className="w-10 h-10 rounded-lg bg-slate-100/95 backdrop-blur-sm p-1.5 shadow-lg flex items-center justify-center border border-white/20">
                                <img 
                                  src={universityLogos[note.universityShort]} 
                                  alt={note.universityShort}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="text-xs font-semibold text-white/95 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                {note.universityShort}
                              </span>
                            </div>
                          )}
                          
                          {/* Top Section - Course Code */}
                          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                            <Badge className="px-2.5 py-1 text-xs font-bold bg-sky-100 text-slate-800 border-0 hover:bg-sky-100 hover:text-slate-800">
                              {note.courseCode}
                            </Badge>
                            {note.verified && (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          
                          {/* Title - Bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-base font-bold text-white line-clamp-2 leading-tight">
                              {note.title}
                            </h3>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 flex flex-col flex-1" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>
                          <div className="space-y-1.5 mb-3 flex-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <User className="w-3.5 h-3.5" />
                              <span className="truncate">{note.lecturer}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{note.semester} Sem, {note.year} • {note.pages} pages</span>
                            </div>
                          </div>

                          {/* Stats and Actions */}
                          <div className="pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2.5 text-xs text-slate-500 font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {formatNumber(note.downloads)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {formatNumber(note.views)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm"
                                className="h-8 text-xs font-medium bg-slate-700 hover:bg-slate-800 text-white"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LectureNotes;
