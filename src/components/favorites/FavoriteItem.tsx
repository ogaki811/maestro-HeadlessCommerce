'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { CartItem } from '@/types';
import useCartStore from '@/store/useCartStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import HorizontalProductCard from '@/components/product/HorizontalProductCard';

interface FavoriteItemProps {
  item: CartItem;
}

export default function FavoriteItem({ item }: FavoriteItemProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const handleAddToCart = () => {
    addItem({ ...item, quantity });
  };

  const handleRemove = () => {
    removeFavorite(item.id);
    toast.success(`${item.name}をお気に入りから削除しました`);
  };

  return (
    <HorizontalProductCard
      id={item.id}
      image={item.image}
      brand={item.brand}
      name={item.name}
      code={item.code}
      price={item.price}
      quantity={quantity}
      onQuantityChange={setQuantity}
      className="ec-favorite-item"
      actions={
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRemove}
            className="ec-favorite-item__remove text-sm text-red-600 hover:underline"
          >
            削除
          </button>
          <button
            onClick={handleAddToCart}
            className="ec-favorite-item__cart-btn px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
          >
            カートに追加
          </button>
        </div>
      }
    />
  );
}
