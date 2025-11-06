/**
 * キャンペーン公開状態
 */
export type CampaignPublishStatus = 'draft' | 'published' | 'archived';

/**
 * キャンペーンステータス（算出値）
 * - upcoming: 開催前
 * - active: 開催中
 * - ended: 終了
 */
export type CampaignStatus = 'upcoming' | 'active' | 'ended';

/**
 * キャンペーンデータ
 */
export interface Campaign {
  /** キャンペーンID（UUID） */
  id: string;

  /** タイトル */
  title: string;

  /** URLスラッグ（例: "spring-sale-2024"） */
  slug: string;

  /** 説明文 */
  description: string;

  /** 詳細コンテンツ（Markdown対応） */
  content?: string;

  /** バナー画像URL */
  bannerImageUrl: string;

  /** サムネイル画像URL */
  thumbnailImageUrl?: string;

  /** 開始日時（ISO 8601） */
  startDate: string;

  /** 終了日時（ISO 8601） */
  endDate: string;

  /** 公開状態 */
  publishStatus: CampaignPublishStatus;

  /** 対象商品IDリスト */
  productIds: string[];

  /** 表示順序 */
  displayOrder: number;

  /** 作成日時 */
  createdAt: string;

  /** 更新日時 */
  updatedAt: string;
}

/**
 * キャンペーンのステータスを判定
 */
export function getCampaignStatus(campaign: Campaign): CampaignStatus {
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  if (now < startDate) {
    return 'upcoming'; // 開催前
  }

  if (now > endDate) {
    return 'ended'; // 終了
  }

  return 'active'; // 開催中
}

/**
 * キャンペーンが公開中かどうか判定
 */
export function isActiveCampaign(campaign: Campaign): boolean {
  if (campaign.publishStatus !== 'published') {
    return false;
  }

  const status = getCampaignStatus(campaign);
  return status === 'active';
}

/**
 * キャンペーン期間をフォーマット
 */
export function formatCampaignPeriod(campaign: Campaign): string {
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return `${formatDate(startDate)} 〜 ${formatDate(endDate)}`;
}
