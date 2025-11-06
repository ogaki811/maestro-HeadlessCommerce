'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Loading } from '@/components/ui/Loading';
import prefectures from '@/data/prefectures';

interface ShippingInfoFormProps {
  formData: {
    postalCode: string;
    prefecture: string;
    city: string;
    address: string;
    building: string;
  };
  errors: Record<string, string>;
  postalError?: string;
  postalLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPostalCodeSearch: () => void;
  className?: string;
}

export default function ShippingInfoForm({
  formData,
  errors,
  postalError,
  postalLoading,
  onChange,
  onPostalCodeSearch,
  className = '',
}: ShippingInfoFormProps) {
  const prefectureOptions = prefectures.map(pref => ({ value: pref, label: pref }));

  return (
    <div className={`ec-shipping-info-form ${className}`}>
      <div className="ec-shipping-info-form__container bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="ec-shipping-info-form__title text-xl font-semibold text-gray-900 mb-6">
          配送先情報
        </h2>

        <div className="ec-shipping-info-form__fields space-y-4">
          {/* 郵便番号検索 */}
          <div className="ec-shipping-info-form__postal">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              郵便番号 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-start">
              <div className="w-48">
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={onChange}
                  placeholder="123-4567"
                  className="w-full px-4 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 border-gray-300 focus:ring-gray-700"
                />
                {(errors.postalCode || postalError) && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode || postalError}</p>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={onPostalCodeSearch}
                disabled={postalLoading}
                className="whitespace-nowrap h-[42px]"
              >
                {postalLoading ? (
                  <>
                    <Loading size="sm" />
                    <span className="ml-2">検索中...</span>
                  </>
                ) : (
                  <>
                    <Icon name="search" size={16} className="mr-2" />
                    住所を自動入力
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="ec-shipping-info-form__address-fields grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              name="prefecture"
              value={formData.prefecture}
              onChange={onChange}
              options={[{ value: '', label: '選択してください' }, ...prefectureOptions]}
              label="都道府県"
              required
              error={errors.prefecture}
            />
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              label="市区町村"
              placeholder="渋谷区"
              required
              error={errors.city}
            />
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
              label="番地"
              placeholder="神南1-2-3"
              required
              error={errors.address}
            />
          </div>

          <Input
            type="text"
            name="building"
            value={formData.building}
            onChange={onChange}
            label="建物名・部屋番号"
            placeholder="〇〇ビル 4F"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
