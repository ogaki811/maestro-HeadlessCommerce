'use client';

import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import StepIndicator from '@/components/common/StepIndicator';
import Modal from '@/components/common/Modal';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import ProductSlider from '@/components/home/ProductSlider';
import useCartStore from '@/store/useCartStore';
import { sampleProducts } from '@/data/sampleProducts';
import type { CartItem as CartItemType } from '@/types';
import { calculateShippingFee } from '@/utils';
import { cartApi } from '@/lib/api-client';

/**
 * Cart Page (Client Component)
 * カートページ（クライアントコンポーネント）
 *
 * ヘッドレスコマース設計:
 * - マウント時にComposer APIからカート取得
 * - カート操作時にAPIと同期
 * - ローカルストアはUIの即時反映用
 */

export default function CartPage() {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'single' | 'bulk' | null; itemId: string | null }>({
    isOpen: false,
    type: null,
    itemId: null,
  });

  const {
    items,
    selectedItems,
    recentlyDeleted,
    toggleSelectItem,
    toggleSelectAll,
    updateQuantity,
    removeItem,
    removeSelectedItems,
    restoreItem,
    getSelectedTotal,
    getSelectedItemCount,
    addDemoData,
  } = useCartStore();

  // Composer APIからカートデータ取得
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await cartApi.getCart();
        // Composer APIから取得したデータでローカルストアを同期
        // 現在はローカルストアが優先（フォールバック）
        console.log('Cart data from Composer API:', cartData);
      } catch (error) {
        console.error('Failed to fetch cart from Composer API, using local store:', error);
        // フォールバック: ローカルストアを使用（既存の動作）
      }
    };
    fetchCart();
  }, []);

  const selectedTotal = getSelectedTotal();
  const selectedItemCount = getSelectedItemCount();
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const shippingFee = calculateShippingFee(selectedTotal);
  const finalTotal = selectedTotal + shippingFee;

  // おすすめ商品の計算
  const recommendedProducts = useMemo(() => {
    if (items.length === 0) {
      return sampleProducts.slice(0, 12);
    }

    const cartItemIds = items.map((item) => item.id);
    const availableProducts = sampleProducts.filter(
      (product) => !cartItemIds.includes(product.id)
    );

    const cartCategories = items.map((item) => item.category).filter(Boolean);
    const relatedProducts = availableProducts.filter(
      (product) => product.category && cartCategories.includes(product.category)
    );

    if (relatedProducts.length < 12) {
      const otherProducts = availableProducts.filter(
        (product) => !relatedProducts.includes(product)
      );
      return [...relatedProducts, ...otherProducts].slice(0, 12);
    }

    return relatedProducts.slice(0, 12);
  }, [items]);

  const handleRemove = (productId: string) => {
    setDeleteModal({ isOpen: true, type: 'single', itemId: productId });
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length > 0) {
      setDeleteModal({ isOpen: true, type: 'bulk', itemId: null });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'single' && deleteModal.itemId) {
      const item = items.find((i) => i.id === deleteModal.itemId);
      removeItem(deleteModal.itemId);
      if (item) {
        toast.success(`${item.name}をカートから削除しました`);
      }
    } else if (deleteModal.type === 'bulk') {
      removeSelectedItems();
      toast.success(`${selectedItems.length}個の商品をカートから削除しました`);
    }
    setDeleteModal({ isOpen: false, type: null, itemId: null });
  };

  const handleRestoreItem = (item: CartItemType) => {
    restoreItem(item);
    toast.success(`${item.name}を復元しました`);
  };

  const handleAddDemoData = () => {
    addDemoData();
    toast.success('デモデータを追加しました');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />

            {/* デモデータ追加バナー */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    カートが空です
                  </h3>
                  <p className="text-sm text-gray-900">
                    デモデータを追加して、カート機能をお試しください
                  </p>
                </div>
                <button
                  onClick={handleAddDemoData}
                  className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
                >
                  デモデータを追加
                </button>
              </div>
            </div>

            <EmptyCart />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-cart flex-grow">
        <Breadcrumb />
        <StepIndicator currentStep={1} />

        <section className="ec-cart__content py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* カート商品リスト */}
              <div className="ec-cart__items lg:col-span-2 space-y-4">
                {/* 全選択と削除ボタン */}
                <div className="ec-cart__select-all bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <label className="ec-cart__select-all-label flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => toggleSelectAll()}
                      className="ec-cart__select-all-checkbox w-5 h-5 text-black border-gray-300 rounded focus:ring-gray-700"
                    />
                    <span className="ml-3 font-medium">すべて選択</span>
                  </label>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleRemoveSelected}
                      className="ec-cart__remove-selected-btn flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      選択商品を削除
                    </button>
                  )}
                </div>

                {/* 最近削除した商品の復元 */}
                {recentlyDeleted.length > 0 && (
                  <div className="ec-cart__restore bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                          <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
                          <path d="M3 21v-5h5" />
                        </svg>
                        <span>{recentlyDeleted[0].name}を削除しました</span>
                      </div>
                      <button
                        onClick={() => handleRestoreItem(recentlyDeleted[0])}
                        className="text-sm font-medium text-black hover:text-blue-800 hover:underline"
                      >
                        元に戻す
                      </button>
                    </div>
                  </div>
                )}

                {/* カート商品 */}
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onToggleSelect={toggleSelectItem}
                    onUpdateQuantity={updateQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* 注文サマリー */}
              <div className="ec-cart__sidebar lg:col-span-1 mt-8 lg:mt-0">
                <div className="ec-cart__sidebar-content bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h2 className="ec-cart__sidebar-title text-xl font-semibold text-gray-900 mb-6">ご注文内容</h2>

                  {/* カートサマリー（金額） */}
                  <CartSummary
                    subtotal={selectedTotal}
                    shippingFee={shippingFee}
                    total={finalTotal}
                    itemCount={selectedItemCount}
                  />
                </div>
              </div>
            </div>

            {/* おすすめ商品スライダー */}
            {recommendedProducts.length > 0 && (
              <div className="ec-cart__recommended mt-12">
                <h2 className="ec-cart__recommended-title text-3xl font-bold text-gray-900 mb-8">こちらもおすすめ</h2>
                <ProductSlider products={recommendedProducts} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* 削除確認モーダル */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, itemId: null })}
        onConfirm={confirmDelete}
        title="商品の削除"
        message={
          deleteModal.type === 'single'
            ? 'この商品をカートから削除しますか？'
            : `選択した${selectedItems.length}個の商品をカートから削除しますか？`
        }
        confirmText="削除する"
        cancelText="キャンセル"
        confirmVariant="danger"
      />
    </div>
  );
}
