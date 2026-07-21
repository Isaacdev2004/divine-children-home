import { getSupabase } from "./client.js";

export const IMAGES_BUCKET = "images";
export const MEDIA_BUCKET = "media";
export const DOCUMENTS_BUCKET = "documents";
export const CVS_BUCKET = "cvs";
export const ATTACHMENTS_BUCKET = "attachments";

export type StorageBucket =
  | typeof IMAGES_BUCKET
  | typeof MEDIA_BUCKET
  | typeof DOCUMENTS_BUCKET
  | typeof CVS_BUCKET
  | typeof ATTACHMENTS_BUCKET;

const PUBLIC_BUCKETS = new Set<string>([IMAGES_BUCKET, MEDIA_BUCKET, DOCUMENTS_BUCKET]);

export function getPublicStorageUrl(bucket: string, path: string): string {
  const baseUrl = process.env.SUPABASE_URL;
  if (!baseUrl) {
    throw new Error("SUPABASE_URL must be set");
  }

  if (!PUBLIC_BUCKETS.has(bucket)) {
    throw new Error(`Bucket "${bucket}" is not public`);
  }

  const normalizedPath = path.replace(/^\/+/, "");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${normalizedPath}`;
}

export function getPublicImageUrl(path: string): string {
  return getPublicStorageUrl(IMAGES_BUCKET, path);
}

export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  body: Buffer | Blob | ArrayBuffer,
  contentType: string,
) {
  const { data, error } = await getSupabase().storage.from(bucket).upload(path, body, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const result: { path: string; publicUrl?: string } = { path: data.path };
  if (PUBLIC_BUCKETS.has(bucket)) {
    result.publicUrl = getPublicStorageUrl(bucket, data.path);
  }
  return result;
}

export async function uploadImage(
  path: string,
  body: Buffer | Blob | ArrayBuffer,
  contentType: string,
) {
  return uploadFile(IMAGES_BUCKET, path, body, contentType);
}

export async function deleteStorageFile(bucket: StorageBucket, path: string) {
  const { error } = await getSupabase().storage.from(bucket).remove([path]);
  if (error) throw error;
}

export async function getSignedUrl(bucket: StorageBucket, path: string, expiresIn = 3600) {
  const { data, error } = await getSupabase().storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
