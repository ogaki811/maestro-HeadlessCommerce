/**
 * 購入データダウンロード機能の型定義
 */

/** データ形式 */
export type DataFormat = 'csv' | 'excel';

/** フォーマット種別 */
export type FormatType = 'normal' | 'normal_with_tax';

/** 管理受託品フィルター */
export type ConsignmentFilter = 'all' | 'consignment_only' | 'non_consignment';

/** 対象データ種別 */
export type TargetDataType = 'own' | 'specified';

/** 検索条件フォームの値 */
export interface PurchaseDataSearchForm {
  /** 開始日 (YYYY-MM-DD) */
  startDate: string;
  /** 終了日 (YYYY-MM-DD) */
  endDate: string;
  /** データ形式 */
  dataFormat: DataFormat;
  /** フォーマット */
  format: FormatType;
  /** 管理受託品フィルター */
  consignmentFilter: ConsignmentFilter;
  /** 対象データ種別 */
  targetData: TargetDataType;
  /** 指定コード（targetData === 'specified' の場合） */
  specifiedCode?: string;
}

/** APIリクエストボディ */
export type PurchaseDataDownloadRequest = PurchaseDataSearchForm;

/** APIエラーレスポンス */
export interface PurchaseDataDownloadError {
  error: string;
  message: string;
}

/** フォームのバリデーションエラー */
export interface PurchaseDataFormErrors {
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  specifiedCode?: string;
}

/** セレクトボックスのオプション定義 */
export const DATA_FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
] as const;

export const FORMAT_OPTIONS = [
  { value: 'normal', label: '通常フォーマット（消費税表記無し）' },
  { value: 'normal_with_tax', label: '通常フォーマット（消費税表記有り）' },
] as const;

export const CONSIGNMENT_FILTER_OPTIONS = [
  { value: 'all', label: 'ALL' },
  { value: 'consignment_only', label: '管理受託品のみ' },
  { value: 'non_consignment', label: '管理受託品以外' },
] as const;

export const TARGET_DATA_OPTIONS = [
  { value: 'own', label: '自分が注文したもの' },
  { value: 'specified', label: '指定コードの注文' },
] as const;
