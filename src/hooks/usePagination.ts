import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  handlePageChange: (page: number) => void;
  resetPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * ページネーションフック
 * @param items - ページネーション対象のアイテムリスト
 * @param itemsPerPage - 1ページあたりのアイテム数
 * @returns ページネーション結果とコントロール関数
 */
function usePagination<T>(
  items: T[],
  itemsPerPage: number = 12
): UsePaginationReturn<T> {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // ページトップにスクロール
      window.scrollTo(0, 0);
      // ページをリフレッシュ
      router.refresh();
    }
  };

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    resetPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

export default usePagination;
