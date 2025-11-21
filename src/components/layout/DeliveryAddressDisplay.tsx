'use client';

import Link from 'next/link';

interface DeliveryAddressDisplayProps {
  postalCode?: string;
  address?: string;
}

export default function DeliveryAddressDisplay({
  postalCode,
  address
}: DeliveryAddressDisplayProps) {
  if (!postalCode && !address) return null;

  return (
    <Link
      href="/mypage"
      className="
        flex flex-col items-start
        text-[#2d2626]
        pl-4 pr-4 py-2
        rounded-md
        hover:bg-gray-100
        hover:text-gray-900
        transition-colors
        max-w-[200px]
      "
    >
      <span className="text-[10px] text-gray-500 mb-0.5">配送先</span>
      <div className="flex items-center gap-1">
        <svg
          className="w-3 h-3 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="配送先住所"
          role="img"
        >
          <title>配送先</title>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span className="text-xs truncate">
          {postalCode && `〒${postalCode} `}
          {address}
        </span>
      </div>
    </Link>
  );
}
