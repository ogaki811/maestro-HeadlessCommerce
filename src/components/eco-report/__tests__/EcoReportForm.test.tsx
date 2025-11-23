import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EcoReportForm } from '../EcoReportForm';

// モック
jest.mock('@/components/ui/Button', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    loading,
    ...props
  }: React.ComponentProps<'button'> & { loading?: boolean }) => (
    <button onClick={onClick} type={type} disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

jest.mock('@/components/ui/Select', () => ({
  Select: ({
    value,
    onChange,
    options,
    ...props
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
  }) => (
    <select value={value} onChange={onChange} {...props}>
      {options?.map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe('EcoReportForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultTargetCodes = [
    { value: 'code1', label: 'テストコード1' },
    { value: 'code2', label: 'テストコード2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('フォームが正しくレンダリングされる', () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    expect(screen.getByText('作成対象')).toBeInTheDocument();
    expect(screen.getByText('対象コード')).toBeInTheDocument();
    expect(screen.getByText('集計方式')).toBeInTheDocument();
    expect(screen.getByText('集計締日')).toBeInTheDocument();
    expect(screen.getByText('レポート作成')).toBeInTheDocument();
  });

  it('説明文が表示される', () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    expect(screen.getByText(/過去一年分の環境配慮商品購入レポートを作成します/)).toBeInTheDocument();
    expect(screen.getByText(/作成対象を選択し/)).toBeInTheDocument();
  });

  it('送信時にonSubmitが呼ばれる', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    const submitButton = screen.getByText('レポート作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        targetCode: 'code1',
        aggregationType: 'amount',
        closingDay: 20,
      });
    });
  });

  it('ローディング中はボタンが無効化される', () => {
    render(
      <EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} isLoading={true} />
    );

    const submitButton = screen.getByText('Loading...');
    expect(submitButton).toBeDisabled();
  });

  it('対象コードを変更できる', async () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    const selects = screen.getAllByRole('combobox');
    const targetCodeSelect = selects[0];

    fireEvent.change(targetCodeSelect, { target: { value: 'code2' } });

    const submitButton = screen.getByText('レポート作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          targetCode: 'code2',
        })
      );
    });
  });

  it('集計方式を変更できる', async () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    const selects = screen.getAllByRole('combobox');
    const aggregationTypeSelect = selects[1];

    fireEvent.change(aggregationTypeSelect, { target: { value: 'quantity' } });

    const submitButton = screen.getByText('レポート作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          aggregationType: 'quantity',
        })
      );
    });
  });

  it('集計締日を変更できる', async () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    const selects = screen.getAllByRole('combobox');
    const closingDaySelect = selects[2];

    fireEvent.change(closingDaySelect, { target: { value: '15' } });

    const submitButton = screen.getByText('レポート作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          closingDay: 15,
        })
      );
    });
  });

  it('デフォルト値が正しく設定される', () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    // 集計方式のデフォルトは「金額ベース」
    const amountOption = screen.getByRole('option', { name: '金額ベース' }) as HTMLOptionElement;
    expect(amountOption.selected).toBe(true);

    // 集計締日のデフォルトは20日
    const day20Option = screen.getByRole('option', { name: '20' }) as HTMLOptionElement;
    expect(day20Option.selected).toBe(true);
  });

  it('APIエラーが表示される', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('レポート作成に失敗しました'));
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={defaultTargetCodes} />);

    const submitButton = screen.getByText('レポート作成');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('レポート作成に失敗しました')).toBeInTheDocument();
    });
  });

  it('対象コードオプションが空の場合でも動作する', () => {
    render(<EcoReportForm onSubmit={mockOnSubmit} targetCodeOptions={[]} />);

    expect(screen.getByText('作成対象')).toBeInTheDocument();
  });
});
