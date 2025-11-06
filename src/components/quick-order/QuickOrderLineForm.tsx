/**
 * QuickOrderLineForm Component (Organism)
 * クイックオーダー1行入力フォーム
 */

'use client';

import React, { useState } from 'react';
import ProductCodeInput from '@/components/common/ProductCodeInput';
import ProductPreview from '@/components/common/ProductPreview';
import NumberInput from '@/components/ui/NumberInput';
import { useProductSearch } from '@/hooks/useProductSearch';

export interface AddedProduct {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface QuickOrderLineFormProps {
  onAddToCart: (products: Array<{ productId: string; quantity: number }>) => Promise<void>;
}

/**
 * QuickOrderLineForm
 *
 * 1行ずつ商品を入力・追加するフォーム
 *
 * @example
 * <QuickOrderLineForm onAddToCart={handleAddToCart} />
 */
export default function QuickOrderLineForm({ onAddToCart }: QuickOrderLineFormProps) {
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedProducts, setAddedProducts] = useState<AddedProduct[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // リアルタイム商品検索
  const { result, error, isSearching } = useProductSearch(productCode);

  // 商品追加処理
  const handleAddProduct = () => {
    if (!result || !result.isAvailable) {
      return;
    }

    // 重複チェック
    const existingProduct = addedProducts.find((p) => p.id === result.id);

    if (existingProduct) {
      // 数量を加算
      setAddedProducts(
        addedProducts.map((p) =>
          p.id === result.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
    } else {
      // 新規追加
      setAddedProducts([
        ...addedProducts,
        {
          id: result.id,
          code: result.code,
          name: result.name,
          price: result.price,
          quantity,
          imageUrl: result.imageUrl,
        },
      ]);
    }

    // 入力欄をクリア
    setProductCode('');
    setQuantity(1);
  };

  // 商品削除処理
  const handleRemoveProduct = (productId: string) => {
    setAddedProducts(addedProducts.filter((p) => p.id !== productId));
  };

  // カート追加処理
  const handleAddToCart = async () => {
    if (addedProducts.length === 0) {
      return;
    }

    setIsAddingToCart(true);
    try {
      await onAddToCart(
        addedProducts.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
        }))
      );

      // 成功後、リストをクリア
      setAddedProducts([]);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const canAddProduct = result && result.isAvailable && !isSearching;
  const totalAmount = addedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQuantity = addedProducts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="quick-order-line-form">
      {/* 入力セクション */}
      <div className="input-section">
        <h2 className="section-title">商品を追加</h2>

        <div className="input-row">
          <ProductCodeInput
            value={productCode}
            onChange={setProductCode}
            isSearching={isSearching}
            error={error && !result ? error.message : undefined}
            onEnter={canAddProduct ? handleAddProduct : undefined}
          />

          <NumberInput value={quantity} onChange={setQuantity} min={1} label="数量" showStepper={true} />

          <button
            type="button"
            onClick={handleAddProduct}
            disabled={!canAddProduct}
            className={`add-button ${canAddProduct ? '' : 'add-button--disabled'}`}
          >
            追加
          </button>
        </div>

        <ProductPreview product={result} error={error} isSearching={isSearching} />
      </div>

      {/* 追加済み商品リスト */}
      {addedProducts.length > 0 && (
        <div className="added-products-section">
          <h2 className="section-title">追加済み商品 ({addedProducts.length}商品)</h2>

          <div className="products-list">
            {addedProducts.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-item__info">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-item__image"
                  />
                  <div className="product-item__details">
                    <p className="product-item__code">{product.code}</p>
                    <h4 className="product-item__name">{product.name}</h4>
                    <p className="product-item__pricing">
                      ¥{product.price.toLocaleString()} × {product.quantity}個 = ¥
                      {(product.price * product.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product.id)}
                  className="product-item__remove"
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p className="cart-summary__total">
              合計: ¥{totalAmount.toLocaleString()}
              <span className="cart-summary__details">
                （{addedProducts.length}商品、{totalQuantity}個）
              </span>
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`cart-button ${isAddingToCart ? 'cart-button--loading' : ''}`}
            >
              {isAddingToCart ? 'カートに追加中...' : 'カートに追加'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .quick-order-line-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-title {
          margin: 0 0 1rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-row {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .add-button {
          padding: 0.625rem 1.5rem;
          height: 2.625rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .add-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .add-button:active:not(:disabled) {
          background: #1d4ed8;
        }

        .add-button--disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .added-products-section {
          padding: 1.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .product-item__info {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .product-item__image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
        }

        .product-item__details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .product-item__code {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .product-item__name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }

        .product-item__pricing {
          margin: 0;
          font-size: 0.875rem;
          color: #059669;
          font-weight: 500;
        }

        .product-item__remove {
          padding: 0.5rem 1rem;
          background: white;
          color: #dc2626;
          border: 1px solid #dc2626;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .product-item__remove:hover {
          background: #dc2626;
          color: white;
        }

        .cart-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
        }

        .cart-summary__total {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .cart-summary__details {
          font-size: 0.875rem;
          font-weight: 400;
          color: #6b7280;
          margin-left: 0.5rem;
        }

        .cart-button {
          padding: 0.75rem 2rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cart-button:hover:not(:disabled) {
          background: #059669;
        }

        .cart-button:active:not(:disabled) {
          background: #047857;
        }

        .cart-button--loading {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
