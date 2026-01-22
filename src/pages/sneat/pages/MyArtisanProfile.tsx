import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Image as ImageIcon,
  MessageSquare,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Tag,
  Plus,
  X,
  Upload,
  Shield
} from 'lucide-react';
import PageWrapper from './shared/PageWrapper';

// Constants from SkilledWorkersModals
const ALL_CATEGORIES = [
  '3D Printing Specialist', '3D Modeling Expert',
  'AC Repair Technician', 'Appliance Repair Specialist', 'Auto Body Repair Expert', 'Auto Electrician', 'Auto Mechanic', 'Auto Parts Specialist', 'Architectural Drafter', 'Asphalt Paving Contractor',
  'Barber', 'Bricklayer', 'Building Inspector', 'Building Maintenance Worker',
  'Cake Baker & Designer', 'Carpenter', 'Caterer', 'Chef', 'Civil Engineer', 'Cleaner', 'Commercial Painter', 'Concrete Finisher', 'Construction Manager', 'Crane Operator',
  'Diesel Mechanic', 'Drywall Installer',
  'Electrician', 'Elevator Technician', 'Event Caterer',
  'Fence Installer', 'Flooring Installer', 'Furniture Maker',
  'General Contractor', 'Glazier',
  'Hairdresser', 'Hair Stylist', 'Heating Technician', 'HVAC Technician',
  'Interior Designer', 'Ironworker',
  'Janitor', 'Jeweler',
  'Landscaper', 'Locksmith',
  'Mason', 'Makeup Artist', 'Mechanic', 'Metal Fabricator', 'Mobile Mechanic',
  'Nail Technician',
  'Painter', 'Plumber', 'Plumbing Contractor', 'Power Tool Repair',
  'Refrigeration Technician', 'Roofer',
  'Seamstress', 'Security System Installer', 'Sheet Metal Worker', 'Shoe Repair Specialist', 'Solar Panel Installer', 'Steel Worker', 'Surveyor',
  'Tailor', 'Tile Installer', 'Tire Specialist', 'Truck Mechanic',
  'Upholsterer',
  'Welder', 'Window Installer', 'Woodworker'
];

