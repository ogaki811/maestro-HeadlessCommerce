/**
 * Quotations List Page
 * 見積依頼一覧ページ
 *
 * Phase 1: 見積依頼一覧・検索機能
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/useAuthStore';
import type {
  Quotation,
  Vendor,
  QuotationSearchParams,
} from '@/types/quotation';
import { getStatusLabel, getStatusBadgeVariant } from '@/types/quotation';

export default function QuotationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // State
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<QuotationSearchParams>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // モックデータ読み込み
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotationsRes, vendorsRes] = await Promise.all([
          fetch('/mock-api/quotations.json'),
          fetch('/mock-api/vendors.json'),
        ]);

        const quotationsData = await quotationsRes.json();
        const vendorsData = await vendorsRes.json();

        setQuotations(quotationsData.quotations || []);
        setVendors(vendorsData.vendors || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 認証チェック（開発中は一時的にコメントアウト）
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  // フィルタリング
  const filteredQuotations = useMemo(() => {
    let results = quotations;

    // 見積依頼番号フィルター
    if (searchParams.quotationNumber) {
      results = results.filter(q =>
        q.id.toLowerCase().includes(searchParams.quotationNumber!.toLowerCase())
      );
    }

    // 商品コードフィルター
    if (searchParams.productCode) {
      results = results.filter(q =>
        q.products.some(p =>
          p.productCode.toLowerCase().includes(searchParams.productCode!.toLowerCase())
        )
      );
    }

    // 販売店フィルター
    if (searchParams.selectedVendors && searchParams.selectedVendors.length > 0) {
      results = results.filter(q =>
        q.vendors.some(v => searchParams.selectedVendors!.includes(v.id))
      );
    }

    // ステータスフィルター
    if (searchParams.status) {
      results = results.filter(q => q.status === searchParams.status);
    }

    return results;
  }, [quotations, searchParams]);

  // ページネーション
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  // 認証されていない場合は表示しない（開発中は一時的にコメントアウト）
  // if (!isAuthenticated) {
  //   return null;
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">読み込み中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダー */}
          <header className="mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="m-0 mb-2 text-3xl md:text-2xl font-bold text-gray-900">
              見積依頼一覧
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              複数の販売店に対して相見積もりを依頼・管理できます
            </p>
          </header>

          {/* 新規作成セクション */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              新しく見積を依頼する
            </h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/quotations/new')}
            >
              新規見積依頼を作成
            </Button>
          </div>

          {/* 検索フィルター */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              検索条件
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 見積依頼番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  見積依頼番号
                </label>
                <input
                  type="text"
                  placeholder="Q-2024-0115"
                  value={searchParams.quotationNumber || ''}
                  onChange={(e) => setSearchParams({ ...searchParams, quotationNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* 商品コード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品コード
                </label>
                <input
                  type="text"
                  placeholder="PEN-JETSTREAM-001"
                  value={searchParams.productCode || ''}
                  onChange={(e) => setSearchParams({ ...searchParams, productCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* ステータス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ステータス
                </label>
                <select
                  value={searchParams.status || ''}
                  onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value as QuotationSearchParams['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">すべて</option>
                  <option value="draft">下書き</option>
                  <option value="pending">回答待ち</option>
                  <option value="partially_responded">一部回答済み</option>
                  <option value="responded">回答済み</option>
                  <option value="accepted">承認済み</option>
                  <option value="rejected">却下</option>
                  <option value="expired">期限切れ</option>
                </select>
              </div>

              {/* 販売店選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  販売店
                </label>
                <select
                  multiple
                  value={searchParams.selectedVendors || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSearchParams({ ...searchParams, selectedVendors: selected });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  size={3}
                >
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* クリアボタン */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchParams({});
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                検索条件をクリア
              </button>
            </div>
          </div>

          {/* 件数表示 */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              見積依頼一覧（{filteredQuotations.length}件）
            </h2>
          </div>

          {/* 見積一覧 */}
          <div className="space-y-6">
            {paginatedQuotations.map((quotation) => (
              <div
                key={quotation.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                {/* 見積ヘッダー */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b border-gray-200">
                  <div className="mb-4 md:mb-0">
                    <p className="font-semibold text-gray-900 text-lg">
                      見積依頼番号: {quotation.id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      依頼日: {new Date(quotation.requestDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={getStatusBadgeVariant(quotation.status)}>
                      {getStatusLabel(quotation.status)}
                    </Badge>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/quotations/${quotation.id}`)}
                    >
                      詳細を見る
                    </Button>
                  </div>
                </div>

                {/* 見積情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-600">販売店:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {quotation.vendors.length}社
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">商品:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {quotation.products.length}点
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">依頼者:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {quotation.requestUserName || '-'}
                    </span>
                  </div>
                </div>

                {/* 販売店リスト */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    依頼先販売店:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quotation.vendors.map((vendor) => (
                      <span
                        key={vendor.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {vendor.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 商品リスト */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    依頼商品:
                  </p>
                  <div className="space-y-2">
                    {quotation.products.slice(0, 2).map((product) => (
                      <div key={product.id} className="text-sm text-gray-600">
                        • {product.productName} (数量: {product.quantity})
                      </div>
                    ))}
                    {quotation.products.length > 2 && (
                      <div className="text-sm text-gray-500">
                        他 {quotation.products.length - 2} 商品
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 見積がない場合 */}
          {paginatedQuotations.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600">見積依頼がありません</p>
            </div>
          )}

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  前へ
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
