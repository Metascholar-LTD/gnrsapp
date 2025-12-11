import React, { useState, useEffect } from 'react';
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
  city: string;
}

const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [showMap, setShowMap] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Accra');

  // Ghana region capitals
  const regionCapitals = [
    { name: 'Accra', region: 'Greater Accra' },
    { name: 'Kumasi', region: 'Ashanti' },
    { name: 'Tamale', region: 'Northern' },
    { name: 'Cape Coast', region: 'Central' },
    { name: 'Sunyani', region: 'Bono' },
    { name: 'Ho', region: 'Volta' },
    { name: 'Koforidua', region: 'Eastern' },
    { name: 'Bolgatanga', region: 'Upper East' },
    { name: 'Wa', region: 'Upper West' },
    { name: 'Sekondi-Takoradi', region: 'Western' },
    { name: 'Techiman', region: 'Bono East' },
    { name: 'Goaso', region: 'Ahafo' },
    { name: 'Dambai', region: 'Oti' },
    { name: 'Nkawkaw', region: 'Eastern' },
    { name: 'Sefwi Wiawso', region: 'Western North' },
    { name: 'Damongo', region: 'Savannah' },
    { name: 'Nalerigu', region: 'North East' },
  ];

  // All restaurants data organized by city
  const allRestaurants: Restaurant[] = [
    // Accra restaurants
    { id: 'accra-1', name: 'Vine', rating: 4.7, reviewCount: 97, cuisine: 'Seafood, Grill', priceRange: '$$$ - $$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Pretty good the breakfast there was really good. Especially the sautéed...', 'Tasty food in a nice and trendy setting.'], rank: 1, city: 'Accra' },
    { id: 'accra-2', name: 'Tunnel Lounge', rating: 4.8, reviewCount: 54, cuisine: 'Steakhouse, Seafood', priceRange: '$$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['... you must try the seafood Jollof!!!!', 'I went for lunch on 19/10/2025, the atmosphere, quality of service and food was...'], rank: 2, badge: "Travelers' Choice 2025", menu: true, city: 'Accra' },
    { id: 'accra-3', name: 'The Buka Restaurant', rating: 3.9, reviewCount: 370, cuisine: 'African', priceRange: '$$$ - $$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['I absolutely loved the goat soup.', 'Visited Buka restaurant to eat Nigeria...'], rank: 3, city: 'Accra' },
    { id: 'accra-4', name: '+233 Jazz Bar & Grill', rating: 4.1, reviewCount: 206, cuisine: 'Bar, Grill', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Best jazz bar in Accra! Amazing live performances.', 'Great cocktails and atmosphere for a night out.'], rank: 4, city: 'Accra' },
    { id: 'accra-5', name: 'Tandoor Indian Restaurant', rating: 4.5, reviewCount: 367, cuisine: 'Indian, Asian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Best Indian food in Accra. Authentic flavors!', 'The tandoor chicken is a must-try!'], rank: 5, city: 'Accra' },
    
    // Kumasi restaurants
    { id: 'kumasi-1', name: 'Asante Royal Restaurant', rating: 4.6, reviewCount: 234, cuisine: 'African, Traditional', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic Ashanti cuisine. The fufu is amazing!', 'Great traditional atmosphere.'], rank: 1, city: 'Kumasi' },
    { id: 'kumasi-2', name: 'Golden Bean Cafe', rating: 4.3, reviewCount: 156, cuisine: 'Cafe, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Best coffee in Kumasi!', 'Perfect place for meetings and casual dining.'], rank: 2, city: 'Kumasi' },
    { id: 'kumasi-3', name: 'Premier Restaurant', rating: 4.4, reviewCount: 189, cuisine: 'International', priceRange: '$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Excellent service and food quality.', 'Great for special occasions.'], rank: 3, city: 'Kumasi' },
    { id: 'kumasi-4', name: 'Chop Bar Express', rating: 4.2, reviewCount: 312, cuisine: 'Local, Fast Food', priceRange: '$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Affordable and delicious local meals.', 'Quick service, authentic taste.'], rank: 4, city: 'Kumasi' },
    
    // Tamale restaurants
    { id: 'tamale-1', name: 'Northern Delights', rating: 4.5, reviewCount: 178, cuisine: 'Northern Ghanaian', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic northern dishes. The tuo zaafi is excellent!', 'Great cultural experience.'], rank: 1, city: 'Tamale' },
    { id: 'tamale-2', name: 'Savanna Restaurant', rating: 4.3, reviewCount: 145, cuisine: 'Continental, Local', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Nice ambiance and good food.', 'Friendly staff and clean environment.'], rank: 2, city: 'Tamale' },
    { id: 'tamale-3', name: 'City View Restaurant', rating: 4.1, reviewCount: 98, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good variety of dishes.', 'Nice view of the city.'], rank: 3, city: 'Tamale' },
    
    // Cape Coast restaurants
    { id: 'capecoast-1', name: 'Ocean View Restaurant', rating: 4.7, reviewCount: 267, cuisine: 'Seafood, Continental', priceRange: '$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Amazing ocean view! Fresh seafood.', 'Perfect for romantic dinners.'], rank: 1, badge: "Travelers' Choice 2025", city: 'Cape Coast' },
    { id: 'capecoast-2', name: 'Heritage Cafe', rating: 4.4, reviewCount: 189, cuisine: 'Cafe, Local', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Great coffee and local snacks.', 'Cozy atmosphere near the castle.'], rank: 2, city: 'Cape Coast' },
    { id: 'capecoast-3', name: 'Coastal Grill', rating: 4.3, reviewCount: 156, cuisine: 'Grill, Seafood', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Best grilled fish in Cape Coast!', 'Great location by the beach.'], rank: 3, city: 'Cape Coast' },
    
    // Sunyani restaurants
    { id: 'sunyani-1', name: 'Bono Royal Restaurant', rating: 4.4, reviewCount: 198, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Great local dishes and continental options.', 'Friendly service.'], rank: 1, city: 'Sunyani' },
    { id: 'sunyani-2', name: 'Green Valley Restaurant', rating: 4.2, reviewCount: 134, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Nice environment and good food.', 'Popular spot in Sunyani.'], rank: 2, city: 'Sunyani' },
    
    // Ho restaurants
    { id: 'ho-1', name: 'Volta View Restaurant', rating: 4.5, reviewCount: 223, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic Volta region cuisine.', 'Great view of the surrounding hills.'], rank: 1, city: 'Ho' },
    { id: 'ho-2', name: 'Mountain Top Cafe', rating: 4.3, reviewCount: 167, cuisine: 'Cafe, Light Meals', priceRange: '$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Perfect for breakfast and lunch.', 'Cozy atmosphere.'], rank: 2, city: 'Ho' },
    { id: 'ho-3', name: 'Ewe Kitchen', rating: 4.4, reviewCount: 189, cuisine: 'Traditional Ewe', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic Ewe dishes.', 'Cultural dining experience.'], rank: 3, city: 'Ho' },
    
    // Koforidua restaurants
    { id: 'koforidua-1', name: 'Eastern Delights', rating: 4.3, reviewCount: 201, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Great local food options.', 'Popular among locals and visitors.'], rank: 1, city: 'Koforidua' },
    { id: 'koforidua-2', name: 'City Restaurant', rating: 4.2, reviewCount: 156, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food and service.', 'Convenient location.'], rank: 2, city: 'Koforidua' },
    
    // Bolgatanga restaurants
    { id: 'bolgatanga-1', name: 'Upper East Restaurant', rating: 4.4, reviewCount: 178, cuisine: 'Northern Ghanaian', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic northern cuisine.', 'Great cultural experience.'], rank: 1, city: 'Bolgatanga' },
    { id: 'bolgatanga-2', name: 'Red Clay Restaurant', rating: 4.3, reviewCount: 145, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Nice atmosphere.', 'Good variety of dishes.'], rank: 2, city: 'Bolgatanga' },
    
    // Wa restaurants
    { id: 'wa-1', name: 'Upper West Restaurant', rating: 4.3, reviewCount: 167, cuisine: 'Northern Ghanaian', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic local dishes.', 'Friendly service.'], rank: 1, city: 'Wa' },
    { id: 'wa-2', name: 'Wa City Restaurant', rating: 4.2, reviewCount: 134, cuisine: 'Continental, Local', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food quality.', 'Popular spot in Wa.'], rank: 2, city: 'Wa' },
    
    // Sekondi-Takoradi restaurants
    { id: 'sekondi-1', name: 'Harbor View Restaurant', rating: 4.6, reviewCount: 289, cuisine: 'Seafood, Continental', priceRange: '$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Fresh seafood with harbor view.', 'Excellent service.'], rank: 1, badge: "Travelers' Choice 2025", city: 'Sekondi-Takoradi' },
    { id: 'sekondi-2', name: 'Western Grill', rating: 4.4, reviewCount: 234, cuisine: 'Grill, Local', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Great grilled dishes.', 'Popular among locals.'], rank: 2, city: 'Sekondi-Takoradi' },
    { id: 'sekondi-3', name: 'Oil City Restaurant', rating: 4.3, reviewCount: 198, cuisine: 'International', priceRange: '$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Upscale dining experience.', 'Great for business meetings.'], rank: 3, city: 'Sekondi-Takoradi' },
    
    // Techiman restaurants
    { id: 'techiman-1', name: 'Bono East Restaurant', rating: 4.3, reviewCount: 178, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic local cuisine.', 'Good service.'], rank: 1, city: 'Techiman' },
    { id: 'techiman-2', name: 'Techiman City Restaurant', rating: 4.2, reviewCount: 145, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Nice food and atmosphere.', 'Popular choice.'], rank: 2, city: 'Techiman' },
    
    // Goaso restaurants
    { id: 'goaso-1', name: 'Ahafo Restaurant', rating: 4.3, reviewCount: 156, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Great local dishes.', 'Friendly staff.'], rank: 1, city: 'Goaso' },
    { id: 'goaso-2', name: 'Goaso City Restaurant', rating: 4.1, reviewCount: 123, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food quality.', 'Clean environment.'], rank: 2, city: 'Goaso' },
    
    // Dambai restaurants
    { id: 'dambai-1', name: 'Oti Region Restaurant', rating: 4.2, reviewCount: 134, cuisine: 'Local, Traditional', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic regional cuisine.', 'Nice atmosphere.'], rank: 1, city: 'Dambai' },
    { id: 'dambai-2', name: 'Dambai City Restaurant', rating: 4.1, reviewCount: 112, cuisine: 'Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food and service.', 'Popular spot.'], rank: 2, city: 'Dambai' },
    
    // Nkawkaw restaurants
    { id: 'nkawkaw-1', name: 'Eastern Hills Restaurant', rating: 4.3, reviewCount: 167, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Great view and food.', 'Nice location.'], rank: 1, city: 'Nkawkaw' },
    { id: 'nkawkaw-2', name: 'Nkawkaw Restaurant', rating: 4.2, reviewCount: 145, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food quality.', 'Friendly service.'], rank: 2, city: 'Nkawkaw' },
    
    // Sefwi Wiawso restaurants
    { id: 'wiawso-1', name: 'Western North Restaurant', rating: 4.2, reviewCount: 156, cuisine: 'Local, Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic local dishes.', 'Good service.'], rank: 1, city: 'Sefwi Wiawso' },
    { id: 'wiawso-2', name: 'Wiawso City Restaurant', rating: 4.1, reviewCount: 123, cuisine: 'International', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Nice food and atmosphere.', 'Popular choice.'], rank: 2, city: 'Sefwi Wiawso' },
    
    // Damongo restaurants
    { id: 'damongo-1', name: 'Savannah Restaurant', rating: 4.3, reviewCount: 145, cuisine: 'Northern Ghanaian', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic northern cuisine.', 'Great cultural experience.'], rank: 1, city: 'Damongo' },
    { id: 'damongo-2', name: 'Damongo City Restaurant', rating: 4.2, reviewCount: 134, cuisine: 'Continental, Local', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food quality.', 'Friendly staff.'], rank: 2, city: 'Damongo' },
    
    // Nalerigu restaurants
    { id: 'nalerigu-1', name: 'North East Restaurant', rating: 4.2, reviewCount: 134, cuisine: 'Northern Ghanaian', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Authentic local dishes.', 'Nice atmosphere.'], rank: 1, city: 'Nalerigu' },
    { id: 'nalerigu-2', name: 'Nalerigu City Restaurant', rating: 4.1, reviewCount: 112, cuisine: 'Continental', priceRange: '$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', reviewSnippets: ['Good food and service.', 'Popular spot.'], rank: 2, city: 'Nalerigu' },
  ];

  // Filter restaurants by selected city
  const restaurants = allRestaurants
    .filter(restaurant => restaurant.city === selectedCity)
    .map((restaurant, index) => ({ ...restaurant, rank: index + 1 }));

  // Scroll to top when city changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCity]);

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
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }

    .restaurants-cities-sidebar {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 120px;
    }

    .restaurants-cities-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e5e5e5;
    }

    .restaurants-city-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      cursor: pointer;
      color: #666;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f5f5f5;
    }

    .restaurants-city-item:last-child {
      border-bottom: none;
    }

    .restaurants-city-item:hover {
      color: #006B3F;
      padding-left: 0.5rem;
    }

    .restaurants-city-item.active {
      color: #006B3F;
      font-weight: 600;
      padding-left: 0.5rem;
    }

    .restaurants-city-region {
      font-size: 0.75rem;
      color: #999;
      margin-top: 0.25rem;
    }

    .restaurants-city-item.active .restaurants-city-region {
      color: #006B3F;
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
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: inherit;
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

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .restaurants-content-wrapper {
        padding-top: 60px;
      }

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

      .restaurants-layout {
        grid-template-columns: 1fr;
      }

      .restaurants-cities-sidebar {
        display: none;
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

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .restaurants-content-wrapper {
        padding-top: 70px;
      }

      .restaurants-main-content {
        padding: 1.5rem;
      }

      .restaurants-layout {
        grid-template-columns: 1fr;
      }

      .restaurants-cities-sidebar {
        display: none;
      }

      .restaurants-title {
        font-size: 2rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .restaurants-content-wrapper {
        padding-top: 120px;
      }

      .restaurants-main-content {
        padding: 2rem;
      }

      .restaurants-layout {
        grid-template-columns: 250px 1fr;
        gap: 2rem;
      }

      .restaurants-cities-sidebar {
        top: 120px;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .restaurants-content-wrapper {
        padding-top: 120px;
      }

      .restaurants-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }

      .restaurants-layout {
        grid-template-columns: 250px 1fr;
        gap: 2.5rem;
      }

      .restaurants-cities-sidebar {
        top: 120px;
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
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>

          <div className="restaurants-header">
            <h1 className="restaurants-title">Restaurants in {selectedCity}</h1>
            <div className="restaurants-subtitle">
              <span>Top restaurants in {selectedCity}®</span>
              <Info size={16} style={{ color: '#666' }} />
            </div>
            <div className="restaurants-header-actions">
              <h2 className="restaurants-best-title">THE 10 BEST Restaurants in {selectedCity}</h2>
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
            <div className="restaurants-cities-sidebar">
              <h3 className="restaurants-cities-title">Region Capitals</h3>
              {regionCapitals.map((city) => (
                <div
                  key={city.name}
                  className={`restaurants-city-item ${selectedCity === city.name ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city.name)}
                >
                  <div>
                    <div>{city.name}</div>
                    <div className="restaurants-city-region">{city.region}</div>
                </div>
                </div>
              ))}
            </div>

            <div className="restaurants-results">
              <div className="restaurants-results-count">{restaurants.length} {restaurants.length === 1 ? 'result' : 'results'}</div>
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
                      {restaurant.cuisine} ·{' '}
                      <span className="restaurant-status">{restaurant.status}</span>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Restaurants;

