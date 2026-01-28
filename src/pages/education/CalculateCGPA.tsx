import { ReactNode, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  Calculator,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CourseEntry = {
  id: string;
  course: string;
  credits: number;
  grade: string; // Can be letter grade (A, B+, etc.) or percentage for CWA
  gradePoints?: number; // For CWA, this will be the percentage value
};

const gradeScaleCGPA = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0,
};

// CWA grade scale - maps letter grades to their midpoint values
const gradeScaleCWA = {
  A: 85.0, // Midpoint of 70.00-100
  B: 65.0, // Midpoint of 60.00-69.99
  C: 55.0, // Midpoint of 50.00-59.99
  D: 45.0, // Midpoint of 40.00-49.99
  F: 20.0, // Midpoint of 0.00-39.99 (adjusted to avoid overlap with D)
};

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const getDefaultRows = (gradingSystem: 'CGPA' | 'SGPA' | 'CWA'): CourseEntry[] => {
  if (gradingSystem === 'CWA') {
    return [
      { id: "row-1", course: "Advanced Calculus", credits: 3, grade: "A" },
      { id: "row-2", course: "Thermodynamics", credits: 2, grade: "B" },
      { id: "row-3", course: "Technical Communication", credits: 2, grade: "A" },
    ];
  }
  return [
    { id: "row-1", course: "Advanced Calculus", credits: 3, grade: "A" },
    { id: "row-2", course: "Thermodynamics", credits: 2, grade: "B+" },
    { id: "row-3", course: "Technical Communication", credits: 2, grade: "A" },
  ];
};

const levels = [
  "Level 100",
  "Level 200",
  "Level 300",
  "Level 400",
  "Graduate",
];

interface SetupData {
  schoolName: string;
  program: string;
  level: string;
  gradingSystem: 'CGPA' | 'SGPA' | 'CWA';
}

type HeroButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

const heroButtonClasses =
  "group relative inline-flex items-center gap-1 sm:gap-1.5 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-2 border-white/40 bg-gradient-to-br from-white/45 via-white/25 to-white/40 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-900 shadow-md transition-all duration-500 hover:scale-[1.02] hover:shadow-white/30 active:scale-95";

const HeroButton = ({ onClick, children }: HeroButtonProps) => (
  <button type="button" onClick={onClick} className={heroButtonClasses}>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-slate-900">{children}</span>
  </button>
);

// University Autocomplete Component
const UniversityAutocomplete = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (value.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('name')
          .ilike('name', `%${value.trim()}%`)
          .limit(10);

        if (error) throw error;

        const universityNames = data?.map(u => u.name) || [];
        setSuggestions(universityNames);
        setShowSuggestions(universityNames.length > 0);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchUniversities, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (university: string) => {
    onChange(university);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-semibold text-[#374151] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        School Name
      </label>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder="Start typing to search universities..."
        className="h-12 border-[#e5e7eb] focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((university, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(university)}
              className="w-full text-left px-4 py-2 hover:bg-[#f9fafb] transition-colors flex items-center justify-between"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="text-sm text-[#111827]">{university}</span>
              {value === university && (
                <Check className="w-4 h-4 text-[#696cff]" />
              )}
            </button>
          ))}
        </motion.div>
      )}
      {isLoading && (
        <div className="absolute right-3 top-[38px] text-[#9ca3af] text-sm">
          Searching...
        </div>
      )}
    </div>
  );
};

