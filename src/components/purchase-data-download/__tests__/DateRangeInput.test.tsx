import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeInput } from '../DateRangeInput';

describe('DateRangeInput', () => {
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();

  const defaultProps = {
    label: '納品日',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    onStartDateChange: mockOnStartDateChange,
    onEndDateChange: mockOnEndDateChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ラベルが正しく表示される', () => {
    render(<DateRangeInput {...defaultProps} />);
    expect(screen.getByText('納品日')).toBeInTheDocument();
  });

  it('日付が年・月・日に分解されて表示される', () => {
    render(<DateRangeInput {...defaultProps} />);

    // 開始日
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('01')).toBeInTheDocument();

    // 終了日
    expect(screen.getAllByDisplayValue('2024')).toHaveLength(2);
    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    expect(screen.getByDisplayValue('31')).toBeInTheDocument();
  });

  it('開始年を変更するとonStartDateChangeが呼ばれる', () => {
    render(<DateRangeInput {...defaultProps} />);

    const yearInputs = screen.getAllByRole('textbox');
    fireEvent.change(yearInputs[0], { target: { value: '2023' } });

    expect(mockOnStartDateChange).toHaveBeenCalledWith('2023-01-01');
  });

  it('開始月を変更するとonStartDateChangeが呼ばれる', () => {
    render(<DateRangeInput {...defaultProps} />);

    const monthInputs = screen.getAllByRole('textbox');
    fireEvent.change(monthInputs[1], { target: { value: '06' } });

    expect(mockOnStartDateChange).toHaveBeenCalledWith('2024-06-01');
  });

  it('終了日を変更するとonEndDateChangeが呼ばれる', () => {
    render(<DateRangeInput {...defaultProps} />);

    const dayInputs = screen.getAllByRole('textbox');
    fireEvent.change(dayInputs[5], { target: { value: '15' } });

    expect(mockOnEndDateChange).toHaveBeenCalledWith('2024-12-15');
  });

  it('数字以外の入力は無視される', () => {
    render(<DateRangeInput {...defaultProps} />);

    const yearInputs = screen.getAllByRole('textbox');
    fireEvent.change(yearInputs[0], { target: { value: 'abc' } });

    // 空文字になる（数字以外は除去）
    expect(yearInputs[0]).toHaveValue('');
  });

  it('エラーメッセージが表示される', () => {
    render(<DateRangeInput {...defaultProps} error="日付エラーです" />);

    expect(screen.getByText('日付エラーです')).toBeInTheDocument();
  });

  it('カレンダーピッカーが存在する', () => {
    render(<DateRangeInput {...defaultProps} />);

    const dateInputs = screen.getAllByLabelText(/カレンダー/);
    expect(dateInputs).toHaveLength(2);
  });

  it('（半角）の注記が表示される', () => {
    render(<DateRangeInput {...defaultProps} />);

    expect(screen.getByText('(半角)')).toBeInTheDocument();
  });

  it('〜が表示される', () => {
    render(<DateRangeInput {...defaultProps} />);

    expect(screen.getByText('〜')).toBeInTheDocument();
  });
});
