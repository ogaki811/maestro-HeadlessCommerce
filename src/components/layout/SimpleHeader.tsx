'use client';

import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="ec-simple-header bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
          <Link href="/" className="ec-simple-header__logo flex items-center">
            <img
              src="/img/header_logo.png"
              alt="smartsample"
              className="h-6 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
