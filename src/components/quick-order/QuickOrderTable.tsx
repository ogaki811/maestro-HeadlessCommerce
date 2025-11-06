/**
 * QuickOrderTable Component (Organism)
 * クイックオーダーテーブル（複数行入力）
 */

'use client';

import React from 'react';
import QuickOrderRow from './QuickOrderRow';
import { useProductSearch } from '@/hooks/useProductSearch';

export interface QuickOrderRowData {
  id: string;
  productCode: string;
  quantity: number;
}

export interface QuickOrderTableProps {
  rows: QuickOrderRowData[];
  onRowChange: (rowId: string, field: 'productCode' | 'quantity', value: string | number) => void;
  onAddRows: (count: number) => void;
  maxRows: number;
}

/**
 * QuickOrderTable
 *
 * クイックオーダーの複数行入力テーブル
 *
 * @example
 * <QuickOrderTable
 *   rows={rows}
 *   onRowChange={handleRowChange}
 *   onAddRows={handleAddRows}
 *   maxRows={99}
 * />
 */
export default function QuickOrderTable({
  rows,
  onRowChange,
  onAddRows,
  maxRows,
}: QuickOrderTableProps) {
  const canAddRows = rows.length < maxRows;
  const remainingRows = maxRows - rows.length;

  return (
    <div className="flex flex-col gap-6">
      {/* ヘッダー */}
      <div className="grid grid-cols-[auto_1fr_auto_2fr] gap-4 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-medium text-sm text-gray-700">
        <div className="w-12 text-center">No.</div>
        <div className="min-w-[200px]">商品コード</div>
        <div className="min-w-[120px]">数量</div>
        <div>商品情報</div>
      </div>

      {/* テーブル本体 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {rows.map((row, index) => (
          <QuickOrderTableRow
            key={row.id}
            rowId={row.id}
            rowIndex={index + 1}
            productCode={row.productCode}
            quantity={row.quantity}
            onRowChange={onRowChange}
          />
        ))}
      </div>

      {/* 行追加ボタン */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => onAddRows(10)}
          disabled={!canAddRows}
          className={`
            px-6 py-3
            rounded-lg
            font-semibold text-base
            transition-all duration-150
            ${
              canAddRows
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          aria-label={canAddRows ? '10件追加' : '最大行数に達しています'}
        >
          {canAddRows ? '+ 10件追加' : '最大行数に達しています'}
        </button>

        <span className="text-sm text-gray-600">
          {canAddRows ? `（残り${remainingRows}件追加可能）` : ''}
        </span>
      </div>
    </div>
  );
}

/**
 * QuickOrderTableRow
 * 内部コンポーネント：1行のラッパー（リアルタイム検索統合）
 */
interface QuickOrderTableRowProps {
  rowId: string;
  rowIndex: number;
  productCode: string;
  quantity: number;
  onRowChange: (rowId: string, field: 'productCode' | 'quantity', value: string | number) => void;
}

function QuickOrderTableRow({
  rowId,
  rowIndex,
  productCode,
  quantity,
  onRowChange,
}: QuickOrderTableRowProps) {
  // リアルタイム商品検索
  const { result, error, isSearching } = useProductSearch(productCode);

  return (
    <QuickOrderRow
      rowIndex={rowIndex}
      productCode={productCode}
      quantity={quantity}
      onProductCodeChange={(value) => onRowChange(rowId, 'productCode', value)}
      onQuantityChange={(value) => onRowChange(rowId, 'quantity', value)}
      product={result}
      error={error}
      isSearching={isSearching}
    />
  );
}
