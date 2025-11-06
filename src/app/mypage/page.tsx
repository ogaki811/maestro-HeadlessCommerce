'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import RecommendedItem from '@/components/product/RecommendedItem';
import { Badge } from '@/components/ui/Badge';
import useAuthStore from '@/store/useAuthStore';
import { sampleProducts } from '@/data/sampleProducts';

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // リダイレクト中
  }

  // おすすめ商品データ
  const recommendedProducts = sampleProducts.slice(0, 3);

  // デモ用の注文履歴
  const recentOrders = [
    {
      id: '20240115-001',
      date: '2024年1月15日',
      status: '配送中',
      statusVariant: 'info' as const,
      total: '15,980',
      items: [
        {
          name: 'A4コピー用紙 5000枚',
          image: '/img/product/AWA4132_l1.jpg',
          quantity: 2,
        },
      ],
    },
    {
      id: '20240110-002',
      date: '2024年1月10日',
      status: '配送完了',
      statusVariant: 'success' as const,
      total: '8,500',
      items: [
        {
          name: 'オフィスチェア',
          image: '/img/product/AW75238_l1.jpg',
          quantity: 1,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-mypage min-h-screen bg-gray-50 py-8">
        <div className="ec-mypage__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />

          <div className="ec-mypage__layout lg:grid lg:grid-cols-4 lg:gap-8 mt-8">
            {/* サイドバー */}
            <MyPageSidebar />

            {/* メインコンテンツ */}
            <div className="ec-mypage__content lg:col-span-3 mt-8 lg:mt-0">
              {/* ダッシュボード */}
              <div className="ec-mypage__card bg-white rounded-lg shadow-sm p-8">
                <h2 className="ec-mypage__title text-3xl font-medium text-gray-900 mb-8 pb-2 border-b-2 border-black">
                  ダッシュボード
                </h2>

                {/* 登録情報 */}
                <section className="ec-mypage__profile-section mb-12">
                  <h3 className="ec-mypage__section-title text-xl font-semibold text-gray-900 mb-6">
                    登録情報
                  </h3>
                  <div className="ec-mypage__profile-card bg-gray-50 rounded-lg p-6">
                    <div className="ec-mypage__profile-grid grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">お名前</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user?.name || '未設定'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">メールアドレス</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user?.email || '未設定'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">電話番号</p>
                        <p className="text-lg font-medium text-gray-900">090-1234-5678</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">会員ランク</p>
                        <p className="text-lg font-medium text-black">ゴールド会員</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">保有ポイント</p>
                        <p className="text-lg font-medium text-green-600">2,500 ポイント</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">登録日</p>
                        <p className="text-lg font-medium text-gray-900">2023年4月15日</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 最近の注文 */}
                <section className="ec-mypage__orders-section mb-12">
                  <div className="ec-mypage__section-header flex justify-between items-center mb-6">
                    <h3 className="ec-mypage__section-title text-xl font-semibold text-gray-900">
                      最近の注文
                    </h3>
                    <Link
                      href="/mypage/orders"
                      className="ec-mypage__view-all text-black hover:text-blue-800 text-sm"
                    >
                      すべて見る →
                    </Link>
                  </div>
                  <div className="ec-mypage__orders-list space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="ec-mypage__order-card border border-gray-200 rounded-lg p-6"
                      >
                        <div className="ec-mypage__order-header flex justify-between items-start mb-4">
                          <div className="ec-mypage__order-info">
                            <p className="ec-mypage__order-number font-semibold text-gray-900">
                              注文番号: {order.id}
                            </p>
                            <p className="ec-mypage__order-date text-sm text-gray-600">
                              {order.date}
                            </p>
                          </div>
                          <Badge variant={order.statusVariant}>{order.status}</Badge>
                        </div>
                        <div className="ec-mypage__order-details flex items-center space-x-4">
                          <img
                            src={order.items[0].image}
                            alt={order.items[0].name}
                            className="ec-mypage__order-image w-20 h-20 object-cover rounded"
                          />
                          <div className="ec-mypage__order-product flex-1">
                            <p className="ec-mypage__product-name text-gray-900">
                              {order.items[0].name}
                            </p>
                            <p className="ec-mypage__product-quantity text-sm text-gray-600">
                              数量: {order.items[0].quantity}
                            </p>
                          </div>
                          <div className="ec-mypage__order-price text-right">
                            <p className="ec-mypage__price-amount text-lg font-bold text-gray-900">
                              ¥{order.total}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* おすすめ商品 */}
                <section className="ec-mypage__recommended-section">
                  <h3 className="ec-mypage__section-title text-xl font-semibold text-gray-900 mb-6">
                    おすすめ商品
                  </h3>
                  <div className="ec-mypage__recommended-list space-y-4">
                    {recommendedProducts.map((product) => (
                      <RecommendedItem key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
