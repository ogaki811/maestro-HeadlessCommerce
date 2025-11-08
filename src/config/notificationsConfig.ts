/**
 * Notifications Configuration
 * 重要なお知らせの設定
 */

export interface Notification {
  id: string;
  message: string;
  link?: {
    href: string;
    text: string;
  };
  priority?: 'high' | 'medium' | 'low';
}

/**
 * 重要なお知らせリスト
 * 上から順に表示されます
 */
export const notifications: Notification[] = [
  {
    id: 'maintenance-2024-01',
    message: 'システムメンテナンスのお知らせ: 2024年1月15日（月）2:00〜5:00の間、サービスを停止いたします。',
    link: {
      href: '/news/maintenance',
      text: '詳細を見る',
    },
    priority: 'high',
  },
  {
    id: 'campaign-2024-winter',
    message: '冬のキャンペーン実施中！対象商品が最大30%OFF',
    link: {
      href: '/campaigns/winter-2024',
      text: 'キャンペーンページへ',
    },
    priority: 'medium',
  },
];
