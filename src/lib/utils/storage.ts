/* eslint-disable no-console */
// lib/utils/storage.ts

type StorageValue = string | number | boolean | object | null;

export const storage = {
  get<T = StorageValue>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (err) {
      console.error(`Error reading key "${key}" from localStorage:`, err);
      return null;
    }
  },

  set<T = StorageValue>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error setting key "${key}" in localStorage:`, err);
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing key "${key}" from localStorage:`, err);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  },
};
