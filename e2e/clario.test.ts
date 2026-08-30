import { AxeBuilder } from "@axe-core/playwright";
import { expect as pwExpect, test as pwTest } from "@playwright/test";

pwTest(
  "showcase supports chat, report, and history flows",
  async ({ page }, testInfo) => {
    await page.goto("/");
    await pwExpect(
      page.getByRole("heading", { name: "Ask Clario" })
    ).toBeVisible();
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    }
    await page.getByRole("button", { name: "New chat" }).click();
    await pwExpect(
      page.getByText("What would you like to know?", { exact: true })
    ).toBeVisible();
    const composer = page.getByLabel(
      "Ask a question about your SAP Business One data"
    );
    await composer.fill("Show low-stock items");
    await composer.press("Enter");
    await pwExpect(
      page.getByText("Show low-stock items").first()
    ).toBeVisible();
    if (testInfo.project.name === "mobile") {
      await page.getByRole("tab", { name: "Report" }).click();
    } else {
      await pwExpect(
        page.getByRole("button", { name: "Open report workspace" })
      ).toBeVisible();
      await page.getByRole("button", { name: "Open report workspace" }).click();
    }
    await pwExpect(
      page
        .getByRole("heading", { exact: true, name: "Low-stock items" })
        .first()
    ).toBeVisible();
    await page.getByRole("button", { name: "Customize chart" }).click();
    await pwExpect(
      page.getByRole("heading", { name: "Customize chart" })
    ).toBeVisible();
  }
);

pwTest(
  "history can search and destructive actions are labelled",
  async ({ page }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Toggle Sidebar" }).click();
    }
    await page.getByLabel("Search conversations").fill("orders");
    await pwExpect(
      page.getByText("Purchase versus sales orders")
    ).toBeVisible();
    await pwExpect(
      page.getByRole("button", { name: /Actions for/u }).first()
    ).toBeVisible();
  }
);

pwTest(
  "mobile layout has no horizontal overflow and passes axe",
  async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 320 });
    await page.goto("/");
    pwExpect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth
      )
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .exclude("[data-slot='resizable-handle']")
      .analyze();
    pwExpect(results.violations).toEqual([]);
  }
);
