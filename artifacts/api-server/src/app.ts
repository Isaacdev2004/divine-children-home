import express, { type Express } from "express";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import router from "./routes";
import adminRouter from "./routes/admin";
import { logger } from "./lib/logger";
import { corsMiddleware } from "./middleware/cors";
import { securityHeaders } from "./middleware/security-headers";
import { apiRateLimit } from "./middleware/rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { getEnv } from "./lib/env";

const env = getEnv();

const app: Express = express();

if (env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
    genReqId(req, res) {
      const existing = req.headers["x-request-id"];
      if (typeof existing === "string" && existing.length > 0) {
        return existing;
      }
      const id = randomUUID();
      res.setHeader("X-Request-Id", id);
      return id;
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", apiRateLimit, router);
app.use("/api/admin", apiRateLimit, adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
