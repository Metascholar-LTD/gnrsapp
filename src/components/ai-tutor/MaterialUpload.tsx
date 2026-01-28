import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  File, 
  Presentation, 
  Loader2,
  Sparkles,
  BookOpen,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Spotlight } from '@/components/ui/spotlight';
import { SplineScene } from '@/components/ui/spline-scene';
import { useAITutor } from '@/hooks/useAITutor';
import { cn } from '@/lib/utils';
import { extractTextFromFile } from '@/utils/fileParser';
import { toast } from 'sonner';
import './MaterialUpload.css';

interface MaterialUploadProps {
  onMaterialAnalyzed: (content: string, analysis: any) => void;
}

export function MaterialUpload({ onMaterialAnalyzed }: MaterialUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeMaterial, isLoading } = useAITutor();

  const acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('word') || type.includes('document')) return File;
    if (type.includes('presentation') || type.includes('powerpoint')) return Presentation;
    return FileText;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && acceptedTypes.some(type => file.type.includes(type.split('/')[1]) || file.type === type)) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsExtracting(true);
    setExtractionError(null);
    setExtractionSuccess(false);
    setExtractedText('');
    
    try {
      // Use smart file parser to extract text properly
      const text = await extractTextFromFile(file);
      
      if (text && text.trim().length > 0) {
        setExtractedText(text);
        setExtractionSuccess(true);
        toast.success(`Successfully extracted ${text.length.toLocaleString()} characters from ${file.name}`);
      } else {
        throw new Error('No text content found in file');
      }
    } catch (err: any) {
      console.error('Error processing file:', err);
      const errorMessage = err.message || `Could not extract text from ${file.name}`;
      setExtractionError(errorMessage);
      toast.error(errorMessage);
      
      // Clear the file selection on error so user can try again
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    const content = extractedText || textInput;
    if (!content.trim()) return;

    const analysis = await analyzeMaterial(content);
    if (analysis) {
      onMaterialAnalyzed(content, analysis);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setExtractedText('');
    setExtractionError(null);
    setExtractionSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : FileText;

  return (
    <div className="material-upload-container flex h-full items-center justify-center p-4 min-[768px]:p-6 min-[1200px]:p-0 min-[1200px]:items-stretch min-[1200px]:w-full min-[1200px]:h-full min-[1200px]:m-0">
      <Card className="material-upload-card w-full h-full min-h-[500px] bg-black/[0.96] relative overflow-hidden border-0 rounded-none shadow-none min-[1200px]:w-full min-[1200px]:h-full min-[1200px]:m-0">
        <Spotlight
          className="hidden min-[1200px]:block -top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        
        <div className="flex h-full flex-col min-[1200px]:flex-row">
          {/* Left content - Upload Forms */}
          <div className="flex-1 p-6 min-[768px]:p-8 relative z-10 flex flex-col justify-center min-[1200px]:max-w-lg min-[1200px]:ml-16 min-[1200px]:pl-0 min-[1200px]:pt-0 min-[1200px]:translate-x-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h1 className="text-3xl min-[768px]:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Upload Your Learning Material
                </h1>
                <p className="mt-3 text-neutral-300 text-sm min-[768px]:text-base">
                  Share your study material and I'll create a personalized learning journey for you
                </p>
              </div>

              {/* Upload area or file preview */}
              {!selectedFile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "relative rounded-xl border-2 border-dashed p-6 text-center transition-all",
                    dragOver
                      ? "border-emerald-400 bg-emerald-900/20"
                      : "border-neutral-700 bg-neutral-900/30 hover:border-neutral-600"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <Upload className={cn(
                    "mx-auto h-10 w-10 transition-colors",
                    dragOver ? "text-emerald-400" : "text-neutral-400"
                  )} />
                  <p className="mt-3 text-base font-medium text-neutral-200">
                    Drag and drop your file here
                  </p>
                  <p className="mt-1 text-sm text-neutral-400">
                    or click to browse (PDF, Word, PowerPoint, Text)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-neutral-700 bg-neutral-900/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/30 border border-emerald-700/50">
                        <FileIcon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-100 text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-neutral-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                      className="text-neutral-400 hover:text-neutral-200 h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {isExtracting && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Extracting text content...</span>
                    </div>
                  )}
                  
                  {extractionSuccess && extractedText && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Text extracted ({extractedText.length.toLocaleString()} chars)</span>
                    </div>
                  )}
                  
                  {extractionError && (
                    <div className="mt-3 rounded-lg border border-rose-800/50 bg-rose-900/20 p-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 text-rose-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-rose-300">Extraction Failed</p>
                          <p className="text-xs text-rose-400 mt-1">{extractionError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-700" />
                <span className="text-xs text-neutral-500">or paste text directly</span>
                <div className="h-px flex-1 bg-neutral-700" />
              </div>

              {/* Text input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Textarea
                  value={extractedText || textInput}
                  onChange={(e) => {
                    if (extractedText) {
                      setExtractedText(e.target.value);
                    } else {
                      setTextInput(e.target.value);
                    }
                  }}
                  placeholder="Paste your lecture notes, textbook chapter, or any study material here..."
                  className="min-h-[120px] resize-none rounded-xl border-neutral-700 bg-neutral-900/50 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </motion.div>

              {/* Analyze button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading || (!extractedText && !textInput.trim())}
                  className="h-11 px-8 rounded-xl bg-emerald-600 text-sm font-medium hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing your material...
                    </>
                  ) : (
                    'Start Learning'
                  )}
                </Button>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="group relative inline-block text-center text-xs text-neutral-400"
              >
                <p className="relative inline-block pb-1">
                  <strong className="text-neutral-300">Tip:</strong> The more detailed your material, the better I can help you understand it.
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400"
                    style={{
                      width: '100%',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    }}
                  />
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right content - 3D Scene - Desktop only */}
          <div className="hidden min-[1200px]:flex flex-1 relative min-h-0 min-[1200px]:translate-x-16">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
