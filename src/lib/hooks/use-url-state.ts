"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | number | boolean | undefined | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "all"
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const setParams = useCallback(
    (updates: Record<string, string | number | boolean | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === "all"
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const clearParams = useCallback(() => {
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  const allParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    getParam,
    setParam,
    setParams,
    clearParams,
    allParams,
  };
}
