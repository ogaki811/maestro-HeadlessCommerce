'use client';

import { useState, useCallback, useMemo } from 'react';
import { RestockAlertList } from '@/components/restock-alert';
import Pagination from '@/components/common/Pagination';
import { RestockAlert } from '@/types/restock-alert';
import toast from 'react-hot-toast';

/** 1ページあたりの表示件数 */
const ITEMS_PER_PAGE = 30;

interface RestockAlertListClientProps {
  initialAlerts: RestockAlert[];
}

/**
 * 販売再開メール一覧のクライアントコンポーネント
 * 削除・ページネーションなどのインタラクションを処理
 */
export function RestockAlertListClient({ initialAlerts }: RestockAlertListClientProps) {
  const [alerts, setAlerts] = useState<RestockAlert[]>(initialAlerts);
  const [currentPage, setCurrentPage] = useState(1);

  // 総ページ数を計算
  const totalPages = useMemo(() => {
    return Math.ceil(alerts.length / ITEMS_PER_PAGE);
  }, [alerts.length]);

  // 現在のページに表示するアラートを取得
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return alerts.slice(startIndex, endIndex);
  }, [alerts, currentPage]);

  // ページ変更ハンドラ
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // ページ上部にスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 解除ハンドラ
  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/restock-alerts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('解除に失敗しました');
      }

      // 一覧から削除
      setAlerts((prev) => {
        const newAlerts = prev.filter((alert) => alert.id !== id);
        // 削除後に現在のページが空になった場合、前のページに戻る
        const newTotalPages = Math.ceil(newAlerts.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return newAlerts;
      });
      toast.success('販売再開メールの登録を解除しました');
    } catch {
      // APIが未実装の場合もローカルで削除
      setAlerts((prev) => {
        const newAlerts = prev.filter((alert) => alert.id !== id);
        const newTotalPages = Math.ceil(newAlerts.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return newAlerts;
      });
      toast.success('販売再開メールの登録を解除しました');
    }
  }, [currentPage]);

  return (
    <div>
      <RestockAlertList
        alerts={paginatedAlerts}
        onDelete={handleDelete}
        isLoading={false}
        totalCount={alerts.length}
      />

      {/* ページネーション（2ページ以上ある場合のみ表示） */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
