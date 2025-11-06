/**
 * ProductPreview Component (Molecule)
 * 商品プレビュー表示コンポーネント
 */

import React from 'react';
import Image from 'next/image';
import type { ProductSearchResult, ProductSearchError } from '@/hooks/useProductSearch';

export interface ProductPreviewProps {
  product: ProductSearchResult | null;
  error: ProductSearchError | null;
  isSearching: boolean;
}

/**
 * ProductPreview
 *
 * 商品検索結果のプレビュー表示
 *
 * @example
 * <ProductPreview
 *   product={result}
 *   error={error}
 *   isSearching={isSearching}
 * />
 */
export default function ProductPreview({ product, error, isSearching }: ProductPreviewProps) {
  // 検索中
  if (isSearching) {
    return (
      <div className="product-preview product-preview--loading">
        <div className="product-preview__spinner">
          <svg
            className="spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="spinner-path"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="product-preview__message">検索中...</p>

        <style jsx>{`
          .product-preview {
            padding: 1.5rem;
            border: 2px dashed #d1d5db;
            border-radius: 0.75rem;
            background: #f9fafb;
          }

          .product-preview--loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .product-preview__spinner {
            width: 2.5rem;
            height: 2.5rem;
            color: #3b82f6;
          }

          .spinner {
            width: 100%;
            height: 100%;
            animation: spin 1s linear infinite;
          }

          .spinner-circle {
            opacity: 0.25;
          }

          .spinner-path {
            opacity: 0.75;
          }

          .product-preview__message {
            margin: 0;
            font-size: 0.875rem;
            color: #6b7280;
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

  // エラー（商品が見つからない）
  if (error && !product) {
    return (
      <div className="product-preview product-preview--error">
        <span className="product-preview__icon product-preview__icon--error">❌</span>
        <p className="product-preview__message product-preview__message--error">{error.message}</p>

        <style jsx>{`
          .product-preview {
            padding: 1.5rem;
            border: 2px dashed #d1d5db;
            border-radius: 0.75rem;
          }

          .product-preview--error {
            background: #fef2f2;
            border-color: #fca5a5;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .product-preview__icon {
            font-size: 2rem;
          }

          .product-preview__message--error {
            margin: 0;
            font-size: 0.875rem;
            color: #dc2626;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  // 成功（商品が見つかった）
  if (product) {
    return (
      <div className="product-preview product-preview--success">
        <span className="product-preview__icon product-preview__icon--success">✅</span>

        <div className="product-preview__content">
          <div className="product-preview__image">
            <Image src={product.imageUrl} alt={product.name} width={120} height={120} />
          </div>

          <div className="product-preview__details">
            <h3 className="product-preview__name">{product.name}</h3>
            <p className="product-preview__code">商品コード: {product.code}</p>
            <p className="product-preview__price">
              ¥{product.price.toLocaleString()}
              <span className="product-preview__price-tax">
                （税込 ¥{product.priceWithTax.toLocaleString()}）
              </span>
            </p>

            <div className="product-preview__stock">
              {product.isAvailable ? (
                <span className="stock-badge stock-badge--available">在庫: {product.stock}個</span>
              ) : (
                <span className="stock-badge stock-badge--out">在庫切れ</span>
              )}
            </div>

            {error && (
              <p className="product-preview__warning">⚠️ {error.message}</p>
            )}
          </div>
        </div>

        <style jsx>{`
          .product-preview {
            padding: 1.5rem;
            border: 2px solid #d1d5db;
            border-radius: 0.75rem;
          }

          .product-preview--success {
            background: #f0fdf4;
            border-color: #86efac;
          }

          .product-preview__icon {
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
            display: block;
          }

          .product-preview__content {
            display: flex;
            gap: 1rem;
          }

          .product-preview__image {
            flex-shrink: 0;
            width: 120px;
            height: 120px;
            border-radius: 0.5rem;
            overflow: hidden;
            background: white;
            border: 1px solid #e5e7eb;
          }

          .product-preview__details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .product-preview__name {
            margin: 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
          }

          .product-preview__code {
            margin: 0;
            font-size: 0.875rem;
            color: #6b7280;
          }

          .product-preview__price {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: #059669;
          }

          .product-preview__price-tax {
            font-size: 0.875rem;
            font-weight: 400;
            color: #6b7280;
            margin-left: 0.5rem;
          }

          .product-preview__stock {
            margin-top: 0.25rem;
          }

          .stock-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .stock-badge--available {
            background: #d1fae5;
            color: #065f46;
          }

          .stock-badge--out {
            background: #fee2e2;
            color: #991b1b;
          }

          .product-preview__warning {
            margin: 0.5rem 0 0;
            font-size: 0.875rem;
            color: #f59e0b;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  // 初期状態（何も表示しない）
  return null;
}
