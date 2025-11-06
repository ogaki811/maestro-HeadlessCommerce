'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SimpleHeader from '@/components/layout/SimpleHeader';
import SimpleFooter from '@/components/layout/SimpleFooter';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 実際の実装では、ここでAPI呼び出しを行う
      await new Promise((resolve) => setTimeout(resolve, 1500)); // シミュレーション

      setEmailSent(true);
      toast.success('パスワードリセット用のメールを送信しました');
    } catch (error) {
      toast.error('メールの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col">
        <SimpleHeader />

        <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              {/* 成功アイコン */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
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

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                メールを送信しました
              </h1>
              <p className="text-gray-600 mb-6">
                {email} にパスワードリセット用のリンクを送信しました。
                <br />
                メールをご確認の上、リンクをクリックしてパスワードを再設定してください。
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>ご注意:</strong>
                  <br />
                  メールが届かない場合は、迷惑メールフォルダをご確認ください。
                  リンクの有効期限は24時間です。
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors text-center"
                >
                  ログインページへ戻る
                </Link>
                <button
                  onClick={() => setEmailSent(false)}
                  className="block w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  別のメールアドレスで再送信
                </button>
              </div>
            </div>
          </div>
        </main>

        <SimpleFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />

      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                パスワードをお忘れですか？
              </h1>
              <p className="text-gray-600">
                登録したメールアドレスを入力してください。
                <br />
                パスワードリセット用のリンクをお送りします。
              </p>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@example.com"
                autoComplete="email"
                fullWidth
              />

              <Button type="submit" fullWidth loading={isLoading}>
                リセットリンクを送信
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

          {/* サポート情報 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              アカウントに関するお問い合わせは
              <Link href="/contact" className="text-black hover:underline">
                こちら
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
