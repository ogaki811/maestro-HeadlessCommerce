/**
 * QuickOrderSummary Component Test
 * クイックオーダーサマリー テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderSummary from '../QuickOrderSummary';

describe('QuickOrderSummary', () => {
  const defaultProps = {
    totalAmount: 5000,
    productCount: 3,
    totalQuantity: 10,
    onAddToCart: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('合計金額が正しく表示されること', () => {
    render(<QuickOrderSummary {...defaultProps} />);

    expect(screen.getByText(/¥5,000/)).toBeInTheDocument();
  });

  it('商品数と数量が正しく表示されること', () => {
    render(<QuickOrderSummary {...defaultProps} />);

    expect(screen.getByText(/3商品/)).toBeInTheDocument();
    expect(screen.getByText(/10個/)).toBeInTheDocument();
  });

  it('カート追加ボタンが表示されること', () => {
    render(<QuickOrderSummary {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'カートに追加' });
    expect(button).toBeInTheDocument();
  });

  it('カート追加ボタンクリック時にonAddToCartが呼ばれること', () => {
    const handleAddToCart = jest.fn();
    render(<QuickOrderSummary {...defaultProps} onAddToCart={handleAddToCart} />);

    const button = screen.getByRole('button', { name: 'カートに追加' });
    fireEvent.click(button);

    expect(handleAddToCart).toHaveBeenCalled();
  });

  it('isLoadingがtrueの場合、ボタンが無効化され「カートに追加中...」と表示されること', () => {
    render(<QuickOrderSummary {...defaultProps} isLoading={true} />);

    const button = screen.getByRole('button', { name: 'カートに追加中...' });
    expect(button).toBeDisabled();
  });

  it('isLoadingがfalseの場合、ボタンが有効化されること', () => {
    render(<QuickOrderSummary {...defaultProps} isLoading={false} />);

    const button = screen.getByRole('button', { name: 'カートに追加' });
    expect(button).not.toBeDisabled();
  });

  it('金額が大きい場合、カンマ区切りでフォーマットされること', () => {
    render(<QuickOrderSummary {...defaultProps} totalAmount={1234567} />);

    expect(screen.getByText(/¥1,234,567/)).toBeInTheDocument();
  });
});
