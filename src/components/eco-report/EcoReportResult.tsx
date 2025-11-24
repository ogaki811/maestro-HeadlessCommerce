'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { EcoCategoryBadge } from './EcoCategoryBadge';
import {
  EcoReportResultData,
  EcoReportMonthData,
  EcoReportTotalData,
  EcoCategoryType,
} from '@/types/eco-report';

interface EcoReportResultProps {
  data: EcoReportResultData;
  onBack?: () => void;
}

/**
 * 金額をカンマ区切りでフォーマット
 */
const formatNumber = (value: number): string => {
  return value.toLocaleString('ja-JP');
};

/**
 * 構成比をパーセント表示でフォーマット
 */
const formatRatio = (value: number): string => {
  return `(${value.toFixed(1)}%)`;
};

/**
 * 環境配慮商品購入レポート結果表示コンポーネント
 */
export const EcoReportResult: React.FC<EcoReportResultProps> = ({
  data,
  onBack,
}) => {
  // 印刷ハンドラ
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // 戻るハンドラ
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  // 前半6ヶ月と後半6ヶ月に分割
  const firstHalf = data.monthlyData.slice(0, 6);
  const secondHalf = data.monthlyData.slice(6, 12);

  // データ行をレンダリング
  const renderDataRow = (
    label: string,
    category: EcoCategoryType | null,
    getValue: (m: EcoReportMonthData | EcoReportTotalData) => number,
    getRatio?: (m: EcoReportMonthData | EcoReportTotalData) => number,
    months: EcoReportMonthData[] = [],
    showTotal: boolean = false
  ) => {
    return (
      <>
        {/* ラベルセル */}
        <td className="px-2 py-3 text-left border-r border-gray-200 bg-white min-w-[180px]">
          <div className="flex items-center gap-2">
            {category && <EcoCategoryBadge category={category} />}
            <div>
              <div className="font-medium text-sm">{label}</div>
              {getRatio && <div className="text-xs text-gray-500">(構成比)</div>}
            </div>
          </div>
        </td>
        {/* 月別データセル */}
        {months.map((month, idx) => (
          <td key={idx} className="px-2 py-3 text-center border-r border-gray-200">
            <div className="font-medium">{formatNumber(getValue(month))}</div>
            {getRatio && (
              <div className="text-xs text-gray-500">{formatRatio(getRatio(month))}</div>
            )}
          </td>
        ))}
        {/* 合計セル */}
        {showTotal && (
          <td className="px-2 py-3 text-center bg-gray-50 font-bold">
            <div>{formatNumber(getValue(data.total))}</div>
            {getRatio && (
              <div className="text-xs text-gray-500">{formatRatio(getRatio(data.total))}</div>
            )}
          </td>
        )}
      </>
    );
  };

  // テーブルヘッダーをレンダリング
  const renderTableHeader = (months: EcoReportMonthData[], showTotal: boolean = false) => {
    return (
      <>
        {/* 月行 */}
        <tr className="bg-gray-100">
          <th className="px-2 py-2 border-r border-gray-200"></th>
          {months.map((month, idx) => (
            <th key={idx} className="px-2 py-2 text-center border-r border-gray-200 font-medium">
              {month.month}
            </th>
          ))}
          {showTotal && (
            <th className="px-2 py-2 text-center bg-gray-200 font-medium" rowSpan={2}>
              合計
            </th>
          )}
        </tr>
        {/* 期間行 */}
        <tr className="bg-gray-50 text-xs text-gray-600">
          <th className="px-2 py-1 border-r border-gray-200"></th>
          {months.map((month, idx) => (
            <th key={idx} className="px-2 py-1 text-center border-r border-gray-200 font-normal">
              {month.startDate}
              <br />
              <span className="text-gray-400">▼</span>
              <br />
              {month.endDate}
            </th>
          ))}
        </tr>
      </>
    );
  };

  // テーブルボディをレンダリング
  const renderTableBody = (months: EcoReportMonthData[], showTotal: boolean = false) => {
    return (
      <>
        {/* 総購入額 */}
        <tr className="border-b border-gray-200">
          {renderDataRow('総購入額', null, (m) => m.totalPurchase, undefined, months, showTotal)}
        </tr>
        {/* エコマーク商品 */}
        <tr className="border-b border-gray-200">
          {renderDataRow(
            'エコマーク商品',
            'ecoMark',
            (m) => m.ecoMark,
            (m) => m.ecoMarkRatio,
            months,
            showTotal
          )}
        </tr>
        {/* グリーン購入法適合商品 */}
        <tr className="border-b border-gray-200">
          {renderDataRow(
            'グリーン購入法適合商品',
            'greenPurchase',
            (m) => m.greenPurchase,
            (m) => m.greenPurchaseRatio,
            months,
            showTotal
          )}
        </tr>
        {/* GPNエコ商品ねっと掲載商品 */}
        <tr className="border-b border-gray-200">
          {renderDataRow(
            'GPNエコ商品ねっと掲載商品',
            'gpnEco',
            (m) => m.gpnEco,
            (m) => m.gpnEcoRatio,
            months,
            showTotal
          )}
        </tr>
        {/* 環境配慮商品合計 */}
        <tr className="border-b border-gray-200">
          {renderDataRow(
            '環境配慮商品合計',
            'ecoTotal',
            (m) => m.ecoTotal,
            (m) => m.ecoTotalRatio,
            months,
            showTotal
          )}
        </tr>
      </>
    );
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* ページタイトル */}
      <h1 className="text-3xl font-medium text-gray-900 pb-2 border-b-2 border-black">
        環境配慮商品購入レポート
      </h1>

      {/* 注意事項 */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>※環境配慮商品情報は随時更新情報に基づきます。</p>
        <p>※「総購入額」は環境配慮商品以外も含む全ての購入額です。</p>
        <p>
          ※「環境配慮商品合計」欄は、「エコマーク商品」「グリーン購入方適合商品」「GPNエコ商品ねっと掲載商品」のいずれかに該当する商品の合計金額・構成比となります。
        </p>
      </div>

      {/* 対象情報 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
        <div className="text-lg">
          <span className="font-medium">{data.targetCode}</span>
          <span className="ml-2">様</span>
        </div>
        <div className="text-sm text-gray-600 space-x-4">
          <span>
            集計締日：<span className="text-red-500 font-bold">{data.closingDay}</span>
          </span>
          <span>集計項目：{data.aggregationLabel}</span>
        </div>
      </div>

      {/* 前半テーブル（6ヶ月） */}
      {firstHalf.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>{renderTableHeader(firstHalf, false)}</thead>
            <tbody>{renderTableBody(firstHalf, false)}</tbody>
          </table>
        </div>
      )}

      {/* 後半テーブル（6ヶ月 + 合計） */}
      {secondHalf.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>{renderTableHeader(secondHalf, true)}</thead>
            <tbody>{renderTableBody(secondHalf, true)}</tbody>
          </table>
        </div>
      )}

      {/* ボタン */}
      <div className="flex justify-center gap-4 print:hidden">
        <Button
          type="button"
          variant="secondary"
          onClick={handleBack}
          className="min-w-[120px]"
        >
          戻る
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handlePrint}
          className="min-w-[120px]"
        >
          印刷
        </Button>
      </div>
    </div>
  );
};

export default EcoReportResult;
