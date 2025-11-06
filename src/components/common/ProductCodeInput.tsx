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
    <div className="product-code-input">
      <label htmlFor={inputId} className="product-code-input__label">
        {label}
      </label>

      <div className="product-code-input__wrapper">
        <input
          type="text"
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`product-code-input__field ${error ? 'product-code-input__field--error' : ''}`}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          autoComplete="off"
        />

        {isSearching && (
          <div className="product-code-input__loading" aria-label="検索中">
            <svg
              className="product-code-input__spinner"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="product-code-input__spinner-circle"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="product-code-input__spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="product-code-input__error" role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .product-code-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .product-code-input__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .product-code-input__wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .product-code-input__field {
          width: 100%;
          padding: 0.625rem 0.75rem;
          padding-right: 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.15s ease;
          outline: none;
        }

        .product-code-input__field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .product-code-input__field:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .product-code-input__field--error {
          border-color: #ef4444;
        }

        .product-code-input__field--error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .product-code-input__loading {
          position: absolute;
          right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-code-input__spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 1s linear infinite;
        }

        .product-code-input__spinner-circle {
          opacity: 0.25;
        }

        .product-code-input__spinner-path {
          opacity: 0.75;
        }

        .product-code-input__error {
          font-size: 0.875rem;
          color: #ef4444;
          margin: 0;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
