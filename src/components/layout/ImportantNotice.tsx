/**
 * ImportantNotice Component (Molecule)
 * 重要なお知らせ
 *
 * ヘッダーの下に表示される重要なお知らせコンポーネント
 * 複数のお知らせを縦に並べて表示します
 */

'use client';

import Link from 'next/link';
import type { Notification } from '@/config/notificationsConfig';

/**
 * ImportantNotice Props
 */
export interface ImportantNoticeProps {
  /**
   * お知らせリスト
   */
  notifications: Notification[];
}

/**
 * ImportantNotice
 *
 * 重要なお知らせを表示するコンポーネント
 * - 赤い警告アイコン
 * - グレー背景
 * - 複数のお知らせを縦に表示
 * - リンク付きお知らせは「詳細を見る」リンクを表示
 *
 * @example
 * ```tsx
 * import { notifications } from '@/config/notificationsConfig';
 * <ImportantNotice notifications={notifications} />
 * ```
 */
export default function ImportantNotice({ notifications }: ImportantNoticeProps) {
  // お知らせがない場合は何も表示しない
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {notifications.map((notice) => (
            <Link
              key={notice.id}
              href={notice.link?.href || '#'}
              className="
                flex items-center gap-2
                px-4 py-2
                bg-gray-50
                rounded-md
                hover:bg-gray-100
                transition-colors
                whitespace-nowrap
              "
              role="alert"
              data-testid="notice-item"
            >
            {/* 情報アイコン */}
            <svg
              className="w-5 h-5 flex-shrink-0 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="16" y2="12" />
              <line x1="12" x2="12.01" y1="8" y2="8" />
            </svg>

            {/* お知らせメッセージ */}
            <div className="flex-1 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-800">{notice.message}</p>

              {/* リンクがある場合は矢印アイコンを表示 */}
              {notice.link && (
                <svg
                  className="w-4 h-4 flex-shrink-0 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
}
