/**
 * MainBanner Component Test
 * メインバナースライダー テスト
 */

import { render, screen, waitFor } from '@testing-library/react';
import MainBanner from '../MainBanner';
import { bannersApi } from '@/lib/api-client';

// bannersApi.getBannersをモック化
jest.mock('@/lib/api-client', () => ({
  bannersApi: {
    getBanners: jest.fn(),
  },
}));

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
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const slides = screen.getAllByTestId('swiper-slide');
      expect(slides).toHaveLength(6);
    });

    it('各バナーに正しい画像URLが設定されること', () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('src', '/img/mainbanner/Group 1.png');
      expect(images[1]).toHaveAttribute('src', '/img/mainbanner/Group 2.png');
      expect(images[2]).toHaveAttribute('src', '/img/mainbanner/Group 3.png');
      expect(images[3]).toHaveAttribute('src', '/img/mainbanner/Group 4.png');
      expect(images[4]).toHaveAttribute('src', '/img/mainbanner/Group 5.png');
      expect(images[5]).toHaveAttribute('src', '/img/mainbanner/Group 6.png');
    });
  });

  describe('API連携', () => {
    it('API成功時にバナーデータが切り替わること', async () => {
      const mockBanners = [
        {
          id: 'api-banner-1',
          title: 'APIバナー1',
          description: 'テスト',
          imageUrl: '/test/banner1.png',
          linkUrl: '/test',
          buttonText: 'テスト',
          isActive: true,
          displayOrder: 1,
        },
        {
          id: 'api-banner-2',
          title: 'APIバナー2',
          description: 'テスト',
          imageUrl: '/test/banner2.png',
          linkUrl: '/test',
          buttonText: 'テスト',
          isActive: true,
          displayOrder: 2,
        },
      ];

      (bannersApi.getBanners as jest.Mock).mockResolvedValue({
        success: true,
        data: mockBanners,
      });

      render(<MainBanner />);

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', '/test/banner1.png');
        expect(images[1]).toHaveAttribute('src', '/test/banner2.png');
      });
    });

    it('API失敗時にデフォルトバナーを使用すること', async () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(6);
        expect(images[0]).toHaveAttribute('src', '/img/mainbanner/Group 1.png');
      });
    });
  });

  describe('画像の読み込み戦略', () => {
    it('最初の2枚がeager loadingであること', () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('loading', 'eager');
      expect(images[1]).toHaveAttribute('loading', 'eager');
    });

    it('3枚目以降がlazy loadingであること', () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      expect(images[2]).toHaveAttribute('loading', 'lazy');
      expect(images[3]).toHaveAttribute('loading', 'lazy');
      expect(images[4]).toHaveAttribute('loading', 'lazy');
      expect(images[5]).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('リンク動作', () => {
    it('各バナーに正しいリンクが設定されること', () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(6);
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', '/products');
      });
    });

    it('actionUrlがある場合はactionUrlを優先すること', async () => {
      const mockBanners = [
        {
          id: 'api-banner-1',
          title: 'APIバナー1',
          description: 'テスト',
          imageUrl: '/test/banner1.png',
          linkUrl: '/products',
          actionUrl: '/special-action',
          buttonText: 'テスト',
          isActive: true,
          displayOrder: 1,
        },
      ];

      (bannersApi.getBanners as jest.Mock).mockResolvedValue({
        success: true,
        data: mockBanners,
      });

      render(<MainBanner />);

      await waitFor(() => {
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/special-action');
      });
    });
  });

  describe('アクティブ状態のスタイル', () => {
    it('アクティブスライドにscale-105クラスが適用されること', () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        // モックでisActiveをtrueに設定しているため、全てscale-105
        expect(link.className).toContain('scale-105');
      });
    });
  });

  describe('空データ処理', () => {
    it('バナーが0件の場合nullを返すこと', async () => {
      (bannersApi.getBanners as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      });

      const { container } = render(<MainBanner />);

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('alt属性', () => {
    it('messageがある場合はmessageをaltに使用すること', async () => {
      const mockBanners = [
        {
          id: 'api-banner-1',
          title: 'APIバナー1',
          description: 'テスト',
          message: 'カスタムメッセージ',
          imageUrl: '/test/banner1.png',
          linkUrl: '/test',
          buttonText: 'テスト',
          isActive: true,
          displayOrder: 1,
        },
      ];

      (bannersApi.getBanners as jest.Mock).mockResolvedValue({
        success: true,
        data: mockBanners,
      });

      render(<MainBanner />);

      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt', 'カスタムメッセージ');
      });
    });

    it('messageがない場合はtitleをaltに使用すること', () => {
      (bannersApi.getBanners as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<MainBanner />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'メインバナー1');
    });
  });
});
