import { getServerEnvironment, hasHanaConfiguration } from "@/lib/server/env";

const environment = getServerEnvironment();

if (
  !environment.CLARIO_BOOTSTRAP_EMAIL ||
  !environment.CLARIO_BOOTSTRAP_PASSWORD
) {
  throw new Error(
    "Set CLARIO_BOOTSTRAP_EMAIL and CLARIO_BOOTSTRAP_PASSWORD before bootstrapping the first owner."
  );
}

if (!hasHanaConfiguration(environment)) {
  throw new Error(
    "Bootstrap requires CLARIO_HANA_HOST, CLARIO_HANA_USER, and CLARIO_HANA_PASSWORD. Run db:migrate first."
  );
}

throw new Error(
  "The owner bootstrap is intentionally blocked until the CLARIO HANA adapter is configured; no account was created."
);
