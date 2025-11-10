import React from 'react';

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TableHeader - テーブルヘッダーコンポーネント（Atom）
 *
 * <thead>要素をラップし、ヘッダー行を格納。
 */
export default function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
}
