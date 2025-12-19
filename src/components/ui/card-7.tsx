// components/ui/card-7.tsx

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the props for the component
interface ExamPaperCardProps {
  title: string;
  courseCode: string;
  university: string;
  universityShort: string;
  faculty: string;
  year: number;
  semester: string;
  downloads: number;
  views: number;
  fileSize: string;
  verified: boolean;
  examType: string;
  universityLogo?: string;
  hideUniversityBadge?: boolean;
  className?: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

// Helper for formatting large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const ExamPaperCard = React.forwardRef<HTMLDivElement, ExamPaperCardProps>(
  (
    {
      title,
      courseCode,
      university,
      universityShort,
      faculty,
      year,
      semester,
      downloads,
      views,
      fileSize,
      verified,
      examType,
      universityLogo,
      hideUniversityBadge = false,
      className,
      onPreview,
      onDownload,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Determine border color based on examType
    const borderColor = examType === "BECE" 
      ? "border-blue-500" 
      : examType === "SHS" 
      ? "border-yellow-500" 
      : "border-[hsl(40_20%_88%)]";
    
    // Determine accent color for top border
    const accentColor = examType === "BECE"
      ? "bg-blue-500"
      : examType === "SHS"
      ? "bg-yellow-500"
      : "bg-[hsl(40_20%_88%)]";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-white text-[hsl(220_30%_15%)] shadow-lg",
          borderColor,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Colored top accent bar */}
        <div className={cn("h-1 w-full", accentColor)} />
        <div className="flex flex-col">
          {/* Text Content Section */}
          <div className="relative z-10 flex h-full flex-col p-6">
            {/* University Logo/Badge - Top Right Corner */}
            {!hideUniversityBadge && universityLogo && (
              <div className="absolute right-6 top-6 z-10">
                <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm p-1 shadow-md flex items-center justify-center border border-[hsl(40_20%_88%)]">
                  <img 
                    src={universityLogo} 
                    alt={universityShort}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Course Code, Verified Icon, and Stats - Top */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-1 text-xs font-bold rounded-md border-0 bg-gray-100 text-black">
                  {courseCode}
                </span>
                {/* Exam Type Badge */}
                {examType && (examType === "BECE" || examType === "SHS") && (
                  <span className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-md",
                    examType === "BECE"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-yellow-900"
                  )}>
                    {examType}
                  </span>
                )}
                {verified && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-[hsl(40_20%_88%)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  </div>
                )}
              </div>
              
              {/* Thin Separator Line */}
              <div className="h-6 w-px bg-[hsl(40_20%_88%)] mx-2"></div>
              
              {/* Downloads and Views */}
              <div className="flex items-center gap-3 text-xs text-[hsl(220_20%_40%)]">
                <div className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-[hsl(220_30%_15%)]" />
                  <span className="font-bold">{formatNumber(downloads)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[hsl(220_30%_15%)]" />
                  <span className="font-bold">{formatNumber(views)}</span>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <p className="mb-1 text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                {universityShort} • {faculty}
              </p>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2 pr-12">
                {title}
              </h3>
            </div>

            <div className="mb-4 flex items-center gap-3 text-sm text-[hsl(220_20%_40%)]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{semester} Semester, {year}</span>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-end gap-6">
              <button
                onClick={onPreview}
                className="group relative inline-block text-sm font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
              >
                <motion.span
                  className="relative inline-block pb-1 flex items-center gap-1.5"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Eye className="w-4 h-4" />
                  Preview
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
          </div>
        </div>
      </motion.div>
    );
  }
);

ExamPaperCard.displayName = "ExamPaperCard";
