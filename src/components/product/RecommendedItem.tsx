'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import useCartStore from '@/store/useCartStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import HorizontalProductCard from './HorizontalProductCard';

interface RecommendedItemProps {
  product: Product;
}

export default function RecommendedItem({ product }: RecommendedItemProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isInFavorites = isFavorite(product.id);

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
  };

  const handleToggleFavorite = () => {
    toggleFavorite({ ...product, quantity: 1 });
    toast.success(
      isInFavorites
        ? `${product.name}をお気に入りから削除しました`
        : `${product.name}をお気に入りに追加しました`
    );
  };

  return (
    <HorizontalProductCard
      id={product.id}
      image={product.image}
      brand={product.brand}
      name={product.name}
      code={product.code}
      price={product.price}
      quantity={quantity}
      onQuantityChange={setQuantity}
      className="ec-recommended-item hover:shadow-md transition-shadow"
      actions={
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleFavorite}
            className="ec-recommended-item__favorite-btn text-sm text-gray-600 hover:text-pink-500 hover:underline transition-colors"
          >
            {isInFavorites ? 'お気に入りから削除' : 'お気に入りに追加'}
          </button>
          <button
            onClick={handleAddToCart}
            className="ec-recommended-item__cart-btn px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
          >
            カートに追加
          </button>
        </div>
      }
    />
  );
}
