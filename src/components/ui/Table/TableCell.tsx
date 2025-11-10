import React from 'react';

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * TableCell - テーブルセルコンポーネント（Atom）
 *
 * <td>要素をラップ。テキスト配置をサポート。
 */
export default function TableCell({
  children,
  className = '',
  align = 'left',
}: TableCellProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <td className={`px-4 py-3 text-sm text-gray-900 ${alignClass} ${className}`}>
      {children}
    </td>
  );
}
