import { getSupabase } from "../../client.js";
import { assertNoError } from "../../errors.js";
import {
  mapFaq,
  mapGalleryImage,
  mapJob,
  mapNewsArticle,
  mapSiteStats,
  mapTestimonial,
} from "../../mappers.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export async function listTable<T>(
  table: string,
  orderBy = "id",
  ascending = false,
): Promise<T[]> {
  const { data, error } = await getSupabase()
    .from(table)
    .select("*")
    .order(orderBy, { ascending });
  assertNoError(error);
  return (data ?? []) as T[];
}

export async function getById<T>(table: string, id: number | string): Promise<T | null> {
  const { data, error } = await getSupabase()
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  assertNoError(error);
  return (data as T) ?? null;
}

export async function insertRow<T>(table: string, row: Record<string, unknown>): Promise<T> {
  const { data, error } = await getSupabase().from(table).insert([row]).select("*").single();
  assertNoError(error);
  return data as T;
}

export async function updateRow<T>(
  table: string,
  id: number | string,
  row: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await getSupabase()
    .from(table)
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  assertNoError(error);
  return data as T;
}

export async function deleteRow(table: string, id: number | string): Promise<void> {
  const { error } = await getSupabase().from(table).delete().eq("id", id);
  assertNoError(error);
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export async function adminListNews() {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  assertNoError(error);
  return (data ?? []).map(mapNewsArticle);
}

export async function adminCreateNews(input: Record<string, unknown>) {
  const slug = (input.slug as string) || slugify(String(input.title));
  const row = {
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    published_at: input.publishedAt ?? new Date().toISOString(),
    image_url: input.imageUrl,
    author: input.author ?? null,
    status: input.status ?? "draft",
    scheduled_at: input.scheduledAt ?? null,
    tags: input.tags ?? [],
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
    is_featured: input.isFeatured ?? false,
  };
  return mapNewsArticle(await insertRow("news", row));
}

export async function adminUpdateNews(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.excerpt !== undefined) row.excerpt = input.excerpt;
  if (input.content !== undefined) row.content = input.content;
  if (input.category !== undefined) row.category = input.category;
  if (input.publishedAt !== undefined) row.published_at = input.publishedAt;
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl;
  if (input.author !== undefined) row.author = input.author;
  if (input.status !== undefined) row.status = input.status;
  if (input.scheduledAt !== undefined) row.scheduled_at = input.scheduledAt;
  if (input.tags !== undefined) row.tags = input.tags;
  if (input.seoTitle !== undefined) row.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) row.seo_description = input.seoDescription;
  if (input.isFeatured !== undefined) row.is_featured = input.isFeatured;
  return mapNewsArticle(await updateRow("news", id, row));
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export async function adminListJobs() {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });
  assertNoError(error);
  return (data ?? []).map(mapJob);
}

export async function adminCreateJob(input: Record<string, unknown>) {
  const row = {
    title: input.title,
    department: input.department,
    location: input.location,
    type: input.type,
    description: input.description,
    requirements: input.requirements ?? null,
    salary: input.salary,
    is_active: input.isActive ?? true,
    status: input.status ?? "published",
    closing_date: input.closingDate ?? null,
  };
  return mapJob(await insertRow("jobs", row));
}

export async function adminUpdateJob(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [key, col] of [
    ["title", "title"],
    ["department", "department"],
    ["location", "location"],
    ["type", "type"],
    ["description", "description"],
    ["requirements", "requirements"],
    ["salary", "salary"],
    ["isActive", "is_active"],
    ["status", "status"],
    ["closingDate", "closing_date"],
  ] as const) {
    if (input[key] !== undefined) row[col] = input[key];
  }
  return mapJob(await updateRow("jobs", id, row));
}

// ---------------------------------------------------------------------------
// FAQs, Gallery, Testimonials, Stats
// ---------------------------------------------------------------------------

export async function adminListFaqs() {
  const { data, error } = await getSupabase()
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  assertNoError(error);
  return (data ?? []).map(mapFaq);
}

export async function adminCreateFaq(input: Record<string, unknown>) {
  return mapFaq(
    await insertRow("faqs", {
      question: input.question,
      answer: input.answer,
      category: input.category,
      sort_order: input.sortOrder ?? 0,
    }),
  );
}

