import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Calendar, CheckCircle2 } from 'lucide-react';
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
  universityLogo?: string;
  className?: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const ExamPaperListItem = React.forwardRef<HTMLDivElement, ExamPaperListItemProps>(
  (
    {
      title,
      courseCode,
      universityShort,
      faculty,
      year,
      semester,
      downloads,
      views,
      fileSize,
      verified,
      universityLogo,
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
          "group relative w-full p-4 rounded-xl border border-[hsl(40_20%_88%)] bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          {/* University Logo */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-[hsl(40_20%_88%)]">
            {universityLogo ? (
              <img 
                src={universityLogo} 
                alt={universityShort}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <span className="text-sm font-bold text-blue-600">{universityShort}</span>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-600 text-white">
                    {courseCode}
                  </span>
                  {verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  )}
                  <span className="text-xs text-[hsl(220_20%_40%)] truncate">
                    {universityShort} • {faculty}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[hsl(220_30%_15%)] line-clamp-1 mb-1">
                  {title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{semester} Sem, {year}</span>
                  </div>
                  <span>•</span>
                  <span>{fileSize}</span>
                  <span>•</span>
                  <span>{formatNumber(downloads)} downloads</span>
                  <span>•</span>
                  <span>{formatNumber(views)} views</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onPreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[hsl(220_30%_15%)] bg-[hsl(40_20%_95%)] hover:bg-[hsl(40_20%_90%)] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={onDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ExamPaperListItem.displayName = "ExamPaperListItem";

