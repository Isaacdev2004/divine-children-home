import { getSupabase } from "../client.js";
import { mapNewsArticle } from "../mappers.js";
import { assertNoError } from "../errors.js";

export async function listNewsArticles() {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  assertNoError(error);
  return (data ?? []).map(mapNewsArticle);
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  assertNoError(error);
  return data ? mapNewsArticle(data) : null;
}
