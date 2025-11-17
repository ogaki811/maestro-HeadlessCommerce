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
        <p className="text-sm text-gray-700 mb-2">現在のポイント</p>
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-gray-900">{formatNumber(currentPoints)}</span>
          <span className="text-2xl text-gray-600 ml-2">pt</span>
        </div>
      </div>

      {/* 失効予定ポイント */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-600 mb-1">今月末に失効予定のポイント</p>
          <p className="text-base font-semibold text-gray-900">
            {formatNumber(expiringThisMonth)} pt
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">翌月末に失効予定のポイント</p>
          <p className="text-base font-semibold text-gray-900">
            {formatNumber(expiringNextMonth)} pt
          </p>
        </div>
      </div>

      {/* ポイント交換リンク */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <Link
          href="/mypage/points/exchange"
          className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
        >
          ポイント交換
        </Link>
        <Link
          href="/mypage/points/history"
          className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
        >
          ポイント交換履歴
        </Link>
      </div>
    </div>
  );
}
