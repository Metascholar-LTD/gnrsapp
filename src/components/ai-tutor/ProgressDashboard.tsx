import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target,
  CheckCircle2,
  Circle,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Topic {
  name: string;
  subtopics: string[];
  keyConcepts: string[];
  difficulty: string;
  estimatedMinutes: number;
  order: number;
}

interface ProgressDashboardProps {
  topics: Topic[];
  completedLessons: Set<string>;
  streakDays: number;
  totalMinutes: number;
  questionsAnswered: number;
}

export function ProgressDashboard({
  topics,
  completedLessons,
  streakDays,
  totalMinutes,
  questionsAnswered
}: ProgressDashboardProps) {
  const completedCount = topics.filter(t => completedLessons.has(t.name)).length;
  const progressPercentage = (completedCount / topics.length) * 100;

  const stats = [
    { 
      icon: Trophy, 
      label: 'Lessons Completed', 
      value: `${completedCount}/${topics.length}`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    { 
      icon: Flame, 
      label: 'Study Streak', 
      value: `${streakDays} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      icon: Clock, 
      label: 'Time Studied', 
      value: `${totalMinutes} min`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      icon: Target, 
      label: 'Questions Answered', 
      value: questionsAnswered.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Stats grid */}
      <div className="grid gap-4 min-[768px]:grid-cols-2 min-[1200px]:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className={cn("inline-flex rounded-xl p-2.5", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Overall Progress</h3>
            <p className="text-sm text-slate-500">Your learning journey</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-600">{Math.round(progressPercentage)}%</p>
            <p className="text-sm text-slate-500">Complete</p>
          </div>
        </div>
        
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        <div className="mt-6 grid gap-2">
          {topics.map((topic, index) => {
            const isCompleted = completedLessons.has(topic.name);
            const isAvailable = index === 0 || completedLessons.has(topics[index - 1]?.name);
            
            return (
              <div
                key={topic.name}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3",
                  isCompleted && "bg-emerald-50",
                  !isCompleted && isAvailable && "bg-slate-50",
                  !isCompleted && !isAvailable && "opacity-50"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className={cn(
                    "h-5 w-5",
                    isAvailable ? "text-slate-400" : "text-slate-300"
                  )} />
                )}
                <span className={cn(
                  "flex-1 font-medium",
                  isCompleted ? "text-emerald-700" : "text-slate-600"
                )}>
                  {topic.name}
                </span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  topic.difficulty === 'beginner' && "bg-emerald-100 text-emerald-700",
                  topic.difficulty === 'intermediate' && "bg-amber-100 text-amber-700",
                  topic.difficulty === 'advanced' && "bg-rose-100 text-rose-700"
                )}>
                  {topic.difficulty}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
        <div className="mt-4 grid gap-4 min-[768px]:grid-cols-3">
          {[
            { 
              icon: Flame, 
              label: 'First Steps', 
              desc: 'Complete your first lesson',
              unlocked: completedCount >= 1
            },
            { 
              icon: TrendingUp, 
              label: 'On Fire', 
              desc: 'Complete 3 lessons',
              unlocked: completedCount >= 3
            },
            { 
              icon: Award, 
              label: 'Master', 
              desc: 'Complete all lessons',
              unlocked: completedCount === topics.length
            },
          ].map((achievement) => (
            <div
              key={achievement.label}
              className={cn(
                "rounded-xl border p-4 text-center transition-all",
                achievement.unlocked 
                  ? "border-amber-200 bg-amber-50" 
                  : "border-slate-200 bg-slate-50 opacity-60"
              )}
            >
              <div className={cn(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
                achievement.unlocked ? "bg-amber-100" : "bg-slate-200"
              )}>
                <achievement.icon className={cn(
                  "h-6 w-6",
                  achievement.unlocked ? "text-amber-600" : "text-slate-400"
                )} />
              </div>
              <p className={cn(
                "mt-3 font-semibold",
                achievement.unlocked ? "text-amber-700" : "text-slate-500"
              )}>
                {achievement.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
