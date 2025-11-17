'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/useAuthStore';

interface UserNameDisplayProps {
  userName: string;
  userEmail?: string;
}

export default function UserNameDisplay({
  userName,
  userEmail
}: UserNameDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('ログアウトしました');
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          text-sm text-[#2d2626]
          pl-4 pr-4 py-2
          rounded-md
          hover:bg-gray-100
          hover:text-gray-900
          transition-colors
          font-medium
        "
        aria-label="ユーザーメニュー"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span
          className="truncate max-w-[120px]"
          title={userName}
        >
          {userName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-[110]"
            onClick={() => setIsOpen(false)}
          />

          {/* ドロップダウンメニュー */}
          <div
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[111]"
            role="menu"
          >
            {/* ユーザー情報 */}
            <div className="px-3 py-2 border-b border-gray-200">
              <div className="font-medium text-gray-900 text-sm truncate">
                {userName}
              </div>
              {userEmail && (
                <div className="text-xs text-gray-500 truncate">
                  {userEmail}
                </div>
              )}
            </div>

            {/* メニュー項目 */}
            <div className="p-2">
              <Link
                href="/mypage"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                マイページ
              </Link>
              <Link
                href="/mypage/orders"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                注文履歴
              </Link>
              <Link
                href="/mypage/purchase-management"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                購買管理
              </Link>
              <Link
                href="/mypage/settings"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                アカウント設定
              </Link>

              <hr className="my-2 border-gray-200" />

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                role="menuitem"
              >
                ログアウト
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
