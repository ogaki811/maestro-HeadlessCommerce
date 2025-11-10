import React from 'react';
import type { Quotation, QuotationResponse } from '@/types/quotation';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export interface QuotationResponseTableProps {
  quotation: Quotation;
}

/**
 * QuotationResponseTable - 見積回答テーブルコンポーネント（Organism）
 *
 * 見積依頼に対する販売店からの回答を表形式で表示。
 */
export default function QuotationResponseTable({ quotation }: QuotationResponseTableProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '—';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const formatCurrency = (amount: number): string => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  const getVendorName = (vendorId: string): string => {
    const vendor = quotation.vendors.find((v) => v.id === vendorId);
    return vendor?.name || '—';
  };

  const getStatusBadge = (response: QuotationResponse) => {
    // 見積完了日があれば「見積完了」、なければ「未回答」
    if (response.completionDate) {
      return <Badge variant="success">見積完了</Badge>;
    }
    return <Badge variant="default">未回答</Badge>;
  };

  const handleDetailClick = (response: QuotationResponse) => {
    // TODO: Phase 2で詳細表示機能を実装
    console.log('詳細 clicked', response);
  };

  const handleCartClick = (response: QuotationResponse) => {
    // TODO: Phase 2でカート追加機能を実装
    console.log('カートに追加 clicked', response);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>詳細</TableHeaderCell>
          <TableHeaderCell>見積依頼番号</TableHeaderCell>
          <TableHeaderCell>Web ID/氏名</TableHeaderCell>
          <TableHeaderCell>ステータス</TableHeaderCell>
          <TableHeaderCell>販売店名</TableHeaderCell>
          <TableHeaderCell>希望納期</TableHeaderCell>
          <TableHeaderCell>見積完了日</TableHeaderCell>
          <TableHeaderCell>見積有効期限</TableHeaderCell>
          <TableHeaderCell align="right">見積金額（税抜）</TableHeaderCell>
          <TableHeaderCell>最終注文日付</TableHeaderCell>
          <TableHeaderCell>カートイン</TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {quotation.responses?.map((response, index) => (
          <TableRow key={`${response.vendorId}-${index}`}>
            {/* 詳細ボタン */}
            <TableCell>
              <button
                onClick={() => handleDetailClick(response)}
                className="p-2 hover:bg-gray-100 rounded"
                aria-label="詳細"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </TableCell>

            {/* 見積依頼番号 */}
            <TableCell>{response.quotationNumber || '—'}</TableCell>

            {/* Web ID/氏名 */}
            <TableCell>
              <div className="text-sm">
                <div>{response.webId || '—'}</div>
                <div className="text-gray-500">{response.userName || '—'}</div>
              </div>
            </TableCell>

            {/* ステータス */}
            <TableCell>{getStatusBadge(response)}</TableCell>

            {/* 販売店名 */}
            <TableCell>{getVendorName(response.vendorId)}</TableCell>

            {/* 希望納期 */}
            <TableCell>{formatDate(response.desiredDeliveryDate)}</TableCell>

            {/* 見積完了日 */}
            <TableCell>{formatDate(response.completionDate)}</TableCell>

            {/* 見積有効期限 */}
            <TableCell>{formatDate(response.validUntil)}</TableCell>

            {/* 見積金額（税抜） */}
            <TableCell align="right">
              {response.totalAmount > 0 ? formatCurrency(response.totalAmount) : '—'}
            </TableCell>

            {/* 最終注文日付 */}
            <TableCell>{formatDate(response.lastOrderDate)}</TableCell>

            {/* カートインボタン（見積完了の場合のみ） */}
            <TableCell>
              {response.completionDate && (
                <button
                  onClick={() => handleCartClick(response)}
                  className="p-2 hover:bg-gray-100 rounded"
                  aria-label="カートに追加"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
