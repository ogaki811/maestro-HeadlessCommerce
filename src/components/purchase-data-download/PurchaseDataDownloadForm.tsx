'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { DateRangeInput } from './DateRangeInput';
import {
  PurchaseDataSearchForm,
  PurchaseDataFormErrors,
  DATA_FORMAT_OPTIONS,
  FORMAT_OPTIONS,
  CONSIGNMENT_FILTER_OPTIONS,
  TARGET_DATA_OPTIONS,
} from '@/types/purchase-data';

interface PurchaseDataDownloadFormProps {
  onSubmit: (data: PurchaseDataSearchForm) => Promise<void>;
  isLoading?: boolean;
}

// デフォルト値の計算
const getDefaultDates = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const eighteenMonthsAgo = new Date(today);
  eighteenMonthsAgo.setMonth(eighteenMonthsAgo.getMonth() - 18);
  eighteenMonthsAgo.setDate(1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return {
    startDate: formatDate(eighteenMonthsAgo),
    endDate: formatDate(yesterday),
    maxDate: formatDate(yesterday),
  };
};

const getInitialFormState = (): PurchaseDataSearchForm => {
  const { startDate, endDate } = getDefaultDates();
  return {
    startDate,
    endDate,
    dataFormat: 'csv',
    format: 'normal',
    consignmentFilter: 'all',
    targetData: 'own',
    specifiedCode: '',
  };
};

/**
 * 購入データダウンロードフォームコンポーネント
 */
export const PurchaseDataDownloadForm: React.FC<PurchaseDataDownloadFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PurchaseDataSearchForm>(getInitialFormState);
  const [errors, setErrors] = useState<PurchaseDataFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const { maxDate } = getDefaultDates();

  // バリデーション
  const validate = useCallback((): boolean => {
    const newErrors: PurchaseDataFormErrors = {};

    // 日付のバリデーション
    if (!formData.startDate) {
      newErrors.startDate = '開始日を入力してください。';
    }
    if (!formData.endDate) {
      newErrors.endDate = '終了日を入力してください。';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start > end) {
        newErrors.dateRange = '開始日は終了日以前の日付を指定してください。';
      }

      // 18ヶ月チェック
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (diffMonths > 18) {
        newErrors.dateRange = '検索期間は18ヶ月以内で指定してください。';
      }
    }

    // 指定コードのバリデーション
    if (formData.targetData === 'specified' && !formData.specifiedCode?.trim()) {
      newErrors.specifiedCode = 'コードを入力してください。';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('データの取得に失敗しました。時間をおいて再度お試しください。');
      }
    }
  };

  // フォームリセット
  const handleReset = () => {
    setFormData(getInitialFormState());
    setErrors({});
    setApiError(null);
  };

  // フィールド更新
  const updateField = <K extends keyof PurchaseDataSearchForm>(
    field: K,
    value: PurchaseDataSearchForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field as keyof PurchaseDataFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* APIエラー表示 */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{apiError}</p>
        </div>
      )}

      {/* 検索条件入力 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* セクションヘッダー */}
        <div className="px-4 py-3 border-b border-gray-300 bg-white">
          <h2 className="text-base font-bold text-gray-900 flex items-center">
            <span className="w-1 h-5 bg-[#2d2626] mr-3"></span>
            検索条件入力
          </h2>
        </div>

        {/* フォームテーブル */}
        <div className="divide-y divide-gray-200">
          {/* 納品日 */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">納品日</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <DateRangeInput
                label=""
                startDate={formData.startDate}
                endDate={formData.endDate}
                onStartDateChange={(date) => updateField('startDate', date)}
                onEndDateChange={(date) => updateField('endDate', date)}
                maxDate={maxDate}
                error={errors.dateRange || errors.startDate || errors.endDate}
              />
            </div>
          </div>

          {/* データ形式 */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">データ形式</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <Select
                value={formData.dataFormat}
                onChange={(e) => updateField('dataFormat', e.target.value as 'csv' | 'excel')}
                options={DATA_FORMAT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* フォーマット */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">フォーマット</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <Select
                value={formData.format}
                onChange={(e) => updateField('format', e.target.value as 'normal' | 'normal_with_tax')}
                options={FORMAT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                className="max-w-md"
              />
            </div>
          </div>

          {/* 管理受託品 */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">管理受託品</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <Select
                value={formData.consignmentFilter}
                onChange={(e) => updateField('consignmentFilter', e.target.value as 'all' | 'consignment_only' | 'non_consignment')}
                options={CONSIGNMENT_FILTER_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* 対象データ */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">対象データ</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <div className="flex flex-wrap items-center gap-4">
                <Select
                  value={formData.targetData}
                  onChange={(e) => updateField('targetData', e.target.value as 'own' | 'specified')}
                  options={TARGET_DATA_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                  className="max-w-xs"
                />
                {formData.targetData === 'specified' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">コード入力</span>
                    <Input
                      type="text"
                      value={formData.specifiedCode || ''}
                      onChange={(e) => updateField('specifiedCode', e.target.value)}
                      placeholder="(半角)"
                      className="w-40"
                      error={errors.specifiedCode}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={isLoading}
          className="min-w-[160px]"
        >
          入力クリア
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          className="min-w-[200px]"
        >
          ダウンロードデータ作成
        </Button>
      </div>
    </form>
  );
};

export default PurchaseDataDownloadForm;
