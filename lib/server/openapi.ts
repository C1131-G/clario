import { createDocument } from "zod-openapi";

import {
  chatRequestSchema,
  reportResponseSchema,
} from "@/lib/reporting/schemas";
import { errorResponseSchema } from "@/lib/server/errors";

export const openApiDocument = createDocument({
  components: {
    securitySchemes: {
      sessionCookie: {
        description: "Better Auth HTTP-only session cookie.",
        in: "cookie",
        name: "better-auth.session_token",
        type: "apiKey",
      },
    },
  },
  info: {
    description:
      "Authenticated conversational business intelligence for SAP Business One.",
    title: "Clario API",
    version: "1.0.0",
  },
  openapi: "3.1.0",
  paths: {
    "/chat": {
      post: {
        description:
          "Answers a business question and returns a validated report artifact.",
        operationId: "createChatRun",
        requestBody: {
          content: { "application/json": { schema: chatRequestSchema } },
        },
        responses: {
          "200": {
            content: { "application/json": { schema: reportResponseSchema } },
            description: "A validated assistant response and report artifact.",
          },
          "400": {
            content: { "application/json": { schema: errorResponseSchema } },
            description: "The request failed validation.",
          },
          "401": {
            content: { "application/json": { schema: errorResponseSchema } },
            description: "Authentication is required.",
          },
          "503": {
            content: { "application/json": { schema: errorResponseSchema } },
            description: "The configured AI or data dependency is unavailable.",
          },
        },
        security: [{ sessionCookie: [] }],
      },
    },
    "/health/live": {
      get: {
        description: "Confirms that the Clario process is running.",
        operationId: "getLiveness",
        responses: { "200": { description: "Process is healthy." } },
      },
    },
    "/health/ready": {
      get: {
        description:
          "Reports configured dependency readiness without exposing secrets.",
        operationId: "getReadiness",
        responses: { "200": { description: "Readiness state returned." } },
      },
    },
  },
  servers: [{ description: "Current Clario installation", url: "/api/v1" }],
});
