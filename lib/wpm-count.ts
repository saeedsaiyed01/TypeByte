export interface WpmCounts {
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  correctSpaces: number;
}

export function calculateStats(
  targetWords: string[],
  wordInputs: string[],
  currentWordInput: string
): WpmCounts {
  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;
  let correctSpaces = 0;

  // We look at all past submitted words AND the current word being typed
  const inputsToEvaluate = [...wordInputs];
  if (currentWordInput !== "") {
    inputsToEvaluate.push(currentWordInput);
  }

  for (let i = 0; i < inputsToEvaluate.length; i++) {
    const typed = inputsToEvaluate[i]!;
    const target = targetWords[i];

    if (!target) break;

    if (typed === target) {
      correctChars += target.length;
      if (i < wordInputs.length) {
        // If it's a locked-in word (in wordInputs), they hit space correctly
        correctSpaces++; 
      }
    } else {
      for (let c = 0; c < Math.max(typed.length, target.length); c++) {
        if (c < typed.length && c < target.length) {
          if (typed[c] === target[c]) correctChars++;
          else incorrectChars++;
        } else if (c >= target.length) {
          extraChars++; // typed too many characters
        } else if (c >= typed.length) {
          if (i < wordInputs.length) {
            // It's a locked-in word, so any missing characters are "missed"
            missedChars++; 
          }
        }
      }
    }
  }

  return { correctChars, incorrectChars, missedChars, extraChars, correctSpaces };
}
