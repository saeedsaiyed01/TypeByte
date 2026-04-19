import { useTypingTest } from "../hooks/use-typing-test";
import { WordItem } from "./word-item";
import { Pointer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { type TestMode, type Difficulty } from "../app/page";

export function TypingTest({ 
  mode,
  amount,
  difficulty,
  onTestFinished 
}: { 
  mode: TestMode;
  amount: number;
  difficulty: Difficulty;
  onTestFinished?: (finished: boolean, stats: any) => void 
}) {
  const {
    words,
    wordInputs,
    typed,
    wordIndex,
    started,
    finished,
    timerValue,
    finalStats,
    inputRef,
    handleKeyDown,
  } = useTypingTest(mode, amount, difficulty);

  const [isFocused, setIsFocused] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Propagate finished stated to parent
  useEffect(() => {
    if (finished && finalStats) {
      onTestFinished?.(true, finalStats);
    } else {
       onTestFinished?.(false, null);
    }
  }, [finished, finalStats, onTestFinished]);

  if (finished && finalStats) {
    return null; // Don't render results here; parent handles it now
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-5xl gap-6 outline-none transition-colors duration-500"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full flex justify-between items-center mb-4 min-h-[32px]">
        {/* Timer / Counter */}
        <motion.div 
          animate={{ opacity: started ? 1 : 0 }} 
          className="text-2xl font-bold text-accent font-mono tracking-widest transition-colors duration-500"
        >
          {mode === "time" ? timerValue : `${wordIndex}/${amount}`}
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden leading-loose bg-transparent px-2" style={{ maxHeight: '140px' }}>
         <input
           ref={inputRef}
           className="absolute opacity-0 -left-[9999px]"
           onKeyDown={handleKeyDown}
           onFocus={() => setIsFocused(true)}
           onBlur={() => setIsFocused(false)}
           value={typed}
           onChange={() => {}}
           autoFocus
           autoComplete="off"
           autoCorrect="off"
           spellCheck={false}
         />

         {/* Word renderer */}
         <div 
            className="flex flex-wrap gap-x-3 gap-y-3 pb-8 transition-all duration-300"
            style={{ 
               opacity: isFocused ? 1 : 0.2,
               filter: isFocused ? "blur(0px)" : "blur(4px)" 
            }}
         >
            {words.map((word, index) => {
              const isActive = index === wordIndex;
              const isPast = index < wordIndex;
              const displayInput = isActive ? typed : isPast ? (wordInputs[index] ?? "") : "";

              return (
                <WordItem
                  key={`${word}-${index}`}
                  word={word}
                  displayInput={displayInput}
                  isActive={isActive}
                  isPast={isPast}
                />
              )
            })}
         </div>

         <AnimatePresence>
            {!isFocused && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
               >
                  <span className="flex items-center gap-2 text-primary font-medium text-accent">
                     <Pointer size={18} />
                     Click here or press any key to focus
                  </span>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
