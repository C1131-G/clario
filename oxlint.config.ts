import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins";
import next from "ultracite/oxlint/next";
import nextJsPlugins from "ultracite/oxlint/next/js-plugins";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [
    core,
    react,
    next,
    vitest,
    nextJsPlugins,
    antiSlop,
    selectJsPlugins(["sonarjs", "react-doctor"]),
  ],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    "components/ui/**",
    "hooks/use-mobile.ts",
  ],
  settings: jsPluginSettings,
});
