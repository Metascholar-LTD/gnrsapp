import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Topic {
  name: string;
  subtopics: string[];
  keyConcepts: string[];
  difficulty: string;
  estimatedMinutes: number;
  order: number;
}

interface ConceptMapProps {
  conceptMap: Record<string, string[]>;
  topics: Topic[];
  onTopicClick: (topic: string) => void;
}

export function ConceptMap({ conceptMap, topics, onTopicClick }: ConceptMapProps) {
  // Create a visual representation of topics and their relationships
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'border-emerald-300 bg-emerald-50';
      case 'intermediate': return 'border-amber-300 bg-amber-50';
      case 'advanced': return 'border-rose-300 bg-rose-50';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Concept Map</h2>
        <p className="mt-1 text-slate-500">
          See how topics connect to each other
        </p>
      </div>

      {/* Topics flow */}
      <div className="relative">
        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>

        {/* Topic nodes */}
        <div className="relative z-10 grid gap-8 min-[768px]:grid-cols-2 min-[1200px]:grid-cols-3">
          {sortedTopics.map((topic, index) => (
            <motion.button
              key={topic.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTopicClick(topic.name)}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all hover:shadow-lg",
                getDifficultyColor(topic.difficulty)
              )}
            >
              {/* Order badge */}
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-600 shadow-sm">
                  {topic.order}
                </span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  topic.difficulty === 'beginner' && "bg-emerald-100 text-emerald-700",
                  topic.difficulty === 'intermediate' && "bg-amber-100 text-amber-700",
                  topic.difficulty === 'advanced' && "bg-rose-100 text-rose-700"
                )}>
                  {topic.estimatedMinutes} min
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">{topic.name}</h3>
              
              {/* Key concepts */}
              {topic.keyConcepts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {topic.keyConcepts.slice(0, 4).map((concept) => (
                    <span
                      key={concept}
                      className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {concept}
                    </span>
                  ))}
                  {topic.keyConcepts.length > 4 && (
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-slate-500">
                      +{topic.keyConcepts.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Subtopics count */}
              {topic.subtopics.length > 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  {topic.subtopics.length} subtopic{topic.subtopics.length > 1 ? 's' : ''}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Concept relationships */}
      {Object.keys(conceptMap).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900">Concept Relationships</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(conceptMap).slice(0, 6).map(([concept, relationships]) => (
              <div key={concept} className="flex items-start gap-3">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  {concept}
                </span>
                <span className="text-slate-400">→</span>
                <div className="flex flex-wrap gap-1.5">
                  {relationships.map((rel) => (
                    <span
                      key={rel}
                      className="rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
