import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, X, Edit2, Trash2, Eye, 
  CheckCircle2, XCircle, TrendingUp, ChevronLeft, ChevronRight,
  Grid3x3, List, Save, Loader2, Image as ImageIcon,
  Award, DollarSign, Calendar, MapPin, Globe, Mail, Phone, Building2,
  AlertCircle, FileText, BookOpen, Users, Clock
} from "lucide-react";
import { toast } from "sonner";

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
  description: string;
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
  numberOfAwards: string;
  fieldOfStudy: string;
  type: string;
  tag: string;
  bullets: string;
  statusNote: string;
  keyPoints: string;
  route: string;
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
    description: "",
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
    numberOfAwards: "",
    fieldOfStudy: "",
    type: "",
    tag: "",
    bullets: "",
    statusNote: "",
    keyPoints: "",
    route: "",
  });

  // Options
  const sources = ["mtn", "getfund", "gnpc", "other-local", "field-based"];
  const categories = ["Merit-Based", "Need-Based", "Merit & Need-Based", "Professional Development"];
  const levels = ["Undergraduate", "Graduate", "PhD", "Postgraduate", "Undergraduate & TVET", "Professional", "All Levels"];
  const locations = ["Ghana", "Foreign", "United Kingdom", "United States", "Germany", "France", "Europe", "Global", "Partner Countries"];
  const currencies = ["GHS", "USD", "GBP", "EUR"];

  useEffect(() => {
    // Load mock data (will be replaced with Supabase)
    loadScholarships();
  }, [sourceFilter]);

  const loadScholarships = () => {
    setLoading(true);
    // Mock data - will be replaced with Supabase fetch
    setTimeout(() => {
      const mockScholarships: Scholarship[] = [
        {
          id: "1",
          title: "Mastercard Foundation Scholars Program",
          provider: "Mastercard Foundation",
          amount: "Full Tuition",
          currency: "USD",
          category: "Merit-Based",
          deadline: "2024-12-31",
          location: "Ghana",
          level: "Undergraduate",
          description: "Comprehensive scholarship covering tuition, accommodation, and living expenses.",
          requirements: ["Minimum GPA 3.5", "Financial need", "Leadership potential"],
          verified: true,
          imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg",
          featured: true,
          source: "field-based",
          website: "https://mastercardfdn.org/scholars-program/",
          email: "scholars@mastercardfdn.org",
          phone: "+233 30 278 0300",
        },
        {
          id: "2",
          title: "MTN Ghana Foundation Bright Scholarship",
          provider: "MTN Ghana Foundation",
          amount: "Tuition & Academic Support",
          currency: "GHS",
          category: "Need-Based",
          deadline: "2025-05-31",
          location: "Ghana",
          level: "Undergraduate & TVET",
          description: "Bright Scholarship supports brilliant but needy Ghanaians.",
          requirements: ["First-year or continuing student", "Ghanaian citizen"],
          verified: true,
          imageUrl: "https://res.cloudinary.com/dsypclqxk/image/upload/v1764597983/compressed_young-man-dressed-yellow-holding-phone-coffee-cup_puiiii.jpg",
          featured: true,
          source: "mtn",
        },
      ];
      
      setScholarships(mockScholarships);
      setLoading(false);
    }, 500);
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
        s.description.toLowerCase().includes(query)
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
    setFormData({
      title: "",
      provider: "",
      amount: "",
      currency: "GHS",
      category: "Need-Based",
      deadline: "",
      location: "Ghana",
      level: "Undergraduate",
      description: "",
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
      numberOfAwards: "",
      fieldOfStudy: "",
      type: "",
      tag: "",
      bullets: "",
      statusNote: "",
      keyPoints: "",
      route: "",
    });
    setShowAddForm(true);
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditing(scholarship.id);
    setFormData({
      title: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount,
      currency: scholarship.currency,
      category: scholarship.category,
      deadline: scholarship.deadline,
      location: scholarship.location,
      level: scholarship.level,
      description: scholarship.description,
      requirements: scholarship.requirements.join("\n"),
      verified: scholarship.verified,
      imageUrl: scholarship.imageUrl || "",
      featured: scholarship.featured,
      source: scholarship.source || "field-based",
      website: scholarship.website || "",
      email: scholarship.email || "",
      phone: scholarship.phone || "",
      fullDescription: scholarship.fullDescription || "",
      benefits: scholarship.benefits?.join("\n") || "",
      eligibility: scholarship.eligibility?.join("\n") || "",
      applicationProcess: scholarship.applicationProcess?.join("\n") || "",
      documents: scholarship.documents?.join("\n") || "",
      selectionCriteria: scholarship.selectionCriteria?.join("\n") || "",
      coverageDetails: scholarship.coverageDetails?.join("\n") || "",
      duration: scholarship.duration || "",
      renewability: scholarship.renewability || "",
      numberOfAwards: scholarship.numberOfAwards || "",
      fieldOfStudy: scholarship.fieldOfStudy?.join(", ") || "",
      type: scholarship.type || "",
      tag: scholarship.tag || "",
      bullets: scholarship.bullets?.join("\n") || "",
      statusNote: scholarship.statusNote || "",
      keyPoints: scholarship.keyPoints?.join("\n") || "",
      route: scholarship.route || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setScholarshipToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (scholarshipToDelete) {
      setScholarships(scholarships.filter(s => s.id !== scholarshipToDelete));
      toast.success("Scholarship deleted successfully");
      setDeleteModalOpen(false);
      setScholarshipToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) {
      toast.error("No items selected");
      return;
    }
    const remaining = scholarships.filter(s => !selectedItems.has(s.id));
    setScholarships(remaining);
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} scholarship(s) deleted`);
  };

  const handleBulkVerify = () => {
    if (selectedItems.size === 0) {
      toast.error("No items selected");
      return;
    }
    const updated = scholarships.map(s => 
      selectedItems.has(s.id) ? { ...s, verified: true } : s
    );
    setScholarships(updated);
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} scholarship(s) verified`);
  };

  const handleSave = () => {
    setSaving(true);
    
    const newScholarship: Scholarship = {
      id: editing || Date.now().toString(),
      title: formData.title,
      provider: formData.provider,
      amount: formData.amount,
      currency: formData.currency,
      category: formData.category,
      deadline: formData.deadline,
      location: formData.location,
      level: formData.level,
      description: formData.description,
      requirements: formData.requirements.split("\n").filter(r => r.trim()),
      verified: formData.verified,
      imageUrl: formData.imageUrl,
      featured: formData.featured,
      source: formData.source,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      fullDescription: formData.fullDescription,
      benefits: formData.benefits ? formData.benefits.split("\n").filter(b => b.trim()) : undefined,
      eligibility: formData.eligibility ? formData.eligibility.split("\n").filter(e => e.trim()) : undefined,
      applicationProcess: formData.applicationProcess ? formData.applicationProcess.split("\n").filter(a => a.trim()) : undefined,
      documents: formData.documents ? formData.documents.split("\n").filter(d => d.trim()) : undefined,
      selectionCriteria: formData.selectionCriteria ? formData.selectionCriteria.split("\n").filter(s => s.trim()) : undefined,
      coverageDetails: formData.coverageDetails ? formData.coverageDetails.split("\n").filter(c => c.trim()) : undefined,
      duration: formData.duration,
      renewability: formData.renewability,
      numberOfAwards: formData.numberOfAwards,
      fieldOfStudy: formData.fieldOfStudy ? formData.fieldOfStudy.split(",").map(f => f.trim()).filter(f => f) : undefined,
      type: formData.type,
      tag: formData.tag,
      bullets: formData.bullets ? formData.bullets.split("\n").filter(b => b.trim()) : undefined,
      statusNote: formData.statusNote,
      keyPoints: formData.keyPoints ? formData.keyPoints.split("\n").filter(k => k.trim()) : undefined,
      route: formData.route,
    };

    setTimeout(() => {
      if (editing) {
        setScholarships(scholarships.map(s => s.id === editing ? newScholarship : s));
        toast.success("Scholarship updated successfully");
      } else {
        setScholarships([newScholarship, ...scholarships]);
        toast.success("Scholarship added successfully");
      }
      setSaving(false);
      setShowAddForm(false);
      setEditing(null);
    }, 1000);
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
      max-height: calc(100vh - 400px);
      overflow-y: auto;
    }

    .sm-table {
      width: 100%;
      border-collapse: collapse;
    }

    .sm-table thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .sm-table th {
      padding: 0.75rem;
      text-align: left;
      font-size: 0.75rem;
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
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
      color: #374151;
      vertical-align: middle;
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .sm-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
      position: relative;
    }

    .sm-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .sm-card-image {
      width: 100%;
      height: 160px;
      object-fit: cover;
      background: #f3f4f6;
    }

    .sm-card-content {
      padding: 1rem;
    }

    .sm-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .sm-card-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-clamp: 2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .sm-card-provider {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .sm-card-meta {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0.25rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
      background: #e0e7ff;
      color: #3730a3;
    }

    .sm-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #e5e7eb;
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

    @media (max-width: 768px) {
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
            {paginatedScholarships.map((scholarship) => (
              <div key={scholarship.id} className="sm-card">
                {scholarship.imageUrl && (
                  <img src={scholarship.imageUrl} alt={scholarship.title} className="sm-card-image" />
                )}
                <div className="sm-card-content">
                  <div className="sm-card-header">
                    <div style={{ flex: 1 }}>
                      <h3 className="sm-card-title">{scholarship.title}</h3>
                      <p className="sm-card-provider">{scholarship.provider}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(scholarship.id)}
                      onChange={() => toggleSelection(scholarship.id)}
                      style={{ marginTop: '0.25rem' }}
                    />
                  </div>
                  
                  <div className="sm-card-meta">
                    <DollarSign size={14} />
                    <span>{scholarship.amount} {scholarship.currency}</span>
                  </div>
                  <div className="sm-card-meta">
                    <MapPin size={14} />
                    <span>{scholarship.location}</span>
                  </div>
                  <div className="sm-card-meta">
                    <Calendar size={14} />
                    <span>{formatDate(scholarship.deadline)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span className="sm-badge sm-badge-source">{getSourceName(scholarship.source)}</span>
                    <span className={`sm-badge ${scholarship.verified ? 'sm-badge-verified' : 'sm-badge-unverified'}`}>
                      {scholarship.verified ? 'Verified' : 'Unverified'}
                    </span>
                    {scholarship.featured && (
                      <span className="sm-badge sm-badge-featured">Featured</span>
                    )}
                  </div>

                  <div className="sm-card-actions">
                    <button className="sm-icon-btn" onClick={() => handleEdit(scholarship)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="sm-icon-btn danger" onClick={() => handleDelete(scholarship.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

              <div className="sm-form-body">
                {/* Basic Information */}
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
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
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

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Description *</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter short description"
                        rows={3}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Full Description</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.fullDescription}
                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                        placeholder="Enter detailed description"
                        rows={5}
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

                {/* Detailed Information */}
                <div className="sm-form-section">
                  <h3 className="sm-form-section-title">Detailed Information</h3>
                  <div className="sm-form-grid">
                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Requirements (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="Enter each requirement on a new line"
                        rows={4}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Benefits (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.benefits}
                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                        placeholder="Enter each benefit on a new line"
                        rows={4}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Eligibility (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.eligibility}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        placeholder="Enter each eligibility criterion on a new line"
                        rows={4}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Application Process (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.applicationProcess}
                        onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })}
                        placeholder="Enter each step on a new line"
                        rows={4}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Required Documents (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.documents}
                        onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                        placeholder="Enter each document on a new line"
                        rows={4}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Selection Criteria (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.selectionCriteria}
                        onChange={(e) => setFormData({ ...formData, selectionCriteria: e.target.value })}
                        placeholder="Enter each criterion on a new line"
                        rows={3}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Coverage Details (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.coverageDetails}
                        onChange={(e) => setFormData({ ...formData, coverageDetails: e.target.value })}
                        placeholder="Enter each coverage detail on a new line"
                        rows={3}
                      />
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

                    <div className="sm-form-group">
                      <label className="sm-form-label">Number of Awards</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.numberOfAwards}
                        onChange={(e) => setFormData({ ...formData, numberOfAwards: e.target.value })}
                        placeholder="e.g., 150+ scholarships annually"
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

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Field of Study (comma separated)</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.fieldOfStudy}
                        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                        placeholder="Engineering, Health Sciences, Business"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="sm-form-section">
                  <h3 className="sm-form-section-title">Additional Fields</h3>
                  <div className="sm-form-grid">
                    <div className="sm-form-group">
                      <label className="sm-form-label">Type</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="e.g., Local | Merit-Based"
                      />
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label">Tag</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.tag}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        placeholder="e.g., For top performers"
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Route</label>
                      <input
                        type="text"
                        className="sm-form-input"
                        value={formData.route}
                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                        placeholder="/scholarship/scholarship-name"
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Bullets (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.bullets}
                        onChange={(e) => setFormData({ ...formData, bullets: e.target.value })}
                        placeholder="Enter each bullet point on a new line"
                        rows={3}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Key Points (one per line)</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.keyPoints}
                        onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                        placeholder="Enter each key point on a new line"
                        rows={3}
                      />
                    </div>

                    <div className="sm-form-group full-width">
                      <label className="sm-form-label">Status Note</label>
                      <textarea
                        className="sm-form-textarea"
                        value={formData.statusNote}
                        onChange={(e) => setFormData({ ...formData, statusNote: e.target.value })}
                        placeholder="e.g., Applications open from..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
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

