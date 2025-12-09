import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeniorHighSchoolData {
  id: string;
  name: string;
  region: string;
  district: string;
  category: string;
  gender: string;
  programs: string;
  logo?: string;
  description: string;
  studentPopulation?: string;
  yearEstablished?: string;
  boardingStatus?: string;
  website?: string;
  photos?: string[];
  programsOffered?: { name: string; description: string }[];
  facilities?: string[];
  achievements?: string[];
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

const SeniorHighSchoolView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'facilities' | 'achievements'>('overview');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mock SHS data - replace with actual API data
  const seniorHighSchools: SeniorHighSchoolData[] = [
    {
      id: '1',
      name: 'Achimota School',
      region: 'Greater Accra',
      district: 'Accra Metropolitan',
      category: 'Category A',
      gender: 'Mixed',
      programs: 'General Arts, General Science, Business, Visual Arts',
      description: 'Achimota School is one of Ghana\'s premier senior high schools, established in 1927. It is a co-educational institution known for academic excellence and producing notable alumni. The school offers comprehensive programs in General Arts, General Science, Business, and Visual Arts. With a rich history spanning nearly a century, Achimota School has maintained its reputation as one of the top educational institutions in Ghana.',
      studentPopulation: '2,500+',
      yearEstablished: '1927',
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg',
      ],
      programsOffered: [
        { name: 'General Arts', description: 'Comprehensive arts program covering literature, history, geography, and social studies' },
        { name: 'General Science', description: 'Rigorous science program covering physics, chemistry, biology, and mathematics' },
        { name: 'Business', description: 'Business studies program covering accounting, economics, and business management' },
        { name: 'Visual Arts', description: 'Creative arts program covering drawing, painting, sculpture, and design' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel', 'Auditorium'],
      achievements: [
        'Consistently ranked among top 10 schools in WASSCE',
        'Multiple national debate championships',
        'Outstanding performance in sports competitions',
        'Alumni include former presidents and notable leaders',
      ],
      contact: {
        phone: '+233 302 500 000',
        email: 'info@achimota.edu.gh',
        address: 'Achimota, Accra, Ghana',
      },
    },
    {
      id: '2',
      name: 'Presbyterian Boys\' Secondary School (PRESEC)',
      region: 'Greater Accra',
      district: 'Legon',
      category: 'Category A',
      gender: 'Boys',
      programs: 'General Science, General Arts, Business',
      description: 'PRESEC Legon is a prestigious boys\' senior high school known for academic excellence and discipline. Established in 1938, the school has consistently ranked among the top schools in Ghana. It offers programs in General Science, General Arts, and Business. The school is renowned for its strong academic tradition and has produced many successful professionals.',
      studentPopulation: '2,200+',
      yearEstablished: '1938',
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Comprehensive science program with emphasis on mathematics and natural sciences' },
        { name: 'General Arts', description: 'Arts program covering literature, history, and social sciences' },
        { name: 'Business', description: 'Business studies program with focus on accounting and economics' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE examinations',
        'Multiple science and mathematics competition wins',
        'Strong performance in national sports',
      ],
      contact: {
        phone: '+233 302 500 100',
        email: 'info@preseclegon.edu.gh',
        address: 'Legon, Accra, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg',
      ],
      programsOffered: [
        { name: 'General Arts', description: 'Comprehensive arts program covering literature, history, and social sciences' },
        { name: 'General Science', description: 'Rigorous science program with emphasis on natural sciences' },
        { name: 'Business', description: 'Business studies program covering accounting and economics' },
        { name: 'Home Economics', description: 'Home economics program covering food and nutrition, clothing and textiles' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE examinations',
        'Multiple national competition wins',
        'Strong performance in sports and cultural activities',
      ],
      contact: {
        phone: '+233 332 123 456',
        email: 'info@wesleygirls.edu.gh',
        address: 'Cape Coast, Central Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Comprehensive science program with emphasis on mathematics and natural sciences' },
        { name: 'General Arts', description: 'Arts program covering literature, history, and social sciences' },
        { name: 'Business', description: 'Business studies program with focus on accounting and economics' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Ghana\'s oldest secondary school',
        'Consistently ranked among top schools',
        'Strong alumni network',
      ],
      contact: {
        phone: '+233 332 123 789',
        email: 'info@mfantsipim.edu.gh',
        address: 'Cape Coast, Central Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Comprehensive science program' },
        { name: 'General Arts', description: 'Arts program covering various disciplines' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Visual Arts', description: 'Creative arts program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE',
        'Strong sports program',
        'Active alumni association',
      ],
      contact: {
        phone: '+233 332 123 890',
        email: 'info@staugustines.edu.gh',
        address: 'Cape Coast, Central Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Arts', description: 'Comprehensive arts program' },
        { name: 'General Science', description: 'Rigorous science program' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Home Economics', description: 'Home economics program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE',
        'Multiple competition wins',
        'Strong character development program',
      ],
      contact: {
        phone: '+233 332 123 901',
        email: 'info@holychild.edu.gh',
        address: 'Cape Coast, Central Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Comprehensive science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE',
        'Strong discipline record',
        'Active sports program',
      ],
      contact: {
        phone: '+233 322 123 456',
        email: 'info@opokuware.edu.gh',
        address: 'Kumasi, Ashanti Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Technical', description: 'Technical program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Strong academic performance',
        'Diverse program offerings',
        'Active student body',
      ],
      contact: {
        phone: '+233 322 123 789',
        email: 'info@kumasiacademy.edu.gh',
        address: 'Kumasi, Ashanti Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Comprehensive science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE',
        'Strong academic tradition',
        'Active alumni network',
      ],
      contact: {
        phone: '+233 322 123 890',
        email: 'info@prempehcollege.edu.gh',
        address: 'Kumasi, Ashanti Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Comprehensive science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Visual Arts', description: 'Creative arts program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels', 'Chapel'],
      achievements: [
        'Top performer in WASSCE',
        'Strong leadership development',
        'Active sports program',
      ],
      contact: {
        phone: '+233 332 123 012',
        email: 'info@adisadel.edu.gh',
        address: 'Cape Coast, Central Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Arts', description: 'Arts program' },
        { name: 'General Science', description: 'Science program' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Home Economics', description: 'Home economics program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Top performer in WASSCE',
        'Strong character development',
        'Active cultural activities',
      ],
      contact: {
        phone: '+233 342 123 456',
        email: 'info@aburigirls.edu.gh',
        address: 'Aburi, Eastern Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Strong academic performance',
        'Active national service',
        'Diverse student body',
      ],
      contact: {
        phone: '+233 332 123 345',
        email: 'info@ghananationalcollege.edu.gh',
        address: 'Cape Coast, Central Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Quality education',
        'Strong discipline',
        'Active community involvement',
      ],
      contact: {
        phone: '+233 342 123 789',
        email: 'info@stpeters.edu.gh',
        address: 'Nkawkaw, Eastern Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Technical', description: 'Technical program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Leading school in Northern Region',
        'Diverse program offerings',
        'Strong community support',
      ],
      contact: {
        phone: '+233 372 123 456',
        email: 'info@tamaleshs.edu.gh',
        address: 'Tamale, Northern Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
        { name: 'Technical', description: 'Technical program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Workshop', 'Sports Complex', 'Dining Hall'],
      achievements: [
        'Strong technical program',
        'Diverse offerings',
        'Community engagement',
      ],
      contact: {
        phone: '+233 362 123 456',
        email: 'info@ketashts.edu.gh',
        address: 'Keta, Volta Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Leading school in Bono Region',
        'Strong academic performance',
        'Active student body',
      ],
      contact: {
        phone: '+233 352 123 456',
        email: 'info@sunyanishs.edu.gh',
        address: 'Sunyani, Bono Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Serving Upper East Region',
        'Quality education',
        'Community support',
      ],
      contact: {
        phone: '+233 382 123 456',
        email: 'info@bolgatangashs.edu.gh',
        address: 'Bolgatanga, Upper East Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Serving Upper West Region',
        'Quality education',
        'Community engagement',
      ],
      contact: {
        phone: '+233 392 123 456',
        email: 'info@washs.edu.gh',
        address: 'Wa, Upper West Region, Ghana',
      },
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
      boardingStatus: 'Boarding',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Leading school in Western Region',
        'Strong academic performance',
        'Active sports program',
      ],
      contact: {
        phone: '+233 312 123 456',
        email: 'info@sekondicollege.edu.gh',
        address: 'Sekondi, Western Region, Ghana',
      },
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
      boardingStatus: 'Boarding & Day',
      photos: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
      ],
      programsOffered: [
        { name: 'General Science', description: 'Science program' },
        { name: 'General Arts', description: 'Arts program' },
        { name: 'Business', description: 'Business studies program' },
      ],
      facilities: ['Library', 'Science Laboratories', 'Computer Lab', 'Sports Complex', 'Dining Hall', 'Hostels'],
      achievements: [
        'Leading school in Volta Region',
        'Strong academic performance',
        'Active student body',
      ],
      contact: {
        phone: '+233 362 123 789',
        email: 'info@hoshs.edu.gh',
        address: 'Ho, Volta Region, Ghana',
      },
    },
  ];

  const school = seniorHighSchools.find(s => s.id === id) || seniorHighSchools[0];

  const nextPhoto = () => {
    if (school.photos && school.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % school.photos!.length);
    }
  };

  const prevPhoto = () => {
    if (school.photos && school.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + school.photos!.length) % school.photos!.length);
    }
  };

  const isolatedStyles = `
    .shs-view-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .shs-view-content-wrapper {
      padding-top: 80px;
      min-height: calc(100vh - 80px);
    }

    .shs-view-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: clamp(1rem, 3vw, 2rem);
    }

    .shs-view-back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: white;
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      color: hsl(220 30% 15%);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 1.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-back-button:hover {
      background: hsl(40 20% 94%);
      border-color: hsl(220 20% 40%);
    }

    .shs-view-header {
      background: white;
      border-radius: 1rem;
      padding: clamp(1.5rem, 4vw, 2.5rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid hsl(40 20% 88%);
    }

    .shs-view-header-top {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(1.5rem, 5vw, 3rem);
      align-items: start;
      margin-bottom: 0;
    }

    .shs-view-left-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .shs-view-right-section {
      display: flex;
      flex-direction: column;
    }

    .shs-view-logo-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .shs-view-logo {
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

    .shs-view-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .shs-view-title-section {
      width: 100%;
    }

    .shs-view-title {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(0.375rem, 1vw, 0.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.2;
    }

    .shs-view-stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0;
    }

    .shs-view-stats-table tr {
      border-bottom: 1px solid hsl(40 20% 88%);
    }

    .shs-view-stats-table tr:last-child {
      border-bottom: none;
    }

    .shs-view-stats-table td {
      padding: clamp(0.75rem, 2vw, 1rem);
      font-size: clamp(0.875rem, 2vw, 0.95rem);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-stats-table td:first-child {
      font-weight: 600;
      color: hsl(220 30% 15%);
      width: 40%;
    }

    .shs-view-stats-table td:last-child {
      color: hsl(220 20% 40%);
    }

    .shs-view-about-photos-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      align-items: start;
    }

    .shs-view-description {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid hsl(40 20% 88%);
      height: fit-content;
      align-self: start;
    }

    .shs-view-description-title {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-description-text {
      font-size: clamp(0.875rem, 2vw, 1rem);
      line-height: 1.8;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
    }

    .shs-view-photos-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid hsl(40 20% 88%);
      height: fit-content;
      align-self: start;
    }

    .shs-view-photos-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-photo-container {
      position: relative;
      width: 100%;
      height: clamp(250px, 50vw, 400px);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      overflow: hidden;
      background: hsl(40 20% 94%);
    }

    .shs-view-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .shs-view-photo-nav {
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

    .shs-view-photo-nav:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .shs-view-photo-nav.prev {
      left: 1rem;
    }

    .shs-view-photo-nav.next {
      right: 1rem;
    }

    .shs-view-photo-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .shs-view-photo-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: hsl(40 20% 88%);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .shs-view-photo-dot.active {
      background: hsl(220 30% 15%);
      width: 1.5rem;
      border-radius: 0.25rem;
    }

    .shs-view-breakdown-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .shs-view-breakdown-title {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid hsl(40 20% 88%);
      margin-bottom: 2rem;
    }

    .shs-view-tab {
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

    .shs-view-tab:hover {
      color: hsl(220 30% 15%);
    }

    .shs-view-tab.active {
      color: hsl(220 30% 15%);
      border-bottom-color: hsl(220 30% 15%);
    }

    .shs-view-tab-content {
      min-height: 300px;
    }

    .shs-view-program-item {
      padding: 1.5rem;
      background: hsl(40 20% 98%);
      border-radius: 0.75rem;
      margin-bottom: 1rem;
    }

    .shs-view-program-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-program-description {
      font-size: 0.95rem;
      color: hsl(220 20% 40%);
      line-height: 1.6;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-facilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .shs-view-facility-item {
      padding: 1rem;
      background: hsl(40 20% 98%);
      border-radius: 0.5rem;
      font-size: 0.95rem;
      color: hsl(220 30% 15%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-achievement-item {
      padding: 1rem;
      background: hsl(40 20% 98%);
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .shs-view-other-schools-section {
      margin-top: 3rem;
      margin-bottom: 2rem;
    }

    .shs-view-other-schools-title {
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 clamp(0.375rem, 1vw, 0.5rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-other-schools-subtitle {
      font-size: clamp(0.875rem, 2vw, 1rem);
      color: hsl(220 20% 40%);
      margin: 0 0 clamp(1.5rem, 4vw, 2rem) 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .shs-view-other-schools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
      gap: clamp(0.75rem, 2vw, 1rem);
    }

    .shs-view-other-school-card {
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

    .shs-view-other-school-card:hover {
      border-color: hsl(220 20% 40%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .shs-view-other-school-logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .shs-view-other-school-logo {
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

    .shs-view-other-school-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .shs-view-other-school-placeholder {
      font-size: 0.875rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      text-align: center;
    }

    .shs-view-other-school-divider {
      width: 1px;
      height: 40px;
      background: hsl(40 20% 88%);
      flex-shrink: 0;
    }

    .shs-view-other-school-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 0;
    }

    .shs-view-other-school-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.3;
      text-align: left;
    }

    .shs-view-other-school-type {
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

    @media (max-width: 768px) {
      .shs-view-header-top {
        grid-template-columns: 1fr;
        gap: clamp(1.5rem, 4vw, 2rem);
      }

      .shs-view-left-section {
        order: 1;
      }

      .shs-view-right-section {
        order: 2;
      }

      .shs-view-logo-section {
        align-items: center;
      }

      .shs-view-stats-table {
        font-size: clamp(0.8rem, 2vw, 0.9rem);
      }

      .shs-view-stats-table td {
        padding: clamp(0.625rem, 2vw, 0.875rem);
      }

      .shs-view-about-photos-wrapper {
        grid-template-columns: 1fr;
        gap: clamp(1rem, 3vw, 1.5rem);
      }

      .shs-view-other-school-card {
        flex-direction: column;
        text-align: center;
      }

      .shs-view-other-school-logo {
        width: clamp(45px, 10vw, 50px);
        height: clamp(45px, 10vw, 50px);
      }

      .shs-view-other-school-divider {
        display: none;
      }

      .shs-view-other-school-info {
        align-items: center;
      }

      .shs-view-other-school-name {
        text-align: center;
      }

      .shs-view-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
      }

      .shs-view-tabs::-webkit-scrollbar {
        height: 4px;
      }

      .shs-view-tabs::-webkit-scrollbar-track {
        background: hsl(40 20% 94%);
      }

      .shs-view-tabs::-webkit-scrollbar-thumb {
        background: hsl(220 20% 40%);
        border-radius: 2px;
      }

      .shs-view-tab {
        white-space: nowrap;
        flex-shrink: 0;
      }

      .shs-view-facilities-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="shs-view-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="shs-view-content-wrapper">
        <div className="shs-view-main-content">
          <button onClick={() => navigate(-1)} className="shs-view-back-button">
            <ArrowLeft size={18} />
            Back to Schools
          </button>

          <div className="shs-view-header">
            <div className="shs-view-header-top">
              <div className="shs-view-left-section">
                <div className="shs-view-logo-section">
                  <div className="shs-view-logo">
                    {school.logo ? (
                      <img src={school.logo} alt={`${school.name} logo`} />
                    ) : (
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'hsl(220 30% 15%)' }}>
                        {school.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shs-view-title-section">
                  <h1 className="shs-view-title">{school.name}</h1>
                </div>
              </div>

              <div className="shs-view-right-section">
                <table className="shs-view-stats-table">
                  <tbody>
                    <tr>
                      <td>REGION & DISTRICT</td>
                      <td>{school.district}, {school.region}</td>
                    </tr>
                    <tr>
                      <td>CATEGORY</td>
                      <td>{school.category}</td>
                    </tr>
                    <tr>
                      <td>GENDER</td>
                      <td>{school.gender}</td>
                    </tr>
                    {school.boardingStatus && (
                      <tr>
                        <td>BOARDING STATUS</td>
                        <td>{school.boardingStatus}</td>
                      </tr>
                    )}
                    {school.boardingStatus && (
                      <tr>
                        <td>BOARDING/DAY</td>
                        <td>{school.boardingStatus}</td>
                      </tr>
                    )}
                    {school.studentPopulation && (
                      <tr>
                        <td>STUDENT POPULATION</td>
                        <td>{school.studentPopulation}</td>
                      </tr>
                    )}
                    {school.yearEstablished && (
                      <tr>
                        <td>ESTABLISHED</td>
                        <td>{school.yearEstablished}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="shs-view-about-photos-wrapper">
            <div className="shs-view-description">
              <h2 className="shs-view-description-title">ABOUT</h2>
              <p className="shs-view-description-text">{school.description}</p>
              {school.contact && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid hsl(40 20% 88%)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(220 30% 15%)', marginBottom: '0.75rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>Contact Information</h3>
                  {school.contact.phone && (
                    <p style={{ fontSize: '0.95rem', color: 'hsl(220 20% 40%)', margin: '0.25rem 0', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                      <strong>Phone:</strong> {school.contact.phone}
                    </p>
                  )}
                  {school.contact.email && (
                    <p style={{ fontSize: '0.95rem', color: 'hsl(220 20% 40%)', margin: '0.25rem 0', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                      <strong>Email:</strong> {school.contact.email}
                    </p>
                  )}
                  {school.contact.address && (
                    <p style={{ fontSize: '0.95rem', color: 'hsl(220 20% 40%)', margin: '0.25rem 0', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                      <strong>Address:</strong> {school.contact.address}
                    </p>
                  )}
                </div>
              )}
            </div>
            {school.photos && school.photos.length > 0 && (
              <div className="shs-view-photos-section">
                <h2 className="shs-view-photos-title">PHOTOS</h2>
                <div className="shs-view-photo-container">
                  <img
                    src={school.photos[currentPhotoIndex]}
                    alt={`${school.name} - Photo ${currentPhotoIndex + 1}`}
                    className="shs-view-photo"
                  />
                  {school.photos.length > 1 && (
                    <>
                      <button className="shs-view-photo-nav prev" onClick={prevPhoto}>
                        <ChevronLeft size={20} />
                      </button>
                      <button className="shs-view-photo-nav next" onClick={nextPhoto}>
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                {school.photos.length > 1 && (
                  <div className="shs-view-photo-dots">
                    {school.photos.map((_, index) => (
                      <button
                        key={index}
                        className={`shs-view-photo-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                        onClick={() => setCurrentPhotoIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="shs-view-breakdown-section">
            <h2 className="shs-view-breakdown-title">BREAKDOWN</h2>
            <div className="shs-view-tabs">
              <button
                className={`shs-view-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              {school.programsOffered && school.programsOffered.length > 0 && (
                <button
                  className={`shs-view-tab ${activeTab === 'programs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('programs')}
                >
                  Programs
                </button>
              )}
              {school.facilities && school.facilities.length > 0 && (
                <button
                  className={`shs-view-tab ${activeTab === 'facilities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('facilities')}
                >
                  Facilities
                </button>
              )}
              {school.achievements && school.achievements.length > 0 && (
                <button
                  className={`shs-view-tab ${activeTab === 'achievements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Achievements
                </button>
              )}
            </div>
            <div className="shs-view-tab-content">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'hsl(220 30% 15%)', marginBottom: '1rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>Programs Offered</h3>
                      <p style={{ fontSize: '0.95rem', color: 'hsl(220 20% 40%)', lineHeight: 1.6, marginBottom: '1.5rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                        {school.programs}
                      </p>
                      {school.studentPopulation && (
                        <p style={{ fontSize: '0.95rem', color: 'hsl(220 20% 40%)', lineHeight: 1.6, marginBottom: '0.5rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                          <strong>Student Population:</strong> {school.studentPopulation}
                        </p>
                      )}
                      {school.yearEstablished && (
                        <p style={{ fontSize: '0.95rem', color: 'hsl(220 20% 40%)', lineHeight: 1.6, marginBottom: '0.5rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                          <strong>Established:</strong> {school.yearEstablished}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'programs' && school.programsOffered && (
                  <motion.div
                    key="programs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {school.programsOffered.map((program, index) => (
                      <div key={index} className="shs-view-program-item">
                        <h3 className="shs-view-program-name">{program.name}</h3>
                        <p className="shs-view-program-description">{program.description}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'facilities' && school.facilities && (
                  <motion.div
                    key="facilities"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="shs-view-facilities-grid">
                      {school.facilities.map((facility, index) => (
                        <div key={index} className="shs-view-facility-item">
                          {facility}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'achievements' && school.achievements && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {school.achievements.map((achievement, index) => (
                      <div key={index} className="shs-view-achievement-item">
                        {achievement}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="shs-view-other-schools-section">
            <h2 className="shs-view-other-schools-title">Other Senior High Schools</h2>
            <p className="shs-view-other-schools-subtitle">
              Explore other senior high schools in Ghana
            </p>
            <div className="shs-view-other-schools-grid">
              {useMemo(() => {
                return seniorHighSchools
                  .filter(s => s.id !== school.id)
                  .slice(0, 5)
                  .map((otherSchool) => (
                    <Link
                      key={otherSchool.id}
                      to={`/directories/shs/${otherSchool.id}`}
                      className="shs-view-other-school-card"
                    >
                      <div className="shs-view-other-school-logo-section">
                        <div className="shs-view-other-school-logo">
                          {otherSchool.logo ? (
                            <img src={otherSchool.logo} alt={`${otherSchool.name} logo`} />
                          ) : (
                            <div className="shs-view-other-school-placeholder">
                              {otherSchool.name.split(' ').map(w => w[0]).join('').substring(0, 3)}
                            </div>
                          )}
                        </div>
                        <div className="shs-view-other-school-type">
                          {otherSchool.category}
                        </div>
                      </div>
                      <div className="shs-view-other-school-divider"></div>
                      <div className="shs-view-other-school-info">
                        <h3 className="shs-view-other-school-name">{otherSchool.name}</h3>
                      </div>
                    </Link>
                  ));
              }, [school.id])}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeniorHighSchoolView;

