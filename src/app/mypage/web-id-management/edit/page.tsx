'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import toast from 'react-hot-toast';

export default function WebIdEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webId = searchParams.get('id');
  const hasAccess = useAdminAuth();

  if (!hasAccess) {
    return null;
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Web ID登録情報の修正
                </h1>

                {/* 説明文 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    Web ID: {webId || '未選択'}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    登録情報を修正できます。
                    <a href="#" className="text-blue-600 hover:underline ml-2">
                      ご利用ガイドへ
                    </a>
                  </p>
                </div>

                {/* 登録情報フォーム */}
                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Web ID
                        </label>
                        <input
                          type="text"
                          value={webId || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          氏名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="山田 太郎"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          役職
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="営業部長"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          メールアドレス <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="example@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* パスワード */}
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">パスワード</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          新しいパスワード
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="8文字以上"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          パスワード（確認）
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="パスワードを再入力"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ※パスワードを変更しない場合は空欄のままにしてください
                    </p>
                  </div>

                  {/* メール設定 */}
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">メール設定</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="orderMail"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="orderMail" className="ml-2 text-sm text-gray-700">
                          受注確認メールを受け取る
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="magazine"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="magazine" className="ml-2 text-sm text-gray-700">
                          メールマガジンを受け取る
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 権限設定 */}
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">権限設定</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          承認者
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent">
                          <option value="">選択してください</option>
                          <option value="approver1">承認者1</option>
                          <option value="approver2">承認者2</option>
                        </select>
                      </div>
                      <div className="flex items-center pt-8">
                        <input
                          type="checkbox"
                          id="admin"
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="admin" className="ml-2 text-sm text-gray-700">
                          管理者権限を付与する
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ボタンエリア */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/mypage/web-id-management/list')}
                  >
                    キャンセル
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      toast.success('登録情報を更新しました');
                      router.push('/mypage/web-id-management/list');
                    }}
                  >
                    更新する
                  </Button>
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
