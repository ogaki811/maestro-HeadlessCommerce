/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import QuotationResponseTable from '../QuotationResponseTable';
import type { Quotation } from '@/types/quotation';

describe('QuotationResponseTable', () => {
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
      {
        id: 'vendor_002',
        name: 'スマートガバメント株式会社',
        userCode: '21100',
        webId: '1594762002',
        contactPerson: '齋藤担当者',
      },
    ],
    products: [],
    status: 'partially_responded',
    responses: [
      {
        vendorId: 'vendor_002',
        quotationNumber: '00000766',
        webId: '1594762002',
        userName: '齋藤担当者',
        responseDate: '2025-10-30',
        desiredDeliveryDate: '2024-12-29',
        totalAmount: 0,
        validUntil: '2025-11-30',
      },
      {
        vendorId: 'vendor_001',
        quotationNumber: '00000765',
        webId: '1588847004',
        userName: '本部共有デモ',
        responseDate: '2025-10-30',
        desiredDeliveryDate: '2024-12-29',
        completionDate: '2025-10-30',
        totalAmount: 12299,
        validUntil: '2025-11-30',
      },
    ],
    createdAt: '2025-10-30T10:30:00Z',
    updatedAt: '2025-10-30T10:30:00Z',
  };

  it('renders table with correct structure', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders all header cells', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    expect(screen.getByText('詳細')).toBeInTheDocument();
    expect(screen.getByText('見積依頼番号')).toBeInTheDocument();
    expect(screen.getByText('Web ID/氏名')).toBeInTheDocument();
    expect(screen.getByText('ステータス')).toBeInTheDocument();
    expect(screen.getByText('販売店名')).toBeInTheDocument();
    expect(screen.getByText('希望納期')).toBeInTheDocument();
    expect(screen.getByText('見積完了日')).toBeInTheDocument();
    expect(screen.getByText('見積有効期限')).toBeInTheDocument();
    expect(screen.getByText('見積金額（税抜）')).toBeInTheDocument();
    expect(screen.getByText('最終注文日付')).toBeInTheDocument();
    expect(screen.getByText('カートイン')).toBeInTheDocument();
  });

  it('renders response data rows', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    // 見積依頼番号が表示されていること
    expect(screen.getByText('00000766')).toBeInTheDocument();
    expect(screen.getByText('00000765')).toBeInTheDocument();
  });

  it('renders vendor names correctly', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    expect(screen.getByText('プラス株式会社')).toBeInTheDocument();
    expect(screen.getByText('スマートガバメント株式会社')).toBeInTheDocument();
  });

  it('renders Web ID and user names', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    expect(screen.getByText(/1594762002/)).toBeInTheDocument();
    expect(screen.getByText(/齋藤担当者/)).toBeInTheDocument();
    expect(screen.getByText(/1588847004/)).toBeInTheDocument();
    expect(screen.getByText(/本部共有デモ/)).toBeInTheDocument();
  });

  it('renders formatted dates', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    // 希望納期（複数の行で同じ日付が表示される可能性があるため getAllByText を使用）
    const desiredDeliveryDates = screen.getAllByText('2024/12/29');
    expect(desiredDeliveryDates.length).toBeGreaterThan(0);

    // 見積完了日
    expect(screen.getByText('2025/10/30')).toBeInTheDocument();

    // 見積有効期限（複数の行で同じ日付が表示される可能性があるため getAllByText を使用）
    const validUntilDates = screen.getAllByText('2025/11/30');
    expect(validUntilDates.length).toBeGreaterThan(0);
  });

  it('renders total amounts formatted with commas', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    expect(screen.getByText('¥12,299')).toBeInTheDocument();
  });

  it('renders status badge for completed quotation', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    // 見積完了ステータスが表示されていること
    expect(screen.getByText('見積完了')).toBeInTheDocument();
  });

  it('renders status badge for pending quotation', () => {
    render(<QuotationResponseTable quotation={mockQuotation} />);

    // 未回答ステータスが表示されていること
    expect(screen.getByText('未回答')).toBeInTheDocument();
  });

  it('renders detail button for each row', () => {
    const { container } = render(<QuotationResponseTable quotation={mockQuotation} />);

    // 詳細ボタン（編集アイコン）が2行分表示されること
    const editButtons = container.querySelectorAll('button[aria-label="詳細"]');
    expect(editButtons).toHaveLength(2);
  });

  it('renders cart button for completed quotations only', () => {
    const { container } = render(<QuotationResponseTable quotation={mockQuotation} />);

    // カートボタンは見積完了した1行のみ表示
    const cartButtons = container.querySelectorAll('button[aria-label="カートに追加"]');
    expect(cartButtons).toHaveLength(1);
  });
});
