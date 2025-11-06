'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
        {products.map((product) => (
          <SwiperSlide key={product.id} className="ec-product-slider__slide">
            <ProductCard product={product} size={size} hideTags={hideTags} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
