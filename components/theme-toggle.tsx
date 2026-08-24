"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => setTheme(nextTheme)}
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} weight="bold" />
      ) : (
        <Moon aria-hidden="true" size={18} weight="bold" />
      )}
    </button>
  );
};

export { ThemeToggle };
