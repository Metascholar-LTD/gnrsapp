import { motion } from 'framer-motion';
import { X, Sparkles, BookOpen, Target, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningStyleSelectorProps {
  currentStyle: string;
  onSelect: (style: string) => void;
  onClose: () => void;
}

const styles = [
  {
    id: 'simple',
    name: 'Teach Me Like I\'m 10',
    icon: Sparkles,
    description: 'Super simple explanations with fun analogies and everyday examples. Perfect when topics feel overwhelming.',
    color: 'bg-purple-100 text-purple-600',
    ring: 'ring-purple-500'
  },
  {
    id: 'balanced',
    name: 'Balanced Learning',
    icon: BookOpen,
    description: 'Clear explanations with the right amount of depth. A good mix of simplicity and detail.',
    color: 'bg-emerald-100 text-emerald-600',
    ring: 'ring-emerald-500'
  },
  {
    id: 'exam_focused',
    name: 'Exam Mode',
    icon: Target,
    description: 'Focus on what\'s likely to be tested. Key points, common questions, and quick revision strategies.',
    color: 'bg-amber-100 text-amber-600',
    ring: 'ring-amber-500'
  },
  {
    id: 'deep_conceptual',
    name: 'Deep Conceptual',
    icon: Brain,
    description: 'Thorough exploration of the "why" behind everything. Connections between concepts and advanced insights.',
    color: 'bg-blue-100 text-blue-600',
    ring: 'ring-blue-500'
  }
];

export function LearningStyleSelector({
  currentStyle,
  onSelect,
  onClose
}: LearningStyleSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Learning Style</h2>
            <p className="text-sm text-slate-500">Choose how you'd like me to teach</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-all",
                currentStyle === style.id
                  ? `border-transparent ring-2 ${style.ring} bg-slate-50`
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("rounded-xl p-2.5", style.color)}>
                  <style.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{style.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{style.description}</p>
                </div>
                {currentStyle === style.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
