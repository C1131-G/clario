/* oxlint-disable eslint/no-use-before-define */
"use client";

import {
  DownloadSimple,
  Eye,
  EyeSlash,
  SidebarSimple,
} from "@phosphor-icons/react";

import { ChartCustomizer } from "@/components/clario/chart-customizer";
import { ChartDataTable } from "@/components/clario/chart-data-table";
import { ChartRenderer } from "@/components/clario/chart-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toCsv } from "@/lib/reporting/transform";
import type { ChartSpec, ReportArtifact } from "@/lib/reporting/types";

export const ReportWorkspace = ({
  report,
  spec,
  collapsed,
  onCollapse,
  onSpecChange,
  onReset,
  mobileVisible = false,
}: {
  report: ReportArtifact | null;
  spec: ChartSpec | null;
  collapsed: boolean;
  onCollapse: () => void;
  onSpecChange: (spec: ChartSpec) => void;
  onReset: () => void;
  mobileVisible?: boolean;
}) => {
  if (collapsed) {
    return (
      <aside
        aria-label="Report workspace"
        className="hidden w-12 border-l xl:block"
      >
        <Button
          aria-label="Expand report workspace"
          className="m-2"
          onClick={onCollapse}
          size="icon"
          type="button"
          variant="ghost"
        >
          <SidebarSimple aria-hidden="true" size={18} />
        </Button>
      </aside>
    );
  }
  if (!report || !spec) {
    return (
      <aside
        aria-label="Report workspace"
        className={`${mobileVisible ? "flex" : "hidden"} text-muted-foreground w-full items-center justify-center border-l px-6 text-center xl:flex xl:w-[26rem]`}
      >
        Submit a question to open a report.
      </aside>
    );
  }
  const csv = toCsv(report.dataset, spec);
  return (
    <aside
      aria-label="Report workspace"
      className={`${mobileVisible ? "flex" : "hidden"} bg-muted/10 min-h-0 w-full shrink-0 border-l xl:flex xl:w-[26rem] 2xl:w-[32rem]`}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-3 border-b p-5">
          <div>
            <Badge variant="secondary">Sample data</Badge>
            <h2 className="font-heading mt-3 text-2xl">{report.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {report.freshness}
            </p>
          </div>
          <Button
            aria-label="Collapse report workspace"
            onClick={onCollapse}
            size="icon"
            type="button"
            variant="ghost"
          >
            <SidebarSimple aria-hidden="true" size={18} />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-2">
            {report.metrics.map((metric) => (
              <Card key={metric.id} size="sm">
                <CardContent>
                  <p className="text-muted-foreground truncate text-xs">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{metric.value}</p>
                  <p className="mt-1 text-xs text-emerald-600">
                    {metric.comparison}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-4">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <h3 className="font-medium">{spec.title}</h3>
                <p className="text-muted-foreground text-xs">
                  {spec.description}
                </p>
              </div>
              <ChartCustomizer
                dataset={report.dataset}
                onChange={onSpecChange}
                onReset={onReset}
                spec={spec}
              />
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-3 grid w-full grid-cols-2">
                  <TabsTrigger value="chart">
                    <Eye aria-hidden="true" /> Chart
                  </TabsTrigger>
                  <TabsTrigger value="data">
                    <EyeSlash aria-hidden="true" /> Data
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <ChartRenderer dataset={report.dataset} spec={spec} />
                </TabsContent>
                <TabsContent value="data">
                  <ChartDataTable dataset={report.dataset} spec={spec} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Top customers</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartDataTable
                dataset={{
                  ...report.dataset,
                  fields: report.dataset.fields.filter(
                    (field) => field.id === "customer" || field.id === "sales"
                  ),
                  rows: report.topCustomers,
                }}
                spec={{
                  ...spec,
                  categoryField: "customer",
                  yFields: ["sales"],
                }}
              />
            </CardContent>
          </Card>
          <Separator className="my-4" />
          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xs">
            <span>{report.source}</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="min-h-11"
                    type="button"
                    variant="outline"
                  />
                }
              >
                <DownloadSimple aria-hidden="true" data-icon="inline-start" />{" "}
                Export
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    downloadFile(csv, "clario-report.csv", "text/csv")
                  }
                >
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadSvg()}>
                  Export SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadSvg(true)}>
                  Export PNG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};

const downloadFile = (content: string, filename: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadSvg = (png = false) => {
  const svg =
    document.querySelector("[data-slot='chart'] svg") ??
    document.querySelector("svg");
  if (!svg) {
    return;
  }
  const source = new XMLSerializer().serializeToString(svg);
  if (!png) {
    downloadFile(source, "clario-chart.svg", "image/svg+xml");
    return;
  }
  const image = new Image();
  image.addEventListener(
    "load",
    () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 640;
      canvas.getContext("2d")?.drawImage(image, 0, 0);
      downloadFile(
        canvas.toDataURL("image/png"),
        "clario-chart.png",
        "image/png"
      );
    },
    { once: true }
  );
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
};
