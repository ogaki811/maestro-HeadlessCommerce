/**
 * MobileMenu Component Test
 * モバイルメニュー（ドロワーメニュー） テスト
 *
 * 3セクション構造（注文する、管理・その他、ヘルプ）のテスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import MobileMenu from '../MobileMenu';
import useAuthStore from '@/store/useAuthStore';
import useFavoritesStore from '@/store/useFavoritesStore';
import { drawerMenuSections } from '@/config/drawerMenuConfig';

// Next.js関連のモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href, onClick, className }: any) => {
    return (
      <a href={href} onClick={onClick} className={className}>
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

    it('未認証時はメニュータイトルが表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText('メニュー')).toBeInTheDocument();
    });
  });

  describe('3セクション構造', () => {
    it('3つのセクション（注文する、管理・その他、ヘルプ）が表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('注文する')).toBeInTheDocument();
      expect(screen.getByText('管理・その他')).toBeInTheDocument();
      expect(screen.getByText('ヘルプ')).toBeInTheDocument();
    });

    it('セクション間に視覚的な区切りがあること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const sections = container.querySelectorAll('.ec-mobile-menu__section');
      expect(sections.length).toBe(3);

      // 2つ目以降のセクションには境界線がある
      expect(sections[1]).toHaveClass('border-t');
      expect(sections[2]).toHaveClass('border-t');
    });
  });

  describe('【注文する】セクション', () => {
    beforeEach(() => {
      // 認証済みユーザーとして設定
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: {
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        });
      });
    });

    it('6つのメニューアイテムが表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('クイックオーダー')).toBeInTheDocument();
      expect(screen.getByText('注文履歴確認')).toBeInTheDocument();
      expect(screen.getByText('掲載外商品お取り寄せ')).toBeInTheDocument();
      expect(screen.getByText('マイカタログ')).toBeInTheDocument();
      expect(screen.getByText('お気に入り')).toBeInTheDocument();
      expect(screen.getByText('商品比較BOX')).toBeInTheDocument();
    });

    it('各アイテムが正しいhrefを持つこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('クイックオーダー').closest('a')).toHaveAttribute('href', '/quick-order');
      expect(screen.getByText('注文履歴確認').closest('a')).toHaveAttribute('href', '/mypage/orders');
      expect(screen.getByText('掲載外商品お取り寄せ').closest('a')).toHaveAttribute('href', '/special-order');
      expect(screen.getByText('マイカタログ').closest('a')).toHaveAttribute('href', '/mypage/catalog');
      expect(screen.getByText('お気に入り').closest('a')).toHaveAttribute('href', '/favorites');
      expect(screen.getByText('商品比較BOX').closest('a')).toHaveAttribute('href', '/compare');
    });

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

    it('お気に入りが0件の場合、バッジが表示されないこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const favoriteLink = screen.getByText('お気に入り').closest('a');
      const badge = favoriteLink?.querySelector('.ec-mobile-menu__badge');

      expect(badge).toBeNull();
    });
  });

  describe('【管理・その他】セクション', () => {
    beforeEach(() => {
      // 認証済みユーザーとして設定
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: {
            name: 'テストユーザー',
            email: 'test@example.com',
          },
        });
      });
    });

    it('6つのメニューアイテムが表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // マイページは複数箇所に表示されるため getAllByText を使用
      expect(screen.getAllByText('マイページ').length).toBeGreaterThan(0);
      expect(screen.getByText('購入データダウンロード')).toBeInTheDocument();
      expect(screen.getByText('環境配慮商品購入レポート')).toBeInTheDocument();
      expect(screen.getByText('デジタルカタログ')).toBeInTheDocument();
      expect(screen.getByText('スマートワークス・マガジン')).toBeInTheDocument();
      expect(screen.getByText('JTX TV')).toBeInTheDocument();
    });

    it('各アイテムが正しいhrefを持つこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('購入データダウンロード').closest('a')).toHaveAttribute('href', '/mypage/download');
      expect(screen.getByText('環境配慮商品購入レポート').closest('a')).toHaveAttribute('href', '/mypage/eco-report');
      expect(screen.getByText('デジタルカタログ').closest('a')).toHaveAttribute('href', '/catalog');
      expect(screen.getByText('スマートワークス・マガジン').closest('a')).toHaveAttribute('href', '/magazine');
      expect(screen.getByText('JTX TV').closest('a')).toHaveAttribute('href', '/tv');

      // マイページは複数存在するため、管理セクション内のものを確認
      const mypageLinks = screen.getAllByText('マイページ');
      const managementSectionMypage = mypageLinks.find(link =>
        link.closest('a')?.getAttribute('href') === '/mypage' &&
        link.closest('.ec-mobile-menu__section')?.querySelector('h3')?.textContent === '管理・その他'
      );
      expect(managementSectionMypage).toBeDefined();
    });

    it('デジタルカタログとスマートワークス・マガジンは未認証でも表示されること', () => {
      act(() => {
        useAuthStore.setState({
          isAuthenticated: false,
          user: null,
        });
      });

      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('デジタルカタログ')).toBeInTheDocument();
      expect(screen.getByText('スマートワークス・マガジン')).toBeInTheDocument();
      expect(screen.getByText('JTX TV')).toBeInTheDocument();
    });
  });

  describe('【ヘルプ】セクション', () => {
    it('6つのメニューアイテムが表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('ご利用ガイド')).toBeInTheDocument();
      expect(screen.getByText('よくある質問')).toBeInTheDocument();
      expect(screen.getByText('お届け日について')).toBeInTheDocument();
      expect(screen.getByText('キャンセルについて')).toBeInTheDocument();
      expect(screen.getByText('返品について')).toBeInTheDocument();
      expect(screen.getByText('お問い合わせ窓口について')).toBeInTheDocument();
    });

    it('各アイテムが正しいhrefを持つこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('ご利用ガイド').closest('a')).toHaveAttribute('href', '/help/guide');
      expect(screen.getByText('よくある質問').closest('a')).toHaveAttribute('href', '/help/faq');
      expect(screen.getByText('お届け日について').closest('a')).toHaveAttribute('href', '/help/delivery');
      expect(screen.getByText('キャンセルについて').closest('a')).toHaveAttribute('href', '/help/cancel');
      expect(screen.getByText('返品について').closest('a')).toHaveAttribute('href', '/help/return');
      expect(screen.getByText('お問い合わせ窓口について').closest('a')).toHaveAttribute('href', '/help/contact');
    });

    it('ヘルプセクションは認証状態に関わらず表示されること', () => {
      const { rerender } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // 未認証時
      expect(screen.getByText('ご利用ガイド')).toBeInTheDocument();

      // 認証時
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: { name: 'テストユーザー', email: 'test@example.com' },
        });
      });

      rerender(<MobileMenu isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText('ご利用ガイド')).toBeInTheDocument();
    });
  });

  describe('認証状態による表示制御', () => {
    it('未認証時、requiresAuth項目が表示されないこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // requiresAuth: true の項目
      expect(screen.queryByText('クイックオーダー')).not.toBeInTheDocument();
      expect(screen.queryByText('注文履歴確認')).not.toBeInTheDocument();
      expect(screen.queryByText('マイページ')).not.toBeInTheDocument();
      expect(screen.queryByText('購入データダウンロード')).not.toBeInTheDocument();
    });

    it('認証時、全ての項目が表示されること', () => {
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: { name: 'テストユーザー', email: 'test@example.com' },
        });
      });

      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      // 認証が必要な項目が表示される
      expect(screen.getByText('クイックオーダー')).toBeInTheDocument();
      expect(screen.getByText('注文履歴確認')).toBeInTheDocument();
      expect(screen.getAllByText('マイページ').length).toBeGreaterThan(0);
      expect(screen.getByText('購入データダウンロード')).toBeInTheDocument();
    });
  });

  describe('アカウントセクション', () => {
    it('認証済みユーザーの場合、ユーザー情報とログアウトが表示されること', () => {
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
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    });

    it('未認証ユーザーの場合、ログイン・新規登録リンクが表示されること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('ログイン')).toBeInTheDocument();
      expect(screen.getByText('新規登録')).toBeInTheDocument();
      expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
    });

    it('ログインリンクが正しいhrefを持つこと', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('ログイン').closest('a')).toHaveAttribute('href', '/login');
      expect(screen.getByText('新規登録').closest('a')).toHaveAttribute('href', '/signup');
    });
  });

  describe('インタラクション', () => {
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

    it('メニューアイテムをクリックするとonCloseが呼ばれること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const helpLink = screen.getByText('ご利用ガイド').closest('a');
      if (helpLink) {
        fireEvent.click(helpLink);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });

  describe('アイコン表示', () => {
    beforeEach(() => {
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: { name: 'テストユーザー', email: 'test@example.com' },
        });
      });
    });

    it('各メニューアイテムにSVGアイコンが表示されること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const menuLinks = container.querySelectorAll('.ec-mobile-menu__link');

      menuLinks.forEach((link) => {
        const icon = link.querySelector('svg.ec-mobile-menu__icon');
        expect(icon).toBeInTheDocument();
      });
    });

    it('複数パスのアイコンが正しく表示されること（商品比較BOX）', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const compareLink = screen.getByText('商品比較BOX').closest('a');
      const icon = compareLink?.querySelector('svg.ec-mobile-menu__icon');

      // 2つのpathがあることを確認
      const paths = icon?.querySelectorAll('path');
      expect(paths?.length).toBe(2);
    });
  });

  describe('アクセシビリティ', () => {
    it('閉じるボタンにaria-labelが設定されていること', () => {
      render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('メニューを閉じる');
      expect(closeButton).toHaveAttribute('aria-label', 'メニューを閉じる');
    });

    it('オーバーレイにaria-hidden属性が設定されていること', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const overlay = container.querySelector('.ec-mobile-menu__overlay');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('スタイリング', () => {
    beforeEach(() => {
      // 認証済みユーザーとして設定（全てのメニューを表示するため）
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: { name: 'テストユーザー', email: 'test@example.com' },
        });
      });
    });

    it('ドロワーメニューが正しいz-indexを持つこと', () => {
      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const drawer = container.querySelector('.ec-mobile-menu');
      expect(drawer).toHaveClass('z-[130]');

      const overlay = container.querySelector('.ec-mobile-menu__overlay');
      expect(overlay).toHaveClass('z-[120]');
    });

    it('メニューアイテムにホバースタイルが適用されること', () => {
      // 認証済みユーザーとして設定
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          user: { name: 'テストユーザー', email: 'test@example.com' },
        });
      });

      const { container } = render(<MobileMenu isOpen={true} onClose={mockOnClose} />);

      const menuLinks = container.querySelectorAll('.ec-mobile-menu__link');
      expect(menuLinks.length).toBeGreaterThan(0);

      // 全てのメニューリンクにホバースタイルが適用されていることを確認
      menuLinks.forEach((link) => {
        expect(link).toHaveClass('hover:bg-gray-100');
      });
    });
  });
});
