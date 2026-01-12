import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Search, ChevronDown, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const isolatedStyles = `
  #swb-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    min-height: 100vh;
  }

  #swb-content-wrapper {
    min-height: calc(100vh - 80px);
  }

  #swb-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    #swb-container {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
    }
  }

  /* Header Section */
  #swb-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (min-width: 1024px) {
    #swb-header {
      grid-column: 1 / -1;
      margin-bottom: 0;
    }
  }

  #swb-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.75rem 0;
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    #swb-title {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 1024px) {
    #swb-title {
      font-size: 3rem;
    }
  }

  #swb-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }

  @media (min-width: 640px) {
    #swb-subtitle {
      font-size: 1.125rem;
    }
  }

  #swb-cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  @media (min-width: 640px) {
    #swb-cta-buttons {
      flex-direction: row;
      align-items: center;
    }
  }

  .swb-btn-primary {
    background-color: #2563eb;
    color: #ffffff;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }

  .swb-btn-primary:hover {
    background-color: #1d4ed8;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .swb-btn-secondary {
    color: #2563eb;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swb-btn-secondary:hover {
    color: #1d4ed8;
  }

  /* Mobile Dropdown */
  #swb-mobile-dropdown {
    display: block;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 1024px) {
    #swb-mobile-dropdown {
      display: none;
    }
  }

  #swb-dropdown-label {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.75rem 0;
    font-family: 'Playfair Display', serif;
  }

  #swb-dropdown-button {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: #ffffff;
    font-size: 1rem;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  #swb-dropdown-button:hover {
    border-color: #2563eb;
  }

  #swb-dropdown-button:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  #swb-dropdown-chevron {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: transform 0.2s;
  }

  #swb-dropdown-button.open #swb-dropdown-chevron {
    transform: rotate(180deg);
  }

  /* Bottom Sheet Modal */
  #swb-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  #swb-modal-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  #swb-modal-content {
    background-color: #ffffff;
    width: 100%;
    max-height: 60vh;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  #swb-modal-overlay.open #swb-modal-content {
    transform: translateY(0);
  }

  #swb-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  #swb-modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    font-family: 'Playfair Display', serif;
  }

  #swb-modal-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #374151;
    transition: color 0.2s;
  }

  #swb-modal-close:hover {
    color: #111827;
  }

  #swb-modal-close-icon {
    width: 24px;
    height: 24px;
  }

  #swb-modal-list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: visible;
    flex: 1;
  }

  #swb-modal-list::-webkit-scrollbar {
    width: 6px;
  }

  #swb-modal-list::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  #swb-modal-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  #swb-modal-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .swb-modal-item {
    padding: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }

  .swb-modal-item:hover {
    background-color: #f9fafb;
  }

  .swb-modal-item-label {
    font-size: 1rem;
    color: #374151;
    flex: 1;
  }

  .swb-modal-item.selected .swb-modal-item-label {
    color: #111827;
    font-weight: 600;
  }

  .swb-modal-check {
    width: 20px;
    height: 20px;
    color: #2563eb;
    flex-shrink: 0;
  }

  .swb-modal-item:not(.selected) .swb-modal-check {
    display: none;
  }

  /* Left Sidebar */
  #swb-sidebar {
    margin-bottom: 2rem;
    display: none;
  }

  @media (min-width: 1024px) {
    #swb-sidebar {
      display: block;
      margin-bottom: 0;
    }
  }

  #swb-breadcrumb {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  #swb-breadcrumb a {
    color: #2563eb;
    text-decoration: none;
  }

  #swb-breadcrumb a:hover {
    text-decoration: underline;
  }

  #swb-filter-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    font-family: 'Playfair Display', serif;
  }

  #swb-filter-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .swb-filter-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    cursor: pointer;
    transition: color 0.2s;
  }

  .swb-filter-item:hover {
    color: #2563eb;
  }

  .swb-radio {
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s;
  }

  .swb-radio.selected {
    border-color: #2563eb;
  }

  .swb-radio.selected::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: #2563eb;
    border-radius: 50%;
  }

  .swb-filter-label {
    font-size: 0.9375rem;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .swb-filter-item:hover .swb-filter-label {
    color: #2563eb;
  }

  .swb-filter-item.selected .swb-filter-label {
    color: #2563eb;
    font-weight: 600;
  }

  /* Sidebar Image */
  #swb-sidebar-image {
    display: none;
    margin-top: 2rem;
    width: 100%;
    border-radius: 0.75rem;
    overflow: hidden;
    padding: 0.5rem;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }

  @media (min-width: 1024px) {
    #swb-sidebar-image {
      display: block;
    }
  }

  #swb-sidebar-image img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    border-radius: 0.5rem;
    transform: scale(1.05);
    animation: slowBounce 3s ease-in-out infinite;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  #swb-sidebar-image:hover img {
    transform: scale(1.08);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2);
  }

  @keyframes slowBounce {
    0%, 100% {
      transform: scale(1.05) translateY(0);
    }
    50% {
      transform: scale(1.05) translateY(-8px);
    }
  }

  /* Right Content Area */
  #swb-content {
    flex: 1;
  }

  #swb-explore-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
  }

  @media (min-width: 640px) {
    #swb-explore-title {
      font-size: 1.75rem;
    }
  }

  #swb-search-container {
    position: relative;
    margin-bottom: 2rem;
  }

  #swb-search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  #swb-search-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  #swb-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 20px;
    height: 20px;
  }

  #swb-categories-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .swb-category-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .swb-category-letter {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .swb-category-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .swb-category-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .swb-category-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .swb-category-item {
    padding: 0.75rem 1rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    text-decoration: none;
    color: #374151;
    font-size: 0.9375rem;
    transition: all 0.2s;
    display: block;
  }

  .swb-category-item:hover {
    border-color: #2563eb;
    background-color: #eff6ff;
    color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }

  /* Mobile: 0px - 767px */
  @media (max-width: 767px) {
    #swb-content-wrapper {
      padding-top: 60px;
    }

    #swb-container {
      padding: 1rem;
    }
  }

  /* Tablet: 768px - 1199px */
  @media (min-width: 768px) and (max-width: 1199px) {
    #swb-content-wrapper {
      padding-top: 70px;
    }

    #swb-container {
      padding: 1.5rem;
    }
  }

  /* Desktop: 1200px - 1599px */
  @media (min-width: 1200px) and (max-width: 1599px) {
    #swb-content-wrapper {
      padding-top: 120px;
    }

    #swb-container {
      padding: 2rem;
    }
  }

  /* Large Desktop: 1600px+ */
  @media (min-width: 1600px) {
    #swb-content-wrapper {
      padding-top: 120px;
    }

    #swb-container {
      padding: 2rem clamp(2rem, 5vw, 4rem);
    }
  }
`;

