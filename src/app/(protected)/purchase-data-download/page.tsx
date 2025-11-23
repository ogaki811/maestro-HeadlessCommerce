'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { PurchaseDataDownloadForm } from '@/components/purchase-data-download';
import { Button } from '@/components/ui/Button';
import { PurchaseDataSearchForm } from '@/types/purchase-data';

/**
 * 購入データダウンロードページ
 * TOC/Wholesale ユーザー専用
 */
export default function PurchaseDataDownloadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (data: PurchaseDataSearchForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/purchase-data/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          setError('検索条件に該当する購入データが見つかりませんでした。');
          return;
        }
        throw new Error(errorData.message || 'ダウンロードに失敗しました。');
      }

      // ファイルダウンロード処理
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `purchase_data_${new Date().toISOString().split('T')[0]}.${data.dataFormat === 'csv' ? 'csv' : 'xlsx'}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('データの取得に失敗しました。時間をおいて再度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMacroDownload = () => {
    // TODO: マクロファイルのダウンロード処理
    window.open('/downloads/excel-macro-guide.zip', '_blank');
  };

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
                  購入データダウンロード
                </h1>

                {/* 説明文 */}
                <div className="mb-6 text-sm text-gray-600 space-y-1">
                  <p>・過去18ヶ月の購入データの中から、条件を指定し、パソコンにCSVまたはエクセルファイルとしてダウンロードできます。</p>
                  <p>・前日までの購入データを対象としています。</p>
                </div>

                {/* エラーメッセージ */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* フォーム */}
                <div className="mb-8">
                  <PurchaseDataDownloadForm
                    onSubmit={handleDownload}
                    isLoading={isLoading}
                  />
                </div>

                {/* マクロ・項目説明書セクション */}
                <div className="mt-12 bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-700 mb-2">
                    ダウンロードしたCSVファイルをエクセルに自動展開するツールです。
                  </p>
                  <p className="text-sm text-gray-700 mb-6">
                    また各項目の意味、レイアウトを説明した「項目説明書」もこちらからダウンロードできます。
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleMacroDownload}
                    className="px-8 py-3"
                  >
                    エクセル展開マクロ・項目説明書はこちら
                  </Button>
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
