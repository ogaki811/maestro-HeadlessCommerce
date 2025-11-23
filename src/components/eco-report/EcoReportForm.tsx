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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* APIエラー表示 */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{apiError}</p>
        </div>
      )}

      {/* 作成対象セクション */}
      <div>
        {/* セクションヘッダー */}
        <h2 className="text-lg font-bold text-gray-900 flex items-center mb-6">
          <span className="w-1 h-6 bg-[#d4a017] mr-3"></span>
          作成対象
        </h2>

        {/* 説明文 */}
        <div className="mb-8 text-sm text-gray-600 space-y-1">
          <p>※過去一年分の環境配慮商品購入レポートを作成します。</p>
          <p>※作成対象を選択し、「レポート作成」ボタンをクリックしてください。</p>
          <p>※レポート作成には多少時間が掛かる場合があります。</p>
        </div>

        {/* フォームフィールド - 横並び */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* 対象コード */}
          <Select
            value={formData.targetCode}
            onChange={(e) => updateField('targetCode', e.target.value)}
            options={targetCodeOptions.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            error={errors.targetCode}
            className="min-w-[200px]"
          />

          {/* 集計方式 */}
          <Select
            value={formData.aggregationType}
            onChange={(e) =>
              updateField('aggregationType', e.target.value as AggregationType)
            }
            options={AGGREGATION_TYPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            className="min-w-[140px]"
          />

          {/* 集計締日 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">集計締日：</span>
            <Select
              value={String(formData.closingDay)}
              onChange={(e) => updateField('closingDay', Number(e.target.value))}
              options={CLOSING_DAY_OPTIONS}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="min-w-[200px] bg-[#d4a017] hover:bg-[#b8890f] text-white"
        >
          レポート作成
        </Button>
      </div>
    </form>
  );
};

export default EcoReportForm;
