import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockUniversities } from "@/utils/scholarlyRankingData";
import {
  Search,
  Edit2,
  Trash2,
  GraduationCap,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Plus
} from "lucide-react";

interface Institution {
  id: string;
  name: string;
  abbreviation?: string;
  region?: string;
  type?: string;
  logo?: string;
  description?: string;
  city?: string;
  status?: string;
  created_at?: string;
}

interface AllInstitutionsManagerProps {
  onEdit: (institution: Institution) => void;
  onDelete: (institution: Institution) => void;
  onAdd: () => void;
}

const AllInstitutionsManager = ({ onEdit, onDelete, onAdd }: AllInstitutionsManagerProps) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setInstitutions(data as unknown as Institution[]);
      } else {
        // Use mock data if Supabase is empty or fails
        const mockData: Institution[] = mockUniversities.map(uni => ({
          id: uni.id,
          name: uni.name,
          abbreviation: uni.abbreviation,
          city: uni.city,
          region: getRegionFromCity(uni.city),
          type: getTypeFromName(uni.name),
          logo: uni.logo,
          description: uni.description,
          status: 'active',
          created_at: uni.createdAt,
        }));
        setInstitutions(mockData);
      }
    } catch (error: any) {
      console.error('Error loading institutions:', error);
      // Use mock data as fallback
      const mockData: Institution[] = mockUniversities.map(uni => ({
        id: uni.id,
        name: uni.name,
        abbreviation: uni.abbreviation,
        city: uni.city,
        region: getRegionFromCity(uni.city),
        type: getTypeFromName(uni.name),
        logo: uni.logo,
        description: uni.description,
        status: 'active',
        created_at: uni.createdAt,
      }));
      setInstitutions(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine region from city
  const getRegionFromCity = (city: string): string => {
    const cityLower = city.toLowerCase();
    if (cityLower.includes('accra') || cityLower.includes('legon')) return 'Greater Accra';
    if (cityLower.includes('kumasi')) return 'Ashanti';
    if (cityLower.includes('cape coast')) return 'Central';
    if (cityLower.includes('winneba')) return 'Central';
    if (cityLower.includes('tarkwa')) return 'Western';
    if (cityLower.includes('tamale') || cityLower.includes('nyankpala')) return 'Northern';
    if (cityLower.includes('sunyani') || cityLower.includes('fiapre')) return 'Bono';
    if (cityLower.includes('berekuso')) return 'Eastern';
    if (cityLower.includes('miotso')) return 'Greater Accra';
    return 'Unknown';
  };

  // Helper function to determine type from name
  const getTypeFromName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('university of ghana') || 
        nameLower.includes('knust') || 
        nameLower.includes('university of cape coast') ||
        nameLower.includes('university of education') ||
        nameLower.includes('university of mines') ||
        nameLower.includes('university for development') ||
        nameLower.includes('university of energy')) {
      return 'Public';
    }
    return 'Private';
  };

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inst.abbreviation && inst.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (inst.city && inst.city.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || (inst.status || "active") === statusFilter;
    const matchesRegion = regionFilter === "all" || inst.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const paginatedInstitutions = filteredInstitutions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, regionFilter]);

  const uniqueRegions = Array.from(new Set(institutions.map(inst => inst.region).filter(Boolean))).sort();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <Clock size={48} style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
          <p>Loading institutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div id="aljg-filters" style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <button
          onClick={onAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={18} />
          Add New Institution
        </button>
        <div id="aljg-search-wrapper" style={{ position: "relative", flex: 1, minWidth: "280px" }}>
          <Search id="aljg-search-icon" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", width: "18px", height: "18px", pointerEvents: "none" }} />
          <input
            id="aljg-search-input"
            type="text"
            placeholder="Search institutions by name, abbreviation, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.625rem 1rem 0.625rem 2.75rem", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.875rem", background: "#f9fafb", transition: "all 0.2s" }}
          />
        </div>

        <select
          className="aljg-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "0.625rem 2.5rem 0.625rem 1rem", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.875rem", background: "#f9fafb", color: "#374151", cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", transition: "all 0.2s" }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="aljg-filter-select"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{ padding: "0.625rem 2.5rem 0.625rem 1rem", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.875rem", background: "#f9fafb", color: "#374151", cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", transition: "all 0.2s" }}
        >
          <option value="all">All Regions</option>
          {uniqueRegions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div id="aljg-table-container" style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}>
        <table id="aljg-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Institution</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Region</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Type</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Status</th>
              <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInstitutions.map(inst => (
              <tr key={inst.id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div className="aljg-gig-cell" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <p className="aljg-gig-title" style={{ fontWeight: 600, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      {inst.name}
                      {inst.abbreviation && (
                        <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 400 }}>({inst.abbreviation})</span>
                      )}
                    </p>
                    {inst.city && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#6b7280" }}>
                        <MapPin style={{ width: "12px", height: "12px" }} />
                        {inst.city}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    <MapPin style={{ width: "14px", height: "14px" }} />
                    {inst.region || "N/A"}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    <Building2 style={{ width: "14px", height: "14px" }} />
                    {inst.type || "N/A"}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <span className={`aljg-status-badge ${inst.status || "active"}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", background: inst.status === "active" ? "#dcfce7" : inst.status === "pending" ? "#fef3c7" : "#fee2e2", color: inst.status === "active" ? "#16a34a" : inst.status === "pending" ? "#d97706" : "#dc2626" }}>
                    {inst.status === "active" ? (
                      <CheckCircle2 style={{ width: "12px", height: "12px" }} />
                    ) : inst.status === "pending" ? (
                      <Clock style={{ width: "12px", height: "12px" }} />
                    ) : (
                      <XCircle style={{ width: "12px", height: "12px" }} />
                    )}
                    {inst.status || "active"}
                  </span>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#374151", verticalAlign: "middle" }}>
                  <div className="aljg-actions" style={{ display: "flex", gap: "0.375rem" }}>
                    <button className="aljg-action-btn edit" title="Edit Institution" onClick={() => onEdit(inst)} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", padding: 0 }}>
                      <Edit2 style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                    </button>
                    <button className="aljg-action-btn delete" title="Delete Institution" onClick={() => onDelete(inst)} style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", padding: 0 }}>
                      <Trash2 style={{ width: "16px", height: "16px", color: "#6b7280" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInstitutions.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
          <GraduationCap style={{ width: "48px", height: "48px", margin: "0 auto 1rem" }} />
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No institutions found</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "1.5rem",
          padding: "1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: currentPage === 1 ? "#f9fafb" : "white",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s",
              opacity: currentPage === 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderColor = "#d1d5db";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }
            }}
          >
            Previous
          </button>

          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: "0.5rem 0.75rem",
                  color: "#6b7280",
                  fontSize: "0.875rem"
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page as number)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: currentPage === page ? "#3b82f6" : "white",
                  color: currentPage === page ? "white" : "#374151",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: currentPage === page ? 600 : 500,
                  transition: "all 0.2s",
                  minWidth: "40px"
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }
                }}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: currentPage === totalPages ? "#f9fafb" : "white",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s",
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderColor = "#d1d5db";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {filteredInstitutions.length > 0 && (
        <div style={{
          textAlign: "center",
          marginTop: "1rem",
          fontSize: "0.875rem",
          color: "#6b7280"
        }}>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInstitutions.length)} of {filteredInstitutions.length} institutions
        </div>
      )}
    </div>
  );
};

export default AllInstitutionsManager;
