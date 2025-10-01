/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { PaginationResponse } from "@/lib/types";
import { req } from "@/lib/api";

// Standalone pagination hook (keeps existing functionality)
interface UsePaginationServerProps {
  pageParam?: string;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

interface UsePaginationServerReturn {
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
}

export function usePaginationServer({
  pageParam = "page",
  pageSize = 12,
  onPageChange,
}: UsePaginationServerProps = {}): UsePaginationServerReturn {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get(pageParam)) || 1;

  const handlePageChange = useCallback(
    (page: number) => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(searchParams.toString());
      params.set(pageParam, page.toString());

      // Use Next.js router instead of window.history
      router.replace(`?${params.toString()}`, { scroll: false });
      onPageChange?.(page);
    },
    [router, searchParams, pageParam, onPageChange]
  );

  return { currentPage, pageSize, handlePageChange };
}

// Improved consolidated hook with proper typing
interface PaginatedQueryOptions<TData, TSelected = TData> {
  section: string;
  queryKey?: string[];
  baseKey?: string[];
  queryFn?: (
    urlParams: string,
    section?: string
  ) => Promise<PaginationResponse<TData>>;
  select?: (item: TData) => TSelected;
  filters?: Record<string, string>;
  pageSize?: number;
  enabled?: boolean;
  pageParam?: string;
  onPageChange?: (page: number) => void;
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
  onPageChange: (page: number) => void;
}

export function usePaginatedQuery<TData, TSelected = TData>({
  section,
  queryKey: providedQueryKey,
  baseKey,
  queryFn,
  select,
  filters,
  pageSize: optionsPageSize,
  enabled = true,
  pageParam = "page",
  onPageChange,
}: PaginatedQueryOptions<TData, TSelected>): PaginatedQueryResult<TSelected> {
  // Internal pagination logic
  const { currentPage, pageSize, handlePageChange } = usePaginationServer({
    pageParam,
    pageSize: optionsPageSize,
    onPageChange,
  });

  // Memoize active filters for stability
  const activeFilters = useMemo(() => {
    if (!filters) return {};

    // Sort entries for deterministic ordering
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
      req<PaginationResponse<TData>>(`/public/${section}?${urlParams}`),
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
    onPageChange: handlePageChange,
  };
}
