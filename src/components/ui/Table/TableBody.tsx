import React from 'react';

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TableBody - テーブルボディコンポーネント（Atom）
 *
 * <tbody>要素をラップし、データ行を格納。
 */
export default function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}
