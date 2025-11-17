'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';

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

export default function SettingsEditPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: '小川祐樹',
    position: '',
    email: 'yuogawa@plus.co.jp',
    orderConfirmEmail: 'required',
    mailMagazine: 'required',
    loginNotification: 'required',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // 氏名必須チェック
    if (!formData.name.trim()) {
      newErrors.name = '氏名を入力してください';
    }

    // メールアドレス必須チェック
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    // パスワード変更チェック
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '現在のパスワードを入力してください';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = '新しいパスワードを入力してください';
      } else if (formData.newPassword.length < 6 || formData.newPassword.length > 32) {
        newErrors.newPassword = 'パスワードは6~32桁で入力してください';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '確認用パスワードを入力してください';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // バリデーション成功 - データをsessionStorageに保存
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('settingsEditData', JSON.stringify(formData));
      }
      // 確認画面へ遷移
      router.push('/mypage/settings/edit/confirm');
    }
  };

  if (!isAuthenticated) {
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
                {/* ページヘッダー */}
                <div className="mb-8">
                  <p className="text-base text-gray-700 mb-6">
                    変更したい箇所を入力後、「次へ」ボタンをクリックして「確認画面」へお進みください。
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

                  {/* 基本情報テーブル */}
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
                            <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                              必須
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.name && (
                              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            役職名
                          </td>
                          <td className="py-4 px-6">
                            <input
                              type="text"
                              value={formData.position}
                              onChange={(e) => handleInputChange('position', e.target.value)}
                              placeholder="（全角）例：部長"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            会社用メールアドレス
                            <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                              必須
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.email && (
                              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            受注確認メール
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-6">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="orderConfirmEmail"
                                  value="required"
                                  checked={formData.orderConfirmEmail === 'required'}
                                  onChange={(e) => handleInputChange('orderConfirmEmail', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-900">必要</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="orderConfirmEmail"
                                  value="not_required"
                                  checked={formData.orderConfirmEmail === 'not_required'}
                                  onChange={(e) => handleInputChange('orderConfirmEmail', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-900">不要</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            メールマガジン
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-6">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="mailMagazine"
                                  value="required"
                                  checked={formData.mailMagazine === 'required'}
                                  onChange={(e) => handleInputChange('mailMagazine', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-900">必要</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="mailMagazine"
                                  value="not_required"
                                  checked={formData.mailMagazine === 'not_required'}
                                  onChange={(e) => handleInputChange('mailMagazine', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-900">不要</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            ログイン速報メール
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-6">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="loginNotification"
                                  value="required"
                                  checked={formData.loginNotification === 'required'}
                                  onChange={(e) => handleInputChange('loginNotification', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-900">必要</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="loginNotification"
                                  value="not_required"
                                  checked={formData.loginNotification === 'not_required'}
                                  onChange={(e) => handleInputChange('loginNotification', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-900">不要</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* パスワード変更セクション */}
                <section className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-gray-900 mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-900">パスワード変更</h2>
                  </div>

                  <div className="mb-6 space-y-2">
                    <p className="text-sm text-gray-700">
                      ・パスワード変更を希望される場合のみ、現状パスワード、新パスワードを入力してください。
                    </p>
                    <p className="text-sm text-gray-700">
                      ・パスワードを変更する場合は英数字6~32桁で設定してください。（セキュリティ上、7桁以上の設定を推奨します。）
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
                            パスワード
                          </td>
                          <td className="py-4 px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  現状
                                </label>
                                <input
                                  type="password"
                                  value={formData.currentPassword}
                                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                  placeholder="0304233121"
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent ${
                                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                                {errors.currentPassword && (
                                  <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  新
                                </label>
                                <input
                                  type="password"
                                  value={formData.newPassword}
                                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                  placeholder="0304233121"
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent ${
                                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                                {errors.newPassword && (
                                  <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  新（確認用）
                                </label>
                                <input
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                  placeholder="0304233121"
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                                {errors.confirmPassword && (
                                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* アクションボタン */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => router.push('/mypage/settings')}
                    className="px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
                  >
                    次へ
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
