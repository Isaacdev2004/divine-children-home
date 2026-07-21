import { getSupabase } from "../client.js";
import {
  mapFaq,
  mapGalleryImage,
  mapSiteStats,
  mapTestimonial,
} from "../mappers.js";
import { assertNoError } from "../errors.js";

const DEFAULT_STATS = {
  yearsExperience: 10,
  childrenSupported: 250,
  staffMembers: 85,
  homesOperating: 6,
  ofstedRating: "Good",
  successRate: 94,
};

export async function listFaqs() {
  const { data, error } = await getSupabase()
    .from("faqs")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  assertNoError(error);
  return (data ?? []).map(mapFaq);
}

export async function listGalleryImages() {
  const { data, error } = await getSupabase().from("gallery").select("*");
  assertNoError(error);
  return (data ?? []).map(mapGalleryImage);
}

export async function listTestimonials() {
  const { data, error } = await getSupabase().from("testimonials").select("*");
  assertNoError(error);
  return (data ?? []).map(mapTestimonial);
}

export async function getSiteStats() {
  const { data, error } = await getSupabase()
    .from("site_stats")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  assertNoError(error);
  return data ? mapSiteStats(data) : DEFAULT_STATS;
}
