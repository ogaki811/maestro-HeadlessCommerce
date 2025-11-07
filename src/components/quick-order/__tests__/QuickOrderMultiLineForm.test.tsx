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

    // 上部と下部に2つカート追加ボタンがあることを確認
    const addToCartButtons = screen.getAllByRole('button', { name: /カートに追加/ });
    expect(addToCartButtons).toHaveLength(2);
  });

  it('カート追加ボタンクリック時にonAddToCartが呼ばれること', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(undefined);
    render(<QuickOrderMultiLineForm onAddToCart={mockAddToCart} />);

    // 商品コードを入力
    const inputs = screen.getAllByPlaceholderText('商品コード');
    fireEvent.change(inputs[0], { target: { value: 'ABC123' } });

    // 数量を変更
    const quantityInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(quantityInputs[0], { target: { value: '5' } });

    // カートに追加（上部ボタンを使用）
    const addToCartButtons = screen.getAllByRole('button', { name: /カートに追加/ });
    fireEvent.click(addToCartButtons[0]);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalled();
    });
  });

  it('空の行はカートに追加されないこと', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(undefined);
    render(<QuickOrderMultiLineForm onAddToCart={mockAddToCart} />);

    // 何も入力せずにカート追加（上部と下部に2つあるので最初のボタンを使用）
    const addToCartButtons = screen.getAllByRole('button', { name: /カートに追加/ });
    fireEvent.click(addToCartButtons[0]);

    // カートに追加が呼ばれないことを確認
    await waitFor(() => {
      expect(mockAddToCart).not.toHaveBeenCalled();
    });
  });

  it('入力済み商品の数が表示されること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    // 初期表示時は空（上部と下部に2箇所）
    const initialTexts = screen.getAllByText('入力済み: 0商品');
    expect(initialTexts).toHaveLength(2);

    // 商品コードを入力
    const inputs = screen.getAllByPlaceholderText('商品コード');
    fireEvent.change(inputs[0], { target: { value: 'ABC123' } });
    fireEvent.change(inputs[1], { target: { value: 'DEF456' } });

    // 入力済み商品数が2件になる（上部と下部に2箇所）
    const updatedTexts = screen.getAllByText('入力済み: 2商品');
    expect(updatedTexts).toHaveLength(2);
  });

  it('デモデータボタンでデモデータが入力されること', () => {
    render(<QuickOrderMultiLineForm onAddToCart={mockOnAddToCart} />);

    // 初期表示時は空
    const initialTexts = screen.getAllByText('入力済み: 0商品');
    expect(initialTexts).toHaveLength(2);

    // デモデータボタンをクリック
    const demoButton = screen.getByRole('button', { name: /デモデータを入力/ });
    fireEvent.click(demoButton);

    // デモデータが入力される（6件）
    const updatedTexts = screen.getAllByText('入力済み: 6商品');
    expect(updatedTexts).toHaveLength(2);
  });
});