// Comprehensive skilled worker categories organized by type
// Work types and categories are now loaded from Supabase

// Group categories by first letter
const groupByLetter = (categories: Array<{ name: string; category: string }>) => {
  const grouped: Record<string, Array<{ name: string; category: string }>> = {};
  
  categories.forEach(category => {
    const firstLetter = category.name[0].toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(category);
  });
  
  return grouped;
};

const SkilledWorkersBrowse = () => {
  const navigate = useNavigate();
  const [selectedWorkType, setSelectedWorkType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Data states
  const [workTypes, setWorkTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load work types
      const { data: workTypesData, error: workTypesError } = await supabase
        .from('work_types' as any)
        .select('*')
        .order('display_order', { ascending: true });

      if (workTypesError) throw workTypesError;

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('worker_categories' as any)
        .select('*')
        .order('name', { ascending: true });

      if (categoriesError) throw categoriesError;

      setWorkTypes(workTypesData || []);
      setCategories(categoriesData?.map((cat: any) => ({
        name: cat.name,
        category: cat.type_of_work
      })) || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      // Fallback to empty arrays
      setWorkTypes([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on work type and search query
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by work type
    if (selectedWorkType !== 'all') {
      filtered = filtered.filter(cat => cat.category === selectedWorkType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [categories, selectedWorkType, searchQuery]);

  // Group filtered categories by letter
  const groupedCategories = useMemo(() => {
    return groupByLetter(filteredCategories);
  }, [filteredCategories]);

  // Sort letters
  const sortedLetters = useMemo(() => {
    return Object.keys(groupedCategories).sort();
  }, [groupedCategories]);

  // Get selected work type label
  const selectedWorkTypeLabel = useMemo(() => {
    const type = workTypes.find(t => t.id === selectedWorkType);
    return type?.label || 'Any type of work';
  }, [selectedWorkType, workTypes]);

  // Handle work type selection
  const handleWorkTypeSelect = (typeId: string) => {
    setSelectedWorkType(typeId);
    setIsModalOpen(false);
  };

  // Close modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div id="swb-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />

      <div id="swb-content-wrapper">
        <div id="swb-container">
        {/* Header */}
        <div id="swb-header">
          <h1 id="swb-title">Find the best skilled workers</h1>
          <p id="swb-subtitle">
            Browse skilled workers and artisans, or jump right in and create a free profile to find the work that you love to do.
          </p>
          <div id="swb-cta-buttons">
            <Link to="/skilled-workers/join" className="swb-btn-primary">
              Find work
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div id="swb-mobile-dropdown">
          <h2 id="swb-dropdown-label">Type of work</h2>
          <button
            id="swb-dropdown-button"
            className={isModalOpen ? 'open' : ''}
            onClick={() => setIsModalOpen(true)}
          >
            <span>{selectedWorkTypeLabel}</span>
            <ChevronDown id="swb-dropdown-chevron" />
          </button>
        </div>

        {/* Left Sidebar */}
        <div id="swb-sidebar">
          <div id="swb-breadcrumb">
            <Link to="/skilled-workers">Find skilled workers</Link> /
          </div>
          <h2 id="swb-filter-title">Type of work</h2>
          <ul id="swb-filter-list">
            {workTypes.map((type) => (
              <li
                key={type.id}
                className={`swb-filter-item ${selectedWorkType === type.id ? 'selected' : ''}`}
                onClick={() => setSelectedWorkType(type.id)}
              >
                <div className={`swb-radio ${selectedWorkType === type.id ? 'selected' : ''}`}></div>
                <span className="swb-filter-label">{type.label}</span>
              </li>
            ))}
          </ul>
          <div id="swb-sidebar-image">
            <img 
              src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944090/gettyimages-1341637248_qax46l.jpg" 
              alt="Skilled workers" 
            />
          </div>
        </div>

        {/* Right Content Area */}
        <div id="swb-content">
          <h2 id="swb-explore-title">Explore skilled workers</h2>
          
          {/* Search Bar */}
          <div id="swb-search-container">
            <Search id="swb-search-icon" />
            <input
              id="swb-search-input"
              type="text"
              placeholder="Try skills like 'Electrician' or 'Carpenter'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories by Letter */}
          {sortedLetters.length > 0 ? (
            <div id="swb-categories-container">
              {sortedLetters.map((letter) => (
                <div key={letter} className="swb-category-group">
                  <h3 className="swb-category-letter">{letter}</h3>
                  <div className="swb-category-grid">
                    {groupedCategories[letter].map((category, index) => {
                      // Convert category name to URL-friendly slug
                      const slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      return (
                        <Link
                          key={`${letter}-${index}`}
                          to={`/skilled-workers/category/${slug}`}
                          className="swb-category-item"
                        >
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#6b7280' }}>
              <p>No skilled workers found matching your search.</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      <div
        id="swb-modal-overlay"
        className={isModalOpen ? 'open' : ''}
        onClick={handleOverlayClick}
      >
        <div id="swb-modal-content">
          <div id="swb-modal-header">
            <h3 id="swb-modal-title">Type of work</h3>
            <button
              id="swb-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X id="swb-modal-close-icon" />
            </button>
          </div>
          <ul id="swb-modal-list">
            {workTypes.map((type) => (
              <li
                key={type.id}
                className={`swb-modal-item ${selectedWorkType === type.id ? 'selected' : ''}`}
                onClick={() => handleWorkTypeSelect(type.id)}
              >
                <span className="swb-modal-item-label">{type.label}</span>
                <Check className="swb-modal-check" />
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SkilledWorkersBrowse;

