/**
 * Categories Configuration
 * カテゴリマスターデータと関連ヘルパー関数
 */

import type { CategoryHierarchy, FlatCategory, CategoryLevel } from '@/types/category';

/**
 * カテゴリマスターデータ（大中小3階層）
 */
export const categories: CategoryHierarchy[] = [
  {
    id: 'stationery',
    name: '文具・事務用品',
    slug: 'stationery',
    level: 'large',
    children: [
      {
        id: 'writing-instruments',
        name: '筆記用具',
        slug: 'writing-instruments',
        level: 'medium',
        parentId: 'stationery',
        children: [
          {
            id: 'ballpoint-pens',
            name: 'ボールペン',
            slug: 'ballpoint-pens',
            level: 'small',
            parentId: 'writing-instruments',
          },
          {
            id: 'mechanical-pencils',
            name: 'シャープペンシル',
            slug: 'mechanical-pencils',
            level: 'small',
            parentId: 'writing-instruments',
          },
          {
            id: 'markers',
            name: 'マーカー・蛍光ペン',
            slug: 'markers',
            level: 'small',
            parentId: 'writing-instruments',
          },
        ],
      },
      {
        id: 'notebooks',
        name: 'ノート類',
        slug: 'notebooks',
        level: 'medium',
        parentId: 'stationery',
        children: [
          {
            id: 'memo-pads',
            name: 'メモ帳',
            slug: 'memo-pads',
            level: 'small',
            parentId: 'notebooks',
          },
          {
            id: 'notebooks-a4',
            name: 'ノート（A4）',
            slug: 'notebooks-a4',
            level: 'small',
            parentId: 'notebooks',
          },
          {
            id: 'notebooks-b5',
            name: 'ノート（B5）',
            slug: 'notebooks-b5',
            level: 'small',
            parentId: 'notebooks',
          },
        ],
      },
      {
        id: 'adhesives',
        name: '粘着用品',
        slug: 'adhesives',
        level: 'medium',
        parentId: 'stationery',
        children: [
          {
            id: 'tape',
            name: 'テープ',
            slug: 'tape',
            level: 'small',
            parentId: 'adhesives',
          },
          {
            id: 'glue',
            name: 'のり',
            slug: 'glue',
            level: 'small',
            parentId: 'adhesives',
          },
        ],
      },
    ],
  },
  {
    id: 'furniture',
    name: '家具',
    slug: 'furniture',
    level: 'large',
    children: [
      {
        id: 'desks',
        name: 'デスク',
        slug: 'desks',
        level: 'medium',
        parentId: 'furniture',
        children: [
          {
            id: 'office-desks',
            name: 'オフィスデスク',
            slug: 'office-desks',
            level: 'small',
            parentId: 'desks',
          },
          {
            id: 'standing-desks',
            name: 'スタンディングデスク',
            slug: 'standing-desks',
            level: 'small',
            parentId: 'desks',
          },
        ],
      },
      {
        id: 'chairs',
        name: 'チェア',
        slug: 'chairs',
        level: 'medium',
        parentId: 'furniture',
        children: [
          {
            id: 'office-chairs',
            name: 'オフィスチェア',
            slug: 'office-chairs',
            level: 'small',
            parentId: 'chairs',
          },
          {
            id: 'meeting-chairs',
            name: 'ミーティングチェア',
            slug: 'meeting-chairs',
            level: 'small',
            parentId: 'chairs',
          },
        ],
      },
      {
        id: 'storage-furniture',
        name: '収納家具',
        slug: 'storage-furniture',
        level: 'medium',
        parentId: 'furniture',
        children: [
          {
            id: 'cabinets',
            name: 'キャビネット',
            slug: 'cabinets',
            level: 'small',
            parentId: 'storage-furniture',
          },
          {
            id: 'shelves',
            name: '棚・ラック',
            slug: 'shelves',
            level: 'small',
            parentId: 'storage-furniture',
          },
        ],
      },
    ],
  },
  {
    id: 'electronics',
    name: '電化製品',
    slug: 'electronics',
    level: 'large',
    children: [
      {
        id: 'computers',
        name: 'コンピューター',
        slug: 'computers',
        level: 'medium',
        parentId: 'electronics',
        children: [
          {
            id: 'laptops',
            name: 'ノートPC',
            slug: 'laptops',
            level: 'small',
            parentId: 'computers',
          },
          {
            id: 'desktops',
            name: 'デスクトップPC',
            slug: 'desktops',
            level: 'small',
            parentId: 'computers',
          },
        ],
      },
      {
        id: 'peripherals',
        name: '周辺機器',
        slug: 'peripherals',
        level: 'medium',
        parentId: 'electronics',
        children: [
          {
            id: 'keyboards',
            name: 'キーボード',
            slug: 'keyboards',
            level: 'small',
            parentId: 'peripherals',
          },
          {
            id: 'mice',
            name: 'マウス',
            slug: 'mice',
            level: 'small',
            parentId: 'peripherals',
          },
          {
            id: 'monitors',
            name: 'モニター',
            slug: 'monitors',
            level: 'small',
            parentId: 'peripherals',
          },
        ],
      },
    ],
  },
  {
    id: 'storage',
    name: '収納用品',
    slug: 'storage',
    level: 'large',
    children: [
      {
        id: 'boxes',
        name: 'ボックス・ケース',
        slug: 'boxes',
        level: 'medium',
        parentId: 'storage',
        children: [
          {
            id: 'plastic-boxes',
            name: 'プラスチックボックス',
            slug: 'plastic-boxes',
            level: 'small',
            parentId: 'boxes',
          },
          {
            id: 'cardboard-boxes',
            name: 'ダンボールボックス',
            slug: 'cardboard-boxes',
            level: 'small',
            parentId: 'boxes',
          },
        ],
      },
      {
        id: 'folders',
        name: 'ファイル・フォルダー',
        slug: 'folders',
        level: 'medium',
        parentId: 'storage',
        children: [
          {
            id: 'clear-files',
            name: 'クリアファイル',
            slug: 'clear-files',
            level: 'small',
            parentId: 'folders',
          },
          {
            id: 'ring-binders',
            name: 'リングファイル',
            slug: 'ring-binders',
            level: 'small',
            parentId: 'folders',
          },
        ],
      },
    ],
  },
];

