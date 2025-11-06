/**
 * QuickOrderHelpSection Component Test
 * クイックオーダーヘルプセクション テスト
 */

import { render, screen } from '@testing-library/react';
import QuickOrderHelpSection from '../QuickOrderHelpSection';

describe('QuickOrderHelpSection', () => {
  it('タイトルが表示されること', () => {
    render(<QuickOrderHelpSection />);
    expect(screen.getByText('💡 使い方')).toBeInTheDocument();
  });

  it('4つの使い方ステップが表示されること', () => {
    render(<QuickOrderHelpSection />);

    expect(screen.getByText(/商品コードまたはJANコードを入力してください/)).toBeInTheDocument();
    expect(screen.getByText(/自動的に商品情報が表示されます/)).toBeInTheDocument();
    expect(screen.getByText(/数量を調整して「追加」ボタンをクリック/)).toBeInTheDocument();
    expect(screen.getByText(/必要な商品を全て追加したら「カートに追加」をクリック/)).toBeInTheDocument();
  });

  it('ヒントメッセージが表示されること', () => {
    render(<QuickOrderHelpSection />);

    expect(screen.getByText('ヒント:')).toBeInTheDocument();
    expect(screen.getByText(/Enterキーを押すと素早く商品を追加できます/)).toBeInTheDocument();
  });

  it('正しいHTML構造でレンダリングされること', () => {
    const { container } = render(<QuickOrderHelpSection />);

    // aside要素が存在すること
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();

    // h3要素が存在すること
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('💡 使い方');

    // ol要素が存在すること
    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();

    // li要素が4つ存在すること
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(4);
  });

  it('適切なaria属性が設定されていること', () => {
    const { container } = render(<QuickOrderHelpSection />);

    const aside = container.querySelector('aside');
    expect(aside).toHaveAttribute('aria-label', 'クイックオーダーの使い方');
  });
});
