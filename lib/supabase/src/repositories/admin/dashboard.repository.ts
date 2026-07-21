import { getSupabase } from "../../client.js";
import { assertNoError } from "../../errors.js";

export interface AuditEntry {
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  const { error } = await getSupabase().from("audit_logs").insert([
    {
      user_id: entry.userId ?? null,
      user_email: entry.userEmail ?? null,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      details: entry.details ?? null,
      ip_address: entry.ipAddress ?? null,
    },
  ]);

  if (error) {
    console.error("Failed to write audit log:", error.message);
  }
}

export async function createAdminNotification(input: {
  userId?: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
}): Promise<void> {
  const { error } = await getSupabase().from("admin_notifications").insert([
    {
      user_id: input.userId ?? null,
      type: input.type,
      title: input.title,
      message: input.message,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
    },
  ]);

  if (error) {
    console.error("Failed to create notification:", error.message);
  }
}

export async function getDashboardStats() {
  const db = getSupabase();

  const [
    referrals,
    applications,
    contacts,
    subscribers,
    news,
    gallery,
    testimonials,
  ] = await Promise.all([
    db.from("referral_submissions").select("id", { count: "exact", head: true }),
    db.from("career_applications").select("id", { count: "exact", head: true }),
    db.from("contact_submissions").select("id", { count: "exact", head: true }),
    db.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    db.from("news").select("id", { count: "exact", head: true }).eq("status", "published"),
    db.from("gallery").select("id", { count: "exact", head: true }),
    db.from("testimonials").select("id", { count: "exact", head: true }),
  ]);

  assertNoError(referrals.error);
  assertNoError(applications.error);
  assertNoError(contacts.error);
  assertNoError(subscribers.error);
  assertNoError(news.error);
  assertNoError(gallery.error);
  assertNoError(testimonials.error);

  const { data: statsRow } = await db.from("site_stats").select("*").eq("id", 1).maybeSingle();

  const { data: recentReferrals } = await db
    .from("referral_submissions")
    .select("id, reference_number, referrer_name, urgency, status, submitted_at")
    .order("submitted_at", { ascending: false })
    .limit(5);

  const { data: recentActivity } = await db
    .from("audit_logs")
    .select("id, user_email, action, entity_type, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    counts: {
      referrals: referrals.count ?? 0,
      applications: applications.count ?? 0,
      contacts: contacts.count ?? 0,
      subscribers: subscribers.count ?? 0,
      news: news.count ?? 0,
      gallery: gallery.count ?? 0,
      testimonials: testimonials.count ?? 0,
    },
    siteStats: statsRow,
    recentReferrals: recentReferrals ?? [],
    recentActivity: recentActivity ?? [],
  };
}

export async function getChartData(days = 30) {
  const db = getSupabase();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [referrals, applications, contacts, subscribers] = await Promise.all([
    db
      .from("referral_submissions")
      .select("submitted_at")
      .gte("submitted_at", since.toISOString()),
    db
      .from("career_applications")
      .select("submitted_at")
      .gte("submitted_at", since.toISOString()),
    db
      .from("contact_submissions")
      .select("submitted_at")
      .gte("submitted_at", since.toISOString()),
    db
      .from("newsletter_subscribers")
      .select("subscribed_at")
      .gte("subscribed_at", since.toISOString()),
  ]);

  return {
    referrals: groupByDate(referrals.data ?? [], "submitted_at"),
    applications: groupByDate(applications.data ?? [], "submitted_at"),
    contacts: groupByDate(contacts.data ?? [], "submitted_at"),
    subscribers: groupByDate(subscribers.data ?? [], "subscribed_at"),
  };
}

function groupByDate(rows: Record<string, string>[], field: string) {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const date = row[field]?.slice(0, 10);
    if (date) counts[date] = (counts[date] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}
