/**
 * QuickOrderRow Component Test
 * クイックオーダー1行入力 テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderRow from '../QuickOrderRow';
import type { ProductSearchResult, ProductSearchError } from '@/hooks/useProductSearch';

describe('QuickOrderRow', () => {
  const mockOnProductCodeChange = jest.fn();
  const mockOnQuantityChange = jest.fn();

  const mockProduct: ProductSearchResult = {
    id: 'product-1',
    code: 'ABC123',
    name: 'テスト商品',
    description: 'テスト商品の説明',
    price: 1000,
    priceWithTax: 1100,
    imageUrl: 'https://example.com/product.jpg',
    stock: 10,
    category: 'category-1',
    isAvailable: true,
  };

  const mockError: ProductSearchError = {
    code: 'NOT_FOUND',
    message: '商品が見つかりません',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('行番号が正しく表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={5}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('商品コード入力時にonProductCodeChangeが呼ばれること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    const input = screen.getByLabelText('商品コード');
    fireEvent.change(input, { target: { value: 'ABC123' } });

    expect(mockOnProductCodeChange).toHaveBeenCalledWith('ABC123');
  });

  it('数量変更時にonQuantityChangeが呼ばれること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(5);
  });

  it('検索中インジケーターが表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="ABC"
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={true}
      />
    );

    expect(screen.getByText('検索中...')).toBeInTheDocument();
  });

  it('商品情報が正しく表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="ABC123"
        quantity={2}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={mockProduct}
        error={null}
        isSearching={false}
      />
    );

    expect(screen.getByText('テスト商品')).toBeInTheDocument();
    expect(screen.getByText('¥1,000')).toBeInTheDocument();
    expect(screen.getByText('在庫: 10個')).toBeInTheDocument();
  });

  it('エラーメッセージが表示されること', () => {
    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="INVALID"
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={mockError}
        isSearching={false}
      />
    );

    // エラーメッセージが複数箇所に表示される（入力欄下 + プレビューエリア）
    expect(screen.getAllByText('商品が見つかりません').length).toBeGreaterThanOrEqual(1);
  });

  it('在庫切れ商品の場合に警告が表示されること', () => {
    const outOfStockProduct: ProductSearchResult = {
      ...mockProduct,
      isAvailable: false,
      stock: 0,
    };

    render(
      <QuickOrderRow
        rowIndex={1}
        productCode="ABC123"
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={outOfStockProduct}
        error={null}
        isSearching={false}
      />
    );

    expect(screen.getByText('在庫切れ')).toBeInTheDocument();
  });

  it('商品情報がない場合は何も表示されないこと', () => {
    const { container } = render(
      <QuickOrderRow
        rowIndex={1}
        productCode=""
        quantity={1}
        onProductCodeChange={mockOnProductCodeChange}
        onQuantityChange={mockOnQuantityChange}
        product={null}
        error={null}
        isSearching={false}
      />
    );

    // 行番号、入力欄、数量のみ表示（プレビューエリアなし）
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('検索中...')).not.toBeInTheDocument();
    expect(screen.queryByText('商品が見つかりません')).not.toBeInTheDocument();
  });
});
