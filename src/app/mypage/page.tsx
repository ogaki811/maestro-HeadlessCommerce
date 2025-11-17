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

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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
              {/* 詳細情報 */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* ご登録情報 */}
                <SectionCard
                  title="ご登録情報"
                  headerColor="orange"
                  actionLink={{
                    text: 'ご登録情報の修正',
                    href: '/mypage/settings/edit',
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoTable data={mockUserProfile} />
                    <InfoTable data={mockUserPermissions} />
                  </div>
                </SectionCard>

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

                {/* 会社情報 */}
                <SectionCard
                  title="会社情報"
                  headerColor="orange"
                  actionLink={{
                    text: '会社情報の確認',
                    href: '/mypage/company',
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoTable data={mockCompanyInfo} />
                    <InfoTable data={mockCompanyCodes} />
                  </div>
                </SectionCard>

                {/* ポイント情報 */}
                <SectionCard title="ポイント情報" headerColor="orange">
                  <PointCard
                    currentPoints={mockPointInfo.currentPoints}
                    expiringThisMonth={mockPointInfo.expiringThisMonth}
                    expiringNextMonth={mockPointInfo.expiringNextMonth}
                  />
                </SectionCard>

                {/* お問い合わせ・ご利用ガイドはこちら */}
                <SectionCard title="お問い合わせ・ご利用ガイドはこちら" headerColor="teal" className="mb-0">
                  <QuickLinksCard links={mockHelpLinks} />
                </SectionCard>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
