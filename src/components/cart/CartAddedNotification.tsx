'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils';
import type { CartItem } from '@/types';

interface CartAddedNotificationProps {
  item: CartItem | null;
  isVisible: boolean;
  onClose?: () => void;
}

export default function CartAddedNotification({
  item,
  isVisible,
  onClose,
}: CartAddedNotificationProps) {
  if (!item) return null;

  return (
    <div
      className={`ec-cart-added-notification fixed bottom-4 right-4 w-[360px] bg-white rounded-lg shadow-2xl border-2 border-green-500 overflow-hidden z-50 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-[400px] pointer-events-none'
      }`}
      style={{
        animation: isVisible ? 'slideInRight 0.3s ease-out' : undefined,
      }}
    >
      {/* 成功ヘッダー */}
      <div className="ec-cart-added-notification__header bg-green-500 text-white px-4 py-2 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="font-semibold text-sm">カートに追加しました</span>
      </div>

      {/* 商品情報 */}
      <div className="ec-cart-added-notification__content p-4">
        <div className="flex gap-3 mb-4">
          {/* 商品画像 */}
          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded border border-gray-200">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded"
            />
          </div>

          {/* 商品詳細 */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
              {item.name}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-green-600">
                {formatPrice(item.price)}
              </span>
              <span className="text-xs text-gray-500">× {item.quantity}</span>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-center text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            買い物を続ける
          </button>
          <Link
            href="/cart"
            className="flex-1 px-3 py-2 text-center text-sm bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            カートを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
