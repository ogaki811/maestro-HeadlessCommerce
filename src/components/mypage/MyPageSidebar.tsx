'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function MyPageSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    {
      path: '/mypage',
      label: '登録情報',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'general',
    },
    {
      path: '/mypage/orders',
      label: '注文履歴',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'general',
    },
    {
      path: '/favorites',
      label: 'お気に入り',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'general',
    },
    {
      path: '/mypage/catalog-settings',
      label: 'マイカタログ設定',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/purchase-data',
      label: '購入データダウンロード',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/eco-report',
      label: '環境配慮レポート',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/sds-rohs',
      label: 'SDS,RoHS関連資料請求',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/special-order',
      label: '掲載外商品取寄せ',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/restock-alerts',
      label: '販売再開メール一覧',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/delivery-calendar',
      label: '配送カレンダー登録',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
      section: 'purchase',
    },
    {
      path: '/mypage/purchase-management',
      label: '購買管理',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      requiredRoles: ['super_admin', 'admin'], // 管理者のみ
      section: 'admin',
    },
    {
      path: '/mypage/approval',
      label: '承認関連',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      requiredRoles: ['super_admin', 'admin'], // 管理者のみ
      section: 'admin',
    },
    {
      path: '/mypage/web-id-management',
      label: 'Web ID管理',
      icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
      requiredRoles: ['super_admin', 'admin'], // 管理者のみ
      section: 'admin',
    },
    {
      path: '/mypage/admin-control',
      label: '管理者メニュー利用制御',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      requiredRoles: ['super_admin'], // スーパー管理者のみ
      section: 'admin',
    },
  ];

  // ロールに基づいてメニューをフィルタリング
  const filteredMenuItems = menuItems.filter((item) => {
    if (!user || !user.role) return true; // ユーザーがログインしていない場合は全て表示
    return item.requiredRoles.includes(user.role);
  });

  // セクションタイトルのマッピング
  const sectionTitles: { [key: string]: string } = {
    purchase: '購入関連',
    admin: '管理者メニュー',
  };

  return (
    <aside className="ec-sidebar bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8 lg:self-start">
      <nav className="ec-sidebar__nav space-y-1">
        {filteredMenuItems.map((item, index) => {
          const active = isActive(item.path);
          const prevItem = index > 0 ? filteredMenuItems[index - 1] : null;
          const showDivider = prevItem && prevItem.section !== item.section;
          const showSectionTitle = showDivider && sectionTitles[item.section];

          return (
            <div key={item.path}>
              {/* セクションの変わり目に区切り線とタイトルを表示 */}
              {showDivider && (
                <div className="border-t border-gray-200 my-3" />
              )}
              {showSectionTitle && (
                <div className="px-4 pt-2 pb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {sectionTitles[item.section]}
                  </span>
                </div>
              )}
              <Link
                href={item.path}
                className={`ec-sidebar__link flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'ec-sidebar__link--active bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg
                  className="ec-sidebar__icon w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="ec-sidebar__label font-medium">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
