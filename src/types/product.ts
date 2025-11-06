// 商品型定義

import type { BusinessType } from '@/constants/business-types';

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number; // Display price (商流別価格が適用される)
  basePrice?: number; // Original price before discounts
  image: string;
  images: string[];
  brand: string;
  category: string;
  stock: boolean | number; // true/false または在庫数
  rating: number;
  reviewCount?: number;
  description?: string;
  tags: string[];
  // Multi-business type support
  availableFor?: BusinessType[]; // Which business types can access this product
  minOrderQty?: number; // Minimum order quantity (商流別)
  volumePrices?: VolumePrice[]; // Volume discount tiers (卸売用)
}

export interface VolumePrice {
  minQty: number;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
  deletedAt?: number; // 削除時のタイムスタンプ（復元用）
}

export type Category = '文具・事務用品' | '家具' | '電化製品' | '収納用品';

export type Tag = '人気' | '高評価' | '新商品' | 'セール';

// 商品フィルター
export interface ProductFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  minRating: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
}

// 商品ソート
export type ProductSortOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating-desc'
  | 'newest';

// ページネーション
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
