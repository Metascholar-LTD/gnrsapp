import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ChevronLeft, ChevronRight, Facebook, Twitter, Linkedin, Youtube, Instagram, Globe, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface UniversityData {
  id: string;
  name: string;
  region: string;
  type: string;
  tuitionFee: string;
  admissionCutOff: string;
  programs: string;
  logo?: string;
  description: string;
  campus?: string[];
  mainCampus?: string;
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
    wassceScoreRange?: string;
  };
  studentLife?: {
    campusHousing?: string;
    clubsAndOrganizations?: string;
    athletics?: string;
  };
  rankings?: { list: string; position: string }[];
  courses?: Record<string, string[]>;
  mastersCourses?: Record<string, Record<string, string[]>>;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
}

// Helper function to transform Supabase data (snake_case) to app format (camelCase)
const transformFromSupabase = (data: any): UniversityData => {
  return {
    id: data.id,
    name: data.name,
    abbreviation: data.abbreviation,
    region: data.region,
    type: data.type,
    logo: data.logo,
    description: data.description,
    website: data.website,
    campus: data.campus || [],
    mainCampus: data.main_campus,
    studentPopulation: data.student_population,
    yearEstablished: data.year_established,
    tuitionFee: data.tuition_fee,
    admissionCutOff: data.admission_cut_off,
    programs: data.programs,
    fullTimePercentage: data.full_time_percentage,
    partTimePercentage: data.part_time_percentage,
    malePercentage: data.male_percentage,
    femalePercentage: data.female_percentage,
    undergraduatePopulation: data.undergraduate_population,
    acceptanceRate: data.acceptance_rate,
    averageGrantAid: data.average_grant_aid,
    programEnrollment: data.program_enrollment || [],
    academics: data.academics || {},
    financialAid: data.financial_aid || {},
    admissions: data.admissions || {},
    studentLife: data.student_life || {},
    rankings: data.rankings || [],
    courses: data.courses || {},
    mastersCourses: data.masters_courses || {},
    photos: data.photos || [],
    contact: data.contact || {},
  };
};

