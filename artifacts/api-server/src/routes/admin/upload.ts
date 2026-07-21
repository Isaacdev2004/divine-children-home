import { Router, type IRouter } from "express";
import multer from "multer";
import {
  uploadFile,
  adminCreateMediaRecord,
  getPublicStorageUrl,
  type StorageBucket,
} from "@workspace/supabase";
import { asyncHandler } from "../../lib/async-handler";
import { ApiError } from "../../lib/api-error";
import { audit } from "../../lib/audit";
import { requirePermission } from "../../middleware/require-permission";
import {
  sanitizeFilename,
  scanFilePlaceholder,
  validateUploadFile,
} from "../../lib/upload-security";
import { randomUUID } from "node:crypto";
import path from "node:path";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const router: IRouter = Router();

const ALLOWED_BUCKETS = new Set<string>(["images", "media", "documents", "cvs", "attachments"]);

router.post(
  "/",
  requirePermission("media.write"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "No file uploaded", undefined, "NO_FILE");

    validateUploadFile(req.file);
    await scanFilePlaceholder(req.file.buffer);

    const bucket = (req.body.bucket as string) || "media";
    if (!ALLOWED_BUCKETS.has(bucket)) throw new ApiError(400, "Invalid bucket", undefined, "INVALID_BUCKET");

    const folder = ((req.body.folder as string) || "general").replace(/[^a-zA-Z0-9/_-]/g, "");
    const ext = path.extname(req.file.originalname).toLowerCase() || "";
    const storagePath = `${folder}/${randomUUID()}${ext}`;
    const safeFilename = sanitizeFilename(req.file.originalname);

    const result = await uploadFile(
      bucket as StorageBucket,
      storagePath,
      req.file.buffer,
      req.file.mimetype,
    );

    const record = (await adminCreateMediaRecord({
      filename: safeFilename,
      storagePath: result.path,
      bucket,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      altText: req.body.altText,
      folder,
      uploadedBy: req.admin?.id,
    })) as { id: string };

    await audit(req, "upload", "media_files", String(record.id));

    res.status(201).json({
      ...(record as Record<string, unknown>),
      publicUrl: result.publicUrl ?? getPublicStorageUrl(bucket, result.path),
    });
  }),
);

export default router;
