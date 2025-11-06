import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="ec-empty-cart bg-white rounded-lg shadow-sm p-12 text-center">
      <svg
        className="ec-empty-cart__icon mx-auto h-24 w-24 text-gray-400 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h2 className="ec-empty-cart__title text-2xl font-bold text-gray-900 mb-4">
        カートは空です
      </h2>
      <p className="ec-empty-cart__description text-gray-600 mb-8">
        お気に入りの商品をカートに追加してください
      </p>
      <Link
        href="/products"
        className="ec-empty-cart__cta inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
      >
        商品を探す
      </Link>
    </div>
  );
}
