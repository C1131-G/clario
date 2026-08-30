import { z } from "zod";

const dataValueSchema = z.union([z.string(), z.number(), z.null()]);
const fieldTypeSchema = z.enum(["category", "date", "number"]);
const aggregationSchema = z.enum(["sum", "average", "count", "min", "max"]);
const sortDirectionSchema = z.enum(["asc", "desc", "none"]);

const chartKindSchema = z.enum([
  "line",
  "area",
  "bar",
  "horizontal-bar",
  "grouped-bar",
  "stacked-bar",
  "combo",
  "scatter",
  "pie",
  "donut",
  "kpi",
  "sparkline",
]);

export const datasetFieldSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: fieldTypeSchema,
});

export const datasetSchema = z.object({
  fields: z.array(datasetFieldSchema),
  id: z.string().min(1),
  rows: z.array(z.record(z.string(), dataValueSchema)),
  title: z.string().min(1),
});

export const chartFormattingSchema = z.object({
  compact: z.boolean(),
  currency: z.string().length(3),
  decimals: z.number().int().min(0).max(4),
  notation: z.enum(["number", "currency", "percent", "compact"]),
});

export const chartSeriesSchema = z.object({
  aggregation: aggregationSchema.optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/u),
  field: z.string().min(1),
  label: z.string().min(1),
});

export const chartSpecSchema = z.object({
  aggregation: aggregationSchema,
  ariaLabel: z.string().min(1),
  categoryField: z.string().min(1),
  curve: z.enum(["linear", "smooth"]),
  datasetId: z.string().min(1),
  description: z.string().min(1),
  formatting: chartFormattingSchema,
  kind: chartKindSchema,
  limit: z.number().int().min(1).max(500),
  orientation: z.enum(["vertical", "horizontal"]),
  palette: z.enum(["clario", "ocean", "sunset", "mono"]),
  series: z.array(chartSeriesSchema).min(1),
  showGrid: z.boolean(),
  showLabels: z.boolean(),
  showLegend: z.boolean(),
  sort: sortDirectionSchema,
  stacked: z.boolean(),
  title: z.string().min(1),
  xField: z.string().min(1),
  yFields: z.array(z.string().min(1)).min(1),
  zeroBaseline: z.boolean(),
});

export const metricSchema = z.object({
  comparison: z.string().min(1),
  id: z.string().min(1),
  label: z.string().min(1),
  trend: z.enum(["up", "down", "neutral"]),
  value: z.string().min(1),
});

export const reportArtifactSchema = z.object({
  chart: chartSpecSchema,
  dataset: datasetSchema,
  description: z.string().min(1),
  freshness: z.string().min(1),
  id: z.string().min(1),
  metrics: z.array(metricSchema),
  question: z.string().min(1),
  source: z.string().min(1),
  technicalDetails: z.string().optional(),
  title: z.string().min(1),
  topCustomers: z.array(z.record(z.string(), dataValueSchema)),
});

export const chatRequestSchema = z.object({
  conversationId: z.uuid().optional(),
  message: z.string().trim().min(2).max(4000),
  workspaceId: z.uuid(),
});

export const reportResponseSchema = z.object({
  content: z.string().min(1),
  report: reportArtifactSchema,
});

export type ReportResponse = z.infer<typeof reportResponseSchema>;
