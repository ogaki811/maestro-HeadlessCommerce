'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import Pagination from '@/components/common/Pagination';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import type { SpecialOrderHistory, SortType, HistoryType } from '@/types/special-order';

// 種別バッジ色設定
const TYPE_BADGE_STYLES: Record<
  HistoryType,
  { bg: string; text: string; label: string }
> = {
  quote: { bg: 'bg-teal-100', text: 'text-teal-800', label: '見積依頼' },
  order: { bg: 'bg-blue-100', text: 'text-blue-800', label: '注文' },
  order_rejected: { bg: 'bg-gray-100', text: 'text-gray-800', label: '注文(承認却下)' },
};

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [history, setHistory] = useState<SpecialOrderHistory[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<HistoryType | ''>('');
  const [sortType, setSortType] = useState<SortType>('order_date_desc');
  const limit = 20;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentPage, searchKeyword, typeFilter, sortType]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sort: sortType,
      });

      if (searchKeyword) {
        params.append('keyword', searchKeyword);
      }

      if (typeFilter) {
        params.append('type', typeFilter);
      }

      const response = await fetch(`/api/special-order/history?${params}`);
      const data = await response.json();

      if (data.success) {
        setHistory(data.data.history);
        setTotalPages(Math.ceil(data.data.total / limit));
      } else {
        toast.error('履歴の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('履歴の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 検索実行
  const handleSearch = () => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  // チェックボックス選択
  const handleSelectHistory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 全選択/解除（定番登録可能な項目のみ）
  const handleSelectAll = () => {
    const selectableHistory = history.filter((h) => h.canAddToTemplate);
    if (selectedIds.length === selectableHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableHistory.map((h) => h.id));
    }
  };

  // 再オーダー（新規依頼フォームへ遷移）
  const handleReorder = (_historyItem: SpecialOrderHistory) => {
    // TODO: 実装では、履歴データを新規依頼フォームに引き継ぐ
    router.push('/mypage/special-order/new');
  };

  // 定番登録
  const handleAddToTemplate = async () => {
    if (selectedIds.length === 0) {
      toast.error('登録する履歴を選択してください');
      return;
    }

    try {
      const response = await fetch('/api/special-order/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          historyIds: selectedIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedIds([]);
      } else {
        toast.error(data.message || '定番登録に失敗しました');
      }
    } catch (error) {
      console.error('Failed to add to template:', error);
      toast.error('定番登録に失敗しました');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* サイドバー */}
            <div className="lg:col-span-1">
              <MyPageSidebar />
            </div>

            {/* メインコンテンツ */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* 販売店対応バッジ */}
                <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  販売店対応
                </div>

                {/* ページタイトル */}
                <h1 className="text-3xl font-medium text-gray-900 mb-2 pb-2 border-b-2 border-black">
                  過去の取寄せ一覧
                </h1>

                {/* 検索・フィルター・ソート */}
                <div className="mt-8 mb-6 space-y-4">
                  {/* 検索バー */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="商品名、メーカー名、入力者で検索"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover transition-colors"
                    >
                      検索
                    </button>
                  </div>

                  {/* フィルター・ソート */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* 種別フィルター */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700 whitespace-nowrap">
                        種別:
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => {
                          setTypeFilter(e.target.value as HistoryType | '');
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="">全て表示</option>
                        <option value="quote">見積依頼</option>
                        <option value="order">注文</option>
                        <option value="order_rejected">注文(承認却下)</option>
                      </select>
                    </div>

                    {/* ソート */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700 whitespace-nowrap">
                        並び順:
                      </label>
                      <select
                        value={sortType}
                        onChange={(e) => {
                          setSortType(e.target.value as SortType);
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="product_name">商品名順</option>
                        <option value="order_date_desc">依頼日（新→古）</option>
                        <option value="order_date_asc">依頼日（古→新）</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 定番登録ボタン */}
                {selectedIds.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={handleAddToTemplate}
                      className="px-6 py-2 bg-primary text-white font-medium rounded hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg"
                    >
                      定番登録 ({selectedIds.length}件)
                    </button>
                  </div>
                )}

                {/* ローディング */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-600">読み込み中...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">履歴が見つかりませんでした</p>
                  </div>
                ) : (
                  <>
                    {/* テーブル */}
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-3 border-r border-gray-300 w-12">
                              <input
                                type="checkbox"
                                checked={
                                  history.filter((h) => h.canAddToTemplate).length > 0 &&
                                  selectedIds.length ===
                                    history.filter((h) => h.canAddToTemplate).length
                                }
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                              />
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300 w-32">
                              種別
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                              依頼日
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                              入力者
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                              商品名
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                              メーカー名
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300 w-20">
                              数量
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300 w-20">
                              単位
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                              備考
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 w-32">
                              アクション
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((item) => (
                            <tr key={item.id} className="border-t border-gray-300">
                              <td className="px-3 py-3 border-r border-gray-300 text-center">
                                {item.canAddToTemplate ? (
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => handleSelectHistory(item.id)}
                                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                  />
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-3 py-3 border-r border-gray-300">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${TYPE_BADGE_STYLES[item.type].bg} ${TYPE_BADGE_STYLES[item.type].text}`}
                                >
                                  {TYPE_BADGE_STYLES[item.type].label}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300 whitespace-nowrap">
                                {item.orderDate}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300 whitespace-nowrap">
                                {item.createdBy}
                                {item.isMyOrder && (
                                  <span className="ml-2 text-xs text-blue-600">(自分)</span>
                                )}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {item.productName}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {item.manufacturer || '-'}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {item.unit || '-'}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {item.note || '-'}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => handleReorder(item)}
                                  className="px-4 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary-hover transition-colors"
                                >
                                  再オーダー
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ページネーション */}
                    {totalPages > 1 && (
                      <div className="flex justify-center">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
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
