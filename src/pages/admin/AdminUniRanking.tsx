import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap,
  CheckCircle,
  Search,
  CheckCircle2,
  MapPin,
  Building2,
  FileText,
  Filter,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Clock
} from "lucide-react";
import {
  EditInstitutionModal,
  EditArticleModal,
  ViewArticleModal,
  ApprovalModal,
  RejectConfirmModal,
  DeleteConfirmModal
} from "./components/UniRankingModals";
import AllInstitutionsManager from "./components/AllInstitutionsManager";
import ResearchArticlesApprovalManager from "./components/ResearchArticlesApprovalManager";

const AdminUniRanking = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("institutions");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [showEditInstitution, setShowEditInstitution] = useState(false);
  const [showEditArticle, setShowEditArticle] = useState(false);
  const [showViewArticle, setShowViewArticle] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "institution"; id: string | number; name: string } | null>(null);
  
  // Stats state
  const [stats, setStats] = useState([
    {
      id: 1,
      label: "Total Institutions",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: GraduationCap,
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      id: 2,
      label: "Active Institutions",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: CheckCircle2,
      color: "#10b981",
      bgColor: "#f0fdf4"
    },
    {
      id: 3,
      label: "Pending Articles",
      value: "0",
      change: "+0%",
      trend: "down",
      icon: Clock,
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
  ]);

  // Load stats from Supabase
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total institutions
      const { count: totalInstitutions } = await supabase
        .from('institutions' as any)
        .select('*', { count: 'exact', head: true });

      // Get active institutions
      const { count: activeInstitutions } = await supabase
        .from('institutions' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get pending articles (under-review or revision-requested)
      const { count: pendingArticles } = await supabase
        .from('articles' as any)
        .select('*', { count: 'exact', head: true })
        .eq('is_current_version', true)
        .in('status', ['under-review', 'revision-requested']);

      setStats([
        {
          id: 1,
          label: "Total Institutions",
          value: totalInstitutions ? (totalInstitutions >= 50 ? "50+" : totalInstitutions.toString()) : "0",
          change: "+0%",
          trend: "up",
          icon: GraduationCap,
          color: "#3b82f6",
          bgColor: "#eff6ff"
        },
        {
          id: 2,
          label: "Active Institutions",
          value: activeInstitutions?.toString() || "0",
          change: "+0%",
          trend: "up",
          icon: CheckCircle2,
          color: "#10b981",
          bgColor: "#f0fdf4"
        },
        {
          id: 3,
          label: "Pending Articles",
          value: pendingArticles?.toString() || "0",
          change: "+0%",
          trend: "down",
          icon: Clock,
          color: "#f59e0b",
          bgColor: "#fef3c7"
        },
      ]);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname.includes("/approval")) {
      setActiveTab("approval");
    } else if (location.pathname.includes("/institutions")) {
      setActiveTab("institutions");
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


  const tabs = [
    { id: "institutions", label: "All Institutions", icon: GraduationCap },
    { id: "approval", label: "Research Articles Approval", icon: CheckCircle }
  ];

  // Modal handlers
  const handleEditInstitution = (institution: any) => {
    setSelectedInstitution(institution);
    setShowEditInstitution(true);
  };

  const handleViewArticle = (article: any) => {
    setSelectedArticle(article);
    setShowViewArticle(true);
  };

  const handleSaveInstitution = async (data: any) => {
    try {
      if (data.id) {
        // Update existing institution
        const { error } = await supabase
          .from('institutions')
          .update({
            name: data.name,
            abbreviation: data.abbreviation || null,
            description: data.description || null,
            logo: data.logo || null,
            website: data.website || null,
            founded_year: data.foundedYear || null,
            city: data.city || null,
            region: data.region || null,
            type: data.type || null,
          })
          .eq('id', String(data.id));

        if (error) throw error;
      } else {
        // Create new institution
        const { error } = await supabase
          .from('institutions')
          .insert({
            name: data.name,
            abbreviation: data.abbreviation || null,
            description: data.description || null,
            logo: data.logo || null,
            website: data.website || null,
            founded_year: data.foundedYear || null,
            city: data.city || null,
            region: data.region || null,
            type: data.type || null,
            country: 'Ghana',
            status: 'active',
            total_articles: 0,
            articles_this_month: 0,
          });

        if (error) throw error;
      }
      
      // Reload stats after saving institution
      await loadStats();
      // Reload page to refresh data
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving institution:', error);
      alert('Error saving institution: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteInstitution = (institution: any) => {
    setDeleteTarget({ type: "institution", id: institution.id, name: institution.name });
    setShowDeleteConfirm(true);
  };

  const handleEditArticle = (article: any) => {
    setSelectedArticle(article);
    setShowEditArticle(true);
  };

  const handleSaveArticle = async (data: any) => {
    try {
      const { error } = await supabase
        .from('scholarly_articles' as any)
        .update({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
          references: data.references,
        })
        .eq('id', String(data.id));

      if (error) throw error;
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving article:', error);
      alert('Error saving article: ' + (error.message || 'Unknown error'));
    }
  };

  const handleApproveClick = (article: any) => {
    setSelectedInstitution(article);
    setShowApproval(true);
  };

  const handleRejectClick = (article: any) => {
    setSelectedInstitution(article);
    setShowRejectConfirm(true);
  };

  const handleApprove = async (id: string | number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('articles' as any)
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
        })
        .eq('id', String(id));

      if (error) throw error;
      
      // Reload stats after approval
      await loadStats();
      // Reload data
      window.location.reload();
    } catch (error: any) {
      console.error('Error approving article:', error);
      alert('Error approving article: ' + (error.message || 'Unknown error'));
    }
  };

  const handleReject = async (id: string | number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('articles' as any)
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', String(id));

      if (error) throw error;
      
      // Reload stats after rejection
      await loadStats();
      // Reload data
      window.location.reload();
    } catch (error: any) {
      console.error('Error rejecting article:', error);
      alert('Error rejecting article: ' + (error.message || 'Unknown error'));
    }
  };

  const recalculateRanks = async () => {
    try {
      // Call the database function to recalculate ranks
      const { error } = await supabase.rpc('recalculate_institution_ranks' as any);
      
      if (error) {
        // Fallback: manual recalculation if function doesn't exist
        console.warn('RPC function not available, using manual recalculation:', error);
        
        // Get all active institutions ordered by current rank
        const { data: institutions, error: fetchError } = await supabase
          .from('institutions' as any)
          .select('id, current_rank')
          .eq('status', 'active')
          .order('current_rank', { ascending: true, nullsLast: true });

        if (fetchError) throw fetchError;
        if (!institutions || institutions.length === 0) return;

        // Update ranks sequentially (1, 2, 3, 4...)
        for (let index = 0; index < institutions.length; index++) {
          const inst = institutions[index];
          const oldRank = inst.current_rank;
          const newRank = index + 1;
          
          const { error: updateError } = await supabase
            .from('institutions' as any)
            .update({
              previous_rank: oldRank,
              current_rank: newRank,
              movement: oldRank === newRank ? 'stable' : 
                        (oldRank && oldRank > newRank ? 'up' : 'down'),
            })
            .eq('id', inst.id);

          if (updateError) {
            console.error(`Error updating rank for institution ${inst.id}:`, updateError);
          }
        }
      }
    } catch (error: any) {
      console.error('Error recalculating ranks:', error);
      // Don't throw - ranks will be recalculated on next page load or by trigger
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', String(deleteTarget.id));

      if (error) throw error;
      
      // Recalculate ranks after deletion to fill gaps
      await recalculateRanks();
      
      // Reload stats after deleting institution
      await loadStats();
      window.location.reload();
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
    } catch (error: any) {
      console.error('Error deleting institution:', error);
      alert('Error deleting institution: ' + (error.message || 'Unknown error'));
    }
  };

  const isolatedStyles = `
    #aur-wrapper {
      width: 100%;
      padding: 0;
      margin: 0;
      background: #f8fafc;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
    }

    /* Remove default content padding for this page */
    #admin-scope .content #aur-wrapper {
      margin: -20px;
      padding: 0;
    }

    /* Header Section */
    #aur-header {
      padding: 2rem 2rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #aur-header-content {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    #aur-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #aur-title-icon {
      color: #3b82f6;
    }

    #aur-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    /* Stats Cards */
    #aur-stats {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    #aur-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .aur-stat-card {
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

    .aur-stat-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .aur-stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .aur-stat-content {
      flex: 1;
      min-width: 0;
    }

    .aur-stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .aur-stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
      line-height: 1;
    }

    .aur-stat-change {
      font-size: 0.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .aur-stat-change.up {
      background: #dcfce7;
      color: #16a34a;
    }

    .aur-stat-change.down {
      background: #fee2e2;
      color: #dc2626;
    }

    /* Tabs */
    #aur-tabs-container {
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

    #aur-tabs-container.sticky-active {
      top: -20px;
      margin-top: 0;
    }

    #aur-tabs-container::-webkit-scrollbar {
      height: 6px;
    }

    #aur-tabs-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    #aur-tabs-container::-webkit-scrollbar-thumb {
      background: #3b82f6;
      border-radius: 3px;
    }

    .aur-tab {
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

    .aur-tab:hover {
      color: #3b82f6;
      background: #eff6ff;
    }

    .aur-tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
      background: #eff6ff;
    }

    .aur-tab-icon {
      width: 18px;
      height: 18px;
    }

    /* Content Area */
    #aur-content {
      padding: 2rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      #aur-header {
        padding: 1.5rem 1rem 1rem;
      }

      #aur-title {
        font-size: 1.5rem;
      }

      #aur-stats {
        padding: 1rem;
      }

      #aur-stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      #aur-content {
        padding: 1rem;
      }
    }
  `;

  return (
    <div id="aur-wrapper">
      <style>{isolatedStyles}</style>

      {/* Header */}
      <div id="aur-header">
        <div id="aur-header-content">
          <h1 id="aur-title">
            <GraduationCap id="aur-title-icon" size={32} />
            University Ranking Management
          </h1>
          <p id="aur-subtitle">
            Manage Ghanaian universities and approve research articles for the scholarly ranking platform
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div id="aur-stats">
        <div id="aur-stats-grid">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="aur-stat-card">
                <div className="aur-stat-icon" style={{ background: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="aur-stat-content">
                  <p className="aur-stat-label">{stat.label}</p>
                  <p className="aur-stat-value">{stat.value}</p>
                  <span className={`aur-stat-change ${stat.trend}`}>
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
      <div id="aur-tabs-container" ref={tabsContainerRef}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`aur-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="aur-tab-icon" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div id="aur-content">
        {activeTab === "institutions" && (
        <AllInstitutionsManager
          onEdit={handleEditInstitution}
          onDelete={handleDeleteInstitution}
          onAdd={() => {
            setSelectedInstitution(null);
            setShowEditInstitution(true);
          }}
        />
        )}
        {activeTab === "approval" && (
          <ResearchArticlesApprovalManager
            onView={handleViewArticle}
            onEdit={handleEditArticle}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
          />
        )}
      </div>

      {/* Modals */}
      <EditInstitutionModal
        isOpen={showEditInstitution}
        onClose={() => {
          setShowEditInstitution(false);
          setSelectedInstitution(null);
        }}
        institution={selectedInstitution}
        onSave={handleSaveInstitution}
      />
      <ViewArticleModal
        isOpen={showViewArticle}
        onClose={() => {
          setShowViewArticle(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
      />
      <EditArticleModal
        isOpen={showEditArticle}
        onClose={() => {
          setShowEditArticle(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
        onSave={handleSaveArticle}
      />
      <ApprovalModal
        isOpen={showApproval}
        onClose={() => {
          setShowApproval(false);
          setSelectedInstitution(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        article={selectedInstitution}
        mode="approve"
      />
      <RejectConfirmModal
        isOpen={showRejectConfirm}
        onClose={() => {
          setShowRejectConfirm(false);
          setSelectedInstitution(null);
        }}
        onConfirm={handleReject}
        article={selectedInstitution}
      />
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Institution?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        type="institution"
      />
    </div>
  );
};

export default AdminUniRanking;
