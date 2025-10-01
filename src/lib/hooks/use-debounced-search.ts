"use client";

import { useCallback, useRef } from "react";
import { debounce } from "lodash";

interface UseDebouncedSearchOptions {
  delay?: number;
  onSearch: (value: string) => void;
}

export function useDebouncedSearch({
  delay = 500,
  onSearch,
}: UseDebouncedSearchOptions) {
  const debouncedSearchRef = useRef(
    debounce((searchValue: string) => {
      onSearch(searchValue);
    }, delay)
  );

  const debouncedSearch = useCallback(
    (value: string) => {
      debouncedSearchRef.current(value);
    },
    [debouncedSearchRef]
  );

  return { debouncedSearch };
}
