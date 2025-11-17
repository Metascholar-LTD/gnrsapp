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
  Building2,
  BookOpen,
  Calendar
} from "lucide-react";
import { ExamPaperCard } from "@/components/ui/card-7";
import { PartneringUniversities } from "@/components/PartneringUniversities";
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

interface ExamPaper {
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

const PastQuestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock exam papers data
  const examPapers: ExamPaper[] = [
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

  // Get unique values for filters
  const universities = Array.from(new Set(examPapers.map(p => p.universityShort))).sort();
  const faculties = Array.from(new Set(examPapers.map(p => p.faculty))).sort();
  const years = Array.from(new Set(examPapers.map(p => p.year))).sort((a, b) => b - a);
  const semesters = ["1st", "2nd"];

  // Filtering logic
  const filteredPapers = examPapers.filter(paper => {
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.university.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUniversity = !selectedUniversity || paper.universityShort === selectedUniversity;
    const matchesFaculty = !selectedFaculty || paper.faculty === selectedFaculty;
    const matchesYear = !selectedYear || paper.year === selectedYear;
    const matchesSemester = !selectedSemester || paper.semester === selectedSemester;
    
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

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50" style={{ 
        paddingTop: '140px',
        paddingBottom: '80px'
      }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-center text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Past Questions Repository
            </h1>
            
            <p className="text-center text-xl mb-12 leading-relaxed max-w-3xl mx-auto text-slate-600">
              Access comprehensive exam materials from Ghana's leading universities. 
              Study smarter, perform better.
            </p>
          </div>
        </div>
      </section>

      {/* All Papers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-slate-900">
                  All Examination Papers
                </h2>
                <p className="text-lg text-slate-600">
                  {filteredPapers.length} {filteredPapers.length === 1 ? 'paper' : 'papers'} found
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-md w-full md:w-auto">
                <div className="relative bg-white rounded-2xl shadow-md border border-slate-200/60 p-1.5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50">
                      <Search className="w-4 h-4 text-slate-500" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search papers..."
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
                              value={selectedUniversity || undefined}
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
                              value={selectedFaculty || undefined}
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
                                value={selectedYear?.toString() || undefined}
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
                                value={selectedSemester || undefined}
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
            </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <span className="text-sm font-medium text-slate-600">Active Filters:</span>
                
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
          
          {filteredPapers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-slate-100">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-700">
                No papers found
              </h3>
              <p className="text-lg mb-6 text-slate-500">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
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
                  onPreview={() => console.log('Preview:', paper.id)}
                  onDownload={() => console.log('Download:', paper.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <PartneringUniversities />

      <Footer />
    </>
  );
};

export default PastQuestions;
