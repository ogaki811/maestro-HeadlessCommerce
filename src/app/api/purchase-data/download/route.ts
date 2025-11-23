import { NextRequest, NextResponse } from 'next/server';
import { PurchaseDataDownloadRequest } from '@/types/purchase-data';

/**
 * 購入データダウンロードAPI
 * POST /api/purchase-data/download
 */
export async function POST(request: NextRequest) {
  try {
    // ビジネスタイプチェック
    const businessType = request.headers.get('x-business-type') || 'toc';

    // Retailユーザーは利用不可
    if (businessType === 'retail') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'この機能はご利用いただけません。' },
        { status: 403 }
      );
    }

    // リクエストボディの取得
    const body: PurchaseDataDownloadRequest = await request.json();

    // バリデーション
    const validationError = validateRequest(body);
    if (validationError) {
      return NextResponse.json(
        { error: 'Validation Error', message: validationError },
        { status: 400 }
      );
    }

    // TODO: 実際のデータ取得処理（Composer API または DB）
    // ここではモックデータを生成
    const purchaseData = await fetchPurchaseData(body, businessType);

    if (!purchaseData || purchaseData.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: '検索条件に該当する購入データが見つかりませんでした。' },
        { status: 404 }
      );
    }

    // CSV/Excel生成
    const { content, contentType, filename } = generateDownloadFile(
      purchaseData,
      body.dataFormat,
      body.format
    );

    // レスポンス
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Purchase data download error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'データの取得に失敗しました。' },
      { status: 500 }
    );
  }
}

/**
 * リクエストバリデーション
 */
function validateRequest(body: PurchaseDataDownloadRequest): string | null {
  if (!body.startDate || !body.endDate) {
    return '日付を入力してください。';
  }

  const start = new Date(body.startDate);
  const end = new Date(body.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '日付の形式が正しくありません。';
  }

  if (start > end) {
    return '開始日は終了日以前の日付を指定してください。';
  }

  // 18ヶ月チェック
  const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (diffMonths > 18) {
    return '検索期間は18ヶ月以内で指定してください。';
  }

  if (body.targetData === 'specified' && !body.specifiedCode?.trim()) {
    return 'コードを入力してください。';
  }

  return null;
}

/**
 * 購入データ取得（モック）
 * TODO: 実際のDB/API連携に置き換え
 */
interface PurchaseDataRow {
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  isConsignment: boolean;
  taxRate?: number;
  taxAmount?: number;
  amountWithTax?: number;
}

async function fetchPurchaseData(
  params: PurchaseDataDownloadRequest,
  businessType: string
): Promise<PurchaseDataRow[]> {
  // TODO: Prismaまたは外部APIからデータ取得
  // ここではモックデータを返す

  // モックデータ（開発用）
  const mockData: PurchaseDataRow[] = [
    {
      orderNumber: 'ORD-2024-001',
      orderDate: '2024/10/15',
      deliveryDate: '2024/10/20',
      productCode: 'PROD-001',
      productName: 'サンプル商品A',
      quantity: 10,
      unitPrice: 1000,
      amount: 10000,
      isConsignment: false,
      taxRate: 10,
      taxAmount: 1000,
      amountWithTax: 11000,
    },
    {
      orderNumber: 'ORD-2024-002',
      orderDate: '2024/11/01',
      deliveryDate: '2024/11/05',
      productCode: 'PROD-002',
      productName: 'サンプル商品B',
      quantity: 5,
      unitPrice: 2000,
      amount: 10000,
      isConsignment: true,
      taxRate: 10,
      taxAmount: 1000,
      amountWithTax: 11000,
    },
  ];

  // フィルタリング（モック用の簡易実装）
  let filtered = mockData;

  // 管理受託品フィルター
  if (params.consignmentFilter === 'consignment_only') {
    filtered = filtered.filter((row) => row.isConsignment);
  } else if (params.consignmentFilter === 'non_consignment') {
    filtered = filtered.filter((row) => !row.isConsignment);
  }

  return filtered;
}

/**
 * ダウンロードファイル生成
 */
function generateDownloadFile(
  data: PurchaseDataRow[],
  format: 'csv' | 'excel',
  formatType: 'normal' | 'normal_with_tax'
): { content: string; contentType: string; filename: string } {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

  if (format === 'csv') {
    const csv = generateCsv(data, formatType);
    return {
      content: csv,
      contentType: 'text/csv; charset=utf-8',
      filename: `purchase_data_${today}.csv`,
    };
  } else {
    // Excel形式の場合もCSVで返す（TODO: 実際のExcel生成）
    const csv = generateCsv(data, formatType);
    return {
      content: csv,
      contentType: 'text/csv; charset=utf-8',
      filename: `purchase_data_${today}.csv`,
    };
  }
}

/**
 * CSV生成
 */
function generateCsv(
  data: PurchaseDataRow[],
  formatType: 'normal' | 'normal_with_tax'
): string {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel

  // ヘッダー
  let headers = [
    '注文番号',
    '注文日',
    '納品日',
    '商品コード',
    '商品名',
    '数量',
    '単価',
    '金額',
    '管理受託品',
  ];

  if (formatType === 'normal_with_tax') {
    headers = [...headers, '税率(%)', '税額', '税込金額'];
  }

  // データ行
  const rows = data.map((row) => {
    let values = [
      row.orderNumber,
      row.orderDate,
      row.deliveryDate,
      row.productCode,
      row.productName,
      row.quantity.toString(),
      row.unitPrice.toString(),
      row.amount.toString(),
      row.isConsignment ? '1' : '0',
    ];

    if (formatType === 'normal_with_tax') {
      values = [
        ...values,
        row.taxRate?.toString() || '',
        row.taxAmount?.toString() || '',
        row.amountWithTax?.toString() || '',
      ];
    }

    return values.map((v) => `"${v}"`).join(',');
  });

  return BOM + [headers.join(','), ...rows].join('\n');
}
