export { supabase, getSupabase } from "./client";
export type { Database } from "./database.types";
export { DatabaseError, assertNoError, isUniqueViolation } from "./errors";
export {
  verifyAccessToken,
  getAdminProfile,
  mapAdminProfile,
  touchLastLogin,
  getAuthClient,
  type AdminProfile,
  type AdminRole,
} from "./auth";
export { hasPermission, requirePermission, type Permission } from "./permissions";
export {
  mapJob,
  mapNewsArticle,
  mapFaq,
  mapTestimonial,
  mapGalleryImage,
  mapSiteStats,
  toContactInsert,
  toReferralInsert,
  toCareerInsert,
} from "./mappers";
export {
  IMAGES_BUCKET,
  MEDIA_BUCKET,
  DOCUMENTS_BUCKET,
  CVS_BUCKET,
  ATTACHMENTS_BUCKET,
  getPublicImageUrl,
  getPublicStorageUrl,
  uploadImage,
  uploadFile,
  deleteStorageFile,
  getSignedUrl,
  type StorageBucket,
} from "./storage";
export * from "./repositories";
export * from "./repositories/admin";
