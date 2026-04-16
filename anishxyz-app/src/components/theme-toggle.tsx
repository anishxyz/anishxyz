"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEMES = ["light", "dark"] as const;

type ThemeOption = (typeof THEMES)[number];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
}

function getActiveTheme(
  mounted: boolean,
  theme: string | undefined,
  resolvedTheme: string | undefined
): ThemeOption {
  if (!mounted) return "dark";
  const nextTheme = theme === "system" ? resolvedTheme : theme;
  return nextTheme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isEditableTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "l") {
        setTheme("light");
      } else if (key === "d") {
        setTheme("dark");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setTheme]);

  const activeTheme = getActiveTheme(mounted, theme, resolvedTheme);

  return (
    <div
      className="flex items-center gap-2 text-[0.8rem] text-muted-foreground md:text-[0.9rem] dark:gap-1 dark:text-xs dark:leading-none dark:text-foreground/60 dark:font-mono"
      aria-label="theme toggle"
    >
      {THEMES.map((name, index) => (
        <React.Fragment key={name}>
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            className={cn(
              "transition-colors dark:px-1 dark:py-0.5",
              activeTheme === name
                ? "text-foreground dark:underline dark:decoration-[1px] dark:underline-offset-4"
                : "hover:text-foreground dark:text-foreground/45 dark:hover:text-foreground/80"
            )}
            onClick={() => setTheme(name)}
            aria-pressed={activeTheme === name}
            aria-label={`Switch to ${name} mode`}
          >
            {name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
