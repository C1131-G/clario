import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    colorScheme: "light",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun run dev",
    reuseExistingServer: true,
    timeout: 120_000,
    url: "http://127.0.0.1:3000",
  },
});
