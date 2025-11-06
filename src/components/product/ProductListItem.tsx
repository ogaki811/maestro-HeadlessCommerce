'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import QuantitySelector from './QuantitySelector';
import useCartStore from '@/store/useCartStore';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    toast.success(`${product.name}をカートに追加しました`);
    setQuantity(1);
  };

  return (
    <div data-testid="product-card" className="ec-product-list-item bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="ec-product-list-item__container flex items-center gap-6 p-4">
        {/* 商品画像 */}
        <Link
          href={`/products/${product.id}`}
          className="ec-product-list-item__image-link flex-shrink-0"
        >
          <img
            src={product.image}
            alt={product.name}
            className="ec-product-list-item__image w-32 h-32 object-cover rounded-lg"
          />
        </Link>

        {/* 商品情報 */}
        <div className="ec-product-list-item__info flex-1 min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="ec-product-list-item__name-link block hover:text-black transition-colors"
          >
            <h3 className="ec-product-list-item__name text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {product.brand && (
            <p className="ec-product-list-item__brand text-sm text-gray-600 mb-2">
              {product.brand}
            </p>
          )}

          {/* 評価 */}
          {product.rating !== undefined && (
            <div className="ec-product-list-item__rating flex items-center gap-2 mb-2">
              <div className="ec-product-list-item__stars flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= product.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ec-product-list-item__rating-text text-sm text-gray-600">
                ({product.rating})
              </span>
            </div>
          )}

          {/* 在庫状態 */}
          <div className="ec-product-list-item__stock mb-2">
            {product.stock ? (
              <span className="ec-product-list-item__stock-badge inline-flex items-center gap-1 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                在庫あり
              </span>
            ) : (
              <span className="ec-product-list-item__stock-badge inline-flex items-center gap-1 text-sm text-red-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                在庫切れ
              </span>
            )}
          </div>

          {/* 商品コード */}
          {product.code && (
            <p className="ec-product-list-item__code text-xs text-gray-500">
              商品コード: {product.code}
            </p>
          )}
        </div>

        {/* 価格とカート */}
        <div className="ec-product-list-item__actions flex-shrink-0 flex flex-col items-end gap-3">
          <div className="ec-product-list-item__price-area text-right">
            <p className="ec-product-list-item__price text-2xl font-bold text-black">
              ¥{product.price.toLocaleString()}
            </p>
            <p className="ec-product-list-item__tax text-xs text-gray-500">（税込）</p>
          </div>

          {product.stock && (
            <>
              <div className="ec-product-list-item__quantity">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={99}
                />
              </div>

              <Button
                variant="primary"
                onClick={handleAddToCart}
                className="ec-product-list-item__cart-btn w-full min-w-[180px]"
              >
                カートに追加
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
