/**
 * My Catalog Page
 * マイカタログページ
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
 * マイカタログページ
 *
 * ユーザーが作成したカスタムカタログを管理するページ
 */
export default function MyCatalogPage() {
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">マイカタログ</h1>
                  <p className="text-gray-600">よく購入する商品をカタログとしてまとめて管理できます</p>
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">マイカタログ機能</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    よく購入する商品をカタログとしてまとめて管理する機能を準備中です。
                  </p>

                  {/* 将来実装予定の機能リスト */}
                  <div className="max-w-2xl mx-auto mt-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 text-left">実装予定の機能</h3>
                    <div className="grid gap-3 text-left">
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">カタログ作成</h4>
                        <p className="text-sm text-gray-600">複数の商品をグループ化してカタログを作成</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">一括注文</h4>
                        <p className="text-sm text-gray-600">カタログから複数商品を一度にカートに追加</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">カタログ共有</h4>
                        <p className="text-sm text-gray-600">社内メンバーとカタログを共有</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">定期発注設定</h4>
                        <p className="text-sm text-gray-600">カタログを使った定期的な自動発注</p>
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
