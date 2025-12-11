import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface University {
  id: string;
  name: string;
  region: string;
  type: string;
  tuitionFee: string;
  admissionCutOff: string;
  programs: string;
  specialization: string;
  logo?: string;
  description: string;
  campus?: string[];
  studentPopulation?: string;
  yearEstablished?: string;
}

const Universities: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // University logo mapping from Cloudinary
  const universityLogos: Record<string, string> = {
    'University of Ghana': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png',
    'Kwame Nkrumah University of Science and Technology': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png',
    'University of Cape Coast': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png',
    'Ghana Institute of Management and Public Administration': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png',
    'University of Education, Winneba': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png',
    'University for Development Studies': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379766/0a0d9027-8f25-4d2f-a291-8fae7914dec3.png',
    'University of Mines and Technology': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1759428982/WhatsApp_Image_2025-10-02_at_15.46.11_f720a723_lzrtfp.jpg',
    'Catholic University of Ghana': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756722559/catholic-university-ghana-logo_onhrgj.jpg',
    'Pentecost University College': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756722725/OIP_czwzp0.webp',
    'University of Energy and Natural Resources': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1758510525/download_uxkc4q.jpg',
    'Accra Institute of Technology': 'https://res.cloudinary.com/dsypclqxk/image/upload/v1759428988/WhatsApp_Image_2025-10-02_at_15.47.06_33dd4bda_pj0a6t.jpg',
  };

  // Mock university data - replace with actual API data
  const universities: University[] = [
    {
      id: '1',
      name: 'University of Ghana',
      region: 'Greater Accra',
      type: 'Public',
      tuitionFee: 'GHS 2,500 - 4,500',
      admissionCutOff: 'Aggregate 6-24',
      programs: '100+ Programs',
      specialization: 'Research & Medicine',
      logo: universityLogos['University of Ghana'],
      description: 'The University of Ghana is the oldest and largest of the thirteen Ghanaian national public universities. It was founded in 1948 and is located in Legon, Accra. The university offers a wide range of undergraduate and postgraduate programs across various disciplines including Arts, Sciences, Business, Law, Medicine, and Engineering.',
      campus: ['Legon', 'Accra City'],
      studentPopulation: '40,000+',
      yearEstablished: '1948'
    },
    {
      id: '2',
      name: 'Kwame Nkrumah University of Science and Technology',
      region: 'Ashanti',
      type: 'Public',
      tuitionFee: 'GHS 2,200 - 4,200',
      admissionCutOff: 'Aggregate 6-26',
      programs: '80+ Programs',
      specialization: 'Science & Engineering',
      logo: universityLogos['Kwame Nkrumah University of Science and Technology'],
      description: 'KNUST is a public university located in Kumasi, Ghana. It focuses on science and technology education and is one of the leading universities in Africa. The university is known for its strong engineering, technology, and applied sciences programs.',
      campus: ['Kumasi'],
      studentPopulation: '35,000+',
      yearEstablished: '1952'
    },
    {
      id: '3',
      name: 'University of Cape Coast',
      region: 'Central',
      type: 'Public',
      tuitionFee: 'GHS 2,000 - 3,800',
      admissionCutOff: 'Aggregate 8-28',
      programs: '60+ Programs',
      specialization: 'Education & Research',
      logo: universityLogos['University of Cape Coast'],
      description: 'The University of Cape Coast is a public university located in Cape Coast, Ghana. It was established in 1962 and specializes in education and research. The university is known for its strong programs in education, sciences, humanities, and social sciences.',
      campus: ['Cape Coast'],
      studentPopulation: '25,000+',
      yearEstablished: '1962'
    },
    {
      id: '4',
      name: 'Ashesi University',
      region: 'Eastern',
      type: 'Private',
      tuitionFee: 'GHS 15,000 - 18,000',
      admissionCutOff: 'Aggregate 6-12',
      programs: '15+ Programs',
      specialization: 'Leadership & Innovation',
      logo: undefined, // No logo found for Ashesi
      description: 'Ashesi University is a private, non-profit liberal arts university located in Berekuso, Ghana. Founded in 2002, Ashesi has gained recognition for its innovative approach to education and its focus on ethical leadership and entrepreneurship. The university offers programs in Business Administration, Computer Science, Management Information Systems, and Engineering.',
      campus: ['Berekuso'],
      studentPopulation: '1,200+',
      yearEstablished: '2002'
    },
    {
      id: '5',
      name: 'Ghana Institute of Management and Public Administration',
      region: 'Greater Accra',
      type: 'Public',
      tuitionFee: 'GHS 2,800 - 5,000',
      admissionCutOff: 'Aggregate 10-30',
      programs: '30+ Programs',
      specialization: 'Management & Governance',
      logo: universityLogos['Ghana Institute of Management and Public Administration'],
      description: 'GIMPA is a public university located in Accra, Ghana. It specializes in management, public administration, and governance education. The institute offers executive education and degree programs in Business Administration, Public Administration, and related fields.',
      campus: ['Accra'],
      studentPopulation: '8,000+',
      yearEstablished: '1961'
    },
    {
      id: '6',
      name: 'University of Professional Studies',
      region: 'Greater Accra',
      type: 'Public',
      tuitionFee: 'GHS 2,400 - 4,500',
      admissionCutOff: 'Aggregate 8-28',
      programs: '40+ Programs',
      specialization: 'Professional Studies',
      logo: undefined, // No logo found for UPSA
      description: 'UPSA is a public university located in Accra, Ghana. It focuses on professional studies including accounting, finance, marketing, and management. The university is known for producing skilled professionals for the business sector and offers programs in Business Administration, Accounting, Marketing, and Communication Studies.',
      campus: ['Accra'],
      studentPopulation: '12,000+',
      yearEstablished: '1965'
    },
    {
      id: '7',
      name: 'Central University',
      region: 'Greater Accra',
      type: 'Private',
      tuitionFee: 'GHS 8,000 - 12,000',
      admissionCutOff: 'Aggregate 12-30',
      programs: '50+ Programs',
      specialization: 'Christian Values',
      logo: undefined, // No logo found
      description: 'Central University is a private Christian university located in Miotso, Ghana. It offers a range of undergraduate and postgraduate programs with a focus on Christian values and academic excellence. Programs include Business Administration, Theology, Nursing, Engineering, and Information Technology.',
      campus: ['Miotso', 'Kumasi'],
      studentPopulation: '5,000+',
      yearEstablished: '1988'
    },
    {
      id: '8',
      name: 'Regent University College of Science and Technology',
      region: 'Greater Accra',
      type: 'Private',
      tuitionFee: 'GHS 6,500 - 10,000',
      admissionCutOff: 'Aggregate 14-30',
      programs: '25+ Programs',
      specialization: 'Technology & Innovation',
      logo: undefined, // No logo found
      description: 'Regent University is a private university located in Accra, Ghana. It focuses on science and technology education and offers programs in engineering, computer science, business, and information technology. The university emphasizes practical skills and industry-relevant training.',
      campus: ['Accra'],
      studentPopulation: '3,500+',
      yearEstablished: '2003'
    },
    {
      id: '9',
      name: 'University of Education, Winneba',
      region: 'Central',
      type: 'Public',
      tuitionFee: 'GHS 2,100 - 3,900',
      admissionCutOff: 'Aggregate 8-28',
      programs: '70+ Programs',
      specialization: 'Teacher Education',
      logo: universityLogos['University of Education, Winneba'],
      description: 'The University of Education, Winneba is a public university located in Winneba, Ghana. Established in 1992, it specializes in teacher education and training. The university offers programs in education, sciences, humanities, and social sciences, producing qualified teachers and educational professionals.',
      campus: ['Winneba', 'Kumasi', 'Mampong'],
      studentPopulation: '30,000+',
      yearEstablished: '1992'
    },
    {
      id: '10',
      name: 'University of Mines and Technology',
      region: 'Western',
      type: 'Public',
      tuitionFee: 'GHS 2,300 - 4,000',
      admissionCutOff: 'Aggregate 6-24',
      programs: '25+ Programs',
      specialization: 'Mining & Petroleum',
      logo: universityLogos['University of Mines and Technology'],
      description: 'The University of Mines and Technology is a public university located in Tarkwa, Ghana. It specializes in mining, petroleum, and engineering education. UMaT is known for producing skilled professionals in mining engineering, petroleum engineering, and related technical fields.',
      campus: ['Tarkwa'],
      studentPopulation: '6,000+',
      yearEstablished: '2004'
    },
    {
      id: '11',
      name: 'University for Development Studies',
      region: 'Northern',
      type: 'Public',
      tuitionFee: 'GHS 2,000 - 3,500',
      admissionCutOff: 'Aggregate 8-30',
      programs: '55+ Programs',
      specialization: 'Development Studies',
      logo: universityLogos['University for Development Studies'],
      description: 'The University for Development Studies is a public university with campuses in Tamale, Navrongo, and Wa, Ghana. Established in 1992, UDS focuses on development-oriented education and research. The university offers programs in agriculture, health sciences, education, and development studies.',
      campus: ['Tamale', 'Navrongo', 'Wa'],
      studentPopulation: '20,000+',
      yearEstablished: '1992'
    },
    {
      id: '12',
      name: 'Catholic University of Ghana',
      region: 'Bono',
      type: 'Private',
      tuitionFee: 'GHS 7,500 - 11,000',
      admissionCutOff: 'Aggregate 12-28',
      programs: '35+ Programs',
      specialization: 'Catholic Education',
      logo: universityLogos['Catholic University of Ghana'],
      description: 'The Catholic University of Ghana is a private Catholic university located in Fiapre, Sunyani, Ghana. Established in 2003, it offers programs grounded in Catholic values and academic excellence. Programs include Business Administration, Information Technology, Nursing, and Theology.',
      campus: ['Fiapre'],
      studentPopulation: '4,000+',
      yearEstablished: '2003'
    },
    {
      id: '13',
      name: 'Pentecost University College',
      region: 'Greater Accra',
      type: 'Private',
      tuitionFee: 'GHS 6,000 - 9,500',
      admissionCutOff: 'Aggregate 14-30',
      programs: '30+ Programs',
      specialization: 'Christian Business',
      logo: universityLogos['Pentecost University College'],
      description: 'Pentecost University College is a private Christian university located in Sowutuom, Accra, Ghana. It offers undergraduate and postgraduate programs with a focus on Christian values, business, and technology. Programs include Business Administration, Information Technology, and Theology.',
      campus: ['Sowutuom'],
      studentPopulation: '3,000+',
      yearEstablished: '2003'
    },
    {
      id: '14',
      name: 'University of Energy and Natural Resources',
      region: 'Bono',
      type: 'Public',
      tuitionFee: 'GHS 2,200 - 4,000',
      admissionCutOff: 'Aggregate 8-26',
      programs: '20+ Programs',
      specialization: 'Energy & Environment',
      logo: universityLogos['University of Energy and Natural Resources'],
      description: 'The University of Energy and Natural Resources is a public university located in Sunyani, Ghana. Established in 2011, UENR focuses on energy, natural resources, and environmental studies. The university offers programs in renewable energy, environmental science, and natural resource management.',
      campus: ['Sunyani', 'Dormaa Ahenkro'],
      studentPopulation: '5,000+',
      yearEstablished: '2011'
    },
    {
      id: '15',
      name: 'Accra Institute of Technology',
      region: 'Greater Accra',
      type: 'Private',
      tuitionFee: 'GHS 5,500 - 8,500',
      admissionCutOff: 'Aggregate 16-30',
      programs: '20+ Programs',
      specialization: 'Technology & Engineering',
      logo: universityLogos['Accra Institute of Technology'],
      description: 'Accra Institute of Technology is a private university located in Accra, Ghana. It focuses on technology, engineering, and business education. AIT offers programs in computer science, information technology, engineering, and business administration with an emphasis on practical skills and industry relevance.',
      campus: ['Accra'],
      studentPopulation: '2,500+',
      yearEstablished: '2009'
    },
  ].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCampus = !selectedCampus || uni.campus?.includes(selectedCampus);
      const matchesRegion = !selectedRegion || uni.region === selectedRegion;
      const matchesType = !selectedType || uni.type === selectedType;
      return matchesSearch && matchesCampus && matchesRegion && matchesType;
    });
  }, [searchQuery, selectedCampus, selectedRegion, selectedType]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCampus, selectedRegion, selectedType]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const uniqueRegions = Array.from(new Set(universities.map(u => u.region))).sort();
  const uniqueTypes = Array.from(new Set(universities.map(u => u.type))).sort();
  const allCampuses = Array.from(new Set(universities.flatMap(u => u.campus || []))).sort();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isolatedStyles = `
    .universities-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .universities-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .universities-main-content {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .universities-breadcrumbs {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-breadcrumbs a {
      color: #006B3F;
      text-decoration: none;
    }

    .universities-breadcrumbs a:hover {
      text-decoration: underline;
    }

    .universities-header {
      margin-bottom: 2rem;
    }

    .universities-title {
      font-size: 3rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-subtitle {
      font-size: 1.25rem;
      color: hsl(220 20% 40%);
      margin: 0 0 2rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .universities-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: center;
    }

    .universities-search-wrapper {
      position: relative;
      flex: 1;
      min-width: 250px;
    }

    .universities-search-input {
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

    .universities-search-input:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .universities-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(220 20% 40%);
      width: 20px;
      height: 20px;
    }

    .universities-filter-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .universities-filter-select {
      padding: 0.875rem 1.25rem;
      padding-right: 2.5rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      font-size: 0.95rem;
      color: hsl(220 30% 15%);
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
    }

    .universities-filter-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .universities-filters-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.25rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      background: white;
      color: hsl(220 30% 15%);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-size: 0.95rem;
    }

    .universities-filters-button:hover {
      border-color: hsl(220 20% 40%);
      background: hsl(40 20% 90%);
    }

    .universities-table {
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .universities-table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.3fr 1.3fr 1.2fr;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: hsl(40 20% 94%);
      border-bottom: 1px solid hsl(40 20% 88%);
      font-weight: 600;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.3fr 1.3fr 1.2fr;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid hsl(40 20% 88%);
      cursor: pointer;
      transition: all 0.2s ease;
      align-items: center;
    }

    .university-row:hover {
      background: hsl(40 20% 98%);
    }

    .university-row:last-child {
      border-bottom: none;
    }

    .university-name {
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-size: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-region,
    .university-type,
    .university-tuition,
    .university-cutoff,
    .university-programs {
      color: hsl(220 20% 40%);
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-gtec-notice {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.75rem 1.25rem;
      background: hsl(40 20% 94%);
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      font-size: 0.9rem;
      color: hsl(220 30% 15%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-gtec-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: hsl(220 20% 40%);
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
      flex-shrink: 0;
    }


    .university-expanded-content {
      grid-column: 1 / -1;
      padding: 0;
      background: hsl(40 20% 98%);
      border-top: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .university-expanded-content-inner-wrapper {
      padding: 2rem 1.5rem;
    }

    .university-expanded-inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 2rem;
      align-items: start;
    }

    .university-logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 2px solid hsl(40 20% 88%);
      overflow: hidden;
      padding: 0.5rem;
    }

    .university-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .university-logo-placeholder {
      font-size: 0.75rem;
      color: hsl(220 20% 40%);
      text-align: center;
      padding: 0.5rem;
      font-weight: 600;
    }

    .university-description {
      color: hsl(220 20% 40%);
      line-height: 1.7;
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-grant-aid-display {
      text-align: right;
    }

    .university-grant-aid-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-grant-aid-value {
      font-size: 2rem;
      font-weight: 700;
      color: #60a5fa;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-profile-button {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: hsl(220 30% 15%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-profile-button:hover {
      background: hsl(220 30% 20%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .universities-pagination-wrapper {
      margin-top: 2rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1.5rem;
    }

    .universities-pagination-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      justify-self: flex-start;
    }

    .universities-pagination-info strong {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .universities-pagination-items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      justify-self: flex-end;
    }

    .universities-pagination-items-per-page label {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .universities-items-per-page-select {
      padding: 0.4rem 0.6rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.4rem center;
      padding-right: 1.75rem;
    }

    .universities-items-per-page-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .universities-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
      justify-self: center;
    }

    .universities-pagination-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      background: white;
      color: hsl(220 30% 15%);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      flex-shrink: 0;
    }

    .universities-pagination-button:hover:not(:disabled) {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      color: hsl(220 30% 15%);
      transform: translateY(-1px);
    }

    .universities-pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: hsl(40 20% 96%);
    }

    .universities-pagination-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .universities-pagination-numbers {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
    }

    .universities-pagination-number {
      min-width: 2.25rem;
      height: 2.25rem;
      padding: 0 0.5rem;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      background: white;
      color: hsl(220 30% 15%);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .universities-pagination-number:hover {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      transform: translateY(-1px);
    }

    .universities-pagination-number.active {
      background: hsl(220 30% 15%);
      border-color: hsl(220 30% 15%);
      color: white;
      font-weight: 600;
    }

    .universities-pagination-number.active:hover {
      background: hsl(220 30% 20%);
      border-color: hsl(220 30% 20%);
      transform: translateY(-1px);
    }

    .universities-pagination-ellipsis {
      padding: 0 0.25rem;
      color: hsl(220 20% 40%);
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      user-select: none;
      flex-shrink: 0;
    }

    @media (max-width: 1200px) {
      .universities-table-header,
      .university-row {
        grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1fr;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .universities-content-wrapper {
        padding-top: 60px;
      }

      .universities-main-content {
        padding: 1rem;
      }

      .universities-title {
        font-size: 2rem;
      }

      .universities-subtitle {
        font-size: 1.125rem;
      }

      .universities-table-header {
        display: none;
      }

      .university-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.5rem 1rem;
      }

      .university-expanded-content-inner-wrapper {
        padding: 1.5rem 1rem;
      }

      .university-expanded-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .university-grant-aid-display {
        text-align: left;
      }

      .universities-pagination-wrapper {
        padding: 0.75rem 1rem;
        grid-template-columns: 1fr;
        gap: 1rem;
        align-items: stretch;
      }

      .universities-pagination-info {
        justify-content: center;
        font-size: 0.8rem;
        flex-wrap: wrap;
        justify-self: center;
      }

      .universities-pagination-items-per-page {
        gap: 0.4rem;
        justify-self: center;
      }

      .universities-pagination {
        gap: 0.25rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .universities-pagination-button {
        width: 2rem;
        height: 2rem;
      }

      .universities-pagination-number {
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.4rem;
        font-size: 0.8rem;
      }

      .universities-pagination-numbers {
        gap: 0.25rem;
        flex-wrap: wrap;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .universities-content-wrapper {
        padding-top: 70px;
      }

      .universities-main-content {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .universities-content-wrapper {
        padding-top: 120px;
      }

      .universities-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .universities-content-wrapper {
        padding-top: 120px;
      }

      .universities-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }

    @media (max-width: 480px) {
      .universities-pagination-wrapper {
        padding: 0.625rem 0.75rem;
      }

      .universities-pagination-info {
        font-size: 0.75rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .universities-pagination-items-per-page {
        width: 100%;
        justify-content: space-between;
      }

      .universities-pagination-button {
        width: 1.875rem;
        height: 1.875rem;
      }

      .universities-pagination-button svg {
        width: 14px;
        height: 14px;
      }

      .universities-pagination-number {
        min-width: 1.875rem;
        height: 1.875rem;
        padding: 0 0.35rem;
        font-size: 0.75rem;
      }

      .universities-pagination-numbers {
        gap: 0.2rem;
      }

      .universities-pagination-ellipsis {
        padding: 0 0.2rem;
        font-size: 0.75rem;
      }
    }
  `;

  return (
    <div className="universities-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="universities-content-wrapper">
        <div className="universities-main-content">
          <div className="universities-breadcrumbs">
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>
          <div className="universities-header">
            <h1 className="universities-title">Universities in Ghana</h1>
            <p className="universities-subtitle">
              Explore universities across Ghana. Find detailed information about programs, 
              financial aid, and more to help you make informed decisions about your education.
            </p>
            <div className="universities-gtec-notice">
              <span className="universities-gtec-icon">✓</span>
              <span>All universities listed are accredited by the Ghana Tertiary Education Commission (GTEC)</span>
            </div>
          </div>

          <div className="universities-controls">
            <div className="universities-search-wrapper">
              <Search className="universities-search-icon" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="universities-search-input"
              />
            </div>

            <div className="universities-filter-group">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="universities-filter-select"
              >
                <option value="">Select Campus</option>
                {allCampuses.map(campus => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="universities-filter-select"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="universities-filter-select"
              >
                <option value="">Select Type</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="universities-table">
            <div className="universities-table-header">
              <div>Name</div>
              <div>Region</div>
              <div>Type</div>
              <div>Tuition Fee</div>
              <div>Admission Cut-off</div>
              <div>Programs</div>
            </div>

            {paginatedUniversities.map((university) => (
              <React.Fragment key={university.id}>
                <div
                  className={`university-row ${expandedId === university.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(university.id)}
                >
                  <div className="university-name">
                    {university.name}
                  </div>
                  <div className="university-region">{university.region}</div>
                  <div className="university-type">{university.type}</div>
                  <div className="university-tuition">{university.tuitionFee}</div>
                  <div className="university-cutoff">{university.admissionCutOff}</div>
                  <div className="university-programs">{university.programs}</div>
                </div>

                <AnimatePresence>
                  {expandedId === university.id && (
                    <motion.div
                      className="university-expanded-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.4, 0, 0.2, 1],
                        opacity: { duration: 0.25, delay: 0.05 }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                        <div className="university-expanded-content-inner-wrapper">
                          <div className="university-expanded-inner">
                            <div className="university-logo">
                              {university.logo ? (
                                <img src={university.logo} alt={`${university.name} logo`} />
                              ) : (
                                <div className="university-logo-placeholder">
                                  {university.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                                </div>
                              )}
                            </div>

                          <div>
                            <p className="university-description">
                              {university.description}
                            </p>
                            <Link to={`/directories/universities/${university.id}`}>
                              <button className="university-view-profile-button">
                                View Profile
                              </button>
                            </Link>
                          </div>

                          <div className="university-grant-aid-display">
                            <div className="university-grant-aid-label">Tuition Fee</div>
                            <div className="university-grant-aid-value">
                              {university.tuitionFee}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>

          {filteredUniversities.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: 'hsl(220 20% 40%)'
            }}>
              <p>No universities found matching your search criteria.</p>
            </div>
          )}

          {filteredUniversities.length > 0 && (
            <div className="universities-pagination-wrapper">
              <div className="universities-pagination-info">
                <span>
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredUniversities.length)}</strong> of <strong>{filteredUniversities.length}</strong> universities
                </span>
              </div>

              <div className="universities-pagination">
                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="universities-pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="universities-pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`universities-pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page as number)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  className="universities-pagination-button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>

              <div className="universities-pagination-items-per-page">
                <label htmlFor="items-per-page">Show:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="universities-items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Universities;

