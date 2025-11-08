'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import useCustomMenuStore from '@/store/useCustomMenuStore';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import { drawerMenuSections } from '@/config/drawerMenuConfig';
import { headerNavigationIcons } from '@/config/headerNavigationConfig';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const favoriteCount = useFavoritesStore((state) => state.getFavoriteCount());
  const { customMenuIds, addCustomMenu, removeCustomMenu } = useCustomMenuStore();

  // Escapeキーでメニューを閉じる
  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose,
  });

  // メニューが開いたときにbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    toast.success('ログアウトしました');
    onClose();
    router.push('/');
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleToggleFavorite = (e: React.MouseEvent, menuId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (customMenuIds.includes(menuId)) {
      removeCustomMenu(menuId);
      toast.success('カスタムメニューから削除しました');
    } else {
      addCustomMenu(menuId);
      toast.success('カスタムメニューに追加しました');
    }
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`ec-mobile-menu__overlay fixed inset-0 bg-black/40 z-[120] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ドロワーメニュー */}
      <div className={`ec-mobile-menu fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-[130] overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* ヘッダー */}
        <div className="ec-mobile-menu__header bg-gray-800 text-white p-4 flex items-center justify-between">
          {isAuthenticated ? (
            <div className="ec-mobile-menu__user-info">
              <p className="ec-mobile-menu__user-name font-semibold">{user?.name || 'ゲスト'}</p>
              <p className="ec-mobile-menu__user-email text-sm text-gray-300">{user?.email || ''}</p>
            </div>
          ) : (
            <p className="ec-mobile-menu__title font-semibold">メニュー</p>
          )}
          <button
            onClick={onClose}
            className="ec-mobile-menu__close p-2 hover:bg-gray-700 rounded"
            aria-label="メニューを閉じる"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* メニューアイテム */}
        <nav className="ec-mobile-menu__nav p-4">
          {/* 3セクション構造：注文する、管理・その他、ヘルプ */}
          {drawerMenuSections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className={`ec-mobile-menu__section ${
                sectionIndex > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''
              }`}
            >
              <h3 className="ec-mobile-menu__section-title px-4 text-sm font-semibold text-gray-500 uppercase mb-2">
                {section.title}
              </h3>
              <div className="ec-mobile-menu__section-list space-y-1">
                {section.items.map((item) => {
                  // 認証が必要な項目かつ未認証の場合はスキップ
                  if (item.requiresAuth && !isAuthenticated) {
                    return null;
                  }

                  // お気に入りアイテムの場合、badgeCountを動的に取得
                  const badgeCount = item.id === 'favorites' ? favoriteCount : item.getBadgeCount?.() || 0;
                  const showBadge = item.badge && badgeCount > 0;

                  // headerNavigationIconsから対応する設定を取得
                  const navIcon = headerNavigationIcons.find(icon => icon.id === item.id);
                  const isCustomizable = navIcon?.customizable !== false;
                  const isFavorited = customMenuIds.includes(item.id);

                  return (
                    <div key={item.id} className="relative">
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {/* アイコン */}
                        <svg
                          className="ec-mobile-menu__icon w-5 h-5 mr-3 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {Array.isArray(item.iconPath) ? (
                            item.iconPath.map((path, index) => <path key={index} d={path} />)
                          ) : (
                            <path d={item.iconPath} />
                          )}
                        </svg>

                        {/* ラベル */}
                        <span className="flex-1">{item.label}</span>

                        {/* 星アイコン（カスタムメニュー追加用）- 開発中は常に表示 */}
                        {isCustomizable && (
                          <button
                            onClick={(e) => handleToggleFavorite(e, item.id)}
                            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label={isFavorited ? 'カスタムメニューから削除' : 'カスタムメニューに追加'}
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill={isFavorited ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        )}

                        {/* バッジ */}
                        {showBadge && (
                          <span className="ec-mobile-menu__badge ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {badgeCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* アカウントセクション */}
          <div className="ec-mobile-menu__account mt-6 pt-6 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="ec-mobile-menu__account-links space-y-1">
                <Link
                  href="/mypage"
                  onClick={handleLinkClick}
                  className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  マイページ
                </Link>

                <button
                  onClick={handleLogout}
                  className="ec-mobile-menu__logout w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="ec-mobile-menu__guest-links space-y-1">
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  ログイン
                </Link>

                <Link
                  href="/signup"
                  onClick={handleLinkClick}
                  className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
