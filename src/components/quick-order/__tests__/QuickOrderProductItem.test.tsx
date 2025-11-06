/**
 * QuickOrderProductItem Component Test
 * クイックオーダー商品アイテム テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderProductItem from '../QuickOrderProductItem';

describe('QuickOrderProductItem', () => {
  const mockProduct = {
    id: 'product-1',
    code: 'ABC123',
    name: 'テスト商品',
    price: 1000,
    quantity: 2,
    imageUrl: 'https://example.com/product.jpg',
  };

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('商品情報が正しく表示されること', () => {
    render(<QuickOrderProductItem product={mockProduct} onRemove={mockOnRemove} />);

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('テスト商品')).toBeInTheDocument();
    expect(screen.getByText(/¥1,000/)).toBeInTheDocument();
    expect(screen.getByText(/2個/)).toBeInTheDocument();
  });

  it('商品画像が表示されること', () => {
    render(<QuickOrderProductItem product={mockProduct} onRemove={mockOnRemove} />);

    const image = screen.getByAltText('テスト商品');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
  });

  it('合計金額が正しく計算されて表示されること', () => {
    render(<QuickOrderProductItem product={mockProduct} onRemove={mockOnRemove} />);

    // ¥1,000 × 2個 = ¥2,000
    expect(screen.getByText(/¥2,000/)).toBeInTheDocument();
  });

  it('削除ボタンが表示されること', () => {
    render(<QuickOrderProductItem product={mockProduct} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button', { name: '削除' });
    expect(removeButton).toBeInTheDocument();
  });

  it('削除ボタンクリック時にonRemoveが呼ばれること', () => {
    const handleRemove = jest.fn();
    render(<QuickOrderProductItem product={mockProduct} onRemove={handleRemove} />);

    const removeButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(removeButton);

    expect(handleRemove).toHaveBeenCalledWith(mockProduct.id);
  });

  it('数値がカンマ区切りでフォーマットされること', () => {
    const expensiveProduct = {
      ...mockProduct,
      price: 123456,
      quantity: 10,
    };
    render(<QuickOrderProductItem product={expensiveProduct} onRemove={mockOnRemove} />);

    // 価格のフォーマット
    expect(screen.getByText(/¥123,456/)).toBeInTheDocument();
    // 合計金額のフォーマット (123,456 × 10 = 1,234,560)
    expect(screen.getByText(/¥1,234,560/)).toBeInTheDocument();
  });
});
