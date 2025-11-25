'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import useAuthStore from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import type { SpecialOrderType, SpecialOrderItem } from '@/types/special-order';

// 初期行データ
const createEmptyRow = (): SpecialOrderItem => ({
  productName: '',
  manufacturer: '',
  quantity: undefined,
  unit: '',
  note: '',
});

export default function NewSpecialOrderPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orderType, setOrderType] = useState<SpecialOrderType>('quote');
  const [items, setItems] = useState<SpecialOrderItem[]>(
    Array.from({ length: 10 }, () => createEmptyRow())
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // フィールド更新
  const handleItemChange = (
    index: number,
    field: keyof SpecialOrderItem,
    value: string | number | undefined
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);

    // エラークリア
    if (errors[index]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index] || {}).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: { [key: number]: { [field: string]: string } } = {};
    let hasData = false;

    items.forEach((item, index) => {
      const rowErrors: { [field: string]: string } = {};

      // 商品名・単位のいずれかが入力されている場合はその行は入力ありとみなす
      if (item.productName || item.manufacturer || item.quantity || item.unit || item.note) {
        hasData = true;

        // 商品名チェック（必須）
        if (!item.productName?.trim()) {
          rowErrors.productName = '商品名は必須です';
        } else if (item.productName.length > 50) {
          rowErrors.productName = '商品名は全角50桁以内で入力してください';
        }

        // 単位チェック（必須）
        if (!item.unit?.trim()) {
          rowErrors.unit = '単位は必須です';
        } else if (item.unit.length > 5) {
          rowErrors.unit = '単位は全角5桁以内で入力してください';
        }

        // メーカー名チェック
        if (item.manufacturer && item.manufacturer.length > 20) {
          rowErrors.manufacturer = 'メーカー名は全角20桁以内で入力してください';
        }

        // 数量チェック
        if (item.quantity !== undefined) {
          const quantityStr = String(item.quantity);
          if (quantityStr.length > 5) {
            rowErrors.quantity = '数量は半角5桁以内で入力してください';
          }
          if (item.quantity <= 0) {
            rowErrors.quantity = '数量は1以上で入力してください';
          }
        }

        // 備考チェック
        if (item.note && item.note.length > 20) {
          rowErrors.note = '備考は全角20桁以内で入力してください';
        }
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[index] = rowErrors;
      }
    });

    setErrors(newErrors);

    // データが1行も入力されていない場合
    if (!hasData) {
      toast.error('商品情報を1行以上入力してください');
      return false;
    }

    // バリデーションエラーがある場合
    if (Object.keys(newErrors).length > 0) {
      toast.error('入力内容に誤りがあります。赤字の項目を修正してください');
      return false;
    }

    return true;
  };

  // 依頼実行
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 入力されている行のみ抽出
      const validItems = items.filter(
        (item) => item.productName?.trim() || item.manufacturer || item.quantity || item.unit?.trim() || item.note
      );

      const response = await fetch('/api/special-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: orderType,
          items: validItems,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '依頼に失敗しました');
      }

      toast.success(
        orderType === 'quote' ? '見積依頼を送信しました' : '注文依頼を送信しました'
      );

      // 成功したら一覧ページへ遷移
      router.push('/mypage/special-order/history');
    } catch (error) {
      console.error('Special order submission error:', error);
      toast.error(
        error instanceof Error ? error.message : '依頼の送信に失敗しました'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 入力クリア
  const handleClear = () => {
    if (window.confirm('入力内容をクリアしてもよろしいですか？')) {
      setItems(Array.from({ length: 10 }, () => createEmptyRow()));
      setErrors({});
      setOrderType('quote');
      toast.success('入力内容をクリアしました');
    }
  };

  // 戻る
  const handleBack = () => {
    router.push('/mypage/special-order');
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
                {/* 販売店対応バッジ */}
                <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  販売店対応
                </div>

                {/* ページタイトル */}
                <h1 className="text-3xl font-medium text-gray-900 mb-2 pb-2 border-b-2 border-black">
                  取寄せ依頼
                </h1>

                {/* フォーム */}
                <div className="mt-8">
                  {/* 種別選択 */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      種別 <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="orderType"
                          value="quote"
                          checked={orderType === 'quote'}
                          onChange={(e) => setOrderType(e.target.value as SpecialOrderType)}
                          className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <span className="ml-2 text-gray-700">見積依頼</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="orderType"
                          value="order"
                          checked={orderType === 'order'}
                          onChange={(e) => setOrderType(e.target.value as SpecialOrderType)}
                          className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <span className="ml-2 text-gray-700">注文</span>
                      </label>
                    </div>
                  </div>

                  {/* 商品入力テーブル */}
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300 w-12">
                            No
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                            商品名 <span className="text-red-600">*</span>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300">
                            メーカー名
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300 w-24">
                            数量
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-r border-gray-300 w-24">
                            単位 <span className="text-red-600">*</span>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">
                            備考
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="border-t border-gray-300">
                            <td className="px-3 py-2 text-sm text-gray-700 border-r border-gray-300 text-center">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 border-r border-gray-300">
                              <input
                                type="text"
                                value={item.productName}
                                onChange={(e) =>
                                  handleItemChange(index, 'productName', e.target.value)
                                }
                                className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                                  errors[index]?.productName
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                                placeholder="全角50桁以内"
                              />
                              {errors[index]?.productName && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors[index].productName}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-2 border-r border-gray-300">
                              <input
                                type="text"
                                value={item.manufacturer}
                                onChange={(e) =>
                                  handleItemChange(index, 'manufacturer', e.target.value)
                                }
                                className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                                  errors[index]?.manufacturer
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                                placeholder="全角20桁以内"
                              />
                              {errors[index]?.manufacturer && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors[index].manufacturer}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-2 border-r border-gray-300">
                              <input
                                type="number"
                                value={item.quantity ?? ''}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'quantity',
                                    e.target.value ? Number(e.target.value) : undefined
                                  )
                                }
                                className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                                  errors[index]?.quantity
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                                placeholder="半角5桁"
                                min="1"
                              />
                              {errors[index]?.quantity && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors[index].quantity}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-2 border-r border-gray-300">
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) =>
                                  handleItemChange(index, 'unit', e.target.value)
                                }
                                className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                                  errors[index]?.unit
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                                placeholder="全角5桁"
                              />
                              {errors[index]?.unit && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors[index].unit}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={item.note}
                                onChange={(e) =>
                                  handleItemChange(index, 'note', e.target.value)
                                }
                                className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${
                                  errors[index]?.note
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                                placeholder="全角20桁"
                              />
                              {errors[index]?.note && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors[index].note}
                                </p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 注意事項 */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">※ </span>
                      商品名と単位は必須項目です。入力された行のみ依頼されます。
                    </p>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-primary text-white font-bold rounded hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '送信中...' : '依頼を行う'}
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      入力クリア
                    </button>
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      戻る
                    </button>
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
