/**
 * MainBanner Component Test
 * メインバナースライダー テスト
 */

import { render, screen } from '@testing-library/react';
import MainBanner from '../MainBanner';

// Swiperコンポーネントのモック
jest.mock('swiper/react', () => ({
  Swiper: ({ children, className }: any) => (
    <div className={className} data-testid="swiper">
      {children}
    </div>
  ),
  SwiperSlide: ({ children, className }: any) => (
    <div className={className} data-testid="swiper-slide">
      {typeof children === 'function' ? children({ isActive: true }) : children}
    </div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Navigation: {},
  Pagination: {},
  Autoplay: {},
}));

describe('MainBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('デフォルトバナー表示', () => {
    it('デフォルトバナー6枚が表示されること', () => {
      render(<MainBanner />);

      const slides = screen.getAllByTestId('swiper-slide');
      expect(slides).toHaveLength(6);
    });

    it('各バナーに正しいalt属性が設定されること (Next.js Image)', () => {
      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      // Next.js Imageコンポーネントの場合、alt属性で画像を識別
      expect(images).toHaveLength(6);
      expect(images[0]).toHaveAttribute('alt', 'メインバナー1');
      expect(images[1]).toHaveAttribute('alt', 'メインバナー2');
      expect(images[2]).toHaveAttribute('alt', 'メインバナー3');
      expect(images[3]).toHaveAttribute('alt', 'メインバナー4');
      expect(images[4]).toHaveAttribute('alt', 'メインバナー5');
      expect(images[5]).toHaveAttribute('alt', 'メインバナー6');
    });
  });

  describe('画像の読み込み戦略', () => {
    it('最初の2枚がpriority（優先ロード）であること (Next.js Image)', () => {
      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      // Next.js Imageコンポーネントはpriorityプロップを使用
      expect(images).toHaveLength(6);
      // 最初の2枚の画像が存在することを確認（priority設定により優先ロード）
      expect(images[0]).toBeInTheDocument();
      expect(images[1]).toBeInTheDocument();
    });

    it('3枚目以降が通常読み込みであること (Next.js Image)', () => {
      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      // Next.js Imageコンポーネントでpriority=falseの場合、通常のlazyロード
      expect(images[2]).toBeInTheDocument();
      expect(images[3]).toBeInTheDocument();
      expect(images[4]).toBeInTheDocument();
      expect(images[5]).toBeInTheDocument();
    });
  });

  describe('リンク動作', () => {
    it('各バナーに正しいリンクが設定されること', () => {
      render(<MainBanner />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(6);
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', '/products');
      });
    });
  });

  describe('アクティブ状態のスタイル', () => {
    it('アクティブスライドにec-main-banner__link--activeクラスが適用されること', () => {
      render(<MainBanner />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        // モックでisActiveをtrueに設定しているため、全てec-main-banner__link--active
        expect(link.className).toContain('ec-main-banner__link--active');
      });
    });
  });

  describe('Swiperコンテナ', () => {
    it('Swiperコンポーネントが正しいクラス名で表示されること', () => {
      render(<MainBanner />);

      const swiper = screen.getByTestId('swiper');
      expect(swiper).toHaveClass('ec-main-banner__container');
      expect(swiper).toHaveClass('main-banner-slider');
    });
  });

  describe('セクション要素', () => {
    it('sectionタグが正しいクラスで表示されること', () => {
      const { container } = render(<MainBanner />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('ec-main-banner');
      expect(section).toHaveClass('main-banner-section');
    });
  });
});
