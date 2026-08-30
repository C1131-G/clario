export type DataValue = string | number | null;
export type FieldType = "category" | "date" | "number";
export type ChartKind =
  | "line"
  | "area"
  | "bar"
  | "horizontal-bar"
  | "grouped-bar"
  | "stacked-bar"
  | "combo"
  | "scatter"
  | "pie"
  | "donut"
  | "kpi"
  | "sparkline";
export type Aggregation = "sum" | "average" | "count" | "min" | "max";
export type SortDirection = "asc" | "desc" | "none";
export type NumberNotation = "number" | "currency" | "percent" | "compact";

export interface DatasetField {
  id: string;
  label: string;
  type: FieldType;
}

export interface Dataset {
  id: string;
  title: string;
  fields: readonly DatasetField[];
  rows: readonly Readonly<Record<string, DataValue>>[];
}

export interface ChartSeries {
  field: string;
  label: string;
  color: string;
  aggregation?: Aggregation;
}

export interface ChartFormatting {
  notation: NumberNotation;
  currency: string;
  decimals: number;
  compact: boolean;
}

export interface ChartSpec {
  kind: ChartKind;
  title: string;
  description: string;
  datasetId: string;
  categoryField: string;
  xField: string;
  yFields: readonly string[];
  aggregation: Aggregation;
  sort: SortDirection;
  limit: number;
  orientation: "vertical" | "horizontal";
  stacked: boolean;
  showLegend: boolean;
  showLabels: boolean;
  showGrid: boolean;
  zeroBaseline: boolean;
  curve: "linear" | "smooth";
  palette: "clario" | "ocean" | "sunset" | "mono";
  series: readonly ChartSeries[];
  formatting: ChartFormatting;
  ariaLabel: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  comparison: string;
  trend: "up" | "down" | "neutral";
}

export type MessagePart =
  | { type: "text"; content: string }
  | { type: "status"; label: string; state: "complete" | "running" | "error" }
  | { type: "report"; reportId: string };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts: readonly MessagePart[];
}

export interface ReportArtifact {
  id: string;
  title: string;
  question: string;
  description: string;
  metrics: readonly Metric[];
  dataset: Dataset;
  chart: ChartSpec;
  topCustomers: readonly Readonly<Record<string, DataValue>>[];
  source: string;
  freshness: string;
  technicalDetails?: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAtLabel: "Today" | "Previous 7 days";
  messages: readonly ChatMessage[];
  reportId?: string;
}

export interface LocalDataSource {
  getShowcase: () => Conversation[];
  answer: (question: string) => { content: string; report: ReportArtifact };
}
