"use client";

import { useState, useEffect } from "react";

/**
 * Hook for character-by-character text reveal animation.
 * @param text - The full text to reveal
 * @param speed - Milliseconds per character (default: 30)
 * @param startDelay - Delay before starting (default: 0)
 */
export function useTypewriter(
  text: string,
  speed: number = 30,
  startDelay: number = 0
) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setIsComplete(true);
      return;
    }

    setDisplayText("");
    setIsComplete(false);

    const startTimer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
}
