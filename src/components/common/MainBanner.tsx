'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
// import { bannersApi } from '@/lib/api-client'; // TODO: MainBanner用APIエンドポイント実装後に有効化
import type { MainBannerConfig } from '@/types/banner';

// Swiper CSSはglobals.cssで一括インポート済み
import './MainBanner.css';

// ===== 定数定義 =====

/** バナーサイズ定数 */
const BANNER_DIMENSIONS = {
  width: 360,
  height: 200,
} as const;

/** Swiper設定定数 */
const SWIPER_SETTINGS = {
  /** 自動再生の遅延時間（ミリ秒） */
  autoplayDelay: 5000,
  /** eager loadingする画像の枚数 */
  eagerLoadCount: 2,
} as const;

/** レスポンシブ用spaceBetween設定 */
const SPACE_BETWEEN_BREAKPOINTS = {
  320: 20,
  640: 20,
  1024: 24,
  1280: 30,
} as const;

// ===== デフォルトバナーデータ =====

/** デフォルトバナー（初期表示用・API未起動時用） */
const defaultBanners: MainBannerConfig[] = [
  {
    id: 'mainbanner-1',
    title: 'メインバナー1',
    description: 'バナー1',
    imageUrl: '/img/mainbanner/Group 1.png',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'mainbanner-2',
    title: 'メインバナー2',
    description: 'バナー2',
    imageUrl: '/img/mainbanner/Group 2.png',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'mainbanner-3',
    title: 'メインバナー3',
    description: 'バナー3',
    imageUrl: '/img/mainbanner/Group 3.png',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'mainbanner-4',
    title: 'メインバナー4',
    description: 'バナー4',
    imageUrl: '/img/mainbanner/Group 4.png',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'mainbanner-5',
    title: 'メインバナー5',
    description: 'バナー5',
    imageUrl: '/img/mainbanner/Group 5.png',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'mainbanner-6',
    title: 'メインバナー6',
    description: 'バナー6',
    imageUrl: '/img/mainbanner/Group 6.png',
    linkUrl: '/products',
    buttonText: '商品を見る',
    isActive: true,
    displayOrder: 6,
  },
];

// ===== 型定義 =====

/** SwiperSlideのレンダープロップス型 */
type SwiperSlideRenderProps = {
  isActive: boolean;
};

// ===== ヘルパー関数 =====

/**
 * アクティブ状態に応じたリンククラス名を生成
 * @param isActive - スライドがアクティブかどうか
 * @returns クラス名文字列
 */
const getLinkClassName = (isActive: boolean): string => {
  const baseClasses = 'ec-main-banner__link block h-full';
  const activeClasses = isActive ? 'ec-main-banner__link--active' : '';
  return `${baseClasses} ${activeClasses}`;
};

/**
 * インデックスに応じた画像読み込み戦略を返す
 * @param index - バナーのインデックス
 * @returns 'eager' または 'lazy'
 */
const getImageLoadingStrategy = (index: number): 'eager' | 'lazy' =>
  index < SWIPER_SETTINGS.eagerLoadCount ? 'eager' : 'lazy';

// ===== メインコンポーネント =====

export default function MainBanner() {
  const [banners, setBanners] = useState<MainBannerConfig[]>(defaultBanners);

  // TODO: MainBanner用のAPIエンドポイント実装後に有効化
  // useEffect(() => {
  //   async function fetchBanners() {
  //     try {
  //       const response = await bannersApi.getMainBanners();
  //       if (response.success) {
  //         setBanners(response.data);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load banners:', error);
  //     }
  //   }
  //   fetchBanners();
  // }, []);

  if (banners.length === 0) {
    return null;
  }

  // Swiper設定（シンプルな横スライド・中央配置）
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 20,
    slidesPerView: 'auto' as const,
    centeredSlides: true,
    loop: true,
    loopAdditionalSlides: 1,
    watchSlidesProgress: true,
    autoplay: {
      delay: SWIPER_SETTINGS.autoplayDelay,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
    navigation: true,
    className: 'ec-main-banner__container main-banner-slider',
  };

  return (
    <section className="ec-main-banner main-banner-section relative w-full bg-gray-100">
      {/* 実際のバナースライダー */}
      <div className="ec-main-banner__loaded">
        <Swiper {...swiperConfig}>
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id} className="ec-main-banner__slide">
              {({ isActive }: SwiperSlideRenderProps) => (
                <Link
                  href={banner.linkUrl || '#'}
                  className={getLinkClassName(isActive)}
                >
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || 'バナー'}
                    width={BANNER_DIMENSIONS.width}
                    height={BANNER_DIMENSIONS.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="ec-main-banner__image rounded-lg object-contain block"
                    priority={index < SWIPER_SETTINGS.eagerLoadCount}
                    quality={90}
                  />
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
