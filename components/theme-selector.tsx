"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Baseline, Volume2, VolumeX } from "lucide-react";

const THEMES = [
  { id: "keyzen", name: "KeyZen", dots: ["#0e0e11", "#52525b", "#a48cfa"] },
  { id: "t3-chat", name: "T3 Chat", dots: ["#d82b6b", "#4d3a58", "#1c1423"] },
  { id: "amethyst-haze", name: "Amethyst", dots: ["#a48cfa", "#4f4675", "#1e1b2e"] },
  { id: "catppuccin", name: "Catppuccin", dots: ["#cba6f7", "#585b70", "#1e1e2e"] },
  { id: "bubblegum", name: "Bubblegum", dots: ["#d3869b", "#665c54", "#282524"] },
  { id: "cosmic-night", name: "Cosmic", dots: ["#bb9af7", "#565f89", "#1a1b26"] },
  { id: "kodama-grove", name: "Kodama", dots: ["#91ad70", "#42523b", "#192018"] },
  { id: "darkmatter", name: "Darkmatter", dots: ["#eb7a34", "#3d3d40", "#101012"] },
  { id: "vercel", name: "Vercel", dots: ["#ffffff", "#333333", "#000000"] },
];

const FONTS = [
  { id: "--font-inter", name: "Inter", class: "font-sans" },
  { id: "--font-lexend", name: "Lexend", class: "font-sans" },
  { id: "--font-roboto-mono", name: "Roboto Mono", class: "font-mono" },
  { id: "--font-fira-code", name: "Fira Code", class: "font-mono" },
];

export function ThemeSelector({ 
  soundEnabled = true, 
  setSoundEnabled 
}: { 
  soundEnabled?: boolean; 
  setSoundEnabled?: (val: boolean) => void;
}) {
  const [activeTheme, setActiveTheme] = useState("keyzen");
  const [activeFont, setActiveFont] = useState("--font-inter");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"theme" | "font">("theme");

  useEffect(() => {
    const savedTheme = localStorage.getItem("typebyte-theme") || "keyzen";
    const savedFont = localStorage.getItem("typebyte-font") || "--font-inter";
    
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    setActiveFont(savedFont);
    document.documentElement.style.setProperty('--font-sans', `var(${savedFont})`);
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("typebyte-theme", themeId);
    setIsOpen(false);
  };

  const handleSelectFont = (fontId: string) => {
    setActiveFont(fontId);
    document.documentElement.style.setProperty('--font-sans', `var(${fontId})`);
    localStorage.setItem("typebyte-font", fontId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-sub hover:text-foreground transition-colors p-2 rounded-full hover:bg-black/10 flex items-center gap-2"
        title="Settings"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-3 z-50 w-[340px] p-2 rounded-2xl bg-background border border-sub/20 shadow-2xl flex flex-col gap-2"
          >
            {/* Tabs */}
            <div className="flex w-full bg-black/20 rounded-xl p-1 mb-1 relative">
               <button 
                  onClick={() => setActiveTab("theme")}
                  className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5", activeTab === "theme" ? "bg-accent/10 text-accent" : "text-sub hover:text-foreground")}
               >
                  <Palette size={13} /> themes
               </button>
               <button 
                  onClick={() => setActiveTab("font")}
                  className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5", activeTab === "font" ? "bg-accent/10 text-accent" : "text-sub hover:text-foreground")}
               >
                  <Baseline size={13} /> fonts
               </button>
               <div className="w-[1px] bg-white/5 mx-1 my-1" />
               <button
                  onClick={() => setSoundEnabled?.(!soundEnabled)}
                  title={soundEnabled ? "Mute Mechanical Audio" : "Enable Mechanical Audio"}
                  className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center", soundEnabled ? "text-accent" : "text-sub hover:text-foreground")}
               >
                 {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
               </button>
            </div>

            {/* Content */}
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
               {activeTab === "theme" && THEMES.map((theme) => (
                 <button
                   key={theme.id}
                   onClick={() => handleSelectTheme(theme.id)}
                   className={cn(
                     "flex items-center gap-3 w-[154px] px-3 py-2.5 rounded-xl transition-all duration-200",
                     activeTheme === theme.id ? "bg-white/10 ring-1 ring-white/10" : "hover:bg-sub/10"
                   )}
                 >
                   <div className="flex gap-[3px]">
                     {theme.dots.map((color, i) => (
                       <div 
                         key={i} 
                         className="w-3 h-3 rounded-full shadow-sm" 
                         style={{ backgroundColor: color }} 
                       />
                     ))}
                   </div>
                   <span className={cn(
                     "text-xs font-medium truncate",
                     activeTheme === theme.id ? "text-foreground" : "text-sub"
                   )}>
                     {theme.name}
                   </span>
                 </button>
               ))}

               {activeTab === "font" && FONTS.map((font) => (
                 <button
                   key={font.id}
                   onClick={() => handleSelectFont(font.id)}
                   style={{ fontFamily: `var(${font.id})` }}
                   className={cn(
                     "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200",
                     activeFont === font.id ? "bg-accent/10 text-accent ring-1 ring-accent/30" : "hover:bg-sub/10 text-foreground"
                   )}
                 >
                   <span className="text-sm font-medium">
                     {font.name}
                   </span>
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
