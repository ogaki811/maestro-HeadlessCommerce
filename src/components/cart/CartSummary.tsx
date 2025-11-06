'use client';

import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  itemCount: number;
  onCheckout?: () => void;
}

export default function CartSummary({
  subtotal,
  shippingFee,
  discount = 0,
  total,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  const freeShippingThreshold = 3000;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="ec-cart-summary">
      {/* 金額詳細 */}
      <div className="ec-cart-summary__breakdown space-y-3 mb-6 pb-6 border-b border-gray-200">
        <div className="ec-cart-summary__item flex justify-between text-sm">
          <span className="ec-cart-summary__label text-gray-600">
            選択商品（{itemCount}点）
          </span>
          <span className="ec-cart-summary__value font-medium">
            ¥{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="ec-cart-summary__item flex justify-between text-sm">
          <span className="ec-cart-summary__label text-gray-600">送料</span>
          <span className="ec-cart-summary__value font-medium">
            {shippingFee === 0 ? (
              <span className="ec-cart-summary__free-shipping text-green-600">無料</span>
            ) : (
              `¥${shippingFee.toLocaleString()}`
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="ec-cart-summary__item ec-cart-summary__item--discount flex justify-between text-sm">
            <span className="ec-cart-summary__label text-gray-600">割引</span>
            <span className="ec-cart-summary__value font-medium text-green-600">
              -¥{discount.toLocaleString()}
            </span>
          </div>
        )}

        {remainingForFreeShipping > 0 && remainingForFreeShipping < freeShippingThreshold && (
          <p className="ec-cart-summary__shipping-note text-xs text-gray-500">
            あと¥{remainingForFreeShipping.toLocaleString()}で送料無料
          </p>
        )}
      </div>

      {/* 合計 */}
      <div className="ec-cart-summary__total flex justify-between items-center mb-6">
        <span className="ec-cart-summary__total-label text-lg font-bold">合計</span>
        <span className="ec-cart-summary__total-amount text-2xl font-bold text-black">
          ¥{total.toLocaleString()}
        </span>
      </div>

      {/* レジへ進む */}
      <Link
        href="/checkout"
        onClick={onCheckout}
        className={`ec-cart-summary__checkout-btn block w-full py-3 px-6 text-center text-white rounded-lg font-semibold transition-colors ${
          itemCount > 0
            ? 'bg-black hover:bg-gray-900'
            : 'bg-gray-300 cursor-not-allowed pointer-events-none'
        }`}
      >
        レジへ進む ({itemCount}点)
      </Link>

      <Link
        href="/products"
        className="ec-cart-summary__continue-btn block w-full mt-3 py-3 px-6 text-center border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
      >
        買い物を続ける
      </Link>
    </div>
  );
}
