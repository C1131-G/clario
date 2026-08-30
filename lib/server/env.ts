import "server-only";
import { z } from "zod";

const environmentSchema = z.object({
  BETTER_AUTH_URL: z.url().optional(),
  CLARIO_AI_API_KEY: z.string().min(1).optional(),
  CLARIO_AI_BASE_URL: z.url().optional(),
  CLARIO_AI_MODE: z.enum(["demo", "live"]).default("demo"),
  CLARIO_AI_MODEL: z.string().min(1).optional(),
  CLARIO_AI_PROVIDER: z.string().min(1).optional(),
  CLARIO_AUTH_SECRET: z
    .string()
    .min(32)
    .default("local-development-secret-change-me"),
  CLARIO_BOOTSTRAP_EMAIL: z.email().optional(),
  CLARIO_BOOTSTRAP_NAME: z.string().min(1).optional(),
  CLARIO_BOOTSTRAP_PASSWORD: z.string().min(12).optional(),
  CLARIO_HANA_ENCRYPTION_KEY: z.string().length(64).optional(),
  CLARIO_HANA_HOST: z.string().min(1).optional(),
  CLARIO_HANA_PASSWORD: z.string().min(1).optional(),
  CLARIO_HANA_PORT: z.coerce.number().int().positive().default(30_015),
  CLARIO_HANA_SCHEMA: z
    .string()
    .regex(/^[A-Z][A-Z0-9_]*$/u)
    .default("CLARIO"),
  CLARIO_HANA_USER: z.string().min(1).optional(),
  CLARIO_SAP_SERVICE_LAYER_URL: z.url().optional(),
  CLARIO_SAP_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type ServerEnvironment = z.infer<typeof environmentSchema>;

let cachedEnvironment: ServerEnvironment | undefined;

export const getServerEnvironment = (): ServerEnvironment => {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }
  const parsed = environmentSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${z.prettifyError(parsed.error)}`
    );
  }
  if (
    parsed.data.CLARIO_AI_MODE === "live" &&
    (!parsed.data.CLARIO_AI_PROVIDER || !parsed.data.CLARIO_AI_MODEL)
  ) {
    throw new Error(
      "Live AI mode requires CLARIO_AI_PROVIDER and CLARIO_AI_MODEL."
    );
  }
  cachedEnvironment = parsed.data;
  return parsed.data;
};

export const hasHanaConfiguration = (environment: ServerEnvironment) =>
  Boolean(
    environment.CLARIO_HANA_HOST &&
    environment.CLARIO_HANA_USER &&
    environment.CLARIO_HANA_PASSWORD
  );
