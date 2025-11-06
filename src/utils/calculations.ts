/**
 * 計算関連のユーティリティ関数
 */

import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, TAX_RATE } from '@/constants';

/**
 * 送料を計算
 * @param subtotal - 小計金額
 * @returns 送料（3000円以上で無料、それ以外は500円）
 */
export const calculateShippingFee = (subtotal: number): number => {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
};

/**
 * 税込価格を計算
 * @param price - 税抜価格
 * @returns 税込価格
 */
export const calculateTaxIncluded = (price: number): number => {
  return Math.floor(price * (1 + TAX_RATE));
};

/**
 * 税額を計算
 * @param price - 税抜価格
 * @returns 税額
 */
export const calculateTax = (price: number): number => {
  return Math.floor(price * TAX_RATE);
};

/**
 * 割引額を計算
 * @param price - 元の価格
 * @param discountRate - 割引率（0.1 = 10%）
 * @returns 割引額
 */
export const calculateDiscount = (price: number, discountRate: number): number => {
  return Math.floor(price * discountRate);
};

/**
 * 割引後価格を計算
 * @param price - 元の価格
 * @param discountRate - 割引率（0.1 = 10%）
 * @returns 割引後価格
 */
export const calculateDiscountedPrice = (price: number, discountRate: number): number => {
  return price - calculateDiscount(price, discountRate);
};

/**
 * ポイント還元額を計算
 * @param price - 購入金額
 * @param pointRate - ポイント還元率（デフォルト: 0.01 = 1%）
 * @returns 還元ポイント
 */
export const calculatePointsEarned = (price: number, pointRate: number = 0.01): number => {
  return Math.floor(price * pointRate);
};

/**
 * パーセンテージを計算
 * @param value - 値
 * @param total - 合計
 * @returns パーセンテージ（0-100）
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
