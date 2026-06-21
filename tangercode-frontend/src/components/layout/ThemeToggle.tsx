"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="icon-btn theme-toggle" aria-label="Basculer le thème" disabled>
        <span className="flex h-5 w-5 items-center justify-center" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      className="icon-btn theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDark ? (
        <Sun className="h-5 w-5" style={{ transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
      ) : (
        <Moon className="h-5 w-5" style={{ transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
      )}
    </button>
  );
}
