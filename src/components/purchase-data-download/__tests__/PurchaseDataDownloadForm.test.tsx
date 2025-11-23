import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PurchaseDataDownloadForm } from '../PurchaseDataDownloadForm';

// モック
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, type, disabled, loading, ...props }: React.ComponentProps<'button'> & { loading?: boolean }) => (
    <button onClick={onClick} type={type} disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

jest.mock('@/components/ui/Select', () => ({
  Select: ({ value, onChange, options, ...props }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) => (
    <select value={value} onChange={onChange} {...props}>
      {options?.map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('@/components/ui/Input', () => ({
  Input: ({ value, onChange, ...props }: React.ComponentProps<'input'>) => (
    <input value={value} onChange={onChange} {...props} />
  ),
}));

describe('PurchaseDataDownloadForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('フォームが正しくレンダリングされる', () => {
    render(<PurchaseDataDownloadForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('検索条件入力')).toBeInTheDocument();
    expect(screen.getByText('納品日')).toBeInTheDocument();
    expect(screen.getByText('データ形式')).toBeInTheDocument();
    expect(screen.getByText('フォーマット')).toBeInTheDocument();
    expect(screen.getByText('管理受託品')).toBeInTheDocument();
    expect(screen.getByText('対象データ')).toBeInTheDocument();
    expect(screen.getByText('入力クリア')).toBeInTheDocument();
    expect(screen.getByText('ダウンロードデータ作成')).toBeInTheDocument();
  });

  it('入力クリアボタンでフォームがリセットされる', async () => {
    render(<PurchaseDataDownloadForm onSubmit={mockOnSubmit} />);

    const clearButton = screen.getByText('入力クリア');
    fireEvent.click(clearButton);

    // デフォルト値にリセットされることを確認
    const csvOption = screen.getByRole('option', { name: 'CSV' }) as HTMLOptionElement;
    expect(csvOption.selected).toBe(true);
  });

  it('送信時にonSubmitが呼ばれる', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    render(<PurchaseDataDownloadForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('ダウンロードデータ作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('ローディング中はボタンが無効化される', () => {
    render(<PurchaseDataDownloadForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByText('Loading...');
    expect(submitButton).toBeDisabled();

    const clearButton = screen.getByText('入力クリア');
    expect(clearButton).toBeDisabled();
  });

  it('対象データを「指定コードの注文」に変更するとコード入力欄が表示される', async () => {
    render(<PurchaseDataDownloadForm onSubmit={mockOnSubmit} />);

    // 「指定コードの注文」を選択
    const targetDataSelect = screen.getAllByRole('combobox')[4];
    fireEvent.change(targetDataSelect, { target: { value: 'specified' } });

    await waitFor(() => {
      expect(screen.getByText('コード入力')).toBeInTheDocument();
    });
  });

  it('日付バリデーションエラーが表示される', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('日付エラー'));
    render(<PurchaseDataDownloadForm onSubmit={mockOnSubmit} />);

    // 開始年の入力をクリア
    const yearInputs = screen.getAllByRole('textbox');
    fireEvent.change(yearInputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('ダウンロードデータ作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      // バリデーションエラーメッセージが表示される
      expect(screen.getByText(/日付/)).toBeInTheDocument();
    });
  });
});
