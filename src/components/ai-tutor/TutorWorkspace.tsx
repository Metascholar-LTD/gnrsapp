import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  MessageSquare, 
  Brain,
  Trophy,
  Flame,
  Settings
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  const handleMobileTopicSelect = (topic: string, subtopic?: string) => {
    handleTopicSelect(topic, subtopic);
    setShowMobileSidebar(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50">
      {/* Mobile-Optimized Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        {/* Top bar - Compact on mobile */}
        <div className="flex h-14 min-[1200px]:h-16 items-center justify-between px-3 min-[768px]:px-4 min-[1200px]:px-6">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-2 min-[768px]:gap-3 min-[1200px]:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 min-[1200px]:h-10 min-[1200px]:w-10 text-slate-600 hover:text-slate-900 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 min-[1200px]:h-5 min-[1200px]:w-5" />
            </Button>
            <div className="flex items-center gap-2 min-[768px]:gap-3 min-w-0 flex-1">
              {/* Icon - smaller on mobile */}
              <div className="hidden min-[768px]:flex h-8 w-8 min-[1200px]:h-10 min-[1200px]:w-10 items-center justify-center rounded-lg min-[1200px]:rounded-xl bg-emerald-100 flex-shrink-0">
                <Brain className="h-4 w-4 min-[1200px]:h-5 min-[1200px]:w-5 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm min-[768px]:text-base min-[1200px]:text-lg font-semibold text-slate-900 truncate">
                  {topicData ? (topicData.title.length > 20 ? `${topicData.title.substring(0, 20)}...` : topicData.title) : 'AI Tutor'}
                </h1>
                {/* Subtitle - hidden on mobile/tablet */}
                {topicData && (
                  <p className="hidden min-[1200px]:block text-sm text-slate-500 truncate">{topicData.title}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-1.5 min-[768px]:gap-2 min-[1200px]:gap-3 flex-shrink-0">
            {/* Topics button - Mobile/Tablet only, Learning mode only */}
            {topicData && viewMode === 'learning' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileSidebar(true)}
                className="min-[1200px]:hidden h-8 px-2.5 text-xs font-medium"
              >
                Topics
              </Button>
            )}

            {/* Settings button - Desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStyleSelector(true)}
              className="hidden min-[1200px]:flex h-9 w-9 text-slate-600 hover:text-slate-900"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Streak indicator - Desktop only */}
            <div className="hidden min-[1200px]:flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600">{streakDays} day streak</span>
            </div>
          </div>
        </div>

        {/* Desktop tabs - Hidden on mobile/tablet (moved to bottom nav) */}
        {topicData && (
          <div className="hidden min-[1200px]:flex gap-1 border-t border-slate-100 px-4 min-[1200px]:px-6">
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
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content - Adjusted height for mobile bottom nav */}
      <main className={cn(
        "overflow-hidden",
        topicData 
          ? "h-[calc(100vh-3.5rem-4rem)] min-[1200px]:h-[calc(100vh-4rem)]" // Mobile/Tablet: header + bottom nav, Desktop: just header
          : "h-[calc(100vh-3.5rem)] min-[1200px]:h-[calc(100vh-4rem)]" // No material loaded
      )}>
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
              {/* Desktop sidebar */}
              <div className="hidden min-[1200px]:block">
                <LessonSidebar
                  topics={topicData.topics}
                  currentTopic={currentTopic}
                  currentSubtopic={currentSubtopic}
                  completedLessons={completedLessons}
                  onTopicSelect={handleTopicSelect}
                  onStartQuiz={() => setViewMode('quiz')}
                />
              </div>
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
              className="h-full p-4 min-[768px]:p-5 min-[1200px]:p-6 pb-24 min-[1200px]:pb-6"
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
              className="h-full overflow-y-auto p-4 min-[768px]:p-5 min-[1200px]:p-6 pb-24 min-[1200px]:pb-6"
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

      {/* Mobile sidebar overlay - Enhanced with swipe gesture support */}
      <AnimatePresence>
        {topicData && viewMode === 'learning' && showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 z-[60] bg-black/50 min-[1200px]:hidden backdrop-blur-sm"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-[70] bg-white shadow-2xl min-[1200px]:hidden"
              style={{ width: 'min(85vw, 320px)', maxWidth: '320px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-white sticky top-0 z-10">
                <span className="text-sm font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Learning Path
                </span>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Close
                </button>
              </div>
              {/* Sidebar Content */}
              <div className="h-[calc(100vh-3.5rem)] overflow-hidden">
                <LessonSidebar
                  topics={topicData.topics}
                  currentTopic={currentTopic}
                  currentSubtopic={currentSubtopic}
                  completedLessons={completedLessons}
                  onTopicSelect={handleMobileTopicSelect}
                  onStartQuiz={() => {
                    setShowMobileSidebar(false);
                    setViewMode('quiz');
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Bottom Navigation - Only show when material is loaded */}
      {topicData && (
        <nav 
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white min-[1200px]:hidden"
          style={{ 
            paddingBottom: 'env(safe-area-inset-bottom, 0)',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {[
              { id: 'learning', icon: MessageSquare, label: 'Learn' },
              { id: 'quiz', icon: Brain, label: 'Quiz' },
              { id: 'concept-map', icon: BookOpen, label: 'Concepts' },
              { id: 'progress', icon: Trophy, label: 'Progress' },
            ].map((tab) => {
              const isActive = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as ViewMode)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[44px] transition-colors relative",
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-500"
                  )}
                >
                  <tab.icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] font-medium leading-tight",
                    isActive ? "font-semibold" : "font-normal"
                  )} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

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
