'use client';

import React from 'react';
import { EcoCategoryType, ECO_CATEGORY_INFO } from '@/types/eco-report';

interface EcoCategoryBadgeProps {
  category: EcoCategoryType;
  className?: string;
}

/**
 * 環境配慮商品カテゴリバッジコンポーネント
 * SVGアイコンを使用（絵文字禁止）
 */
export const EcoCategoryBadge: React.FC<EcoCategoryBadgeProps> = ({
  category,
  className = '',
}) => {
  const { label, color } = ECO_CATEGORY_INFO[category];

  // カテゴリ別のアイコン
  const renderIcon = () => {
    switch (category) {
      case 'ecoMark':
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        );
      case 'greenPurchase':
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case 'gpnEco':
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'ecoTotal':
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
            <path d="M12 6v6l4 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {renderIcon()}
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
};

export default EcoCategoryBadge;
