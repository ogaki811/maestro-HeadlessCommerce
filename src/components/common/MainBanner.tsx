'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { bannersApi } from '@/lib/api-client';
import type { BannerConfig } from '@/types/banner';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MainBanner.css';

// デフォルトバナー（初期表示用・API未起動時用）
const defaultBanners: BannerConfig[] = [
  {
    id: 'fallback-1',
    title: 'Welcome to Maestro TOC',
    description: 'Orchestra非依存で動作中！',
    imageUrl: '/images/banner-placeholder-1.svg',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    title: 'New Products',
    description: '新商品続々入荷',
    imageUrl: '/images/banner-placeholder-2.svg',
    linkUrl: '/products?tag=新商品',
    buttonText: '新商品を見る',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    title: 'Special Sale',
    description: '期間限定セール開催中',
    imageUrl: '/images/banner-placeholder-3.svg',
    linkUrl: '/products?tag=セール',
    buttonText: 'セール商品を見る',
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    title: 'Premium Collection',
    description: 'プレミアム商品特集',
    imageUrl: '/images/banner-placeholder-4.svg',
    linkUrl: '/products?tag=プレミアム',
    buttonText: 'プレミアム商品を見る',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    title: 'Best Sellers',
    description: '人気商品ランキング',
    imageUrl: '/images/banner-placeholder-5.svg',
    linkUrl: '/products?sort=popular',
    buttonText: 'ランキングを見る',
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'fallback-6',
    title: 'Free Shipping',
    description: '送料無料キャンペーン',
    imageUrl: '/images/banner-placeholder-6.svg',
    linkUrl: '/products',
    buttonText: '対象商品を見る',
    isActive: true,
    displayOrder: 6,
  },
];

export default function MainBanner() {
  const [banners, setBanners] = useState<BannerConfig[]>(defaultBanners);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await bannersApi.getBanners();
        if (response.success) {
          setBanners(response.data);
          console.log('✅ Loaded banners from Composer API:', response.data.length);
        }
      } catch (error) {
        console.error('❌ Failed to load banners from API, using default data:', error);
        // デフォルトバナーを継続使用（すでにstateに設定済み）
      }
    }
    fetchBanners();
  }, []);

  if (banners.length === 0) {
    return null; // バナーがない場合は何も表示しない（通常は発生しない）
  }

  return (
    <section className="ec-main-banner main-banner-section relative w-full bg-gray-100">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        breakpoints={{
          320: {
            slidesPerView: 'auto',
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 'auto',
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 'auto',
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 'auto',
            spaceBetween: 30,
          },
        }}
        className="ec-main-banner__container main-banner-slider"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="ec-main-banner__slide">
            {({ isActive }: { isActive: boolean }) => (
              <Link
                href={banner.actionUrl || banner.linkUrl || '#'}
                className={`ec-main-banner__link ${isActive ? 'ec-main-banner__link--active' : ''} block h-full ${
                  isActive ? 'scale-105' : 'scale-95'
                }`}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.message || banner.title || 'バナー'}
                  className="ec-main-banner__image rounded-lg"
                  style={{ width: '360px', height: '200px', objectFit: 'contain', display: 'block' }}
                  loading="eager"
                />
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
