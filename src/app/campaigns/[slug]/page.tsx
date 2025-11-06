import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { campaignsApi, productsApi } from '@/lib/api-client';
import { formatCampaignPeriod, getCampaignStatus } from '@/types/campaign';

type Props = {
  params: { slug: string };
};

/**
 * キャンペーン詳細ページ
 * /campaigns/[slug]
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await campaignsApi.getCampaign(params.slug);

    if (!response.success) {
      return {
        title: 'キャンペーンが見つかりません',
      };
    }

    const campaign = response.data;

    return {
      title: `${campaign.title} - smartsample`,
      description: campaign.description,
      openGraph: {
        title: campaign.title,
        description: campaign.description,
        images: campaign.bannerImageUrl ? [campaign.bannerImageUrl] : [],
        type: 'website',
      },
      twitter: {
        title: campaign.title,
        description: campaign.description,
        card: 'summary_large_image',
      },
    };
  } catch (error) {
    return {
      title: 'キャンペーンが見つかりません',
    };
  }
}

export default async function CampaignDetailPage({ params }: Props) {
  // キャンペーン情報取得
  let campaign;
  try {
    const response = await campaignsApi.getCampaign(params.slug);

    if (!response.success || !response.data) {
      notFound();
    }

    campaign = response.data;
  } catch (error) {
    console.error('Failed to fetch campaign:', error);
    notFound();
  }

  // キャンペーンステータス取得
  const campaignStatus = getCampaignStatus(campaign);
  const periodText = formatCampaignPeriod(campaign);

  // 対象商品を取得
  const products = [];
  try {
    // TODO: 商品APIでIDフィルタリングをサポートする必要がある
    // 現在は全商品取得してフィルタリング
    const productsResponse = await productsApi.getProducts({ limit: 100 });

    // productIdsで絞り込み
    const filteredProducts = productsResponse.products.filter((product: any) =>
      campaign.productIds.includes(product.id.toString())
    );

    products.push(...filteredProducts);
  } catch (error) {
    console.error('Failed to fetch campaign products:', error);
  }

  return (
    <>
      {/* JSON-LD 構造化データ - Event */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: campaign.title,
            description: campaign.description,
            image: campaign.bannerImageUrl,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            location: {
              '@type': 'VirtualLocation',
              url: `https://smartsample.example.com/campaigns/${campaign.slug}`,
            },
          }),
        }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* キャンペーンバナー */}
          <section className="ec-campaign-banner bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="ec-campaign-banner__image-container">
                <img
                  src={campaign.bannerImageUrl}
                  alt={campaign.title}
                  className="ec-campaign-banner__image w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </section>

          {/* キャンペーン情報 */}
          <section className="ec-campaign-info py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="ec-campaign-info__header mb-6">
                {/* ステータスバッジ */}
                <div className="ec-campaign-info__status mb-4">
                  {campaignStatus === 'active' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      開催中
                    </span>
                  )}
                  {campaignStatus === 'upcoming' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      開催予定
                    </span>
                  )}
                  {campaignStatus === 'ended' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      終了
                    </span>
                  )}
                </div>

                {/* タイトル */}
                <h1 className="ec-campaign-info__title text-4xl font-bold text-gray-900 mb-4">
                  {campaign.title}
                </h1>

                {/* 期間 */}
                <div className="ec-campaign-info__period text-gray-600 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">{periodText}</span>
                </div>

                {/* 説明 */}
                <p className="ec-campaign-info__description text-lg text-gray-700 leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              {/* 詳細コンテンツ（Markdownサポート予定） */}
              {campaign.content && (
                <div className="ec-campaign-info__content mt-8 prose prose-lg max-w-none">
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: campaign.content.replace(/\\n/g, '<br />') }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* 対象商品一覧 */}
          <section className="ec-campaign-products py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">対象商品</h2>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">対象商品が見つかりませんでした。</p>
                </div>
              ) : (
                <div className="ec-campaign-products__grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* 商品数表示 */}
              {products.length > 0 && (
                <div className="ec-campaign-products__count mt-8 text-center text-gray-600">
                  全 {products.length} 件の商品
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
