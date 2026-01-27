import { motion } from 'framer-motion';
import { 
  Check, 
  Lock, 
  ChevronRight,
  BookOpen,
  Play,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Topic {
  name: string;
  subtopics: string[];
  keyConcepts: string[];
  difficulty: string;
  estimatedMinutes: number;
  order: number;
}

interface LessonSidebarProps {
  topics: Topic[];
  currentTopic: string;
  currentSubtopic: string;
  completedLessons: Set<string>;
  onTopicSelect: (topic: string, subtopic?: string) => void;
  onStartQuiz: () => void;
}

export function LessonSidebar({
  topics,
  currentTopic,
  currentSubtopic,
  completedLessons,
  onTopicSelect,
  onStartQuiz
}: LessonSidebarProps) {
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);
  
  const getTopicStatus = (topic: Topic, index: number) => {
    if (completedLessons.has(topic.name)) return 'completed';
    if (index === 0) return 'available';
    
    // Check if previous topic is completed
    const prevTopic = sortedTopics[index - 1];
    if (prevTopic && completedLessons.has(prevTopic.name)) return 'available';
    
    return 'locked';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700';
      case 'intermediate': return 'bg-amber-100 text-amber-700';
      case 'advanced': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const completedCount = sortedTopics.filter(t => completedLessons.has(t.name)).length;
  const progress = (completedCount / sortedTopics.length) * 100;

  return (
    <div className="hidden w-80 flex-shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Progress header */}
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Your Progress</span>
            <span className="text-sm font-bold text-emerald-600">
              {completedCount}/{sortedTopics.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Topics list */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {sortedTopics.map((topic, index) => {
              const status = getTopicStatus(topic, index);
              const isActive = topic.name === currentTopic;
              const isLocked = status === 'locked';

              return (
                <div key={topic.name}>
                  <button
                    onClick={() => !isLocked && onTopicSelect(topic.name)}
                    disabled={isLocked}
                    className={cn(
                      "w-full rounded-xl p-3 text-left transition-all",
                      isActive && "bg-emerald-50 ring-1 ring-emerald-200",
                      !isActive && !isLocked && "hover:bg-slate-50",
                      isLocked && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
                        status === 'completed' && "bg-emerald-500 text-white",
                        status === 'available' && isActive && "bg-emerald-500 text-white",
                        status === 'available' && !isActive && "border-2 border-slate-200",
                        status === 'locked' && "bg-slate-100"
                      )}>
                        {status === 'completed' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : status === 'locked' ? (
                          <Lock className="h-3 w-3 text-slate-400" />
                        ) : isActive ? (
                          <Play className="h-3 w-3" />
                        ) : (
                          <span className="text-xs font-medium text-slate-400">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium truncate",
                          isActive ? "text-emerald-700" : "text-slate-700"
                        )}>
                          {topic.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-xs",
                            getDifficultyColor(topic.difficulty)
                          )}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs text-slate-400">
                            ~{topic.estimatedMinutes} min
                          </span>
                        </div>
                      </div>
                      {!isLocked && (
                        <ChevronRight className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? "text-emerald-500" : "text-slate-300"
                        )} />
                      )}
                    </div>
                  </button>

                  {/* Subtopics */}
                  {isActive && topic.subtopics.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="ml-9 mt-1 space-y-0.5 overflow-hidden"
                    >
                      {topic.subtopics.map((subtopic) => (
                        <button
                          key={subtopic}
                          onClick={() => onTopicSelect(topic.name, subtopic)}
                          className={cn(
                            "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                            currentSubtopic === subtopic
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {subtopic}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Quiz button */}
        <div className="border-t border-slate-100 p-4">
          <Button
            onClick={onStartQuiz}
            className="w-full gap-2 bg-slate-900 hover:bg-slate-800"
          >
            <Brain className="h-4 w-4" />
            Test Your Knowledge
          </Button>
        </div>
      </div>
    </div>
  );
}
