import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  MessageSquare, 
  Brain,
  Trophy,
  Flame,
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaterialUpload } from './MaterialUpload';
import { LessonSidebar } from './LessonSidebar';
import { ChatInterface } from './ChatInterface';
import { QuizMode } from './QuizMode';
import { ProgressDashboard } from './ProgressDashboard';
import { LearningStyleSelector } from './LearningStyleSelector';
import { ConceptMap } from './ConceptMap';
import { SessionRecap } from './SessionRecap';
import { cn } from '@/lib/utils';

interface TopicData {
  title: string;
  topics: Array<{
    name: string;
    subtopics: string[];
    keyConcepts: string[];
    difficulty: string;
    estimatedMinutes: number;
    order: number;
  }>;
  overallDifficulty: string;
  totalEstimatedMinutes: number;
  learningObjectives: string[];
  prerequisites: string[];
  conceptMap: Record<string, string[]>;
}

interface TutorWorkspaceProps {
  onClose: () => void;
}

type ViewMode = 'upload' | 'learning' | 'quiz' | 'progress' | 'concept-map' | 'recap';

export function TutorWorkspace({ onClose }: TutorWorkspaceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [materialContent, setMaterialContent] = useState<string>('');
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentSubtopic, setCurrentSubtopic] = useState<string>('');
  const [learningStyle, setLearningStyle] = useState<string>('balanced');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [streakDays, setStreakDays] = useState(3);
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const handleMaterialAnalyzed = (content: string, analysis: TopicData) => {
    setMaterialContent(content);
    setTopicData(analysis);
    if (analysis.topics.length > 0) {
      setCurrentTopic(analysis.topics[0].name);
      if (analysis.topics[0].subtopics.length > 0) {
        setCurrentSubtopic(analysis.topics[0].subtopics[0]);
      }
    }
    setViewMode('learning');
  };

  const handleTopicSelect = (topic: string, subtopic?: string) => {
    setCurrentTopic(topic);
    setCurrentSubtopic(subtopic || '');
    setViewMode('learning');
  };

  const handleLessonComplete = (topicName: string) => {
    setCompletedLessons(prev => new Set([...prev, topicName]));
  };

  const getCurrentDifficulty = () => {
    if (!topicData) return 'beginner';
    const topic = topicData.topics.find(t => t.name === currentTopic);
    return topic?.difficulty || topicData.overallDifficulty;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Brain className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">AI Study Tutor</h1>
                {topicData && (
                  <p className="text-sm text-slate-500">{topicData.title}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak indicator */}
            <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600">{streakDays} day streak</span>
            </div>

            {/* Learning style button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStyleSelector(true)}
              className="hidden sm:flex"
            >
              <Settings className="mr-2 h-4 w-4" />
              {learningStyle === 'simple' && 'Simple Mode'}
              {learningStyle === 'balanced' && 'Balanced'}
              {learningStyle === 'exam_focused' && 'Exam Mode'}
              {learningStyle === 'deep_conceptual' && 'Deep Learning'}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mode tabs - only show when material is loaded */}
        {topicData && (
          <div className="flex gap-1 border-t border-slate-100 px-4 lg:px-6">
            {[
              { id: 'learning', icon: MessageSquare, label: 'Learn' },
              { id: 'quiz', icon: Brain, label: 'Quiz' },
              { id: 'concept-map', icon: BookOpen, label: 'Concepts' },
              { id: 'progress', icon: Trophy, label: 'Progress' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  viewMode === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="h-[calc(100vh-4rem)] overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <MaterialUpload onMaterialAnalyzed={handleMaterialAnalyzed} />
            </motion.div>
          )}

          {viewMode === 'learning' && topicData && (
            <motion.div
              key="learning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full"
            >
              <LessonSidebar
                topics={topicData.topics}
                currentTopic={currentTopic}
                currentSubtopic={currentSubtopic}
                completedLessons={completedLessons}
                onTopicSelect={handleTopicSelect}
                onStartQuiz={() => setViewMode('quiz')}
              />
              <div className="flex-1">
                <ChatInterface
                  materialContent={materialContent}
                  topic={currentTopic}
                  subtopic={currentSubtopic}
                  difficulty={getCurrentDifficulty()}
                  learningStyle={learningStyle}
                  onLessonComplete={() => handleLessonComplete(currentTopic)}
                  onRequestQuiz={() => setViewMode('quiz')}
                  onShowRecap={() => setViewMode('recap')}
                />
              </div>
            </motion.div>
          )}

          {viewMode === 'quiz' && topicData && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full"
            >
              <QuizMode
                topic={currentTopic}
                subtopic={currentSubtopic}
                difficulty={getCurrentDifficulty()}
                learningStyle={learningStyle}
                onComplete={(score) => {
                  if (score >= 70) {
                    handleLessonComplete(currentTopic);
                  }
                  setViewMode('learning');
                }}
                onBack={() => setViewMode('learning')}
              />
            </motion.div>
          )}

          {viewMode === 'concept-map' && topicData && (
            <motion.div
              key="concept-map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full p-6"
            >
              <ConceptMap
                conceptMap={topicData.conceptMap}
                topics={topicData.topics}
                onTopicClick={(topic) => handleTopicSelect(topic)}
              />
            </motion.div>
          )}

          {viewMode === 'progress' && topicData && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto p-6"
            >
              <ProgressDashboard
                topics={topicData.topics}
                completedLessons={completedLessons}
                streakDays={streakDays}
                totalMinutes={45}
                questionsAnswered={12}
              />
            </motion.div>
          )}

          {viewMode === 'recap' && topicData && (
            <motion.div
              key="recap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full"
            >
              <SessionRecap
                topic={currentTopic}
                learningStyle={learningStyle}
                onContinue={() => setViewMode('learning')}
                onClose={onClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Learning style selector modal */}
      <AnimatePresence>
        {showStyleSelector && (
          <LearningStyleSelector
            currentStyle={learningStyle}
            onSelect={(style) => {
              setLearningStyle(style);
              setShowStyleSelector(false);
            }}
            onClose={() => setShowStyleSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
