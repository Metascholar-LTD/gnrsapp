import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Brain,
  Trophy,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAITutor } from '@/hooks/useAITutor';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Question {
  type: 'multiple_choice' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  concept: string;
}

interface QuizModeProps {
  topic: string;
  subtopic: string;
  difficulty: string;
  learningStyle: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizMode({
  topic,
  subtopic,
  difficulty,
  learningStyle,
  onComplete,
  onBack
}: QuizModeProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [shortAnswerText, setShortAnswerText] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestionCountInput, setShowQuestionCountInput] = useState(true);
  const [questionCount, setQuestionCount] = useState<number | ''>(10);
  const [error, setError] = useState('');

  const { generateQuestions, checkAnswer, isLoading } = useAITutor();

  const handleStartQuiz = async () => {
    const count = typeof questionCount === 'number' ? questionCount : parseInt(String(questionCount));
    if (!count || count < 1 || count > 20) {
      setError('Please enter a number between 1 and 20');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setShowQuestionCountInput(false);
    
    const result = await generateQuestions({
      topic,
      subtopic,
      difficulty,
      learningStyle,
      count: count
    });
    
    // Ensure we have the correct number of questions
    const finalQuestions = result.slice(0, count);
    setQuestions(finalQuestions);
    setIsGenerating(false);
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = async (answer: string) => {
    if (showFeedback || isLoading) return;
    
    setSelectedAnswer(answer);
    
    const result = await checkAnswer(
      currentQuestion.question,
      currentQuestion.options,
      currentQuestion.correctAnswer,
      answer
    );

    setIsCorrect(result.isCorrect);
    setFeedback(result.feedback);
    setShowFeedback(true);

    if (result.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleShortAnswerSubmit = async () => {
    if (!shortAnswerText.trim() || showFeedback || isLoading) return;
    
    const result = await checkAnswer(
      currentQuestion.question,
      currentQuestion.options,
      currentQuestion.correctAnswer,
      shortAnswerText.trim()
    );

    setIsCorrect(result.isCorrect);
    setFeedback(result.feedback);
    setShowFeedback(true);

    if (result.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShortAnswerText('');
      setShowFeedback(false);
      setFeedback('');
    } else {
      setIsComplete(true);
    }
  };

  // Question count input screen
  if (showQuestionCountInput) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#fafafa] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-8 min-[768px]:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 min-[768px]:w-20 min-[768px]:h-20 rounded-2xl bg-[#f3f4f6] mb-4">
                <Brain className="w-8 h-8 min-[768px]:w-10 min-[768px]:h-10 text-[#6b7280]" />
              </div>
              <h2 className="text-2xl min-[768px]:text-3xl font-bold text-[#111827] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Set Up Your Quiz
              </h2>
              <p className="text-[#6b7280] text-sm min-[768px]:text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                How many questions would you like to answer?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Number of Questions
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={questionCount === '' ? '' : questionCount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setQuestionCount('');
                      setError('');
                    } else {
                      const numValue = parseInt(inputValue, 10);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
                        setQuestionCount(numValue);
                        setError('');
                      } else {
                        setError('Please enter a number between 1 and 20');
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setQuestionCount(10);
                    }
                  }}
                  className="h-12 text-center text-lg font-semibold border-[#e5e7eb] focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <p className="mt-2 text-xs text-[#9ca3af]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Enter a number between 1 and 20
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartQuiz}
                  disabled={!questionCount || (typeof questionCount === 'number' && (questionCount < 1 || questionCount > 20))}
                  className="flex-1 bg-[#1f2937] hover:bg-[#111827] text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#6b7280]" />
          <h2 className="mt-4 text-xl font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Preparing your quiz...
          </h2>
          <p className="mt-2 text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Creating {questionCount} personalized questions about {topic}
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 bg-[#fafafa]">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-[#d1d5db]" />
          <h2 className="mt-4 text-xl font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No questions available
          </h2>
          <p className="mt-2 text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Unable to generate questions for this topic
          </p>
          <Button onClick={onBack} className="mt-4 bg-[#1f2937] hover:bg-[#111827] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Go back to learning
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="flex h-full flex-col items-center justify-center p-6 bg-[#fafafa]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className={cn(
            "mx-auto flex h-24 w-24 items-center justify-center rounded-full",
            passed ? "bg-[#ecfdf5]" : "bg-[#fef3c7]"
          )}>
            {passed ? (
              <Trophy className="h-12 w-12 text-[#059669]" />
            ) : (
              <Brain className="h-12 w-12 text-[#d97706]" />
            )}
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {passed ? 'Great job!' : 'Keep practicing!'}
          </h2>
          
          <p className="mt-2 text-lg text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            You scored <span className="font-bold text-[#059669]">{score}/{questions.length}</span> ({percentage}%)
          </p>

          <p className="mt-4 text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {passed 
              ? "You've demonstrated a solid understanding of this topic. Ready to move on!"
              : "Don't worry! Review the material and try again. Every attempt helps you learn."}
          </p>

          <div className="mt-8 flex gap-3 justify-center">
            <Button variant="outline" onClick={onBack} className="border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Back to learning
            </Button>
            <Button onClick={() => onComplete(percentage)} className="bg-[#1f2937] hover:bg-[#111827] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {passed ? 'Continue' : 'Try again later'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .quiz-mode {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .quiz-mode .explanation-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }

        .quiz-mode .prose {
          color: #374151;
          line-height: 1.7;
        }

        .quiz-mode .prose p {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.7;
        }

        .quiz-mode .prose strong {
          font-weight: 600;
          color: #111827;
        }

        .quiz-mode .prose ul,
        .quiz-mode .prose ol {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }

        .quiz-mode .prose li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          color: #374151;
          line-height: 1.7;
        }
      `}</style>
      <div className="quiz-mode flex h-full flex-col bg-[#fafafa]">
        {/* Header */}
        <div className="border-b border-[#e5e7eb] bg-white px-4 min-[768px]:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-sm font-medium text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-semibold text-[#059669]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Score: {score}/{currentIndex + (showFeedback ? 1 : 0)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 flex justify-center">
            <div className="w-full min-[768px]:w-3/4 min-[1200px]:w-1/2 max-w-md h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
              <motion.div
                className="h-full bg-[#059669]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question - Desktop: flex layout with Next button on right */}
        <div className="flex-1 overflow-y-auto p-4 min-[768px]:p-6 min-[1200px]:p-8">
          <div className="mx-auto min-[1200px]:max-w-5xl min-[1200px]:px-8">
            <div className="flex flex-col min-[1200px]:flex-row gap-6 min-[1200px]:gap-8">
              {/* Left: Question Content */}
              <div className="flex-1 min-w-0 min-[1200px]:max-w-3xl">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 min-[768px]:space-y-8"
                >
                  {/* Difficulty badge */}
                  <div className="flex gap-2">
                    <span className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold",
                      currentQuestion.difficulty === 'easy' && "bg-[#ecfdf5] text-[#059669]",
                      currentQuestion.difficulty === 'medium' && "bg-[#fef3c7] text-[#d97706]",
                      currentQuestion.difficulty === 'hard' && "bg-[#fee2e2] text-[#dc2626]"
                    )} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="rounded-full bg-[#f3f4f6] px-3 py-1.5 text-xs font-semibold text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {currentQuestion.concept}
                    </span>
                  </div>

                  {/* Question text */}
                  <h3 className="text-lg min-[768px]:text-xl min-[1200px]:text-xl font-bold text-[#111827] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {currentQuestion.question}
                  </h3>

                  {/* Answer options - Multiple Choice */}
                  {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const letter = option.charAt(0);
                        const isSelected = selectedAnswer === letter;
                        const isCorrectAnswer = currentQuestion.correctAnswer === letter;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(letter)}
                            disabled={showFeedback || isLoading}
                            className={cn(
                              "w-full rounded-xl border-2 p-4 min-[768px]:p-5 text-left transition-all",
                              !showFeedback && !isSelected && "border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#fafafa]",
                              !showFeedback && isSelected && "border-[#059669] bg-[#ecfdf5]",
                              showFeedback && isCorrectAnswer && "border-[#059669] bg-[#ecfdf5]",
                              showFeedback && isSelected && !isCorrectAnswer && "border-[#dc2626] bg-[#fee2e2]"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "flex h-10 w-10 min-[768px]:h-12 min-[768px]:w-12 items-center justify-center rounded-full font-semibold text-sm min-[768px]:text-base transition-all",
                                !showFeedback && "bg-[#f3f4f6] text-[#6b7280]",
                                showFeedback && isCorrectAnswer && "bg-[#059669] text-white",
                                showFeedback && isSelected && !isCorrectAnswer && "bg-[#dc2626] text-white"
                              )}>
                                {showFeedback && isCorrectAnswer ? (
                                  <Check className="h-5 w-5 min-[768px]:h-6 min-[768px]:w-6" />
                                ) : showFeedback && isSelected && !isCorrectAnswer ? (
                                  <X className="h-5 w-5 min-[768px]:h-6 min-[768px]:w-6" />
                                ) : (
                                  letter
                                )}
                              </div>
                              <span className="text-[#374151] text-sm min-[768px]:text-base leading-relaxed flex-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {option.substring(3)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Short Answer Input */}
                  {currentQuestion.type === 'short_answer' && !showFeedback && (
                    <div className="space-y-4">
                      <Textarea
                        value={shortAnswerText}
                        onChange={(e) => setShortAnswerText(e.target.value)}
                        placeholder="Type your answer here..."
                        disabled={showFeedback || isLoading}
                        className="min-h-[120px] min-[768px]:min-h-[150px] resize-none rounded-xl border-[#e5e7eb] bg-white text-sm min-[768px]:text-base focus:border-[#9ca3af] focus:ring-2 focus:ring-[#f3f4f6] transition-all"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      />
                      <Button
                        onClick={handleShortAnswerSubmit}
                        disabled={!shortAnswerText.trim() || isLoading}
                        className="w-full min-[768px]:w-auto bg-[#1f2937] hover:bg-[#111827] text-white px-6 min-[768px]:px-8 h-11 min-[768px]:h-12 text-sm min-[768px]:text-base font-semibold"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        Done
                      </Button>
                    </div>
                  )}

                  {/* Show submitted short answer */}
                  {currentQuestion.type === 'short_answer' && showFeedback && (
                    <div className="rounded-xl border-2 border-[#e5e7eb] bg-[#fafafa] p-4 min-[768px]:p-5">
                      <p className="text-xs font-semibold text-[#6b7280] mb-2 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Your Answer
                      </p>
                      <p className="text-sm min-[768px]:text-base text-[#374151] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {shortAnswerText}
                      </p>
                    </div>
                  )}

                  {/* Feedback - Redesigned with spacious layout */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="explanation-card mt-8 p-6 min-[768px]:p-8 min-[1200px]:p-10"
                      >
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "flex-shrink-0 w-12 h-12 min-[768px]:w-14 min-[768px]:h-14 rounded-xl flex items-center justify-center",
                              isCorrect ? "bg-[#ecfdf5]" : "bg-[#fee2e2]"
                            )}>
                              {isCorrect ? (
                                <Check className="h-6 w-6 min-[768px]:h-7 min-[768px]:w-7 text-[#059669]" />
                              ) : (
                                <X className="h-6 w-6 min-[768px]:h-7 min-[768px]:w-7 text-[#dc2626]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <h4 className={cn(
                                "text-lg min-[768px]:text-xl font-bold mb-1",
                                isCorrect ? "text-[#059669]" : "text-[#dc2626]"
                              )} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {isCorrect ? 'Correct!' : 'Not quite right'}
                              </h4>
                              <p className="text-sm min-[768px]:text-base text-[#6b7280]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {isCorrect 
                                  ? "Great job! You got it right." 
                                  : "Let's review the explanation to understand better."}
                              </p>
                            </div>
                          </div>

                          {/* Explanation Content */}
                          <div className="prose prose-slate max-w-none pt-4 border-t border-[#e5e7eb]">
                            <ReactMarkdown>{feedback}</ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Right: Next Button - Desktop Only */}
              {showFeedback && (
                <div className="hidden min-[1200px]:flex flex-col justify-start pt-20">
                  <Button 
                    onClick={handleNext} 
                    className="gap-2 bg-[#1f2937] hover:bg-[#111827] text-white px-6 px-8 h-12 text-base font-semibold sticky top-8"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="h-5 w-5" />
                      </>
                    ) : (
                      'See Results'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Next Question Button - Mobile/Tablet Only */}
        {showFeedback && (
          <div className="min-[1200px]:hidden border-t border-[#e5e7eb] bg-white px-4 min-[768px]:px-6 py-4 min-[768px]:py-5">
            <div className="mx-auto max-w-3xl flex justify-end">
              <Button 
                onClick={handleNext} 
                className="gap-2 bg-[#1f2937] hover:bg-[#111827] text-white px-6 min-[768px]:px-8 h-11 min-[768px]:h-12 text-sm min-[768px]:text-base font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 min-[768px]:h-5 min-[768px]:w-5" />
                  </>
                ) : (
                  'See Results'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
