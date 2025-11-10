import React from 'react';

export interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * TableHeaderCell - テーブルヘッダーセルコンポーネント（Atom）
 *
 * <th>要素をラップ。テキスト配置をサポート。
 */
export default function TableHeaderCell({
  children,
  className = '',
  align = 'left',
}: TableHeaderCellProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <th className={`px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider ${alignClass} ${className}`}>
      {children}
    </th>
  );
}
