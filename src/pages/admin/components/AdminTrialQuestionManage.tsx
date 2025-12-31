import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceCard } from "@/components/ui/service-card";
import { 
  ArrowLeft,
  ArrowRight,
  Target,
  FileText,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  Loader2,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/admin";

interface MCQ {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation?: string;
}

interface SectionBDocument {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  fileUrl?: string;
}

interface TrialQuestionData {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  year: number;
  university: string;
  universityShort: string;
  mcqs: MCQ[];
  sectionBDocuments: SectionBDocument[];
}

const AdminTrialQuestionManage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"mcq" | "sectionB">("mcq");
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<TrialQuestionData | null>(null);
  const [mcqModalOpen, setMcqModalOpen] = useState(false);
  const [editingMCQ, setEditingMCQ] = useState<string | null>(null);
  const [mcqForm, setMcqForm] = useState({
    id: "",
    question: "",
    options: [
      { id: "A", label: "A", text: "" },
      { id: "B", label: "B", text: "" },
      { id: "C", label: "C", text: "" },
      { id: "D", label: "D", text: "" },
    ],
    correctAnswer: "",
    explanation: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mcqToDelete, setMcqToDelete] = useState<string | null>(null);
  const [sectionBModalOpen, setSectionBModalOpen] = useState(false);
  const [editingSectionB, setEditingSectionB] = useState<string | null>(null);
  const [sectionBForm, setSectionBForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileSize: "0 MB",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sectionBToDelete, setSectionBToDelete] = useState<string | null>(null);
  const [deleteSectionBModalOpen, setDeleteSectionBModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchQuestionData(id);
    }
  }, [id]);

  const fetchQuestionData = async (questionId: string) => {
    setLoading(true);
    try {
      // Fetch main question data
      const { data: questionData, error: questionError } = await supabase
        .from('trial_questions' as any)
        .select('*')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      // Fetch MCQs
      const { data: mcqsData, error: mcqsError } = await supabase
        .from('trial_question_mcqs' as any)
        .select('*')
        .eq('trial_question_id', questionId)
        .order('display_order', { ascending: true });

      if (mcqsError) throw mcqsError;

      // Fetch Section B documents
      const { data: sectionBData, error: sectionBError } = await supabase
        .from('trial_question_section_b' as any)
        .select('*')
        .eq('trial_question_id', questionId);

      if (sectionBError) throw sectionBError;

      const transformedMCQs: MCQ[] = (mcqsData || []).map((mcq: any) => ({
        id: mcq.id,
        question: mcq.question,
        options: Array.isArray(mcq.options) ? mcq.options : [],
        correctAnswer: mcq.correct_answer,
        explanation: mcq.explanation || "",
      }));

      const transformedSectionB: SectionBDocument[] = (sectionBData || []).map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description || "",
        fileSize: doc.file_size || "0 MB",
        uploadDate: doc.upload_date || new Date().toISOString(),
        downloadCount: doc.downloads || 0,
        fileUrl: doc.file_url || "",
      }));

      const qData = questionData as any;
      setQuestionData({
        id: qData.id,
        title: qData.title,
        courseCode: qData.course_code,
        courseName: qData.course_name,
        faculty: qData.faculty,
        year: qData.year,
        university: qData.university,
        universityShort: qData.university_short,
        mcqs: transformedMCQs,
        sectionBDocuments: transformedSectionB,
      });
    } catch (error: any) {
      console.error("Error fetching question data:", error);
      toast.error(`Failed to load question: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addMCQ = () => {
    setEditingMCQ("new");
    setMcqForm({
      id: "",
      question: "",
      options: [
        { id: "A", label: "A", text: "" },
        { id: "B", label: "B", text: "" },
        { id: "C", label: "C", text: "" },
        { id: "D", label: "D", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
    });
    setMcqModalOpen(true);
  };

  const editMCQ = (mcqId: string) => {
    const mcq = questionData?.mcqs.find(m => m.id === mcqId);
    if (!mcq) return;
    
    setEditingMCQ(mcqId);
    setMcqForm({
      id: mcq.id,
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correctAnswer,
      explanation: mcq.explanation || "",
    });
    setMcqModalOpen(true);
  };

  const saveMCQ = async () => {
    if (!mcqForm.question || !mcqForm.correctAnswer || mcqForm.options.some(opt => !opt.text)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!id) return;

    try {
      const mcqData = {
        trial_question_id: id,
        question: mcqForm.question,
        options: mcqForm.options,
        correct_answer: mcqForm.correctAnswer,
        explanation: mcqForm.explanation,
      };

      if (editingMCQ === "new") {
        // Get current max display_order
        const { data: existingMCQs } = await supabase
          .from('trial_question_mcqs' as any)
          .select('display_order')
          .eq('trial_question_id', id)
          .order('display_order', { ascending: false })
          .limit(1);

        const maxOrder = existingMCQs && existingMCQs.length > 0 
          ? (existingMCQs[0] as any).display_order + 1 
          : 0;

        const { error } = await supabase
          .from('trial_question_mcqs' as any)
          .insert({ ...mcqData, display_order: maxOrder });

        if (error) throw error;
        toast.success("MCQ added successfully");
      } else {
        const { error } = await supabase
          .from('trial_question_mcqs' as any)
          .update(mcqData)
          .eq('id', editingMCQ);

        if (error) throw error;
        toast.success("MCQ updated successfully");
      }

      // Update questions count
      const { data: mcqsData } = await supabase
        .from('trial_question_mcqs' as any)
        .select('id')
        .eq('trial_question_id', id);

      await supabase
        .from('trial_questions' as any)
        .update({ questions: mcqsData?.length || 0 })
        .eq('id', id);

      setMcqModalOpen(false);
      fetchQuestionData(id);
    } catch (error: any) {
      console.error("Error saving MCQ:", error);
      toast.error(`Failed to save MCQ: ${error.message}`);
    }
  };

  const deleteMCQ = async (mcqId: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('trial_question_mcqs' as any)
        .delete()
        .eq('id', mcqId);

      if (error) throw error;

      // Update questions count
      const { data: mcqsData } = await supabase
        .from('trial_question_mcqs' as any)
        .select('id')
        .eq('trial_question_id', id);

      await supabase
        .from('trial_questions' as any)
        .update({ questions: mcqsData?.length || 0 })
        .eq('id', id);

      toast.success("MCQ deleted successfully");
      fetchQuestionData(id);
    } catch (error: any) {
      console.error("Error deleting MCQ:", error);
      toast.error(`Failed to delete MCQ: ${error.message}`);
    }
  };

  const handleDeleteMCQ = () => {
    if (mcqToDelete) {
      deleteMCQ(mcqToDelete);
      setDeleteModalOpen(false);
      setMcqToDelete(null);
    }
  };

  const addSectionBDocument = () => {
    setEditingSectionB(null);
    setSectionBForm({
      title: "",
      description: "",
      fileUrl: "",
      fileSize: "0 MB",
    });
    setSectionBModalOpen(true);
  };

  const editSectionBDocument = (docId: string) => {
    const doc = questionData?.sectionBDocuments.find(d => d.id === docId);
    if (doc) {
      setEditingSectionB(docId);
      setSectionBForm({
        title: doc.title,
        description: doc.description,
        fileUrl: doc.fileUrl || "",
        fileSize: doc.fileSize,
      });
      setSectionBModalOpen(true);
    }
  };

  const handleSectionBFileUpload = async (file: File) => {
    if (!id) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${Date.now()}.${fileExt}`;
      const filePath = `section-b/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('trial-questions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trial-questions')
        .getPublicUrl(filePath);

      // Calculate file size
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const fileSizeStr = `${fileSizeMB} MB`;

      setSectionBForm(prev => ({
        ...prev,
        fileUrl: publicUrl,
        fileSize: fileSizeStr,
      }));

      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload file: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const saveSectionBDocument = async () => {
    if (!id) return;

    if (!sectionBForm.title || !sectionBForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!sectionBForm.fileUrl && editingSectionB === null) {
      toast.error("Please upload a file");
      return;
    }

    try {
      // Convert fileSize string to bytes for storage
      const fileSizeBytes = sectionBForm.fileSize.includes('MB')
        ? parseFloat(sectionBForm.fileSize) * 1024 * 1024
        : parseFloat(sectionBForm.fileSize) * 1024;

      const dataToSave = {
        trial_question_id: id,
        title: sectionBForm.title,
        description: sectionBForm.description,
        file_url: sectionBForm.fileUrl,
        file_size: fileSizeBytes,
        upload_date: new Date().toISOString(),
        downloads: 0,
      };

      if (editingSectionB) {
        const { error } = await supabase
          .from('trial_question_section_b' as any)
          .update(dataToSave)
          .eq('id', editingSectionB);

        if (error) throw error;
        toast.success("Section B document updated successfully");
      } else {
        const { error } = await supabase
          .from('trial_question_section_b' as any)
          .insert(dataToSave);

        if (error) throw error;
        toast.success("Section B document added successfully");
      }

      setSectionBModalOpen(false);
      fetchQuestionData(id);
    } catch (error: any) {
      console.error("Error saving Section B document:", error);
      toast.error(`Failed to save document: ${error.message}`);
    }
  };

  const deleteSectionBDocument = async (docId: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('trial_question_section_b' as any)
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast.success("Section B document deleted successfully");
      fetchQuestionData(id);
    } catch (error: any) {
      console.error("Error deleting Section B document:", error);
      toast.error(`Failed to delete document: ${error.message}`);
    }
  };

  const handleDeleteSectionB = () => {
    if (sectionBToDelete) {
      deleteSectionBDocument(sectionBToDelete);
      setDeleteSectionBModalOpen(false);
      setSectionBToDelete(null);
    }
  };

  if (loading || !questionData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">Loading questions...</h3>
        </div>
      </div>
    );
  }

  const shouldUseVerticalLayout = (options: MCQ['options']) => {
    return options.some(opt => opt.text.length > 30);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/education")}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trial Questions
          </Button>
        </div>

        {/* Course Info */}
        <div className="mb-8 flex flex-col items-center">
          <div className="text-center">
            <Badge className="mb-2 bg-slate-100 text-slate-700 px-3 py-1">
              {questionData.courseCode}
            </Badge>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {questionData.title}
            </h1>
            <p className="text-slate-600">
              {questionData.courseName} • {questionData.faculty}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-start' }}>
            <button
              onClick={() => setActiveTab("mcq")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: `1px solid ${activeTab === "mcq" ? '#0066cc' : '#e5e5e5'}`,
                borderRadius: '0.5rem',
                background: activeTab === "mcq" ? '#0066cc' : '#ffffff',
                color: activeTab === "mcq" ? '#ffffff' : '#000000',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Target size={16} />
              <span>MCQs ({questionData.mcqs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("sectionB")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: `1px solid ${activeTab === "sectionB" ? '#0066cc' : '#e5e5e5'}`,
                borderRadius: '0.5rem',
                background: activeTab === "sectionB" ? '#0066cc' : '#ffffff',
                color: activeTab === "sectionB" ? '#ffffff' : '#000000',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <FileText size={16} />
              <span>Section B ({questionData.sectionBDocuments.length})</span>
            </button>
          </div>
        </div>

        {/* MCQs Section */}
        {activeTab === "mcq" && (
          <div>
            <div className="mb-4 flex justify-end">
              <Button onClick={addMCQ} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add MCQ
              </Button>
            </div>

            {questionData.mcqs.length === 0 ? (
              <Card className="p-8 text-center">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No MCQs added yet. Click "Add MCQ" to get started.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {questionData.mcqs.map((mcq, index) => (
                  <Card key={mcq.id} className="p-0 overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={mcq.id} className="border-0">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:no-underline">
                          <div className="flex items-start gap-2 w-full text-left">
                            <span className="flex-shrink-0 font-semibold text-slate-700">
                              {index + 1}.
                            </span>
                            <span className="flex-1 text-left text-sm" style={{ fontSize: '0.95rem' }}>
                              {mcq.question}
                            </span>
                            <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editMCQ(mcq.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setMcqToDelete(mcq.id);
                                  setDeleteModalOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className={shouldUseVerticalLayout(mcq.options) 
                            ? "grid grid-cols-1 gap-3" 
                            : "grid grid-cols-2 gap-3"
                          }>
                            {mcq.options.map((option) => (
                              <div
                                key={option.id}
                                className={`p-3 rounded-lg border ${
                                  option.id === mcq.correctAnswer
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{option.label}.</span>
                                  <span className="text-sm">{option.text}</span>
                                  {option.id === mcq.correctAnswer && (
                                    <span className="ml-auto text-green-600 text-xs font-medium">✓ Correct</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {mcq.explanation && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-900">
                                <strong>Explanation:</strong> {mcq.explanation}
                              </p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section B Section */}
        {activeTab === "sectionB" && (
          <div>
            {questionData.sectionBDocuments.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No Section B documents added yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {questionData.sectionBDocuments.map((doc) => (
                  <Card key={doc.id} className="relative p-4 bg-slate-100/70 border border-slate-300/40 hover:border-slate-400/50 hover:shadow-lg transition-all">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold tracking-tight flex-1 pr-2">{doc.title}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => editSectionBDocument(doc.id)}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSectionBToDelete(doc.id);
                              setDeleteSectionBModalOpen(true);
                            }}
                            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-slate-600 mb-3 flex-1">{doc.description}</p>
                      )}
                      <a
                        href={doc.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline transition-colors"
                      >
                        DOWNLOAD
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MCQ Modal */}
      <Dialog open={mcqModalOpen} onOpenChange={setMcqModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[calc(100vw-2rem)] max-w-[42rem] [&>button]:hidden">
          <style>{`
            [data-radix-dialog-overlay][data-state="open"] {
              backdrop-filter: blur(12px) saturate(180%) !important;
              -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
              background: rgba(0, 0, 0, 0.5) !important;
            }
          `}</style>
          
          {/* Header - Whitish-grey */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e5e5e5',
            background: '#f8fafc',
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '4px',
              height: '32px',
              background: '#94a3b8',
              borderRadius: '2px',
            }}></div>
            <div style={{ flex: 1 }}>
              <DialogTitle style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0,
              }}>
                {editingMCQ === "new" ? "Add New MCQ" : "Edit MCQ"}
              </DialogTitle>
              <DialogDescription style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginTop: '0.25rem',
              }}>
                {editingMCQ === "new" ? "Create a new multiple choice question" : "Update the MCQ details"}
              </DialogDescription>
            </div>
            <button
              onClick={() => setMcqModalOpen(false)}
              style={{
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '2rem', overflowX: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Question *
              </label>
              <textarea
                value={mcqForm.question}
                onChange={(e) => setMcqForm(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question..."
                rows={3}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Options *
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '0.75rem',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}>
                {mcqForm.options.map((option, idx) => (
                  <div key={option.id} style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    alignItems: 'center',
                    minWidth: 0,
                    width: '100%',
                    maxWidth: '100%',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      minWidth: '24px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#0066cc',
                      color: '#ffffff',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {option.label}
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...mcqForm.options];
                        newOptions[idx].text = e.target.value;
                        setMcqForm(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${option.label}`}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        width: '100%',
                        maxWidth: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Correct Answer *
              </label>
              <select
                value={mcqForm.correctAnswer}
                onChange={(e) => setMcqForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select correct answer</option>
                {mcqForm.options.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Explanation
              </label>
              <textarea
                value={mcqForm.explanation}
                onChange={(e) => setMcqForm(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Explain why this is the correct answer..."
                rows={2}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e5e5e5',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}>
            <Button
              variant="outline"
              onClick={() => setMcqModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveMCQ}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingMCQ === "new" ? "Add MCQ" : "Update MCQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section B Modal */}
      <Dialog open={sectionBModalOpen} onOpenChange={setSectionBModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[calc(100vw-2rem)] max-w-[42rem] [&>button]:hidden">
          <style>{`
            [data-radix-dialog-overlay][data-state="open"] {
              backdrop-filter: blur(12px) saturate(180%) !important;
              -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
              background: rgba(0, 0, 0, 0.5) !important;
            }
          `}</style>
          
          {/* Header - Whitish-grey */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e5e5e5',
            background: '#f8fafc',
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '4px',
              height: '32px',
              background: '#94a3b8',
              borderRadius: '2px',
            }}></div>
            <div style={{ flex: 1 }}>
              <DialogTitle style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0,
              }}>
                {editingSectionB ? "Edit Section B Document" : "Add New Section B Document"}
              </DialogTitle>
              <DialogDescription style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginTop: '0.25rem',
              }}>
                {editingSectionB ? "Update the document details" : "Upload a new Section B document"}
              </DialogDescription>
            </div>
            <button
              onClick={() => setSectionBModalOpen(false)}
              style={{
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '2rem', overflowX: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Title *
              </label>
              <input
                type="text"
                value={sectionBForm.title}
                onChange={(e) => setSectionBForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title..."
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Description *
              </label>
              <textarea
                value={sectionBForm.description}
                onChange={(e) => setSectionBForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter document description..."
                rows={3}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                File {!editingSectionB && '*'}
              </label>
              {sectionBForm.fileUrl ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <a
                    href={sectionBForm.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0066cc',
                      textDecoration: 'underline',
                      fontSize: '0.875rem',
                    }}
                  >
                    Current file: {sectionBForm.fileUrl.split('/').pop()}
                  </a>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    ({sectionBForm.fileSize})
                  </span>
                </div>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleSectionBFileUpload(file);
                  }
                }}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #e5e5e5',
                  borderRadius: '0.375rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: uploading ? '#f8fafc' : '#ffffff',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.borderColor = '#0066cc';
                    e.currentTarget.style.background = '#f0f7ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!uploading) {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {uploading ? (
                  <div>
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      Click to upload or drag and drop
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      PDF files only
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e5e5e5',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}>
            <Button
              variant="outline"
              onClick={() => setSectionBModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSectionBDocument}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={uploading}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingSectionB ? "Update Document" : "Add Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal for MCQs */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteMCQ}
        title="Delete MCQ"
        description="Are you sure you want to delete this MCQ? This action cannot be undone."
        variant="danger"
      />

      {/* Delete Confirmation Modal for Section B */}
      <ConfirmationModal
        open={deleteSectionBModalOpen}
        onOpenChange={setDeleteSectionBModalOpen}
        onConfirm={handleDeleteSectionB}
        title="Delete Section B Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        variant="danger"
      />
    </div>
  );
};

export default AdminTrialQuestionManage;

