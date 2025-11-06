/**
 * Quick Order Page
 * クイックオーダーページ
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import QuickOrderLineForm from '@/components/quick-order/QuickOrderLineForm';
import useCartStore from '@/store/useCartStore';

/**
 * クイックオーダーページ
 *
 * 商品コードを入力して素早くカートに追加
 */
export default function QuickOrderPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { addItemsBatch, fetchCart } = useCartStore();

  // パンくずリスト
  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: 'クイックオーダー', href: '/quick-order' },
  ];

  /**
   * カートに商品を追加
   */
  const handleAddToCart = async (items: Array<{ productId: string; quantity: number }>) => {
    setIsProcessing(true);

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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />

      <div className="quick-order-page">
        <div className="container">
          {/* パンくずリスト */}
          <Breadcrumb items={breadcrumbItems} />

          {/* ヘッダー */}
          <header className="page-header">
            <h1 className="page-title">クイックオーダー</h1>
            <p className="page-description">
              商品コードを入力して、商品情報を確認しながら素早くカートに追加できます。
            </p>
          </header>

          {/* メインコンテンツ */}
          <main className="page-content">
            <QuickOrderLineForm onAddToCart={handleAddToCart} />
          </main>

          {/* 使い方ガイド */}
          <aside className="help-section">
            <h3 className="help-title">💡 使い方</h3>
            <ol className="help-list">
              <li>商品コードまたはJANコードを入力してください</li>
              <li>自動的に商品情報が表示されます</li>
              <li>数量を調整して「追加」ボタンをクリック</li>
              <li>必要な商品を全て追加したら「カートに追加」をクリック</li>
            </ol>
            <p className="help-note">
              <strong>ヒント:</strong> Enterキーを押すと素早く商品を追加できます
            </p>
          </aside>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .quick-order-page {
          min-height: 100vh;
          background: #ffffff;
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .page-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .page-title {
          margin: 0 0 0.5rem;
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
        }

        .page-description {
          margin: 0;
          font-size: 1rem;
          color: #6b7280;
        }

        .page-content {
          margin-bottom: 2rem;
        }

        .help-section {
          padding: 1.5rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.75rem;
        }

        .help-title {
          margin: 0 0 1rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e40af;
        }

        .help-list {
          margin: 0 0 1rem;
          padding-left: 1.5rem;
          color: #374151;
        }

        .help-list li {
          margin-bottom: 0.5rem;
        }

        .help-note {
          margin: 0;
          padding: 0.75rem;
          background: white;
          border-left: 4px solid #3b82f6;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .help-note strong {
          color: #1e40af;
        }

        @media (max-width: 768px) {
          .quick-order-page {
            padding: 1rem 0;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-description {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
}
