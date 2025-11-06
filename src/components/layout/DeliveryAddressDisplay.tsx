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
      href="/mypage/settings"
      className="
        flex items-center
        text-sm
        text-[#2d2626]
        border-l border-gray-300
        pl-4
        hover:text-gray-900
        transition-colors
        max-w-md
      "
    >
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
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
      <span className="font-medium mr-1">配送先:</span>
      <span className="truncate">
        {postalCode && `〒${postalCode} `}
        {address}
      </span>
    </Link>
  );
}
