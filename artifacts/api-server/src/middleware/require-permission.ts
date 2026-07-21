import type { RequestHandler } from "express";
import { hasPermission, type Permission } from "@workspace/supabase";
import { ApiError } from "../lib/api-error";

export function requirePermission(permission: Permission): RequestHandler {
  return (req, _res, next) => {
    if (!req.admin) {
      next(new ApiError(401, "Authentication required"));
      return;
    }

    if (!hasPermission(req.admin.role, permission)) {
      next(new ApiError(403, "Insufficient permissions"));
      return;
    }

    next();
  };
}
