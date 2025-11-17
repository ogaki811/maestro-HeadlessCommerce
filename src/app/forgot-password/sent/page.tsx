'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordSentPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = sessionStorage.getItem('resetEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        router.push('/forgot-password');
      }
    }
  }, [router]);

  const handleResend = () => {
    // sessionStorageをクリアして最初の画面に戻る
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('resetEmail');
    }
    router.push('/forgot-password');
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* 成功アイコン */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* ページタイトル */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              メールを送信しました
            </h1>
            <p className="text-sm text-gray-600 mb-6 text-center">
              以下のメールアドレスにパスワード再設定用のURLを送信しました。
            </p>

            {/* メールアドレス表示 */}
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-700 font-medium text-center">
                {email}
              </p>
            </div>

            {/* 案内文 */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-4">
                メールに記載されたURLをクリックして、パスワードの再設定を行ってください。
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>ご注意:</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>メールが届かない場合は、迷惑メールフォルダをご確認ください。</li>
                  <li>URLの有効期限は24時間です。</li>
                </ul>
              </div>
            </div>

            {/* ボタン */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full px-4 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors text-center"
              >
                ログインページへ戻る
              </Link>
              <button
                onClick={handleResend}
                className="block w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-center"
              >
                別のメールアドレスで再送信
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
