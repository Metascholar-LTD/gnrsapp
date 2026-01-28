import { motion } from 'framer-motion';
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
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#64748b';
    }
  };

  const completedCount = sortedTopics.filter(t => completedLessons.has(t.name)).length;
  const progress = (completedCount / sortedTopics.length) * 100;

  return (
    <>
      <style>{`
        .ai-tutor-sidebar,
        .ai-tutor-sidebar * {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .ai-tutor-sidebar {
          background-color: #fff !important;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4) !important;
        }

        .ai-tutor-sidebar .menu-header {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          color: #8E92BC !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 0.75rem 1.5rem 0.5rem !important;
          margin-top: 0.5rem !important;
        }

        .ai-tutor-sidebar .menu-item {
          margin: 0.125rem 0 !important;
        }

        .ai-tutor-sidebar .menu-link {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          color: #54577A !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          width: 100% !important;
          text-align: left !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          white-space: normal !important;
          word-wrap: break-word !important;
        }

        .ai-tutor-sidebar .menu-item.active .menu-link,
        .ai-tutor-sidebar .menu-link:hover {
          color: #141522 !important;
          background-color: rgba(30, 58, 95, 0.16) !important;
        }

        .ai-tutor-sidebar .menu-item.locked .menu-link {
          color: #8E92BC !important;
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        .ai-tutor-sidebar .menu-item.completed .menu-link {
          color: #10b981 !important;
        }

        .ai-tutor-sidebar .submenu-item {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.8125rem !important;
          font-weight: 600 !important;
          color: #54577A !important;
          padding: 0.5rem 1.5rem 0.5rem 3.5rem !important;
          border-radius: 0.375rem !important;
          transition: all 0.2s ease !important;
          display: block !important;
          width: 100% !important;
          text-align: left !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          line-height: 1.5 !important;
        }

        .ai-tutor-sidebar .submenu-item.active,
        .ai-tutor-sidebar .submenu-item:hover {
          color: #141522 !important;
          background-color: rgba(30, 58, 95, 0.08) !important;
        }

        .ai-tutor-sidebar .progress-header {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          padding: 1rem 1.5rem !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }

        .ai-tutor-sidebar .progress-label {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          color: #8E92BC !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 0.5rem !important;
        }

        .ai-tutor-sidebar .progress-value {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          color: #141522 !important;
        }

        .ai-tutor-sidebar .difficulty-badge {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.6875rem !important;
          font-weight: 600 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.25rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }

        .ai-tutor-sidebar .time-badge {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          color: #8E92BC !important;
        }

        .ai-tutor-sidebar .topic-meta {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          margin-top: 0.25rem !important;
        }

        .ai-tutor-sidebar .topic-title {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          color: inherit !important;
          line-height: 1.5 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }

        .ai-tutor-sidebar .quiz-button {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.5rem !important;
          background-color: #141522 !important;
          color: #fff !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          width: 100% !important;
        }

        .ai-tutor-sidebar .quiz-button:hover {
          background-color: #1e293b !important;
        }

        /* Mobile & Tablet: hide non-essential UI to keep things clean */
        @media (max-width: 1199.98px) {
          .ai-tutor-sidebar .progress-header {
            display: none !important;
          }

          .ai-tutor-sidebar .time-badge {
            display: none !important;
          }
        }
      `}</style>
      <div className="ai-tutor-sidebar w-80 flex-shrink-0 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Progress header */}
          <div className="progress-header">
            <div className="flex items-center justify-between mb-3">
              <span className="progress-label">Your Progress</span>
              <span className="progress-value">
                {completedCount}/{sortedTopics.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
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
            <div className="py-2">
              {/* Learning Path Section */}
              <div className="menu-header">Learning Path</div>
              
              <div className="space-y-1">
                {sortedTopics.map((topic, index) => {
                  const status = getTopicStatus(topic, index);
                  const isActive = topic.name === currentTopic;
                  const isLocked = status === 'locked';
                  const isCompleted = status === 'completed';

                  return (
                    <div key={topic.name}>
                      <div className={cn(
                        "menu-item",
                        isActive && "active",
                        isLocked && "locked",
                        isCompleted && "completed"
                      )}>
                        <button
                          onClick={() => !isLocked && onTopicSelect(topic.name)}
                          disabled={isLocked}
                          className="menu-link"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="topic-title">
                              {topic.name}
                            </div>
                            <div className="topic-meta">
                              <span 
                                className="difficulty-badge"
                                style={{ 
                                  backgroundColor: `${getDifficultyColor(topic.difficulty)}15`,
                                  color: getDifficultyColor(topic.difficulty)
                                }}
                              >
                                {topic.difficulty}
                              </span>
                              <span className="time-badge">
                                ~{topic.estimatedMinutes} min
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Subtopics */}
                      {isActive && topic.subtopics.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-0.5 mt-1">
                            {topic.subtopics.map((subtopic) => (
                              <button
                                key={subtopic}
                                onClick={() => onTopicSelect(topic.name, subtopic)}
                                className={cn(
                                  "submenu-item",
                                  currentSubtopic === subtopic && "active"
                                )}
                              >
                                {subtopic}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>

          {/* Quiz button */}
          <div className="border-t border-slate-100 p-4">
            <button
              onClick={onStartQuiz}
              className="quiz-button"
            >
              Test Your Knowledge
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
