/**
 * CustomMenuBar Component Test
 * カスタムメニューバー テスト
 */

import { render, screen } from '@testing-library/react';
import CustomMenuBar from '../CustomMenuBar';

// Next.js Linkのモック
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('CustomMenuBar', () => {
  // テスト用のメニューID配列
  const selectedMenuIds = ['quote-request', 'quick-order', 'my-catalog', 'order-history'];

  describe('レンダリング', () => {
    it('選択されたメニューが表示されること', () => {
      render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      // 各メニューのテキストが表示される
      expect(screen.getByText('見積り依頼')).toBeInTheDocument();
      expect(screen.getByText('クイックオーダー')).toBeInTheDocument();
      expect(screen.getByText('マイカタログ')).toBeInTheDocument();
      expect(screen.getByText('注文履歴')).toBeInTheDocument();
    });

    it('選択されていないメニューは表示されないこと', () => {
      render(<CustomMenuBar selectedMenuIds={['quote-request']} />);

      // 見積り依頼のみ表示
      expect(screen.getByText('見積り依頼')).toBeInTheDocument();

      // その他は表示されない
      expect(screen.queryByText('クイックオーダー')).not.toBeInTheDocument();
      expect(screen.queryByText('マイカタログ')).not.toBeInTheDocument();
    });

    it('空の配列の場合は何も表示されないこと', () => {
      const { container } = render(<CustomMenuBar selectedMenuIds={[]} />);

      // メニュー項目が存在しない
      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(0);
    });

    it('存在しないIDは無視されること', () => {
      render(<CustomMenuBar selectedMenuIds={['quote-request', 'non-existent-id']} />);

      // 見積り依頼のみ表示
      expect(screen.getByText('見積り依頼')).toBeInTheDocument();

      // 存在しないIDは表示されない（エラーも発生しない）
      expect(screen.queryByText('non-existent-id')).not.toBeInTheDocument();
    });
  });

  describe('リンク動作', () => {
    it('各メニュー項目が正しいhrefを持つこと', () => {
      render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      const quoteLink = screen.getByText('見積り依頼').closest('a');
      const quickOrderLink = screen.getByText('クイックオーダー').closest('a');
      const myCatalogLink = screen.getByText('マイカタログ').closest('a');
      const orderHistoryLink = screen.getByText('注文履歴').closest('a');

      expect(quoteLink).toHaveAttribute('href', '/quote-request');
      expect(quickOrderLink).toHaveAttribute('href', '/quick-order');
      expect(myCatalogLink).toHaveAttribute('href', '/my-catalog');
      expect(orderHistoryLink).toHaveAttribute('href', '/mypage/orders');
    });
  });

  describe('アイコン表示', () => {
    it('各メニュー項目にアイコンが表示されること', () => {
      const { container } = render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      // SVGアイコンが4つ表示される
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(4);
    });
  });

  describe('バッジ表示', () => {
    it('バッジがないメニューには件数が表示されないこと', () => {
      render(<CustomMenuBar selectedMenuIds={['quote-request']} />);

      // 見積り依頼にはバッジがない
      expect(screen.getByText('見積り依頼')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('customizable: false のメニューは表示されないこと', () => {
      // 承認はcustomizable: falseなので、カスタムメニューに追加されても表示されない
      render(<CustomMenuBar selectedMenuIds={['approval', 'quote-request']} />);

      expect(screen.getByText('見積り依頼')).toBeInTheDocument();
      expect(screen.queryByText('承認')).not.toBeInTheDocument();
    });
  });

  describe('スタイリング', () => {
    it('背景色がbg-gray-50であること', () => {
      const { container } = render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      const menuBar = container.firstChild as HTMLElement;
      expect(menuBar).toHaveClass('bg-gray-50');
    });

    it('メニュー項目が横並びで表示されること', () => {
      const { container } = render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      const menuBar = container.firstChild as HTMLElement;
      expect(menuBar).toHaveClass('flex');
      expect(menuBar).toHaveClass('items-center');
    });

    it('スクロール対応のクラスが適用されていること', () => {
      const { container } = render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      const menuBar = container.firstChild as HTMLElement;
      expect(menuBar).toHaveClass('overflow-x-auto');
      expect(menuBar).toHaveClass('flex-nowrap');
    });
  });

  describe('順序', () => {
    it('選択された順序でメニューが表示されること', () => {
      const customOrder = ['my-catalog', 'quote-request', 'quick-order'];
      const { container } = render(<CustomMenuBar selectedMenuIds={customOrder} />);

      const links = Array.from(container.querySelectorAll('a'));
      const texts = links.map(link => link.textContent);

      expect(texts).toEqual(['マイカタログ', '見積り依頼', 'クイックオーダー']);
    });
  });

  describe('アクセシビリティ', () => {
    it('ナビゲーションにroleとaria-labelが設定されていること', () => {
      const { container } = render(<CustomMenuBar selectedMenuIds={selectedMenuIds} />);

      const nav = container.querySelector('[role="navigation"]');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'カスタムメニュー');
    });
  });
});
