/**
 * NumberInput Component Test
 * 数値入力コンポーネント テスト
 */

import { render, screen, fireEvent } from '@testing-library/react';
import NumberInput from '../NumberInput';

describe('NumberInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期値が正しく表示されること', () => {
    render(<NumberInput value={5} onChange={mockOnChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(5);
  });

  it('ラベルが正しく表示されること', () => {
    render(<NumberInput value={1} onChange={mockOnChange} label="数量" />);
    expect(screen.getByText('数量')).toBeInTheDocument();
  });

  it('値を直接入力できること', () => {
    render(<NumberInput value={1} onChange={mockOnChange} />);
    const input = screen.getByRole('spinbutton');

    fireEvent.change(input, { target: { value: '10' } });
    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('増加ボタンで値が増えること', () => {
    render(<NumberInput value={5} onChange={mockOnChange} showStepper={true} />);
    const incrementButton = screen.getByRole('button', { name: '増やす' });

    fireEvent.click(incrementButton);
    expect(mockOnChange).toHaveBeenCalledWith(6);
  });

  it('減少ボタンで値が減ること', () => {
    render(<NumberInput value={5} onChange={mockOnChange} min={1} showStepper={true} />);
    const decrementButton = screen.getByRole('button', { name: '減らす' });

    fireEvent.click(decrementButton);
    expect(mockOnChange).toHaveBeenCalledWith(4);
  });

  it('最小値以下には減らせないこと', () => {
    render(<NumberInput value={1} onChange={mockOnChange} min={1} showStepper={true} />);
    const decrementButton = screen.getByRole('button', { name: '減らす' });

    fireEvent.click(decrementButton);
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(decrementButton).toBeDisabled();
  });

  it('最大値以上には増やせないこと', () => {
    render(<NumberInput value={10} onChange={mockOnChange} max={10} showStepper={true} />);
    const incrementButton = screen.getByRole('button', { name: '増やす' });

    fireEvent.click(incrementButton);
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(incrementButton).toBeDisabled();
  });

  it('無効化状態で操作できないこと', () => {
    render(<NumberInput value={5} onChange={mockOnChange} disabled={true} showStepper={true} />);
    const input = screen.getByRole('spinbutton');
    const incrementButton = screen.getByRole('button', { name: '増やす' });
    const decrementButton = screen.getByRole('button', { name: '減らす' });

    expect(input).toBeDisabled();
    expect(incrementButton).toBeDisabled();
    expect(decrementButton).toBeDisabled();
  });

  it('ステッパー非表示モードで増減ボタンが表示されないこと', () => {
    render(<NumberInput value={5} onChange={mockOnChange} showStepper={false} />);

    expect(screen.queryByRole('button', { name: '増やす' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '減らす' })).not.toBeInTheDocument();
  });

  it('ステップ値で増減できること', () => {
    render(<NumberInput value={10} onChange={mockOnChange} step={5} showStepper={true} />);
    const incrementButton = screen.getByRole('button', { name: '増やす' });

    fireEvent.click(incrementButton);
    expect(mockOnChange).toHaveBeenCalledWith(15);
  });

  it('最小値未満の入力は最小値にクランプされること', () => {
    render(<NumberInput value={5} onChange={mockOnChange} min={1} />);
    const input = screen.getByRole('spinbutton');

    fireEvent.change(input, { target: { value: '0' } });
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('最大値超過の入力は最大値にクランプされること', () => {
    render(<NumberInput value={5} onChange={mockOnChange} max={10} />);
    const input = screen.getByRole('spinbutton');

    fireEvent.change(input, { target: { value: '15' } });
    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('数値以外の入力は最小値にリセットされること', () => {
    render(<NumberInput value={5} onChange={mockOnChange} min={1} />);
    const input = screen.getByRole('spinbutton');

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });
});
