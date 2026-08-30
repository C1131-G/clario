import { z } from "zod";

import { getServerEnvironment } from "@/lib/server/env";
import { AppError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";

const loginResponseSchema = z.object({
  SessionId: z.string().min(1),
  Version: z.string().optional(),
});

const serviceLayerErrorSchema = z.object({
  error: z.object({
    code: z.union([z.string(), z.number()]),
    message: z.object({ value: z.string() }),
  }),
});

export type ServiceLayerConfig = Readonly<{
  baseUrl: string;
  companyDb: string;
  userName: string;
  password: string;
}>;

export type ServiceLayerSession = Readonly<{
  sessionId: string;
  version?: string;
}>;

const jsonHeaders = {
  accept: "application/json",
  "content-type": "application/json",
};

export class ServiceLayerClient {
  readonly #config: ServiceLayerConfig;
  readonly #timeoutMs: number;
  #session: ServiceLayerSession | undefined;

  constructor(
    config: ServiceLayerConfig,
    timeoutMs = getServerEnvironment().CLARIO_SAP_TIMEOUT_MS
  ) {
    this.#config = config;
    this.#timeoutMs = timeoutMs;
  }

  async login(): Promise<ServiceLayerSession> {
    const response = await this.request("/Login", {
      body: JSON.stringify({
        CompanyDB: this.#config.companyDb,
        Password: this.#config.password,
        UserName: this.#config.userName,
      }),
      method: "POST",
    });
    const payload = loginResponseSchema.safeParse(await response.json());
    if (!payload.success) {
      throw new AppError(
        "SAP_UNAVAILABLE",
        "SAP Service Layer login failed.",
        502
      );
    }
    this.#session = {
      sessionId: payload.data.SessionId,
      ...(payload.data.Version && { version: payload.data.Version }),
    };
    return this.#session;
  }

  async get<T>(path: string): Promise<T> {
    if (!this.#session) {
      await this.login();
    }
    const response = await this.request(path, {
      headers: {
        ...jsonHeaders,
        cookie: `B1SESSION=${this.#session?.sessionId}`,
      },
      method: "GET",
    });
    if (response.status === 401) {
      await this.login();
      return this.get<T>(path);
    }
    if (!response.ok) {
      const error = serviceLayerErrorSchema.safeParse(await response.json());
      throw new AppError(
        "SAP_UNAVAILABLE",
        error.success
          ? error.data.error.message.value
          : "SAP Service Layer returned an error.",
        502
      );
    }
    // SAFETY: callers validate this payload against their endpoint schema.
    return (await response.json()) as T;
  }

  async logout(): Promise<void> {
    if (!this.#session) {
      return;
    }
    try {
      await this.request("/Logout", {
        headers: {
          ...jsonHeaders,
          cookie: `B1SESSION=${this.#session.sessionId}`,
        },
        method: "POST",
      });
    } finally {
      this.#session = undefined;
    }
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.#timeoutMs);
    try {
      const response = await fetch(
        `${this.#config.baseUrl.replace(/\/$/u, "")}${path}`,
        {
          ...init,
          signal: controller.signal,
        }
      );
      logger.info(
        { path, status: response.status },
        "SAP Service Layer request completed"
      );
      return response;
    } catch (error) {
      logger.warn({ err: error, path }, "SAP Service Layer request failed");
      throw new AppError(
        "SAP_UNAVAILABLE",
        "SAP Service Layer is unavailable.",
        502
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
