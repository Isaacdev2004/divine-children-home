export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: number;
          title: string;
          department: string;
          location: string;
          type: string;
          description: string;
          requirements: string | null;
          salary: string;
          posted_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          title: string;
          department: string;
          location: string;
          type: string;
          description: string;
          requirements?: string | null;
          salary: string;
          posted_at?: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
      };
      news: {
        Row: {
          id: number;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          published_at: string;
          image_url: string;
          author: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          published_at?: string;
          image_url: string;
          author?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["news"]["Insert"]>;
      };
      faqs: {
        Row: {
          id: number;
          question: string;
          answer: string;
          category: string;
          sort_order: number;
        };
        Insert: {
          id?: number;
          question: string;
          answer: string;
          category: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: number;
          name: string;
          role: string;
          organisation: string;
          quote: string;
          rating: number;
          avatar_url: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          role: string;
          organisation: string;
          quote: string;
          rating?: number;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      gallery: {
        Row: {
          id: number;
          title: string;
          image_url: string;
          category: string;
          caption: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          image_url: string;
          category: string;
          caption?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      site_stats: {
        Row: {
          id: number;
          years_experience: number;
          children_supported: number;
          staff_members: number;
          homes_operating: number;
          ofsted_rating: string;
          success_rate: number;
        };
        Insert: Database["public"]["Tables"]["site_stats"]["Row"];
        Update: Partial<Database["public"]["Tables"]["site_stats"]["Insert"]>;
      };
      contact_submissions: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          subject: string;
          message: string;
          organisation: string | null;
          reference_number: string;
          submitted_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone: string;
          subject: string;
          message: string;
          organisation?: string | null;
          reference_number: string;
          submitted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_submissions"]["Insert"]>;
      };
      referral_submissions: {
        Row: {
          id: number;
          referrer_name: string;
          referrer_role: string;
          referrer_organisation: string;
          referrer_email: string;
          referrer_phone: string;
          child_age: number;
          child_gender: string;
          local_authority: string;
          placement_type: string;
          urgency: string;
          support_needs: string;
          additional_info: string | null;
          reference_number: string;
          submitted_at: string;
        };
        Insert: {
          id?: number;
          referrer_name: string;
          referrer_role: string;
          referrer_organisation: string;
          referrer_email: string;
          referrer_phone: string;
          child_age: number;
          child_gender: string;
          local_authority: string;
          placement_type: string;
          urgency: string;
          support_needs: string;
          additional_info?: string | null;
          reference_number: string;
          submitted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["referral_submissions"]["Insert"]>;
      };
      career_applications: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          position: string;
          job_id: number | null;
          cover_letter: string;
          experience: string | null;
          qualifications: string | null;
          right_to_work: boolean;
          reference_number: string;
          submitted_at: string;
        };
        Insert: {
          id?: number;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          position: string;
          job_id?: number | null;
          cover_letter: string;
          experience?: string | null;
          qualifications?: string | null;
          right_to_work: boolean;
          reference_number: string;
          submitted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["career_applications"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: {
          id: number;
          email: string;
          name: string | null;
          subscribed_at: string;
        };
        Insert: {
          id?: number;
          email: string;
          name?: string | null;
          subscribed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
