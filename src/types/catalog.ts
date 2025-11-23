/**
 * マイカタログ関連の型定義
 */

/** フォルダ種別 */
export type CatalogFolderType = 'company' | 'department' | 'personal';

/** フォルダ種別の表示情報 */
export interface CatalogFolderTypeInfo {
  type: CatalogFolderType;
  label: string;
  description: string;
  iconColor: string;
  folderColor: string;
}

/** カタログフォルダ */
export interface CatalogFolder {
  id: string;
  name: string;
  type: CatalogFolderType;
  displayOrder: number;
  itemCount: number;
  createdAt?: string;
  updatedAt?: string;
}

/** カタログアイテム（フォルダ内の商品） */
export interface CatalogItem {
  id: string;
  folderId: string;
  productId: string;
  productCode: string;
  productName: string;
  brandName?: string;
  partNumber?: string;
  imageUrl?: string;
  standardPrice: number;
  salePrice: number;
  memo: string;
  orderComment: string;
  accountCode: string;
  displayOrder: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

/** フォルダ種別ごとの設定 */
export const CATALOG_FOLDER_TYPES: Record<CatalogFolderType, CatalogFolderTypeInfo> = {
  company: {
    type: 'company',
    label: '企業共通フォルダ',
    description: '全社で共有です。',
    iconColor: 'text-orange-500',
    folderColor: 'text-yellow-500',
  },
  department: {
    type: 'department',
    label: '部署共通フォルダ',
    description: '部署で共有です。',
    iconColor: 'text-blue-500',
    folderColor: 'text-blue-400',
  },
  personal: {
    type: 'personal',
    label: 'マイフォルダ',
    description: '個人専用です。',
    iconColor: 'text-red-400',
    folderColor: 'text-red-400',
  },
};

/** 並び順オプション */
export type CatalogSortOption =
  | 'memo'
  | 'productCode'
  | 'productName'
  | 'displayOrder';

export const CATALOG_SORT_OPTIONS: { value: CatalogSortOption; label: string }[] = [
  { value: 'memo', label: '備忘録メモ順' },
  { value: 'displayOrder', label: '表示順' },
  { value: 'productCode', label: '商品コード順' },
  { value: 'productName', label: '商品名順' },
];
