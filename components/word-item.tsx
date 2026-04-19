import { cn } from "../lib/utils";
import { memo } from "react";
import { motion } from "framer-motion";

interface WordItemProps {
  word: string;
  displayInput: string;
  isActive: boolean;
  isPast: boolean;
  elemRef?: React.RefObject<HTMLDivElement | null>;
}

export const WordItem = memo(function WordItem({
  word,
  displayInput,
  isActive,
  isPast,
  elemRef,
}: WordItemProps) {
  const cursorAtEnd = isActive && displayInput.length >= word.length;
  // Compute if word was fully typed correctly
  const isIncorrectSubmit = isPast && displayInput !== word;

  return (
    <div
      ref={isActive ? elemRef : undefined}
      className={cn(
        "relative text-2xl sm:text-3xl font-medium tracking-wide font-mono",
        isIncorrectSubmit && "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-error/50"
      )}
    >
      {word.split("").map((char, cIdx) => {
        let color = "text-sub"; // default un-typed color

        if (isPast || isActive) {
          if (cIdx < displayInput.length) {
            color = displayInput[cIdx] === char ? "text-foreground" : "text-error";
          } else if (isPast) {
             // missed characters of a submitted word
             color = "text-error/50";
          }
        }
        
        const isLastChar = cIdx === word.length - 1;

        return (
          <span key={cIdx} className="relative inline-block">
            {isActive && cIdx === displayInput.length && (
              <motion.span
                layoutId="cursor-active"
                className="absolute -left-px top-0.5 bottom-0.5 w-[3px] rounded-full bg-accent z-10"
                transition={{ type: "spring", stiffness: 700, damping: 38, mass: 0.6 }}
              />
            )}
            {isActive && isLastChar && cursorAtEnd && (
              <motion.span
                layoutId="cursor-active"
                className="absolute -right-px top-0.5 bottom-0.5 w-[3px] rounded-full bg-accent z-10"
                transition={{ type: "spring", stiffness: 700, damping: 38, mass: 0.6 }}
              />
            )}
            <span className={cn("transition-colors duration-100", color)}>
              {char}
            </span>
          </span>
        );
      })}

      {(isActive || isPast) &&
        displayInput.length > word.length &&
        displayInput.slice(word.length).split("").map((char, eIdx) => (
          <span key={`extra-${eIdx}`} className="text-error/80">
            {char}
          </span>
        ))}
    </div>
  );
});
