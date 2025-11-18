'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import useCartStore from '@/store/useCartStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import { Badge } from '@/components/ui/Badge';
import QuantitySelector from './QuantitySelector';

interface ProductCardProps {
  product: Product;
  size?: 'compact' | 'default' | 'large';
  hideTags?: boolean;
}

export default function ProductCard({ product, size = 'default', hideTags = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isInFavorites = isFavorite(product.id);

  const sizeClasses = {
    compact: {
      card: 'text-sm',
      image: 'aspect-square',
      title: 'text-sm',
      price: 'text-base',
      button: 'py-1.5 text-sm',
    },
    default: {
      card: '',
      image: 'aspect-square',
      title: 'text-sm',
      price: 'text-xl',
      button: 'py-2',
    },
    large: {
      card: '',
      image: 'aspect-[4/3]',
      title: 'text-lg',
      price: 'text-2xl',
      button: 'py-3',
    },
  };

  const classes = sizeClasses[size];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite({ ...product, quantity: 1 });
    toast.success(
      isInFavorites
        ? `${product.name}をお気に入りから削除しました`
        : `${product.name}をお気に入りに追加しました`
    );
  };

  return (
    <div data-testid="product-card" className={`ec-product-card ec-product-card--${size} group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 ${classes.card}`}>
      <Link href={`/products/${product.id}`}>
        {/* 商品画像 */}
        <div className={`ec-product-card__image-container relative bg-gray-100 ${classes.image}`}>
          <img
            src={imageError ? '/img/placeholder.png' : product.image}
            alt={product.name}
            className="ec-product-card__image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
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

          {/* お気に入りボタン */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isInFavorites ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isInFavorites ? 'currentColor' : 'none'}
              stroke="currentColor"
              className={isInFavorites ? 'text-pink-500' : 'text-gray-400'}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

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
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
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
          <div className="ec-product-card__price-container mb-3">
            <p className={`ec-product-card__price font-bold text-gray-900 ${classes.price}`}>
              ¥{product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      {/* 数量選択とカートに追加ボタン */}
      <div className="px-4 pb-4 space-y-2">
        {product.stock && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">数量:</span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={99}
            />
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className={`ec-product-card__cart-btn w-full px-4 bg-black text-white rounded-md hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${classes.button}`}
        >
          {product.stock ? 'カートに追加' : '在庫切れ'}
        </button>
      </div>
    </div>
  );
}
