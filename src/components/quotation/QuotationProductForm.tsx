/**
 * QuotationProductForm Component (Organism)
 * 見積依頼商品追加フォーム
 */

'use client';

import React, { useState, useMemo } from 'react';
import QuotationProductTable, { type QuotationProductRowData } from './QuotationProductTable';
import type { QuotationProduct } from '@/types/quotation';

export interface QuotationProductFormProps {
  products: QuotationProduct[];
  onProductsChange: (products: QuotationProduct[]) => void;
}

const INITIAL_ROWS = 10;
const MAX_ROWS = 50;

/**
 * QuotationProductForm
 *
 * 見積依頼用の商品追加フォーム（複数行入力対応）
 * クイックオーダーと同じUIパターンを使用
 *
 * @example
 * <QuotationProductForm products={products} onProductsChange={setProducts} />
 */
export default function QuotationProductForm({
  products,
  onProductsChange,
}: QuotationProductFormProps) {
  const [rows, setRows] = useState<QuotationProductRowData[]>(() =>
    createInitialRows(INITIAL_ROWS)
  );

  // 入力済み行を抽出（商品コードと商品名が入力されている行）
  const filledRows = useMemo(() => {
    return rows.filter(
      (row) =>
        row.productCode.trim().length > 0 && row.productName.trim().length > 0
    );
  }, [rows]);

  const filledCount = filledRows.length;

  /**
   * 行の値を変更
   */
  const handleRowChange = (
    rowId: string,
    field: 'productCode' | 'productName' | 'quantity' | 'specifications',
    value: string | number
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  /**
   * 行をリセット
   */
  const handleResetRow = (rowId: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              productCode: '',
              productName: '',
              quantity: 1,
              specifications: '',
            }
          : row
      )
    );
  };

  /**
   * 行を追加
   */
  const handleAddRows = (count: number) => {
    const currentCount = rows.length;
    if (currentCount >= MAX_ROWS) {
      return;
    }

    const actualCount = Math.min(count, MAX_ROWS - currentCount);
    const newRows = createRows(currentCount + 1, actualCount);

    setRows((prevRows) => [...prevRows, ...newRows]);
  };

  /**
   * 商品を追加
   */
  const handleAddProducts = () => {
    if (filledCount === 0) {
      return;
    }

    // 入力済み行を商品データに変換
    const newProducts: QuotationProduct[] = filledRows.map((row) => ({
      id: `temp_${Date.now()}_${Math.random()}`,
      productCode: row.productCode.trim(),
      productName: row.productName.trim(),
      quantity: row.quantity,
      specifications: row.specifications.trim(),
    }));

    // 既存商品に追加
    onProductsChange([...products, ...newProducts]);

    // フォームをリセット
    setRows(createInitialRows(INITIAL_ROWS));
  };

  // 商品追加ボタンコンポーネント（共通化）
  const AddProductsButton = () => (
    <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="text-sm text-gray-700">
        <span className="font-semibold text-lg text-gray-900">
          入力済み: {filledCount}商品
        </span>
      </div>

      <button
        type="button"
        onClick={handleAddProducts}
        disabled={filledCount === 0}
        className={`
          px-8 py-3
          rounded-lg
          text-lg font-semibold
          transition-all duration-150
          shadow-md hover:shadow-lg
          ${
            filledCount === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 cursor-pointer'
          }
        `}
        aria-label={
          filledCount === 0
            ? '商品を追加（商品情報を入力してください）'
            : `商品を追加 (${filledCount}商品)`
        }
      >
        {filledCount === 0 ? '商品を追加' : `商品を追加 (${filledCount}商品)`}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 relative">
      {/* 上部商品追加ボタン */}
      <AddProductsButton />

      {/* テーブル */}
      <QuotationProductTable
        rows={rows}
        onRowChange={handleRowChange}
        onResetRow={handleResetRow}
        onAddRows={handleAddRows}
        maxRows={MAX_ROWS}
      />

      {/* 下部商品追加ボタン */}
      <AddProductsButton />
    </div>
  );
}

/**
 * 初期行を作成
 */
function createInitialRows(count: number): QuotationProductRowData[] {
  return createRows(1, count);
}

/**
 * 行を作成
 */
function createRows(
  startIndex: number,
  count: number
): QuotationProductRowData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${startIndex + i}`,
    productCode: '',
    productName: '',
    quantity: 1,
    specifications: '',
  }));
}
