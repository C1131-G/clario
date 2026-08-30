import { hasHanaConfiguration, getServerEnvironment } from "@/lib/server/env";
import { requestIdFrom } from "@/lib/server/logger";

export const GET = (request: Request) => {
  const requestId = requestIdFrom(request);
  const environment = getServerEnvironment();
  const hanaConfigured = hasHanaConfiguration(environment);
  return Response.json(
    {
      ai: environment.CLARIO_AI_MODE,
      hana: hanaConfigured ? "configured" : "not-configured",
      requestId,
      status: "ok",
    },
    { headers: { "x-request-id": requestId } }
  );
};
