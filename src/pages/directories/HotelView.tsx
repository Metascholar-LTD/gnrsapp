import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star, Phone, Mail, Globe } from 'lucide-react';

const HotelView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock hotel data - replace with actual API call
  const hotels: Record<string, any> = {
    '1': {
      id: '1',
      name: 'Kempinski Hotel Gold Coast City',
      location: 'Accra, Greater Accra',
      address: 'PMB 66, Ministries, Accra, Ghana',
      rating: 4.8,
      price: 'GHS 850',
      description: 'Luxury 5-star hotel in the heart of Accra with world-class amenities and exceptional service. Experience unparalleled comfort and sophistication.',
      fullDescription: 'Kempinski Hotel Gold Coast City is a luxury 5-star hotel located in the heart of Accra. With 269 elegantly designed rooms and suites, the hotel offers stunning views of the city and the Atlantic Ocean. The hotel features multiple dining options, a state-of-the-art spa, fitness center, and extensive meeting facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa & Wellness', 'Restaurant', 'Fitness Center', 'Conference Rooms', 'Parking', 'Room Service'],
      contact: {
        phone: '+233 302 611 000',
        email: 'info.accra@kempinski.com',
        website: 'www.kempinski.com/accra'
      },
      checkIn: '2:00 PM',
      checkOut: '12:00 PM'
    },
    '2': {
      id: '2',
      name: 'Labadi Beach Hotel',
      location: 'Labadi, Accra',
      address: 'La Beach Road, Labadi, Accra, Ghana',
      rating: 4.5,
      price: 'GHS 650',
      description: 'Beachfront hotel offering stunning ocean views and direct beach access.',
      fullDescription: 'Labadi Beach Hotel is a beautiful beachfront property offering direct access to one of Accra\'s most popular beaches. The hotel features comfortable rooms with ocean views, multiple dining options, and a range of recreational activities.',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Beach Access', 'Swimming Pool', 'Bar', 'Restaurant', 'Free Wi-Fi', 'Parking'],
      contact: {
        phone: '+233 302 777 000',
        email: 'info@labadibeachhotel.com',
        website: 'www.labadibeachhotel.com'
      },
      checkIn: '2:00 PM',
      checkOut: '11:00 AM'
    },
  };

  const hotel = hotels[id || '1'];

  if (!hotel) {
    return (
      <div>
        <Navigation />
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Hotel not found</p>
          <Button onClick={() => navigate('/directories/hotels')}>Back to Hotels</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isolatedStyles = `
    .hotel-view-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .hotel-view-content-wrapper {
      padding-top: 80px;
      min-height: calc(100vh - 80px);
    }

    .hotel-view-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hotel-view-back-button {
      margin-bottom: 2rem;
    }

    .hotel-view-header {
      margin-bottom: 2rem;
    }

    .hotel-view-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hotel-view-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(220 20% 40%);
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .hotel-view-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .hotel-view-hero-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }

    .hotel-view-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .hotel-view-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .hotel-view-section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hotel-view-description {
      color: hsl(220 20% 40%);
      line-height: 1.7;
      font-size: 1rem;
    }

    .hotel-view-amenities-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .hotel-view-amenity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(220 20% 40%);
      font-size: 0.95rem;
    }

    .hotel-view-contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: hsl(220 20% 40%);
    }

    .hotel-view-price-box {
      background: hsl(40 20% 90%);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .hotel-view-price {
      font-size: 2rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin-bottom: 0.5rem;
    }

    .hotel-view-price-label {
      color: hsl(220 20% 40%);
      font-size: 0.9rem;
    }

    .hotel-view-info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid hsl(40 20% 88%);
      color: hsl(220 20% 40%);
    }

    .hotel-view-info-item:last-child {
      border-bottom: none;
    }

    .hotel-view-info-label {
      font-weight: 500;
      color: hsl(220 30% 15%);
    }

    @media (max-width: 1024px) {
      .hotel-view-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hotel-view-main-content {
        padding: 1rem;
      }

      .hotel-view-title {
        font-size: 2rem;
      }

      .hotel-view-hero-image {
        height: 300px;
      }

      .hotel-view-amenities-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="hotel-view-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="hotel-view-content-wrapper">
        <div className="hotel-view-main-content">
          <div className="hotel-view-back-button">
            <Button
              variant="ghost"
              onClick={() => navigate('/directories/hotels')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={18} />
              Back to Hotels
            </Button>
          </div>

          <div className="hotel-view-header">
            <h1 className="hotel-view-title">{hotel.name}</h1>
            <div className="hotel-view-location">
              <MapPin size={18} />
              <span>{hotel.address}</span>
            </div>
            <div className="hotel-view-rating">
              <Star size={18} fill="currentColor" />
              <span>{hotel.rating}</span>
            </div>
          </div>

          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="hotel-view-hero-image"
          />

          <div className="hotel-view-grid">
            <div>
              <div className="hotel-view-section">
                <h2 className="hotel-view-section-title">About</h2>
                <p className="hotel-view-description">
                  {hotel.fullDescription || hotel.description}
                </p>
              </div>

              <div className="hotel-view-section" style={{ marginTop: '1.5rem' }}>
                <h2 className="hotel-view-section-title">Amenities</h2>
                <div className="hotel-view-amenities-grid">
                  {hotel.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="hotel-view-amenity">
                      <span>✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="hotel-view-section">
                <div className="hotel-view-price-box">
                  <div className="hotel-view-price">{hotel.price}</div>
                  <div className="hotel-view-price-label">per night</div>
                </div>

                <div className="hotel-view-info-item">
                  <span className="hotel-view-info-label">Check-in</span>
                  <span>{hotel.checkIn}</span>
                </div>
                <div className="hotel-view-info-item">
                  <span className="hotel-view-info-label">Check-out</span>
                  <span>{hotel.checkOut}</span>
                </div>

                <Button
                  className="w-full mt-4"
                  style={{
                    backgroundColor: 'hsl(220 30% 15%)',
                    color: 'white',
                    marginTop: '1rem'
                  }}
                >
                  Book Now
                </Button>
              </div>

              <div className="hotel-view-section" style={{ marginTop: '1.5rem' }}>
                <h2 className="hotel-view-section-title">Contact</h2>
                <div className="hotel-view-contact-item">
                  <Phone size={18} />
                  <span>{hotel.contact.phone}</span>
                </div>
                <div className="hotel-view-contact-item">
                  <Mail size={18} />
                  <span>{hotel.contact.email}</span>
                </div>
                <div className="hotel-view-contact-item">
                  <Globe size={18} />
                  <span>{hotel.contact.website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelView;

