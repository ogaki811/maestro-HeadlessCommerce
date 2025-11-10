/**
 * QuotationProductTable Component (Organism)
 * 見積依頼商品入力テーブル
 */

'use client';

import React from 'react';
import QuotationProductRow from './QuotationProductRow';

export interface QuotationProductRowData {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  specifications: string;
}

export interface QuotationProductTableProps {
  rows: QuotationProductRowData[];
  onRowChange: (
    rowId: string,
    field: 'productCode' | 'productName' | 'quantity' | 'specifications',
    value: string | number
  ) => void;
  onResetRow: (rowId: string) => void;
  onAddRows: (count: number) => void;
  maxRows: number;
}

/**
 * QuotationProductTable
 *
 * 見積依頼用の商品入力テーブル
 * クイックオーダーと同じUIパターンを使用
 *
 * @example
 * <QuotationProductTable
 *   rows={rows}
 *   onRowChange={handleRowChange}
 *   onResetRow={handleResetRow}
 *   onAddRows={handleAddRows}
 *   maxRows={50}
 * />
 */
export default function QuotationProductTable({
  rows,
  onRowChange,
  onResetRow,
  onAddRows,
  maxRows,
}: QuotationProductTableProps) {
  const canAddRows = rows.length < maxRows;
  const remainingRows = maxRows - rows.length;

  return (
    <div className="flex flex-col gap-6">
      {/* テーブル本体 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* ヘッダー行 */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto_1.5fr_auto] gap-4 items-center p-3 bg-gray-100 border-b-2 border-gray-300">
          <div className="flex items-center justify-center w-12 text-sm font-semibold text-gray-700">
            No.
          </div>
          <div className="min-w-[180px] text-sm font-semibold text-gray-700">
            商品コード <span className="text-red-500">*</span>
          </div>
          <div className="min-w-[200px] text-sm font-semibold text-gray-700">
            商品名 <span className="text-red-500">*</span>
          </div>
          <div className="min-w-[100px] text-sm font-semibold text-gray-700">
            数量 <span className="text-red-500">*</span>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            仕様・備考
          </div>
          <div className="w-8">{/* リセットボタン列 - 空欄 */}</div>
        </div>

        {/* データ行 */}
        {rows.map((row, index) => (
          <QuotationProductRow
            key={row.id}
            rowId={row.id}
            rowIndex={index + 1}
            productCode={row.productCode}
            productName={row.productName}
            quantity={row.quantity}
            specifications={row.specifications}
            onRowChange={onRowChange}
            onResetRow={onResetRow}
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
