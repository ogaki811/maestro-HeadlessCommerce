'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import useCustomMenuStore from '@/store/useCustomMenuStore';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import { headerNavigationIcons } from '@/config/headerNavigationConfig';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const favoriteCount = useFavoritesStore((state) => state.getFavoriteCount());
  const { isCustomMenu, toggleCustomMenu } = useCustomMenuStore();

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
          <div className="ec-mobile-menu__main-links space-y-1">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホーム
            </Link>

            <Link
              href="/products"
              onClick={handleLinkClick}
              className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              商品一覧
            </Link>

            <Link
              href="/favorites"
              onClick={handleLinkClick}
              className="ec-mobile-menu__link flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="ec-mobile-menu__icon w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              お気に入り
              {favoriteCount > 0 && (
                <span className="ec-mobile-menu__badge ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {favoriteCount}
                </span>
              )}
            </Link>
          </div>

          {/* カテゴリー */}
          <div className="ec-mobile-menu__categories mt-6 pt-6 border-t border-gray-200">
            <h3 className="ec-mobile-menu__section-title px-4 text-sm font-semibold text-gray-500 uppercase mb-2">カテゴリー</h3>
            <div className="ec-mobile-menu__category-list space-y-1">
              {[
                { name: 'オフィス用品', path: '/category/office' },
                { name: '文具', path: '/category/stationery' },
                { name: '電化製品', path: '/category/electronics' },
                { name: '家具', path: '/category/furniture' },
              ].map((category) => (
                <Link
                  key={category.path}
                  href={category.path}
                  onClick={handleLinkClick}
                  className="ec-mobile-menu__category-link block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* カスタムメニュー（機能メニュー） */}
          <div className="ec-mobile-menu__custom-section mt-6 pt-6 border-t border-gray-200">
            <h3 className="ec-mobile-menu__section-title px-4 text-sm font-semibold text-gray-500 uppercase mb-2">
              機能メニュー
            </h3>
            <div className="ec-mobile-menu__custom-list space-y-1">
              {headerNavigationIcons
                .filter((icon) => icon.showInDrawer)
                .map((menu) => (
                  <div
                    key={menu.id}
                    className="ec-mobile-menu__custom-item flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {/* 星アイコン（カスタマイズ可能な項目のみ） */}
                    {menu.customizable && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCustomMenu(menu.id);
                        }}
                        className={`
                          ec-mobile-menu__star
                          w-5 h-5 mr-3 flex-shrink-0
                          text-gray-400 hover:text-yellow-500
                          transition-colors
                          ${isCustomMenu(menu.id) ? 'ec-mobile-menu__star--filled' : ''}
                        `}
                        aria-label={`${menu.label}をカスタムメニューに${isCustomMenu(menu.id) ? '削除' : '追加'}`}
                        aria-pressed={isCustomMenu(menu.id)}
                        data-testid="star-icon"
                      >
                        {isCustomMenu(menu.id) ? (
                          // Filled Star（選択済み）
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-full h-full text-yellow-500"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          // Outline Star（未選択）
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-full h-full"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* メニューリンク */}
                    <Link
                      href={menu.href}
                      onClick={handleLinkClick}
                      className="flex-1 flex items-center text-gray-700"
                    >
                      {/* アイコン */}
                      <svg
                        className="ec-mobile-menu__icon w-5 h-5 mr-3 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        {Array.isArray(menu.iconPath) ? (
                          menu.iconPath.map((path, index) => <path key={index} d={path} />)
                        ) : (
                          <path d={menu.iconPath} />
                        )}
                      </svg>

                      {/* テキスト */}
                      <span>{menu.text}</span>

                      {/* バッジ（承認件数など） */}
                      {menu.badge && menu.getBadgeCount && (
                        <span className="ec-mobile-menu__custom-badge ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {menu.getBadgeCount()}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
            </div>
          </div>

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