const WORK_TYPES = [
  { value: '', label: 'Select type of work' },
  { value: 'skilled-trades', label: 'Skilled Trades' },
  { value: 'personal-services', label: 'Personal Services' },
  { value: 'construction', label: 'Construction & Building' },
  { value: 'automotive', label: 'Automotive Services' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'food', label: 'Food & Catering' },
  { value: 'maintenance', label: 'Maintenance & Repair' },
];

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User },
  { id: 2, label: 'Services & Pricing', icon: DollarSign },
  { id: 3, label: 'Portfolio', icon: ImageIcon },
];

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const MyArtisanProfile: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    typeOfWork: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    about: "",
    yearsExperience: "",
    verified: false,
    services: [] as Array<{ name: string; price: string }>,
    portfolio: [] as string[],
    profilePicture: "",
  });

  const [newService, setNewService] = useState({ name: "", price: "" });

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.name &&
          formData.typeOfWork &&
          formData.category &&
          formData.location &&
          formData.phone &&
          formData.email
        );
      case 2:
        return formData.services.length > 0;
      case 3:
        return formData.portfolio.length > 0;
      default:
        return false;
    }
  };

  const canProceed = (): boolean => {
    return isStepComplete(currentStep);
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addService = () => {
    if (newService.name && newService.price) {
      setFormData({
        ...formData,
        services: [...formData.services, newService]
      });
      setNewService({ name: "", price: "" });
    }
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const handlePortfolioUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({
            ...formData,
            portfolio: [...formData.portfolio, reader.result as string]
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePortfolioItem = (index: number) => {
    setFormData({
      ...formData,
      portfolio: formData.portfolio.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)) {
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Save to Supabase
      console.log('Submitting artisan profile:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="map-step-content">
            <h2 className="map-step-title">Basic Information</h2>
            <p className="map-step-subtitle">Tell us about yourself</p>

            <div className="map-form-grid">
              <div className="map-form-group">
                <label className="map-form-label">
                  <User className="map-form-label-icon" />
                  Full Name <span className="map-form-label-required">*</span>
                </label>
                <input
                  className="map-form-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="map-form-group">
                <label className="map-form-label">
                  <Tag className="map-form-label-icon" />
                  Type of Work <span className="map-form-label-required">*</span>
                </label>
                <select
                  className="map-form-select"
                  required
                  value={formData.typeOfWork}
                  onChange={(e) => setFormData({ ...formData, typeOfWork: e.target.value })}
                >
                  {WORK_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="map-form-group">
                <label className="map-form-label">
                  <Briefcase className="map-form-label-icon" />
                  Category <span className="map-form-label-required">*</span>
                </label>
                <select
                  className="map-form-select"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="map-form-group">
                <label className="map-form-label">
                  <Phone className="map-form-label-icon" />
                  Phone Number <span className="map-form-label-required">*</span>
                </label>
                <input
                  className="map-form-input"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div className="map-form-group">
                <label className="map-form-label">
                  <Mail className="map-form-label-icon" />
                  Email Address <span className="map-form-label-required">*</span>
                </label>
                <input
                  className="map-form-input"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div className="map-form-group">
                <label className="map-form-label">
                  <MapPin className="map-form-label-icon" />
                  Location <span className="map-form-label-required">*</span>
                </label>
                <input
                  className="map-form-input"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Region"
                />
              </div>

              <div className="map-form-group">
                <label className="map-form-label">
                  <Award className="map-form-label-icon" />
                  Years of Experience
                </label>
                <input
                  className="map-form-input"
                  type="number"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="map-form-group full-width">
                <label className="map-form-label">
                  <MessageSquare className="map-form-label-icon" />
                  About / Bio
                </label>
                <textarea
                  className="map-form-textarea"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Brief description about yourself and your work..."
                  rows={4}
                />
              </div>

              <div className="map-form-group full-width">
                <label className="map-form-label">
                  <User className="map-form-label-icon" />
                  Profile Picture
                </label>
                <div className="map-profile-picture-section">
                  {formData.profilePicture ? (
                    <img 
                      src={formData.profilePicture} 
                      alt="Profile" 
                      className="map-profile-picture-preview"
                    />
                  ) : (
                    <div className="map-profile-picture-initials">
                      {formData.name ? getInitials(formData.name) : "?"}
                    </div>
                  )}
                  <div className="map-profile-picture-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, profilePicture: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <p className="map-profile-picture-upload-text">
                      {formData.profilePicture ? "Click to change picture" : "Click to upload profile picture"}
                    </p>
                  </div>
                  {formData.profilePicture && (
                    <button
                      type="button"
                      className="map-profile-picture-remove"
                      onClick={() => setFormData({ ...formData, profilePicture: "" })}
                    >
                      <X size={14} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="map-step-content">
            <h2 className="map-step-title">Services & Pricing</h2>
            <p className="map-step-subtitle">Add the services you offer and their prices</p>

            <div className="map-detail-section">
              <h3 className="map-detail-section-title">Add New Service</h3>
              <div className="map-service-input-row">
                <input
                  className="map-form-input"
                  type="text"
                  placeholder="Service name (e.g., Basic Repair)"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <input
                  className="map-form-input"
                  type="text"
                  placeholder="Price (e.g., GHS 200+)"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
                <button
                  type="button"
                  className="map-btn map-btn-primary"
                  onClick={addService}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            {formData.services.length > 0 && (
              <div className="map-detail-section">
                <h3 className="map-detail-section-title">
                  Services ({formData.services.length})
                </h3>
                <div className="map-services-grid">
                  {formData.services.map((service, index) => (
                    <div key={index} className="map-service-card">
                      <div className="map-service-info">
                        <h4 className="map-service-name">{service.name}</h4>
                        <p className="map-service-price">{service.price}</p>
                      </div>
                      <button
                        type="button"
                        className="map-service-remove"
                        onClick={() => removeService(index)}
                        title="Remove service"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.services.length === 0 && (
              <div className="map-empty-state">
                <p>No services added yet</p>
                <p className="map-empty-state-subtitle">Add services and pricing information above</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="map-step-content">
            <h2 className="map-step-title">Portfolio</h2>
            <p className="map-step-subtitle">Upload images or videos of your work</p>

            <div className="map-detail-section">
              <h3 className="map-detail-section-title">Upload Portfolio Images</h3>
              <div 
                className="map-upload-area" 
                style={{ 
                  border: isDragging ? "2px dashed #696cff" : "2px dashed #d9dee3",
                  backgroundColor: isDragging ? "#f5f5f9" : "transparent"
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handlePortfolioUpload(e.dataTransfer.files);
                }}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer"
                  }}
                  onChange={(e) => {
                    handlePortfolioUpload(e.target.files);
                    e.target.value = "";
                  }}
                />
                <Upload className="map-upload-icon" />
                <p className="map-upload-text">Click to upload or drag and drop</p>
                <p className="map-upload-hint">PNG, JPG, MP4 up to 10MB</p>
              </div>
            </div>

            {formData.portfolio.length > 0 && (
              <div className="map-detail-section">
                <h3 className="map-detail-section-title">
                  Portfolio Images ({formData.portfolio.length})
                </h3>
                <div className="map-portfolio-grid">
                  {formData.portfolio.map((item, index) => (
                    <div key={index} className="map-portfolio-item">
                      {item.startsWith('data:video') ? (
                        <video 
                          src={item} 
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                          controls
                        />
                      ) : (
                        <img src={item} alt={`Portfolio ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                      )}
                      <button
                        type="button"
                        className="map-portfolio-remove"
                        onClick={() => removePortfolioItem(index)}
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.portfolio.length === 0 && (
              <div className="map-empty-state">
                <p>No portfolio images added yet</p>
                <p className="map-empty-state-subtitle">Upload images to showcase your work</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .map-page {
          min-height: 100vh;
          background: #fafbfc;
        }

        .map-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .map-stepper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .map-stepper::before {
          content: '';
          position: absolute;
          top: 1.5rem;
          left: 0;
          right: 0;
          height: 2px;
          background: #e8ecef;
          z-index: 0;
        }

        .map-step {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .map-step-circle {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: white;
          border: 2px solid #e8ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .map-step.active .map-step-circle {
          border-color: #5c6bc0;
          background: #5c6bc0;
          color: white;
          box-shadow: 0 4px 12px rgba(92, 107, 192, 0.3);
        }

        .map-step.complete .map-step-circle {
          border-color: #66bb6a;
          background: #66bb6a;
          color: white;
        }

        .map-step-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .map-step-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #78909c;
          transition: color 0.3s ease;
        }

        .map-step.active .map-step-label {
          color: #5c6bc0;
        }

        .map-step.complete .map-step-label {
          color: #66bb6a;
        }

        .map-form-card {
          background: white;
          border: 1px solid #e8ecef;
          border-radius: 1rem;
          padding: 2.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .map-step-content {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .map-step-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #37474f;
          margin: 0 0 0.5rem 0;
        }

        .map-step-subtitle {
          font-size: 1rem;
          color: #78909c;
          margin: 0 0 2rem 0;
        }

        .map-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .map-form-group {
          margin-bottom: 1.5rem;
        }

        .map-form-group.full-width {
          grid-column: 1 / -1;
        }

        .map-form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #37474f;
          margin-bottom: 0.5rem;
        }

        .map-form-label-icon {
          width: 1rem;
          height: 1rem;
          color: #5c6bc0;
        }

        .map-form-label-required {
          color: #ef5350;
          margin-left: 0.25rem;
        }

        .map-form-input,
        .map-form-select,
        .map-form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e8ecef;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          color: #37474f;
          background: white;
          transition: all 0.2s ease;
        }

        .map-form-input:focus,
        .map-form-select:focus,
        .map-form-textarea:focus {
          outline: none;
          border-color: #5c6bc0;
          box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.1);
        }

        .map-form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .map-profile-picture-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .map-profile-picture-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e8ecef;
          flex-shrink: 0;
        }

        .map-profile-picture-initials {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          border: 2px solid #e8ecef;
          flex-shrink: 0;
        }

        .map-profile-picture-upload-area {
          flex: 1;
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .map-profile-picture-upload-area:hover {
          border-color: #5c6bc0;
          background: #e8eaf6;
        }

        .map-profile-picture-upload-area input[type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .map-profile-picture-upload-text {
          font-size: 0.875rem;
          color: #78909c;
          margin: 0;
        }

        .map-profile-picture-remove {
          padding: 0.5rem 0.75rem;
          background: #ef5350;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .map-profile-picture-remove:hover {
          background: #d32f2f;
        }

        .map-detail-section {
          margin-bottom: 2rem;
        }

        .map-detail-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #37474f;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e8ecef;
        }

        .map-service-input-row {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .map-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .map-service-card {
          background: #fafbfc;
          border: 1px solid #e8ecef;
          border-radius: 0.5rem;
          padding: 1rem;
          transition: all 0.2s;
          position: relative;
        }

        .map-service-card:hover {
          border-color: #5c6bc0;
          background: #e8eaf6;
        }

        .map-service-name {
          font-weight: 600;
          color: #37474f;
          font-size: 0.875rem;
          margin: 0 0 0.5rem 0;
        }

        .map-service-price {
          font-size: 1rem;
          font-weight: 700;
          color: #5c6bc0;
          margin: 0;
          padding-top: 0.5rem;
          border-top: 1px solid #e8ecef;
        }

        .map-service-remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem;
          background: #ffebee;
          color: #ef5350;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          display: none;
        }

        .map-service-card:hover .map-service-remove {
          display: block;
        }

        .map-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .map-upload-area:hover {
          border-color: #5c6bc0;
          background: #e8eaf6;
        }

        .map-upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          color: #78909c;
        }

        .map-upload-text {
          font-size: 0.875rem;
          color: #78909c;
          margin: 0;
        }

        .map-upload-hint {
          font-size: 0.75rem;
          color: #b0bec5;
          margin-top: 0.5rem;
        }

        .map-portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .map-portfolio-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #e8ecef;
          max-height: 200px;
        }

        .map-portfolio-item img,
        .map-portfolio-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .map-portfolio-remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.5rem;
          background: #ffebee;
          color: #ef5350;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .map-portfolio-item:hover .map-portfolio-remove {
          opacity: 1;
        }

        .map-empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #b0bec5;
        }

        .map-empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        .map-empty-state-subtitle {
          margin-top: 0.5rem !important;
          font-size: 0.75rem !important;
          color: #b0bec5 !important;
        }

        .map-form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid #e8ecef;
        }

        .map-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .map-btn-primary {
          background: #5c6bc0;
          color: white;
        }

        .map-btn-primary:hover:not(:disabled) {
          background: #3f51b5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(92, 107, 192, 0.3);
        }

        .map-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .map-btn-secondary {
          background: white;
          color: #37474f;
          border: 1.5px solid #e8ecef;
        }

        .map-btn-secondary:hover:not(:disabled) {
          background: #fafbfc;
          border-color: #78909c;
        }

        .map-btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 767px) {
          .map-container {
            padding: 1rem;
          }

          .map-stepper {
            margin-bottom: 2rem;
          }

          .map-step-circle {
            width: 2.5rem;
            height: 2.5rem;
          }

          .map-step-label {
            font-size: 0.75rem;
          }

          .map-form-card {
            padding: 1.5rem;
          }

          .map-form-grid {
            grid-template-columns: 1fr;
          }

          .map-service-input-row {
            grid-template-columns: 1fr;
          }

          .map-services-grid {
            grid-template-columns: 1fr;
          }

          .map-portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <PageWrapper>
        <div className="map-page">
          <div className="map-container">
            <div className="map-stepper">
              {STEPS.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;
                const isCompleteState = isStepComplete(step.id);

                return (
                  <div
                    key={step.id}
                    className={`map-step ${isActive ? 'active' : ''} ${isComplete || isCompleteState ? 'complete' : ''}`}
                  >
                    <div className="map-step-circle">
                      {isComplete || (isCompleteState && !isActive) ? (
                        <CheckCircle className="map-step-icon" />
                      ) : (
                        <StepIcon className="map-step-icon" />
                      )}
                    </div>
                    <span className="map-step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="map-form-card">
                {renderStepContent()}

                <div className="map-form-actions">
                  <button
                    type="button"
                    className="map-btn map-btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="map-step-icon" />
                    Previous
                  </button>

                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      className="map-btn map-btn-primary"
                      onClick={handleNext}
                      disabled={!canProceed()}
                    >
                      Next
                      <ArrowRight className="map-step-icon" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="map-btn map-btn-primary"
                      disabled={!isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3) || submitting}
                    >
                      {submitting ? 'Submitting...' : (
                        <>
                          <CheckCircle className="map-step-icon" />
                          Save Profile
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default MyArtisanProfile;
