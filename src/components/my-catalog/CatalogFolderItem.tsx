'use client';

import Link from 'next/link';
import type { CatalogFolder } from '@/types/catalog';

interface CatalogFolderItemProps {
  folder: CatalogFolder;
  index: number;
}

/**
 * カタログフォルダアイテムコンポーネント
 * 各フォルダを表示し、クリックで詳細ページへ遷移
 */
export default function CatalogFolderItem({ folder, index }: CatalogFolderItemProps) {
  const displayNumber = String(index + 1).padStart(2, '0');

  return (
    <Link
      href={`/my-catalog/${folder.id}`}
      className="ec-catalog-folder-item flex items-center gap-2 sm:gap-3 py-2 px-2 hover:bg-gray-100 rounded transition-colors group"
    >
      {/* 番号 */}
      <span className="ec-catalog-folder-item__number text-xs sm:text-sm font-medium text-gray-500 w-5 sm:w-6 flex-shrink-0">
        {displayNumber}
      </span>

      {/* フォルダアイコン */}
      <svg
        className="ec-catalog-folder-item__icon w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>

      {/* フォルダ名 */}
      <span className="ec-catalog-folder-item__name text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 truncate flex-1 min-w-0">
        {folder.name}
      </span>
    </Link>
  );
}
