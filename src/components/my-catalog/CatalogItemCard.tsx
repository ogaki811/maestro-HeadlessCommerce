'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CatalogItem } from '@/types/catalog';

interface CatalogItemCardProps {
  item: CatalogItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
  onMemoChange?: (id: string, memo: string) => void;
  quantity?: number;
  memo?: string;
}

/**
 * カタログアイテムカードコンポーネント
 * フォルダ内の商品を表示
 */
export default function CatalogItemCard({
  item,
  isSelected = false,
  onSelect,
  onQuantityChange,
  onMemoChange,
  quantity = 1,
  memo,
}: CatalogItemCardProps) {
  const currentMemo = memo !== undefined ? memo : item.memo;
  const discountRate = Math.round(
    ((item.standardPrice - item.salePrice) / item.standardPrice) * 100
  );

  return (
    <div className="ec-catalog-item-card bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* チェックボックスと商品画像 */}
      <div className="flex">
        {/* チェックボックス */}
        <div className="flex items-start p-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(item.id)}
            className="w-4 h-4 mt-1"
            aria-label={`${item.productName}を選択`}
          />
        </div>

        {/* 商品画像 */}
        <Link
          href={`/products/${item.productId}`}
          className="block w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 relative"
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        {/* 商品情報 */}
        <div className="flex-1 p-3 min-w-0">
          {/* 商品コード */}
          <p className="text-xs text-gray-500 mb-1">
            {item.productCode}
          </p>

          {/* 商品名 */}
          <Link
            href={`/products/${item.productId}`}
            className="text-sm font-medium text-gray-900 hover:text-gray-600 line-clamp-2 mb-1"
          >
            {item.productName}
          </Link>

          {/* ブランド名・型番 */}
          {(item.brandName || item.partNumber) && (
            <p className="text-xs text-gray-500 truncate">
              {item.brandName}
              {item.brandName && item.partNumber && ' / '}
              {item.partNumber}
            </p>
          )}
        </div>
      </div>

      {/* 価格・数量・カートボタン */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* 価格情報 */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ¥{item.salePrice.toLocaleString()}
            </span>
            {item.standardPrice !== item.salePrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ¥{item.standardPrice.toLocaleString()}
                </span>
                <span className="text-xs text-red-600 font-medium">
                  {discountRate}%OFF
                </span>
              </>
            )}
          </div>

          {/* 数量と追加ボタン */}
          <div className="flex items-center gap-2">
            {/* 数量入力 */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                type="button"
                onClick={() => onQuantityChange?.(item.id, Math.max(1, quantity - 1))}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                aria-label="数量を減らす"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => onQuantityChange?.(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-sm border-0 focus:ring-0 p-1"
                aria-label="数量"
              />
              <button
                type="button"
                onClick={() => onQuantityChange?.(item.id, quantity + 1)}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                aria-label="数量を増やす"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* カートに追加ボタン */}
            <button
              type="button"
              className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">カート</span>
            </button>
          </div>
        </div>

        {/* 備忘録メモ */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600 flex-shrink-0">メモ:</label>
            <input
              type="text"
              value={currentMemo || ''}
              onChange={(e) => onMemoChange?.(item.id, e.target.value)}
              placeholder="メモを入力..."
              className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
