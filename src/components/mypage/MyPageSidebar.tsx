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
    },
    {
      path: '/mypage/orders',
      label: '注文履歴',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
    },
    {
      path: '/mypage/purchase-management',
      label: '購買管理',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
    },
    {
      path: '/mypage/approval',
      label: '承認関連',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      requiredRoles: ['super_admin', 'admin'], // 管理者のみ
    },
    {
      path: '/mypage/admin-control',
      label: '管理者メニュー利用制御',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      requiredRoles: ['super_admin'], // スーパー管理者のみ
    },
    {
      path: '/favorites',
      label: 'お気に入り',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      requiredRoles: ['super_admin', 'admin', 'general'], // 全員
    },
  ];

  // ロールに基づいてメニューをフィルタリング
  const filteredMenuItems = menuItems.filter((item) => {
    if (!user || !user.role) return true; // ユーザーがログインしていない場合は全て表示
    return item.requiredRoles.includes(user.role);
  });

  return (
    <aside className="ec-sidebar bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8 lg:self-start">
      <nav className="ec-sidebar__nav space-y-2">
        {filteredMenuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`ec-sidebar__link flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'ec-sidebar__link--active bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                className="ec-sidebar__icon w-5 h-5"
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
          );
        })}
      </nav>
    </aside>
  );
}
