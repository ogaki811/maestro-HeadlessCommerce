'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SimpleHeader from '@/components/layout/SimpleHeader';
import SimpleFooter from '@/components/layout/SimpleFooter';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/useAuthStore';
import type { SignupData } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dealerCode: '',
    userCode: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dealerCode || formData.dealerCode.trim() === '') {
      toast.error('販売店コードを入力してください');
      return;
    }

    if (!formData.userCode || formData.userCode.trim() === '') {
      toast.error('ユーザーコードを入力してください');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('利用規約に同意してください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('パスワードが一致しません');
      return;
    }

    if (passwordStrength < 50) {
      toast.error('パスワードの強度が不足しています');
      return;
    }

    setIsLoading(true);

    try {
      // 実際の実装では、ここでAPI呼び出しを行う
      await new Promise((resolve) => setTimeout(resolve, 1500)); // シミュレーション

      // ユーザー登録後、自動ログイン
      login({
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        role: 'general', // 新規登録ユーザーのデフォルトロール
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('アカウントを作成しました');
      router.push('/mypage');
    } catch (error) {
      toast.error('アカウント作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      name: '山田 太郎',
      email: 'yamada.taro@example.com',
      password: 'DemoPass123!',
      confirmPassword: 'DemoPass123!',
      phoneNumber: '090-1234-5678',
      dealerCode: 'D12345',
      userCode: 'U98765',
      agreeToTerms: true,
    });
    setPasswordStrength(calculatePasswordStrength('DemoPass123!'));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return '弱い';
    if (passwordStrength < 60) return '普通';
    return '強い';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />

      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                新規アカウント登録
              </h1>
              <p className="text-gray-600">
                必要事項を入力してアカウントを作成
              </p>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="お名前"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="山田 太郎"
                fullWidth
              />

              <Input
                label="メールアドレス"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="example@example.com"
                autoComplete="email"
                fullWidth
              />

              <Input
                label="電話番号（任意）"
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="090-1234-5678"
                fullWidth
              />

              <Input
                label="販売店コード"
                type="text"
                value={formData.dealerCode}
                onChange={(e) =>
                  setFormData({ ...formData, dealerCode: e.target.value })
                }
                required
                placeholder="D12345"
                fullWidth
              />

              <Input
                label="ユーザーコード"
                type="text"
                value={formData.userCode}
                onChange={(e) =>
                  setFormData({ ...formData, userCode: e.target.value })
                }
                required
                placeholder="U98765"
                fullWidth
              />

              <div>
                <Input
                  label="パスワード"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  placeholder="8文字以上で入力"
                  autoComplete="new-password"
                  fullWidth
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">パスワード強度:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength < 30
                            ? 'text-red-500'
                            : passwordStrength < 60
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      8文字以上、大小英字・数字・記号を組み合わせると強度が上がります
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="パスワード（確認）"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                placeholder="パスワードを再入力"
                autoComplete="new-password"
                fullWidth
              />

              {formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600">
                    パスワードが一致しません
                  </p>
                )}

              <div className="pt-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreeToTerms: e.target.checked })
                    }
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-700 mt-0.5"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-black hover:underline"
                    >
                      利用規約
                    </a>
                    と
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-black hover:underline"
                    >
                      プライバシーポリシー
                    </a>
                    に同意します
                  </span>
                </label>
              </div>

              <Button type="submit" fullWidth loading={isLoading}>
                アカウントを作成
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleDemoFill}
              >
                デモデータを入力
              </Button>
            </form>

            {/* SNS登録 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">または</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Googleで登録
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="#1877F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebookで登録
                </button>
              </div>
            </div>

            {/* ログインリンク */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                既にアカウントをお持ちの方は
                <Link
                  href="/login"
                  className="ml-1 text-black font-medium hover:underline"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
