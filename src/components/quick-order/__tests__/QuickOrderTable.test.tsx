/**
 * QuickOrderTable Component Test
 * クイックオーダーテーブル テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuickOrderTable from '../QuickOrderTable';
import type { QuickOrderRowData } from '../QuickOrderTable';

// useProductSearchのモック
jest.mock('@/hooks/useProductSearch', () => ({
  useProductSearch: jest.fn((code: string) => ({
    result: null,
    error: null,
    isSearching: false,
    hasResult: false,
    hasError: false,
  })),
}));

describe('QuickOrderTable', () => {
  const mockOnRowChange = jest.fn();
  const mockOnAddRows = jest.fn();

  const createMockRows = (count: number): QuickOrderRowData[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `row-${i + 1}`,
      productCode: '',
      quantity: 1,
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('指定された行数が表示されること', () => {
    const rows = createMockRows(20);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    // 行番号1-20が表示されている
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('10件追加ボタンがクリックされたときonAddRowsが呼ばれること', () => {
    const rows = createMockRows(20);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    const addButton = screen.getByRole('button', { name: /10件追加/ });
    fireEvent.click(addButton);

    expect(mockOnAddRows).toHaveBeenCalledWith(10);
  });

  it('最大行数に達したら追加ボタンが無効化されること', () => {
    const rows = createMockRows(99);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    const addButton = screen.getByRole('button', { name: /最大行数に達しています/ });
    expect(addButton).toBeDisabled();
  });

  it('残り追加可能件数が正しく表示されること', () => {
    const rows = createMockRows(20);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    expect(screen.getByText(/残り79件追加可能/)).toBeInTheDocument();
  });

  it('商品コード変更時にonRowChangeが呼ばれること', () => {
    const rows = createMockRows(5);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    const inputs = screen.getAllByPlaceholderText('商品コード');
    fireEvent.change(inputs[0], { target: { value: 'ABC123' } });

    expect(mockOnRowChange).toHaveBeenCalledWith('row-1', 'productCode', 'ABC123');
  });

  it('数量変更時にonRowChangeが呼ばれること', () => {
    const rows = createMockRows(5);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    const quantityInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(quantityInputs[0], { target: { value: '5' } });

    expect(mockOnRowChange).toHaveBeenCalledWith('row-1', 'quantity', 5);
  });

  it('最大行数に達している場合、追加ボタンのテキストが変わること', () => {
    const rows = createMockRows(99);
    render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    expect(screen.getByText(/最大行数に達しています/)).toBeInTheDocument();
  });

  it('ヘッダー行が正しく表示されること', () => {
    const rows = createMockRows(5);
    const { container } = render(
      <QuickOrderTable
        rows={rows}
        onRowChange={mockOnRowChange}
        onAddRows={mockOnAddRows}
        maxRows={99}
      />
    );

    // ヘッダー部分のみを確認（複数表示される可能性があるテキストを回避）
    expect(screen.getByText('No.')).toBeInTheDocument();
    expect(screen.getAllByText('商品コード').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('数量').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('商品情報')).toBeInTheDocument();
  });
});
