import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

export type JobRow = Tables["jobs"]["Row"];
export type NewsRow = Tables["news"]["Row"];
export type FaqRow = Tables["faqs"]["Row"];
export type TestimonialRow = Tables["testimonials"]["Row"];
export type GalleryRow = Tables["gallery"]["Row"];
export type SiteStatsRow = Tables["site_stats"]["Row"];

export function mapJob(row: JobRow) {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    description: row.description,
    requirements: row.requirements,
    salary: row.salary,
    postedAt: new Date(row.posted_at),
    isActive: row.is_active,
  };
}

export function mapNewsArticle(row: NewsRow) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    publishedAt: new Date(row.published_at),
    imageUrl: row.image_url,
    author: row.author,
  };
}

export function mapFaq(row: FaqRow) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    sortOrder: row.sort_order,
  };
}

export function mapTestimonial(row: TestimonialRow) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    organisation: row.organisation,
    quote: row.quote,
    rating: row.rating,
    avatarUrl: row.avatar_url,
  };
}

export function mapGalleryImage(row: GalleryRow) {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    category: row.category,
    caption: row.caption,
  };
}

export function mapSiteStats(row: SiteStatsRow) {
  return {
    yearsExperience: row.years_experience,
    childrenSupported: row.children_supported,
    staffMembers: row.staff_members,
    homesOperating: row.homes_operating,
    ofstedRating: row.ofsted_rating,
    successRate: row.success_rate,
  };
}

export function toContactInsert(
  data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    organisation?: string | null;
  },
  referenceNumber: string,
): Tables["contact_submissions"]["Insert"] {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    organisation: data.organisation ?? null,
    reference_number: referenceNumber,
  };
}

export function toReferralInsert(
  data: {
    referrerName: string;
    referrerRole: string;
    referrerOrganisation: string;
    referrerEmail: string;
    referrerPhone: string;
    childAge: number;
    childGender: string;
    localAuthority: string;
    placementType: string;
    urgency: string;
    supportNeeds: string;
    additionalInfo?: string | null;
  },
  referenceNumber: string,
): Tables["referral_submissions"]["Insert"] {
  return {
    referrer_name: data.referrerName,
    referrer_role: data.referrerRole,
    referrer_organisation: data.referrerOrganisation,
    referrer_email: data.referrerEmail,
    referrer_phone: data.referrerPhone,
    child_age: data.childAge,
    child_gender: data.childGender,
    local_authority: data.localAuthority,
    placement_type: data.placementType,
    urgency: data.urgency,
    support_needs: data.supportNeeds,
    additional_info: data.additionalInfo ?? null,
    reference_number: referenceNumber,
  };
}

export function toCareerInsert(
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    jobId?: number | null;
    coverLetter: string;
    experience?: string | null;
    qualifications?: string | null;
    rightToWork: boolean;
  },
  referenceNumber: string,
): Tables["career_applications"]["Insert"] {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    position: data.position,
    job_id: data.jobId ?? null,
    cover_letter: data.coverLetter,
    experience: data.experience ?? null,
    qualifications: data.qualifications ?? null,
    right_to_work: data.rightToWork,
    reference_number: referenceNumber,
  };
}
