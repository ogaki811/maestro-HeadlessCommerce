'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function AdminControlPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hasAccess, setHasAccess] = useState(false);
  const [controlMode, setControlMode] = useState<'locked' | 'standard'>('standard');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // ロールチェック: スーパー管理者のみアクセス可能
    if (user && user.role === 'super_admin') {
      setHasAccess(true);
    } else {
      toast.error('このページへのアクセス権限がありません');
      router.push('/mypage');
    }
  }, [isAuthenticated, user, router]);

  const handleSave = () => {
    // 実際の実装では、ここでAPI呼び出しを行う
    toast.success('設定を保存しました');
  };

  if (!isAuthenticated || !hasAccess) {
    return null; // リダイレクト中
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  管理者メニュー利用制御
                </h1>
                <p className="text-sm text-gray-600 mb-8">
                  （スーパー管理者（本部管理者）のみ設定可能です。）
                </p>

                {/* 設定オプション */}
                <div className="space-y-6">
                  {/* オプション1: ロックモード */}
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="controlMode"
                      value="locked"
                      checked={controlMode === 'locked'}
                      onChange={(e) => setControlMode(e.target.value as 'locked')}
                      className="mt-1 w-5 h-5 text-black border-gray-300 focus:ring-black"
                    />
                    <div className="flex-1">
                      <span className="text-gray-900 group-hover:text-black transition-colors">
                        管理者メニュー及びWeb
                        IDの新規取得をスーパー管理者（本部管理者）のみしか設定できないようロックする。
                      </span>
                    </div>
                  </label>

                  {/* オプション2: 標準モード */}
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="controlMode"
                      value="standard"
                      checked={controlMode === 'standard'}
                      onChange={(e) => setControlMode(e.target.value as 'standard')}
                      className="mt-1 w-5 h-5 text-black border-gray-300 focus:ring-black"
                    />
                    <div className="flex-1">
                      <span className="text-gray-900 group-hover:text-black transition-colors">
                        管理者メニューを各現場の管理者でも使用できるようにする。またWeb
                        IDの新規取得も自由にできるようにする。（標準値）
                      </span>
                    </div>
                  </label>
                </div>

                {/* 保存ボタン */}
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSave} size="lg">
                    設定
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
