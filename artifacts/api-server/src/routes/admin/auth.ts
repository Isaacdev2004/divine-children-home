import { Router, type IRouter } from "express";
import { getSupabase, verifyAccessToken, getAdminProfile, touchLastLogin } from "@workspace/supabase";
import { asyncHandler } from "../../lib/async-handler";
import { ApiError } from "../../lib/api-error";
import { requireAdmin } from "../../middleware/admin-auth";
import { authRateLimit } from "../../middleware/rate-limit";

const router: IRouter = Router();

router.post(
  "/login",
  authRateLimit,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required", undefined, "VALIDATION_ERROR");
    }

    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      throw new ApiError(401, error?.message ?? "Invalid credentials");
    }

    const profile = await getAdminProfile(data.user.id);
    if (!profile || !profile.isActive) {
      throw new ApiError(403, "You are not authorized to access the admin panel");
    }

    await touchLastLogin(profile.id);

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      profile,
    });
  }),
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    const { data, error } = await getSupabase().auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new ApiError(401, "Session expired. Please sign in again.");
    }

    const verified = await verifyAccessToken(data.session.access_token);
    if (!verified) {
      throw new ApiError(403, "Not authorized");
    }

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      profile: verified.profile,
    });
  }),
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body as { email?: string };
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const redirectTo = process.env.ADMIN_RESET_PASSWORD_URL
      ?? `${req.headers.origin ?? "http://localhost:23337"}/admin/reset-password`;

    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    res.json({ success: true, message: "If an account exists, a reset link has been sent." });
  }),
);

router.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ profile: req.admin });
  }),
);

export default router;
