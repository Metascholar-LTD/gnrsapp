import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MapPin, Heart, Info, ChevronDown } from 'lucide-react';
import { getAllRestaurants } from '@/data/restaurants';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  priceRange: string;
  status: string;
  image: string;
  reviewSnippets: string[];
  rank?: number;
  badge?: string;
  menu?: boolean;
}

const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [showMap, setShowMap] = useState(false);

  // Filter states
  const [establishmentTypes, setEstablishmentTypes] = useState({
    restaurants: true,
    bars: false,
    coffee: false,
    dessert: false,
  });
  const [mealTypes, setMealTypes] = useState({
    breakfast: false,
    brunch: false,
    lunch: false,
    dinner: false,
  });
  const [cuisines, setCuisines] = useState({
    african: false,
    bar: false,
    pub: false,
    american: false,
  });
  const [dishes, setDishes] = useState({
    chicken: false,
    fish: false,
    rice: false,
    salad: false,
  });
  const [awards, setAwards] = useState({
    travelersChoice: true,
  });
  const [price, setPrice] = useState({
    cheap: false,
    midrange: false,
    fine: false,
  });

  // Import restaurant data
  const allRestaurantsData = getAllRestaurants();
  
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Vine',
      rating: 4.7,
      reviewCount: 97,
      cuisine: 'Seafood, Grill',
      priceRange: '$$$ - $$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Pretty good the breakfast there was really good. Especially the sautéed...',
        'Tasty food in a nice and trendy setting.',
      ],
      rank: 1,
    },
    {
      id: '2',
      name: 'Tunnel Lounge',
      rating: 4.8,
      reviewCount: 54,
      cuisine: 'Steakhouse, Seafood',
      priceRange: '$$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        '... you must try the seafood Jollof!!!!',
        'I went for lunch on 19/10/2025, the atmosphere, quality of service and food was...',
      ],
      rank: 2,
      badge: "Travelers' Choice 2025",
      menu: true,
    },
    {
      id: '3',
      name: 'The Buka Restaurant',
      rating: 3.9,
      reviewCount: 370,
      cuisine: 'African',
      priceRange: '$$$ - $$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'I absolutely loved the goat soup.',
        'Visited Buka restaurant to eat Nigeria...',
      ],
      rank: 3,
    },
    {
      id: '4',
      name: '+233 Jazz Bar & Grill',
      rating: 4.1,
      reviewCount: 206,
      cuisine: 'Bar, Grill',
      priceRange: '$$-$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Best jazz bar in Accra! Amazing live performances.',
        'Great cocktails and atmosphere for a night out.',
      ],
      rank: 4,
    },
    {
      id: '5',
      name: 'Tandoor Indian Restaurant',
      rating: 4.5,
      reviewCount: 367,
      cuisine: 'Indian, Asian',
      priceRange: '$$-$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Best Indian food in Accra. Authentic flavors!',
        'The tandoor chicken is a must-try!',
      ],
      rank: 5,
    },
    {
      id: '6',
      name: 'Heritage Indian Restaurant',
      rating: 4.6,
      reviewCount: 505,
      cuisine: 'Indian',
      priceRange: '$$-$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Authentic Indian flavors. The butter chicken is outstanding!',
        'Reminds me of restaurants in Mumbai.',
      ],
      rank: 6,
    },
    {
      id: '7',
      name: 'Papillon Restaurant',
      rating: 4.5,
      reviewCount: 189,
      cuisine: 'International',
      priceRange: '$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Elegant dining experience. Perfect for a romantic dinner.',
        'French-inspired menu is excellent.',
      ],
      rank: 7,
    },
    {
      id: '8',
      name: 'Zen Garden',
      rating: 4.1,
      reviewCount: 142,
      cuisine: 'Bar, International',
      priceRange: '$$-$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Peaceful garden setting. Great place to relax.',
        'Asian fusion dishes are creative and delicious.',
      ],
      rank: 8,
    },
    {
      id: '9',
      name: 'Le Magellan',
      rating: 4.1,
      reviewCount: 98,
      cuisine: 'Lebanese, Middle Eastern',
      priceRange: '$$-$$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Authentic Lebanese cuisine. The hummus is amazing!',
        'Very authentic flavors. Great place for Middle Eastern food.',
      ],
      rank: 9,
    },
    {
      id: '10',
      name: 'Capitol Cafe & Restaurant',
      rating: 3.5,
      reviewCount: 87,
      cuisine: 'Cafe, European',
      priceRange: '$$',
      status: 'Open now',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      reviewSnippets: [
        'Great coffee and pastries. Perfect for breakfast.',
        'Nice cozy cafe with good coffee.',
      ],
      rank: 10,
    },
  ];

  const toggleEstablishmentType = (type: keyof typeof establishmentTypes) => {
    setEstablishmentTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleMealType = (type: keyof typeof mealTypes) => {
    setMealTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleCuisine = (type: keyof typeof cuisines) => {
    setCuisines(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleDish = (type: keyof typeof dishes) => {
    setDishes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleAward = (type: keyof typeof awards) => {
    setAwards(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const togglePrice = (type: keyof typeof price) => {
    setPrice(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: i < fullStars || (i === fullStars && hasHalfStar) ? '#006B3F' : '#e5e5e5',
            }}
          />
        ))}
      </div>
    );
  };

  const isolatedStyles = `
    .restaurants-page {
      min-height: 100vh;
      background: white;
    }

    .restaurants-content-wrapper {
      padding-top: 80px;
      min-height: calc(100vh - 80px);
    }

    .restaurants-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .restaurants-breadcrumbs {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-breadcrumbs a {
      color: #006B3F;
      text-decoration: none;
    }

    .restaurants-breadcrumbs a:hover {
      text-decoration: underline;
    }

    .restaurants-header {
      margin-bottom: 2rem;
    }

    .restaurants-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #006B3F;
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-subtitle {
      font-size: 1rem;
      color: #333;
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .restaurants-header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .restaurants-header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .restaurants-best-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-map-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: #006B3F;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-map-button:hover {
      background: #005a33;
    }

    .restaurants-sort-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .restaurants-sort-select {
      padding: 0.625rem 2rem 0.625rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #333;
      background: white;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
    }

    .restaurants-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }

    .restaurants-filters {
      background: white;
    }

    .restaurants-filter-section {
      margin-bottom: 2rem;
    }

    .restaurants-filter-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-filter-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
    }

    .restaurants-filter-checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      position: relative;
      flex-shrink: 0;
    }

    .restaurants-filter-checkbox.checked {
      background: #006B3F;
      border-color: #006B3F;
    }

    .restaurants-filter-checkbox.checked::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .restaurants-filter-label {
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-filter-link {
      font-size: 0.875rem;
      color: #006B3F;
      text-decoration: none;
      margin-top: 0.5rem;
      display: inline-block;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-filter-link:hover {
      text-decoration: underline;
    }

    .restaurants-filter-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-left: 0.5rem;
    }

    .restaurants-filter-badge-icon {
      width: 16px;
      height: 16px;
      background: #006B3F;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
    }

    .restaurants-results {
      background: white;
    }

    .restaurants-results-count {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid #e5e5e5;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .restaurant-card:last-child {
      border-bottom: none;
    }

    .restaurant-card:hover {
      background: #f9f9f9;
      margin: 0 -1rem;
      padding: 1.5rem 1rem;
      border-radius: 0.5rem;
    }

    .restaurant-image-wrapper {
      position: relative;
      width: 200px;
      height: 150px;
      border-radius: 0.5rem;
      overflow: hidden;
      flex-shrink: 0;
    }

    .restaurant-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .restaurant-heart {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
    }

    .restaurant-badge-overlay {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      background: rgba(0, 107, 63, 0.9);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-info {
      flex: 1;
    }

    .restaurant-rank-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .restaurant-rank {
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #006B3F;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .restaurant-rating-text {
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-details {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.75rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-status {
      color: #006B3F;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .restaurant-menu-link {
      color: #006B3F;
      text-decoration: none;
      margin-left: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-menu-link:hover {
      text-decoration: underline;
    }

    .restaurant-reviews {
      margin-top: 0.75rem;
    }

    .restaurant-review-snippet {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
      font-style: italic;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-keep-planning {
      margin-top: 3rem;
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      border: 1px solid #e5e5e5;
    }

    .restaurants-keep-planning-content {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
    }

    .restaurants-keep-planning-image {
      width: 200px;
      height: 120px;
      border-radius: 0.5rem;
      object-fit: cover;
      flex-shrink: 0;
    }

    .restaurants-keep-planning-text {
      flex: 1;
    }

    .restaurants-keep-planning-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-keep-planning-desc {
      font-size: 0.875rem;
      color: #666;
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-keep-planning-button {
      padding: 0.625rem 1.5rem;
      background: white;
      color: #006B3F;
      border: 1px solid #006B3F;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurants-keep-planning-button:hover {
      background: #006B3F;
      color: white;
    }

    @media (max-width: 1024px) {
      .restaurants-layout {
        grid-template-columns: 1fr;
      }

      .restaurants-filters {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .restaurants-main-content {
        padding: 1rem;
      }

      .restaurants-title {
        font-size: 1.75rem;
      }

      .restaurants-header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .restaurant-card {
        flex-direction: column;
      }

      .restaurant-image-wrapper {
        width: 100%;
        height: 200px;
      }

      .restaurants-keep-planning-content {
        flex-direction: column;
      }

      .restaurants-keep-planning-image {
        width: 100%;
        height: 150px;
      }
    }
  `;

  return (
    <div className="restaurants-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="restaurants-content-wrapper">
        <div className="restaurants-main-content">
          <div className="restaurants-breadcrumbs">
            <Link to="/directories">Africa</Link> &gt; <Link to="/directories">Ghana</Link> &gt; <Link to="/directories">Greater Accra</Link> &gt; <Link to="/directories">Accra</Link> &gt; <span>Accra Restaurants</span>
          </div>

          <div className="restaurants-header">
            <h1 className="restaurants-title">Restaurants in Accra</h1>
            <div className="restaurants-subtitle">
              <span>Top restaurants in Accra®</span>
              <Info size={16} style={{ color: '#666' }} />
            </div>
            <div className="restaurants-header-actions">
              <h2 className="restaurants-best-title">THE 10 BEST Restaurants in Accra</h2>
              <div className="restaurants-header-right">
                <button className="restaurants-map-button" onClick={() => setShowMap(!showMap)}>
                  <MapPin size={16} />
                  Map
                </button>
                <div className="restaurants-sort-wrapper">
                  <select
                    className="restaurants-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="rating">Sort: Rating</option>
                    <option value="reviews">Sort: Reviews</option>
                  </select>
                  <Info size={16} style={{ color: '#666' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="restaurants-layout">
            <div className="restaurants-filters">
              <div className="restaurants-filter-section">
                <h3 className="restaurants-filter-title">Establishment type:</h3>
                <div className="restaurants-filter-item" onClick={() => toggleEstablishmentType('restaurants')}>
                  <div className={`restaurants-filter-checkbox ${establishmentTypes.restaurants ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Restaurants</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleEstablishmentType('bars')}>
                  <div className={`restaurants-filter-checkbox ${establishmentTypes.bars ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Bars & Pubs</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleEstablishmentType('coffee')}>
                  <div className={`restaurants-filter-checkbox ${establishmentTypes.coffee ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Coffee & Tea</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleEstablishmentType('dessert')}>
                  <div className={`restaurants-filter-checkbox ${establishmentTypes.dessert ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Dessert</span>
                </div>
                <a href="#" className="restaurants-filter-link">Show more</a>
              </div>

              <div className="restaurants-filter-section">
                <h3 className="restaurants-filter-title">Meal type:</h3>
                <div className="restaurants-filter-item" onClick={() => toggleMealType('breakfast')}>
                  <div className={`restaurants-filter-checkbox ${mealTypes.breakfast ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Breakfast</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleMealType('brunch')}>
                  <div className={`restaurants-filter-checkbox ${mealTypes.brunch ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Brunch</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleMealType('lunch')}>
                  <div className={`restaurants-filter-checkbox ${mealTypes.lunch ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Lunch</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleMealType('dinner')}>
                  <div className={`restaurants-filter-checkbox ${mealTypes.dinner ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Dinner</span>
                </div>
              </div>

              <div className="restaurants-filter-section">
                <h3 className="restaurants-filter-title">Cuisines:</h3>
                <div className="restaurants-filter-item" onClick={() => toggleCuisine('african')}>
                  <div className={`restaurants-filter-checkbox ${cuisines.african ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">African</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleCuisine('bar')}>
                  <div className={`restaurants-filter-checkbox ${cuisines.bar ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Bar</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleCuisine('pub')}>
                  <div className={`restaurants-filter-checkbox ${cuisines.pub ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Pub</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleCuisine('american')}>
                  <div className={`restaurants-filter-checkbox ${cuisines.american ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">American</span>
                </div>
                <a href="#" className="restaurants-filter-link">Show all</a>
              </div>

              <div className="restaurants-filter-section">
                <h3 className="restaurants-filter-title">Dishes:</h3>
                <div className="restaurants-filter-item" onClick={() => toggleDish('chicken')}>
                  <div className={`restaurants-filter-checkbox ${dishes.chicken ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Chicken dishes</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleDish('fish')}>
                  <div className={`restaurants-filter-checkbox ${dishes.fish ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Fish</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleDish('rice')}>
                  <div className={`restaurants-filter-checkbox ${dishes.rice ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Rice dishes</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => toggleDish('salad')}>
                  <div className={`restaurants-filter-checkbox ${dishes.salad ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Salad</span>
                </div>
                <a href="#" className="restaurants-filter-link">Show all</a>
              </div>

              <div className="restaurants-filter-section">
                <h3 className="restaurants-filter-title">Awards:</h3>
                <div className="restaurants-filter-item" onClick={() => toggleAward('travelersChoice')}>
                  <div className={`restaurants-filter-checkbox ${awards.travelersChoice ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Travelers' Choice</span>
                  {awards.travelersChoice && (
                    <span className="restaurants-filter-badge">
                      <span className="restaurants-filter-badge-icon">✓</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="restaurants-filter-section">
                <h3 className="restaurants-filter-title">Price:</h3>
                <div className="restaurants-filter-item" onClick={() => togglePrice('cheap')}>
                  <div className={`restaurants-filter-checkbox ${price.cheap ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Cheap Eats</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => togglePrice('midrange')}>
                  <div className={`restaurants-filter-checkbox ${price.midrange ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Mid-range</span>
                </div>
                <div className="restaurants-filter-item" onClick={() => togglePrice('fine')}>
                  <div className={`restaurants-filter-checkbox ${price.fine ? 'checked' : ''}`} />
                  <span className="restaurants-filter-label">Fine Dining</span>
                </div>
              </div>
            </div>

            <div className="restaurants-results">
              <div className="restaurants-results-count">476 results</div>
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/directories/restaurants/${restaurant.id}`}
                  className="restaurant-card"
                >
                  <div className="restaurant-image-wrapper">
                    <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                    <button className="restaurant-heart">
                      <Heart size={16} style={{ color: '#666' }} />
                    </button>
                    {restaurant.badge && (
                      <div className="restaurant-badge-overlay">{restaurant.badge}</div>
                    )}
                  </div>
                  <div className="restaurant-info">
                    <div className="restaurant-rank-name">
                      {restaurant.rank && <span className="restaurant-rank">{restaurant.rank}.</span>}
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                    </div>
                    <div className="restaurant-rating">
                      {renderStars(restaurant.rating)}
                      <span className="restaurant-rating-text">
                        {restaurant.rating} ({restaurant.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="restaurant-details">
                      {restaurant.cuisine} · {restaurant.priceRange} ·{' '}
                      <span className="restaurant-status">{restaurant.status}</span>
                      {restaurant.menu && (
                        <a href="#" className="restaurant-menu-link" onClick={(e) => e.stopPropagation()}>
                          Menu
                        </a>
                      )}
                    </div>
                    <div className="restaurant-reviews">
                      {restaurant.reviewSnippets.map((snippet, idx) => (
                        <div key={idx} className="restaurant-review-snippet">
                          "{snippet}"
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="restaurants-keep-planning">
            <div className="restaurants-keep-planning-content">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
                alt="Keep on planning"
                className="restaurants-keep-planning-image"
              />
              <div className="restaurants-keep-planning-text">
                <h3 className="restaurants-keep-planning-title">Keep on planning</h3>
                <p className="restaurants-keep-planning-desc">
                  What to do, where to eat & more trip inspo.
                </p>
                <button className="restaurants-keep-planning-button">See more</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Restaurants;