export async function adminUpdateFaq(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.question !== undefined) row.question = input.question;
  if (input.answer !== undefined) row.answer = input.answer;
  if (input.category !== undefined) row.category = input.category;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  return mapFaq(await updateRow("faqs", id, row));
}

export async function adminListGallery() {
  const { data, error } = await getSupabase()
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  assertNoError(error);
  return (data ?? []).map(mapGalleryImage);
}

export async function adminCreateGalleryItem(input: Record<string, unknown>) {
  return mapGalleryImage(
    await insertRow("gallery", {
      title: input.title,
      image_url: input.imageUrl,
      category: input.category,
      caption: input.caption ?? null,
      sort_order: input.sortOrder ?? 0,
    }),
  );
}

export async function adminUpdateGalleryItem(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl;
  if (input.category !== undefined) row.category = input.category;
  if (input.caption !== undefined) row.caption = input.caption;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  return mapGalleryImage(await updateRow("gallery", id, row));
}

export async function adminListTestimonials() {
  const { data, error } = await getSupabase().from("testimonials").select("*");
  assertNoError(error);
  return (data ?? []).map(mapTestimonial);
}

export async function adminCreateTestimonial(input: Record<string, unknown>) {
  return mapTestimonial(
    await insertRow("testimonials", {
      name: input.name,
      role: input.role,
      organisation: input.organisation,
      quote: input.quote,
      rating: input.rating ?? 5,
      avatar_url: input.avatarUrl ?? null,
      is_approved: input.isApproved ?? false,
      is_featured: input.isFeatured ?? false,
      sort_order: input.sortOrder ?? 0,
    }),
  );
}

export async function adminUpdateTestimonial(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, c] of [
    ["name", "name"],
    ["role", "role"],
    ["organisation", "organisation"],
    ["quote", "quote"],
    ["rating", "rating"],
    ["avatarUrl", "avatar_url"],
    ["isApproved", "is_approved"],
    ["isFeatured", "is_featured"],
    ["sortOrder", "sort_order"],
  ] as const) {
    if (input[k] !== undefined) row[c] = input[k];
  }
  return mapTestimonial(await updateRow("testimonials", id, row));
}

export async function adminUpdateSiteStats(input: Record<string, unknown>) {
  const row = {
    years_experience: input.yearsExperience,
    children_supported: input.childrenSupported,
    staff_members: input.staffMembers,
    homes_operating: input.homesOperating,
    ofsted_rating: input.ofstedRating,
    success_rate: input.successRate,
  };
  const { data, error } = await getSupabase()
    .from("site_stats")
    .upsert([{ id: 1, ...row }])
    .select("*")
    .single();
  assertNoError(error);
  return mapSiteStats(data);
}

// ---------------------------------------------------------------------------
// Homes, Services, Resources
// ---------------------------------------------------------------------------

export async function adminListHomes() {
  return listTable("homes", "sort_order", true);
}

export async function adminCreateHome(input: Record<string, unknown>) {
  return insertRow("homes", {
    name: input.name,
    slug: input.slug ?? slugify(String(input.name)),
    description: input.description,
    address: input.address,
    capacity: input.capacity ?? 0,
    services: input.services ?? [],
    facilities: input.facilities ?? [],
    image_urls: input.imageUrls ?? [],
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
  });
}

export async function adminUpdateHome(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, c] of [
    ["name", "name"],
    ["slug", "slug"],
    ["description", "description"],
    ["address", "address"],
    ["capacity", "capacity"],
    ["services", "services"],
    ["facilities", "facilities"],
    ["imageUrls", "image_urls"],
    ["status", "status"],
    ["sortOrder", "sort_order"],
  ] as const) {
    if (input[k] !== undefined) row[c] = input[k];
  }
  row.updated_at = new Date().toISOString();
  return updateRow("homes", id, row);
}

export async function adminListServices() {
  return listTable("services", "display_order", true);
}

export async function adminCreateService(input: Record<string, unknown>) {
  return insertRow("services", {
    title: input.title,
    slug: input.slug ?? slugify(String(input.title)),
    description: input.description,
    icon: input.icon ?? "Heart",
    display_order: input.displayOrder ?? 0,
    is_featured: input.isFeatured ?? false,
    status: input.status ?? "draft",
  });
}

export async function adminUpdateService(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, c] of [
    ["title", "title"],
    ["slug", "slug"],
    ["description", "description"],
    ["icon", "icon"],
    ["displayOrder", "display_order"],
    ["isFeatured", "is_featured"],
    ["status", "status"],
  ] as const) {
    if (input[k] !== undefined) row[c] = input[k];
  }
  return updateRow("services", id, row);
}

