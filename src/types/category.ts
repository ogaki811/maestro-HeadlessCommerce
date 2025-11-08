/**
 * Category Type Definitions
 * カテゴリ階層型定義
 *
 * カテゴリは大中小の3階層構造を持つ
 */

/**
 * カテゴリ階層レベル
 */
export type CategoryLevel = 'large' | 'medium' | 'small';

/**
 * カテゴリ階層構造
 *
 * @example
 * ```typescript
 * const largeCategory: CategoryHierarchy = {
 *   id: 'stationery',
 *   name: '文具・事務用品',
 *   slug: 'stationery',
 *   level: 'large',
 *   children: [...], // 中カテゴリ配列
 * };
 * ```
 */
export interface CategoryHierarchy {
  /**
   * カテゴリID（一意）
   */
  id: string;

  /**
   * カテゴリ名
   */
  name: string;

  /**
   * URLスラッグ
   */
  slug: string;

  /**
   * 階層レベル
   */
  level: CategoryLevel;

  /**
   * 親カテゴリID（大カテゴリの場合はundefined）
   */
  parentId?: string;

  /**
   * 子カテゴリ配列
   */
  children?: CategoryHierarchy[];
}

/**
 * フラット化されたカテゴリ（検索・フィルタリング用）
 */
export interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  level: CategoryLevel;
  parentId?: string;
  /**
   * パス（大 > 中 > 小）
   */
  path: string[];
  /**
   * フルパス文字列（例: "文具・事務用品 > 筆記用具 > ボールペン"）
   */
  fullPath: string;
}

/**
 * カテゴリ選択状態
 */
export interface CategorySelection {
  large?: CategoryHierarchy;
  medium?: CategoryHierarchy;
  small?: CategoryHierarchy;
}
