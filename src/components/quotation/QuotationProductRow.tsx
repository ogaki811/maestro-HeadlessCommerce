/**
 * QuotationProductRow Component (Molecule)
 * 見積依頼商品入力行
 */

'use client';

import React from 'react';

export interface QuotationProductRowProps {
  rowId: string;
  rowIndex: number;
  productCode: string;
  productName: string;
  quantity: number;
  specifications: string;
  onRowChange: (
    rowId: string,
    field: 'productCode' | 'productName' | 'quantity' | 'specifications',
    value: string | number
  ) => void;
  onResetRow: (rowId: string) => void;
}

/**
 * QuotationProductRow
 *
 * 見積依頼商品の1行分の入力フィールド
 *
 * @example
 * <QuotationProductRow
 *   rowId="row-1"
 *   rowIndex={1}
 *   productCode=""
 *   productName=""
 *   quantity={1}
 *   specifications=""
 *   onRowChange={handleRowChange}
 *   onResetRow={handleResetRow}
 * />
 */
export default function QuotationProductRow({
  rowId,
  rowIndex,
  productCode,
  productName,
  quantity,
  specifications,
  onRowChange,
  onResetRow,
}: QuotationProductRowProps) {
  const handleProductCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRowChange(rowId, 'productCode', e.target.value);
  };

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRowChange(rowId, 'productName', e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    onRowChange(rowId, 'quantity', Math.max(1, value));
  };

  const handleSpecificationsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowChange(rowId, 'specifications', e.target.value);
  };

  const handleReset = () => {
    onResetRow(rowId);
  };

  // 入力があるかチェック
  const hasInput =
    productCode.trim().length > 0 ||
    productName.trim().length > 0 ||
    specifications.trim().length > 0;

  return (
    <div
      className={`
        grid grid-cols-[auto_1fr_1fr_auto_1.5fr_auto] gap-4 items-center p-3
        border-b border-gray-200 last:border-b-0
        transition-colors duration-150
        ${hasInput ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {/* No. */}
      <div className="flex items-center justify-center w-12">
        <span className="text-sm font-medium text-gray-700">{rowIndex}</span>
      </div>

      {/* 商品コード */}
      <div className="min-w-[180px]">
        <input
          type="text"
          value={productCode}
          onChange={handleProductCodeChange}
          placeholder="商品コード"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 商品名 */}
      <div className="min-w-[200px]">
        <input
          type="text"
          value={productName}
          onChange={handleProductNameChange}
          placeholder="商品名"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 数量 */}
      <div className="min-w-[100px]">
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 仕様・備考 */}
      <div>
        <input
          type="text"
          value={specifications}
          onChange={handleSpecificationsChange}
          placeholder="仕様・備考"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* リセットボタン */}
      <div className="flex items-center justify-center w-8">
        {hasInput && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="この行をクリア"
            title="この行をクリア"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
