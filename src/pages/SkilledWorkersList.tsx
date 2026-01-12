import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { SkilledWorkerPanel } from "@/components/SkilledWorkerPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  CheckCircle,
  Search
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

  #swl-content-wrapper {
    min-height: calc(100vh - 80px);
  }

  #swl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
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
      justify-content: flex-start;
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

  /* Mobile: 0px - 767px */
  @media (max-width: 767px) {
    #swl-content-wrapper {
      padding-top: 60px;
    }

    #swl-container {
      padding: 1rem;
    }
  }

  /* Tablet: 768px - 1199px */
  @media (min-width: 768px) and (max-width: 1199px) {
    #swl-content-wrapper {
      padding-top: 70px;
    }

    #swl-container {
      padding: 1.5rem;
    }
  }

  /* Desktop: 1200px - 1599px */
  @media (min-width: 1200px) and (max-width: 1599px) {
    #swl-content-wrapper {
      padding-top: 120px;
    }

    #swl-container {
      padding: 2rem;
    }
  }

  /* Large Desktop: 1600px+ */
  @media (min-width: 1600px) {
    #swl-content-wrapper {
      padding-top: 120px;
    }

    #swl-container {
      padding: 2rem clamp(2rem, 5vw, 4rem);
    }
  }
`;

// Workers are now loaded from Supabase

export const SkilledWorkersList = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert slug to category name
  const categoryName = category 
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Skilled Workers';

  // Load workers from Supabase
  useEffect(() => {
    loadWorkers();
  }, [category]);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('skilled_workers' as any)
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false });

      // Filter by category if provided
      if (category) {
        // Try to match category name (case-insensitive)
        query = query.ilike('category', `%${categoryName}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Transform workers data
        const transformed = await Promise.all(
          data.map(async (worker: any) => {
            // Get worker count for this category
            const { count } = await supabase
              .from('skilled_workers' as any)
              .select('*', { count: 'exact', head: true })
              .eq('category', worker.category)
              .eq('status', 'active');

            return {
              id: worker.id,
              name: worker.name,
              title: `${worker.category} Professional`,
              avatar: worker.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&size=200&background=d97706&color=fff`,
              rating: parseFloat(worker.rating) || 0,
              reviewCount: worker.reviews_count || 0,
              location: worker.location,
              verified: worker.verified || false,
              experience: worker.years_experience || 0,
              category: worker.category,
              phone: worker.phone,
              email: worker.email,
              about: worker.about || '',
              stats: {
                completedJobs: worker.completed_jobs || 0,
                yearsExperience: worker.years_experience || 0,
                responseTime: worker.response_time || 'N/A'
              },
              badges: Array.isArray(worker.badges) ? worker.badges : []
            };
          })
        );

        setWorkers(transformed);
      }
    } catch (error: any) {
      console.error('Error loading workers:', error);
      toast.error('Failed to load workers');
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const allWorkers = workers;

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
  const getFullWorkerData = async (worker: any) => {
    try {
      // Load services and portfolio
      const { data: servicesData } = await supabase
        .from('worker_services' as any)
        .select('*')
        .eq('worker_id', worker.id)
        .order('display_order', { ascending: true });

      const { data: portfolioData } = await supabase
        .from('worker_portfolio' as any)
        .select('*')
        .eq('worker_id', worker.id)
        .order('display_order', { ascending: true });

      return {
        ...worker,
        services: servicesData?.map((s: any) => ({ name: s.service_name, price: s.service_price })) || [],
        portfolio: portfolioData?.map((p: any) => p.media_url) || []
      };
    } catch (error) {
      console.error('Error loading full worker data:', error);
      return worker;
    }
  };

  const handleWorkerClick = async (worker: any) => {
    const fullWorkerData = await getFullWorkerData(worker);
    setSelectedWorker(fullWorkerData);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedWorker(null);
  };

  if (loading) {
    return (
      <div id="swl-page-wrapper">
        <InitScripts />
        <Spinner />
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div>Loading workers...</div>
        </div>
        <Footer />
      </div>
    );
  }

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

      <div id="swl-content-wrapper">
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

