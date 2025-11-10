import React from 'react';

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TableRow - テーブル行コンポーネント（Atom）
 *
 * <tr>要素をラップ。ホバーエフェクト付き。
 */
export default function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`hover:bg-gray-50 ${className}`}>
      {children}
    </tr>
  );
}
