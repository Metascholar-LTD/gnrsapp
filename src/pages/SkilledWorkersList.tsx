import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { SkilledWorkerPanel } from "@/components/SkilledWorkerPanel";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  CheckCircle,
  Search,
  Filter,
  Grid,
  List as ListIcon
} from "lucide-react";
import { motion } from "framer-motion";

const isolatedStyles = `
  #swl-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: hsl(40 33% 96%);
    min-height: 100vh;
  }

  #swl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  @media (min-width: 1024px) {
    #swl-container {
      padding: 3rem 2rem;
    }
  }

  /* Header */
  #swl-header {
    margin-bottom: 2rem;
  }

  #swl-back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(220 15% 45%);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }

  #swl-back-button:hover {
    color: #2563eb;
  }

  #swl-back-icon {
    width: 18px;
    height: 18px;
  }

  #swl-title {
    font-size: 2rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0 0 0.5rem 0;
    font-family: 'Playfair Display', serif;
  }

  @media (min-width: 640px) {
    #swl-title {
      font-size: 2.5rem;
    }
  }

  #swl-subtitle {
    font-size: 1rem;
    color: hsl(220 15% 45%);
    margin: 0;
  }

  /* Filters */
  #swl-filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: hsl(0 0% 100%);
    border-radius: 0.75rem;
    border: 1px solid hsl(40 20% 88%);
    box-shadow: 0 4px 20px -4px hsl(220 30% 15% / 0.08);
  }

  @media (min-width: 640px) {
    #swl-filters {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  #swl-search-container {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  #swl-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: hsl(220 15% 45%);
  }

  #swl-search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid hsl(40 20% 88%);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background-color: hsl(40 33% 96%);
    color: hsl(220 30% 15%);
    transition: border-color 0.2s;
  }

  #swl-search-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  #swl-view-toggle {
    display: flex;
    gap: 0.5rem;
    background-color: hsl(40 33% 96%);
    padding: 0.25rem;
    border-radius: 0.5rem;
    border: 1px solid hsl(40 20% 88%);
  }

  .swl-view-button {
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 0.375rem;
    color: hsl(220 15% 45%);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swl-view-button.active {
    background-color: #2563eb;
    color: #ffffff;
  }

  .swl-view-icon {
    width: 18px;
    height: 18px;
  }

  /* Workers Grid */
  #swl-workers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    #swl-workers-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  .swl-worker-card {
    background-color: hsl(0 0% 100%);
    border-radius: 0.75rem;
    border: 1px solid hsl(40 20% 88%);
    padding: 1.5rem;
    transition: all 0.3s;
    text-decoration: none;
    color: inherit;
    display: block;
    box-shadow: 0 4px 20px -4px hsl(220 30% 15% / 0.08);
  }

  .swl-worker-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px -8px hsl(220 30% 15% / 0.12);
    border-color: #2563eb;
  }

  .swl-worker-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .swl-worker-avatar {
    width: 80px;
    height: 80px;
    border-radius: 0.75rem;
    object-fit: cover;
    border: 2px solid hsl(40 20% 88%);
    flex-shrink: 0;
  }

  .swl-worker-info {
    flex: 1;
    min-width: 0;
  }

  .swl-worker-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(220 30% 15%);
    margin: 0 0 0.25rem 0;
    font-family: 'Playfair Display', serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .swl-worker-title {
    font-size: 0.875rem;
    color: hsl(220 15% 45%);
    margin: 0 0 0.5rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .swl-worker-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swl-rating-stars {
    display: flex;
    gap: 0.125rem;
  }

  .swl-star {
    width: 16px;
    height: 16px;
    color: #fbbf24;
    fill: #fbbf24;
  }

  .swl-rating-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(220 30% 15%);
  }

  .swl-review-count {
    font-size: 0.75rem;
    color: hsl(220 15% 45%);
  }

  .swl-worker-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: hsl(220 15% 45%);
  }

  .swl-location-icon {
    width: 16px;
    height: 16px;
  }

  .swl-worker-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .swl-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background-color: hsl(40 20% 90%);
    color: hsl(220 30% 15%);
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .swl-badge-icon {
    width: 12px;
    height: 12px;
    color: #2563eb;
  }

  .swl-empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: hsl(220 15% 45%);
  }

  .swl-empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: hsl(220 30% 15%);
    margin: 0 0 0.5rem 0;
  }

  .swl-empty-text {
    font-size: 1rem;
    margin: 0;
  }
`;

