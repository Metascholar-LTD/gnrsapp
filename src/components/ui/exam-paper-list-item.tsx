import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamPaperListItemProps {
  title: string;
  courseCode: string;
  universityShort: string;
  faculty: string;
  year: number;
  semester: string;
  downloads: number;
  views: number;
  fileSize: string;
  verified: boolean;
  examType?: string;
  universityLogo?: string;
  hideBadge?: boolean;
  className?: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

export const ExamPaperListItem = React.forwardRef<HTMLDivElement, ExamPaperListItemProps>(
  (
    {
      title,
      courseCode,
      universityShort,
      universityLogo,
      hideBadge = false,
      examType,
      className,
      onPreview,
      onDownload,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative w-full p-4 rounded-xl border border-[hsl(40_20%_88%)] bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* University Logo/Badge */}
          {!hideBadge && (
            universityLogo ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/95 backdrop-blur-sm p-1.5 shadow-md flex items-center justify-center border border-[hsl(40_20%_88%)]">
                <img 
                  src={universityLogo} 
                  alt={universityShort}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-[hsl(40_20%_88%)]">
                <span className="text-xs font-bold text-blue-600">{universityShort}</span>
              </div>
            )
          )}

          {/* Course Name (Course Code) */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-base font-semibold text-[hsl(220_30%_15%)]">
                {title} ({courseCode})
              </div>
              {/* Exam Type Badge */}
              {examType && (examType === "BECE" || examType === "SHS") && (
                <span className={cn(
                  "px-2 py-0.5 text-xs font-semibold rounded-md",
                  examType === "BECE"
                    ? "bg-blue-500 text-white"
                    : "bg-yellow-500 text-yellow-900"
                )}>
                  {examType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <button
            type="button"
            onClick={onPreview}
            className="group relative inline-block text-sm font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
          >
            <motion.span
              className="relative inline-block pb-1 flex items-center gap-1.5"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Eye className="w-4 h-4" />
              View
              <span
                className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                style={{
                  width: 'calc(100% + 14px)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                }}
              />
            </motion.span>
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="group relative inline-block text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700"
          >
            <motion.span
              className="relative inline-block pb-1 flex items-center gap-1.5"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Download className="w-4 h-4" />
              Download
              <span
                className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                style={{
                  width: 'calc(100% + 14px)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                }}
              />
            </motion.span>
          </button>
        </div>
      </motion.div>
    );
  }
);

ExamPaperListItem.displayName = "ExamPaperListItem";

