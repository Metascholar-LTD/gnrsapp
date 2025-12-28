import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceCard } from "@/components/ui/service-card";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ChevronLeft,
  FileText,
  Target,
  CheckCircle,
  Download,
  File
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface MCQ {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation?: string;
}

interface WrittenQuestion {
  id: string;
  question: string;
  marks: number;
}

interface SectionBDocument {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
}

interface TrialQuestionData {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  year: number;
  semester: "1st" | "2nd";
  university: string;
  universityShort: string;
  mcqs: MCQ[];
  writtenQuestions: WrittenQuestion[];
  sectionBDocuments: SectionBDocument[];
}

const QUESTIONS_PER_PAGE = 10;

// Mock questions data matching TrialQuestions.tsx
const allTrialQuestions = [
  { 
    id: "1", 
    title: "Mathematics Practice Set 1", 
    courseCode: "MATH 101",
    courseName: "Basic Mathematics",
    faculty: "Engineering", 
    year: 2024, 
    semester: "1st" as const,
    university: "University of Ghana", 
    universityShort: "UG",
  },
  { 
    id: "2", 
    title: "Chemistry Fundamentals Practice", 
    courseCode: "CHEM 101",
    courseName: "General Chemistry",
    faculty: "Physical & Biological Sciences", 
    year: 2024, 
    semester: "1st" as const,
    university: "Kwame Nkrumah University of Science and Technology", 
    universityShort: "KNUST",
  },
  { 
    id: "3", 
    title: "English Language Practice Test", 
    courseCode: "ENG 101",
    courseName: "English Language",
    faculty: "Arts & Humanities", 
    year: 2024, 
    semester: "1st" as const,
    university: "University of Cape Coast", 
    universityShort: "UCC",
  },
  { 
    id: "4", 
    title: "Physics Problem Set", 
    courseCode: "PHY 201",
    courseName: "General Physics",
    faculty: "Engineering", 
    year: 2024, 
    semester: "1st" as const,
    university: "University of Mines and Technology", 
    universityShort: "UMaT",
  },
  { 
    id: "5", 
    title: "Economics Practice Questions", 
    courseCode: "ECO 101",
    courseName: "Introduction to Economics",
    faculty: "Business & Economics", 
    year: 2024, 
    semester: "1st" as const,
    university: "University of Ghana", 
    universityShort: "UG",
  },
  { 
    id: "6", 
    title: "Computer Science Practice Set", 
    courseCode: "CS 101",
    courseName: "Introduction to Computer Science",
    faculty: "Computing & IT", 
    year: 2024, 
    semester: "1st" as const,
    university: "University of Ghana", 
    universityShort: "UG",
  },
];

const TrialQuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"mcq" | "written">("mcq");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});

  // Get the selected question data based on ID
  const selectedQuestion = allTrialQuestions.find(q => q.id === id) || allTrialQuestions[0];

  // Mock data - In production, this would come from an API
  const mockData: TrialQuestionData = {
    id: selectedQuestion.id,
    title: selectedQuestion.title,
    courseCode: selectedQuestion.courseCode,
    courseName: selectedQuestion.courseName,
    faculty: selectedQuestion.faculty,
    year: selectedQuestion.year,
    semester: selectedQuestion.semester,
    university: selectedQuestion.university,
    universityShort: selectedQuestion.universityShort,
    mcqs: [
      {
        id: "mcq-1",
        question: "What is the derivative of f(x) = x² + 3x + 2?",
        options: [
          { id: "A", label: "A", text: "2x + 3" },
          { id: "B", label: "B", text: "x² + 3" },
          { id: "C", label: "C", text: "2x + 2" },
          { id: "D", label: "D", text: "x + 3" }
        ],
        correctAnswer: "A",
        explanation: "The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant (2) is 0. Therefore, f'(x) = 2x + 3."
      },
      {
        id: "mcq-2",
        question: "Which of the following is a prime number?",
        options: [
          { id: "A", label: "A", text: "15" },
          { id: "B", label: "B", text: "17" },
          { id: "C", label: "C", text: "21" },
          { id: "D", label: "D", text: "25" }
        ],
        correctAnswer: "B",
        explanation: "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. 17 is the only prime number among the options."
      },
      {
        id: "mcq-3",
        question: "What is the value of sin(90°)?",
        options: [
          { id: "A", label: "A", text: "0" },
          { id: "B", label: "B", text: "1" },
          { id: "C", label: "C", text: "0.5" },
          { id: "D", label: "D", text: "√2/2" }
        ],
        correctAnswer: "B",
        explanation: "The sine of 90 degrees is 1. This is a fundamental trigonometric value."
      },
      {
        id: "mcq-4",
        question: "Solve for x: 2x + 5 = 13",
        options: [
          { id: "A", label: "A", text: "x = 4" },
          { id: "B", label: "B", text: "x = 5" },
          { id: "C", label: "C", text: "x = 6" },
          { id: "D", label: "D", text: "x = 7" }
        ],
        correctAnswer: "A",
        explanation: "Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4."
      },
      {
        id: "mcq-5",
        question: "What is the area of a circle with radius 5 units?",
        options: [
          { id: "A", label: "A", text: "10π" },
          { id: "B", label: "B", text: "25π" },
          { id: "C", label: "C", text: "50π" },
          { id: "D", label: "D", text: "100π" }
        ],
        correctAnswer: "B",
        explanation: "The area of a circle is πr². With radius 5, the area is π(5)² = 25π."
      },
      {
        id: "mcq-6",
        question: "What is the integral of 2x?",
        options: [
          { id: "A", label: "A", text: "x²" },
          { id: "B", label: "B", text: "x² + C" },
          { id: "C", label: "C", text: "2x²" },
          { id: "D", label: "D", text: "x" }
        ],
        correctAnswer: "B",
        explanation: "The integral of 2x is x² + C, where C is the constant of integration."
      },
      {
        id: "mcq-7",
        question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
        options: [
          { id: "A", label: "A", text: "0" },
          { id: "B", label: "B", text: "1" },
          { id: "C", label: "C", text: "2" },
          { id: "D", label: "D", text: "Undefined" }
        ],
        correctAnswer: "C",
        explanation: "Using L'Hôpital's rule or factoring, the limit simplifies to x + 1, which equals 2 when x = 1."
      },
      {
        id: "mcq-8",
        question: "What is the derivative of ln(x)?",
        options: [
          { id: "A", label: "A", text: "1/x" },
          { id: "B", label: "B", text: "x" },
          { id: "C", label: "C", text: "e^x" },
          { id: "D", label: "D", text: "ln(x)" }
        ],
        correctAnswer: "A",
        explanation: "The derivative of ln(x) is 1/x. This is a fundamental result in calculus."
      },
      {
        id: "mcq-9",
        question: "What is the value of cos(0°)?",
        options: [
          { id: "A", label: "A", text: "0" },
          { id: "B", label: "B", text: "1" },
          { id: "C", label: "C", text: "0.5" },
          { id: "D", label: "D", text: "√2/2" }
        ],
        correctAnswer: "B",
        explanation: "The cosine of 0 degrees is 1. This is a fundamental trigonometric value."
      },
      {
        id: "mcq-10",
        question: "What is the quadratic formula?",
        options: [
          { id: "A", label: "A", text: "x = (-b ± √(b² - 4ac)) / 2a" },
          { id: "B", label: "B", text: "x = (-b ± √(b² + 4ac)) / 2a" },
          { id: "C", label: "C", text: "x = (b ± √(b² - 4ac)) / 2a" },
          { id: "D", label: "D", text: "x = (-b ± √(b² - 4ac)) / a" }
        ],
        correctAnswer: "A",
        explanation: "The quadratic formula for solving ax² + bx + c = 0 is x = (-b ± √(b² - 4ac)) / 2a."
      },
      {
        id: "mcq-11",
        question: "What is the derivative of e^x?",
        options: [
          { id: "A", label: "A", text: "e^x" },
          { id: "B", label: "B", text: "xe^x" },
          { id: "C", label: "C", text: "ln(x)" },
          { id: "D", label: "D", text: "1/x" }
        ],
        correctAnswer: "A",
        explanation: "The derivative of e^x is e^x itself. This is a unique property of the exponential function."
      },
      {
        id: "mcq-12",
        question: "What is the sum of angles in a triangle?",
        options: [
          { id: "A", label: "A", text: "90°" },
          { id: "B", label: "B", text: "180°" },
          { id: "C", label: "C", text: "270°" },
          { id: "D", label: "D", text: "360°" }
        ],
        correctAnswer: "B",
        explanation: "The sum of angles in any triangle is always 180 degrees."
      }
    ],
    writtenQuestions: [
      {
        id: "written-1",
        question: "Explain the concept of limits in calculus and provide an example.",
        marks: 10
      },
      {
        id: "written-2",
        question: "Solve the following system of equations: 2x + 3y = 7 and x - y = 1",
        marks: 8
      },
      {
        id: "written-3",
        question: "Prove that the sum of angles in a triangle is 180 degrees.",
        marks: 12
      }
    ],
    sectionBDocuments: [
      {
        id: "doc-1",
        title: "Section B - Set 1",
        description: "Comprehensive written questions",
        fileSize: "2.4 MB",
        uploadDate: "2024-02-15",
        downloadCount: 1234
      },
      {
        id: "doc-2",
        title: "Section B - Set 2",
        description: "Advanced problem solving",
        fileSize: "3.1 MB",
        uploadDate: "2024-02-20",
        downloadCount: 892
      },
      {
        id: "doc-3",
        title: "Section B - Practice Papers",
        description: "Additional practice materials",
        fileSize: "1.8 MB",
        uploadDate: "2024-02-25",
        downloadCount: 567
      }
    ]
  };

  // Pagination logic
  const totalPages = Math.ceil(mockData.mcqs.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentPageQuestions = mockData.mcqs.slice(startIndex, endIndex);
  const currentPageAnswered = currentPageQuestions.every(q => answeredQuestions.has(q.id));

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (!selectedAnswers[questionId]) return;
    
    const question = mockData.mcqs.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrectAnswer = selectedAnswers[questionId] === question.correctAnswer;
    setShowResult(prev => ({ ...prev, [questionId]: true }));
    setAnsweredQuestions(prev => new Set([...prev, questionId]));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && currentPageAnswered) {
      setCurrentPage(prev => prev + 1);
      setShowResult({});
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setShowResult({});
    }
  };

  // Check if answer text is long (for vertical layout)
  const shouldUseVerticalLayout = (options: MCQ['options']) => {
    return options.some(opt => opt.text.length > 30);
  };

  const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

  return (
    <>
      <style>{`
        .trial-detail-content-wrapper {
          padding-top: 0.5rem;
        }

        .trial-detail-main-content {
          padding: 1rem;
        }

        /* Mobile: 0px - 767px */
        @media (max-width: 767px) {
          .trial-detail-content-wrapper {
            padding-top: 60px;
          }

          .trial-detail-main-content {
            padding: 1rem;
          }
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) and (max-width: 1199px) {
          .trial-detail-content-wrapper {
            padding-top: 70px;
          }

          .trial-detail-main-content {
            padding: 1.5rem;
          }
        }

        /* Desktop: 1200px - 1599px */
        @media (min-width: 1200px) and (max-width: 1599px) {
          .trial-detail-content-wrapper {
            padding-top: 120px;
          }

          .trial-detail-main-content {
            padding: 2rem;
          }
        }

        /* Large Desktop: 1600px+ */
        @media (min-width: 1600px) {
          .trial-detail-content-wrapper {
            padding-top: 120px;
          }

          .trial-detail-main-content {
            padding: 2rem clamp(2rem, 5vw, 4rem);
          }
        }
      `}</style>
      <InitScripts />
      <Spinner />
      <Navigation />
      
      <div className="min-h-screen bg-white" style={{ '--tw-ring-color': 'transparent', '--tw-ring-offset-color': 'transparent' } as React.CSSProperties}>
        <div className="trial-detail-content-wrapper">
          <main className="container mx-auto trial-detail-main-content">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/education/trial-questions")}
                className="mb-4 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trial Questions
              </Button>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-start' }}>
                <button
                  onClick={() => setActiveTab("mcq")}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: `1px solid ${activeTab === "mcq" ? '#0066cc' : '#e5e5e5'}`,
                    borderRadius: '0.5rem',
                    background: activeTab === "mcq" ? '#0066cc' : '#ffffff',
                    color: activeTab === "mcq" ? '#ffffff' : '#000000',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: fontFamily
                  }}
                >
                  <Target size={16} style={{ color: activeTab === "mcq" ? '#ffffff' : '#000000' }} />
                  <span>MCQs</span>
                  <span style={{
                    background: activeTab === "mcq" ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>{mockData.mcqs.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("written")}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: `1px solid ${activeTab === "written" ? '#0066cc' : '#e5e5e5'}`,
                    borderRadius: '0.5rem',
                    background: activeTab === "written" ? '#0066cc' : '#ffffff',
                    color: activeTab === "written" ? '#ffffff' : '#000000',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: fontFamily
                  }}
                >
                  <FileText size={16} style={{ color: activeTab === "written" ? '#ffffff' : '#000000' }} />
                  <span>Section B</span>
                  <span style={{
                    background: activeTab === "written" ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>{mockData.sectionBDocuments.length}</span>
                </button>
              </div>
            </div>

            {/* MCQ Section - FAQs Style */}
            {activeTab === "mcq" && (
              <div className="grid grid-cols-1 desktop:grid-cols-12 gap-12 items-start">
                {/* Left Column - Animation */}
                <div className="desktop:col-span-5 flex flex-col items-center">
                  <DotLottieReact
                    src="https://lottie.host/4cec0971-25c2-4494-847e-233a665c648e/VHp9KJUzBX.lottie"
                    loop
                    autoplay
                    style={{ height: '280px', width: '280px' }}
                  />
                  <div className="mt-6 text-center w-full">
                    <div className="flex items-center justify-center mb-3">
                      <Badge className="px-3 py-1 bg-slate-100 text-slate-700 border-0 hover:bg-slate-100 hover:text-slate-700" style={{ fontFamily }}>
                        {mockData.courseCode}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily }}>
                      {mockData.title}
                    </h2>
                    <p className="text-sm text-slate-600" style={{ fontFamily }}>
                      {mockData.courseName} • {mockData.faculty}
                    </p>
                  </div>
                </div>

                {/* Right Column - Questions (FAQs Style) */}
                <div className="desktop:col-span-7">
                  <div className="space-y-4">
                    {currentPageQuestions.map((mcq, index) => {
                      const isAnswered = answeredQuestions.has(mcq.id);
                      const selectedAnswer = selectedAnswers[mcq.id];
                      const showCorrect = showResult[mcq.id];
                      const isCorrect = selectedAnswer === mcq.correctAnswer;
                      const useVertical = shouldUseVerticalLayout(mcq.options);
                      const questionNumber = startIndex + index + 1;

                      return (
                        <Card key={mcq.id} className="border border-[#e6e8ef] rounded-xl focus-within:ring-0 focus-within:border-[#e6e8ef]">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={mcq.id} className="border-none">
                              <AccordionTrigger 
                                className="pl-3 pr-5 py-4 text-left bg-white hover:bg-white focus:bg-white focus:outline-none focus:ring-0 hover:no-underline [&[data-state=open]]:no-underline" 
                                style={{ 
                                  fontSize: '0.95rem', 
                                  fontWeight: 600, 
                                  color: '#0066cc', 
                                  fontFamily: fontFamily 
                                }}
                              >
                                <div className="flex items-start gap-2 flex-1 text-left">
                                  <span className="font-semibold flex-shrink-0">{questionNumber}.</span>
                                  <span className="flex-1 text-left">{mcq.question}</span>
                                  {isAnswered && (
                                    <span className={`flex-shrink-0 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                      {isCorrect ? '✓' : '✗'}
                                    </span>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent 
                                className="pl-3 pr-5 pb-4 text-[15px] desktop:text-[16px] text-[#4b5563] leading-relaxed bg-[#f8fafc]" 
                                style={{ fontFamily: fontFamily }}
                              >
                                {/* Answer Options */}
                                <div className={`${useVertical ? 'space-y-2' : 'grid grid-cols-2 gap-3'} mt-2`}>
                                  {mcq.options.map((option) => {
                                    const isSelected = selectedAnswer === option.id;
                                    const isCorrectOption = option.id === mcq.correctAnswer;
                                    const isWrongSelected = showCorrect && isSelected && !isCorrectOption;

                                    return (
                                      <button
                                        key={option.id}
                                        onClick={() => !isAnswered && handleAnswerSelect(mcq.id, option.id)}
                                        disabled={isAnswered}
                                        className={`text-left p-3 rounded-lg border-2 transition-all ${
                                          isSelected
                                            ? showCorrect && isCorrectOption
                                              ? "border-green-500 bg-green-50"
                                              : showCorrect && isWrongSelected
                                                ? "border-red-500 bg-red-50"
                                                : "border-blue-500 bg-blue-50"
                                            : showCorrect && isCorrectOption
                                              ? "border-green-500 bg-green-50"
                                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                                        } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className={`font-semibold text-sm ${
                                            isSelected || (showCorrect && isCorrectOption)
                                              ? "text-slate-900"
                                              : "text-slate-600"
                                          }`}>
                                            {option.label}.
                                          </span>
                                          <span className={`flex-1 text-sm ${
                                            isSelected || (showCorrect && isCorrectOption)
                                              ? "text-slate-900 font-medium"
                                              : "text-slate-700"
                                          }`}>
                                            {option.text}
                                          </span>
                                          {showCorrect && isCorrectOption && (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                          )}
                                          {showCorrect && isWrongSelected && (
                                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Submit Button */}
                                {!isAnswered && selectedAnswer && (
                                  <div className="mt-4">
                                    <Button
                                      onClick={() => handleSubmitAnswer(mcq.id)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                    >
                                      Submit Answer
                                    </Button>
                                  </div>
                                )}

                                {/* Result and Explanation */}
                                <AnimatePresence>
                                  {showCorrect && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className={`mt-4 p-3 rounded-lg ${
                                        isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        {isCorrect ? (
                                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                          <p className={`text-sm font-semibold mb-1 ${
                                            isCorrect ? "text-green-800" : "text-red-800"
                                          }`}>
                                            {isCorrect ? "Correct!" : "Incorrect"}
                                          </p>
                                          {mcq.explanation && (
                                            <p className={`text-xs ${
                                              isCorrect ? "text-green-700" : "text-red-700"
                                            }`}>
                                              {mcq.explanation}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="border-slate-300"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <span className="text-sm text-slate-600" style={{ fontFamily }}>
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || !currentPageAnswered}
                      className={`${currentPageAnswered ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {!currentPageAnswered && currentPageQuestions.some(q => !answeredQuestions.has(q.id)) && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800" style={{ fontFamily }}>
                        Please answer all questions on this page before proceeding to the next page.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Written Section */}
            {activeTab === "written" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily }}>
                    Section B - Written Questions
                  </h2>
                  <p className="text-sm text-slate-600" style={{ fontFamily }}>
                    Download question documents to solve at your own pace
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {mockData.sectionBDocuments.map((doc, index) => {
                    const variants = ["blue", "default", "gray", "red"] as const;
                    const variant = variants[index % variants.length] || "default";
                    const images = [
                      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80"
                    ];
                    
                    return (
                      <ServiceCard
                        key={doc.id}
                        title={doc.title}
                        href={`#download-${doc.id}`}
                        imgSrc={images[index % images.length]}
                        imgAlt={doc.description}
                        variant={variant}
                        className="min-h-[160px] cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Download:', doc.id);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TrialQuestionDetail;
