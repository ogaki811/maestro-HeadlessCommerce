/**
 * QuickOrderInputRow Component Test
 * クイックオーダー入力行 テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderInputRow from '../QuickOrderInputRow';

// useProductSearchをモック
jest.mock('@/hooks/useProductSearch', () => ({
  useProductSearch: jest.fn(() => ({
    result: null,
    error: null,
    isSearching: false,
  })),
}));

describe('QuickOrderInputRow', () => {
  const mockOnAdd = jest.fn();
  const defaultProps = {
    productCode: '',
    onProductCodeChange: jest.fn(),
    quantity: 1,
    onQuantityChange: jest.fn(),
    onAdd: mockOnAdd,
    canAdd: false,
    isSearching: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<QuickOrderInputRow {...defaultProps} />);

    expect(screen.getByLabelText('商品コード')).toBeInTheDocument();
    expect(screen.getByLabelText('数量')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('商品コード入力時にonProductCodeChangeが呼ばれること', () => {
    const handleChange = jest.fn();
    render(<QuickOrderInputRow {...defaultProps} onProductCodeChange={handleChange} />);

    const input = screen.getByLabelText('商品コード');
    fireEvent.change(input, { target: { value: 'ABC123' } });

    expect(handleChange).toHaveBeenCalledWith('ABC123');
  });

  it('数量変更時にonQuantityChangeが呼ばれること', () => {
    const handleChange = jest.fn();
    render(<QuickOrderInputRow {...defaultProps} onQuantityChange={handleChange} />);

    const input = screen.getByLabelText('数量');
    fireEvent.change(input, { target: { value: '5' } });

    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('追加ボタンクリック時にonAddが呼ばれること', () => {
    const handleAdd = jest.fn();
    render(<QuickOrderInputRow {...defaultProps} onAdd={handleAdd} canAdd={true} />);

    const button = screen.getByRole('button', { name: '追加' });
    fireEvent.click(button);

    expect(handleAdd).toHaveBeenCalled();
  });

  it('canAddがfalseの場合、追加ボタンが無効化されること', () => {
    render(<QuickOrderInputRow {...defaultProps} canAdd={false} />);

    const button = screen.getByRole('button', { name: '追加' });
    expect(button).toBeDisabled();
  });

  it('canAddがtrueの場合、追加ボタンが有効化されること', () => {
    render(<QuickOrderInputRow {...defaultProps} canAdd={true} />);

    const button = screen.getByRole('button', { name: '追加' });
    expect(button).not.toBeDisabled();
  });

  it('Enterキー押下時にonAddが呼ばれること（canAddがtrueの場合）', () => {
    const handleAdd = jest.fn();
    render(<QuickOrderInputRow {...defaultProps} onAdd={handleAdd} canAdd={true} />);

    const input = screen.getByLabelText('商品コード');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(handleAdd).toHaveBeenCalled();
  });

  it('Enterキー押下時にonAddが呼ばれないこと（canAddがfalseの場合）', () => {
    const handleAdd = jest.fn();
    render(<QuickOrderInputRow {...defaultProps} onAdd={handleAdd} canAdd={false} />);

    const input = screen.getByLabelText('商品コード');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(handleAdd).not.toHaveBeenCalled();
  });
});
