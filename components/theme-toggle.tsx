"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <Button
      type="button"
      className="icon-button"
      variant="outline"
      size="icon-lg"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => setTheme(nextTheme)}
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} weight="bold" />
      ) : (
        <Moon aria-hidden="true" size={18} weight="bold" />
      )}
    </Button>
  );
};

export { ThemeToggle };
