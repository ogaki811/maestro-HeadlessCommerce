'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import toast from 'react-hot-toast';

export default function WebIdTransferPage() {
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
                  Web ID引き継ぎ
                </h1>

                {/* 説明文 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    Web ID: {webId || '未選択'}
                  </p>
                  <p className="text-sm text-gray-700">
                    管理者権限を別のWeb IDに引き継ぐことができます。
                  </p>
                </div>

                {/* 引き継ぎ情報テーブル */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 bg-gray-50 w-1/3">
                          <span className="text-sm font-medium text-gray-900">
                            引き継ぎ元Web ID
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {webId || '未選択'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 bg-gray-50">
                          <span className="text-sm font-medium text-gray-900">
                            引き継ぎ先Web ID <span className="text-red-500">*</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent">
                            <option value="">選択してください</option>
                            <option value="1613578005">1613578005 - ＩＤ修正</option>
                            <option value="1613578007">1613578007 - テスト大竹０６０３</option>
                            <option value="1613578008">1613578008 - はせべ６６０３</option>
                            <option value="1613578009">1613578009 - テスト大竹</option>
                            <option value="1613578010">1613578010 - 松土テスト</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 bg-gray-50">
                          <span className="text-sm font-medium text-gray-900">
                            引き継ぎ内容
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="admin"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                defaultChecked
                              />
                              <label htmlFor="admin" className="ml-2 text-sm text-gray-900">
                                管理者権限
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="orders"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                              />
                              <label htmlFor="orders" className="ml-2 text-sm text-gray-900">
                                注文履歴
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="favorites"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                              />
                              <label htmlFor="favorites" className="ml-2 text-sm text-gray-900">
                                お気に入り商品
                              </label>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 bg-gray-50">
                          <span className="text-sm font-medium text-gray-900">
                            引き継ぎ後の処理
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="keep"
                                name="afterTransfer"
                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                                defaultChecked
                              />
                              <label htmlFor="keep" className="ml-2 text-sm text-gray-900">
                                引き継ぎ元Web IDを保持する
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="delete"
                                name="afterTransfer"
                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                              />
                              <label htmlFor="delete" className="ml-2 text-sm text-gray-900">
                                引き継ぎ元Web IDを削除する
                              </label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 注意事項 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                    注意事項
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>引き継ぎ処理は取り消すことができません</li>
                    <li>管理者権限を引き継ぐと、引き継ぎ先のユーザーが管理者になります</li>
                    <li>引き継ぎ元Web IDを削除する場合、ログイン情報も削除されます</li>
                  </ul>
                </div>

                {/* ボタンエリア */}
                <div className="flex items-center justify-center gap-4">
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
                      toast.success('引き継ぎ処理を完了しました');
                      router.push('/mypage/web-id-management/list');
                    }}
                  >
                    引き継ぎを実行
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
