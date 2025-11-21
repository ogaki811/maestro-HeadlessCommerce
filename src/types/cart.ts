// カート型定義

import { CartItem } from './product';

// クーポン型
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  maxDiscount?: number;
  minPurchase?: number;
  description: string;
  expiresAt: string;
}

// カート操作のレスポンス型
export interface CartActionResponse {
  success: boolean;
  message?: string;
  maxQuantity?: number;
}

// カートストア State
export interface CartState {
  // State
  items: CartItem[];
  selectedItems: string[];
  recentlyDeleted: (CartItem & { deletedAt: number })[];
  appliedCoupon: Coupon | null;
  lastAddedItem: CartItem | null;

  // Actions
  addItem: (product: CartItem) => void;
  removeItem: (productId: string) => void;
  removeSelectedItems: () => void;
  restoreItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => CartActionResponse | void;
  clearCart: () => void;

  // クーポン
  applyCoupon: (coupon: Coupon) => CartActionResponse;
  removeCoupon: () => void;

  // 選択
  toggleSelectItem: (productId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  toggleSelectAll: () => void;

  // Computed
  getTotal: () => number;
  getSelectedTotal: () => number;
  getItemCount: () => number;
  getSelectedItemCount: () => number;
  getShippingFee: () => number;
  getSelectedShippingFee: () => number;
  getGrandTotal: () => number;
  getSelectedGrandTotal: () => number;
  isAllSelected: () => boolean;
  getCouponDiscount: () => number;
  getFinalTotal: () => number;

  // 在庫チェック
  hasOutOfStockItems: () => boolean;
  hasLowStockItems: () => boolean;
  getOutOfStockItems: () => CartItem[];
  canCheckout: () => boolean;

  // カート検証
  validateCartItems: () => Promise<{
    removed: CartItem[];
    valid: CartItem[];
  }>;

  // 開発用
  addDemoData: () => Promise<void>;
}

// お気に入りストア State
export interface FavoritesState {
  favorites: CartItem[];
  addFavorite: (product: CartItem) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: CartItem) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
}
