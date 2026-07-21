import path from "node:path";
import { ApiError } from "./api-error";

/** Allowed MIME types per bucket category */
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".js",
  ".html",
  ".htm",
]);

export function validateUploadFile(file: Express.Multer.File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(400, "File exceeds maximum size of 20MB", undefined, "FILE_TOO_LARGE");
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new ApiError(
      400,
      `File type not allowed: ${file.mimetype}`,
      undefined,
      "INVALID_MIME_TYPE",
    );
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) {
    throw new ApiError(400, "File extension not allowed", undefined, "INVALID_EXTENSION");
  }
}

/** Sanitize original filename for display/storage metadata */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\.\./g, "")
    .trim()
    .slice(0, 255) || "upload";
}

/**
 * Placeholder for virus scanning integration.
 * In production, call ClamAV, VirusTotal API, or cloud scanner before upload.
 */
export async function scanFilePlaceholder(_buffer: Buffer): Promise<void> {
  // TODO: integrate virus scanner in production pipeline
}
