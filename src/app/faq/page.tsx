/**
 * FAQ Page
 * よくある質問ページ
 */

'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';

/**
 * よくある質問ページ
 *
 * お客様からよく寄せられる質問と回答を掲載するページ
 */
export default function FaqPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダー */}
          <header className="mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="m-0 mb-2 text-3xl md:text-2xl font-bold text-gray-900">
              よくある質問
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              お客様からよく寄せられる質問とその回答をご覧いただけます。
            </p>
          </header>

          {/* メインコンテンツ */}
          <div className="mb-8">
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-lg text-gray-600">このページは準備中です</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
