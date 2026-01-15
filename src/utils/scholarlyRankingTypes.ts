// ============================================================================
// SCHOLARLY RANKING PLATFORM - TYPE DEFINITIONS
// ============================================================================
// Core types for the university ranking and scholarly publishing platform
// ============================================================================

// -----------------------------------------------------------------------------
// UNIVERSITY TYPES
// -----------------------------------------------------------------------------

export interface RankedUniversity {
  id: string;
  name: string;
  slug: string;
  abbreviation?: string;
  logo?: string;
  country: string;
  city: string;
  foundedYear?: number;
  website?: string;
  description?: string;

  // Ranking metrics
  currentRank: number;
  previousRank: number | null;
  movement: 'up' | 'down' | 'stable' | 'new';
  movementDelta: number;

  // Article statistics
  totalArticles: number;
  articlesThisMonth: number;
  articlesThisYear: number;

  // Optional secondary metrics (future-ready)
  totalCitations?: number;
  totalViews?: number;
  totalDownloads?: number;
  hIndex?: number;

  // Trend data (last 12 months)
  monthlyArticleCounts?: number[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UniversityProfile extends RankedUniversity {
  fullDescription: string;
  rankingHistory: RankingHistoryPoint[];
  topAuthors: Author[];
  recentArticles: Article[];
  disciplineBreakdown: DisciplineCount[];
}

export interface RankingHistoryPoint {
  date: string;
  rank: number;
  articleCount: number;
}

export interface DisciplineCount {
  discipline: string;
  count: number;
  percentage: number;
}

// -----------------------------------------------------------------------------
// ARTICLE TYPES
// -----------------------------------------------------------------------------

export interface Article {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content?: string;
  doi?: string;

  // Relationships
  universityId: string;
  universityName: string;
  universitySlug: string;
  disciplineId: string;
  disciplineName: string;
  authors: ArticleAuthor[];

  // Metadata
  articleType: 'research' | 'review' | 'case-study' | 'commentary' | 'letter';
  keywords: string[];
  publishedAt: string;
  submittedAt?: string;
  status: 'draft' | 'under-review' | 'published' | 'retracted';

  // Metrics
  viewCount: number;
  downloadCount: number;
  citationCount: number;

  // References
  references?: Reference[];
  citedBy?: CitedByArticle[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  title?: string;
  affiliationNumber: number;
  isCorresponding: boolean;
  email?: string;
  orcidId?: string;
}

export interface Reference {
  id: string;
  citation: string;
  doi?: string;
  url?: string;
}

export interface CitedByArticle {
  id: string;
  title: string;
  authors: string;
  university: string;
  year: number;
}

// -----------------------------------------------------------------------------
// AUTHOR TYPES
// -----------------------------------------------------------------------------

export interface Author {
  id: string;
  name: string;
  title: string;
  universityId: string;
  universityName: string;
  department?: string;
  email?: string;
  orcidId?: string;
  bio?: string;
  profileImage?: string;

  // Statistics
  totalArticles: number;
  totalCitations: number;
  hIndex?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// DISCIPLINE TYPES
// -----------------------------------------------------------------------------

export interface Discipline {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  articleCount: number;
  children?: Discipline[];
}

// -----------------------------------------------------------------------------
// RANKING TYPES
// -----------------------------------------------------------------------------

export interface RankingSnapshot {
  id: string;
  universityId: string;
  rankPosition: number;
  previousRank: number | null;
  movement: 'up' | 'down' | 'stable' | 'new';
  articleCount: number;
  score: number;
  snapshotDate: string;
}

export interface RankingFilters {
  country?: string;
  discipline?: string;
  period?: 'weekly' | 'monthly' | 'yearly' | 'all-time';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ArticleFilters {
  discipline?: string;
  university?: string;
  author?: string;
  year?: number;
  articleType?: string;
  search?: string;
  sortBy?: 'recent' | 'views' | 'citations' | 'downloads';
  page?: number;
  limit?: number;
}

// -----------------------------------------------------------------------------
// STATISTICS TYPES
// -----------------------------------------------------------------------------

export interface PlatformStats {
  totalUniversities: number;
  totalArticles: number;
  totalAuthors: number;
  totalDisciplines: number;
  articlesThisMonth: number;
  articlesThisYear: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TrendDataPoint {
  month: string;
  articles: number;
}

// -----------------------------------------------------------------------------
// API RESPONSE TYPES
// -----------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RankingsResponse extends PaginatedResponse<RankedUniversity> {
  lastUpdated: string;
}

export interface ArticlesResponse extends PaginatedResponse<Article> {}

// -----------------------------------------------------------------------------
// UI COMPONENT PROP TYPES
// -----------------------------------------------------------------------------

export interface MovementIndicatorProps {
  movement: 'up' | 'down' | 'stable' | 'new';
  delta?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export interface RankingCardProps {
  university: RankedUniversity;
  showTrend?: boolean;
}

export interface ArticleCardProps {
  article: Article;
  variant?: 'compact' | 'detailed';
}
