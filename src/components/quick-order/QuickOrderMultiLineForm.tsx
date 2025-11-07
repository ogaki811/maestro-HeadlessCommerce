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

// デモ用商品コード（存在するものと存在しないものを混在）
const DEMO_PRODUCT_CODES = [
  'AWA4132',  // ✓ 存在: A4コピー用紙
  'DM110BK',  // ⚠️ 廃番: デスクマット → 代替商品表示
  'AW75238',  // ✓ 存在: オフィスチェア
  'TN2200',   // ⚠️ 廃番: テープのり → 代替商品表示
  '8027341',  // ✓ 存在: ボールペン
  'XXXXX',    // ✗ 存在しない（エラー表示確認用）
];

/**
 * QuickOrderMultiLineForm
 *
 * クイックオーダー複数行入力フォーム
 * - 初期20行表示（デモデータ3件含む）
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
   * 行をリセット
   */
  const handleResetRow = (rowId: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? { ...row, productCode: '', quantity: 1 }
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
   * デモデータを入力
   */
  const handleLoadDemoData = () => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      DEMO_PRODUCT_CODES.forEach((code, index) => {
        if (index < newRows.length) {
          newRows[index].productCode = code;
          newRows[index].quantity = (index % 3) + 1; // 1, 2, 3, 1, 2
        }
      });
      return newRows;
    });
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

  // カート追加ボタンコンポーネント（共通化）
  const AddToCartButton = () => (
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
          shadow-md hover:shadow-lg
          ${
            isSubmitting || filledCount === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-[#2d2626] text-white hover:bg-gray-900 active:bg-black cursor-pointer'
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
  );

  return (
    <div className="flex flex-col gap-6 relative">
      {/* 上部カート追加ボタン */}
      <AddToCartButton />

      {/* テーブル */}
      <QuickOrderTable
        rows={rows}
        onRowChange={handleRowChange}
        onResetRow={handleResetRow}
        onAddRows={handleAddRows}
        maxRows={MAX_ROWS}
      />

      {/* 下部カート追加ボタン */}
      <AddToCartButton />

      {/* フローティングデモデータボタン */}
      <button
        type="button"
        onClick={handleLoadDemoData}
        className="fixed bottom-[62px] left-8 z-50 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 hover:shadow-xl"
        aria-label="デモデータを入力"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        <span className="font-semibold text-sm">デモデータ入力</span>
      </button>
    </div>
  );
}

/**
 * デモデータを含む初期行を作成
 */
function createInitialRowsWithDemoData(count: number): QuickOrderRowData[] {
  const rows = createRows(1, count);

  // 最初の3行にデモデータを設定
  DEMO_PRODUCT_CODES.forEach((code, index) => {
    if (index < rows.length) {
      rows[index].productCode = code;
      rows[index].quantity = index + 1; // 1, 2, 3
    }
  });

  return rows;
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
