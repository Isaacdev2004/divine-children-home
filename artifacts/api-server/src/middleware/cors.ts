import type { RequestHandler } from "express";
import cors from "cors";

const allowedOrigins = process.env["CORS_ORIGIN"]?.split(",").map((o) => o.trim());

export const corsMiddleware: RequestHandler = cors({
  origin: allowedOrigins?.length ? allowedOrigins : true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
