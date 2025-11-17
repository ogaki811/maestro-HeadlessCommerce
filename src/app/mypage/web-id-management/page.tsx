'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function WebIdManagementPage() {
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Web ID管理</h1>

                {/* 機能一覧テーブル */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 w-1/3 bg-gray-50">
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            Web ID一覧
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          登録されているWeb IDの一覧を表示します。編集・削除もこちらから行えます。
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 w-1/3 bg-gray-50">
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            新規Web ID作成
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          新しいWeb IDを作成します。ユーザー名、パスワード、権限などを設定できます。
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 w-1/3 bg-gray-50">
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            アクセス権限設定
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          各Web IDのアクセス権限を設定します。閲覧権限、編集権限、管理者権限などを管理できます。
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 w-1/3 bg-gray-50">
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            パスワードリセット
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          指定したWeb IDのパスワードをリセットします。一時パスワードを発行し、ユーザーに通知します。
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 w-1/3 bg-gray-50">
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            ログイン履歴確認
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          各Web IDのログイン履歴を確認します。ログイン日時、IPアドレスなどの情報を表示します。
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 w-1/3 bg-gray-50">
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            アカウントロック解除
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ロックされたアカウントを解除します。複数回のログイン失敗などでロックされたアカウントを復旧できます。
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
