import { getLocalResponse } from "@/lib/reporting/demo-data";
import {
  chatRequestSchema,
  reportResponseSchema,
} from "@/lib/reporting/schemas";
import { getServerEnvironment } from "@/lib/server/env";
import { AppError, toErrorResponse } from "@/lib/server/errors";
import { requestIdFrom } from "@/lib/server/logger";

export const POST = async (request: Request) => {
  const requestId = requestIdFrom(request);
  try {
    const body = await request.json();
    const input = chatRequestSchema.safeParse(body);
    if (!input.success) {
      throw new AppError(
        "INVALID_REQUEST",
        "The chat request is invalid.",
        400
      );
    }
    const environment = getServerEnvironment();
    if (environment.CLARIO_AI_MODE === "live") {
      throw new AppError(
        "AI_NOT_CONFIGURED",
        "A live TanStack AI provider is not configured yet.",
        503
      );
    }
    const response = reportResponseSchema.parse(
      getLocalResponse(input.data.message)
    );
    return Response.json(
      { ...response, mode: "demo", requestId },
      { headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    const response = toErrorResponse(error, requestId);
    const status = error instanceof AppError ? error.status : 500;
    return Response.json(response, {
      headers: { "x-request-id": requestId },
      status,
    });
  }
};
