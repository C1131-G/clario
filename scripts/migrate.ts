import { readFile } from "node:fs/promises";
import path from "node:path";

import { executeCommand, withHana } from "@/lib/server/hana";

const migrationPath = path.join(
  process.cwd(),
  "database",
  "migrations",
  "0001_clario.sql"
);

const run = async () => {
  const sql = await readFile(migrationPath, "utf-8");
  const statements = sql
    .split(/;\s*(?:\r?\n|$)/u)
    .map((statement) => statement.trim())
    .filter(Boolean);
  await withHana(async (connection) => {
    await Promise.all(
      statements.map((statement) => executeCommand(connection, statement))
    );
    await executeCommand(
      connection,
      `MERGE INTO "CLARIO"."schema_migrations" AS target USING (SELECT ? AS "version" FROM DUMMY) AS source ON target."version" = source."version" WHEN NOT MATCHED THEN INSERT ("version") VALUES (source."version")`,
      ["0001_clario"]
    );
  });
};

await run();
