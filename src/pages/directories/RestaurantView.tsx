import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { restaurantsData } from '@/data/restaurants';
import RestaurantMap from '@/components/RestaurantMap';
import PreviewMap from '@/components/PreviewMap';
import { Share2, Heart, MapPin, Clock, Globe, Phone, ChevronDown, ChevronUp, ChevronRight, Filter, Search, ThumbsUp, MoreVertical, Lightbulb, Pencil, ArrowLeft, ArrowRight, Leaf, CreditCard, Info, X } from 'lucide-react';

const RestaurantView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'location'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAbout, setShowAllAbout] = useState(false);
  const [sortBy, setSortBy] = useState('most-recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const previewMapContainerRef = useRef<HTMLDivElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nearbyCarouselRef = useRef<HTMLDivElement>(null);

  // Map restaurant IDs from Restaurants page format (accra-1, accra-2, etc.) to restaurantsData format (1, 2, etc.)
  const getRestaurantId = (urlId: string | undefined): string => {
    if (!urlId) return '1';
    
    // If it's already a numeric ID, use it directly
    if (/^\d+$/.test(urlId)) {
      return urlId;
    }
    
    // If it's in format like 'accra-1', extract the number
    const match = urlId.match(/(\d+)$/);
    if (match) {
      return match[1];
    }
    
    // Fallback to '1' if no match
    return '1';
  };

  // Get restaurant data from imported data
  const restaurantId = getRestaurantId(id);
  const restaurant = restaurantsData[restaurantId] || restaurantsData['1'];

  // Initialize small preview map
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  
  // Legacy code below - keeping for reference but using imported data above
  const restaurants_legacy: Record<string, any> = {
    '1': {
      id: '1',
      name: 'Vine',
      claimed: true,
      rating: 4.7,
      reviewCount: 97,
      rank: 8,
      totalRestaurants: 480,
      cuisine: 'Seafood, Grill',
      priceRange: '$$-$$$',
      status: 'Open now',
      openUntil: '11:00 PM',
      address: '99A Fourth Norla St, Accra Ghana',
      phone: '+233 55 845 0253',
      website: 'https://vine-restaurant.com',
      about: 'Vine Restaurant is a hub for the global community in Accra, offering Ghanaian culinary delights and beverages in a sophisticated, high-end dining experience with an open-air, rooftop soiree ambiance.',
      features: {
        vegetarian: true,
        creditCards: ['Visa'],
        meals: ['Breakfast', 'Lunch', 'Dinner', 'Brunch', 'Drinks']
      },
      hours: {
        sunday: { open: '10:00 AM', close: '9:00 PM' },
        monday: { open: '8:00 AM', close: '11:00 PM' },
        tuesday: { open: '8:00 AM', close: '11:00 PM' },
        wednesday: { open: '8:00 AM', close: '11:00 PM' },
        thursday: { open: '8:00 AM', close: '11:00 PM' },
        friday: { open: '8:00 AM', close: '11:00 PM' },
        saturday: { open: '10:00 AM', close: '11:00 PM' }
      },
      images: {
        main: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        interior: {
          count: 9,
          thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
        },
        food: {
          count: 26,
          thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80'
        },
        drinks: {
          count: 10,
          thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80'
        },
        total: 66
      },
      location: {
        lat: 5.6037,
        lng: -0.1870,
        parking: 'Street Parking'
      },
      reviews: {
        overall: {
          excellent: 83,
          good: 9,
          average: 1,
          poor: 0,
          terrible: 4
        },
        categories: {
          service: 4.9,
          food: 4.9,
          value: 4.8,
          atmosphere: 4.9
        },
        travelerPhotos: 55,
        allReviews: 97,
        popularMentions: ['brunch', 'pork belly', 'rice', 'service was great', 'tasty food', 'hype'],
        list: [
          {
            id: 1,
            author: 'Mobileineurope',
            location: 'Aalborg, Denmark',
            contributions: 55,
            rating: 5,
            title: 'Tasty food in a nice and trendy setting.',
            date: 'Nov 2025',
            group: 'Couples',
            text: 'This was the best restaurant we visited during our week long stay in Accra. Fresh and tasty food in a really nice and trendy setting. Very recommended.',
            writtenDate: 'November 17, 2025',
            likes: 0
          },
          {
            id: 2,
            author: 'Bubuné',
            location: 'Accra, Ghana',
            contributions: 34,
            rating: 5,
            title: 'VINE = Divine',
            date: 'Jan 2025',
            group: 'Friends',
            text: 'It was a lovely evening and the staff made it enjoyable. We were a group of 12 and they kept us engaged and informed throughout. The food was tasty and well done with food food portions too',
            writtenDate: 'April 15, 2025',
            likes: 0,
            images: [
              'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80',
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80'
            ]
          },
          {
            id: 3,
            author: 'Geoffrey T',
            location: '',
            contributions: 3,
            rating: 5,
            title: 'Fine food in Accra.',
            date: 'Jan 2025',
            group: 'Solo',
            text: 'Fantastic flavors Staff was friendly and food delicious Nice outdoor atmosphere and exceptional food in Accra. I had the pork belly which was unique and had great flavors and textures.',
            writtenDate: 'January 29, 2025',
            likes: 0
          },
          {
            id: 4,
            author: 'Sarah M',
            location: 'Kumasi, Ghana',
            contributions: 12,
            rating: 5,
            title: 'Amazing dining experience!',
            date: 'Feb 2025',
            group: 'Family',
            text: 'We had an incredible dinner here with our family. The service was outstanding and the food was absolutely delicious. The atmosphere was perfect for a family gathering. Highly recommend the grilled seafood platter!',
            writtenDate: 'February 10, 2025',
            likes: 2
          }
        ]
      },
      nearby: {
        restaurants: [
          {
            id: 'nearby-1',
            name: 'Heritage Indian Restaurant',
            rating: 4.6,
            reviews: 505,
            cuisine: 'Indian',
            priceRange: '$$-$$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
            lat: 5.6040,
            lng: -0.1865
          },
          {
            id: 'nearby-2',
            name: 'Tandoor Indian Restaurant',
            rating: 4.5,
            reviews: 367,
            cuisine: 'Indian',
            priceRange: '$$-$$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
            lat: 5.6030,
            lng: -0.1875
          },
          {
            id: 'nearby-3',
            name: 'The Venue',
            rating: 4.6,
            reviews: 250,
            cuisine: 'Bar',
            priceRange: '$$-$$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=300&q=80',
            lat: 5.6045,
            lng: -0.1860
          },
          {
            id: 'nearby-4',
            name: 'Simret - The Taste of Ethiopia',
            rating: 4.7,
            reviews: 186,
            cuisine: 'African',
            priceRange: '$$-$$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
            lat: 5.6025,
            lng: -0.1880
          },
          {
            id: 'nearby-5',
            name: 'Buka Restaurant',
            rating: 4.5,
            reviews: 523,
            cuisine: 'Ghanaian',
            priceRange: '$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
            lat: 5.6015,
            lng: -0.1890
          },
          {
            id: 'nearby-6',
            name: 'Chez Clarisse',
            rating: 4.7,
            reviews: 289,
            cuisine: 'French',
            priceRange: '$$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
            lat: 5.6055,
            lng: -0.1850
          },
          {
            id: 'nearby-7',
            name: 'Skybar 25',
            rating: 4.6,
            reviews: 456,
            cuisine: 'Bar',
            priceRange: '$$$',
            status: 'Open now',
            image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=300&q=80',
            lat: 5.6060,
            lng: -0.1845
          }
        ],
        hotels: [
          {
            id: 'hotel-1',
            name: 'The Alima Suites',
            rating: 4.7,
            reviews: 3,
            distance: '0.28 miles',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
            lat: 5.6050,
            lng: -0.1855
          },
          {
            id: 'hotel-2',
            name: 'Accra Luxury Apartments at The Lul Water',
            rating: 4.0,
            reviews: 1,
            distance: '0.12 miles',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80',
            lat: 5.6035,
            lng: -0.1870
          },
          {
            id: 'hotel-3',
            name: 'Hotel Wangara',
            rating: 2.3,
            reviews: 6,
            distance: '0.14 miles',
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80',
            lat: 5.6032,
            lng: -0.1872
          },
          {
            id: 'hotel-4',
            name: 'Accra Luxury Apartments at Edge',
            rating: 0,
            reviews: 0,
            distance: '0.26 miles',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
            lat: 5.6048,
            lng: -0.1858
          }
        ]
      }
    }
  };

  // Restaurant data is now imported from restaurantsData above

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

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Poor';
    return 'Terrible';
  };

  const isolatedStyles = `
    .restaurant-view-page {
      min-height: 100vh;
      background: white;
    }

    .restaurant-view-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .restaurant-view-main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .restaurant-view-header {
      margin-bottom: 2rem;
    }

    .restaurant-view-header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .restaurant-view-name-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .restaurant-view-name {
      font-size: 2rem;
      font-weight: 700;
      color: #006B3F;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .restaurant-view-action-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: white;
      color: #006B3F;
      border: 1px solid #006B3F;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      text-decoration: none;
    }

    .restaurant-view-action-button:hover {
      text-decoration: none;
      color: #006B3F;
    }

    .restaurant-view-action-button:visited {
      color: #006B3F;
    }

    .restaurant-view-action-button.save {
      background: #006B3F;
      color: white;
    }

    .restaurant-view-header-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .restaurant-view-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .restaurant-view-rating-number {
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-rating-text {
      font-size: 0.875rem;
      color: #666;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-tabs {
      display: flex;
      gap: 2rem;
      border-bottom: 2px solid #e5e5e5;
      margin-bottom: 2rem;
    }

    .restaurant-view-tab {
      padding: 0.75rem 0;
      background: none;
      border: none;
      font-size: 1rem;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-weight: 600;
    }

    .restaurant-view-tab.active {
      color: #006B3F;
      border-bottom-color: #006B3F;
    }

    .restaurant-view-content {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
      align-items: start;
    }

    .restaurant-view-main {
      background: white;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }

    .restaurant-view-sidebar {
      background: white;
      position: sticky;
      top: 100px;
      align-self: start;
    }

    .restaurant-view-section {
      margin-bottom: 2.5rem;
    }

    .restaurant-view-section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #006B3F;
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .restaurant-view-section-link {
      font-size: 0.875rem;
      color: #006B3F;
      text-decoration: none;
      font-weight: 600;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-section-link:hover {
      text-decoration: underline;
    }

    .restaurant-view-at-glance {
      margin-bottom: 2rem;
    }

    .restaurant-view-glance-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-glance-item.open {
      color: #006B3F;
      font-weight: 600;
    }

    .restaurant-view-about {
      font-size: 0.875rem;
      color: #333;
      line-height: 1.6;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-read-more {
      color: #006B3F;
      text-decoration: none;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-weight: 600;
    }

    .restaurant-view-features {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .restaurant-view-feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-image-gallery {
      margin-bottom: 2.5rem;
    }

    .restaurant-view-main-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      position: relative;
    }

    .restaurant-view-image-nav {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
    }

    .restaurant-view-image-count {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-thumbnails {
      display: flex;
      gap: 1rem;
    }

    .restaurant-view-thumbnail {
      flex: 1;
      position: relative;
      cursor: pointer;
    }

    .restaurant-view-thumbnail-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .restaurant-view-thumbnail-label {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-sidebar-section {
      margin-bottom: 2rem;
      border: 1px solid #e5e5e5;
      border-radius: 0.5rem;
      padding: 1.5rem;
      background: #fafafa;
    }

    .restaurant-view-save-button {
      width: 100%;
      padding: 1rem;
      background: white;
      color: #006B3F;
      border: 1px solid #006B3F;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-save-button:hover {
      background: #f9f9f9;
    }

    .restaurant-view-hours-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .restaurant-view-hours-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }



    .restaurant-view-location-map-container {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
      align-items: flex-start;
    }

    .restaurant-view-preview-map {
      width: 400px;
      height: 250px;
      border-radius: 0.5rem;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #e5e5e5;
      flex-shrink: 0;
      position: relative;
    }

    .restaurant-view-preview-map .leaflet-container {
      height: 100%;
      width: 100%;
      border-radius: 0.5rem;
    }

    .restaurant-view-preview-map .preview-map-overlay {
      border-radius: 0.5rem;
    }

    .restaurant-view-preview-map:hover .preview-map-overlay {
      background: rgba(0, 107, 63, 0.1) !important;
    }


    .restaurant-view-location-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .restaurant-view-location-address {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s, text-decoration 0.2s;
    }

    .restaurant-view-location-address:hover {
      color: #006B3F;
      text-decoration: underline !important;
    }

    .restaurant-view-parking {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #666;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-map-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow: auto;
    }

    .restaurant-view-map-modal-content {
      width: 100%;
      max-width: 1400px;
      height: 90vh;
      max-height: 90vh;
      background: white;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .restaurant-view-map-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e5e5;
      flex-shrink: 0;
      background: white;
    }

    .restaurant-view-map-modal-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #006B3F;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-map-modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      border-radius: 0.25rem;
    }

    .restaurant-view-map-modal-close:hover {
      background: #f5f5f5;
    }

    .restaurant-view-map-modal-map {
      flex: 1;
      position: relative;
      min-height: 0;
      height: calc(90vh - 73px);
      width: 100%;
      overflow: hidden;
    }

    .restaurant-view-map-modal-map .leaflet-container {
      height: 100%;
      width: 100%;
      z-index: 1;
    }

    .restaurant-view-preview-map:hover {
      box-shadow: 0 4px 12px rgba(0, 107, 63, 0.2);
    }



    .restaurant-view-question-box {
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 1rem;
    }

    .restaurant-view-question {
      font-size: 0.875rem;
      color: #333;
      margin-bottom: 0.75rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-checkboxes {
      display: flex;
      gap: 1rem;
    }

    .restaurant-view-checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .restaurant-view-reviews-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #006B3F;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-reviews-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .restaurant-view-reviews-link {
      color: #006B3F;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-reviews-link:hover {
      text-decoration: underline;
    }

    .restaurant-view-reviews-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #006B3F;
      color: white !important;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      text-decoration: none !important;
      transition: background-color 0.2s;
    }

    .restaurant-view-reviews-button:hover {
      background: #005a33;
      color: white !important;
      text-decoration: none !important;
    }

    .restaurant-view-reviews-button:visited {
      color: white !important;
    }

    .restaurant-view-rating-overview {
      display: flex;
      gap: 3rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .restaurant-view-rating-main {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .restaurant-view-rating-large {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-rating-label {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-rating-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .restaurant-view-rating-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #333;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-rating-bar-fill {
      width: 100px;
      height: 8px;
      background: #e5e5e5;
      border-radius: 4px;
      overflow: hidden;
    }

    .restaurant-view-rating-bar-progress {
      height: 100%;
      background: #006B3F;
    }

    .restaurant-view-traveler-photos {
      margin-bottom: 2rem;
    }

    .restaurant-view-photos-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .restaurant-view-photos-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-photos-button {
      padding: 0.5rem 1rem;
      background: #006B3F;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-photos-carousel {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .restaurant-view-photo-item {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 0.5rem;
      flex-shrink: 0;
    }

    .restaurant-view-reviews-filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .restaurant-view-filter-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #ddd;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-sort-select {
      padding: 0.5rem 2rem 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
    }

    .restaurant-view-search-input {
      flex: 1;
      min-width: 200px;
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-popular-mentions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .restaurant-view-mention-tag {
      padding: 0.375rem 0.75rem;
      background: #f0f0f0;
      border-radius: 1rem;
      font-size: 0.875rem;
      color: #333;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-mention-tag:hover {
      background: #e0e0e0;
    }

    .restaurant-view-review-card {
      border: 1px solid #e5e5e5;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      background: white;
      position: relative;
    }

    .restaurant-view-review-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      position: relative;
    }

    .restaurant-view-review-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e5e5e5;
      flex-shrink: 0;
    }

    .restaurant-view-review-info {
      flex: 1;
    }

    .restaurant-view-review-author {
      font-size: 0.875rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.25rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-review-location {
      font-size: 0.75rem;
      color: #666;
      margin: 0 0 0.25rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-review-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-review-date {
      font-size: 0.75rem;
      color: #666;
      margin: 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-review-text {
      font-size: 0.875rem;
      color: #333;
      line-height: 1.6;
      margin: 0.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-review-images {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .restaurant-view-review-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 0.375rem;
    }

    .restaurant-view-review-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: absolute;
      top: 0;
      right: 0;
    }

    .restaurant-view-review-like {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #666;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }

    .restaurant-view-review-like:hover {
      background-color: #f5f5f5;
    }

    .restaurant-view-review-more {
      color: #666;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      position: relative;
    }

    .restaurant-view-review-more:hover {
      background-color: #f5f5f5;
    }

    .restaurant-view-review-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 180px;
      overflow: hidden;
      animation: dropdownFadeIn 0.2s ease-out;
    }

    @keyframes dropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .restaurant-view-review-dropdown-item {
      padding: 0.75rem 1rem;
      color: #333;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-review-dropdown-item:hover {
      background-color: #f5f5f5;
    }

    .restaurant-view-review-dropdown-item:active {
      background-color: #e5e5e5;
    }

    .restaurant-view-disclaimer {
      font-size: 0.75rem;
      color: #666;
      line-height: 1.5;
      margin-top: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-disclaimer-link {
      color: #006B3F;
      text-decoration: none;
    }

    .restaurant-view-disclaimer-link:hover {
      text-decoration: underline;
    }

    .restaurant-view-nearby-section {
      margin-top: 4rem;
    }

    .restaurant-view-nearby-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .restaurant-view-nearby-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #006B3F;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-nearby-link {
      color: #006B3F;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-nearby-link:hover {
      text-decoration: underline;
    }

    .restaurant-view-nearby-carousel-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .restaurant-view-nearby-carousel {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      flex: 1;
      padding: 0.5rem 0;
    }

    .restaurant-view-nearby-carousel::-webkit-scrollbar {
      display: none;
    }

    .restaurant-view-nearby-item {
      position: relative;
      cursor: pointer;
      flex-shrink: 0;
      width: 200px;
    }

    .restaurant-view-nearby-nav-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #006B3F;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background-color 0.2s, color 0.2s;
      z-index: 10;
    }

    .restaurant-view-nearby-nav-button:hover {
      background: #006B3F;
      color: white;
    }

    .restaurant-view-nearby-nav-button svg {
      color: #006B3F;
      transition: color 0.2s;
    }

    .restaurant-view-nearby-nav-button:hover svg {
      color: white;
    }

    .restaurant-view-nearby-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .restaurant-view-nearby-heart {
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
    }

    .restaurant-view-nearby-info {
      margin-top: 0.5rem;
    }

    .restaurant-view-nearby-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.25rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-nearby-details {
      font-size: 0.75rem;
      color: #666;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .restaurant-view-nearby-map {
      width: 100%;
      height: 400px;
      background: #e5e5e5;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .restaurant-view-content-wrapper {
        padding-top: 60px;
      }

      .restaurant-view-main-content {
        padding: 1rem;
      }

      .restaurant-view-header-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .restaurant-view-tabs {
        overflow-x: auto;
      }

      .restaurant-view-content {
        grid-template-columns: 1fr;
      }

      .restaurant-view-location-map-container {
        flex-direction: column;
      }

      .restaurant-view-preview-map {
        width: 100%;
        height: 200px;
      }

      .restaurant-view-map-modal-content {
        height: 100vh;
        border-radius: 0;
      }

      .restaurant-view-map-modal-overlay {
        padding: 0;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .restaurant-view-content-wrapper {
        padding-top: 70px;
      }

      .restaurant-view-main-content {
        padding: 1.5rem;
      }

      .restaurant-view-content {
        grid-template-columns: 1fr;
      }

      .restaurant-view-nearby-carousel-wrapper {
        gap: 0.5rem;
      }

      .restaurant-view-nearby-nav-button {
        width: 36px;
        height: 36px;
      }

      .restaurant-view-nearby-item {
        width: 180px;
      }

      .restaurant-view-location-map-container {
        flex-direction: column;
      }

      .restaurant-view-preview-map {
        width: 100%;
        height: 250px;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .restaurant-view-content-wrapper {
        padding-top: 120px;
      }

      .restaurant-view-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .restaurant-view-content-wrapper {
        padding-top: 120px;
      }

      .restaurant-view-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  return (
    <div className="restaurant-view-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="restaurant-view-content-wrapper">
        <div className="restaurant-view-main-content">
          <div className="restaurant-view-header">
            <div className="restaurant-view-header-top">
              <div className="restaurant-view-name-section">
                <h1 className="restaurant-view-name">{restaurant.name}</h1>
              </div>
              <div className="restaurant-view-header-actions">
                <button className="restaurant-view-action-button">
                  <Share2 size={16} />
                  Share
                </button>
                <a 
                  href={`/directories/restaurants/${id}/write-review`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="restaurant-view-action-button"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Pencil size={16} />
                  Review
                </a>
                <button 
                  className={`restaurant-view-action-button save ${isSaved ? 'saved' : ''}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart size={16} fill={isSaved ? 'white' : 'none'} />
                  Save
                </button>
              </div>
            </div>
            <div className="restaurant-view-header-info">
              <div className="restaurant-view-rating">
                <span className="restaurant-view-rating-number">{restaurant.rating}</span>
                {renderStars(restaurant.rating)}
                <span className="restaurant-view-rating-text">({restaurant.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="restaurant-view-image-gallery" style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <img src={restaurant.images.main} alt={restaurant.name} className="restaurant-view-main-image" />
              <div className="restaurant-view-image-nav" onClick={() => setCurrentImageIndex((prev) => (prev + 1) % 3)}>
                <ChevronRight size={20} />
              </div>
              <div className="restaurant-view-image-count">{restaurant.images.total}</div>
            </div>
            <div className="restaurant-view-thumbnails">
              <div className="restaurant-view-thumbnail">
                <img src={restaurant.images.interior.thumbnail} alt="Interior" className="restaurant-view-thumbnail-image" />
                <div className="restaurant-view-thumbnail-label">Interior ({restaurant.images.interior.count})</div>
              </div>
              <div className="restaurant-view-thumbnail">
                <img src={restaurant.images.food.thumbnail} alt="Food" className="restaurant-view-thumbnail-image" />
                <div className="restaurant-view-thumbnail-label">Food ({restaurant.images.food.count})</div>
              </div>
              <div className="restaurant-view-thumbnail">
                <img src={restaurant.images.drinks.thumbnail} alt="Drinks" className="restaurant-view-thumbnail-image" />
                <div className="restaurant-view-thumbnail-label">Drinks ({restaurant.images.drinks.count})</div>
              </div>
            </div>
          </div>

          <div className="restaurant-view-tabs">
            <button 
              className={`restaurant-view-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`restaurant-view-tab ${activeTab === 'location' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setTimeout(() => {
                  const locationSection = document.getElementById('location-section');
                  if (locationSection) {
                    locationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
            >
              Location
            </button>
            <button 
              className="restaurant-view-tab"
              onClick={() => {
                setActiveTab('overview');
                setTimeout(() => {
                  const reviewsSection = document.getElementById('reviews-section');
                  if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
            >
              Reviews
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="restaurant-view-content">
              <div className="restaurant-view-main">
                <div className="restaurant-view-section restaurant-view-at-glance">
                  <div className="restaurant-view-glance-item open">
                    <Clock size={16} />
                    Open until {restaurant.openUntil}
                  </div>
                  <div className="restaurant-view-glance-item">
                    <MapPin size={16} />
                    {restaurant.address}
                  </div>
                  <div className="restaurant-view-glance-item" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={16} />
                      <a href={restaurant.website} className="restaurant-view-section-link">Website</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <Phone size={16} />
                      {restaurant.phone}
                    </div>
                  </div>
                </div>

                <div className="restaurant-view-section">
                  <h2 className="restaurant-view-section-title">About</h2>
                  <p className="restaurant-view-about">
                    {showAllAbout || restaurant.about.length <= 200 ? restaurant.about : `${restaurant.about.substring(0, 200)}...`}
                  </p>
                  {restaurant.about.length > 200 && (
                    <a href="#" className="restaurant-view-read-more" onClick={(e) => { e.preventDefault(); setShowAllAbout(!showAllAbout); }}>
                      {showAllAbout ? 'Read less' : 'Read more'} {showAllAbout ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </a>
                  )}
                </div>

                <div className="restaurant-view-section">
                  <h2 className="restaurant-view-section-title">
                    Features
                    <a href="#" className="restaurant-view-section-link">See all features</a>
                  </h2>
                  <div className="restaurant-view-features">
                    {restaurant.features.vegetarian && (
                      <div className="restaurant-view-feature">
                        <Leaf size={16} color="#006B3F" />
                        Vegetarian friendly
                      </div>
                    )}
                    {restaurant.features.creditCards.length > 0 && (
                      <div className="restaurant-view-feature">
                        <CreditCard size={16} color="#006B3F" />
                        Accepts credit cards: {restaurant.features.creditCards.join(', ')}
                      </div>
                    )}
                    <div className="restaurant-view-feature">
                      {restaurant.features.meals.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="restaurant-view-section" id="location-section">
                  <h2 className="restaurant-view-section-title">Location</h2>
                  <div className="restaurant-view-location-map-container">
                    <div 
                      ref={previewMapContainerRef} 
                      className="restaurant-view-preview-map"
                      onClick={() => setShowMapModal(true)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        borderRadius: '0.5rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 107, 63, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <PreviewMap
                        lat={restaurant.location.lat}
                        lng={restaurant.location.lng}
                        onClick={() => setShowMapModal(true)}
                      />
                    </div>
                    <div className="restaurant-view-location-info">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="restaurant-view-location-address"
                        style={{ cursor: 'pointer' }}
                      >
                        {restaurant.address}
                        <ChevronRight size={16} />
                      </a>
                      <div className="restaurant-view-parking">
                        <MapPin size={16} />
                        {restaurant.location.parking}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="restaurant-view-section" id="reviews-section">
                  <div className="restaurant-view-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <h2 className="restaurant-view-reviews-title">All reviews ({restaurant.reviews.allReviews})</h2>
                      <a 
                        href={`/directories/restaurants/${id}/write-review`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="restaurant-view-reviews-button"
                      >
                        <Pencil size={16} />
                        Write a review
                      </a>
                    </div>
                    <p className="restaurant-view-disclaimer" style={{ marginBottom: '1rem' }}>
                      This review is the subjective opinion of a Ghana National Resource System member and not of Ghana National Resource System. Ghana National Resource System performs checks on reviews as part of our industry-leading trust & safety standards.
                    </p>
                  </div>

                  <div className="restaurant-view-reviews-filters">
                    <button className="restaurant-view-filter-button">
                      <Filter size={16} />
                      Filters (1)
                    </button>
                    <select 
                      className="restaurant-view-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="most-recent">Sort by: Most recent</option>
                      <option value="highest-rated">Sort by: Highest rated</option>
                      <option value="lowest-rated">Sort by: Lowest rated</option>
                    </select>
                    <Info size={16} style={{ color: '#666' }} />
                    <input
                      type="text"
                      className="restaurant-view-search-input"
                      placeholder="Search reviews"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="restaurant-view-popular-mentions">
                    {restaurant.reviews.popularMentions.map((mention, idx) => (
                      <span key={idx} className="restaurant-view-mention-tag">{mention}</span>
                    ))}
                  </div>

                  {restaurant.reviews.list.map((review: any) => (
                    <div key={review.id} className="restaurant-view-review-card">
                      <div className="restaurant-view-review-header">
                        <div className="restaurant-view-review-avatar"></div>
                        <div className="restaurant-view-review-info">
                          <div className="restaurant-view-review-author">{review.author}</div>
                          {review.location && (
                            <div className="restaurant-view-review-location">
                              {review.location}{review.contributions ? ` • ${review.contributions} contributions` : ''}
                            </div>
                          )}
                          {renderStars(review.rating)}
                        </div>
                        <div className="restaurant-view-review-actions">
                          <div className="restaurant-view-review-like">
                            <ThumbsUp size={16} />
                            {review.likes}
                          </div>
                          <div style={{ position: 'relative' }} ref={openDropdownId === review.id ? dropdownRef : null}>
                            <div 
                              className="restaurant-view-review-more"
                              onClick={() => setOpenDropdownId(openDropdownId === review.id ? null : review.id)}
                            >
                              <MoreVertical size={16} />
                            </div>
                            {openDropdownId === review.id && (
                              <div className="restaurant-view-review-dropdown">
                                <div 
                                  className="restaurant-view-review-dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert('Report review functionality would be implemented here');
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Report review
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <h3 className="restaurant-view-review-title">{review.title}</h3>
                      <div className="restaurant-view-review-date">{review.date} • {review.group}</div>
                      <p className="restaurant-view-review-text">{review.text}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="restaurant-view-review-images">
                          {review.images.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt={`Review ${idx + 1}`} className="restaurant-view-review-image" />
                          ))}
                        </div>
                      )}
                      <div className="restaurant-view-review-date">Written {review.writtenDate}</div>
                      <p className="restaurant-view-disclaimer" style={{ marginTop: '0.5rem' }}>
                        This review is the subjective opinion of a Ghana National Resource System member and not of Ghana National Resource System. Ghana National Resource System performs checks on reviews as part of our industry-leading trust & safety standards.
                      </p>
                    </div>
                  ))}
                </div>

                <div className="restaurant-view-nearby-section">
                  <div className="restaurant-view-nearby-header">
                    <h2 className="restaurant-view-nearby-title">Other nearby restaurants</h2>
                    <Link to="/directories/restaurants" className="restaurant-view-nearby-link">See all</Link>
                  </div>
                  <div className="restaurant-view-nearby-carousel-wrapper">
                    <button 
                      className="restaurant-view-nearby-nav-button restaurant-view-nearby-nav-prev"
                      onClick={() => {
                        if (nearbyCarouselRef.current) {
                          nearbyCarouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                        }
                      }}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="restaurant-view-nearby-carousel" ref={nearbyCarouselRef}>
                      {restaurant.nearby.restaurants.map((item: any) => (
                        <div key={item.id} className="restaurant-view-nearby-item">
                          <div style={{ position: 'relative' }}>
                            <img src={item.image} alt={item.name} className="restaurant-view-nearby-image" />
                            <div className="restaurant-view-nearby-heart">
                              <Heart size={16} color="#666" />
                            </div>
                          </div>
                          <div className="restaurant-view-nearby-info">
                            <div className="restaurant-view-nearby-name">{item.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="restaurant-view-nearby-nav-button restaurant-view-nearby-nav-next"
                      onClick={() => {
                        if (nearbyCarouselRef.current) {
                          nearbyCarouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                        }
                      }}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="restaurant-view-sidebar">
                <div className="restaurant-view-sidebar-section">
                  <h2 className="restaurant-view-section-title">
                    Hours
                    <a href="#" className="restaurant-view-section-link">Suggest an edit</a>
                  </h2>
                  <div className="restaurant-view-glance-item open" style={{ marginBottom: '0.75rem' }}>
                    Open until {restaurant.openUntil}
                  </div>
                  <ul className="restaurant-view-hours-list">
                    <li className="restaurant-view-hours-item">
                      <span>Sunday</span>
                      <span>{restaurant.hours.sunday.open} - {restaurant.hours.sunday.close}</span>
                    </li>
                    <li className="restaurant-view-hours-item">
                      <span>Monday</span>
                      <span>{restaurant.hours.monday.open} - {restaurant.hours.monday.close}</span>
                    </li>
                    <li className="restaurant-view-hours-item">
                      <span>Tuesday</span>
                      <span>{restaurant.hours.tuesday.open} - {restaurant.hours.tuesday.close}</span>
                    </li>
                    <li className="restaurant-view-hours-item">
                      <span>Wednesday</span>
                      <span>{restaurant.hours.wednesday.open} - {restaurant.hours.wednesday.close}</span>
                    </li>
                    <li className="restaurant-view-hours-item">
                      <span>Thursday</span>
                      <span>{restaurant.hours.thursday.open} - {restaurant.hours.thursday.close}</span>
                    </li>
                    <li className="restaurant-view-hours-item">
                      <span>Friday</span>
                      <span>{restaurant.hours.friday.open} - {restaurant.hours.friday.close}</span>
                    </li>
                    <li className="restaurant-view-hours-item">
                      <span>Saturday</span>
                      <span>{restaurant.hours.saturday.open} - {restaurant.hours.saturday.close}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}



        </div>
      </div>

      {showMapModal && (
        <div className="restaurant-view-map-modal-overlay" onClick={() => setShowMapModal(false)}>
          <div className="restaurant-view-map-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="restaurant-view-map-modal-header">
              <div className="restaurant-view-map-modal-title">
                <MapPin size={20} color="#006B3F" />
                <span>{restaurant.name}</span>
              </div>
              <button 
                className="restaurant-view-map-modal-close"
                onClick={() => setShowMapModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="restaurant-view-map-modal-map">
              <RestaurantMap
                restaurant={{
                  id: restaurant.id,
                  name: restaurant.name,
                  lat: restaurant.location.lat,
                  lng: restaurant.location.lng,
                  rating: restaurant.rating,
                  cuisine: restaurant.cuisine,
                }}
                nearbyRestaurants={restaurant.nearby.restaurants.map((r) => ({
                  id: r.id,
                  name: r.name,
                  lat: r.lat,
                  lng: r.lng,
                  rating: r.rating,
                  cuisine: r.cuisine,
                }))}
                onClose={() => setShowMapModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantView;

