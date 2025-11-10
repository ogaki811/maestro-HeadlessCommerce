import React from 'react';
import type { Quotation, QuotationResponse } from '@/types/quotation';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';

export interface QuotationResponseDetailProps {
  quotation: Quotation;
  response: QuotationResponse;
}

/**
 * QuotationResponseDetail - 見積回答詳細コンポーネント（Organism）
 *
 * 見積回答の詳細情報を表示するコンポーネント。
 * ContentModalの中で使用されることを想定。
 */
export default function QuotationResponseDetail({
  quotation,
  response,
}: QuotationResponseDetailProps) {
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

  return (
    <div className="quotation-response-detail">
      {/* 販売店情報 */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">販売店情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">販売店名</p>
            <p className="font-medium text-gray-900">{getVendorName(response.vendorId)}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Web ID / 担当者</p>
            <p className="font-medium text-gray-900">
              {response.webId || '—'} / {response.userName || '—'}
            </p>
          </div>
        </div>
      </section>

      {/* 見積情報 */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">見積情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">見積依頼番号</p>
            <p className="font-medium text-gray-900">{response.quotationNumber || '—'}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">見積完了日</p>
            <p className="font-medium text-gray-900">{formatDate(response.completionDate)}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">見積有効期限</p>
            <p className="font-medium text-gray-900">{formatDate(response.validUntil)}</p>
          </div>
        </div>
      </section>

      {/* 商品明細 */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">商品明細</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>商品ID</TableHeaderCell>
                <TableHeaderCell align="right">単価（税抜）</TableHeaderCell>
                <TableHeaderCell align="right">合計</TableHeaderCell>
                <TableHeaderCell>納期</TableHeaderCell>
                <TableHeaderCell>備考</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {response.products?.map((product, index) => (
                <TableRow key={`${product.productId}-${index}`}>
                  <TableCell>{product.productId}</TableCell>
                  <TableCell align="right">{formatCurrency(product.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(product.totalPrice)}</TableCell>
                  <TableCell>{formatDate(product.leadTime)}</TableCell>
                  <TableCell>{product.notes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 合計金額 */}
      <section className="mb-6">
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">合計金額（税抜）</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(response.totalAmount)}</p>
          </div>
        </div>
      </section>

      {/* 営業担当者からのメッセージ */}
      {response.message && (
        <section className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-sm font-bold text-blue-900 mb-2">営業担当者からのメッセージ</h3>
          <p className="text-sm text-blue-900">{response.message}</p>
        </section>
      )}
    </div>
  );
}
