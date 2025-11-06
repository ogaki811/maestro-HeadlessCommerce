/**
 * ProductCodeInput Component (Molecule)
 * 商品コード入力コンポーネント（リアルタイム検索対応）
 */

import React from 'react';

export interface ProductCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
  error?: string;
  disabled?: boolean;
  onEnter?: () => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

/**
 * ProductCodeInput
 *
 * 商品コード入力フィールド（検索中インジケーター付き）
 *
 * @example
 * <ProductCodeInput
 *   value={productCode}
 *   onChange={setProductCode}
 *   isSearching={isSearching}
 *   error={error?.message}
 *   onEnter={handleAdd}
 * />
 */
export default function ProductCodeInput({
  value,
  onChange,
  isSearching,
  error,
  disabled,
  onEnter,
  placeholder = '商品コードまたはJANコードを入力',
  label = '商品コード',
  id,
}: ProductCodeInputProps) {
  const inputId = id || 'product-code-input';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter && !isSearching && !error) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          type="text"
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2.5 pr-10
            border rounded-lg
            text-base
            transition-all duration-150
            outline-none
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
            }
            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
          `}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          autoComplete="off"
        />

        {isSearching && (
          <div className="absolute right-3 flex items-center justify-center" aria-label="検索中">
            <svg
              className="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500 m-0" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
