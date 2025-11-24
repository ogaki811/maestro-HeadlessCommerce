'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  EcoReportRequest,
  EcoReportFormErrors,
  TargetCodeOption,
  AggregationType,
  AGGREGATION_TYPE_OPTIONS,
  CLOSING_DAY_OPTIONS,
} from '@/types/eco-report';

interface EcoReportFormProps {
  onSubmit: (data: EcoReportRequest) => Promise<void>;
  targetCodeOptions: TargetCodeOption[];
  isLoading?: boolean;
}

/**
 * 環境配慮商品購入レポート作成フォームコンポーネント
 */
export const EcoReportForm: React.FC<EcoReportFormProps> = ({
  onSubmit,
  targetCodeOptions,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<EcoReportRequest>({
    targetCode: targetCodeOptions[0]?.value || '',
    aggregationType: 'amount',
    closingDay: 20,
  });
  const [errors, setErrors] = useState<EcoReportFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // バリデーション
  const validate = useCallback((): boolean => {
    const newErrors: EcoReportFormErrors = {};

    if (!formData.targetCode) {
      newErrors.targetCode = '対象コードを選択してください。';
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
        setApiError('レポートの作成に失敗しました。時間をおいて再度お試しください。');
      }
    }
  };

  // フィールド更新
  const updateField = <K extends keyof EcoReportRequest>(
    field: K,
    value: EcoReportRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof EcoReportFormErrors]) {
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

      {/* 作成対象セクション */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* セクションヘッダー */}
        <div className="px-4 py-3 border-b border-gray-300 bg-white">
          <h2 className="text-base font-bold text-gray-900 flex items-center">
            <span className="w-1 h-5 bg-[#2d2626] mr-3"></span>
            作成対象
          </h2>
        </div>

        {/* フォームテーブル */}
        <div className="divide-y divide-gray-200">
          {/* 対象コード */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">対象コード</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <Select
                value={formData.targetCode}
                onChange={(e) => updateField('targetCode', e.target.value)}
                options={targetCodeOptions.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                error={errors.targetCode}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* 集計方式 */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">集計方式</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <Select
                value={formData.aggregationType}
                onChange={(e) =>
                  updateField('aggregationType', e.target.value as AggregationType)
                }
                options={AGGREGATION_TYPE_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* 集計締日 */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-40 px-4 py-3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="text-sm font-medium text-gray-700">集計締日</label>
            </div>
            <div className="flex-1 px-4 py-3 bg-white">
              <div className="flex items-center gap-2">
                <Select
                  value={String(formData.closingDay)}
                  onChange={(e) => updateField('closingDay', Number(e.target.value))}
                  options={CLOSING_DAY_OPTIONS}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">日</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          className="min-w-[200px]"
        >
          レポート作成
        </Button>
      </div>
    </form>
  );
};

export default EcoReportForm;
