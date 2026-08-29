// Custom hook for debouncing
import { useRef, useCallback } from "react";

export const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  const timerRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
