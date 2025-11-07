/**
 * CustomMenuBar Component (Molecule)
 * カスタムメニューバー
 *
 * ユーザーが選択したメニューアイコンをヘッダー2段目に横並びで表示します。
 * ドロワーメニューで星アイコンをクリックして選択したメニューが表示されます。
 */

'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { headerNavigationIcons } from '@/config/headerNavigationConfig';
import { Badge } from '@/components/ui/Badge';

/**
 * CustomMenuBar Props
 */
export interface CustomMenuBarProps {
  /**
   * 選択されたメニューID配列
   * useCustomMenuStore.customMenuIds から取得
   */
  selectedMenuIds: string[];
}

/**
 * CustomMenuBar
 *
 * カスタムメニューバー（ヘッダー2段目）
 * - 選択されたメニューアイコンを横並びで表示
 * - 背景色 bg-gray-50 で視覚的に分離
 * - バッジがあるメニューは件数を表示
 *
 * @example
 * ```tsx
 * const { customMenuIds } = useCustomMenuStore();
 * <CustomMenuBar selectedMenuIds={customMenuIds} />
 * ```
 */
export default function CustomMenuBar({ selectedMenuIds }: CustomMenuBarProps) {
  /**
   * 選択されたメニュー項目を取得（メモ化）
   * selectedMenuIdsの順序を保持
   */
  const selectedMenus = useMemo(() => {
    return selectedMenuIds
      .map((id) => headerNavigationIcons.find((icon) => icon.id === id))
      .filter((menu): menu is NonNullable<typeof menu> => menu !== undefined);
  }, [selectedMenuIds]);

  // 選択メニューがない場合は何も表示しない
  if (selectedMenus.length === 0) {
    return null;
  }

  return (
    <div
      className="
        flex items-center gap-4
        px-4 py-2
        bg-gray-50
        rounded-md
      "
      role="navigation"
      aria-label="カスタムメニュー"
    >
      {selectedMenus.map((menu) => (
        <Link
          key={menu.id}
          href={menu.href}
          className="
            flex items-center gap-2
            text-sm font-medium
            text-[#2d2626]
            hover:text-gray-900
            transition-colors
          "
          aria-label={menu.label}
        >
          {/* アイコン */}
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
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
            <Badge variant="danger" size="sm">
              {menu.getBadgeCount()}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );
}
