import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DIRECTORY_PADDING, MEDIA_QUERIES } from "@/lib/breakpoints";
import { 
  Search, 
  Download, 
  Eye, 
  FileText,
  Filter,
  X,
  CheckCircle2,
  File,
  Target
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
  examType: string;
  downloads: number;
  views: number;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
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

const TrialQuestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock trial questions data with images
  const trialQuestions: TrialQuestion[] = [
    { 
      id: "1", 
      title: "Mathematics Practice Set 1", 
      courseCode: "MATH 101",
      courseName: "Basic Mathematics",
      faculty: "Engineering", 
      year: 2024, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      examType: "Trial Questions", 
      downloads: 4560, 
      views: 8920,
      fileSize: "5.2 MB", 
      uploadDate: "2024-02-15",
      verified: true,
      questions: 50,
      difficulty: "Medium",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "2", 
      title: "Chemistry Fundamentals Practice", 
      courseCode: "CHEM 101",
      courseName: "General Chemistry",
      faculty: "Physical & Biological Sciences", 
      year: 2024, 
      semester: "1st",
      university: "Kwame Nkrumah University of Science and Technology", 
      universityShort: "KNUST",
      examType: "Trial Questions", 
      downloads: 3890, 
      views: 7450,
      fileSize: "4.8 MB", 
      uploadDate: "2024-02-10",
      verified: true,
      questions: 45,
      difficulty: "Hard",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "3", 
      title: "English Language Practice Test", 
      courseCode: "ENG 101",
      courseName: "English Language",
      faculty: "Arts & Humanities", 
      year: 2024, 
      semester: "1st",
      university: "University of Cape Coast", 
      universityShort: "UCC",
      examType: "Trial Questions", 
      downloads: 3120, 
      views: 6230,
      fileSize: "3.5 MB", 
      uploadDate: "2024-02-08",
      verified: true,
      questions: 40,
      difficulty: "Easy",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "4", 
      title: "Physics Problem Set", 
      courseCode: "PHY 201",
      courseName: "General Physics",
      faculty: "Engineering", 
      year: 2024, 
      semester: "1st",
      university: "University of Mines and Technology", 
      universityShort: "UMaT",
      examType: "Trial Questions", 
      downloads: 4230, 
      views: 8120,
      fileSize: "6.1 MB", 
      uploadDate: "2024-02-12",
      verified: true,
      questions: 55,
      difficulty: "Hard",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "5", 
      title: "Economics Practice Questions", 
      courseCode: "ECO 101",
      courseName: "Introduction to Economics",
      faculty: "Business & Economics", 
      year: 2024, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      examType: "Trial Questions", 
      downloads: 2780, 
      views: 5420,
      fileSize: "4.2 MB", 
      uploadDate: "2024-02-05",
      verified: true,
      questions: 42,
      difficulty: "Medium",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
    },
    { 
      id: "6", 
      title: "Computer Science Practice Set", 
      courseCode: "CS 101",
      courseName: "Introduction to Computer Science",
      faculty: "Computing & IT", 
      year: 2024, 
      semester: "1st",
      university: "University of Ghana", 
      universityShort: "UG",
      examType: "Trial Questions", 
      downloads: 5120, 
      views: 9850,
      fileSize: "7.3 MB", 
      uploadDate: "2024-02-20",
      verified: true,
      questions: 60,
      difficulty: "Medium",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
    },
  ];

  // Get unique values for filters
  const universities = Array.from(new Set(trialQuestions.map(q => q.universityShort))).sort();
  const faculties = Array.from(new Set(trialQuestions.map(q => q.faculty))).sort();
  const years = Array.from(new Set(trialQuestions.map(q => q.year))).sort((a, b) => b - a);
  const semesters = ["1st", "2nd"];
  const difficulties = ["Easy", "Medium", "Hard"];

  // Filtering logic
  const filteredQuestions = trialQuestions.filter(question => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.university.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUniversity = !selectedUniversity || question.universityShort === selectedUniversity;
    const matchesFaculty = !selectedFaculty || question.faculty === selectedFaculty;
    const matchesYear = !selectedYear || question.year === selectedYear;
    const matchesSemester = !selectedSemester || question.semester === selectedSemester;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesUniversity && matchesFaculty && matchesYear && matchesSemester && matchesDifficulty;
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedUniversity(null);
    setSelectedFaculty(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedDifficulty(null);
  };

  const hasActiveFilters = selectedUniversity || selectedFaculty || selectedYear || selectedSemester || selectedDifficulty;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
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
    .trial-questions-content-wrapper {
      padding-top: ${DIRECTORY_PADDING.MOBILE.PADDING_TOP};
    }

    .trial-questions-content {
      padding: ${DIRECTORY_PADDING.MOBILE.PADDING};
    }

    /* Tablet: 768px - 1199px */
    @media ${MEDIA_QUERIES.TABLET} {
      .trial-questions-content-wrapper {
        padding-top: ${DIRECTORY_PADDING.TABLET.PADDING_TOP};
      }

      .trial-questions-content {
        padding: ${DIRECTORY_PADDING.TABLET.PADDING};
      }
    }

    /* Desktop: 1200px - 1599px */
    @media ${MEDIA_QUERIES.DESKTOP} {
      .trial-questions-content-wrapper {
        padding-top: ${DIRECTORY_PADDING.DESKTOP.PADDING_TOP};
      }

      .trial-questions-content {
        padding: ${DIRECTORY_PADDING.DESKTOP.PADDING};
      }
    }

    /* Large Desktop: 1600px+ */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      .trial-questions-content-wrapper {
        padding-top: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING_TOP};
      }

      .trial-questions-content {
        padding: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
      }
    }
  `;

  return (
    <>
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      {/* All Questions Section */}
      <section className="py-16 bg-white trial-questions-content-wrapper">
        <div className="container mx-auto max-w-7xl trial-questions-content">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-slate-900">
                  All Trial Questions
                </h2>
                <div className="h-px bg-slate-200 mb-2"></div>
                <p className="text-lg text-slate-600">
                  {filteredQuestions.length} {filteredQuestions.length === 1 ? 'set' : 'sets'} found
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
                      placeholder="Search questions..."
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

                            <div>
                              <label className="text-sm font-medium text-slate-700 mb-2 block">Difficulty</label>
                              <Select
                                value={selectedDifficulty ?? ""}
                                onValueChange={(value) => setSelectedDifficulty(value || null)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="All Difficulties" />
                                </SelectTrigger>
                                <SelectContent>
                                  {difficulties.map((diff) => (
                                    <SelectItem key={diff} value={diff}>
                                      {diff}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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

                {selectedDifficulty && (
                  <Badge className="px-3 py-1.5 flex items-center gap-2 bg-slate-700 text-white">
                    {selectedDifficulty}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedDifficulty(null)}
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
          
          {filteredQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-slate-100">
                <Target className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-700">
                No questions found
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
              {filteredQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <div className="relative h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                    {/* Image Section with Overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={question.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"}
                        alt={question.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent"></div>
                      
                      {/* Top Section - Course Code */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 flex-wrap">
                        <Badge className="px-2.5 py-1 text-xs font-bold bg-sky-100 text-slate-800 border-0 hover:bg-sky-100 hover:text-slate-800">
                          {question.courseCode}
                        </Badge>
                        {question.verified && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      
                      {/* Title - Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-base font-bold text-white line-clamp-2 leading-tight">
                          {question.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>
                      <div className="space-y-1.5 mb-3 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <Target className="w-3.5 h-3.5" />
                          <span>{question.questions} questions</span>
                        </div>
                      </div>

                      {/* Stats and Actions */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => console.log('Preview:', question.id)}
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
                            onClick={() => console.log('Download:', question.id)}
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

export default TrialQuestions;
