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
    <div className={`number-input ${className}`}>
      {label && (
        <label htmlFor={inputId} className="number-input__label">
          {label}
        </label>
      )}

      <div className="number-input__wrapper">
        {showStepper && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className="number-input__stepper number-input__stepper--decrement"
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
          className="number-input__field"
          aria-label={label || '数量'}
        />

        {showStepper && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && value >= max)}
            className="number-input__stepper number-input__stepper--increment"
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

      <style jsx>{`
        .number-input {
          display: inline-flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .number-input__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .number-input__wrapper {
          display: inline-flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
        }

        .number-input__field {
          width: 4rem;
          padding: 0.5rem;
          border: none;
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          -moz-appearance: textfield;
        }

        .number-input__field::-webkit-outer-spin-button,
        .number-input__field::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .number-input__field:focus {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }

        .number-input__field:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .number-input__stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2.5rem;
          padding: 0;
          border: none;
          background: #f9fafb;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .number-input__stepper:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .number-input__stepper:active:not(:disabled) {
          background: #d1d5db;
        }

        .number-input__stepper:disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }

        .number-input__stepper--decrement {
          border-right: 1px solid #d1d5db;
        }

        .number-input__stepper--increment {
          border-left: 1px solid #d1d5db;
        }
      `}</style>
    </div>
  );
}
