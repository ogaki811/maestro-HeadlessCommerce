'use client';

import { useMemo, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import Pagination from '@/components/common/Pagination';
import ProductListItem from '@/components/product/ProductListItem';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import FilterTag from '@/components/search/FilterTag';
import { sampleProducts } from '@/data/sampleProducts';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import type { ProductSortOption } from '@/types';

const ITEMS_PER_PAGE = 18;

// カテゴリとブランドの抽出
const categories = Array.from(new Set(sampleProducts.map(p => p.category).filter(Boolean)));
const brands = Array.from(new Set(sampleProducts.map(p => p.brand).filter(Boolean)));

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<ProductSortOption>('name-asc');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 100000] as [number, number],
    inStock: false,
    minRating: 0,
  });

  // 検索とフィルタリング
  const filteredProducts = useMemo(() => {
    let results = sampleProducts;

    // 検索クエリでフィルタ
    if (query) {
      const searchQuery = query.toLowerCase();
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.code.toLowerCase().includes(searchQuery) ||
        product.brand?.toLowerCase().includes(searchQuery) ||
        product.category?.toLowerCase().includes(searchQuery)
      );
    }

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
  }, [query, filters]);

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

  const handleRemoveStock = () => {
    setFilters({ ...filters, inStock: false });
  };

  const handleRemoveRating = () => {
    setFilters({ ...filters, minRating: 0 });
  };

  const hasActiveFilters = filters.categories.length > 0 ||
                           filters.brands.length > 0 ||
                           filters.inStock ||
                           filters.minRating > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-search">
        {/* JSON-LD 構造化データ - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'ホーム',
                  item: 'https://smartsample.example.com/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: '検索結果',
                },
              ],
            }),
          }}
        />

        {/* JSON-LD 構造化データ - ItemList */}
        {sortedProducts.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                numberOfItems: sortedProducts.length,
                itemListElement: paginatedItems.map((product, index) => ({
                  '@type': 'ListItem',
                  position: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
                  item: {
                    '@type': 'Product',
                    name: product.name,
                    url: `https://smartsample.example.com/products/${product.id}`,
                    image: product.image,
                    description: product.description,
                    offers: {
                      '@type': 'Offer',
                      price: product.price,
                      priceCurrency: 'JPY',
                    },
                  },
                })),
              }),
            }}
          />
        )}

        <Breadcrumb />

        <section className="ec-search__section py-12 bg-gray-50">
          <div className="ec-search__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ページタイトル */}
            <div className="ec-search__header mb-8">
              <h1 className="ec-search__title text-3xl font-bold text-gray-900 mb-2">
                検索結果
              </h1>
              {query && (
                <p className="ec-search__query-text text-gray-600">
                  「<span className="ec-search__query font-semibold text-black">{query}</span>」の検索結果
                </p>
              )}
            </div>

            {/* アクティブフィルタータグ */}
            {hasActiveFilters && (
              <div className="ec-search__active-filters mb-6 flex flex-wrap items-center gap-2">
                <span className="ec-search__filter-label text-sm text-gray-700">絞り込み条件:</span>
                {filters.categories.map((category) => (
                  <FilterTag
                    key={category}
                    label={category}
                    onRemove={() => handleRemoveCategory(category)}
                  />
                ))}
                {filters.brands.map((brand) => (
                  <FilterTag
                    key={brand}
                    label={brand}
                    onRemove={() => handleRemoveBrand(brand)}
                  />
                ))}
                {filters.inStock && (
                  <FilterTag
                    label="在庫あり"
                    onRemove={handleRemoveStock}
                  />
                )}
                {filters.minRating > 0 && (
                  <FilterTag
                    label={`評価${filters.minRating}以上`}
                    onRemove={handleRemoveRating}
                  />
                )}
              </div>
            )}

            <div className="ec-search__layout grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* フィルターサイドバー */}
              <aside className="ec-search__sidebar lg:col-span-1">
                <SearchFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  categories={categories}
                  brands={brands}
                />
              </aside>

              {/* 検索結果 */}
              <div className="ec-search__results lg:col-span-3">
                {sortedProducts.length > 0 ? (
                  <>
                    <SearchSort
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      resultCount={sortedProducts.length}
                      currentPage={currentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />

                    <div className="ec-search__products-list space-y-4">
                      {paginatedItems.map((product) => (
                        <ProductListItem key={product.id} product={product} />
                      ))}
                    </div>

                    {/* ページネーション */}
                    {totalPages > 1 && (
                      <div className="ec-search__pagination mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* 検索結果なしメッセージ */
                  <div className="ec-search__empty bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <svg
                      className="ec-search__empty-icon mx-auto h-24 w-24 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h2 className="ec-search__empty-title text-2xl font-semibold text-gray-900 mb-2">
                      検索結果が見つかりませんでした
                    </h2>
                    <p className="ec-search__empty-message text-gray-600 mb-6">
                      {hasActiveFilters
                        ? 'フィルター条件を変更して再度お試しください'
                        : query
                        ? '別のキーワードで検索してみてください'
                        : '検索キーワードを入力してください'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
