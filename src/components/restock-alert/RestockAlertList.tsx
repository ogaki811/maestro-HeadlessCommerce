'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { RestockAlert } from '@/types/restock-alert';

interface RestockAlertListProps {
  alerts: RestockAlert[];
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  /** 総件数（ページネーション時に使用） */
  totalCount?: number;
}

/**
 * 販売再開メール一覧コンポーネント
 */
export const RestockAlertList: React.FC<RestockAlertListProps> = ({
  alerts,
  onDelete,
  isLoading = false,
  totalCount,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 解除ハンドラ
  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    },
    [onDelete]
  );

  // ローディング状態
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // 空状態（totalCountがある場合はそちらを優先）
  const displayCount = totalCount ?? alerts.length;
  if (displayCount === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-gray-500">販売再開メールの登録がありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 件数表示 */}
      <p className="text-sm text-gray-700">
        <span className="text-red-500 font-bold">{displayCount}</span>
        件あります。
      </p>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* ヘッダー */}
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200 w-32">
                商品コード
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                商品名
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200 w-24">
                操作
              </th>
            </tr>
          </thead>
          {/* ボディ */}
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-200 hover:bg-gray-50">
                {/* 商品コード */}
                <td className="px-4 py-4 text-center text-sm text-gray-900">
                  {alert.productCode}
                </td>
                {/* 商品名（リンク） */}
                <td className="px-4 py-4">
                  <Link
                    href={`/products/${alert.productId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {alert.productName}
                  </Link>
                </td>
                {/* 操作 */}
                <td className="px-4 py-4 text-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(alert.id)}
                    disabled={deletingId === alert.id}
                    loading={deletingId === alert.id}
                  >
                    解除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestockAlertList;
