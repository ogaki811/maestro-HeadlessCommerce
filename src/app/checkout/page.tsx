'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import StepIndicator from '@/components/common/StepIndicator';
import { Checkbox } from '@/components/ui/Checkbox';
import CustomerInfoForm from '@/components/checkout/CustomerInfoForm';
import ShippingInfoForm from '@/components/checkout/ShippingInfoForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import DeliveryDateSelector from '@/components/checkout/DeliveryDateSelector';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import usePostalCode from '@/hooks/usePostalCode';
import useFormPersist from '@/hooks/useFormPersist';
import { ordersApi } from '@/lib/api-client';

/**
 * Checkout Page (Client Component)
 * 注文確認・決済ページ（クライアントコンポーネント）
 *
 * ヘッドレスコマース設計:
 * - 注文作成時にComposer APIを呼び出し
 * - カートデータとの同期
 * - 商流別決済方法の制御
 */

// 配送時間のラベルを取得
const getDeliveryTimeLabel = (value: string): string => {
  const timeMap: Record<string, string> = {
    'morning': '午前中',
    '12-14': '12:00-14:00',
    '14-16': '14:00-16:00',
    '16-18': '16:00-18:00',
    '18-20': '18:00-20:00',
    '19-21': '19:00-21:00',
  };
  return timeMap[value] || '指定なし';
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, getTotal, getShippingFee, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { searchAddress, loading: postalLoading, error: postalError, clearError } = usePostalCode();

  // フォームデータ初期化
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    paymentMethod: 'credit',
    deliveryDate: '',
    deliveryTime: '',
    usePoints: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // フォーム永続化
  const { getStoredData, clearStoredData } = useFormPersist('checkout-form-storage', formData);

  // ユーザー情報自動入力と保存データ復元（初回マウント時のみ）
  useEffect(() => {
    // 保存されたフォームデータを復元
    const storedData = getStoredData();
    if (storedData) {
      setFormData(storedData);
      return;
    }

    // ログインユーザーの情報を自動入力
    if (isAuthenticated && user) {
      const [lastName = '', firstName = ''] = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        lastName,
        firstName,
        email: user.email || '',
        phone: user.phoneNumber || '',
        postalCode: user.postalCode || '',
        prefecture: user.prefecture || '',
        city: user.city || '',
        address: user.address || '',
        building: user.building || '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // フォーム変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // エラークリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 郵便番号検索
  const handlePostalCodeSearch = async () => {
    if (!formData.postalCode) {
      toast.error('郵便番号を入力してください');
      return;
    }

    clearError();
    const result = await searchAddress(formData.postalCode);

    if (result) {
      setFormData(prev => ({
        ...prev,
        prefecture: result.prefecture,
        city: result.city,
        address: result.address,
      }));
      toast.success('住所を自動入力しました');
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 必須項目チェック
    if (!formData.lastName.trim()) newErrors.lastName = '姓を入力してください';
    if (!formData.firstName.trim()) newErrors.firstName = '名を入力してください';
    if (!formData.email.trim()) newErrors.email = 'メールアドレスを入力してください';
    if (!formData.phone.trim()) newErrors.phone = '電話番号を入力してください';
    if (!formData.postalCode.trim()) newErrors.postalCode = '郵便番号を入力してください';
    if (!formData.prefecture) newErrors.prefecture = '都道府県を選択してください';
    if (!formData.city.trim()) newErrors.city = '市区町村を入力してください';
    if (!formData.address.trim()) newErrors.address = '番地を入力してください';

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // 郵便番号形式チェック（000-0000 または 0000000）
    const postalRegex = /^(\d{3}-?\d{4})$/;
    if (formData.postalCode && !postalRegex.test(formData.postalCode)) {
      newErrors.postalCode = '郵便番号は000-0000の形式で入力してください';
    }

    // 電話番号形式チェック
    const phoneRegex = /^[\d-]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = '電話番号は数字とハイフンで入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 注文確定処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // カート空チェック
    if (cartItems.length === 0) {
      toast.error('カートに商品がありません');
      router.push('/cart');
      return;
    }

    if (!validateForm()) {
      toast.error('入力内容に誤りがあります');
      return;
    }

    // Composer APIを呼び出して注文作成
    try {
      const apiOrderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: `${formData.lastName} ${formData.firstName}`,
          postalCode: formData.postalCode,
          prefecture: formData.prefecture,
          city: formData.city,
          address: formData.address,
          building: formData.building,
          phone: formData.phone,
        },
        billingAddress: null, // 請求先が配送先と同じ場合はnull
        paymentMethod: formData.paymentMethod,
        usePoints: formData.usePoints ? (user?.points || 500) : 0,
      };

      const result = await ordersApi.createOrder(apiOrderData);

      // カートをクリア（ローカルストアのみ）
      clearCart();
      clearStoredData();

      // 注文完了ページへ遷移
      toast.success('注文が確定しました');
      router.push(`/order-complete?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Failed to create order via Composer API:', error);

      // エラー表示（フォールバックは削除）
      toast.error('注文の作成に失敗しました。もう一度お試しください。');
    }
  };

  // デモデータ入力
  const handleDemoFill = () => {
    setFormData({
      lastName: '山田',
      firstName: '太郎',
      email: 'demo@example.com',
      phone: '090-1234-5678',
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      address: '千代田1-1-1',
      building: 'サンプルビル101',
      paymentMethod: 'credit',
      deliveryDate: '',
      deliveryTime: 'morning',
      usePoints: false,
    });
    toast.success('デモデータを入力しました');
  };

  // 金額計算
  const subtotal = getTotal();
  const shippingFee = getShippingFee();
  const availablePoints = user?.points || 500;
  const pointsToUse = formData.usePoints ? availablePoints : 0;
  const total = subtotal + shippingFee - pointsToUse;

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
        name: 'カート',
        item: 'https://smartsample.example.com/cart',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ご注文手続き',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="ec-checkout">
        <Breadcrumb />
        <StepIndicator currentStep={2} />

        <section className="ec-checkout__content py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* フォームエリア */}
              <div className="ec-checkout__form-area lg:col-span-2">
                {/* デモデータ入力ボタン */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="ec-checkout__demo-btn w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    デモデータを入力
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="ec-checkout__form space-y-8">
                  {/* お客様情報 */}
                  <CustomerInfoForm
                    formData={{
                      lastName: formData.lastName,
                      firstName: formData.firstName,
                      email: formData.email,
                      phone: formData.phone,
                    }}
                    errors={errors}
                    onChange={handleChange}
                  />

                  {/* 配送先情報 */}
                  <ShippingInfoForm
                    formData={{
                      postalCode: formData.postalCode,
                      prefecture: formData.prefecture,
                      city: formData.city,
                      address: formData.address,
                      building: formData.building,
                    }}
                    errors={errors}
                    postalError={postalError}
                    postalLoading={postalLoading}
                    onChange={handleChange}
                    onPostalCodeSearch={handlePostalCodeSearch}
                  />

                  {/* 配送日時指定 */}
                  <DeliveryDateSelector
                    deliveryDate={formData.deliveryDate}
                    deliveryTime={formData.deliveryTime}
                    onChange={handleChange}
                  />

                  {/* お支払い方法 */}
                  <PaymentMethodSelector
                    value={formData.paymentMethod as 'credit' | 'bank' | 'cod' | 'paypay'}
                    onChange={handleChange}
                  />

                  {/* ポイント使用 */}
                  {isAuthenticated && availablePoints > 0 && (
                    <div className="ec-checkout__points bg-white rounded-lg border border-gray-200 p-6">
                      <Checkbox
                        id="usePoints"
                        name="usePoints"
                        checked={formData.usePoints}
                        onChange={handleChange}
                        label={`保有ポイントを使用する (${availablePoints}ポイント利用可能)`}
                      />
                    </div>
                  )}
                </form>
              </div>

              {/* 注文サマリー */}
              <CheckoutSummary
                items={cartItems}
                subtotal={subtotal}
                shippingFee={shippingFee}
                pointsUsed={pointsToUse}
                total={total}
                onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                className="lg:col-span-1"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
