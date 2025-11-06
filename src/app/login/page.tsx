'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import SimpleHeader from '@/components/layout/SimpleHeader';
import SimpleFooter from '@/components/layout/SimpleFooter';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { login: authStoreLogin } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 実際の実装では、ここでAPI呼び出しを行う
      await new Promise((resolve) => setTimeout(resolve, 1000)); // シミュレーション

      // デモユーザーでログイン
      authStoreLogin({
        id: 'demo-user-1',
        name: '山田 太郎',
        email: formData.email,
        phoneNumber: '090-1234-5678',
        postalCode: '150-0001',
        prefecture: '東京都',
        city: '渋谷区',
        address: '神宮前1-2-3',
        building: 'サンプルビル101',
        points: 1250,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('ログインしました');
      router.push(callbackUrl);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'customer@example.com',
      password: 'password123',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />

      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ログイン</h1>
              <p className="text-gray-600">
                アカウントにログインしてください
              </p>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <Input
                  label="パスワード"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="パスワードを入力"
                  autoComplete="current-password"
                  fullWidth
                />
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      ログイン状態を保持
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-black hover:underline"
                  >
                    パスワードを忘れた方
                  </Link>
                </div>
              </div>

              <Button type="submit" fullWidth loading={isLoading}>
                ログイン
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleDemoLogin}
              >
                デモデータを入力
              </Button>
            </form>

            {/* SNSログイン */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    または
                  </span>
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
                  Googleでログイン
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
                  Facebookでログイン
                </button>
              </div>
            </div>

            {/* サインアップリンク */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                アカウントをお持ちでない方は
                <Link
                  href="/signup"
                  className="ml-1 text-black font-medium hover:underline"
                >
                  新規登録
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
