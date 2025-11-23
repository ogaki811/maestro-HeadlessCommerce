/**
 * マイカタログ・フォルダ詳細ページ
 */

'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import CatalogItemCard from '@/components/my-catalog/CatalogItemCard';
import { getFolderById, sampleCatalogItems, getCatalogItemsByFolderId } from '@/data/sampleCatalogData';
import { CATALOG_FOLDER_TYPES, CATALOG_SORT_OPTIONS } from '@/types/catalog';
import type { CatalogSortOption } from '@/types/catalog';

export default function CatalogFolderDetailPage() {
  const params = useParams();
  const folderId = params.folderId as string;

  // フォルダ情報を取得
  const folder = getFolderById(folderId);

  // フォルダ内の商品を取得（なければサンプルデータを使用）
  const items = useMemo(() => {
    const folderItems = getCatalogItemsByFolderId(folderId);
    // 商品がない場合はサンプルデータを表示
    return folderItems.length > 0 ? folderItems : sampleCatalogItems;
  }, [folderId]);

  // 状態管理
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<CatalogSortOption>('displayOrder');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [memos, setMemos] = useState<Record<string, string>>({});

  // フォルダ種別情報
  const folderTypeInfo = folder ? CATALOG_FOLDER_TYPES[folder.type] : null;

  // 検索・ソート後のアイテム
  const filteredItems = useMemo(() => {
    let result = [...items];

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          item.productCode.toLowerCase().includes(query) ||
          item.memo?.toLowerCase().includes(query)
      );
    }

    // ソート
    result.sort((a, b) => {
      switch (sortOption) {
        case 'memo':
          return a.memo.localeCompare(b.memo);
        case 'productCode':
          return a.productCode.localeCompare(b.productCode);
        case 'productName':
          return a.productName.localeCompare(b.productName);
        case 'displayOrder':
        default:
          return a.displayOrder - b.displayOrder;
      }
    });

    return result;
  }, [items, searchQuery, sortOption]);

  // 選択操作
  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)));
    }
  };

  // 数量変更
  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  // メモ変更
  const handleMemoChange = (id: string, memo: string) => {
    setMemos((prev) => ({ ...prev, [id]: memo }));
  };

  // フォルダが見つからない場合
  if (!folder) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              フォルダが見つかりません
            </h1>
            <Link
              href="/my-catalog"
              className="text-black hover:underline"
            >
              マイカタログ一覧に戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-catalog-detail min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* サイドバー */}
            <div className="lg:col-span-1">
              <MyPageSidebar />
            </div>

            {/* メインコンテンツ */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
                {/* パンくず風リンク */}
                <div className="mb-4">
                  <Link
                    href="/my-catalog"
                    className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    マイカタログ一覧
                  </Link>
                </div>

                {/* ページタイトル */}
                <div className="mb-6 pb-4 border-b-2 border-black">
                  <div className="flex items-center gap-3">
                    {/* フォルダアイコン */}
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                    <div>
                      <h1 className="ec-catalog-detail__title text-2xl sm:text-3xl font-medium text-gray-900">
                        {folder.name}
                      </h1>
                      {folderTypeInfo && (
                        <p className="text-sm text-gray-500">
                          {folderTypeInfo.label} / {folderTypeInfo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 検索・ソート・アクション */}
                <div className="ec-catalog-detail__toolbar flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
                  {/* 検索 */}
                  <div className="w-full lg:max-w-sm">
                    <div className="flex items-stretch w-full border-2 border-gray-900 rounded-lg overflow-hidden hover:shadow-md transition-all focus-within:border-black focus-within:shadow-lg">
                      <input
                        type="text"
                        placeholder="商品名や商品コードで検索"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-0 px-4 py-2.5 bg-white border-0 focus:outline-none focus:bg-gray-50 transition-colors"
                      />
                      <button
                        type="button"
                        className="px-4 flex items-center justify-center bg-gray-900 text-white hover:bg-black transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* ソートとアクション */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* ソート */}
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as CatalogSortOption)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                    >
                      {CATALOG_SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* 一括操作ボタン */}
                    <button
                      type="button"
                      disabled={selectedItems.size === 0}
                      className="px-3 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      選択商品をカートに追加
                    </button>
                  </div>
                </div>

                {/* 全選択チェックボックス */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">
                      すべて選択
                    </span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {filteredItems.length}件の商品
                    {selectedItems.size > 0 && ` (${selectedItems.size}件選択中)`}
                  </span>
                </div>

                {/* 商品一覧 */}
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500">
                      {searchQuery
                        ? '検索条件に一致する商品がありません'
                        : 'このフォルダに商品がありません'}
                    </p>
                  </div>
                ) : (
                  <div className="ec-catalog-detail__items space-y-4">
                    {filteredItems.map((item) => (
                      <CatalogItemCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onSelect={handleSelectItem}
                        onQuantityChange={handleQuantityChange}
                        onMemoChange={handleMemoChange}
                        quantity={quantities[item.id] || 1}
                        memo={memos[item.id]}
                      />
                    ))}
                  </div>
                )}

                {/* フッターアクション */}
                {filteredItems.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                      >
                        商品を追加
                      </button>
                      <button
                        type="button"
                        disabled={selectedItems.size === 0}
                        className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        選択した{selectedItems.size}件をカートに追加
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
