import React, { useState, useMemo, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface University {
  id: string;
  name: string;
  region: string;
  type: string;
  tuitionFee: string;
  admissionCutOff: string;
  programs: string;
  logo?: string;
  description: string;
  campus?: string[];
  studentPopulation?: string;
  yearEstablished?: string;
  website?: string;
  abbreviation?: string;
}

// Helper function to transform Supabase data (snake_case) to app format (camelCase)
const transformFromSupabase = (data: any): University => {
  return {
    id: data.id,
    name: data.name,
    abbreviation: data.abbreviation,
    region: data.region,
    type: data.type,
    logo: data.logo,
    description: data.description,
    website: data.website,
    campus: data.campus || [],
    studentPopulation: data.student_population,
    yearEstablished: data.year_established,
    tuitionFee: data.tuition_fee,
    admissionCutOff: data.admission_cut_off,
    programs: data.programs,
  };
};

const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const transformedData = (data || []).map(transformFromSupabase);
      setUniversities(transformedData);
    } catch (error: any) {
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered universities based on search and filters
  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCampus = !selectedCampus || uni.campus?.includes(selectedCampus);
      const matchesRegion = !selectedRegion || uni.region === selectedRegion;
      const matchesType = !selectedType || uni.type === selectedType;
      return matchesSearch && matchesCampus && matchesRegion && matchesType;
    });
  }, [universities, searchQuery, selectedCampus, selectedRegion, selectedType]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCampus, selectedRegion, selectedType]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const uniqueRegions = Array.from(new Set(universities.map(u => u.region))).sort();
  const uniqueTypes = Array.from(new Set(universities.map(u => u.type))).sort();
  const allCampuses = Array.from(new Set(universities.flatMap(u => u.campus || []))).sort();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isolatedStyles = `
    .universities-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .universities-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .universities-main-content {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .universities-breadcrumbs {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-breadcrumbs a {
      color: #006B3F;
      text-decoration: none;
    }

    .universities-breadcrumbs a:hover {
      text-decoration: underline;
    }

    .universities-header {
      margin-bottom: 2rem;
    }

    .universities-title {
      font-size: 3rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-subtitle {
      font-size: 1.25rem;
      color: hsl(220 20% 40%);
      margin: 0 0 2rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .universities-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: center;
    }

    .universities-search-wrapper {
      position: relative;
      flex: 1;
      min-width: 250px;
    }

    .universities-search-input {
      width: 100%;
      padding: 0.875rem 1.25rem;
      padding-left: 3rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      font-size: 1rem;
      color: hsl(220 30% 15%);
      background: white;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-search-input:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .universities-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(220 20% 40%);
      width: 20px;
      height: 20px;
    }

    .universities-filter-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .universities-filter-select {
      padding: 0.875rem 1.25rem;
      padding-right: 2.5rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      font-size: 0.95rem;
      color: hsl(220 30% 15%);
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
    }

    .universities-filter-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .universities-filters-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.25rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      background: white;
      color: hsl(220 30% 15%);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-size: 0.95rem;
    }

    .universities-filters-button:hover {
      border-color: hsl(220 20% 40%);
      background: hsl(40 20% 90%);
    }

    .universities-table {
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .universities-table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.3fr 1.3fr 1.2fr;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: hsl(40 20% 94%);
      border-bottom: 1px solid hsl(40 20% 88%);
      font-weight: 600;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.3fr 1.3fr 1.2fr;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid hsl(40 20% 88%);
      cursor: pointer;
      transition: all 0.2s ease;
      align-items: center;
    }

    .university-row:hover {
      background: hsl(40 20% 98%);
    }

    .university-row:last-child {
      border-bottom: none;
    }

    .university-name {
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-size: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-region,
    .university-type,
    .university-tuition,
    .university-cutoff,
    .university-programs {
      color: hsl(220 20% 40%);
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-gtec-notice {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.75rem 1.25rem;
      background: hsl(40 20% 94%);
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      font-size: 0.9rem;
      color: hsl(220 30% 15%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-gtec-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: hsl(220 20% 40%);
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
      flex-shrink: 0;
    }


    .university-expanded-content {
      grid-column: 1 / -1;
      padding: 0;
      background: hsl(40 20% 98%);
      border-top: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .university-expanded-content-inner-wrapper {
      padding: 2rem 1.5rem;
    }

    .university-expanded-inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 2rem;
      align-items: start;
    }

    .university-logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 2px solid hsl(40 20% 88%);
      overflow: hidden;
      padding: 0.5rem;
    }

    .university-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .university-logo-placeholder {
      font-size: 0.75rem;
      color: hsl(220 20% 40%);
      text-align: center;
      padding: 0.5rem;
      font-weight: 600;
    }

    .university-description {
      color: hsl(220 20% 40%);
      line-height: 1.7;
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-grant-aid-display {
      text-align: right;
    }

    .university-grant-aid-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-grant-aid-value {
      font-size: 2rem;
      font-weight: 700;
      color: #60a5fa;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-profile-wrapper {
      margin-top: 1.5rem;
      display: flex;
      align-items: center;
    }

    .university-view-profile-link {
      position: relative;
      display: inline-block;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(220 30% 15%);
      transition: color 0.3s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-profile-link:hover {
      color: hsl(220 20% 40%);
    }

    .university-view-profile-link-inner {
      position: relative;
      display: inline-block;
      padding-bottom: 0.25rem;
    }

    .university-view-profile-link-underline {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: calc(100% + 14px);
      background: #60a5fa;
      transition: background 0.3s ease;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
    }

    .university-view-profile-link:hover .university-view-profile-link-underline {
      background: #3b82f6;
    }

    .universities-pagination-wrapper {
      margin-top: 2rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1.5rem;
    }

    .universities-pagination-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      justify-self: flex-start;
    }

    .universities-pagination-info strong {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .universities-pagination-items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      justify-self: flex-end;
    }

    .universities-pagination-items-per-page label {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-items-per-page-select {
      padding: 0.4rem 0.6rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.4rem center;
      padding-right: 1.75rem;
    }

    .universities-items-per-page-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .universities-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
      justify-self: center;
    }

    .universities-pagination-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      background: white;
      color: hsl(220 30% 15%);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      flex-shrink: 0;
    }

    .universities-pagination-button:hover:not(:disabled) {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      color: hsl(220 30% 15%);
      transform: translateY(-1px);
    }

    .universities-pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: hsl(40 20% 96%);
    }

    .universities-pagination-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .universities-pagination-numbers {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
    }

    .universities-pagination-number {
      min-width: 2.25rem;
      height: 2.25rem;
      padding: 0 0.5rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      background: white;
      color: hsl(220 30% 15%);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .universities-pagination-number:hover {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      transform: translateY(-1px);
    }

    .universities-pagination-number.active {
      background: hsl(220 30% 15%);
      border-color: hsl(220 30% 15%);
      color: white;
      font-weight: 600;
    }

    .universities-pagination-number.active:hover {
      background: hsl(220 30% 20%);
      border-color: hsl(220 30% 20%);
      transform: translateY(-1px);
    }

    .universities-pagination-ellipsis {
      padding: 0 0.25rem;
      color: hsl(220 20% 40%);
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      user-select: none;
      flex-shrink: 0;
    }

    @media (max-width: 1200px) {
      .universities-table-header,
      .university-row {
        grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1fr;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .universities-content-wrapper {
        padding-top: 60px;
      }

      .universities-main-content {
        padding: 1rem;
      }

      .universities-title {
        font-size: 2rem;
      }

      .universities-subtitle {
        font-size: 1.125rem;
      }

      .universities-table-header {
        display: none;
      }

      .university-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.5rem 1rem;
      }

      .university-expanded-content-inner-wrapper {
        padding: 1.5rem 1rem;
      }

      .university-expanded-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .university-grant-aid-display {
        text-align: left;
      }

      .universities-pagination-wrapper {
        padding: 0.75rem 1rem;
        grid-template-columns: 1fr;
        gap: 1rem;
        align-items: stretch;
      }

      .universities-pagination-info {
        justify-content: center;
        font-size: 0.8rem;
        flex-wrap: wrap;
        justify-self: center;
      }

      .universities-pagination-items-per-page {
        gap: 0.4rem;
        justify-self: center;
      }

      .universities-pagination {
        gap: 0.25rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .universities-pagination-button {
        width: 2rem;
        height: 2rem;
      }

      .universities-pagination-number {
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.4rem;
        font-size: 0.8rem;
      }

      .universities-pagination-numbers {
        gap: 0.25rem;
        flex-wrap: wrap;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .universities-content-wrapper {
        padding-top: 70px;
      }

      .universities-main-content {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .universities-content-wrapper {
        padding-top: 120px;
      }

      .universities-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .universities-content-wrapper {
        padding-top: 120px;
      }

      .universities-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }

    @media (max-width: 480px) {
      .universities-pagination-wrapper {
        padding: 0.625rem 0.75rem;
      }

      .universities-pagination-info {
        font-size: 0.75rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .universities-pagination-items-per-page {
        width: 100%;
        justify-content: space-between;
      }

      .universities-pagination-button {
        width: 1.875rem;
        height: 1.875rem;
      }

      .universities-pagination-button svg {
        width: 14px;
        height: 14px;
      }

      .universities-pagination-number {
        min-width: 1.875rem;
        height: 1.875rem;
        padding: 0 0.35rem;
        font-size: 0.75rem;
      }

      .universities-pagination-numbers {
        gap: 0.2rem;
      }

      .universities-pagination-ellipsis {
        padding: 0 0.2rem;
        font-size: 0.75rem;
      }
    }
  `;

  if (loading) {
    return (
      <div className="universities-page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading universities...</div>
      </div>
    );
  }

  return (
    <div className="universities-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="universities-content-wrapper">
        <div className="universities-main-content">
          <div className="universities-breadcrumbs">
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>
          <div className="universities-header">
            <h1 className="universities-title">Universities in Ghana</h1>
            <p className="universities-subtitle">
              Explore universities across Ghana. Find detailed information about programs, 
              financial aid, and more to help you make informed decisions about your education.
            </p>
            <div className="universities-gtec-notice">
              <span className="universities-gtec-icon">✓</span>
              <span>All universities listed are accredited by the Ghana Tertiary Education Commission (GTEC)</span>
            </div>
          </div>

          <div className="universities-controls">
            <div className="universities-search-wrapper">
              <Search className="universities-search-icon" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="universities-search-input"
              />
            </div>

            <div className="universities-filter-group">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="universities-filter-select"
              >
                <option value="">Select Campus</option>
                {allCampuses.map(campus => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="universities-filter-select"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="universities-filter-select"
              >
                <option value="">Select Type</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="universities-table">
            <div className="universities-table-header">
              <div>Name</div>
              <div>Region</div>
              <div>Type</div>
              <div>Tuition Fee</div>
              <div>Admission Cut-off</div>
              <div>Programs</div>
            </div>

            {paginatedUniversities.map((university) => (
              <React.Fragment key={university.id}>
                <div
                  className={`university-row ${expandedId === university.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(university.id)}
                >
                  <div className="university-name">
                    {university.name}
                  </div>
                  <div className="university-region">{university.region}</div>
                  <div className="university-type">{university.type}</div>
                  <div className="university-tuition">{university.tuitionFee}</div>
                  <div className="university-cutoff">{university.admissionCutOff}</div>
                  <div className="university-programs">{university.programs}</div>
                </div>

                <AnimatePresence>
                  {expandedId === university.id && (
                    <motion.div
                      className="university-expanded-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.4, 0, 0.2, 1],
                        opacity: { duration: 0.25, delay: 0.05 }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                        <div className="university-expanded-content-inner-wrapper">
                          <div className="university-expanded-inner">
                            <div className="university-logo">
                              {university.logo ? (
                                <img src={university.logo} alt={`${university.name} logo`} />
                              ) : (
                                <div className="university-logo-placeholder">
                                  {university.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                                </div>
                              )}
                            </div>

                          <div>
                            <p className="university-description">
                              {university.description.length > 150 
                                ? `${university.description.substring(0, 150)}...` 
                                : university.description}
                            </p>
                            <div className="university-view-profile-wrapper">
                              <Link 
                                to={`/directories/universities/${university.id}`} 
                                className="university-view-profile-link"
                              >
                                <motion.span
                                  className="university-view-profile-link-inner"
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  Read More
                                  <span className="university-view-profile-link-underline" />
                                </motion.span>
                            </Link>
                            </div>
                          </div>

                          <div className="university-grant-aid-display">
                            <div className="university-grant-aid-label">Tuition Fee</div>
                            <div className="university-grant-aid-value">
                              {university.tuitionFee}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>

          {filteredUniversities.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: 'hsl(220 20% 40%)'
            }}>
              <p>No universities found matching your search criteria.</p>
            </div>
          )}

          {filteredUniversities.length > 0 && (
            <div className="universities-pagination-wrapper">
              <div className="universities-pagination-info">
                <span>
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredUniversities.length)}</strong> of <strong>{filteredUniversities.length}</strong> universities
                </span>
              </div>

              <div className="universities-pagination">
                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="universities-pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="universities-pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`universities-pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page as number)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>

              <div className="universities-pagination-items-per-page">
                <label htmlFor="items-per-page">Show:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="universities-items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Universities;

