"use client";

import { useState } from "react";
import { DEFAULT_ROWS_PER_PAGE } from "../../ui-constants";

// Page + page size over an already-filtered list. The page is clamped on
// read, so a shrinking list (tab change, filter) never strands the user on
// an empty page.
export function usePagedRows<T>(rows: T[]) {
  const [requestedPage, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(requestedPage, pages);
  const start = (page - 1) * pageSize;

  function setPageSize(size: number) {
    setPageSizeState(size);
    setPage(1);
  }

  return { page, pageSize, pageRows: rows.slice(start, start + pageSize), setPage, setPageSize };
}
