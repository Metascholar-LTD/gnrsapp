import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HotelCard } from '@/components/ui/hotel-card';
import { motion } from 'framer-motion';

const Hotels: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock hotel data - replace with actual API data
  const hotels = [
    {
      id: '1',
      name: 'Kempinski Hotel Gold Coast City',
      location: 'Accra, Greater Accra',
      rating: 4.8,
      description: 'Luxury 5-star hotel in the heart of Accra with world-class amenities and exceptional service.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Wi-Fi', 'Pool', 'Spa', 'Restaurant', 'Gym']
    },
    {
      id: '2',
      name: 'Labadi Beach Hotel',
      location: 'Labadi, Accra',
      rating: 4.5,
      description: 'Beachfront hotel offering stunning ocean views and direct beach access.',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Beach Access', 'Pool', 'Bar', 'Restaurant', 'Wi-Fi']
    },
    {
      id: '3',
      name: 'Movenpick Ambassador Hotel',
      location: 'Accra, Greater Accra',
      rating: 4.7,
      description: 'Modern hotel with elegant rooms and excellent conference facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Conference', 'Pool', 'Spa', 'Restaurant', 'Wi-Fi']
    },
    {
      id: '4',
      name: 'Fiesta Royale Hotel',
      location: 'Accra, Greater Accra',
      rating: 4.3,
      description: 'Comfortable hotel with friendly staff and convenient location.',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Bar', 'Parking']
    },
    {
      id: '5',
      name: 'Alisa Hotel',
      location: 'North Ridge, Accra',
      rating: 4.4,
      description: 'Boutique hotel offering personalized service and modern amenities.',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Gym', 'Parking']
    },
    {
      id: '6',
      name: 'Golden Tulip Hotel',
      location: 'Kumasi, Ashanti Region',
      rating: 4.2,
      description: 'Well-appointed hotel in the heart of Kumasi with excellent facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Conference', 'Parking']
    },
  ];

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isolatedStyles = `
    .hotels-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .hotels-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .hotels-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hotels-breadcrumbs {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hotels-breadcrumbs a {
      color: #006B3F;
      text-decoration: none;
    }

    .hotels-breadcrumbs a:hover {
      text-decoration: underline;
    }

    .hotels-header {
      margin-bottom: 3rem;
    }

    .hotels-title {
      font-size: 3rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hotels-subtitle {
      font-size: 1.25rem;
      color: hsl(220 20% 40%);
      margin: 0 0 2rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .hotels-search {
      position: relative;
      max-width: 600px;
    }

    .hotels-search-input {
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

    .hotels-search-input:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .hotels-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(220 20% 40%);
      width: 20px;
      height: 20px;
    }

    .hotels-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-top: 3rem;
    }

    @media (min-width: 768px) {
      .hotels-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
    }

    @media (min-width: 1024px) {
      .hotels-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
    }

    @media (min-width: 1280px) {
      .hotels-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .hotels-content-wrapper {
        padding-top: 60px;
      }

      .hotels-main-content {
        padding: 1rem;
      }

      .hotels-title {
        font-size: 2rem;
      }

      .hotels-subtitle {
        font-size: 1.125rem;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .hotels-content-wrapper {
        padding-top: 70px;
      }

      .hotels-main-content {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .hotels-content-wrapper {
        padding-top: 120px;
      }

      .hotels-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .hotels-content-wrapper {
        padding-top: 120px;
      }

      .hotels-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  return (
    <div className="hotels-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="hotels-content-wrapper">
        <div className="hotels-main-content">
          <div className="hotels-breadcrumbs">
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>
          <div className="hotels-header">
            <h1 className="hotels-title">Hotels in Ghana</h1>
            <p className="hotels-subtitle">
              Discover the best hotels across Ghana. From luxury resorts to cozy boutique hotels, 
              find your perfect accommodation for your stay.
            </p>
            
            <div className="hotels-search">
              <svg
                className="hotels-search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hotels-search-input"
              />
            </div>
          </div>

          <div className="hotels-grid">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  hotelId={hotel.id}
                  name={hotel.name}
                  location={hotel.location}
                  rating={hotel.rating}
                  description={hotel.description}
                  imageUrl={hotel.imageUrl}
                  images={hotel.images}
                  amenities={hotel.amenities}
                />
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                color: 'hsl(220 20% 40%)'
              }}>
                <p>No hotels found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Hotels;

