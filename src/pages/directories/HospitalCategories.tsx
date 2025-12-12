import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Search, ChevronDown, X, Check } from "lucide-react";

const isolatedStyles = `
  #hc-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    min-height: 100vh;
  }

  #hc-content-wrapper {
    min-height: calc(100vh - 80px);
  }

  #hc-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    #hc-container {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
    }
  }

  /* Header Section */
  #hc-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (min-width: 1024px) {
    #hc-header {
      grid-column: 1 / -1;
      margin-bottom: 0;
    }
  }

  #hc-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.75rem 0;
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    #hc-title {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 1024px) {
    #hc-title {
      font-size: 3rem;
    }
  }

  #hc-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }

  @media (min-width: 640px) {
    #hc-subtitle {
      font-size: 1.125rem;
    }
  }

  /* Mobile Dropdown */
  #hc-mobile-dropdown {
    display: block;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 1024px) {
    #hc-mobile-dropdown {
      display: none;
    }
  }

  #hc-dropdown-label {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.75rem 0;
    font-family: 'Playfair Display', serif;
  }

  #hc-dropdown-button {
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

  #hc-dropdown-button:hover {
    border-color: #0891b2;
  }

  #hc-dropdown-button:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }

  #hc-dropdown-chevron {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: transform 0.2s;
  }

  #hc-dropdown-button.open #hc-dropdown-chevron {
    transform: rotate(180deg);
  }

  /* Bottom Sheet Modal */
  #hc-modal-overlay {
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

  #hc-modal-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  #hc-modal-content {
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

  #hc-modal-overlay.open #hc-modal-content {
    transform: translateY(0);
  }

  #hc-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  #hc-modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    font-family: 'Playfair Display', serif;
  }

  #hc-modal-close {
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

  #hc-modal-close:hover {
    color: #111827;
  }

  #hc-modal-close-icon {
    width: 24px;
    height: 24px;
  }

  #hc-modal-list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex: 1;
  }

  #hc-modal-list::-webkit-scrollbar {
    width: 6px;
  }

  #hc-modal-list::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  #hc-modal-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  #hc-modal-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .hc-modal-item {
    padding: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }

  .hc-modal-item:hover {
    background-color: #f9fafb;
  }

  .hc-modal-item-label {
    font-size: 1rem;
    color: #374151;
    flex: 1;
  }

  .hc-modal-item.selected .hc-modal-item-label {
    color: #111827;
    font-weight: 600;
  }

  .hc-modal-check {
    width: 20px;
    height: 20px;
    color: #0891b2;
    flex-shrink: 0;
  }

  .hc-modal-item:not(.selected) .hc-modal-check {
    display: none;
  }

  /* Left Sidebar */
  #hc-sidebar {
    margin-bottom: 2rem;
    display: none;
  }

  @media (min-width: 1024px) {
    #hc-sidebar {
      display: flex;
      flex-direction: column;
      margin-bottom: 0;
      padding: 1.5rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      align-self: flex-start;
      height: fit-content;
    }
  }

  /* Tablet: 768px - 1199px */
  @media (min-width: 768px) and (max-width: 1199px) {
    #hc-sidebar {
      height: fit-content;
    }
  }

  /* Desktop: 1200px - 1599px */
  @media (min-width: 1200px) and (max-width: 1599px) {
    #hc-sidebar {
      height: fit-content;
    }
  }

  /* Large Desktop: 1600px+ */
  @media (min-width: 1600px) {
    #hc-sidebar {
      height: fit-content;
    }
  }

  #hc-breadcrumb {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  #hc-breadcrumb a {
    color: #0891b2;
    text-decoration: none;
  }

  #hc-breadcrumb a:hover {
    text-decoration: underline;
  }

  #hc-filter-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    font-family: 'Playfair Display', serif;
  }

  #hc-filter-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hc-filter-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    cursor: pointer;
    transition: color 0.2s;
  }

  .hc-filter-item:hover {
    color: #0891b2;
  }

  .hc-radio {
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s;
  }

  .hc-radio.selected {
    border-color: #0891b2;
  }

  .hc-radio.selected::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: #0891b2;
    border-radius: 50%;
  }

  .hc-filter-label {
    font-size: 0.9375rem;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .hc-filter-item:hover .hc-filter-label {
    color: #0891b2;
  }

  .hc-filter-item.selected .hc-filter-label {
    color: #0891b2;
    font-weight: 600;
  }


  /* Right Content Area */
  #hc-content {
    flex: 1;
  }

  #hc-explore-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
  }

  @media (min-width: 640px) {
    #hc-explore-title {
      font-size: 1.75rem;
    }
  }

  #hc-search-container {
    position: relative;
    margin-bottom: 2rem;
  }

  #hc-search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  #hc-search-input:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }

  #hc-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 20px;
    height: 20px;
  }

  #hc-categories-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .hc-category-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .hc-category-section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    font-family: 'Playfair Display', serif;
  }

  .hc-category-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  @media (min-width: 640px) {
    .hc-category-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
  }

  @media (min-width: 768px) {
    .hc-category-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
  }

  @media (min-width: 1024px) {
    .hc-category-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
    }
  }

  .hc-category-item {
    padding: 0.4rem 0.5rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    text-decoration: none;
    color: #374151;
    font-size: 0.75rem;
    transition: all 0.2s;
    display: block;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: 640px) {
    .hc-category-item {
      font-size: 0.8125rem;
      padding: 0.4rem 0.5rem;
      white-space: normal;
    }
  }

  @media (min-width: 1024px) {
    .hc-category-item {
      font-size: 0.8125rem;
      padding: 0.4rem 0.5rem;
    }
  }

  .hc-category-item:hover {
    border-color: #0891b2;
    background-color: #e0f8fe;
    color: #0891b2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.1);
  }

  .hc-alphabet-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .hc-alphabet-item {
    padding: 0.5rem 0.75rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    text-decoration: none;
    color: #2563eb;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-block;
  }

  .hc-alphabet-item:hover {
    border-color: #0891b2;
    background-color: #e0f8fe;
    color: #0891b2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.1);
  }

  /* Mobile: 0px - 767px */
  @media (max-width: 767px) {
    #hc-content-wrapper {
      padding-top: 60px;
    }

    #hc-container {
      padding: 1rem;
    }
  }

  /* Tablet: 768px - 1199px */
  @media (min-width: 768px) and (max-width: 1199px) {
    #hc-content-wrapper {
      padding-top: 70px;
    }

    #hc-container {
      padding: 1.5rem;
    }
  }

  /* Desktop: 1200px - 1599px */
  @media (min-width: 1200px) and (max-width: 1599px) {
    #hc-content-wrapper {
      padding-top: 120px;
    }

    #hc-container {
      padding: 2rem;
    }
  }

  /* Large Desktop: 1600px+ */
  @media (min-width: 1600px) {
    #hc-content-wrapper {
      padding-top: 120px;
    }

    #hc-container {
      padding: 2rem clamp(2rem, 5vw, 4rem);
    }
  }
`;

