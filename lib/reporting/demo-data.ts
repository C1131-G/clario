import type {
  ChartKind,
  ChartSpec,
  Conversation,
  Dataset,
  LocalDataSource,
  ReportArtifact,
} from "@/lib/reporting/types";

const chartDefaults = (
  kind: ChartKind,
  dataset: Dataset,
  categoryField: string,
  yFields: readonly string[],
  title: string
): ChartSpec => ({
  aggregation: "sum",
  ariaLabel: `${title} chart using Clario demo data.`,
  categoryField,
  curve: "smooth",
  datasetId: dataset.id,
  description: `${title} from the SAP Business One demo dataset.`,
  formatting: {
    compact: false,
    currency: "USD",
    decimals: 0,
    notation: "currency",
  },
  kind,
  limit: 12,
  orientation: "vertical",
  palette: "clario",
  series: yFields.map((field, index) => ({
    color: ["#3B82F6", "#14B89A", "#F59E0B"][index] ?? "#8B5CF6",
    field,
    label: field,
  })),
  showGrid: true,
  showLabels: false,
  showLegend: yFields.length > 1,
  sort: "none",
  stacked: false,
  title,
  xField: categoryField,
  yFields,
  zeroBaseline: true,
});

const monthlySales: Dataset = {
  fields: [
    { id: "month", label: "Month", type: "date" },
    { id: "sales", label: "Sales", type: "number" },
    { id: "orders", label: "Orders", type: "number" },
  ],
  id: "monthly-sales",
  rows: [
    { month: "Jan", orders: 82, sales: 184_000 },
    { month: "Feb", orders: 91, sales: 205_000 },
    { month: "Mar", orders: 87, sales: 198_000 },
    { month: "Apr", orders: 104, sales: 237_000 },
    { month: "May", orders: 111, sales: 251_000 },
    { month: "Jun", orders: 119, sales: 268_000 },
  ],
  title: "Monthly sales",
};
const customers: Dataset = {
  fields: [
    { id: "customer", label: "Customer", type: "category" },
    { id: "sales", label: "Sales", type: "number" },
  ],
  id: "top-customers",
  rows: [
    { customer: "Northstar Retail", sales: 184_000 },
    { customer: "Apex Industries", sales: 161_000 },
    { customer: "Lumen Supply Co.", sales: 143_000 },
    { customer: "Bluebird Market", sales: 121_000 },
    { customer: "Cedar & Co.", sales: 98_000 },
  ],
  title: "Top customers",
};
const inventory: Dataset = {
  fields: [
    { id: "item", label: "Item", type: "category" },
    { id: "stock", label: "Stock on hand", type: "number" },
    { id: "reorder", label: "Reorder point", type: "number" },
  ],
  id: "low-stock",
  rows: [
    { item: "Industrial valve", reorder: 40, stock: 12 },
    { item: "Control panel", reorder: 25, stock: 18 },
    { item: "Pressure sensor", reorder: 60, stock: 31 },
    { item: "Drive belt", reorder: 30, stock: 9 },
    { item: "Safety relay", reorder: 20, stock: 15 },
  ],
  title: "Low-stock items",
};
const orders: Dataset = {
  fields: [
    { id: "month", label: "Month", type: "date" },
    { id: "purchase", label: "Purchase orders", type: "number" },
    { id: "sales", label: "Sales orders", type: "number" },
  ],
  id: "orders-comparison",
  rows: [
    { month: "Jan", purchase: 62, sales: 82 },
    { month: "Feb", purchase: 70, sales: 91 },
    { month: "Mar", purchase: 65, sales: 87 },
    { month: "Apr", purchase: 76, sales: 104 },
    { month: "May", purchase: 81, sales: 111 },
    { month: "Jun", purchase: 88, sales: 119 },
  ],
  title: "Purchase versus sales orders",
};

const report = (
  id: string,
  title: string,
  question: string,
  dataset: Dataset,
  kind: ChartKind,
  yFields: readonly string[],
  metrics: ReportArtifact["metrics"]
): ReportArtifact => ({
  chart: chartDefaults(
    kind,
    dataset,
    dataset.fields[0]?.id ?? "category",
    yFields,
    title
  ),
  dataset,
  description: `${title} is ready with local, read-only demonstration values.`,
  freshness: "Sample period · Jan–Jun 2025",
  id,
  metrics,
  question,
  source: "SAP B1 demo data · Read-only",
  technicalDetails:
    "Fixture adapter: local deterministic data. No SAP request was made.",
  title,
  topCustomers: customers.rows,
});

