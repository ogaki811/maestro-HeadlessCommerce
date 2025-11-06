'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import FavoriteItem from '@/components/favorites/FavoriteItem';
import useFavoritesStore from '@/store/useFavoritesStore';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore();

  const handleClearAll = () => {
    if (window.confirm('すべてのお気に入りを削除しますか？')) {
      clearFavorites();
      toast.success('お気に入りをすべて削除しました');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-favorites min-h-screen bg-gray-50 py-8">
        <div className="ec-favorites__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />

          <div className="ec-favorites__layout lg:grid lg:grid-cols-4 lg:gap-8 mt-8">
            {/* サイドバー */}
            <MyPageSidebar />

            {/* メインコンテンツ */}
            <div className="ec-favorites__content lg:col-span-3 mt-8 lg:mt-0">
              <div className="ec-favorites__card bg-white rounded-lg shadow-sm p-8">
                {/* ヘッダー */}
                <div className="ec-favorites__header flex items-center justify-between mb-8 pb-2 border-b-2 border-black">
                  <div>
                    <h1 className="ec-favorites__title text-3xl font-medium text-gray-900">
                      お気に入り
                    </h1>
                  </div>
                  {favorites.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="ec-favorites__clear-btn px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      すべて削除
                    </button>
                  )}
                </div>

                {/* 件数表示 */}
                {favorites.length > 0 && (
                  <p className="ec-favorites__count text-gray-600 mb-6">
                    {favorites.length}件の商品をお気に入りに登録しています
                  </p>
                )}

                {/* コンテンツ */}
                {favorites.length === 0 ? (
                  <div className="ec-favorites__empty text-center py-12">
                    <svg
                      className="mx-auto h-24 w-24 text-gray-400 mb-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      お気に入りはまだありません
                    </h2>
                    <p className="text-gray-600 mb-8">
                      気になる商品をお気に入りに追加して、<br />
                      いつでも簡単にチェックできます
                    </p>
                    <Link
                      href="/products"
                      className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                    >
                      商品を探す
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* お気に入り商品リスト */}
                    <div className="ec-favorites__list space-y-4">
                      {favorites.map((item) => (
                        <FavoriteItem key={item.id} item={item} />
                      ))}
                    </div>

                    {/* お気に入りのヒント */}
                    <div className="ec-favorites__hint mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start">
                        <svg
                          className="w-6 h-6 text-black mr-3 mt-0.5 flex-shrink-0"
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
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">
                            お気に入り機能について
                          </h3>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• お気に入りに追加した商品は、こちらのページでいつでも確認できます</li>
                            <li>• 商品ページのハートアイコンをクリックして追加・削除できます</li>
                            <li>• お気に入りはブラウザに保存されます</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
