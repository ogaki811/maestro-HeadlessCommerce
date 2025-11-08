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

  /**
   * 表示バリアント
   * - integrated: 検索窓と統合（デスクトップ）
   * - standalone: 独立表示（モバイル）
   */
  variant?: 'integrated' | 'standalone';

  /**
   * 追加のCSSクラス名
   */
  className?: string;
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
  variant = 'integrated',
  className = '',
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLarge, setHoveredLarge] = useState<CategoryHierarchy | null>(null);
  const [hoveredMedium, setHoveredMedium] = useState<CategoryHierarchy | null>(null);
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

  // カテゴリ選択（どの階層でも選択可能）
  const handleCategorySelect = (
    large: CategoryHierarchy,
    medium?: CategoryHierarchy,
    small?: CategoryHierarchy
  ) => {
    const selection: CategorySelection = { large };
    if (medium) selection.medium = medium;
    if (small) selection.small = small;

    onChange(selection);
    setIsOpen(false);
    setHoveredLarge(null);
    setHoveredMedium(null);
  };

  // クリア
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setIsOpen(false);
    setHoveredLarge(null);
    setHoveredMedium(null);
  };

  // カテゴリデータ取得
  const largeCategories = getLargeCategories();
  const mediumCategories = hoveredLarge ? getMediumCategories(hoveredLarge.id) : [];
  const smallCategories = hoveredMedium ? getSmallCategories(hoveredMedium.id) : [];

  // ボタンスタイル（variant による切り替え）
  const buttonClassName = variant === 'standalone'
    ? `
        flex items-center justify-between
        flex-1 min-w-[200px] max-w-[300px]
        px-4 py-3
        bg-white
        border border-gray-300
        rounded-lg
        text-sm text-gray-700
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent
        transition-colors
        h-full
      `
    : `
        flex items-center justify-between
        flex-1 min-w-[200px] max-w-[300px]
        px-4 py-3
        bg-white
        border border-gray-300 border-r-0
        rounded-l-lg
        text-sm text-gray-700
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent
        transition-colors
        h-full
      `;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* セレクターボタン */}
      <div className="relative flex">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={buttonClassName}
        >
          <span className="truncate">{getDisplayText()}</span>

          {/* プルダウンアイコン */}
          <svg
            className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

      {/* メガメニュードロップダウン */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-1
            bg-white
            border border-gray-300
            rounded-lg
            shadow-xl
            z-50
            flex
          "
        >
          {/* 大カテゴリ列 */}
          <div className="w-48 border-r border-gray-200">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-600">大カテゴリ</span>
            </div>
            <ul className="py-1 max-h-[400px] overflow-y-auto">
              {largeCategories.map((large) => (
                <li key={large.id}>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(large)}
                    onMouseEnter={() => {
                      setHoveredLarge(large);
                      setHoveredMedium(null);
                    }}
                    className={`
                      w-full px-4 py-2.5
                      text-left text-sm
                      hover:bg-blue-50
                      transition-colors
                      flex items-center justify-between
                      ${hoveredLarge?.id === large.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                    `}
                  >
                    <span>{large.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 中カテゴリ列 */}
          {hoveredLarge && mediumCategories.length > 0 && (
            <div className="w-48 border-r border-gray-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600">中カテゴリ</span>
              </div>
              <ul className="py-1 max-h-[400px] overflow-y-auto">
                {mediumCategories.map((medium) => (
                  <li key={medium.id}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(hoveredLarge, medium)}
                      onMouseEnter={() => setHoveredMedium(medium)}
                      className={`
                        w-full px-4 py-2.5
                        text-left text-sm
                        hover:bg-blue-50
                        transition-colors
                        flex items-center justify-between
                        ${hoveredMedium?.id === medium.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                      `}
                    >
                      <span>{medium.name}</span>
                      {getSmallCategories(medium.id).length > 0 && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 小カテゴリ列 */}
          {hoveredMedium && smallCategories.length > 0 && (
            <div className="w-48">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600">小カテゴリ</span>
              </div>
              <ul className="py-1 max-h-[400px] overflow-y-auto">
                {smallCategories.map((small) => (
                  <li key={small.id}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(hoveredLarge!, hoveredMedium, small)}
                      className="
                        w-full px-4 py-2.5
                        text-left text-sm text-gray-700
                        hover:bg-blue-50 hover:text-blue-700
                        transition-colors
                      "
                    >
                      {small.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
