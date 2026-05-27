import { useEffect, useState } from "react";

/**
 * A React hook that delays updating a value until a specified amount of time has passed
 * since the last time the value was modified. Useful for limiting expensive operations
 * like API calls that would otherwise fire too frequently.
 *
 * @param value - The input value to debounce
 * @param delay - The number of milliseconds to wait before updating the debounced value (defaults to 500ms)
 * @returns The debounced value that only updates after the specified delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
