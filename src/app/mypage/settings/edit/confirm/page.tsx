'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  position: string;
  email: string;
  orderConfirmEmail: string;
  mailMagazine: string;
  loginNotification: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsEditConfirmPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // sessionStorageからデータを取得
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('settingsEditData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      } else {
        // データがない場合は編集画面に戻る
        toast.error('データが見つかりません。最初からやり直してください。');
        router.push('/mypage/settings/edit');
      }
    }
  }, [isAuthenticated, router]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    // バックエンドがないので、トーストメッセージを表示して戻る
    toast.success('登録情報を更新しました');

    // sessionStorageをクリア
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('settingsEditData');
    }

    // マイページに戻る
    router.push('/mypage');
  };

  if (!isAuthenticated || !formData) {
    return null;
  }

  const hasPasswordChange = formData.currentPassword || formData.newPassword || formData.confirmPassword;

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
                {/* ページヘッダー */}
                <div className="mb-8">
                  <p className="text-base text-gray-700 mb-6">
                    以下の内容で登録します。よろしければ「登録する」ボタンをクリックしてください。
                  </p>
                </div>

                {/* 基本情報セクション */}
                <section className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-gray-900 mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-900">基本情報</h2>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    ※ご登録の基本情報に変更がある場合は管理者権限のWeb利用者の方より変更依頼をお願いいたします。
                  </p>

                  <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            ユーザーコード
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            0001
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            社名
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            松村商事株式会社
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            部署名
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            システム企画部
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            会社住所
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            東京都千代田区永田町2-13-10プルデンシャルタワー12階
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            会社電話番号
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            0362058719
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            会社FAX番号
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            0362058719
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Web利用者情報セクション */}
                <section className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-gray-900 mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-900">Web利用者情報</h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            Web利用者ID
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            1313111006
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            氏名（漢字）
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {formData.name}
                          </td>
                        </tr>
                        {formData.position && (
                          <tr className="border-b border-gray-200">
                            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                              役職名
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">
                              {formData.position}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            会社用メールアドレス
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {formData.email}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            受注確認メール
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {formData.orderConfirmEmail === 'required' ? '必要' : '不要'}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            メールマガジン
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {formData.mailMagazine === 'required' ? '必要' : '不要'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            ログイン速報メール
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {formData.loginNotification === 'required' ? '必要' : '不要'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* パスワード変更セクション（変更がある場合のみ表示） */}
                {hasPasswordChange && (
                  <section className="mb-12">
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-gray-900 mr-3"></div>
                      <h2 className="text-xl font-bold text-gray-900">パスワード変更</h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                              パスワード
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">
                              変更あり
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* アクションボタン */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
                  >
                    登録する
                  </button>
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
