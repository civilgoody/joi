/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { req } from "@/lib/api";
import { PaginationResponse } from "@/lib/types";

interface PaginatedQueryOptions<TData, TSelected = TData> {
  section: string;
  currentPage: number;
  pageSize: number;
  queryKey?: string[];
  baseKey?: string[];
  queryFn?: (
    urlParams: string,
    section?: string
  ) => Promise<PaginationResponse<TData>>;
  select?: (item: TData) => TSelected;
  filters?: Record<string, string>;
  enabled?: boolean;
}

interface PaginatedQueryResult<TSelected> {
  data: TSelected[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export function usePaginatedQuery<TData, TSelected = TData>({
  section,
  currentPage,
  pageSize,
  queryKey: providedQueryKey,
  baseKey,
  queryFn,
  select,
  filters,
  enabled = true,
}: PaginatedQueryOptions<TData, TSelected>): PaginatedQueryResult<TSelected> {
  // Memoize active filters for stability
  const activeFilters = useMemo(() => {
    if (!filters) return {};

    return Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([_, value]) => value && value !== "" && value !== "all")
      .filter(([_, value]) => !baseKey?.includes(value))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }, [filters, baseKey]);

  // Memoize URL params for stability
  const urlParams = useMemo(() => {
    return new URLSearchParams({
      currPage: currentPage.toString(),
      perPage: pageSize.toString(),
      ...activeFilters,
    }).toString();
  }, [currentPage, pageSize, activeFilters]);

  // Memoize query key for stability
  const queryKey = useMemo(() => {
    if (providedQueryKey) return providedQueryKey;
    if (baseKey) return [...baseKey, urlParams];
    return [section, urlParams];
  }, [providedQueryKey, baseKey, section, urlParams]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      queryFn?.(urlParams, section) ??
      req<PaginationResponse<TData>>(`${section}?${urlParams}`),
    select: (response: PaginationResponse<TData>) => {
      const items = response.items || [];
      const transformedData = select
        ? items.map(select)
        : (items as unknown as TSelected[]);

      return {
        data: transformedData,
        pagination: {
          currentPage: response.currPage,
          pageSize: response.perPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        },
      };
    },
    enabled,
  });

  return {
    data: data?.data ?? [],
    isLoading,
    error,
    pagination: data?.pagination ?? {
      currentPage,
      pageSize,
      totalPages: 0,
      totalItems: 0,
    },
  };
}
