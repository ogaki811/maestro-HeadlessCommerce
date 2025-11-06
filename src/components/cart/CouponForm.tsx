'use client';

import { useState } from 'react';
import type { Coupon } from '@/types';

interface CouponFormProps {
  appliedCoupon?: Coupon | null;
  availableCoupons?: string[];
  onApply: (code: string) => void;
  onRemove: () => void;
}

export default function CouponForm({
  appliedCoupon,
  availableCoupons = [],
  onApply,
  onRemove,
}: CouponFormProps) {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (couponCode.trim()) {
      onApply(couponCode.trim());
      setCouponCode('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <div className="ec-coupon-form mb-6 pb-6 border-b border-gray-200">
      <label className="ec-coupon-form__label block text-sm font-medium mb-2">
        クーポンコード
      </label>

      {appliedCoupon ? (
        <div className="ec-coupon-form__applied flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="ec-coupon-form__info">
            <p className="ec-coupon-form__code text-sm font-medium text-green-800">
              {appliedCoupon.code}
            </p>
            <p className="ec-coupon-form__description text-xs text-green-600">
              {appliedCoupon.description}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="ec-coupon-form__remove text-red-600 hover:text-red-700 transition-colors"
            aria-label="クーポンを削除"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div className="ec-coupon-form__input-group flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="クーポンコード"
              className="ec-coupon-form__input flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
            />
            <button
              onClick={handleApply}
              disabled={!couponCode.trim()}
              className="ec-coupon-form__apply-btn px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              適用
            </button>
          </div>
          {availableCoupons.length > 0 && (
            <p className="ec-coupon-form__hint text-xs text-gray-500 mt-2">
              利用可能クーポン: {availableCoupons.join(', ')}
            </p>
          )}
        </>
      )}
    </div>
  );
}
