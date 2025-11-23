/**
 * マイカタログのサンプルデータ
 */

import type { CatalogFolder, CatalogItem } from '@/types/catalog';

/** 企業共通フォルダのサンプルデータ */
export const companyFolders: CatalogFolder[] = [
  { id: 'company-1', name: '保存水', type: 'company', displayOrder: 1, itemCount: 12 },
  { id: 'company-2', name: '名称未設定', type: 'company', displayOrder: 2, itemCount: 0 },
  { id: 'company-3', name: '車載セット', type: 'company', displayOrder: 3, itemCount: 8 },
  { id: 'company-4', name: '備品', type: 'company', displayOrder: 4, itemCount: 25 },
  { id: 'company-5', name: '衛生用品', type: 'company', displayOrder: 5, itemCount: 18 },
  { id: 'company-6', name: '救急箱', type: 'company', displayOrder: 6, itemCount: 6 },
  { id: 'company-7', name: '避難生活用品', type: 'company', displayOrder: 7, itemCount: 14 },
  { id: 'company-8', name: '【非環境】文具', type: 'company', displayOrder: 8, itemCount: 32 },
  { id: 'company-9', name: '【環境】文具', type: 'company', displayOrder: 9, itemCount: 28 },
  { id: 'company-10', name: '療養者向け', type: 'company', displayOrder: 10, itemCount: 9 },
  { id: 'company-11', name: '企業定番', type: 'company', displayOrder: 11, itemCount: 45 },
  { id: 'company-12', name: '防災', type: 'company', displayOrder: 12, itemCount: 22 },
  { id: 'company-13', name: '新店準備', type: 'company', displayOrder: 13, itemCount: 38 },
  { id: 'company-14', name: 'トナー', type: 'company', displayOrder: 14, itemCount: 15 },
  { id: 'company-15', name: 'キッチン専用事務用品', type: 'company', displayOrder: 15, itemCount: 11 },
  { id: 'company-16', name: '管理受託品', type: 'company', displayOrder: 16, itemCount: 7 },
  { id: 'company-17', name: '文具日用品', type: 'company', displayOrder: 17, itemCount: 56 },
  { id: 'company-18', name: '用紙類', type: 'company', displayOrder: 18, itemCount: 19 },
  { id: 'company-19', name: 'その他ファイル・バインダー', type: 'company', displayOrder: 19, itemCount: 24 },
];

/** 部署共通フォルダのサンプルデータ */
export const departmentFolders: CatalogFolder[] = [
  { id: 'dept-1', name: '本社専用品', type: 'department', displayOrder: 1, itemCount: 18 },
  { id: 'dept-2', name: '関西営業所発注分', type: 'department', displayOrder: 2, itemCount: 12 },
  { id: 'dept-3', name: 'お茶・コーヒー', type: 'department', displayOrder: 3, itemCount: 8 },
  { id: 'dept-4', name: '文具', type: 'department', displayOrder: 4, itemCount: 42 },
  { id: 'dept-5', name: 'インク・トナー関連', type: 'department', displayOrder: 5, itemCount: 16 },
  { id: 'dept-6', name: '部署共通品', type: 'department', displayOrder: 6, itemCount: 28 },
  { id: 'dept-7', name: '資材部', type: 'department', displayOrder: 7, itemCount: 35 },
  { id: 'dept-8', name: '共通飲料', type: 'department', displayOrder: 8, itemCount: 6 },
  { id: 'dept-9', name: 'ナースセンター', type: 'department', displayOrder: 9, itemCount: 22 },
  { id: 'dept-10', name: '日欧事務機株式会社', type: 'department', displayOrder: 10, itemCount: 14 },
  { id: 'dept-11', name: '生産', type: 'department', displayOrder: 11, itemCount: 19 },
  { id: 'dept-12', name: 'サクラクレパス様', type: 'department', displayOrder: 12, itemCount: 8 },
  { id: 'dept-13', name: '○養鶏場様', type: 'department', displayOrder: 13, itemCount: 5 },
  { id: 'dept-14', name: '○養鶏場様3', type: 'department', displayOrder: 14, itemCount: 3 },
  { id: 'dept-15', name: 'フォルダ内なし', type: 'department', displayOrder: 15, itemCount: 0 },
];

