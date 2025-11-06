/**
 * QuickOrderProductList Component (Organism)
 * クイックオーダー商品リスト
 *
 * 追加済み商品のリストとサマリーを表示
 */

import React from 'react';
import QuickOrderProductItem, { type Product } from './QuickOrderProductItem';
import QuickOrderSummary from './QuickOrderSummary';

export interface QuickOrderProductListProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onAddToCart: () => void;
  isLoading: boolean;
}

/**
 * QuickOrderProductList
 *
 * 追加済み商品リストとサマリー表示
 *
 * @example
 * <QuickOrderProductList
 *   products={addedProducts}
 *   onRemove={handleRemove}
 *   onAddToCart={handleAddToCart}
 *   isLoading={isAddingToCart}
 * />
 */
export default function QuickOrderProductList({
  products,
  onRemove,
  onAddToCart,
  isLoading,
}: QuickOrderProductListProps) {
  if (products.length === 0) {
    return null;
  }

  const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        追加済み商品 ({products.length}商品)
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        {products.map((product) => (
          <QuickOrderProductItem key={product.id} product={product} onRemove={onRemove} />
        ))}
      </div>

      <QuickOrderSummary
        totalAmount={totalAmount}
        productCount={products.length}
        totalQuantity={totalQuantity}
        onAddToCart={onAddToCart}
        isLoading={isLoading}
      />
    </div>
  );
}
