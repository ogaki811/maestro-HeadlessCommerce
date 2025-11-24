import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RestockAlertList } from '../RestockAlertList';
import { RestockAlert } from '@/types/restock-alert';

// モック
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('RestockAlertList', () => {
  const mockAlerts: RestockAlert[] = [
    {
      id: '1',
      productId: '704321',
      productCode: '704321',
      productName: 'ワイヤレスアンプ ATW-SP1920',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      productId: '708721',
      productCode: '708721',
      productName: 'レバーリングF GX Dタイプ3774GX-B 10冊',
      createdAt: '2024-01-16T10:00:00Z',
    },
    {
      id: '3',
      productId: '723371',
      productCode: '723371',
      productName: '881 ニトリスト・フィット100枚 S/ブルー',
      createdAt: '2024-01-17T10:00:00Z',
    },
  ];

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('一覧が正しく表示される', () => {
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    expect(screen.getByText('ワイヤレスアンプ ATW-SP1920')).toBeInTheDocument();
    expect(screen.getByText('レバーリングF GX Dタイプ3774GX-B 10冊')).toBeInTheDocument();
    expect(screen.getByText('881 ニトリスト・フィット100枚 S/ブルー')).toBeInTheDocument();
  });

  it('件数が正しく表示される', () => {
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/件あります/)).toBeInTheDocument();
  });

  it('商品コードが表示される', () => {
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    expect(screen.getByText('704321')).toBeInTheDocument();
    expect(screen.getByText('708721')).toBeInTheDocument();
    expect(screen.getByText('723371')).toBeInTheDocument();
  });

  it('商品名がリンクになっている', () => {
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    const link = screen.getByRole('link', { name: 'ワイヤレスアンプ ATW-SP1920' });
    expect(link).toHaveAttribute('href', '/products/704321');
  });

  it('解除ボタンがクリックできる', async () => {
    mockOnDelete.mockResolvedValueOnce(undefined);
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('解除');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('データがない場合は空状態が表示される', () => {
    render(<RestockAlertList alerts={[]} onDelete={mockOnDelete} />);

    expect(screen.getByText('販売再開メールの登録がありません。')).toBeInTheDocument();
  });

  it('ローディング状態が表示される', () => {
    render(<RestockAlertList alerts={[]} onDelete={mockOnDelete} isLoading={true} />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('テーブルヘッダーが表示される', () => {
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    expect(screen.getByText('商品コード')).toBeInTheDocument();
    expect(screen.getByText('商品名')).toBeInTheDocument();
    expect(screen.getByText('操作')).toBeInTheDocument();
  });

  it('削除中は該当ボタンが無効化される', async () => {
    // 削除処理が完了しないPromiseを返す
    mockOnDelete.mockImplementation(() => new Promise(() => {}));
    render(<RestockAlertList alerts={mockAlerts} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('解除');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteButtons[0]).toBeDisabled();
    });
  });
});
