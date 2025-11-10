/**
 * New Quotation Request Page
 * 新規見積依頼ページ
 *
 * Phase 2: 見積依頼作成機能
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { QuotationProductForm } from '@/components/quotation';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import type { Vendor, QuotationProduct } from '@/types/quotation';

export default function NewQuotationPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [products, setProducts] = useState<QuotationProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // 販売店データ読み込み
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/mock-api/vendors.json');
        const data = await response.json();
        setVendors(data.vendors || []);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        toast.error('販売店情報の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // 認証チェック（開発中は一時的にコメントアウト）
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  // 商品削除
  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success('商品を削除しました');
  };

  // 見積依頼送信
  const handleSubmit = async () => {
    // バリデーション
    if (selectedVendorIds.length === 0) {
      toast.error('依頼先の販売店を選択してください');
      return;
    }

    if (products.length === 0) {
      toast.error('商品を追加してください');
      return;
    }

    // 見積依頼データ作成
    const selectedVendors = vendors.filter(v => selectedVendorIds.includes(v.id));

    const quotationData = {
      requestUser: 'user_001', // 実際はセッションから取得
      requestUserName: '山田 太郎',
      vendors: selectedVendors,
      products,
      status: 'pending' as const,
    };

    console.log('見積依頼データ:', quotationData);

    // TODO: API送信処理（Phase 2で実装）
    toast.success('見積依頼を送信しました');

    // 一覧ページへ遷移
    router.push('/quotations');
  };

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
              新規見積依頼
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              複数の販売店に相見積もりを依頼できます。商品を追加して見積依頼を送信してください。
            </p>
          </header>

          {/* 販売店選択セクション */}
          <div className="mb-4 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="inline-block w-1 h-6 bg-gray-900 mr-3"></span>
              販売店を選択
            </h2>

            <div className="space-y-4">
              {/* 販売店選択テーブル */}
              <div>
                {/* ヘッダー行 */}
                <div className="grid grid-cols-3 gap-4 bg-gray-50 px-4 py-2 font-medium text-sm text-gray-700">
                  <div>販売店</div>
                  <div>ユーザーコード/ユーザー名</div>
                  <div>WebID/氏名</div>
                </div>
                {/* データ行 */}
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="grid grid-cols-3 gap-4 px-4 py-3 hover:bg-gray-50">
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

              {/* 全選択・選択クリアボタン */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedVendorIds(vendors.map(v => v.id))}
                  className="px-6 py-2 bg-[#2d2626] text-white font-medium rounded hover:bg-gray-900 transition-colors"
                >
                  全選択
                </button>
                <button
                  onClick={() => setSelectedVendorIds([])}
                  className="px-6 py-2 bg-gray-400 text-white font-medium rounded hover:bg-gray-500 transition-colors"
                >
                  選択クリア
                </button>
              </div>

              {/* 選択中の販売店表示 */}
              {selectedVendorIds.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    選択中: {selectedVendorIds.length}社
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {vendors
                      .filter(v => selectedVendorIds.includes(v.id))
                      .map(vendor => (
                        <span
                          key={vendor.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {vendor.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 商品追加フォーム */}
          <div className="mb-4 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="inline-block w-1 h-6 bg-gray-900 mr-3"></span>
              商品を追加
            </h2>

            <QuotationProductForm
              products={products}
              onProductsChange={(newProducts) => {
                setProducts(newProducts);
                toast.success('商品を追加しました');
              }}
            />
          </div>

          {/* 依頼商品一覧 */}
          {products.length > 0 && (
            <div className="mb-4 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="inline-block w-1 h-6 bg-gray-900 mr-3"></span>
                依頼商品一覧（{products.length}件）
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        商品コード
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        商品名
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        数量
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        仕様・備考
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.productCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.productName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.specifications || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="px-4 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 送信ボタン */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/quotations')}
              className="px-12 py-3 bg-gray-400 text-white font-medium rounded hover:bg-gray-500 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedVendorIds.length === 0 || products.length === 0}
              className="px-12 py-3 bg-blue-900 text-white font-medium rounded hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              見積依頼を送信
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
