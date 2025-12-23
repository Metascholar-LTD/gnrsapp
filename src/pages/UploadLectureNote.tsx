import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  FileText,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  ArrowLeft as BackIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractThumbnailWithCloudinary } from "@/utils/cloudinary";
import { DIRECTORY_PADDING, MEDIA_QUERIES } from "@/lib/breakpoints";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface FormData {
  title: string;
  field: string;
  lecturer: string;
  university: string;
  universityShort: string;
  customUniversity: string;
  pages: number;
}

const universities = [
  { name: "University of Ghana", short: "UG" },
  { name: "Kwame Nkrumah University of Science and Technology", short: "KNUST" },
  { name: "University of Cape Coast", short: "UCC" },
  { name: "University of Education, Winneba", short: "UEW" },
  { name: "University of Mines and Technology", short: "UMaT" },
  { name: "University for Development Studies", short: "UDS" },
  { name: "Ghana Institute of Management and Public Administration", short: "GIMPA" },
  { name: "Catholic University of Ghana", short: "CUG" },
  { name: "Pentecost University College", short: "PUC" },
  { name: "University of Energy and Natural Resources", short: "UENR" },
  { name: "Accra Institute of Technology", short: "AIT" },
];

const fields = [
  "Business",
  "Mobile",
  "Social Media",
  "Marketing",
  "Technology",
  "Art & Photos",
  "Career",
  "Design",
  "Education",
  "Presentations & Public Speaking",
  "Government & Nonprofit",
  "Healthcare",
  "Internet",
  "Law",
  "Leadership & Management",
  "Automotive",
  "Engineering",
  "Software",
  "Recruiting & HR",
  "Retail",
  "Sales",
  "Services",
  "Science",
  "Small Business & Entrepreneurship",
  "Food",
  "Environment",
  "Economy & Finance",
  "Data & Analytics",
  "Investor Relations",
  "Sports",
  "Spiritual",
  "News & Politics",
  "Travel",
  "Self Improvement",
  "Real Estate",
  "Entertainment & Humor",
  "Health & Medicine",
  "Devices & Hardware",
  "Lifestyle"
].sort();

