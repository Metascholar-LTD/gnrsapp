import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Brain,
  Trophy,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const { generateQuestions, checkAnswer, isLoading } = useAITutor();

  // Generate questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      const result = await generateQuestions({
        topic,
        subtopic,
        difficulty,
        learningStyle
      });
      setQuestions(result);
      setIsGenerating(false);
    };
    loadQuestions();
  }, [topic, subtopic, difficulty, learningStyle, generateQuestions]);

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

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setFeedback('');
    } else {
      setIsComplete(true);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Preparing your quiz...
          </h2>
          <p className="mt-2 text-slate-500">
            Creating personalized questions about {topic}
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            No questions available
          </h2>
          <p className="mt-2 text-slate-500">
            Unable to generate questions for this topic
          </p>
          <Button onClick={onBack} className="mt-4">
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
      <div className="flex h-full flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className={cn(
            "mx-auto flex h-24 w-24 items-center justify-center rounded-full",
            passed ? "bg-emerald-100" : "bg-amber-100"
          )}>
            {passed ? (
              <Trophy className="h-12 w-12 text-emerald-600" />
            ) : (
              <Brain className="h-12 w-12 text-amber-600" />
            )}
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-slate-900">
            {passed ? 'Great job!' : 'Keep practicing!'}
          </h2>
          
          <p className="mt-2 text-lg text-slate-600">
            You scored <span className="font-bold text-emerald-600">{score}/{questions.length}</span> ({percentage}%)
          </p>

          <p className="mt-4 max-w-md text-slate-500">
            {passed 
              ? "You've demonstrated a solid understanding of this topic. Ready to move on!"
              : "Don't worry! Review the material and try again. Every attempt helps you learn."}
          </p>

          <div className="mt-8 flex gap-3 justify-center">
            <Button variant="outline" onClick={onBack}>
              Back to learning
            </Button>
            <Button onClick={() => onComplete(percentage)}>
              {passed ? 'Continue' : 'Try again later'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="text-sm font-medium text-slate-600">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-medium text-emerald-600">
            Score: {score}/{currentIndex + (showFeedback ? 1 : 0)}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Difficulty badge */}
            <div className="flex gap-2">
              <span className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                currentQuestion.difficulty === 'easy' && "bg-emerald-100 text-emerald-700",
                currentQuestion.difficulty === 'medium' && "bg-amber-100 text-amber-700",
                currentQuestion.difficulty === 'hard' && "bg-rose-100 text-rose-700"
              )}>
                {currentQuestion.difficulty}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {currentQuestion.concept}
              </span>
            </div>

            {/* Question text */}
            <h3 className="text-xl font-semibold text-slate-900">
              {currentQuestion.question}
            </h3>

            {/* Answer options */}
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
                        "w-full rounded-xl border-2 p-4 text-left transition-all",
                        !showFeedback && !isSelected && "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                        !showFeedback && isSelected && "border-emerald-500 bg-emerald-50",
                        showFeedback && isCorrectAnswer && "border-emerald-500 bg-emerald-50",
                        showFeedback && isSelected && !isCorrectAnswer && "border-rose-400 bg-rose-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full font-medium",
                          !showFeedback && "bg-slate-100 text-slate-600",
                          showFeedback && isCorrectAnswer && "bg-emerald-500 text-white",
                          showFeedback && isSelected && !isCorrectAnswer && "bg-rose-400 text-white"
                        )}>
                          {showFeedback && isCorrectAnswer ? (
                            <Check className="h-4 w-4" />
                          ) : showFeedback && isSelected && !isCorrectAnswer ? (
                            <X className="h-4 w-4" />
                          ) : (
                            letter
                          )}
                        </div>
                        <span className="text-slate-700">{option.substring(3)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "rounded-xl border p-4",
                    isCorrect 
                      ? "border-emerald-200 bg-emerald-50" 
                      : "border-rose-200 bg-rose-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isCorrect ? "bg-emerald-500" : "bg-rose-400"
                    )}>
                      {isCorrect ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium",
                        isCorrect ? "text-emerald-700" : "text-rose-700"
                      )}>
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                      </p>
                      <div className="mt-2 prose prose-sm prose-slate max-w-none">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      {showFeedback && (
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="mx-auto max-w-2xl flex justify-end">
            <Button onClick={handleNext} className="gap-2">
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
