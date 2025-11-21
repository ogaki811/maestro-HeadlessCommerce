'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Product } from '@/types';

// ProductSliderを動的インポート（初期バンドルから除外）
const ProductSlider = dynamic(() => import('./ProductSlider'), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-400">読み込み中...</span>
    </div>
  ),
  ssr: false,
});

interface LazyProductSectionProps {
  products: Product[];
  hideTags?: boolean;
}

/**
 * Intersection Observerで遅延読み込みするProductSliderラッパー
 * 画面に入ったときだけProductSliderを読み込む
 */
export default function LazyProductSection({ products, hideTags = false }: LazyProductSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 画面に入ったらフラグを立てる（一度だけ）
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // 200px手前で読み込み開始
        threshold: 0,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <ProductSlider products={products} hideTags={hideTags} />
      ) : (
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
      )}
    </div>
  );
}
