/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import QuotationResponseDetail from '../QuotationResponseDetail';
import type { Quotation, QuotationResponse } from '@/types/quotation';

describe('QuotationResponseDetail', () => {
  const mockQuotation: Quotation = {
    id: 'Q-2024-0115',
    subject: '1030テスト',
    requestDate: '2025-10-30',
    requestUser: 'user_001',
    vendors: [
      {
        id: 'vendor_001',
        name: 'プラス株式会社',
        userCode: '11100',
        webId: '1588847004',
        contactPerson: '本部共有デモ',
      },
    ],
    products: [],
    status: 'responded',
    createdAt: '2025-10-30T10:30:00Z',
    updatedAt: '2025-10-30T10:30:00Z',
  };

  const mockResponse: QuotationResponse = {
    vendorId: 'vendor_001',
    quotationNumber: '00000765',
    webId: '1588847004',
    userName: '本部共有デモ',
    responseDate: '2025-10-30',
    desiredDeliveryDate: '2024-12-29',
    completionDate: '2025-10-30',
    totalAmount: 12299,
    validUntil: '2025-11-30',
    message: '納期についてはご相談ください。',
    products: [
      {
        productId: 'prod_001',
        unitPrice: 5000,
        totalPrice: 10000,
        leadTime: '2024-12-29',
        notes: '在庫あり',
      },
      {
        productId: 'prod_002',
        unitPrice: 2299,
        totalPrice: 2299,
        leadTime: '2024-12-25',
      },
    ],
  };

  it('renders vendor information correctly', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    expect(screen.getByText('プラス株式会社')).toBeInTheDocument();
    expect(screen.getByText(/1588847004/)).toBeInTheDocument();
    expect(screen.getByText(/本部共有デモ/)).toBeInTheDocument();
  });

  it('renders quotation details correctly', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    expect(screen.getByText(/00000765/)).toBeInTheDocument();
    expect(screen.getByText(/2025\/10\/30/)).toBeInTheDocument();
    expect(screen.getByText(/2025\/11\/30/)).toBeInTheDocument();
  });

  it('renders product table with correct headers', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    expect(screen.getByText('商品ID')).toBeInTheDocument();
    expect(screen.getByText('単価（税抜）')).toBeInTheDocument();
    expect(screen.getByText('合計')).toBeInTheDocument();
    expect(screen.getByText('納期')).toBeInTheDocument();
    expect(screen.getByText('備考')).toBeInTheDocument();
  });

  it('renders product rows with correct data', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    expect(screen.getByText('prod_001')).toBeInTheDocument();
    expect(screen.getByText('prod_002')).toBeInTheDocument();
    expect(screen.getByText('¥5,000')).toBeInTheDocument();

    // ¥2,299は単価と合計の両方に表示されるため getAllByText を使用
    const prices2299 = screen.getAllByText('¥2,299');
    expect(prices2299.length).toBeGreaterThan(0);

    expect(screen.getByText('¥10,000')).toBeInTheDocument();
    expect(screen.getByText('在庫あり')).toBeInTheDocument();
  });

  it('renders total amount correctly', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    expect(screen.getByText(/¥12,299/)).toBeInTheDocument();
  });

  it('renders message when provided', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    expect(screen.getByText('納期についてはご相談ください。')).toBeInTheDocument();
  });

  it('does not render message section when message is not provided', () => {
    const responseWithoutMessage: QuotationResponse = {
      ...mockResponse,
      message: undefined,
    };

    render(<QuotationResponseDetail quotation={mockQuotation} response={responseWithoutMessage} />);

    expect(screen.queryByText('営業担当者からのメッセージ')).not.toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    const dates = screen.getAllByText(/2024\/12\/29/);
    expect(dates.length).toBeGreaterThan(0);
  });

  it('formats currency correctly with commas', () => {
    render(<QuotationResponseDetail quotation={mockQuotation} response={mockResponse} />);

    // 3桁区切りのカンマがあることを確認
    expect(screen.getByText('¥12,299')).toBeInTheDocument();
    expect(screen.getByText('¥10,000')).toBeInTheDocument();
  });

  it('handles empty products array', () => {
    const responseWithoutProducts: QuotationResponse = {
      ...mockResponse,
      products: [],
    };

    render(<QuotationResponseDetail quotation={mockQuotation} response={responseWithoutProducts} />);

    // テーブルヘッダーは存在するが、行はない
    expect(screen.getByText('商品ID')).toBeInTheDocument();
    expect(screen.queryByText('prod_001')).not.toBeInTheDocument();
  });
});
