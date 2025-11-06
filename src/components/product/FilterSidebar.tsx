'use client';

import { useState } from 'react';
import type { ProductFilters } from '@/types';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    '文具・事務用品',
    '家具',
    '電化製品',
    '収納用品',
    '清掃用品',
  ];

  const brands = [
    'KOKUYO',
    'PLUS',
    'LIHIT LAB.',
    'King Jim',
    'Pentel',
    'uni',
    'ZEBRA',
    'サクラクレパス',
  ];

  const priceRanges = [
    { label: '1,000円未満', min: 0, max: 1000 },
    { label: '1,000円 - 3,000円', min: 1000, max: 3000 },
    { label: '3,000円 - 5,000円', min: 3000, max: 5000 },
    { label: '5,000円 - 10,000円', min: 5000, max: 10000 },
    { label: '10,000円以上', min: 10000, max: Infinity },
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handleBrandChange = (brand: string) => {
    onFilterChange({ ...filters, brand });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleStockChange = (inStock: boolean) => {
    onFilterChange({ ...filters, inStock });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <>
      {/* モバイル用フィルターボタン */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg"
        >
          <span className="font-medium">絞り込み</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* フィルターサイドバー */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* フィルタークリア */}
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-semibold">絞り込み</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-black hover:underline"
            >
              クリア
            </button>
          </div>

          {/* カテゴリー */}
          <div>
            <h4 className="font-medium mb-3">カテゴリー</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ブランド */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">ブランド</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 価格帯 */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">価格帯</h4>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      filters.minPrice === range.min && filters.maxPrice === range.max
                    }
                    onChange={() => handlePriceRangeChange(range.min, range.max)}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 在庫あり */}
          <div className="pt-4 border-t">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => handleStockChange(e.target.checked)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700">在庫あり</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
