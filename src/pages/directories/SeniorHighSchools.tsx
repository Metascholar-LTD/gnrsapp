import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SeniorHighSchool {
  id: string;
  name: string;
  region: string;
  district: string;
  category: string; // Category A, B, C
  gender: string; // Boys, Girls, Mixed
  programs: string; // Programs offered
  logo?: string;
  description: string;
  studentPopulation?: string;
  yearEstablished?: string;
  boardingStatus: string; // Day, Boarding, Day/Boarding, Boarding & Day
}

const SeniorHighSchools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBoarding, setSelectedBoarding] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock SHS data - replace with actual API data
  const seniorHighSchools: SeniorHighSchool[] = [
    {
      id: '1',
      name: 'Achimota School',
      region: 'Greater Accra',
      district: 'Accra Metropolitan',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Arts, General Science, Business, Visual Arts',
      admissionCutOff: 'Aggregate 6-15',
      description: 'Achimota School is one of Ghana\'s premier senior high schools, established in 1927. It is a co-educational institution known for academic excellence and producing notable alumni. The school offers comprehensive programs in General Arts, General Science, Business, and Visual Arts.',
      studentPopulation: '2,500+',
      yearEstablished: '1927',
      boardingStatus: 'Boarding'
    },
    {
      id: '2',
      name: 'Presbyterian Boys\' Secondary School (PRESEC)',
      region: 'Greater Accra',
      district: 'Legon',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business',
      description: 'PRESEC Legon is a prestigious boys\' senior high school known for academic excellence and discipline. Established in 1938, the school has consistently ranked among the top schools in Ghana. It offers programs in General Science, General Arts, and Business.',
      studentPopulation: '2,200+',
      yearEstablished: '1938',
      boardingStatus: 'Boarding'
    },
    {
      id: '3',
      name: 'Wesley Girls\' High School',
      region: 'Central',
      district: 'Cape Coast',
      category: 'Category A',
      gender: 'Girls',
      programs: 'General Arts, General Science, Business, Home Economics',
      description: 'Wesley Girls\' High School is one of Ghana\'s leading girls\' senior high schools, established in 1836. The school is renowned for academic excellence and character development. It offers programs in General Arts, General Science, Business, and Home Economics.',
      studentPopulation: '2,000+',
      yearEstablished: '1836',
      boardingStatus: 'Boarding'
    },
    {
      id: '4',
      name: 'Mfantsipim School',
      region: 'Central',
      district: 'Cape Coast',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business',
      description: 'Mfantsipim School is Ghana\'s oldest secondary school, established in 1876. It is a prestigious boys\' school known for producing leaders and professionals. The school offers programs in General Science, General Arts, and Business.',
      studentPopulation: '2,100+',
      yearEstablished: '1876',
      boardingStatus: 'Boarding'
    },
    {
      id: '5',
      name: 'St. Augustine\'s College',
      region: 'Central',
      district: 'Cape Coast',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business, Visual Arts',
      description: 'St. Augustine\'s College is a Catholic boys\' senior high school established in 1930. The school is known for academic excellence and holistic education. It offers programs in General Science, General Arts, Business, and Visual Arts.',
      studentPopulation: '2,300+',
      yearEstablished: '1930',
      boardingStatus: 'Boarding'
    },
    {
      id: '6',
      name: 'Holy Child School',
      region: 'Central',
      district: 'Cape Coast',
      category: 'Category A',
      gender: 'Girls',
      programs: 'General Arts, General Science, Business, Home Economics',
      description: 'Holy Child School is a Catholic girls\' senior high school established in 1946. The school is renowned for academic excellence and character formation. It offers programs in General Arts, General Science, Business, and Home Economics.',
      studentPopulation: '1,800+',
      yearEstablished: '1946',
      boardingStatus: 'Boarding'
    },
    {
      id: '7',
      name: 'Opoku Ware School',
      region: 'Ashanti',
      district: 'Kumasi Metropolitan',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business',
      description: 'Opoku Ware School is a Catholic boys\' senior high school in Kumasi, established in 1952. The school is known for academic excellence and discipline. It offers programs in General Science, General Arts, and Business.',
      studentPopulation: '2,400+',
      yearEstablished: '1952',
      boardingStatus: 'Boarding'
    },
    {
      id: '8',
      name: 'Kumasi Academy',
      region: 'Ashanti',
      district: 'Asokore Mampong',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business, Technical',
      description: 'Kumasi Academy is a co-educational senior high school established in 1954. The school offers a wide range of programs including General Science, General Arts, Business, and Technical programs.',
      studentPopulation: '2,200+',
      yearEstablished: '1954',
      boardingStatus: 'Boarding & Day'
    },
    {
      id: '9',
      name: 'Prempeh College',
      region: 'Ashanti',
      district: 'Kumasi Metropolitan',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business',
      description: 'Prempeh College is a prestigious boys\' senior high school in Kumasi, established in 1949. The school is known for academic excellence and producing top-performing students. It offers programs in General Science, General Arts, and Business.',
      studentPopulation: '2,100+',
      yearEstablished: '1949',
      boardingStatus: 'Boarding'
    },
    {
      id: '10',
      name: 'Adisadel College',
      region: 'Central',
      district: 'Cape Coast',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business, Visual Arts',
      description: 'Adisadel College is a prestigious Anglican boys\' senior high school established in 1910. The school is known for academic excellence and producing leaders. It offers programs in General Science, General Arts, Business, and Visual Arts.',
      studentPopulation: '2,200+',
      yearEstablished: '1910',
      boardingStatus: 'Boarding'
    },
    {
      id: '11',
      name: 'Aburi Girls\' Senior High School',
      region: 'Eastern',
      district: 'Akuapim North',
      category: 'Category A',
      gender: 'Girls',
      programs: 'General Arts, General Science, Business, Home Economics',
      description: 'Aburi Girls\' Senior High School is a prestigious girls\' school established in 1957. The school is known for academic excellence and character development. It offers programs in General Arts, General Science, Business, and Home Economics.',
      studentPopulation: '1,900+',
      yearEstablished: '1957',
      boardingStatus: 'Boarding'
    },
    {
      id: '12',
      name: 'Ghana National College',
      region: 'Central',
      district: 'Cape Coast',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business',
      description: 'Ghana National College is a co-educational senior high school established in 1948. The school is known for academic excellence and national service. It offers programs in General Science, General Arts, and Business.',
      studentPopulation: '2,000+',
      yearEstablished: '1948',
      boardingStatus: 'Boarding & Day'
    },
    {
      id: '13',
      name: 'St. Peter\'s Senior High School',
      region: 'Eastern',
      district: 'Nkawkaw',
      category: 'Category B',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business',
      description: 'St. Peter\'s Senior High School is a Catholic boys\' school established in 1957. The school offers quality education with programs in General Science, General Arts, and Business.',
      studentPopulation: '1,500+',
      yearEstablished: '1957',
      boardingStatus: 'Boarding'
    },
    {
      id: '14',
      name: 'Tamale Senior High School',
      region: 'Northern',
      district: 'Tamale Metropolitan',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business, Technical',
      description: 'Tamale Senior High School is a co-educational institution established in 1951. The school serves the northern region and offers programs in General Science, General Arts, Business, and Technical.',
      studentPopulation: '2,100+',
      yearEstablished: '1951',
      boardingStatus: 'Boarding & Day'
    },
    {
      id: '15',
      name: 'Keta Senior High Technical School',
      region: 'Volta',
      district: 'Keta Municipal',
      category: 'Category B',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business, Technical',
      description: 'Keta Senior High Technical School is a co-educational institution established in 1960. The school offers both academic and technical programs including General Science, General Arts, Business, and Technical courses.',
      studentPopulation: '1,600+',
      yearEstablished: '1960',
      boardingStatus: 'Boarding & Day'
    },
    {
      id: '16',
      name: 'Sunyani Senior High School',
      region: 'Bono',
      district: 'Sunyani Municipal',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business',
      description: 'Sunyani Senior High School is a co-educational institution established in 1960. The school is known for academic excellence in the Bono region. It offers programs in General Science, General Arts, and Business.',
      studentPopulation: '1,900+',
      yearEstablished: '1960',
      boardingStatus: 'Boarding'
    },
    {
      id: '17',
      name: 'Bolgatanga Senior High School',
      region: 'Upper East',
      district: 'Bolgatanga Municipal',
      category: 'Category B',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business',
      description: 'Bolgatanga Senior High School is a co-educational institution serving the Upper East region. Established in 1960, the school offers programs in General Science, General Arts, and Business.',
      studentPopulation: '1,400+',
      yearEstablished: '1960',
      boardingStatus: 'Boarding & Day'
    },
    {
      id: '18',
      name: 'Wa Senior High School',
      region: 'Upper West',
      district: 'Wa Municipal',
      category: 'Category B',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business',
      description: 'Wa Senior High School is a co-educational institution serving the Upper West region. Established in 1960, the school offers programs in General Science, General Arts, and Business.',
      studentPopulation: '1,500+',
      yearEstablished: '1960',
      boardingStatus: 'Boarding & Day'
    },
    {
      id: '19',
      name: 'Sekondi College',
      region: 'Western',
      district: 'Sekondi-Takoradi Metropolitan',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business',
      description: 'Sekondi College is a co-educational senior high school established in 1952. The school is known for academic excellence in the Western region. It offers programs in General Science, General Arts, and Business.',
      studentPopulation: '1,800+',
      yearEstablished: '1952',
      boardingStatus: 'Boarding'
    },
    {
      id: '20',
      name: 'Ho Senior High School',
      region: 'Volta',
      district: 'Ho Municipal',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Science, General Arts, Business',
      description: 'Ho Senior High School is a co-educational institution established in 1952. The school serves the Volta region and offers programs in General Science, General Arts, and Business.',
      studentPopulation: '1,900+',
      yearEstablished: '1952',
      boardingStatus: 'Boarding & Day'
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filteredSchools = useMemo(() => {
    return seniorHighSchools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || school.region === selectedRegion;
      const matchesCategory = !selectedCategory || school.category === selectedCategory;
      const matchesGender = !selectedGender || school.gender === selectedGender;
      const matchesBoarding = !selectedBoarding || school.boardingStatus === selectedBoarding;
      return matchesSearch && matchesRegion && matchesCategory && matchesGender && matchesBoarding;
    });
  }, [searchQuery, selectedRegion, selectedCategory, selectedGender, selectedBoarding]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchools = filteredSchools.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegion, selectedCategory, selectedGender, selectedBoarding]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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

  const uniqueRegions = Array.from(new Set(seniorHighSchools.map(s => s.region))).sort();
  const uniqueCategories = Array.from(new Set(seniorHighSchools.map(s => s.category))).sort();
  const uniqueGenders = Array.from(new Set(seniorHighSchools.map(s => s.gender))).sort();
  const uniqueBoarding = Array.from(new Set(seniorHighSchools.map(s => s.boardingStatus || ''))).filter(Boolean).sort();

  const isolatedStyles = `
    .shs-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .shs-content-wrapper {
      padding-top: 80px;
      min-height: calc(100vh - 80px);
    }

    .shs-main-content {
      max-width: 1600px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    .shs-header {
      margin-bottom: 2rem;
    }

    .shs-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-subtitle {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      color: hsl(220 20% 40%);
      margin: 0 0 2rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .shs-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: center;
    }

    .shs-search-wrapper {
      position: relative;
      flex: 1;
      min-width: 250px;
    }

    .shs-search-input {
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

    .shs-search-input:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .shs-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(220 20% 40%);
      width: 20px;
      height: 20px;
    }

    .shs-filter-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .shs-filter-select {
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

    .shs-filter-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .shs-table {
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .shs-table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1.2fr;
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

    .shs-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1.2fr;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid hsl(40 20% 88%);
      cursor: pointer;
      transition: all 0.2s ease;
      align-items: center;
    }

    .shs-row:hover {
      background: hsl(40 20% 98%);
    }

    .shs-row:last-child {
      border-bottom: none;
    }

    .shs-name {
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-size: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-region,
    .shs-category,
    .shs-gender,
    .shs-cutoff,
    .shs-programs {
      color: hsl(220 20% 40%);
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-expanded-content {
      grid-column: 1 / -1;
      padding: 0;
      background: hsl(40 20% 98%);
      border-top: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .shs-expanded-content-inner-wrapper {
      padding: 2rem 1.5rem;
    }

    .shs-expanded-inner {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2rem;
      align-items: start;
    }

    .shs-description {
      color: hsl(220 20% 40%);
      line-height: 1.7;
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-profile-button {
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
      text-decoration: none;
      display: inline-block;
    }

    .shs-view-profile-button:hover {
      background: hsl(220 30% 15%);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .shs-pagination-wrapper {
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

    .shs-pagination-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      justify-self: flex-start;
    }

    .shs-pagination-info strong {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .shs-pagination-items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      justify-self: flex-end;
    }

    .shs-pagination-items-per-page label {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-items-per-page-select {
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

    .shs-items-per-page-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .shs-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
      justify-self: center;
    }

    .shs-pagination-button {
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

    .shs-pagination-button:hover:not(:disabled) {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      color: hsl(220 30% 15%);
      transform: translateY(-1px);
    }

    .shs-pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: hsl(40 20% 96%);
    }

    .shs-pagination-number {
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

    .shs-pagination-number:hover {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      transform: translateY(-1px);
    }

    .shs-pagination-number.active {
      background: hsl(220 30% 15%);
      border-color: hsl(220 30% 15%);
      color: white;
      font-weight: 600;
    }

    .shs-pagination-number.active:hover {
      background: hsl(220 30% 20%);
      border-color: hsl(220 30% 20%);
      transform: translateY(-1px);
    }

    .shs-pagination-numbers {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
      flex-direction: row;
      position: relative;
    }

    .shs-pagination-ellipsis {
      padding: 0 0.25rem;
      color: hsl(220 20% 40%);
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      user-select: none;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .shs-main-content {
        padding: 2rem 1rem;
      }

      .shs-table-header {
        display: none;
      }

      .shs-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.5rem 1rem;
      }

      .shs-expanded-content-inner-wrapper {
        padding: 1.5rem 1rem;
      }

      .shs-expanded-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .shs-pagination-wrapper {
        padding: 0.75rem 1rem;
        grid-template-columns: 1fr;
        gap: 1rem;
        align-items: stretch;
      }

      .shs-pagination-info {
        justify-content: center;
        font-size: 0.8rem;
        flex-wrap: wrap;
        justify-self: center;
      }

      .shs-pagination-items-per-page {
        gap: 0.4rem;
        justify-self: center;
      }

      .shs-pagination {
        gap: 0.25rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .shs-pagination-button {
        width: 2rem;
        height: 2rem;
      }

      .shs-pagination-number {
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.4rem;
        font-size: 0.8rem;
      }

      .shs-pagination-numbers {
        gap: 0.25rem;
        flex-wrap: wrap;
      }
    }

    @media (max-width: 480px) {
      .shs-pagination-wrapper {
        padding: 0.625rem 0.75rem;
      }

      .shs-pagination-info {
        font-size: 0.75rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .shs-pagination-items-per-page {
        width: 100%;
        justify-content: space-between;
      }

      .shs-pagination-button {
        width: 1.875rem;
        height: 1.875rem;
      }

      .shs-pagination-button svg {
        width: 14px;
        height: 14px;
      }

      .shs-pagination-number {
        min-width: 1.875rem;
        height: 1.875rem;
        padding: 0 0.35rem;
        font-size: 0.75rem;
      }
    }
  `;

  return (
    <div className="shs-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="shs-content-wrapper">
        <div className="shs-main-content">
          <div className="shs-header">
            <h1 className="shs-title">Senior High Schools in Ghana</h1>
            <p className="shs-subtitle">
              Explore senior high schools across Ghana. Find detailed information about programs, 
              admission requirements, and more to help you make informed decisions about your education.
            </p>
          </div>

          <div className="shs-controls">
            <div className="shs-search-wrapper">
              <Search className="shs-search-icon" />
              <input
                type="text"
                className="shs-search-input"
                placeholder="Search by school name, region, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="shs-filter-group">
              <select
                className="shs-filter-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <select
                className="shs-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                className="shs-filter-select"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">All Genders</option>
                {uniqueGenders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
              <select
                className="shs-filter-select"
                value={selectedBoarding}
                onChange={(e) => setSelectedBoarding(e.target.value)}
              >
                <option value="">All Types</option>
                {uniqueBoarding.map(boarding => (
                  <option key={boarding} value={boarding}>{boarding}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="shs-table">
            <div className="shs-table-header">
              <div>School Name</div>
              <div>Region</div>
              <div>Category</div>
              <div>Gender</div>
              <div>Boarding/Day</div>
              <div>Programs</div>
            </div>
            <AnimatePresence mode="wait">
              {paginatedSchools.map((school) => (
                <React.Fragment key={school.id}>
                  <div
                    className="shs-row"
                    onClick={() => setExpandedId(expandedId === school.id ? null : school.id)}
                  >
                    <div className="shs-name">{school.name}</div>
                    <div className="shs-region">{school.region}</div>
                    <div className="shs-category">{school.category}</div>
                    <div className="shs-gender">{school.gender}</div>
                    <div className="shs-cutoff">{school.boardingStatus}</div>
                    <div className="shs-programs">{school.programs}</div>
                  </div>
                  {expandedId === school.id && (
                    <motion.div
                      className="shs-expanded-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="shs-expanded-content-inner-wrapper">
                        <div className="shs-expanded-inner">
                          <div>
                            <p className="shs-description">{school.description}</p>
                            {school.studentPopulation && (
                              <p className="shs-description" style={{ marginTop: '0.5rem' }}>
                                <strong>Student Population:</strong> {school.studentPopulation}
                              </p>
                            )}
                            {school.yearEstablished && (
                              <p className="shs-description" style={{ marginTop: '0.5rem' }}>
                                <strong>Established:</strong> {school.yearEstablished}
                              </p>
                            )}
                            {school.boardingStatus && (
                              <p className="shs-description" style={{ marginTop: '0.5rem' }}>
                                <strong>Boarding Status:</strong> {school.boardingStatus}
                              </p>
                            )}
                            <Link
                              to={`/directories/shs/${school.id}`}
                              className="shs-view-profile-button"
                            >
                              View Full Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 0 && (
            <div className="shs-pagination-wrapper">
              <div className="shs-pagination-info">
                Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredSchools.length)}</strong> of <strong>{filteredSchools.length}</strong> schools
              </div>
              <div className="shs-pagination">
                <button
                  className="shs-pagination-button"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  className="shs-pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="shs-pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="shs-pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`shs-pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page as number)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>
                <button
                  className="shs-pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  className="shs-pagination-button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
              <div className="shs-pagination-items-per-page">
                <label htmlFor="shs-items-per-page">Show:</label>
                <select
                  id="shs-items-per-page"
                  className="shs-items-per-page-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
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

export default SeniorHighSchools;

