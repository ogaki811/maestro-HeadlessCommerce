import React from 'react';
import Link from 'next/link';

/**
 * PointCard Props
 */
export interface PointCardProps {
  /**
   * 現在のポイント
   */
  currentPoints: number;

  /**
   * 今月末に失効予定のポイント
   */
  expiringThisMonth: number;

  /**
   * 翌月末に失効予定のポイント
   */
  expiringNextMonth: number;

  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * 数値を3桁区切りでフォーマット
 */
function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

/**
 * PointCard - ポイント情報表示カードコンポーネント（Molecule）
 *
 * ポイント情報を表示するカードコンポーネント。
 * 現在のポイント、失効予定ポイント、ポイント交換リンクを表示。
 *
 * @example
 * ```tsx
 * <PointCard
 *   currentPoints={2500}
 *   expiringThisMonth={100}
 *   expiringNextMonth={50}
 * />
 * ```
 */
export default function PointCard({
  currentPoints,
  expiringThisMonth,
  expiringNextMonth,
  className = '',
}: PointCardProps) {
  return (
    <div className={className}>
      {/* 現在のポイント */}
      <div className="mb-6">
        <p className="text-xs font-normal text-gray-500 mb-1.5">現在のポイント</p>
        <p className="text-2xl font-bold text-green-600">{formatNumber(currentPoints)} <span className="text-base font-semibold">ポイント</span></p>
      </div>

      {/* 失効予定ポイント */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-normal text-gray-500 mb-1.5">今月末失効予定</p>
          <p className="text-base font-semibold text-gray-900">
            {formatNumber(expiringThisMonth)} <span className="text-sm font-normal text-gray-600">pt</span>
          </p>
        </div>
        <div>
          <p className="text-xs font-normal text-gray-500 mb-1.5">翌月末失効予定</p>
          <p className="text-base font-semibold text-gray-900">
            {formatNumber(expiringNextMonth)} <span className="text-sm font-normal text-gray-600">pt</span>
          </p>
        </div>
      </div>

      {/* ポイント交換リンク */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
        <Link
          href="/mypage/points/exchange"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
        >
          ポイント交換
        </Link>
        <Link
          href="/mypage/points/history"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
        >
          ポイント交換履歴
        </Link>
      </div>
    </div>
  );
}
