'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
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
import type { ProductSortOption } from '@/types';

const ITEMS_PER_PAGE = 18;

// カテゴリとブランドの抽出
const categories = Array.from(new Set(sampleProducts.map(p => p.category).filter(Boolean)));
const brands = Array.from(new Set(sampleProducts.map(p => p.brand).filter(Boolean)));

// カテゴリー名のマッピング（slug → 表示名）
const categoryNames: Record<string, string> = {
  'stationery': '文具・事務用品',
  'furniture': '家具',
  'electronics': '電化製品',
  'office-supplies': 'オフィス用品',
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const categoryName = categoryNames[slug] || decodeURIComponent(slug);

  const [sortBy, setSortBy] = useState<ProductSortOption>('name-asc');
  const [filters, setFilters] = useState({
    categories: [categoryName],
    brands: [] as string[],
    priceRange: [0, 100000] as [number, number],
    inStock: false,
    minRating: 0,
  });

  // カテゴリーでフィルタリング
  const filteredProducts = useMemo(() => {
    let results = sampleProducts.filter(p => p.category === categoryName);

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
  }, [categoryName, filters]);

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

  const hasActiveFilters = filters.brands.length > 0 ||
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
                  name: categoryName,
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
                {categoryName}
              </h1>
              <p className="ec-search__query-text text-gray-600">
                {categoryName}の商品一覧
              </p>
            </div>

            {/* アクティブフィルタータグ */}
            {hasActiveFilters && (
              <div className="ec-search__active-filters mb-6 flex flex-wrap items-center gap-2">
                <span className="ec-search__filter-label text-sm text-gray-700">絞り込み条件:</span>
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

              {/* 商品一覧 */}
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
                  /* 商品なしメッセージ */
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
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h2 className="ec-search__empty-title text-2xl font-semibold text-gray-900 mb-2">
                      商品が見つかりませんでした
                    </h2>
                    <p className="ec-search__empty-message text-gray-600 mb-6">
                      {hasActiveFilters
                        ? 'フィルター条件を変更して再度お試しください'
                        : 'このカテゴリーには現在商品がありません'
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
