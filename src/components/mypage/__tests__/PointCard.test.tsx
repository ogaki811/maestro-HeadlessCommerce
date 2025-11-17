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
    expect(screen.getByText('pt')).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('0ポイントが正しく表示される', () => {
    render(<PointCard currentPoints={0} expiringThisMonth={0} expiringNextMonth={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
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