const UniversityView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<UniversityData | null>(null);
  const [allUniversities, setAllUniversities] = useState<UniversityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'academics' | 'financial' | 'admissions' | 'student' | 'courses'>('academics');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [degreeLevel, setDegreeLevel] = useState<'undergraduate' | 'postgraduate' | ''>('');

  useEffect(() => {
    if (id) {
      fetchUniversity(id);
      fetchAllUniversities();
    }
  }, [id]);

  const fetchUniversity = async (universityId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', universityId)
        .single();

      if (error) throw error;

      if (data) {
        const transformedData = transformFromSupabase(data);
        setUniversity(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching university:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        const transformedData = (data || []).map(transformFromSupabase);
        setAllUniversities(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching all universities:", error);
    }
  };

  // Helper function to format percentage values - adds % if missing
  const formatPercentage = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null || value === '') return '';
    const strValue = String(value).trim();
    if (strValue === '') return '';
    // If it already ends with %, return as is
    if (strValue.endsWith('%')) return strValue;
    // If it's a valid number, add %
    const numValue = parseFloat(strValue);
    if (!isNaN(numValue)) return `${numValue}%`;
    return strValue;
  };

  // Helper function to extract numeric value from percentage string for bar widths
  const getPercentageNumber = (value: string | number | undefined | null): number => {
    if (value === undefined || value === null || value === '') return 0;
    const strValue = String(value).trim().replace('%', '');
    const numValue = parseFloat(strValue);
    return isNaN(numValue) ? 0 : numValue;
  };

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

  // Helper function to generate generic courses structure from program enrollment
  const generateCoursesFromPrograms = (programEnrollment?: { label: string; percentage: number; color: string }[]): Record<string, string[]> => {
    if (!programEnrollment || programEnrollment.length === 0) {
      return {
        'General Programs': ['Various programs available'],
      };
    }
    
    const courses: Record<string, string[]> = {};
    programEnrollment.forEach((program) => {
      const collegeName = program.label.replace(' & ', ' and ');
      courses[`College of ${collegeName}`] = [
        `Bachelor's in ${program.label}`,
        `${program.label} (General)`,
        `${program.label} (Honors)`,
        `${program.label} (Extended)`,
      ];
    });
    
    return courses;
  };

  // University Courses Data Mapping
  const universityCoursesData: Record<string, Record<string, string[]>> = {};

  // KNUST Courses Data by College
  const knustCourses: Record<string, string[]> = {
    'College of Humanities and Social Sciences': [
      'Economics',
      'Sociology',
      'English',
      'History',
      'Linguistics',
      'BA Political Studies',
      'Culture and Tourism',
      'BA Communication Studies',
      'Akan Language and Culture',
      'Geography and Rural Development',
      'French and Francophone',
      'Religious Studies',
      'BA Economics (Parallel)',
      'BA Geography and Rural Development (Parallel)',
      'BA Sociology (Parallel)',
      'BA Social Work (Parallel)',
      'BA History (Parallel)',
      'BA Political Studies (Parallel)',
      'BA French (Parallel)',
      'BA Culture and Tourism (Parallel)',
      'BA English (Parallel)',
      'BA Religious Studies (Parallel)',
      'BSc Business Administration',
      'BSc Business Administration (Parallel)',
      'LLB (4 years for WASSCE/SSSCE/GBCE and Equivalent Holders)',
      'LLB Part-Time (4 years for Degree Holders only)',
      'BA Akan',
    ],
    'School of Business': [
      'Business Administration (Accounting/Banking and Finance)',
      'Business Administration (Marketing/International)',
      'Business Administration (Hospitality and Tourism Management)',
      'Business Administration (Logistic and Supply Chain)',
    ],
    'Faculty of Art': [
      'Fashion Design',
      'Publishing Studies',
      'Painting & Sculpture',
      'Communication Design (Graphic Design)',
      'Ceramic Design and Technology',
      'Textile Design and Technology',
      'Integrated Rural Art and Industry',
      'Metalsmithing and Jewelry Technology',
    ],
    'College of Art and Built Environment': [
      'Architecture',
      'Real Estate',
      'Land Economy',
      'Development Planning',
      'Quantity Surveying and Construction Economics (Building Technology)',
      'Construction Technology and Management (Building Technology)',
      'Human Settlement Planning',
      'BFA Painting and Sculpture',
      'BA Communication Design (Graphic Design)',
      'BA Industrial Art (Ceramics, Metal Work, Textiles, and Fashion Design)',
      'BA Integrated Rural Art and Industry',
      'BA Publishing Studies (Book Industry)',
      'BA Integrated Rural Art and Industry (Parallel)',
      'BA Publishing Studies (Parallel)',
      'BA Communication Design (Parallel)',
      'BFA Painting and Sculpture (Parallel)',
    ],
    'College of Science': [
      'BSc Biochemistry',
      'BSc Chemistry',
      'BSc Mathematics',
      'BSc Statistics',
      'BSc Physics',
      'BSc Actuarial Science',
      'BSc Environmental Science',
      'BSc Biological Science',
      'BSc Food and Technology',
      'BSc Computer Science (Parallel)',
      'BSc Meteorology and Climate Science',
      'Doctor of Optometry (OD), Six (6) years',
    ],
    'College of Health Sciences': [
      'BSc Nursing',
      'BSc Midwifery',
      'BSc Herbal Medicine',
      'BSc Midwifery (Sandwich Programmes)',
      'BSc Emergency Nursing (Fee-Paying only)',
      'BSc Medical Laboratory Technology',
      'Pharm D (Doctor of Pharmacy) Six (6) Years',
      'BSc Human Biology (Medicine): to be followed by 3-year Clinical Programme leading to MB ChB Degree',
      'BSc Disability & Rehabilitation Studies (opened to Candidates with General Science, General Arts, Business, Visual Arts and Vocational/ Home Economics background)',
      'DVM (Doctor of Veterinary Medicine) 6 years',
      'BSc Dental Surgery (three year of BSc Human Biology to be followed by a year Clinical study leading to the award of BDS Degree) (fee paying only)',
    ],
    'College of Agriculture and Natural Resources': [
      'Agribusiness Management',
      'Forest Resources Technology',
      'Aquaculture & Water Resources Management',
      'Natural Resources Management',
      'Post Harvest Technology',
      'BSc Dairy and Meat Science',
      'BSc Landscape Design and Management',
      'BSc Agricultural Biotechnology',
      'BSc Agriculture',
    ],
    'College of Engineering': [
      'Civil Engineering',
      'Materials Engineering',
      'Computer Engineering',
      'Electrical & Electronic Engineering',
      'Mechanical Engineering',
      'Geomatic Engineering (Geodetic Engineering)',
      'Aerospace Engineering',
      'Petroleum Engineering',
      'Telecommunication Engineering',
      'Geological Engineering',
      'Biomedical Engineering',
      'Petrochemical Engineering',
      'Metallurgical Engineering',
      'BSc Chemical Engineering',
    ],
    'Distance Education/Learning Undergraduate Programmes': [
      'BA Sociology',
      'BSc Information Technology',
      'BSc Statistics',
      'BSc Agriculture',
      'BSc Actuarial Science',
      'BSc Computer Science',
      'BSc Quantity Surveying and Construction Economics',
      'Construction Technology Management',
      'Information Technology',
      'BA Social Work',
      'BSc Construction Technology Management',
      'BSc Business Administration (7 Options available)',
      'Diploma in Architectural Technology',
      'Diploma in Business Administration',
      'Diploma in Information Technology',
      'Diploma in Horticulture',
      'Diploma in Mechanical Engineering',
      'Diploma in Computer Network Engineering',
      'Diploma in Disability and Rehabilitation',
    ],
  };

  // KNUST Masters/Postgraduate Courses Data by College and Department
  const knustMastersCourses: Record<string, Record<string, string[]>> = {
    'College of Agriculture and Natural Resources': {
      'Department of Animal Science': [
        'Master of Philosophy (Animal Breeding and Genetics)',
        'Master of Philosophy (Reproductive Physiology)',
        'Master of Philosophy (Animal Nutrition)',
        'Master of Philosophy (Meat Science)',
      ],
      'Department of Crop and Soil Sciences': [
        'Master of Philosophy (Agronomy)',
        'Master of Philosophy (Agronomy [Crop Physiology])',
        'Master of Philosophy (Crop Protection [Entomology])',
        'Master of Philosophy (Crop Protection [Nematology])',
        'Master of Philosophy (Crop Protection [Plant Pathology])',
        'Master of Philosophy (Crop Protection [Plant Virology])',
        'Master of Philosophy (Plant Breeding)',
        'Master of Philosophy (Soil Science)',
      ],
      'Department of Horticulture': [
        'Master of Philosophy (Postharvest Technology)',
        'Master of Philosophy (Seed Science and Technology)',
        'Master of Philosophy (Fruit Crops Production)',
        'Master of Philosophy (Landscape Studies)',
        'Master of Philosophy (Vegetable Crops Production)',
        'Master of Philosophy (Floriculture)',
      ],
      'Department of Agricultural Economics, Agribusiness and Extension': [
        'Master of Philosophy (Agribusiness Management)',
        'Master of Philosophy (Agricultural Economics)',
        'Master of Philosophy (Agricultural Extension and Development Communication)',
        'Master of Philosophy (Sustainable and Integrated Rural Development in Africa)',
        'Master of Science (Agribusiness Management)',
        'Master of Science (Agricultural Extension and Development Communication)',
      ],
      'Department of Wildlife and Range Management': [
        'Master of Philosophy (Wildlife and Range Management)',
        'Master of Science (Geo-Information Science for Natural Resources Management)',
      ],
      'Department of Silviculture and Forest Management': [
        'Master of Philosophy (Natural Resources and Environmental Governance)',
        'Master of Philosophy (Silviculture and Forest Management)',
      ],
      'Department of Agroforestry': [
        'Master of Philosophy (Agroforestry)',
      ],
      'Department of Wood Science and Technology Management': [
        'Master of Science (Packaging Technology and Management)',
        'Master of Philosophy (Wood Science and Technology)',
      ],
      'Department of Fisheries and Watershed Management': [
        'Master of Philosophy (Aquaculture and Environment)',
        'Master of Philosophy (Fisheries Management)',
        'Master of Philosophy (Watershed Management)',
      ],
    },
    'College of Humanities and Social Sciences': {
      'Faculty of Law': [
        'Master of Laws (LLM)',
      ],
      'Department of Economics': [
        'Master of Science (Economics)',
        'Master of Philosophy (Economics)',
      ],
      'Department of Modern Languages': [
        'Master of Philosophy (French)',
      ],
      'Department of English': [
        'Master of Philosophy in (English)',
      ],
      'Department of Geography and Rural Development': [
        'Master of Science (Geography and Sustainable Development)',
        'Master of Philosophy (Geography and Rural Development)',
      ],
      'Department of Religious Studies': [
        'Master of Art (Religious Studies)',
        'Master of Philosophy (Religious Studies)',
      ],
      'Department of Sociology and Social Work': [
        'Master of Art (Sociology)',
        'Master of Philosophy (Sociology)',
      ],
      'Department of History and Political Studies': [
        'Master of Art (Asante History)',
        'Master of Public Administration',
        'Master of Art (Chieftaincy and Traditional Leadership Studies)',
        'Master of Philosophy (Chieftaincy and Traditional Leadership Studies)',
        'Master of Philosophy in (Historical Studies)',
        'Master of Philosophy in (Political Science)',
      ],
    },
    'School of Business': {
      'KNUST School of Business (KSB)': [
        'Master of Business Administration (Accounting)',
        'Master of Business Administration (Finance)',
        'Master of Business Administration (Marketing)',
        'Master of Business Administration (Strategic Management and Consulting)',
        'Master of Business Administration (Human Resource Management)',
        'Master of Business Administration (Logistics and Supply Chain Management)',
        'Master of Business Administration (Management and Organizational Development)',
        'Master of Science (Marketing)',
        'Master of Science (Logistics and Supply Chain Management)',
        'Master of Science (Management and Human Resource Strategy)',
        'Master of Science (Accounting and Finance)',
        'Master of Science (Finance)',
        'Master of Science (Procurement and Supply Chain Management)',
        'Master of Science (Corporate Governance and Strategic Leadership)',
        'Master of Science (Air Transportation and Aviation Management)',
        'Master of Science (Business and Data Analytics)',
        'Master of Philosophy (Business and Management [Accounting])',
        'Master of Philosophy (Business and Management [Finance])',
        'Master of Philosophy (Business and Management [Marketing])',
        'Master of Philosophy (Business and Management [Strategic Management and Consulting])',
        'Master of Philosophy (Business and Management [Human Resource Management])',
        'Master of Philosophy (Business and Management [Logistics and Supply Chain Management])',
        'Master of Philosophy (Business and Management [Management and Organizational Development])',
        'Master of Philosophy (Logistics and Supply Chain Management)',
        'Master of Philosophy (Procurement and Supply Chain Management)',
        'Master of Philosophy (Management and Human Resource Management (Top-Up))',
      ],
    },
    'College of Art and Built Environment': {
      'Department of Architecture': [
        'Master of Philosophy (Architectural Studies)',
        'Master of Science (Architecture (Top-Up))',
        'Master of Architecture',
      ],
      'Department of Construction Technology and Management': [
        'Master of Science (Construction Management)',
        'Master of Science (Procurement Management)',
        'Master of Science (Project Management)',
        'Master of Philosophy (Construction Management)',
        'Master of Philosophy (Procurement Management)',
        'Master of Philosophy (Project Management)',
      ],
      'Department of Planning': [
        'Master of Science (Development Planning and Management)',
        'Master of Science (Development Policy and Planning)',
        'Master of Science (Transportation Planning)',
        'Master of Science (Development Studies)',
        'Master of Science (Planning)',
        'Master of Philosophy (Development Planning and Management)',
        'Master of Philosophy (Development Policy and Planning)',
        'Master of Philosophy (Development Studies)',
        'Master of Philosophy (Planning)',
        'Master of Philosophy (Urban Management Studies)',
      ],
      'Department of Land Economy': [
        'Master of Science (Land Governance and Policy)',
        'Master of Science (Facilities Management)',
      ],
      'Department of Educational Innovations in Science and Technology': [
        'Master of Philosophy Art Education',
        'MA African Art and Culture',
        'Master of Philosophy African Art and Culture',
      ],
      'Department of Teacher Education': [
        'Master of Philosophy (Educational Planning and Administration)',
        'Master of Philosophy (Language Education)',
        'Master of Philosophy (Science Education)',
        'Master of Philosophy (Mathematics Education)',
        'Master of Philosophy (ICT Education)',
        'Master of Education (Educational Planning and Administration) – Sandwich',
        'Master of Education (Language Education) – Sandwich',
        'Master of Education (Science Education) – Sandwich',
        'Master of Education (Mathematics Education) – Sandwich',
        'Master of Education (ICT Education) – Sandwich',
      ],
      'Department of Painting and Sculpture': [
        'Master of Fine Art (Painting)',
        'Master of Fine Art (Sculpture)',
        'Master of Fine Art (Painting and Sculpture)',
      ],
      'Department of Industrial Art': [
        'Master of Fine Art (Ceramics)',
        'Master of Fine Art (Jewellery and Metalsmithing)',
        'Master of Fine Art (Textiles Design)',
        'Master of Philosophy (Integrated Art)',
        'Master of Philosophy (Fashion Design Technology)',
        'Master of Philosophy (Textile Design Technology)',
      ],
      'Department of Communication Design': [
        'Master of Communication Design',
        'Master of Philosophy (Communication Design)',
      ],
    },
    'College of Health Sciences': {
      'Department of Pharmaceutics': [
        'Master of Science (Pharmaceutical Technology)',
        'Master of Philosophy (Pharmaceutics)',
        'Master of Philosophy (Pharmaceutical Microbiology)',
      ],
      'Department of Pharmacognosy': [
        'Master of Philosophy (Pharmacognosy)',
      ],
      'Department of Pharmaceutical Chemistry': [
        'Master of Philosophy (Pharmaceutical Chemistry)',
      ],
      'Department of Pharmacy Practice': [
        'Master of Science (Clinical Pharmacy)',
        'Master of Philosophy (Clinical Pharmacy)',
      ],
      'Department of Pharmacology': [
        'Master of Philosophy (Pharmacology)',
        'Master of Philosophy (Clinical Pharmacology)',
      ],
      'Department of Nursing': [
        'Master of Science (Clinical Nursing)',
        'Master of Philosophy (Nursing)',
      ],
      'Department of Medical Diagnostics': [
        'Master of Philosophy (Haematology)',
      ],
      'Department of Molecular Medicine': [
        'Master of Philosophy (Chemical Pathology)',
        'Master of Philosophy (Molecular Medicine)',
        'Master of Philosophy (Immunology)',
      ],
      'Department of Clinical Microbiology': [
        'Master of Philosophy (Clinical Microbiology)',
      ],
      'Department of Anatomy': [
        'Master of Philosophy (Human Anatomy and Cell Biology)',
        'Master of Philosophy (Human Anatomy and Forensic Science)',
        'Master of Philosophy (Human Anatomy and Cell Biology [Morphological Diagnostics])',
        'Master of Philosophy (Mortuary Science and Management)',
      ],
      'Department of Physiology': [
        'Master of Philosophy (Physiology)',
      ],
      'School of Public Health': [
        'Master of Science (Health Education and Promotion)',
        'Master of Science (Population and Reproductive Health)',
        'Master of Science (Occupational and Environmental Health & Safety)',
        'Master of Science (Health Services Planning and Management)',
        'Master of Public Health (Health Education and Promotion)',
        'Master of Public Health (Population and Reproductive Health)',
        'Master of Public Health (Occupational and Environmental Health & Safety)',
        'Master of Public Health Health Services Planning and Management)',
        'Master of Philosophy (Disability, Rehabilitation and Development)',
        'Master of Philosophy (Health Systems Research and Management)',
        'Master of Philosophy (Field Epidemiology and Biostatistics)',
      ],
    },
    'College of Science': {
      'Department of Biochemistry and Biotechnology': [
        'Master of Science (Biotechnology)',
        'Master of Science (Biodata Analytics and Computational Genomics)',
        'Master of Philosophy (Biodata Analytics and Computational Genomics)',
        'Master of Philosophy (Human Nutrition and Dietetics)',
        'Master of Philosophy (Biochemistry)',
        'Master of Philosophy (Biotechnology)',
      ],
      'Department of Theoretical and Applied Biology': [
        'Master of Philosophy (Environmental Science)',
        'Master of Philosophy (Parasitology)',
        'Master of Philosophy (Ecology)',
        'Master of Philosophy (Entomology)',
        'Master of Philosophy (Animal and Plant Physiology)',
        'Master of Philosophy (Microbiology)',
        'Master of Philosophy (Plant Pathology)',
        'Master of Philosophy (Reproductive Biology)',
        'Master of Philosophy (Animal and Plant Systematics)',
        'Master of Philosophy (Molecular Biology)',
        'Master of Philosophy (Fish and Fisheries Science)',
      ],
      'Department of Food Science and Technology': [
        'Master of Science (Food Science and Technology)',
        'Master of Philosophy (Food Science and Technology)',
      ],
      'Department of Chemistry': [
        'Master of Philosophy Chemistry',
        'Master of Philosophy Organic and Natural Products',
        'Master of Philosophy Analytical Chemistry',
        'Master of Philosophy Environmental Chemistry',
        'Master of Philosophy Physical Chemistry',
        'Master of Philosophy Inorganic Chemistry',
        'Master of Philosophy Polymer Science and Technology',
      ],
      'Department of Physics': [
        'Master of Philosophy Geophysics',
        'Master of Philosophy/Doctor of Philosophy Materials Science',
        'Master of Philosophy/Doctor of Philosophy in Solid State Physics',
        'Master of Philosophy/Doctor of Philosophy Meteorology and Climate Science',
        'Master of Philosophy/Doctor of Philosophy Environmental Physics',
        'Master of Philosophy Nano Science and Technology',
        'Master of Science Petroleum Geophysics',
      ],
      'Department of Mathematics': [
        'Master of Philosophy Pure Mathematics',
        'Master of Philosophy Applied Mathematics',
      ],
      'Department of Statistics and Actuarial Science': [
        'Master of Philosophy Mathematical Statistics',
        'Master of Philosophy Actuarial Science',
      ],
      'Department of Computer Science': [
        'Master of Science Cyber-Security and Digital Forensics',
        'Master of Philosophy Cyber-Security and Digital Forensics',
        'Master of Science Computer Science',
        'Master of Philosophy Computer Science',
        'Master of Science Information Technology',
        'Master of Philosophy Information Technology',
      ],
      'Department of Optometry and Visual Science': [
        'Master of Philosophy Vision Science',
      ],
    },
    'College of Engineering': {
      'Department of Civil Engineering': [
        'Master of Science Geotechnical Engineering',
        'Master of Philosophy Geotechnical Engineering',
        'Master of Science Road and Transportation Engineering',
        'Master of Philosophy Road and Transportation Engineering',
        'Master of Science Water Resources Engineering and Management',
        'Master of Philosophy Water Resources Engineering and Management',
        'Master of Science Water Supply and Environmental Sanitation',
        'Master of Philosophy Water Supply and Environmental Sanitation',
        'Master of Science Structural Engineering',
        'Master of Philosophy Structural Engineering',
      ],
      'Department of Geomatic Engineering': [
        'Master of Science/Master of Philosophy Geomatic Engineering',
        'Master of Philosophy Geographic Information System (GIS)',
      ],
      'Department of Electrical/Electronic Engineering': [
        'Master of Philosophy Telecommunications Engineering',
        'Master of Philosophy Power Systems Engineering',
      ],
      'Department of Computer Engineering': [
        'Master of Philosophy Computer Engineering',
      ],
      'Department of Chemical Engineering': [
        'Master of Philosophy Chemical Engineering',
      ],
      'Department of Materials Engineering': [
        'Master of Philosophy Environmental Resources Management',
        'Master of Science Materials Engineering',
        'Master of Philosophy Materials Engineering',
      ],
      'Department of Agricultural and Biosystems Engineering': [
        'Master of Science Agricultural Machinery Engineering',
        'Master of Science Agro-Environmental Engineering',
        'Master of Science Bioengineering',
        'Master of Science Food and Post-Harvest Engineering',
        'Master of Science Soil and Water Engineering',
        'Master of Philosophy Agricultural Machinery Engineering',
        'Master of Philosophy Agro-Environmental Engineering',
        'Master of Philosophy Bioengineering',
        'Master of Philosophy Food and Post-Harvest Engineering',
        'Master of Philosophy Soil and Water Engineering',
        'Master of Philosophy Intellectual Property (MIP)',
      ],
      'Department of Mechanical Engineering': [
        'Master of Science Mechanical Engineering',
        'Master of Philosophy Mechanical Engineering',
        'Master of Science Renewable Energy Technologies',
      ],
      'Department of Geological Engineering': [
        'Master of Science Geophysical Engineering',
        'Master of Philosophy Geological Engineering',
      ],
    },
  };

  // Store KNUST courses in the mapping
  universityCoursesData['Kwame Nkrumah University of Science and Technology'] = knustCourses;

  // University Masters Courses Data Mapping
  const universityMastersCoursesData: Record<string, Record<string, Record<string, string[]>>> = {};
  universityMastersCoursesData['Kwame Nkrumah University of Science and Technology'] = knustMastersCourses;

  // Helper function to get courses for a university
  const getUniversityCourses = (universityName: string, university: UniversityData): Record<string, string[]> => {
    // If we have specific data for this university, use it
    if (universityCoursesData[universityName]) {
      return universityCoursesData[universityName];
    }
    // Otherwise, generate from program enrollment
    return generateCoursesFromPrograms(university.programEnrollment);
  };

  // Helper function to get masters courses for a university
  const getUniversityMastersCourses = (universityName: string): Record<string, Record<string, string[]>> | null => {
    return universityMastersCoursesData[universityName] || null;
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

  // University data is now fetched from Supabase

  // Reset selected college and degree level when university changes
  useEffect(() => {
    setSelectedCollege('');
    setDegreeLevel('');
  }, [id]);

  // Reset degree level when college changes
  useEffect(() => {
    setDegreeLevel('');
  }, [selectedCollege]);

  // Memoize other universities list
  const otherUniversities = useMemo(() => {
    return allUniversities
      .filter(u => u.id !== university?.id)
      .slice(0, 5);
  }, [allUniversities, university?.id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading university details...</div>
    );
  }

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
      min-height: calc(100vh - 80px);
    }

    .university-view-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
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

    .university-view-description-text p {
      margin: 0 0 1rem 0;
    }

    .university-view-description-text p:last-child {
      margin-bottom: 0;
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

    .university-view-campus-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .university-view-campus-title {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .university-view-campus-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .university-view-campus-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
      font-weight: 400;
    }

    .university-view-campus-item[data-main="true"] {
      background: #eff6ff;
      border: 2px solid #2563eb;
      font-weight: 600;
    }

    .university-view-campus-icon {
      color: #6b7280;
      flex-shrink: 0;
    }

    .university-view-campus-item[data-main="true"] .university-view-campus-icon {
      color: #2563eb;
    }

    .university-view-campus-name {
      flex: 1;
    }

    .university-view-campus-badge {
      font-size: 0.75rem;
      color: #2563eb;
      background: #dbeafe;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-weight: 600;
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
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    @media (max-width: 767px) {
      .courses-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .university-view-content-wrapper {
        padding-top: 60px;
      }

      .university-view-main-content {
        padding: 1rem;
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

      .university-view-campus-section {
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

      .university-view-campus-section {
        padding: clamp(0.875rem, 3vw, 1rem);
        border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      }

      .university-view-campus-grid {
        gap: 0.5rem;
      }

      .university-view-campus-item {
        padding: 0.625rem 0.875rem;
        font-size: 0.8125rem;
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

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .university-view-content-wrapper {
        padding-top: 70px;
      }

      .university-view-main-content {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .university-view-content-wrapper {
        padding-top: 120px;
      }

      .university-view-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .university-view-content-wrapper {
        padding-top: 120px;
      }

      .university-view-main-content {
        max-width: 1600px;
        padding: 2rem clamp(2rem, 5vw, 4rem);
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
                    {university.contact?.facebook && (
                      <a href={university.contact.facebook} target="_blank" rel="noopener noreferrer" className="university-view-social-icon" aria-label="Facebook">
                        <Facebook size={18} />
                      </a>
                    )}
                    {university.contact?.twitter && (
                      <a href={university.contact.twitter} target="_blank" rel="noopener noreferrer" className="university-view-social-icon" aria-label="Twitter">
                        <Twitter size={18} />
                      </a>
                    )}
                    {university.contact?.linkedin && (
                      <a href={university.contact.linkedin} target="_blank" rel="noopener noreferrer" className="university-view-social-icon" aria-label="LinkedIn">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {university.contact?.youtube && (
                      <a href={university.contact.youtube} target="_blank" rel="noopener noreferrer" className="university-view-social-icon" aria-label="YouTube">
                        <Youtube size={18} />
                      </a>
                    )}
                    {university.contact?.instagram && (
                      <a href={university.contact.instagram} target="_blank" rel="noopener noreferrer" className="university-view-social-icon" aria-label="Instagram">
                        <Instagram size={18} />
                      </a>
                    )}
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
                    {university.acceptanceRate && (
                      <tr>
                        <td>ACCEPTANCE RATE*</td>
                        <td>{formatPercentage(university.acceptanceRate)}</td>
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
              <div className="university-view-description-text">
                {university.description.split('\n').filter(line => line.trim()).map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1rem' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
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

          {/* Campus Locations Section */}
          {university.campus && university.campus.length > 0 && (
            <div className="university-view-campus-section">
              <h2 className="university-view-campus-title">CAMPUS LOCATIONS</h2>
              <div className="university-view-campus-grid">
                {university.campus.map((campus, index) => (
                  <div 
                    key={index} 
                    className="university-view-campus-item"
                    data-main={university.mainCampus === campus}
                  >
                    <MapPin size={18} className="university-view-campus-icon" />
                    <span className="university-view-campus-name">{campus}</span>
                    {university.mainCampus === campus && (
                      <span className="university-view-campus-badge">Main Campus</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              <button
                className={`university-view-tab ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                Courses Offered
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
                        <div className="university-view-stat-value">{formatPercentage(university.academics.graduationRate)}</div>
                      </div>
                    )}
                    {university.academics.retentionRate && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">RETENTION RATE</div>
                        <div className="university-view-stat-value">{formatPercentage(university.academics.retentionRate)}</div>
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
                    {university.financialAid.aidPercentage && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">FINANCIAL AID PERCENTAGE</div>
                        <div className="university-view-stat-value">{formatPercentage(university.financialAid.aidPercentage)}</div>
                        <div className="university-view-stat-bar">
                          <div
                            className="university-view-stat-bar-fill"
                            style={{ width: `${getPercentageNumber(university.financialAid.aidPercentage)}%` }}
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
                        <div className="university-view-stat-value">{formatPercentage(university.admissions.acceptanceRate)}</div>
                        <div className="university-view-stat-bar">
                          <div
                            className="university-view-stat-bar-fill"
                            style={{ width: `${getPercentageNumber(university.admissions.acceptanceRate)}%` }}
                          />
                          <div
                            className="university-view-stat-bar-fill light"
                            style={{ width: `${100 - getPercentageNumber(university.admissions.acceptanceRate)}%`, position: 'absolute', right: 0 }}
                          />
                        </div>
                      </div>
                    )}
                    {university.admissions.yieldRate && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">ADMISSIONS YIELD</div>
                        <div className="university-view-stat-value">{formatPercentage(university.admissions.yieldRate)}</div>
                        <div className="university-view-stat-bar">
                          <div
                            className="university-view-stat-bar-fill"
                            style={{ width: `${getPercentageNumber(university.admissions.yieldRate)}%` }}
                          />
                          <div
                            className="university-view-stat-bar-fill light"
                            style={{ width: `${100 - getPercentageNumber(university.admissions.yieldRate)}%`, position: 'absolute', right: 0 }}
                          />
                        </div>
                      </div>
                    )}
                    {university.admissions.wassceScoreRange && (
                      <div className="university-view-stat-item">
                        <div className="university-view-stat-label">WASSCE SCORE RANGE</div>
                        <div className="university-view-stat-value">{university.admissions.wassceScoreRange}</div>
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

                {activeTab === 'courses' && (
                  <motion.div
                    key="courses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(() => {
                      const universityCourses = getUniversityCourses(university.name, university);
                      const universityMasters = getUniversityMastersCourses(university.name);
                      const allColleges = Array.from(new Set([
                        ...Object.keys(universityCourses),
                        ...(universityMasters ? Object.keys(universityMasters) : [])
                      ]));

                      return (
                        <>
                          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '250px' }}>
                              <label
                                htmlFor="college-select"
                                style={{
                                  display: 'block',
                                  marginBottom: '0.75rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  color: 'hsl(220 30% 15%)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                Select College/Faculty
                              </label>
                              <select
                                id="college-select"
                                value={selectedCollege}
                                onChange={(e) => setSelectedCollege(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.875rem 1.25rem',
                                  paddingRight: '2.5rem',
                                  border: '1.5px solid hsl(40 20% 88%)',
                                  borderRadius: '0.75rem',
                                  fontSize: '1rem',
                                  color: 'hsl(220 30% 15%)',
                                  background: 'white',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 0.75rem center',
                                }}
                              >
                                <option value="">-- Select a College/Faculty --</option>
                                {allColleges.map((college) => (
                                  <option key={college} value={college}>
                                    {college}
                                  </option>
                                ))}
                              </select>
                            </div>

                          <div style={{ flex: '1', minWidth: '250px' }}>
                            <label
                              htmlFor="degree-level-select"
                              style={{
                                display: 'block',
                                marginBottom: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'hsl(220 30% 15%)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              Select Degree Level
                            </label>
                            <select
                              id="degree-level-select"
                              value={degreeLevel}
                              onChange={(e) => setDegreeLevel(e.target.value as 'undergraduate' | 'postgraduate' | '')}
                              disabled={!selectedCollege}
                              style={{
                                width: '100%',
                                padding: '0.875rem 1.25rem',
                                paddingRight: '2.5rem',
                                border: '1.5px solid hsl(40 20% 88%)',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                color: selectedCollege ? 'hsl(220 30% 15%)' : 'hsl(220 20% 60%)',
                                background: selectedCollege ? 'white' : 'hsl(40 20% 96%)',
                                cursor: selectedCollege ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease',
                                fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                              }}
                            >
                              <option value="">-- Select Degree Level --</option>
                              <option value="undergraduate">Undergraduate</option>
                              {universityMasters && <option value="postgraduate">Postgraduate/Masters</option>}
                            </select>
                          </div>
                        </div>

                        {selectedCollege && (
                          <>

                            {degreeLevel === 'undergraduate' && universityCourses[selectedCollege] && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div
                                  style={{
                                    marginBottom: '1.5rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '2px solid hsl(40 20% 88%)',
                                  }}
                                >
                                  <h3
                                    style={{
                                      fontSize: '1.25rem',
                                      fontWeight: 700,
                                      color: 'hsl(220 30% 15%)',
                                      margin: 0,
                                      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                    }}
                                  >
                                    {selectedCollege} - Undergraduate Programs
                                  </h3>
                                  <p
                                    style={{
                                      fontSize: '0.875rem',
                                      color: 'hsl(220 20% 40%)',
                                      margin: '0.5rem 0 0 0',
                                      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                    }}
                                  >
                                    {universityCourses[selectedCollege].length} {universityCourses[selectedCollege].length === 1 ? 'Course' : 'Courses'} Available
                                  </p>
                                </div>
                                <div
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '1rem',
                                  }}
                                  className="courses-grid"
                                >
                                  {universityCourses[selectedCollege].map((course, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.2, delay: index * 0.02 }}
                                      style={{
                                        padding: '1.25rem',
                                        background: 'white',
                                        borderRadius: '0.75rem',
                                        border: '1px solid hsl(40 20% 88%)',
                                        transition: 'all 0.2s ease',
                                        cursor: 'default',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'hsl(220 20% 40%)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'flex-start',
                                          gap: '0.75rem',
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'hsl(220 20% 40%)',
                                            marginTop: '0.5rem',
                                            flexShrink: 0,
                                          }}
                                        />
                                        <div
                                          style={{
                                            flex: 1,
                                            fontSize: '0.95rem',
                                            lineHeight: '1.6',
                                            color: 'hsl(220 30% 15%)',
                                            fontWeight: 500,
                                            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                          }}
                                        >
                                          {course}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {degreeLevel === 'postgraduate' && universityMasters && universityMasters[selectedCollege] && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div
                                  style={{
                                    marginBottom: '1.5rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '2px solid hsl(40 20% 88%)',
                                  }}
                                >
                                  <h3
                                    style={{
                                      fontSize: '1.25rem',
                                      fontWeight: 700,
                                      color: 'hsl(220 30% 15%)',
                                      margin: 0,
                                      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                    }}
                                  >
                                    {selectedCollege} - Postgraduate/Masters Programs
                                  </h3>
                                  <p
                                    style={{
                                      fontSize: '0.875rem',
                                      color: 'hsl(220 20% 40%)',
                                      margin: '0.5rem 0 0 0',
                                      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                    }}
                                  >
                                    {Object.values(universityMasters[selectedCollege]).reduce((sum, dept) => sum + dept.length, 0)} Courses across {Object.keys(universityMasters[selectedCollege]).length} Departments
                                  </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                  {Object.entries(universityMasters[selectedCollege]).map(([department, courses]) => (
                                    <motion.div
                                      key={department}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <h4
                                        style={{
                                          fontSize: '1.1rem',
                                          fontWeight: 600,
                                          color: 'hsl(220 30% 15%)',
                                          margin: '0 0 1rem 0',
                                          paddingBottom: '0.75rem',
                                          borderBottom: '1px solid hsl(40 20% 88%)',
                                          fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                        }}
                                      >
                                        {department}
                                      </h4>
                                      <div
                                        style={{
                                          display: 'grid',
                                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                          gap: '1rem',
                                        }}
                                        className="courses-grid"
                                      >
                                        {courses.map((course, index) => (
                                          <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2, delay: index * 0.02 }}
                                            style={{
                                              padding: '1.25rem',
                                              background: 'white',
                                              borderRadius: '0.75rem',
                                              border: '1px solid hsl(40 20% 88%)',
                                              transition: 'all 0.2s ease',
                                              cursor: 'default',
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.borderColor = 'hsl(220 20% 40%)';
                                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                                              e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                                              e.currentTarget.style.boxShadow = 'none';
                                              e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '0.75rem',
                                              }}
                                            >
                                              <div
                                                style={{
                                                  width: '6px',
                                                  height: '6px',
                                                  borderRadius: '50%',
                                                  background: '#3b82f6',
                                                  marginTop: '0.5rem',
                                                  flexShrink: 0,
                                                }}
                                              />
                                              <div
                                                style={{
                                                  flex: 1,
                                                  fontSize: '0.95rem',
                                                  lineHeight: '1.6',
                                                  color: 'hsl(220 30% 15%)',
                                                  fontWeight: 500,
                                                  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                                }}
                                              >
                                                {course}
                                              </div>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {selectedCollege && !degreeLevel && (
                              <div
                                style={{
                                  textAlign: 'center',
                                  padding: '3rem 2rem',
                                  color: 'hsl(220 20% 40%)',
                                  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                }}
                              >
                                <p style={{ fontSize: '1rem', margin: 0 }}>
                                  Select a degree level above to view available courses
                                </p>
                              </div>
                            )}

                            {selectedCollege && degreeLevel === 'undergraduate' && !universityCourses[selectedCollege] && (
                              <div
                                style={{
                                  textAlign: 'center',
                                  padding: '3rem 2rem',
                                  color: 'hsl(220 20% 40%)',
                                  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                }}
                              >
                                <p style={{ fontSize: '1rem', margin: 0 }}>
                                  No undergraduate courses available for {selectedCollege}
                                </p>
                              </div>
                            )}

                            {selectedCollege && degreeLevel === 'postgraduate' && (!universityMasters || !universityMasters[selectedCollege]) && (
                              <div
                                style={{
                                  textAlign: 'center',
                                  padding: '3rem 2rem',
                                  color: 'hsl(220 20% 40%)',
                                  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                                }}
                              >
                                <p style={{ fontSize: '1rem', margin: 0 }}>
                                  No postgraduate/masters courses available for {selectedCollege}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {selectedCollege === '' && (
                          <div
                            style={{
                              textAlign: 'center',
                              padding: '3rem 2rem',
                              color: 'hsl(220 20% 40%)',
                              fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                            }}
                          >
                            <p style={{ fontSize: '1rem', margin: 0 }}>
                              Select a college from the dropdown above to view available courses
                            </p>
                          </div>
                        )}
                      </>
                      );
                    })()}
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
              {otherUniversities.map((otherUni) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UniversityView;


