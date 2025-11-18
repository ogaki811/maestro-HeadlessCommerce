'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartState } from '@/types';
import { sampleProducts } from '@/data/sampleProducts';

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      selectedItems: [],
      recentlyDeleted: [],
      appliedCoupon: null,
      lastAddedItem: null,

      // Actions
      addItem: (product) => {
        const { items, selectedItems } = get();
        const existingItem = items.find((item) => item.id === product.id);

        const updatedProduct = { ...product, quantity: product.quantity || 1 };

        if (existingItem) {
          const newQuantity = existingItem.quantity + (product.quantity || 1);
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
            lastAddedItem: { ...existingItem, quantity: product.quantity || 1 },
          });
        } else {
          set({
            items: [...items, updatedProduct],
            selectedItems: [...selectedItems, product.id],
            lastAddedItem: updatedProduct,
          });
        }
      },

      removeItem: (productId) => {
        const { items, selectedItems } = get();
        const itemToRemove = items.find((item) => item.id === productId);

        if (itemToRemove) {
          set({
            recentlyDeleted: [
              { ...itemToRemove, deletedAt: Date.now() },
              ...get().recentlyDeleted.slice(0, 4),
            ],
          });
        }

        set({
          items: items.filter((item) => item.id !== productId),
          selectedItems: selectedItems.filter((id) => id !== productId),
        });
      },

      removeSelectedItems: () => {
        const { items, selectedItems } = get();
        const itemsToRemove = items.filter((item) => selectedItems.includes(item.id));

        if (itemsToRemove.length > 0) {
          set({
            recentlyDeleted: [
              ...itemsToRemove.map((item) => ({ ...item, deletedAt: Date.now() })),
              ...get().recentlyDeleted,
            ].slice(0, 5),
          });
        }

        set({
          items: items.filter((item) => !selectedItems.includes(item.id)),
          selectedItems: [],
        });
      },

      restoreItem: (item) => {
        const { items, recentlyDeleted } = get();
        set({
          items: [...items, { ...item, deletedAt: undefined }],
          selectedItems: [...get().selectedItems, item.id],
          recentlyDeleted: recentlyDeleted.filter((deleted) => deleted.id !== item.id),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const item = get().items.find((item) => item.id === productId);

        // 在庫チェック
        if (item && typeof item.stock === 'number' && quantity > item.stock) {
          return {
            success: false,
            message: `在庫が不足しています（在庫数: ${item.stock}個）`,
            maxQuantity: item.stock,
          };
        }

        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });

        return { success: true };
      },

      clearCart: () => {
        set({ items: [], selectedItems: [], recentlyDeleted: [], appliedCoupon: null });
      },

      // クーポン関連
      applyCoupon: (coupon) => {
        const total = get().getTotal();

        if (coupon.minPurchase && total < coupon.minPurchase) {
          return {
            success: false,
            message: `このクーポンは¥${coupon.minPurchase.toLocaleString()}以上のお買い物で利用できます`,
          };
        }

        set({ appliedCoupon: coupon });
        return {
          success: true,
          message: `クーポン「${coupon.code}」を適用しました`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      // 商品選択関連
      toggleSelectItem: (productId) => {
        const { selectedItems } = get();
        if (selectedItems.includes(productId)) {
          set({ selectedItems: selectedItems.filter((id) => id !== productId) });
        } else {
          set({ selectedItems: [...selectedItems, productId] });
        }
      },

      selectAllItems: () => {
        const { items } = get();
        set({ selectedItems: items.map((item) => item.id) });
      },

      deselectAllItems: () => {
        set({ selectedItems: [] });
      },

      toggleSelectAll: () => {
        const { items, selectedItems } = get();
        if (selectedItems.length === items.length) {
          get().deselectAllItems();
        } else {
          get().selectAllItems();
        }
      },

      // Computed values
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSelectedTotal: () => {
        const { items, selectedItems } = get();
        return items
          .filter((item) => selectedItems.includes(item.id))
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getSelectedItemCount: () => {
        const { items, selectedItems } = get();
        return items
          .filter((item) => selectedItems.includes(item.id))
          .reduce((count, item) => count + item.quantity, 0);
      },

      getShippingFee: () => {
        const total = get().getTotal();
        return total >= 3000 ? 0 : 500;
      },

      getSelectedShippingFee: () => {
        const total = get().getSelectedTotal();
        return total >= 3000 ? 0 : 500;
      },

      getGrandTotal: () => {
        return get().getTotal() + get().getShippingFee();
      },

      getSelectedGrandTotal: () => {
        return get().getSelectedTotal() + get().getSelectedShippingFee();
      },

      isAllSelected: () => {
        const { items, selectedItems } = get();
        return items.length > 0 && items.length === selectedItems.length;
      },

      // クーポン割引額の計算
      getCouponDiscount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;

        const subtotal = get().getTotal();

        if (appliedCoupon.type === 'percentage') {
          const discount = Math.floor(subtotal * (appliedCoupon.value / 100));
          return appliedCoupon.maxDiscount
            ? Math.min(discount, appliedCoupon.maxDiscount)
            : discount;
        } else if (appliedCoupon.type === 'fixed') {
          return Math.min(appliedCoupon.value, subtotal);
        } else if (appliedCoupon.type === 'shipping') {
          return get().getShippingFee();
        }

        return 0;
      },

      // 最終合計（クーポン適用後）
      getFinalTotal: () => {
        const subtotal = get().getTotal();
        const shipping = get().getShippingFee();
        const discount = get().getCouponDiscount();

        const { appliedCoupon } = get();
        if (appliedCoupon && appliedCoupon.type === 'shipping') {
          return subtotal;
        }

        return Math.max(0, subtotal + shipping - discount);
      },

      // 在庫チェック関連
      hasOutOfStockItems: () => {
        const { items } = get();
        return items.some(
          (item) => typeof item.stock === 'number' && item.quantity > item.stock
        );
      },

      hasLowStockItems: () => {
        const { items } = get();
        return items.some(
          (item) =>
            typeof item.stock === 'number' &&
            item.stock > 0 &&
            item.stock < item.quantity
        );
      },

      getOutOfStockItems: () => {
        const { items } = get();
        return items.filter(
          (item) => typeof item.stock === 'number' && item.quantity > item.stock
        );
      },

      canCheckout: () => {
        const { items } = get();
        if (items.length === 0) return false;
        if (get().hasOutOfStockItems()) return false;
        return true;
      },

      // カート内の商品IDを検証し、無効な商品を削除
      validateCartItems: async () => {
        const { items } = get();
        if (items.length === 0) return { removed: [], valid: [] };

        try {
          // Composer APIから現在の商品一覧を取得
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000'}/api/products`, {
            headers: {
              'x-site-id': process.env.NEXT_PUBLIC_SITE_ID || '',
              'x-business-type': process.env.NEXT_PUBLIC_BUSINESS_TYPE || '',
            },
          });

          if (!response.ok) {
            console.error('❌ Failed to fetch products for validation');
            return { removed: [], valid: items };
          }

          const data = await response.json();
          const validProductIds = new Set(data.products.map((p: any) => p.id));

          // 無効な商品をフィルタリング
          const validItems = items.filter((item) => validProductIds.has(item.id));
          const invalidItems = items.filter((item) => !validProductIds.has(item.id));

          if (invalidItems.length > 0) {
            console.log(`🧹 Removed ${invalidItems.length} invalid products from cart:`, invalidItems.map(i => i.id));
            set({
              items: validItems,
              selectedItems: get().selectedItems.filter(id => validProductIds.has(id)),
            });
          }

          return { removed: invalidItems, valid: validItems };
        } catch (error) {
          console.error('❌ Error validating cart items:', error);
          return { removed: [], valid: items };
        }
      },

      // デモデータ追加（開発用）
      addDemoData: () => {
        // sampleProductsから最初の3つの商品を取得してカートアイテムに変換
        const demoItems = sampleProducts.slice(0, 3).map((product, index) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: index === 1 ? 2 : 1, // 2番目の商品は数量2
          image: product.image,
          images: product.images,
          brand: product.brand,
          category: product.category,
          stock: typeof product.stock === 'number' ? product.stock : 50,
          rating: product.rating,
          tags: product.tags,
          code: product.code,
        }));

        set({
          items: demoItems,
          selectedItems: demoItems.map((item) => item.id),
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => {
        // SSR 対応: window が存在しない場合はダミーストレージを返す
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

export default useCartStore;