export async function adminListResources() {
  return listTable("resources", "sort_order", true);
}

export async function adminCreateResource(input: Record<string, unknown>) {
  return insertRow("resources", {
    title: input.title,
    slug: input.slug ?? slugify(String(input.title)),
    description: input.description ?? null,
    category: input.category ?? "General",
    file_url: input.fileUrl,
    file_name: input.fileName,
    file_size_bytes: input.fileSizeBytes ?? null,
    mime_type: input.mimeType ?? null,
    status: input.status ?? "draft",
    sort_order: input.sortOrder ?? 0,
  });
}

export async function adminUpdateResource(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, c] of [
    ["title", "title"],
    ["slug", "slug"],
    ["description", "description"],
    ["category", "category"],
    ["fileUrl", "file_url"],
    ["fileName", "file_name"],
    ["status", "status"],
    ["sortOrder", "sort_order"],
  ] as const) {
    if (input[k] !== undefined) row[c] = input[k];
  }
  return updateRow("resources", id, row);
}

// ---------------------------------------------------------------------------
// Page sections & settings
// ---------------------------------------------------------------------------

export async function adminListPageSections(pageKey?: string) {
  let query = getSupabase().from("page_sections").select("*").order("sort_order");
  if (pageKey) query = query.eq("page_key", pageKey);
  const { data, error } = await query;
  assertNoError(error);
  return data ?? [];
}

export async function adminUpsertPageSection(input: Record<string, unknown>) {
  const row = {
    page_key: input.pageKey,
    section_key: input.sectionKey,
    title: input.title ?? null,
    content: input.content ?? {},
    sort_order: input.sortOrder ?? 0,
    is_active: input.isActive ?? true,
    updated_at: new Date().toISOString(),
    updated_by: input.updatedBy ?? null,
  };
  const { data, error } = await getSupabase()
    .from("page_sections")
    .upsert([row], { onConflict: "page_key,section_key" })
    .select("*")
    .single();
  assertNoError(error);
  return data;
}

export async function adminGetSiteSettings() {
  const { data, error } = await getSupabase().from("site_settings").select("*");
  assertNoError(error);
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function adminUpdateSiteSetting(
  key: string,
  value: unknown,
  updatedBy?: string,
) {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .upsert([
      {
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy ?? null,
      },
    ])
    .select("*")
    .single();
  assertNoError(error);
  return data;
}

// ---------------------------------------------------------------------------
// SEO & redirects
// ---------------------------------------------------------------------------

export async function adminListSeo() {
  return listTable("seo_metadata", "path", true);
}

export async function adminUpsertSeo(path: string, input: Record<string, unknown>) {
  const row = {
    path,
    title: input.title ?? null,
    description: input.description ?? null,
    canonical_url: input.canonicalUrl ?? null,
    og_image_url: input.ogImageUrl ?? null,
    twitter_card: input.twitterCard ?? "summary_large_image",
    robots: input.robots ?? "index, follow",
    structured_data: input.structuredData ?? null,
    updated_at: new Date().toISOString(),
    updated_by: input.updatedBy ?? null,
  };
  const { data, error } = await getSupabase()
    .from("seo_metadata")
    .upsert([row])
    .select("*")
    .single();
  assertNoError(error);
  return data;
}

export async function adminListRedirects() {
  return listTable("url_redirects", "id", false);
}

export async function adminCreateRedirect(input: Record<string, unknown>) {
  return insertRow("url_redirects", {
    from_path: input.fromPath,
    to_path: input.toPath,
    status_code: input.statusCode ?? 301,
    is_active: input.isActive ?? true,
  });
}

export async function adminUpdateRedirect(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.fromPath !== undefined) row.from_path = input.fromPath;
  if (input.toPath !== undefined) row.to_path = input.toPath;
  if (input.statusCode !== undefined) row.status_code = input.statusCode;
  if (input.isActive !== undefined) row.is_active = input.isActive;
  return updateRow("url_redirects", id, row);
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

export async function adminListContacts(search?: string) {
  let query = getSupabase()
    .from("contact_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,reference_number.ilike.%${search}%`,
    );
  }
  const { data, error } = await query;
  assertNoError(error);
  return data ?? [];
}

