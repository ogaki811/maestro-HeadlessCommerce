/**
 * QuickOrderSummary Component (Molecule)
 * クイックオーダーサマリー
 *
 * 合計金額とカート追加ボタンを表示
 */

import React from 'react';

export interface QuickOrderSummaryProps {
  totalAmount: number;
  productCount: number;
  totalQuantity: number;
  onAddToCart: () => void;
  isLoading: boolean;
}

/**
 * QuickOrderSummary
 *
 * 追加済み商品の合計情報とカート追加ボタン
 *
 * @example
 * <QuickOrderSummary
 *   totalAmount={totalAmount}
 *   productCount={addedProducts.length}
 *   totalQuantity={totalQuantity}
 *   onAddToCart={handleAddToCart}
 *   isLoading={isAddingToCart}
 * />
 */
export default function QuickOrderSummary({
  totalAmount,
  productCount,
  totalQuantity,
  onAddToCart,
  isLoading,
}: QuickOrderSummaryProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
      <p className="m-0 text-xl font-bold text-gray-900">
        合計: ¥{totalAmount.toLocaleString()}
        <span className="ml-2 text-sm font-normal text-gray-600">
          （{productCount}商品、{totalQuantity}個）
        </span>
      </p>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={isLoading}
        className={`
          px-8 py-3
          rounded-lg
          text-lg font-semibold
          transition-all duration-150
          ${
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer'
          }
        `}
        aria-label={isLoading ? 'カートに追加中...' : 'カートに追加'}
      >
        {isLoading ? 'カートに追加中...' : 'カートに追加'}
      </button>
    </div>
  );
}
