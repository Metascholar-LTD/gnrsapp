import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  File,
  Trophy,
  AlertTriangle,
  RotateCcw
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
  fileUrl?: string;
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

interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  passed: boolean;
  forcedRetake: boolean;
}

const TrialQuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"mcq" | "written">("mcq");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<TrialQuestionData | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch question data from database
  useEffect(() => {
    if (id) {
      fetchQuestionData(id);
    }
  }, [id]);

  const fetchQuestionData = async (questionId: string) => {
    setLoading(true);
    try {
      // Fetch main question data
      const { data: questionData, error: questionError } = await supabase
        .from('trial_questions' as any)
        .select('*')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      if (!questionData) {
        navigate("/education/trial-questions");
        return;
      }

      const question = questionData as any;

      // Fetch MCQs
      const { data: mcqsData, error: mcqsError } = await supabase
        .from('trial_question_mcqs' as any)
        .select('*')
        .eq('trial_question_id', questionId)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (mcqsError) throw mcqsError;

      // Fetch Section B documents
      const { data: sectionBData, error: sectionBError } = await supabase
        .from('trial_question_section_b' as any)
        .select('*')
        .eq('trial_question_id', questionId)
        .order('created_at', { ascending: true });

      if (sectionBError) throw sectionBError;

      // Transform data
      const transformedData: TrialQuestionData = {
        id: question.id,
        title: question.title || "",
        courseCode: question.course_code || "",
        courseName: question.course_name || "",
        faculty: question.faculty || "",
        year: question.year || new Date().getFullYear(),
        semester: (question.semester || "1st") as "1st" | "2nd",
        university: question.university || "",
        universityShort: question.university_short || "",
        mcqs: (mcqsData || []).map((item: any) => ({
          id: item.id,
          question: item.question || "",
          options: item.options || [
            { id: "A", label: "A", text: "" },
            { id: "B", label: "B", text: "" },
            { id: "C", label: "C", text: "" },
            { id: "D", label: "D", text: "" },
          ],
          correctAnswer: item.correct_answer || "",
          explanation: item.explanation || "",
        })),
        writtenQuestions: [], // Not used in current implementation
        sectionBDocuments: (sectionBData || []).map((item: any) => ({
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          fileUrl: item.file_url || "",
          fileSize: typeof item.file_size === 'number' 
            ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` 
            : (item.file_size || "0 MB"),
          uploadDate: item.upload_date || item.created_at?.split('T')[0] || "",
          downloadCount: item.downloads || item.download_count || 0,
        })),
      };

      setQuestionData(transformedData);

      // Increment views
      await supabase
        .from('trial_questions' as any)
        .update({ views: (question.views || 0) + 1 })
        .eq('id', questionId);
    } catch (error: any) {
      console.error("Error fetching question data:", error);
      navigate("/education/trial-questions");
    } finally {
      setLoading(false);
    }
  };

  // Handle Section B document download
  const handleSectionBDownload = async (docId: string, fileUrl: string) => {
    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment download count
      const doc = questionData?.sectionBDocuments.find(d => d.id === docId);
      if (doc) {
        await supabase
          .from('trial_question_section_b' as any)
          .update({ 
            downloads: (doc.downloadCount || 0) + 1,
            download_count: (doc.downloadCount || 0) + 1
          })
          .eq('id', docId);

        // Update local state
        setQuestionData(prev => prev ? {
          ...prev,
          sectionBDocuments: prev.sectionBDocuments.map(d => 
            d.id === docId ? { ...d, downloadCount: (d.downloadCount || 0) + 1 } : d
          )
        } : null);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  // Use fetched data (compute before early return)
  const mockData: TrialQuestionData | null = questionData;

  // Pagination logic (computed before early return, but safe with null checks)
  const totalPages = mockData ? Math.ceil(mockData.mcqs.length / QUESTIONS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentPageQuestions = mockData?.mcqs.slice(startIndex, endIndex) || [];
  const currentPageAnswered = currentPageQuestions.every(q => answeredQuestions.has(q.id));
  
  // Check if all questions are answered (computed value, not a hook)
  const allQuestionsAnswered = mockData 
    ? mockData.mcqs.length > 0 && mockData.mcqs.every(q => answeredQuestions.has(q.id))
    : false;
  
  // Check if we're on the last page
  const isLastPage = currentPage === totalPages;

  if (loading || !questionData) {
    return (
      <>
        <InitScripts />
        <Spinner />
        <Navigation />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-slate-100">
              <Target className="w-12 h-12 text-slate-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-700">
              Loading question...
            </h3>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

  // Calculate quiz results
  const calculateResults = (): QuizResults => {
    if (!mockData || mockData.mcqs.length === 0) {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        scorePercentage: 0,
        passed: false,
        forcedRetake: false,
      };
    }

    let correct = 0;
    let incorrect = 0;

    mockData.mcqs.forEach(mcq => {
      const userAnswer = selectedAnswers[mcq.id];
      if (userAnswer === mcq.correctAnswer) {
        correct++;
      } else if (userAnswer) {
        incorrect++;
      }
    });

    const total = mockData.mcqs.length;
    const scorePercentage = total > 0 ? (correct / total) * 100 : 0;
    const passed = scorePercentage >= 50;
    const forcedRetake = scorePercentage < 40; // Abysmally poor

    return {
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      scorePercentage: Math.round(scorePercentage * 100) / 100,
      passed,
      forcedRetake,
    };
  };

  // Save attempt to database
  const saveAttemptToDatabase = async (results: QuizResults) => {
    if (!id) return;

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('trial_question_attempts' as any)
        .insert({
          trial_question_id: id,
          user_id: user?.id || null,
          answers: selectedAnswers,
          total_questions: results.totalQuestions,
          correct_answers: results.correctAnswers,
          incorrect_answers: results.incorrectAnswers,
          score_percentage: results.scorePercentage,
          passed: results.passed,
          forced_retake: results.forcedRetake,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error saving attempt:", error);
      }
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  };

  // Handle finish quiz
  const handleFinishQuiz = async () => {
    if (!allQuestionsAnswered || !id) return;

    setIsSubmitting(true);
    try {
      const results = calculateResults();
      setQuizResults(results);
      
      // Save attempt to database
      await saveAttemptToDatabase(results);
      
      // Show results modal
      setShowResultsModal(true);
    } catch (error) {
      console.error("Error finishing quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    // Reset all state
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setCurrentPage(1);
    setShowResult({});
    setShowResultsModal(false);
    setQuizResults(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && currentPageAnswered) {
      setCurrentPage(prev => prev + 1);
      setShowResult({});
    } else if (isLastPage && allQuestionsAnswered) {
      // If on last page and all questions answered, trigger finish
      handleFinishQuiz();
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
                      onClick={isLastPage && allQuestionsAnswered ? handleFinishQuiz : handleNextPage}
                      disabled={!currentPageAnswered || (isLastPage && !allQuestionsAnswered) || isSubmitting}
                      className={`${currentPageAnswered && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                    >
                      {isSubmitting ? (
                        <>
                          Finishing...
                        </>
                      ) : isLastPage && allQuestionsAnswered ? (
                        <>
                          Finish
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
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
                        href={doc.id}
                        imgSrc={images[index % images.length]}
                        imgAlt={doc.description}
                        variant={variant}
                        className="min-h-[160px] cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          // Find the document with fileUrl from database
                          const sectionBDoc = questionData.sectionBDocuments.find(d => d.id === doc.id);
                          if (sectionBDoc && sectionBDoc.fileUrl) {
                            handleSectionBDownload(doc.id, sectionBDoc.fileUrl);
                          }
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

      {/* Results Modal */}
      <Dialog 
        open={showResultsModal} 
        onOpenChange={(open) => {
          // Prevent closing modal if forced retake is required
          if (!open && quizResults?.forcedRetake) {
            return;
          }
          setShowResultsModal(open);
        }}
      >
        <DialogContent 
          className={`sm:max-w-[500px] ${quizResults?.forcedRetake ? '[&>button]:hidden' : ''}`}
          onInteractOutside={(e) => {
            // Prevent closing modal when clicking outside if forced retake is required
            if (quizResults?.forcedRetake) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing modal with Escape key if forced retake is required
            if (quizResults?.forcedRetake) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {quizResults?.forcedRetake ? (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                  <span>Quiz Results</span>
                </div>
              ) : quizResults?.passed ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Trophy className="w-6 h-6" />
                  <span>Congratulations!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <XCircle className="w-6 h-6" />
                  <span>Quiz Results</span>
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              {quizResults?.forcedRetake ? (
                <span className="text-red-700 font-semibold block">
                  Your performance is abysmally poor. You must retake this quiz.
                </span>
              ) : quizResults?.passed ? (
                <span className="text-green-700 font-semibold block">
                  You passed! Well done!
                </span>
              ) : (
                <span className="text-amber-700 font-semibold block">
                  You didn't pass, but you can retake the quiz to improve your score.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Score Display */}
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${
                quizResults?.forcedRetake ? 'text-red-600' :
                quizResults?.passed ? 'text-green-600' : 'text-amber-600'
              }`}>
                {quizResults?.scorePercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-slate-600">Your Score</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{quizResults?.totalQuestions}</div>
                <div className="text-xs text-slate-600 mt-1">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{quizResults?.correctAnswers}</div>
                <div className="text-xs text-slate-600 mt-1">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{quizResults?.incorrectAnswers}</div>
                <div className="text-xs text-slate-600 mt-1">Incorrect</div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end">
            {quizResults?.forcedRetake ? (
              <>
                <button
                  onClick={handleRetakeQuiz}
                  className="group relative inline-block text-sm font-semibold text-red-600 transition-colors duration-300 hover:text-red-700"
                >
                  <motion.span
                    className="relative inline-block pb-1 flex items-center gap-1.5"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Quiz (Required)
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:bg-red-700"
                      style={{
                        width: 'calc(100% + 14px)',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                      }}
                    />
                  </motion.span>
                </button>
              </>
            ) : quizResults?.passed ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/education/trial-questions")}
                  className="w-full sm:w-auto"
                >
                  Back to Questions
                </Button>
                <button
                  onClick={handleRetakeQuiz}
                  className="group relative inline-block text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700 w-full sm:w-auto"
                >
                  <motion.span
                    className="relative inline-block pb-1 flex items-center gap-1.5"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Quiz
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                      style={{
                        width: 'calc(100% + 14px)',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                      }}
                    />
                  </motion.span>
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/education/trial-questions")}
                  className="w-full sm:w-auto"
                >
                  Back to Questions
                </Button>
                <button
                  onClick={handleRetakeQuiz}
                  className="group relative inline-block text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700 w-full sm:w-auto"
                >
                  <motion.span
                    className="relative inline-block pb-1 flex items-center gap-1.5"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Quiz
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                      style={{
                        width: 'calc(100% + 14px)',
                        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                      }}
                    />
                  </motion.span>
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrialQuestionDetail;
