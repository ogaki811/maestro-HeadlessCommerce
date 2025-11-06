'use client';

import Link from 'next/link';
import type { CartItem as CartItemType } from '@/types';
import QuantitySelector from '@/components/product/QuantitySelector';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div data-testid="cart-item" className="ec-cart-item bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="ec-cart-item__container flex items-start space-x-4">
        {/* チェックボックス */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
          className="ec-cart-item__checkbox mt-1 w-5 h-5 text-black border-gray-300 rounded focus:ring-gray-700"
        />

        {/* 商品画像 */}
        <Link href={`/products/${item.id}`} className="ec-cart-item__image-link flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="ec-cart-item__image w-24 h-24 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/placeholder.png';
            }}
          />
        </Link>

        {/* 商品情報 */}
        <div className="ec-cart-item__info flex-grow">
          <Link
            href={`/products/${item.id}`}
            className="ec-cart-item__brand text-sm text-gray-500 hover:underline"
          >
            {item.brand}
          </Link>
          <h3 className="ec-cart-item__name font-medium text-gray-900 mt-1 mb-2">
            <Link href={`/products/${item.id}`} className="hover:underline">
              {item.name}
            </Link>
          </h3>
          <p className="ec-cart-item__code text-sm text-gray-500">
            品番: {item.code}
          </p>
          <p className="ec-cart-item__unit-price text-sm text-gray-600 mb-3">
            単価: ¥{item.price.toLocaleString()}
          </p>

          <div className="ec-cart-item__actions flex items-center justify-between">
            {/* 数量 */}
            <div className="ec-cart-item__quantity">
              <QuantitySelector
                value={item.quantity}
                onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
                max={99}
              />
            </div>

            {/* 価格 */}
            <p className="ec-cart-item__price text-xl font-bold text-gray-900">
              ¥{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>

          {/* 削除ボタン */}
          <button
            data-testid="remove-item"
            onClick={() => onRemove(item.id)}
            className="ec-cart-item__remove mt-3 text-sm text-red-600 hover:underline"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
