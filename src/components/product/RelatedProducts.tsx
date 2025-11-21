import { productsApi } from '@/lib/api-client';
import { sampleProducts } from '@/data/sampleProducts';
import ProductSlider from '@/components/home/ProductSlider';

interface RelatedProductsProps {
    category: string;
    currentId: string;
}

/**
 * 関連商品取得関数
 * 意図的に遅延させてSuspenseの動作を確認できるようにする場合もあるが、
 * ここでは実際のAPIコールを行う。
 */
const getRelatedProducts = async (category: string, currentId: string) => {
    try {
        const relatedResponse = await productsApi.getProducts({
            category,
            limit: 13,
        });
        return relatedResponse.products
            .filter((p: any) => p.id !== currentId)
            .slice(0, 12);
    } catch (error) {
        console.error('Failed to fetch related products:', error);
        return sampleProducts
            .filter((p) => p.id !== currentId && p.category === category)
            .slice(0, 12);
    }
};

export default async function RelatedProducts({ category, currentId }: RelatedProductsProps) {
    // 非同期でデータを取得
    const relatedProducts = await getRelatedProducts(category, currentId);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="ec-product-detail__related py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="ec-product-detail__section-title text-2xl font-bold text-gray-900 mb-8">関連商品</h2>
                <ProductSlider products={relatedProducts} />
            </div>
        </section>
    );
}
