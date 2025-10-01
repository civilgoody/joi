export type PaginationResponse<T> = {
  items: T[] | undefined;
  currPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};
