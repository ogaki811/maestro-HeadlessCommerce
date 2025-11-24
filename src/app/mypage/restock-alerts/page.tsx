'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { RestockAlertList } from '@/components/restock-alert';
import useAuthStore from '@/store/useAuthStore';
import { RestockAlert } from '@/types/restock-alert';
import toast from 'react-hot-toast';

/**
 * モックデータ（開発用）
 */
const mockAlerts: RestockAlert[] = [
  {
    id: '1',
    productId: '704321',
    productCode: '704321',
    productName: 'ワイヤレスアンプ ATW-SP1920',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    productId: '708721',
    productCode: '708721',
    productName: 'レバーリングF GX Dタイプ3774GX-B 10冊',
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    productId: '723371',
    productCode: '723371',
    productName: '881 ニトリスト・フィット100枚 S/ブルー',
    createdAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    productId: '723372',
    productCode: '723372',
    productName: '881 ニトリスト・フィット100枚 M/ブルー',
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '5',
    productId: '743229',
    productCode: '743229',
    productName: 'チェキ フィルム10枚×2 INSTAX MINI JP 2',
    createdAt: '2024-01-19T10:00:00Z',
  },
];

export default function RestockAlertsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [alerts, setAlerts] = useState<RestockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // データ取得
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/restock-alerts');

        if (!response.ok) {
          // APIが未実装の場合はモックデータを使用
          if (response.status === 404) {
            setAlerts(mockAlerts);
            return;
          }
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setAlerts(data.data);
      } catch (error) {
        console.log('Using mock data:', error);
        setAlerts(mockAlerts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [isAuthenticated, router]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* サイドバー */}
            <div className="lg:col-span-1">
              <MyPageSidebar />
            </div>

            {/* メインコンテンツ */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* ページタイトル */}
                <h1 className="text-3xl font-medium text-gray-900 mb-8 pb-2 border-b-2 border-black">
                  販売再開メール一覧
                </h1>

                {/* 一覧 */}
                <RestockAlertList
                  alerts={alerts}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
