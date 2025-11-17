'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // メールアドレスのバリデーション
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    // sessionStorageにメールアドレスを保存
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('resetEmail', email);
    }

    // メール送信完了画面へ遷移
    router.push('/forgot-password/sent');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* ページタイトル */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              パスワードをお忘れの方
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              ご登録のメールアドレスを入力してください。<br />
              パスワード再設定用のURLをお送りします。
            </p>

            {/* フォーム */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  メールアドレス
                  <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                    必須
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors mb-4"
              >
                送信する
              </button>

              {/* ログイン画面に戻るリンク */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline"
                >
                  ログイン画面に戻る
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
