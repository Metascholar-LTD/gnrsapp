import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, Globe, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UniversityData {
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
  website?: string;
  photos?: string[];
  acceptanceRate?: string;
  averageGrantAid?: string;
  undergraduatePopulation?: string;
  fullTimePercentage?: number;
  partTimePercentage?: number;
  malePercentage?: number;
  femalePercentage?: number;
  programEnrollment?: { label: string; percentage: number; color: string }[];
  abbreviation?: string;
  academics?: {
    studentFacultyRatio?: string;
    graduationRate?: string;
    retentionRate?: string;
  };
  financialAid?: {
    averageAid?: string;
    aidPercentage?: string;
    scholarshipAvailability?: string;
  };
  admissions?: {
    acceptanceRate?: string;
    yieldRate?: string;
    satRange?: string;
    actRange?: string;
  };
  studentLife?: {
    campusHousing?: string;
    clubsAndOrganizations?: string;
    athletics?: string;
  };
  rankings?: { list: string; position: string }[];
}

const UniversityView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'academics' | 'financial' | 'admissions' | 'student'>('academics');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // University logo mapping
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

  // Helper function to get university website
  const getUniversityWebsite = (name: string): string => {
    const websiteMap: Record<string, string> = {
      'University of Ghana': 'www.ug.edu.gh',
      'Kwame Nkrumah University of Science and Technology': 'www.knust.edu.gh',
      'University of Cape Coast': 'www.ucc.edu.gh',
      'Ashesi University': 'www.ashesi.edu.gh',
      'Ghana Institute of Management and Public Administration': 'www.gimpa.edu.gh',
      'University of Professional Studies': 'www.upsa.edu.gh',
      'Central University': 'www.central.edu.gh',
      'Regent University College of Science and Technology': 'www.regent.edu.gh',
      'University of Education, Winneba': 'www.uew.edu.gh',
      'University of Mines and Technology': 'www.umat.edu.gh',
      'University for Development Studies': 'www.uds.edu.gh',
      'Catholic University of Ghana': 'www.cug.edu.gh',
      'Pentecost University College': 'www.pentvars.edu.gh',
      'University of Energy and Natural Resources': 'www.uenr.edu.gh',
      'Accra Institute of Technology': 'www.ait.edu.gh',
    };
    return websiteMap[name] || `www.${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.edu.gh`;
  };

  // Helper function to get university abbreviation
  const getUniversityAbbreviation = (name: string): string | undefined => {
    const abbreviationMap: Record<string, string> = {
      'University of Ghana': 'UG',
      'Kwame Nkrumah University of Science and Technology': 'KNUST',
      'University of Cape Coast': 'UCC',
      'Ghana Institute of Management and Public Administration': 'GIMPA',
      'University of Professional Studies': 'UPSA',
      'University of Education, Winneba': 'UEW',
      'University of Mines and Technology': 'UMaT',
      'University for Development Studies': 'UDS',
      'Catholic University of Ghana': 'CUG',
      'Pentecost University College': 'PUC',
      'University of Energy and Natural Resources': 'UENR',
      'Accra Institute of Technology': 'AIT',
    };
    return abbreviationMap[name];
  };

  // Helper function to generate default data for universities
  const generateDefaultUniversityData = (baseData: {
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
  }): UniversityData => {
    const acceptanceRateNum = Math.floor(Math.random() * 30) + 50; // 50-80%
    const fullTime = Math.floor(Math.random() * 20) + 75; // 75-95%
    
    return {
      ...baseData,
      website: getUniversityWebsite(baseData.name),
      abbreviation: getUniversityAbbreviation(baseData.name),
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg',
      ],
      acceptanceRate: `${acceptanceRateNum}%`,
      averageGrantAid: baseData.type === 'Public' ? 'GHS 800 - 1,500' : 'GHS 2,000 - 4,000',
      undergraduatePopulation: baseData.studentPopulation?.replace('+', '') || '10,000',
      fullTimePercentage: fullTime,
      partTimePercentage: 100 - fullTime,
      malePercentage: Math.floor(Math.random() * 20) + 40, // 40-60%
      femalePercentage: Math.floor(Math.random() * 20) + 40, // 40-60%
      programEnrollment: (() => {
        const programs = [
          { label: 'Business & Management', base: 22, color: '#3b82f6' },
          { label: 'Engineering & Technology', base: 18, color: '#10b981' },
          { label: 'Medicine & Health Sciences', base: 15, color: '#f59e0b' },
          { label: 'Computer Science & IT', base: 12, color: '#ef4444' },
          { label: 'Arts & Humanities', base: 10, color: '#8b5cf6' },
          { label: 'Natural Sciences', base: 8, color: '#ec4899' },
          { label: 'Education', base: 6, color: '#6366f1' },
          { label: 'Agriculture', base: 4, color: '#14b8a6' },
          { label: 'Law', base: 3, color: '#a855f7' },
          { label: 'Other Programs', base: 2, color: '#64748b' },
        ];
        const percentages = programs.map(p => p.base + Math.floor(Math.random() * 4));
        const total = percentages.reduce((sum, p) => sum + p, 0);
        return programs.map((p, i) => ({
          label: p.label,
          percentage: Math.round((percentages[i] / total) * 100),
          color: p.color,
        }));
      })(),
      academics: {
        studentFacultyRatio: `${Math.floor(Math.random() * 10) + 15}:1`,
        graduationRate: `${Math.floor(Math.random() * 20) + 65}%`,
        retentionRate: `${Math.floor(Math.random() * 15) + 75}%`,
      },
      financialAid: {
        averageAid: baseData.type === 'Public' ? 'GHS 800 - 1,500' : 'GHS 2,000 - 4,000',
        aidPercentage: `${Math.floor(Math.random() * 20) + 30}%`,
        scholarshipAvailability: 'Available',
      },
      admissions: {
        acceptanceRate: `${acceptanceRateNum}%`,
        yieldRate: `${Math.floor(Math.random() * 20) + 30}%`,
      },
      studentLife: {
        campusHousing: 'Available',
        clubsAndOrganizations: `${Math.floor(Math.random() * 100) + 50}+`,
        athletics: 'Active',
      },
      rankings: [
        { list: 'Top Universities in Ghana', position: `#${baseData.id}` },
        { list: baseData.type === 'Public' ? 'Public Universities' : 'Private Universities', position: `#${baseData.id}` },
      ],
    };
  };

  // Mock university data - in production, fetch from API
  const universities: UniversityData[] = [
    generateDefaultUniversityData({
      id: '1',
      name: 'University of Ghana',
      region: 'Greater Accra',
      type: 'Public',
      tuitionFee: 'GHS 2,500 - 4,500',
      admissionCutOff: 'Aggregate 6-24',
      programs: '100+ Programs',
      specialization: 'Research & Medicine',
      logo: universityLogos['University of Ghana'],
      description: 'The University of Ghana is the oldest and largest of the thirteen Ghanaian national public universities. It was founded in 1948 and is located in Legon, Accra. The university offers a wide range of undergraduate and postgraduate programs across various disciplines including Arts, Sciences, Business, Law, Medicine, and Engineering. The university is known for its strong research programs and has produced many notable alumni in various fields.',
      campus: ['Legon', 'Accra City'],
      studentPopulation: '40,000+',
      yearEstablished: '1948',
    }),
    generateDefaultUniversityData({
      id: '2',
      name: 'Kwame Nkrumah University of Science and Technology',
      region: 'Ashanti',
      type: 'Public',
      tuitionFee: 'GHS 2,200 - 4,200',
      admissionCutOff: 'Aggregate 6-26',
      programs: '80+ Programs',
      specialization: 'Science & Engineering',
      logo: universityLogos['Kwame Nkrumah University of Science and Technology'],
      description: 'KNUST is a public university located in Kumasi, Ghana. It focuses on science and technology education and is one of the leading universities in Africa. The university is known for its strong engineering, technology, and applied sciences programs. KNUST has produced many engineers, scientists, and technologists who have contributed significantly to Ghana\'s development.',
      campus: ['Kumasi'],
      studentPopulation: '35,000+',
      yearEstablished: '1952',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '1962',
    }),
    generateDefaultUniversityData({
      id: '4',
      name: 'Ashesi University',
      region: 'Eastern',
      type: 'Private',
      tuitionFee: 'GHS 15,000 - 18,000',
      admissionCutOff: 'Aggregate 6-12',
      programs: '15+ Programs',
      specialization: 'Leadership & Innovation',
      logo: undefined,
      description: 'Ashesi University is a private, non-profit liberal arts university located in Berekuso, Ghana. Founded in 2002, Ashesi has gained recognition for its innovative approach to education and its focus on ethical leadership and entrepreneurship. The university offers programs in Business Administration, Computer Science, Management Information Systems, and Engineering.',
      campus: ['Berekuso'],
      studentPopulation: '1,200+',
      yearEstablished: '2002',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '1961',
    }),
    generateDefaultUniversityData({
      id: '6',
      name: 'University of Professional Studies',
      region: 'Greater Accra',
      type: 'Public',
      tuitionFee: 'GHS 2,400 - 4,500',
      admissionCutOff: 'Aggregate 8-28',
      programs: '40+ Programs',
      specialization: 'Professional Studies',
      logo: undefined,
      description: 'UPSA is a public university located in Accra, Ghana. It focuses on professional studies including accounting, finance, marketing, and management. The university is known for producing skilled professionals for the business sector and offers programs in Business Administration, Accounting, Marketing, and Communication Studies.',
      campus: ['Accra'],
      studentPopulation: '12,000+',
      yearEstablished: '1965',
    }),
    generateDefaultUniversityData({
      id: '7',
      name: 'Central University',
      region: 'Greater Accra',
      type: 'Private',
      tuitionFee: 'GHS 8,000 - 12,000',
      admissionCutOff: 'Aggregate 12-30',
      programs: '50+ Programs',
      specialization: 'Christian Values',
      logo: undefined,
      description: 'Central University is a private Christian university located in Miotso, Ghana. It offers a range of undergraduate and postgraduate programs with a focus on Christian values and academic excellence. Programs include Business Administration, Theology, Nursing, Engineering, and Information Technology.',
      campus: ['Miotso', 'Kumasi'],
      studentPopulation: '5,000+',
      yearEstablished: '1988',
    }),
    generateDefaultUniversityData({
      id: '8',
      name: 'Regent University College of Science and Technology',
      region: 'Greater Accra',
      type: 'Private',
      tuitionFee: 'GHS 6,500 - 10,000',
      admissionCutOff: 'Aggregate 14-30',
      programs: '25+ Programs',
      specialization: 'Technology & Innovation',
      logo: undefined,
      description: 'Regent University is a private university located in Accra, Ghana. It focuses on science and technology education and offers programs in engineering, computer science, business, and information technology. The university emphasizes practical skills and industry-relevant training.',
      campus: ['Accra'],
      studentPopulation: '3,500+',
      yearEstablished: '2003',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '1992',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '2004',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '1992',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '2003',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '2003',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '2011',
    }),
    generateDefaultUniversityData({
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
      yearEstablished: '2009',
    }),
  ];

  const university = universities.find(u => u.id === id);

  if (!university) {
    return (
      <div>
        <Navigation />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>University not found</h1>
          <Link to="/directories/universities">Back to Universities</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nextPhoto = () => {
    if (university.photos && university.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % university.photos!.length);
    }
  };

  const prevPhoto = () => {
    if (university.photos && university.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + university.photos!.length) % university.photos!.length);
    }
  };

  const isolatedStyles = `
    .university-view-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .university-view-content-wrapper {
      padding-top: 80px;
      min-height: calc(100vh - 80px);
    }

    .university-view-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: clamp(1rem, 4vw, 2rem);
    }

    .university-view-back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      padding: clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem);
      background: white;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.75rem;
      color: hsl(220 30% 15%);
      text-decoration: none;
      font-size: clamp(0.875rem, 2vw, 0.95rem);
      font-weight: 500;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      cursor: pointer;
    }

    .university-view-back-button:hover {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
    }

    .university-view-header {
      background: white;
      border-radius: clamp(0.75rem, 2vw, 1rem);
      padding: clamp(1rem, 4vw, 2rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid hsl(40 20% 88%);
    }

    .university-view-header-top {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(1.5rem, 5vw, 3rem);
      align-items: start;
      margin-bottom: 0;
    }

    .university-view-left-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .university-view-right-section {
      display: flex;
      flex-direction: column;
    }

    .university-view-logo-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .university-view-social-icons {
      display: flex;
      gap: 0.75rem;
    }

    .university-view-social-icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      background: hsl(40 20% 94%);
      color: hsl(220 30% 15%);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .university-view-social-icon:hover {
      background: hsl(220 30% 15%);
      color: white;
    }

    .university-view-logo {
      width: clamp(80px, 15vw, 120px);
      height: clamp(80px, 15vw, 120px);
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid hsl(40 20% 88%);
      overflow: hidden;
      padding: clamp(0.375rem, 1vw, 0.5rem);
    }

    .university-view-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .university-view-title-section {
      width: 100%;
    }

    .university-view-title {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(0.375rem, 1vw, 0.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.2;
    }

    .university-view-rankings {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }

    .university-view-ranking {
      padding: 0.5rem 1rem;
      background: hsl(40 20% 94%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      font-weight: 500;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0;
    }

    .university-view-stats-table tr {
      border-bottom: 1px solid hsl(40 20% 88%);
    }

    .university-view-stats-table tr:last-child {
      border-bottom: none;
    }

    .university-view-stats-table td {
      padding: clamp(0.75rem, 2vw, 1rem);
      font-size: clamp(0.875rem, 2vw, 0.95rem);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-stats-table td:first-child {
      font-weight: 600;
      color: hsl(220 30% 15%);
      width: 40%;
    }

    .university-view-stats-table td:last-child {
      color: hsl(220 20% 40%);
    }

    .university-view-about-photos-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      align-items: start;
    }

    .university-view-description {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid hsl(40 20% 88%);
      height: fit-content;
      align-self: start;
    }

    .university-view-description-title {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-description-text {
      font-size: clamp(0.875rem, 2vw, 1rem);
      line-height: 1.8;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
    }

    .university-view-photos-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid hsl(40 20% 88%);
      height: fit-content;
      align-self: start;
    }

    .university-view-photos-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-photo-container {
      position: relative;
      width: 100%;
      height: clamp(250px, 50vw, 400px);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      overflow: hidden;
      background: hsl(40 20% 94%);
    }

    .university-view-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .university-view-photo-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: clamp(2.5rem, 6vw, 3rem);
      height: clamp(2.5rem, 6vw, 3rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      color: hsl(220 30% 15%);
      touch-action: manipulation;
    }

    .university-view-photo-nav:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .university-view-photo-nav.prev {
      left: 1rem;
    }

    .university-view-photo-nav.next {
      right: 1rem;
    }

    .university-view-photo-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .university-view-photo-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: hsl(40 20% 88%);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .university-view-photo-dot.active {
      background: hsl(220 30% 15%);
      width: 1.5rem;
      border-radius: 0.25rem;
    }

    .university-view-breakdown-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .university-view-breakdown-title {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid hsl(40 20% 88%);
      margin-bottom: 2rem;
    }

    .university-view-tab {
      padding: clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
      background: none;
      border: none;
      font-size: clamp(0.875rem, 2vw, 0.95rem);
      font-weight: 500;
      color: hsl(220 20% 40%);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      touch-action: manipulation;
      min-width: fit-content;
    }

    .university-view-tab:hover {
      color: hsl(220 30% 15%);
    }

    .university-view-tab.active {
      color: hsl(220 30% 15%);
      border-bottom-color: hsl(220 30% 15%);
    }

    .university-view-tab-content {
      min-height: 300px;
    }

    .university-view-stat-item {
      margin-bottom: 2rem;
    }

    .university-view-stat-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .university-view-stat-value {
      font-size: clamp(1.25rem, 3vw, 1.5rem);
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-stat-bar {
      width: 100%;
      height: 1.5rem;
      background: hsl(40 20% 94%);
      border-radius: 0.75rem;
      overflow: hidden;
      position: relative;
    }

    .university-view-stat-bar-fill {
      height: 100%;
      background: hsl(220 30% 15%);
      border-radius: 0.75rem;
      transition: width 0.3s ease;
    }

    .university-view-stat-bar-fill.light {
      background: hsl(220 20% 60%);
    }

    .university-view-numbers-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .university-view-numbers-title {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(1.5rem, 4vw, 2rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-numbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: clamp(1rem, 3vw, 2rem);
    }

    .university-view-numbers-item {
      padding: 1.5rem;
      background: hsl(40 20% 98%);
      border-radius: 0.75rem;
    }

    .university-view-numbers-item-title {
      font-size: 1rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-donut-chart {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .university-view-donut-wrapper {
      width: clamp(120px, 20vw, 150px);
      height: clamp(120px, 20vw, 150px);
      position: relative;
      flex-shrink: 0;
    }

    .university-view-donut-legend {
      flex: 1;
    }

    .university-view-donut-legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-donut-color {
      width: 0.875rem;
      height: 0.875rem;
      border-radius: 0.25rem;
      flex-shrink: 0;
    }

    .university-view-donut-label {
      flex: 1;
      color: hsl(220 20% 40%);
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .university-view-donut-percentage {
      font-weight: 600;
      color: hsl(220 30% 15%);
      font-size: 0.75rem;
    }

    .university-view-rankings-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .university-view-rankings-section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-rankings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .university-view-ranking-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: hsl(40 20% 98%);
      border-radius: 0.75rem;
    }

    .university-view-ranking-position {
      font-size: 1.25rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-ranking-list-name {
      font-size: 1rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-other-universities-section {
      margin-top: 3rem;
      margin-bottom: 2rem;
    }

    .university-view-other-universities-title {
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(0.375rem, 1vw, 0.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-other-universities-subtitle {
      font-size: clamp(0.875rem, 2vw, 1rem);
      color: hsl(220 20% 40%);
      margin: 0 0 clamp(1.5rem, 4vw, 2rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-other-universities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
      gap: clamp(0.75rem, 2vw, 1rem);
    }

    .university-view-other-university-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1rem;
      border: 1px solid hsl(40 20% 88%);
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: row;
      gap: 0.75rem;
      cursor: pointer;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .university-view-other-university-card:hover {
      border-color: hsl(220 20% 40%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .university-view-other-university-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: none;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .university-view-other-university-card:hover .university-view-other-university-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .university-view-other-university-abbreviation {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .university-view-other-university-logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .university-view-other-university-logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid hsl(40 20% 88%);
      overflow: hidden;
      padding: 0.375rem;
    }

    .university-view-other-university-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .university-view-other-university-placeholder {
      font-size: 0.875rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      text-align: center;
    }

    .university-view-other-university-divider {
      width: 1px;
      height: 40px;
      background: hsl(40 20% 88%);
      flex-shrink: 0;
    }

    .university-view-other-university-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 0;
    }

    .university-view-other-university-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.3;
      text-align: left;
    }

    .university-view-other-university-details {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .university-view-other-university-detail-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-other-university-detail-item svg {
      flex-shrink: 0;
      color: hsl(220 20% 40%);
    }

    .university-view-other-university-type {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: hsl(40 20% 94%);
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: hsl(220 30% 15%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      width: fit-content;
      white-space: nowrap;
    }

    /* Tablet and below (768px and below) */
    @media (max-width: 768px) {
      .university-view-main-content {
        padding: clamp(0.75rem, 3vw, 1rem);
      }

      .university-view-header {
        padding: clamp(1rem, 4vw, 1.5rem);
      }

      .university-view-header-top {
        grid-template-columns: 1fr;
        gap: clamp(1.5rem, 4vw, 2rem);
      }

      .university-view-left-section {
        order: 1;
      }

      .university-view-right-section {
        order: 2;
      }

      .university-view-logo-section {
        align-items: center;
      }

      .university-view-social-icons {
        justify-content: center;
      }

      .university-view-stats-table {
        font-size: clamp(0.8rem, 2vw, 0.9rem);
      }

      .university-view-stats-table td {
        padding: clamp(0.625rem, 2vw, 0.875rem);
      }

      .university-view-about-photos-wrapper {
        grid-template-columns: 1fr;
        gap: clamp(1rem, 3vw, 1.5rem);
      }

      .university-view-description,
      .university-view-photos-section {
        padding: clamp(1rem, 4vw, 1.5rem);
      }

      .university-view-breakdown-section {
        padding: clamp(1rem, 4vw, 1.5rem);
      }

      .university-view-numbers-section {
        padding: clamp(1rem, 4vw, 1.5rem);
      }

      .university-view-numbers-grid {
        grid-template-columns: 1fr;
        gap: clamp(1rem, 3vw, 1.5rem);
      }

      .university-view-donut-chart {
        flex-direction: column;
        align-items: center;
        gap: clamp(1rem, 3vw, 1.5rem);
      }

      .university-view-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        gap: clamp(0.375rem, 1vw, 0.5rem);
      }

      .university-view-tabs::-webkit-scrollbar {
        height: 4px;
      }

      .university-view-tabs::-webkit-scrollbar-track {
        background: hsl(40 20% 94%);
      }

      .university-view-tabs::-webkit-scrollbar-thumb {
        background: hsl(220 20% 40%);
        border-radius: 2px;
      }

      .university-view-tab {
        white-space: nowrap;
        flex-shrink: 0;
      }

      .university-view-rankings-section {
        padding: clamp(1rem, 4vw, 1.5rem);
      }

      .university-view-other-universities-grid {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
        gap: clamp(0.625rem, 2vw, 0.75rem);
      }

      .university-view-other-university-card {
        padding: clamp(0.75rem, 2vw, 0.875rem);
        flex-direction: column;
        text-align: center;
      }

      .university-view-other-university-logo {
        width: clamp(45px, 10vw, 50px);
        height: clamp(45px, 10vw, 50px);
      }

      .university-view-other-university-divider {
        display: none;
      }

      .university-view-other-university-info {
        align-items: center;
      }

      .university-view-other-university-name {
        text-align: center;
      }

      .university-view-other-university-details {
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    /* Mobile (480px and below) */
    @media (max-width: 480px) {
      .university-view-main-content {
        padding: clamp(0.5rem, 2vw, 0.75rem);
      }

      .university-view-header {
        padding: clamp(0.875rem, 3vw, 1rem);
        border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      }

      .university-view-back-button {
        padding: clamp(0.5rem, 2vw, 0.625rem) clamp(0.875rem, 2.5vw, 1rem);
        font-size: clamp(0.8rem, 2vw, 0.875rem);
      }

      .university-view-logo {
        width: clamp(70px, 18vw, 90px);
        height: clamp(70px, 18vw, 90px);
      }

      .university-view-social-icon {
        width: clamp(2rem, 5vw, 2.25rem);
        height: clamp(2rem, 5vw, 2.25rem);
      }

      .university-view-title {
        font-size: clamp(1.25rem, 6vw, 1.5rem);
        text-align: center;
      }

      .university-view-rankings {
        justify-content: center;
        gap: clamp(0.5rem, 2vw, 0.75rem);
      }

      .university-view-ranking {
        padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
        font-size: clamp(0.75rem, 2vw, 0.875rem);
      }

      .university-view-stats-table {
        font-size: clamp(0.75rem, 2vw, 0.85rem);
      }

      .university-view-stats-table td {
        padding: clamp(0.5rem, 2vw, 0.75rem);
        display: block;
        width: 100%;
        border-bottom: 1px solid hsl(40 20% 88%);
      }

      .university-view-stats-table td:first-child {
        width: 100%;
        font-weight: 600;
        padding-bottom: 0.25rem;
      }

      .university-view-stats-table td:last-child {
        padding-top: 0.25rem;
        padding-bottom: 0.75rem;
      }

      .university-view-stats-table tr:last-child td:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .university-view-description,
      .university-view-photos-section {
        padding: clamp(0.875rem, 3vw, 1rem);
        border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      }

      .university-view-photo-container {
        height: clamp(200px, 60vw, 280px);
      }

      .university-view-photo-nav {
        width: clamp(2rem, 8vw, 2.5rem);
        height: clamp(2rem, 8vw, 2.5rem);
      }

      .university-view-photo-nav.prev {
        left: clamp(0.5rem, 2vw, 0.75rem);
      }

      .university-view-photo-nav.next {
        right: clamp(0.5rem, 2vw, 0.75rem);
      }

      .university-view-breakdown-section {
        padding: clamp(0.875rem, 3vw, 1rem);
      }

      .university-view-tabs {
        gap: clamp(0.25rem, 1vw, 0.375rem);
        padding-bottom: 0.5rem;
      }

      .university-view-tab {
        padding: clamp(0.5rem, 2vw, 0.625rem) clamp(0.875rem, 2.5vw, 1rem);
        font-size: clamp(0.8rem, 2vw, 0.875rem);
      }

      .university-view-stat-item {
        margin-bottom: clamp(1.25rem, 4vw, 1.5rem);
      }

      .university-view-stat-label {
        font-size: clamp(0.75rem, 2vw, 0.8rem);
      }

      .university-view-stat-value {
        font-size: clamp(1.125rem, 4vw, 1.25rem);
      }

      .university-view-stat-bar {
        height: clamp(1.25rem, 3vw, 1.5rem);
      }

      .university-view-numbers-section {
        padding: clamp(0.875rem, 3vw, 1rem);
      }

      .university-view-numbers-item {
        padding: clamp(1rem, 3vw, 1.25rem);
      }

      .university-view-donut-wrapper {
        width: clamp(100px, 25vw, 120px);
        height: clamp(100px, 25vw, 120px);
      }

      .university-view-donut-legend-item {
        font-size: clamp(0.7rem, 2vw, 0.75rem);
      }

      .university-view-rankings-section {
        padding: clamp(0.875rem, 3vw, 1rem);
      }

      .university-view-ranking-item {
        padding: clamp(0.75rem, 2vw, 0.875rem);
        flex-direction: column;
        align-items: flex-start;
        gap: clamp(0.5rem, 2vw, 0.75rem);
      }

      .university-view-ranking-position {
        font-size: clamp(1rem, 3vw, 1.125rem);
      }

      .university-view-ranking-list-name {
        font-size: clamp(0.875rem, 2vw, 0.95rem);
      }

      .university-view-other-universities-section {
        margin-top: clamp(2rem, 5vw, 2.5rem);
      }

      .university-view-other-universities-grid {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
        gap: clamp(0.5rem, 2vw, 0.625rem);
      }

      .university-view-other-university-card {
        padding: clamp(0.625rem, 2vw, 0.75rem);
      }

      .university-view-other-university-logo {
        width: clamp(40px, 12vw, 45px);
        height: clamp(40px, 12vw, 45px);
      }

      .university-view-other-university-name {
        font-size: clamp(0.8rem, 2vw, 0.875rem);
      }

      .university-view-other-university-detail-item {
        font-size: clamp(0.7rem, 2vw, 0.75rem);
      }

      .university-view-other-university-type {
        font-size: clamp(0.7rem, 2vw, 0.75rem);
        padding: clamp(0.2rem, 1vw, 0.25rem) clamp(0.4rem, 1.5vw, 0.5rem);
      }
    }

    /* Large screens (1024px and above) */
    @media (min-width: 1024px) {
      .university-view-main-content {
        padding: clamp(2rem, 4vw, 3rem);
      }

      .university-view-header {
        padding: clamp(2rem, 4vw, 2.5rem);
      }

      .university-view-about-photos-wrapper {
        gap: clamp(1.5rem, 3vw, 2rem);
      }
    }

    /* Extra large screens (1400px and above) */
    @media (min-width: 1400px) {
      .university-view-main-content {
        max-width: 1600px;
      }

      .university-view-header-top {
        gap: 4rem;
      }
    }
  `;

  return (
    <div className="university-view-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="university-view-content-wrapper">
        <div className="university-view-main-content">
          <button onClick={() => navigate(-1)} className="university-view-back-button">
            <ArrowLeft size={18} />
            Back to Universities
          </button>

          {/* Header Section */}
          <div className="university-view-header">
            <div className="university-view-header-top">
              <div className="university-view-left-section">
                <div className="university-view-logo-section">
                  <div className="university-view-social-icons">
                    <a href="#" className="university-view-social-icon" aria-label="Facebook">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="university-view-social-icon" aria-label="Twitter">
                      <Twitter size={18} />
                    </a>
                    <a href="#" className="university-view-social-icon" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                  </div>
                  <div className="university-view-logo">
                    {university.logo ? (
                      <img src={university.logo} alt={`${university.name} logo`} />
                    ) : (
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'hsl(220 30% 15%)' }}>
                        {university.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="university-view-title-section">
                  <h1 className="university-view-title">{university.name}</h1>
                  {university.rankings && university.rankings.length > 0 && (
                    <div className="university-view-rankings">
                      {university.rankings.map((ranking, idx) => (
                        <div key={idx} className="university-view-ranking">
                          {ranking.position} {ranking.list}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="university-view-right-section">
                <table className="university-view-stats-table">
                  <tbody>
                    <tr>
                      <td>CITY & REGION</td>
                      <td>{university.campus?.[0] || university.region}, {university.region}</td>
                    </tr>
                    <tr>
                      <td>PUBLIC/PRIVATE</td>
                      <td>{university.type}</td>
                    </tr>
                    {university.undergraduatePopulation && (
                      <tr>
                        <td>UNDERGRADUATE POPULATION</td>
                        <td>{university.undergraduatePopulation}</td>
                      </tr>
                    )}
                    {university.studentPopulation && (
                      <tr>
                        <td>STUDENT POPULATION*</td>
                        <td>{university.studentPopulation}</td>
                      </tr>
                    )}
                    {university.averageGrantAid && (
                      <tr>
                        <td>AVERAGE GRANT AID*</td>
                        <td>{university.averageGrantAid}</td>
                      </tr>
                    )}
                    {university.acceptanceRate && (
                      <tr>
                        <td>ACCEPTANCE RATE*</td>
                        <td>{university.acceptanceRate}</td>
                      </tr>
                    )}
                    {university.website && (
                      <tr>
                        <td>WEBSITE</td>
                        <td>
                          <a href={`https://${university.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(220 20% 40%)', textDecoration: 'none' }}>
                            {university.website}
                            <Globe size={14} style={{ marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Description and Photos Section */}
          <div className="university-view-about-photos-wrapper">
            <div className="university-view-description">
              <h2 className="university-view-description-title">ABOUT</h2>
              <p className="university-view-description-text">{university.description}</p>
            </div>

            {university.photos && university.photos.length > 0 && (
              <div className="university-view-photos-section">
                <h2 className="university-view-photos-title">PHOTOS</h2>
                <div className="university-view-photo-container">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPhotoIndex}
                      src={university.photos[currentPhotoIndex]}
                      alt={`${university.name} photo ${currentPhotoIndex + 1}`}
                      className="university-view-photo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  {university.photos.length > 1 && (
                    <>
                      <button className="university-view-photo-nav prev" onClick={prevPhoto} aria-label="Previous photo">
                        <ChevronLeft size={24} />
                      </button>
                      <button className="university-view-photo-nav next" onClick={nextPhoto} aria-label="Next photo">
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
                {university.photos.length > 1 && (
                  <div className="university-view-photo-dots">
                    {university.photos.map((_, index) => (
                      <button
                        key={index}
                        className={`university-view-photo-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                        onClick={() => setCurrentPhotoIndex(index)}
                        aria-label={`Go to photo ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Breakdown Section */}
          <div className="university-view-breakdown-section">
            <h2 className="university-view-breakdown-title">BREAKDOWN</h2>
            <div className="university-view-tabs">
              <button
                className={`university-view-tab ${activeTab === 'academics' ? 'active' : ''}`}
                onClick={() => setActiveTab('academics')}
              >
                Academics
              </button>
              <button
                className={`university-view-tab ${activeTab === 'financial' ? 'active' : ''}`}
                onClick={() => setActiveTab('financial')}
              >
                Financial Aid
              </button>
              <button
                className={`university-view-tab ${activeTab === 'admissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('admissions')}
              >
                Admissions
              </button>
              <button
                className={`university-view-tab ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => setActiveTab('student')}
              >
                Student Life
              </button>
            </div>

            <div className="university-view-tab-content">
              <AnimatePresence mode="wait">
                {activeTab === 'academics' && university.academics && (
                  <motion.div
                    key="academics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {university.academics.studentFacultyRatio && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">STUDENT-FACULTY RATIO</div>
                        <div className="university-view-stat-value">{university.academics.studentFacultyRatio}</div>
                      </div>
                    )}
                    {university.academics.graduationRate && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">GRADUATION RATE</div>
                        <div className="university-view-stat-value">{university.academics.graduationRate}</div>
                      </div>
                    )}
                    {university.academics.retentionRate && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">RETENTION RATE</div>
                        <div className="university-view-stat-value">{university.academics.retentionRate}</div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'financial' && university.financialAid && (
                  <motion.div
                    key="financial"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {university.financialAid.averageAid && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">AVERAGE FINANCIAL AID</div>
                        <div className="university-view-stat-value">{university.financialAid.averageAid}</div>
                      </div>
                    )}
                    {university.financialAid.aidPercentage && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">FINANCIAL AID PERCENTAGE</div>
                        <div className="university-view-stat-value">{university.financialAid.aidPercentage}</div>
                        <div className="university-view-stat-bar">
                          <div
                            className="university-view-stat-bar-fill"
                            style={{ width: university.financialAid.aidPercentage }}
                          />
                        </div>
                      </div>
                    )}
                    {university.financialAid.scholarshipAvailability && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">SCHOLARSHIP AVAILABILITY</div>
                        <div className="university-view-stat-value">{university.financialAid.scholarshipAvailability}</div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'admissions' && university.admissions && (
                  <motion.div
                    key="admissions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {university.admissions.acceptanceRate && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">ADMISSIONS RATE</div>
                        <div className="university-view-stat-value">{university.admissions.acceptanceRate}</div>
                        <div className="university-view-stat-bar">
                          <div
                            className="university-view-stat-bar-fill"
                            style={{ width: university.admissions.acceptanceRate }}
                          />
                          <div
                            className="university-view-stat-bar-fill light"
                            style={{ width: `${100 - parseFloat(university.admissions.acceptanceRate)}%`, position: 'absolute', right: 0 }}
                          />
                        </div>
                      </div>
                    )}
                    {university.admissions.yieldRate && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">ADMISSIONS YIELD</div>
                        <div className="university-view-stat-value">{university.admissions.yieldRate}</div>
                        <div className="university-view-stat-bar">
                          <div
                            className="university-view-stat-bar-fill"
                            style={{ width: university.admissions.yieldRate }}
                          />
                          <div
                            className="university-view-stat-bar-fill light"
                            style={{ width: `${100 - parseFloat(university.admissions.yieldRate)}%`, position: 'absolute', right: 0 }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'student' && university.studentLife && (
                  <motion.div
                    key="student"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {university.studentLife.campusHousing && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">CAMPUS HOUSING</div>
                        <div className="university-view-stat-value">{university.studentLife.campusHousing}</div>
                      </div>
                    )}
                    {university.studentLife.clubsAndOrganizations && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">CLUBS & ORGANIZATIONS</div>
                        <div className="university-view-stat-value">{university.studentLife.clubsAndOrganizations}</div>
                      </div>
                    )}
                    {university.studentLife.athletics && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">ATHLETICS</div>
                        <div className="university-view-stat-value">{university.studentLife.athletics}</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* By The Numbers Section */}
          {(university.fullTimePercentage !== undefined || university.malePercentage !== undefined || university.programEnrollment) && (
            <div className="university-view-numbers-section">
              <h2 className="university-view-numbers-title">BY THE NUMBERS</h2>
              <div className="university-view-numbers-grid">
                {university.fullTimePercentage !== undefined && (
                  <div className="university-view-numbers-item">
                    <h3 className="university-view-numbers-item-title">Attendance</h3>
                    <div className="university-view-stat-item">
                      <div className="university-view-stat-label">FULL-TIME</div>
                      <div className="university-view-stat-value">{university.fullTimePercentage}%</div>
                      <div className="university-view-stat-bar">
                        <div
                          className="university-view-stat-bar-fill"
                          style={{ width: `${university.fullTimePercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="university-view-stat-item" style={{ marginTop: '1rem' }}>
                      <div className="university-view-stat-label">PART-TIME</div>
                      <div className="university-view-stat-value">{university.partTimePercentage}%</div>
                      <div className="university-view-stat-bar">
                        <div
                          className="university-view-stat-bar-fill"
                          style={{ width: `${university.partTimePercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {university.programEnrollment && university.programEnrollment.length > 0 && (
                  <div className="university-view-numbers-item">
                    <h3 className="university-view-numbers-item-title">Enrollment By Program</h3>
                    <div className="university-view-donut-chart">
                      <div className="university-view-donut-wrapper">
                        <svg width="150" height="150" viewBox="0 0 150 150">
                          <circle
                            cx="75"
                            cy="75"
                            r="60"
                            fill="none"
                            stroke="hsl(40 20% 94%)"
                            strokeWidth="30"
                          />
                          {university.programEnrollment.map((item, index, arr) => {
                            const total = arr.reduce((sum, i) => sum + i.percentage, 0);
                            const startAngle = arr.slice(0, index).reduce((sum, i) => sum + (i.percentage / total) * 360, 0);
                            const angle = (item.percentage / total) * 360;
                            const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
                            const angleRad = (angle * Math.PI) / 180;
                            const x1 = 75 + 60 * Math.cos(startAngleRad);
                            const y1 = 75 + 60 * Math.sin(startAngleRad);
                            const x2 = 75 + 60 * Math.cos(startAngleRad + angleRad);
                            const y2 = 75 + 60 * Math.sin(startAngleRad + angleRad);
                            const largeArc = angle > 180 ? 1 : 0;
                            return (
                              <path
                                key={index}
                                d={`M ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2}`}
                                fill="none"
                                stroke={item.color}
                                strokeWidth="30"
                                strokeLinecap="round"
                              />
                            );
                          })}
                        </svg>
                      </div>
                      <div className="university-view-donut-legend">
                        {university.programEnrollment.map((item, index) => (
                          <div key={index} className="university-view-donut-legend-item">
                            <div className="university-view-donut-color" style={{ background: item.color }} />
                            <span className="university-view-donut-label">{item.label}</span>
                            <span className="university-view-donut-percentage">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {university.malePercentage !== undefined && (
                  <div className="university-view-numbers-item">
                    <h3 className="university-view-numbers-item-title">Enrollment By Gender</h3>
                    <div className="university-view-stat-item">
                      <div className="university-view-stat-label">MALE</div>
                      <div className="university-view-stat-value">{university.malePercentage}%</div>
                      <div className="university-view-stat-bar">
                        <div
                          className="university-view-stat-bar-fill"
                          style={{ width: `${university.malePercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="university-view-stat-item" style={{ marginTop: '1rem' }}>
                      <div className="university-view-stat-label">FEMALE</div>
                      <div className="university-view-stat-value">{university.femalePercentage}%</div>
                      <div className="university-view-stat-bar">
                        <div
                          className="university-view-stat-bar-fill"
                          style={{ width: `${university.femalePercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Universities Section */}
          <div className="university-view-other-universities-section">
            <h2 className="university-view-other-universities-title">Other Universities</h2>
            <p className="university-view-other-universities-subtitle">
              Explore other universities in Ghana
            </p>
            <div className="university-view-other-universities-grid">
              {useMemo(() => {
                return universities
                  .filter(u => u.id !== university.id)
                  .slice(0, 5)
                  .map((otherUni) => (
                    <Link
                      key={otherUni.id}
                      to={`/directories/universities/${otherUni.id}`}
                      className={`university-view-other-university-card ${otherUni.abbreviation ? 'has-abbreviation' : ''}`}
                    >
                      <div className="university-view-other-university-logo-section">
                        <div className="university-view-other-university-logo">
                          {otherUni.logo ? (
                            <img src={otherUni.logo} alt={`${otherUni.name} logo`} />
                          ) : (
                            <div className="university-view-other-university-placeholder">
                              {otherUni.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                            </div>
                          )}
                        </div>
                        <div className="university-view-other-university-type">
                          {otherUni.type}
                        </div>
                      </div>
                      <div className="university-view-other-university-divider"></div>
                      <div className="university-view-other-university-info">
                        <h3 className="university-view-other-university-name">{otherUni.name}</h3>
                      </div>
                      {otherUni.abbreviation && (
                        <div className="university-view-other-university-overlay">
                          <span className="university-view-other-university-abbreviation">
                            {otherUni.abbreviation}
                          </span>
                        </div>
                      )}
                    </Link>
                  ));
              }, [university.id])}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UniversityView;

