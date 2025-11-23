'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { EcoReportForm } from '@/components/eco-report';
import useAuthStore from '@/store/useAuthStore';
import { EcoReportRequest, TargetCodeOption } from '@/types/eco-report';
import toast from 'react-hot-toast';

export default function EcoReportPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [targetCodeOptions, setTargetCodeOptions] = useState<TargetCodeOption[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // ユーザー情報から対象コードオプションを設定
    if (user) {
      const options: TargetCodeOption[] = [];

      // ユーザーコード
      if (user.code) {
        options.push({
          value: user.code,
          label: `${user.code} (${user.name || 'ユーザー'})`,
        });
      }

      // 会社コード（Wholesaleの場合）
      if (user.companyCode) {
        options.push({
          value: user.companyCode,
          label: `${user.companyCode} (会社)`,
        });
      }

      // ディーラーコード（TOCの場合）
      if (user.dealerCode) {
        options.push({
          value: user.dealerCode,
          label: `${user.dealerCode} (ディーラー)`,
        });
      }

      // デフォルトオプション（オプションがない場合）
      if (options.length === 0) {
        options.push({
          value: 'default',
          label: 'デフォルト',
        });
      }

      setTargetCodeOptions(options);
    }
  }, [isAuthenticated, router, user]);

  // レポート作成処理
  const handleSubmit = useCallback(async (data: EcoReportRequest) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/eco-report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レポート作成に失敗しました');
      }

      const result = await response.json();

      if (result.downloadUrl) {
        // ダウンロードを開始
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.fileName || 'eco-report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('レポートのダウンロードを開始しました');
      } else {
        toast.success('レポート作成リクエストを受け付けました');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('レポート作成に失敗しました');
    } finally {
      setIsLoading(false);
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
                  環境配慮商品購入レポート作成
                </h1>

                <div className="mt-6">
                  {targetCodeOptions.length > 0 ? (
                    <EcoReportForm
                      onSubmit={handleSubmit}
                      targetCodeOptions={targetCodeOptions}
                      isLoading={isLoading}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">読み込み中...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
