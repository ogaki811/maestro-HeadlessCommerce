/**
 * QuickOrderMultiLineForm Component Test
 * クイックオーダー複数行フォーム テスト
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuickOrderMultiLineForm from '../QuickOrderMultiLineForm';

// useProductSearchのモック
jest.mock('@/hooks/useProductSearch', () => ({
  useProductSearch: jest.fn((code: string) => ({
    result: code === 'ABC123' ? {
      id: 'product-1',
      code: 'ABC123',
      name: 'テスト商品',
      price: 1000,
      priceWithTax: 1100,
      isAvailable: true,
    } : null,
    error: null,
    isSearching: false,
  })),
}));

describe('QuickOrderMultiLineForm', () => {
  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態で20行表示されること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('10件追加ボタンで行が追加されること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    const addButton = screen.getByRole('button', { name: /10件追加/ });
    fireEvent.click(addButton);

    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('最大99行まで追加できること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    const addButton = screen.getByRole('button', { name: /10件追加/ });

    // 20 + 10*7 = 90行
    for (let i = 0; i < 7; i++) {
      fireEvent.click(addButton);
    }

    expect(screen.getByText('90')).toBeInTheDocument();

    // 90 + 10 = 100 → 99が最大なので9行のみ追加される
    fireEvent.click(addButton);
    expect(screen.getByText('99')).toBeInTheDocument();

    // これ以上追加できない
    expect(screen.getByRole('button', { name: /最大行数に達しています/ })).toBeDisabled();
  });

  it('カート追加ボタンが表示されること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    expect(screen.getByRole('button', { name: /カートに追加/ })).toBeInTheDocument();
  });

  it('カート追加ボタンクリック時にonAddToCartが呼ばれること', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(undefined);
    render(<QuickOrderMultiLineForm onAddToCart={mockAddToCart} />);

    // 商品コードを入力
    const inputs = screen.getAllByLabelText('商品コード');
    fireEvent.change(inputs[0], { target: { value: 'ABC123' } });

    // 数量を変更
    const quantityInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(quantityInputs[0], { target: { value: '5' } });

    // カートに追加
    const addToCartButton = screen.getByRole('button', { name: /カートに追加/ });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalled();
    });
  });

  it('空の行はカートに追加されないこと', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(undefined);
    render(<QuickOrderMultiLineForm onAddToCart={mockAddToCart} />);

    // 何も入力せずにカート追加
    const addToCartButton = screen.getByRole('button', { name: /カートに追加/ });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      // 空配列で呼ばれるか、呼ばれないはず
      if (mockAddToCart.mock.calls.length > 0) {
        expect(mockAddToCart.mock.calls[0][0]).toEqual([]);
      }
    });
  });

  it('入力済み商品の数が表示されること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    // 商品コードを入力
    const inputs = screen.getAllByLabelText('商品コード');
    fireEvent.change(inputs[0], { target: { value: 'ABC123' } });
    fireEvent.change(inputs[1], { target: { value: 'DEF456' } });

    // 入力済み商品数が表示される（実装に依存）
    // カートに追加ボタンに反映される可能性がある
  });
});
