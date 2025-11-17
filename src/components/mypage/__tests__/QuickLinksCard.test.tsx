import { render, screen } from '@testing-library/react';
import QuickLinksCard from '../QuickLinksCard';

describe('QuickLinksCard', () => {
  it('複数のリンクが正しく表示される', () => {
    const links = [
      { label: 'ご利用ガイド', href: '/help/guide' },
      { label: 'よくあるご質問', href: '/help/faq' },
      { label: 'お問い合わせ', href: '/contact' },
    ];

    render(<QuickLinksCard links={links} />);

    expect(screen.getByRole('link', { name: 'ご利用ガイド' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'よくあるご質問' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'お問い合わせ' })).toBeInTheDocument();
  });

  it('リンクのhrefが正しく設定される', () => {
    const links = [{ label: 'テストリンク', href: '/test' }];

    render(<QuickLinksCard links={links} />);

    const link = screen.getByRole('link', { name: 'テストリンク' });
    expect(link).toHaveAttribute('href', '/test');
  });

  it('空のリンク配列で正しくレンダリングされる', () => {
    const { container } = render(<QuickLinksCard links={[]} />);

    const links = container.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it('1つのリンクが正しく表示される', () => {
    const links = [{ label: '単一リンク', href: '/single' }];

    render(<QuickLinksCard links={links} />);

    expect(screen.getByRole('link', { name: '単一リンク' })).toBeInTheDocument();
  });
});