const salesReport = report(
  "monthly-sales-report",
  "Monthly sales and top customers",
  "Show monthly sales and top customers.",
  monthlySales,
  "line",
  ["sales"],
  [
    {
      comparison: "+12.4% vs prior period",
      id: "sales",
      label: "Total sales",
      trend: "up",
      value: "$1.34M",
    },
    {
      comparison: "+8.1% vs prior period",
      id: "orders",
      label: "Orders",
      trend: "up",
      value: "594",
    },
    {
      comparison: "+3.7% vs prior period",
      id: "average",
      label: "Average order",
      trend: "up",
      value: "$2,256",
    },
  ]
);
const totalSalesReport = report(
  "total-sales-report",
  "Total sales",
  "What were total sales last quarter?",
  monthlySales,
  "area",
  ["sales"],
  salesReport.metrics
);
const lowStockReport = report(
  "low-stock-report",
  "Low-stock items",
  "Show low-stock items",
  inventory,
  "bar",
  ["stock"],
  [
    {
      comparison: "5 items below reorder point",
      id: "low",
      label: "Items to review",
      trend: "down",
      value: "5",
    },
    {
      comparison: "-18% available stock",
      id: "stock",
      label: "Stock on hand",
      trend: "down",
      value: "85",
    },
    {
      comparison: "Local fixture",
      id: "locations",
      label: "Warehouses",
      trend: "neutral",
      value: "3",
    },
  ]
);
const orderReport = report(
  "orders-report",
  "Purchase versus sales orders",
  "Compare purchase and sales orders",
  orders,
  "grouped-bar",
  ["purchase", "sales"],
  [
    {
      comparison: "+18% vs purchases",
      id: "sales",
      label: "Sales orders",
      trend: "up",
      value: "594",
    },
    {
      comparison: "442 total",
      id: "purchase",
      label: "Purchase orders",
      trend: "neutral",
      value: "442",
    },
    {
      comparison: "+152 net",
      id: "gap",
      label: "Order gap",
      trend: "up",
      value: "152",
    },
  ]
);

const message = (
  id: string,
  role: "user" | "assistant",
  content: string,
  reportId?: string
) => ({
  content,
  id,
  parts: [
    { content, type: "text" as const },
    ...(reportId ? [{ reportId, type: "report" as const }] : []),
  ],
  role,
});

export const demoReports = [
  salesReport,
  totalSalesReport,
  lowStockReport,
  orderReport,
] as const;
export const demoConversations: readonly Conversation[] = [
  {
    id: "showcase-monthly",
    messages: [
      message("showcase-question", "user", salesReport.question),
      message(
        "showcase-answer",
        "assistant",
        salesReport.description,
        salesReport.id
      ),
    ],
    reportId: salesReport.id,
    title: salesReport.title,
    updatedAtLabel: "Today",
  },
  {
    id: "showcase-orders",
    messages: [
      message("orders-question", "user", orderReport.question),
      message(
        "orders-answer",
        "assistant",
        orderReport.description,
        orderReport.id
      ),
    ],
    reportId: orderReport.id,
    title: orderReport.title,
    updatedAtLabel: "Previous 7 days",
  },
];
export const suggestions = [
  "What were total sales last quarter?",
  "Which customers bought the most?",
  "Show low-stock items",
  "Compare purchase and sales orders",
] as const;

export const localDataSource: LocalDataSource = {
  answer(question) {
    const normalized = question.toLowerCase();
    let selected = salesReport;
    if (normalized.includes("stock")) {
      selected = lowStockReport;
    } else if (
      normalized.includes("purchase") ||
      normalized.includes("order")
    ) {
      selected = orderReport;
    } else if (normalized.includes("total")) {
      selected = totalSalesReport;
    }
    return {
      content: `I prepared a local demo report for “${question.trim()}”. ${selected.description}`,
      report: selected,
    };
  },
  getShowcase() {
    return demoConversations.map((conversation) => ({
      ...conversation,
      messages: [...conversation.messages],
    }));
  },
};
export const demoReport = salesReport;
export const getLocalResponse = (question: string) =>
  localDataSource.answer(question);
