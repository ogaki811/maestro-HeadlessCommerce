'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import Pagination from '@/components/common/Pagination';
import ProductListItem from '@/components/product/ProductListItem';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import FilterTag from '@/components/search/FilterTag';
import { productsApi } from '@/lib/api-client';
import usePagination from '@/hooks/usePagination';
import useCartStore from '@/store/useCartStore';
import type { ProductSortOption } from '@/types';

const ITEMS_PER_PAGE = 18;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<ProductSortOption>('name-asc');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: [0, 100000] as [number, number],
    inStock: false,
    minRating: 0,
  });

  const { validateCartItems } = useCartStore();

  // Composer APIから商品を取得 + カート検証
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await productsApi.getProducts();
        setProducts(response.products);
        console.log('✅ Loaded products from Composer API:', response.products.length);

        // カート内の無効な商品を自動削除
        const validation = await validateCartItems();
        if (validation.removed.length > 0) {
          console.log(`🧹 Automatically removed ${validation.removed.length} invalid cart items`);
        }
      } catch (error) {
        console.error('❌ Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [validateCartItems]);

  // カテゴリとブランドを動的に抽出
  const categories = useMemo(() =>
    Array.from(new Set(products.map(p => p.category).filter(Boolean))),
    [products]
  );
  const brands = useMemo(() =>
    Array.from(new Set(products.map(p => p.brand).filter(Boolean))),
    [products]
  );

  // フィルタリング
  const filteredProducts = useMemo(() => {
    let results = products;

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
  }, [filters, products]);

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

  // ページネーション
  const {
    currentPage,
    totalPages,
    paginatedItems: currentProducts,
    handlePageChange,
  } = usePagination(sortedProducts, ITEMS_PER_PAGE);

  // フィルタ変更ハンドラー
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    handlePageChange(1);
  };

  // フィルタリセット
  const handleResetFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      inStock: false,
      minRating: 0,
    });
  };

  // 個別フィルタ削除
  const handleRemoveCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleRemoveBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b !== brand)
    }));
  };

  const handleRemoveInStock = () => {
    setFilters(prev => ({
      ...prev,
      inStock: false
    }));
  };

  const handleRemoveRating = () => {
    setFilters(prev => ({
      ...prev,
      minRating: 0
    }));
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.inStock ||
    filters.minRating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100000;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-search">
        <Breadcrumb />

        <section className="ec-search__section py-12 bg-gray-50">
          <div className="ec-search__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ページタイトル */}
            <div className="ec-search__header mb-8">
              <h1 className="ec-search__title text-3xl font-bold text-gray-900 mb-2">
                商品一覧
              </h1>
              {loading ? (
                <p className="text-gray-600">読み込み中...</p>
              ) : (
                <p className="text-gray-600">
                  全{products.length}商品
                </p>
              )}
            </div>

            {/* アクティブフィルタータグ */}
            {hasActiveFilters && (
              <div className="ec-search__active-filters mb-6 flex flex-wrap items-center gap-2">
                <span className="ec-search__filter-label text-sm text-gray-700">絞り込み条件:</span>
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
                {filters.inStock && (
                  <FilterTag
                    label="在庫あり"
                    onRemove={handleRemoveInStock}
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
                  onFilterChange={handleFilterChange}
                  categories={categories}
                  brands={brands}
                  onResetFilters={handleResetFilters}
                />
              </aside>

              {/* 商品リスト */}
              <div className="ec-search__results lg:col-span-3">
                {loading ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-600">商品を読み込んでいます...</p>
                  </div>
                ) : sortedProducts.length > 0 ? (
                  <>
                    <SearchSort
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      resultCount={sortedProducts.length}
                      currentPage={currentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />

                    <div className="ec-search__products-list space-y-4">
                      {currentProducts.map((product) => (
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h2 className="ec-search__empty-title text-2xl font-semibold text-gray-900 mb-2">
                      商品が見つかりませんでした
                    </h2>
                    <p className="ec-search__empty-message text-gray-600 mb-6">
                      {hasActiveFilters
                        ? 'フィルター条件を変更して再度お試しください'
                        : '商品がありません'
                      }
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        フィルターをリセット
                      </button>
                    )}
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
