import { supabase } from "@/integrations/supabase/client";

/**
 * Scholarship interface matching the database structure
 */
export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  currency: string;
  category: string;
  deadline: string;
  location: string;
  level: string;
  description: string;
  requirements: string[];
  verified: boolean;
  imageUrl?: string;
  featured: boolean;
  source?: string;
  website?: string;
  email?: string;
  phone?: string;
  fullDescription?: string;
  benefits?: string[];
  eligibility?: string[];
  applicationProcess?: string[];
  documents?: string[];
  selectionCriteria?: string[];
  coverageDetails?: string[];
  duration?: string;
  renewability?: string;
  fieldOfStudy?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  route?: string;
}

/**
 * Transform Supabase data (snake_case) to app format (camelCase)
 */
export const transformScholarshipFromSupabase = (item: any): Scholarship => {
  return {
    id: item.id,
    title: item.title,
    provider: item.provider,
    amount: item.amount,
    currency: item.currency,
    category: item.category,
    deadline: item.deadline,
    location: item.location,
    level: item.level,
    description: item.description,
    requirements: Array.isArray(item.requirements) ? item.requirements : [],
    verified: item.verified || false,
    imageUrl: item.image_url || undefined,
    featured: item.featured || false,
    source: item.source,
    website: item.website || undefined,
    email: item.email || undefined,
    phone: item.phone || undefined,
    fullDescription: item.full_description || undefined,
    benefits: Array.isArray(item.benefits) ? item.benefits : [],
    eligibility: Array.isArray(item.eligibility) ? item.eligibility : [],
    applicationProcess: Array.isArray(item.application_process) ? item.application_process : [],
    documents: Array.isArray(item.documents) ? item.documents : [],
    selectionCriteria: Array.isArray(item.selection_criteria) ? item.selection_criteria : [],
    coverageDetails: Array.isArray(item.coverage_details) ? item.coverage_details : [],
    duration: item.duration || undefined,
    renewability: item.renewability || undefined,
    fieldOfStudy: Array.isArray(item.field_of_study) ? item.field_of_study : [],
    faqs: Array.isArray(item.faqs) ? item.faqs : [],
  };
};

/**
 * Fetch all scholarships from Supabase
 */
export const fetchAllScholarships = async (): Promise<Scholarship[]> => {
  try {
    const { data, error } = await supabase
      .from('scholarships' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) return [];

    return data.map(transformScholarshipFromSupabase);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

/**
 * Fetch scholarships by source
 */
export const fetchScholarshipsBySource = async (source: string): Promise<Scholarship[]> => {
  try {
    const { data, error } = await supabase
      .from('scholarships' as any)
      .select('*')
      .eq('source', source)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) return [];

    return data.map(transformScholarshipFromSupabase);
  } catch (error) {
    console.error("Error fetching scholarships by source:", error);
    throw error;
  }
};

/**
 * Fetch a single scholarship by ID
 */
export const fetchScholarshipById = async (id: string): Promise<Scholarship | null> => {
  try {
    const { data, error } = await supabase
      .from('scholarships' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return null;
    }

    if (!data) return null;

    return transformScholarshipFromSupabase(data);
  } catch (error) {
    console.error("Error fetching scholarship by ID:", error);
    return null;
  }
};

/**
 * Fetch scholarships by field of study
 */
export const fetchScholarshipsByField = async (field: string): Promise<Scholarship[]> => {
  try {
    const { data, error } = await supabase
      .from('scholarships' as any)
      .select('*')
      .contains('field_of_study', [field])
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) return [];

    return data.map(transformScholarshipFromSupabase);
  } catch (error) {
    console.error("Error fetching scholarships by field:", error);
    throw error;
  }
};

/**
 * Calculate days until deadline
 */
export const getDaysUntilDeadline = (dateString: string): number => {
  const today = new Date();
  const deadline = new Date(dateString);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

