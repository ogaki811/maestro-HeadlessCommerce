'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import StatusIcon from '@/components/ui/StatusIcon';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // トークンの検証（シミュレーション）
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error('無効なリンクです');
    } else {
      // 実際の実装では、ここでトークンをバックエンドで検証する
      setTokenValid(true);
    }
  }, [token]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // パスワードの最低文字数チェック
    if (formData.password.length < 8) {
      toast.error('パスワードは8文字以上で入力してください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('パスワードが一致しません');
      return;
    }

    if (passwordStrength < 25) {
      toast.error('パスワードの強度が不足しています。もう少し複雑なパスワードを設定してください。');
      return;
    }

    setIsLoading(true);

    try {
      // 実際の実装では、ここでAPIを呼び出してパスワードをリセットする
      await new Promise((resolve) => setTimeout(resolve, 1500)); // シミュレーション

      setResetComplete(true);
      toast.success('パスワードをリセットしました');
    } catch (error) {
      toast.error('パスワードのリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // トークンが無効な場合
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              {/* エラーアイコン */}
              <div className="flex justify-center mb-6">
                <StatusIcon status="error" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                無効なリンクです
              </h1>
              <p className="text-gray-600 mb-6">
                このリンクは無効または期限切れです。
                <br />
                パスワードをリセットする場合は、再度リクエストしてください。
              </p>

              <Link
                href="/forgot-password"
                className="block w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors text-center"
              >
                パスワードリセットをリクエスト
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // リセット完了画面
  if (resetComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              {/* 成功アイコン */}
              <div className="flex justify-center mb-6">
                <StatusIcon status="success" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                パスワードをリセットしました
              </h1>
              <p className="text-gray-600 mb-6">
                新しいパスワードが設定されました。
                <br />
                ログインページから新しいパスワードでログインしてください。
              </p>

              <Link
                href="/login"
                className="block w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors text-center"
              >
                ログインページへ
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // パスワードリセットフォーム
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                新しいパスワードを設定
              </h1>
              <p className="text-gray-600">
                新しいパスワードを入力してください
              </p>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新しいパスワード
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    placeholder="8文字以上で入力"
                    autoComplete="new-password"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
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

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード（確認）
                </label>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    placeholder="パスワードを再入力"
                    autoComplete="new-password"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600">
                    パスワードが一致しません
                  </p>
                )}

              <Button type="submit" fullWidth loading={isLoading}>
                パスワードをリセット
              </Button>
            </form>

            {/* ログインリンク */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-black hover:underline flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                ログインページへ戻る
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
