"use client";

import { TypingTest } from "../components/typing-test";
import { Keyboard } from "../components/ui/keyboard";
import { ResultsScreen } from "../components/results-screen";
import { Info } from "lucide-react";
import { ThemeSelector } from "../components/theme-selector";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

export type TestMode = "time" | "words";
export type Difficulty = "easy" | "hard";

export default function Home() {
  const [isFinished, setIsFinished] = useState(false);
  const [finalStats, setFinalStats] = useState<any>(null);
  const [restartKey, setRestartKey] = useState(0);

  const [mode, setMode] = useState<TestMode>("time");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [amount, setAmount] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleTestFinished = (finished: boolean, stats: any) => {
    setIsFinished(finished);
    if (finished) setFinalStats(stats);
  };

  const setConfig = (newMode: TestMode, newAmount: number) => {
     setMode(newMode);
     setAmount(newAmount);
     handleRestart();
  };

  const handleRestart = () => {
    setIsFinished(false);
    setFinalStats(null);
    setRestartKey((prev) => prev + 1);
  };

  const handleSetSound = (val: boolean) => {
    setSoundEnabled(val);
    localStorage.setItem("typebyte-sound", val.toString());
  };

  // Handle global tab + enter shortcut
  useEffect(() => {
    const savedSound = localStorage.getItem("typebyte-sound");
    if (savedSound !== null) {
      setSoundEnabled(savedSound === "true");
    }

    let tabIsDown = false;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        tabIsDown = true;
        e.preventDefault(); // prevent UI focus jumping away
      }
      if (e.key === "Enter" && tabIsDown) {
        e.preventDefault();
        handleRestart();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        tabIsDown = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const amountOptions = mode === "time" ? [15, 30, 60, 120] : [10, 25, 50, 100];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground tracking-wide font-sans transition-colors duration-500 selection:bg-accent/30">
      
      <header className="flex items-center justify-between px-10 py-8 max-w-7xl mx-auto w-full transition-opacity duration-300">
        <div className="flex items-center gap-4">
          <div className="text-accent font-bold text-3xl tracking-widest uppercase transition-colors duration-500 drop-shadow-md">
            typebyte
          </div>
          <button className="text-sub hover:text-foreground transition-colors mt-1 p-2 rounded-full hover:bg-black/10">
            <Info size={16} />
          </button>
          <ThemeSelector soundEnabled={soundEnabled} setSoundEnabled={handleSetSound} />
        </div>
        <nav className="text-sub text-sm font-medium flex gap-4">
        </nav>
      </header>

      {/* Control Bar */}
      <div 
         className="w-full max-w-4xl mx-auto flex justify-center mb-8 transition-all duration-300"
         style={{ opacity: isFinished ? 0 : 1, pointerEvents: isFinished ? 'none' : 'auto' }}
      >
        <div className="flex bg-black/10 rounded-xl p-1.5 shadow-sm text-xs font-medium text-sub gap-2 items-center border border-white/5 backdrop-blur-sm">
          
          {/* Difficulty Selectors */}
          <div className="flex gap-1 px-4 border-r border-white/5">
            <button 
               onClick={() => { setDifficulty("easy"); handleRestart(); }}
               className={cn("px-3 py-1 rounded-md transition-colors", difficulty === "easy" ? "bg-accent/10 text-accent" : "hover:text-foreground")}
            >easy</button>
            <button 
               onClick={() => { setDifficulty("hard"); handleRestart(); }}
               className={cn("px-3 py-1 rounded-md transition-colors", difficulty === "hard" ? "bg-accent/10 text-accent" : "hover:text-foreground")}
            >hard</button>
          </div>

          {/* Mode Selectors */}
          <div className="flex gap-1 px-4 border-r border-white/5">
            <button 
               onClick={() => setConfig("time", 30)}
               className={cn("px-3 py-1 rounded-md transition-colors", mode === "time" ? "bg-accent/10 text-accent" : "hover:text-foreground")}
            >time</button>
            <button 
               onClick={() => setConfig("words", 25)}
               className={cn("px-3 py-1 rounded-md transition-colors", mode === "words" ? "bg-accent/10 text-accent" : "hover:text-foreground")}
            >words</button>
          </div>

          {/* Amount Selectors */}
          <div className="flex gap-1 px-4">
            {amountOptions.map((opt) => (
               <button 
                 key={`${mode}-${opt}`}
                 onClick={() => setConfig(mode, opt)}
                 className={cn("px-3 py-1 rounded-md transition-colors", amount === opt ? "bg-accent/10 text-accent" : "hover:text-foreground")}
               >
                 {opt}
               </button>
            ))}
          </div>

        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-7xl mx-auto w-full min-h-[300px]">
        {isFinished ? (
           <ResultsScreen stats={finalStats} onRestart={handleRestart} mode={mode} amount={amount} />
        ) : (
           <TypingTest key={restartKey} onTestFinished={handleTestFinished} mode={mode} amount={amount} difficulty={difficulty} />
        )}
      </main>

      {!isFinished && (
        <div className="flex w-full items-center justify-center -translate-y-[4rem]">
            <div className="flex items-center gap-4 text-xs text-sub opacity-50 font-mono">
              <span>
                <kbd className="rounded-[4px] border border-sub/30 bg-black/20 px-2 py-1 text-[10px]">tab</kbd>
                {" + "}
                <kbd className="rounded-[4px] border border-sub/30 bg-black/20 px-2 py-1 text-[10px]">enter</kbd>
                {"  - restart test"}
              </span>
            </div>
        </div>
      )}

      {/* The Keyboard Visualization */}
      <footer 
         className="w-full flex justify-center items-center pb-8 sticky bottom-0 transition-all duration-500"
         style={{ 
             opacity: isFinished ? 0 : 0.9, 
             transform: isFinished ? 'translateY(100px)' : 'translateY(0px)',
             pointerEvents: isFinished ? 'none' : 'auto'
         }}
      >
         <div className="scale-[0.80] md:scale-90 opacity-90 transition-opacity duration-300">
           <Keyboard theme="classic" physicalKeysEnabled={!isFinished} forceActive={true} enableSound={soundEnabled} />
         </div>
      </footer>
    </div>
  );
}
