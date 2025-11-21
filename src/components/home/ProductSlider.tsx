'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCardLite from '@/components/product/ProductCardLite';
import type { Product } from '@/types';

// Swiper CSSはglobals.cssで一括インポート済み
import './ProductSlider.css';

interface ProductSliderProps {
  products: Product[];
  size?: 'compact' | 'default';
  hideTags?: boolean;
}

export default function ProductSlider({ products, size = 'compact', hideTags = false }: ProductSliderProps) {
  return (
    <div className="ec-product-slider product-slider relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 6,
          },
        }}
        className="ec-product-slider__container pb-12"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id} className="ec-product-slider__slide">
            <ProductCardLite
              product={product}
              size={size}
              hideTags={hideTags}
              priority={index < 6} // 最初の6枚のみeager loading
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
