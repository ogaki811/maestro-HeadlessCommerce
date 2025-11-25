'use client';

import Link from 'next/link';

interface PointsDisplayProps {
  points?: number;
}

export default function PointsDisplay({ points = 0 }: PointsDisplayProps) {
  const formattedPoints = points.toLocaleString('ja-JP');

  return (
    <Link
      href="/mypage/points"
      className="
        flex items-center gap-2
        text-sm
        text-text-header
        border-l border-gray-300
        pl-4
        hover:bg-gray-100
        transition-colors
        font-medium
      "
    >
      <svg
        className="w-4 h-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-label="ポイント"
        role="img"
      >
        <title>ポイント</title>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
      <span className="whitespace-nowrap">
        <span className="font-bold text-base">{formattedPoints}</span>
        <span className="text-xs ml-1">P</span>
      </span>
    </Link>
  );
}
