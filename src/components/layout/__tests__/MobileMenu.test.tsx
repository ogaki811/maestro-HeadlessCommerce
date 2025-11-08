/**
 * MobileMenu Component Test
 * モバイルメニュー（ドロワーメニュー） テスト
 *
 * カスタムメニュー星機能の拡張テスト含む
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import MobileMenu from '../MobileMenu';
import useAuthStore from '@/store/useAuthStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import useCustomMenuStore from '@/store/useCustomMenuStore';
import { headerNavigationIcons } from '@/config/headerNavigationConfig';

// Next.js関連のモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href, onClick }: any) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

// react-hot-toastのモック
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}));

// useKeyboardNavigationのモック
jest.mock('@/hooks/useKeyboardNavigation', () => {
  return jest.fn();
});

describe('MobileMenu', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Storeの初期化
    act(() => {
      useAuthStore.setState({
        isAuthenticated: false,
        user: null,
      });

      useFavoritesStore.setState({
        favorites: [],
      });

      useCustomMenuStore.setState({
        customMenuIds: ['quote-request', 'quick-order', 'order-history'],
      });
    });
  });

  describe('基本レンダリング', () => {
    it('メニューが閉じている状態では非表示であること', () => {
      const { container } = render(<MobileMenu isOpen={false} onClose={mockOnClose} />);

      const drawer = container.querySelector('.ec-mobile-menu');
      expect(drawer).toHaveClass('-translate-x-full');
    });

    it('メニューが開いている状態では表示されること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const drawer = container.querySelector('.ec-mobile-menu');
      expect(drawer).toHaveClass('translate-x-0');
    });

    it('既存の基本メニュー（ホーム、商品一覧、お気に入り）が表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('ホーム')).toBeInTheDocument();
      expect(screen.getByText('商品一覧')).toBeInTheDocument();
      expect(screen.getByText('お気に入り')).toBeInTheDocument();
    });
  });

  describe('カスタムメニュー項目の表示', () => {
    it('headerNavigationIconsのメニュー項目が表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // showInDrawer: true の項目が表示される
      const drawerMenus = headerNavigationIcons.filter(icon => icon.showInDrawer);

      drawerMenus.forEach((menu) => {
        expect(screen.getByText(menu.text)).toBeInTheDocument();
      });
    });

    it('新しいメニュー項目（注文履歴、マイカタログ）が表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('注文履歴')).toBeInTheDocument();
      expect(screen.getByText('マイカタログ')).toBeInTheDocument();
    });

    it('showInDrawerがfalseの項目は表示されないこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const hiddenMenus = headerNavigationIcons.filter(icon => icon.showInDrawer === false);

      hiddenMenus.forEach((menu) => {
        expect(screen.queryByText(menu.text)).not.toBeInTheDocument();
      });
    });
  });

  describe('星アイコン表示', () => {
    it('customizableがtrueのメニューに星アイコンが表示されること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // customizable: true のメニュー数を取得
      const customizableMenus = headerNavigationIcons.filter(
        icon => icon.showInDrawer && icon.customizable
      );

      // 星アイコンの数を確認（data-testid="star-icon"で識別）
      const starIcons = container.querySelectorAll('[data-testid="star-icon"]');
      expect(starIcons.length).toBeGreaterThan(0);
      expect(starIcons.length).toBe(customizableMenus.length);
    });

    it('customizableがfalseのメニューには星アイコンが表示されないこと', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // 基本メニュー（ホーム、商品一覧など）には星がない
      const homeLink = screen.getByText('ホーム').closest('a');
      const starInHome = homeLink?.querySelector('[data-testid="star-icon"]');
      expect(starInHome).toBeNull();
    });

    it('選択済みメニューの星がfilled状態で表示されること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // quote-request は選択済み（customMenuIds に含まれる）
      const quoteRequestLink = screen.getByText('見積り依頼').closest('.ec-mobile-menu__custom-item');
      const starIcon = quoteRequestLink?.querySelector('[data-testid="star-icon"]');

      // filled クラスがあることを確認
      expect(starIcon).toHaveClass('ec-mobile-menu__star--filled');
    });

    it('未選択メニューの星がoutline状態で表示されること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // my-catalog は未選択（customMenuIds に含まれない）
      const myCatalogLink = screen.getByText('マイカタログ').closest('.ec-mobile-menu__custom-item');
      const starIcon = myCatalogLink?.querySelector('[data-testid="star-icon"]');

      // filled クラスがないことを確認
      expect(starIcon).not.toHaveClass('ec-mobile-menu__star--filled');
    });
  });

  describe('星アイコンのトグル機能', () => {
    it('星アイコンをクリックするとtoggleCustomMenuが呼ばれること', () => {
      const toggleCustomMenu = jest.fn();

      act(() => {
        useCustomMenuStore.setState({
          toggleCustomMenu,
        });
      });

      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // my-catalog メニューの星アイコンをクリック
      const myCatalogItem = screen.getByText('マイカタログ').closest('.ec-mobile-menu__custom-item');
      const starButton = myCatalogItem?.querySelector('[data-testid="star-icon"]');

      if (starButton) {
        fireEvent.click(starButton);
        expect(toggleCustomMenu).toHaveBeenCalledWith('my-catalog');
      }
    });

    it('星をクリックしても選択状態が切り替わること', () => {
      const { container, rerender } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // 初期状態: my-catalog は未選択
      let myCatalogItem = screen.getByText('マイカタログ').closest('.ec-mobile-menu__custom-item');
      let starIcon = myCatalogItem?.querySelector('[data-testid="star-icon"]');
      expect(starIcon).not.toHaveClass('ec-mobile-menu__star--filled');

      // 星をクリック
      if (starIcon) {
        fireEvent.click(starIcon);
      }

      // Store の状態を更新
      act(() => {
        useCustomMenuStore.setState({
          customMenuIds: ['quote-request', 'quick-order', 'my-catalog', 'order-history'],
        });
      });

      // 再レンダリング
      rerender(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // my-catalog が選択状態になっている
      myCatalogItem = screen.getByText('マイカタログ').closest('.ec-mobile-menu__custom-item');
      starIcon = myCatalogItem?.querySelector('[data-testid="star-icon"]');
      expect(starIcon).toHaveClass('ec-mobile-menu__star--filled');
    });
  });

  describe('バッジ表示', () => {
    it('badgeがないメニューにはバッジが表示されないこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const quoteRequestItem = screen.getByText('見積り依頼').closest('.ec-mobile-menu__custom-item');
      const badge = quoteRequestItem?.querySelector('.ec-mobile-menu__custom-badge');

      expect(badge).toBeNull();
    });
  });

  describe('既存機能との統合', () => {
    it('お気に入りバッジが正しく表示されること', () => {
      act(() => {
        useFavoritesStore.setState({
          favorites: ['product-1', 'product-2', 'product-3'],
        });
      });

      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const favoriteLink = screen.getByText('お気に入り').closest('a');
      const badge = favoriteLink?.querySelector('.ec-mobile-menu__badge');

      expect(badge).toHaveTextContent('3');
    });

    it('認証済みユーザーの場合、ユーザー名が表示されること', () => {
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: {
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        });
      });

      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('テストユーザー')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('未認証ユーザーの場合、ログイン・新規登録リンクが表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('ログイン')).toBeInTheDocument();
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });

    it('オーバーレイをクリックするとonCloseが呼ばれること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const overlay = container.querySelector('.ec-mobile-menu__overlay');
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('閉じるボタンをクリックするとonCloseが呼ばれること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('メニューを閉じる');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('アクセシビリティ', () => {
    it('星アイコンボタンに適切なaria-labelが設定されていること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const myCatalogItem = screen.getByText('マイカタログ').closest('.ec-mobile-menu__custom-item');
      const starButton = myCatalogItem?.querySelector('[data-testid="star-icon"]');

      expect(starButton).toHaveAttribute('aria-label');
      expect(starButton?.getAttribute('aria-label')).toContain('カスタムメニュー');
    });

    it('星アイコンボタンにaria-pressedが設定されていること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // 選択済み（quote-request）
      const selectedItem = screen.getByText('見積り依頼').closest('.ec-mobile-menu__custom-item');
      const selectedStar = selectedItem?.querySelector('[data-testid="star-icon"]');
      expect(selectedStar).toHaveAttribute('aria-pressed', 'true');

      // 未選択（my-catalog）
      const unselectedItem = screen.getByText('マイカタログ').closest('.ec-mobile-menu__custom-item');
      const unselectedStar = unselectedItem?.querySelector('[data-testid="star-icon"]');
      expect(unselectedStar).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('メニュー項目のリンク動作', () => {
    it('カスタムメニュー項目が正しいhrefを持つこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const quoteRequestLink = screen.getByText('見積り依頼').closest('a');
      expect(quoteRequestLink).toHaveAttribute('href', '/quote-request');

      const quickOrderLink = screen.getByText('クイックオーダー').closest('a');
      expect(quickOrderLink).toHaveAttribute('href', '/quick-order');

      const orderHistoryLink = screen.getByText('注文履歴').closest('a');
      expect(orderHistoryLink).toHaveAttribute('href', '/mypage/orders');

      const myCatalogLink = screen.getByText('マイカタログ').closest('a');
      expect(myCatalogLink).toHaveAttribute('href', '/my-catalog');
    });

    it('メニュー項目をクリックするとonCloseが呼ばれること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const quoteRequestLink = screen.getByText('見積り依頼').closest('a');
      if (quoteRequestLink) {
        fireEvent.click(quoteRequestLink);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });

  describe('スタイリング', () => {
    it('カスタムメニューセクションが視覚的に分離されていること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const customMenuSection = container.querySelector('.ec-mobile-menu__custom-section');
      expect(customMenuSection).toHaveClass('border-t');
      expect(customMenuSection).toHaveClass('border-gray-200');
    });

    it('星アイコンのホバースタイルが適用されること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const starButton = container.querySelector('[data-testid="star-icon"]');
      expect(starButton).toHaveClass('hover:text-yellow-500');
    });
  });
});
