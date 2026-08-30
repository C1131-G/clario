import { openApiDocument } from "@/lib/server/openapi";

export const GET = () => Response.json(openApiDocument);
