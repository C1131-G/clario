/* oxlint-disable anti-slop/no-unknown-parameters */
import { z } from "zod";

export const appErrorCodeSchema = z.enum([
  "AUTHENTICATION_REQUIRED",
  "FORBIDDEN",
  "INVALID_REQUEST",
  "NOT_FOUND",
  "RATE_LIMITED",
  "SAP_UNAVAILABLE",
  "AI_NOT_CONFIGURED",
  "DEPENDENCY_UNAVAILABLE",
  "INTERNAL_ERROR",
]);

export type AppErrorCode = z.infer<typeof appErrorCodeSchema>;

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly fields?: Readonly<Record<string, string>>;

  constructor(
    code: AppErrorCode,
    message: string,
    status: number,
    fields?: Readonly<Record<string, string>>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

export const errorResponseSchema = z.object({
  code: appErrorCodeSchema,
  fields: z.record(z.string(), z.string()).optional(),
  message: z.string(),
  requestId: z.string(),
});

export const toErrorResponse = (error: unknown, requestId: string) => {
  if (error instanceof AppError) {
    return {
      code: error.code,
      fields: error.fields,
      message: error.message,
      requestId,
    };
  }
  return {
    code: "INTERNAL_ERROR" as const,
    message: "The request could not be completed.",
    requestId,
  };
};
