/**
 * バナータイプ
 * - info: 情報（青）
 * - success: 成功（緑）
 * - warning: 警告（黄）
 * - error: エラー（赤）
 */
export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * バナーのステータス（算出値）
 * - scheduled: 予約中（公開前）
 * - active: 公開中
 * - expired: 期限切れ（公開終了）
 */
export type BannerStatus = 'scheduled' | 'active' | 'expired';

/**
 * バナー設定データ
 */
export interface BannerConfig {
  /** バナーID（UUID v4） */
  id: string;

  /** メッセージ本文（必須） */
  message: string;

  /** バナータイプ（必須） */
  variant: BannerVariant;

  /** 画像URL（必須） */
  imageUrl: string;

  /** ボタンラベル（任意） */
  actionLabel?: string;

  /** リンク先URL（任意） */
  actionUrl?: string;

  /** 公開開始日時（任意、ISO 8601形式） */
  publishStartDate?: string;

  /** 公開終了日時（任意、ISO 8601形式） */
  publishEndDate?: string;

  /** 作成日時（ISO 8601形式） */
  createdAt: string;

  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
}
