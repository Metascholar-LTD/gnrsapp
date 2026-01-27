import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAITutor } from '@/hooks/useAITutor';
import ReactMarkdown from 'react-markdown';

interface SessionRecapProps {
  topic: string;
  learningStyle: string;
  onContinue: () => void;
  onClose: () => void;
}

export function SessionRecap({
  topic,
  learningStyle,
  onContinue,
  onClose
}: SessionRecapProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { getSessionSummary } = useAITutor();

  useEffect(() => {
    const loadSummary = async () => {
      const result = await getSessionSummary({
        topic,
        difficulty: 'intermediate',
        learningStyle,
        subtopic: ''
      });
      setSummary(result);
      setIsLoading(false);
    };
    loadSummary();
  }, [topic, learningStyle, getSessionSummary]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-500" />
          <p className="mt-4 text-slate-500">Creating your session recap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Great study session! 🎉
            </h2>
            <p className="mt-2 text-slate-500">
              Here's a quick recap of what you learned
            </p>
          </div>

          {/* Summary content */}
          <div className="mt-8 rounded-xl bg-slate-50 p-6">
            <div className="prose prose-slate prose-sm max-w-none">
              <ReactMarkdown>{summary || `
## Session Recap: ${topic}

**What you covered:**
- Key concepts and definitions
- Real-world examples and applications
- Practice questions and explanations

**What you did well:**
- Stayed engaged and asked good questions
- Worked through challenging concepts
- Made connections between ideas

**Next steps:**
- Review the key points tomorrow
- Try the quiz to test your knowledge
- Move on to the next topic when ready

Keep up the great work! Every study session brings you closer to mastery. 🌟
              `}</ReactMarkdown>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onContinue}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Continue Learning
            </Button>
            <Button
              onClick={onClose}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
