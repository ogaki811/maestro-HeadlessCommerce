import React from 'react';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Table - 汎用テーブルコンポーネント（Atom）
 *
 * テーブルの基本コンテナ。Tailwind CSSでスタイリング。
 */
export default function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`min-w-full border-collapse ${className}`}>
      {children}
    </table>
  );
}
