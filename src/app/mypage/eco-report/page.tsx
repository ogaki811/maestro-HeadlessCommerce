/**
 * Eco Report Page
 * 環境配慮商品購入レポートページ
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';

/**
 * 環境配慮商品購入レポートページ
 *
 * 環境配慮商品の購入状況を確認できるページ
 */
export default function EcoReportPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // リダイレクト中
  }

  return (
    <>
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
                {/* ページヘッダー */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">環境配慮商品購入レポート</h1>
                  <p className="text-gray-600">環境に配慮した商品の購入状況をレポートで確認できます</p>
                </div>

                {/* 機能準備中メッセージ */}
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-20 w-20 text-gray-400 mb-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">環境配慮商品購入レポート機能</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    環境配慮商品の購入状況を可視化するレポート機能を準備中です。
                  </p>

                  {/* 将来実装予定の機能リスト */}
                  <div className="max-w-2xl mx-auto mt-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 text-left">実装予定の機能</h3>
                    <div className="grid gap-3 text-left">
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">CO2削減量の可視化</h4>
                        <p className="text-sm text-gray-600">環境配慮商品購入によるCO2削減効果をグラフ表示</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">購入比率レポート</h4>
                        <p className="text-sm text-gray-600">全購入商品中の環境配慮商品の割合を月次・年次で表示</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">環境貢献証明書</h4>
                        <p className="text-sm text-gray-600">企業向けの環境貢献活動証明書のPDF発行</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">エコ商品おすすめ</h4>
                        <p className="text-sm text-gray-600">購入履歴に基づく環境配慮商品のレコメンド</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
