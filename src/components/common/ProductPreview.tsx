/**
 * ProductPreview Component (Molecule)
 * 商品プレビュー表示コンポーネント
 */

import React from 'react';
import Image from 'next/image';
import type { ProductSearchResult, ProductSearchError } from '@/hooks/useProductSearch';

export interface ProductPreviewProps {
  product: ProductSearchResult | null;
  error: ProductSearchError | null;
  isSearching: boolean;
}

/**
 * ProductPreview
 *
 * 商品検索結果のプレビュー表示
 *
 * @example
 * <ProductPreview
 *   product={result}
 *   error={error}
 *   isSearching={isSearching}
 * />
 */
export default function ProductPreview({ product, error, isSearching }: ProductPreviewProps) {
  // 検索中
  if (isSearching) {
    return (
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center gap-3">
        <div className="w-10 h-10 text-blue-600">
          <svg
            className="w-full h-full animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="m-0 text-sm text-gray-600">検索中...</p>
      </div>
    );
  }

  // エラー（商品が見つからない）
  if (error && !product) {
    return (
      <div className="p-6 border-2 border-dashed border-red-300 rounded-xl bg-red-50 flex flex-col items-center gap-3">
        <span className="text-2xl">❌</span>
        <p className="m-0 text-sm text-red-600 font-medium">{error.message}</p>
      </div>
    );
  }

  // 成功（商品が見つかった）
  if (product) {
    return (
      <div className="p-6 border-2 border-solid border-green-300 rounded-xl bg-green-50">
        <span className="text-2xl mb-3 block">✅</span>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-30 h-30 rounded-lg overflow-hidden bg-white border border-gray-200">
            <Image src={product.imageUrl} alt={product.name} width={120} height={120} />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <h3 className="m-0 text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="m-0 text-sm text-gray-600">商品コード: {product.code}</p>
            <p className="m-0 text-xl font-bold text-emerald-600">
              ¥{product.price.toLocaleString()}
              <span className="ml-2 text-sm font-normal text-gray-600">
                （税込 ¥{product.priceWithTax.toLocaleString()}）
              </span>
            </p>

            <div className="mt-1">
              {product.isAvailable ? (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  在庫: {product.stock}個
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  在庫切れ
                </span>
              )}
            </div>

            {error && (
              <p className="mt-2 mb-0 text-sm text-amber-600 font-medium">⚠️ {error.message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 初期状態（何も表示しない）
  return null;
}
