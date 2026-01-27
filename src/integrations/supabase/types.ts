export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_section: {
        Row: {
          badge_text: string | null
          created_at: string
          description: string | null
          id: string
          mission_content: string | null
          story_content: string | null
          title: string | null
          updated_at: string
          video_url: string | null
          vision_content: string | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mission_content?: string | null
          story_content?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
          vision_content?: string | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mission_content?: string | null
          story_content?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
          vision_content?: string | null
        }
        Relationships: []
      }
      article_authors: {
        Row: {
          affiliation: string | null
          article_id: string
          author_order: number
          created_at: string
          email: string | null
          id: string
          is_corresponding: boolean | null
          name: string
          profile_id: string | null
        }
        Insert: {
          affiliation?: string | null
          article_id: string
          author_order?: number
          created_at?: string
          email?: string | null
          id?: string
          is_corresponding?: boolean | null
          name: string
          profile_id?: string | null
        }
        Update: {
          affiliation?: string | null
          article_id?: string
          author_order?: number
          created_at?: string
          email?: string | null
          id?: string
          is_corresponding?: boolean | null
          name?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_references: {
        Row: {
          article_id: string
          created_at: string
          id: string
          reference_order: number
          reference_text: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          reference_order?: number
          reference_text: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          reference_order?: number
          reference_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_references_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          abstract: string
          article_type: string
          citations: number | null
          created_at: string
          discipline: string | null
          discipline_category: string | null
          downloads: number | null
          id: string
          identifier_type: string | null
          identifier_url: string | null
          identifier_value: string | null
          institution_id: string
          is_current_version: boolean | null
          keywords: string[] | null
          parent_article_id: string | null
          pdf_url: string | null
          published_at: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_notes: string | null
          status: string
          submitted_at: string
          submitted_by: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          version: number | null
          views: number | null
        }
        Insert: {
          abstract: string
          article_type: string
          citations?: number | null
          created_at?: string
          discipline?: string | null
          discipline_category?: string | null
          downloads?: number | null
          id?: string
          identifier_type?: string | null
          identifier_url?: string | null
          identifier_value?: string | null
          institution_id: string
          is_current_version?: boolean | null
          keywords?: string[] | null
          parent_article_id?: string | null
          pdf_url?: string | null
          published_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_notes?: string | null
          status?: string
          submitted_at?: string
          submitted_by: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          version?: number | null
          views?: number | null
        }
        Update: {
          abstract?: string
          article_type?: string
          citations?: number | null
          created_at?: string
          discipline?: string | null
          discipline_category?: string | null
          downloads?: number | null
          id?: string
          identifier_type?: string | null
          identifier_url?: string | null
          identifier_value?: string | null
          institution_id?: string
          is_current_version?: boolean | null
          keywords?: string[] | null
          parent_article_id?: string | null
          pdf_url?: string | null
          published_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_notes?: string | null
          status?: string
          submitted_at?: string
          submitted_by?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          version?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_parent_article_id_fkey"
            columns: ["parent_article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      carousel_settings: {
        Row: {
          badge_text: string | null
          button_link: string | null
          button_text: string | null
          created_at: string
          display_type: string
          id: string
          subtitle: string | null
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          badge_text?: string | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          display_type?: string
          id?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          badge_text?: string | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          display_type?: string
          id?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      carousel_slides: {
        Row: {
          badge_text: string | null
          button_link: string | null
          button_text: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          layout_type: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          layout_type?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          layout_type?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          employees: string | null
          featured: boolean | null
          founded: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          employees?: string | null
          featured?: boolean | null
          founded?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          employees?: string | null
          featured?: boolean | null
          founded?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      education_hub_images: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          step_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          step_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          step_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      employers: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          profile_image: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      graduate_programs: {
        Row: {
          application_url: string | null
          behavioral_attributes: Json | null
          benefits: Json | null
          company: string
          created_at: string | null
          culture_paragraphs: Json | null
          description: string | null
          description_paragraphs: Json | null
          duration: string | null
          field_ops_groups: Json | null
          id: string
          image_url: string | null
          impact_highlights: Json | null
          impact_paragraphs: Json | null
          is_draft: boolean | null
          location: string | null
          opportunity_paragraphs: Json | null
          posted: string | null
          requirements: Json | null
          salary: string | null
          skills: Json | null
          skills_additional_knowledge: Json | null
          skills_experience: Json | null
          skills_formal_qualifications: Json | null
          skills_technical: Json | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          benefits?: Json | null
          company: string
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          is_draft?: boolean | null
          location?: string | null
          opportunity_paragraphs?: Json | null
          posted?: string | null
          requirements?: Json | null
          salary?: string | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          benefits?: Json | null
          company?: string
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          is_draft?: boolean | null
          location?: string | null
          opportunity_paragraphs?: Json | null
          posted?: string | null
          requirements?: Json | null
          salary?: string | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          abbreviation: string | null
          articles_this_month: number | null
          city: string | null
          country: string | null
          created_at: string
          current_rank: number | null
          description: string | null
          founded_year: number | null
          id: string
          logo: string | null
          movement: string | null
          name: string
          previous_rank: number | null
          region: string | null
          status: string | null
          total_articles: number | null
          type: string | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          abbreviation?: string | null
          articles_this_month?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_rank?: number | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo?: string | null
          movement?: string | null
          name: string
          previous_rank?: number | null
          region?: string | null
          status?: string | null
          total_articles?: number | null
          type?: string | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          abbreviation?: string | null
          articles_this_month?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_rank?: number | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo?: string | null
          movement?: string | null
          name?: string
          previous_rank?: number | null
          region?: string | null
          status?: string | null
          total_articles?: number | null
          type?: string | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      internships: {
        Row: {
          application_url: string | null
          behavioral_attributes: Json | null
          company: string
          company_logo: string | null
          created_at: string | null
          culture_paragraphs: Json | null
          description: string | null
          description_paragraphs: Json | null
          duration: string | null
          field_ops_groups: Json | null
          id: string
          image_url: string | null
          impact_highlights: Json | null
          impact_paragraphs: Json | null
          is_draft: boolean | null
          location: string | null
          opportunity_paragraphs: Json | null
          posted: string | null
          requirements: Json | null
          skills: Json | null
          skills_additional_knowledge: Json | null
          skills_experience: Json | null
          skills_formal_qualifications: Json | null
          skills_technical: Json | null
          stipend: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          company: string
          company_logo?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          is_draft?: boolean | null
          location?: string | null
          opportunity_paragraphs?: Json | null
          posted?: string | null
          requirements?: Json | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          stipend?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          company?: string
          company_logo?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          is_draft?: boolean | null
          location?: string | null
          opportunity_paragraphs?: Json | null
          posted?: string | null
          requirements?: Json | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          stipend?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_url: string | null
          behavioral_attributes: Json | null
          city: string | null
          company: string
          company_id: string | null
          company_logo: string | null
          contract_type: string | null
          created_at: string | null
          culture_paragraphs: Json | null
          date: string | null
          description: string | null
          description_paragraphs: Json | null
          education_level: string | null
          experience_level: string | null
          featured: boolean | null
          field_ops_groups: Json | null
          id: string
          image_url: string | null
          impact_highlights: Json | null
          impact_paragraphs: Json | null
          industry: string | null
          is_draft: boolean | null
          job_category: string | null
          opportunity_paragraphs: Json | null
          region: string | null
          salary: string | null
          skills: Json | null
          skills_additional_knowledge: Json | null
          skills_experience: Json | null
          skills_formal_qualifications: Json | null
          skills_technical: Json | null
          title: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          city?: string | null
          company: string
          company_id?: string | null
          company_logo?: string | null
          contract_type?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          date?: string | null
          description?: string | null
          description_paragraphs?: Json | null
          education_level?: string | null
          experience_level?: string | null
          featured?: boolean | null
          field_ops_groups?: Json | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          industry?: string | null
          is_draft?: boolean | null
          job_category?: string | null
          opportunity_paragraphs?: Json | null
          region?: string | null
          salary?: string | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          title: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          city?: string | null
          company?: string
          company_id?: string | null
          company_logo?: string | null
          contract_type?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          date?: string | null
          description?: string | null
          description_paragraphs?: Json | null
          education_level?: string | null
          experience_level?: string | null
          featured?: boolean | null
          field_ops_groups?: Json | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          industry?: string | null
          is_draft?: boolean | null
          job_category?: string | null
          opportunity_paragraphs?: Json | null
          region?: string | null
          salary?: string | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          title?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lecture_notes: {
        Row: {
          created_at: string
          downloads: number | null
          field: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          image_url: string | null
          lecturer: string
          pages: number | null
          title: string
          university: string | null
          university_short: string | null
          updated_at: string
          upload_date: string | null
          verified: boolean | null
          views: number | null
        }
        Insert: {
          created_at?: string
          downloads?: number | null
          field: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          image_url?: string | null
          lecturer: string
          pages?: number | null
          title: string
          university?: string | null
          university_short?: string | null
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
        }
        Update: {
          created_at?: string
          downloads?: number | null
          field?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          image_url?: string | null
          lecturer?: string
          pages?: number | null
          title?: string
          university?: string | null
          university_short?: string | null
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
        }
        Relationships: []
      }
      local_job_gigs: {
        Row: {
          applications: number | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          description: string | null
          employer_email: string | null
          employer_name: string
          employer_phone: string
          end_date: string | null
          id: string
          location: string
          payment_amount: number | null
          payment_type: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requirements: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
          verified: boolean | null
          views: number | null
          what_to_expect: string | null
        }
        Insert: {
          applications?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          employer_email?: string | null
          employer_name: string
          employer_phone: string
          end_date?: string | null
          id?: string
          location: string
          payment_amount?: number | null
          payment_type: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requirements?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
          verified?: boolean | null
          views?: number | null
          what_to_expect?: string | null
        }
        Update: {
          applications?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          employer_email?: string | null
          employer_name?: string
          employer_phone?: string
          end_date?: string | null
          id?: string
          location?: string
          payment_amount?: number | null
          payment_type?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requirements?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          verified?: boolean | null
          views?: number | null
          what_to_expect?: string | null
        }
        Relationships: []
      }
      nss_programs: {
        Row: {
          application_url: string | null
          behavioral_attributes: Json | null
          benefits: Json | null
          color: string | null
          created_at: string | null
          culture_paragraphs: Json | null
          description: string | null
          description_paragraphs: Json | null
          duration: string | null
          field_ops_groups: Json | null
          icon: string | null
          id: string
          image_url: string | null
          impact_highlights: Json | null
          impact_paragraphs: Json | null
          is_draft: boolean | null
          locations: Json | null
          opportunity_paragraphs: Json | null
          requirements: Json | null
          skills: Json | null
          skills_additional_knowledge: Json | null
          skills_experience: Json | null
          skills_formal_qualifications: Json | null
          skills_technical: Json | null
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          benefits?: Json | null
          color?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          is_draft?: boolean | null
          locations?: Json | null
          opportunity_paragraphs?: Json | null
          requirements?: Json | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          benefits?: Json | null
          color?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          is_draft?: boolean | null
          locations?: Json | null
          opportunity_paragraphs?: Json | null
          requirements?: Json | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      past_questions: {
        Row: {
          course_code: string
          created_at: string
          downloads: number | null
          exam_type: string
          faculty: string
          file_size: number | null
          file_url: string
          id: string
          semester: string
          title: string
          university: string
          university_short: string
          updated_at: string
          upload_date: string | null
          verified: boolean | null
          views: number | null
          year: number
        }
        Insert: {
          course_code: string
          created_at?: string
          downloads?: number | null
          exam_type?: string
          faculty: string
          file_size?: number | null
          file_url: string
          id?: string
          semester: string
          title: string
          university: string
          university_short: string
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
          year: number
        }
        Update: {
          course_code?: string
          created_at?: string
          downloads?: number | null
          exam_type?: string
          faculty?: string
          file_size?: number | null
          file_url?: string
          id?: string
          semester?: string
          title?: string
          university?: string
          university_short?: string
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          full_name: string | null
          h_index: number | null
          i10_index: number | null
          id: string
          institution_id: string | null
          orcid_id: string | null
          profile_image: string | null
          research_interests: string[] | null
          role: string
          title: string | null
          total_articles: number | null
          total_citations: number | null
          total_downloads: number | null
          total_views: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          h_index?: number | null
          i10_index?: number | null
          id?: string
          institution_id?: string | null
          orcid_id?: string | null
          profile_image?: string | null
          research_interests?: string[] | null
          role: string
          title?: string | null
          total_articles?: number | null
          total_citations?: number | null
          total_downloads?: number | null
          total_views?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          h_index?: number | null
          i10_index?: number | null
          id?: string
          institution_id?: string | null
          orcid_id?: string | null
          profile_image?: string | null
          research_interests?: string[] | null
          role?: string
          title?: string | null
          total_articles?: number | null
          total_citations?: number | null
          total_downloads?: number | null
          total_views?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          amount: string
          application_process: Json | null
          benefits: Json | null
          category: string
          coverage_details: Json | null
          created_at: string | null
          currency: string
          deadline: string
          description: string
          documents: Json | null
          duration: string | null
          eligibility: Json | null
          email: string | null
          faqs: Json | null
          featured: boolean | null
          field_of_study: Json | null
          full_description: string | null
          id: string
          image_url: string | null
          level: string
          location: string
          phone: string | null
          provider: string
          renewability: string | null
          requirements: Json | null
          selection_criteria: Json | null
          source: string | null
          title: string
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          amount: string
          application_process?: Json | null
          benefits?: Json | null
          category: string
          coverage_details?: Json | null
          created_at?: string | null
          currency?: string
          deadline: string
          description: string
          documents?: Json | null
          duration?: string | null
          eligibility?: Json | null
          email?: string | null
          faqs?: Json | null
          featured?: boolean | null
          field_of_study?: Json | null
          full_description?: string | null
          id: string
          image_url?: string | null
          level: string
          location: string
          phone?: string | null
          provider: string
          renewability?: string | null
          requirements?: Json | null
          selection_criteria?: Json | null
          source?: string | null
          title: string
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          amount?: string
          application_process?: Json | null
          benefits?: Json | null
          category?: string
          coverage_details?: Json | null
          created_at?: string | null
          currency?: string
          deadline?: string
          description?: string
          documents?: Json | null
          duration?: string | null
          eligibility?: Json | null
          email?: string | null
          faqs?: Json | null
          featured?: boolean | null
          field_of_study?: Json | null
          full_description?: string | null
          id?: string
          image_url?: string | null
          level?: string
          location?: string
          phone?: string | null
          provider?: string
          renewability?: string | null
          requirements?: Json | null
          selection_criteria?: Json | null
          source?: string | null
          title?: string
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      service_tabs: {
        Row: {
          content_title: string | null
          created_at: string
          description: string | null
          icon: string
          id: string
          image_url: string | null
          list_item_1: string | null
          list_item_2: string | null
          list_item_3: string | null
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          content_title?: string | null
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          image_url?: string | null
          list_item_1?: string | null
          list_item_2?: string | null
          list_item_3?: string | null
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_title?: string | null
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          list_item_1?: string | null
          list_item_2?: string | null
          list_item_3?: string | null
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shs_bece_questions: {
        Row: {
          created_at: string
          downloads: number | null
          exam_type: string
          file_size: number | null
          file_url: string
          id: string
          subject: string
          subject_code: string
          title: string
          updated_at: string
          upload_date: string | null
          verified: boolean | null
          views: number | null
          year: number
        }
        Insert: {
          created_at?: string
          downloads?: number | null
          exam_type: string
          file_size?: number | null
          file_url: string
          id?: string
          subject: string
          subject_code: string
          title: string
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
          year: number
        }
        Update: {
          created_at?: string
          downloads?: number | null
          exam_type?: string
          file_size?: number | null
          file_url?: string
          id?: string
          subject?: string
          subject_code?: string
          title?: string
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
          year?: number
        }
        Relationships: []
      }
      skilled_workers: {
        Row: {
          about: string | null
          approved_at: string | null
          approved_by: string | null
          badges: Json | null
          category: string
          completed_jobs: number | null
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          joined_date: string | null
          location: string
          name: string
          phone: string
          profile_picture: string | null
          rating: number | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          response_time: string | null
          reviews_count: number | null
          status: string | null
          type_of_work: string | null
          updated_at: string | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          about?: string | null
          approved_at?: string | null
          approved_by?: string | null
          badges?: Json | null
          category: string
          completed_jobs?: number | null
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          joined_date?: string | null
          location: string
          name: string
          phone: string
          profile_picture?: string | null
          rating?: number | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          response_time?: string | null
          reviews_count?: number | null
          status?: string | null
          type_of_work?: string | null
          updated_at?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          about?: string | null
          approved_at?: string | null
          approved_by?: string | null
          badges?: Json | null
          category?: string
          completed_jobs?: number | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          joined_date?: string | null
          location?: string
          name?: string
          phone?: string
          profile_picture?: string | null
          rating?: number | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          response_time?: string | null
          reviews_count?: number | null
          status?: string | null
          type_of_work?: string | null
          updated_at?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skilled_workers_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category_stats"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "skilled_workers_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "worker_categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "skilled_workers_type_of_work_fkey"
            columns: ["type_of_work"]
            isOneToOne: false
            referencedRelation: "work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_question_attempts: {
        Row: {
          answers: Json
          completed_at: string
          correct_answers: number
          created_at: string
          forced_retake: boolean
          id: string
          incorrect_answers: number
          passed: boolean
          score_percentage: number
          total_questions: number
          trial_question_id: string
          user_id: string | null
        }
        Insert: {
          answers?: Json
          completed_at?: string
          correct_answers?: number
          created_at?: string
          forced_retake?: boolean
          id?: string
          incorrect_answers?: number
          passed?: boolean
          score_percentage: number
          total_questions: number
          trial_question_id: string
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string
          correct_answers?: number
          created_at?: string
          forced_retake?: boolean
          id?: string
          incorrect_answers?: number
          passed?: boolean
          score_percentage?: number
          total_questions?: number
          trial_question_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trial_question_attempts_trial_question_id_fkey"
            columns: ["trial_question_id"]
            isOneToOne: false
            referencedRelation: "trial_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_question_mcqs: {
        Row: {
          correct_answer: string
          created_at: string
          display_order: number | null
          explanation: string | null
          id: string
          options: Json
          question: string
          trial_question_id: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          display_order?: number | null
          explanation?: string | null
          id?: string
          options?: Json
          question: string
          trial_question_id: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          display_order?: number | null
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          trial_question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_question_mcqs_trial_question_id_fkey"
            columns: ["trial_question_id"]
            isOneToOne: false
            referencedRelation: "trial_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_question_section_b: {
        Row: {
          created_at: string
          description: string | null
          download_count: number | null
          downloads: number | null
          file_size: string | null
          file_url: string
          id: string
          title: string
          trial_question_id: string
          updated_at: string
          upload_date: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_count?: number | null
          downloads?: number | null
          file_size?: string | null
          file_url: string
          id?: string
          title: string
          trial_question_id: string
          updated_at?: string
          upload_date?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          download_count?: number | null
          downloads?: number | null
          file_size?: string | null
          file_url?: string
          id?: string
          title?: string
          trial_question_id?: string
          updated_at?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trial_question_section_b_trial_question_id_fkey"
            columns: ["trial_question_id"]
            isOneToOne: false
            referencedRelation: "trial_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_questions: {
        Row: {
          course_code: string
          course_name: string
          created_at: string
          downloads: number | null
          faculty: string
          id: string
          image_url: string | null
          questions: number | null
          semester: string
          title: string
          university: string
          university_short: string
          updated_at: string
          upload_date: string | null
          verified: boolean | null
          views: number | null
          year: number
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string
          downloads?: number | null
          faculty: string
          id?: string
          image_url?: string | null
          questions?: number | null
          semester: string
          title: string
          university: string
          university_short: string
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
          year: number
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string
          downloads?: number | null
          faculty?: string
          id?: string
          image_url?: string | null
          questions?: number | null
          semester?: string
          title?: string
          university?: string
          university_short?: string
          updated_at?: string
          upload_date?: string | null
          verified?: boolean | null
          views?: number | null
          year?: number
        }
        Relationships: []
      }
      tutor_concept_progress: {
        Row: {
          concept_name: string
          created_at: string | null
          id: string
          last_reviewed_at: string | null
          needs_review: boolean | null
          session_id: string
          times_correct: number | null
          times_incorrect: number | null
          times_reviewed: number | null
          understanding_level: number | null
          updated_at: string | null
        }
        Insert: {
          concept_name: string
          created_at?: string | null
          id?: string
          last_reviewed_at?: string | null
          needs_review?: boolean | null
          session_id: string
          times_correct?: number | null
          times_incorrect?: number | null
          times_reviewed?: number | null
          understanding_level?: number | null
          updated_at?: string | null
        }
        Update: {
          concept_name?: string
          created_at?: string | null
          id?: string
          last_reviewed_at?: string | null
          needs_review?: boolean | null
          session_id?: string
          times_correct?: number | null
          times_incorrect?: number | null
          times_reviewed?: number | null
          understanding_level?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_concept_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "tutor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_lessons: {
        Row: {
          completed_at: string | null
          content_summary: string | null
          created_at: string | null
          difficulty: string | null
          id: string
          lesson_order: number | null
          mastery_percentage: number | null
          questions_correct: number | null
          questions_total: number | null
          session_id: string
          status: string | null
          subtopic: string | null
          title: string
          topic: string
          unlocked_at: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          content_summary?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          lesson_order?: number | null
          mastery_percentage?: number | null
          questions_correct?: number | null
          questions_total?: number | null
          session_id: string
          status?: string | null
          subtopic?: string | null
          title: string
          topic: string
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          content_summary?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          lesson_order?: number | null
          mastery_percentage?: number | null
          questions_correct?: number | null
          questions_total?: number | null
          session_id?: string
          status?: string | null
          subtopic?: string | null
          title?: string
          topic?: string
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_lessons_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "tutor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          lesson_id: string | null
          message_type: string | null
          metadata: Json | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          lesson_id?: string | null
          message_type?: string | null
          metadata?: Json | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          lesson_id?: string | null
          message_type?: string | null
          metadata?: Json | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_messages_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "tutor_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "tutor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_sessions: {
        Row: {
          completed_lessons: number | null
          created_at: string | null
          difficulty_level: string | null
          id: string
          last_activity_at: string | null
          learning_style: string | null
          mastery_score: number | null
          material_content: string | null
          material_type: string | null
          material_url: string | null
          status: string | null
          streak_days: number | null
          title: string
          topics: Json | null
          total_lessons: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_lessons?: number | null
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          last_activity_at?: string | null
          learning_style?: string | null
          mastery_score?: number | null
          material_content?: string | null
          material_type?: string | null
          material_url?: string | null
          status?: string | null
          streak_days?: number | null
          title: string
          topics?: Json | null
          total_lessons?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_lessons?: number | null
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          last_activity_at?: string | null
          learning_style?: string | null
          mastery_score?: number | null
          material_content?: string | null
          material_type?: string | null
          material_url?: string | null
          status?: string | null
          streak_days?: number | null
          title?: string
          topics?: Json | null
          total_lessons?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tutor_streaks: {
        Row: {
          created_at: string | null
          id: string
          lessons_completed: number | null
          minutes_studied: number | null
          questions_answered: number | null
          study_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lessons_completed?: number | null
          minutes_studied?: number | null
          questions_answered?: number | null
          study_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lessons_completed?: number | null
          minutes_studied?: number | null
          questions_answered?: number | null
          study_date?: string
          user_id?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          abbreviation: string | null
          academics: Json | null
          acceptance_rate: string | null
          admission_cut_off: string | null
          admissions: Json | null
          average_grant_aid: string | null
          campus: string[] | null
          contact: Json | null
          courses: Json | null
          created_at: string
          description: string
          female_percentage: number | null
          financial_aid: Json | null
          full_time_percentage: number | null
          id: string
          logo: string | null
          main_campus: string | null
          male_percentage: number | null
          masters_courses: Json | null
          name: string
          part_time_percentage: number | null
          photos: string[] | null
          program_enrollment: Json | null
          programs: string | null
          rankings: Json | null
          region: string
          student_life: Json | null
          student_population: string | null
          tuition_fee: string | null
          type: string
          undergraduate_population: string | null
          updated_at: string
          website: string | null
          year_established: string | null
        }
        Insert: {
          abbreviation?: string | null
          academics?: Json | null
          acceptance_rate?: string | null
          admission_cut_off?: string | null
          admissions?: Json | null
          average_grant_aid?: string | null
          campus?: string[] | null
          contact?: Json | null
          courses?: Json | null
          created_at?: string
          description: string
          female_percentage?: number | null
          financial_aid?: Json | null
          full_time_percentage?: number | null
          id?: string
          logo?: string | null
          main_campus?: string | null
          male_percentage?: number | null
          masters_courses?: Json | null
          name: string
          part_time_percentage?: number | null
          photos?: string[] | null
          program_enrollment?: Json | null
          programs?: string | null
          rankings?: Json | null
          region: string
          student_life?: Json | null
          student_population?: string | null
          tuition_fee?: string | null
          type: string
          undergraduate_population?: string | null
          updated_at?: string
          website?: string | null
          year_established?: string | null
        }
        Update: {
          abbreviation?: string | null
          academics?: Json | null
          acceptance_rate?: string | null
          admission_cut_off?: string | null
          admissions?: Json | null
          average_grant_aid?: string | null
          campus?: string[] | null
          contact?: Json | null
          courses?: Json | null
          created_at?: string
          description?: string
          female_percentage?: number | null
          financial_aid?: Json | null
          full_time_percentage?: number | null
          id?: string
          logo?: string | null
          main_campus?: string | null
          male_percentage?: number | null
          masters_courses?: Json | null
          name?: string
          part_time_percentage?: number | null
          photos?: string[] | null
          program_enrollment?: Json | null
          programs?: string | null
          rankings?: Json | null
          region?: string
          student_life?: Json | null
          student_population?: string | null
          tuition_fee?: string | null
          type?: string
          undergraduate_population?: string | null
          updated_at?: string
          website?: string | null
          year_established?: string | null
        }
        Relationships: []
      }
      why_choose_us_section: {
        Row: {
          created_at: string
          description: string | null
          fast_executions_description: string | null
          financial_secure_description: string | null
          guide_support_description: string | null
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fast_executions_description?: string | null
          financial_secure_description?: string | null
          guide_support_description?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fast_executions_description?: string | null
          financial_secure_description?: string | null
          guide_support_description?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      work_types: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          label: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id: string
          label: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      worker_approvals: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          worker_id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          worker_id: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_approvals_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "skilled_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_approvals_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          type_of_work: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          type_of_work: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          type_of_work?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_categories_type_of_work_fkey"
            columns: ["type_of_work"]
            isOneToOne: false
            referencedRelation: "work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_portfolio: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          media_type: string
          media_url: string
          updated_at: string | null
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type: string
          media_url: string
          updated_at?: string | null
          worker_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type?: string
          media_url?: string
          updated_at?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_portfolio_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "skilled_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_portfolio_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_reviews: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_anonymous: boolean | null
          rating: number
          review_text: string
          reviewer_avatar: string | null
          reviewer_email: string | null
          reviewer_name: string
          status: string | null
          updated_at: string | null
          worker_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_anonymous?: boolean | null
          rating: number
          review_text: string
          reviewer_avatar?: string | null
          reviewer_email?: string | null
          reviewer_name: string
          status?: string | null
          updated_at?: string | null
          worker_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_anonymous?: boolean | null
          rating?: number
          review_text?: string
          reviewer_avatar?: string | null
          reviewer_email?: string | null
          reviewer_name?: string
          status?: string | null
          updated_at?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_reviews_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "skilled_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_reviews_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_services: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          service_name: string
          service_price: string
          updated_at: string | null
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          service_name: string
          service_price: string
          updated_at?: string | null
          worker_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          service_name?: string
          service_price?: string
          updated_at?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_services_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "skilled_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_services_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      yea_programs: {
        Row: {
          application_url: string | null
          behavioral_attributes: Json | null
          benefits: Json | null
          color: string | null
          created_at: string | null
          culture_paragraphs: Json | null
          description: string | null
          description_paragraphs: Json | null
          duration: string | null
          field_ops_groups: Json | null
          icon: string | null
          id: string
          image_url: string | null
          impact_highlights: Json | null
          impact_paragraphs: Json | null
          locations: Json | null
          opportunity_paragraphs: Json | null
          requirements: Json | null
          skills: Json | null
          skills_additional_knowledge: Json | null
          skills_experience: Json | null
          skills_formal_qualifications: Json | null
          skills_technical: Json | null
          stipend: string | null
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          benefits?: Json | null
          color?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          locations?: Json | null
          opportunity_paragraphs?: Json | null
          requirements?: Json | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          stipend?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          behavioral_attributes?: Json | null
          benefits?: Json | null
          color?: string | null
          created_at?: string | null
          culture_paragraphs?: Json | null
          description?: string | null
          description_paragraphs?: Json | null
          duration?: string | null
          field_ops_groups?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          impact_highlights?: Json | null
          impact_paragraphs?: Json | null
          locations?: Json | null
          opportunity_paragraphs?: Json | null
          requirements?: Json | null
          skills?: Json | null
          skills_additional_knowledge?: Json | null
          skills_experience?: Json | null
          skills_formal_qualifications?: Json | null
          skills_technical?: Json | null
          stipend?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      category_stats: {
        Row: {
          avg_rating: number | null
          id: string | null
          name: string | null
          total_reviews: number | null
          type_of_work: string | null
          worker_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_categories_type_of_work_fkey"
            columns: ["type_of_work"]
            isOneToOne: false
            referencedRelation: "work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_stats: {
        Row: {
          category: string | null
          completed_jobs: number | null
          created_at: string | null
          id: string | null
          location: string | null
          name: string | null
          portfolio_count: number | null
          rating: number | null
          reviews_count: number | null
          services_count: number | null
          status: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "skilled_workers_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category_stats"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "skilled_workers_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "worker_categories"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Functions: {
      recalculate_institution_ranks: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