const CalculateCGPA = () => {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(true);
  const [setupData, setSetupData] = useState<SetupData>({
    schoolName: "",
    program: "",
    level: "",
    gradingSystem: "CGPA",
  });
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<CourseEntry[]>([]);

  const handleStartCalculator = () => {
    if (!setupData.schoolName.trim()) {
      setError("Please enter your school name");
      return;
    }
    if (!setupData.program) {
      setError("Please enter your program");
      return;
    }
    if (!setupData.level) {
      setError("Please select your level");
      return;
    }
    if (!setupData.gradingSystem) {
      setError("Please select a grading system");
      return;
    }
    
    setError("");
    setCourses(getDefaultRows(setupData.gradingSystem));
    setShowSetup(false);
  };

  const updateCourse = (id: string, key: keyof CourseEntry, value: string) => {
    setCourses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: key === "credits" ? Number(value) || 0 : value,
            }
          : item
      )
    );
  };

  const addCourse = () => {
    const defaultGrade = setupData.gradingSystem === "CWA" ? "B" : "B";
    setCourses((prev) => [
      ...prev,
      { 
        id: createId(), 
        course: `Course ${prev.length + 1}`, 
        credits: 3, 
        grade: defaultGrade,
      },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const getGradeScale = () => {
    if (setupData.gradingSystem === "CGPA" || setupData.gradingSystem === "SGPA") {
      return gradeScaleCGPA;
    } else if (setupData.gradingSystem === "CWA") {
      return gradeScaleCWA;
    }
    return null;
  };

  const totalCredits = courses.reduce((sum, item) => sum + (item.credits || 0), 0);
  
  const calculateTotalPoints = () => {
    const scale = getGradeScale();
    if (!scale) return 0;
    
    return courses.reduce(
      (sum, item) => {
        const gradeValue = scale[item.grade as keyof typeof scale] || 0;
        return sum + (item.credits || 0) * gradeValue;
      },
      0
    );
  };

  const totalPoints = calculateTotalPoints();
  
  const calculateResult = () => {
    if (totalCredits === 0) return "0.00";
    
    if (setupData.gradingSystem === "CWA") {
      // CWA is already a percentage, so just divide total points by total credits
      return (totalPoints / totalCredits).toFixed(2);
    } else {
      // CGPA/SGPA: total quality points / total credits
      return (totalPoints / totalCredits).toFixed(2);
    }
  };

  const result = calculateResult();
  const resultLabel = setupData.gradingSystem === "CGPA" ? "CGPA" : setupData.gradingSystem === "SGPA" ? "SGPA" : "CWA";

  // Setup Modal
  if (showSetup) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dsypclqxk/image/upload/v1769610021/fcf211c9ca318241e5e66e07ed049bb7_cojwet.jpg)',
            filter: 'blur(8px)',
            transform: 'scale(1.1)',
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-8 min-[768px]:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl min-[768px]:text-3xl font-bold text-[#111827] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Set Up Your Calculator
              </h2>
              <p className="text-[#6b7280] text-sm min-[768px]:text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Tell us about your academic program
              </p>
            </div>

            <div className="space-y-5">
              {/* School Name with Autocomplete */}
              <UniversityAutocomplete
                value={setupData.schoolName}
                onChange={(value) => {
                  setSetupData({ ...setupData, schoolName: value });
                  setError("");
                }}
              />

              {/* Program */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Program
                </label>
                <Input
                  type="text"
                  value={setupData.program}
                  onChange={(e) => {
                    setSetupData({ ...setupData, program: e.target.value });
                    setError("");
                  }}
                  placeholder="e.g., BSc in Computer Engineering"
                  className="h-12 border-[#e5e7eb] focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Level
                </label>
                <Select
                  value={setupData.level}
                  onValueChange={(value) => {
                    setSetupData({ ...setupData, level: value });
                    setError("");
                  }}
                >
                  <SelectTrigger className="h-12 border-[#e5e7eb] focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grading System */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Grading System
                </label>
                <Select
                  value={setupData.gradingSystem}
                  onValueChange={(value) => {
                    setSetupData({ ...setupData, gradingSystem: value as 'CGPA' | 'SGPA' | 'CWA' });
                    setError("");
                  }}
                >
                  <SelectTrigger className="h-12 border-[#e5e7eb] focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <SelectValue placeholder="Select grading system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CGPA">CGPA (Cumulative Grade Point Average)</SelectItem>
                    <SelectItem value="SGPA">SGPA (Semester Grade Point Average)</SelectItem>
                    <SelectItem value="CWA">CWA (Cumulative Weighted Average)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 text-center"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {error}
                </motion.p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/education/cgpa-calculator")}
                  className="flex-1 border-[#e5e7eb] hover:bg-[#f9fafb]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleStartCalculator}
                  disabled={!setupData.schoolName.trim() || !setupData.program || !setupData.level}
                  className="flex-1 bg-[#1f2937] hover:bg-[#111827] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Start Calculator
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Calculator Interface
  return (
    <div className="fixed inset-0 z-50 bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=2000&q=80"
          alt="Students collaborating"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#17141e]/85" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/10 backdrop-blur-md">
        <div className="flex h-14 min-[1200px]:h-16 items-center justify-between px-3 min-[768px]:px-4 min-[1200px]:px-6">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-2 min-[768px]:gap-3 min-[1200px]:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/education/cgpa-calculator")}
              className="h-9 w-9 min-[1200px]:h-10 min-[1200px]:w-10 text-white hover:text-white/80 hover:bg-white/10 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 min-[1200px]:h-5 min-[1200px]:w-5" />
            </Button>
            <div className="flex items-center gap-2 min-[768px]:gap-3 min-w-0 flex-1">
              {/* Icon */}
              <div className="hidden min-[768px]:flex h-8 w-8 min-[1200px]:h-10 min-[1200px]:w-10 items-center justify-center rounded-lg min-[1200px]:rounded-xl bg-white/20 flex-shrink-0">
                <Calculator className="h-4 w-4 min-[1200px]:h-5 min-[1200px]:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm min-[768px]:text-base min-[1200px]:text-lg font-semibold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {setupData.gradingSystem} Calculator
                </h1>
                {/* Subtitle */}
                <p className="hidden min-[1200px]:block text-sm text-white/80 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {setupData.schoolName} • {setupData.program} • {setupData.level}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 h-[calc(100vh-3.5rem)] min-[1200px]:h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto px-4 py-6 min-[768px]:py-8 min-[1200px]:py-10 max-w-6xl">
          <div
            className="mx-auto max-w-4xl rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border border-white/20 bg-white/95 p-4 sm:p-5 md:p-6 lg:p-8 shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur text-slate-900"
          >
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant="outline"
                onClick={() => setCourses(getDefaultRows(setupData.gradingSystem))}
                className="border-slate-200 hover:bg-slate-50"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Reset
              </Button>
              <Button
                onClick={addCourse}
                className="bg-[#696cff] hover:bg-[#5a5fef] text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="grid grid-cols-[2fr_1fr_1fr_auto] sm:grid-cols-[3fr_1fr_1fr_auto] gap-2 sm:gap-3 md:gap-4 rounded-xl sm:rounded-2xl bg-slate-50/70 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="text-slate-700 truncate">Course title</span>
              <span className="text-slate-700 text-center sm:text-left">Credits</span>
              <span className="text-slate-700 text-center sm:text-left">Grade</span>
              <span />
            </div>
            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="grid grid-cols-[2fr_1fr_1fr_auto] sm:grid-cols-[3fr_1fr_1fr_auto] gap-2 sm:gap-3 md:gap-4 rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm"
                  data-animate="fade-up"
                  data-delay="1"
                >
                  <Input
                    value={course.course}
                    onChange={(e) => updateCourse(course.id, "course", e.target.value)}
                    placeholder="Course name"
                    className="h-10 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 bg-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                    className="h-10 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 bg-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  <Select
                    value={course.grade}
                    onValueChange={(value) => updateCourse(course.id, "grade", value)}
                  >
                    <SelectTrigger className="h-10 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 text-sm sm:text-base text-slate-900 bg-white [&>span]:text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {setupData.gradingSystem === "CWA" ? (
                        // CWA grades: A, B, C, D, F with mark ranges
                        Object.entries(gradeScaleCWA).map(([letter]) => {
                          const gradeInfo: Record<string, string> = {
                            A: "A (70.00 - 100) - Excellent",
                            B: "B (60.00 - 69.99) - Very Good",
                            C: "C (50.00 - 59.99) - Good",
                            D: "D (40.00 - 49.99) - Pass",
                            F: "F (0.00 - 39.99) - Fail",
                          };
                          return (
                            <SelectItem key={letter} value={letter} className="text-slate-900 focus:bg-slate-100 focus:text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {gradeInfo[letter] || letter}
                            </SelectItem>
                          );
                        })
                      ) : (
                        // CGPA/SGPA grades: A, B+, B, C+, C, D+, D, F
                        Object.entries(gradeScaleCGPA).map(([letter]) => (
                          <SelectItem key={letter} value={letter} className="text-slate-900 focus:bg-slate-100 focus:text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {letter}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl text-slate-600 hover:text-red-600 p-0" onClick={() => removeCourse(course.id)} disabled={courses.length === 1}>
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {[
                { label: "Total credits", value: totalCredits },
                { 
                  label: setupData.gradingSystem === "CWA" ? "Total weighted points" : "Total quality points", 
                  value: totalPoints.toFixed(2) 
                },
                { 
                  label: `Current ${resultLabel}`, 
                  value: setupData.gradingSystem === "CWA" ? `${result}%` : result 
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl sm:rounded-2xl border border-slate-100 bg-white/80 p-4 sm:p-5 shadow-inner transition-transform hover:-translate-y-1"
                  data-animate="fade-up"
                  data-delay="2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-600 font-semibold">{metric.label}</p>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculateCGPA;
