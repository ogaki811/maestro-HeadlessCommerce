'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import SectionCard from '@/components/mypage/SectionCard';
import InfoTable from '@/components/mypage/InfoTable';
import PointCard from '@/components/mypage/PointCard';
import ContactCard from '@/components/mypage/ContactCard';
import QuickLinksCard from '@/components/mypage/QuickLinksCard';
import useAuthStore from '@/store/useAuthStore';
import {
  mockUserProfile,
  mockUserPermissions,
  mockCompanyInfo,
  mockCompanyCodes,
  mockPointInfo,
  mockSalesRepInfo,
  mockHelpLinks,
} from '@/data/mockMyPageData';

/**
 * MyPage Dashboard
 * マイページ - ダッシュボード
 *
 * ユーザーの登録情報、会社情報、ポイント情報、
 * 販売店担当営業情報などを表示するダッシュボード。
 */
export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // リダイレクト中
  }

  return (
    <>
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左カラム (2/3幅) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* ご登録情報 */}
                  <SectionCard
                    title="ご登録情報"
                    headerColor="orange"
                    actionLink={{
                      text: 'ご登録情報の修正',
                      href: '/mypage/settings',
                    }}
                  >
                    <InfoTable data={mockUserProfile} className="mb-4" />
                    <InfoTable data={mockUserPermissions} columns={2} />
                  </SectionCard>

                  {/* 会社情報 */}
                  <SectionCard
                    title="会社情報"
                    headerColor="orange"
                    actionLink={{
                      text: '会社情報の確認',
                      href: '/mypage/company',
                    }}
                  >
                    <InfoTable data={mockCompanyInfo} className="mb-4" />
                    <InfoTable data={mockCompanyCodes} columns={2} />
                  </SectionCard>

                  {/* ポイント情報 */}
                  <SectionCard title="ポイント情報" headerColor="orange">
                    <PointCard
                      currentPoints={mockPointInfo.currentPoints}
                      expiringThisMonth={mockPointInfo.expiringThisMonth}
                      expiringNextMonth={mockPointInfo.expiringNextMonth}
                    />
                  </SectionCard>
                </div>

                {/* 右カラム (1/3幅) */}
                <div className="space-y-6">
                  {/* 販売店担当営業情報 */}
                  <SectionCard title="販売店担当営業情報" headerColor="teal">
                    <ContactCard
                      name={mockSalesRepInfo.name}
                      company={mockSalesRepInfo.company}
                      tel={mockSalesRepInfo.tel}
                      fax={mockSalesRepInfo.fax}
                      mobile={mockSalesRepInfo.mobile}
                      email={mockSalesRepInfo.email}
                      avatarUrl={mockSalesRepInfo.avatarUrl}
                      note={mockSalesRepInfo.note}
                    />
                  </SectionCard>

                  {/* お問い合わせ・ご利用ガイドはこちら */}
                  <SectionCard title="お問い合わせ・ご利用ガイドはこちら" headerColor="teal">
                    <QuickLinksCard links={mockHelpLinks} />
                  </SectionCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
