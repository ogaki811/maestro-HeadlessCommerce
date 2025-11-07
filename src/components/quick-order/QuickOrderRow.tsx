/**
 * QuickOrderRow Component (Molecule)
 * クイックオーダー1行入力
 */

import React from 'react';
import Link from 'next/link';
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
  onReset: () => void;
  onSwitchToAlternative?: (alternativeCode: string) => void; // 代替商品への切り替え
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
  onReset,
  onSwitchToAlternative,
  product,
  error,
  isSearching,
}: QuickOrderRowProps) {
  const hasContent = productCode.trim().length > 0;

  return (
    <div className="grid grid-cols-[auto_1fr_auto_2fr_auto] gap-4 items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* 行番号 */}
      <div className="flex items-center justify-center w-12 text-sm font-medium text-gray-600">
        {rowIndex}
      </div>

      {/* 商品コード入力 */}
      <div className="min-w-[200px]">
        <ProductCodeInput
          value={productCode}
          onChange={onProductCodeChange}
          isSearching={isSearching}
          placeholder="商品コード"
          label=""
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
          label=""
          id={`quantity-${rowIndex}`}
          disabled={!hasContent}
        />
      </div>

      {/* 商品プレビュー */}
      <div>
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

        {product && !isSearching && product.discontinued && (
          <div className="flex flex-col gap-2">
            {/* 中止品の警告（コンパクト、画像の左にテキスト配置） */}
            <div className="flex gap-2 p-2 bg-orange-50 border border-orange-300 rounded-md">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold text-orange-900 text-xs whitespace-nowrap">中止品</span>

                <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-white border border-gray-200 opacity-60">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                <p className="m-0 text-xs text-gray-700 leading-tight">
                  <span>コード: {product.code}</span>
                  {product.discontinuedDate && (
                    <>
                      <span className="mx-1 text-gray-400">|</span>
                      <span>{product.discontinuedDate}廃番</span>
                    </>
                  )}
                  {product.discontinuedReason && (
                    <>
                      <span className="mx-1 text-gray-400">|</span>
                      <span>{product.discontinuedReason}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 代替商品（1つのみ、中止品と同じレイアウト） */}
            {product.alternativeProducts && product.alternativeProducts.length > 0 && (
              <div className="flex gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-semibold text-blue-900 text-xs whitespace-nowrap">代替商品</span>

                  <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-white border border-gray-200">
                    <Image
                      src={product.alternativeProducts[0].imageUrl}
                      alt={product.alternativeProducts[0].name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="m-0 text-xs text-gray-700 leading-tight">
                    <span className="font-semibold">{product.alternativeProducts[0].name}</span>
                    <span className="mx-1 text-gray-400">|</span>
                    <span>コード: {product.alternativeProducts[0].code}</span>
                    <span className="mx-1 text-gray-400">|</span>
                    <span className="font-bold text-emerald-600">
                      ¥{product.alternativeProducts[0].price.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* 切り替えボタン */}
                <button
                  type="button"
                  onClick={() => onSwitchToAlternative?.(product.alternativeProducts![0].code)}
                  className="px-3 py-1 h-fit bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  切替
                </button>
              </div>
            )}
          </div>
        )}

        {product && !isSearching && !product.discontinued && (
          <Link
            href={`/products/${product.id}`}
            className="flex gap-2 p-2 bg-white rounded-md hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-white border border-gray-200">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              {/* 1行目: 商品名 + コード */}
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="m-0 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h4>
                <span className="text-gray-300">|</span>
                <p className="m-0 text-xs text-gray-600">コード: {product.code}</p>
              </div>

              {/* 2行目: 価格 + 在庫 */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="m-0 text-sm font-bold text-emerald-600">
                  ¥{product.price.toLocaleString()}
                  <span className="ml-1 text-xs font-normal text-gray-600">
                    （税込 ¥{product.priceWithTax.toLocaleString()}）
                  </span>
                </p>
                <span className="text-gray-300">|</span>
                {product.isAvailable ? (
                  <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    在庫: {product.stock}個
                  </span>
                ) : (
                  <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    在庫切れ
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* リセットボタン */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onReset}
          disabled={!hasContent}
          className={`
            flex items-center justify-center
            w-8 h-8
            rounded-full
            transition-all duration-150
            ${
              hasContent
                ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                : 'text-gray-200 cursor-not-allowed'
            }
          `}
          aria-label="入力をリセット"
          title="入力をリセット"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
