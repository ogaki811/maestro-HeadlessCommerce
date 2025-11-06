'use client';

import { useState, useEffect } from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  max?: number;
  className?: string;
}

export default function QuantitySelector({
  value,
  onChange,
  max = 99,
  className = '',
}: QuantitySelectorProps) {
  const [isCustomInput, setIsCustomInput] = useState(value >= 10);
  const [inputValue, setInputValue] = useState(value.toString());

  // value が外部から変更された時の同期
  useEffect(() => {
    setInputValue(value.toString());
    if (value >= 10) {
      setIsCustomInput(true);
    }
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === '10+') {
      setIsCustomInput(true);
      setInputValue('10');
      onChange(10);
    } else {
      const quantity = parseInt(selectedValue, 10);
      setInputValue(selectedValue);
      onChange(quantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const quantity = parseInt(newValue, 10);
    if (!isNaN(quantity) && quantity >= 1 && quantity <= max) {
      onChange(quantity);
    }
  };

  const handleInputBlur = () => {
    const quantity = parseInt(inputValue, 10);

    if (isNaN(quantity) || quantity < 1) {
      setInputValue('1');
      onChange(1);
    } else if (quantity > max) {
      setInputValue(max.toString());
      onChange(max);
    }
  };

  const handleBackToSelect = () => {
    setIsCustomInput(false);
    setInputValue('9');
    onChange(9);
  };

  return (
    <div className={`ec-quantity-selector ${className}`}>
      {isCustomInput ? (
        <div className="flex items-center gap-2">
          <input
            data-testid="item-quantity"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min="1"
            max={max}
            className="w-24"
          />
          <button
            type="button"
            onClick={handleBackToSelect}
            className="h-[42px] px-3 text-sm bg-gray-600 text-white hover:bg-gray-700 rounded-md transition-colors whitespace-nowrap"
          >
            選択に戻る
          </button>
        </div>
      ) : (
        <select
          data-testid="item-quantity"
          value={value <= 9 ? value.toString() : '10+'}
          onChange={handleSelectChange}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
          <option value="10+">10+</option>
        </select>
      )}
    </div>
  );
}