/**
 * カテゴリIDでカテゴリを取得
 */
export function getCategoryById(
  id: string,
  categoriesList: CategoryHierarchy[] = categories
): CategoryHierarchy | undefined {
  for (const category of categoriesList) {
    if (category.id === id) {
      return category;
    }
    if (category.children) {
      const found = getCategoryById(id, category.children);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 指定レベルのカテゴリ一覧を取得
 */
export function getCategoriesByLevel(level: CategoryLevel): CategoryHierarchy[] {
  const result: CategoryHierarchy[] = [];

  function traverse(cats: CategoryHierarchy[]) {
    for (const cat of cats) {
      if (cat.level === level) {
        result.push(cat);
      }
      if (cat.children) {
        traverse(cat.children);
      }
    }
  }

  traverse(categories);
  return result;
}

/**
 * 親カテゴリIDから子カテゴリ一覧を取得
 */
export function getChildCategories(parentId: string): CategoryHierarchy[] {
  const parent = getCategoryById(parentId);
  return parent?.children || [];
}

/**
 * カテゴリ階層をフラット化
 */
export function flattenCategories(
  categoriesList: CategoryHierarchy[] = categories,
  path: string[] = []
): FlatCategory[] {
  const result: FlatCategory[] = [];

  for (const category of categoriesList) {
    const currentPath = [...path, category.name];
    const flatCategory: FlatCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      level: category.level,
      parentId: category.parentId,
      path: currentPath,
      fullPath: currentPath.join(' > '),
    };

    result.push(flatCategory);

    if (category.children) {
      result.push(...flattenCategories(category.children, currentPath));
    }
  }

  return result;
}

/**
 * カテゴリのフルパスを取得（例: "文具・事務用品 > 筆記用具 > ボールペン"）
 */
export function getCategoryPath(categoryId: string): string {
  const flatCategories = flattenCategories();
  const category = flatCategories.find((c) => c.id === categoryId);
  return category?.fullPath || '';
}

/**
 * 大カテゴリ一覧を取得
 */
export function getLargeCategories(): CategoryHierarchy[] {
  return categories;
}

/**
 * 中カテゴリ一覧を取得（大カテゴリID指定）
 */
export function getMediumCategories(largeCategoryId: string): CategoryHierarchy[] {
  const largeCategory = getCategoryById(largeCategoryId);
  return largeCategory?.children || [];
}

/**
 * 小カテゴリ一覧を取得（中カテゴリID指定）
 */
export function getSmallCategories(mediumCategoryId: string): CategoryHierarchy[] {
  const mediumCategory = getCategoryById(mediumCategoryId);
  return mediumCategory?.children || [];
}
