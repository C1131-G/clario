"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const noop = (): void => {
  // useSyncExternalStore requires a stable unsubscribe callback.
};
const subscribe = () => noop;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const isDark = mounted ? resolvedTheme !== "light" : true;
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
