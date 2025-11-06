/**
 * QuickOrderRow Component (Molecule)
 * クイックオーダー1行入力
 */

import React from 'react';
import Image from 'next/image';
import ProductCodeInput from '@/components/common/ProductCodeInput';
import NumberInput from '@/components/ui/NumberInput';
import type { ProductSearchResult, ProductSearchError } from '@/hooks/useProductSearch';

export interface QuickOrderRowProps {
  rowIndex: number;
  productCode: string;
  quantity: number;
  onProductCodeChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  product: ProductSearchResult | null;
  error: ProductSearchError | null;
  isSearching: boolean;
}

/**
 * QuickOrderRow
 *
 * クイックオーダーの1行入力（行番号 + 商品コード + 数量 + プレビュー）
 *
 * @example
 * <QuickOrderRow
 *   rowIndex={1}
 *   productCode={productCode}
 *   quantity={quantity}
 *   onProductCodeChange={handleCodeChange}
 *   onQuantityChange={handleQuantityChange}
 *   product={product}
 *   error={error}
 *   isSearching={isSearching}
 * />
 */
export default function QuickOrderRow({
  rowIndex,
  productCode,
  quantity,
  onProductCodeChange,
  onQuantityChange,
  product,
  error,
  isSearching,
}: QuickOrderRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_2fr] gap-4 items-start p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* 行番号 */}
      <div className="flex items-center justify-center w-12 h-10 text-sm font-medium text-gray-600">
        {rowIndex}
      </div>

      {/* 商品コード入力 */}
      <div className="min-w-[200px]">
        <ProductCodeInput
          value={productCode}
          onChange={onProductCodeChange}
          isSearching={isSearching}
          error={error && !product ? error.message : undefined}
          placeholder="商品コード"
          label="商品コード"
          id={`product-code-${rowIndex}`}
        />
      </div>

      {/* 数量入力 */}
      <div className="min-w-[120px]">
        <NumberInput
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          showStepper={true}
          label="数量"
          id={`quantity-${rowIndex}`}
        />
      </div>

      {/* 商品プレビュー */}
      <div className="min-h-[80px]">
        {isSearching && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-5 h-5 text-blue-600">
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
            <span className="text-sm text-blue-700">検索中...</span>
          </div>
        )}

        {error && !product && !isSearching && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-600">❌</span>
            <span className="text-sm text-red-700">{error.message}</span>
          </div>
        )}

        {product && !isSearching && (
          <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-white border border-gray-200">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <h4 className="m-0 text-sm font-semibold text-gray-900 line-clamp-1">
                {product.name}
              </h4>
              <p className="m-0 text-xs text-gray-600">コード: {product.code}</p>
              <p className="m-0 text-sm font-bold text-emerald-600">
                ¥{product.price.toLocaleString()}
                <span className="ml-1 text-xs font-normal text-gray-600">
                  （税込 ¥{product.priceWithTax.toLocaleString()}）
                </span>
              </p>

              <div className="mt-1">
                {product.isAvailable ? (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    在庫: {product.stock}個
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    在庫切れ
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
