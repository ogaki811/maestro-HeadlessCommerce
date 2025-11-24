import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { RestockAlertListClient } from './RestockAlertListClient';
import { RestockAlert } from '@/types/restock-alert';

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

/**
 * サーバーサイドでデータを取得
 */
async function getRestockAlerts(accessToken?: string): Promise<RestockAlert[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl && accessToken) {
    try {
      const response = await fetch(`${apiUrl}/api/restock-alerts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
    } catch {
      console.log('Composer API not available, using mock data');
    }
  }

  return mockAlerts;
}

export default async function RestockAlertsPage() {
  // サーバーサイドで認証チェック
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // サーバーサイドでデータ取得
  const alerts = await getRestockAlerts(session.accessToken);

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

                {/* 一覧（クライアントコンポーネント） */}
                <RestockAlertListClient initialAlerts={alerts} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
