'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function WebIdManagementPage() {
  const router = useRouter();
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
                  Web ID管理部署選択
                </h1>

                {/* 説明文 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    Web IDの新規登録や情報修正、管理者変更ができます。
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    メンテナンスしたい部署（ユーザーコード）を選択してください。
                    <a href="#" className="text-blue-600 hover:underline ml-2">
                      ご利用ガイドへ
                    </a>
                  </p>
                </div>

                {/* 検索・ダウンロードエリア */}
                <div className="flex items-center gap-4 mb-6">
                  <Button>ユーザー検索</Button>
                  <select className="px-4 py-2 border border-gray-300 rounded">
                    <option>CSV</option>
                  </select>
                  <Button>一括ダウンロード</Button>
                </div>

                {/* ページネーション（上部） */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      ◀ 前ページ
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      次ページ ▶
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="1"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                      readOnly
                    />
                    <span className="text-gray-600">/ 1</span>
                  </div>
                </div>

                {/* データテーブル */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/5">
                          ユーザーコード
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/4">
                          法人名
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-1/5">
                          部署名
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          住所
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-2">012345</div>
                          <Button size="sm" onClick={() => router.push('/mypage/web-id-management/list')}>WebID一覧</Button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">子ユーザー</td>
                        <td className="px-6 py-4 text-sm text-gray-900"></td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          神奈川県川崎市麻生区あいう町１－１
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-2">5000000004</div>
                          <Button size="sm" onClick={() => router.push('/mypage/web-id-management/list')}>WebID一覧</Button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">株式会社松村テスト</td>
                        <td className="px-6 py-4 text-sm text-gray-900">テスト</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          神奈川県川崎市麻生区２丁目テストテスト
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-2">5000000006</div>
                          <Button size="sm" onClick={() => router.push('/mypage/web-id-management/list')}>WebID一覧</Button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">株式会社松村テスト</td>
                        <td className="px-6 py-4 text-sm text-gray-900">関東物流センター</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          埼玉県志木市○△町２－２
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-2">9040301425</div>
                          <Button size="sm" onClick={() => router.push('/mypage/web-id-management/list')}>WebID一覧</Button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          １２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900"></td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          愛知県名古屋市千種区○×町１－１松村ビル１階
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 mb-2">9040301426</div>
                          <Button size="sm" onClick={() => router.push('/mypage/web-id-management/list')}>WebID一覧</Button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">株式会社松村テスト</td>
                        <td className="px-6 py-4 text-sm text-gray-900">青梅物流センター</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          東京都青梅市a町３－３テストビル２階
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ページネーション（下部） */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      ◀ 前ページ
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      次ページ ▶
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="1"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                      readOnly
                    />
                    <span className="text-gray-600">/ 1</span>
                  </div>
                </div>

                {/* 戻るボタン */}
                <div className="flex justify-center">
                  <Button variant="secondary" size="lg">
                    戻る
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
