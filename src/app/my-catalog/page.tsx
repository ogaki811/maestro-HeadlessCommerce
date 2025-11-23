/**
 * マイカタログ・フォルダ名一覧ページ
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import CatalogFolderColumn from '@/components/my-catalog/CatalogFolderColumn';
import { companyFolders, departmentFolders, personalFolders } from '@/data/sampleCatalogData';

export default function MyCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 中止品の件数（モック）
  const discontinuedCount = 309;

  // スクロール位置の監視
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const columnWidth = container.querySelector('.min-w-\\[85vw\\]')?.clientWidth || 0;
      const gap = 16; // gap-4 = 1rem = 16px

      // 現在表示されているカラムのインデックスを計算
      const index = Math.round(scrollPosition / (columnWidth + gap));
      setCurrentScrollIndex(Math.min(Math.max(index, 0), 2));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-my-catalog min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* サイドバー */}
            <div className="lg:col-span-1">
              <MyPageSidebar />
            </div>

            {/* メインコンテンツ */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* ページタイトル */}
                <h1 className="ec-my-catalog__title text-3xl font-medium text-gray-900 mb-8 pb-2 border-b-2 border-black">
                  マイカタログ
                </h1>

                {/* 通知 */}
                <div className="ec-my-catalog__notice mb-6">
                  <p className="text-red-600 font-medium text-sm">
                    ・中止品が{discontinuedCount}件ございます。
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    ・選択したいフォルダのアイコンをクリックしてください。
                  </p>
                </div>

                {/* 検索とアクションボタン */}
                <div className="ec-my-catalog__actions flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-8">
                  {/* 検索ボックス */}
                  <div className="ec-my-catalog__search flex items-center w-full lg:max-w-md">
                    <input
                      type="text"
                      placeholder="商品名や商品コードで検索"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* アクションボタン */}
                  <div className="ec-my-catalog__buttons flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      className="px-3 sm:px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
                    >
                      ダウンロード
                    </button>
                    <button
                      type="button"
                      className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      フォルダ名・順序変更
                    </button>
                  </div>
                </div>

                {/* モバイル用横スクロールフォルダ一覧 */}
                <div className="ec-my-catalog__mobile-scroll lg:hidden">
                  {/* 横スクロールコンテナ */}
                  <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-8 px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: { display: 'none' } }}
                  >
                    <div className="flex gap-4 pb-4">
                      {/* 企業共通フォルダ */}
                      <div className="min-w-[85vw] snap-start">
                        <CatalogFolderColumn
                          type="company"
                          folders={companyFolders}
                        />
                      </div>

                      {/* 部署共通フォルダ */}
                      <div className="min-w-[85vw] snap-start">
                        <CatalogFolderColumn
                          type="department"
                          folders={departmentFolders}
                        />
                      </div>

                      {/* マイフォルダ */}
                      <div className="min-w-[85vw] snap-start">
                        <CatalogFolderColumn
                          type="personal"
                          folders={personalFolders}
                        />
                      </div>
                    </div>
                  </div>

                  {/* スクロールインジケーター */}
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentScrollIndex === 0 ? 'w-8 bg-black' : 'w-2 bg-gray-400 hover:w-8 hover:bg-black'
                      }`}
                      aria-label="企業共通フォルダへスクロール"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          const columnWidth = scrollContainerRef.current.querySelector('.min-w-\\[85vw\\]')?.clientWidth || 0;
                          const gap = 16; // gap-4 = 1rem = 16px
                          scrollContainerRef.current.scrollTo({ left: columnWidth + gap, behavior: 'smooth' });
                        }
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentScrollIndex === 1 ? 'w-8 bg-black' : 'w-2 bg-gray-400 hover:w-8 hover:bg-black'
                      }`}
                      aria-label="部署共通フォルダへスクロール"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          const columnWidth = scrollContainerRef.current.querySelector('.min-w-\\[85vw\\]')?.clientWidth || 0;
                          const gap = 16; // gap-4 = 1rem = 16px
                          scrollContainerRef.current.scrollTo({ left: (columnWidth + gap) * 2, behavior: 'smooth' });
                        }
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentScrollIndex === 2 ? 'w-8 bg-black' : 'w-2 bg-gray-400 hover:w-8 hover:bg-black'
                      }`}
                      aria-label="マイフォルダへスクロール"
                    />
                  </div>
                </div>

                {/* デスクトップ用3カラムフォルダ一覧 */}
                <div className="ec-my-catalog__folders hidden lg:grid lg:grid-cols-3 gap-6">
                  {/* 企業共通フォルダ */}
                  <CatalogFolderColumn
                    type="company"
                    folders={companyFolders}
                  />

                  {/* 部署共通フォルダ */}
                  <CatalogFolderColumn
                    type="department"
                    folders={departmentFolders}
                  />

                  {/* マイフォルダ */}
                  <CatalogFolderColumn
                    type="personal"
                    folders={personalFolders}
                  />
                </div>

                {/* 使い方のヒント */}
                <div className="ec-my-catalog__hint mt-8 bg-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-black mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        マイカタログについて
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>・企業共通フォルダは全社で共有されます</li>
                        <li>・部署共通フォルダは所属部署内で共有されます</li>
                        <li>・マイフォルダは個人専用のフォルダです</li>
                        <li>・フォルダをクリックすると商品一覧が表示されます</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
