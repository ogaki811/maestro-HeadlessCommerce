'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';

// 注意事項リスト
const NOTICE_ITEMS = [
  '承認設定されている場合、カタログ掲載外商品も承認の対象になります',
  'ポイントの対象とはなりません',
  'smartofficeの注文締め時刻ルール、配送リードタイムルールは適用されません',
  'smartofficeの配送料ルール、返品ルールは適用されません',
  'カタログ掲載品の入力は行わないでください',
  'smartofficeの注文履歴座、購入データダウンロード、環境対応レポートの対象とはなりません',
];

// 販売店情報
const STORE_INFO = {
  storeName: 'スマートオフィス販売店',
  department: '営業担当',
  contact: '長谷部',
  tel: '0358774860',
  fax: '',
  mobile: '',
  email: 'ahasebe@jointex.jp',
};

export default function SpecialOrderPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
                {/* 販売店対応バッジ */}
                <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  販売店対応
                </div>

                {/* ページタイトル */}
                <h1 className="text-3xl font-medium text-gray-900 mb-2 pb-2 border-b-2 border-black">
                  カタログ掲載外取寄せ
                </h1>

                {/* 説明文 */}
                <div className="mt-6 mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    カタログ掲載外商品の取寄せ依頼を
                    <br className="sm:hidden" />
                    担当販売店【 <span className="font-bold">{STORE_INFO.storeName}</span> {STORE_INFO.department}：{STORE_INFO.contact} TEL：{STORE_INFO.tel} 】に対して行います。
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    商品の配送も担当販売店が行い、返品の受け付けも担当販売店が行います。
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    smartofficeカスタマーデスクではお問い合わせをお受けできませんのでご了承ください。
                  </p>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                  {/* 取寄せ依頼 */}
                  <Link href="/mypage/special-order/new" className="w-full md:flex-1">
                    <button
                      type="button"
                      className="w-full px-6 py-4 bg-primary text-white text-base font-bold rounded hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg"
                    >
                      取寄せ依頼
                    </button>
                  </Link>

                  {/* 取寄せ定番一覧 */}
                  <Link href="/mypage/special-order/templates" className="w-full md:flex-1">
                    <button
                      type="button"
                      className="w-full px-6 py-4 bg-gray-100 text-gray-700 text-base font-medium rounded border-2 border-gray-300 hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                    >
                      取寄せ定番一覧
                    </button>
                  </Link>

                  {/* 過去の取寄せ一覧 */}
                  <Link href="/mypage/special-order/history" className="w-full md:flex-1">
                    <button
                      type="button"
                      className="w-full px-6 py-4 bg-gray-100 text-gray-700 text-base font-medium rounded border-2 border-gray-300 hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                    >
                      過去の取寄せ一覧
                    </button>
                  </Link>
                </div>

                {/* 注意事項 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <h2 className="font-bold text-gray-900 mb-3">【注意事項】</h2>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                    {NOTICE_ITEMS.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* 担当取寄せコーナーの依頼先、問い合わせ先 */}
                <div className="bg-orange-50 border-l-4 border-primary p-6">
                  <h2 className="font-bold text-gray-900 mb-4">当取寄せコーナーの依頼先、問い合わせ先</h2>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* 店舗イメージ（アイコン） */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>

                    {/* 販売店情報 */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-3">
                        {STORE_INFO.storeName}
                        <br />
                        <span className="text-base font-normal">{STORE_INFO.department}：{STORE_INFO.contact}</span>
                      </h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex">
                          <span className="w-20 font-medium">TEL</span>
                          <span className="flex-1">: {STORE_INFO.tel || '-'}</span>
                        </div>
                        <div className="flex">
                          <span className="w-20 font-medium">FAX</span>
                          <span className="flex-1">: {STORE_INFO.fax || '-'}</span>
                        </div>
                        <div className="flex">
                          <span className="w-20 font-medium">Mobile</span>
                          <span className="flex-1">: {STORE_INFO.mobile || '-'}</span>
                        </div>
                        <div className="flex">
                          <span className="w-20 font-medium">E-mail</span>
                          <span className="flex-1">: {STORE_INFO.email || '-'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-4">
                        ※当取寄せコーナーの手配状況、価格、納期等は、smartofficeカスタマーデスクではご返答できませんのでご了承ください。
                      </p>
                    </div>
                  </div>
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
