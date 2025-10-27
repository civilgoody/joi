import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. storage quota exceeded)
    }
  }, [key, value]);

  const remove = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  return [value, setValue, remove] as const;
}
