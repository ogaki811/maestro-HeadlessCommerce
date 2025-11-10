/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import QuotationDetailHeader from '../QuotationDetailHeader';
import type { Quotation } from '@/types/quotation';

describe('QuotationDetailHeader', () => {
  const mockQuotation: Quotation = {
    id: 'Q-2024-0115',
    subject: '1030テスト',
    description: '1030テスト見積依頼',
    requestDate: '2025-10-30',
    requestUser: 'user_001',
    requestUserName: '山田 太郎',
    vendors: [],
    products: [],
    status: 'partially_responded',
    createdAt: '2025-10-30T10:30:00Z',
    updatedAt: '2025-10-30T10:30:00Z',
  };

  it('renders subject correctly', () => {
    render(<QuotationDetailHeader quotation={mockQuotation} />);

    expect(screen.getByText('件名：1030テスト')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<QuotationDetailHeader quotation={mockQuotation} />);

    // テキストが複数要素に分割されているため、正規表現で検索
    expect(screen.getByText(/依頼内容：/)).toBeInTheDocument();
    expect(screen.getByText(/1030テスト見積依頼/)).toBeInTheDocument();
  });

  it('renders request date formatted as YYYY/MM/DD', () => {
    render(<QuotationDetailHeader quotation={mockQuotation} />);

    // テキストが複数要素に分割されているため、正規表現で検索
    expect(screen.getByText(/見積依頼日：/)).toBeInTheDocument();
    expect(screen.getByText(/2025\/10\/30/)).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const quotationWithoutDescription: Quotation = {
      ...mockQuotation,
      description: undefined,
    };

    render(<QuotationDetailHeader quotation={quotationWithoutDescription} />);

    expect(screen.queryByText(/依頼内容/)).not.toBeInTheDocument();
  });

  it('applies header styling', () => {
    const { container } = render(<QuotationDetailHeader quotation={mockQuotation} />);

    const header = container.querySelector('div');
    expect(header).toHaveClass('mb-6');
  });

  it('renders "見積をコピー" button', () => {
    render(<QuotationDetailHeader quotation={mockQuotation} />);

    const button = screen.getByRole('button', { name: '見積をコピー' });
    expect(button).toBeInTheDocument();
  });

  it('button has correct styling', () => {
    render(<QuotationDetailHeader quotation={mockQuotation} />);

    const button = screen.getByRole('button', { name: '見積をコピー' });
    expect(button).toHaveClass('bg-orange-500');
    expect(button).toHaveClass('text-white');
  });
});
