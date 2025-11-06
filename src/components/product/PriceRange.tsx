'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

interface PriceRangeProps {
  minPrice?: number;
  maxPrice?: number;
  onApply: (min?: number, max?: number) => void;
  className?: string;
}

export default function PriceRange({
  minPrice,
  maxPrice,
  onApply,
  className = '',
}: PriceRangeProps) {
  const [min, setMin] = useState<string>(minPrice?.toString() || '');
  const [max, setMax] = useState<string>(maxPrice?.toString() || '');

  useEffect(() => {
    setMin(minPrice?.toString() || '');
    setMax(maxPrice?.toString() || '');
  }, [minPrice, maxPrice]);

  const handleApply = () => {
    const minValue = min ? parseInt(min) : undefined;
    const maxValue = max ? parseInt(max) : undefined;

    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      alert('最小価格は最大価格以下にしてください');
      return;
    }

    onApply(minValue, maxValue);
  };

  const handleClear = () => {
    setMin('');
    setMax('');
    onApply(undefined, undefined);
  };

  return (
    <div className={`ec-price-range ${className}`}>
      <label className="ec-price-range__label block text-sm font-medium text-gray-700 mb-3">
        価格帯
      </label>
      <div className="ec-price-range__inputs flex items-center gap-2 mb-3">
        <Input
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          placeholder="最小"
          min="0"
          className="ec-price-range__min"
        />
        <span className="ec-price-range__separator text-gray-500">〜</span>
        <Input
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          placeholder="最大"
          min="0"
          className="ec-price-range__max"
        />
      </div>
      <div className="ec-price-range__actions flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="ec-price-range__apply flex-1 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          適用
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="ec-price-range__clear px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          クリア
        </button>
      </div>
    </div>
  );
}
