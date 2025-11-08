/**
 * Quotation Types
 * 見積依頼関連の型定義
 */

/**
 * 販売店情報
 */
export interface Vendor {
  id: string;
  name: string;          // 販売店名: "プラス株式会社"
  userCode: string;      // ユーザーコード: "11100"
  webId: string;         // WebID: "1588847004"
  contactPerson: string; // 担当者名: "本部共有デモ"
  department?: string;   // 部署: "プラス市役所（A事務機）"
  email?: string;        // メールアドレス
  phone?: string;        // 電話番号
}

/**
 * 見積依頼商品
 */
export interface QuotationProduct {
  id: string;
  productCode: string;     // 商品コード
  productName: string;     // 商品名
  quantity: number;        // 数量
  specifications?: string; // 仕様
  imageUrl?: string;       // 商品画像URL
}

/**
 * 見積ステータス
 */
export type QuotationStatus =
  | 'draft'                // 下書き
  | 'pending'              // 回答待ち
  | 'partially_responded'  // 一部回答済み（相見積もり時）
  | 'responded'            // 回答済み
  | 'accepted'             // 承認済み
  | 'rejected'             // 却下
  | 'expired';             // 期限切れ

/**
 * 見積回答（Phase 4で使用）
 */
export interface QuotationResponse {
  id?: string;
  quotationId?: string;
  vendorId: string;
  responseDate: string;
  products?: Array<{
    productId: string;
    unitPrice: number;
    totalPrice: number;
    leadTime: string;        // 納期
    notes?: string;          // 備考
  }>;
  totalAmount: number;
  validUntil: string;        // 見積有効期限
  message?: string;          // 営業担当者からのメッセージ
}

/**
 * 見積依頼
 */
export interface Quotation {
  id: string;                     // 見積依頼番号: "Q-2024-0115"
  requestDate: string;            // 依頼日: "2024-01-15"
  requestUser: string;            // 依頼者ID
  requestUserName?: string;       // 依頼者名
  vendors: Vendor[];              // 見積依頼先販売店（複数可：相見積もり）
  products: QuotationProduct[];   // 依頼商品リスト（複数可）
  status: QuotationStatus;        // ステータス
  groupId?: string;               // 見積グループID（Phase 3で使用）

  // Phase 4: 追跡機能で使用
  responses?: QuotationResponse[]; // 営業担当者からの回答

  // 通知設定
  emailNotification?: {
    salesPerson: string;          // 営業担当者メール
    cc?: string[];                // CC
    bcc?: string[];               // BCC
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * 検索条件
 */
export interface QuotationSearchParams {
  quotationNumber?: string;   // 見積依頼番号
  startDate?: string;         // 依頼日（開始）
  endDate?: string;           // 依頼日（終了）
  productCode?: string;       // 商品コード
  selectedVendors?: string[]; // 選択販売店ID
  status?: QuotationStatus;   // ステータス
}

/**
 * 見積グループ（Phase 3で使用）
 */
export interface QuotationGroup {
  id: string;
  name: string;              // グループ名
  quotationIds: string[];    // 見積依頼IDリスト
  createdAt: string;
}

/**
 * ステータスバッジのバリアント
 */
export type QuotationStatusBadgeVariant =
  | 'default'
  | 'info'
  | 'warning'
  | 'success'
  | 'danger';

/**
 * ステータスからバッジバリアントを取得
 */
export const getStatusBadgeVariant = (
  status: QuotationStatus
): QuotationStatusBadgeVariant => {
  const variantMap: Record<QuotationStatus, QuotationStatusBadgeVariant> = {
    draft: 'default',
    pending: 'info',
    partially_responded: 'warning',
    responded: 'success',
    accepted: 'success',
    rejected: 'danger',
    expired: 'default',
  };
  return variantMap[status];
};

/**
 * ステータスの日本語表示
 */
export const getStatusLabel = (status: QuotationStatus): string => {
  const labelMap: Record<QuotationStatus, string> = {
    draft: '下書き',
    pending: '回答待ち',
    partially_responded: '一部回答済み',
    responded: '回答済み',
    accepted: '承認済み',
    rejected: '却下',
    expired: '期限切れ',
  };
  return labelMap[status];
};
