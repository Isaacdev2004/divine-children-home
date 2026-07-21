import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app";

describe("GET /api/healthz", () => {
  it("returns 200 with ok status", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("includes X-Request-Id header", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.headers["x-request-id"]).toBeDefined();
  });
});

describe("404 handler", () => {
  it("returns structured error for unknown routes", async () => {
    const res = await request(app).get("/api/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not found");
    expect(res.body.code).toBe("NOT_FOUND");
    expect(res.body.requestId).toBeDefined();
  });
});

describe("Security headers", () => {
  it("sets security headers on responses", async () => {
    const res = await request(app).get("/api/healthz");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
  });
});
