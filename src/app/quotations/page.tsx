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
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
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
              見積り依頼検索
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              複数の販売店に対して相見積もりを依頼・管理できます
            </p>
          </header>

          {/* 見積を検索する */}
          <div className="mb-8 bg-white rounded-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-gray-900 mr-3"></span>
              見積を検索する
            </h2>

            {/* 検索フォーム */}
            <div className="space-y-4">
              {/* 見積依頼番号 */}
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-3">
                  見積依頼番号
                </label>
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder=""
                    value={searchParams.quotationNumber || ''}
                    onChange={(e) => setSearchParams({ ...searchParams, quotationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              {/* 依頼日 */}
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-3">
                  依頼日
                </label>
                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder=""
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                  <span>年</span>
                  <input
                    type="text"
                    placeholder=""
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="w-16 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                  <span>月</span>
                  <input
                    type="text"
                    placeholder=""
                    value={startDay}
                    onChange={(e) => setStartDay(e.target.value)}
                    className="w-16 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                  <span>日</span>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <span className="mx-2">〜</span>
                  <input
                    type="text"
                    placeholder=""
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                  <span>年</span>
                  <input
                    type="text"
                    placeholder=""
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="w-16 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                  <span>月</span>
                  <input
                    type="text"
                    placeholder=""
                    value={endDay}
                    onChange={(e) => setEndDay(e.target.value)}
                    className="w-16 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                  <span>日</span>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 商品コード */}
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-3">
                  商品コード
                </label>
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder=""
                    value={searchParams.productCode || ''}
                    onChange={(e) => setSearchParams({ ...searchParams, productCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* 販売店選択テーブル */}
            <div className="mt-6">
              <div className="grid grid-cols-4 gap-4 items-start mb-2">
                <label className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-3">
                  販売店選択
                </label>
                <div className="col-span-3">
                  {/* 操作ボタン領域 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedVendorIds(vendors.map(v => v.id));
                        }}
                        className="px-4 py-1.5 bg-[#2d2626] text-white text-sm font-medium rounded hover:bg-gray-900 transition-colors"
                      >
                        全選択
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVendorIds([]);
                        }}
                        className="px-4 py-1.5 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition-colors"
                      >
                        選択クリア
                      </button>
                    </div>
                    {/* 選択状態のフィードバック */}
                    {selectedVendorIds.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {selectedVendorIds.length}件選択中
                      </span>
                    )}
                  </div>

                  {/* テーブル */}
                  <div className="border border-gray-300 rounded">
                    {/* ヘッダー行 */}
                    <div className="grid grid-cols-3 gap-4 bg-gray-50 px-4 py-2 border-b border-gray-300 font-medium text-sm text-gray-700">
                      <div>販売店</div>
                      <div>ユーザーコード/ユーザー名</div>
                      <div>WebID/氏名</div>
                    </div>
                    {/* データ行 */}
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="grid grid-cols-3 gap-4 px-4 py-3 border-b last:border-b-0 border-gray-300 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedVendorIds.includes(vendor.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVendorIds([...selectedVendorIds, vendor.id]);
                              } else {
                                setSelectedVendorIds(selectedVendorIds.filter(id => id !== vendor.id));
                              }
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{vendor.name}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div>{vendor.userCode}</div>
                          <div className="text-gray-600">{vendor.department}</div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div>{vendor.webId}</div>
                          <div className="text-gray-600">{vendor.contactPerson}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 検索・クリアボタン */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  setSearchParams({ ...searchParams, selectedVendors: selectedVendorIds });
                  setCurrentPage(1);
                }}
                className="px-12 py-3 bg-blue-900 text-white font-medium rounded hover:bg-blue-800 transition-colors"
              >
                検索
              </button>
              <button
                onClick={() => {
                  setSearchParams({});
                  setStartYear('');
                  setStartMonth('');
                  setStartDay('');
                  setEndYear('');
                  setEndMonth('');
                  setEndDay('');
                  setSelectedVendorIds([]);
                  setCurrentPage(1);
                }}
                className="px-12 py-3 bg-gray-400 text-white font-medium rounded hover:bg-gray-500 transition-colors"
              >
                入力クリア
              </button>
              <button
                onClick={() => router.push('/quotations/new')}
                className="px-12 py-3 bg-blue-900 text-white font-medium rounded hover:bg-blue-800 transition-colors"
              >
                新規見積依頼
              </button>
            </div>
          </div>

          {/* 件数表示 */}
          <div className="mb-6 mt-8">
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
