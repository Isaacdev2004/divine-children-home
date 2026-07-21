import { Router, type IRouter } from "express";
import {
  adminListUsers,
  adminUpdateUser,
  adminCreateUserProfile,
  adminListAuditLogs,
  adminListNotifications,
  adminMarkNotificationRead,
  getSupabase,
} from "@workspace/supabase";
import { asyncHandler } from "../../lib/async-handler";
import { ApiError } from "../../lib/api-error";
import { audit } from "../../lib/audit";
import { requirePermission } from "../../middleware/require-permission";

const router: IRouter = Router();

router.get(
  "/users",
  requirePermission("users.read"),
  asyncHandler(async (_req, res) => {
    res.json(await adminListUsers());
  }),
);

router.post(
  "/users/invite",
  requirePermission("users.write"),
  asyncHandler(async (req, res) => {
    const { email, fullName, role, password } = req.body;
    if (!email || !fullName || !password) {
      throw new ApiError(400, "email, fullName, and password are required");
    }

    const { data: authData, error: authError } = await getSupabase().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError || !authData.user) {
      throw new ApiError(400, authError?.message ?? "Failed to create user");
    }

    const profile = await adminCreateUserProfile({
      id: authData.user.id,
      email,
      fullName,
      role: role ?? "content_editor",
      isActive: true,
    });

    await audit(req, "invite", "admin_profiles", authData.user.id);
    res.status(201).json(profile);
  }),
);

router.patch(
  "/users/:id",
  requirePermission("users.write"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const updated = await adminUpdateUser(id, req.body);
    await audit(req, "update", "admin_profiles", id);
    res.json(updated);
  }),
);

router.get(
  "/audit-logs",
  requirePermission("audit.read"),
  asyncHandler(async (req, res) => {
    const limit = parseInt(String(req.query.limit ?? "50"), 10);
    res.json(await adminListAuditLogs(limit));
  }),
);

router.get(
  "/notifications",
  requirePermission("dashboard.view"),
  asyncHandler(async (req, res) => {
    res.json(await adminListNotifications(req.admin!.id));
  }),
);

router.patch(
  "/notifications/:id/read",
  requirePermission("dashboard.view"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    res.json(await adminMarkNotificationRead(id));
  }),
);

export default router;
