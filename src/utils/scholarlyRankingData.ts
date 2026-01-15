// ============================================================================
// SCHOLARLY RANKING PLATFORM - MOCK DATA
// ============================================================================
// Comprehensive mock data for development and demonstration
// This will be replaced with Supabase queries in production
// ============================================================================

import type {
  RankedUniversity,
  Article,
  Author,
  Discipline,
  PlatformStats,
  ChartDataPoint,
  TrendDataPoint,
  UniversityProfile,
  RankingHistoryPoint,
  DisciplineCount,
} from './scholarlyRankingTypes';

// -----------------------------------------------------------------------------
// MOCK UNIVERSITIES
// -----------------------------------------------------------------------------

export const mockUniversities: RankedUniversity[] = [
  {
    id: 'uni-001',
    name: 'Massachusetts Institute of Technology',
    slug: 'mit',
    abbreviation: 'MIT',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png',
    country: 'United States',
    city: 'Cambridge, MA',
    foundedYear: 1861,
    website: 'https://mit.edu',
    description: 'A private research university known for its strength in physical sciences and engineering.',
    currentRank: 1,
    previousRank: 3,
    movement: 'up',
    movementDelta: 2,
    totalArticles: 2341,
    articlesThisMonth: 47,
    articlesThisYear: 312,
    totalCitations: 89420,
    totalViews: 1247890,
    totalDownloads: 234567,
    hIndex: 245,
    monthlyArticleCounts: [180, 195, 210, 225, 198, 245, 267, 234, 256, 278, 289, 312],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-002',
    name: 'Stanford University',
    slug: 'stanford',
    abbreviation: 'Stanford',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/200px-Stanford_Cardinal_logo.svg.png',
    country: 'United States',
    city: 'Stanford, CA',
    foundedYear: 1885,
    website: 'https://stanford.edu',
    description: 'A private research university located in the heart of Silicon Valley.',
    currentRank: 2,
    previousRank: 1,
    movement: 'down',
    movementDelta: 1,
    totalArticles: 2287,
    articlesThisMonth: 31,
    articlesThisYear: 289,
    totalCitations: 87654,
    totalViews: 1189234,
    totalDownloads: 221345,
    hIndex: 238,
    monthlyArticleCounts: [175, 188, 201, 215, 192, 238, 254, 228, 241, 265, 271, 289],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-003',
    name: 'University of Oxford',
    slug: 'oxford',
    abbreviation: 'Oxford',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/200px-Oxford-University-Circlet.svg.png',
    country: 'United Kingdom',
    city: 'Oxford',
    foundedYear: 1096,
    website: 'https://ox.ac.uk',
    description: 'The oldest university in the English-speaking world with a global reputation for excellence.',
    currentRank: 3,
    previousRank: 3,
    movement: 'stable',
    movementDelta: 0,
    totalArticles: 2156,
    articlesThisMonth: 38,
    articlesThisYear: 278,
    totalCitations: 82341,
    totalViews: 1098765,
    totalDownloads: 198234,
    hIndex: 231,
    monthlyArticleCounts: [165, 178, 189, 198, 185, 221, 237, 215, 228, 248, 259, 278],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-004',
    name: 'University of Cambridge',
    slug: 'cambridge',
    abbreviation: 'Cambridge',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/200px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png',
    country: 'United Kingdom',
    city: 'Cambridge',
    foundedYear: 1209,
    website: 'https://cam.ac.uk',
    description: 'A collegiate research university with a rich history of academic excellence.',
    currentRank: 4,
    previousRank: 5,
    movement: 'up',
    movementDelta: 1,
    totalArticles: 2089,
    articlesThisMonth: 42,
    articlesThisYear: 265,
    totalCitations: 79876,
    totalViews: 1045678,
    totalDownloads: 187654,
    hIndex: 226,
    monthlyArticleCounts: [158, 171, 182, 191, 178, 214, 229, 208, 221, 241, 252, 265],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-005',
    name: 'Harvard University',
    slug: 'harvard',
    abbreviation: 'Harvard',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/200px-Harvard_University_coat_of_arms.svg.png',
    country: 'United States',
    city: 'Cambridge, MA',
    foundedYear: 1636,
    website: 'https://harvard.edu',
    description: 'The oldest institution of higher learning in the United States.',
    currentRank: 5,
    previousRank: 4,
    movement: 'down',
    movementDelta: 1,
    totalArticles: 1934,
    articlesThisMonth: 29,
    articlesThisYear: 248,
    totalCitations: 76543,
    totalViews: 987654,
    totalDownloads: 176543,
    hIndex: 219,
    monthlyArticleCounts: [148, 161, 172, 181, 168, 204, 219, 198, 211, 231, 242, 248],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-006',
    name: 'ETH Zurich',
    slug: 'eth-zurich',
    abbreviation: 'ETH',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/ETH_Z%C3%BCrich_Logo_black.svg/200px-ETH_Z%C3%BCrich_Logo_black.svg.png',
    country: 'Switzerland',
    city: 'Zurich',
    foundedYear: 1855,
    website: 'https://ethz.ch',
    description: 'A public research university specializing in science, technology, and engineering.',
    currentRank: 6,
    previousRank: 8,
    movement: 'up',
    movementDelta: 2,
    totalArticles: 1876,
    articlesThisMonth: 44,
    articlesThisYear: 234,
    totalCitations: 71234,
    totalViews: 923456,
    totalDownloads: 165432,
    hIndex: 212,
    monthlyArticleCounts: [138, 151, 162, 171, 158, 194, 209, 188, 201, 221, 232, 234],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-007',
    name: 'California Institute of Technology',
    slug: 'caltech',
    abbreviation: 'Caltech',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Seal_of_the_California_Institute_of_Technology.svg/200px-Seal_of_the_California_Institute_of_Technology.svg.png',
    country: 'United States',
    city: 'Pasadena, CA',
    foundedYear: 1891,
    website: 'https://caltech.edu',
    description: 'A private research university focused on science and engineering.',
    currentRank: 7,
    previousRank: 6,
    movement: 'down',
    movementDelta: 1,
    totalArticles: 1798,
    articlesThisMonth: 26,
    articlesThisYear: 221,
    totalCitations: 68765,
    totalViews: 876543,
    totalDownloads: 154321,
    hIndex: 205,
    monthlyArticleCounts: [128, 141, 152, 161, 148, 184, 199, 178, 191, 211, 222, 221],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-008',
    name: 'University of Chicago',
    slug: 'uchicago',
    abbreviation: 'UChicago',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UChicago_Maroon_logo.svg/200px-UChicago_Maroon_logo.svg.png',
    country: 'United States',
    city: 'Chicago, IL',
    foundedYear: 1890,
    website: 'https://uchicago.edu',
    description: 'A private research university known for its rigorous academic programs.',
    currentRank: 8,
    previousRank: 7,
    movement: 'down',
    movementDelta: 1,
    totalArticles: 1654,
    articlesThisMonth: 28,
    articlesThisYear: 198,
    totalCitations: 63456,
    totalViews: 812345,
    totalDownloads: 143210,
    hIndex: 198,
    monthlyArticleCounts: [118, 131, 142, 151, 138, 174, 189, 168, 181, 201, 212, 198],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-009',
    name: 'Imperial College London',
    slug: 'imperial',
    abbreviation: 'Imperial',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Imperial_College_London_crest.svg/200px-Imperial_College_London_crest.svg.png',
    country: 'United Kingdom',
    city: 'London',
    foundedYear: 1907,
    website: 'https://imperial.ac.uk',
    description: 'A public research university focused on science, engineering, medicine, and business.',
    currentRank: 9,
    previousRank: 10,
    movement: 'up',
    movementDelta: 1,
    totalArticles: 1587,
    articlesThisMonth: 35,
    articlesThisYear: 187,
    totalCitations: 59876,
    totalViews: 765432,
    totalDownloads: 132109,
    hIndex: 191,
    monthlyArticleCounts: [108, 121, 132, 141, 128, 164, 179, 158, 171, 191, 202, 187],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-010',
    name: 'Princeton University',
    slug: 'princeton',
    abbreviation: 'Princeton',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Princeton_seal.svg/200px-Princeton_seal.svg.png',
    country: 'United States',
    city: 'Princeton, NJ',
    foundedYear: 1746,
    website: 'https://princeton.edu',
    description: 'One of the oldest and most prestigious universities in the United States.',
    currentRank: 10,
    previousRank: 9,
    movement: 'down',
    movementDelta: 1,
    totalArticles: 1521,
    articlesThisMonth: 24,
    articlesThisYear: 176,
    totalCitations: 56789,
    totalViews: 698765,
    totalDownloads: 121098,
    hIndex: 184,
    monthlyArticleCounts: [98, 111, 122, 131, 118, 154, 169, 148, 161, 181, 192, 176],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-011',
    name: 'University of Tokyo',
    slug: 'utokyo',
    abbreviation: 'UTokyo',
    country: 'Japan',
    city: 'Tokyo',
    foundedYear: 1877,
    website: 'https://u-tokyo.ac.jp',
    description: 'Japan\'s most prestigious university with strong research output.',
    currentRank: 11,
    previousRank: 12,
    movement: 'up',
    movementDelta: 1,
    totalArticles: 1487,
    articlesThisMonth: 33,
    articlesThisYear: 168,
    totalCitations: 54321,
    totalViews: 654321,
    totalDownloads: 112345,
    hIndex: 178,
    monthlyArticleCounts: [92, 105, 116, 125, 112, 148, 163, 142, 155, 175, 186, 168],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-012',
    name: 'National University of Singapore',
    slug: 'nus',
    abbreviation: 'NUS',
    country: 'Singapore',
    city: 'Singapore',
    foundedYear: 1905,
    website: 'https://nus.edu.sg',
    description: 'Asia\'s leading global university with a comprehensive range of disciplines.',
    currentRank: 12,
    previousRank: 14,
    movement: 'up',
    movementDelta: 2,
    totalArticles: 1423,
    articlesThisMonth: 39,
    articlesThisYear: 159,
    totalCitations: 51234,
    totalViews: 612345,
    totalDownloads: 104567,
    hIndex: 171,
    monthlyArticleCounts: [86, 99, 110, 119, 106, 142, 157, 136, 149, 169, 180, 159],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-013',
    name: 'University of Ghana',
    slug: 'ug',
    abbreviation: 'UG',
    country: 'Ghana',
    city: 'Accra',
    foundedYear: 1948,
    website: 'https://ug.edu.gh',
    description: 'The oldest and largest university in Ghana, known for excellence in research.',
    currentRank: 13,
    previousRank: null,
    movement: 'new',
    movementDelta: 0,
    totalArticles: 1387,
    articlesThisMonth: 45,
    articlesThisYear: 156,
    totalCitations: 48765,
    totalViews: 578234,
    totalDownloads: 98765,
    hIndex: 165,
    monthlyArticleCounts: [78, 91, 102, 111, 98, 134, 149, 128, 141, 161, 172, 156],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-014',
    name: 'Kwame Nkrumah University of Science and Technology',
    slug: 'knust',
    abbreviation: 'KNUST',
    country: 'Ghana',
    city: 'Kumasi',
    foundedYear: 1952,
    website: 'https://knust.edu.gh',
    description: 'Ghana\'s premier science and technology university with strong STEM programs.',
    currentRank: 14,
    previousRank: 15,
    movement: 'up',
    movementDelta: 1,
    totalArticles: 1298,
    articlesThisMonth: 37,
    articlesThisYear: 145,
    totalCitations: 45678,
    totalViews: 534567,
    totalDownloads: 91234,
    hIndex: 158,
    monthlyArticleCounts: [72, 85, 96, 105, 92, 128, 143, 122, 135, 155, 166, 145],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'uni-015',
    name: 'University of Cape Coast',
    slug: 'ucc',
    abbreviation: 'UCC',
    country: 'Ghana',
    city: 'Cape Coast',
    foundedYear: 1962,
    website: 'https://ucc.edu.gh',
    description: 'A leading university in education and humanities research in West Africa.',
    currentRank: 15,
    previousRank: 13,
    movement: 'down',
    movementDelta: 2,
    totalArticles: 1234,
    articlesThisMonth: 28,
    articlesThisYear: 138,
    totalCitations: 42345,
    totalViews: 498765,
    totalDownloads: 84567,
    hIndex: 152,
    monthlyArticleCounts: [66, 79, 90, 99, 86, 122, 137, 116, 129, 149, 160, 138],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
];

// -----------------------------------------------------------------------------
// MOCK AUTHORS
// -----------------------------------------------------------------------------

export const mockAuthors: Author[] = [
  {
    id: 'auth-001',
    name: 'Dr. Sarah Chen',
    title: 'Associate Professor',
    universityId: 'uni-001',
    universityName: 'Massachusetts Institute of Technology',
    department: 'Department of Physics',
    email: 's.chen@mit.edu',
    orcidId: '0000-0001-2345-6789',
    bio: 'Specializing in quantum computing and topological systems.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    totalArticles: 67,
    totalCitations: 1234,
    hIndex: 18,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'auth-002',
    name: 'Prof. James Liu',
    title: 'Professor',
    universityId: 'uni-001',
    universityName: 'Massachusetts Institute of Technology',
    department: 'Department of Physics',
    email: 'j.liu@mit.edu',
    orcidId: '0000-0002-3456-7890',
    bio: 'Leading researcher in quantum error correction.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    totalArticles: 89,
    totalCitations: 2567,
    hIndex: 24,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'auth-003',
    name: 'Prof. Michael Torres',
    title: 'Professor',
    universityId: 'uni-001',
    universityName: 'Massachusetts Institute of Technology',
    department: 'Department of Computer Science',
    email: 'm.torres@mit.edu',
    orcidId: '0000-0003-4567-8901',
    bio: 'Expert in machine learning and climate modeling.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    totalArticles: 54,
    totalCitations: 987,
    hIndex: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'auth-004',
    name: 'Dr. Anna Kim',
    title: 'Assistant Professor',
    universityId: 'uni-001',
    universityName: 'Massachusetts Institute of Technology',
    department: 'Department of Computer Science',
    email: 'a.kim@mit.edu',
    orcidId: '0000-0004-5678-9012',
    bio: 'Researcher in deep learning applications.',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    totalArticles: 48,
    totalCitations: 765,
    hIndex: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
];

// -----------------------------------------------------------------------------
// MOCK ARTICLES
// -----------------------------------------------------------------------------

export const mockArticles: Article[] = [
  {
    id: 'art-001',
    title: 'Quantum Error Correction in Topological Systems',
    slug: 'quantum-error-correction-topological-systems',
    abstract: 'We present a novel approach to quantum error correction leveraging the topological properties of certain quantum states. Our method achieves error correction thresholds significantly higher than conventional approaches while requiring fewer physical qubits. We demonstrate practical implementations on current quantum hardware and provide theoretical bounds for scalability.',
    doi: '10.1234/example.2026.01.001',
    universityId: 'uni-001',
    universityName: 'Massachusetts Institute of Technology',
    universitySlug: 'mit',
    disciplineId: 'disc-001',
    disciplineName: 'Physics',
    authors: [
      { id: 'auth-001', name: 'Dr. Sarah Chen', title: 'Associate Professor', affiliationNumber: 1, isCorresponding: true, email: 's.chen@mit.edu' },
      { id: 'auth-002', name: 'Prof. James Liu', title: 'Professor', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['quantum computing', 'error correction', 'topological systems', 'fault tolerance'],
    publishedAt: '2026-01-14T09:00:00Z',
    status: 'published',
    viewCount: 234,
    downloadCount: 89,
    citationCount: 12,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z',
  },
  {
    id: 'art-002',
    title: 'Machine Learning Approaches to Climate Modeling: A Comprehensive Review',
    slug: 'machine-learning-climate-modeling-review',
    abstract: 'This paper explores the application of deep learning models to improve climate prediction accuracy. We review recent advances in neural network architectures and their applications to atmospheric modeling, ocean dynamics, and extreme weather prediction. Our analysis suggests that hybrid physics-ML models offer the most promising path forward.',
    doi: '10.1234/example.2026.01.002',
    universityId: 'uni-001',
    universityName: 'Massachusetts Institute of Technology',
    universitySlug: 'mit',
    disciplineId: 'disc-002',
    disciplineName: 'Computer Science',
    authors: [
      { id: 'auth-003', name: 'Prof. Michael Torres', title: 'Professor', affiliationNumber: 1, isCorresponding: true, email: 'm.torres@mit.edu' },
      { id: 'auth-004', name: 'Dr. Anna Kim', title: 'Assistant Professor', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'review',
    keywords: ['machine learning', 'climate modeling', 'deep learning', 'weather prediction'],
    publishedAt: '2026-01-12T09:00:00Z',
    status: 'published',
    viewCount: 456,
    downloadCount: 123,
    citationCount: 8,
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'art-003',
    title: 'Advances in CRISPR-Cas9 Gene Editing for Therapeutic Applications',
    slug: 'crispr-cas9-therapeutic-applications',
    abstract: 'This study presents novel modifications to the CRISPR-Cas9 system that enhance specificity and reduce off-target effects in therapeutic contexts. We demonstrate successful application in treating hereditary diseases in animal models with implications for human clinical trials.',
    doi: '10.1234/example.2026.01.003',
    universityId: 'uni-002',
    universityName: 'Stanford University',
    universitySlug: 'stanford',
    disciplineId: 'disc-003',
    disciplineName: 'Biology',
    authors: [
      { id: 'auth-005', name: 'Dr. Emily Watson', title: 'Associate Professor', affiliationNumber: 1, isCorresponding: true },
      { id: 'auth-006', name: 'Prof. Robert Chang', title: 'Professor', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['CRISPR', 'gene editing', 'therapeutics', 'genetic diseases'],
    publishedAt: '2026-01-10T09:00:00Z',
    status: 'published',
    viewCount: 567,
    downloadCount: 156,
    citationCount: 15,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'art-004',
    title: 'Sustainable Energy Storage: Next-Generation Battery Technologies',
    slug: 'sustainable-energy-storage-batteries',
    abstract: 'We present breakthrough research in solid-state battery technology that promises to revolutionize energy storage. Our new electrolyte formulation achieves unprecedented energy density while maintaining safety and longevity superior to conventional lithium-ion batteries.',
    doi: '10.1234/example.2026.01.004',
    universityId: 'uni-003',
    universityName: 'University of Oxford',
    universitySlug: 'oxford',
    disciplineId: 'disc-004',
    disciplineName: 'Engineering',
    authors: [
      { id: 'auth-007', name: 'Prof. William Harrison', title: 'Professor', affiliationNumber: 1, isCorresponding: true },
      { id: 'auth-008', name: 'Dr. Sophie Bennett', title: 'Senior Researcher', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['batteries', 'energy storage', 'solid-state', 'sustainability'],
    publishedAt: '2026-01-08T09:00:00Z',
    status: 'published',
    viewCount: 789,
    downloadCount: 234,
    citationCount: 21,
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-08T09:00:00Z',
  },
  {
    id: 'art-005',
    title: 'Neural Networks for Natural Language Understanding: Architecture Innovations',
    slug: 'neural-networks-nlu-architecture',
    abstract: 'This paper introduces a novel transformer architecture that achieves state-of-the-art performance on multiple NLU benchmarks while requiring significantly fewer parameters. We demonstrate improved efficiency and interpretability without sacrificing accuracy.',
    doi: '10.1234/example.2026.01.005',
    universityId: 'uni-004',
    universityName: 'University of Cambridge',
    universitySlug: 'cambridge',
    disciplineId: 'disc-002',
    disciplineName: 'Computer Science',
    authors: [
      { id: 'auth-009', name: 'Dr. Oliver Wright', title: 'Reader', affiliationNumber: 1, isCorresponding: true },
      { id: 'auth-010', name: 'Prof. Emma Davies', title: 'Professor', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['neural networks', 'NLU', 'transformers', 'deep learning'],
    publishedAt: '2026-01-06T09:00:00Z',
    status: 'published',
    viewCount: 678,
    downloadCount: 198,
    citationCount: 18,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-06T09:00:00Z',
  },
  {
    id: 'art-006',
    title: 'Economic Impacts of Climate Change on Agricultural Productivity in West Africa',
    slug: 'climate-change-agriculture-west-africa',
    abstract: 'This comprehensive study analyzes the economic implications of climate change on agricultural productivity across West African nations. Using novel econometric models combined with climate projections, we quantify potential GDP losses and propose adaptation strategies.',
    doi: '10.1234/example.2026.01.006',
    universityId: 'uni-013',
    universityName: 'University of Ghana',
    universitySlug: 'ug',
    disciplineId: 'disc-005',
    disciplineName: 'Economics',
    authors: [
      { id: 'auth-011', name: 'Prof. Kwame Asante', title: 'Professor', affiliationNumber: 1, isCorresponding: true },
      { id: 'auth-012', name: 'Dr. Abena Mensah', title: 'Senior Lecturer', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['climate change', 'agriculture', 'economics', 'West Africa', 'food security'],
    publishedAt: '2026-01-04T09:00:00Z',
    status: 'published',
    viewCount: 345,
    downloadCount: 112,
    citationCount: 9,
    createdAt: '2025-12-28T00:00:00Z',
    updatedAt: '2026-01-04T09:00:00Z',
  },
  {
    id: 'art-007',
    title: 'Renewable Energy Integration in Developing Economies: A Ghana Case Study',
    slug: 'renewable-energy-ghana-case-study',
    abstract: 'We examine the challenges and opportunities of integrating renewable energy sources into Ghana\'s national grid. Our analysis includes technical, economic, and policy dimensions with recommendations for accelerating the energy transition.',
    doi: '10.1234/example.2026.01.007',
    universityId: 'uni-014',
    universityName: 'Kwame Nkrumah University of Science and Technology',
    universitySlug: 'knust',
    disciplineId: 'disc-004',
    disciplineName: 'Engineering',
    authors: [
      { id: 'auth-013', name: 'Dr. Kofi Owusu', title: 'Senior Lecturer', affiliationNumber: 1, isCorresponding: true },
      { id: 'auth-014', name: 'Prof. Yaw Amoako', title: 'Professor', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'case-study',
    keywords: ['renewable energy', 'Ghana', 'solar power', 'energy policy'],
    publishedAt: '2026-01-02T09:00:00Z',
    status: 'published',
    viewCount: 289,
    downloadCount: 87,
    citationCount: 6,
    createdAt: '2025-12-25T00:00:00Z',
    updatedAt: '2026-01-02T09:00:00Z',
  },
  {
    id: 'art-008',
    title: 'Indigenous Knowledge Systems and Modern Science: Bridging Epistemologies',
    slug: 'indigenous-knowledge-modern-science',
    abstract: 'This paper explores the intersection of traditional African knowledge systems with contemporary scientific methodologies. We propose frameworks for respectful integration that honors indigenous wisdom while leveraging modern research tools.',
    doi: '10.1234/example.2026.01.008',
    universityId: 'uni-015',
    universityName: 'University of Cape Coast',
    universitySlug: 'ucc',
    disciplineId: 'disc-006',
    disciplineName: 'Social Sciences',
    authors: [
      { id: 'auth-015', name: 'Prof. Ama Aidoo', title: 'Professor', affiliationNumber: 1, isCorresponding: true },
      { id: 'auth-016', name: 'Dr. Francis Adjei', title: 'Lecturer', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['indigenous knowledge', 'epistemology', 'African studies', 'research methodology'],
    publishedAt: '2025-12-28T09:00:00Z',
    status: 'published',
    viewCount: 234,
    downloadCount: 78,
    citationCount: 5,
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2025-12-28T09:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// MOCK DISCIPLINES
// -----------------------------------------------------------------------------

export const mockDisciplines: Discipline[] = [
  {
    id: 'disc-parent-1',
    name: 'Sciences',
    slug: 'sciences',
    articleCount: 4567,
    children: [
      { id: 'disc-001', name: 'Physics', slug: 'physics', parentId: 'disc-parent-1', articleCount: 1234 },
      { id: 'disc-007', name: 'Chemistry', slug: 'chemistry', parentId: 'disc-parent-1', articleCount: 890 },
      { id: 'disc-003', name: 'Biology', slug: 'biology', parentId: 'disc-parent-1', articleCount: 1123 },
      { id: 'disc-008', name: 'Mathematics', slug: 'mathematics', parentId: 'disc-parent-1', articleCount: 678 },
      { id: 'disc-009', name: 'Environmental Science', slug: 'environmental-science', parentId: 'disc-parent-1', articleCount: 642 },
    ],
  },
  {
    id: 'disc-parent-2',
    name: 'Engineering',
    slug: 'engineering',
    articleCount: 3421,
    children: [
      { id: 'disc-002', name: 'Computer Science', slug: 'computer-science', parentId: 'disc-parent-2', articleCount: 1456 },
      { id: 'disc-004', name: 'Electrical Engineering', slug: 'electrical-engineering', parentId: 'disc-parent-2', articleCount: 876 },
      { id: 'disc-010', name: 'Mechanical Engineering', slug: 'mechanical-engineering', parentId: 'disc-parent-2', articleCount: 654 },
      { id: 'disc-011', name: 'Civil Engineering', slug: 'civil-engineering', parentId: 'disc-parent-2', articleCount: 435 },
    ],
  },
  {
    id: 'disc-parent-3',
    name: 'Humanities',
    slug: 'humanities',
    articleCount: 1876,
    children: [
      { id: 'disc-012', name: 'History', slug: 'history', parentId: 'disc-parent-3', articleCount: 456 },
      { id: 'disc-013', name: 'Philosophy', slug: 'philosophy', parentId: 'disc-parent-3', articleCount: 321 },
      { id: 'disc-014', name: 'Literature', slug: 'literature', parentId: 'disc-parent-3', articleCount: 287 },
      { id: 'disc-015', name: 'Languages', slug: 'languages', parentId: 'disc-parent-3', articleCount: 234 },
      { id: 'disc-016', name: 'Arts', slug: 'arts', parentId: 'disc-parent-3', articleCount: 198 },
    ],
  },
  {
    id: 'disc-parent-4',
    name: 'Social Sciences',
    slug: 'social-sciences',
    articleCount: 2134,
    children: [
      { id: 'disc-005', name: 'Economics', slug: 'economics', parentId: 'disc-parent-4', articleCount: 789 },
      { id: 'disc-006', name: 'Psychology', slug: 'psychology', parentId: 'disc-parent-4', articleCount: 654 },
      { id: 'disc-017', name: 'Sociology', slug: 'sociology', parentId: 'disc-parent-4', articleCount: 423 },
      { id: 'disc-018', name: 'Political Science', slug: 'political-science', parentId: 'disc-parent-4', articleCount: 268 },
    ],
  },
  {
    id: 'disc-parent-5',
    name: 'Medicine & Health',
    slug: 'medicine-health',
    articleCount: 2987,
    children: [
      { id: 'disc-019', name: 'Medicine', slug: 'medicine', parentId: 'disc-parent-5', articleCount: 1234 },
      { id: 'disc-020', name: 'Public Health', slug: 'public-health', parentId: 'disc-parent-5', articleCount: 876 },
      { id: 'disc-021', name: 'Nursing', slug: 'nursing', parentId: 'disc-parent-5', articleCount: 543 },
      { id: 'disc-022', name: 'Pharmacy', slug: 'pharmacy', parentId: 'disc-parent-5', articleCount: 334 },
    ],
  },
];

// -----------------------------------------------------------------------------
// PLATFORM STATISTICS
// -----------------------------------------------------------------------------

export const mockPlatformStats: PlatformStats = {
  totalUniversities: 247,
  totalArticles: 12847,
  totalAuthors: 8934,
  totalDisciplines: 34,
  articlesThisMonth: 487,
  articlesThisYear: 2341,
};

// -----------------------------------------------------------------------------
// CHART DATA
// -----------------------------------------------------------------------------

export const mockBarChartData: ChartDataPoint[] = mockUniversities
  .slice(0, 10)
  .map((uni) => ({
    name: uni.abbreviation || uni.name.split(' ')[0],
    value: uni.totalArticles,
    fill: '#1E3A5F',
  }));

export const mockTrendData: TrendDataPoint[] = [
  { month: 'Jan', articles: 890 },
  { month: 'Feb', articles: 945 },
  { month: 'Mar', articles: 1023 },
  { month: 'Apr', articles: 1098 },
  { month: 'May', articles: 987 },
  { month: 'Jun', articles: 1156 },
  { month: 'Jul', articles: 1234 },
  { month: 'Aug', articles: 1123 },
  { month: 'Sep', articles: 1198 },
  { month: 'Oct', articles: 1287 },
  { month: 'Nov', articles: 1345 },
  { month: 'Dec', articles: 1456 },
];

// -----------------------------------------------------------------------------
// UNIVERSITY PROFILE DATA
// -----------------------------------------------------------------------------

export const generateUniversityProfile = (slug: string): UniversityProfile | null => {
  const university = mockUniversities.find((u) => u.slug === slug);
  if (!university) return null;

  const rankingHistory: RankingHistoryPoint[] = [
    { date: '2025-02', rank: 5, articleCount: 1890 },
    { date: '2025-03', rank: 4, articleCount: 1945 },
    { date: '2025-04', rank: 4, articleCount: 2012 },
    { date: '2025-05', rank: 3, articleCount: 2078 },
    { date: '2025-06', rank: 3, articleCount: 2134 },
    { date: '2025-07', rank: 3, articleCount: 2198 },
    { date: '2025-08', rank: 2, articleCount: 2245 },
    { date: '2025-09', rank: 2, articleCount: 2289 },
    { date: '2025-10', rank: 3, articleCount: 2312 },
    { date: '2025-11', rank: 2, articleCount: 2334 },
    { date: '2025-12', rank: 3, articleCount: 2341 },
    { date: '2026-01', rank: university.currentRank, articleCount: university.totalArticles },
  ];

  const disciplineBreakdown: DisciplineCount[] = [
    { discipline: 'Computer Science', count: 983, percentage: 42 },
    { discipline: 'Engineering', count: 655, percentage: 28 },
    { discipline: 'Physics', count: 374, percentage: 16 },
    { discipline: 'Mathematics', count: 234, percentage: 10 },
    { discipline: 'Other', count: 95, percentage: 4 },
  ];

  return {
    ...university,
    fullDescription: `${university.description} The institution has a long-standing commitment to research excellence and has produced numerous Nobel laureates and Fields Medal winners. With state-of-the-art facilities and a diverse international community, it continues to push the boundaries of knowledge across multiple disciplines.`,
    rankingHistory,
    topAuthors: mockAuthors.filter((a) => a.universityId === university.id).slice(0, 4),
    recentArticles: mockArticles.filter((a) => a.universityId === university.id).slice(0, 5),
    disciplineBreakdown,
  };
};

// -----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};

export const getMovementColor = (movement: string): string => {
  switch (movement) {
    case 'up':
      return '#2D5A47';
    case 'down':
      return '#7C2D36';
    case 'new':
      return '#1E3A5F';
    default:
      return '#78716C';
  }
};

export const getArticlesByFilters = (
  filters: {
    discipline?: string;
    university?: string;
    search?: string;
    sortBy?: string;
  }
): Article[] => {
  let filtered = [...mockArticles];

  if (filters.discipline) {
    filtered = filtered.filter((a) => a.disciplineName.toLowerCase().includes(filters.discipline!.toLowerCase()));
  }

  if (filters.university) {
    filtered = filtered.filter((a) => a.universitySlug === filters.university);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        a.abstract.toLowerCase().includes(searchLower) ||
        a.keywords.some((k) => k.toLowerCase().includes(searchLower))
    );
  }

  switch (filters.sortBy) {
    case 'views':
      filtered.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'citations':
      filtered.sort((a, b) => b.citationCount - a.citationCount);
      break;
    case 'downloads':
      filtered.sort((a, b) => b.downloadCount - a.downloadCount);
      break;
    default:
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  return filtered;
};
