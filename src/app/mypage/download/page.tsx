/**
 * Purchase Data Download Page
 * 購入データダウンロードページ
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
 * 購入データダウンロードページ
 *
 * 過去の購入履歴をダウンロードできるページ
 */
export default function PurchaseDataDownloadPage() {
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">購入データダウンロード</h1>
                  <p className="text-gray-600">購入履歴データをCSV形式でダウンロードできます</p>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">購入データダウンロード機能</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    購入履歴データをCSV形式でダウンロードする機能を準備中です。
                  </p>

                  {/* 将来実装予定の機能リスト */}
                  <div className="max-w-2xl mx-auto mt-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 text-left">実装予定の機能</h3>
                    <div className="grid gap-3 text-left">
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">期間指定ダウンロード</h4>
                        <p className="text-sm text-gray-600">指定期間の購入データをCSVでダウンロード</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">カテゴリ別ダウンロード</h4>
                        <p className="text-sm text-gray-600">商品カテゴリごとに購入データを出力</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">定期レポート設定</h4>
                        <p className="text-sm text-gray-600">月次・年次レポートの自動メール送信</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">Excel形式エクスポート</h4>
                        <p className="text-sm text-gray-600">CSV以外にExcel形式での出力対応</p>
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
