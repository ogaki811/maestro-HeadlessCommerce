export interface NavigationIconConfig {
  id: string;
  href: string;
  label: string;
  iconPath: string | string[];
  text: string;
}

export const headerNavigationIcons: NavigationIconConfig[] = [
  {
    id: 'quote-request',
    href: '/quote-request',
    label: '見積り依頼',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    text: '見積り依頼'
  },
  {
    id: 'quick-order',
    href: '/quick-order',
    label: 'クイックオーダー',
    iconPath: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z',
    text: 'クイックオーダー'
  },
  {
    id: 'my-catalog',
    href: '/my-catalog',
    label: 'マイカタログ',
    iconPath: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
    text: 'マイカタログ'
  },
  {
    id: 'contact',
    href: '/contact',
    label: 'お問い合わせ',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    text: 'お問い合わせ'
  }
];

// グループ分け設定
export const headerNavigationGroups = {
  left: ['quote-request', 'quick-order', 'my-catalog'],
  right: ['contact']
};
