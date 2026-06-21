"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeDataAttribute() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}
