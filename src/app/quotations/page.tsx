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

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // フィルタリング
  const filteredQuotations = useMemo(() => {
    let results = quotations;

    if (searchParams.quotationNumber) {
      results = results.filter(q =>
        q.id.toLowerCase().includes(searchParams.quotationNumber!.toLowerCase())
      );
    }

    if (searchParams.productCode) {
      results = results.filter(q =>
        q.products.some(p =>
          p.productCode.toLowerCase().includes(searchParams.productCode!.toLowerCase())
        )
      );
    }

    if (searchParams.selectedVendors && searchParams.selectedVendors.length > 0) {
      results = results.filter(q =>
        q.vendors.some(v => searchParams.selectedVendors!.includes(v.id))
      );
    }

    return results;
  }, [quotations, searchParams]);

  // ページネーション
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  // 認証されていない場合は表示しない
  if (!isAuthenticated) {
    return null;
  }

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />

          {/* ページヘッダー */}
          <header className="mt-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📋 見積依頼一覧
            </h1>
            <p className="text-gray-600">
              複数の販売店に対して相見積もりを依頼・管理できます
            </p>
          </header>

          {/* 新規作成カード */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ✨ 新しく見積を依頼する
            </h2>
            <Button
              variant="primary"
              size="md"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => router.push('/quotations/new')}
            >
              📝 新規見積依頼を作成
            </Button>
          </div>

          {/* 見積一覧カード */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-600">
              📊 見積依頼一覧（{filteredQuotations.length}件）
            </h2>

            {/* 見積一覧 */}
            <div className="space-y-4">
              {paginatedQuotations.map((quotation) => (
                <div
                  key={quotation.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* 見積ヘッダー */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        📝 {quotation.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        依頼日: {new Date(quotation.requestDate).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge variant={getStatusBadgeVariant(quotation.status)}>
                        {getStatusLabel(quotation.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* 見積情報 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
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
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">依頼先販売店:</p>
                    <div className="flex flex-wrap gap-2">
                      {quotation.vendors.map((vendor) => (
                        <span
                          key={vendor.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {vendor.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 商品リスト */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">依頼商品:</p>
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

                  {/* アクションボタン */}
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/quotations/${quotation.id}`)}
                    >
                      詳細を見る
                    </Button>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
