import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../Header';

// モック設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/store/useCartStore', () => ({
  __esModule: true,
  default: jest.fn((selector) =>
    selector({
      getItemCount: () => 0,
      lastAddedItem: null,
    })
  ),
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
  })),
}));

jest.mock('@/store/useDealerStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    selectedDealer: null,
  })),
}));

jest.mock('@/store/useCustomMenuStore', () => {
  const mockStore = jest.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        customMenuIds: [],
      });
    }
    return {
      customMenuIds: [],
    };
  });

  mockStore.persist = {
    rehydrate: jest.fn(),
  };

  return {
    __esModule: true,
    default: mockStore,
  };
});

jest.mock('@/hooks/useScrollDirection', () => ({
  useScrollDirection: jest.fn(() => ({
    isScrolled: false,
    showHeader: true,
  })),
}));

jest.mock('../MobileMenu', () => {
  return function MockMobileMenu() {
    return <div data-testid="mobile-menu">Mobile Menu</div>;
  };
});

describe('Header - Performance Optimization Tests', () => {
  const mockPush = jest.fn();
  const mockPathname = '/';

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
  });

  describe('Phase 1: MobileMenu遅延ロード', () => {
    it('Headerが正しくレンダリングされる', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('メニューボタンが存在する', () => {
      render(<Header />);
      const menuButtons = screen.getAllByRole('button');
      const hasMenuButton = menuButtons.some(
        button => button.textContent?.includes('メニュー')
      );
      expect(hasMenuButton).toBe(true);
    });

    it('メニューボタンをクリックするとMobileMenuがレンダリングされる', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // デスクトップのメニューボタンを探す
      const menuButtons = screen.getAllByRole('button');
      const menuButton = menuButtons.find(
        button => button.textContent?.includes('メニュー')
      );

      expect(menuButton).toBeDefined();

      if (menuButton) {
        await user.click(menuButton);

        // MobileMenuがレンダリングされることを確認
        await waitFor(() => {
          expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Phase 2: useCallbackによる最適化', () => {
    it('検索フォームが存在する', () => {
      render(<Header />);
      const searchInputs = screen.getAllByPlaceholderText(/検索/i);
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it('検索フォームの送信が機能する', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const searchInputs = screen.getAllByPlaceholderText(/検索/i);
      const searchInput = searchInputs[0];

      await user.type(searchInput, 'テスト商品');

      // フォームを送信
      const form = searchInput.closest('form');
      expect(form).toBeDefined();

      if (form) {
        await user.type(searchInput, '{Enter}');

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith(
            expect.stringContaining('/search')
          );
        });
      }
    });
  });

  describe('Phase 3: useEffect最適化', () => {
    it('Headerが正しくマウント・アンマウントされる', () => {
      const { unmount } = render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // アンマウント時にエラーが発生しないことを確認
      expect(() => unmount()).not.toThrow();
    });
  });
});
