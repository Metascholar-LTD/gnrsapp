import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  Bookmark,
  Upload,
  Cloud
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
  fileType?: string; // PDF, PPTX, PPT, etc.
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
  // Removed viewMode - only grid view is used
  // Multiple carousel scroll states
  const [carouselScrollStates, setCarouselScrollStates] = useState<Record<number, { canScrollLeft: boolean; canScrollRight: boolean }>>({});
  const scrollContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});


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
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
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
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
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
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
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
      imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "7", 
      title: "Data Structures and Algorithms", 
      courseCode: "CS 201",
      courseName: "Data Structures and Algorithms",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Dr. Michael Asante",
      downloads: 5230, 
      views: 9820,
      fileSize: "14.2 MB", 
      uploadDate: "2024-03-01",
      verified: true,
      pages: 52,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "8", 
      title: "Microeconomics Principles", 
      courseCode: "ECON 101",
      courseName: "Microeconomics Principles",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "1st",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Prof. Nana Yaa",
      downloads: 3120, 
      views: 6540,
      fileSize: "9.8 MB", 
      uploadDate: "2024-02-28",
      verified: true,
      pages: 35,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "9", 
      title: "Organic Reactions and Mechanisms", 
      courseCode: "CHEM 301",
      courseName: "Organic Reactions and Mechanisms",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "2nd",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Dr. Akosua Darko",
      downloads: 2780, 
      views: 5120,
      fileSize: "11.5 MB", 
      uploadDate: "2024-01-15",
      verified: true,
      pages: 48,
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "10", 
      title: "Financial Accounting Fundamentals", 
      courseCode: "ACC 101",
      courseName: "Financial Accounting Fundamentals",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "1st",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Dr. Kwabena Osei",
      downloads: 4560, 
      views: 8230,
      fileSize: "10.3 MB", 
      uploadDate: "2024-02-12",
      verified: true,
      pages: 40,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "11", 
      title: "Linear Algebra and Vector Spaces", 
      courseCode: "MATH 301",
      courseName: "Linear Algebra and Vector Spaces",
      faculty: "Engineering", 
      year: 2024, 
      semester: "1st",
      university: "UMaT", 
      universityShort: "UMaT",
      lecturer: "Prof. Kofi Mensah",
      downloads: 3890, 
      views: 7120,
      fileSize: "13.7 MB", 
      uploadDate: "2024-02-18",
      verified: true,
      pages: 55,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "12", 
      title: "Criminal Law and Procedure", 
      courseCode: "LAW 301",
      courseName: "Criminal Law and Procedure",
      faculty: "Law", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Dr. Ama Serwaa",
      downloads: 2340, 
      views: 4890,
      fileSize: "8.9 MB", 
      uploadDate: "2024-01-20",
      verified: true,
      pages: 33,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "13", 
      title: "Software Engineering Principles", 
      courseCode: "CS 401",
      courseName: "Software Engineering Principles",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Dr. Emmanuel Boateng",
      downloads: 5670, 
      views: 10450,
      fileSize: "15.6 MB", 
      uploadDate: "2024-03-05",
      verified: true,
      pages: 62,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "14", 
      title: "Macroeconomics Analysis", 
      courseCode: "ECON 201",
      courseName: "Macroeconomics Analysis",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Prof. Yaw Asiedu",
      downloads: 3450, 
      views: 6780,
      fileSize: "9.5 MB", 
      uploadDate: "2024-01-25",
      verified: true,
      pages: 37,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "15", 
      title: "Inorganic Chemistry Concepts", 
      courseCode: "CHEM 202",
      courseName: "Inorganic Chemistry Concepts",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Dr. Comfort Adjei",
      downloads: 2980, 
      views: 5560,
      fileSize: "10.8 MB", 
      uploadDate: "2024-02-08",
      verified: true,
      pages: 41,
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "16", 
      title: "Managerial Accounting", 
      courseCode: "ACC 201",
      courseName: "Managerial Accounting",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Dr. Nana Kwame",
      downloads: 4120, 
      views: 7890,
      fileSize: "11.2 MB", 
      uploadDate: "2024-01-30",
      verified: true,
      pages: 44,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "17", 
      title: "Differential Equations", 
      courseCode: "MATH 302",
      courseName: "Differential Equations",
      faculty: "Engineering", 
      year: 2024, 
      semester: "1st",
      university: "UMaT", 
      universityShort: "UMaT",
      lecturer: "Prof. Akosua Mensah",
      downloads: 3560, 
      views: 6890,
      fileSize: "12.4 MB", 
      uploadDate: "2024-02-22",
      verified: true,
      pages: 50,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "18", 
      title: "Contract Law Principles", 
      courseCode: "LAW 202",
      courseName: "Contract Law Principles",
      faculty: "Law", 
      year: 2024, 
      semester: "1st",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Dr. Kofi Asante",
      downloads: 2890, 
      views: 5230,
      fileSize: "9.3 MB", 
      uploadDate: "2024-02-14",
      verified: true,
      pages: 36,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "19", 
      title: "Computer Networks and Security", 
      courseCode: "CS 303",
      courseName: "Computer Networks and Security",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Dr. Sarah Mensah",
      downloads: 4980, 
      views: 9120,
      fileSize: "14.8 MB", 
      uploadDate: "2024-01-18",
      verified: true,
      pages: 59,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "20", 
      title: "International Trade Economics", 
      courseCode: "ECON 301",
      courseName: "International Trade Economics",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Prof. Kwame Asante",
      downloads: 3670, 
      views: 7230,
      fileSize: "10.1 MB", 
      uploadDate: "2024-02-25",
      verified: true,
      pages: 39,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "21", 
      title: "Physical Chemistry Fundamentals", 
      courseCode: "CHEM 303",
      courseName: "Physical Chemistry Fundamentals",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "2nd",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Dr. Mary Adjei",
      downloads: 3120, 
      views: 5890,
      fileSize: "11.7 MB", 
      uploadDate: "2024-01-12",
      verified: true,
      pages: 46,
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "22", 
      title: "Cost Accounting Methods", 
      courseCode: "ACC 301",
      courseName: "Cost Accounting Methods",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "1st",
      university: "UMaT", 
      universityShort: "UMaT",
      lecturer: "Dr. John Osei",
      downloads: 4230, 
      views: 8120,
      fileSize: "10.9 MB", 
      uploadDate: "2024-02-28",
      verified: true,
      pages: 43,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "23", 
      title: "Statistics and Probability", 
      courseCode: "MATH 203",
      courseName: "Statistics and Probability",
      faculty: "Engineering", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Prof. Grace Boateng",
      downloads: 3890, 
      views: 7450,
      fileSize: "13.1 MB", 
      uploadDate: "2024-01-28",
      verified: true,
      pages: 53,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "24", 
      title: "Property Law and Real Estate", 
      courseCode: "LAW 303",
      courseName: "Property Law and Real Estate",
      faculty: "Law", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Dr. Abena Darko",
      downloads: 2670, 
      views: 5120,
      fileSize: "9.6 MB", 
      uploadDate: "2024-02-16",
      verified: true,
      pages: 34,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "25", 
      title: "Web Development Fundamentals", 
      courseCode: "CS 204",
      courseName: "Web Development Fundamentals",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Dr. Patricia Mensah",
      downloads: 5120, 
      views: 9650,
      fileSize: "13.4 MB", 
      uploadDate: "2024-03-10",
      verified: true,
      pages: 56,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "26", 
      title: "International Business Strategy", 
      courseCode: "BUS 401",
      courseName: "International Business Strategy",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Prof. Kofi Asante",
      downloads: 3890, 
      views: 7450,
      fileSize: "10.7 MB", 
      uploadDate: "2024-01-28",
      verified: true,
      pages: 41,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "27", 
      title: "Biochemistry Principles", 
      courseCode: "BIO 301",
      courseName: "Biochemistry Principles",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "1st",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Dr. Comfort Osei",
      downloads: 3450, 
      views: 6780,
      fileSize: "12.1 MB", 
      uploadDate: "2024-02-22",
      verified: true,
      pages: 49,
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "28", 
      title: "Taxation Law and Practice", 
      courseCode: "LAW 304",
      courseName: "Taxation Law and Practice",
      faculty: "Law", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Dr. Nana Yaa Boateng",
      downloads: 2780, 
      views: 5340,
      fileSize: "9.4 MB", 
      uploadDate: "2024-01-15",
      verified: true,
      pages: 35,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "29", 
      title: "Machine Learning Basics", 
      courseCode: "CS 402",
      courseName: "Machine Learning Basics",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Dr. Samuel Darko",
      downloads: 6230, 
      views: 11200,
      fileSize: "16.2 MB", 
      uploadDate: "2024-03-15",
      verified: true,
      pages: 68,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "30", 
      title: "Financial Markets and Institutions", 
      courseCode: "FIN 301",
      courseName: "Financial Markets and Institutions",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Prof. Yaw Mensah",
      downloads: 4120, 
      views: 7890,
      fileSize: "11.3 MB", 
      uploadDate: "2024-02-05",
      verified: true,
      pages: 44,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "31", 
      title: "Analytical Chemistry Methods", 
      courseCode: "CHEM 304",
      courseName: "Analytical Chemistry Methods",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "1st",
      university: "UMaT", 
      universityShort: "UMaT",
      lecturer: "Dr. Akosua Adjei",
      downloads: 3120, 
      views: 5890,
      fileSize: "10.5 MB", 
      uploadDate: "2024-02-18",
      verified: true,
      pages: 42,
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "32", 
      title: "Auditing Principles", 
      courseCode: "ACC 302",
      courseName: "Auditing Principles",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Dr. Kofi Boateng",
      downloads: 4560, 
      views: 8230,
      fileSize: "11.8 MB", 
      uploadDate: "2024-01-22",
      verified: true,
      pages: 47,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "33", 
      title: "Numerical Methods", 
      courseCode: "MATH 303",
      courseName: "Numerical Methods",
      faculty: "Engineering", 
      year: 2024, 
      semester: "1st",
      university: "KNUST", 
      universityShort: "KNUST",
      lecturer: "Prof. Grace Asante",
      downloads: 3780, 
      views: 7120,
      fileSize: "13.9 MB", 
      uploadDate: "2024-02-28",
      verified: true,
      pages: 54,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "34", 
      title: "Family Law Principles", 
      courseCode: "LAW 305",
      courseName: "Family Law Principles",
      faculty: "Law", 
      year: 2024, 
      semester: "2nd",
      university: "UCC", 
      universityShort: "UCC",
      lecturer: "Dr. Efua Mensah",
      downloads: 2890, 
      views: 5230,
      fileSize: "9.7 MB", 
      uploadDate: "2024-02-12",
      verified: true,
      pages: 37,
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
    { 
      id: "35", 
      title: "Cybersecurity Fundamentals", 
      courseCode: "CS 403",
      courseName: "Cybersecurity Fundamentals",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "UMaT", 
      universityShort: "UMaT",
      lecturer: "Dr. Michael Osei",
      downloads: 5340, 
      views: 9820,
      fileSize: "14.6 MB", 
      uploadDate: "2024-03-08",
      verified: true,
      pages: 61,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "36", 
      title: "Investment Analysis", 
      courseCode: "FIN 302",
      courseName: "Investment Analysis",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "2nd",
      university: "UG", 
      universityShort: "UG",
      lecturer: "Prof. Nana Kwame Asante",
      downloads: 4230, 
      views: 8120,
      fileSize: "10.2 MB", 
      uploadDate: "2024-01-30",
      verified: true,
      pages: 40,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      fileType: "PDF"
    },
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Recommended notes - top 6 by views
  const recommendedNotes = useMemo(() => {
    return [...lectureNotes]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, []);

  // Get unique values for filters
  const universities = useMemo(() => 
    Array.from(new Set(lectureNotes.map(n => n.universityShort))).sort(),
    []
  );
  const courses = [
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
      
      return matchesSearch && matchesUniversity && matchesCourse;
    });
  }, [debouncedSearchQuery, selectedUniversity, selectedCourse]);

  // Group filtered notes into chunks of 12 for carousels
  const carouselRows = useMemo(() => {
    const chunks: LectureNote[][] = [];
    for (let i = 0; i < filteredNotes.length; i += 12) {
      chunks.push(filteredNotes.slice(i, i + 12));
    }
    return chunks;
  }, [filteredNotes]);

  // Scroll functions for each carousel
  const scrollLeft = (carouselIndex: number) => {
    const container = scrollContainerRefs.current[carouselIndex];
    if (container) {
      const cardWidth = 380;
      container.scrollBy({
        left: -cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (carouselIndex: number) => {
    const container = scrollContainerRefs.current[carouselIndex];
    if (container) {
      const cardWidth = 380;
      container.scrollBy({
        left: cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  // Check scroll position for button visibility for each carousel
  useEffect(() => {
    const checkScrollForCarousel = (carouselIndex: number) => {
      const container = scrollContainerRefs.current[carouselIndex];
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      setCarouselScrollStates(prev => ({
        ...prev,
        [carouselIndex]: {
          canScrollLeft: scrollLeft > 10,
          canScrollRight: scrollLeft < scrollWidth - clientWidth - 10
        }
      }));
    };

    // Set up scroll listeners for each carousel
    const cleanupFunctions: (() => void)[] = [];

    carouselRows.forEach((_, index) => {
      const container = scrollContainerRefs.current[index];
      if (!container) return;

      let timeoutId: NodeJS.Timeout;
      const handleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => checkScrollForCarousel(index), 50);
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      const resizeHandler = () => checkScrollForCarousel(index);
      window.addEventListener('resize', resizeHandler);

      // Initial check
      setTimeout(() => checkScrollForCarousel(index), 50);
      setTimeout(() => checkScrollForCarousel(index), 200);
      setTimeout(() => checkScrollForCarousel(index), 500);

      cleanupFunctions.push(() => {
        clearTimeout(timeoutId);
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', resizeHandler);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [carouselRows]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedUniversity(null);
    setSelectedCourse(null);
  }, []);

  // Active filter bar removed - university will show as a button in quick filters
  const hasActiveFilters = false;

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
      background: #f2f4fe;
    }

    .lecture-notes-content-wrapper {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: flex-start;
      gap: 2rem;
      width: 100%;
      background: #f2f4fe;
    }

    .lecture-notes-main-content {
      flex: 1;
      padding: 2rem;
      min-width: 0;
    }

    .lecture-notes-upload-section {
      margin-top: 4rem;
      padding: 3rem 0;
      background: white;
      border-radius: 1rem;
    }

    .lecture-notes-upload-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      padding: 0 2rem;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .lecture-notes-upload-left {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-align: left;
    }

    .lecture-notes-upload-headline {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      color: hsl(220 30% 15%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      text-align: left;
    }

    .lecture-notes-upload-headline .highlight {
      background: linear-gradient(120deg, #fef3c7 0%, #fde68a 100%);
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      display: inline-block;
    }

    .lecture-notes-upload-subtitle {
      font-size: 1.125rem;
      color: hsl(220 20% 40%);
      margin: 0;
      line-height: 1.6;
      text-align: left;
    }

    .lecture-notes-upload-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .lecture-notes-upload-file-types {
      font-size: 0.875rem;
      color: hsl(220 20% 50%);
      margin: 0;
    }

    .lecture-notes-upload-disclaimer {
      font-size: 0.8125rem;
      color: hsl(220 20% 50%);
      margin: 0;
    }

    .lecture-notes-upload-disclaimer strong {
      font-weight: 600;
      color: hsl(220 30% 15%);
    }

    .lecture-notes-upload-right {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .lecture-notes-upload-box {
      width: 100%;
      max-width: 500px;
      border: 2px dashed #cbd5e1;
      border-radius: 1rem;
      padding: 3rem 2rem;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .lecture-notes-upload-instruction {
      font-size: 1rem;
      color: hsl(220 20% 40%);
      margin: 0;
      text-align: center;
    }

    .lecture-notes-upload-button-wrapper {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    .lecture-notes-upload-button {
      background: #7c3aed;
      color: white;
      border: none;
      padding: 0.625rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
    }

    .lecture-notes-upload-button:hover {
      background: #6d28d9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    }

    .lecture-notes-upload-illustration {
      flex-shrink: 0;
    }

    .lecture-notes-upload-services {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      align-items: center;
    }

    .lecture-notes-upload-services-label {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      margin: 0;
    }

    .lecture-notes-upload-service-icons {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
    }

    .lecture-notes-service-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .lecture-notes-service-icon:hover {
      border-color: #7c3aed;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .lecture-notes-recommended-sidebar {
      width: 320px;
      flex-shrink: 0;
      padding: 2rem 1.5rem 2rem 0;
    }

    .lecture-notes-recommended-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .lecture-notes-recommended-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .lecture-notes-recommended-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: all 0.2s;
      cursor: pointer;
    }

    .lecture-notes-recommended-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .lecture-notes-recommended-thumbnail {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #f1f5f9;
    }

    .lecture-notes-recommended-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .lecture-notes-recommended-badge {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 0.125rem;
      letter-spacing: 0.025em;
    }

    .lecture-notes-recommended-content {
      padding: 0.75rem;
      position: relative;
    }

    .lecture-notes-recommended-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .lecture-notes-recommended-card-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .lecture-notes-recommended-bookmark {
      flex-shrink: 0;
      padding: 0.25rem;
      cursor: pointer;
      color: hsl(220 20% 60%);
      transition: color 0.2s;
    }

    .lecture-notes-recommended-bookmark:hover {
      color: hsl(220 30% 15%);
    }

    .lecture-notes-recommended-author {
      font-size: 0.75rem;
      color: hsl(220 20% 40%);
      margin: 0 0 0.375rem 0;
    }

    .lecture-notes-recommended-stats {
      font-size: 0.6875rem;
      color: hsl(220 20% 50%);
      margin: 0;
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
      font-size: 13px;
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

    .lecture-notes-quick-filters {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .lecture-notes-quick-filter-btn {
      padding: 0.5rem 1.25rem;
      border-radius: 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      border: 1px solid #e2e8f0;
      background: white;
      color: hsl(220 30% 15%);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .lecture-notes-quick-filter-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .lecture-notes-quick-filter-btn.active {
      background: #dbeafe !important;
      color: #1e40af !important;
      border-color: #93c5fd !important;
      font-weight: 600;
    }

    .lecture-notes-quick-filter-btn.active:hover {
      background: #bfdbfe !important;
      border-color: #60a5fa !important;
      color: #1e3a8a !important;
    }

    .lecture-notes-grid-container {
      position: relative;
      margin-top: 1rem;
      padding: 0 45px;
    }

    .lecture-notes-grid-container:has(.lecture-notes-quick-filters) {
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .lecture-notes-grid-container:has(.lecture-notes-grid-wrapper) {
      margin-top: 0;
      padding-top: 0;
    }

    .lecture-notes-grid-wrapper {
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      -webkit-overflow-scrolling: touch;
      padding-bottom: 0;
    }

    .lecture-notes-grid-wrapper::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .lecture-notes-grid {
      display: flex;
      gap: 1rem;
      width: max-content;
      padding: 0.5rem 0;
      margin-top: 0;
    }

    .lecture-notes-card {
      flex: 0 0 360px;
      max-width: 360px;
    }

    .lecture-notes-scroll-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: #475569;
      pointer-events: auto;
    }

    .lecture-notes-scroll-btn:hover:not(:disabled) {
      background: #f8fafc;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      color: #1e293b;
    }

    .lecture-notes-scroll-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none;
    }

    .lecture-notes-scroll-btn-left {
      left: 5px;
    }

    .lecture-notes-scroll-btn-right {
      right: 5px;
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
      .lecture-notes-grid-container {
        padding: 0 40px;
      }

      .lecture-notes-scroll-btn-left {
        left: 0px;
      }

      .lecture-notes-scroll-btn-right {
        right: 0px;
      }
    }

    @media (min-width: 1441px) {
      .lecture-notes-grid-container {
        padding: 0 50px;
      }

      .lecture-notes-scroll-btn-left {
        left: 10px;
      }

      .lecture-notes-scroll-btn-right {
        right: 10px;
      }
    }

    /* Small Laptop: 1024px - 1199px */
    @media (min-width: 1024px) and (max-width: 1199px) {
      .lecture-notes-upload-content {
        grid-template-columns: 1fr;
        gap: 2.75rem;
        padding: 0 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .lecture-notes-upload-left {
        text-align: left;
        gap: 1.5rem;
      }

      .lecture-notes-upload-headline {
        font-size: 2.25rem;
        line-height: 1.3;
        text-align: left;
      }

      .lecture-notes-upload-subtitle {
        font-size: 1.125rem;
        text-align: left;
      }

      .lecture-notes-upload-info {
        text-align: left;
      }

      .lecture-notes-upload-box {
        padding: 2.25rem 2rem;
        max-width: 520px;
        margin: 0 auto;
      }

      .lecture-notes-upload-button-wrapper {
        gap: 1.5rem;
      }

      .lecture-notes-upload-illustration svg {
        width: 105px;
        height: 105px;
      }
    }

    @media (max-width: 1023px) {
      .lecture-notes-content-wrapper {
        flex-direction: column;
      }

      .lecture-notes-upload-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 0 1.5rem;
      }

      .lecture-notes-upload-headline {
        font-size: 2rem;
      }

      .lecture-notes-upload-box {
        padding: 2rem 1.5rem;
      }

      .lecture-notes-recommended-sidebar {
        width: 100%;
        padding: 2rem 1.5rem 0 1.5rem;
      }

      .lecture-notes-recommended-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .lecture-notes-grid-container {
        padding: 0 20px;
      }

      .lecture-notes-scroll-btn {
        display: none;
      }

      .lecture-notes-card {
        flex: 0 0 320px;
        max-width: 320px;
      }
    }

    @media (max-width: 640px) {
      .lecture-notes-card {
        flex: 0 0 280px;
        max-width: 280px;
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
        gap: 1.5rem;
      }

      .lecture-notes-main-content {
        padding: 1rem;
        width: 100%;
      }

      .lecture-notes-recommended-sidebar {
        padding: 0 1rem;
      }

      .lecture-notes-recommended-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .lecture-notes-recommended-title {
        font-size: 1.125rem;
        margin-bottom: 1rem;
      }

      .lecture-notes-upload-section {
        margin-top: 2rem;
        padding: 2rem 0;
      }

      .lecture-notes-upload-content {
        padding: 0 1rem;
        gap: 1.5rem;
      }

      .lecture-notes-upload-left {
        gap: 1rem;
        text-align: center;
      }

      .lecture-notes-upload-headline {
        font-size: 1.75rem;
        line-height: 1.3;
      }

      .lecture-notes-upload-subtitle {
        font-size: 0.9375rem;
        line-height: 1.5;
      }

      .lecture-notes-upload-info {
        gap: 0.75rem;
      }

      .lecture-notes-upload-file-types {
        font-size: 0.8125rem;
      }

      .lecture-notes-upload-disclaimer {
        font-size: 0.75rem;
      }

      .lecture-notes-upload-box {
        padding: 1.5rem 1rem;
        gap: 1.5rem;
      }

      .lecture-notes-upload-instruction {
        font-size: 0.9375rem;
      }

      .lecture-notes-upload-button {
        padding: 0.5rem 1.25rem;
        font-size: 0.8125rem;
        width: 100%;
        justify-content: center;
      }

      .lecture-notes-upload-button-wrapper {
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }

      .lecture-notes-upload-illustration {
        display: none;
      }

      .lecture-notes-upload-services {
        gap: 0.625rem;
      }

      .lecture-notes-upload-services-label {
        font-size: 0.8125rem;
      }

      .lecture-notes-service-icon {
        width: 36px;
        height: 36px;
      }

      .lecture-notes-service-icon svg {
        width: 20px;
        height: 20px;
      }

      .lecture-notes-quick-filters {
        display: none;
      }

      .lecture-notes-header {
        margin-bottom: 1.5rem;
      }

      .lecture-notes-title {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }

      .lecture-notes-subtitle {
        font-size: 12px;
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
        display: none;
      }

      .lecture-notes-filter-sidebar {
        width: 100%;
        max-width: 320px;
      }

      .lecture-notes-grid {
        gap: 0.75rem;
        margin-top: 0;
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
        flex-direction: column;
      }

      .lecture-notes-main-content {
        padding: 1.5rem;
      }

      .lecture-notes-upload-section {
        margin-top: 3rem;
        padding: 2.5rem 0;
      }

      .lecture-notes-upload-content {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        padding: 0 1.5rem;
        max-width: 750px;
        margin: 0 auto;
      }

      .lecture-notes-upload-left {
        text-align: center;
        gap: 1.25rem;
      }

      .lecture-notes-upload-headline {
        font-size: 2rem;
        line-height: 1.3;
        text-align: center;
      }

      .lecture-notes-upload-subtitle {
        font-size: 1.0625rem;
        text-align: center;
      }

      .lecture-notes-upload-info {
        text-align: center;
      }

      .lecture-notes-upload-box {
        padding: 2rem 1.5rem;
        max-width: 500px;
        margin: 0 auto;
      }

      .lecture-notes-upload-button-wrapper {
        gap: 1.25rem;
      }

      .lecture-notes-upload-illustration svg {
        width: 100px;
        height: 100px;
      }

      .lecture-notes-recommended-sidebar {
        width: 100%;
        padding: 0 1.5rem;
      }

      .lecture-notes-recommended-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }

      .lecture-notes-quick-filters {
        gap: 0.625rem;
        margin-bottom: 1.25rem;
      }

      .lecture-notes-quick-filter-btn {
        padding: 0.4375rem 1rem;
        font-size: 0.8125rem;
      }

      .lecture-notes-header {
        margin-bottom: 2rem;
      }

      .lecture-notes-title {
        font-size: 2.5rem;
        margin-bottom: 0.75rem;
      }

      .lecture-notes-subtitle {
        font-size: 13px;
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
        margin-top: 0;
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

      .lecture-notes-upload-section {
        margin-top: 3.5rem;
        padding: 3rem 0;
      }

      .lecture-notes-upload-content {
        grid-template-columns: 1fr;
        gap: 3rem;
        padding: 0 2rem;
        max-width: 900px;
        margin: 0 auto;
      }

      .lecture-notes-upload-left {
        text-align: left;
        gap: 1.5rem;
        max-width: 100%;
      }

      .lecture-notes-upload-headline {
        font-size: 2.5rem;
        line-height: 1.2;
        text-align: left;
      }

      .lecture-notes-upload-subtitle {
        font-size: 1.125rem;
        text-align: left;
      }

      .lecture-notes-upload-info {
        text-align: left;
      }

      .lecture-notes-upload-right {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .lecture-notes-upload-box {
        padding: 2.5rem 2rem;
        max-width: 550px;
        margin: 0 auto;
      }

      .lecture-notes-upload-button-wrapper {
        gap: 1.5rem;
      }

      .lecture-notes-upload-illustration svg {
        width: 110px;
        height: 110px;
      }

      .lecture-notes-recommended-sidebar {
        width: 300px;
        padding: 2rem 1.5rem 2rem 0;
      }

      .lecture-notes-header {
        margin-bottom: 2.5rem;
      }

      .lecture-notes-title {
        font-size: 2.75rem;
        margin-bottom: 0.875rem;
      }

      .lecture-notes-subtitle {
        font-size: 14px;
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
        margin-top: 0;
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

      .lecture-notes-upload-section {
        margin-top: 4rem;
        padding: 3.5rem 0;
      }

      .lecture-notes-upload-content {
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        padding: 0 2rem;
        max-width: 1400px;
        align-items: center;
      }

      .lecture-notes-upload-left {
        text-align: left;
        gap: 1.75rem;
      }

      .lecture-notes-upload-headline {
        font-size: 2.75rem;
        line-height: 1.2;
        text-align: left;
      }

      .lecture-notes-upload-subtitle {
        font-size: 1.25rem;
        text-align: left;
      }

      .lecture-notes-upload-info {
        text-align: left;
      }

      .lecture-notes-upload-box {
        padding: 3rem 2.5rem;
        max-width: 520px;
      }

      .lecture-notes-upload-button-wrapper {
        gap: 1.5rem;
      }

      .lecture-notes-upload-illustration svg {
        width: 120px;
        height: 120px;
      }

      .lecture-notes-recommended-sidebar {
        width: 340px;
        padding: 2rem 2rem 2rem 0;
      }

      .lecture-notes-header {
        margin-bottom: 3rem;
      }

      .lecture-notes-title {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .lecture-notes-subtitle {
        font-size: 14px;
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
        margin-top: 0;
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
              <h3></h3>
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
                  <label className="lecture-notes-filter-label">Field</label>
                  <Select
                    value={selectedCourse ?? ""}
                    onValueChange={(value) => setSelectedCourse(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Fields" />
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
                <h1 className="lecture-notes-title">MetaSlides and Lecturer Notes</h1>
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
                                {[selectedUniversity, selectedCourse].filter(Boolean).length}
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
                      <div className="lecture-notes-results-count-mobile">
                        <span>{filteredNotes.length}</span> {filteredNotes.length === 1 ? "note" : "notes"}
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
              {/* Quick Filter Buttons - Always visible */}
              <div className="lecture-notes-grid-container">
                <div className="lecture-notes-quick-filters">
                  {["Business", "Technology", "Design", "Marketing", "Education"].map((field) => (
                    <button
                      key={field}
                      onClick={() => setSelectedCourse(field === selectedCourse ? null : field)}
                      className={`lecture-notes-quick-filter-btn ${selectedCourse === field ? 'active' : ''}`}
                    >
                      {field}
                    </button>
                  ))}
                  {/* University filter button - appears when university is selected */}
                  {selectedUniversity && (
                    <button
                      onClick={() => setSelectedUniversity(null)}
                      className="lecture-notes-quick-filter-btn active"
                    >
                      {selectedUniversity}
                    </button>
                  )}
                </div>
              </div>

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
              ) : (
                <div>
                  {carouselRows.map((row, carouselIndex) => (
                    <div key={carouselIndex} className="lecture-notes-grid-container" style={{ marginTop: carouselIndex > 0 ? '1rem' : '0' }}>
                      <div className="lecture-notes-grid-wrapper" ref={(el) => { scrollContainerRefs.current[carouselIndex] = el; }}>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="lecture-notes-grid"
                        >
                          {row.map((note) => (
                        <motion.div
                          key={note.id}
                          variants={cardVariants}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="group lecture-notes-card"
                        >
                          <div className="relative h-36 rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-row">
                            {/* Thumbnail Image - Left Side */}
                            <div className="relative w-36 h-full flex-shrink-0 overflow-hidden bg-slate-100">
                              <motion.img
                                src={note.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80"}
                                alt={note.title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                              {/* File Type Badge - Top Left */}
                              <div className="absolute top-2 left-2">
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-black/70 text-white rounded">
                                  {note.fileType || (note.fileSize?.toLowerCase().includes('pdf') ? 'PDF' : 'PPTX')}
                                </span>
                              </div>
                            </div>

                            {/* Content Section - Right Side */}
                            <div className="flex-1 flex flex-col justify-between p-2.5 min-w-0">
                              {/* Top Section: Title and Bookmark */}
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug flex-1">
                                  {note.title}
                                </h3>
                                <button
                                  className="flex-shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Bookmark:', note.id);
                                  }}
                                  title="Save"
                                >
                                  <Bookmark className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
                                </button>
                              </div>

                              {/* Middle Section: Author and Metadata */}
                              <div className="space-y-0.5 mb-1.5">
                                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                                  <User className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span className="truncate">{note.lecturer}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                  <span>{note.pages} slides</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5">
                                    <Eye className="w-2.5 h-2.5" />
                                    {formatNumber(note.views)}
                                  </span>
                                </div>
                              </div>

                              {/* Bottom Section: Actions */}
                              <div className="flex items-center gap-3 pt-1.5 border-t border-slate-100">
                                <button
                                  onClick={() => console.log('Preview:', note.id)}
                                  className="group relative inline-block text-[11px] font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                >
                                  <motion.span
                                    className="relative inline-block pb-0.5 flex items-center gap-0.5"
                                    whileHover={{ x: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                  >
                                    <Eye className="w-3 h-3" />
                                    Preview
                                    <span
                                      className="absolute bottom-0 left-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                                      style={{
                                        width: 'calc(100% + 8px)',
                                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                      }}
                                    />
                                  </motion.span>
                                </button>
                                <button
                                  onClick={() => console.log('Download:', note.id)}
                                  className="group relative inline-block text-[11px] font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700"
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                >
                                  <motion.span
                                    className="relative inline-block pb-0.5 flex items-center gap-0.5"
                                    whileHover={{ x: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                  >
                                    <Download className="w-3 h-3" />
                                    Download
                                    <span
                                      className="absolute bottom-0 left-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                                      style={{
                                        width: 'calc(100% + 8px)',
                                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                                      }}
                                    />
                                  </motion.span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                          ))}
                        </motion.div>
                      </div>
                      
                      {/* Navigation Buttons for this carousel */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const state = carouselScrollStates[carouselIndex];
                          if (state?.canScrollLeft) {
                            scrollLeft(carouselIndex);
                          }
                        }}
                        className={`lecture-notes-scroll-btn lecture-notes-scroll-btn-left ${!carouselScrollStates[carouselIndex]?.canScrollLeft ? 'opacity-30' : ''}`}
                        aria-label="Scroll left"
                        disabled={!carouselScrollStates[carouselIndex]?.canScrollLeft}
                        style={{ 
                          pointerEvents: carouselScrollStates[carouselIndex]?.canScrollLeft ? 'auto' : 'none',
                          cursor: carouselScrollStates[carouselIndex]?.canScrollLeft ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const state = carouselScrollStates[carouselIndex];
                          if (state?.canScrollRight) {
                            scrollRight(carouselIndex);
                          }
                        }}
                        className={`lecture-notes-scroll-btn lecture-notes-scroll-btn-right ${!carouselScrollStates[carouselIndex]?.canScrollRight ? 'opacity-30' : ''}`}
                        aria-label="Scroll right"
                        disabled={!carouselScrollStates[carouselIndex]?.canScrollRight}
                        style={{ 
                          pointerEvents: carouselScrollStates[carouselIndex]?.canScrollRight ? 'auto' : 'none',
                          cursor: carouselScrollStates[carouselIndex]?.canScrollRight ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Section */}
              <div className="lecture-notes-upload-section">
                <div className="lecture-notes-upload-content">
                  {/* Left Section - Text Content */}
                  <div className="lecture-notes-upload-left">
                    <h2 className="lecture-notes-upload-headline">
                      Share your <span className="highlight">knowledge</span> and inspire the next <span className="highlight">generation</span>.
                    </h2>
                    <p className="lecture-notes-upload-subtitle">
                      Upload your lecture materials and help students across Ghana excel in their studies.
                    </p>
                    <div className="lecture-notes-upload-info">
                      <p className="lecture-notes-upload-file-types">
                        Supported file types: PowerPoint (PPT, PPTX, PPSX, POTX), PDF, Word (DOC, DOCX).
                      </p>
                      <p className="lecture-notes-upload-disclaimer">
                        By uploading, you agree to our <strong>MetaSlides and Notes Terms of Service</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Right Section - Upload Area */}
                  <div className="lecture-notes-upload-right">
                    <div className="lecture-notes-upload-box">
                      <p className="lecture-notes-upload-instruction">
                        Choose your file and add it here.
                      </p>
                      <div className="lecture-notes-upload-button-wrapper">
                        <button className="lecture-notes-upload-button">
                          <Upload className="w-4 h-4 mr-1.5" />
                          Upload a presentation
                        </button>
                        <div className="lecture-notes-upload-illustration">
                          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M60 20C40 20 20 30 20 50C20 70 40 80 60 80C80 80 100 70 100 50C100 30 80 20 60 20Z" fill="#7C3AED"/>
                            <path d="M30 60C25 60 20 65 20 70C20 75 25 80 30 80C35 80 40 75 40 70C40 65 35 60 30 60Z" fill="#7C3AED"/>
                            <path d="M90 60C85 60 80 65 80 70C80 75 85 80 90 80C95 80 100 75 100 70C100 65 95 60 90 60Z" fill="#7C3AED"/>
                            <path d="M50 40L60 30L70 40L65 40L65 55L55 55L55 40L50 40Z" fill="#F97316"/>
                            <path d="M40 50L50 40L60 50L55 50L55 65L45 65L45 50L40 50Z" fill="#F97316"/>
                            <circle cx="70" cy="50" r="8" fill="#FCD34D"/>
                            <path d="M70 42L70 58M62 50L78 50" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="lecture-notes-upload-services">
                        <p className="lecture-notes-upload-services-label">Upload from another service:</p>
                        <div className="lecture-notes-upload-service-icons">
                          <button className="lecture-notes-service-icon" title="Google Drive">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.71 2L2 12L7.71 22H16.29L22 12L16.29 2H7.71Z" fill="#4285F4"/>
                              <path d="M7.71 2L12 12L7.71 22H2L7.71 12L2 2H7.71Z" fill="#34A853"/>
                              <path d="M16.29 2L12 12L16.29 22H22L16.29 12L22 2H16.29Z" fill="#FBBC04"/>
                            </svg>
                          </button>
                          <button className="lecture-notes-service-icon" title="Box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="24" rx="4" fill="#0061D5"/>
                              <text x="12" y="16" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">box</text>
                            </svg>
                          </button>
                          <button className="lecture-notes-service-icon" title="Dropbox">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 2L12 6L18 2L12 8L6 2Z" fill="#0061FF"/>
                              <path d="M18 2L12 8L18 14L12 8L18 2Z" fill="#0061FF"/>
                              <path d="M6 2L12 8L6 14L12 8L6 2Z" fill="#0061FF"/>
                              <path d="M6 14L12 20L18 14L12 8L6 14Z" fill="#0061FF"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Section */}
          <aside className="lecture-notes-recommended-sidebar">
            <h2 className="lecture-notes-recommended-title">Recommended</h2>
            <div className="lecture-notes-recommended-grid">
              {recommendedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  className="lecture-notes-recommended-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -2 }}
                  onClick={() => console.log('View recommended:', note.id)}
                >
                  <div className="lecture-notes-recommended-thumbnail">
                    <img
                      src={note.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80"}
                      alt={note.title}
                    />
                    <div className="lecture-notes-recommended-badge">
                      {note.fileType || (note.fileSize?.toLowerCase().includes('pdf') ? 'PDF' : 'PPTX')}
                    </div>
                  </div>
                  <div className="lecture-notes-recommended-content">
                    <div className="lecture-notes-recommended-card-header">
                      <h3 className="lecture-notes-recommended-card-title">
                        {note.title}
                      </h3>
                      <button
                        className="lecture-notes-recommended-bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Bookmark:', note.id);
                        }}
                        title="Save"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="lecture-notes-recommended-author">
                      by {note.lecturer}
                    </p>
                    <p className="lecture-notes-recommended-stats">
                      {note.pages} slides • {formatNumber(note.views)} views
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LectureNotes;
