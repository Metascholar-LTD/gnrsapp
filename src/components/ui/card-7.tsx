// components/ui/card-7.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
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
  imageUrl?: string;
  universityLogo?: string;
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

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({
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
  imageUrl = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  universityLogo,
  className,
  onPreview,
  onDownload,
}) => {
  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className={cn(
        'relative w-full max-w-md h-64 rounded-2xl overflow-hidden shadow-lg flex items-end isolate bg-white border border-gray-200',
        className
      )}
    >
      {/* Background Image & Darker Overlay */}
      <div className="absolute inset-0 z-[-1]">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/85" />
      </div>

      {/* University Logo - Top Right Corner */}
      {universityLogo && (
        <motion.div
          variants={itemVariants}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-white/95 backdrop-blur-sm p-1.5 shadow-md flex items-center justify-center"
        >
          <img 
            src={universityLogo} 
            alt={universityShort}
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}
      
      {/* Main Content */}
      <div className="w-full flex flex-col h-full">
        {/* Top Section: Course Code, Verified Badge, and Title */}
        <div className="px-6 pt-4 pb-3">
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white shadow-sm">
              {courseCode}
            </span>
            {verified && (
              <CheckCircle2 className="w-4 h-4 text-green-400 drop-shadow-sm" />
            )}
          </motion.div>
          
          {/* Course Title with Background */}
          <motion.div variants={itemVariants}>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm shadow-md">
              <h2 className="text-base font-bold leading-tight text-slate-900 line-clamp-2">
                {title}
              </h2>
            </div>
          </motion.div>
        </div>

        {/* Thin Separator Line */}
        <div className="px-6">
          <div className="h-px bg-white/20"></div>
        </div>

        {/* Bottom Section: Rest of Content */}
        <div className="flex-1 px-6 pb-6 pt-4 grid grid-cols-3 gap-4">
          {/* Left Section: Info */}
          <div className="col-span-2 flex flex-col justify-end">
            <div className="space-y-2">
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-white/90">
                <span className="font-medium">{universityShort}</span>
                <span className="text-white/60">•</span>
                <span className="truncate">{faculty}</span>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-white/80">
                <Calendar className="w-3 h-3" />
                <span>{semester} Sem, {year}</span>
              </motion.div>
            </div>
            
            <motion.div
              variants={itemVariants}
              className="mt-4 flex items-center gap-3"
            >
              <button
                onClick={onPreview}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </motion.div>
          </div>
          
          {/* Right Section: Stats */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 flex flex-col items-end justify-end gap-2"
          >
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tighter text-white select-none">
                {formatNumber(downloads)}
              </div>
              <div className="text-xs text-white/80">downloads</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tracking-tighter text-white/90 select-none">
                {formatNumber(views)}
              </div>
              <div className="text-xs text-white/70">views</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
