import { describe, expect, it } from "vitest";

import { openApiDocument } from "@/lib/server/openapi";

describe("OpenAPI contract", () => {
  it("publishes an OpenAPI 3.1 document from shared schemas", () => {
    expect(openApiDocument.openapi).toBe("3.1.0");
    expect(openApiDocument.paths?.["/chat"]?.post?.operationId).toBe(
      "createChatRun"
    );
    expect(openApiDocument.components?.securitySchemes).toHaveProperty(
      "sessionCookie"
    );
  });
});
