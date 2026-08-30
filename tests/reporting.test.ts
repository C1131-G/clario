import { describe, expect, it } from "vitest";

import { demoReport, localDataSource } from "@/lib/reporting/demo-data";
import {
  formatValue,
  prepareChartRows,
  toCsv,
} from "@/lib/reporting/transform";
import type { ChartSpec } from "@/lib/reporting/types";

const spec = demoReport.chart;

describe("local reporting pipeline", () => {
  it("returns distinct deterministic fixture reports", () => {
    expect(localDataSource.answer("Show low-stock items").report.id).toBe(
      "low-stock-report"
    );
    expect(
      localDataSource.answer("Compare purchase and sales orders").report.id
    ).toBe("orders-report");
    expect(
      localDataSource.answer("What were total sales last quarter?").report.id
    ).toBe("total-sales-report");
  });

  it("sorts and limits transformed rows without mutating fixtures", () => {
    const sorted: ChartSpec = { ...spec, limit: 2, sort: "desc" };
    expect(
      prepareChartRows(demoReport.dataset, sorted).map((row) => row.aggregate)
    ).toStrictEqual([268_000, 251_000]);
    expect(demoReport.dataset.rows).toHaveLength(6);
  });

  it("formats chart values and exports the same transformed values", () => {
    expect(formatValue(1_340_000, spec)).toBe("$1,340,000");
    const csv = toCsv(demoReport.dataset, { ...spec, limit: 2 });
    expect(csv).toContain("Month,Sales");
    expect(csv).toContain('"Jan","184000"');
  });
});
