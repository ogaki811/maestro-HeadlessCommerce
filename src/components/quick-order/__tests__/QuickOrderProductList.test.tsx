/**
 * QuickOrderProductList Component Test
 * クイックオーダー商品リスト テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderProductList from '../QuickOrderProductList';

describe('QuickOrderProductList', () => {
  const mockProducts = [
    {
      id: 'product-1',
      code: 'ABC123',
      name: 'テスト商品1',
      price: 1000,
      quantity: 2,
      imageUrl: 'https://example.com/product1.jpg',
    },
    {
      id: 'product-2',
      code: 'DEF456',
      name: 'テスト商品2',
      price: 2000,
      quantity: 1,
      imageUrl: 'https://example.com/product2.jpg',
    },
  ];

  const mockOnRemove = jest.fn();
  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('商品リストが正しく表示されること', () => {
    render(
      <QuickOrderProductList
        products={mockProducts}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        isLoading={false}
      />
    );

    expect(screen.getByText('テスト商品1')).toBeInTheDocument();
    expect(screen.getByText('テスト商品2')).toBeInTheDocument();
  });

  it('タイトルに商品数が表示されること', () => {
    render(
      <QuickOrderProductList
        products={mockProducts}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        isLoading={false}
      />
    );

    expect(screen.getByText(/追加済み商品 \(2商品\)/)).toBeInTheDocument();
  });

  it('商品が削除されたときonRemoveが呼ばれること', () => {
    const handleRemove = jest.fn();
    render(
      <QuickOrderProductList
        products={mockProducts}
        onRemove={handleRemove}
        onAddToCart={mockOnAddToCart}
        isLoading={false}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: '削除' });
    fireEvent.click(removeButtons[0]);

    expect(handleRemove).toHaveBeenCalledWith('product-1');
  });

  it('合計金額が正しく計算されること', () => {
    render(
      <QuickOrderProductList
        products={mockProducts}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        isLoading={false}
      />
    );

    // 1000 × 2 + 2000 × 1 = 4000
    expect(screen.getByText(/¥4,000/)).toBeInTheDocument();
  });

  it('合計数量が正しく計算されること', () => {
    render(
      <QuickOrderProductList
        products={mockProducts}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        isLoading={false}
      />
    );

    // 2 + 1 = 3個
    expect(screen.getByText(/3個/)).toBeInTheDocument();
  });

  it('カート追加ボタンクリック時にonAddToCartが呼ばれること', () => {
    const handleAddToCart = jest.fn();
    render(
      <QuickOrderProductList
        products={mockProducts}
        onRemove={mockOnRemove}
        onAddToCart={handleAddToCart}
        isLoading={false}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: 'カートに追加' });
    fireEvent.click(addToCartButton);

    expect(handleAddToCart).toHaveBeenCalled();
  });

  it('空の商品リストの場合、何も表示されないこと', () => {
    const { container } = render(
      <QuickOrderProductList
        products={[]}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        isLoading={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