// Category types
const CATEGORY_TYPES = [
  { id: 'all', label: 'All Categories' },
  { id: 'facility-type', label: 'Facility Type' },
  { id: 'services', label: 'Services' },
  { id: 'specialist', label: 'Specialist Fields' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'insurance', label: 'Health Insurance' },
];

// Data from the image
const FACILITY_TYPES = [
  { name: 'Hospital', count: 2536 },
  { name: 'Pharmacy', count: 547 },
  { name: 'Diagnostic Centre', count: 25 },
  { name: 'Laboratory', count: 103 },
  { name: 'Ultrasound Scan', count: 17 },
  { name: 'Dental', count: 17 },
  { name: 'Eye Clinic', count: 33 },
  { name: 'Maternity Home', count: 217 },
];

const SERVICES = [
  { name: 'General', count: 2627 },
  { name: 'Pharmacy', count: 626 },
  { name: 'Surgery', count: 58 },
  { name: 'Ultra Sound Scan', count: 115 },
  { name: 'Laboratory', count: 195 },
  { name: 'Dental', count: 38 },
  { name: 'ECG Services', count: 58 },
  { name: 'Eye Services', count: 68 },
  { name: 'Skin', count: 0 },
  { name: 'Antenatal Clinic', count: 280 },
  { name: 'Pediatrics', count: 69 },
  { name: 'ENT Services', count: 0 },
];

const SPECIALIST_FIELDS = [
  { name: 'Gynecologist', count: 75 },
  { name: 'Pediatrics', count: 45 },
  { name: 'Surgeon', count: 41 },
  { name: 'Dentist', count: 26 },
  { name: 'Urologist', count: 24 },
  { name: 'Eye Specialist', count: 44 },
  { name: 'Dermatologist', count: 13 },
  { name: 'Ent Specialist', count: 21 },
  { name: 'Physician', count: 58 },
];

const OWNERSHIP = [
  { name: 'Government', count: 1831 },
  { name: 'Mission (CHAG)', count: 204 },
  { name: 'Private', count: 1492 },
];

const HEALTH_INSURANCE = [
  { name: 'Medex', count: 18 },
  { name: 'Momentum', count: 33 },
  { name: 'Glico Health Plan', count: 43 },
  { name: 'Nationwide', count: 18 },
  { name: 'First Fidelity Health', count: 90 },
  { name: 'Premier Health Insurance', count: 66 },
];

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'ALL'];

// Helper function to group items by first letter
const groupByLetter = (items: { name: string; count: number }[]) => {
  const grouped: { [key: string]: { name: string; count: number }[] } = {};
  
  items.forEach(item => {
    const firstLetter = item.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(item);
  });
  
  return grouped;
};

