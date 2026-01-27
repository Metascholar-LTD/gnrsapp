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
import { useAITutor } from '@/hooks/useAITutor';
import { cn } from '@/lib/utils';
import { extractTextFromFile } from '@/utils/fileParser';
import { toast } from 'sonner';

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
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <BookOpen className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Upload Your Learning Material</h2>
          <p className="mt-2 text-slate-600">
            Share your study material and I'll create a personalized learning journey for you
          </p>
        </motion.div>

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
              "relative rounded-2xl border-2 border-dashed p-8 text-center transition-all",
              dragOver
                ? "border-emerald-400 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-slate-300"
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
              "mx-auto h-12 w-12 transition-colors",
              dragOver ? "text-emerald-500" : "text-slate-400"
            )} />
            <p className="mt-4 text-lg font-medium text-slate-700">
              Drag and drop your file here
            </p>
            <p className="mt-1 text-sm text-slate-500">
              or click to browse (PDF, Word, PowerPoint, Text)
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <FileIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {isExtracting && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting text content from {selectedFile.name}...</span>
              </div>
            )}
            
            {extractionSuccess && extractedText && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Text extracted successfully ({extractedText.length.toLocaleString()} characters)</span>
              </div>
            )}
            
            {extractionError && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rose-800">Extraction Failed</p>
                    <p className="text-xs text-rose-600 mt-1">{extractionError}</p>
                    <p className="text-xs text-rose-600 mt-2">
                      You can still paste the text content directly in the field below.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">or paste text directly</span>
          <div className="h-px flex-1 bg-slate-200" />
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
            className="min-h-[160px] resize-none rounded-xl border-slate-200 bg-white text-base focus:border-emerald-300 focus:ring-emerald-200"
          />
        </motion.div>

        {/* Analyze button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || (!extractedText && !textInput.trim())}
            className="h-12 w-full rounded-xl bg-emerald-600 text-base font-medium hover:bg-emerald-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing your material...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Start Learning
              </>
            )}
          </Button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500"
        >
          <p>
            <strong>Tip:</strong> The more detailed your material, the better I can help you understand it.
            Include definitions, examples, and key concepts for best results.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
