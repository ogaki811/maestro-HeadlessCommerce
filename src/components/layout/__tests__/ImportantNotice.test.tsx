/**
 * ImportantNotice Component Test
 * 重要なお知らせコンポーネント テスト
 */

import { render, screen } from '@testing-library/react';
import ImportantNotice from '../ImportantNotice';
import type { Notification } from '@/config/notificationsConfig';

// Next.js Linkのモック
jest.mock('next/link', () => {
  const MockLink = ({ children, ...props }: any) => {
    return <a {...props}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('ImportantNotice', () => {
  const mockNotifications: Notification[] = [
    {
      id: 'test-1',
      message: 'テストお知らせ1',
      priority: 'high',
    },
    {
      id: 'test-2',
      message: 'テストお知らせ2',
      link: {
        href: '/test-link',
        text: '詳細を見る',
      },
      priority: 'medium',
    },
  ];

  describe('レンダリング', () => {
    it('お知らせが表示されること', () => {
      render(<ImportantNotice notifications={mockNotifications} />);

      expect(screen.getByText('テストお知らせ1')).toBeInTheDocument();
      expect(screen.getByText('テストお知らせ2')).toBeInTheDocument();
    });

    it('お知らせが空の場合は何も表示されないこと', () => {
      const { container } = render(<ImportantNotice notifications={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('警告アイコンが表示されること', () => {
      const { container } = render(<ImportantNotice notifications={mockNotifications} />);

      // SVGアイコンが2つ表示される（お知らせ2件分）
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('リンク表示', () => {
    it('リンク付きお知らせが正しいhrefを持つこと', () => {
      render(<ImportantNotice notifications={mockNotifications} />);

      const link = screen.getByText('テストお知らせ2').closest('a');
      expect(link).toHaveAttribute('href', '/test-link');
    });

    it('リンクなしお知らせは#リンクになること', () => {
      render(<ImportantNotice notifications={mockNotifications} />);

      // テストお知らせ1にはリンクがない
      const notice1 = screen.getByText('テストお知らせ1').closest('a');
      expect(notice1).toHaveAttribute('href', '#');
    });

    it('リンク付きお知らせに矢印アイコンが表示されること', () => {
      const { container } = render(<ImportantNotice notifications={mockNotifications} />);

      // テストお知らせ2（リンク付き）には矢印アイコンがある
      const notice2Link = screen.getByText('テストお知らせ2').closest('a');
      const arrow = notice2Link?.querySelector('svg.text-gray-400');
      expect(arrow).toBeInTheDocument();
    });
  });

  describe('スタイリング', () => {
    it('お知らせ項目が正しく表示されること', () => {
      const { container } = render(<ImportantNotice notifications={mockNotifications} />);

      const noticeItems = container.querySelectorAll('a[role="alert"]');
      expect(noticeItems.length).toBe(2);
    });

    it('赤いアイコンが表示されること', () => {
      const { container } = render(<ImportantNotice notifications={mockNotifications} />);

      const icons = container.querySelectorAll('svg.text-red-600');
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });

    it('ホバー時の背景色変化が設定されていること', () => {
      const { container } = render(<ImportantNotice notifications={mockNotifications} />);

      const noticeItems = container.querySelectorAll('a[role="alert"]');
      noticeItems.forEach((item) => {
        expect(item).toHaveClass('hover:bg-gray-100');
      });
    });
  });

  describe('アクセシビリティ', () => {
    it('role="alert"が設定されていること', () => {
      const { container } = render(<ImportantNotice notifications={mockNotifications} />);

      const alerts = container.querySelectorAll('[role="alert"]');
      expect(alerts.length).toBe(2);
    });
  });
});
