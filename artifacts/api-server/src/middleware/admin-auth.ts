import type { RequestHandler } from "express";
import { verifyAccessToken, touchLastLogin } from "@workspace/supabase";
import { ApiError } from "../lib/api-error";

export const requireAdmin: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  const token = header.slice(7);
  const session = await verifyAccessToken(token);

  if (!session) {
    next(new ApiError(401, "Invalid or expired session"));
    return;
  }

  req.admin = session.profile;
  void touchLastLogin(session.profile.id);
  next();
};
