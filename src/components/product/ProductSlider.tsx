'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductSliderProps {
  products: Product[];
  title?: string;
  className?: string;
}

export default function ProductSlider({
  products,
  title = 'おすすめ商品',
  className = '',
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const itemsPerView = 4; // デスクトップで4個表示
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.scrollWidth / products.length;
      sliderRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, products.length]);

  if (products.length === 0) return null;

  return (
    <div className={`ec-product-slider ${className}`}>
      <div className="ec-product-slider__header flex items-center justify-between mb-6">
        <h2 className="ec-product-slider__title text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="ec-product-slider__controls flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`ec-product-slider__prev w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              currentIndex === 0
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-600 hover:border-black hover:text-black hover:bg-blue-50'
            }`}
            aria-label="前へ"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`ec-product-slider__next w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              currentIndex >= maxIndex
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-600 hover:border-black hover:text-black hover:bg-blue-50'
            }`}
            aria-label="次へ"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="ec-product-slider__track flex gap-4 overflow-x-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="ec-product-slider__item flex-shrink-0 w-[calc(25%-12px)] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            draggable={false}
          >
            <div className="ec-product-slider__image-wrapper aspect-square relative bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {product.tags && product.tags.length > 0 && (
                <span className="ec-product-slider__badge absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                  {product.tags[0]}
                </span>
              )}
            </div>
            <div className="ec-product-slider__info p-4">
              <p className="ec-product-slider__brand text-xs text-gray-500 mb-1">
                {product.brand}
              </p>
              <h3 className="ec-product-slider__name text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="ec-product-slider__footer flex items-center justify-between">
                <p className="ec-product-slider__price text-lg font-bold text-black">
                  ¥{product.price.toLocaleString()}
                </p>
                <div className="ec-product-slider__rating flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* インジケーター */}
      <div className="ec-product-slider__indicators flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`ec-product-slider__indicator w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-black w-8' : 'bg-gray-300'
            }`}
            aria-label={`スライド${index + 1}へ`}
          />
        ))}
      </div>
    </div>
  );
}
