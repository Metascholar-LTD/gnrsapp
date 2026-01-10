import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { restaurantsData } from '@/data/restaurants';
import { ArrowLeft, Lightbulb, Camera, X } from 'lucide-react';

const WriteReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Map restaurant IDs from URL format (accra-1, accra-2, etc.) to restaurantsData format (1, 2, etc.)
  const getRestaurantId = (urlId: string | undefined): string => {
    if (!urlId) return '1';
    if (/^\d+$/.test(urlId)) {
      return urlId;
    }
    const match = urlId.match(/(\d+)$/);
    if (match) {
      return match[1];
    }
    return '1';
  };

  const restaurantId = getRestaurantId(id);
  const restaurant = restaurantsData[restaurantId];

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [visitMonth, setVisitMonth] = useState('December 2025');
  const [visitGroup, setVisitGroup] = useState<string>('');
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [certified, setCertified] = useState(false);

  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
    'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'
  ];

  const groups = ['Business', 'Couples', 'Family', 'Friends', 'Solo'];
  const reviewCategories = ['Location', 'Atmosphere', 'Food', 'Service', 'Value', 'Wait time'];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedPhotos([...selectedPhotos, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
  };

  const isolatedStyles = `
    .write-review-page {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .write-review-content-wrapper {
      min-height: calc(100vh - 80px);
      padding-top: 60px;
      padding-bottom: 4rem;
    }

    .write-review-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 3rem;
      align-items: center;
    }

    .write-review-left {
      position: sticky;
      top: 120px;
      align-self: start;
      margin-top: 8rem;
    }

    .write-review-heading-left {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-restaurant-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .write-review-restaurant-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }

    .write-review-restaurant-info {
      padding: 1.5rem;
    }

    .write-review-restaurant-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-restaurant-address {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.5;
    }

    .write-review-right {
      background: white;
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .write-review-heading {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 2.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-section {
      margin-bottom: 2.5rem;
    }

    .write-review-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-stars {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .write-review-star {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid #4A90E2;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #4A90E2;
      position: relative;
    }

    .write-review-star:hover {
      background: #4A90E2;
      border-color: #4A90E2;
      color: white;
    }

    .write-review-star.filled {
      background: #4A90E2;
      border-color: #4A90E2;
      color: white;
    }

    .write-review-star-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: #1a1a1a;
      color: white;
      font-size: 0.75rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-star-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: #1a1a1a;
    }

    .write-review-star:hover .write-review-star-tooltip {
      opacity: 1;
    }

    .write-review-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d0d0d0;
      border-radius: 0.5rem;
      font-size: 1rem;
      color: #1a1a1a;
      background: white;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A90E2' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem;
    }

    .write-review-select:focus {
      outline: none;
      border-color: #4A90E2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }

    .write-review-group-buttons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .write-review-group-button {
      padding: 0.625rem 1.25rem;
      border: 1px solid #d0d0d0;
      border-radius: 2rem;
      background: white;
      color: #1a1a1a;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-group-button:hover {
      border-color: #4A90E2;
      background: #E8F4FD;
      color: #2E7CD6;
    }

    .write-review-group-button.selected {
      background: #4A90E2;
      border-color: #4A90E2;
      color: white;
    }

    .write-review-categories {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .write-review-category {
      padding: 0.375rem 0.75rem;
      background: #f0f0f0;
      border-radius: 1rem;
      font-size: 0.75rem;
      color: #666;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-textarea {
      width: 100%;
      min-height: 150px;
      padding: 1rem;
      border: 1px solid #d0d0d0;
      border-radius: 0.5rem;
      font-size: 1rem;
      color: #1a1a1a;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      resize: vertical;
      line-height: 1.6;
    }

    .write-review-textarea:focus {
      outline: none;
      border-color: #4A90E2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }

    .write-review-char-count {
      font-size: 0.75rem;
      color: #666;
      margin-top: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-tips {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      color: #4A90E2;
      font-size: 0.875rem;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-tips:hover {
      color: #2E7CD6;
    }

    .write-review-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d0d0d0;
      border-radius: 0.5rem;
      font-size: 1rem;
      color: #1a1a1a;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-input:focus {
      outline: none;
      border-color: #4A90E2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }

    .write-review-photo-upload {
      border: 2px dashed #d0d0d0;
      border-radius: 0.5rem;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
    }

    .write-review-photo-upload:hover {
      border-color: #4A90E2;
      background: #E8F4FD;
    }

    .write-review-photo-upload input {
      display: none;
    }

    .write-review-photo-upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .write-review-photo-upload-icon {
      color: #4A90E2;
    }

    .write-review-photo-upload-text {
      color: #666;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-photos-preview {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .write-review-photo-preview {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .write-review-photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .write-review-photo-remove {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
    }

    .write-review-checkbox-wrapper {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .write-review-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #d0d0d0;
      border-radius: 0.25rem;
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .write-review-checkbox:checked {
      background: #4A90E2;
      border-color: #4A90E2;
    }

    .write-review-checkbox-text {
      font-size: 0.875rem;
      color: #1a1a1a;
      line-height: 1.6;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-checkbox-text a {
      color: #4A90E2;
      text-decoration: none;
    }

    .write-review-checkbox-text a:hover {
      text-decoration: underline;
    }

    .write-review-submit-button {
      width: 100%;
      padding: 1rem;
      background: #4A90E2;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 2rem;
      transition: background-color 0.2s;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .write-review-submit-button:hover {
      background: #2E7CD6;
    }

    .write-review-submit-button:disabled {
      background: #d0d0d0;
      cursor: not-allowed;
    }

    .write-review-optional {
      font-size: 0.75rem;
      color: #999;
      margin-left: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .write-review-content-wrapper {
        padding-top: 60px;
      }

      .write-review-main-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 0 1rem;
      }

      .write-review-left {
        position: static;
      }

      .write-review-right {
        padding: 1.5rem;
      }

      .write-review-heading-left {
        font-size: 1.5rem;
      }

      .write-review-stars {
        gap: 0.5rem;
      }

      .write-review-star {
        width: 40px;
        height: 40px;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .write-review-content-wrapper {
        padding-top: 70px;
      }

      .write-review-main-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .write-review-left {
        position: static;
      }

      .write-review-right {
        padding: 2rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .write-review-content-wrapper {
        padding-top: 120px;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .write-review-content-wrapper {
        padding-top: 120px;
      }
    }
  `;

  if (!restaurant) {
    return (
      <div className="write-review-page">
        <Navigation />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Restaurant not found</p>
          <Link to="/directories/restaurants">Back to Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="write-review-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="write-review-content-wrapper">
        <div className="write-review-main-content">
          <div className="write-review-left">
            <h1 className="write-review-heading-left">Tell us, how was your visit?</h1>
            <div className="write-review-restaurant-card">
              <img 
                src={restaurant.images.main} 
                alt={restaurant.name} 
                className="write-review-restaurant-image"
              />
              <div className="write-review-restaurant-info">
                <h2 className="write-review-restaurant-name">{restaurant.name}</h2>
                <p className="write-review-restaurant-address">{restaurant.address}</p>
              </div>
            </div>
          </div>

          <div className="write-review-right">

            <form onSubmit={handleSubmit}>
              <div className="write-review-section">
                <h3 className="write-review-section-title">How would you rate your experience?</h3>
                <div className="write-review-stars">
                  {[
                    { value: 1, label: 'Terrible' },
                    { value: 2, label: 'Poor' },
                    { value: 3, label: 'Average' },
                    { value: 4, label: 'Good' },
                    { value: 5, label: 'Excellent' }
                  ].map((star) => (
                    <button
                      key={star.value}
                      type="button"
                      className={`write-review-star ${star.value <= rating || star.value <= hoveredRating ? 'filled' : ''}`}
                      onClick={() => setRating(star.value)}
                      onMouseEnter={() => setHoveredRating(star.value)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <span className="write-review-star-tooltip">{star.label}</span>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="write-review-section">
                <h3 className="write-review-section-title">When did you go?</h3>
                <select
                  className="write-review-select"
                  value={visitMonth}
                  onChange={(e) => setVisitMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="write-review-section">
                <h3 className="write-review-section-title">Who did you go with?</h3>
                <div className="write-review-group-buttons">
                  {groups.map((group) => (
                    <button
                      key={group}
                      type="button"
                      className={`write-review-group-button ${visitGroup === group ? 'selected' : ''}`}
                      onClick={() => setVisitGroup(visitGroup === group ? '' : group)}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="write-review-section">
                <h3 className="write-review-section-title">Write your review</h3>
                <div className="write-review-categories">
                  {reviewCategories.map((category) => (
                    <span key={category} className="write-review-category">{category}</span>
                  ))}
                </div>
                <textarea
                  className="write-review-textarea"
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={6}
                />
                <div className="write-review-char-count">
                  {reviewText.length}/100 min characters
                </div>
              </div>

              <div className="write-review-section">
                <h3 className="write-review-section-title">
                  Title your review
                </h3>
                <input
                  type="text"
                  className="write-review-input"
                  placeholder="Give us the gist of your experience"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  maxLength={120}
                />
                <div className="write-review-char-count">
                  {reviewTitle.length}/120 max characters
                </div>
              </div>

              <div className="write-review-section">
                <h3 className="write-review-section-title">
                  Add some photos
                  <span className="write-review-optional">Optional</span>
                </h3>
                <label className="write-review-photo-upload">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  <div className="write-review-photo-upload-content">
                    <Camera size={32} className="write-review-photo-upload-icon" />
                    <div className="write-review-photo-upload-text">
                      Click to add photos or drag and drop
                    </div>
                  </div>
                </label>
                {selectedPhotos.length > 0 && (
                  <div className="write-review-photos-preview">
                    {selectedPhotos.map((photo, index) => (
                      <div key={index} className="write-review-photo-preview">
                        <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="write-review-photo-remove"
                          onClick={() => removePhoto(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="write-review-checkbox-wrapper">
                <input
                  type="checkbox"
                  id="certify"
                  className="write-review-checkbox"
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                />
                <label htmlFor="certify" className="write-review-checkbox-text">
                  I certify that this review is based on my own experience and is my genuine opinion of this restaurant, and that I have no personal or business relationship with this establishment, and have not been offered any incentive or payment originating from the establishment to write this review. I understand that Ghana National Resource System has a zero-tolerance policy on fake reviews. <a href="#">Learn more about the consequences of review fraud</a>.
                </label>
              </div>

              <button
                type="submit"
                className="write-review-submit-button"
                disabled={!certified || rating === 0 || reviewText.length < 100}
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WriteReview;

