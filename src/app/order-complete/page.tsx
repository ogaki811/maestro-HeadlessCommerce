'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function OrderCompletePage() {
  // 実際の実装では、注文情報をクエリパラメータやstateから取得
  const orderNumber = `ORD-${Date.now()}`;
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
            {/* 成功アイコン */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* メッセージ */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ご注文ありがとうございます
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              ご注文を承りました。<br />
              確認メールをお送りしましたので、ご確認ください。
            </p>

            {/* 注文情報 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">注文番号</span>
                  <span className="font-bold text-gray-900">{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">お届け予定日</span>
                  <span className="font-medium text-gray-900">{estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* 次のステップ */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                今後の流れ
              </h2>
              <div className="text-left space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-black font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">確認メール送信</p>
                    <p className="text-sm text-gray-600">
                      ご登録のメールアドレスに注文確認メールをお送りします。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-black font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">商品の準備</p>
                    <p className="text-sm text-gray-600">
                      倉庫で商品をピッキング・梱包いたします。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-black font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">発送通知</p>
                    <p className="text-sm text-gray-600">
                      商品が発送されましたら、追跡番号をメールでお知らせします。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-black font-semibold">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">お届け</p>
                    <p className="text-sm text-gray-600">
                      ご指定の住所へ商品をお届けします。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Link
                href="/mypage"
                className="block w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                注文履歴を確認
              </Link>
              <Link
                href="/products"
                className="block w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                買い物を続ける
              </Link>
              <Link
                href="/"
                className="block text-black hover:underline"
              >
                トップページへ戻る
              </Link>
            </div>
          </div>

          {/* サポート情報 */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              ご不明な点がございましたら、
              <Link href="/contact" className="text-black hover:underline">
                お問い合わせ
              </Link>
              ください。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