export async function adminUpdateContact(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.status !== undefined) row.status = input.status;
  if (input.internalNotes !== undefined) row.internal_notes = input.internalNotes;
  if (input.archivedAt !== undefined) row.archived_at = input.archivedAt;
  if (input.repliedAt !== undefined) row.replied_at = input.repliedAt;
  return updateRow("contact_submissions", id, row);
}

export async function adminListReferrals(status?: string) {
  let query = getSupabase()
    .from("referral_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  assertNoError(error);
  return data ?? [];
}

export async function adminUpdateReferral(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.status !== undefined) row.status = input.status;
  if (input.assignedTo !== undefined) row.assigned_to = input.assignedTo;
  if (input.internalNotes !== undefined) row.internal_notes = input.internalNotes;
  if (input.archivedAt !== undefined) row.archived_at = input.archivedAt;
  return updateRow("referral_submissions", id, row);
}

export async function adminListReferralComments(referralId: number) {
  const { data, error } = await getSupabase()
    .from("referral_comments")
    .select("*")
    .eq("referral_id", referralId)
    .order("created_at", { ascending: true });
  assertNoError(error);
  return data ?? [];
}

export async function adminAddReferralComment(input: Record<string, unknown>) {
  return insertRow("referral_comments", {
    referral_id: input.referralId,
    user_id: input.userId,
    user_name: input.userName,
    comment: input.comment,
  });
}

export async function adminListApplications() {
  const { data, error } = await getSupabase()
    .from("career_applications")
    .select("*, jobs(title)")
    .order("submitted_at", { ascending: false });
  assertNoError(error);
  return data ?? [];
}

export async function adminUpdateApplication(id: number, input: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  if (input.status !== undefined) row.status = input.status;
  if (input.internalNotes !== undefined) row.internal_notes = input.internalNotes;
  return updateRow("career_applications", id, row);
}

export async function adminListSubscribers(search?: string) {
  let query = getSupabase()
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });
  if (search) query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  const { data, error } = await query;
  assertNoError(error);
  return data ?? [];
}

export async function adminDeleteSubscriber(id: number) {
  return deleteRow("newsletter_subscribers", id);
}

// ---------------------------------------------------------------------------
// Users & audit
// ---------------------------------------------------------------------------

export async function adminListUsers() {
  const { data, error } = await getSupabase()
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  assertNoError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    avatarUrl: row.avatar_url,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  }));
}

export async function adminUpdateUser(id: string, input: Record<string, unknown>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.fullName !== undefined) row.full_name = input.fullName;
  if (input.role !== undefined) row.role = input.role;
  if (input.isActive !== undefined) row.is_active = input.isActive;
  const { data, error } = await getSupabase()
    .from("admin_profiles")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  assertNoError(error);
  return data;
}

export async function adminCreateUserProfile(input: Record<string, unknown>) {
  return insertRow("admin_profiles", {
    id: input.id,
    email: input.email,
    full_name: input.fullName,
    role: input.role ?? "content_editor",
    is_active: input.isActive ?? true,
  });
}

export async function adminListAuditLogs(limit = 50) {
  const { data, error } = await getSupabase()
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  assertNoError(error);
  return data ?? [];
}

export async function adminListNotifications(userId: string) {
  const { data, error } = await getSupabase()
    .from("admin_notifications")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(20);
  assertNoError(error);
  return data ?? [];
}

export async function adminMarkNotificationRead(id: number) {
  return updateRow("admin_notifications", id, { is_read: true });
}

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------

export async function adminListMedia(folder?: string) {
  let query = getSupabase().from("media_files").select("*").order("created_at", { ascending: false });
  if (folder) query = query.eq("folder", folder);
  const { data, error } = await query;
  assertNoError(error);
  return data ?? [];
}

export async function adminCreateMediaRecord(input: Record<string, unknown>) {
  return insertRow("media_files", {
    filename: input.filename,
    storage_path: input.storagePath,
    bucket: input.bucket,
    mime_type: input.mimeType,
    size_bytes: input.sizeBytes ?? 0,
    alt_text: input.altText ?? null,
    folder: input.folder ?? "general",
    uploaded_by: input.uploadedBy ?? null,
  });
}

export async function adminDeleteMedia(id: string) {
  return deleteRow("media_files", id);
}

export {
  deleteRow as adminDeleteRow,
  getById as adminGetById,
};
