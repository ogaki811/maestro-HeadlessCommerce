'use client';

import { Icon } from '@/components/ui/Icon';

type PaymentMethod = 'credit' | 'bank' | 'cod' | 'paypay';

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  icon: 'creditCard' | 'bank' | 'package';
}

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const paymentOptions: PaymentOption[] = [
  { value: 'credit', label: 'クレジットカード', icon: 'creditCard' },
  { value: 'bank', label: '銀行振込', icon: 'bank' },
  { value: 'cod', label: '代金引換', icon: 'package' },
  { value: 'paypay', label: 'PayPay', icon: 'creditCard' },
];

export default function PaymentMethodSelector({
  value,
  onChange,
  className = '',
}: PaymentMethodSelectorProps) {
  return (
    <div className={`ec-payment-method-selector ${className}`}>
      <div className="ec-payment-method-selector__container bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="ec-payment-method-selector__title text-xl font-semibold text-gray-900 mb-6">
          お支払い方法
        </h2>
        <div className="ec-payment-method-selector__options space-y-3">
          {paymentOptions.map((option) => (
            <label
              key={option.value}
              className={`ec-payment-method-selector__option ${
                value === option.value ? 'ec-payment-method-selector__option--selected' : ''
              } flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                value === option.value
                  ? 'border-black bg-blue-50'
                  : 'border-gray-200 hover:border-black'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="ec-payment-method-selector__radio w-4 h-4 text-black border-gray-300 focus:ring-gray-700"
              />
              <span className="ec-payment-method-selector__label ml-3 flex items-center gap-2">
                <Icon name={option.icon} size="lg" />
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
