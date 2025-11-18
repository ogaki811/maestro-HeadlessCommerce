'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import type { ProductFilters } from '@/types';

interface SearchFiltersProps {
  filters: {
    categories: string[];
    brands: string[];
    priceRange: [number, number];
    inStock: boolean;
    minRating: number;
  };
  onFilterChange: (filters: ProductFilters) => void;
  categories: string[];
  brands: string[];
  onResetFilters?: () => void;
}

export default function SearchFilters({
  filters,
  onFilterChange,
  categories,
  brands,
  onResetFilters,
}: SearchFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);
  const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters?.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleBrandChange = (brand: string) => {
    const currentBrands = filters?.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = parseInt(e.target.value, 10);
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleStockChange = (checked: boolean) => {
    onFilterChange({ ...filters, inStock: checked });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating === filters.minRating ? 0 : rating });
  };

  return (
    <div className="ec-search-filters bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="ec-search-filters__title text-lg font-semibold text-gray-900 mb-6">
        絞り込み検索
      </h2>

      {/* カテゴリ */}
      <div className="ec-search-filters__category mb-6 pb-6 border-b border-gray-200">
        <h3 className="ec-search-filters__subtitle text-sm font-semibold text-gray-900 mb-3">
          カテゴリ
        </h3>
        <div className="ec-search-filters__options space-y-2">
          {visibleCategories.map((category) => (
            <Checkbox
              key={category}
              id={`category-${category}`}
              checked={(filters?.categories || []).includes(category)}
              onChange={() => handleCategoryChange(category)}
              label={category}
            />
          ))}
          {categories.length > 5 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="ec-search-filters__show-more text-sm text-black hover:text-blue-800 hover:underline"
            >
              {showAllCategories ? '閉じる' : `すべて表示 (${categories.length})`}
            </button>
          )}
        </div>
      </div>

      {/* ブランド */}
      <div className="ec-search-filters__brand mb-6 pb-6 border-b border-gray-200">
        <h3 className="ec-search-filters__subtitle text-sm font-semibold text-gray-900 mb-3">
          ブランド
        </h3>
        <div className="ec-search-filters__options space-y-2">
          {visibleBrands.map((brand) => (
            <Checkbox
              key={brand}
              id={`brand-${brand}`}
              checked={(filters?.brands || []).includes(brand)}
              onChange={() => handleBrandChange(brand)}
              label={brand}
            />
          ))}
          {brands.length > 5 && (
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="ec-search-filters__show-more text-sm text-black hover:text-blue-800 hover:underline"
            >
              {showAllBrands ? '閉じる' : `すべて表示 (${brands.length})`}
            </button>
          )}
        </div>
      </div>

      {/* 価格帯 */}
      <div className="ec-search-filters__price mb-6 pb-6 border-b border-gray-200">
        <h3 className="ec-search-filters__subtitle text-sm font-semibold text-gray-900 mb-3">
          価格帯
        </h3>
        <div className="ec-search-filters__price-inputs flex items-center gap-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            placeholder="最小"
            className="ec-search-filters__price-input w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <span className="text-gray-500">〜</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            placeholder="最大"
            className="ec-search-filters__price-input w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* 在庫 */}
      <div className="ec-search-filters__stock mb-6 pb-6 border-b border-gray-200">
        <Checkbox
          id="in-stock"
          checked={filters.inStock}
          onChange={(e) => handleStockChange(e.target.checked)}
          label="在庫あり"
        />
      </div>

      {/* 評価 */}
      <div className="ec-search-filters__rating">
        <h3 className="ec-search-filters__subtitle text-sm font-semibold text-gray-900 mb-3">
          評価
        </h3>
        <div className="ec-search-filters__rating-options space-y-2">
          {[5, 4, 3].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`ec-search-filters__rating-btn flex items-center gap-2 w-full p-2 rounded-md transition-colors ${
                filters.minRating === rating
                  ? 'bg-blue-50 text-black'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm">以上</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
