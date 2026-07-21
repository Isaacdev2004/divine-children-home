import { getSupabase } from "../client.js";
import { mapJob } from "../mappers.js";
import { assertNoError } from "../errors.js";

export async function listActiveJobs() {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("posted_at", { ascending: true });

  assertNoError(error);
  return (data ?? []).map(mapJob);
}

export async function getJobById(id: number) {
  const { data, error } = await getSupabase()
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  assertNoError(error);
  return data ? mapJob(data) : null;
}
