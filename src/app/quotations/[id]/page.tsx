/**
 * Quotation Detail Page
 * 見積依頼詳細ページ
 *
 * Phase 3: 相見積もり比較機能
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuotationDetailHeader, QuotationResponseTable } from '@/components/quotation';
import useAuthStore from '@/store/useAuthStore';
import type { Quotation, QuotationResponse } from '@/types/quotation';
import { getStatusLabel, getStatusBadgeVariant } from '@/types/quotation';

export default function QuotationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();

  // State
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  // 見積データ読み込み
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await fetch('/mock-api/quotations.json');
        const data = await response.json();

        const found = data.quotations.find((q: Quotation) => q.id === params.id);
        if (found) {
          setQuotation(found);
        }
      } catch (error) {
        console.error('Failed to fetch quotation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuotation();
    }
  }, [params.id]);

  // 最安値の計算
  const lowestPrices = useMemo(() => {
    if (!quotation?.responses || quotation.responses.length === 0) {
      return new Map<string, number>();
    }

    const priceMap = new Map<string, number>();

    quotation.responses.forEach(response => {
      response.products?.forEach(product => {
        const currentLowest = priceMap.get(product.productId);
        if (!currentLowest || product.unitPrice < currentLowest) {
          priceMap.set(product.productId, product.unitPrice);
        }
      });
    });

    return priceMap;
  }, [quotation]);

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

  if (!quotation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">見積依頼が見つかりません</p>
            <Button onClick={() => router.push('/quotations')}>
              一覧に戻る
            </Button>
          </div>
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
          {/* QuotationDetailHeader コンポーネント */}
          <QuotationDetailHeader quotation={quotation} />

          {/* 基本情報 */}
          <div className="mb-8 p-6 bg-white border-l-4 border-gray-900 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-gray-900 mr-3"></span>
              基本情報
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">依頼日</p>
                <p className="font-medium text-gray-900">
                  {new Date(quotation.requestDate).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">依頼者</p>
                <p className="font-medium text-gray-900">
                  {quotation.requestUserName || '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">依頼先販売店</p>
                <p className="font-medium text-gray-900">
                  {quotation.vendors.length}社
                </p>
              </div>
            </div>

            {/* 販売店リスト */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">依頼先:</p>
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
          </div>

          {/* 依頼商品一覧 */}
          <div className="mb-8 p-6 bg-white border-l-4 border-gray-900 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-gray-900 mr-3"></span>
              依頼商品一覧（{quotation.products.length}件）
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                      商品コード
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                      商品名
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border-b border-gray-300">
                      数量
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
                      仕様・備考
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        {product.productCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        {product.productName}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 border-b border-gray-200">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                        {product.specifications || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 販売店別回答テーブル */}
          {quotation.responses && quotation.responses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                販売店別回答（{quotation.responses.length}社）
              </h2>
              <QuotationResponseTable quotation={quotation} />
            </div>
          )}

          {/* 相見積もり比較テーブル */}
          {quotation.responses && quotation.responses.length > 1 && (
            <div className="mb-8 p-6 bg-white border-l-4 border-orange-500 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-block w-1 h-6 bg-orange-500 mr-3"></span>
                相見積もり比較
              </h2>

              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm text-orange-900">
                  <strong>最安値</strong>の価格は <strong className="text-orange-600">オレンジ色</strong> でハイライトされています
                </p>
              </div>

              {/* 合計金額比較 */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">合計金額比較</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quotation.responses.map((response) => {
                    const vendor = quotation.vendors.find(v => v.id === response.vendorId);
                    const isLowest = quotation.responses!.every(r =>
                      r.vendorId === response.vendorId || response.totalAmount <= r.totalAmount
                    );

                    return (
                      <div
                        key={response.vendorId}
                        className={`p-4 border-2 rounded-lg ${
                          isLowest
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <p className="text-sm text-gray-600 mb-1">{vendor?.name}</p>
                        <p className={`text-2xl font-bold ${
                          isLowest ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          ¥{response.totalAmount.toLocaleString()}
                        </p>
                        {isLowest && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-200 rounded">
                            最安値
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 回答待ちメッセージ */}
          {(!quotation.responses || quotation.responses.length === 0) && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                販売店からの回答をお待ちください。回答が届き次第、こちらに表示されます。
              </p>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/quotations')}
              className="px-12 py-3 bg-gray-400 text-white font-medium rounded hover:bg-gray-500 transition-colors"
            >
              一覧に戻る
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
