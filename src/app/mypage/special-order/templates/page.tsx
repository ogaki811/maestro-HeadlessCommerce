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
import type { SpecialOrderTemplate, SortType } from '@/types/special-order';

export default function TemplatesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [templates, setTemplates] = useState<SpecialOrderTemplate[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState<SortType>('registered_date_desc');
  const limit = 20;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentPage, searchKeyword, sortType]);

  const fetchTemplates = async () => {
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

      const response = await fetch(`/api/special-order/templates?${params}`);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data.templates);
        setTotalPages(Math.ceil(data.data.total / limit));
      } else {
        toast.error('定番の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('定番の取得に失敗しました');
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
  const handleSelectTemplate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 全選択/解除
  const handleSelectAll = () => {
    if (selectedIds.length === templates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(templates.map((t) => t.id));
    }
  };

  // 再オーダー（新規依頼フォームへ遷移）
  const handleReorder = (_template: SpecialOrderTemplate) => {
    // TODO: 実装では、テンプレートデータを新規依頼フォームに引き継ぐ
    router.push('/mypage/special-order/new');
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
                  取寄せ定番一覧
                </h1>

                {/* 検索・ソート */}
                <div className="mt-8 mb-6 flex flex-col md:flex-row gap-4">
                  {/* 検索バー */}
                  <div className="flex-1 flex gap-2">
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
                      <option value="registered_date_desc">登録日（新→古）</option>
                      <option value="registered_date_asc">登録日（古→新）</option>
                    </select>
                  </div>
                </div>

                {/* ローディング */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-600">読み込み中...</p>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">定番が見つかりませんでした</p>
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
                                  templates.length > 0 &&
                                  selectedIds.length === templates.length
                                }
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                              />
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                              登録日
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
                          {templates.map((template) => (
                            <tr key={template.id} className="border-t border-gray-300">
                              <td className="px-3 py-3 border-r border-gray-300 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(template.id)}
                                  onChange={() => handleSelectTemplate(template.id)}
                                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                />
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300 whitespace-nowrap">
                                {template.registeredDate}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300 whitespace-nowrap">
                                {template.createdBy}
                                {template.isMyTemplate && (
                                  <span className="ml-2 text-xs text-blue-600">(自分)</span>
                                )}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {template.productName}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {template.manufacturer || '-'}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300 text-right">
                                {template.quantity}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {template.unit}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-300">
                                {template.note || '-'}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  onClick={() => handleReorder(template)}
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
