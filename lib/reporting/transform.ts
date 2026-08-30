/* oxlint-disable anti-slop/no-runtime-typeof */
import type { ChartSpec, DataValue, Dataset } from "@/lib/reporting/types";

const numberFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});
const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (notation: string, currency: string, decimals: number) => {
  const key = `${notation}:${currency}:${decimals}`;
  const existing = formatterCache.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.NumberFormat(
    "en-US",
    notation === "currency"
      ? {
          currency,
          maximumFractionDigits: decimals,
          minimumFractionDigits: decimals,
          style: "currency",
        }
      : { maximumFractionDigits: decimals, minimumFractionDigits: decimals }
  );
  formatterCache.set(key, formatter);
  return formatter;
};

export const numberValue = (value: DataValue) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export const formatValue = (value: number, spec: ChartSpec) => {
  if (spec.formatting.notation === "currency") {
    return getFormatter(
      "currency",
      spec.formatting.currency,
      spec.formatting.decimals
    ).format(value);
  }
  if (spec.formatting.notation === "percent") {
    return `${getFormatter("percent", "", spec.formatting.decimals).format(value)}%`;
  }
  if (spec.formatting.notation === "compact" || spec.formatting.compact) {
    return compactFormatter.format(value);
  }
  return numberFormatter.format(value);
};

export const prepareChartRows = (dataset: Dataset, spec: ChartSpec) => {
  const rows = dataset.rows.map((row) => {
    const values = spec.yFields.map((field) => numberValue(row[field]));
    const total = values.reduce((sum, value) => sum + value, 0);
    let aggregate = total;
    if (spec.aggregation === "count") {
      aggregate = values.length;
    }
    if (spec.aggregation === "average") {
      aggregate = total / Math.max(values.length, 1);
    }
    if (spec.aggregation === "min") {
      aggregate = Math.min(...values);
    }
    if (spec.aggregation === "max") {
      aggregate = Math.max(...values);
    }
    return { aggregate, category: row[spec.categoryField] ?? "", values };
  });
  const sorted =
    spec.sort === "none"
      ? rows
      : rows.toSorted((a, b) =>
          spec.sort === "asc"
            ? a.aggregate - b.aggregate
            : b.aggregate - a.aggregate
        );
  return sorted.slice(0, Math.max(1, spec.limit));
};

export const toCsv = (dataset: Dataset, spec: ChartSpec) => {
  const header = [
    dataset.fields.find((field) => field.id === spec.categoryField)?.label ??
      spec.categoryField,
    ...spec.yFields.map(
      (field) =>
        dataset.fields.find((item) => item.id === field)?.label ?? field
    ),
  ];
  const body = prepareChartRows(dataset, spec).map((row) =>
    [row.category, ...row.values]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );
  return [header.join(","), ...body].join("\n");
};
