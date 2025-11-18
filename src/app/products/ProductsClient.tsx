'use client';

import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import ProductListItem from '@/components/product/ProductListItem';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import FilterTag from '@/components/search/FilterTag';
import usePagination from '@/hooks/usePagination';
import type { ProductSortOption, Product } from '@/types';

const ITEMS_PER_PAGE = 18;

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
  brands: string[];
}

export default function ProductsClient({
  initialProducts,
  categories,
  brands
}: ProductsClientProps) {
  const [sortBy, setSortBy] = useState<ProductSortOption>('name-asc');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 100000] as [number, number],
    inStock: false,
    minRating: 0,
  });

  // フィルタリング処理
  const filteredProducts = useMemo(() => {
    let results = initialProducts;

    // カテゴリでフィルタ
    if (filters.categories.length > 0) {
      results = results.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // ブランドでフィルタ
    if (filters.brands.length > 0) {
      results = results.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // 価格帯でフィルタ
    results = results.filter((product) =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // 在庫でフィルタ
    if (filters.inStock) {
      results = results.filter((product) => product.stock);
    }

    // 評価でフィルタ
    if (filters.minRating > 0) {
      results = results.filter((product) => product.rating >= filters.minRating);
    }

    return results;
  }, [initialProducts, filters]);

  // ソート処理
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'ja'));
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted;
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const { currentPage, totalPages, paginatedItems, handlePageChange } = usePagination(
    sortedProducts,
    ITEMS_PER_PAGE
  );

  // フィルタータグ削除ハンドラー
  const handleRemoveCategory = (category: string) => {
    setFilters({
      ...filters,
      categories: filters.categories.filter(c => c !== category)
    });
  };

  const handleRemoveBrand = (brand: string) => {
    setFilters({
      ...filters,
      brands: filters.brands.filter(b => b !== brand)
    });
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      inStock: false,
      minRating: 0,
    });
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.inStock ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* サイドバー: フィルター */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-20">
          <SearchFilters
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </aside>

      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0">
        {/* アクティブフィルター表示 */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">
              フィルター ({activeFiltersCount}):
            </span>
            {filters.categories.map(category => (
              <FilterTag
                key={category}
                label={category}
                onRemove={() => handleRemoveCategory(category)}
              />
            ))}
            {filters.brands.map(brand => (
              <FilterTag
                key={brand}
                label={brand}
                onRemove={() => handleRemoveBrand(brand)}
              />
            ))}
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              すべてクリア
            </button>
          </div>
        )}

        {/* ソートと結果数 */}
        <SearchSort
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={sortedProducts.length}
        />

        {/* 商品グリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {paginatedItems.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>

        {/* 商品が見つからない場合 */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に合う商品が見つかりませんでした</p>
          </div>
        )}

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
