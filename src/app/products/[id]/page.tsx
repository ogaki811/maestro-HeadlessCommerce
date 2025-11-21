import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import RelatedProducts from '@/components/product/RelatedProducts';
import { sampleProducts } from '@/data/sampleProducts';
import { productsApi } from '@/lib/api-client';

/**
 * 商品データ取得関数（Request Memoization）
 * generateMetadataとPageコンポーネントで重複リクエストを防ぐ
 */
const getProductData = cache(async (id: string) => {
  // ローディングUI確認用の意図的な遅延（2秒）
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // Composer APIからデータ取得
    const apiProduct = await productsApi.getProduct(id);
    if (apiProduct) {
      return apiProduct;
    }
  } catch (error) {
    console.error('Failed to fetch product from Composer API:', error);
  }

  // フォールバック: sampleProductsから検索
  return sampleProducts.find((p) => p.id === id);
});

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// 動的メタデータ生成
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productData = await getProductData(id);

  if (!productData) {
    return {
      title: '商品が見つかりません - smartsample',
    };
  }

  const brand = productData.brand || 'smartsample';

  return {
    title: `${productData.name} - ${brand} | smartsample`,
    description: `${productData.name}は、${brand}が提供する高品質な商品です。`,
    keywords: [productData.name, brand, productData.category, productData.code, 'オフィス用品', '事務用品'],
    openGraph: {
      title: `${productData.name} - ${brand}`,
      description: `${productData.name}の詳細情報`,
      type: 'website',
      locale: 'ja_JP',
      siteName: 'smartsample',
      images: productData.images && productData.images.length > 0 ? [
        {
          url: productData.images[0],
          width: 800,
          height: 800,
          alt: productData.name,
        },
      ] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  // 商品データを取得（メモ化されているため高速）
  const productData = await getProductData(id);

  if (!productData) {
    notFound();
  }

  // brandのフォールバック処理
  const brand = productData.brand || 'smartsample';
  const rating = productData.rating || 4.5;

  // 商品詳細用データを拡張
  const product: any = {
    ...(productData as any),
    brand,
    rating,
    images: productData.images || ['/img/products/placeholder.png'],
    stock: productData.stock ?? 0,
    originalPrice: (productData.tags && productData.tags.includes('セール')) ? Math.round(productData.price * 1.2) : null,
    description: `${productData.name}は、${brand}が提供する高品質な商品です。オフィスや家庭でお使いいただける定番商品で、丈夫な作りで長くお使いいただけます。`,
    features: [
      '高品質な素材で長期間使用可能',
      '使いやすいデザイン',
      '信頼のブランド品質',
      '日本国内配送対応',
    ],
    specs: [
      { label: 'ブランド', value: brand },
      { label: 'カテゴリ', value: productData.category },
      { label: '商品コード', value: productData.code },
      { label: '評価', value: `${rating} / 5.0` },
    ],
  };

  // JSON-LD 構造化データ - Product
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.code,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://smartsample.example.com/products/${product.id}`,
      priceCurrency: 'JPY',
      price: product.price,
      availability: (product.stock as number) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'smartsample',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: product.reviewCount || 89,
    },
  };

  // JSON-LD 構造化データ - BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://smartsample.example.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '商品一覧',
        item: 'https://smartsample.example.com/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="ec-product-detail flex-grow">
        <Breadcrumb />

        {/* 商品詳細セクション */}
        <section className="ec-product-detail__main py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductDetailClient product={product} />

            {/* 商品説明 */}
            <div className="ec-product-detail__description mt-12 border-t border-gray-200 pt-8">
              <h2 className="ec-product-detail__section-title text-2xl font-bold text-gray-900 mb-4">商品説明</h2>
              <p className="ec-product-detail__description-text text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* 商品仕様 */}
            <div className="ec-product-detail__specs mt-12 border-t border-gray-200 pt-8">
              <h2 className="ec-product-detail__section-title text-2xl font-bold text-gray-900 mb-4">商品仕様</h2>
              <div className="ec-product-detail__specs-table bg-gray-50 rounded-lg p-6">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {product.specs.map((spec: { label: string; value: any }, index: number) => (
                      <tr key={index} className="ec-product-detail__spec-row">
                        <td className="ec-product-detail__spec-label py-3 pr-6 text-sm font-medium text-gray-700 w-1/4">{spec.label}</td>
                        <td className="ec-product-detail__spec-value py-3 text-sm text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 関連商品（Suspenseで遅延読み込み） */}
        <Suspense fallback={
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <RelatedProducts category={productData.category} currentId={id} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
