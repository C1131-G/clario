/* oxlint-disable anti-slop/no-runtime-typeof, react-doctor/no-array-index-as-key */
import type { ChartSpec, DataValue, Dataset } from "@/lib/reporting/types";

const display = (value: DataValue, spec: ChartSpec) =>
  typeof value === "number"
    ? new Intl.NumberFormat("en-US", {
        currency: spec.formatting.currency,
        maximumFractionDigits: spec.formatting.decimals,
        notation:
          spec.formatting.notation === "compact" ? "compact" : "standard",
        style: spec.formatting.notation === "currency" ? "currency" : "decimal",
      }).format(value)
    : String(value ?? "—");
export const ChartDataTable = ({
  dataset,
  spec,
}: {
  dataset: Dataset;
  spec: ChartSpec;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Accessible data for {spec.title}</caption>
      <thead className="text-muted-foreground border-b text-xs tracking-wide uppercase">
        <tr>
          <th className="px-3 py-2" scope="col">
            {
              dataset.fields.find((field) => field.id === spec.categoryField)
                ?.label
            }
          </th>
          {spec.yFields.map((field) => (
            <th className="px-3 py-2 text-right" key={field} scope="col">
              {dataset.fields.find((item) => item.id === field)?.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataset.rows.slice(0, spec.limit).map((row, index) => (
          <tr
            className="border-b last:border-0"
            key={`${String(row[spec.categoryField])}-${index}`}
          >
            <th className="px-3 py-2 font-medium" scope="row">
              {String(row[spec.categoryField] ?? "—")}
            </th>
            {spec.yFields.map((field) => (
              <td className="px-3 py-2 text-right tabular-nums" key={field}>
                {display(row[field], spec)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
