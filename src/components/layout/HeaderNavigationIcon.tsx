'use client';

import Link from 'next/link';

interface HeaderNavigationIconProps {
  href: string;
  label: string;
  iconPath: string | string[];
  text: string;
}

export default function HeaderNavigationIcon({
  href,
  label,
  iconPath,
  text
}: HeaderNavigationIconProps) {
  const paths = Array.isArray(iconPath) ? iconPath : [iconPath];

  return (
    <Link
      href={href}
      className="
        flex items-center gap-2
        text-sm
        text-[#2d2626]
        border-l border-gray-300
        pl-4
        hover:text-gray-900
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
        aria-label={label}
        role="img"
      >
        <title>{label}</title>
        {paths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </svg>
      <span>{text}</span>
    </Link>
  );
}
