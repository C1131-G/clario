import "server-only";
import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    censor: "[REDACTED]",
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "apiKey",
      "secret",
      "sapPassword",
      "prompt",
      "messages",
      "rows",
    ],
  },
  ...(isDevelopment && {
    transport: {
      options: { colorize: true, singleLine: true },
      target: "pino-pretty",
    },
  }),
});

export const requestIdFrom = (request: Request) =>
  request.headers.get("x-request-id") ?? crypto.randomUUID();