// Mock workers data - in real app, this would come from API
const generateWorkers = (category: string, count: number = 12) => {
  const categoryName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return Array.from({ length: count }, (_, i) => {
    const names = [
      'Kwame Mensah', 'Ama Serwaa', 'Kofi Boateng', 'Efua Osei',
      'Yaw Asante', 'Akosua Adjei', 'Kojo Appiah', 'Adwoa Darko',
      'Nana Yeboah', 'Maame Owusu', 'Emmanuel Tetteh', 'Gifty Mensah'
    ];
    const locations = [
      'Accra, Greater Accra', 'Kumasi, Ashanti', 'Tamale, Northern',
      'Cape Coast, Central', 'Takoradi, Western', 'Sunyani, Bono'
    ];
    
    return {
      id: `${category}-${i + 1}`,
      name: names[i % names.length],
      title: `Professional ${categoryName}`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[i % names.length])}&size=200&background=d97706&color=fff`,
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      reviewCount: Math.floor(Math.random() * 200) + 20,
      location: locations[i % locations.length],
      verified: Math.random() > 0.3,
      experience: Math.floor(Math.random() * 15) + 2
    };
  });
};

export const SkilledWorkersList = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const categoryName = category 
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Skilled Workers';

  const allWorkers = useMemo(() => {
    return generateWorkers(category || 'worker', 12);
  }, [category]);

  const filteredWorkers = useMemo(() => {
    if (!searchQuery.trim()) return allWorkers;
    
    const query = searchQuery.toLowerCase();
    return allWorkers.filter(worker =>
      worker.name.toLowerCase().includes(query) ||
      worker.title.toLowerCase().includes(query) ||
      worker.location.toLowerCase().includes(query)
    );
  }, [allWorkers, searchQuery]);

  const renderStars = (rating: number) => {
    const numRating = parseFloat(rating.toString());
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className="swl-star"
        fill={i < Math.floor(numRating) ? '#fbbf24' : 'none'}
      />
    ));
  };

  // Get full worker data for panel
  const getFullWorkerData = (worker: any) => {
    const categoryName = category 
      ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : 'Skilled Worker';
    
    const seed = parseInt(worker.id.split('-').pop() || '1') - 1;
    
    return {
      ...worker,
      about: `With ${worker.experience}+ years of experience in ${categoryName.toLowerCase()}, I provide professional and reliable services. I am committed to delivering high-quality work and ensuring complete customer satisfaction.`,
      services: [
        { name: `${categoryName} Consultation`, price: 'GHS 200+' },
        { name: `Basic ${categoryName} Service`, price: 'GHS 300+' },
        { name: `Premium ${categoryName} Service`, price: 'GHS 500+' },
        { name: `${categoryName} Maintenance`, price: 'GHS 150+' },
        { name: `Emergency ${categoryName}`, price: 'GHS 400+' },
        { name: `${categoryName} Installation`, price: 'GHS 600+' }
      ],
      phone: `+233 24 ${1000000 + (seed % 9000000)}`,
      email: `${worker.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      stats: {
        completedJobs: 100 + (seed % 500),
        yearsExperience: worker.experience,
        responseTime: `${1 + (seed % 4)} hours`
      },
      badges: ['Licensed', 'Insured', 'Verified', 'Top Rated']
    };
  };

  const handleWorkerClick = (worker: any) => {
    const fullWorkerData = getFullWorkerData(worker);
    setSelectedWorker(fullWorkerData);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedWorker(null);
  };

  return (
    <div id="swl-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />

      <div id="swl-container">
        {/* Header */}
        <div id="swl-header">
          <Link to="/skilled-workers/browse" id="swl-back-button">
            <ArrowLeft id="swl-back-icon" />
            Back to Browse
          </Link>
          
          <h1 id="swl-title">{categoryName}</h1>
          <p id="swl-subtitle">
            {filteredWorkers.length} {filteredWorkers.length === 1 ? 'professional' : 'professionals'} available
          </p>
        </div>

        {/* Filters */}
        <div id="swl-filters">
          <div id="swl-search-container">
            <Search id="swl-search-icon" />
            <input
              id="swl-search-input"
              type="text"
              placeholder="Search by name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div id="swl-view-toggle">
            <button
              className={`swl-view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="swl-view-icon" />
            </button>
            <button
              className={`swl-view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="swl-view-icon" />
            </button>
          </div>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length > 0 ? (
          <div id="swl-workers-grid">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                onClick={() => handleWorkerClick(worker)}
                className="swl-worker-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="swl-worker-header">
                  <img
                    className="swl-worker-avatar"
                    src={worker.avatar}
                    alt={worker.name}
                  />
                  <div className="swl-worker-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 className="swl-worker-name">{worker.name}</h3>
                      {worker.verified && (
                        <CheckCircle style={{ width: '18px', height: '18px', color: '#2563eb', flexShrink: 0 }} />
                      )}
                    </div>
                    <p className="swl-worker-title">{worker.title}</p>
                    <div className="swl-worker-rating">
                      <div className="swl-rating-stars">
                        {renderStars(parseFloat(worker.rating))}
                      </div>
                      <span className="swl-rating-text">{worker.rating}</span>
                      <span className="swl-review-count">({worker.reviewCount})</span>
                    </div>
                  </div>
                </div>
                
                <div className="swl-worker-location">
                  <MapPin className="swl-location-icon" />
                  <span>{worker.location}</span>
                </div>

                <div className="swl-worker-badges">
                  <span className="swl-badge">
                    <CheckCircle className="swl-badge-icon" />
                    {worker.experience}+ years
                  </span>
                  {worker.verified && (
                    <span className="swl-badge">
                      <CheckCircle className="swl-badge-icon" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="swl-empty-state">
            <h3 className="swl-empty-title">No workers found</h3>
            <p className="swl-empty-text">
              Try adjusting your search terms or browse other categories.
            </p>
          </div>
        )}
      </div>

      <Footer />

      {/* Slide-in Panel */}
      <SkilledWorkerPanel
        worker={selectedWorker}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

