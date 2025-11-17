import React from 'react';

/**
 * InfoRow - 情報テーブルの行データ
 */
export interface InfoRow {
  /**
   * ラベル（項目名）
   */
  label: string;

  /**
   * 値（文字列またはReactNode）
   */
  value: string | React.ReactNode;
}

/**
 * InfoTable Props
 */
export interface InfoTableProps {
  /**
   * 表示するデータ
   */
  data: InfoRow[];

  /**
   * 列数（1 or 2）
   * @default 1
   */
  columns?: 1 | 2;

  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * InfoTable - 情報テーブルコンポーネント（Molecule）
 *
 * key-valueペアの情報を表形式で表示するコンポーネント。
 * ご登録情報や会社情報の表示に使用。
 *
 * @example
 * ```tsx
 * <InfoTable
 *   data={[
 *     { label: 'ご担当者名', value: '小川祐樹 様' },
 *     { label: 'Web ID', value: '1313111006' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // 2列レイアウト
 * <InfoTable
 *   data={[
 *     { label: '管理者権限', value: '一般' },
 *     { label: '承認者設定', value: 'なし' },
 *   ]}
 *   columns={2}
 * />
 * ```
 */
export default function InfoTable({
  data,
  columns = 1,
  className = '',
}: InfoTableProps) {
  if (columns === 1) {
    // 1列レイアウト - 文字の強弱を意識
    return (
      <div className={className}>
        {data.map((row, index) => (
          <div key={index} className={index < data.length - 1 ? 'mb-5' : ''}>
            <p className="text-xs font-normal text-gray-500 mb-1.5">{row.label}</p>
            <p className="text-base font-semibold text-gray-900">{row.value}</p>
          </div>
        ))}
      </div>
    );
  }

  // 2列レイアウト - グリッドで表現
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {data.map((row, index) => (
        <div key={index}>
          <p className="text-xs font-normal text-gray-500 mb-1.5">{row.label}</p>
          <p className="text-base font-semibold text-gray-900">{row.value}</p>
        </div>
      ))}
    </div>
  );
}
