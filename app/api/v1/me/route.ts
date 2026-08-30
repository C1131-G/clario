import { auth } from "@/lib/auth";
import { errorResponseSchema } from "@/lib/server/errors";
import { requestIdFrom } from "@/lib/server/logger";

export const GET = async (request: Request) => {
  const requestId = requestIdFrom(request);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json(
      errorResponseSchema.parse({
        code: "UNAUTHENTICATED",
        message: "Sign in is required.",
        requestId,
      }),
      { headers: { "x-request-id": requestId }, status: 401 }
    );
  }

  return Response.json(
    { requestId, session: session.session, user: session.user },
    { headers: { "x-request-id": requestId } }
  );
};
