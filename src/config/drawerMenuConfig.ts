/**
 * Drawer Menu Configuration
 * ドロワーメニュー設定
 *
 * モバイル用ドロワーメニューの構成を定義
 */

/**
 * ドロワーメニューアイテム
 */
export interface DrawerMenuItem {
  /**
   * 一意のID
   */
  id: string;

  /**
   * 表示テキスト
   */
  label: string;

  /**
   * リンク先URL
   */
  href: string;

  /**
   * SVGアイコンのパス（d属性）
   */
  iconPath: string | string[];

  /**
   * バッジを表示するか
   */
  badge?: boolean;

  /**
   * バッジカウント取得関数
   */
  getBadgeCount?: () => number;

  /**
   * 認証が必要か
   */
  requiresAuth?: boolean;
}

/**
 * ドロワーメニューセクション
 */
export interface DrawerMenuSection {
  /**
   * セクションID
   */
  id: string;

  /**
   * セクションタイトル
   */
  title: string;

  /**
   * メニューアイテム
   */
  items: DrawerMenuItem[];
}

/**
 * 【注文する】セクション
 */
export const orderSection: DrawerMenuSection = {
  id: 'order',
  title: '注文する',
  items: [
    {
      id: 'quick-order',
      label: 'クイックオーダー',
      href: '/quick-order',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      requiresAuth: true,
    },
    {
      id: 'order-history',
      label: '注文履歴確認',
      href: '/mypage/orders',
      iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      requiresAuth: true,
    },
    {
      id: 'special-order',
      label: '掲載外商品お取り寄せ',
      href: '/special-order',
      iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      requiresAuth: true,
    },
    {
      id: 'my-catalog',
      label: 'マイカタログ',
      href: '/mypage/catalog',
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      requiresAuth: true,
    },
    {
      id: 'favorites',
      label: 'お気に入り',
      href: '/favorites',
      iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      badge: true,
      getBadgeCount: () => {
        // Zustand storeから取得（実装時にimportする）
        return 0;
      },
    },
    {
      id: 'compare-box',
      label: '商品比較BOX',
      href: '/compare',
      iconPath: ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 'M9 12l2 2 4-4'],
    },
  ],
};

/**
 * 【管理・その他】セクション
 */
export const managementSection: DrawerMenuSection = {
  id: 'management',
  title: '管理・その他',
  items: [
    {
      id: 'mypage',
      label: 'マイページ',
      href: '/mypage',
      iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      requiresAuth: true,
    },
    {
      id: 'purchase-data-download',
      label: '購入データダウンロード',
      href: '/mypage/download',
      iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
      requiresAuth: true,
    },
    {
      id: 'eco-report',
      label: '環境配慮商品購入レポート',
      href: '/mypage/eco-report',
      iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      requiresAuth: true,
    },
    {
      id: 'digital-catalog',
      label: 'デジタルカタログ',
      href: '/catalog',
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
      id: 'smartworks-magazine',
      label: 'スマートワークス・マガジン',
      href: '/magazine',
      iconPath: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    },
    {
      id: 'jtx-tv',
      label: 'JTX TV',
      href: '/tv',
      iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    },
  ],
};

/**
 * 【ヘルプ】セクション
 */
export const helpSection: DrawerMenuSection = {
  id: 'help',
  title: 'ヘルプ',
  items: [
    {
      id: 'user-guide',
      label: 'ご利用ガイド',
      href: '/help/guide',
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
      id: 'faq',
      label: 'よくある質問',
      href: '/help/faq',
      iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      id: 'delivery',
      label: 'お届け日について',
      href: '/help/delivery',
      iconPath: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
    },
    {
      id: 'cancel',
      label: 'キャンセルについて',
      href: '/help/cancel',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      id: 'return',
      label: '返品について',
      href: '/help/return',
      iconPath: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z',
    },
    {
      id: 'contact',
      label: 'お問い合わせ窓口について',
      href: '/help/contact',
      iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
  ],
};

/**
 * 全セクション
 */
export const drawerMenuSections: DrawerMenuSection[] = [
  orderSection,
  managementSection,
  helpSection,
];
