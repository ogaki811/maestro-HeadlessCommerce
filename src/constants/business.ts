/**
 * ビジネスロジック定数
 */

// 送料設定
export const SHIPPING_FEE = 500;
export const FREE_SHIPPING_THRESHOLD = 3000;

// ポイント設定
export const POINT_RATE = 0.01; // 1%還元
export const MIN_POINT_USAGE = 100;

// 価格設定
export const TAX_RATE = 0.1; // 10%

// 在庫警告
export const LOW_STOCK_THRESHOLD = 10;
export const OUT_OF_STOCK = 0;

// ページネーション
export const DEFAULT_ITEMS_PER_PAGE = 18;
export const SEARCH_ITEMS_PER_PAGE = 18;
export const CART_ITEMS_PER_PAGE = 20;

// バリデーション
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;
export const POSTAL_CODE_LENGTH = 7;

// タイムアウト
export const API_TIMEOUT = 30000; // 30秒
export const TOAST_DURATION = 3000; // 3秒
