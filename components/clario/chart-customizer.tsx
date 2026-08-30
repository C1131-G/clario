/* oxlint-disable anti-slop/require-safety-comment-for-type-assertion */
"use client";

import { SlidersHorizontal } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ChartKind, ChartSpec, Dataset } from "@/lib/reporting/types";

const chartKinds: readonly { label: string; value: ChartKind }[] = [
  { label: "Line", value: "line" },
  { label: "Area", value: "area" },
  { label: "Vertical bars", value: "bar" },
  { label: "Horizontal bars", value: "horizontal-bar" },
  { label: "Grouped bars", value: "grouped-bar" },
  { label: "Stacked bars", value: "stacked-bar" },
  { label: "Line + bar", value: "combo" },
  { label: "Scatter", value: "scatter" },
  { label: "Pie", value: "pie" },
  { label: "Donut", value: "donut" },
  { label: "KPI", value: "kpi" },
  { label: "Sparkline", value: "sparkline" },
];

export const ChartCustomizer = ({
  dataset,
  spec,
  onChange,
  onReset,
}: {
  dataset: Dataset;
  spec: ChartSpec;
  onChange: (spec: ChartSpec) => void;
  onReset: () => void;
}) => {
  const set = <K extends keyof ChartSpec>(key: K, value: ChartSpec[K]) =>
    onChange({ ...spec, [key]: value });
  const numericFields = dataset.fields.filter(
    (field) => field.type === "number"
  );
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            aria-label="Customize chart"
            size="icon"
            type="button"
            variant="ghost"
          />
        }
      >
        <SlidersHorizontal aria-hidden="true" size={17} />
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Customize chart</SheetTitle>
          <SheetDescription>
            Adjust the report view. Changes stay in this browser session.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-4 pb-6">
          <Field>
            <FieldLabel>Chart type</FieldLabel>
            <Select
              onValueChange={(value) => set("kind", value as ChartKind)}
              value={spec.kind}
            >
              <SelectTrigger aria-label="Chart type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {chartKinds.map((kind) => (
                    <SelectItem key={kind.value} value={kind.value}>
                      {kind.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Measure</FieldLabel>
            <Select
              onValueChange={(value) => {
                if (value) {
                  set("yFields", [value]);
                }
              }}
              value={spec.yFields[0] ?? ""}
            >
              <SelectTrigger aria-label="Measure" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {numericFields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Aggregation</FieldLabel>
            <Select
              onValueChange={(value) =>
                set("aggregation", value as ChartSpec["aggregation"])
              }
              value={spec.aggregation}
            >
              <SelectTrigger aria-label="Aggregation" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["sum", "average", "count", "min", "max"].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Sort results</FieldLabel>
            <Select
              onValueChange={(value) => set("sort", value as ChartSpec["sort"])}
              value={spec.sort}
            >
              <SelectTrigger aria-label="Sort results" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    ["none", "Original order"],
                    ["asc", "Lowest first"],
                    ["desc", "Highest first"],
                  ].map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Result limit: {spec.limit}</FieldLabel>
            <Slider
              aria-label="Result limit"
              max={50}
              min={3}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : value;
                set("limit", Number(next ?? spec.limit));
              }}
              step={1}
              value={[spec.limit]}
            />
          </Field>
          <div className="space-y-3">
            {(
              [
                ["showLegend", "Show legend", "Identify each series"],
                ["showLabels", "Show labels", "Print values on marks"],
                ["showGrid", "Show grid", "Add reading guides"],
                ["zeroBaseline", "Start at zero", "Keep a consistent baseline"],
              ] as const
            ).map(([key, label, description]) => (
              <Field orientation="horizontal" key={key}>
                <FieldContent>
                  <FieldLabel>{label}</FieldLabel>
                  <FieldDescription>{description}</FieldDescription>
                </FieldContent>
                <Switch
                  checked={spec[key]}
                  onCheckedChange={(checked) => set(key, checked)}
                />
              </Field>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={onReset}
            type="button"
            variant="outline"
          >
            Reset chart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
