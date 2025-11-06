import { useState, useMemo } from 'react';

interface UseSearchReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: T[];
  hasResults: boolean;
  resultCount: number;
}

/**
 * 検索フック
 * @param items - 検索対象のアイテムリスト
 * @param searchKeys - 検索対象のキー名配列
 * @param initialQuery - 初期検索クエリ
 * @returns 検索結果とコントロール関数
 */
function useSearch<T extends object>(
  items: T[],
  searchKeys: (keyof T)[] = ['name', 'code'] as (keyof T)[],
  initialQuery: string = ''
): UseSearchReturn<T> {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();

    return items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [items, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    hasResults: filteredItems.length > 0,
    resultCount: filteredItems.length,
  };
}

export default useSearch;
