/**
 * QuickOrderInputRow Component (Molecule)
 * クイックオーダー入力行
 *
 * 商品コード入力、数量入力、追加ボタンを含む入力行
 */

import React from 'react';
import ProductCodeInput from '@/components/common/ProductCodeInput';
import NumberInput from '@/components/ui/NumberInput';

export interface QuickOrderInputRowProps {
  productCode: string;
  onProductCodeChange: (value: string) => void;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onAdd: () => void;
  canAdd: boolean;
  isSearching: boolean;
  error?: string;
}

/**
 * QuickOrderInputRow
 *
 * クイックオーダーの入力行コンポーネント
 *
 * @example
 * <QuickOrderInputRow
 *   productCode={productCode}
 *   onProductCodeChange={setProductCode}
 *   quantity={quantity}
 *   onQuantityChange={setQuantity}
 *   onAdd={handleAdd}
 *   canAdd={canAddProduct}
 *   isSearching={isSearching}
 * />
 */
export default function QuickOrderInputRow({
  productCode,
  onProductCodeChange,
  quantity,
  onQuantityChange,
  onAdd,
  canAdd,
  isSearching,
  error,
}: QuickOrderInputRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canAdd && !isSearching) {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="flex gap-4 items-end" onKeyDown={handleKeyDown}>
      <ProductCodeInput
        value={productCode}
        onChange={onProductCodeChange}
        isSearching={isSearching}
        error={error}
        onEnter={canAdd ? onAdd : undefined}
      />

      <NumberInput
        value={quantity}
        onChange={onQuantityChange}
        min={1}
        label="数量"
        showStepper={true}
      />

      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        className={`
          px-6 py-2.5 h-[2.625rem]
          rounded-lg font-medium text-base
          transition-all duration-150 ease-in-out
          whitespace-nowrap
          ${
            canAdd
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }
        `}
        aria-label="追加"
      >
        追加
      </button>
    </div>
  );
}
