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
import QuickOrderMultiLineForm from '@/components/quick-order/QuickOrderMultiLineForm';
import QuickOrderHelpSection from '@/components/quick-order/QuickOrderHelpSection';
import useCartStore from '@/store/useCartStore';
import { sampleProducts } from '@/data/sampleProducts';

/**
 * クイックオーダーページ
 *
 * 商品コードを入力して素早くカートに追加
 */
export default function QuickOrderPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  /**
   * カートに商品を追加
   */
  const handleAddToCart = async (items: Array<{ productId: string; quantity: number }>) => {
    try {
      // 商品コードから実際の商品データを取得
      const productsToAdd = items
        .map((item) => {
          // productIdは実際には商品コード（code）
          const product = sampleProducts.find(
            (p) => p.code.toUpperCase() === item.productId.toUpperCase()
          );

          if (!product) {
            console.warn(`Product not found: ${item.productId}`);
            return null;
          }

          return {
            ...product,
            quantity: item.quantity,
          };
        })
        .filter((p) => p !== null);

      // 商品が1つも見つからなかった場合
      if (productsToAdd.length === 0) {
        toast.error('有効な商品が見つかりませんでした');
        return;
      }

      // カートに追加
      productsToAdd.forEach((product) => {
        addItem(product);
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

      <main className="min-h-screen bg-white">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="mb-8">
            <QuickOrderMultiLineForm onAddToCart={handleAddToCart} />
          </div>

          {/* 使い方ガイド */}
          <QuickOrderHelpSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
