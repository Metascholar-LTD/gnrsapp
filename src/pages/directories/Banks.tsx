import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Bank {
  id: string;
  name: string;
  region: string;
  type: string;
  services: string;
  branches: string;
  yearEstablished: string;
  logo?: string;
  description: string;
  website: string;
  initials?: string;
}

const Banks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock bank data - replace with actual API data
  const banks: Bank[] = [
    {
      id: '1',
      name: 'Ghana Commercial Bank',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Investment',
      branches: '180+ Branches',
      yearEstablished: '1953',
      description: 'Ghana Commercial Bank (GCB) is one of the largest banks in Ghana, providing comprehensive banking services including retail banking, corporate banking, and investment services. With over 180 branches nationwide, GCB serves millions of customers across Ghana.',
      website: 'https://www.gcbbank.com.gh',
      initials: 'GCB'
    },
    {
      id: '2',
      name: 'Ecobank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Digital Banking',
      branches: '75+ Branches',
      yearEstablished: '1990',
      description: 'Ecobank Ghana is a leading pan-African banking group with a strong presence in Ghana. The bank offers innovative digital banking solutions, retail banking, corporate banking, and specialized financial services to individuals and businesses.',
      website: 'https://www.ecobank.com/gh'
    },
    {
      id: '3',
      name: 'Standard Chartered Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Wealth Management',
      branches: '25+ Branches',
      yearEstablished: '1896',
      description: 'Standard Chartered Bank Ghana has been operating in Ghana for over a century, providing world-class banking services. The bank specializes in retail banking, corporate banking, and wealth management services with a focus on digital innovation.',
      website: 'https://www.sc.com/gh'
    },
    {
      id: '4',
      name: 'Absa Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Business Banking',
      branches: '80+ Branches',
      yearEstablished: '1997',
      description: 'Absa Bank Ghana (formerly Barclays Bank Ghana) is a leading financial services provider offering comprehensive banking solutions. The bank serves retail customers, small businesses, and large corporations with innovative products and services.',
      website: 'https://www.absa.africa/gh',
      initials: 'ABSA'
    },
    {
      id: '5',
      name: 'Stanbic Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Investment Banking',
      branches: '35+ Branches',
      yearEstablished: '1998',
      description: 'Stanbic Bank Ghana is part of the Standard Bank Group, Africa\'s largest banking group. The bank provides retail banking, corporate banking, and investment banking services with a strong focus on digital transformation and customer experience.',
      website: 'https://www.stanbicbank.com.gh'
    },
    {
      id: '6',
      name: 'Fidelity Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, SME Banking, Corporate',
      branches: '70+ Branches',
      yearEstablished: '1998',
      description: 'Fidelity Bank Ghana is a leading indigenous bank providing comprehensive banking services to retail customers, small and medium enterprises, and large corporations. The bank is known for its customer-centric approach and innovative banking solutions.',
      website: 'https://www.fidelitybank.com.gh'
    },
    {
      id: '7',
      name: 'CalBank',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Investment Banking',
      branches: '30+ Branches',
      yearEstablished: '1990',
      description: 'CalBank is a leading Ghanaian bank providing retail banking, corporate banking, and investment banking services. The bank is committed to delivering exceptional customer service and innovative financial solutions to meet diverse banking needs.',
      website: 'https://www.calbank.net',
      initials: 'CAL'
    },
    {
      id: '8',
      name: 'Guaranty Trust Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Digital Banking',
      branches: '20+ Branches',
      yearEstablished: '2006',
      description: 'Guaranty Trust Bank Ghana (GTBank) is a leading financial institution known for its innovative digital banking solutions and excellent customer service. The bank offers retail banking, corporate banking, and specialized financial services.',
      website: 'https://www.gtbank.com/gh',
      initials: 'GTBank'
    },
    {
      id: '9',
      name: 'Access Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, SME Banking',
      branches: '50+ Branches',
      yearEstablished: '2009',
      description: 'Access Bank Ghana is part of the Access Bank Group, one of Africa\'s largest banking groups. The bank provides comprehensive banking services including retail banking, corporate banking, and specialized services for small and medium enterprises.',
      website: 'https://www.accessbankplc.com/gh'
    },
    {
      id: '10',
      name: 'United Bank for Africa Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Digital Banking',
      branches: '25+ Branches',
      yearEstablished: '2004',
      description: 'United Bank for Africa Ghana (UBA) is part of the UBA Group, a leading pan-African financial services group. The bank offers retail banking, corporate banking, and innovative digital banking solutions to customers across Ghana.',
      website: 'https://www.ubagroup.com/gh',
      initials: 'UBA'
    },
    {
      id: '11',
      name: 'Zenith Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Investment Banking',
      branches: '30+ Branches',
      yearEstablished: '2005',
      description: 'Zenith Bank Ghana is part of the Zenith Bank Group, one of Nigeria\'s largest financial institutions. The bank provides comprehensive banking services including retail banking, corporate banking, and investment banking solutions.',
      website: 'https://www.zenithbank.com/gh'
    },
    {
      id: '12',
      name: 'First National Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Business Banking',
      branches: '15+ Branches',
      yearEstablished: '2015',
      description: 'First National Bank Ghana is part of the FirstRand Group, one of Africa\'s largest financial services groups. The bank offers retail banking, corporate banking, and specialized business banking services with a focus on innovation and customer service.',
      website: 'https://www.fnb.co.za/gh'
    },
    {
      id: '13',
      name: 'Consolidated Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate Banking',
      branches: '40+ Branches',
      yearEstablished: '2018',
      description: 'Consolidated Bank Ghana (CBG) was established following the consolidation of several banks in Ghana. The bank provides retail banking and corporate banking services, focusing on financial stability and customer satisfaction.',
      website: 'https://www.consolidatedbank.com.gh',
      initials: 'CBG'
    },
    {
      id: '14',
      name: 'Republic Bank Ghana',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, SME Banking',
      branches: '20+ Branches',
      yearEstablished: '2013',
      description: 'Republic Bank Ghana is a leading financial institution providing comprehensive banking services to retail customers, small and medium enterprises, and large corporations. The bank is committed to delivering innovative financial solutions.',
      website: 'https://www.republicbank.com.gh'
    },
    {
      id: '15',
      name: 'OmniBSIC Bank',
      region: 'Greater Accra',
      type: 'Commercial',
      services: 'Retail, Corporate, Digital Banking',
      branches: '25+ Branches',
      yearEstablished: '2019',
      description: 'OmniBSIC Bank is a dynamic financial institution formed from the merger of OmniBank and BSIC Bank. The bank offers retail banking, corporate banking, and innovative digital banking solutions with a focus on customer convenience and satisfaction.',
      website: 'https://www.omnibsicbank.com',
      initials: 'OmniBSIC'
    },
  ].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

  const filteredBanks = useMemo(() => {
    return banks.filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.services.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBanks = filteredBanks.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper function to get bank display name for button
  // Only use official acronyms if they exist, otherwise use first name
  const getBankButtonText = (bank: Bank) => {
    // If bank has official initials/acronym, use it
    if (bank.initials) {
      return `Bank with ${bank.initials}`;
    }
    // Otherwise, use the first word/name (e.g., "Ecobank", "Standard Chartered", "Fidelity Bank")
    const firstWord = bank.name.split(' ')[0];
    // For banks like "Standard Chartered", use first two words
    if (bank.name.includes('Standard Chartered')) {
      return `Bank with Standard Chartered`;
    }
    if (bank.name.includes('First National')) {
      return `Bank with First National Bank`;
    }
    return `Bank with ${firstWord}`;
  };

  const isolatedStyles = `
    .banks-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .banks-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .banks-main-content {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .banks-breadcrumbs {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .banks-breadcrumbs a {
      color: #006B3F;
      text-decoration: none;
    }

    .banks-breadcrumbs a:hover {
      text-decoration: underline;
    }

    .banks-header {
      margin-bottom: 2rem;
    }

    .banks-title {
      font-size: 3rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .banks-subtitle {
      font-size: 1.25rem;
      color: hsl(220 20% 40%);
      margin: 0 0 2rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .banks-controls {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
      align-items: center;
    }

    .banks-search-wrapper {
      position: relative;
      width: 100%;
      max-width: 500px;
    }

    .banks-search-input {
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

    .banks-search-input:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .banks-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(220 20% 40%);
      width: 20px;
      height: 20px;
    }


    .banks-table {
      background: white;
      border-radius: 1rem;
      border: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .banks-table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr;
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

    .bank-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid hsl(40 20% 88%);
      cursor: pointer;
      transition: all 0.2s ease;
      align-items: center;
    }

    .bank-row:hover {
      background: hsl(40 20% 98%);
    }

    .bank-row:last-child {
      border-bottom: none;
    }

    .bank-name {
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-size: 1rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bank-region,
    .bank-type,
    .bank-services,
    .bank-branches {
      color: hsl(220 20% 40%);
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bank-expanded-content {
      grid-column: 1 / -1;
      padding: 0;
      background: hsl(40 20% 98%);
      border-top: 1px solid hsl(40 20% 88%);
      overflow: hidden;
    }

    .bank-expanded-content-inner-wrapper {
      padding: 2rem 1.5rem;
    }

    .bank-expanded-inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 2rem;
      align-items: start;
    }

    .bank-logo {
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

    .bank-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .bank-logo-placeholder {
      font-size: 0.75rem;
      color: hsl(220 20% 40%);
      text-align: center;
      padding: 0.5rem;
      font-weight: 600;
    }

    .bank-description {
      color: hsl(220 20% 40%);
      line-height: 1.7;
      font-size: 0.95rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bank-info-display {
      text-align: right;
    }

    .bank-info-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bank-info-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #60a5fa;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .bank-with-button {
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

    .bank-with-button:hover {
      background: hsl(220 30% 20%);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .banks-pagination-wrapper {
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

    .banks-pagination-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      white-space: nowrap;
      justify-self: flex-start;
    }

    .banks-pagination-info strong {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    .banks-pagination-items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      justify-self: flex-end;
    }

    .banks-pagination-items-per-page label {
      font-size: 0.875rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .banks-items-per-page-select {
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

    .banks-items-per-page-select:focus {
      outline: none;
      border-color: hsl(220 20% 40%);
      box-shadow: 0 0 0 3px hsl(220 20% 40% / 0.1);
    }

    .banks-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
      justify-self: center;
    }

    .banks-pagination-button {
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

    .banks-pagination-button:hover:not(:disabled) {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      color: hsl(220 30% 15%);
      transform: translateY(-1px);
    }

    .banks-pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: hsl(40 20% 96%);
    }

    .banks-pagination-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .banks-pagination-numbers {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: nowrap;
    }

    .banks-pagination-number {
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

    .banks-pagination-number:hover {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
      transform: translateY(-1px);
    }

    .banks-pagination-number.active {
      background: hsl(220 30% 15%);
      border-color: hsl(220 30% 15%);
      color: white;
      font-weight: 600;
    }

    .banks-pagination-number.active:hover {
      background: hsl(220 30% 20%);
      border-color: hsl(220 30% 20%);
      transform: translateY(-1px);
    }

    .banks-pagination-ellipsis {
      padding: 0 0.25rem;
      color: hsl(220 20% 40%);
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      user-select: none;
      flex-shrink: 0;
    }

    @media (max-width: 1200px) {
      .banks-table-header,
      .bank-row {
        grid-template-columns: 2fr 1fr 1fr 1.2fr 1.2fr;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .banks-content-wrapper {
        padding-top: 60px;
      }

      .banks-main-content {
        padding: 1rem;
      }

      .banks-title {
        font-size: 2rem;
      }

      .banks-subtitle {
        font-size: 1.125rem;
      }

      .banks-search-wrapper {
        max-width: 100%;
      }

      .banks-table-header {
        display: none;
      }

      .bank-row {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1.5rem 1rem;
      }

      .bank-expanded-content-inner-wrapper {
        padding: 1.5rem 1rem;
      }

      .bank-expanded-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .bank-info-display {
        text-align: left;
      }

      .banks-pagination-wrapper {
        padding: 0.75rem 1rem;
        grid-template-columns: 1fr;
        gap: 1rem;
        align-items: stretch;
      }

      .banks-pagination-info {
        justify-content: center;
        font-size: 0.8rem;
        flex-wrap: wrap;
        justify-self: center;
      }

      .banks-pagination-items-per-page {
        gap: 0.4rem;
        justify-self: center;
      }

      .banks-pagination {
        gap: 0.25rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .banks-pagination-button {
        width: 2rem;
        height: 2rem;
      }

      .banks-pagination-number {
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.4rem;
        font-size: 0.8rem;
      }

      .banks-pagination-numbers {
        gap: 0.25rem;
        flex-wrap: wrap;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .banks-content-wrapper {
        padding-top: 70px;
      }

      .banks-main-content {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .banks-content-wrapper {
        padding-top: 120px;
      }

      .banks-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .banks-content-wrapper {
        padding-top: 120px;
      }

      .banks-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }

    @media (max-width: 480px) {
      .banks-pagination-wrapper {
        padding: 0.625rem 0.75rem;
      }

      .banks-pagination-info {
        font-size: 0.75rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .banks-pagination-items-per-page {
        width: 100%;
        justify-content: space-between;
      }

      .banks-pagination-button {
        width: 1.875rem;
        height: 1.875rem;
      }

      .banks-pagination-button svg {
        width: 14px;
        height: 14px;
      }

      .banks-pagination-number {
        min-width: 1.875rem;
        height: 1.875rem;
        padding: 0 0.35rem;
        font-size: 0.75rem;
      }

      .banks-pagination-numbers {
        gap: 0.2rem;
      }

      .banks-pagination-ellipsis {
        padding: 0 0.2rem;
        font-size: 0.75rem;
      }
    }
  `;

  return (
    <div className="banks-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="banks-content-wrapper">
        <div className="banks-main-content">
          <div className="banks-breadcrumbs">
            <Link to="/directories">&gt;&gt; Directory</Link>
          </div>
          <div className="banks-header">
            <h1 className="banks-title">Banks in Ghana</h1>
            <p className="banks-subtitle">
              Explore banks across Ghana. Find detailed information about banking services, 
              branches, and more to help you choose the right bank for your financial needs.
            </p>
          </div>

          <div className="banks-controls">
            <div className="banks-search-wrapper">
              <Search className="banks-search-icon" />
              <input
                type="text"
                placeholder="Search banks by name, region, type, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="banks-search-input"
              />
            </div>
          </div>

          <div className="banks-table">
            <div className="banks-table-header">
              <div>Name</div>
              <div>Region</div>
              <div>Type</div>
              <div>Services</div>
              <div>Branches</div>
            </div>

            {paginatedBanks.map((bank) => (
              <React.Fragment key={bank.id}>
                <div
                  className={`bank-row ${expandedId === bank.id ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(bank.id)}
                >
                  <div className="bank-name">
                    {bank.name}
                  </div>
                  <div className="bank-region">{bank.region}</div>
                  <div className="bank-type">{bank.type}</div>
                  <div className="bank-services">{bank.services}</div>
                  <div className="bank-branches">{bank.branches}</div>
                </div>

                <AnimatePresence>
                  {expandedId === bank.id && (
                    <motion.div
                      className="bank-expanded-content"
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
                        <div className="bank-expanded-content-inner-wrapper">
                          <div className="bank-expanded-inner">
                            <div className="bank-logo">
                              {bank.logo ? (
                                <img src={bank.logo} alt={`${bank.name} logo`} />
                              ) : (
                                <div className="bank-logo-placeholder">
                                  {bank.initials || bank.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                                </div>
                              )}
                            </div>

                          <div>
                            <p className="bank-description">
                              {bank.description}
                            </p>
                            <a 
                              href={bank.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bank-with-button"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {getBankButtonText(bank)}
                            </a>
                          </div>

                          <div className="bank-info-display">
                            <div className="bank-info-label">Branches</div>
                            <div className="bank-info-value">
                              {bank.branches}
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

          {filteredBanks.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: 'hsl(220 20% 40%)'
            }}>
              <p>No banks found matching your search criteria.</p>
            </div>
          )}

          {filteredBanks.length > 0 && (
            <div className="banks-pagination-wrapper">
              <div className="banks-pagination-info">
                <span>
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredBanks.length)}</strong> of <strong>{filteredBanks.length}</strong> banks
                </span>
              </div>

              <div className="banks-pagination">
                <button
                  className="banks-pagination-button"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  className="banks-pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="banks-pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="banks-pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`banks-pagination-number ${currentPage === page ? 'active' : ''}`}
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
                  className="banks-pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  className="banks-pagination-button"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>

              <div className="banks-pagination-items-per-page">
                <label htmlFor="items-per-page">Show:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="banks-items-per-page-select"
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

export default Banks;

