'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーログをログサービスに送信（本番環境では外部サービスへ）
    if (process.env.NODE_ENV === 'production') {
      // 本番環境でのみエラー送信
      // 例: sendErrorToLoggingService(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        {/* エラーアイコン */}
        <div className="ec-error__icon mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* エラーメッセージ */}
        <h1 className="ec-error__title text-2xl font-bold text-gray-900 mb-4">
          エラーが発生しました
        </h1>
        <p className="ec-error__message text-gray-600 mb-6">
          申し訳ございません。予期しないエラーが発生しました。
          <br />
          しばらく経ってから再度お試しください。
        </p>

        {/* アクション */}
        <div className="ec-error__actions space-y-3">
          <Button
            onClick={reset}
            variant="primary"
            fullWidth
          >
            もう一度試す
          </Button>
          <Link href="/" className="block">
            <Button variant="outline" fullWidth>
              トップページへ戻る
            </Button>
          </Link>
        </div>

        {/* デバッグ情報（開発環境のみ） */}
        {process.env.NODE_ENV === 'development' && (
          <details className="ec-error__debug mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              エラー詳細（開発用）
            </summary>
            <div className="mt-2 p-4 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto">
              <p className="font-bold mb-2">Error: {error.message}</p>
              {error.digest && <p className="text-gray-600">Digest: {error.digest}</p>}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
