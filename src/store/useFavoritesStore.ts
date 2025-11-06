'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FavoritesState } from '@/types';

const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // State
      favorites: [],

      // Actions
      addFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.find((item) => item.id === product.id);

        if (!exists) {
          set({ favorites: [...favorites, product] });
        }
      },

      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter((item) => item.id !== productId),
        });
      },

      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.find((item) => item.id === product.id);

        if (exists) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item.id === productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoriteCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => {
        // SSR 対応
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export default useFavoritesStore;
