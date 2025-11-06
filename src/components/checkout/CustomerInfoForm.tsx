'use client';

import { Input } from '@/components/ui/Input';

interface CustomerInfoFormProps {
  formData: {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function CustomerInfoForm({
  formData,
  errors,
  onChange,
  className = '',
}: CustomerInfoFormProps) {
  return (
    <div className={`ec-customer-info-form ${className}`}>
      <div className="ec-customer-info-form__container bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="ec-customer-info-form__title text-xl font-semibold text-gray-900 mb-6">
          お客様情報
        </h2>
        <div className="ec-customer-info-form__fields space-y-4">
          <div className="ec-customer-info-form__name grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              label="姓"
              placeholder="山田"
              required
              error={errors.lastName}
            />
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              label="名"
              placeholder="太郎"
              required
              error={errors.firstName}
            />
          </div>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            label="メールアドレス"
            placeholder="example@email.com"
            required
            error={errors.email}
          />
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            label="電話番号"
            placeholder="090-1234-5678"
            required
            error={errors.phone}
          />
        </div>
      </div>
    </div>
  );
}
