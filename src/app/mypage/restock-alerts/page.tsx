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
 * モックデータ（開発用）- 35件でページネーションテスト
 */
const mockAlerts: RestockAlert[] = [
  { id: '1', productId: '704321', productCode: '704321', productName: 'ワイヤレスアンプ ATW-SP1920', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', productId: '708721', productCode: '708721', productName: 'レバーリングF GX Dタイプ3774GX-B 10冊', createdAt: '2024-01-16T10:00:00Z' },
  { id: '3', productId: '723371', productCode: '723371', productName: '881 ニトリスト・フィット100枚 S/ブルー', createdAt: '2024-01-17T10:00:00Z' },
  { id: '4', productId: '723372', productCode: '723372', productName: '881 ニトリスト・フィット100枚 M/ブルー', createdAt: '2024-01-18T10:00:00Z' },
  { id: '5', productId: '743229', productCode: '743229', productName: 'チェキ フィルム10枚×2 INSTAX MINI JP 2', createdAt: '2024-01-19T10:00:00Z' },
  { id: '6', productId: '750001', productCode: '750001', productName: 'デスクライト LED調光式 ホワイト', createdAt: '2024-01-20T10:00:00Z' },
  { id: '7', productId: '750002', productCode: '750002', productName: 'USBハブ 4ポート USB3.0対応', createdAt: '2024-01-21T10:00:00Z' },
  { id: '8', productId: '750003', productCode: '750003', productName: 'ワイヤレスマウス 静音タイプ ブラック', createdAt: '2024-01-22T10:00:00Z' },
  { id: '9', productId: '750004', productCode: '750004', productName: 'モニターアーム シングル 27インチ対応', createdAt: '2024-01-23T10:00:00Z' },
  { id: '10', productId: '750005', productCode: '750005', productName: 'キーボード メカニカル 青軸', createdAt: '2024-01-24T10:00:00Z' },
  { id: '11', productId: '750006', productCode: '750006', productName: 'ヘッドセット ノイズキャンセリング', createdAt: '2024-01-25T10:00:00Z' },
  { id: '12', productId: '750007', productCode: '750007', productName: 'Webカメラ フルHD 1080p', createdAt: '2024-01-26T10:00:00Z' },
  { id: '13', productId: '750008', productCode: '750008', productName: 'ノートPCスタンド アルミ製 折りたたみ', createdAt: '2024-01-27T10:00:00Z' },
  { id: '14', productId: '750009', productCode: '750009', productName: 'デスクマット 大型 80x40cm', createdAt: '2024-01-28T10:00:00Z' },
  { id: '15', productId: '750010', productCode: '750010', productName: 'ケーブルホルダー 5個セット', createdAt: '2024-01-29T10:00:00Z' },
  { id: '16', productId: '750011', productCode: '750011', productName: '電源タップ 6口 雷サージ対応', createdAt: '2024-01-30T10:00:00Z' },
  { id: '17', productId: '750012', productCode: '750012', productName: 'ファイルボックス A4 5個入り', createdAt: '2024-01-31T10:00:00Z' },
  { id: '18', productId: '750013', productCode: '750013', productName: 'デスクオーガナイザー 木製', createdAt: '2024-02-01T10:00:00Z' },
  { id: '19', productId: '750014', productCode: '750014', productName: 'ペンスタンド 回転式 ブラック', createdAt: '2024-02-02T10:00:00Z' },
  { id: '20', productId: '750015', productCode: '750015', productName: 'クリップボード A4 ブルー', createdAt: '2024-02-03T10:00:00Z' },
  { id: '21', productId: '750016', productCode: '750016', productName: 'ホワイトボード 60x45cm マグネット付', createdAt: '2024-02-04T10:00:00Z' },
  { id: '22', productId: '750017', productCode: '750017', productName: 'ホワイトボードマーカー 4色セット', createdAt: '2024-02-05T10:00:00Z' },
  { id: '23', productId: '750018', productCode: '750018', productName: '付箋 75x75mm 5色パック', createdAt: '2024-02-06T10:00:00Z' },
  { id: '24', productId: '750019', productCode: '750019', productName: 'ノート A5 方眼 5冊パック', createdAt: '2024-02-07T10:00:00Z' },
  { id: '25', productId: '750020', productCode: '750020', productName: 'ボールペン 0.5mm 黒 10本入り', createdAt: '2024-02-08T10:00:00Z' },
  { id: '26', productId: '750021', productCode: '750021', productName: 'シャープペンシル 0.5mm メタリック', createdAt: '2024-02-09T10:00:00Z' },
  { id: '27', productId: '750022', productCode: '750022', productName: '消しゴム プラスチック 3個入り', createdAt: '2024-02-10T10:00:00Z' },
  { id: '28', productId: '750023', productCode: '750023', productName: '定規 30cm アクリル製', createdAt: '2024-02-11T10:00:00Z' },
  { id: '29', productId: '750024', productCode: '750024', productName: 'ハサミ フッ素コート刃', createdAt: '2024-02-12T10:00:00Z' },
  { id: '30', productId: '750025', productCode: '750025', productName: 'テープカッター 大巻用', createdAt: '2024-02-13T10:00:00Z' },
  { id: '31', productId: '750026', productCode: '750026', productName: 'セロハンテープ 18mm 10巻', createdAt: '2024-02-14T10:00:00Z' },
  { id: '32', productId: '750027', productCode: '750027', productName: 'ホッチキス フラットクリンチ', createdAt: '2024-02-15T10:00:00Z' },
  { id: '33', productId: '750028', productCode: '750028', productName: 'ホッチキス針 No.10 5000本', createdAt: '2024-02-16T10:00:00Z' },
  { id: '34', productId: '750029', productCode: '750029', productName: 'クリアファイル A4 100枚入り', createdAt: '2024-02-17T10:00:00Z' },
  { id: '35', productId: '750030', productCode: '750030', productName: 'インデックス A4 12山 10組', createdAt: '2024-02-18T10:00:00Z' },
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
