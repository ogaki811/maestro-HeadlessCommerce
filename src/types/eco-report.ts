/**
 * 環境配慮商品購入レポート関連の型定義
 */

/**
 * 集計方式
 */
export type AggregationType = 'amount' | 'quantity';

/**
 * レポート作成リクエスト
 */
export interface EcoReportRequest {
  /** 対象コード */
  targetCode: string;
  /** 集計方式 */
  aggregationType: AggregationType;
  /** 集計締日（1-31） */
  closingDay: number;
}

/**
 * レポート作成レスポンス
 */
export interface EcoReportResponse {
  /** 成功フラグ */
  success: boolean;
  /** ダウンロードURL（成功時） */
  downloadUrl?: string;
  /** ファイル名（成功時） */
  fileName?: string;
  /** エラーメッセージ（失敗時） */
  error?: string;
}

/**
 * フォームエラー
 */
export interface EcoReportFormErrors {
  targetCode?: string;
  aggregationType?: string;
  closingDay?: string;
}

/**
 * 対象コードオプション
 */
export interface TargetCodeOption {
  value: string;
  label: string;
}

/**
 * 集計方式オプション
 */
export const AGGREGATION_TYPE_OPTIONS: { value: AggregationType; label: string }[] = [
  { value: 'amount', label: '金額ベース' },
  { value: 'quantity', label: '数量ベース' },
];

/**
 * 集計締日オプション（1〜31日）
 */
export const CLOSING_DAY_OPTIONS: { value: string; label: string }[] = Array.from(
  { length: 31 },
  (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  })
);
