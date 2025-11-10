/**
 * Eco Report Page
 * 環境配慮商品購入レポートページ
 */

'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';

/**
 * 環境配慮商品購入レポートページ
 *
 * 環境配慮商品の購入状況を確認できるページ
 */
export default function EcoReportPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダー */}
          <header className="mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="m-0 mb-2 text-3xl md:text-2xl font-bold text-gray-900">
              環境配慮商品購入レポート
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              環境に配慮した商品の購入状況をレポートで確認できます。
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
