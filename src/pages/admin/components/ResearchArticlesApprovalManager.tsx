import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  FileText,
  GraduationCap,
  User,
  Calendar,
  Clock
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  author?: string;
  author_name?: string;
  institution?: string;
  institution_name?: string;
  status?: string;
  submitted_at?: string;
  created_at?: string;
  abstract?: string;
  keywords?: string[];
}

interface ResearchArticlesApprovalManagerProps {
  onView: (article: Article) => void;
  onEdit: (article: Article) => void;
  onApprove: (article: Article) => void;
  onReject: (article: Article) => void;
}

const ResearchArticlesApprovalManager = ({ onView, onEdit, onApprove, onReject }: ResearchArticlesApprovalManagerProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles' as any)
        .select(`
          *,
          institutions(name, abbreviation)
        `)
        .in('status', ['under-review', 'revision-requested'])
        .eq('is_current_version', true)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Get author names from profiles table
        const userIds = [...new Set(data.map((article: any) => article.submitted_by))];
        const { data: profilesData } = await supabase
          .from('profiles' as any)
          .select('user_id, full_name')
          .in('user_id', userIds);

        const profilesMap = new Map(
          (profilesData || []).map((profile: any) => [profile.user_id, profile.full_name])
        );

        // Transform data to match expected format
        const transformed = data.map((article: any) => ({
          ...article,
          author_name: profilesMap.get(article.submitted_by) || 'Unknown',
          institution_name: article.institutions?.name || 'Unknown',
        }));
        setArticles(transformed);
      }
    } catch (error: any) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (article.author_name && article.author_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (article.institution_name && article.institution_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <Clock size={48} style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div id="aljg-filters" style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#111827", flex: 1 }}>
          Pending Approvals ({filteredArticles.length})
        </h3>
        <div id="aljg-search-wrapper" style={{ position: "relative", flex: 1, minWidth: "280px" }}>
          <Search id="aljg-search-icon" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", width: "18px", height: "18px", pointerEvents: "none" }} />
          <input
            id="aljg-search-input"
            type="text"
            placeholder="Search articles by title, author, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.625rem 1rem 0.625rem 2.75rem", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.875rem", background: "#f9fafb", transition: "all 0.2s" }}
          />
        </div>
      </div>

      <div id="aljg-table-container" style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <table id="aljg-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Article Details</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Author</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Institution</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Submitted</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map(article => (
              <tr key={article.id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div className="aljg-gig-cell" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <p className="aljg-gig-title" style={{ fontWeight: 600, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <FileText style={{ width: "16px", height: "16px", color: "#3b82f6", flexShrink: 0 }} />
                      {article.title}
                    </p>
                    {article.abstract && (
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {article.abstract}
                      </p>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ fontWeight: 500, color: "#111827", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <User style={{ width: "14px", height: "14px" }} />
                      {article.author_name || article.author || "Unknown"}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    <GraduationCap style={{ width: "14px", height: "14px" }} />
                    {article.institution_name || article.institution || "Unknown"}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <Calendar style={{ width: "14px", height: "14px" }} />
                    {article.submitted_at || article.created_at ? new Date(article.submitted_at || article.created_at || "").toLocaleDateString() : "N/A"}
                  </span>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div className="aljg-actions" style={{ display: "flex", gap: "0.375rem" }}>
                    <button className="aljg-action-btn view" title="View Details" onClick={() => onView(article)} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", padding: 0 }}>
                      <Eye style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                    </button>
                    <button className="aljg-action-btn edit" title="Edit Article" onClick={() => onEdit(article)} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", padding: 0 }}>
                      <Edit2 style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                    </button>
                    <button
                      type="button"
                      className="aljg-action-btn"
                      style={{ background: "#10b981", color: "white", width: "32px", height: "32px", borderRadius: "6px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", padding: 0 }}
                      title="Approve Article"
                      onClick={() => onApprove(article)}
                    >
                      <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                    </button>
                    <button
                      type="button"
                      className="aljg-action-btn"
                      style={{ background: "#ef4444", color: "white", width: "32px", height: "32px", borderRadius: "6px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", padding: 0 }}
                      title="Reject Article"
                      onClick={() => onReject(article)}
                    >
                      <XCircle style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredArticles.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
          <CheckCircle2 style={{ width: "48px", height: "48px", margin: "0 auto 1rem", color: "#10b981" }} />
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No pending approvals</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>All articles have been reviewed</p>
        </div>
      )}
    </div>
  );
};

export default ResearchArticlesApprovalManager;
