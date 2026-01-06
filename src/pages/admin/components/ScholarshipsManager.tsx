import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, 
  CheckCircle2, XCircle, TrendingUp, ChevronLeft, ChevronRight,
  Grid3x3, List, Save, Loader2, Image as ImageIcon,
  Award, DollarSign, Calendar, MapPin, Globe, Mail, Phone, Building2,
  AlertCircle, FileText, BookOpen, Users, Clock, Info, MessageSquare, GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ScholarshipsManagerProps {
  sourceFilter?: string | null;
}

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  currency: string;
  category: string;
  deadline: string;
  location: string;
  level: string;
  description: string;
  requirements: string[];
  verified: boolean;
  imageUrl?: string;
  featured: boolean;
  source?: string;
  website?: string;
  email?: string;
  phone?: string;
  fullDescription?: string;
  benefits?: string[];
  eligibility?: string[];
  applicationProcess?: string[];
  documents?: string[];
  selectionCriteria?: string[];
  coverageDetails?: string[];
  duration?: string;
  renewability?: string;
  numberOfAwards?: string;
  fieldOfStudy?: string[];
  type?: string;
  tag?: string;
  bullets?: string[];
  statusNote?: string;
  keyPoints?: string[];
  route?: string;
  created_at?: string;
  updated_at?: string;
  faqs?: FAQ[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface ScholarshipFormData {
  title: string;
  provider: string;
  amount: string;
  currency: string;
  category: string;
  deadline: string;
  location: string;
  level: string;
  requirements: string;
  verified: boolean;
  imageUrl: string;
  featured: boolean;
  source: string;
  website: string;
  email: string;
  phone: string;
  fullDescription: string;
  benefits: string;
  eligibility: string;
  applicationProcess: string;
  documents: string;
  selectionCriteria: string;
  coverageDetails: string;
  duration: string;
  renewability: string;
  fieldOfStudy: string[];
  faqs: string;
}

const ScholarshipsManager: React.FC<ScholarshipsManagerProps> = ({ sourceFilter }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    level: "",
    location: "",
    verified: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState("overview");
  const [activeInlineEditor, setActiveInlineEditor] = useState<{ field: string; index: number } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: "",
    provider: "",
    amount: "",
    currency: "GHS",
    category: "Need-Based",
    deadline: "",
      location: "Ghana",
      level: "Undergraduate",
      requirements: "",
      verified: false,
    imageUrl: "",
    featured: false,
    source: sourceFilter || "field-based",
    website: "",
    email: "",
    phone: "",
    fullDescription: "",
    benefits: "",
    eligibility: "",
    applicationProcess: "",
    documents: "",
      selectionCriteria: "",
      coverageDetails: "",
      duration: "",
      renewability: "",
      fieldOfStudy: [],
      faqs: "",
    });

  // Options
  const sources = ["mtn", "getfund", "gnpc", "other-local", "field-based"];
  const categories = ["Merit-Based", "Need-Based", "Merit & Need-Based", "Professional Development"];
  const levels = ["Undergraduate", "Graduate", "PhD", "Postgraduate", "Undergraduate & TVET", "Professional", "All Levels"];
  const locations = ["Ghana", "Foreign", "United Kingdom", "United States", "Germany", "France", "Europe", "Global", "Partner Countries"];
  const currencies = ["GHS", "USD", "GBP", "EUR"];
  const availableFields = [
    "Engineering & Technology",
    "Health Sciences & Medicine",
    "Business & Economics",
    "Arts & Humanities",
    "Agriculture & Environmental Sciences",
    "Education",
    "Social Sciences",
    "Natural Sciences",
    "Computer Science & IT",
    "Law & Legal Studies",
  ];

  useEffect(() => {
    // Load mock data (will be replaced with Supabase)
    loadScholarships();
  }, [sourceFilter]);

  const loadScholarships = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('scholarships' as any)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply source filter if provided
      if (sourceFilter) {
        query = query.eq('source', sourceFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to load scholarships");
        setScholarships([]);
        return;
      }

      if (data) {
        // Transform Supabase data to Scholarship interface
        const transformed: Scholarship[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          provider: item.provider,
          amount: item.amount,
          currency: item.currency,
          category: item.category,
          deadline: item.deadline,
          location: item.location,
          level: item.level,
          description: item.description,
          requirements: Array.isArray(item.requirements) ? item.requirements : [],
          verified: item.verified || false,
          imageUrl: item.image_url || undefined,
          featured: item.featured || false,
          source: item.source,
          website: item.website || undefined,
          email: item.email || undefined,
          phone: item.phone || undefined,
          fullDescription: item.full_description || undefined,
          benefits: Array.isArray(item.benefits) ? item.benefits : [],
          eligibility: Array.isArray(item.eligibility) ? item.eligibility : [],
          applicationProcess: Array.isArray(item.application_process) ? item.application_process : [],
          documents: Array.isArray(item.documents) ? item.documents : [],
          selectionCriteria: Array.isArray(item.selection_criteria) ? item.selection_criteria : [],
          coverageDetails: Array.isArray(item.coverage_details) ? item.coverage_details : [],
          duration: item.duration || undefined,
          renewability: item.renewability || undefined,
          fieldOfStudy: Array.isArray(item.field_of_study) ? item.field_of_study : [],
          faqs: Array.isArray(item.faqs) ? item.faqs : [],
        }));
        setScholarships(transformed);
      } else {
        setScholarships([]);
      }
    } catch (error: any) {
      console.error("Error loading scholarships:", error);
      toast.error("Failed to load scholarships");
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredScholarships = useMemo(() => {
    let filtered = scholarships;

    // Apply source filter if provided
    if (sourceFilter) {
      filtered = filtered.filter(s => s.source === sourceFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        (s.fullDescription && s.fullDescription.toLowerCase().includes(query)) ||
        (s.description && s.description.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedFilters.category) {
      filtered = filtered.filter(s => s.category === selectedFilters.category);
    }

    // Level filter
    if (selectedFilters.level) {
      filtered = filtered.filter(s => s.level === selectedFilters.level);
    }

    // Location filter
    if (selectedFilters.location) {
      filtered = filtered.filter(s => s.location === selectedFilters.location);
    }

    // Verified filter
    if (selectedFilters.verified !== "") {
      const isVerified = selectedFilters.verified === "true";
      filtered = filtered.filter(s => s.verified === isVerified);
    }

    return filtered;
  }, [scholarships, searchQuery, selectedFilters, sourceFilter]);

  // Pagination
  const paginatedScholarships = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredScholarships.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredScholarships, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredScholarships.length;
    const verified = filteredScholarships.filter(s => s.verified).length;
    const featured = filteredScholarships.filter(s => s.featured).length;
    const bySource = sources.map(source => ({
      source,
      count: filteredScholarships.filter(s => s.source === source).length
    }));

    return { total, verified, featured, bySource };
  }, [filteredScholarships]);

  // Handlers
  const handleAdd = () => {
    setEditing(null);
    setActiveFormTab("overview");
    setFormData({
      title: "",
      provider: "",
      amount: "",
      currency: "GHS",
      category: "Need-Based",
      deadline: "",
      location: "Ghana",
      level: "Undergraduate",
      requirements: "",
      verified: false,
      imageUrl: "",
      featured: false,
      source: sourceFilter || "field-based",
      website: "",
      email: "",
      phone: "",
      fullDescription: "",
      benefits: "",
      eligibility: "",
      applicationProcess: "",
      documents: "",
      selectionCriteria: "",
      coverageDetails: "",
      duration: "",
      renewability: "",
      fieldOfStudy: [],
      faqs: "",
    });
    setShowAddForm(true);
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditing(scholarship.id);
    setActiveFormTab("overview");
    setFormData({
      title: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount,
      currency: scholarship.currency,
      category: scholarship.category,
      deadline: scholarship.deadline,
      location: scholarship.location,
      level: scholarship.level,
      requirements: scholarship.requirements.join("\n"),
      verified: scholarship.verified,
      imageUrl: scholarship.imageUrl || "",
      featured: scholarship.featured,
      source: scholarship.source || "field-based",
      website: scholarship.website || "",
      email: scholarship.email || "",
      phone: scholarship.phone || "",
      fullDescription: scholarship.fullDescription || scholarship.description || "",
      benefits: scholarship.benefits?.join("\n") || "",
      eligibility: scholarship.eligibility?.join("\n") || "",
      applicationProcess: scholarship.applicationProcess?.join("\n") || "",
      documents: scholarship.documents?.join("\n") || "",
      selectionCriteria: scholarship.selectionCriteria?.join("\n") || "",
      coverageDetails: scholarship.coverageDetails?.join("\n") || "",
      duration: scholarship.duration || "",
      renewability: scholarship.renewability || "",
      fieldOfStudy: scholarship.fieldOfStudy || [],
      faqs: scholarship.faqs ? JSON.stringify(scholarship.faqs) : "",
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setScholarshipToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!scholarshipToDelete) return;
    
    try {
      const { error } = await supabase
        .from('scholarships' as any)
        .delete()
        .eq('id', scholarshipToDelete);

      if (error) throw error;

      await loadScholarships();
      setSelectedItems(new Set());
      setDeleteModalOpen(false);
      setScholarshipToDelete(null);
      toast.success("Scholarship deleted successfully");
    } catch (error: any) {
      console.error("Error deleting scholarship:", error);
      toast.error(error.message || "Failed to delete scholarship");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error("No items selected");
      return;
    }
    
    try {
      const idsToDelete = Array.from(selectedItems);
      const { error } = await supabase
        .from('scholarships' as any)
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;

      await loadScholarships();
      setSelectedItems(new Set());
      toast.success(`${idsToDelete.length} scholarship(s) deleted`);
    } catch (error: any) {
      console.error("Error deleting scholarships:", error);
      toast.error(error.message || "Failed to delete scholarships");
    }
  };

  const handleBulkVerify = async () => {
    if (selectedItems.size === 0) {
      toast.error("No items selected");
      return;
    }
    
    try {
      const idsToVerify = Array.from(selectedItems);
      const { error } = await supabase
        .from('scholarships' as any)
        .update({ verified: true })
        .in('id', idsToVerify);

      if (error) throw error;

      await loadScholarships();
      setSelectedItems(new Set());
      toast.success(`${idsToVerify.length} scholarship(s) verified`);
    } catch (error: any) {
      console.error("Error verifying scholarships:", error);
      toast.error(error.message || "Failed to verify scholarships");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const scholarshipId = editing || Date.now().toString();
      
      // Prepare data for Supabase (convert to snake_case and JSONB)
      const supabaseData: any = {
        id: scholarshipId,
        title: formData.title,
        provider: formData.provider,
        amount: formData.amount,
        currency: formData.currency,
        category: formData.category,
        deadline: formData.deadline,
        location: formData.location,
        level: formData.level,
        description: formData.fullDescription || "",
        requirements: formData.requirements.split("\n").filter(r => r.trim()),
        verified: formData.verified,
        image_url: formData.imageUrl || null,
        featured: formData.featured,
        source: formData.source,
        website: formData.website || null,
        email: formData.email || null,
        phone: formData.phone || null,
        full_description: formData.fullDescription || null,
        benefits: formData.benefits ? formData.benefits.split("\n").filter(b => b.trim()) : [],
        eligibility: formData.eligibility ? formData.eligibility.split("\n").filter(e => e.trim()) : [],
        application_process: formData.applicationProcess ? formData.applicationProcess.split("\n").filter(a => a.trim()) : [],
        documents: formData.documents ? formData.documents.split("\n").filter(d => d.trim()) : [],
        selection_criteria: formData.selectionCriteria ? formData.selectionCriteria.split("\n").filter(s => s.trim()) : [],
        coverage_details: formData.coverageDetails ? formData.coverageDetails.split("\n").filter(c => c.trim()) : [],
        duration: formData.duration || null,
        renewability: formData.renewability || null,
        field_of_study: formData.fieldOfStudy && formData.fieldOfStudy.length > 0 ? formData.fieldOfStudy : [],
        faqs: formData.faqs ? JSON.parse(formData.faqs) : [],
      };

      if (editing) {
        // Update existing scholarship
        const { error } = await supabase
          .from('scholarships' as any)
          .update(supabaseData)
          .eq('id', editing);

        if (error) throw error;
        toast.success("Scholarship updated successfully");
      } else {
        // Insert new scholarship
        const { error } = await supabase
          .from('scholarships' as any)
          .insert(supabaseData);

        if (error) throw error;
        toast.success("Scholarship added successfully");
      }

      // Reload scholarships
      await loadScholarships();
      setShowAddForm(false);
      setEditing(null);
    } catch (error: any) {
      console.error("Error saving scholarship:", error);
      toast.error(error.message || "Failed to save scholarship");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedScholarships.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedScholarships.map(s => s.id)));
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: "",
      level: "",
      location: "",
      verified: "",
    });
    setSearchQuery("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSourceName = (source?: string) => {
    const names: Record<string, string> = {
      "mtn": "MTN",
      "getfund": "GETFund",
      "gnpc": "GNPC",
      "other-local": "Other Local",
      "field-based": "Field-Based"
    };
    return source ? names[source] || source : "Unknown";
  };

  const isolatedStyles = `
    .sm-wrapper {
      width: 100%;
    }

    .sm-header {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    .sm-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .sm-stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .sm-stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .sm-stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .sm-stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .sm-stat-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .sm-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .sm-search-wrapper {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .sm-search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .sm-search-input:focus {
      outline: none;
      border-color: #bd9f67;
      box-shadow: 0 0 0 3px rgba(189, 159, 103, 0.1);
    }

    .sm-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 1.25rem;
      height: 1.25rem;
    }

    .sm-filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;
      min-width: 150px;
    }

    .sm-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .sm-btn-primary {
      background: #bd9f67;
      color: white;
    }

    .sm-btn-primary:hover {
      background: #a88a59;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(189, 159, 103, 0.4);
    }

    .sm-btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .sm-btn-secondary:hover {
      background: #f9fafb;
    }

    .sm-btn-danger {
      background: #ef4444;
      color: white;
    }

    .sm-btn-danger:hover {
      background: #dc2626;
    }

    .sm-view-toggle {
      display: flex;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }

    .sm-view-btn {
      padding: 0.5rem;
      border: none;
      background: white;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .sm-view-btn.active {
      background: #f3f4f6;
      color: #bd9f67;
    }

    .sm-table-wrapper {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 100%;
      overflow-x: auto;
    }

    .sm-table {
      width: 100%;
      min-width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    .sm-table thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .sm-table th {
      padding: 0.75rem 0.875rem;
      text-align: left;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      position: sticky;
      top: 0;
      background: #f9fafb;
      z-index: 10;
    }

    .sm-table td {
      padding: 0.875rem 0.875rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.8125rem;
      color: #374151;
      vertical-align: middle;
      line-height: 1.4;
    }

    @media (min-width: 768px) {
      .sm-table th {
        padding: 0.875rem 1rem;
        font-size: 0.75rem;
      }
      .sm-table td {
        padding: 1rem 1rem;
        font-size: 0.875rem;
      }
    }

    @media (min-width: 1024px) {
      .sm-table th {
        padding: 1rem 1.125rem;
      }
      .sm-table td {
        padding: 1.125rem 1.125rem;
      }
    }

    .sm-table tbody tr {
      transition: background-color 0.15s;
    }

    .sm-table tbody tr:hover {
      background: #f3f4f6;
    }

    .sm-table tbody tr:has(input[type="checkbox"]:checked) {
      background: #fef3c7;
    }

    .sm-table tbody tr:last-child td {
      border-bottom: none;
    }

    .sm-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .sm-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
    }

    @media (min-width: 1024px) {
      .sm-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
    }

    @media (min-width: 1280px) {
      .sm-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
    }

    .sm-card-modern {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: 1rem;
      border: 2px solid #e5e7eb;
      background: white;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      height: 100%;
      cursor: pointer;
    }

    .sm-card-modern:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      transform: translateY(-4px);
    }

    .sm-card-accent {
      height: 4px;
      width: 100%;
    }

    .sm-card-accent.mtn {
      background-color: #fbbf24;
    }

    .sm-card-accent.default {
      background-color: #bd9f67;
    }

    .sm-card-image-wrapper {
      position: relative;
      height: 128px;
      overflow: hidden;
      background: #f1f5f9;
    }

    .sm-card-image-modern {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .sm-card-modern:hover .sm-card-image-modern {
      transform: scale(1.05);
    }

    .sm-card-image-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
    }

    .sm-card-badges {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: wrap;
    }

    .sm-verified-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      border: 1px solid #86efac;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
      color: #16a34a;
    }

    .sm-mtn-badge {
      padding: 0.125rem 0.5rem;
      font-size: 10px;
      font-weight: 700;
      border-radius: 0.375rem;
      background: #fbbf24;
      color: black;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
    }

    .sm-soon-badge {
      padding: 0.125rem 0.5rem;
      font-size: 10px;
      font-weight: 600;
      border-radius: 0.375rem;
      background: #ef4444;
      color: white;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
    }

    .sm-category-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    .sm-badge-category {
      font-size: 10px;
      padding: 0.125rem 0.5rem;
      height: auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: #374151;
      border-radius: 0.25rem;
    }

    .sm-checkbox-overlay {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
    }

    .sm-card-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 1rem;
    }

    .sm-card-title-modern {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.375rem 0;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.3s;
    }

    .sm-card-modern:hover .sm-card-title-modern {
      color: #bd9f67;
    }

    .sm-card-provider-modern {
      font-size: 0.75rem;
      color: #475569;
      margin: 0 0 0.75rem 0;
      font-weight: 500;
    }

    .sm-card-info {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-bottom: 0.75rem;
      flex: 1;
    }

    .sm-info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #334155;
    }

    .sm-info-item:first-child {
      color: #1e293b;
      font-weight: 600;
    }

    .sm-info-item:not(:first-child) {
      color: #64748b;
    }

    .sm-info-item span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sm-card-footer {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
    }

    .sm-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .sm-badge-verified {
      background: #d1fae5;
      color: #065f46;
    }

    .sm-badge-unverified {
      background: #fee2e2;
      color: #991b1b;
    }

    .sm-badge-featured {
      background: #fef3c7;
      color: #92400e;
    }

    .sm-badge-source {
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }


    .sm-icon-btn {
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 0.375rem;
      color: #6b7280;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sm-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .sm-icon-btn.danger:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .sm-form-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      overflow-y: auto;
    }

    .sm-form-content {
      background: white;
      border-radius: 0.75rem;
      width: 100%;
      max-width: 1000px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .sm-form-header {
      padding: 1.5rem 2rem;
      border-bottom: 2px solid #bd9f67;
      background: #111827;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sm-form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .sm-form-body {
      padding: 1.5rem 2rem;
      overflow-y: auto;
      flex: 1;
    }

    .sm-form-section {
      margin-bottom: 2rem;
    }

    .sm-form-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .sm-form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .sm-form-group {
      display: flex;
      flex-direction: column;
    }

    .sm-form-group.full-width {
      grid-column: 1 / -1;
    }

    .sm-form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .sm-form-input,
    .sm-form-select,
    .sm-form-textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .sm-form-input:focus,
    .sm-form-select:focus,
    .sm-form-textarea:focus {
      outline: none;
      border-color: #bd9f67;
      box-shadow: 0 0 0 3px rgba(189, 159, 103, 0.1);
    }

    .sm-form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .sm-form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .sm-form-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #f9fafb;
    }

    .sm-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .sm-pagination-info {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .sm-pagination-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .sm-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    .sm-form-tabs {
      border-bottom: 2px solid #e5e7eb;
      background: #f9fafb;
      padding: 0 2rem;
      display: flex;
      gap: 0;
    }

    .sm-form-tab {
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: #6b7280;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sm-form-tab:hover {
      color: #111827;
      background: rgba(189, 159, 103, 0.05);
    }

    .sm-form-tab.active {
      color: #111827;
      font-weight: 600;
      border-bottom-color: #bd9f67;
    }

    .sm-form-tab-content {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 767px) {
      .sm-form-grid {
        grid-template-columns: 1fr;
      }

      .sm-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .sm-search-wrapper {
        width: 100%;
      }

      .sm-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .sm-grid {
        grid-template-columns: 1fr;
      }

      .sm-form-tabs {
        padding: 0 1rem;
        overflow-x: auto;
      }

      .sm-form-tab {
        padding: 0.75rem 1rem;
        font-size: 0.8125rem;
        white-space: nowrap;
      }
    }
  `;

  return (
    <>
      <style>{isolatedStyles}</style>
      <div className="sm-wrapper">
        
        {/* Statistics */}
        <div className="sm-stats-grid">
          <div className="sm-stat-card">
            <div className="sm-stat-icon" style={{ background: '#fef3c7' }}>
              <Award style={{ color: '#92400e', width: '1.5rem', height: '1.5rem' }} />
            </div>
            <div className="sm-stat-label">Total Scholarships</div>
            <div className="sm-stat-value">{stats.total}</div>
          </div>

          <div className="sm-stat-card">
            <div className="sm-stat-icon" style={{ background: '#d1fae5' }}>
              <CheckCircle2 style={{ color: '#065f46', width: '1.5rem', height: '1.5rem' }} />
            </div>
            <div className="sm-stat-label">Verified</div>
            <div className="sm-stat-value">{stats.verified}</div>
          </div>

          <div className="sm-stat-card">
            <div className="sm-stat-icon" style={{ background: '#fef3c7' }}>
              <TrendingUp style={{ color: '#92400e', width: '1.5rem', height: '1.5rem' }} />
            </div>
            <div className="sm-stat-label">Featured</div>
            <div className="sm-stat-value">{stats.featured}</div>
          </div>

          <div className="sm-stat-card">
            <div className="sm-stat-icon" style={{ background: '#e0e7ff' }}>
              <Globe style={{ color: '#3730a3', width: '1.5rem', height: '1.5rem' }} />
            </div>
            <div className="sm-stat-label">Sources</div>
            <div className="sm-stat-value">{sources.length}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="sm-controls">
          <div className="sm-search-wrapper">
            <Search className="sm-search-icon" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm-search-input"
            />
          </div>

          <select
            className="sm-filter-select"
            value={selectedFilters.category}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="sm-filter-select"
            value={selectedFilters.level}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            className="sm-filter-select"
            value={selectedFilters.verified}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, verified: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          {(searchQuery || Object.values(selectedFilters).some(v => v)) && (
            <button className="sm-btn sm-btn-secondary" onClick={clearFilters}>
              <X size={16} />
              Clear Filters
            </button>
          )}

          <div className="sm-view-toggle">
            <button
              className={`sm-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
            <button
              className={`sm-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 size={18} />
            </button>
          </div>

          <button className="sm-btn sm-btn-primary" onClick={handleAdd}>
            <Plus size={16} />
            Add Scholarship
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="sm-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {selectedItems.size} selected
              </span>
              <button className="sm-btn sm-btn-primary" onClick={handleBulkVerify}>
                <CheckCircle2 size={16} />
                Verify Selected
              </button>
              <button className="sm-btn sm-btn-danger" onClick={handleBulkDelete}>
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 style={{ width: '2rem', height: '2rem', animation: 'spin 1s linear infinite', color: '#bd9f67' }} />
          </div>
        )}

        {/* Table View */}
        {!loading && viewMode === "list" && (
          <div className="sm-table-wrapper">
            <table className="sm-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="sm-checkbox"
                      checked={selectedItems.size === paginatedScholarships.length && paginatedScholarships.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Scholarship</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Deadline</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedScholarships.map((scholarship) => (
                  <tr key={scholarship.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="sm-checkbox"
                        checked={selectedItems.has(scholarship.id)}
                        onChange={() => toggleSelection(scholarship.id)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {scholarship.imageUrl && (
                          <img 
                            src={scholarship.imageUrl} 
                            alt={scholarship.title}
                            style={{ width: '48px', height: '48px', borderRadius: '0.375rem', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{scholarship.title}</div>
                          {scholarship.featured && (
                            <span className="sm-badge sm-badge-featured" style={{ fontSize: '0.625rem' }}>Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{scholarship.provider}</td>
                    <td>{scholarship.category}</td>
                    <td>{scholarship.level}</td>
                    <td>{formatDate(scholarship.deadline)}</td>
                    <td>
                      <span className="sm-badge sm-badge-source">{getSourceName(scholarship.source)}</span>
                    </td>
                    <td>
                      <span className={`sm-badge ${scholarship.verified ? 'sm-badge-verified' : 'sm-badge-unverified'}`}>
                        {scholarship.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="sm-icon-btn" onClick={() => handleEdit(scholarship)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="sm-icon-btn danger" onClick={() => handleDelete(scholarship.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === "grid" && (
          <div className="sm-grid">
            {paginatedScholarships.map((scholarship) => {
              const daysLeft = Math.ceil((new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isDeadlineSoon = daysLeft > 0 && daysLeft <= 30;
              const isMTN = scholarship.source === "mtn";

              return (
                <div key={scholarship.id} className="sm-card-modern">
                  {/* Top accent bar */}
                  <div className="sm-card-accent" style={{ backgroundColor: isMTN ? '#fbbf24' : '#bd9f67' }} />

                  {/* Image Section */}
                  {scholarship.imageUrl && (
                    <div className="sm-card-image-wrapper">
                      <img
                        src={scholarship.imageUrl}
                        alt={scholarship.title}
                        className="sm-card-image-modern"
                      />
                      <div className="sm-card-image-gradient" />

                      {/* Badges on Image */}
                      <div className="sm-card-badges">
                        {scholarship.verified && (
                          <div className="sm-verified-icon">
                            <CheckCircle2 size={12} />
                          </div>
                        )}
                        {isMTN && (
                          <span className="sm-mtn-badge">MTN</span>
                        )}
                        {isDeadlineSoon && daysLeft > 0 && (
                          <span className="sm-soon-badge">Soon</span>
                        )}
                      </div>

                      {/* Category badge on image */}
                      <div className="sm-category-badge">
                        <span className="sm-badge sm-badge-category">{scholarship.category}</span>
                      </div>

                      {/* Checkbox overlay */}
                      <div className="sm-checkbox-overlay">
                        <input
                          type="checkbox"
                          className="sm-checkbox"
                          checked={selectedItems.has(scholarship.id)}
                          onChange={() => toggleSelection(scholarship.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="sm-card-body">
                    {/* Title */}
                    <h3 className="sm-card-title-modern">{scholarship.title}</h3>

                    {/* Provider */}
                    <p className="sm-card-provider-modern">{scholarship.provider}</p>

                    {/* Info Icons */}
                    <div className="sm-card-info">
                      <div className="sm-info-item">
                        <DollarSign size={14} style={{ color: '#bd9f67', flexShrink: 0, width: '14px', height: '14px' }} />
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scholarship.amount} {scholarship.currency !== scholarship.amount && scholarship.currency}</span>
                      </div>
                      <div className="sm-info-item">
                        <MapPin size={14} style={{ color: '#94a3b8', flexShrink: 0, width: '14px', height: '14px' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scholarship.location}</span>
                      </div>
                      <div className="sm-info-item">
                        <GraduationCap size={14} style={{ color: '#94a3b8', flexShrink: 0, width: '14px', height: '14px' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scholarship.level}</span>
                      </div>
                      {daysLeft > 0 && (
                        <div className="sm-info-item">
                          <Clock size={14} style={{ color: '#94a3b8', flexShrink: 0, width: '14px', height: '14px' }} />
                          <span>{daysLeft} days left</span>
                        </div>
                      )}
                    </div>

                    {/* Status badges */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span className="sm-badge sm-badge-source">{getSourceName(scholarship.source)}</span>
                      {scholarship.featured && (
                        <span className="sm-badge sm-badge-featured">Featured</span>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="sm-card-footer">
                      <button className="sm-icon-btn" onClick={() => handleEdit(scholarship)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="sm-icon-btn danger" onClick={() => handleDelete(scholarship.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredScholarships.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '0.75rem' }}>
            <Award style={{ width: '4rem', height: '4rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
              No scholarships found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {searchQuery || Object.values(selectedFilters).some(v => v)
                ? "Try adjusting your filters or search query"
                : "Get started by adding your first scholarship"}
            </p>
            {!searchQuery && !Object.values(selectedFilters).some(v => v) && (
              <button className="sm-btn sm-btn-primary" onClick={handleAdd}>
                <Plus size={16} />
                Add Scholarship
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredScholarships.length > 0 && (
          <div className="sm-pagination">
            <div className="sm-pagination-info">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredScholarships.length)} of {filteredScholarships.length} scholarships
            </div>
            <div className="sm-pagination-buttons">
              <button
                className="sm-btn sm-btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                className="sm-btn sm-btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="sm-form-modal" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddForm(false);
              setEditing(null);
            }
          }}>
            <div className="sm-form-content">
              <div className="sm-form-header">
                <h2 className="sm-form-title">{editing ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
                <button className="sm-icon-btn" style={{ color: 'white' }} onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}>
                  <X size={20} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="sm-form-tabs">
                <button
                  onClick={() => {
                    setActiveFormTab("overview");
                    setActiveInlineEditor(null);
                  }}
                  className={`sm-form-tab ${activeFormTab === "overview" ? "active" : ""}`}
                >
                  <Info size={16} />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => {
                    setActiveFormTab("application");
                    setActiveInlineEditor(null);
                  }}
                  className={`sm-form-tab ${activeFormTab === "application" ? "active" : ""}`}
                >
                  <FileText size={16} />
                  <span>Application Details</span>
                </button>
                <button
                  onClick={() => {
                    setActiveFormTab("additional");
                    setActiveInlineEditor(null);
                  }}
                  className={`sm-form-tab ${activeFormTab === "additional" ? "active" : ""}`}
                >
                  <BookOpen size={16} />
                  <span>Additional Info</span>
                </button>
                <button
                  onClick={() => {
                    setActiveFormTab("faqs");
                    setActiveInlineEditor(null);
                  }}
                  className={`sm-form-tab ${activeFormTab === "faqs" ? "active" : ""}`}
                >
                  <MessageSquare size={16} />
                  <span>FAQs</span>
                </button>
              </div>

              <div className="sm-form-body">
                {/* Overview Tab */}
                {activeFormTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="sm-form-section">
                      <h3 className="sm-form-section-title">Basic Information</h3>
                  <div className="sm-form-grid">
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Scholarship Title *</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter scholarship title"
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Provider *</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.provider}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                        placeholder="Enter provider name"
                      />
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Amount *</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="e.g., Full Tuition, 50000"
                      />
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Currency *</label>
                      <select
                        className="sm-form-select"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      >
                        {currencies.map(curr => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Category *</label>
                      <select
                        className="sm-form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Deadline *</label>
                      <input
                        type="date"
                        className="sm-form-input"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Location *</label>
                      <select
                        className="sm-form-select"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      >
                        {locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Level *</label>
                      <select
                        className="sm-form-select"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Source *</label>
                      <select
                        className="sm-form-select"
                        value={formData.source}
                        onChange={(e) => {
                          const newSource = e.target.value;
                          setFormData({ 
                            ...formData, 
                            source: newSource,
                            // Clear fieldOfStudy when switching away from field-based
                            fieldOfStudy: newSource === "field-based" ? formData.fieldOfStudy : []
                          });
                        }}
                      >
                        {sources.map(source => (
                          <option key={source} value={source}>{getSourceName(source)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Image URL</label>
                      <input
                        type="url"
                        className="sm-form-input"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Field of Study - Multi-select for Field-Based scholarships */}
                    {formData.source === "field-based" ? (
                      <div className="sm-form-group full-width">
                        <label className="sm-form-label">Fields of Study * (Select all applicable)</label>
                        <div style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          background: 'white',
                        }}>
                          {availableFields.map((field) => (
                            <label
                              key={field}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                borderRadius: '0.25rem',
                                transition: 'background-color 0.2s',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <input
                                type="checkbox"
                                checked={formData.fieldOfStudy.includes(field)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      fieldOfStudy: [...formData.fieldOfStudy, field],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      fieldOfStudy: formData.fieldOfStudy.filter(f => f !== field),
                                    });
                                  }
                                }}
                                style={{
                                  width: '1rem',
                                  height: '1rem',
                                  cursor: 'pointer',
                                  accentColor: '#bd9f67',
                                }}
                              />
                              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{field}</span>
                            </label>
                          ))}
                        </div>
                        {formData.fieldOfStudy.length > 0 && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {formData.fieldOfStudy.map((field) => (
                              <span
                                key={field}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                }}
                              >
                                {field}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      fieldOfStudy: formData.fieldOfStudy.filter(f => f !== field),
                                    });
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#92400e',
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="sm-form-group full-width">
                        <label className="sm-form-label">Field of Study (comma separated)</label>
                        <input
                          type="text"
                          className="sm-form-input"
                          value={formData.fieldOfStudy.join(", ")}
                          onChange={(e) => {
                            const values = e.target.value.split(",").map(f => f.trim()).filter(f => f);
                            setFormData({ ...formData, fieldOfStudy: values });
                          }}
                          placeholder="Engineering, Health Sciences, Business"
                        />
                      </div>
                    )}

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Description *</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.fullDescription}
                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                        placeholder="Enter detailed description of the scholarship"
                        rows={6}
                      />
                    </div>

                    <div className="sm-form-checkbox">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={formData.verified}
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      />
                      <label htmlFor="verified">Verified Scholarship</label>
                    </div>

                    <div className="sm-form-checkbox">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <label htmlFor="featured">Featured Scholarship</label>
                    </div>
                  </div>
                </div>
                  </motion.div>
                )}

                {/* Application Details Tab */}
                {activeFormTab === "application" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="sm-form-section">
                      <h3 className="sm-form-section-title">Application Details</h3>
                      <div className="sm-form-grid">
                    {/* Requirements */}
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Requirements (each point)</label>
                      {(() => {
                        const items = formData.requirements ? formData.requirements.split("\n") : [""];
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "requirements" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a requirement"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            requirements: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a requirement"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "requirements",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            requirements: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            requirements: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove requirement"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...items, ""];
                                setFormData({
                                  ...formData,
                                  requirements: next.join("\n"),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                marginTop: "0.25rem",
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "9999px",
                                border: "1px dashed #d1d5db",
                                background: "#f9fafb",
                                color: "#374151",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>+</span>
                              Add requirement
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Benefits */}
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Benefits (each point)</label>
                      {(() => {
                        const items = formData.benefits ? formData.benefits.split("\n") : [""];
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "benefits" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a benefit"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            benefits: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a benefit"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "benefits",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            benefits: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            benefits: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove benefit"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...items, ""];
                                setFormData({
                                  ...formData,
                                  benefits: next.join("\n"),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                marginTop: "0.25rem",
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "9999px",
                                border: "1px dashed #d1d5db",
                                background: "#f9fafb",
                                color: "#374151",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>+</span>
                              Add benefit
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Eligibility */}
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Eligibility (each point)</label>
                      {(() => {
                        const items = formData.eligibility ? formData.eligibility.split("\n") : [""];
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "eligibility" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter an eligibility criterion"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            eligibility: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter an eligibility criterion"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "eligibility",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            eligibility: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            eligibility: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove eligibility point"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...items, ""];
                                setFormData({
                                  ...formData,
                                  eligibility: next.join("\n"),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                marginTop: "0.25rem",
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "9999px",
                                border: "1px dashed #d1d5db",
                                background: "#f9fafb",
                                color: "#374151",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>+</span>
                              Add eligibility point
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Application Process */}
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Application Process (each step)</label>
                      {(() => {
                        const items = formData.applicationProcess ? formData.applicationProcess.split("\n") : [""];
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "applicationProcess" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter an application step"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            applicationProcess: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter an application step"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "applicationProcess",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            applicationProcess: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            applicationProcess: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove application step"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...items, ""];
                                setFormData({
                                  ...formData,
                                  applicationProcess: next.join("\n"),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                marginTop: "0.25rem",
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "9999px",
                                border: "1px dashed #d1d5db",
                                background: "#f9fafb",
                                color: "#374151",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>+</span>
                              Add application step
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Documents */}
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Required Documents (each document)</label>
                      {(() => {
                        const items = formData.documents ? formData.documents.split("\n") : [""];
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "documents" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a document"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            documents: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a document"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "documents",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            documents: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            documents: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove document"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...items, ""];
                                setFormData({
                                  ...formData,
                                  documents: next.join("\n"),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                marginTop: "0.25rem",
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "9999px",
                                border: "1px dashed #d1d5db",
                                background: "#f9fafb",
                                color: "#374151",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>+</span>
                              Add document
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Selection Criteria */}
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Selection Criteria (each criterion)</label>
                      {(() => {
                        const items = formData.selectionCriteria ? formData.selectionCriteria.split("\n") : [""];
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "selectionCriteria" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a selection criterion"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            selectionCriteria: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a selection criterion"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "selectionCriteria",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            selectionCriteria: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            selectionCriteria: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove selection criterion"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...items, ""];
                                setFormData({
                                  ...formData,
                                  selectionCriteria: next.join("\n"),
                                });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                marginTop: "0.25rem",
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "9999px",
                                border: "1px dashed #d1d5db",
                                background: "#f9fafb",
                                color: "#374151",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>+</span>
                              Add criterion
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Additional Info Tab */}
                {activeFormTab === "additional" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Contact Information */}
                    <div className="sm-form-section">
                      <h3 className="sm-form-section-title">Contact Information</h3>
                      <div className="sm-form-grid">
                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">Website</label>
                          <input
                            type="url"
                            className="sm-form-input"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="sm-form-group">
                          <label className="sm-form-label">Email</label>
                          <input
                            type="email"
                            className="sm-form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="contact@example.com"
                          />
                        </div>

                        <div className="sm-form-group">
                          <label className="sm-form-label">Phone</label>
                          <input
                            type="tel"
                            className="sm-form-input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+233 XX XXX XXXX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Coverage & Duration */}
                    <div className="sm-form-section">
                      <h3 className="sm-form-section-title">Coverage & Duration</h3>
                      <div className="sm-form-grid">
                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">Coverage Details (each point)</label>
                          {(() => {
                            const items = formData.coverageDetails ? formData.coverageDetails.split("\n") : [""];
                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {items.map((item, index) => {
                              const isActive =
                                activeInlineEditor?.field === "coverageDetails" &&
                                activeInlineEditor.index === index;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: isActive ? "column" : "row",
                                    alignItems: isActive ? "stretch" : "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        borderRadius: "9999px",
                                        background: "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        color: "#4b5563",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                    {isActive ? (
                                      <textarea
                                        className="sm-form-textarea"
                                        style={{ width: "100%" }}
                                        value={item}
                                        autoFocus
                                        rows={4}
                                        placeholder="Enter a coverage detail"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            coverageDetails: next.join("\n"),
                                          });
                                        }}
                                        onBlur={() => setActiveInlineEditor(null)}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="sm-form-input"
                                        style={{ flex: 1 }}
                                        value={item}
                                        placeholder="Enter a coverage detail"
                                        onFocus={() =>
                                          setActiveInlineEditor({
                                            field: "coverageDetails",
                                            index,
                                          })
                                        }
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[index] = e.target.value;
                                          setFormData({
                                            ...formData,
                                            coverageDetails: next.join("\n"),
                                          });
                                        }}
                                      />
                                    )}
                                    {!isActive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = items.filter((_, i) => i !== index);
                                          setFormData({
                                            ...formData,
                                            coverageDetails: next.join("\n"),
                                          });
                                        }}
                                        style={{
                                          border: "none",
                                          background: "transparent",
                                          color: "#9ca3af",
                                          cursor: "pointer",
                                          padding: "0.25rem",
                                        }}
                                        aria-label="Remove coverage detail"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...items, ""];
                                    setFormData({
                                      ...formData,
                                      coverageDetails: next.join("\n"),
                                    });
                                  }}
                                  style={{
                                    alignSelf: "flex-start",
                                    marginTop: "0.25rem",
                                    fontSize: "0.75rem",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "9999px",
                                    border: "1px dashed #d1d5db",
                                    background: "#f9fafb",
                                    color: "#374151",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  <span style={{ fontSize: "0.9rem" }}>+</span>
                                  Add coverage detail
                                </button>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="sm-form-group">
                          <label className="sm-form-label">Duration</label>
                          <input
                            type="text"
                            className="sm-form-input"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="e.g., 4 years, Full program duration"
                          />
                        </div>

                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">Renewability</label>
                          <input
                            type="text"
                            className="sm-form-input"
                            value={formData.renewability}
                            onChange={(e) => setFormData({ ...formData, renewability: e.target.value })}
                            placeholder="e.g., Renewable annually based on performance"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* FAQs Tab */}
                {activeFormTab === "faqs" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="sm-form-section">
                      <h3 className="sm-form-section-title">Frequently Asked Questions</h3>
                      <div className="sm-form-grid">
                        <div className="sm-form-group full-width">
                          <label className="sm-form-label">FAQs (Question & Answer pairs)</label>
                          {(() => {
                            let faqs: FAQ[] = [];
                            try {
                              faqs = formData.faqs ? JSON.parse(formData.faqs) : [];
                            } catch (e) {
                              faqs = [];
                            }
                            if (faqs.length === 0) faqs = [{ question: "", answer: "" }];

                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {faqs.map((faq, index) => {
                                  const isQuestionActive = activeInlineEditor?.field === "faqs-question" && activeInlineEditor?.index === index;
                                  const isAnswerActive = activeInlineEditor?.field === "faqs-answer" && activeInlineEditor?.index === index;
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        padding: "1rem",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0.5rem",
                                        background: "#f9fafb",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.75rem",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.5rem",
                                          marginBottom: "0.25rem",
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                            borderRadius: "9999px",
                                            background: "#bd9f67",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.75rem",
                                            fontWeight: "bold",
                                            flexShrink: 0,
                                          }}
                                        >
                                          {index + 1}
                                        </span>
                                        <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "500" }}>
                                          FAQ #{index + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const next = faqs.filter((_, i) => i !== index);
                                            setFormData({
                                              ...formData,
                                              faqs: JSON.stringify(next.length > 0 ? next : [{ question: "", answer: "" }]),
                                            });
                                          }}
                                          style={{
                                            marginLeft: "auto",
                                            border: "none",
                                            background: "transparent",
                                            color: "#ef4444",
                                            cursor: "pointer",
                                            padding: "0.25rem",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          aria-label="Remove FAQ"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>

                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: (isQuestionActive || isAnswerActive) ? "column" : "row",
                                          gap: "0.5rem",
                                        }}
                                      >
                                        {/* Question Field */}
                                        {isQuestionActive ? (
                                          <textarea
                                            className="sm-form-textarea"
                                            style={{ width: "100%" }}
                                            value={faq.question}
                                            autoFocus
                                            rows={2}
                                            placeholder="Enter the question"
                                            onChange={(e) => {
                                              const next = [...faqs];
                                              next[index] = { ...next[index], question: e.target.value };
                                              setFormData({
                                                ...formData,
                                                faqs: JSON.stringify(next),
                                              });
                                            }}
                                            onBlur={() => setActiveInlineEditor(null)}
                                          />
                                        ) : (
                                          <div
                                            onClick={() => setActiveInlineEditor({ field: "faqs-question", index })}
                                            style={{
                                              flex: 1,
                                              padding: "0.75rem",
                                              background: "white",
                                              borderRadius: "0.375rem",
                                              border: "1px solid #e5e7eb",
                                              cursor: "text",
                                            }}
                                          >
                                            <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                                              Question
                                            </div>
                                            <div style={{ fontSize: "0.875rem", color: "#111827", fontWeight: "500" }}>
                                              {faq.question || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Click to add question</span>}
                                            </div>
                                          </div>
                                        )}

                                        {/* Answer Field */}
                                        {isAnswerActive ? (
                                          <textarea
                                            className="sm-form-textarea"
                                            style={{ width: "100%" }}
                                            value={faq.answer}
                                            autoFocus
                                            rows={4}
                                            placeholder="Enter the answer"
                                            onChange={(e) => {
                                              const next = [...faqs];
                                              next[index] = { ...next[index], answer: e.target.value };
                                              setFormData({
                                                ...formData,
                                                faqs: JSON.stringify(next),
                                              });
                                            }}
                                            onBlur={() => setActiveInlineEditor(null)}
                                          />
                                        ) : (
                                          <div
                                            onClick={() => setActiveInlineEditor({ field: "faqs-answer", index })}
                                            style={{
                                              flex: 1,
                                              padding: "0.75rem",
                                              background: "white",
                                              borderRadius: "0.375rem",
                                              border: "1px solid #e5e7eb",
                                              cursor: "text",
                                            }}
                                          >
                                            <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                                              Answer
                                            </div>
                                            <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                                              {faq.answer || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Click to add answer</span>}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...faqs, { question: "", answer: "" }];
                                    setFormData({
                                      ...formData,
                                      faqs: JSON.stringify(next),
                                    });
                                  }}
                                  style={{
                                    alignSelf: "flex-start",
                                    marginTop: "0.5rem",
                                    fontSize: "0.875rem",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.5rem",
                                    border: "1px dashed #d1d5db",
                                    background: "#f9fafb",
                                    color: "#374151",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                  }}
                                >
                                  <Plus size={16} />
                                  Add FAQ
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="sm-form-footer">
                <button className="sm-btn sm-btn-secondary" onClick={() => {
                  setShowAddForm(false);
                  setEditing(null);
                }}>
                  <X size={16} />
                  Cancel
                </button>
                <button 
                  className="sm-btn sm-btn-primary" 
                  onClick={handleSave}
                  disabled={saving || !formData.title || !formData.provider}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editing ? 'Update' : 'Save'} Scholarship
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="sm-form-modal" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteModalOpen(false);
              setScholarshipToDelete(null);
            }
          }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '400px', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#fee2e2', marginBottom: '1rem' }}>
                  <AlertCircle style={{ width: '2rem', height: '2rem', color: '#dc2626' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Scholarship</h3>
                <p style={{ color: '#6b7280' }}>Are you sure you want to delete this scholarship? This action cannot be undone.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="sm-btn sm-btn-secondary" style={{ flex: 1 }} onClick={() => {
                  setDeleteModalOpen(false);
                  setScholarshipToDelete(null);
                }}>
                  Cancel
                </button>
                <button className="sm-btn sm-btn-danger" style={{ flex: 1 }} onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScholarshipsManager;

