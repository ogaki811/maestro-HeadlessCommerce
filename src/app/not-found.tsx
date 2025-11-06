import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        {/* 404アイコン */}
        <div className="ec-not-found__icon mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-black">404</span>
        </div>

        {/* メッセージ */}
        <h1 className="ec-not-found__title text-2xl font-bold text-gray-900 mb-4">
          ページが見つかりません
        </h1>
        <p className="ec-not-found__message text-gray-600 mb-6">
          お探しのページは見つかりませんでした。
          <br />
          URLが間違っているか、ページが移動・削除された可能性があります。
        </p>

        {/* アクション */}
        <div className="ec-not-found__actions space-y-3">
          <Link href="/" className="block">
            <Button variant="primary" fullWidth>
              トップページへ戻る
            </Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="outline" fullWidth>
              商品一覧を見る
            </Button>
          </Link>
        </div>

        {/* ヘルプリンク */}
        <div className="ec-not-found__help mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            お困りの場合は
            <Link href="/contact" className="text-black hover:underline ml-1">
              お問い合わせ
            </Link>
            ください
          </p>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
