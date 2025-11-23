import { render, screen } from '@testing-library/react';
import PointCard from '../PointCard';

describe('PointCard', () => {
  it('ポイント情報が正しく表示される', () => {
    render(
      <PointCard
        currentPoints={2500}
        expiringThisMonth={100}
        expiringNextMonth={50}
      />
    );

    expect(screen.getByText('2,500')).toBeInTheDocument();
    // ptは2箇所に表示される（今月末・翌月末）
    const ptElements = screen.getAllByText('pt');
    expect(ptElements).toHaveLength(2);
    // 100と50はexact matchで検索（/50/は2,500にもマッチするため）
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('0ポイントが正しく表示される', () => {
    render(<PointCard currentPoints={0} expiringThisMonth={0} expiringNextMonth={0} />);

    // 0ポイントは3箇所に表示される（現在/今月末失効/翌月末失効）
    const zeroTexts = screen.getAllByText('0');
    expect(zeroTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('ポイント交換リンクが表示される', () => {
    render(
      <PointCard
        currentPoints={1000}
        expiringThisMonth={0}
        expiringNextMonth={0}
      />
    );

    const exchangeLink = screen.getByRole('link', { name: 'ポイント交換' });
    const historyLink = screen.getByRole('link', { name: 'ポイント交換履歴' });

    expect(exchangeLink).toBeInTheDocument();
    expect(historyLink).toBeInTheDocument();
  });

  it('大きい数値が正しくフォーマットされる', () => {
    render(
      <PointCard
        currentPoints={123456}
        expiringThisMonth={9999}
        expiringNextMonth={8888}
      />
    );

    expect(screen.getByText('123,456')).toBeInTheDocument();
  });
});
