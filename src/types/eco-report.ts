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

/**
 * 環境配慮商品カテゴリ
 */
export type EcoCategoryType = 'ecoMark' | 'greenPurchase' | 'gpnEco' | 'ecoTotal';

/**
 * カテゴリ情報
 */
export const ECO_CATEGORY_INFO: Record<EcoCategoryType, { label: string; color: string }> = {
  ecoMark: { label: 'エコマーク商品', color: '#4CAF50' },
  greenPurchase: { label: 'グリーン購入法適合商品', color: '#8BC34A' },
  gpnEco: { label: 'GPNエコ商品ねっと掲載商品', color: '#607D8B' },
  ecoTotal: { label: '環境配慮商品合計', color: '#FF9800' },
};

/**
 * 月別データ
 */
export interface EcoReportMonthData {
  /** 年月（例: "2024/12"） */
  month: string;
  /** 開始日（例: "2024/11/21"） */
  startDate: string;
  /** 終了日（例: "2024/12/20"） */
  endDate: string;
  /** 総購入額 */
  totalPurchase: number;
  /** エコマーク商品金額 */
  ecoMark: number;
  /** エコマーク商品構成比 */
  ecoMarkRatio: number;
  /** グリーン購入法適合商品金額 */
  greenPurchase: number;
  /** グリーン購入法適合商品構成比 */
  greenPurchaseRatio: number;
  /** GPNエコ商品ねっと掲載商品金額 */
  gpnEco: number;
  /** GPNエコ商品ねっと掲載商品構成比 */
  gpnEcoRatio: number;
  /** 環境配慮商品合計金額 */
  ecoTotal: number;
  /** 環境配慮商品合計構成比 */
  ecoTotalRatio: number;
}

/**
 * 合計データ
 */
export interface EcoReportTotalData {
  /** 総購入額 */
  totalPurchase: number;
  /** エコマーク商品金額 */
  ecoMark: number;
  /** エコマーク商品構成比 */
  ecoMarkRatio: number;
  /** グリーン購入法適合商品金額 */
  greenPurchase: number;
  /** グリーン購入法適合商品構成比 */
  greenPurchaseRatio: number;
  /** GPNエコ商品ねっと掲載商品金額 */
  gpnEco: number;
  /** GPNエコ商品ねっと掲載商品構成比 */
  gpnEcoRatio: number;
  /** 環境配慮商品合計金額 */
  ecoTotal: number;
  /** 環境配慮商品合計構成比 */
  ecoTotalRatio: number;
}

/**
 * レポート結果データ
 */
export interface EcoReportResultData {
  /** 対象コード */
  targetCode: string;
  /** 対象名 */
  targetName: string;
  /** 集計締日 */
  closingDay: number;
  /** 集計方式 */
  aggregationType: AggregationType;
  /** 集計項目ラベル（例: "税抜金額（円単位）"） */
  aggregationLabel: string;
  /** 月別データ（12ヶ月分） */
  monthlyData: EcoReportMonthData[];
  /** 合計データ */
  total: EcoReportTotalData;
}

/**
 * 集計項目ラベル
 */
export const AGGREGATION_LABELS: Record<AggregationType, string> = {
  amount: '税抜金額（円単位）',
  quantity: '数量（個数）',
};
