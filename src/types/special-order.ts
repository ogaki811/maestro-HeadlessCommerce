/**
 * 掲載外商品取寄せ機能の型定義
 */

/**
 * 取寄せ種別
 * - quote: 見積依頼
 * - order: 注文
 */
export type SpecialOrderType = 'quote' | 'order';

/**
 * 履歴の種別
 * - quote: 見積依頼
 * - order: 注文
 * - order_rejected: 注文(承認却下)
 */
export type HistoryType = 'quote' | 'order' | 'order_rejected';

/**
 * 並び順
 */
export type SortType =
  | 'product_name'           // 商品名順
  | 'registered_date_desc'   // 登録日（新→古）
  | 'registered_date_asc'    // 登録日（古→新）
  | 'order_date_desc'        // 依頼日（新→古）
  | 'order_date_asc';        // 依頼日（古→新）

/**
 * 商品アイテム
 */
export interface SpecialOrderItem {
  productName: string;      // 商品名（必須、全角50桁）
  manufacturer?: string;    // メーカー名（全角20桁）
  quantity?: number;        // 数量（半角5桁）
  unit: string;             // 単位（必須、全角5桁）
  note?: string;            // 備考（全角20桁）
}

/**
 * 新規依頼リクエスト
 */
export interface SpecialOrderRequest {
  type: SpecialOrderType;
  items: SpecialOrderItem[];
}

/**
 * 新規依頼レスポンス
 */
export interface SpecialOrderResponse {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    createdAt: string;
  };
}

/**
 * 定番
 */
export interface SpecialOrderTemplate {
  id: string;
  registeredDate: string;   // YYYY/MM/DD
  createdBy: string;        // 入力者名
  productName: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  note: string;
  isMyTemplate: boolean;    // 自分が登録した定番か
}

/**
 * 定番一覧レスポンス
 */
export interface TemplateListResponse {
  success: boolean;
  data: {
    templates: SpecialOrderTemplate[];
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * 履歴
 */
export interface SpecialOrderHistory {
  id: string;
  type: HistoryType;        // 種別
  orderDate: string;        // YYYY/MM/DD
  createdBy: string;        // 入力者名
  productName: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  note: string;
  canAddToTemplate: boolean; // 定番登録可能か
  isMyOrder: boolean;       // 自分が入力した依頼か
}

/**
 * 履歴一覧レスポンス
 */
export interface HistoryListResponse {
  success: boolean;
  data: {
    history: SpecialOrderHistory[];
    total: number;
    page: number;
    limit: number;
  };
}

/**
 * 履歴から定番登録リクエスト
 */
export interface AddToTemplateRequest {
  historyIds: string[];
}

/**
 * 履歴から定番登録レスポンス
 */
export interface AddToTemplateResponse {
  success: boolean;
  message: string;
  data?: {
    added: number;  // 追加された件数
  };
}

/**
 * 販売店情報
 */
export interface StoreInfo {
  storeName: string;
  department: string;
  contact: string;
  tel: string;
  fax: string;
  email: string;
}

/**
 * フォームバリデーションエラー
 */
export interface ValidationError {
  field: string;
  message: string;
}
