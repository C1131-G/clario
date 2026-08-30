import { describe, expect, it } from "vitest";

import { GET as getLive } from "@/app/api/v1/health/live/route";

describe("health route integration contract", () => {
  it("returns a live status without external services", async () => {
    const response = getLive();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ status: "ok" });
  });
});
