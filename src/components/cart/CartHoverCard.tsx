'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartHoverCardProps {
  items: CartItem[];
  total: number;
  shippingFee: number;
  isVisible: boolean;
  showAnimation?: boolean;
}

export default function CartHoverCard({
  items,
  total,
  shippingFee,
  isVisible,
  showAnimation = false,
}: CartHoverCardProps) {
  const subtotal = total - shippingFee;
  const isEmpty = items.length === 0;

  return (
    <div
      className={`ec-cart-hover-card absolute top-full right-0 mt-2 w-[360px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 transition-all duration-300 ${
        isVisible
          ? `opacity-100 translate-y-0 ${showAnimation ? 'animate-bounce-in' : ''}`
          : 'opacity-0 -translate-y-2 pointer-events-none scale-95'
      }`}
      style={{
        animation: isVisible && showAnimation ? 'bounceIn 0.5s ease-out' : undefined,
      }}
    >
      {isEmpty ? (
        <div className="ec-cart-hover-card__empty p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">カートに商品がありません</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            商品一覧を見る
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="ec-cart-hover-card__items max-h-[320px] overflow-y-auto p-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="ec-cart-hover-card__item flex gap-3 mb-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="ec-cart-hover-card__item-image relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="ec-cart-hover-card__item-info flex-1 min-w-0">
                  <h4 className="ec-cart-hover-card__item-name text-sm font-medium text-gray-900 mb-1 truncate">
                    {item.name}
                  </h4>
                  <div className="ec-cart-hover-card__item-details flex items-center justify-between text-sm">
                    <span className="text-gray-500">数量: {item.quantity}</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="ec-cart-hover-card__summary bg-gray-50 p-4 border-t border-gray-200">
            <div className="ec-cart-hover-card__summary-row flex justify-between text-sm mb-2">
              <span className="text-gray-600">小計</span>
              <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="ec-cart-hover-card__summary-row flex justify-between text-sm mb-3">
              <span className="text-gray-600">送料</span>
              <span className="font-medium text-gray-900">
                {shippingFee === 0 ? '無料' : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="ec-cart-hover-card__summary-row flex justify-between text-base font-bold border-t border-gray-300 pt-3 mb-4">
              <span className="text-gray-900">合計</span>
              <span className="text-primary text-lg">{formatPrice(total)}</span>
            </div>

            {/* Action Buttons */}
            <div className="ec-cart-hover-card__actions flex gap-2">
              <Link
                href="/cart"
                className="flex-1 px-4 py-2.5 text-center border border-primary text-primary rounded-lg hover:bg-primary-light transition-colors text-sm font-medium"
              >
                カートを見る
              </Link>
              <Link
                href="/checkout"
                className="flex-1 px-4 py-2.5 text-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                レジへ進む
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
