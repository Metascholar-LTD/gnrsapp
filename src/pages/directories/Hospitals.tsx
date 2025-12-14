import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HospitalCard } from '@/components/ui/hospital-card';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  location: string;
  region: string;
  facilityType: string;
  ownership: string;
  services: string[];
  healthInsurance: string[];
  nhisAccredited: boolean;
  phone?: string;
  email?: string;
  description?: string;
  imageUrl: string;
}

const Hospitals: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('all');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedHealthInsurance, setSelectedHealthInsurance] = useState<string[]>([]);
  const [nhisOnly, setNhisOnly] = useState(false);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const [isWelcomeTextExpanded, setIsWelcomeTextExpanded] = useState(false);
  const [healthTipsCarouselIndex, setHealthTipsCarouselIndex] = useState(0);

  // Hero carousel images
  const heroCarouselImages = [
    'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
    'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
    'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
    'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
    'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
  ];

  // Health tips data
  const healthTips = [
    {
      image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
      title: 'Does healthy fingernails mean healthy body?',
      description: 'Your fingernails can reveal important clues about your overall health. Changes in nail color, texture, or shape may indicate underlying health conditions.'
    },
    {
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      title: 'Fruits and Vegetables boost immune system',
      description: 'A diet rich in fruits and vegetables may lower the risk of diseases and boost your immune system. Aim for a variety of colors on your plate.'
    },
    {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      title: 'Regular exercise prolongs your life',
      description: 'Regular physical activity is one of the most important things you can do for your health. It helps prevent chronic diseases and improves mental health.'
    }
  ];

  // Auto-play hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCarouselIndex((prev) => (prev + 1) % heroCarouselImages.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, [heroCarouselImages.length]);

  // Auto-play health tips carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthTipsCarouselIndex((prev) => (prev + 1) % healthTips.length);
    }, 6000); // Change tip every 6 seconds

    return () => clearInterval(interval);
  }, [healthTips.length]);

  const nextHeroImage = () => {
    setHeroCarouselIndex((prev) => (prev + 1) % heroCarouselImages.length);
  };

  const prevHeroImage = () => {
    setHeroCarouselIndex((prev) => (prev - 1 + heroCarouselImages.length) % heroCarouselImages.length);
  };

  // Ghana regions
  const regions = [
    'Greater Accra', 'Ashanti', 'Northern', 'Central', 'Bono', 'Volta', 
    'Eastern', 'Upper East', 'Upper West', 'Western', 'Bono East', 
    'Ahafo', 'Oti', 'Western North', 'Savannah', 'North East'
  ];

  const facilityTypes = [
    'Primary Hospital', 'Secondary Hospital', 'Tertiary Hospital', 
    'Clinic', 'Health Centre', 'CHPS Compound', 'Maternity Home', 
    'Eye Clinic', 'Dental Clinic', 'Diagnostic Centre', 'Pharmacy', 
    'Scan Centre', 'Laboratory'
  ];

  const ownershipTypes = ['Private', 'Government', 'Mission (CHAG)'];

  const services = [
    'General Services', 'Scan', 'ECG', 'Antenatal', 'Pharmacy', 
    'Pediatrics', 'Surgery', 'Dental', 'Eye', 'Skin', 'ENT', 
    'Emergency', 'Maternity', 'Laboratory', 'Radiology'
  ];

  const healthInsuranceOptions = [
    'NHIS', 'Medex', 'Momentum', 'Glico Health Plan', 
    'Nationwide', 'First Fidelity Health', 'Premier Health Insurance'
  ];

  // Mock hospital data - replace with actual API data
  const hospitals: Hospital[] = [
    {
      id: '1',
      name: 'Korle Bu Teaching Hospital',
      location: 'Korle Bu, Accra',
      region: 'Greater Accra',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory', 'Radiology'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      nhisAccredited: true,
      phone: '+233 302 665 401',
      email: 'info@kbth.gov.gh',
      description: 'Ghana\'s premier tertiary healthcare facility providing comprehensive medical services.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Komfo Anokye Teaching Hospital',
      location: 'Kumasi',
      region: 'Ashanti',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex', 'Glico Health Plan'],
      nhisAccredited: true,
      phone: '+233 322 020 225',
      description: 'Major teaching hospital in the Ashanti Region providing advanced medical care.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: '37 Military Hospital',
      location: '37, Accra',
      region: 'Greater Accra',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 302 775 441',
      description: 'Military hospital providing quality healthcare services to military personnel and civilians.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      name: 'Nyaho Medical Centre',
      location: 'East Legon, Accra',
      region: 'Greater Accra',
      facilityType: 'Secondary Hospital',
      ownership: 'Private',
      services: ['General Services', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory', 'Radiology', 'Scan'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum', 'Glico Health Plan', 'Nationwide'],
      nhisAccredited: true,
      phone: '+233 302 544 000',
      email: 'info@nyahomedical.com',
      description: 'Private medical facility offering comprehensive healthcare services with modern equipment.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      name: 'Lister Hospital',
      location: 'Accra',
      region: 'Greater Accra',
      facilityType: 'Secondary Hospital',
      ownership: 'Private',
      services: ['General Services', 'Surgery', 'Emergency', 'Maternity', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      nhisAccredited: true,
      phone: '+233 302 780 000',
      description: 'Well-established private hospital providing quality healthcare services.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      name: 'Tamale Teaching Hospital',
      location: 'Tamale',
      region: 'Northern',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 372 022 200',
      description: 'Major healthcare facility serving the Northern Region and beyond.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '7',
      name: 'Cape Coast Teaching Hospital',
      location: 'Cape Coast',
      region: 'Central',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      phone: '+233 332 132 000',
      description: 'Teaching hospital providing healthcare services to the Central Region.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '8',
      name: 'Ridge Hospital',
      location: 'Ridge, Accra',
      region: 'Greater Accra',
      facilityType: 'Secondary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity', 'Pediatrics', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 302 664 698',
      description: 'Government hospital providing essential healthcare services.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '9',
      name: 'Trust Hospital',
      location: 'Osu, Accra',
      region: 'Greater Accra',
      facilityType: 'Secondary Hospital',
      ownership: 'Private',
      services: ['General Services', 'Emergency', 'Maternity', 'Laboratory', 'Scan', 'ECG'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum', 'Glico Health Plan'],
      nhisAccredited: true,
      phone: '+233 302 776 000',
      description: 'Private hospital known for quality healthcare and modern facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '10',
      name: 'Ho Teaching Hospital',
      location: 'Ho',
      region: 'Volta',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      phone: '+233 362 026 000',
      description: 'Teaching hospital serving the Volta Region.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '11',
      name: 'Sunyani Regional Hospital',
      location: 'Sunyani',
      region: 'Bono',
      facilityType: 'Secondary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity', 'Pediatrics', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 352 027 000',
      description: 'Regional hospital providing healthcare services to the Bono Region.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '12',
      name: 'FOCOS Orthopedic Hospital',
      location: 'Pantang, Accra',
      region: 'Greater Accra',
      facilityType: 'Specialist Hospital',
      ownership: 'Private',
      services: ['Surgery', 'General Services', 'Laboratory', 'Radiology'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      nhisAccredited: true,
      phone: '+233 302 501 000',
      description: 'Specialized orthopedic hospital providing advanced bone and joint care.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(hospital => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.region.toLowerCase().includes(searchQuery.toLowerCase());

      // Region filter
      const matchesRegion = selectedRegion === 'all' || hospital.region === selectedRegion;

      // Facility type filter
      const matchesFacilityType = selectedFacilityType === 'all' || hospital.facilityType === selectedFacilityType;

      // Ownership filter
      const matchesOwnership = selectedOwnership === 'all' || hospital.ownership === selectedOwnership;

      // Services filter
      const matchesServices = selectedServices.length === 0 || 
        selectedServices.every(service => hospital.services.includes(service));

      // Health insurance filter
      const matchesHealthInsurance = selectedHealthInsurance.length === 0 ||
        selectedHealthInsurance.every(insurance => hospital.healthInsurance.includes(insurance));

      // NHIS filter
      const matchesNhis = !nhisOnly || hospital.nhisAccredited;

      return matchesSearch && matchesRegion && matchesFacilityType && 
             matchesOwnership && matchesServices && matchesHealthInsurance && matchesNhis;
    });
  }, [searchQuery, selectedRegion, selectedFacilityType, selectedOwnership, 
      selectedServices, selectedHealthInsurance, nhisOnly]);

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleHealthInsurance = (insurance: string) => {
    setSelectedHealthInsurance(prev => 
      prev.includes(insurance) 
        ? prev.filter(i => i !== insurance)
        : [...prev, insurance]
    );
  };

  const isolatedStyles = `
    .hospitals-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .hospitals-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .hospitals-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hospitals-breadcrumbs {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-breadcrumbs a {
      color: hsl(220 30% 15%);
      text-decoration: none;
      font-weight: 500;
    }

    .hospitals-breadcrumbs a:hover {
      color: #0891b2;
      text-decoration: underline;
    }

    .hospitals-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      margin-top: 2rem;
    }

    .hospitals-main-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      min-width: 0;
      overflow-x: hidden;
    }

    .hospitals-welcome-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .hospitals-hero-carousel-container {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: 0.75rem;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .hospitals-hero-carousel-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .hospitals-hero-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.6s ease-in-out;
    }

    .hospitals-hero-image.active {
      opacity: 1;
    }

    .hospitals-hero-carousel-controls {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(8, 145, 178, 0.8);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
    }

    .hospitals-hero-carousel-controls:hover {
      background: rgba(8, 145, 178, 1);
      transform: translateY(-50%) scale(1.1);
    }

    .hospitals-hero-carousel-controls.prev {
      left: 16px;
    }

    .hospitals-hero-carousel-controls.next {
      right: 16px;
    }

    .hospitals-hero-carousel-dots {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
    }

    .hospitals-hero-carousel-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .hospitals-hero-carousel-dot.active {
      background: white;
      width: 30px;
      border-radius: 5px;
    }

    .hospitals-welcome-title {
      font-size: 2rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-welcome-text {
      font-size: 1rem;
      color: hsl(220 20% 40%);
      line-height: 1.7;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-welcome-text strong {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .hospitals-welcome-text-container {
      margin-bottom: 1.5rem;
    }

    .hospitals-welcome-text-collapsed {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .hospitals-welcome-text-expanded {
      display: block;
      transition: all 0.3s ease;
    }

    .hospitals-read-more-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      background: none;
      border: none;
      color: hsl(220 30% 15%);
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: all 0.2s ease;
      padding: 0;
    }

    .hospitals-read-more-link:hover {
      color: #0891b2;
      text-decoration-color: #0891b2;
    }

    .hospitals-promo-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .hospitals-promo-link {
      color: hsl(220 30% 15%);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.75rem 1rem;
      background: hsl(40 33% 96%);
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      border: 1px solid hsl(40 20% 88%);
    }

    .hospitals-promo-link:hover {
      background: #0891b2;
      color: white;
      border-color: #0891b2;
    }

    .hospitals-sidebar-health-tips-carousel {
      position: relative;
      width: 100%;
      height: 350px;
    }

    .hospitals-sidebar-health-tip-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      pointer-events: none;
    }

    .hospitals-sidebar-health-tip-card.active {
      opacity: 1;
      pointer-events: auto;
    }

    .hospitals-sidebar-health-tip-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .hospitals-sidebar-health-tip-heading {
      font-size: 1rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.4;
    }

    .hospitals-sidebar-health-tip-text {
      font-size: 0.85rem;
      color: hsl(220 20% 40%);
      line-height: 1.5;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-sidebar-health-tips-controls {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .hospitals-sidebar-health-tips-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: hsl(40 20% 88%);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .hospitals-sidebar-health-tips-dot.active {
      background: #0891b2;
      width: 24px;
      border-radius: 4px;
    }

    .hospitals-results-section {
      margin-top: 2rem;
    }

    .hospitals-section-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    /* Major/Popular Choices Section - Full Width Edge-to-Edge */
    .hospitals-popular-fullwidth {
      width: 100vw;
      position: relative;
      left: 50%;
      right: 50%;
      margin-left: -50vw;
      margin-right: -50vw;
      background: hsl(40 33% 96%);
      padding: 1.5rem 0;
      margin-top: -0.5rem;
      margin-bottom: 0;
    }

    .hospitals-popular-fullwidth-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hospitals-popular-section {
      margin-bottom: 0;
    }

    .hospitals-popular-container {
      position: relative;
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0;
      contain: layout;
    }

    .hospitals-popular-scroll-wrapper {
      display: flex;
      gap: 1.5rem;
      animation: hospitals-scroll-right-to-left 40s linear infinite;
      will-change: transform;
      width: max-content;
    }

    .hospitals-popular-scroll-wrapper:hover {
      animation-play-state: paused;
    }

    @keyframes hospitals-scroll-right-to-left {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .hospitals-popular-grid {
      display: flex;
      gap: 1.5rem;
      flex-shrink: 0;
    }

    .hospitals-popular-grid-duplicate {
      display: flex;
      gap: 1.5rem;
      flex-shrink: 0;
    }

    .hospitals-popular-card {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid hsl(40 20% 88%);
      overflow: hidden;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 280px;
      max-width: 280px;
    }

    .hospitals-popular-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: #0891b2;
    }

    .hospitals-popular-card-image {
      width: 100%;
      height: 140px;
      object-fit: cover;
    }

    .hospitals-popular-card-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .hospitals-popular-card-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.3;
    }

    .hospitals-popular-card-location {
      font-size: 0.8125rem;
      color: hsl(220 20% 40%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-popular-card-type {
      font-size: 0.75rem;
      color: #0891b2;
      font-weight: 500;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-popular-card-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: #e0f8fe;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #0891b2;
      margin-top: 0.25rem;
      width: fit-content;
    }

    /* Featured List Section */
    .hospitals-featured-section {
      margin-top: 0;
      width: 100%;
      max-width: 100%;
    }

    .hospitals-featured-note {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-style: italic;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-view-all-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .hospitals-btn-view-all {
      border: 2px solid hsl(40 20% 88%);
      background-color: #ffffff;
      color: hsl(220 30% 15%);
      padding: 0.625rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      width: 100%;
      max-width: 100%;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    @media (min-width: 640px) {
      .hospitals-btn-view-all {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        width: auto;
        max-width: none;
      }
    }

    .hospitals-btn-view-all:hover {
      background-color: hsl(40 20% 98%);
      border-color: #0891b2;
      color: #0891b2;
    }

    /* CTA Section */
    .hospitals-cta-section {
      margin-top: 3rem;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      border-radius: 1rem;
      padding: 2.5rem 2rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(8, 145, 178, 0.2);
    }

    .hospitals-cta-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .hospitals-cta-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .hospitals-cta-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.3;
    }

    .hospitals-cta-description {
      font-size: 0.9375rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 1.75rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .hospitals-cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.875rem 2rem;
      background: white;
      color: #0891b2;
      text-decoration: none;
      border-radius: 9999px;
      font-size: 1rem;
      font-weight: 600;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .hospitals-cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      background: hsl(40 33% 96%);
    }

    .hospitals-cta-pattern {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 1;
    }

    .hospitals-cta-pattern-2 {
      position: absolute;
      bottom: -30px;
      left: -30px;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 1;
    }

    @media (max-width: 767px) {
      .hospitals-cta-section {
        padding: 2rem 1.5rem;
        margin-top: 2rem;
      }

      .hospitals-cta-title {
        font-size: 1.25rem;
      }

      .hospitals-cta-description {
        font-size: 0.875rem;
      }

      .hospitals-cta-button {
        width: 100%;
        justify-content: center;
        padding: 0.875rem 1.5rem;
      }
    }

    .hospitals-featured-table {
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }

    .hospitals-featured-header {
      display: grid;
      grid-template-columns: 3fr 1.5fr 1.5fr 1.5fr;
      gap: 1.5rem;
      padding: 1.25rem 2rem;
      background: hsl(40 20% 94%);
      border-bottom: 1px solid hsl(40 20% 88%);
      font-weight: 600;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-featured-header > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .hospitals-featured-row {
      display: grid;
      grid-template-columns: 3fr 1.5fr 1.5fr 1.5fr;
      gap: 1.5rem;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid hsl(40 20% 88%);
      cursor: pointer;
      transition: all 0.2s ease;
      align-items: center;
      text-decoration: none;
      color: inherit;
      white-space: nowrap;
    }

    .hospitals-featured-row > div {
      min-width: 0;
    }

    .hospitals-featured-row:hover {
      background: hsl(40 20% 98%);
    }

    .hospitals-featured-row:last-child {
      border-bottom: none;
    }

    .hospitals-featured-name {
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-size: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .hospitals-featured-region,
    .hospitals-featured-type,
    .hospitals-featured-ownership,
    .hospitals-featured-services {
      color: hsl(220 20% 40%);
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .hospitals-featured-services {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.25rem;
      overflow: hidden;
    }

    .hospitals-featured-service-tag {
      padding: 0.25rem 0.5rem;
      background: hsl(40 33% 96%);
      border-radius: 0.25rem;
      font-size: 0.75rem;
      color: hsl(220 30% 15%);
    }

    .hospitals-empty {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
    }

    .hospitals-empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-empty-text {
      font-size: 1rem;
      color: hsl(220 20% 40%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    /* Right Sidebar */
    .hospitals-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-self: flex-start;
      height: fit-content;
    }

    .hospitals-sidebar-section {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .hospitals-sidebar-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #0891b2;
    }

    .hospitals-sidebar-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .hospitals-category-preview {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .hospitals-category-preview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.625rem 0.75rem;
      background: hsl(40 33% 96%);
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-category-preview-item:hover {
      background: #e0f8fe;
      border-color: #0891b2;
      transform: translateX(4px);
    }

    .hospitals-category-preview-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(220 30% 15%);
    }

    .hospitals-category-preview-count {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0891b2;
    }

    .hospitals-view-all-categories {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: #0891b2;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      width: 100%;
      justify-content: center;
    }

    .hospitals-view-all-categories:hover {
      background: #0e7490;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
    }

    .hospitals-filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .hospitals-filter-group:last-child {
      margin-bottom: 0;
    }

    .hospitals-filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-filter-select {
      width: 100%;
      padding: 0.75rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      background: white;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: all 0.2s ease;
    }

    .hospitals-filter-select:focus {
      outline: none;
      border-color: #0891b2;
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .hospitals-checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 150px;
      overflow-y: auto;
    }

    .hospitals-checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0;
      cursor: pointer;
    }

    .hospitals-checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: #0891b2;
    }

    .hospitals-checkbox-label {
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospitals-search-button {
      width: 100%;
      padding: 0.875rem;
      background: #0891b2;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
    }

    .hospitals-search-button:hover {
      background: #0e7490;
    }

    /* Region Navigation Bar */
    .hospitals-region-nav {
      display: flex;
      align-items: center;
      border-top: 2px solid #0891b2;
      border-bottom: 2px solid #0891b2;
      background: white;
      margin: 1.5rem 0;
      overflow-x: auto;
    }

    .hospitals-region-nav-links {
      display: flex;
      align-items: center;
      flex: 1;
      background: #e0f2fe;
      padding: 0.875rem 1rem;
      gap: 1.5rem;
      overflow-x: auto;
    }

    .hospitals-region-nav-link {
      color: hsl(220 30% 15%);
      text-decoration: none;
      font-size: 0.95rem;
      white-space: nowrap;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: color 0.2s ease;
      font-weight: 500;
    }

    .hospitals-region-nav-link:hover {
      color: #0891b2;
      text-decoration: underline;
    }

    .hospitals-region-nav-link.categories {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .hospitals-region-nav-link.categories:hover {
      color: #0891b2;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .hospitals-content-wrapper {
        padding-top: 60px;
      }

      .hospitals-main-content {
        padding: 1rem;
      }

      .hospitals-layout {
        grid-template-columns: 1fr;
      }

      .hospitals-sidebar {
        order: -1;
      }

      .hospitals-welcome-title {
        font-size: 1.5rem;
      }

      .hospitals-hero-image {
        height: 250px;
      }

      .hospitals-health-tips-grid {
        grid-template-columns: 1fr;
      }

      .hospitals-section-title {
        font-size: 1.5rem;
      }

      .hospitals-popular-grid {
        grid-template-columns: 1fr;
      }

      .hospitals-featured-header {
        display: none;
      }

      .hospitals-featured-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.5rem 1rem;
      }

      .hospitals-featured-name {
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
      }

      .hospitals-featured-region,
      .hospitals-featured-type,
      .hospitals-featured-ownership,
      .hospitals-featured-services {
        font-size: 0.875rem;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .hospitals-content-wrapper {
        padding-top: 70px;
      }

      .hospitals-main-content {
        padding: 1.5rem;
      }

      .hospitals-layout {
        grid-template-columns: 1fr 280px;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .hospitals-content-wrapper {
        padding-top: 120px;
      }

      .hospitals-main-content {
        padding: 2rem;
      }

      .hospitals-layout {
        grid-template-columns: 1fr 320px;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .hospitals-content-wrapper {
        padding-top: 120px;
      }

      .hospitals-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }

      .hospitals-layout {
        grid-template-columns: 1fr 350px;
      }
    }
  `;

  return (
    <div className="hospitals-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="hospitals-content-wrapper">
        <div className="hospitals-main-content">
          <div className="hospitals-breadcrumbs">
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>

          {/* Region Navigation Bar */}
          <nav className="hospitals-region-nav">
            <div className="hospitals-region-nav-links">
              <Link to="/directories/hospitals/categories" className="hospitals-region-nav-link categories">
                Categories
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Ashanti" 
                className="hospitals-region-nav-link"
              >
                Ashanti
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Bono" 
                className="hospitals-region-nav-link"
              >
                Brong Ahafo
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Central" 
                className="hospitals-region-nav-link"
              >
                Central
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Eastern" 
                className="hospitals-region-nav-link"
              >
                Eastern
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Greater Accra" 
                className="hospitals-region-nav-link"
              >
                G. Accra
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Northern" 
                className="hospitals-region-nav-link"
              >
                Northern
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Upper East" 
                className="hospitals-region-nav-link"
              >
                Upper East
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Upper West" 
                className="hospitals-region-nav-link"
              >
                Upper West
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Volta" 
                className="hospitals-region-nav-link"
              >
                Volta
              </Link>
              <Link 
                to="/directories/hospitals/all?region=Western" 
                className="hospitals-region-nav-link"
              >
                Western
              </Link>
            </div>
          </nav>
          
          <div className="hospitals-layout">
            {/* Main Content - Left Side */}
            <div className="hospitals-main-section">
              {/* Welcome Section */}
              <div className="hospitals-welcome-section">
                <div className="hospitals-hero-carousel-container">
                  <div className="hospitals-hero-carousel-wrapper">
                    {heroCarouselImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Healthcare in Ghana ${index + 1}`}
                        className={`hospitals-hero-image ${index === heroCarouselIndex ? 'active' : ''}`}
                      />
                    ))}
                    <button
                      className="hospitals-hero-carousel-controls prev"
                      onClick={prevHeroImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="hospitals-hero-carousel-controls next"
                      onClick={nextHeroImage}
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="hospitals-hero-carousel-dots">
                      {heroCarouselImages.map((_, index) => (
                        <button
                          key={index}
                          className={`hospitals-hero-carousel-dot ${index === heroCarouselIndex ? 'active' : ''}`}
                          onClick={() => setHeroCarouselIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <h1 className="hospitals-welcome-title">
                  Welcome to Ghana Hospitals Directory
                </h1>
                <div className="hospitals-welcome-text-container">
                  <div className={isWelcomeTextExpanded ? 'hospitals-welcome-text-expanded' : 'hospitals-welcome-text-collapsed'}>
                    <p className="hospitals-welcome-text">
                      <strong>Ghana National Resources System</strong> powered by <strong>Metascholar Consult Limited</strong> presents 
                      this comprehensive directory to ensure awareness about hospitals and healthcare facilities across Ghana. 
                      Whether you're seeking emergency care, routine treatment, or specialized medical services, this platform 
                      empowers you with the information needed to make informed healthcare decisions.
                    </p>
                    <p className="hospitals-welcome-text">
                      Our mission is to bridge the gap between patients and healthcare providers by offering detailed information 
                      about hospital locations, services offered, facility types, health insurance acceptance, and contact details. 
                      We understand that navigating healthcare can be challenging, and we're here to make finding the right medical 
                      facility easier and more accessible for everyone in Ghana.
                    </p>
                  </div>
                  <button
                    className="hospitals-read-more-link"
                    onClick={() => setIsWelcomeTextExpanded(!isWelcomeTextExpanded)}
                    aria-expanded={isWelcomeTextExpanded}
                    type="button"
                  >
                    {isWelcomeTextExpanded ? (
                      <>
                        Read Less
                        <ChevronRight size={16} style={{ transform: 'rotate(-90deg)', transition: 'transform 0.3s ease' }} />
                      </>
                    ) : (
                      <>
                        Read More
                        <ChevronRight size={16} style={{ transform: 'rotate(90deg)', transition: 'transform 0.3s ease' }} />
                      </>
                    )}
                  </button>
                </div>
                <div className="hospitals-promo-links">
                  <Link to="/directories/hospitals/list-facility" className="hospitals-promo-link">
                    Click here for listing your facility
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hospitals-sidebar">
              {/* Health Titbits Sidebar Carousel */}
              <div className="hospitals-sidebar-section">
                <h2 className="hospitals-sidebar-title">Health Titbits</h2>
                <div className="hospitals-sidebar-health-tips-carousel">
                  {healthTips.map((tip, index) => (
                    <div
                      key={index}
                      className={`hospitals-sidebar-health-tip-card ${index === healthTipsCarouselIndex ? 'active' : ''}`}
                    >
                      <img 
                        src={tip.image}
                        alt={tip.title}
                        className="hospitals-sidebar-health-tip-image"
                      />
                      <h3 className="hospitals-sidebar-health-tip-heading">
                        {tip.title}
                      </h3>
                      <p className="hospitals-sidebar-health-tip-text">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                  <div className="hospitals-sidebar-health-tips-controls">
                    {healthTips.map((_, index) => (
                      <button
                        key={index}
                        className={`hospitals-sidebar-health-tips-dot ${index === healthTipsCarouselIndex ? 'active' : ''}`}
                        onClick={() => setHealthTipsCarouselIndex(index)}
                        aria-label={`Go to tip ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Listing Sidebar */}
              <div className="hospitals-sidebar-section">
                <h2 className="hospitals-sidebar-title">Category Listing</h2>
                <div className="hospitals-category-preview">
                  <div className="hospitals-category-preview-item" onClick={() => navigate('/directories/hospitals/categories')}>
                    <span className="hospitals-category-preview-name">Hospital</span>
                    <span className="hospitals-category-preview-count">(2,536)</span>
                  </div>
                  <div className="hospitals-category-preview-item" onClick={() => navigate('/directories/hospitals/categories')}>
                    <span className="hospitals-category-preview-name">Pharmacy</span>
                    <span className="hospitals-category-preview-count">(547)</span>
                  </div>
                  <div className="hospitals-category-preview-item" onClick={() => navigate('/directories/hospitals/categories')}>
                    <span className="hospitals-category-preview-name">Laboratory</span>
                    <span className="hospitals-category-preview-count">(103)</span>
                  </div>
                  <div className="hospitals-category-preview-item" onClick={() => navigate('/directories/hospitals/categories')}>
                    <span className="hospitals-category-preview-name">Maternity Home</span>
                    <span className="hospitals-category-preview-count">(217)</span>
                  </div>
                </div>
                <Link 
                  to="/directories/hospitals/categories" 
                  className="hospitals-view-all-categories"
                >
                  View All Categories →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Major/Popular Choices Section - Full Width Edge-to-Edge */}
        <div className="hospitals-popular-fullwidth">
          <div className="hospitals-popular-fullwidth-content">
            <div className="hospitals-popular-section">
              <h2 className="hospitals-section-title">Major/Popular Choices</h2>
              <div className="hospitals-popular-container">
                <div className="hospitals-popular-scroll-wrapper">
                  <div className="hospitals-popular-grid">
                    {filteredHospitals.map((hospital) => (
                      <Link
                        key={hospital.id}
                        to={`/directories/hospitals/${hospital.id}`}
                        className="hospitals-popular-card"
                      >
                        <img
                          src={hospital.imageUrl}
                          alt={hospital.name}
                          className="hospitals-popular-card-image"
                        />
                        <div className="hospitals-popular-card-content">
                          <h3 className="hospitals-popular-card-name">{hospital.name}</h3>
                          <p className="hospitals-popular-card-location">{hospital.location}</p>
                          <p className="hospitals-popular-card-type">{hospital.facilityType}</p>
                          {hospital.nhisAccredited && (
                            <span className="hospitals-popular-card-badge">NHIS</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Duplicate for seamless loop */}
                  <div className="hospitals-popular-grid-duplicate">
                    {filteredHospitals.map((hospital) => (
                      <Link
                        key={`duplicate-${hospital.id}`}
                        to={`/directories/hospitals/${hospital.id}`}
                        className="hospitals-popular-card"
                      >
                        <img
                          src={hospital.imageUrl}
                          alt={hospital.name}
                          className="hospitals-popular-card-image"
                        />
                        <div className="hospitals-popular-card-content">
                          <h3 className="hospitals-popular-card-name">{hospital.name}</h3>
                          <p className="hospitals-popular-card-location">{hospital.location}</p>
                          <p className="hospitals-popular-card-type">{hospital.facilityType}</p>
                          {hospital.nhisAccredited && (
                            <span className="hospitals-popular-card-badge">NHIS</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue with Featured Hospitals - Full Width */}
        <div className="hospitals-main-content">
          <div className="hospitals-featured-section">
            <h2 className="hospitals-section-title">Featured Hospitals</h2>
            <div className="hospitals-featured-table">
              <div className="hospitals-featured-header">
                <div>Hospital Name</div>
                <div>Region</div>
                <div>Type</div>
                <div>Ownership</div>
              </div>
              {filteredHospitals.slice(4, 14).map((hospital) => (
                <Link
                  key={hospital.id}
                  to={`/directories/hospitals/${hospital.id}`}
                  className="hospitals-featured-row"
                >
                  <div className="hospitals-featured-name">{hospital.name}</div>
                  <div className="hospitals-featured-region">{hospital.region}</div>
                  <div className="hospitals-featured-type">{hospital.facilityType}</div>
                  <div className="hospitals-featured-ownership">{hospital.ownership}</div>
                </Link>
              ))}
            </div>
            <div className="hospitals-view-all-wrapper">
              <Link
                to="/directories/hospitals/all"
                className="hospitals-btn-view-all"
              >
                View All Hospitals
              </Link>
            </div>

            {/* CTA Section */}
            <div className="hospitals-cta-section">
              <div className="hospitals-cta-pattern"></div>
              <div className="hospitals-cta-pattern-2"></div>
              <div className="hospitals-cta-content">
                <div className="hospitals-cta-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#0891b2"/>
                  </svg>
                </div>
                <h3 className="hospitals-cta-title">
                  Own a Healthcare Facility?
                </h3>
                <p className="hospitals-cta-description">
                  Join our growing directory and make your facility more visible to thousands of patients across Ghana. It's quick, easy, and free!
                </p>
                <Link to="/directories/hospitals/list-facility" className="hospitals-cta-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                  </svg>
                  List Your Facility Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Hospitals;