/** マイフォルダのサンプルデータ */
export const personalFolders: CatalogFolder[] = [
  { id: 'personal-1', name: '中途社員', type: 'personal', displayOrder: 1, itemCount: 15 },
  { id: 'personal-2', name: '新入社員', type: 'personal', displayOrder: 2, itemCount: 22 },
  { id: 'personal-3', name: '部門共有品', type: 'personal', displayOrder: 3, itemCount: 18 },
  { id: 'personal-4', name: '事務用品', type: 'personal', displayOrder: 4, itemCount: 45 },
  { id: 'personal-5', name: '文具日用品', type: 'personal', displayOrder: 5, itemCount: 38 },
  { id: 'personal-6', name: '冬専用商品', type: 'personal', displayOrder: 6, itemCount: 12 },
  { id: 'personal-7', name: '伊藤', type: 'personal', displayOrder: 7, itemCount: 8 },
  { id: 'personal-8', name: '山田', type: 'personal', displayOrder: 8, itemCount: 6 },
  { id: 'personal-9', name: '飲料', type: 'personal', displayOrder: 9, itemCount: 9 },
  { id: 'personal-10', name: '北野', type: 'personal', displayOrder: 10, itemCount: 4 },
  { id: 'personal-11', name: '小高', type: 'personal', displayOrder: 11, itemCount: 7 },
  { id: 'personal-12', name: '野中', type: 'personal', displayOrder: 12, itemCount: 11 },
  { id: 'personal-13', name: '横田', type: 'personal', displayOrder: 13, itemCount: 5 },
  { id: 'personal-14', name: '黒田', type: 'personal', displayOrder: 14, itemCount: 9 },
  { id: 'personal-15', name: 'テスト', type: 'personal', displayOrder: 15, itemCount: 3 },
  { id: 'personal-16', name: '金城', type: 'personal', displayOrder: 16, itemCount: 14 },
  { id: 'personal-17', name: '和彦様', type: 'personal', displayOrder: 17, itemCount: 6 },
  { id: 'personal-18', name: '佐藤信', type: 'personal', displayOrder: 18, itemCount: 8 },
  { id: 'personal-19', name: '伊藤幸夫様', type: 'personal', displayOrder: 19, itemCount: 10 },
];

/** 全フォルダを取得 */
export const getAllFolders = (): CatalogFolder[] => [
  ...companyFolders,
  ...departmentFolders,
  ...personalFolders,
];

/** フォルダIDからフォルダを取得 */
export const getFolderById = (id: string): CatalogFolder | undefined => {
  return getAllFolders().find((folder) => folder.id === id);
};

/** 保存水フォルダのサンプル商品データ */
export const sampleCatalogItems: CatalogItem[] = [
  {
    id: 'item-1',
    folderId: 'company-1',
    productId: 'prod-40912',
    productCode: '40912',
    productName: 'ケシポン箱用 交換式 ホワイト',
    brandName: 'プラス',
    partNumber: 'IS-590CM',
    imageUrl: '/img/products/sample-1.jpg',
    standardPrice: 1100,
    salePrice: 935,
    memo: 'A001',
    orderComment: 'アイウエオ',
    accountCode: '01',
    displayOrder: 1,
    stock: 100,
  },
  {
    id: 'item-2',
    folderId: 'company-1',
    productId: 'prod-857132',
    productCode: '857132',
    productName: '※非常用保存飲料水 2L 6本入',
    brandName: '富士ミネラルウォーター',
    partNumber: '136',
    imageUrl: '/img/products/sample-2.jpg',
    standardPrice: 1980,
    salePrice: 1790,
    memo: 'A002',
    orderComment: '',
    accountCode: '',
    displayOrder: 2,
    stock: 50,
  },
  {
    id: 'item-3',
    folderId: 'company-1',
    productId: 'prod-188645',
    productCode: '188645',
    productName: '※健康ミネラルむぎ茶PET 2L 6本',
    brandName: '伊藤園',
    partNumber: '',
    imageUrl: '/img/products/sample-3.jpg',
    standardPrice: 2580,
    salePrice: 1207,
    memo: 'A021',
    orderComment: '',
    accountCode: '',
    displayOrder: 3,
    stock: 30,
  },
  {
    id: 'item-4',
    folderId: 'company-1',
    productId: 'prod-756818',
    productCode: '756818',
    productName: '※災害・非常用5年保存水 2L 6本',
    brandName: '秩父源流水',
    partNumber: '',
    imageUrl: '/img/products/sample-4.jpg',
    standardPrice: 2160,
    salePrice: 1670,
    memo: 'A100',
    orderComment: '',
    accountCode: '',
    displayOrder: 4,
    stock: 80,
  },
];

/** フォルダIDから商品一覧を取得 */
export const getCatalogItemsByFolderId = (folderId: string): CatalogItem[] => {
  return sampleCatalogItems.filter((item) => item.folderId === folderId);
};
