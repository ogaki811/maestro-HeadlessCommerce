import React from 'react';
import type { Quotation } from '@/types/quotation';
import { Button } from '@/components/ui/Button';

export interface QuotationDetailHeaderProps {
  quotation: Quotation;
}

/**
 * QuotationDetailHeader - 見積詳細ヘッダーコンポーネント（Organism）
 *
 * 見積依頼の詳細情報（件名、依頼内容、依頼日）を表示。
 */
export default function QuotationDetailHeader({ quotation }: QuotationDetailHeaderProps) {
  const formatDate = (dateString: string): string => {
    // YYYY-MM-DD または ISO形式 を YYYY/MM/DD に変換
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleCopyClick = () => {
    // TODO: Phase 2で見積コピー機能を実装
    console.log('見積をコピー clicked');
  };

  return (
    <div className="mb-6">
      {/* ヘッダー行: 件名 + ボタン */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          件名：{quotation.subject || quotation.id}
        </h1>

        {/* 見積をコピーボタン */}
        <Button
          onClick={handleCopyClick}
          className="bg-[#2d2626] text-white hover:bg-gray-900 focus:ring-gray-900"
        >
          見積をコピー
        </Button>
      </div>

      {/* 依頼内容と見積依頼日 */}
      <div className="space-y-2 text-gray-700">
        {quotation.description && (
          <p>
            <span className="font-medium">依頼内容：</span>
            {quotation.description}
          </p>
        )}

        <p>
          <span className="font-medium">見積依頼日：</span>
          {formatDate(quotation.requestDate)}
        </p>
      </div>
    </div>
  );
}
