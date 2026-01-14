import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Briefcase,
  UserCheck,
  Clock,
  TrendingUp,
  Search,
  Eye,
  CheckCircle,
  MapPin,
  CreditCard,
  Calendar,
  Building2,
  Phone,
  Mail,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";
import {
  AddGigModal,
  EditGigModal,
  ViewGigModal,
  ApprovalModal,
  RejectConfirmModal,
  DeleteConfirmModal
} from "./components/LocalGigsModals";

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};


const AdminLocalJobGigs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("gigs");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [showAddGig, setShowAddGig] = useState(false);
  const [showEditGig, setShowEditGig] = useState(false);
  const [showViewGig, setShowViewGig] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "gig"; id: string | number; name: string } | null>(null);

  // Data states - MOCK DATA (no Supabase)
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname.includes("/approval")) {
      setActiveTab("approval");
    } else if (location.pathname.includes("/gigs")) {
      setActiveTab("gigs");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Handle sticky tabs spacing - account for navbar
    const handleScroll = () => {
      if (!tabsContainerRef.current || !spacerRef.current) return;

      const navbar = document.querySelector('#admin-scope .navbar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;

      const rect = tabsContainerRef.current.getBoundingClientRect();
      const isSticky = rect.top <= navbarHeight;

      if (isSticky) {
        tabsContainerRef.current.classList.add('sticky-active');
        spacerRef.current.style.height = `${rect.height}px`;
      } else {
        tabsContainerRef.current.classList.remove('sticky-active');
        spacerRef.current.style.height = '0px';
      }
    };

    const contentArea = document.querySelector('#admin-scope .content');
    if (contentArea) {
      contentArea.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => contentArea.removeEventListener('scroll', handleScroll);
    }

    return () => {};
  }, []);

  // Load mock data (VIEW ONLY - no Supabase)
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setLoading(true);
    
    // Mock gigs
    const mockGigs = [
      {
        id: "1",
        title: "Delivery Driver Needed",
        description: "Looking for reliable delivery driver for weekend shifts",
        category: "Delivery Services",
        category_id: "1",
        location: "Accra, Greater Accra",
        employer_name: "QuickServe Logistics",
        employer_phone: "+233 24 123 4567",
        employer_email: "jobs@quickserve.com",
        payment_amount: 150,
        payment_type: "daily",
        duration: "2 days",
        start_date: "2026-01-20",
        end_date: "2026-01-21",
        status: "active",
        slots_available: 3,
        created_at: "2026-01-10T10:00:00Z",
        requirements: "Valid driver's license, motorcycle preferred",
        benefits: "Free fuel, tips allowed",
        verified: true,
        views: 45,
        applications: 8
      },
      {
        id: "2",
        title: "Event Servers for Wedding",
        description: "Professional servers needed for large wedding event",
        category: "Event Staff",
        category_id: "2",
        location: "Kumasi, Ashanti",
        employer_name: "Elite Events Ghana",
        employer_phone: "+233 20 987 6543",
        employer_email: "contact@eliteevents.gh",
        payment_amount: 200,
        payment_type: "fixed",
        duration: "1 day",
        start_date: "2026-01-25",
        status: "pending",
        slots_available: 10,
        created_at: "2026-01-11T14:30:00Z",
        requirements: "Experience in hospitality, formal attire required",
        benefits: "Meals provided, transportation covered",
        verified: false,
        views: 32,
        applications: 5
      },
      {
        id: "3",
        title: "Office Cleaning Staff",
        description: "Daily office cleaning for medium-sized office",
        category: "Cleaning & Housekeeping",
        category_id: "3",
        location: "Tema, Greater Accra",
        employer_name: "CleanPro Services",
        employer_phone: "+233 27 456 7890",
        payment_amount: 1200,
        payment_type: "monthly",
        duration: "3 months",
        status: "active",
        slots_available: 2,
        created_at: "2026-01-09T09:15:00Z",
        requirements: "Experience preferred, own cleaning supplies",
        benefits: "Weekly payment, flexible hours",
        verified: true,
        views: 67,
        applications: 12
      },
      {
        id: "4",
        title: "Moving Assistant",
        description: "Help with moving furniture and boxes",
        category: "Moving & Transport",
        category_id: "4",
        location: "Accra, Greater Accra",
        employer_name: "Swift Movers",
        employer_phone: "+233 24 555 1234",
        payment_amount: 180,
        payment_type: "daily",
        duration: "1 day",
        start_date: "2026-01-22",
        status: "active",
        slots_available: 4,
        created_at: "2026-01-12T08:00:00Z",
        requirements: "Physical fitness required",
        benefits: "Lunch provided",
        verified: true,
        views: 28,
        applications: 6
      },
      {
        id: "5",
        title: "Handyman for Repairs",
        description: "General maintenance and repair work needed",
        category: "Handyman & Maintenance",
        category_id: "5",
        location: "Kumasi, Ashanti",
        employer_name: "HomeFix Solutions",
        employer_phone: "+233 20 777 8888",
        payment_amount: 250,
        payment_type: "fixed",
        duration: "2 days",
        start_date: "2026-01-18",
        status: "pending",
        slots_available: 1,
        created_at: "2026-01-13T11:20:00Z",
        requirements: "Experience in general repairs",
        benefits: "Tools provided",
        verified: false,
        views: 19,
        applications: 3
      }
    ];

    setGigs(mockGigs);
    setLoading(false);
  };

  // Calculate statistics from mock data
  const stats = [
    {
      id: 1,
      label: "Total Gigs",
      value: gigs.length.toLocaleString(),
      change: "+0%",
      trend: "up",
      icon: Briefcase,
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      id: 2,
      label: "Active Gigs",
      value: gigs.filter(g => g.status === 'active').length.toLocaleString(),
      change: "+0%",
      trend: "up",
      icon: CheckCircle2,
      color: "#10b981",
      bgColor: "#f0fdf4"
    },
    {
      id: 3,
      label: "Pending Reviews",
      value: gigs.filter(g => g.status === 'pending').length.toLocaleString(),
      change: "+0%",
      trend: "down",
      icon: Clock,
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
  ];

  const tabs = [
    { id: "gigs", label: "Gigs Management", icon: UserCheck },
    { id: "approval", label: "Gigs Approval", icon: CheckCircle }
  ];

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gig.employer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gig.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || gig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Modal handlers
  const handleViewGig = (gig: any) => {
    setSelectedGig(gig);
    setShowViewGig(true);
  };

  const handleEditGig = (gig: any) => {
    setSelectedGig(gig);
    setShowEditGig(true);
  };

  const handleDeleteGig = (gig: any) => {
    setDeleteTarget({ type: "gig", id: gig.id, name: gig.title });
    setShowDeleteConfirm(true);
  };

  const handleApproveClick = (gig: any) => {
    setSelectedGig(gig);
    setShowApproval(true);
  };

  const handleRejectClick = (gig: any) => {
    setSelectedGig(gig);
    setShowRejectConfirm(true);
  };


  // Save handlers (mock data updates)
  const handleSaveGig = (gigData: any) => {
    if (gigData.id) {
      // Edit existing gig
      setGigs(gigs.map(g => g.id === gigData.id ? { ...g, ...gigData } : g));
    } else {
      // Add new gig
      const newGig = {
        ...gigData,
        id: String(gigs.length + 1),
        status: "pending",
        created_at: new Date().toISOString(),
        views: 0,
        applications: 0,
        verified: false
      };
      setGigs([...gigs, newGig]);
    }
  };


  const handleApprove = (id: string | number) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, status: "active", verified: true } : g));
  };

  const handleReject = (id: string | number, reason: string) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, status: "rejected", rejectionReason: reason } : g));
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    
    setGigs(gigs.filter(g => g.id !== deleteTarget.id));
    
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  const isolatedStyles = `
    #aljg-wrapper {
      width: 100%;
      padding: 0;
      margin: 0;
      background: #f8fafc;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
    }

    /* Remove default content padding for this page */
    #admin-scope .content #aljg-wrapper {
      margin: -20px;
      padding: 0;
    }

    /* Header Section */
    #aljg-header {
      padding: 2rem 2rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #aljg-header-content {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    #aljg-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #aljg-title-icon {
      color: #3b82f6;
    }

    #aljg-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    /* Stats Cards */
    #aljg-stats {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    #aljg-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .aljg-stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .aljg-stat-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .aljg-stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .aljg-stat-content {
      flex: 1;
      min-width: 0;
    }

    .aljg-stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .aljg-stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-height: 1;
    }

    .aljg-stat-change {
      font-size: 0.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .aljg-stat-change.up {
      background: #dcfce7;
      color: #16a34a;
    }

    .aljg-stat-change.down {
      background: #fee2e2;
      color: #dc2626;
    }

    /* Tabs */
    #aljg-tabs-container {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 2rem;
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
      position: sticky;
      top: -20px;
      margin-top: 0;
      margin-left: -20px;
      margin-right: -20px;
      padding-left: calc(20px + 2rem);
      padding-right: calc(20px + 2rem);
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      gap: 0.25rem;
    }

    #aljg-tabs-container.sticky-active {
      top: -20px;
      margin-top: 0;
    }

    #aljg-tabs-container::-webkit-scrollbar {
      height: 6px;
    }

    #aljg-tabs-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    #aljg-tabs-container::-webkit-scrollbar-thumb {
      background: #3b82f6;
      border-radius: 3px;
    }

    .aljg-tab {
      flex-shrink: 0;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .aljg-tab:hover {
      color: #3b82f6;
      background: #eff6ff;
    }

    .aljg-tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
      background: #eff6ff;
    }

    .aljg-tab-icon {
      width: 18px;
      height: 18px;
    }

    /* Content Area */
    #aljg-content {
      padding: 2rem;
    }

    /* Filters Bar */
    #aljg-filters {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    #aljg-search-wrapper {
      position: relative;
      flex: 1;
      min-width: 280px;
    }

    #aljg-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 18px;
      height: 18px;
      pointer-events: none;
    }

    #aljg-search-input {
      width: 100%;
      padding: 0.625rem 1rem 0.625rem 2.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      background: #f9fafb;
      transition: all 0.2s;
    }

    #aljg-search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .aljg-filter-select {
      padding: 0.625rem 2.5rem 0.625rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      background: #f9fafb;
      color: #374151;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      transition: all 0.2s;
    }

    .aljg-filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      background-color: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Gigs Table */
    #aljg-table-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    #aljg-table {
      width: 100%;
      border-collapse: collapse;
    }

    #aljg-table thead {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    #aljg-table th {
      padding: 0.875rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    #aljg-table tbody tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;
    }

    #aljg-table tbody tr:last-child {
      border-bottom: none;
    }

    #aljg-table tbody tr:hover {
      background: #f9fafb;
    }

    #aljg-table td {
      padding: 1rem;
      font-size: 0.875rem;
      color: #374151;
      vertical-align: middle;
    }

    .aljg-gig-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .aljg-gig-title {
      font-weight: 600;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .aljg-verified-badge {
      width: 16px;
      height: 16px;
      color: #3b82f6;
      flex-shrink: 0;
    }

    .aljg-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .aljg-status-badge.active {
      background: #dcfce7;
      color: #16a34a;
    }

    .aljg-status-badge.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .aljg-status-badge.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .aljg-status-icon {
      width: 12px;
      height: 12px;
    }

    .aljg-actions {
      display: flex;
      gap: 0.375rem;
    }

    .aljg-action-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0;
    }

    .aljg-action-btn:hover {
      background: #f9fafb;
      border-color: #cbd5e1;
    }

    .aljg-action-btn.view:hover {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .aljg-action-icon {
      width: 16px;
      height: 16px;
      color: #6b7280;
    }

    /* Categories Grid */
    #aljg-categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    #aljg-categories-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .aljg-category-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .aljg-category-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .aljg-category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .aljg-category-info {
      flex: 1;
    }

    .aljg-category-name {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .aljg-category-count {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .aljg-view-toggle {
      display: flex;
      gap: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.25rem;
    }

    .aljg-view-toggle-btn {
      padding: 0.5rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s;
    }

    .aljg-view-toggle-btn:hover {
      background: #f9fafb;
      color: #374151;
    }

    .aljg-view-toggle-btn.active {
      background: #3b82f6;
      color: white;
    }


    /* Responsive */
    @media (max-width: 768px) {
      #aljg-header {
        padding: 1.5rem 1rem 1rem;
      }

      #aljg-title {
        font-size: 1.5rem;
      }

      #aljg-stats {
        padding: 1rem;
      }

      #aljg-stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      #aljg-content {
        padding: 1rem;
      }

      #aljg-filters {
        flex-direction: column;
        align-items: stretch;
      }

      #aljg-search-wrapper {
        min-width: 100%;
      }

      #aljg-table-container {
        overflow-x: auto;
      }

      #aljg-table {
        min-width: 800px;
      }

      #aljg-categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `;


  const renderGigs = () => (
    <div>
      <div id="aljg-filters">
        <div id="aljg-search-wrapper">
          <Search id="aljg-search-icon" />
          <input
            id="aljg-search-input"
            type="text"
            placeholder="Search gigs by title, employer, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="aljg-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>


        <button className="aljg-filter-select" style={{ padding: "0.625rem 1rem", cursor: "pointer" }}>
          <Filter size={16} style={{ marginRight: "0.5rem", display: "inline" }} />
          More Filters
        </button>

        <button
          className="aljg-filter-select"
          style={{
            padding: "0.625rem 1rem",
            cursor: "pointer",
            background: "#3b82f6",
            color: "white",
            border: "none",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onClick={() => setShowAddGig(true)}
        >
          <Plus size={16} />
          Add New Gig
        </button>
      </div>

      <div id="aljg-table-container">
        <table id="aljg-table">
          <thead>
            <tr>
              <th>Gig Details</th>
              <th>Employer</th>
              <th>Location</th>
              <th>Estimated Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGigs.map(gig => (
              <tr key={gig.id}>
                <td>
                  <div className="aljg-gig-cell">
                    <p className="aljg-gig-title">
                      {gig.title}
                      {gig.verified && <CheckCircle2 className="aljg-verified-badge" />}
                    </p>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ fontWeight: 500, color: "#111827", fontSize: "0.875rem" }}>{gig.employer_name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                      <Phone style={{ width: "12px", height: "12px" }} />
                      {gig.employer_phone}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    <MapPin style={{ width: "14px", height: "14px" }} />
                    {gig.location}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 600, color: "#10b981" }}>
                    <CreditCard style={{ width: "14px", height: "14px" }} />
                    {gig.payment_amount ? `Estimated: GHS ${gig.payment_amount.toLocaleString()}` : "Negotiable"}
                  </div>
                </td>
                <td>
                  <span className={`aljg-status-badge ${gig.status}`}>
                    {gig.status === "active" ? (
                      <CheckCircle2 className="aljg-status-icon" />
                    ) : gig.status === "pending" ? (
                      <Clock className="aljg-status-icon" />
                    ) : (
                      <XCircle className="aljg-status-icon" />
                    )}
                    {gig.status}
                  </span>
                </td>
                <td>
                  <div className="aljg-actions">
                    <button className="aljg-action-btn view" title="View Details" onClick={() => handleViewGig(gig)}>
                      <Eye className="aljg-action-icon" />
                    </button>
                    <button className="aljg-action-btn edit" title="Edit Gig" onClick={() => handleEditGig(gig)}>
                      <Edit2 className="aljg-action-icon" />
                    </button>
                    <button className="aljg-action-btn delete" title="Delete Gig" onClick={() => handleDeleteGig(gig)}>
                      <Trash2 className="aljg-action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredGigs.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
          <Briefcase style={{ width: "48px", height: "48px", margin: "0 auto 1rem" }} />
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No gigs found</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );

  const renderApproval = () => {
    const pendingGigs = gigs.filter(g => g.status === 'pending');

    return (
      <div>
        <div id="aljg-filters">
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#111827", flex: 1 }}>
            Pending Approvals ({pendingGigs.length})
          </h3>
        </div>

        <div id="aljg-table-container">
          <table id="aljg-table">
            <thead>
              <tr>
                <th>Gig Details</th>
                <th>Employer</th>
                <th>Location</th>
                <th>Estimated Pay</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingGigs.map(gig => (
                <tr key={gig.id}>
                  <td>
                    <div className="aljg-gig-cell">
                      <p className="aljg-gig-title">{gig.title}</p>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ fontWeight: 500, color: "#111827", fontSize: "0.875rem" }}>{gig.employer_name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                        <Phone style={{ width: "12px", height: "12px" }} />
                        {gig.employer_phone}
                      </div>
                      {gig.employer_email && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                          <Mail style={{ width: "12px", height: "12px" }} />
                          {gig.employer_email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      <MapPin style={{ width: "14px", height: "14px" }} />
                      {gig.location}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 600, color: "#10b981" }}>
                      <CreditCard style={{ width: "14px", height: "14px" }} />
                      {gig.payment_amount ? `₦${gig.payment_amount.toLocaleString()}` : "Negotiable"}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {new Date(gig.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="aljg-actions">
                      <button className="aljg-action-btn view" title="View Details" onClick={() => handleViewGig(gig)}>
                        <Eye className="aljg-action-icon" />
                      </button>
                      <button
                        type="button"
                        className="aljg-action-btn"
                        style={{ background: "#10b981", color: "white" }}
                        title="Approve Gig"
                        onClick={() => handleApproveClick(gig)}
                      >
                        <CheckCircle2 className="aljg-action-icon" />
                      </button>
                      <button
                        type="button"
                        className="aljg-action-btn"
                        style={{ background: "#ef4444", color: "white" }}
                        title="Reject Gig"
                        onClick={() => handleRejectClick(gig)}
                      >
                        <XCircle className="aljg-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pendingGigs.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
            <CheckCircle2 style={{ width: "48px", height: "48px", margin: "0 auto 1rem", color: "#10b981" }} />
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No pending approvals</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>All gigs have been reviewed</p>
          </div>
        )}
      </div>
    );
  };


  if (loading) {
    return (
      <div id="aljg-wrapper">
        <style>{isolatedStyles}</style>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <Clock size={48} style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p>Loading gigs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="aljg-wrapper">
      <style>{isolatedStyles}</style>

      {/* Header */}
      <div id="aljg-header">
        <div id="aljg-header-content">
          <h1 id="aljg-title">
            <Briefcase id="aljg-title-icon" size={32} />
            Local Job Gigs Management
          </h1>
          <p id="aljg-subtitle">
            Manage local gig opportunities and connect job seekers with employers (View Mode)
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div id="aljg-stats">
        <div id="aljg-stats-grid">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="aljg-stat-card">
                <div className="aljg-stat-icon" style={{ background: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="aljg-stat-content">
                  <p className="aljg-stat-label">{stat.label}</p>
                  <p className="aljg-stat-value">{stat.value}</p>
                  <span className={`aljg-stat-change ${stat.trend}`}>
                    {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div ref={spacerRef}></div>
      <div id="aljg-tabs-container" ref={tabsContainerRef}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`aljg-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="aljg-tab-icon" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div id="aljg-content">
        {activeTab === "gigs" && renderGigs()}
        {activeTab === "approval" && renderApproval()}
      </div>

      {/* Modals */}
      <AddGigModal
        isOpen={showAddGig}
        onClose={() => setShowAddGig(false)}
        onSave={handleSaveGig}
      />
      <EditGigModal
        isOpen={showEditGig}
        onClose={() => {
          setShowEditGig(false);
          setSelectedGig(null);
        }}
        onSave={handleSaveGig}
        gig={selectedGig}
      />
      <ViewGigModal
        isOpen={showViewGig}
        onClose={() => {
          setShowViewGig(false);
          setSelectedGig(null);
        }}
        gig={selectedGig}
      />
      <ApprovalModal
        isOpen={showApproval}
        onClose={() => {
          setShowApproval(false);
          setSelectedGig(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        gig={selectedGig}
        mode="approve"
      />
      <RejectConfirmModal
        isOpen={showRejectConfirm}
        onClose={() => {
          setShowRejectConfirm(false);
          setSelectedGig(null);
        }}
        onConfirm={handleReject}
        gig={selectedGig}
      />
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Gig?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        type="gig"
      />
    </div>
  );
};

export default AdminLocalJobGigs;
