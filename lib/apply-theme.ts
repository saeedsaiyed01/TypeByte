export const THEME_IDS = [
  "keyzen",
  "t3-chat",
  "amethyst-haze",
  "catppuccin",
  "bubblegum",
  "cosmic-night",
  "kodama-grove",
  "darkmatter",
  "vercel",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

const PALETTES: Record<
  ThemeId,
  { bg: string; sub: string; text: string; accent: string; error: string }
> = {
  keyzen: {
    bg: "#070709",
    sub: "#5c5c66",
    text: "#e4e4e9",
    accent: "#5eead4",
    error: "#fb7185",
  },
  "t3-chat": {
    bg: "#120c18",
    sub: "#6b5478",
    text: "#f2eaf5",
    accent: "#ff5c9a",
    error: "#ff7b9d",
  },
  "amethyst-haze": {
    bg: "#161326",
    sub: "#6b6299",
    text: "#e8e4fa",
    accent: "#c4b5fd",
    error: "#fda4af",
  },
  catppuccin: {
    bg: "#181825",
    sub: "#6c7086",
    text: "#cdd6f4",
    accent: "#cba6f7",
    error: "#f38ba8",
  },
  bubblegum: {
    bg: "#1f1c1a",
    sub: "#7c7269",
    text: "#f5ead8",
    accent: "#f0ab93",
    error: "#e07878",
  },
  "cosmic-night": {
    bg: "#13141f",
    sub: "#565f89",
    text: "#c0caf5",
    accent: "#7dcfff",
    error: "#f7768e",
  },
  "kodama-grove": {
    bg: "#121811",
    sub: "#526348",
    text: "#d4e5cb",
    accent: "#a3be8c",
    error: "#d08770",
  },
  darkmatter: {
    bg: "#0a0a0c",
    sub: "#4a4a4f",
    text: "#dcdcdc",
    accent: "#ffb86c",
    error: "#ff6b6b",
  },
  vercel: {
    bg: "#000000",
    sub: "#525252",
    text: "#fafafa",
    accent: "#a3a3a3",
    error: "#ef4444",
  },
};

export function normalizeThemeId(stored: string | null): ThemeId {
  if (!stored) return "keyzen";
  return (THEME_IDS as readonly string[]).includes(stored)
    ? (stored as ThemeId)
    : "keyzen";
}

/** Inline before hydration — avoids FOUC and must stay in sync with {@link THEME_IDS}. */
export function themeBootstrapInlineScript(): string {
  const ids = JSON.stringify(THEME_IDS);
  return `(function(){try{var IDS=${ids};var r=localStorage.getItem("typebyte-theme");var id=IDS.indexOf(r)!==-1?r:"keyzen";document.documentElement.setAttribute("data-theme",id);var f=localStorage.getItem("typebyte-font");if(f)document.documentElement.style.setProperty("--font-sans","var("+f+")");}catch(e){}})();`;
}

/** Sets palette on <html>; Tailwind maps `--color-*` → these vars. Inline wins over layered CSS. */
export function applyTheme(themeId: string): ThemeId {
  try {
    const id = normalizeThemeId(themeId);
    const p = PALETTES[id];
    const root = document.documentElement;
    root.setAttribute("data-theme", id);
    root.style.setProperty("--bg", p.bg);
    root.style.setProperty("--sub", p.sub);
    root.style.setProperty("--text", p.text);
    root.style.setProperty("--accent", p.accent);
    root.style.setProperty("--error", p.error);
    return id;
  } catch {
    return "keyzen";
  }
}
