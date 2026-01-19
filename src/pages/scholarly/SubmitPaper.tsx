// ============================================================================
// PAPER SUBMISSION WORKFLOW
// ============================================================================
// Elegant, step-by-step paper submission system
// Inspired by Elsevier, Springer, IEEE submission portals
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDisciplines } from '@/utils/scholarlyRankingData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  FileText,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Tag,
  FileCheck,
  Plus,
  Mail,
  User,
  Trash2,
  Link2,
  Hash,
} from 'lucide-react';

const SubmitPaper: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: [] as string[],
    keywordInput: '',
    disciplineCategory: '',
    discipline: '',
    disciplineInput: '',
    articleType: 'research',
    authors: [
      { name: '', email: '', affiliation: '', isCorresponding: true },
    ],
    university: 'Massachusetts Institute of Technology',
    pdfFile: null as File | null,
    references: [] as string[],
    referencesInput: '',
    identifierType: '' as 'doi' | 'issn' | 'isbn' | 'other' | '',
    identifierValue: '',
    identifierUrl: '',
  });

  const totalSteps = 4;
  const [showDisciplineSuggestions, setShowDisciplineSuggestions] = useState(false);
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(-1);
  const disciplineInputRef = useRef<HTMLInputElement>(null);
  const disciplineSuggestionsRef = useRef<HTMLDivElement>(null);

  // Get available sub-disciplines based on selected category
  const getAvailableSubDisciplines = (): string[] => {
    if (!formData.disciplineCategory) return [];
    const category = mockDisciplines.find((d) => d.id === formData.disciplineCategory);
    return category?.children?.map((child) => child.name) || [];
  };

  // Get filtered suggestions based on input
  const getDisciplineSuggestions = (): string[] => {
    const available = getAvailableSubDisciplines();
    if (!formData.disciplineInput.trim()) return available;
    const inputLower = formData.disciplineInput.toLowerCase();
    return available.filter((name) => name.toLowerCase().includes(inputLower));
  };

  // Handle discipline input change
  const handleDisciplineInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      disciplineInput: value,
      discipline: '', // Clear selected discipline when typing
    }));
    setShowDisciplineSuggestions(true);
  };

  // Handle discipline selection from suggestions
  const handleDisciplineSelect = (disciplineName: string) => {
    setFormData((prev) => ({
      ...prev,
      discipline: disciplineName,
      disciplineInput: disciplineName,
    }));
    setShowDisciplineSuggestions(false);
  };

  // Handle adding a custom sub-discipline
  const handleAddCustomDiscipline = () => {
    const customDiscipline = formData.disciplineInput.trim();
    if (customDiscipline) {
      setFormData((prev) => ({
        ...prev,
        discipline: customDiscipline,
        disciplineInput: customDiscipline,
      }));
      setShowDisciplineSuggestions(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      disciplineCategory: categoryId,
      discipline: '',
      disciplineInput: '',
    }));
    setShowDisciplineSuggestions(false);
    setHighlightedSuggestionIndex(-1);
  };

  // Handle keyboard navigation in autocomplete
  const handleDisciplineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestions = getDisciplineSuggestions();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowDisciplineSuggestions(true);
      setHighlightedSuggestionIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedSuggestionIndex >= 0 && suggestions[highlightedSuggestionIndex]) {
        handleDisciplineSelect(suggestions[highlightedSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDisciplineSuggestions(false);
      setHighlightedSuggestionIndex(-1);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        disciplineInputRef.current &&
        !disciplineInputRef.current.contains(event.target as Node) &&
        disciplineSuggestionsRef.current &&
        !disciplineSuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowDisciplineSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = `
    .sr-submit-page {
      min-height: auto;
      background: transparent;
    }

    .sr-submit-header {
      background: transparent;
      border-bottom: 1px solid #E7E5E4;
      padding: 0 0 24px;
      margin-bottom: 24px;
    }

    .sr-submit-header__container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px 32px;
    }

    .sr-submit-header__title {
      font-family: 'Crimson Text', Georgia, serif;
      font-size: 2rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 24px 0;
    }

    .sr-submit-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .sr-submit-progress__step {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sr-submit-progress__step-number {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .sr-submit-progress__step--active .sr-submit-progress__step-number {
      background: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-submit-progress__step--completed .sr-submit-progress__step-number {
      background: #2D5A47;
      color: #FFFFFF;
    }

    .sr-submit-progress__step--pending .sr-submit-progress__step-number {
      background: #F5F5F4;
      color: #78716C;
      border: 2px solid #E7E5E4;
    }

    .sr-submit-progress__step-label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #78716C;
      display: none;
    }

    @media (min-width: 768px) {
      .sr-submit-progress__step-label {
        display: block;
      }
    }

    .sr-submit-progress__step--active .sr-submit-progress__step-label {
      color: #1C1917;
      font-weight: 500;
    }

    .sr-submit-progress__connector {
      flex: 1;
      height: 2px;
      background: #E7E5E4;
      margin: 0 8px;
    }

    .sr-submit-progress__connector--completed {
      background: #2D5A47;
    }

    .sr-submit-content {
      max-width: 960px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }

    .sr-submit-form {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 40px;
    }

    @media (max-width: 640px) {
      .sr-submit-form {
        padding: 24px;
      }
    }

    .sr-submit-form__group {
      margin-bottom: 32px;
    }

    .sr-submit-form__label {
      display: block;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin-bottom: 8px;
    }

    .sr-submit-form__label-required {
      color: #7C2D36;
    }

    .sr-submit-form__input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      transition: all 0.2s ease;
    }

    .sr-submit-form__input:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-submit-form__input--error {
      border-color: #7C2D36;
    }

    .sr-submit-form__textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      resize: vertical;
      transition: all 0.2s ease;
    }

    .sr-submit-form__textarea:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-submit-form__select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2357534E' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 40px;
    }

    .sr-submit-form__select:focus {
      outline: none;
      border-color: #1E3A5F;
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }

    .sr-submit-form__discipline-wrapper {
      position: relative;
    }

    .sr-submit-form__discipline-autocomplete {
      position: relative;
    }

    .sr-submit-form__discipline-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 4px;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-height: 240px;
      overflow-y: auto;
      z-index: 1000;
    }

    .sr-submit-form__discipline-suggestion {
      padding: 12px 16px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #1C1917;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .sr-submit-form__discipline-suggestion:hover,
    .sr-submit-form__discipline-suggestion--highlighted {
      background: #F5F5F4;
    }

    .sr-submit-form__discipline-suggestion:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .sr-submit-form__discipline-suggestion:last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .sr-submit-form__discipline-empty {
      padding: 16px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #78716C;
      text-align: center;
    }

    .sr-submit-form__discipline-add-btn {
      width: 100%;
      margin-top: 12px;
      padding: 10px 16px;
      background: #1E3A5F;
      color: #FFFFFF;
      border: none;
      border-radius: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .sr-submit-form__discipline-add-btn:hover {
      background: #2D5A47;
    }

    .sr-submit-form__discipline-add-btn:active {
      transform: scale(0.98);
    }

    .sr-submit-form__keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .sr-submit-form__keyword {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #F5F5F4;
      border-radius: 100px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #57534E;
    }

    .sr-submit-form__keyword-remove {
      background: none;
      border: none;
      color: #78716C;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      transition: color 0.15s ease;
    }

    .sr-submit-form__keyword-remove:hover {
      color: #1C1917;
    }

    .sr-submit-form__file-upload {
      border: 2px dashed #E7E5E4;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .sr-submit-form__file-upload:hover {
      border-color: #1E3A5F;
      background: rgba(30, 58, 95, 0.02);
    }

    .sr-submit-form__file-upload--has-file {
      border-color: #2D5A47;
      background: rgba(45, 90, 71, 0.05);
    }

    .sr-submit-form__file-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 58, 95, 0.08);
      border-radius: 8px;
      color: #1E3A5F;
      margin: 0 auto 16px;
    }

    .sr-submit-form__file-text {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      color: #57534E;
      margin: 0 0 8px 0;
    }

    .sr-submit-form__file-name {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      color: #1C1917;
      font-weight: 500;
      margin: 0;
    }

    .sr-submit-form__error {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.8125rem;
      color: #7C2D36;
      margin-top: 8px;
    }

    .sr-submit-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px solid #E7E5E4;
    }

    .sr-submit-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .sr-submit-btn--primary {
      background: #1E3A5F;
      color: #FFFFFF;
    }

    .sr-submit-btn--primary:hover:not(:disabled) {
      background: #2D4A6F;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.2);
    }

    .sr-submit-btn--secondary {
      background: transparent;
      border: 1px solid #E7E5E4;
      color: #57534E;
    }

    .sr-submit-btn--secondary:hover {
      background: #F5F5F4;
      border-color: #D6D3D1;
    }

    .sr-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    input[type="file"] {
      display: none;
    }

    /* References Preview Scrollbar */
    .sr-references-preview::-webkit-scrollbar {
      width: 6px;
    }

    .sr-references-preview::-webkit-scrollbar-track {
      background: #F5F5F4;
      border-radius: 3px;
    }

    .sr-references-preview::-webkit-scrollbar-thumb {
      background: #A8A29E;
      border-radius: 3px;
    }

    .sr-references-preview::-webkit-scrollbar-thumb:hover {
      background: #78716C;
    }
  `;

  const handleKeywordAdd = () => {
    if (formData.keywordInput.trim() && !formData.keywords.includes(formData.keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, prev.keywordInput.trim()],
        keywordInput: '',
      }));
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleAddAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, { name: '', email: '', affiliation: '', isCorresponding: false }],
    }));
  };

  const handleRemoveAuthor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, idx) => idx !== index),
    }));
  };

  const handleAuthorChange = (index: number, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.map((author, idx) => {
        if (idx === index) {
          const updated = { ...author, [field]: value };
          return updated;
        }
        // If setting this author as corresponding, unset all others
        if (field === 'isCorresponding' && value === true) {
          return { ...author, isCorresponding: false };
        }
        return author;
      }),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, pdfFile: file }));
    }
  };

  // Smart reference parser - handles multiple formats intelligently
  const parseReferences = (input: string): string[] => {
    if (!input || !input.trim()) return [];

    // Split by newlines first
    let lines = input.split(/\r?\n/).filter(line => line.trim());

    // If we have numbered references, clean them up
    const cleanedReferences: string[] = [];
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Remove common numbering patterns: [1], 1., (1), 1), etc.
      // Also handles patterns like "1)", "1.", "[1]", "(1)", "1-", etc.
      line = line.replace(/^(\[?\d+\]?[.)\-]\s*|\(\d+\)\s*|\d+[.)]\s*)/, '');
      
      // Remove leading/trailing whitespace
      line = line.trim();
      
      // Skip if line is just a number or very short (likely not a real reference)
      if (line && line.length > 5 && !/^\d+$/.test(line)) {
        cleanedReferences.push(line);
      }
    }

    return cleanedReferences;
  };

  const handleReferencesPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      referencesInput: value,
      references: parseReferences(value),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.abstract.trim()) {
        newErrors.abstract = 'Abstract is required';
      } else if (formData.abstract.length < 100) {
        newErrors.abstract = 'Abstract must be at least 100 characters';
      }
      if (formData.keywords.length === 0) {
        newErrors.keywords = 'At least one keyword is required';
      }
      // Validate authors
      if (formData.authors.length === 0) {
        newErrors.authors = 'At least one author is required';
      } else {
        const hasCorresponding = formData.authors.some(a => a.isCorresponding);
        if (!hasCorresponding) {
          newErrors.authors = 'At least one corresponding author is required';
        }
        formData.authors.forEach((author, idx) => {
          if (!author.name.trim()) {
            newErrors[`author_${idx}_name`] = 'Author name is required';
          }
          if (!author.email.trim()) {
            newErrors[`author_${idx}_email`] = 'Author email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email)) {
            newErrors[`author_${idx}_email`] = 'Valid email is required';
          }
          if (!author.affiliation.trim()) {
            newErrors[`author_${idx}_affiliation`] = 'Affiliation is required';
          }
        });
      }
    }

    if (step === 2) {
      if (!formData.disciplineCategory) {
        newErrors.disciplineCategory = 'Discipline category is required';
      }
      if (!formData.discipline) {
        newErrors.discipline = 'Sub-discipline is required';
      }
    }

    if (step === 3) {
      if (!formData.pdfFile) {
        newErrors.pdfFile = 'PDF file is required';
      }
      if (formData.references.length === 0) {
        newErrors.references = 'At least one reference is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        toast.error('Please sign in to submit a paper');
        navigate('/scholarly/auth/sign-in');
        return;
      }

      // Get user's profile to get institution_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('institution_id')
        .eq('user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profile?.institution_id) {
        toast.error('Please complete your profile and set your institution affiliation before submitting a paper');
        navigate('/scholar/profile');
        return;
      }

      // Upload PDF to Supabase Storage
      let pdfUrl = '';
      if (formData.pdfFile) {
        const fileExt = formData.pdfFile.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('article-pdfs')
          .upload(fileName, formData.pdfFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('article-pdfs')
          .getPublicUrl(fileName);

        pdfUrl = publicUrl;
      }

      // Create article record
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert({
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords,
          discipline_category: formData.disciplineCategory,
          discipline: formData.discipline,
          article_type: formData.articleType,
          pdf_url: pdfUrl,
          identifier_type: formData.identifierType || null,
          identifier_value: formData.identifierValue || null,
          identifier_url: formData.identifierUrl || null,
          status: 'under-review', // Default status as per requirements
          submitted_by: session.user.id,
          institution_id: profile.institution_id,
        })
        .select()
        .single();

      if (articleError) throw articleError;

      if (!article) {
        throw new Error('Failed to create article');
      }

      // Create article authors
      if (formData.authors.length > 0) {
        const authorsData = formData.authors.map((author, index) => ({
          article_id: article.id,
          name: author.name,
          email: author.email,
          affiliation: author.affiliation,
          is_corresponding: author.isCorresponding,
          author_order: index + 1,
        }));

        const { error: authorsError } = await supabase
          .from('article_authors')
          .insert(authorsData);

        if (authorsError) throw authorsError;
      }

      // Create article references
      if (formData.references.length > 0) {
        const referencesData = formData.references.map((ref, index) => ({
          article_id: article.id,
          reference_text: ref,
          reference_order: index + 1,
        }));

        const { error: referencesError } = await supabase
          .from('article_references')
          .insert(referencesData);

        if (referencesError) throw referencesError;
      }

      toast.success('Paper submitted successfully! It is now under review.');
      navigate('/scholar/dashboard');
    } catch (error: any) {
      console.error('Error submitting paper:', error);
      toast.error(`Failed to submit paper: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Paper Title <span className="sr-submit-form__label-required">*</span>
              </label>
              <input
                type="text"
                className={`sr-submit-form__input ${errors.title ? 'sr-submit-form__input--error' : ''}`}
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter the full title of your paper"
              />
              {errors.title && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.title}
                </div>
              )}
            </div>

            {/* Publication Identifier Section */}
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Publication Identifier
              </label>
              <p style={{
                fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                fontSize: '0.8125rem',
                color: '#78716C',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                If this paper has been published, please provide its identifier (DOI, ISSN, ISBN, etc.) and link to the original publication.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#57534E',
                    marginBottom: '6px'
                  }}>
                    <Hash size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Identifier Type
                  </label>
                  <select
                    className="sr-submit-form__select"
                    value={formData.identifierType}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      identifierType: e.target.value as 'doi' | 'issn' | 'isbn' | 'other' | '',
                      identifierValue: '',
                      identifierUrl: ''
                    }))}
                  >
                    <option value="">Select identifier type (optional)</option>
                    <option value="doi">DOI (Digital Object Identifier)</option>
                    <option value="issn">ISSN (International Standard Serial Number)</option>
                    <option value="isbn">ISBN (International Standard Book Number)</option>
                    <option value="other">Other Identifier</option>
                  </select>
                </div>

                {formData.identifierType && (
                  <>
                    <div>
                      <label style={{
                        display: 'block',
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#57534E',
                        marginBottom: '6px'
                      }}>
                        {formData.identifierType === 'doi' && 'DOI'}
                        {formData.identifierType === 'issn' && 'ISSN'}
                        {formData.identifierType === 'isbn' && 'ISBN'}
                        {formData.identifierType === 'other' && 'Identifier Value'}
                        {formData.identifierType && (
                          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', marginLeft: '4px' }}>
                            {formData.identifierType === 'doi' && '(e.g., 10.1234/example.2026.01.001)'}
                            {formData.identifierType === 'issn' && '(e.g., 1234-5678)'}
                            {formData.identifierType === 'isbn' && '(e.g., 978-0-123456-78-9)'}
                            {formData.identifierType === 'other' && '(e.g., arXiv:2026.12345)'}
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        className="sr-submit-form__input"
                        value={formData.identifierValue}
                        onChange={(e) => setFormData((prev) => ({ ...prev, identifierValue: e.target.value }))}
                        placeholder={
                          formData.identifierType === 'doi' ? '10.1234/example.2026.01.001' :
                          formData.identifierType === 'issn' ? '1234-5678' :
                          formData.identifierType === 'isbn' ? '978-0-123456-78-9' :
                          'Enter identifier value'
                        }
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: '#57534E',
                        marginBottom: '6px'
                      }}>
                        <Link2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        Publication URL (optional)
                      </label>
                      <input
                        type="url"
                        className="sr-submit-form__input"
                        value={formData.identifierUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, identifierUrl: e.target.value }))}
                        placeholder="https://example.com/article/..."
                      />
                      <p style={{
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.75rem',
                        color: '#78716C',
                        margin: '6px 0 0 0',
                        fontStyle: 'italic'
                      }}>
                        Link to the original publication page
                      </p>
                    </div>

                    {formData.identifierType === 'doi' && formData.identifierValue && (
                      <div style={{
                        padding: '12px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        marginTop: '8px'
                      }}>
                        <p style={{
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          color: '#1E40AF',
                          margin: '0 0 4px 0',
                          fontWeight: 500
                        }}>
                          DOI Link:
                        </p>
                        <a
                          href={`https://doi.org/${formData.identifierValue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.8125rem',
                            color: '#3B82F6',
                            textDecoration: 'none',
                            wordBreak: 'break-all'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          https://doi.org/{formData.identifierValue}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Abstract <span className="sr-submit-form__label-required">*</span>
              </label>
              <textarea
                className={`sr-submit-form__textarea ${errors.abstract ? 'sr-submit-form__input--error' : ''}`}
                value={formData.abstract}
                onChange={(e) => setFormData((prev) => ({ ...prev, abstract: e.target.value }))}
                placeholder="Provide a comprehensive abstract of your research (minimum 100 characters)"
              />
              {errors.abstract && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.abstract}
                </div>
              )}
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Keywords <span className="sr-submit-form__label-required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="sr-submit-form__input"
                  value={formData.keywordInput}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keywordInput: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleKeywordAdd();
                    }
                  }}
                  placeholder="Enter keyword and press Enter"
                />
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--secondary"
                  onClick={handleKeywordAdd}
                >
                  Add
                </button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="sr-submit-form__keywords">
                  {formData.keywords.map((keyword) => (
                    <span key={keyword} className="sr-submit-form__keyword">
                      {keyword}
                      <button
                        type="button"
                        className="sr-submit-form__keyword-remove"
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.keywords && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.keywords}
                </div>
              )}
            </div>

            {/* Authors Section */}
            <div className="sr-submit-form__group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label className="sr-submit-form__label">
                  Authors <span className="sr-submit-form__label-required">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddAuthor}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: '#F5F5F4',
                    border: '1px solid #E7E5E4',
                    borderRadius: '6px',
                    fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#57534E',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#E7E5E4';
                    e.currentTarget.style.borderColor = '#D6D3D1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F5F5F4';
                    e.currentTarget.style.borderColor = '#E7E5E4';
                  }}
                >
                  <Plus size={14} />
                  Add Author
                </button>
              </div>
              
              <p style={{
                fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                fontSize: '0.8125rem',
                color: '#78716C',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                Add all authors who contributed to this paper. Mark the corresponding author with the checkbox.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {formData.authors.map((author, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      background: '#F5F5F4',
                      border: '1px solid #E7E5E4',
                      borderRadius: '8px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1C1917'
                      }}>
                        Author {idx + 1}
                        {author.isCorresponding && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            background: '#1E3A5F',
                            color: '#FFFFFF',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            Corresponding
                          </span>
                        )}
                      </span>
                      {formData.authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            padding: 0,
                            background: 'transparent',
                            border: '1px solid #E7E5E4',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#78716C',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FEF2F2';
                            e.currentTarget.style.borderColor = '#FCA5A5';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#E7E5E4';
                            e.currentTarget.style.color = '#78716C';
                          }}
                          title="Remove author"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#57534E',
                          marginBottom: '6px'
                        }}>
                          <User size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          Full Name <span style={{ color: '#7C2D36' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`sr-submit-form__input ${errors[`author_${idx}_name`] ? 'sr-submit-form__input--error' : ''}`}
                          value={author.name}
                          onChange={(e) => handleAuthorChange(idx, 'name', e.target.value)}
                          placeholder="e.g., Dr. Sarah Chen"
                        />
                        {errors[`author_${idx}_name`] && (
                          <div className="sr-submit-form__error" style={{ marginTop: '4px' }}>
                            <AlertCircle size={12} />
                            {errors[`author_${idx}_name`]}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#57534E',
                          marginBottom: '6px'
                        }}>
                          <Mail size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          Email Address <span style={{ color: '#7C2D36' }}>*</span>
                        </label>
                        <input
                          type="email"
                          className={`sr-submit-form__input ${errors[`author_${idx}_email`] ? 'sr-submit-form__input--error' : ''}`}
                          value={author.email}
                          onChange={(e) => handleAuthorChange(idx, 'email', e.target.value)}
                          placeholder="e.g., s.chen@university.edu"
                        />
                        {errors[`author_${idx}_email`] && (
                          <div className="sr-submit-form__error" style={{ marginTop: '4px' }}>
                            <AlertCircle size={12} />
                            {errors[`author_${idx}_email`]}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#57534E',
                          marginBottom: '6px'
                        }}>
                          <Building2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          Affiliation <span style={{ color: '#7C2D36' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`sr-submit-form__input ${errors[`author_${idx}_affiliation`] ? 'sr-submit-form__input--error' : ''}`}
                          value={author.affiliation}
                          onChange={(e) => handleAuthorChange(idx, 'affiliation', e.target.value)}
                          placeholder="e.g., University of Ghana"
                        />
                        {errors[`author_${idx}_affiliation`] && (
                          <div className="sr-submit-form__error" style={{ marginTop: '4px' }}>
                            <AlertCircle size={12} />
                            {errors[`author_${idx}_affiliation`]}
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 0'
                      }}>
                        <input
                          type="checkbox"
                          id={`corresponding-${idx}`}
                          checked={author.isCorresponding}
                          onChange={(e) => handleAuthorChange(idx, 'isCorresponding', e.target.checked)}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#1E3A5F'
                          }}
                        />
                        <label
                          htmlFor={`corresponding-${idx}`}
                          style={{
                            fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                            fontSize: '0.875rem',
                            color: '#57534E',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          Corresponding author
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.authors && (
                <div className="sr-submit-form__error" style={{ marginTop: '12px' }}>
                  <AlertCircle size={14} />
                  {errors.authors}
                </div>
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Discipline Category <span className="sr-submit-form__label-required">*</span>
              </label>
              <select
                className={`sr-submit-form__select ${errors.disciplineCategory ? 'sr-submit-form__input--error' : ''}`}
                value={formData.disciplineCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {mockDisciplines.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.disciplineCategory && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.disciplineCategory}
                </div>
              )}
            </div>

            {formData.disciplineCategory && (
              <div className="sr-submit-form__group">
                <label className="sr-submit-form__label">
                  Sub-Discipline <span className="sr-submit-form__label-required">*</span>
                </label>
                <div className="sr-submit-form__discipline-wrapper">
                  <div className="sr-submit-form__discipline-autocomplete">
                    <input
                      ref={disciplineInputRef}
                      type="text"
                      className={`sr-submit-form__input ${errors.discipline ? 'sr-submit-form__input--error' : ''}`}
                      value={formData.disciplineInput}
                      onChange={(e) => {
                        handleDisciplineInputChange(e.target.value);
                        setHighlightedSuggestionIndex(-1);
                      }}
                      onFocus={() => setShowDisciplineSuggestions(true)}
                      onKeyDown={handleDisciplineKeyDown}
                      placeholder="Type to search sub-disciplines..."
                      autoComplete="off"
                    />
                    {showDisciplineSuggestions && getDisciplineSuggestions().length > 0 && (
                      <div
                        ref={disciplineSuggestionsRef}
                        className="sr-submit-form__discipline-suggestions"
                      >
                        {getDisciplineSuggestions().map((suggestion, index) => (
                          <div
                            key={suggestion}
                            className={`sr-submit-form__discipline-suggestion ${
                              index === highlightedSuggestionIndex
                                ? 'sr-submit-form__discipline-suggestion--highlighted'
                                : ''
                            }`}
                            onClick={() => handleDisciplineSelect(suggestion)}
                            onMouseEnter={() => setHighlightedSuggestionIndex(index)}
                            onMouseLeave={() => setHighlightedSuggestionIndex(-1)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    {showDisciplineSuggestions && formData.disciplineInput.trim() && getDisciplineSuggestions().length === 0 && (
                      <div
                        ref={disciplineSuggestionsRef}
                        className="sr-submit-form__discipline-suggestions"
                      >
                        <div className="sr-submit-form__discipline-empty">
                          <p style={{ margin: '0 0 12px 0' }}>
                            No sub-disciplines found matching "<strong>{formData.disciplineInput}</strong>"
                          </p>
                          <button
                            type="button"
                            className="sr-submit-form__discipline-add-btn"
                            onClick={handleAddCustomDiscipline}
                          >
                            <Plus size={16} />
                            Add "{formData.disciplineInput}" as new sub-discipline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {errors.discipline && (
                  <div className="sr-submit-form__error">
                    <AlertCircle size={14} />
                    {errors.discipline}
                  </div>
                )}
              </div>
            )}

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">Article Type</label>
              <select
                className="sr-submit-form__select"
                value={formData.articleType}
                onChange={(e) => setFormData((prev) => ({ ...prev, articleType: e.target.value }))}
              >
                <option value="research">Research Article</option>
                <option value="review">Review</option>
                <option value="case-study">Case Study</option>
                <option value="commentary">Commentary</option>
                <option value="letter">Letter</option>
              </select>
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">University Affiliation</label>
              <input
                type="text"
                className="sr-submit-form__input"
                value={formData.university}
                onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
                readOnly
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                Upload PDF <span className="sr-submit-form__label-required">*</span>
              </label>
              <label
                htmlFor="pdf-upload"
                className={`sr-submit-form__file-upload ${formData.pdfFile ? 'sr-submit-form__file-upload--has-file' : ''}`}
              >
                <div className="sr-submit-form__file-icon">
                  <Upload size={24} />
                </div>
                {formData.pdfFile ? (
                  <>
                    <p className="sr-submit-form__file-name">{formData.pdfFile.name}</p>
                    <p className="sr-submit-form__file-text">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="sr-submit-form__file-text">
                      Click to upload or drag and drop
                    </p>
                    <p className="sr-submit-form__file-text" style={{ fontSize: '0.8125rem', color: '#78716C' }}>
                      PDF files only (max 10MB)
                    </p>
                  </>
                )}
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
              />
              {errors.pdfFile && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.pdfFile}
                </div>
              )}
            </div>

            <div className="sr-submit-form__group">
              <label className="sr-submit-form__label">
                References <span className="sr-submit-form__label-required">*</span>
              </label>
              <p style={{ 
                fontFamily: "'Source Sans Pro', system-ui, sans-serif", 
                fontSize: '0.8125rem', 
                color: '#78716C', 
                margin: '0 0 12px 0',
                lineHeight: '1.5'
              }}>
                Paste all your references below. You can copy and paste from your document - 
                each reference should be on a new line. Numbered references (like [1], 1., etc.) will be automatically cleaned.
              </p>
              <textarea
                className={`sr-submit-form__textarea ${errors.references ? 'sr-submit-form__input--error' : ''}`}
                value={formData.referencesInput}
                onChange={handleReferencesPaste}
                placeholder="Paste your references here, one per line. For example:&#10;&#10;Shor, P.W. (1995). Scheme for reducing decoherence in quantum computer memory. Phys. Rev. A, 52, R2493.&#10;Steane, A.M. (1996). Error Correcting Codes in Quantum Theory. Phys. Rev. Lett., 77, 793.&#10;Kitaev, A.Y. (2003). Fault-tolerant quantum computation by anyons. Annals of Physics, 303(1), 2-30."
                rows={12}
                style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem' }}
              />
              {errors.references && (
                <div className="sr-submit-form__error">
                  <AlertCircle size={14} />
                  {errors.references}
                </div>
              )}
              
              {/* References Preview */}
              {formData.references.length > 0 && (
                <div style={{ 
                  marginTop: '20px', 
                  padding: '20px', 
                  background: '#F5F5F4', 
                  borderRadius: '8px',
                  border: '1px solid #E7E5E4'
                }}>
                  <p style={{ 
                    fontFamily: "'Source Sans Pro', system-ui, sans-serif", 
                    fontSize: '0.875rem', 
                    fontWeight: 600, 
                    color: '#1C1917', 
                    margin: '0 0 16px 0' 
                  }}>
                    Preview ({formData.references.length} reference{formData.references.length !== 1 ? 's' : ''})
                  </p>
                  <div className="sr-references-preview" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {formData.references.map((ref, idx) => (
                      <div key={idx} style={{
                        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                        fontSize: '0.9375rem',
                        color: '#57534E',
                        lineHeight: '1.6',
                        paddingLeft: '28px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          top: '0',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.8125rem',
                          color: '#78716C'
                        }}>
                          [{idx + 1}]
                        </span>
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(45, 90, 71, 0.1)', borderRadius: '12px', color: '#2D5A47' }}>
                <FileCheck size={32} />
              </div>
              <h2 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: '1.5rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0' }}>
                Review Your Submission
              </h2>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#57534E', margin: 0 }}>
                Please review all information before submitting
              </p>
            </div>

            <div className="sr-submit-form__group">
              <div style={{ background: '#F5F5F4', borderRadius: '8px', padding: '20px' }}>
                {/* Title */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                    <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#1C1917', margin: 0, lineHeight: '1.6' }}>{formData.title || 'Not provided'}</p>
                  </div>
                </div>

                {/* Publication Identifier */}
                {(formData.identifierType && formData.identifierValue) && (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Publication Identifier
                    </p>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                      <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.8125rem', color: '#57534E', margin: '0 0 8px 0' }}>
                        <strong style={{ textTransform: 'uppercase', color: '#1C1917', fontSize: '0.875rem' }}>
                          {formData.identifierType === 'doi' && 'DOI'}
                          {formData.identifierType === 'issn' && 'ISSN'}
                          {formData.identifierType === 'isbn' && 'ISBN'}
                          {formData.identifierType === 'other' && 'Identifier'}
                        </strong>
                        : {formData.identifierValue}
                      </p>
                      {formData.identifierType === 'doi' && (
                        <a
                          href={`https://doi.org/${formData.identifierValue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.8125rem',
                            color: '#3B82F6',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          <Link2 size={12} />
                          https://doi.org/{formData.identifierValue}
                        </a>
                      )}
                      {formData.identifierUrl && (
                        <div style={{ marginTop: '8px' }}>
                          <a
                            href={formData.identifierUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                              fontSize: '0.8125rem',
                              color: '#3B82F6',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              wordBreak: 'break-all'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            <Link2 size={12} />
                            {formData.identifierUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Abstract */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Abstract</p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                    <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#1C1917', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{formData.abstract || 'Not provided'}</p>
                  </div>
                </div>

                {/* Discipline */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discipline</p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                    {formData.disciplineCategory && (
                      <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#1C1917', margin: '0 0 4px 0' }}>
                        <strong style={{ color: '#57534E' }}>Category:</strong> {mockDisciplines.find((d) => d.id === formData.disciplineCategory)?.name || 'Not provided'}
                      </p>
                    )}
                    <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#1C1917', margin: 0 }}>
                      <strong style={{ color: '#57534E' }}>Sub-Discipline:</strong> {formData.discipline || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Keywords */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keywords</p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                    <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#1C1917', margin: 0 }}>{formData.keywords.join(', ') || 'Not provided'}</p>
                  </div>
                </div>

                {/* Authors */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authors ({formData.authors.length})</p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                    {formData.authors.map((author, idx) => (
                      <div key={idx} style={{
                        padding: '12px',
                        background: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '6px',
                        marginBottom: idx < formData.authors.length - 1 ? '8px' : '0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', fontWeight: 500, color: '#1C1917', margin: '0 0 4px 0' }}>
                              {author.name || 'Unnamed Author'}
                              {author.isCorresponding && (
                                <span style={{
                                  marginLeft: '8px',
                                  padding: '2px 6px',
                                  background: '#1E3A5F',
                                  color: '#FFFFFF',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 500
                                }}>
                                  Corresponding
                                </span>
                              )}
                            </p>
                            <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.8125rem', color: '#78716C', margin: '0 0 2px 0' }}>
                              {author.email}
                            </p>
                            <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.8125rem', color: '#78716C', margin: 0 }}>
                              {author.affiliation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF File */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PDF File</p>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                    <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#1C1917', margin: 0 }}>{formData.pdfFile?.name || 'Not provided'}</p>
                  </div>
                </div>

                {/* References */}
                <div style={{ marginBottom: '0' }}>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#1C1917', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>References ({formData.references.length})</p>
                  {formData.references.length > 0 ? (
                    <div style={{ 
                      background: '#FFFFFF',
                      border: '1px solid #E7E5E4',
                      borderRadius: '6px',
                      padding: '16px',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px'
                      }}>
                        {formData.references.slice(0, 5).map((ref, idx) => (
                          <div key={idx} style={{
                            fontFamily: "'Source Sans Pro', system-ui, sans-serif",
                            fontSize: '0.875rem',
                            color: '#1C1917',
                            lineHeight: '1.5',
                            paddingLeft: '24px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: '0',
                              top: '0',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.75rem',
                              color: '#78716C'
                            }}>
                              [{idx + 1}]
                            </span>
                            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {ref}
                            </span>
                          </div>
                        ))}
                        {formData.references.length > 5 && (
                          <p style={{ 
                            fontFamily: "'Source Sans Pro', system-ui, sans-serif", 
                            fontSize: '0.8125rem', 
                            color: '#78716C', 
                            margin: '8px 0 0 0',
                            fontStyle: 'italic'
                          }}>
                            ... and {formData.references.length - 5} more reference{formData.references.length - 5 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '16px' }}>
                      <p style={{ fontFamily: "'Source Sans Pro', system-ui, sans-serif", fontSize: '0.9375rem', color: '#78716C', margin: 0 }}>Not provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-submit-page">
        <header className="sr-submit-header">
          <div className="sr-submit-header__container">
            <h1 className="sr-submit-header__title">Submit Paper</h1>
            <div className="sr-submit-progress">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`sr-submit-progress__step ${
                      step < currentStep
                        ? 'sr-submit-progress__step--completed'
                        : step === currentStep
                        ? 'sr-submit-progress__step--active'
                        : 'sr-submit-progress__step--pending'
                    }`}
                  >
                    <div className="sr-submit-progress__step-number">
                      {step < currentStep ? <CheckCircle2 size={16} /> : step}
                    </div>
                    <span className="sr-submit-progress__step-label">
                      {step === 1 && 'Details'}
                      {step === 2 && 'Category'}
                      {step === 3 && 'Upload'}
                      {step === 4 && 'Review'}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`sr-submit-progress__connector ${
                        step < currentStep ? 'sr-submit-progress__connector--completed' : ''
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>

        <main className="sr-submit-content">
          <div className="sr-submit-form">
            {renderStepContent()}

            <div className="sr-submit-actions">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--primary"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  className="sr-submit-btn sr-submit-btn--primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Paper'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SubmitPaper;
