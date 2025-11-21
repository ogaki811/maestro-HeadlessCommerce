'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QuantitySelector from './QuantitySelector';

interface HorizontalProductCardProps {
  id: string;
  image: string;
  brand: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  actions: ReactNode;
  prefix?: ReactNode;
  className?: string;
}

/**
 * 横型商品カード共通コンポーネント
 * FavoriteItem, RecommendedItem, CartItem などで使用される共通レイアウト
 */
export default function HorizontalProductCard({
  id,
  image,
  brand,
  name,
  code,
  price,
  quantity,
  onQuantityChange,
  actions,
  prefix,
  className = '',
}: HorizontalProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div data-testid="product-card" className={`ec-horizontal-product-card bg-white rounded-lg shadow-sm p-4 md:p-6 ${className}`}>
      <div className="ec-horizontal-product-card__container flex items-start space-x-4">
        {/* プレフィックス要素（チェックボックスなど） */}
        {prefix}

        {/* 商品画像 */}
        <Link href={`/products/${id}`} className="ec-horizontal-product-card__image-link flex-shrink-0 relative w-24 h-24">
          <Image
            src={imageError ? '/img/placeholder.png' : image}
            alt={name}
            fill
            sizes="96px"
            className="ec-horizontal-product-card__image object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        </Link>

        {/* 商品情報 */}
        <div className="ec-horizontal-product-card__info flex-grow">
          <Link
            href={`/products/${id}`}
            className="ec-horizontal-product-card__brand text-sm text-gray-500 hover:underline"
          >
            {brand}
          </Link>
          <h3 className="ec-horizontal-product-card__name font-medium text-gray-900 mt-1 mb-2">
            <Link href={`/products/${id}`} className="hover:underline">
              {name}
            </Link>
          </h3>
          <p className="ec-horizontal-product-card__code text-sm text-gray-500 mb-2">
            品番: {code}
          </p>
          <p className="ec-horizontal-product-card__unit-price text-sm text-gray-600 mb-3">
            単価: ¥{price.toLocaleString()}
          </p>

          <div className="ec-horizontal-product-card__actions flex items-center justify-between">
            {/* 数量 */}
            <div className="ec-horizontal-product-card__quantity">
              <QuantitySelector
                value={quantity}
                onChange={onQuantityChange}
                max={99}
              />
            </div>

            {/* 価格 */}
            <p className="ec-horizontal-product-card__price text-xl font-bold text-gray-900">
              ¥{(price * quantity).toLocaleString()}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="ec-horizontal-product-card__action-buttons mt-3">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}
