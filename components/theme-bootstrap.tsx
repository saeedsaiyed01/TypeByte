"use client";

import { useLayoutEffect } from "react";
import { applyTheme, normalizeThemeId } from "../lib/apply-theme";

/** Applies saved theme before paint after hydration (fixes Tailwind @theme vs CSS layers). */
export function ThemeBootstrap() {
  useLayoutEffect(() => {
    try {
      const raw = localStorage.getItem("typebyte-theme");
      const id = normalizeThemeId(raw);
      if (raw !== id) {
        localStorage.setItem("typebyte-theme", id);
      }
      applyTheme(id);
    } catch {
      applyTheme("keyzen");
    }
  }, []);

  return null;
}
