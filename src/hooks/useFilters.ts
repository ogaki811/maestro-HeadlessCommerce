import { useState, useMemo } from 'react';
import type { Product } from '@/types';

interface FiltersState {
  category: string;
  priceMin: number;
  priceMax: number;
  brands: string[];
  inStock: boolean;
  onSale: boolean;
  freeShipping: boolean;
}

interface UseFiltersReturn<T> {
  filters: FiltersState;
  filteredItems: T[];
  updateFilter: (key: keyof FiltersState, value: string | number | boolean | string[]) => void;
  toggleBrand: (brand: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

/**
 * フィルターフック
 * @param items - フィルター対象のアイテムリスト
 * @returns フィルター結果とコントロール関数
 */
function useFilters<T extends Product>(items: T[]): UseFiltersReturn<T> {
  const [filters, setFilters] = useState<FiltersState>({
    category: 'すべて',
    priceMin: 0,
    priceMax: 100000,
    brands: [],
    inStock: false,
    onSale: false,
    freeShipping: false,
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // カテゴリーフィルター
      if (filters.category !== 'すべて' && item.category !== filters.category) {
        return false;
      }

      // 価格帯フィルター
      if (item.price < filters.priceMin || item.price > filters.priceMax) {
        return false;
      }

      // ブランドフィルター
      if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
        return false;
      }

      // 在庫フィルター
      if (filters.inStock && !item.stock) {
        return false;
      }

      // セール商品フィルター
      if (filters.onSale && !item.tags?.includes('セール')) {
        return false;
      }

      // 送料無料フィルター（3000円以上）
      if (filters.freeShipping && item.price < 3000) {
        return false;
      }

      return true;
    });
  }, [items, filters]);

  const updateFilter = (key: keyof FiltersState, value: string | number | boolean | string[]): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBrand = (brand: string): void => {
    setFilters((prev) => {
      const brands = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands };
    });
  };

  const resetFilters = (): void => {
    setFilters({
      category: 'すべて',
      priceMin: 0,
      priceMax: 100000,
      brands: [],
      inStock: false,
      onSale: false,
      freeShipping: false,
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'すべて') count++;
    if (filters.priceMin > 0 || filters.priceMax < 100000) count++;
    if (filters.brands.length > 0) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.freeShipping) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredItems,
    updateFilter,
    toggleBrand,
    resetFilters,
    activeFilterCount,
  };
}

export default useFilters;
