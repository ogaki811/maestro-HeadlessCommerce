/**
 * Pricing Logic for Multi-Business Type
 * 商流別価格ロジック
 */

import { type BusinessType, BUSINESS_TYPE_CONFIG } from '@/constants/business-types';

export interface ProductPrice {
  productId: string;
  businessType: BusinessType;
  basePrice: number;
  taxRate: number;
  minOrderQty: number;
  volumePrices?: VolumePrice[];
}

export interface VolumePrice {
  minQty: number;
  price: number;
}

/**
 * Calculate price based on business type and quantity
 * 商流とボリュームに基づいて価格を計算
 */
export function calculatePrice(
  productPrice: ProductPrice,
  quantity: number
): {
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  totalWithTax: number;
  discount?: number;
} {
  let unitPrice = productPrice.basePrice;

  // Apply volume discount for wholesale
  if (productPrice.volumePrices && productPrice.volumePrices.length > 0) {
    const applicableVolumPrice = productPrice.volumePrices
      .filter((vp) => quantity >= vp.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0];

    if (applicableVolumPrice) {
      unitPrice = applicableVolumPrice.price;
    }
  }

  const totalPrice = unitPrice * quantity;
  const taxAmount = totalPrice * productPrice.taxRate;
  const totalWithTax = totalPrice + taxAmount;
  const discount = productPrice.basePrice > unitPrice
    ? (productPrice.basePrice - unitPrice) * quantity
    : undefined;

  return {
    unitPrice,
    totalPrice,
    taxAmount,
    totalWithTax,
    discount,
  };
}

/**
 * Get minimum order quantity for business type
 * 商流別の最小注文数を取得
 */
export function getMinOrderQty(businessType: BusinessType): number {
  return BUSINESS_TYPE_CONFIG[businessType].minOrderQty;
}

/**
 * Check if quantity meets minimum order requirement
 * 最小注文数要件を満たしているか確認
 */
export function meetsMinOrderQty(
  businessType: BusinessType,
  quantity: number
): boolean {
  return quantity >= getMinOrderQty(businessType);
}

/**
 * Format price for display
 * 価格を表示用にフォーマット
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price);
}

/**
 * Calculate points earned (for TOC and Retail)
 * ポイント獲得計算（TOC・小売のみ）
 */
export function calculatePointsEarned(
  businessType: BusinessType,
  totalPrice: number,
  pointRate: number = 0.01 // 1% default
): number {
  const config = BUSINESS_TYPE_CONFIG[businessType];
  if (!config.hasPointSystem) {
    return 0;
  }
  return Math.floor(totalPrice * pointRate);
}
