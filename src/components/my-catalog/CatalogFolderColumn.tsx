'use client';

import type { CatalogFolder, CatalogFolderType, CatalogFolderTypeInfo } from '@/types/catalog';
import { CATALOG_FOLDER_TYPES } from '@/types/catalog';
import CatalogFolderItem from './CatalogFolderItem';

interface CatalogFolderColumnProps {
  type: CatalogFolderType;
  folders: CatalogFolder[];
}

/** カラムヘッダーのアイコンパス */
const HEADER_ICONS: Record<CatalogFolderType, string> = {
  company: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  department: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  personal: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
};

/**
 * カタログフォルダカラムコンポーネント
 * 企業共通/部署共通/マイフォルダの各カラムを表示
 */
export default function CatalogFolderColumn({ type, folders }: CatalogFolderColumnProps) {
  const typeInfo: CatalogFolderTypeInfo = CATALOG_FOLDER_TYPES[type];

  return (
    <div className="ec-catalog-folder-column bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* カラムヘッダー */}
      <div className="ec-catalog-folder-column__header bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2">
          {/* 左側: アイコンとタイトル */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* アイコン */}
            <div className="ec-catalog-folder-column__icon-wrapper p-1.5 sm:p-2 rounded-lg bg-gray-100 flex-shrink-0">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={HEADER_ICONS[type]} />
              </svg>
            </div>

            {/* タイトルと説明 */}
            <div className="min-w-0">
              <h3 className="ec-catalog-folder-column__title text-sm font-bold text-gray-900 truncate">
                {typeInfo.label}
              </h3>
              <p className="ec-catalog-folder-column__description text-xs text-gray-500 truncate">
                {typeInfo.description}
              </p>
            </div>
          </div>

          {/* 右側: カタログにするボタン */}
          <button
            type="button"
            className="ec-catalog-folder-column__action flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex-shrink-0"
            title="カタログにする"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline leading-tight text-center">カタログ<br />にする</span>
          </button>
        </div>
      </div>

      {/* フォルダリスト */}
      <div className="ec-catalog-folder-column__list p-2 max-h-[500px] overflow-y-auto">
        {folders.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            フォルダがありません
          </p>
        ) : (
          folders.map((folder, index) => (
            <CatalogFolderItem
              key={folder.id}
              folder={folder}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
