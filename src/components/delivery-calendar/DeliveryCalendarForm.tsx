'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  DeliveryPattern,
  DayOfWeek,
  ALL_DAYS,
  DAY_OF_WEEK_LABELS,
} from '@/types/delivery-calendar';

/** 注意事項リスト */
const NOTICE_ITEMS = [
  'ご注文ごとに希望納期を入れることで設定曜日外の配送も可能です（日祝はご指定いただけません）',
  '希望日が祝日等配送を行っていない場合は次の希望曜日の配送となります',
  '在庫欠品が発生した場合は適用されない場合があります',
  'トラックマーク商品、メーカー直送品、取寄せ商品、みつかるマート商品、スタンプ＆ネームプレート作成サービス等のサービス、FAXでのご注文には適用されません',
  '承認発注をご利用の場合、承認のタイミングによっては、希望曜日が適用できない場合があります',
  '複数回ご注文いただき、希望納期が同日となった場合でも梱包が分かれてお届けになることがあります',
];

/**
 * 配送カレンダー登録フォームコンポーネント
 */
export const DeliveryCalendarForm: React.FC = () => {
  const [deliveryPattern, setDeliveryPattern] = useState<DeliveryPattern>('weekdays');
  const [customDays, setCustomDays] = useState<DayOfWeek[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 配送パターン変更ハンドラ
  const handlePatternChange = useCallback((pattern: DeliveryPattern) => {
    setDeliveryPattern(pattern);
    setValidationError(null);
  }, []);

  // 曜日選択ハンドラ
  const handleDayToggle = useCallback((day: DayOfWeek) => {
    setCustomDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
    setValidationError(null);
  }, []);

  // フォーム送信ハンドラ
  const handleSubmit = useCallback(async () => {
    // カスタマイズ時のバリデーション
    if (deliveryPattern === 'custom' && customDays.length === 0) {
      setValidationError('必ず一つ以上にチェックを入れてください');
      return;
    }

    setIsSubmitting(true);

    try {
      const body: { deliveryPattern: DeliveryPattern; customDays?: DayOfWeek[] } = {
        deliveryPattern,
      };

      if (deliveryPattern === 'custom') {
        body.customDays = customDays;
      }

      const response = await fetch('/api/delivery-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      toast.success('配送カレンダーを登録しました');
    } catch {
      toast.error('登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [deliveryPattern, customDays]);

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h1 className="text-3xl font-medium text-gray-900 mb-8 pb-2 border-b-2 border-black">
        配送カレンダー登録機能(スマートデリバリー)
      </h1>

      {/* 配送パターン選択 */}
      <div className="space-y-4">
        <div className="space-y-3">
          {/* 月〜金曜日配送 */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="deliveryPattern"
              value="weekdays"
              checked={deliveryPattern === 'weekdays'}
              onChange={() => handlePatternChange('weekdays')}
              className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
            />
            <span className="ml-2 text-gray-700">月〜金曜日配送</span>
          </label>

          {/* 月〜土曜日配送 */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="deliveryPattern"
              value="weekdaysAndSaturday"
              checked={deliveryPattern === 'weekdaysAndSaturday'}
              onChange={() => handlePatternChange('weekdaysAndSaturday')}
              className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
            />
            <span className="ml-2 text-gray-700">月〜土曜日配送</span>
          </label>

          {/* 配送日カスタマイズ */}
          <label className="flex items-center cursor-pointer flex-wrap">
            <input
              type="radio"
              name="deliveryPattern"
              value="custom"
              checked={deliveryPattern === 'custom'}
              onChange={() => handlePatternChange('custom')}
              className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
            />
            <span className="ml-2 text-[#E85D04] font-medium">配送日カスタマイズ</span>
            <span className="ml-2 text-sm text-gray-500">
              週3日以内の設定推奨(物流負荷軽減のためご協力お願いします)
            </span>
          </label>
        </div>

        {/* 曜日選択テーブル（カスタマイズ時のみ表示） */}
        {deliveryPattern === 'custom' && (
          <div className="mt-4 border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
              希望日にチェックを入れてください
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-6 gap-4">
                {ALL_DAYS.map((day) => (
                  <label
                    key={day}
                    className="flex flex-col items-center cursor-pointer p-2 rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      aria-label={DAY_OF_WEEK_LABELS[day]}
                      checked={customDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="mt-1 text-sm text-gray-700">{DAY_OF_WEEK_LABELS[day]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 注意事項 */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <h2 className="font-medium text-gray-900 mb-2">【注意事項】</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          {NOTICE_ITEMS.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

      {/* 登録ボタン */}
      <div className="flex flex-col items-center space-y-2">
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          登録する
        </Button>

        {/* バリデーションエラー */}
        {validationError && (
          <p className="text-red-500 text-sm">{validationError}</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryCalendarForm;
