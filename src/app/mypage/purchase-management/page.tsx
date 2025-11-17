'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function PurchaseManagementPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // ロールチェック: 管理者のみアクセス可能
    if (user && (user.role === 'super_admin' || user.role === 'admin')) {
      setHasAccess(true);
    } else {
      toast.error('このページへのアクセス権限がありません');
      router.push('/mypage');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !hasAccess) {
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">購買管理</h1>
                  <p className="text-gray-600">購買データの統計・分析・レポート機能を提供します</p>
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">購買管理機能</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    購買データの統計、予算管理、承認フローなどの機能を準備中です。
                  </p>

                  {/* 将来実装予定の機能リスト */}
                  <div className="max-w-2xl mx-auto mt-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 text-left">実装予定の機能</h3>
                    <div className="grid gap-3 text-left">
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">購買統計ダッシュボード</h4>
                        <p className="text-sm text-gray-600">月次・年次の購買データをグラフで可視化</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">予算管理</h4>
                        <p className="text-sm text-gray-600">部門別・カテゴリ別の予算設定と使用状況の追跡</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">発注承認フロー</h4>
                        <p className="text-sm text-gray-600">金額や商品カテゴリに応じた承認ワークフロー</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">購買履歴分析</h4>
                        <p className="text-sm text-gray-600">過去の購買パターン分析とコスト最適化提案</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">CSVエクスポート</h4>
                        <p className="text-sm text-gray-600">購買データのCSV形式ダウンロード機能</p>
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
