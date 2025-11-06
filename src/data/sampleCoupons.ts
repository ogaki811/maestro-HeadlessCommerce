import type { Coupon } from '@/types';

// サンプルクーポンデータ
export const sampleCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    maxDiscount: 1000,
    minPurchase: 3000,
    description: '初回限定10%OFFクーポン',
    expiresAt: '2025-12-31',
  },
  {
    id: '2',
    code: 'SAVE500',
    type: 'fixed',
    value: 500,
    minPurchase: 5000,
    description: '5,000円以上で500円OFF',
    expiresAt: '2025-12-31',
  },
  {
    id: '3',
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    minPurchase: 2000,
    description: '送料無料クーポン',
    expiresAt: '2025-12-31',
  },
  {
    id: '4',
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    maxDiscount: 3000,
    minPurchase: 10000,
    description: 'サマーセール20%OFF',
    expiresAt: '2025-08-31',
  },
  {
    id: '5',
    code: 'MEGA1000',
    type: 'fixed',
    value: 1000,
    minPurchase: 10000,
    description: 'メガセール1,000円OFF',
    expiresAt: '2025-12-31',
  },
];

/**
 * クーポンコードから検索
 * @param code - クーポンコード
 * @returns クーポンデータまたはundefined
 */
export const findCouponByCode = (code: string): Coupon | undefined => {
  return sampleCoupons.find(
    (coupon) => coupon.code.toUpperCase() === code.toUpperCase()
  );
};

/**
 * 利用可能なクーポンを取得（購入金額に基づく）
 * @param totalAmount - 購入金額
 * @returns 利用可能なクーポンリスト
 */
export const getAvailableCoupons = (totalAmount: number): Coupon[] => {
  const now = new Date();
  return sampleCoupons.filter((coupon) => {
    const expireDate = new Date(coupon.expiresAt);
    const isNotExpired = expireDate > now;
    const meetsMinPurchase = !coupon.minPurchase || totalAmount >= coupon.minPurchase;
    return isNotExpired && meetsMinPurchase;
  });
};
