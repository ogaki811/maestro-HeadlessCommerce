'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { CartItem } from '@/types';

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  pointsUsed?: number;
  total: number;
  onSubmit: () => void;
  className?: string;
}

export default function CheckoutSummary({
  items,
  subtotal,
  shippingFee,
  pointsUsed = 0,
  total,
  onSubmit,
  className = '',
}: CheckoutSummaryProps) {
  return (
    <div className={`ec-checkout-summary ${className}`}>
      <div className="ec-checkout-summary__container bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
        <h2 className="ec-checkout-summary__title text-xl font-semibold text-gray-900 mb-6">
          ご注文確認
        </h2>

        {/* 商品リスト */}
        <div className="ec-checkout-summary__items space-y-4 mb-6 pb-6 border-b border-gray-200">
          {items.map((item) => (
            <div key={item.id} className="ec-checkout-summary__item flex items-center gap-3">
              <Link href={`/products/${item.id}`} className="ec-checkout-summary__item-image-link flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="ec-checkout-summary__item-image w-16 h-16 object-cover rounded hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="ec-checkout-summary__item-info flex-1">
                <Link href={`/products/${item.id}`} className="ec-checkout-summary__item-name-link hover:text-black transition-colors">
                  <p className="ec-checkout-summary__item-name text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                </Link>
                <p className="ec-checkout-summary__item-quantity text-xs text-gray-500">
                  数量: {item.quantity}
                </p>
              </div>
              <p className="ec-checkout-summary__item-price text-sm font-bold text-gray-900">
                ¥{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* 金額サマリー */}
        <div className="ec-checkout-summary__breakdown space-y-3 mb-6">
          <div className="ec-checkout-summary__subtotal flex justify-between text-gray-700">
            <span>小計</span>
            <span className="font-semibold">¥{subtotal.toLocaleString()}</span>
          </div>
          <div className="ec-checkout-summary__shipping flex justify-between text-gray-700">
            <span>配送料</span>
            <span className="font-semibold">
              {shippingFee === 0 ? '無料' : `¥${shippingFee.toLocaleString()}`}
            </span>
          </div>
          {pointsUsed > 0 && (
            <div className="ec-checkout-summary__points flex justify-between text-green-600">
              <span>ポイント利用</span>
              <span className="font-semibold">-¥{pointsUsed.toLocaleString()}</span>
            </div>
          )}
          <div className="ec-checkout-summary__total border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>合計</span>
              <span className="ec-checkout-summary__total-amount text-2xl text-black">
                ¥{total.toLocaleString()}
              </span>
            </div>
            <p className="ec-checkout-summary__tax-note text-xs text-gray-500 mt-1">（税込）</p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          onClick={onSubmit}
          className="ec-checkout-summary__submit-btn text-lg py-4"
        >
          注文を確定する
        </Button>

        <Link
          href="/cart"
          className="ec-checkout-summary__back-btn block w-full mt-3 py-3 px-6 text-center border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
        >
          カートに戻る
        </Link>

        <p className="ec-checkout-summary__note text-xs text-gray-500 mt-4 text-center">
          ※注文確定後、確認メールをお送りします
        </p>
      </div>
    </div>
  );
}
