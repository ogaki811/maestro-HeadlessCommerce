/**
 * CategorySelector Component (Molecule)
 * カテゴリセレクター
 *
 * ヘッダー検索窓用のカテゴリプルダウンセレクター
 * 大中小の3階層カテゴリを選択可能
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import type { CategorySelection, CategoryHierarchy } from '@/types/category';
import {
  getLargeCategories,
  getMediumCategories,
  getSmallCategories,
} from '@/config/categoriesConfig';

/**
 * CategorySelector Props
 */
export interface CategorySelectorProps {
  /**
   * 選択されたカテゴリ
   */
  value: CategorySelection | undefined;

  /**
   * カテゴリ変更時のコールバック
   */
  onChange: (selection: CategorySelection | undefined) => void;

  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;
}

/**
 * CategorySelector
 *
 * @example
 * ```tsx
 * const [category, setCategory] = useState<CategorySelection | undefined>();
 * <CategorySelector value={category} onChange={setCategory} />
 * ```
 */
export default function CategorySelector({
  value,
  onChange,
  placeholder = 'すべてのカテゴリ',
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 表示テキストを生成
  const getDisplayText = (): string => {
    if (!value?.large) return placeholder;

    const parts: string[] = [value.large.name];
    if (value.medium) parts.push(value.medium.name);
    if (value.small) parts.push(value.small.name);

    return parts.join(' > ');
  };

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 大カテゴリ選択
  const handleLargeSelect = (category: CategoryHierarchy) => {
    onChange({
      large: category,
    });
    setIsOpen(false);
  };

  // 中カテゴリ選択
  const handleMediumSelect = (category: CategoryHierarchy) => {
    if (!value?.large) return;

    onChange({
      large: value.large,
      medium: category,
    });
    setIsOpen(false);
  };

  // 小カテゴリ選択
  const handleSmallSelect = (category: CategoryHierarchy) => {
    if (!value?.large || !value?.medium) return;

    onChange({
      large: value.large,
      medium: value.medium,
      small: category,
    });
    setIsOpen(false);
  };

  // クリア
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setIsOpen(false);
  };

  // 表示するカテゴリ一覧を取得
  const getCategoriesToShow = () => {
    if (!value?.large) {
      // 大カテゴリ一覧
      return {
        level: 'large' as const,
        categories: getLargeCategories(),
      };
    }

    if (!value?.medium) {
      // 中カテゴリ一覧
      return {
        level: 'medium' as const,
        categories: getMediumCategories(value.large.id),
      };
    }

    // 小カテゴリ一覧
    return {
      level: 'small' as const,
      categories: getSmallCategories(value.medium.id),
    };
  };

  const { level, categories } = getCategoriesToShow();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* セレクターボタン */}
      <div className="relative flex">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center justify-between
            flex-1 min-w-[200px] max-w-[300px]
            px-4 py-2.5
            bg-white
            border border-gray-300
            rounded-l-lg
            text-sm text-gray-700
            hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-gray-700
            transition-colors
          "
        >
          <span className="truncate">{getDisplayText()}</span>

          {/* プルダウンアイコン */}
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* クリアボタン（外側のbuttonとは別要素） */}
        {value?.large && (
          <span
            onClick={handleClear}
            className="
              absolute right-8 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600
              cursor-pointer
              transition-colors
            "
            aria-label="カテゴリをクリア"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClear(e as any);
              }
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-1
            w-full min-w-[200px]
            bg-white
            border border-gray-300
            rounded-lg
            shadow-lg
            z-50
            max-h-[300px]
            overflow-y-auto
          "
        >
          {categories.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              カテゴリがありません
            </div>
          ) : (
            <ul className="py-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (level === 'large') {
                        handleLargeSelect(category);
                      } else if (level === 'medium') {
                        handleMediumSelect(category);
                      } else {
                        handleSmallSelect(category);
                      }
                    }}
                    className="
                      w-full px-4 py-2
                      text-left text-sm
                      hover:bg-gray-100
                      transition-colors
                    "
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
