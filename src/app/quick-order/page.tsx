/**
 * Quick Order Page
 * クイックオーダーページ
 */

'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import QuickOrderLineForm from '@/components/quick-order/QuickOrderLineForm';
import QuickOrderHelpSection from '@/components/quick-order/QuickOrderHelpSection';
import useCartStore from '@/store/useCartStore';

/**
 * クイックオーダーページ
 *
 * 商品コードを入力して素早くカートに追加
 */
export default function QuickOrderPage() {
  const router = useRouter();
  const { fetchCart } = useCartStore();

  /**
   * カートに商品を追加
   */
  const handleAddToCart = async (items: Array<{ productId: string; quantity: number }>) => {
    try {
      const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'toc-site-a';
      const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE || 'toc';
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000';

      // 顧客ID取得
      let customerId = '';
      if (typeof window !== 'undefined') {
        const customerData = localStorage.getItem('customer');
        if (customerData) {
          try {
            const customer = JSON.parse(customerData);
            customerId = customer.id || '';
          } catch (e) {
            console.error('Failed to parse customer data:', e);
          }
        }
      }

      // カート追加API呼び出し
      const response = await fetch(`${apiEndpoint}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-site-id': siteId,
          'x-business-type': businessType,
          'x-customer-id': customerId,
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // カート状態を更新
      await fetchCart();

      // 成功メッセージ表示
      toast.success(`${items.length}商品をカートに追加しました！`, {
        duration: 3000,
        position: 'top-center',
      });

      // カートページへ遷移するか確認
      setTimeout(() => {
        if (confirm('カートページに移動しますか？')) {
          router.push('/cart');
        }
      }, 500);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('カートへの追加に失敗しました');
      throw error;
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white py-8 md:py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* パンくずリスト */}
          <Breadcrumb />

          {/* ヘッダー */}
          <header className="mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="m-0 mb-2 text-3xl md:text-2xl font-bold text-gray-900">
              クイックオーダー
            </h1>
            <p className="m-0 text-base md:text-sm text-gray-600">
              商品コードを入力して、商品情報を確認しながら素早くカートに追加できます。
            </p>
          </header>

          {/* メインコンテンツ */}
          <main className="mb-8">
            <QuickOrderLineForm onAddToCart={handleAddToCart} />
          </main>

          {/* 使い方ガイド */}
          <QuickOrderHelpSection />
        </div>
      </div>

      <Footer />
    </>
  );
}
