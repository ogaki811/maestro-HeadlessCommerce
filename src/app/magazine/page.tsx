/**
 * SmartWorks Magazine Page
 * スマートワークス・マガジンページ
 */

'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';

/**
 * スマートワークス・マガジンページ
 *
 * 最新のビジネス情報やトレンドを発信するマガジンページ
 */
export default function SmartWorksMagazinePage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダー */}
          <header className="mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="m-0 mb-2 text-3xl md:text-2xl font-bold text-gray-900">
              スマートワークス・マガジン
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              働き方改革やビジネスに役立つ情報をお届けします。
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
