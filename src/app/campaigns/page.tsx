'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';
import { campaigns } from '@/data/campaigns';

export default function CampaignsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="ec-campaigns">
        <Breadcrumb />

        <section className="ec-campaigns__section py-12 bg-gray-50">
          <div className="ec-campaigns__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ページタイトル */}
            <div className="ec-campaigns__header mb-8">
              <h1 className="ec-campaigns__title text-3xl font-bold text-gray-900 mb-2">
                キャンペーン一覧
              </h1>
              <p className="ec-campaigns__description text-gray-600">
                お得なキャンペーン情報をチェックしよう
              </p>
            </div>

            {/* キャンペーングリッド */}
            <div className="ec-campaigns__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="ec-campaigns__card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="ec-campaigns__image-wrapper relative aspect-[16/9] bg-gray-200">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ec-campaigns__content p-6">
                    <h2 className="ec-campaigns__card-title text-xl font-bold text-gray-900 mb-2">
                      {campaign.title}
                    </h2>
                    <p className="ec-campaigns__card-description text-gray-600 text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>
                    <div className="ec-campaigns__meta flex items-center justify-between text-xs text-gray-500">
                      <span>
                        期間: {new Date(campaign.startDate).toLocaleDateString('ja-JP')} 〜{' '}
                        {new Date(campaign.endDate).toLocaleDateString('ja-JP')}
                      </span>
                      {campaign.featured && (
                        <span className="ec-campaigns__badge bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          注目
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
