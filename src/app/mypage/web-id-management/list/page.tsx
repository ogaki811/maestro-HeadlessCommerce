'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function WebIdListPage() {
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
                  Web ID登録情報一覧
                </h1>

                {/* 説明文 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    Web IDの新規登録や情報修正、管理者変更ができます。
                    <a href="#" className="text-blue-600 hover:underline ml-2">
                      ご利用ガイドへ
                    </a>
                  </p>
                </div>

                {/* ユーザー情報ボックス */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700">ユーザーコード：</span>
                      <span className="text-gray-900">012345</span>
                    </div>
                    <div>
                      <span className="text-gray-700">法人名：</span>
                      <span className="text-gray-900">子ユーザー</span>
                    </div>
                    <div>
                      <span className="text-gray-700">部署名：</span>
                      <span className="text-gray-900"></span>
                    </div>
                  </div>
                </div>

                {/* 検索・ダウンロードエリア */}
                <div className="flex items-center gap-4 mb-6">
                  <Button>Web ID検索</Button>
                  <select className="px-4 py-2 border border-gray-300 rounded">
                    <option>CSV</option>
                  </select>
                  <Button>一括ダウンロード</Button>
                </div>

                {/* 新規Web ID登録ボタン */}
                <div className="mb-6">
                  <Button size="lg">新規Web ID登録</Button>
                </div>

                {/* ページネーション（上部） */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                      ◀ 前ページ
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                      次ページ ▶
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">ページ指定</span>
                    <input
                      type="text"
                      value="1"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                      readOnly
                    />
                    <span className="text-gray-600">/ 1</span>
                  </div>
                </div>

                {/* データテーブル - 2段組みデザイン */}
                <div className="border border-gray-200 rounded-lg mb-6">
                  {[
                    { id: '1613578005', name: 'ＩＤ修正', position: '', email: 'ahasebe@jointex.jp', password: '********', orderMail: '要', magazine: '要', approver: '', admin: true },
                    { id: '1613578007', name: 'テスト大竹０６０３', position: '住宅事業部 守都営第１営業部', email: 'mootake@jointex.jp', password: '********', orderMail: '要', magazine: '不要', approver: '', admin: false },
                    { id: '1613578008', name: 'はせべ６６０３', position: '', email: 'ahasebe@jointex.jp', password: '********', orderMail: '不要', magazine: '不要', approver: '', admin: false },
                    { id: '1613578009', name: 'テスト大竹', position: '', email: 'mootake@jointex.jp', password: '********', orderMail: '要', magazine: '要', approver: '', admin: true },
                    { id: '1613578010', name: '松土テスト', position: '', email: 'smatsudo@jointex.jp', password: '********', orderMail: '不要', magazine: '不要', approver: '', admin: false },
                    { id: '1613578011', name: 'テスト', position: '', email: 'rkato@jointex.jp', password: '********', orderMail: '要', magazine: '要', approver: '', admin: false },
                    { id: '1613578012', name: '森本華澄テスト', position: '', email: 'kmorimoto@jointex.jp', password: '********', orderMail: '不要', magazine: '不要', approver: '', admin: false },
                  ].map((row, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 p-4">
                      {/* 1段目: メイン情報 */}
                      <div className="grid grid-cols-12 gap-4 mb-2">
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">Web ID</div>
                          <div className="text-sm font-medium text-gray-900">{row.id}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">氏名</div>
                          <div className="text-sm text-gray-900">{row.name}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">役職</div>
                          <div className="text-sm text-gray-900">{row.position || '-'}</div>
                        </div>
                        <div className="col-span-3">
                          <div className="text-xs text-gray-500">メールアドレス</div>
                          <div className="text-sm text-gray-900">{row.email}</div>
                        </div>
                        <div className="col-span-3 flex items-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/mypage/web-id-management/edit?id=${row.id}`)}
                          >
                            修正
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => router.push(`/mypage/web-id-management/transfer?id=${row.id}`)}
                          >
                            引継ぎ
                          </Button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* 2段目: サブ情報 */}
                      <div className="grid grid-cols-12 gap-4 pt-2 border-t border-gray-100">
                        <div className="col-span-2">
                          <span className="text-xs text-gray-500">パスワード: </span>
                          <span className="text-sm text-gray-900">{row.password}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs text-gray-500">受注確認: </span>
                          <span className="text-sm text-gray-900">{row.orderMail}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs text-gray-500">メルマガ: </span>
                          <span className="text-sm text-gray-900">{row.magazine}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs text-gray-500">承認者: </span>
                          <span className="text-sm text-gray-900">{row.approver || '-'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs text-gray-500">管理者: </span>
                          {row.admin && (
                            <input type="checkbox" checked readOnly className="w-4 h-4 align-middle ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ページネーション（下部） */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                      ◀ 前ページ
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
                      次ページ ▶
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">ページ指定</span>
                    <input
                      type="text"
                      value="1"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                      readOnly
                    />
                    <span className="text-gray-600">/ 1</span>
                  </div>
                </div>

                {/* 管理権限更新ボタン */}
                <div className="flex justify-end mb-6">
                  <Button size="lg">管理権限更新</Button>
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
