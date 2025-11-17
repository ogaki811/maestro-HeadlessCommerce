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
    // 1列レイアウト
    return (
      <table className={`w-full border-collapse ${className}`}>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 last:border-b-0">
              <td className="py-3 px-4 text-sm text-gray-700 bg-gray-50 w-1/3">
                {row.label}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // 2列レイアウト
  const rows: InfoRow[][] = [];
  for (let i = 0; i < data.length; i += 2) {
    rows.push(data.slice(i, i + 2));
  }

  return (
    <table className={`w-full border-collapse ${className}`}>
      <tbody>
        {rows.map((rowPair, rowIndex) => (
          <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
            {/* 1つ目のセル */}
            <td className="py-3 px-4 text-sm text-gray-700 bg-gray-50 w-1/6">
              {rowPair[0].label}
            </td>
            <td className="py-3 px-4 text-sm text-gray-900 w-1/3">{rowPair[0].value}</td>

            {/* 2つ目のセル（存在する場合） */}
            {rowPair[1] ? (
              <>
                <td className="py-3 px-4 text-sm text-gray-700 bg-gray-50 w-1/6">
                  {rowPair[1].label}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 w-1/3">
                  {rowPair[1].value}
                </td>
              </>
            ) : (
              <>
                <td className="py-3 px-4 bg-gray-50 w-1/6"></td>
                <td className="py-3 px-4 w-1/3"></td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
