'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ProductImageGallery from './ProductImageGallery';
import QuantitySelector from './QuantitySelector';
import type { Product } from '@/types';
import useCartStore from '@/store/useCartStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import { cartApi } from '@/lib/api-client';

/**
 * Product Detail Client Component
 * 商品詳細クライアントコンポーネント
 *
 * ヘッドレスコマース設計:
 * - カート追加時にComposer APIを呼び出し
 * - ローカルストアとAPIの同期
 */

interface ExtendedProduct extends Product {
  originalPrice?: number | null;
  features?: string[];
}

interface ProductDetailClientProps {
  product: ExtendedProduct;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isInFavorites = isFavorite(product.id);

  // 商品IDが変更されたら状態をリセット
  useEffect(() => {
    setQuantity(1);
  }, [product.id]);

  const handleAddToCart = async () => {
    // Composer APIを呼び出してカート追加
    try {
      await cartApi.addToCart(product.id, quantity);

      // ローカルストアも更新（同期）
      const productWithQuantity = {
        ...product,
        image: product.images[0],
        quantity: quantity
      };
      addItem(productWithQuantity);

      toast.success(`${product.name}を${quantity}個カートに追加しました`);
    } catch (error) {
      console.error('Failed to add to cart via Composer API, using local store:', error);

      // フォールバック: ローカルストアのみ使用
      const productWithQuantity = {
        ...product,
        image: product.images[0],
        quantity: quantity
      };
      addItem(productWithQuantity);
      toast.success(`${product.name}を${quantity}個カートに追加しました`);
    }
  };

  const handleToggleFavorite = () => {
    const productForFavorite = {
      ...product,
      image: product.images[0],
      quantity: 1 // CartItem型に必要
    };
    const wasFavorite = isFavorite(product.id);
    toggleFavorite(productForFavorite);

    if (wasFavorite) {
      toast(`${product.name}をお気に入りから削除しました`, { icon: '💔' });
    } else {
      toast.success(`${product.name}をお気に入りに追加しました`, { icon: '❤️' });
    }
  };

  const stockCount = typeof product.stock === 'number' ? product.stock : 0;

  // カートインボタンコンポーネント（共通化）
  const AddToCartButton = () => (
    <div className="flex gap-4">
      <button
        onClick={handleAddToCart}
        disabled={stockCount === 0}
        className="flex-1 py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {stockCount > 0 ? 'カートに追加' : '在庫切れ'}
      </button>
      <button
        onClick={handleToggleFavorite}
        className={`${isInFavorites ? 'ec-product-detail__favorite-btn--active' : ''} w-14 h-14 flex items-center justify-center border-2 rounded-lg transition-colors ${
          isInFavorites
            ? 'bg-red-50 border-red-500 text-red-500'
            : 'border-gray-300 hover:bg-red-50 hover:border-red-500 hover:text-red-500'
        }`}
        aria-label={isInFavorites ? 'お気に入りから削除' : 'お気に入りに追加'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isInFavorites ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
    </div>
  );

  return (
    <>
      {/* メイン商品詳細セクション */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 商品画像 */}
        <div className="ec-product-detail__images">
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

      {/* 商品情報 */}
      <div className="ec-product-detail__info">
        <div className="ec-product-detail__header mb-4">
          <p className="ec-product-detail__brand text-sm text-gray-600 mb-2">{product.brand}</p>
          <h1 className="ec-product-detail__title text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="ec-product-detail__code text-sm text-gray-500">商品コード: {product.code}</p>
        </div>

        <div className="ec-product-detail__pricing mb-6">
          {product.originalPrice && (
            <p className="ec-product-detail__original-price text-lg text-gray-500 line-through">¥{product.originalPrice.toLocaleString()}</p>
          )}
          <div className="flex items-baseline gap-3">
            <p className="ec-product-detail__price text-4xl font-bold text-black">¥{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <span className="ec-product-detail__discount bg-red-500 text-white text-sm px-2 py-1 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%OFF
              </span>
            )}
          </div>
          <p className="ec-product-detail__tax-note text-sm text-gray-500 mt-1">（税込）</p>
        </div>

        <div className="ec-product-detail__stock-info mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="ec-product-detail__stock-status flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">在庫状況:</span>
            {stockCount > 0 ? (
              <span className="ec-product-detail__stock-label ec-product-detail__stock-label--in-stock text-sm font-semibold text-green-600">
                在庫あり ({stockCount}個)
              </span>
            ) : (
              <span className="ec-product-detail__stock-label ec-product-detail__stock-label--out-of-stock text-sm font-semibold text-red-600">
                在庫切れ
              </span>
            )}
          </div>
          <div className="ec-product-detail__shipping-info flex items-center gap-2 text-sm text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="1" y="3" width="15" height="13"></rect>
              <path d="M16 8l4-4v16l-4-4"></path>
            </svg>
            <span>翌日配送対応</span>
          </div>
          <div className="ec-product-detail__free-shipping flex items-center gap-2 text-sm text-gray-600 mt-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>3,000円以上で送料無料</span>
          </div>
        </div>

        {stockCount > 0 && (
          <div className="ec-product-detail__quantity mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
            <div className="flex items-center gap-4">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={stockCount}
              />
              <span className="ec-product-detail__stock-count text-sm text-gray-600">在庫: {stockCount}個</span>
            </div>
          </div>
        )}

        <div className="ec-product-detail__actions mb-6">
          <AddToCartButton />
        </div>

        {product.features && product.features.length > 0 && (
          <div className="ec-product-detail__features border-t border-gray-200 pt-6">
            <h3 className="ec-product-detail__features-title text-lg font-semibold text-gray-900 mb-3">商品の特徴</h3>
            <ul className="ec-product-detail__features-list space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="ec-product-detail__feature-item flex items-start gap-2 text-gray-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-500 flex-shrink-0 mt-0.5">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
