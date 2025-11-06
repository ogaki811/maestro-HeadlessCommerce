/**
 * QuickOrderMultiLineForm Component (Organism)
 * クイックオーダー複数行フォーム
 */

'use client';

import React, { useState, useMemo } from 'react';
import QuickOrderTable, { type QuickOrderRowData } from './QuickOrderTable';

export interface QuickOrderMultiLineFormProps {
  onAddToCart: (items: Array<{ productId: string; quantity: number }>) => Promise<void>;
}

const INITIAL_ROWS = 20;
const MAX_ROWS = 99;
const ADD_ROWS_COUNT = 10;

/**
 * QuickOrderMultiLineForm
 *
 * クイックオーダー複数行入力フォーム
 * - 初期20行表示
 * - 10件ずつ追加可能（最大99行）
 * - 入力済み商品を一括カート追加
 *
 * @example
 * <QuickOrderMultiLineForm onAddToCart={handleAddToCart} />
 */
export default function QuickOrderMultiLineForm({ onAddToCart }: QuickOrderMultiLineFormProps) {
  const [rows, setRows] = useState<QuickOrderRowData[]>(() =>
    createInitialRows(INITIAL_ROWS)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力済み行を抽出（商品コードが入力されている行）
  const filledRows = useMemo(() => {
    return rows.filter((row) => row.productCode.trim().length > 0);
  }, [rows]);

  const filledCount = filledRows.length;

  /**
   * 行の値を変更
   */
  const handleRowChange = (
    rowId: string,
    field: 'productCode' | 'quantity',
    value: string | number
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? { ...row, [field]: value }
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
   * カートに追加
   */
  const handleAddToCart = async () => {
    if (filledCount === 0) {
      // TODO: トースト通知を表示
      return;
    }

    setIsSubmitting(true);

    try {
      // 入力済み行のみを抽出してカート追加
      // 注意: ここでは商品IDとして商品コードを使用しているが、
      // 実際のAPIでは商品検索結果から取得したIDを使用する必要がある
      const items = filledRows.map((row) => ({
        productId: row.productCode, // TODO: 実際の商品IDに置き換え
        quantity: row.quantity,
      }));

      await onAddToCart(items);

      // 成功後、フォームをリセット
      setRows(createInitialRows(INITIAL_ROWS));
    } catch (error) {
      console.error('カート追加エラー:', error);
      // エラーは親コンポーネントで処理
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* テーブル */}
      <QuickOrderTable
        rows={rows}
        onRowChange={handleRowChange}
        onAddRows={handleAddRows}
        maxRows={MAX_ROWS}
      />

      {/* カート追加ボタン */}
      <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-700">
          <span className="font-semibold text-lg text-gray-900">
            入力済み: {filledCount}商品
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSubmitting || filledCount === 0}
          className={`
            px-8 py-3
            rounded-lg
            text-lg font-semibold
            transition-all duration-150
            ${
              isSubmitting || filledCount === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer'
            }
          `}
          aria-label={
            isSubmitting
              ? 'カートに追加中...'
              : filledCount === 0
              ? 'カートに追加（商品を入力してください）'
              : `カートに追加 (${filledCount}商品)`
          }
        >
          {isSubmitting ? 'カートに追加中...' : `カートに追加 (${filledCount}商品)`}
        </button>
      </div>
    </div>
  );
}

/**
 * 初期行を作成
 */
function createInitialRows(count: number): QuickOrderRowData[] {
  return createRows(1, count);
}

/**
 * 行を作成
 */
function createRows(startIndex: number, count: number): QuickOrderRowData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${startIndex + i}`,
    productCode: '',
    quantity: 1,
  }));
}
