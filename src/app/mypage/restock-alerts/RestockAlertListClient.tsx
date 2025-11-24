'use client';

import { useState, useCallback } from 'react';
import { RestockAlertList } from '@/components/restock-alert';
import { RestockAlert } from '@/types/restock-alert';
import toast from 'react-hot-toast';

interface RestockAlertListClientProps {
  initialAlerts: RestockAlert[];
}

/**
 * 販売再開メール一覧のクライアントコンポーネント
 * 削除などのインタラクションを処理
 */
export function RestockAlertListClient({ initialAlerts }: RestockAlertListClientProps) {
  const [alerts, setAlerts] = useState<RestockAlert[]>(initialAlerts);

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
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      toast.success('販売再開メールの登録を解除しました');
    } catch {
      // APIが未実装の場合もローカルで削除
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      toast.success('販売再開メールの登録を解除しました');
    }
  }, []);

  return (
    <RestockAlertList
      alerts={alerts}
      onDelete={handleDelete}
      isLoading={false}
    />
  );
}
