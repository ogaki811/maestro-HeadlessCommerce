/**
 * NumberInput Component (Atom)
 * 数値入力コンポーネント（±ボタン付き）
 */

import React from 'react';

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showStepper?: boolean;
  className?: string;
  label?: string;
  id?: string;
}

/**
 * NumberInput
 *
 * 数値入力フィールド（ステッパーボタン付き）
 *
 * @example
 * <NumberInput
 *   value={quantity}
 *   onChange={setQuantity}
 *   min={1}
 *   showStepper={true}
 *   label="数量"
 * />
 */
export default function NumberInput({
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  disabled = false,
  showStepper = true,
  className = '',
  label,
  id,
}: NumberInputProps) {
  const inputId = id || `number-input-${Math.random().toString(36).substr(2, 9)}`;

  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      // minとmax の範囲内に収める
      let clampedValue = newValue;
      if (clampedValue < min) clampedValue = min;
      if (max !== undefined && clampedValue > max) clampedValue = max;
      onChange(clampedValue);
    } else {
      // 空文字の場合はminにリセット
      onChange(min);
    }
  };

  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        {showStepper && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className="
              flex items-center justify-center
              w-8 h-10 p-0
              border-r border-gray-300
              bg-gray-50 text-gray-700
              hover:bg-gray-200 active:bg-gray-300
              disabled:text-gray-300 disabled:cursor-not-allowed
              transition-all duration-150
            "
            aria-label="減らす"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}

        <input
          type="number"
          id={inputId}
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="
            w-16 p-2
            border-none
            text-center text-base font-medium
            outline-none
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            focus:outline-2 focus:outline-blue-500 focus:outline-offset-[-2px]
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
          "
          aria-label={label || '数量'}
        />

        {showStepper && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && value >= max)}
            className="
              flex items-center justify-center
              w-8 h-10 p-0
              border-l border-gray-300
              bg-gray-50 text-gray-700
              hover:bg-gray-200 active:bg-gray-300
              disabled:text-gray-300 disabled:cursor-not-allowed
              transition-all duration-150
            "
            aria-label="増やす"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
