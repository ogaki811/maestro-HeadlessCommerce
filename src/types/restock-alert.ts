/**
 * 販売再開メール関連の型定義
 */

/**
 * 販売再開メール登録情報
 */
export interface RestockAlert {
  /** 登録ID */
  id: string;
  /** 商品ID（詳細ページ遷移用） */
  productId: string;
  /** 商品コード（表示用） */
  productCode: string;
  /** 商品名 */
  productName: string;
  /** 登録日時 */
  createdAt: string;
}

/**
 * 販売再開メール一覧取得レスポンス
 */
export interface RestockAlertsResponse {
  /** 成功フラグ */
  success: boolean;
  /** 登録一覧 */
  data: RestockAlert[];
  /** 総件数 */
  total: number;
  /** エラーメッセージ（失敗時） */
  error?: string;
}

/**
 * 販売再開メール解除レスポンス
 */
export interface RestockAlertDeleteResponse {
  /** 成功フラグ */
  success: boolean;
  /** メッセージ */
  message?: string;
  /** エラーメッセージ（失敗時） */
  error?: string;
}
