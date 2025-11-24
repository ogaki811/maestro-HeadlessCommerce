import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EcoReportResult } from '../EcoReportResult';
import { EcoReportResultData } from '@/types/eco-report';

// モック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

// window.print のモック
const mockPrint = jest.fn();
Object.defineProperty(window, 'print', {
  value: mockPrint,
  writable: true,
});

// 12ヶ月分のモックデータを生成
const generateMonthlyData = () => {
  const months = [];
  const baseYear = 2024;
  const baseMonth = 12;

  for (let i = 0; i < 12; i++) {
    const date = new Date(baseYear, baseMonth - 1 + i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    months.push({
      month: `${year}/${String(month).padStart(2, '0')}`,
      startDate: `${year}/${String(month).padStart(2, '0')}/21`,
      endDate: `${year}/${String(month + 1 > 12 ? 1 : month + 1).padStart(2, '0')}/20`,
      totalPurchase: 100000,
      ecoMark: 20000,
      ecoMarkRatio: 20.0,
      greenPurchase: 15000,
      greenPurchaseRatio: 15.0,
      gpnEco: 10000,
      gpnEcoRatio: 10.0,
      ecoTotal: 45000,
      ecoTotalRatio: 45.0,
    });
  }
  return months;
};

describe('EcoReportResult', () => {
  const mockData: EcoReportResultData = {
    targetCode: '1234567890',
    targetName: 'テスト会社',
    closingDay: 20,
    aggregationType: 'amount',
    aggregationLabel: '税抜金額（円単位）',
    monthlyData: generateMonthlyData(),
    total: {
      totalPurchase: 1200000,
      ecoMark: 240000,
      ecoMarkRatio: 20.0,
      greenPurchase: 180000,
      greenPurchaseRatio: 15.0,
      gpnEco: 120000,
      gpnEcoRatio: 10.0,
      ecoTotal: 540000,
      ecoTotalRatio: 45.0,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ページタイトルが表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getByText('環境配慮商品購入レポート')).toBeInTheDocument();
  });

  it('注意事項が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getByText(/環境配慮商品情報は随時更新情報に基づきます/)).toBeInTheDocument();
    expect(screen.getByText(/「総購入額」は環境配慮商品以外も含む全ての購入額です/)).toBeInTheDocument();
  });

  it('対象コードと対象名が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    expect(screen.getByText(/様/)).toBeInTheDocument();
  });

  it('集計締日が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getByText(/集計締日/)).toBeInTheDocument();
    // 集計締日の値は他の場所（日付など）にも20が含まれるため、特定のスパン内を確認
    const closingDaySpan = screen.getByText('20', { selector: '.text-red-500' });
    expect(closingDaySpan).toBeInTheDocument();
  });

  it('集計項目ラベルが表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getByText(/税抜金額（円単位）/)).toBeInTheDocument();
  });

  it('月別データが表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getByText('2024/12')).toBeInTheDocument();
    expect(screen.getByText('2025/01')).toBeInTheDocument();
  });

  it('総購入額行が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getAllByText('総購入額').length).toBeGreaterThan(0);
  });

  it('エコマーク商品行が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getAllByText('エコマーク商品').length).toBeGreaterThan(0);
  });

  it('グリーン購入法適合商品行が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getAllByText('グリーン購入法適合商品').length).toBeGreaterThan(0);
  });

  it('GPNエコ商品ねっと掲載商品行が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getAllByText('GPNエコ商品ねっと掲載商品').length).toBeGreaterThan(0);
  });

  it('環境配慮商品合計行が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getAllByText('環境配慮商品合計').length).toBeGreaterThan(0);
  });

  it('合計列が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    expect(screen.getAllByText('合計').length).toBeGreaterThan(0);
  });

  it('構成比が表示される', () => {
    render(<EcoReportResult data={mockData} />);
    // 構成比のパーセント表示を確認
    expect(screen.getAllByText(/\(構成比\)/).length).toBeGreaterThan(0);
  });

  it('戻るボタンがクリックできる', () => {
    const mockOnBack = jest.fn();
    render(<EcoReportResult data={mockData} onBack={mockOnBack} />);

    const backButton = screen.getByText('戻る');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('印刷ボタンがクリックできる', () => {
    render(<EcoReportResult data={mockData} />);

    const printButton = screen.getByText('印刷');
    fireEvent.click(printButton);

    expect(mockPrint).toHaveBeenCalled();
  });

  it('金額がカンマ区切りでフォーマットされる', () => {
    render(<EcoReportResult data={mockData} />);
    // 100,000 などのフォーマットを確認（複数箇所に表示される）
    expect(screen.getAllByText('100,000').length).toBeGreaterThan(0);
  });

  it('構成比がパーセント表示される', () => {
    render(<EcoReportResult data={mockData} />);
    // 20.0% などのフォーマットを確認
    expect(screen.getAllByText('(20.0%)').length).toBeGreaterThan(0);
  });
});