// Extract page count from PDF
const extractPDFPageCount = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder('latin1').decode(uint8Array);
      
      // Count pages by finding /Count in the PDF
      const match = text.match(/\/Count\s+(\d+)/);
      if (match) {
        resolve(parseInt(match[1], 10));
      } else {
        // Fallback: count page objects
        const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
        resolve(pageMatches ? pageMatches.length : 0);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Extract slide count from PPTX
const extractPPTXSlideCount = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        try {
          const JSZip = (await import('jszip')).default;
          const zip = await JSZip.loadAsync(arrayBuffer);
          const slidesFile = zip.file('ppt/presentation.xml');
          
          if (slidesFile) {
            const content = await slidesFile.async('string');
            const slideMatches = content.match(/<p:sldId[^>]*>/g);
            resolve(slideMatches ? slideMatches.length : 0);
          } else {
            resolve(0);
          }
        } catch (importError) {
          // If jszip fails to load, we can't extract slide count
          console.warn("Could not load jszip for slide detection:", importError);
          reject(new Error("Slide detection unavailable"));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const UploadLectureNote = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    field: "",
    lecturer: "",
    university: "",
    universityShort: "",
    customUniversity: "",
    pages: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [fileUrl, setFileUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [isDetectingPages, setIsDetectingPages] = useState(false);
  const [isExtractingThumbnail, setIsExtractingThumbnail] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      'application/vnd.openxmlformats-officedocument.presentationml.template',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, PPT, or PPTX file");
      return;
    }

    // Validate file size (100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setFile(selectedFile);
    setUploadProgress(0);

    // Detect file type
    const fileExt = selectedFile.name.split('.').pop()?.toUpperCase() || "";
    setFileType(fileExt === "PPTX" || fileExt === "PPT" ? fileExt : "PDF");

    // Create preview
    if (selectedFile.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(URL.createObjectURL(selectedFile));
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }

    // Auto-detect pages/slides
    setIsDetectingPages(true);
    try {
      let pageCount = 0;
      if (selectedFile.type === 'application/pdf') {
        pageCount = await extractPDFPageCount(selectedFile);
      } else if (selectedFile.type.includes('powerpoint') || selectedFile.type.includes('presentation')) {
        try {
          pageCount = await extractPPTXSlideCount(selectedFile);
        } catch (error) {
          console.error("Error detecting slides:", error);
          toast.info("Could not auto-detect slide count. Please enter manually.");
        }
      }
      setFormData(prev => ({ ...prev, pages: pageCount }));
    } catch (error) {
      console.error("Error detecting pages:", error);
    } finally {
      setIsDetectingPages(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const validateStep1 = (): boolean => {
    if (!file) {
      toast.error("Please select a file to upload");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.field) {
      newErrors.field = "Field is required";
    }

    if (!formData.lecturer.trim()) {
      newErrors.lecturer = "Lecturer name is required";
    }

    if (!formData.university && !formData.customUniversity.trim()) {
      newErrors.university = "University / Affiliation is required";
    }

    if (formData.pages <= 0) {
      newErrors.pages = "Page count must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!file || !validateStep2()) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `lecture-notes/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      setUploadProgress(30);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lecture-notes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lecture-notes')
        .getPublicUrl(fileName);

      setFileUrl(publicUrl);

      setUploadProgress(60);

      // Extract thumbnail
      setIsExtractingThumbnail(true);
      try {
        const thumbnailUrl = await extractThumbnailWithCloudinary(file, 'lecture-notes');
        setImageUrl(thumbnailUrl);
      } catch (error) {
        console.error("Error extracting thumbnail:", error);
        toast.warning("Thumbnail extraction failed, but file uploaded successfully");
      } finally {
        setIsExtractingThumbnail(false);
      }

      setUploadProgress(80);

      // Determine university
      const finalUniversity = formData.university || formData.customUniversity;
      const finalUniversityShort = formData.universityShort || 
        universities.find(u => u.name === finalUniversity)?.short || 
        finalUniversity.substring(0, 4).toUpperCase();

      // Insert into database
      const { error: insertError } = await supabase
        .from('lecture_notes' as any)
        .insert({
          title: formData.title.trim(),
          field: formData.field,
          lecturer: formData.lecturer.trim(),
          university: finalUniversity,
          university_short: finalUniversityShort,
          file_url: publicUrl,
          file_size: file.size,
          file_type: fileType,
          pages: formData.pages,
          image_url: imageUrl || null,
          verified: false,
          upload_date: new Date().toISOString().split('T')[0],
        });

      if (insertError) throw insertError;

      setUploadProgress(100);

      toast.success("Lecture note uploaded successfully!");
      
      setTimeout(() => {
        navigate('/education/lecture-notes');
      }, 1500);
    } catch (error: any) {
      console.error("Error uploading:", error);
      toast.error(error.message || "Failed to upload lecture note");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

  const isolatedStyles = `
    .upload-lecture-note-page {
      min-height: 100vh;
      background: #f2f4fe;
      display: flex;
      flex-direction: column;
    }

    .upload-lecture-note-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: ${DIRECTORY_PADDING.MOBILE.PADDING};
      padding-top: ${DIRECTORY_PADDING.MOBILE.PADDING_TOP};
    }

    .upload-lecture-note-back-button-wrapper {
      margin-bottom: 1.5rem;
    }

    .upload-lecture-note-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      width: 100%;
    }

    .upload-lecture-note-animation-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .upload-lecture-note-animation {
      width: 100%;
      max-width: 320px;
      height: 320px;
    }

    .upload-lecture-note-title-section {
      margin-top: 0.5rem;
      text-align: center;
    }

    .upload-lecture-note-title {
      font-size: 2rem;
      font-weight: 700;
      color: #4b5563;
      margin: 0 0 0.5rem 0;
      text-align: center;
      letter-spacing: 0.01em;
      line-height: 1.2;
    }

    .upload-lecture-note-subtitle {
      font-size: 1rem;
      color: #4b5563;
      margin: 0;
      line-height: 1.5;
      text-align: center;
    }

    .upload-lecture-note-form-wrapper {
      width: 100%;
    }

    .upload-lecture-note-back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      margin-bottom: 1.5rem;
      color: #475569;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .upload-lecture-note-back-button:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #1e293b;
    }

    .upload-lecture-note-card {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #e6e8ef;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 100%;
    }

    .upload-lecture-note-card-header {
      padding: 1.25rem ${DIRECTORY_PADDING.MOBILE.PADDING};
      border-bottom: 1px solid #e6e8ef;
      background: white;
    }

    .upload-lecture-note-card-content {
      flex: 1;
      padding: ${DIRECTORY_PADDING.MOBILE.PADDING};
      overflow-y: auto;
    }

    .upload-lecture-note-card-footer {
      padding: 1rem ${DIRECTORY_PADDING.MOBILE.PADDING};
      border-top: 1px solid #e6e8ef;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .upload-lecture-note-step-indicator {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .upload-lecture-note-step-dot {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .upload-lecture-note-step-dot.active {
      width: 32px;
      background: #2563eb;
    }

    .upload-lecture-note-step-dot.completed {
      background: #2563eb;
    }

    .upload-lecture-note-step-dot.pending {
      background: #cbd5e1;
    }

    /* Tablet: 768px - 1199px */
    @media ${MEDIA_QUERIES.TABLET} {
      .upload-lecture-note-container {
        padding: ${DIRECTORY_PADDING.TABLET.PADDING};
        padding-top: ${DIRECTORY_PADDING.TABLET.PADDING_TOP};
      }

      .upload-lecture-note-layout {
        grid-template-columns: 5fr 7fr;
        gap: 3rem;
        align-items: start;
      }

      .upload-lecture-note-animation-wrapper {
        position: sticky;
        top: 100px;
      }

      .upload-lecture-note-animation {
        max-width: 100%;
        width: 100%;
        height: 320px;
      }

      .upload-lecture-note-title {
        font-size: 2rem;
      }

      .upload-lecture-note-card-header {
        padding: 1.25rem ${DIRECTORY_PADDING.TABLET.PADDING};
      }

      .upload-lecture-note-card-content {
        padding: ${DIRECTORY_PADDING.TABLET.PADDING};
      }

      .upload-lecture-note-card-footer {
        padding: 1rem ${DIRECTORY_PADDING.TABLET.PADDING};
      }
    }

    /* Desktop: 1200px - 1599px */
    @media ${MEDIA_QUERIES.DESKTOP} {
      .upload-lecture-note-container {
        padding: ${DIRECTORY_PADDING.DESKTOP.PADDING};
        padding-top: ${DIRECTORY_PADDING.DESKTOP.PADDING_TOP};
      }

      .upload-lecture-note-layout {
        grid-template-columns: 5fr 7fr;
        gap: 3rem;
        align-items: start;
      }

      .upload-lecture-note-animation-wrapper {
        position: sticky;
        top: 120px;
      }

      .upload-lecture-note-animation {
        max-width: 100%;
        width: 100%;
        height: 320px;
      }

      .upload-lecture-note-title {
        font-size: 2rem;
      }

      .upload-lecture-note-card-header {
        padding: 1.25rem ${DIRECTORY_PADDING.DESKTOP.PADDING};
      }

      .upload-lecture-note-card-content {
        padding: ${DIRECTORY_PADDING.DESKTOP.PADDING};
      }

      .upload-lecture-note-card-footer {
        padding: 1rem ${DIRECTORY_PADDING.DESKTOP.PADDING};
      }
    }

    /* Large Desktop: 1600px+ */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      .upload-lecture-note-container {
        padding: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
        padding-top: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING_TOP};
      }

      .upload-lecture-note-layout {
        grid-template-columns: 5fr 7fr;
        gap: 3rem;
        align-items: start;
      }

      .upload-lecture-note-animation-wrapper {
        position: sticky;
        top: 120px;
      }

      .upload-lecture-note-animation {
        max-width: 100%;
        width: 100%;
        height: 320px;
      }

      .upload-lecture-note-title {
        font-size: 2rem;
      }

      .upload-lecture-note-card-header {
        padding: 1.25rem ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
      }

      .upload-lecture-note-card-content {
        padding: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
      }

      .upload-lecture-note-card-footer {
        padding: 1rem ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
      }
    }
  `;

  return (
    <div className="upload-lecture-note-page">
      <style>{isolatedStyles}</style>
      
      <div className="upload-lecture-note-container">
        {/* Back Button */}
        <div className="upload-lecture-note-back-button-wrapper">
          <button
            onClick={() => navigate('/education/lecture-notes')}
            className="upload-lecture-note-back-button"
          >
            <BackIcon className="w-4 h-4" />
            Back to Lecture Notes
          </button>
        </div>

        {/* Layout: Animation + Form */}
        <div className="upload-lecture-note-layout">
          {/* Left Side - Animation with Title */}
          <div className="upload-lecture-note-animation-wrapper">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="upload-lecture-note-animation"
            >
              <DotLottieReact
                src="https://lottie.host/a8b91dde-8500-4d9d-903c-298886ed34b1/EKa41OwTn9.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
            <div className="upload-lecture-note-title-section">
              <h1 
                className="upload-lecture-note-title"
                style={{ fontFamily: fontFamily }}
              >
                Upload Lecture Note
              </h1>
              <p 
                className="upload-lecture-note-subtitle"
                style={{ fontFamily: fontFamily }}
              >
                Share your knowledge and inspire the next generation
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="upload-lecture-note-form-wrapper">
            {/* Main Card */}
            <div className="upload-lecture-note-card">
          {/* Card Header */}
          <div className="upload-lecture-note-card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-lg font-semibold m-0"
                  style={{ 
                    fontSize: '1.13rem', 
                    fontWeight: 600, 
                    color: '#0066cc',
                    fontFamily: fontFamily 
                  }}
                >
                  {step === 1 && "Select Your File"}
                  {step === 2 && "Add Details"}
                  {step === 3 && "Review & Submit"}
                </h2>
                <p 
                  className="text-sm mt-1 m-0"
                  style={{ 
                    fontSize: '0.9375rem',
                    color: '#4b5563',
                    fontFamily: fontFamily 
                  }}
                >
                  {step === 1 && "Upload a PDF, PPT, or PPTX file (max 100MB)"}
                  {step === 2 && "Provide information about your lecture note"}
                  {step === 3 && "Please review your information before submitting"}
                </p>
              </div>
              <div className="upload-lecture-note-step-indicator">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`upload-lecture-note-step-dot ${
                      s === step
                        ? "active"
                        : s < step
                        ? "completed"
                        : "pending"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="upload-lecture-note-card-content">
            <AnimatePresence mode="wait">
              {/* Step 1: File Upload */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? "border-blue-500 bg-blue-50 scale-[1.02]"
                        : file
                        ? "border-blue-300 bg-blue-50/50"
                        : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                      >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                          <FileCheck className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-lg font-semibold text-slate-900 mb-1">
                          {file.name}
                        </p>
                        <p className="text-sm text-slate-600 mb-3">
                          {formatFileSize(file.size)} • {fileType}
                        </p>
                        {isDetectingPages ? (
                          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Detecting pages...</span>
                          </div>
                        ) : formData.pages > 0 ? (
                          <p className="text-sm text-blue-600 font-medium">
                            {formData.pages} {fileType === "PDF" ? "pages" : "slides"} detected
                          </p>
                        ) : null}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFilePreview(null);
                            setFormData(prev => ({ ...prev, pages: 0 }));
                          }}
                          className="mt-4 text-sm text-slate-600 hover:text-slate-900 underline"
                        >
                          Remove file
                        </button>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                          <Upload className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-lg font-semibold text-slate-900 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-600">
                          PDF, PPT, or PPTX (max 100MB)
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Form Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, title: e.target.value }));
                          if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
                        }}
                        placeholder="Enter lecture note title"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>

                    {/* Field */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Field/Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.field}
                        onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, field: value }));
                          if (errors.field) setErrors(prev => ({ ...prev, field: undefined }));
                        }}
                      >
                        <SelectTrigger className={errors.field ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.field && (
                        <p className="mt-1 text-sm text-red-500">{errors.field}</p>
                      )}
                    </div>

                    {/* Lecturer */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Lecturer/Author <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.lecturer}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, lecturer: e.target.value }));
                          if (errors.lecturer) setErrors(prev => ({ ...prev, lecturer: undefined }));
                        }}
                        placeholder="Enter lecturer name"
                        className={errors.lecturer ? "border-red-500" : ""}
                      />
                      {errors.lecturer && (
                        <p className="mt-1 text-sm text-red-500">{errors.lecturer}</p>
                      )}
                    </div>

                    {/* University / Affiliation */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        University / Affiliation <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.university}
                        onValueChange={(value) => {
                          const selected = universities.find(u => u.name === value);
                          setFormData(prev => ({
                            ...prev,
                            university: value,
                            universityShort: selected?.short || "",
                            customUniversity: "",
                          }));
                          if (errors.university) setErrors(prev => ({ ...prev, university: undefined }));
                        }}
                      >
                        <SelectTrigger className={errors.university ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select university or affiliation" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni.name} value={uni.name}>
                              {uni.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Other (specify below)</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.university === "custom" && (
                        <Input
                          value={formData.customUniversity}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, customUniversity: e.target.value }));
                            if (errors.university) setErrors(prev => ({ ...prev, university: undefined }));
                          }}
                          placeholder="Enter university or affiliation name"
                          className="mt-2"
                        />
                      )}
                      {errors.university && (
                        <p className="mt-1 text-sm text-red-500">{errors.university}</p>
                      )}
                    </div>

                    {/* Pages */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1.5"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Number of {fileType === "PDF" ? "Pages" : "Slides"} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.pages || ""}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 0 }));
                          if (errors.pages) setErrors(prev => ({ ...prev, pages: undefined }));
                        }}
                        placeholder="Enter page count"
                        className={errors.pages ? "border-red-500" : ""}
                      />
                      {errors.pages && (
                        <p className="mt-1 text-sm text-red-500">{errors.pages}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="bg-[#f8fafc] rounded-lg p-6 space-y-4 border border-[#e6e8ef]">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[#4b5563] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-sm font-medium mb-1"
                          style={{ 
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: '#1e293b',
                            fontFamily: fontFamily 
                          }}
                        >
                          File
                        </p>
                        <p 
                          className="text-sm truncate"
                          style={{ 
                            fontSize: '0.9375rem',
                            color: '#4b5563',
                            fontFamily: fontFamily 
                          }}
                        >
                          {file?.name}
                        </p>
                        <p 
                          className="text-xs mt-1"
                          style={{ 
                            fontSize: '0.8125rem',
                            color: '#6b7280',
                            fontFamily: fontFamily 
                          }}
                        >
                          {formatFileSize(file?.size || 0)} • {fileType}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-[#e6e8ef]" />

                    <div>
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Title
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        {formData.title}
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Field
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        {formData.field}
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        Lecturer
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        {formData.lecturer}
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        University / Affiliation
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        {formData.university === "custom" ? formData.customUniversity : formData.university}
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ 
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        {fileType === "PDF" ? "Pages" : "Slides"}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ 
                          fontSize: '0.9375rem',
                          color: '#1e293b',
                          fontFamily: fontFamily 
                        }}
                      >
                        {formData.pages}
                      </p>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Uploading...</span>
                        <span className="text-slate-900 font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      {isExtractingThumbnail && (
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Extracting thumbnail...
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card Footer */}
          <div className="upload-lecture-note-card-footer">
            <Button
              variant="outline"
              onClick={step === 1 ? () => navigate('/education/lecture-notes') : handleBack}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {step === 1 ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </>
              )}
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={isUploading || (step === 1 && !file)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 ml-auto"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 ml-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLectureNote;

