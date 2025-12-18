import { useState, useMemo, useCallback, useEffect } from "react";
import { EducationPageLayout } from "@/components/education/EducationLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter,
  X,
  Building2,
  Grid3x3,
  List,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import { ExamPaperCard } from "@/components/ui/card-7";
import { ExamPaperListItem } from "@/components/ui/exam-paper-list-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BecePaper {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  year: number;
  examType: "BECE" | "SHS";
  downloads: number;
  views: number;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
}

const ShsBeceQuestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isFilterSidebarCollapsed, setIsFilterSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "grouped">("grouped");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const itemsPerPage = 24;

  // Mock BECE/SHS exam papers data
  const examPapers: BecePaper[] = [
    { 
      id: "1", 
      title: "Core Mathematics - Paper 2", 
      subject: "Core Mathematics",
      subjectCode: "MATH",
      year: 2023, 
      examType: "BECE",
      downloads: 2840, 
      views: 5620,
      fileSize: "3.2 MB", 
      uploadDate: "2024-01-15",
      verified: true
    },
    { 
      id: "2", 
      title: "Integrated Science - Paper 1", 
      subject: "Integrated Science",
      subjectCode: "SCI",
      year: 2023, 
      examType: "BECE",
      downloads: 3150, 
      views: 6890,
      fileSize: "4.1 MB", 
      uploadDate: "2024-02-08",
      verified: true
    },
    { 
      id: "3", 
      title: "English Language - Paper 2", 
      subject: "English Language",
      subjectCode: "ENG",
      year: 2023, 
      examType: "BECE",
      downloads: 1980, 
      views: 4230,
      fileSize: "2.8 MB", 
      uploadDate: "2024-01-22",
      verified: true
    },
    { 
      id: "4", 
      title: "Social Studies - Paper 1", 
      subject: "Social Studies",
      subjectCode: "SOC",
      year: 2023, 
      examType: "BECE",
      downloads: 2560, 
      views: 5100,
      fileSize: "5.3 MB", 
      uploadDate: "2023-12-18",
      verified: true
    },
    { 
      id: "5", 
      title: "Core Mathematics - SHS 1", 
      subject: "Core Mathematics",
      subjectCode: "MATH",
      year: 2023, 
      examType: "SHS",
      downloads: 1670, 
      views: 3450,
      fileSize: "2.1 MB", 
      uploadDate: "2024-01-30",
      verified: true
    },
    { 
      id: "6", 
      title: "Physics - SHS 2", 
      subject: "Physics",
      subjectCode: "PHY",
      year: 2023, 
      examType: "SHS",
      downloads: 3890, 
      views: 7250,
      fileSize: "3.7 MB", 
      uploadDate: "2023-11-25",
      verified: true
    },
    { 
      id: "7", 
      title: "Chemistry - SHS 3", 
      subject: "Chemistry",
      subjectCode: "CHEM",
      year: 2023, 
      examType: "SHS",
      downloads: 2450, 
      views: 4800,
      fileSize: "4.2 MB", 
      uploadDate: "2024-02-10",
      verified: true
    },
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get unique values for filters
  const subjects = useMemo(() => 
    Array.from(new Set(examPapers.map(p => p.subject))).sort(),
    []
  );
  const years = useMemo(() => 
    Array.from(new Set(examPapers.map(p => p.year))).sort((a, b) => b - a),
    []
  );
  const examTypes = ["BECE", "SHS"];

  // Memoized filtering logic
  const filteredPapers = useMemo(() => {
    return examPapers.filter(paper => {
      const matchesSearch = 
        paper.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        paper.subjectCode.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      const matchesSubject = !selectedSubject || paper.subject === selectedSubject;
      const matchesYear = !selectedYear || paper.year === selectedYear;
      const matchesExamType = !selectedExamType || paper.examType === selectedExamType;
      
      return matchesSearch && matchesSubject && matchesYear && matchesExamType;
    });
  }, [debouncedSearchQuery, selectedSubject, selectedYear, selectedExamType]);

  // Group papers by subject
  const groupedPapers = useMemo(() => {
    const groups: Record<string, BecePaper[]> = {};
    filteredPapers.forEach(paper => {
      if (!groups[paper.subject]) {
        groups[paper.subject] = [];
      }
      groups[paper.subject].push(paper);
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

  // Toggle subject expansion
  const toggleSubject = useCallback((subject: string) => {
    setExpandedSubjects(prev => {
      const newState = {
        ...prev,
        [subject]: prev[subject] === undefined ? false : !prev[subject]
      };
      return newState;
    });
  }, []);

  // Expand all / Collapse all
  const toggleAllSubjects = useCallback(() => {
    const allSubjects = Object.keys(groupedPapers);
    const allExpanded = allSubjects.every(subj => expandedSubjects[subj] === true);
    
    if (allExpanded) {
      const newState: Record<string, boolean> = {};
      allSubjects.forEach(subj => {
        newState[subj] = false;
      });
      setExpandedSubjects(newState);
    } else {
      const newState: Record<string, boolean> = {};
      allSubjects.forEach(subj => {
        newState[subj] = true;
      });
      setExpandedSubjects(newState);
    }
  }, [expandedSubjects, groupedPapers]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedSubject(null);
    setSelectedYear(null);
    setSelectedExamType(null);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = selectedSubject || selectedYear || selectedExamType;

  const isolatedStyles = `
    .bece-questions-page {
      min-height: 100vh;
      background: white;
    }

    .bece-questions-content-wrapper {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: flex-start;
      width: 100%;
    }

    .bece-questions-main-content {
      flex: 1;
      padding: 2rem;
      min-width: 0;
    }

    .bece-questions-header {
      margin-bottom: 2rem;
    }

    .bece-questions-title {
      font-size: 2rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.2;
    }

    .bece-questions-subtitle {
      font-size: 16px;
      color: hsl(220 20% 40%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .bece-questions-search-filter-wrapper {
      margin-bottom: 1.5rem;
    }

    .bece-questions-search-view-toggle-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
      width: 100%;
    }

    .bece-questions-search-wrapper {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .bece-questions-search-input-container {
      flex: 1;
      min-width: 200px;
      position: relative;
      max-width: 400px;
    }

    .bece-questions-results-count {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .bece-questions-results-count-mobile {
      display: none;
    }

    .bece-questions-filter-btn-mobile {
      display: flex;
    }

    .bece-questions-active-filters {
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

    .bece-questions-active-filters-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bece-questions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    @media (min-width: 640px) {
      .bece-questions-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .bece-questions-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
    }

    @media (min-width: 1280px) {
      .bece-questions-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
    }

    .bece-questions-empty-state {
      text-align: center;
      padding: 3rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bece-questions-list-view {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 2rem;
    }

    .bece-questions-grouped-view {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .bece-questions-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      overflow: hidden;
      background: white;
    }

    .bece-questions-view-button {
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

    .bece-questions-view-button.active {
      background: #f3f4f6;
      color: #1f2937;
    }

    .bece-questions-view-button:hover {
      background: #f9fafb;
    }

    /* Filter Sidebar Styles */
    .bece-questions-filter-overlay {
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

    .bece-questions-filter-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .bece-questions-filter-sidebar {
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

    .bece-questions-filter-sidebar.collapsed {
      width: 60px;
    }

    .bece-questions-filter-sidebar.collapsed .bece-questions-filter-sidebar-content,
    .bece-questions-filter-sidebar.collapsed .bece-questions-filter-actions {
      opacity: 0;
      pointer-events: none;
    }

    .bece-questions-filter-sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .bece-questions-filter-sidebar.collapsed .bece-questions-filter-sidebar-header h3 span {
      display: none;
    }

    .bece-questions-filter-sidebar.collapsed .bece-questions-filter-sidebar-header {
      justify-content: center;
      padding: 1.5rem 0.75rem;
    }

    .bece-questions-filter-sidebar.collapsed .bece-questions-filter-sidebar-header h3 {
      justify-content: center;
      margin: 0;
    }

    @media (max-width: 1023px) {
      .bece-questions-filter-sidebar {
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

      .bece-questions-filter-sidebar.open {
        transform: translateX(0);
      }

      .bece-questions-main-content {
        margin-left: 0 !important;
        width: 100%;
      }

      .bece-questions-content-wrapper {
        flex-direction: column;
      }
    }

    .bece-questions-filter-sidebar-header {
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

    .bece-questions-filter-sidebar-header * {
      color: white !important;
    }

    .bece-questions-filter-sidebar-header h3 {
      color: white !important;
    }

    .bece-questions-filter-sidebar-header h3 span {
      color: white !important;
    }

    .bece-questions-filter-sidebar-header svg {
      color: white !important;
    }

    .bece-questions-filter-sidebar-close {
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

    .bece-questions-filter-sidebar-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .bece-questions-filter-collapse-btn {
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

    .bece-questions-filter-collapse-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .bece-questions-filter-sidebar.collapsed .bece-questions-filter-collapse-btn {
      margin: 0;
    }

    .bece-questions-filter-mobile-close {
      display: none;
    }

    .bece-questions-filter-section {
      margin-bottom: 2rem;
    }

    .bece-questions-filter-section:last-child {
      margin-bottom: 0;
    }

    .bece-questions-filter-section-title {
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

    .bece-questions-filter-section-title::before {
      content: '';
      width: 3px;
      height: 1rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
    }

    .bece-questions-filter-group {
      margin-bottom: 1.5rem;
    }

    .bece-questions-filter-group:last-child {
      margin-bottom: 0;
    }

    .bece-questions-filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 20% 40%);
      margin-bottom: 0.75rem;
      display: block;
    }

    .bece-questions-filter-actions {
      padding: 1.5rem;
      border-top: 1px solid hsl(40 20% 88%);
      background: hsl(40 33% 96%);
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }

    .bece-questions-filter-btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .bece-questions-filter-btn-primary {
      background: #3b82f6;
      color: white;
    }

    .bece-questions-filter-btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .bece-questions-filter-btn-secondary {
      background: white;
      color: hsl(220 30% 15%);
      border: 1px solid hsl(40 20% 88%);
    }

    .bece-questions-filter-btn-secondary:hover {
      background: hsl(40 20% 95%);
    }

    .bece-questions-university-content {
      overflow: hidden;
      transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
    }

    .bece-questions-university-content.collapsed {
      max-height: 0;
      opacity: 0;
    }

    .bece-questions-university-content.expanded {
      max-height: 5000px;
      opacity: 1;
    }

    @media (min-width: 1024px) {
      .bece-questions-filter-overlay {
        display: none;
      }

      .bece-questions-content-area {
        flex: 1;
        min-width: 0;
      }

      .bece-questions-main-content {
        margin-left: 0;
      }

      .bece-questions-filter-sidebar.collapsed ~ .bece-questions-main-content {
        margin-left: 0;
      }
    }

    @media (min-width: 1024px) {
      .bece-questions-filter-btn-mobile {
        display: none !important;
      }

      .bece-questions-results-count-mobile {
        display: none !important;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .bece-questions-content-wrapper {
        padding-top: 60px;
        flex-direction: column;
      }

      .bece-questions-main-content {
        padding: 1rem;
        width: 100%;
      }

      .bece-questions-header {
        margin-bottom: 1.5rem;
      }

      .bece-questions-title {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }

      .bece-questions-subtitle {
        font-size: 14px;
        margin-bottom: 1.25rem;
        line-height: 1.5;
      }

      .bece-questions-search-filter-wrapper {
        margin-bottom: 1rem;
      }

      .bece-questions-search-view-toggle-wrapper {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }

      .bece-questions-search-wrapper {
        width: 100%;
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }

      .bece-questions-search-input-container {
        width: 100%;
        min-width: 0;
      }

      .bece-questions-results-count {
        display: none;
      }

      .bece-questions-view-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .bece-questions-results-count-mobile {
        display: block;
        font-size: 0.8125rem;
        color: hsl(220 20% 40%);
        white-space: nowrap;
        font-weight: 500;
      }

      .bece-questions-results-count-mobile span {
        font-weight: 700;
        color: hsl(220 30% 15%);
      }

      .bece-questions-filter-sidebar {
        width: 100%;
        max-width: 320px;
      }

      .bece-questions-grid {
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .bece-questions-list-view {
        margin-top: 1.5rem;
        gap: 0.5rem;
      }

      .bece-questions-active-filters {
        padding: 0.75rem;
        margin-top: 1rem;
        gap: 0.5rem;
      }

      .bece-questions-filter-sidebar-header {
        padding: 1rem;
        min-height: 60px;
      }

      .bece-questions-filter-sidebar-content {
        padding: 1rem;
      }

      .bece-questions-filter-actions {
        padding: 1rem;
        flex-direction: column;
      }

      .bece-questions-filter-btn {
        width: 100%;
      }

      .bece-questions-filter-collapse-btn {
        display: none;
      }

      .bece-questions-filter-mobile-close {
        display: flex;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .bece-questions-content-wrapper {
        padding-top: 70px;
      }

      .bece-questions-main-content {
        padding: 1.5rem;
      }

      .bece-questions-header {
        margin-bottom: 2rem;
      }

      .bece-questions-title {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }

      .bece-questions-subtitle {
        font-size: 17px;
        margin-bottom: 1.75rem;
      }

      .bece-questions-search-filter-wrapper {
        margin-bottom: 1.75rem;
      }

      .bece-questions-search-view-toggle-wrapper {
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .bece-questions-search-wrapper {
        flex: 1 1 auto;
        min-width: 300px;
      }

      .bece-questions-search-input-container {
        flex: 1;
        min-width: 250px;
      }

      .bece-questions-results-count {
        font-size: 0.875rem;
      }

      .bece-questions-filter-sidebar {
        width: 280px;
      }

      .bece-questions-grid {
        gap: 1.25rem;
        margin-top: 2rem;
      }

      .bece-questions-filter-sidebar-header {
        padding: 1.25rem;
      }

      .bece-questions-filter-sidebar-content {
        padding: 1.25rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .bece-questions-content-wrapper {
        padding-top: 120px;
      }

      .bece-questions-main-content {
        padding: 2rem;
      }

      .bece-questions-header {
        margin-bottom: 2.5rem;
      }

      .bece-questions-title {
        font-size: 2.75rem;
        margin-bottom: 0.875rem;
      }

      .bece-questions-subtitle {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .bece-questions-search-filter-wrapper {
        margin-bottom: 2rem;
      }

      .bece-questions-filter-sidebar {
        width: 300px;
      }

      .bece-questions-grid {
        gap: 1.5rem;
        margin-top: 2.5rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .bece-questions-content-wrapper {
        padding-top: 120px;
      }

      .bece-questions-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }

      .bece-questions-header {
        margin-bottom: 3rem;
      }

      .bece-questions-title {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .bece-questions-subtitle {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .bece-questions-search-filter-wrapper {
        margin-bottom: 2rem;
      }

      .bece-questions-filter-sidebar {
        width: 320px;
      }

      .bece-questions-grid {
        gap: 1.5rem;
        margin-top: 3rem;
      }
    }
  `;

  return (
    <EducationPageLayout
      title="SHS & BECE Past Questions"
      description="Trusted exam banks curated with WAEC examiners, model answers, and structured revision plans that mirror elite prep schools in Ghana."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Education Hub" },
        { label: "SHS & BECE Past Questions" },
      ]}
      heroTheme="amber"
      heroImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80"
      heroStats={[
        { label: "Exam Sets", value: "520+" },
        { label: "Subjects Covered", value: "18" },
        { label: "Verified Solutions", value: "1,940" },
        { label: "Avg. Monthly Downloads", value: "32K" },
      ]}
    >
      <div className="bece-questions-page">
        <style>{isolatedStyles}</style>
        
        <div className="bece-questions-content-wrapper">
          {/* Filter Overlay */}
          <div 
            className={`bece-questions-filter-overlay ${isFilterSidebarOpen ? 'active' : ''}`}
            onClick={() => setIsFilterSidebarOpen(false)}
          />

          {/* Filter Sidebar */}
          <div className={`bece-questions-filter-sidebar ${isFilterSidebarOpen ? 'open' : ''} ${isFilterSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="bece-questions-filter-sidebar-header">
              <h3></h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="bece-questions-filter-collapse-btn"
                  onClick={() => setIsFilterSidebarCollapsed(!isFilterSidebarCollapsed)}
                  type="button"
                  title={isFilterSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isFilterSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                  className="bece-questions-filter-sidebar-close bece-questions-filter-mobile-close"
                  onClick={() => setIsFilterSidebarOpen(false)}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bece-questions-filter-sidebar-content">
              <div className="bece-questions-filter-section">
                <div className="bece-questions-filter-section-title">Filter Options</div>
                
                <div className="bece-questions-filter-group">
                  <label className="bece-questions-filter-label">Subject</label>
                  <Select
                    value={selectedSubject ?? ""}
                    onValueChange={(value) => setSelectedSubject(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bece-questions-filter-group">
                  <label className="bece-questions-filter-label">Year</label>
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

                <div className="bece-questions-filter-group">
                  <label className="bece-questions-filter-label">Exam Type</label>
                  <Select
                    value={selectedExamType ?? ""}
                    onValueChange={(value) => setSelectedExamType(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Exam Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>

            <div className="bece-questions-filter-actions">
              <button
                className="bece-questions-filter-btn bece-questions-filter-btn-secondary"
                onClick={clearAllFilters}
                type="button"
              >
                Clear All
              </button>
              <button
                className="bece-questions-filter-btn bece-questions-filter-btn-primary"
                onClick={() => setIsFilterSidebarOpen(false)}
                type="button"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <div className="bece-questions-main-content">
            <div className="bece-questions-content-area">
              <div className="bece-questions-header">
                <h1 className="bece-questions-title">Browse Past Questions</h1>
                <p className="bece-questions-subtitle">
                  Access comprehensive exam materials for BECE and SHS. 
                  Study smarter, perform better with our extensive collection of past examination papers.
                </p>
                
                {/* Search Bar and View Toggle */}
                <div className="bece-questions-search-filter-wrapper">
                  <div className="bece-questions-search-view-toggle-wrapper">
                    <div className="bece-questions-search-wrapper">
                      <div className="bece-questions-search-input-container">
                        <motion.div
                          layoutId="search-input-container-bece"
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
                            <motion.div layoutId="search-icon-bece">
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
                                      layoutId={`placeholder-search-bece`}
                                      key={`placeholder-search-bece`}
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
                              className="h-8 px-3 md:px-4 rounded-xl border-slate-200 hover:bg-slate-50 relative bece-questions-filter-btn-mobile flex-shrink-0"
                              onClick={() => setIsFilterSidebarOpen(true)}
                            >
                              <Filter className="w-4 h-4 md:mr-1.5" />
                              <span className="hidden md:inline text-sm">Filters</span>
                              {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                  {[selectedSubject, selectedYear, selectedExamType].filter(Boolean).length}
                                </span>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                      <div className="bece-questions-results-count">
                        <span className="font-semibold text-[hsl(220_30%_15%)]">{filteredPapers.length}</span>{" "}
                        {filteredPapers.length === 1 ? "paper" : "papers"} found
                      </div>
                    </div>
                    <div className="bece-questions-view-toggle">
                      <span className="bece-questions-results-count-mobile">
                        <span>{filteredPapers.length}</span> {filteredPapers.length === 1 ? "paper" : "papers"}
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          className={`bece-questions-view-button ${viewMode === "grouped" ? "active" : ""}`}
                          onClick={() => setViewMode("grouped")}
                          title="Grouped View"
                        >
                          <Building2 size={18} />
                        </button>
                        <button
                          className={`bece-questions-view-button ${viewMode === "grid" ? "active" : ""}`}
                          onClick={() => setViewMode("grid")}
                          title="Grid View"
                        >
                          <Grid3x3 size={18} />
                        </button>
                        <button
                          className={`bece-questions-view-button ${viewMode === "list" ? "active" : ""}`}
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
                    <div className="bece-questions-active-filters">
                      <span className="bece-questions-active-filters-label">Active Filters:</span>
                      
                      {selectedSubject && (
                        <Badge className="px-3 py-1.5 flex items-center gap-2 bg-blue-600 text-white">
                          {selectedSubject}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => setSelectedSubject(null)}
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
                      
                      {selectedExamType && (
                        <Badge className="px-3 py-1.5 flex items-center gap-2 bg-green-600 text-white">
                          {selectedExamType}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => setSelectedExamType(null)}
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
              {filteredPapers.length > 0 ? (
                <>
                  {viewMode === "grouped" ? (
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[hsl(220_30%_15%)]">
                          Organized by Subject
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleAllSubjects}
                          className="text-xs"
                        >
                          {Object.keys(groupedPapers).every(subj => expandedSubjects[subj] === true)
                            ? "Collapse All"
                            : "Expand All"}
                        </Button>
                      </div>
                      {Object.entries(groupedPapers)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([subject, papers]) => {
                          const isExpanded = expandedSubjects[subject] !== false;
                          return (
                            <div
                              key={subject}
                              className="bg-[hsl(40_33%_96%)] rounded-xl border border-[hsl(40_20%_88%)] overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleSubject(subject);
                                }}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[hsl(40_20%_90%)] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-left">
                                    <h4 className="font-semibold text-[hsl(220_30%_15%)]">{subject}</h4>
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
                              <div className={`bece-questions-university-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                                <div className="px-6 pb-6">
                                  <div className="bece-questions-grid mt-4">
                                    {papers.map((paper) => (
                                      <ExamPaperCard
                                        key={paper.id}
                                        title={paper.title}
                                        courseCode={paper.subjectCode}
                                        university={paper.subject}
                                        universityShort={paper.subject}
                                        faculty={paper.examType}
                                        year={paper.year}
                                        semester=""
                                        downloads={paper.downloads}
                                        views={paper.views}
                                        fileSize={paper.fileSize}
                                        verified={paper.verified}
                                        examType={paper.examType}
                                        hideUniversityBadge={true}
                                        onPreview={() => console.log('Preview:', paper.id)}
                                        onDownload={() => console.log('Download:', paper.id)}
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
                      <div className="bece-questions-grid mt-6">
                        {paginatedPapers.map((paper) => (
                          <ExamPaperCard
                            key={paper.id}
                            title={paper.title}
                            courseCode={paper.subjectCode}
                            university={paper.subject}
                            universityShort={paper.subject}
                            faculty={paper.examType}
                            year={paper.year}
                            semester=""
                            downloads={paper.downloads}
                            views={paper.views}
                            fileSize={paper.fileSize}
                            verified={paper.verified}
                            examType={paper.examType}
                            onPreview={() => console.log('Preview:', paper.id)}
                            onDownload={() => console.log('Download:', paper.id)}
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
                      <div className="bece-questions-list-view">
                        {paginatedPapers.map((paper) => (
                          <ExamPaperListItem
                            key={paper.id}
                            title={paper.title}
                            courseCode={paper.subjectCode}
                            universityShort={paper.subject}
                            faculty={paper.examType}
                            year={paper.year}
                            semester=""
                            downloads={paper.downloads}
                            views={paper.views}
                            fileSize={paper.fileSize}
                            verified={paper.verified}
                            hideBadge={true}
                            onPreview={() => console.log('Preview:', paper.id)}
                            onDownload={() => console.log('Download:', paper.id)}
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
                <div className="bece-questions-empty-state" style={{ gridColumn: '1 / -1' }}>
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
      </div>
    </EducationPageLayout>
  );
};

export default ShsBeceQuestions;
