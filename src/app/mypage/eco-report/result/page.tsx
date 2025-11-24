'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { EcoReportResult } from '@/components/eco-report';
import useAuthStore from '@/store/useAuthStore';
import {
  EcoReportResultData,
  EcoReportMonthData,
  EcoReportTotalData,
  AggregationType,
  AGGREGATION_LABELS,
} from '@/types/eco-report';

/**
 * モックデータを生成（開発用）
 */
const generateMockData = (
  targetCode: string,
  closingDay: number,
  aggregationType: AggregationType
): EcoReportResultData => {
  // 12ヶ月分の日付を生成
  const now = new Date();
  const monthlyData: EcoReportMonthData[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // 開始日と終了日を計算
    const startDate = new Date(year, month - 2, closingDay + 1);
    const endDate = new Date(year, month - 1, closingDay);

    const formatDate = (d: Date) =>
      `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

    // ランダムなデータを生成（デモ用）
    const totalPurchase = Math.floor(Math.random() * 500000);
    const ecoMark = Math.floor(totalPurchase * (Math.random() * 0.3));
    const greenPurchase = Math.floor(totalPurchase * (Math.random() * 0.25));
    const gpnEco = Math.floor(totalPurchase * (Math.random() * 0.2));
    const ecoTotal = ecoMark + greenPurchase + gpnEco;

    monthlyData.push({
      month: `${year}/${String(month).padStart(2, '0')}`,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      totalPurchase,
      ecoMark,
      ecoMarkRatio: totalPurchase > 0 ? (ecoMark / totalPurchase) * 100 : 0,
      greenPurchase,
      greenPurchaseRatio: totalPurchase > 0 ? (greenPurchase / totalPurchase) * 100 : 0,
      gpnEco,
      gpnEcoRatio: totalPurchase > 0 ? (gpnEco / totalPurchase) * 100 : 0,
      ecoTotal,
      ecoTotalRatio: totalPurchase > 0 ? (ecoTotal / totalPurchase) * 100 : 0,
    });
  }

  // 合計を計算
  const total: EcoReportTotalData = monthlyData.reduce(
    (acc, m) => ({
      totalPurchase: acc.totalPurchase + m.totalPurchase,
      ecoMark: acc.ecoMark + m.ecoMark,
      ecoMarkRatio: 0,
      greenPurchase: acc.greenPurchase + m.greenPurchase,
      greenPurchaseRatio: 0,
      gpnEco: acc.gpnEco + m.gpnEco,
      gpnEcoRatio: 0,
      ecoTotal: acc.ecoTotal + m.ecoTotal,
      ecoTotalRatio: 0,
    }),
    {
      totalPurchase: 0,
      ecoMark: 0,
      ecoMarkRatio: 0,
      greenPurchase: 0,
      greenPurchaseRatio: 0,
      gpnEco: 0,
      gpnEcoRatio: 0,
      ecoTotal: 0,
      ecoTotalRatio: 0,
    }
  );

  // 合計の構成比を計算
  if (total.totalPurchase > 0) {
    total.ecoMarkRatio = (total.ecoMark / total.totalPurchase) * 100;
    total.greenPurchaseRatio = (total.greenPurchase / total.totalPurchase) * 100;
    total.gpnEcoRatio = (total.gpnEco / total.totalPurchase) * 100;
    total.ecoTotalRatio = (total.ecoTotal / total.totalPurchase) * 100;
  }

  return {
    targetCode,
    targetName: 'テスト会社',
    closingDay,
    aggregationType,
    aggregationLabel: AGGREGATION_LABELS[aggregationType],
    monthlyData,
    total,
  };
};

/**
 * 結果ページのコンテンツ（Suspense用）
 */
function EcoReportResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [reportData, setReportData] = useState<EcoReportResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // クエリパラメータから検索条件を取得
    const targetCode = searchParams.get('targetCode');
    const closingDay = searchParams.get('closingDay');
    const aggregationType = searchParams.get('aggregationType') as AggregationType;

    if (!targetCode || !closingDay || !aggregationType) {
      setError('パラメータが不足しています。');
      setIsLoading(false);
      return;
    }

    // レポートデータを取得
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          `/api/eco-report/result?targetCode=${encodeURIComponent(targetCode)}&closingDay=${closingDay}&aggregationType=${aggregationType}`
        );

        if (!response.ok) {
          // APIが未実装の場合はモックデータを使用
          if (response.status === 404) {
            const mockData = generateMockData(
              targetCode,
              parseInt(closingDay, 10),
              aggregationType
            );
            setReportData(mockData);
            return;
          }
          throw new Error('レポートデータの取得に失敗しました');
        }

        const data = await response.json();
        setReportData(data);
      } catch (err) {
        // エラー時はモックデータを使用（開発用）
        console.log('Using mock data:', err);
        const mockData = generateMockData(
          targetCode,
          parseInt(closingDay, 10),
          aggregationType
        );
        setReportData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [isAuthenticated, router, searchParams]);

  // 戻るハンドラ
  const handleBack = useCallback(() => {
    router.push('/mypage/eco-report');
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          フォームに戻る
        </button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">データがありません</p>
      </div>
    );
  }

  return <EcoReportResult data={reportData} onBack={handleBack} />;
}

/**
 * 環境配慮商品購入レポート結果ページ
 */
export default function EcoReportResultPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="min-h-screen bg-gray-50">
        <Breadcrumb />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* サイドバー */}
            <div className="lg:col-span-1 print:hidden">
              <MyPageSidebar />
            </div>

            {/* メインコンテンツ */}
            <div className="lg:col-span-3 print:col-span-4">
              <div className="bg-white rounded-lg shadow-sm p-8 print:shadow-none print:p-0">
                <Suspense
                  fallback={
                    <div className="flex justify-center items-center py-20">
                      <div className="text-gray-500">読み込み中...</div>
                    </div>
                  }
                >
                  <EcoReportResultContent />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
