import { z } from "zod";

import type { ServiceLayerClient } from "@/lib/sap/service-layer";
import { AppError } from "@/lib/server/errors";

const serviceLayerRowsSchema = z.object({
  value: z.array(z.record(z.string(), z.unknown())),
});

export type BusinessQuery =
  | { kind: "monthly-sales"; from?: string; to?: string }
  | { kind: "top-customers"; limit: number }
  | { kind: "low-stock"; limit: number }
  | { kind: "orders-comparison"; from?: string; to?: string };

const pathFor = (query: BusinessQuery) => {
  switch (query.kind) {
    case "monthly-sales": {
      return "/Invoices?$select=DocDate,DocTotal,DocumentStatus&$orderby=DocDate";
    }
    case "top-customers": {
      return `/Invoices?$select=CardCode,CardName,DocTotal&$orderby=DocTotal desc&$top=${Math.min(query.limit, 100)}`;
    }
    case "low-stock": {
      return `/Items?$select=ItemCode,ItemName,QuantityOnStock,QuantityOrdered&$top=${Math.min(query.limit, 100)}`;
    }
    case "orders-comparison": {
      return "/Orders?$select=DocDate,DocTotal,DocumentStatus&$orderby=DocDate";
    }
    default: {
      const exhaustive: never = query;
      throw new AppError(
        "INVALID_REQUEST",
        `Unsupported query ${exhaustive}`,
        400
      );
    }
  }
};

export const runBusinessQuery = async (
  client: ServiceLayerClient,
  query: BusinessQuery
) => {
  const payload = await client.get<unknown>(pathFor(query));
  const parsed = serviceLayerRowsSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AppError(
      "SAP_UNAVAILABLE",
      "SAP returned an invalid data response.",
      502
    );
  }
  return parsed.data.value;
};
