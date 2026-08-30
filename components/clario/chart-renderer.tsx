/* oxlint-disable anti-slop/no-runtime-typeof, anti-slop/no-chained-type-assertions, anti-slop/require-safety-comment-for-type-assertion, jsx-a11y/prefer-tag-over-role */
"use client";

import { areaY, barX, barY, dot, lineY } from "@tanstack/charts";
import { pie, polar, radialArc } from "@tanstack/charts/polar";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { Chart } from "@tanstack/react-charts";

import { formatValue, prepareChartRows } from "@/lib/reporting/transform";
import type { ChartSpec, Dataset } from "@/lib/reporting/types";

const marksFor = (dataset: Dataset, spec: ChartSpec) => {
  const rows: Record<string, string | number>[] = prepareChartRows(
    dataset,
    spec
  ).map((row) => ({
    [spec.categoryField]: row.category,
    ...Object.fromEntries(
      spec.yFields.map((field, index) => [field, row.values[index] ?? 0])
    ),
  }));
  const first = spec.yFields[0] ?? "value";
  const color = spec.series[0]?.color ?? "#3B82F6";
  const valueAccessor = (row: Record<string, string | number>) => {
    const value = row[first];
    return typeof value === "number" ? value : 0;
  };
  if (spec.kind === "pie" || spec.kind === "donut") {
    const slices = pie(rows, { value: valueAccessor });
    return [
      polar({
        marks: [
          radialArc(slices, {
            fill: color,
            innerRadius: spec.kind === "donut" ? 42 : 0,
            outerRadius: 104,
          }),
        ],
      }),
    ];
  }
  if (spec.kind === "scatter") {
    return [
      dot(rows, {
        fill: color,
        x: spec.categoryField as never,
        y: first as never,
      }),
    ];
  }
  if (spec.kind === "horizontal-bar") {
    return [
      barX(rows, {
        fill: color,
        x: first as never,
        y: spec.categoryField as never,
      }),
    ];
  }
  if (
    spec.kind === "bar" ||
    spec.kind === "grouped-bar" ||
    spec.kind === "stacked-bar"
  ) {
    return spec.yFields.map((field, index) =>
      barY(rows, {
        fill: spec.series[index]?.color ?? color,
        x: spec.categoryField as never,
        y: field as never,
      })
    );
  }
  if (spec.kind === "area") {
    return [
      areaY(rows, {
        fill: color,
        fillOpacity: 0.24,
        stroke: color,
        x: spec.categoryField as never,
        y: first as never,
      }),
    ];
  }
  if (spec.kind === "combo") {
    return [
      barY(rows, {
        fill: `${color}99`,
        x: spec.categoryField as never,
        y: first as never,
      }),
      lineY(rows, {
        stroke: spec.series[1]?.color ?? "#14B89A",
        x: spec.categoryField as never,
        y: (spec.yFields[1] ?? first) as never,
      }),
    ];
  }
  return [
    lineY(rows, {
      stroke: color,
      x: spec.categoryField as never,
      y: first as never,
    }),
  ];
};

export const ChartRenderer = ({
  dataset,
  spec,
}: {
  dataset: Dataset;
  spec: ChartSpec;
}) => {
  if (spec.kind === "kpi" || spec.kind === "sparkline") {
    const values = prepareChartRows(dataset, spec).map(
      (row) => row.values[0] ?? 0
    );
    const max = Math.max(...values, 1);
    return (
      <figure
        aria-label={spec.ariaLabel}
        className="bg-muted/20 flex min-h-56 items-end gap-1 overflow-hidden rounded-lg p-5"
      >
        {values.map((value, index) => (
          <span
            aria-hidden="true"
            className="bg-primary min-w-2 flex-1 rounded-t-sm"
            key={`${value}-${index}`}
            style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
          />
        ))}
        <span className="sr-only">
          {values.map((value) => formatValue(value, spec)).join(", ")}
        </span>
      </figure>
    );
  }
  const definition = {
    marks: marksFor(dataset, spec),
    x: { scale: spec.kind === "horizontal-bar" ? scaleLinear : scalePoint },
    y: { scale: spec.kind === "horizontal-bar" ? scalePoint : scaleLinear },
  } as unknown as Parameters<typeof Chart>[0]["definition"];
  return (
    <figure
      aria-label={spec.ariaLabel}
      className="bg-muted/20 min-h-56 overflow-hidden rounded-lg p-2"
    >
      <Chart
        ariaDescription={spec.description}
        ariaLabel={spec.ariaLabel}
        className="h-64 w-full"
        definition={definition}
        height={256}
        tabIndex={0}
      />
    </figure>
  );
};
