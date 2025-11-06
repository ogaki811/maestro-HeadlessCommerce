import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MainBanner from '@/components/common/MainBanner';
import ProductCard from '@/components/product/ProductCard';
import ProductSlider from '@/components/home/ProductSlider';
import { sampleProducts } from '@/data/sampleProducts';

export const metadata: Metadata = {
  title: 'smartsample - オフィス用品・文具のECサイト',
  description: 'オフィス用品から文具まで、豊富な品揃えのECサイト。高品質な商品をお手頃価格で提供します。送料無料キャンペーン実施中。',
  openGraph: {
    title: 'smartsample - オフィス用品・文具のECサイト',
    description: 'オフィス用品から文具まで、豊富な品揃えのECサイト。高品質な商品をお手頃価格で提供します。',
    url: 'https://smartsample.example.com/',
    type: 'website',
  },
  twitter: {
    title: 'smartsample - オフィス用品・文具のECサイト',
    description: 'オフィス用品から文具まで、豊富な品揃えのECサイト。高品質な商品をお手頃価格で提供します。',
  },
};

export default function HomePage() {
  // おすすめ商品: 人気タグがある商品、または評価が高い商品
  const recommendedProducts = sampleProducts
    .filter(p => p.tags.includes('人気') || p.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);

  // 新着商品: 新商品タグがある商品
  const newProducts = sampleProducts
    .filter(p => p.tags.includes('新商品'))
    .slice(0, 12);

  // セール商品: セールタグがある商品
  const saleProducts = sampleProducts
    .filter(p => p.tags.includes('セール'))
    .slice(0, 12);

  return (
    <>
      {/* Structured Data - WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "smartsample",
            "url": "https://smartsample.example.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://smartsample.example.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "smartsample",
            "url": "https://smartsample.example.com",
            "logo": "https://smartsample.example.com/logo.png"
          })
        }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="ec-home flex-grow">
          {/* メインバナー（管理画面で設定・カルーセル表示） */}
          <MainBanner />

          {/* 人気カテゴリー */}
          <section className="ec-home__categories py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="ec-home__section-title text-3xl font-bold text-gray-900 mb-8 text-center">人気カテゴリー</h2>
              <div className="ec-home__category-list grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-blue-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">オフィス用品</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-green-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19l7-7 3 3-7 7-3-3z" />
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">文具</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-purple-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">電化製品</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-orange-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12v7h14v-7" />
                      <path d="M5 12l-2 0v-2c0-1 1-2 2-2h14c1 0 2 1 2 2v2l-2 0" />
                      <rect x="7" y="4" width="10" height="4" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">家具</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-red-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">収納用品</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-indigo-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">帳簿・書籍</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-pink-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">時計</h3>
                </Link>
                <Link href="/products" className="ec-home__category-item bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                  <div className="ec-home__category-icon w-10 h-10 mx-auto mb-2 flex items-center justify-center bg-yellow-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-9" />
                      <path d="M14 17H5" />
                      <circle cx="17" cy="17" r="3" />
                      <circle cx="7" cy="7" r="3" />
                    </svg>
                  </div>
                  <h3 className="ec-home__category-name text-xs font-medium text-gray-900">その他</h3>
                </Link>
              </div>
            </div>
          </section>

          {/* おすすめ商品 */}
          <section className="ec-home__recommended py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="ec-home__section-header flex justify-between items-center mb-8">
                <h2 className="ec-home__section-title text-3xl font-bold text-gray-900">おすすめ商品</h2>
                <Link href="/products" className="ec-home__view-all text-black hover:text-blue-800">すべて見る →</Link>
              </div>
              <ProductSlider products={recommendedProducts} hideTags />
            </div>
          </section>

          {/* 新着商品 */}
          {newProducts.length > 0 && (
            <section className="ec-home__new-arrivals py-12 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="ec-home__section-header flex justify-between items-center mb-8">
                  <h2 className="ec-home__section-title text-3xl font-bold text-gray-900">新着商品</h2>
                  <Link href="/search" className="ec-home__view-all text-black hover:text-blue-800">すべて見る →</Link>
                </div>
                <ProductSlider products={newProducts} hideTags />
              </div>
            </section>
          )}

          {/* セール商品 */}
          {saleProducts.length > 0 && (
            <section className="ec-home__sale py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="ec-home__section-header flex justify-between items-center mb-8">
                  <div>
                    <h2 className="ec-home__section-title text-3xl font-bold text-gray-900">セール商品</h2>
                    <p className="ec-home__sale-message text-red-600 font-semibold mt-2">期間限定！お得なプライス</p>
                  </div>
                  <Link href="/search" className="ec-home__view-all text-black hover:text-blue-800">すべて見る →</Link>
                </div>
                <ProductSlider products={saleProducts} hideTags />
              </div>
            </section>
          )}

          {/* 新着情報 */}
          <section className="ec-home__news py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="ec-home__section-title text-3xl font-bold text-gray-900 mb-8 text-center">新着情報</h2>
              <div className="ec-home__news-container bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
                <div className="ec-home__news-list space-y-4">
                  <div className="ec-home__news-item border-b border-gray-200 py-4">
                    <div className="flex items-center gap-4">
                      <span className="ec-home__news-date text-sm text-gray-500">2024.01.15</span>
                      <span className="ec-home__news-label bg-black text-white px-2 py-1 text-xs rounded">お知らせ</span>
                      <Link href="#" className="ec-home__news-link text-gray-800 hover:text-black">サイトリニューアルのお知らせ</Link>
                    </div>
                  </div>
                  <div className="ec-home__news-item border-b border-gray-200 py-4">
                    <div className="flex items-center gap-4">
                      <span className="ec-home__news-date text-sm text-gray-500">2024.01.12</span>
                      <span className="ec-home__news-label bg-orange-600 text-white px-2 py-1 text-xs rounded">キャンペーン</span>
                      <Link href="#" className="ec-home__news-link text-gray-800 hover:text-black">新春セール開催中！最大50%オフ</Link>
                    </div>
                  </div>
                  <div className="ec-home__news-item border-b border-gray-200 py-4">
                    <div className="flex items-center gap-4">
                      <span className="ec-home__news-date text-sm text-gray-500">2024.01.08</span>
                      <span className="ec-home__news-label bg-green-600 text-white px-2 py-1 text-xs rounded">商品情報</span>
                      <Link href="#" className="ec-home__news-link text-gray-800 hover:text-black">新商品「プレミアム文具セット」発売</Link>
                    </div>
                  </div>
                </div>
                <div className="ec-home__news-view-all text-center mt-6">
                  <Link href="#" className="text-black hover:text-blue-800 text-sm">すべての新着情報を見る →</Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
