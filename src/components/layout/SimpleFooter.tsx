'use client';

import Link from 'next/link';

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ec-simple-footer bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* リンク */}
        <div className="ec-simple-footer__links flex justify-center space-x-6 mb-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            トップページ
          </Link>
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            商品一覧
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            お問い合わせ
          </Link>
        </div>

        {/* コピーライト */}
        <div className="ec-simple-footer__copyright text-center text-sm text-gray-500">
          © {currentYear} smartsample. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
