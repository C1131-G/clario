/* oxlint-disable promise/avoid-new, promise/prefer-await-to-callbacks, anti-slop/no-unsafe-dictionary-type, eslint/no-use-before-define */
import "server-only";
import hana from "@sap/hana-client";

import { getServerEnvironment, hasHanaConfiguration } from "@/lib/server/env";
import { AppError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";

type HanaRow = Readonly<Record<string, unknown>>;

const connect = (
  connection: hana.Connection,
  options: hana.ConnectionOptions
) =>
  new Promise<void>((resolve, reject) => {
    connection.connect(options, (error) => (error ? reject(error) : resolve()));
  });

const disconnect = (connection: hana.Connection) =>
  new Promise<void>((resolve) => {
    connection.disconnect(() => resolve());
  });

export const withHana = async <T>(
  operation: (connection: hana.Connection) => Promise<T>
): Promise<T> => {
  const environment = getServerEnvironment();
  if (!hasHanaConfiguration(environment)) {
    throw new AppError(
      "DEPENDENCY_UNAVAILABLE",
      "SAP HANA is not configured for this installation.",
      503
    );
  }
  const connection = hana.createConnection();
  try {
    await connect(connection, hanaConnectionOptions());
    return await operation(connection);
  } catch (error) {
    logger.error({ err: error }, "SAP HANA operation failed");
    throw new AppError(
      "DEPENDENCY_UNAVAILABLE",
      "SAP HANA is unavailable.",
      503
    );
  } finally {
    await disconnect(connection);
  }
};

export const execute = <T extends HanaRow>(
  connection: hana.Connection,
  sql: string,
  params: hana.HanaParameterType[] = []
) =>
  new Promise<readonly T[]>((resolve, reject) => {
    connection.exec<T[]>(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows ?? []);
    });
  });

export const executeCommand = (
  connection: hana.Connection,
  sql: string,
  params: hana.HanaParameterType[] = []
) =>
  new Promise<void>((resolve, reject) => {
    connection.exec(sql, params, (error) =>
      error ? reject(error) : resolve()
    );
  });

export const hanaConnectionOptions = () => {
  const environment = getServerEnvironment();
  if (!hasHanaConfiguration(environment)) {
    throw new AppError(
      "DEPENDENCY_UNAVAILABLE",
      "SAP HANA is not configured for this installation.",
      503
    );
  }
  return {
    encrypt: true,
    host: environment.CLARIO_HANA_HOST,
    port: environment.CLARIO_HANA_PORT,
    pwd: environment.CLARIO_HANA_PASSWORD,
    uid: environment.CLARIO_HANA_USER,
  } satisfies hana.ConnectionOptions;
};
