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
// MOCK UNIVERSITIES - ALL GHANAIAN UNIVERSITIES
// -----------------------------------------------------------------------------

export const mockUniversities: RankedUniversity[] = [
  {
    id: 'uni-gh-001',
    name: 'University of Ghana',
    slug: 'university-of-ghana',
    abbreviation: 'UG',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png',
    country: 'Ghana',
    city: 'Legon, Accra',
    foundedYear: 1948,
    website: 'https://ug.edu.gh',
    description: 'The oldest and largest university in Ghana, known for excellence in research and education across multiple disciplines.',
    currentRank: 1,
    previousRank: 1,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-002',
    name: 'Kwame Nkrumah University of Science and Technology',
    slug: 'knust',
    abbreviation: 'KNUST',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png',
    country: 'Ghana',
    city: 'Kumasi',
    foundedYear: 1952,
    website: 'https://knust.edu.gh',
    description: 'A leading science and technology university in Africa, specializing in engineering, applied sciences, and technology.',
    currentRank: 2,
    previousRank: 2,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-003',
    name: 'University of Cape Coast',
    slug: 'ucc',
    abbreviation: 'UCC',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png',
    country: 'Ghana',
    city: 'Cape Coast',
    foundedYear: 1962,
    website: 'https://ucc.edu.gh',
    description: 'A leading university in education and humanities research, known for producing quality teachers and researchers.',
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
    id: 'uni-gh-004',
    name: 'University of Education, Winneba',
    slug: 'uew',
    abbreviation: 'UEW',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png',
    country: 'Ghana',
    city: 'Winneba',
    foundedYear: 1992,
    website: 'https://uew.edu.gh',
    description: 'Specializes in teacher education and training, producing qualified educators for Ghana and beyond.',
    currentRank: 4,
    previousRank: 4,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-005',
    name: 'University of Mines and Technology',
    slug: 'umat',
    abbreviation: 'UMaT',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1759428982/WhatsApp_Image_2025-10-02_at_15.46.11_f720a723_lzrtfp.jpg',
    country: 'Ghana',
    city: 'Tarkwa',
    foundedYear: 2004,
    website: 'https://umat.edu.gh',
    description: 'Specializes in mining, petroleum, and engineering education, producing skilled professionals for the extractive industries.',
    currentRank: 5,
    previousRank: 5,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-006',
    name: 'University for Development Studies',
    slug: 'uds',
    abbreviation: 'UDS',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379766/0a0d9027-8f25-4d2f-a291-8fae7914dec3.png',
    country: 'Ghana',
    city: 'Tamale',
    foundedYear: 1992,
    website: 'https://uds.edu.gh',
    description: 'Focuses on development-oriented education and research, addressing challenges in northern Ghana and beyond.',
    currentRank: 6,
    previousRank: 6,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-007',
    name: 'Ghana Institute of Management and Public Administration',
    slug: 'gimpa',
    abbreviation: 'GIMPA',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png',
    country: 'Ghana',
    city: 'Accra',
    foundedYear: 1961,
    website: 'https://gimpa.edu.gh',
    description: 'Specializes in management, public administration, and governance education for public and private sectors.',
    currentRank: 7,
    previousRank: 7,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-008',
    name: 'University of Energy and Natural Resources',
    slug: 'uenr',
    abbreviation: 'UENR',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1758510525/download_uxkc4q.jpg',
    country: 'Ghana',
    city: 'Sunyani',
    foundedYear: 2011,
    website: 'https://uenr.edu.gh',
    description: 'Focuses on energy, natural resources, and environmental studies, addressing sustainability challenges.',
    currentRank: 8,
    previousRank: 8,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-009',
    name: 'Ashesi University',
    slug: 'ashesi',
    abbreviation: 'Ashesi',
    country: 'Ghana',
    city: 'Berekuso',
    foundedYear: 2002,
    website: 'https://ashesi.edu.gh',
    description: 'A private liberal arts university known for ethical leadership, innovation, and entrepreneurship education.',
    currentRank: 9,
    previousRank: 9,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-010',
    name: 'University of Professional Studies',
    slug: 'upsa',
    abbreviation: 'UPSA',
    country: 'Ghana',
    city: 'Accra',
    foundedYear: 1965,
    website: 'https://upsa.edu.gh',
    description: 'Focuses on professional studies including accounting, finance, marketing, and management.',
    currentRank: 10,
    previousRank: 10,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-011',
    name: 'Catholic University of Ghana',
    slug: 'cug',
    abbreviation: 'CUG',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756722559/catholic-university-ghana-logo_onhrgj.jpg',
    country: 'Ghana',
    city: 'Fiapre, Sunyani',
    foundedYear: 2003,
    website: 'https://cug.edu.gh',
    description: 'A private Catholic university offering programs grounded in Catholic values and academic excellence.',
    currentRank: 11,
    previousRank: 11,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-012',
    name: 'Pentecost University College',
    slug: 'puc',
    abbreviation: 'PUC',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1756722725/OIP_czwzp0.webp',
    country: 'Ghana',
    city: 'Sowutuom, Accra',
    foundedYear: 2003,
    website: 'https://pentvars.edu.gh',
    description: 'A private Christian university focusing on business, technology, and theology education.',
    currentRank: 12,
    previousRank: 12,
    movement: 'stable',
    movementDelta: 0,
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
    id: 'uni-gh-013',
    name: 'Accra Institute of Technology',
    slug: 'ait',
    abbreviation: 'AIT',
    logo: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1759428988/WhatsApp_Image_2025-10-02_at_15.47.06_33dd4bda_pj0a6t.jpg',
    country: 'Ghana',
    city: 'Accra',
    foundedYear: 2009,
    website: 'https://ait.edu.gh',
    description: 'A private university focusing on technology, engineering, and business education with practical industry relevance.',
    currentRank: 13,
    previousRank: 13,
    movement: 'stable',
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
    id: 'uni-gh-014',
    name: 'Central University',
    slug: 'central-university',
    abbreviation: 'CU',
    country: 'Ghana',
    city: 'Miotso',
    foundedYear: 1988,
    website: 'https://central.edu.gh',
    description: 'A private Christian university offering programs with a focus on Christian values and academic excellence.',
    currentRank: 14,
    previousRank: 14,
    movement: 'stable',
    movementDelta: 0,
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
  {
    id: 'uni-gh-015',
    name: 'Regent University College of Science and Technology',
    slug: 'regent',
    abbreviation: 'Regent',
    country: 'Ghana',
    city: 'Accra',
    foundedYear: 2003,
    website: 'https://regent.edu.gh',
    description: 'A private university focusing on science, technology, and innovation education with practical industry training.',
    currentRank: 15,
    previousRank: 15,
    movement: 'stable',
    movementDelta: 0,
    totalArticles: 1123,
    articlesThisMonth: 22,
    articlesThisYear: 125,
    totalCitations: 38976,
    totalViews: 456789,
    totalDownloads: 76543,
    hIndex: 145,
    monthlyArticleCounts: [58, 71, 82, 91, 78, 114, 129, 108, 121, 141, 152, 125],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
];

// -----------------------------------------------------------------------------
// MOCK DISCIPLINES
// -----------------------------------------------------------------------------

export const mockDisciplines: Discipline[] = [
  {
    id: 'disc-natural',
    name: 'Natural Sciences',
    slug: 'natural-sciences',
    articleCount: 5234,
    children: [
      { id: 'disc-physics', name: 'Physics', slug: 'physics', articleCount: 1234, parentId: 'disc-natural' },
      { id: 'disc-chemistry', name: 'Chemistry', slug: 'chemistry', articleCount: 1456, parentId: 'disc-natural' },
      { id: 'disc-biology', name: 'Biology', slug: 'biology', articleCount: 1789, parentId: 'disc-natural' },
      { id: 'disc-mathematics', name: 'Mathematics', slug: 'mathematics', articleCount: 755, parentId: 'disc-natural' },
    ],
  },
  {
    id: 'disc-engineering',
    name: 'Engineering',
    slug: 'engineering',
    articleCount: 4567,
    children: [
      { id: 'disc-computer-science', name: 'Computer Science', slug: 'computer-science', articleCount: 1890, parentId: 'disc-engineering' },
      { id: 'disc-electrical', name: 'Electrical Engineering', slug: 'electrical-engineering', articleCount: 1234, parentId: 'disc-engineering' },
      { id: 'disc-mechanical', name: 'Mechanical Engineering', slug: 'mechanical-engineering', articleCount: 987, parentId: 'disc-engineering' },
      { id: 'disc-civil', name: 'Civil Engineering', slug: 'civil-engineering', articleCount: 456, parentId: 'disc-engineering' },
    ],
  },
  {
    id: 'disc-medicine',
    name: 'Medicine & Health',
    slug: 'medicine-health',
    articleCount: 3456,
    children: [
      { id: 'disc-medicine', name: 'Medicine', slug: 'medicine', articleCount: 1567, parentId: 'disc-medicine' },
      { id: 'disc-public-health', name: 'Public Health', slug: 'public-health', articleCount: 1234, parentId: 'disc-medicine' },
      { id: 'disc-pharmacy', name: 'Pharmacy', slug: 'pharmacy', articleCount: 655, parentId: 'disc-medicine' },
    ],
  },
  {
    id: 'disc-social',
    name: 'Social Sciences',
    slug: 'social-sciences',
    articleCount: 2890,
    children: [
      { id: 'disc-economics', name: 'Economics', slug: 'economics', articleCount: 1234, parentId: 'disc-social' },
      { id: 'disc-psychology', name: 'Psychology', slug: 'psychology', articleCount: 856, parentId: 'disc-social' },
      { id: 'disc-sociology', name: 'Sociology', slug: 'sociology', articleCount: 800, parentId: 'disc-social' },
    ],
  },
  {
    id: 'disc-humanities',
    name: 'Humanities',
    slug: 'humanities',
    articleCount: 1876,
    children: [
      { id: 'disc-education', name: 'Education', slug: 'education', articleCount: 987, parentId: 'disc-humanities' },
      { id: 'disc-literature', name: 'Literature', slug: 'literature', articleCount: 456, parentId: 'disc-humanities' },
      { id: 'disc-history', name: 'History', slug: 'history', articleCount: 433, parentId: 'disc-humanities' },
    ],
  },
  {
    id: 'disc-business',
    name: 'Business & Management',
    slug: 'business-management',
    articleCount: 1654,
    children: [
      { id: 'disc-business', name: 'Business Administration', slug: 'business-administration', articleCount: 890, parentId: 'disc-business' },
      { id: 'disc-management', name: 'Management', slug: 'management', articleCount: 764, parentId: 'disc-business' },
    ],
  },
];

// Helper function to get all discipline names (flattened from children)
export const getAllDisciplineNames = (): string[] => {
  const names: string[] = [];
  mockDisciplines.forEach((parent) => {
    if (parent.children) {
      parent.children.forEach((child) => {
        names.push(child.name);
      });
    }
  });
  return names.sort();
};

// -----------------------------------------------------------------------------
// MOCK AUTHORS
// -----------------------------------------------------------------------------

export const mockAuthors: Author[] = [
  {
    id: 'auth-001',
    name: 'Dr. Sarah Chen',
    title: 'Associate Professor',
    universityId: 'uni-gh-001',
    universityName: 'University of Ghana',
    department: 'Department of Physics',
    email: 's.chen@ug.edu.gh',
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
    universityId: 'uni-gh-001',
    universityName: 'University of Ghana',
    department: 'Department of Computer Science',
    email: 'j.liu@ug.edu.gh',
    orcidId: '0000-0002-3456-7890',
    bio: 'Expert in machine learning and artificial intelligence.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    totalArticles: 89,
    totalCitations: 2345,
    hIndex: 24,
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
    title: 'Quantum Computing Applications in Climate Modeling',
    slug: 'quantum-computing-climate-modeling',
    abstract: 'This paper explores novel applications of quantum computing algorithms to improve climate prediction models.',
    doi: '10.1234/example.2026.01.001',
    universityId: 'uni-gh-001',
    universityName: 'University of Ghana',
    universitySlug: 'university-of-ghana',
    disciplineId: 'disc-001',
    disciplineName: 'Physics',
    authors: [
      { id: 'auth-001', name: 'Dr. Sarah Chen', title: 'Associate Professor', affiliationNumber: 1, isCorresponding: true, email: 's.chen@ug.edu.gh' },
      { id: 'auth-002', name: 'Prof. James Liu', title: 'Professor', affiliationNumber: 1, isCorresponding: false },
    ],
    articleType: 'research',
    keywords: ['quantum computing', 'climate modeling', 'quantum algorithms'],
    publishedAt: '2026-01-14T09:00:00Z',
    status: 'published',
    viewCount: 234,
    downloadCount: 89,
    citationCount: 12,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// PLATFORM STATISTICS
// -----------------------------------------------------------------------------

export const mockPlatformStats: PlatformStats = {
  totalUniversities: 15,
  totalArticles: 23456,
  articlesThisMonth: 456,
  totalAuthors: 1234,
  totalDisciplines: 34,
  articlesThisYear: 2341,
};

// -----------------------------------------------------------------------------
// CHART DATA
// -----------------------------------------------------------------------------

export const mockBarChartData: ChartDataPoint[] = [
  { name: 'UG', value: 2341 },
  { name: 'KNUST', value: 2287 },
  { name: 'UCC', value: 2156 },
  { name: 'UEW', value: 2089 },
  { name: 'UMaT', value: 1934 },
  { name: 'UDS', value: 1876 },
  { name: 'GIMPA', value: 1798 },
  { name: 'UENR', value: 1654 },
  { name: 'Ashesi', value: 1587 },
  { name: 'UPSA', value: 1521 },
];

export const mockTrendData: TrendDataPoint[] = [
  { month: 'Jan', articles: 345 },
  { month: 'Feb', articles: 378 },
  { month: 'Mar', articles: 412 },
  { month: 'Apr', articles: 445 },
  { month: 'May', articles: 398 },
  { month: 'Jun', articles: 467 },
  { month: 'Jul', articles: 489 },
  { month: 'Aug', articles: 456 },
  { month: 'Sep', articles: 478 },
  { month: 'Oct', articles: 512 },
  { month: 'Nov', articles: 534 },
  { month: 'Dec', articles: 556 },
];

// -----------------------------------------------------------------------------
// UNIVERSITY PROFILE DATA
// -----------------------------------------------------------------------------

export const generateUniversityProfile = (slug: string): UniversityProfile | null => {
  const university = mockUniversities.find((u) => u.slug === slug);
  if (!university) return null;

  const rankingHistory: RankingHistoryPoint[] = [
    { date: '2025-02', rank: university.currentRank, articleCount: university.totalArticles - 200 },
    { date: '2025-03', rank: university.currentRank, articleCount: university.totalArticles - 150 },
    { date: '2025-04', rank: university.currentRank, articleCount: university.totalArticles - 100 },
    { date: '2025-05', rank: university.currentRank, articleCount: university.totalArticles - 50 },
    { date: '2025-06', rank: university.currentRank, articleCount: university.totalArticles - 25 },
    { date: '2026-01', rank: university.currentRank, articleCount: university.totalArticles },
  ];

  const disciplineBreakdown: DisciplineCount[] = [
    { discipline: 'Science', count: Math.floor(university.totalArticles * 0.35), percentage: 35 },
    { discipline: 'Engineering', count: Math.floor(university.totalArticles * 0.25), percentage: 25 },
    { discipline: 'Medicine', count: Math.floor(university.totalArticles * 0.20), percentage: 20 },
    { discipline: 'Humanities', count: Math.floor(university.totalArticles * 0.15), percentage: 15 },
    { discipline: 'Other', count: Math.floor(university.totalArticles * 0.05), percentage: 5 },
  ];

  return {
    ...university,
    fullDescription: `${university.description} The institution continues to contribute significantly to research and knowledge production in Ghana and beyond.`,
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
  return num.toString();
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
