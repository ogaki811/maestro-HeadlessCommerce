'use client';

import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';

interface DeliveryDateSelectorProps {
  deliveryDate: string;
  deliveryTime: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
}

const deliveryTimeOptions = [
  { value: '', label: '指定なし' },
  { value: 'morning', label: '午前中' },
  { value: '12-14', label: '12:00-14:00' },
  { value: '14-16', label: '14:00-16:00' },
  { value: '16-18', label: '16:00-18:00' },
  { value: '18-20', label: '18:00-20:00' },
  { value: '19-21', label: '19:00-21:00' },
];

export default function DeliveryDateSelector({
  deliveryDate,
  deliveryTime,
  onChange,
  className = '',
}: DeliveryDateSelectorProps) {
  // 3日後から指定可能
  const minDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  return (
    <div className={`ec-delivery-date-selector ${className}`}>
      <div className="ec-delivery-date-selector__container bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="ec-delivery-date-selector__title text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="truck" size="md" />
          配送日時指定
        </h2>
        <div className="ec-delivery-date-selector__fields grid grid-cols-2 gap-4">
          <div className="ec-delivery-date-selector__date">
            <label
              htmlFor="deliveryDate"
              className="ec-delivery-date-selector__date-label block mb-2 font-medium text-gray-700 text-sm"
            >
              配送希望日
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={deliveryDate}
              onChange={onChange}
              min={minDate}
              className="ec-delivery-date-selector__date-input w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-white focus:outline-none focus:border-black focus:shadow-lg focus:shadow-blue-100"
            />
          </div>
          <Select
            name="deliveryTime"
            value={deliveryTime}
            onChange={onChange}
            options={deliveryTimeOptions}
            label="配送時間帯"
            className="ec-delivery-date-selector__time"
          />
        </div>
      </div>
    </div>
  );
}
