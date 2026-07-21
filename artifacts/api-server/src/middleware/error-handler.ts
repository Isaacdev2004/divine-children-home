import type { ErrorRequestHandler, RequestHandler } from "express";
import { DatabaseError } from "@workspace/supabase";
import { isApiError } from "../lib/api-error";
import { sendError } from "../lib/error-response";
import { logger } from "../lib/logger";

export const notFoundHandler: RequestHandler = (req, res) => {
  sendError(req, res, 404, "Not found", { code: "NOT_FOUND" });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (isApiError(err)) {
    if (err.statusCode >= 500) {
      req.log?.error({ err, code: err.code }, err.message);
    }
    sendError(req, res, err.statusCode, err.message, {
      code: err.code,
      details: err.details,
    });
    return;
  }

  if (err instanceof DatabaseError) {
    req.log?.error({ err, code: err.code }, "Database error");
    sendError(req, res, 500, "A database error occurred", {
      code: "DATABASE_ERROR",
    });
    return;
  }

  req.log?.error({ err }, "Unhandled error");
  logger.error({ err }, "Unhandled API error");

  const message =
    process.env["NODE_ENV"] === "production"
      ? "Internal server error"
      : err instanceof Error
        ? err.message
        : "Internal server error";

  sendError(req, res, 500, message, { code: "INTERNAL_ERROR" });
};
