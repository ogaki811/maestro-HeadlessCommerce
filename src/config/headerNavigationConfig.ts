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
  // drawerMenuConfigから追加
  {
    id: 'quotation-list',
    href: '/quotations',
    label: '見積依頼一覧',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    text: '見積依頼一覧',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'special-order',
    href: '/special-order',
    label: '掲載外商品お取り寄せ',
    iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    text: '掲載外商品お取り寄せ',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'favorites',
    href: '/favorites',
    label: 'お気に入り',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    text: 'お気に入り',
    showInDrawer: true,
    customizable: true,
    badge: true,
    getBadgeCount: () => 0
  },
  {
    id: 'compare-box',
    href: '/compare',
    label: '商品比較BOX',
    iconPath: ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 'M9 12l2 2 4-4'],
    text: '商品比較BOX',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'purchase-management',
    href: '/mypage/purchase-management',
    label: '購買管理',
    iconPath: ['M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', 'M9 12l2 2 4-4'],
    text: '購買管理',
    showInDrawer: true,
    customizable: true
  },
  {
    id: 'approval',
    href: '/approval',
    label: '承認',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    text: '承認',
    showInDrawer: false,      // ドロワーには表示しない（Row 1に固定配置）
    customizable: false,       // カスタムメニューから除外
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
  left: ['quick-order', 'my-catalog'],
  right: ['contact']
};
