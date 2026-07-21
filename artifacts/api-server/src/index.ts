import { validateEnv } from "./lib/env";
import { logger } from "./lib/logger";

validateEnv();

const { default: app } = await import("./app");

const port = Number(process.env.PORT);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info(
    { port, env: process.env.NODE_ENV ?? "development" },
    "Server listening",
  );
});