const HospitalCategories = () => {
  const navigate = useNavigate();
  const [selectedCategoryType, setSelectedCategoryType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Get all items based on selected category type
  const getAllItems = () => {
    switch (selectedCategoryType) {
      case 'facility-type':
        return FACILITY_TYPES;
      case 'services':
        return SERVICES;
      case 'specialist':
        return SPECIALIST_FIELDS;
      case 'ownership':
        return OWNERSHIP;
      case 'insurance':
        return HEALTH_INSURANCE;
      default:
        return [...FACILITY_TYPES, ...SERVICES, ...SPECIALIST_FIELDS, ...OWNERSHIP, ...HEALTH_INSURANCE];
    }
  };

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    let items = getAllItems();

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }

    return items;
  }, [selectedCategoryType, searchQuery]);

  // Group filtered items by letter
  const groupedItems = useMemo(() => {
    return groupByLetter(filteredItems);
  }, [filteredItems]);

  // Sort letters
  const sortedLetters = useMemo(() => {
    return Object.keys(groupedItems).sort();
  }, [groupedItems]);

  // Get selected category type label
  const selectedCategoryTypeLabel = useMemo(() => {
    const type = CATEGORY_TYPES.find(t => t.id === selectedCategoryType);
    return type?.label || 'All Categories';
  }, [selectedCategoryType]);

  // Handle category type selection
  const handleCategoryTypeSelect = (typeId: string) => {
    setSelectedCategoryType(typeId);
    setIsModalOpen(false);
  };

  // Close modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (category: string, type: string) => {
    navigate(`/directories/hospitals?${type}=${encodeURIComponent(category)}`);
  };

  const handleAlphabetClick = (letter: string) => {
    navigate(`/directories/hospitals?letter=${letter}`);
  };

  return (
    <div id="hc-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />

      <div id="hc-content-wrapper">
        <div id="hc-container">
          {/* Header */}
          <div id="hc-header">
            <h1 id="hc-title">Hospital Categories</h1>
            <p id="hc-subtitle">
              Browse hospitals and healthcare facilities by category, or search for specific services and specialists.
            </p>
          </div>

          {/* Mobile Dropdown */}
          <div id="hc-mobile-dropdown">
            <h2 id="hc-dropdown-label">Category Type</h2>
            <button
              id="hc-dropdown-button"
              className={isModalOpen ? 'open' : ''}
              onClick={() => setIsModalOpen(true)}
            >
              <span>{selectedCategoryTypeLabel}</span>
              <ChevronDown id="hc-dropdown-chevron" />
            </button>
          </div>

          {/* Left Sidebar */}
          <div id="hc-sidebar">
            <div id="hc-breadcrumb">
              <Link to="/directories/hospitals">Hospitals</Link> /
            </div>
            <h2 id="hc-filter-title">Category Type</h2>
            <ul id="hc-filter-list">
              {CATEGORY_TYPES.map((type) => (
                <li
                  key={type.id}
                  className={`hc-filter-item ${selectedCategoryType === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategoryType(type.id)}
                >
                  <div className={`hc-radio ${selectedCategoryType === type.id ? 'selected' : ''}`}></div>
                  <span className="hc-filter-label">{type.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content Area */}
          <div id="hc-content">
            <h2 id="hc-explore-title">Explore hospital categories</h2>
            
            {/* Search Bar */}
            <div id="hc-search-container">
              <Search id="hc-search-icon" />
              <input
                id="hc-search-input"
                type="text"
                placeholder="Search categories like 'Hospital' or 'Pharmacy'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories by Letter */}
            {sortedLetters.length > 0 ? (
              <div id="hc-categories-container">
                {sortedLetters.map((letter) => (
                  <div key={letter} className="hc-category-section">
                    <h3 className="hc-category-section-title">{letter}</h3>
                    <div className="hc-category-grid">
                      {groupedItems[letter].map((item, index) => {
                        const type = selectedCategoryType === 'all' 
                          ? (FACILITY_TYPES.includes(item as any) ? 'facilityType' :
                             SERVICES.includes(item as any) ? 'service' :
                             SPECIALIST_FIELDS.includes(item as any) ? 'specialist' :
                             OWNERSHIP.includes(item as any) ? 'ownership' : 'insurance')
                          : selectedCategoryType.replace('-', '');
                        return (
                          <div
                            key={`${letter}-${index}`}
                            className="hc-category-item"
                            onClick={() => handleCategoryClick(item.name, type)}
                          >
                            {item.name} ({item.count})
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: '#6b7280' }}>
                <p>No categories found matching your search.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      <div
        id="hc-modal-overlay"
        className={isModalOpen ? 'open' : ''}
        onClick={handleOverlayClick}
      >
        <div id="hc-modal-content">
          <div id="hc-modal-header">
            <h2 id="hc-modal-title">Select Category Type</h2>
            <button
              id="hc-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X id="hc-modal-close-icon" />
            </button>
          </div>
          <ul id="hc-modal-list">
            {CATEGORY_TYPES.map((type) => (
              <li
                key={type.id}
                className={`hc-modal-item ${selectedCategoryType === type.id ? 'selected' : ''}`}
                onClick={() => handleCategoryTypeSelect(type.id)}
              >
                <span className="hc-modal-item-label">{type.label}</span>
                {selectedCategoryType === type.id && (
                  <Check className="hc-modal-check" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HospitalCategories;
