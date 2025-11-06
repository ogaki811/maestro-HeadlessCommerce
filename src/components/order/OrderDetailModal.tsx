'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  name: string;
  code: string;
  price: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  statusVariant: 'primary' | 'success' | 'warning' | 'danger';
  total: string;
  items: OrderItem[];
  shippingAddress?: {
    name: string;
    postalCode: string;
    address: string;
    phone: string;
  };
  subtotal?: string;
  shippingFee?: string;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // モーダルが開いているときはbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div className="ec-order-detail-modal fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="ec-order-detail-modal__overlay absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="ec-order-detail-modal__content relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="ec-order-detail-modal__header sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
          <h2 className="ec-order-detail-modal__title text-2xl font-semibold text-gray-900">
            注文詳細
          </h2>
          <button
            onClick={onClose}
            className="ec-order-detail-modal__close text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ボディ */}
        <div className="ec-order-detail-modal__body p-6 space-y-6">
          {/* 注文情報 */}
          <section className="ec-order-detail-modal__order-info">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">注文情報</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">注文番号</span>
                <span className="font-semibold text-gray-900">{order.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">注文日</span>
                <span className="font-medium text-gray-900">{order.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ステータス</span>
                <Badge variant={order.statusVariant}>{order.status}</Badge>
              </div>
            </div>
          </section>

          {/* 配送先情報 */}
          {order.shippingAddress && (
            <section className="ec-order-detail-modal__shipping">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">配送先情報</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-600">〒{order.shippingAddress.postalCode}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-sm text-gray-600">TEL: {order.shippingAddress.phone}</p>
              </div>
            </section>
          )}

          {/* 注文商品 */}
          <section className="ec-order-detail-modal__items">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">注文商品</h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="ec-order-detail-modal__item flex items-center gap-4 p-4">
                  <Link href={`/products/${item.code}`} className="flex-shrink-0">
                    <img
                      src={`/img/product/${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.code}`} className="hover:text-black transition-colors">
                      <p className="font-medium text-gray-900 mb-1">{item.name}</p>
                    </Link>
                    <p className="text-sm text-gray-600">商品コード: {item.code}</p>
                    <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">¥{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 金額サマリー */}
          <section className="ec-order-detail-modal__summary">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {order.subtotal && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">小計</span>
                  <span className="font-semibold text-gray-900">¥{order.subtotal}</span>
                </div>
              )}
              {order.shippingFee && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">配送料</span>
                  <span className="font-semibold text-gray-900">
                    {order.shippingFee === '0' ? '無料' : `¥${order.shippingFee}`}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">合計</span>
                  <span className="text-2xl font-bold text-gray-900">¥{order.total}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* フッター */}
        <div className="ec-order-detail-modal__footer sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} fullWidth>
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
