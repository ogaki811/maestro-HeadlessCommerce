'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { RestockAlertList } from '@/components/restock-alert';
import Pagination from '@/components/common/Pagination';
import useAuthStore from '@/store/useAuthStore';
import { RestockAlert } from '@/types/restock-alert';
import toast from 'react-hot-toast';

/** 1ページあたりの表示件数 */
const ITEMS_PER_PAGE = 30;

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
  const [currentPage, setCurrentPage] = useState(1);

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
          if (response.status === 404) {
            setAlerts(mockAlerts);
            return;
          }
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setAlerts(data.data || mockAlerts);
      } catch {
        setAlerts(mockAlerts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [isAuthenticated, router]);

  // ページネーション計算
  const totalPages = Math.ceil(alerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = alerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ページ変更ハンドラ
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
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

      setAlerts((prev) => {
        const newAlerts = prev.filter((alert) => alert.id !== id);
        const newTotalPages = Math.ceil(newAlerts.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return newAlerts;
      });
      toast.success('販売再開メールの登録を解除しました');
    } catch {
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
                  alerts={paginatedAlerts}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                  totalCount={alerts.length}
                />

                {/* ページネーション */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
