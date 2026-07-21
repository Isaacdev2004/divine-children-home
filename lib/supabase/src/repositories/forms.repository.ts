import { getSupabase } from "../client.js";
import {
  toCareerInsert,
  toContactInsert,
  toReferralInsert,
} from "../mappers.js";
import { assertNoError, DatabaseError } from "../errors.js";
import { createAdminNotification } from "./admin/dashboard.repository.js";

export function createReferenceNumber(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export async function insertContactSubmission(
  data: Parameters<typeof toContactInsert>[0],
  referenceNumber: string,
) {
  const { error } = await getSupabase()
    .from("contact_submissions")
    .insert([toContactInsert(data, referenceNumber)]);

  assertNoError(error);
  await createAdminNotification({
    type: "contact",
    title: "New contact enquiry",
    message: `${data.name} submitted a contact form (${referenceNumber})`,
    entityType: "contact_submissions",
    entityId: referenceNumber,
  });
}

export async function insertReferralSubmission(
  data: Parameters<typeof toReferralInsert>[0],
  referenceNumber: string,
) {
  const { error } = await getSupabase()
    .from("referral_submissions")
    .insert([toReferralInsert(data, referenceNumber)]);

  assertNoError(error);
  await createAdminNotification({
    type: "referral",
    title: "New referral received",
    message: `Referral ${referenceNumber} — urgency: ${data.urgency}`,
    entityType: "referral_submissions",
    entityId: referenceNumber,
  });
}

export async function insertCareerApplication(
  data: Parameters<typeof toCareerInsert>[0],
  referenceNumber: string,
) {
  const { error } = await getSupabase()
    .from("career_applications")
    .insert([toCareerInsert(data, referenceNumber)]);

  assertNoError(error);
  await createAdminNotification({
    type: "application",
    title: "New job application",
    message: `${data.firstName} ${data.lastName} applied for ${data.position}`,
    entityType: "career_applications",
    entityId: referenceNumber,
  });
}

export async function insertNewsletterSubscriber(email: string, name?: string | null) {
  const { error } = await getSupabase().from("newsletter_subscribers").insert([
    { email, name: name ?? null },
  ]);

  if (error?.code === "23505") {
    return { duplicate: true as const };
  }

  if (error) {
    throw new DatabaseError(error.message, error);
  }

  return { duplicate: false as const };
}
