/**
 * Business Type Constants
 * ビジネスタイプ（商流）定数
 */

export const BUSINESS_TYPES = {
  TOC: 'toc',
  WHOLESALE: 'wholesale',
  RETAIL: 'retail',
} as const;

export type BusinessType = typeof BUSINESS_TYPES[keyof typeof BUSINESS_TYPES];

/**
 * Business Type Configuration
 * 商流別設定
 */
export const BUSINESS_TYPE_CONFIG = {
  [BUSINESS_TYPES.TOC]: {
    code: 'toc',
    name: 'TOC販売店向け',
    priceType: 'dealer',
    requiresMembership: true,
    hasPointSystem: true,
    minOrderQty: 10,
    paymentMethods: ['invoice', 'bank_transfer'],
    features: {
      dealerCode: true,
      volumeDiscount: true,
      backorder: true,
    },
  },
  [BUSINESS_TYPES.WHOLESALE]: {
    code: 'wholesale',
    name: '卸売',
    priceType: 'wholesale',
    requiresMembership: true,
    hasPointSystem: false,
    minOrderQty: 50,
    paymentMethods: ['invoice', 'bank_transfer', 'corporate_credit'],
    features: {
      companyCode: true,
      quoteSystem: true,
      bulkOrder: true,
      volumeDiscount: true,
    },
  },
  [BUSINESS_TYPES.RETAIL]: {
    code: 'retail',
    name: '小売',
    priceType: 'retail',
    requiresMembership: false,
    hasPointSystem: true,
    minOrderQty: 1,
    paymentMethods: ['credit_card', 'convenience', 'cod', 'bank_transfer'],
    features: {
      guestCheckout: true,
      wishlist: true,
      productReviews: true,
    },
  },
} as const;

/**
 * Payment Method Labels
 * 決済方法のラベル
 */
export const PAYMENT_METHOD_LABELS = {
  invoice: '請求書払い',
  bank_transfer: '銀行振込',
  corporate_credit: '法人クレジット',
  credit_card: 'クレジットカード',
  convenience: 'コンビニ決済',
  cod: '代金引換',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHOD_LABELS;
