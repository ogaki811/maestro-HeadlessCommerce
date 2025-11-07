export interface NavigationIconConfig {
  id: string;
  href: string;
  label: string;
  iconPath: string | string[];
  text: string;
  showInDrawer?: boolean;        // ドロワーメニューに表示するか
  customizable?: boolean;         // カスタムメニューに追加可能か
  badge?: boolean;                // バッジ表示あり
  showForRoles?: string[];        // 表示対象ロール（将来実装）
  getBadgeCount?: () => number;   // バッジ件数取得関数（モック）
}

export const headerNavigationIcons: NavigationIconConfig[] = [
  {
    id: 'quote-request',
    href: '/quote-request',
    label: '見積り依頼',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    text: '見積り依頼',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'quick-order',
    href: '/quick-order',
    label: 'クイックオーダー',
    iconPath: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z',
    text: 'クイックオーダー',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'my-catalog',
    href: '/my-catalog',
    label: 'マイカタログ',
    iconPath: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
    text: 'マイカタログ',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'order-history',
    href: '/mypage/orders',
    label: '注文履歴',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    text: '注文履歴',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'approval',
    href: '/approval',
    label: '承認',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    text: '承認',
    showInDrawer: true,
    customizable: true,
    badge: true,
    showForRoles: ['admin', 'manager'],
    getBadgeCount: () => 3  // モック: 承認待ち3件
  },
  {
    id: 'contact',
    href: '/contact',
    label: 'お問い合わせ',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    text: 'お問い合わせ',
    showInDrawer: false,      // ドロワーには表示しない（Row 1に固定配置）
    customizable: false        // カスタムメニューから除外
  }
];

// グループ分け設定
export const headerNavigationGroups = {
  left: ['quote-request', 'quick-order', 'my-catalog'],
  right: ['contact']
};
