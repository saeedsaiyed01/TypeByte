import { useCallback, useEffect, useRef, useState } from "react";
import { generateWords } from "../lib/words";
import { calculateStats, type WpmCounts } from "../lib/wpm-count";
import { type TestMode, type Difficulty } from "../app/page";

export interface WpmSnapshot {
  second: number;
  wpm: number;
  raw: number;
  errors: number;
}

export interface TestStats extends WpmCounts {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  wpmHistory: WpmSnapshot[];
}

export function useTypingTest(mode: TestMode, amount: number, difficulty: Difficulty = "easy") {
  const [words, setWords] = useState<string[]>([]);
  const [wordInputs, setWordInputs] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  
  // If time mode, this is countdown. If words mode, this is stopwatch (count up).
  const [timerValue, setTimerValue] = useState(mode === "time" ? amount : 0);
  
  const [finalStats, setFinalStats] = useState<TestStats | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // mutable refs for interval graphing
  const stateRef = useRef({
    words: [] as string[],
    wordInputs: [] as string[],
    typed: "",
    history: [] as WpmSnapshot[],
  });

  // Keep refs synced
  useEffect(() => {
    stateRef.current.words = words;
    stateRef.current.wordInputs = wordInputs;
    stateRef.current.typed = typed;
  }, [words, wordInputs, typed]);

  // Initialize words
  useEffect(() => {
    const wordCount = mode === "words" ? amount : 100;
    const initWords = generateWords(wordCount, difficulty);
    setWords(initWords);
    stateRef.current.words = initWords;
  }, [mode, amount, difficulty]);

  const finishTest = useCallback(() => {
    setFinished(true);
    setStarted(false);

    let finalTimePassedSeconds = 0;
    if (mode === "time") {
       finalTimePassedSeconds = amount;
    } else {
       // in words mode, timerValue counts up in seconds
       finalTimePassedSeconds = timerValue;
    }
    
    // Fallback if they finish incredibly fast (under 1s) to avoid Infinity WPM
    if (finalTimePassedSeconds === 0) finalTimePassedSeconds = 1;

    const timePassedMinutes = finalTimePassedSeconds / 60;
    const stats = calculateStats(words, wordInputs, typed);

    const correct = stats.correctChars + stats.correctSpaces;
    const wpm = Math.round((correct / 5) / timePassedMinutes);
    const totalTypedChars = correct + stats.incorrectChars + stats.extraChars;
    const rawWpm = Math.round((totalTypedChars / 5) / timePassedMinutes);
    
    // Accuracy
    const totalCorrect = stats.correctChars;
    const totalPossible = totalCorrect + stats.incorrectChars;
    const accuracy = totalPossible === 0 ? 100 : Math.round((totalCorrect / totalPossible) * 100);

    setFinalStats({
      ...stats,
      wpm,
      rawWpm,
      accuracy,
      wpmHistory: stateRef.current.history,
    });
  }, [words, wordInputs, typed, mode, amount, timerValue]);

  // Handle timer tick & data recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && !finished) {
      interval = setInterval(() => {
        setTimerValue((prev) => {
          let newTimerValue = prev;
          let secondActive = 0;

          if (mode === "time") {
             newTimerValue = prev - 1;
             secondActive = amount - newTimerValue;
          } else {
             newTimerValue = prev + 1;
             secondActive = newTimerValue;
          }
          
          if (secondActive > 0) {
            const timePassedMinutes = secondActive / 60;
            const liveStats = calculateStats(stateRef.current.words, stateRef.current.wordInputs, stateRef.current.typed);
            
            const liveCorrect = liveStats.correctChars + liveStats.correctSpaces;
            const liveWpm = Math.max(0, Math.round((liveCorrect / 5) / timePassedMinutes));
            const liveTotalTyped = liveCorrect + liveStats.incorrectChars + liveStats.extraChars;
            const liveRaw = Math.max(0, Math.round((liveTotalTyped / 5) / timePassedMinutes));

            stateRef.current.history.push({
               second: secondActive,
               wpm: liveWpm,
               raw: liveRaw,
               errors: liveStats.incorrectChars,
            });
          }

          if (mode === "time" && newTimerValue <= 0) {
             clearInterval(interval);
             return 0;
          }
          return newTimerValue;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, finished, mode, amount]);

  // Handle finish conditions
  useEffect(() => {
    if (!started || finished) return;

    if (mode === "time" && timerValue === 0) {
      finishTest();
    } else if (mode === "words") {
      // If user has typed space after the last word, finish.
      // Wait, if amount is 10, wordIndex goes 0->9. 
      // When user hits space on 9th word, wordInputs.length becomes 10, wordIndex becomes 10.
      if (wordIndex >= amount) {
         finishTest();
      }
    }
  }, [timerValue, started, finished, finishTest, mode, wordIndex, amount]);

  // Handle keystrokes
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (finished) return;

      if (e.key === "Tab") {
        e.preventDefault();
        return;
      }

      if (!started) {
        setStarted(true);
      }

      if (e.key === " ") {
        e.preventDefault();
        if (typed.length === 0) return;
        
        setWordInputs((prev) => [...prev, typed]);
        setWordIndex((prev) => prev + 1);
        setTyped("");
        return;
      }

      if (e.key === "Backspace") {
        if (typed.length === 0 && wordIndex > 0) {
          const prevInput = wordInputs[wordIndex - 1];
          setWordIndex((prev) => prev - 1);
          setTyped(prevInput);
          setWordInputs((prev) => prev.slice(0, -1));
        } else if (typed.length > 0) {
          setTyped((prev) => prev.slice(0, -1));
        }
        return;
      }

      if (e.key.length === 1) {
        if (typed.length < words[wordIndex]!.length + 10) {
          setTyped((prev) => prev + e.key);
        }
      }
    },
    [finished, started, typed, wordIndex, wordInputs, words]
  );

  return {
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
  };
}
