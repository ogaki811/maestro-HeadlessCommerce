/**
 * QuickOrderLineForm Component (Organism)
 * クイックオーダー1行入力フォーム
 */

'use client';

import React, { useState } from 'react';
import ProductPreview from '@/components/common/ProductPreview';
import QuickOrderInputRow from './QuickOrderInputRow';
import QuickOrderProductList from './QuickOrderProductList';
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

  return (
    <div className="flex flex-col gap-8">
      {/* 入力セクション */}
      <div className="flex flex-col gap-4">
        <h2 className="m-0 mb-4 text-xl font-semibold text-gray-900">商品を追加</h2>

        <QuickOrderInputRow
          productCode={productCode}
          onProductCodeChange={setProductCode}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAdd={handleAddProduct}
          canAdd={!!canAddProduct}
          isSearching={isSearching}
          error={error && !result ? error.message : undefined}
        />

        <ProductPreview product={result} error={error} isSearching={isSearching} />
      </div>

      {/* 追加済み商品リスト */}
      <QuickOrderProductList
        products={addedProducts}
        onRemove={handleRemoveProduct}
        onAddToCart={handleAddToCart}
        isLoading={isAddingToCart}
      />
    </div>
  );
}
