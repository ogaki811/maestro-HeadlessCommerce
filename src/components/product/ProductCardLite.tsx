'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ProductCardLiteProps {
  product: Product;
  size?: 'compact' | 'default';
  hideTags?: boolean;
  /** 画像のpriority設定（ファーストビュー用） */
  priority?: boolean;
}

/**
 * 軽量版ProductCard（スライダー用）
 * - Zustandストアへのサブスクリプションなし
 * - カートボタン・お気に入りボタンなし
 * - 画像はデフォルトでlazy loading
 * - パフォーマンス最適化済み
 */
export default function ProductCardLite({
  product,
  size = 'default',
  hideTags = false,
  priority = false,
}: ProductCardLiteProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    compact: {
      card: 'text-sm',
      image: 'aspect-square',
      title: 'text-sm',
      price: 'text-base',
    },
    default: {
      card: '',
      image: 'aspect-square',
      title: 'text-sm',
      price: 'text-xl',
    },
  };

  const classes = sizeClasses[size];

  return (
    <Link
      href={`/products/${product.id}`}
      className={`ec-product-card ec-product-card--${size} group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 block ${classes.card}`}
    >
      {/* 商品画像 */}
      <div className={`ec-product-card__image-container relative bg-gray-100 ${classes.image}`}>
        <Image
          src={imageError ? '/img/placeholder.png' : product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="ec-product-card__image object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />

        {/* タグ */}
        {!hideTags && product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <Badge key={tag} variant={tag === 'セール' ? 'danger' : 'default'} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 在庫切れバッジ */}
        {!product.stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold">
              在庫切れ
            </span>
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className="ec-product-card__content p-4">
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        <h3 className={`ec-product-card__title font-medium text-gray-900 line-clamp-2 mb-2 ${classes.title}`}>
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">品番: {product.code}</p>

        {/* 評価 */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>

        {/* 価格 */}
        <p className={`ec-product-card__price font-bold text-gray-900 ${classes.price}`}>
          ¥{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
