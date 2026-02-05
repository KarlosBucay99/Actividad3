import { useState } from 'react';

/**
 * Hook usePagination
 * 
 * Maneja la lógica de paginación
 */

export function usePagination(initialPage = 1, limit = 10) {
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const goToPage = (newPage) => {
    if (newPage > 0 && newPage <= pages) {
      setPage(newPage);
    }
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const updatePaginationInfo = (total, pages) => {
    setTotal(total);
    setPages(pages);
  };

  return {
    page,
    total,
    pages,
    limit,
    goToPage,
    nextPage,
    prevPage,
    updatePaginationInfo,
  };
}

export default usePagination;
