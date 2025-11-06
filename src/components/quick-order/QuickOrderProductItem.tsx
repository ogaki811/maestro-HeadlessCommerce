/**
 * QuickOrderProductItem Component (Molecule)
 * クイックオーダー商品アイテム
 *
 * 追加済み商品1行を表示するコンポーネント
 */

import React from 'react';

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface QuickOrderProductItemProps {
  product: Product;
  onRemove: (productId: string) => void;
}

/**
 * QuickOrderProductItem
 *
 * 追加済み商品1行を表示
 *
 * @example
 * <QuickOrderProductItem
 *   product={product}
 *   onRemove={handleRemove}
 * />
 */
export default function QuickOrderProductItem({
  product,
  onRemove,
}: QuickOrderProductItemProps) {
  const totalPrice = product.price * product.quantity;

  return (
    <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex gap-4 flex-1">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-15 h-15 object-cover rounded-md border border-gray-200"
        />
        <div className="flex flex-col gap-1">
          <p className="m-0 text-xs text-gray-500">{product.code}</p>
          <h4 className="m-0 text-base font-semibold text-gray-900">{product.name}</h4>
          <p className="m-0 text-sm text-emerald-600 font-medium">
            ¥{product.price.toLocaleString()} × {product.quantity}個 = ¥
            {totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(product.id)}
        className="
          px-4 py-2
          bg-white text-red-600
          border border-red-600
          rounded-md
          text-sm font-medium
          cursor-pointer
          transition-all duration-150
          hover:bg-red-600 hover:text-white
        "
        aria-label="削除"
      >
        削除
      </button>
    </div>
  );
}
