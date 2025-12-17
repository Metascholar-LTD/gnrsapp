import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Sparkles
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

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
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  // Get unique values for filters
  const universities = Array.from(new Set(lectureNotes.map(n => n.universityShort))).sort();
  const faculties = Array.from(new Set(lectureNotes.map(n => n.faculty))).sort();
  const years = Array.from(new Set(lectureNotes.map(n => n.year))).sort((a, b) => b - a);
  const semesters = ["1st", "2nd"];

  // Filtering logic
  const filteredNotes = lectureNotes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUniversity = !selectedUniversity || note.universityShort === selectedUniversity;
    const matchesFaculty = !selectedFaculty || note.faculty === selectedFaculty;
    const matchesYear = !selectedYear || note.year === selectedYear;
    const matchesSemester = !selectedSemester || note.semester === selectedSemester;
    
    return matchesSearch && matchesUniversity && matchesFaculty && matchesYear && matchesSemester;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedUniversity(null);
    setSelectedFaculty(null);
    setSelectedYear(null);
    setSelectedSemester(null);
  };

  const hasActiveFilters = selectedUniversity || selectedFaculty || selectedYear || selectedSemester;

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

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-slate-50" 
        style={{ 
          paddingTop: '140px',
          paddingBottom: '80px'
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 mb-6"
            >
              <Sparkles className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Comprehensive Learning Resources</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900">
              Lecture Notes Repository
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto text-slate-600">
              Access comprehensive lecture materials from Ghana's leading universities. 
              Enhance your learning with quality notes.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* All Notes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-slate-900">
                  All Lecture Notes
                </h2>
                <div className="h-px bg-slate-200 mb-2"></div>
                <p className="text-lg text-slate-600">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full md:w-auto"
              >
                <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50">
                      <Search className="w-4 h-4 text-slate-500" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border-0 h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-slate-400"
                    />
                    <Popover open={showFilters} onOpenChange={setShowFilters}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline"
                          className="h-10 px-4 rounded-xl border-slate-200 hover:bg-slate-50"
                        >
                          <Filter className="w-4 h-4 mr-1.5" />
                          <span className="text-sm">Filters</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Advanced Filters</h3>
                            {hasActiveFilters && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="h-8 text-xs"
                              >
                                Clear All
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-slate-700 mb-2 block">University</label>
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

                            <div>
                              <label className="text-sm font-medium text-slate-700 mb-2 block">Faculty</label>
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

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Year</label>
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

                              <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Semester</label>
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
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-3 items-center mb-6"
              >
                <span className="text-sm font-medium text-slate-600">Active Filters:</span>
                
                {selectedUniversity && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedUniversity}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedUniversity(null)}
                    />
                  </Badge>
                )}
                
                {selectedFaculty && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedFaculty}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedFaculty(null)}
                    />
                  </Badge>
                )}
                
                {selectedYear && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedYear}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedYear(null)}
                    />
                  </Badge>
                )}
                
                {selectedSemester && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
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
              </motion.div>
            )}
          </div>
          
          {filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-slate-100">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-700">
                No notes found
              </h3>
              <p className="text-lg mb-6 text-slate-500">
                Try adjusting your filters or search query
              </p>
              <Button 
                onClick={clearAllFilters}
                className="bg-slate-700 hover:bg-slate-800 text-white"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
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
      </section>

      <Footer />
    </>
  );
};

export default LectureNotes;
