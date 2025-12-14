import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Search } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  location: string;
  region: string;
  district?: string;
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

const AllHospitals: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('all');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('all');
  const [selectedServices, setSelectedServices] = useState<string>('all');
  const [selectedHealthInsurance, setSelectedHealthInsurance] = useState<string>('all');

  // Ghana regions
  const regions = [
    'Greater Accra', 'Ashanti', 'Northern', 'Central', 'Bono', 'Volta', 
    'Eastern', 'Upper East', 'Upper West', 'Western', 'Bono East', 
    'Ahafo', 'Oti', 'Western North', 'Savannah', 'North East'
  ];

  // Districts by region (sample data - expand as needed)
  const districtsByRegion: Record<string, string[]> = {
    'Greater Accra': ['Accra Metropolitan', 'Tema Metropolitan', 'Ga East', 'Ga West', 'La Nkwantanang Madina', 'Ledzokuku', 'Krowor', 'Adenta', 'Ashaiman', 'Ayawaso', 'Korle Klottey', 'Okaikwei', 'Weija Gbawe'],
    'Ashanti': ['Kumasi Metropolitan', 'Obuasi Municipal', 'Ejisu Juaben', 'Mampong', 'Asante Akim North', 'Asante Akim South', 'Atwima', 'Bekwai', 'Bosomtwe', 'Offinso', 'Sekyere'],
    'Volta': ['Ho Municipal', 'Hohoe', 'Jasikan', 'Kadjebi', 'Keta', 'Keta Municipal', 'Ketu', 'Ketu South', 'Kpando', 'Krachi East', 'Krachi West', 'Nkwanta', 'North Tongu', 'South Dayi', 'South Tongu', 'Adaklu-Anyigbe', 'Akatsi'],
    'Central': ['Cape Coast Metropolitan', 'Komenda Edina Eguafo Abirem', 'Mfantsiman', 'Abura Asebu Kwamankese', 'Agona', 'Ajumako Enyan Esiam', 'Asikuma Odoben Brakwa', 'Assin North', 'Assin South', 'Awutu Senya', 'Effutu', 'Ekumfi', 'Gomoa', 'Twifo Hemang Lower Denkyira', 'Upper Denkyira East', 'Upper Denkyira West'],
    'Eastern': ['Koforidua', 'New Juaben', 'Akuapim North', 'Akuapim South', 'Akyemansa', 'Asuogyaman', 'Atiwa', 'Ayensuano', 'Birim Central', 'Birim North', 'Birim South', 'East Akim', 'Fanteakwa', 'Kwahu East', 'Kwahu South', 'Kwahu West', 'Lower Manya Krobo', 'Upper Manya Krobo', 'Nsawam Adoagyiri', 'Suhum Kraboa Coaltar', 'West Akim', 'Yilo Krobo'],
    'Northern': ['Tamale Metropolitan', 'Sagnarigu', 'Gushegu', 'Karaga', 'Kumbungu', 'Mion', 'Nanton', 'Saboba', 'Savelugu', 'Tatale', 'Tolon', 'Yendi', 'Zabzugu', 'Bunkpurugu Nakpanduri', 'Chereponi', 'East Gonja', 'East Mamprusi', 'Gushiegu', 'Mamprugu Moagduri', 'Nanumba North', 'Nanumba South', 'North Gonja', 'Saboba', 'Sawla Tuna Kalba', 'West Gonja', 'West Mamprusi', 'Yendi'],
    'Western': ['Sekondi Takoradi Metropolitan', 'Ahanta West', 'Nzema East', 'Nzema West', 'Ellembelle', 'Jomoro', 'Mpohor', 'Prestea Huni Valley', 'Shama', 'Tarkwa Nsuaem', 'Wassa Amenfi East', 'Wassa Amenfi West', 'Wassa East', 'Bibiani Anhwiaso Bekwai', 'Juabeso', 'Sefwi Akontombra', 'Sefwi Wiawso'],
    'Bono': ['Sunyani Municipal', 'Sunyani West', 'Banda', 'Berekum', 'Dormaa Central', 'Dormaa East', 'Dormaa West', 'Jaman North', 'Jaman South', 'Tain', 'Wenchi'],
    'Bono East': ['Techiman Municipal', 'Atebubu Amantin', 'Kintampo North', 'Kintampo South', 'Nkoranza North', 'Nkoranza South', 'Pru', 'Sene East', 'Sene West', 'Techiman North'],
    'Ahafo': ['Goaso', 'Asunafo North', 'Asunafo South', 'Asutifi North', 'Asutifi South', 'Tano North', 'Tano South'],
    'Oti': ['Dambai', 'Biakoye', 'Jasikan', 'Kadjebi', 'Krachi East', 'Krachi Nchumuru', 'Krachi West', 'Nkwanta North', 'Nkwanta South'],
    'Western North': ['Sefwi Wiawso', 'Aowin', 'Bibiani Anhwiaso Bekwai', 'Bodi', 'Juabeso', 'Sefwi Akontombra', 'Sefwi Wiawso', 'Suaman'],
    'Savannah': ['Damongo', 'Bole', 'Central Gonja', 'East Gonja', 'North Gonja', 'West Gonja'],
    'North East': ['Nalerigu', 'Bunkpurugu Nakpanduri', 'Chereponi', 'East Mamprusi', 'Mamprugu Moagduri', 'West Mamprusi', 'Yunyoo Nasuan'],
    'Upper East': ['Bolgatanga Municipal', 'Bawku Municipal', 'Bawku West', 'Binduri', 'Bolgatanga East', 'Bongo', 'Builsa North', 'Builsa South', 'Garu', 'Kassena Nankana East', 'Kassena Nankana West', 'Nabdam', 'Pusiga', 'Talensi'],
    'Upper West': ['Wa Municipal', 'Daffiama Bussie Issa', 'Jirapa', 'Lambussie Karni', 'Lawra', 'Nadowli', 'Nandom', 'Sissala East', 'Sissala West', 'Wa East', 'Wa West']
  };

  // Facility types
  const facilityTypes = [
    'Select',
    'Primary Hospital', 'Secondary Hospital', 'Tertiary Hospital', 
    'Clinic', 'Health Centre', 'CHPS Compound', 'Maternity Home', 
    'Eye Clinic', 'Dental Clinic', 'Diagnostic Centre', 'Pharmacy', 
    'Scan Centre', 'Laboratory'
  ];

  // Ownership types
  const ownershipTypes = ['Select', 'Private', 'Government', 'Mission (CHAG)'];

  // Services
  const services = [
    'Select',
    'General Services', 'Scan', 'ECG', 'Antenatal', 'Pharmacy', 
    'Pediatrics', 'Surgery', 'Dental', 'Eye', 'Skin', 'ENT', 
    'Emergency', 'Maternity', 'Laboratory', 'Radiology'
  ];

  // Health insurance options
  const healthInsuranceOptions = [
    'Select',
    'NHIS', 'Medex', 'Momentum', 'Glico Health Plan', 
    'Nationwide', 'First Fidelity Health', 'Premier Health Insurance'
  ];

  // Category options (from the removed category search)
  const categories = [
    { name: 'Hospital', count: 2536 },
    { name: 'Pharmacy', count: 547 },
    { name: 'Laboratory', count: 103 },
    { name: 'Maternity Home', count: 217 },
    { name: 'Clinic', count: 892 },
    { name: 'Health Centre', count: 445 },
    { name: 'CHPS Compound', count: 1234 },
    { name: 'Eye Clinic', count: 89 },
    { name: 'Dental Clinic', count: 156 },
    { name: 'Diagnostic Centre', count: 234 },
    { name: 'Scan Centre', count: 178 },
    { name: 'Primary Hospital', count: 456 },
    { name: 'Secondary Hospital', count: 234 },
    { name: 'Tertiary Hospital', count: 12 }
  ];

  // Mock hospital data - replace with actual API data
  const hospitals: Hospital[] = [
    {
      id: '1',
      name: 'Korle Bu Teaching Hospital',
      location: 'Korle Bu, Accra',
      region: 'Greater Accra',
      district: 'Korle Klottey',
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
      district: 'Kumasi Metropolitan',
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
      name: 'Ridge Hospital',
      location: 'Ridge, Accra',
      region: 'Greater Accra',
      district: 'Korle Klottey',
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
      id: '4',
      name: 'Trust Hospital',
      location: 'Osu, Accra',
      region: 'Greater Accra',
      district: 'Korle Klottey',
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
      id: '5',
      name: 'Ho Teaching Hospital',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
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
      id: '6',
      name: 'HO MUNICIPAL HOSPITAL',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '7',
      name: 'HO POLYCLINIC',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Clinic',
      ownership: 'Government',
      services: ['General Services'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '8',
      name: 'MATER ECCLESIAE CLINIC',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Clinic',
      ownership: 'Mission (CHAG)',
      services: ['General Services', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '9',
      name: 'NEW SEED INT CLINIC',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Clinic',
      ownership: 'Private',
      services: ['General Services'],
      healthInsurance: ['NHIS'],
      nhisAccredited: false,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '10',
      name: 'FORESIGHT MEDICAL CENTRE',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Clinic',
      ownership: 'Private',
      services: ['General Services'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '11',
      name: 'GISELA MEMORIAL MATERNITY CLINIC',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Maternity Home',
      ownership: 'Private',
      services: ['Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '12',
      name: 'HEM PHARMA SERVICES LTD',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Pharmacy',
      ownership: 'Private',
      services: ['Pharmacy'],
      healthInsurance: ['NHIS'],
      nhisAccredited: false,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '13',
      name: 'HO ROYAL HOSPITAL',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Hospital',
      ownership: 'Private',
      services: ['General Services', 'Emergency'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '14',
      name: 'LICABAN PHAMARCY',
      location: 'Ho',
      region: 'Volta',
      district: 'Ho Municipal',
      facilityType: 'Pharmacy',
      ownership: 'Private',
      services: ['Pharmacy'],
      healthInsurance: ['NHIS'],
      nhisAccredited: false,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '15',
      name: 'HOHOE MUNICIPAL HOSPITAL',
      location: 'Hohoe',
      region: 'Volta',
      district: 'Hohoe',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '16',
      name: 'KETA MUNICIPAL HOSPITAL',
      location: 'Keta',
      region: 'Volta',
      district: 'Keta Municipal',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '17',
      name: 'KPANDO DISTRICT HOSPITAL',
      location: 'Kpando',
      region: 'Volta',
      district: 'Kpando',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '18',
      name: 'JASIKAN DISTRICT HOSPITAL',
      location: 'Jasikan',
      region: 'Volta',
      district: 'Jasikan',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '19',
      name: 'NKWANTA DISTRICT HOSPITAL',
      location: 'Nkwanta',
      region: 'Volta',
      district: 'Nkwanta',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '20',
      name: 'AKATSI DISTRICT HOSPITAL',
      location: 'Akatsi',
      region: 'Volta',
      district: 'Akatsi',
      facilityType: 'Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Get available districts based on selected region
  const availableDistricts = useMemo(() => {
    if (selectedRegion === 'all') return [];
    return districtsByRegion[selectedRegion] || [];
  }, [selectedRegion]);

  // Filter hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(hospital => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hospital.district && hospital.district.toLowerCase().includes(searchQuery.toLowerCase()));

      // Region filter
      const matchesRegion = selectedRegion === 'all' || hospital.region === selectedRegion;

      // District filter
      const matchesDistrict = selectedDistrict === 'all' || hospital.district === selectedDistrict;

      // Facility type filter
      const matchesFacilityType = selectedFacilityType === 'all' || 
        hospital.facilityType.toLowerCase().includes(selectedFacilityType.toLowerCase());

      // Ownership filter
      const matchesOwnership = selectedOwnership === 'all' || 
        hospital.ownership.toLowerCase().includes(selectedOwnership.toLowerCase());

      // Services filter
      const matchesServices = selectedServices === 'all' || 
        hospital.services.some(service => 
          service.toLowerCase().includes(selectedServices.toLowerCase())
        );

      // Health insurance filter
      const matchesHealthInsurance = selectedHealthInsurance === 'all' || 
        hospital.healthInsurance.some(insurance => 
          insurance.toLowerCase().includes(selectedHealthInsurance.toLowerCase())
        );

      return matchesSearch && matchesRegion && matchesDistrict && 
             matchesFacilityType && matchesOwnership && matchesServices && matchesHealthInsurance;
    });
  }, [searchQuery, selectedRegion, selectedDistrict, selectedFacilityType, selectedOwnership, selectedServices, selectedHealthInsurance]);

  const isolatedStyles = `
    .all-hospitals-page {
      width: 100%;
      margin: 0;
      padding: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #ffffff;
      min-height: 100vh;
    }

    .all-hospitals-content-wrapper {
      min-height: calc(100vh - 80px);
      padding-top: 60px;
      padding-bottom: 4rem;
    }

    @media (min-width: 768px) {
      .all-hospitals-content-wrapper {
        padding-top: 70px;
      }
    }

    @media (min-width: 1200px) {
      .all-hospitals-content-wrapper {
        padding-top: 120px;
      }
    }

    .all-hospitals-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    @media (min-width: 1024px) {
      .all-hospitals-container {
        display: grid;
        grid-template-columns: 250px 1fr 280px;
        gap: 2rem;
        padding: 2rem;
      }
    }

    /* Header Section */
    .all-hospitals-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      grid-column: 1 / -1;
    }

    .all-hospitals-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      font-family: 'Playfair Display', serif;
    }

    @media (min-width: 640px) {
      .all-hospitals-title {
        font-size: 2.5rem;
      }
    }

    .all-hospitals-subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    /* Search Bar */
    .all-hospitals-search-container {
      position: relative;
      margin-bottom: 2rem;
      grid-column: 1 / -1;
    }

    .all-hospitals-search-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
      font-family: 'DM Sans', system-ui, sans-serif;
    }

    .all-hospitals-search-input:focus {
      outline: none;
      border-color: #0891b2;
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .all-hospitals-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 20px;
      height: 20px;
    }

    /* Left Sidebar - Regions/Districts */
    .all-hospitals-left-sidebar {
      margin-bottom: 2rem;
      display: none;
    }

    @media (min-width: 1024px) {
      .all-hospitals-left-sidebar {
        display: block;
        padding: 1.25rem;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        height: fit-content;
        align-self: flex-start;
      }
    }

    @media (min-width: 1200px) {
      .all-hospitals-left-sidebar {
        padding: 1.5rem;
      }
    }

    .all-hospitals-sidebar-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
      font-family: 'Playfair Display', serif;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #0891b2;
      background-color: #0891b2;
      color: white;
      padding: 0.75rem 1rem;
      margin: -1.5rem -1.5rem 1rem -1.5rem;
      border-radius: 0.75rem 0.75rem 0 0;
    }

    .all-hospitals-filter-group {
      margin-bottom: 1.5rem;
    }

    .all-hospitals-filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      display: block;
    }

    .all-hospitals-filter-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .all-hospitals-filter-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-size: 0.875rem;
      color: #374151;
    }

    .all-hospitals-filter-item:hover {
      background-color: #f3f4f6;
      color: #0891b2;
    }

    .all-hospitals-filter-item.selected {
      background-color: #e0f8fe;
      color: #0891b2;
      font-weight: 600;
    }

    .all-hospitals-radio {
      width: 16px;
      height: 16px;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      position: relative;
      flex-shrink: 0;
      cursor: pointer;
      transition: all 0.2s;
    }

    .all-hospitals-filter-item.selected .all-hospitals-radio {
      border-color: #0891b2;
    }

    .all-hospitals-filter-item.selected .all-hospitals-radio::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background-color: #0891b2;
      border-radius: 50%;
    }

    /* Main Content */
    .all-hospitals-main-content {
      flex: 1;
    }

    .all-hospitals-list-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1.5rem 0;
      font-family: 'Playfair Display', serif;
      color: #0891b2;
    }

    .all-hospitals-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .all-hospitals-list {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
    }

    @media (min-width: 1024px) {
      .all-hospitals-list {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
    }

    @media (min-width: 1200px) {
      .all-hospitals-list {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
    }

    @media (min-width: 1600px) {
      .all-hospitals-list {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
    }

    .all-hospitals-item {
      padding: 0.75rem 1rem;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      text-decoration: none;
      color: #2563eb;
      font-size: 0.9375rem;
      transition: all 0.2s;
      display: block;
      text-align: left;
    }

    .all-hospitals-item:hover {
      border-color: #0891b2;
      background-color: #e0f8fe;
      color: #0891b2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(8, 145, 178, 0.1);
    }

    .all-hospitals-item-name {
      font-weight: 500;
      text-decoration: underline;
    }

    /* Right Sidebar - Category Search */
    .all-hospitals-right-sidebar {
      margin-bottom: 2rem;
      display: none;
    }

    @media (min-width: 1024px) {
      .all-hospitals-right-sidebar {
        display: block;
        padding: 0;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        height: fit-content;
        align-self: flex-start;
        overflow: hidden;
      }
    }

    @media (min-width: 1200px) {
      .all-hospitals-right-sidebar {
        min-width: 300px;
      }
    }

    .all-hospitals-category-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
      margin: 0;
      font-family: 'DM Sans', system-ui, sans-serif;
      padding: 0.75rem 1rem;
      background-color: #0891b2;
      text-align: left;
    }

    .all-hospitals-category-form {
      padding: 1rem;
    }

    @media (min-width: 1200px) {
      .all-hospitals-category-form {
        padding: 1.5rem;
      }
    }

    .all-hospitals-form-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      gap: 0.5rem;
    }

    .all-hospitals-form-row:last-of-type {
      margin-bottom: 0;
    }

    @media (min-width: 1200px) {
      .all-hospitals-form-row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
    }

    .all-hospitals-form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      white-space: nowrap;
      flex-shrink: 0;
    }

    @media (min-width: 1200px) {
      .all-hospitals-form-label {
        min-width: 120px;
      }
    }

    .all-hospitals-form-select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, sans-serif;
      background-color: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      padding-right: 2.5rem;
    }

    @media (min-width: 1200px) {
      .all-hospitals-form-select {
        flex: 1;
        width: auto;
      }
    }

    .all-hospitals-form-select:focus {
      outline: none;
      border-color: #0891b2;
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .all-hospitals-search-button {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      font-family: 'DM Sans', system-ui, sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1.5rem;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
    }

    .all-hospitals-search-button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
    }

    .all-hospitals-search-button:active {
      transform: translateY(0);
    }

    .all-hospitals-no-results {
      padding: 3rem 0;
      text-align: center;
      color: #6b7280;
      grid-column: 1 / -1;
    }

    /* Mobile: Show filters as dropdown */
    @media (max-width: 1023px) {
      .all-hospitals-mobile-filters {
        display: block;
        margin-bottom: 1.5rem;
      }

      .all-hospitals-mobile-filter-select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 0.9375rem;
        font-family: 'DM Sans', system-ui, sans-serif;
        background-color: white;
        margin-bottom: 1rem;
      }

      .all-hospitals-mobile-filter-select:focus {
        outline: none;
        border-color: #0891b2;
        box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
      }
    }

    @media (min-width: 1024px) {
      .all-hospitals-mobile-filters {
        display: none;
      }
    }
  `;

  return (
    <div className="all-hospitals-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="all-hospitals-content-wrapper">
        <div className="all-hospitals-container">
          {/* Header */}
          <div className="all-hospitals-header">
            <h1 className="all-hospitals-title">All Hospitals</h1>
            <p className="all-hospitals-subtitle">
              Browse and search through all healthcare facilities in Ghana
            </p>
          </div>

          {/* Search Bar */}
          <div className="all-hospitals-search-container">
            <Search className="all-hospitals-search-icon" />
            <input
              className="all-hospitals-search-input"
              type="text"
              placeholder="Search hospitals by name, location, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Filters */}
          <div className="all-hospitals-mobile-filters">
            <select
              className="all-hospitals-mobile-filter-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedDistrict('all');
              }}
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {availableDistricts.length > 0 && (
              <select
                className="all-hospitals-mobile-filter-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="all">All Districts</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            )}
            <select
              className="all-hospitals-mobile-filter-select"
              value={selectedFacilityType}
              onChange={(e) => setSelectedFacilityType(e.target.value)}
            >
              <option value="all">All Facility Types</option>
              {facilityTypes.filter(type => type !== 'Select').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              className="all-hospitals-mobile-filter-select"
              value={selectedOwnership}
              onChange={(e) => setSelectedOwnership(e.target.value)}
            >
              <option value="all">All Ownership</option>
              {ownershipTypes.filter(type => type !== 'Select').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              className="all-hospitals-mobile-filter-select"
              value={selectedServices}
              onChange={(e) => setSelectedServices(e.target.value)}
            >
              <option value="all">All Services</option>
              {services.filter(service => service !== 'Select').map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            <select
              className="all-hospitals-mobile-filter-select"
              value={selectedHealthInsurance}
              onChange={(e) => setSelectedHealthInsurance(e.target.value)}
            >
              <option value="all">All Health Insurance</option>
              {healthInsuranceOptions.filter(insurance => insurance !== 'Select').map(insurance => (
                <option key={insurance} value={insurance}>{insurance}</option>
              ))}
            </select>
          </div>

          {/* Left Sidebar - Regions/Districts */}
          <div className="all-hospitals-left-sidebar">
            <h2 className="all-hospitals-sidebar-title">Regions & Districts</h2>
            
            <div className="all-hospitals-filter-group">
              <label className="all-hospitals-filter-label">Regions</label>
              <ul className="all-hospitals-filter-list">
                <li
                  className={`all-hospitals-filter-item ${selectedRegion === 'all' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRegion('all');
                    setSelectedDistrict('all');
                  }}
                >
                  <div className="all-hospitals-radio" />
                  <span>All Regions</span>
                </li>
                {regions.map(region => (
                  <li
                    key={region}
                    className={`all-hospitals-filter-item ${selectedRegion === region ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRegion(region);
                      setSelectedDistrict('all');
                    }}
                  >
                    <div className="all-hospitals-radio" />
                    <span>{region}</span>
                  </li>
                ))}
              </ul>
            </div>

            {availableDistricts.length > 0 && (
              <div className="all-hospitals-filter-group">
                <label className="all-hospitals-filter-label">Districts</label>
                <ul className="all-hospitals-filter-list">
                  <li
                    className={`all-hospitals-filter-item ${selectedDistrict === 'all' ? 'selected' : ''}`}
                    onClick={() => setSelectedDistrict('all')}
                  >
                    <div className="all-hospitals-radio" />
                    <span>All Districts</span>
                  </li>
                  {availableDistricts.map(district => (
                    <li
                      key={district}
                      className={`all-hospitals-filter-item ${selectedDistrict === district ? 'selected' : ''}`}
                      onClick={() => setSelectedDistrict(district)}
                    >
                      <div className="all-hospitals-radio" />
                      <span>{district}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="all-hospitals-main-content">
            <h2 className="all-hospitals-list-title">
              List of facilities ({filteredHospitals.length})
            </h2>
            
            {filteredHospitals.length > 0 ? (
              <div className="all-hospitals-list">
                {filteredHospitals.map((hospital) => (
                  <Link
                    key={hospital.id}
                    to={`/directories/hospitals/${hospital.id}`}
                    className="all-hospitals-item"
                  >
                    <span className="all-hospitals-item-name">{hospital.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="all-hospitals-no-results">
                <p>No hospitals found matching your search criteria.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Category Search */}
          <div className="all-hospitals-right-sidebar">
            <h2 className="all-hospitals-category-title">Category Search</h2>
            <div className="all-hospitals-category-form">
              <div className="all-hospitals-form-row">
                <label className="all-hospitals-form-label">Region:</label>
                <select
                  className="all-hospitals-form-select"
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedDistrict('all');
                  }}
                >
                  <option value="all">Select</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="all-hospitals-form-row">
                <label className="all-hospitals-form-label">Facility Type:</label>
                <select
                  className="all-hospitals-form-select"
                  value={selectedFacilityType}
                  onChange={(e) => setSelectedFacilityType(e.target.value)}
                >
                  {facilityTypes.map(type => (
                    <option key={type} value={type === 'Select' ? 'all' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="all-hospitals-form-row">
                <label className="all-hospitals-form-label">Ownership:</label>
                <select
                  className="all-hospitals-form-select"
                  value={selectedOwnership}
                  onChange={(e) => setSelectedOwnership(e.target.value)}
                >
                  {ownershipTypes.map(type => (
                    <option key={type} value={type === 'Select' ? 'all' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="all-hospitals-form-row">
                <label className="all-hospitals-form-label">Services:</label>
                <select
                  className="all-hospitals-form-select"
                  value={selectedServices}
                  onChange={(e) => setSelectedServices(e.target.value)}
                >
                  {services.map(service => (
                    <option key={service} value={service === 'Select' ? 'all' : service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="all-hospitals-form-row">
                <label className="all-hospitals-form-label">Health Insurance:</label>
                <select
                  className="all-hospitals-form-select"
                  value={selectedHealthInsurance}
                  onChange={(e) => setSelectedHealthInsurance(e.target.value)}
                >
                  {healthInsuranceOptions.map(insurance => (
                    <option key={insurance} value={insurance === 'Select' ? 'all' : insurance}>
                      {insurance}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="all-hospitals-search-button"
                onClick={() => {
                  // Filters are already applied via state, this button can trigger a search action if needed
                  // For now, it just ensures the filters are applied
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllHospitals;

