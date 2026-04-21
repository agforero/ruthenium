import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useState } from "react";

const STORAGE_KEY = "ruthenium-theme";

type Theme = "light" | "dark";

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "dark" || raw === "light" ? raw : null;
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = readStoredTheme();
    return stored ?? "dark";
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border",
        "bg-card text-foreground shadow-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
