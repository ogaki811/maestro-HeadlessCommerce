import { NextRequest, NextResponse } from 'next/server';
import type { HistoryListResponse, SortType, HistoryType } from '@/types/special-order';

/**
 * GET /api/special-order/history
 * 過去の取寄せ一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = (searchParams.get('sort') || 'order_date_desc') as SortType;
    const keyword = searchParams.get('keyword') || '';
    const type = searchParams.get('type') as HistoryType | null;

    // TODO: 実際の実装では、データベースから履歴を取得
    // 現在はモックデータを返す
    const mockHistory = [
      {
        id: 'HIST-001',
        type: 'order' as HistoryType,
        orderDate: '2024/03/12',
        createdBy: '山田太郎',
        productName: 'デスクトップパソコン',
        manufacturer: 'HP',
        quantity: 1,
        unit: '台',
        note: '',
        canAddToTemplate: true,
        isMyOrder: true,
      },
      {
        id: 'HIST-002',
        type: 'quote' as HistoryType,
        orderDate: '2024/01/30',
        createdBy: '佐藤花子',
        productName: 'オフィスデスク 木製 幅180cm',
        manufacturer: '',
        quantity: 1,
        unit: '台',
        note: '部署用',
        canAddToTemplate: true,
        isMyOrder: false,
      },
      {
        id: 'HIST-003',
        type: 'order_rejected' as HistoryType,
        orderDate: '2023/07/18',
        createdBy: '山田太郎',
        productName: 'CRM',
        manufacturer: '',
        quantity: 1,
        unit: '',
        note: '',
        canAddToTemplate: false,
        isMyOrder: true,
      },
      {
        id: 'HIST-004',
        type: 'order' as HistoryType,
        orderDate: '2023/01/30',
        createdBy: '佐藤花子',
        productName: 'テスト',
        manufacturer: '',
        quantity: 1,
        unit: '',
        note: 'コ',
        canAddToTemplate: true,
        isMyOrder: false,
      },
      {
        id: 'HIST-005',
        type: 'order' as HistoryType,
        orderDate: '2020/02/21',
        createdBy: '佐藤花子',
        productName: 'CRM',
        manufacturer: '',
        quantity: 1,
        unit: '',
        note: '',
        canAddToTemplate: true,
        isMyOrder: false,
      },
      {
        id: 'HIST-006',
        type: 'order' as HistoryType,
        orderDate: '2017/11/14',
        createdBy: '見積',
        productName: 'テスト',
        manufacturer: '',
        quantity: 1,
        unit: '',
        note: '',
        canAddToTemplate: true,
        isMyOrder: false,
      },
      {
        id: 'HIST-007',
        type: 'order' as HistoryType,
        orderDate: '2015/03/15',
        createdBy: '佐藤花子',
        productName: 'CRM',
        manufacturer: '',
        quantity: 1,
        unit: '',
        note: '',
        canAddToTemplate: true,
        isMyOrder: false,
      },
      {
        id: 'HIST-008',
        type: 'order' as HistoryType,
        orderDate: '2023/01/31',
        createdBy: '佐藤花子',
        productName: 'テスト',
        manufacturer: '',
        quantity: 1,
        unit: '',
        note: 'コ',
        canAddToTemplate: true,
        isMyOrder: false,
      },
    ];

    // タイプフィルタリング
    let filteredHistory = mockHistory;
    if (type) {
      filteredHistory = mockHistory.filter((h) => h.type === type);
    }

    // キーワードフィルタリング
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredHistory = filteredHistory.filter(
        (h) =>
          h.productName.toLowerCase().includes(lowerKeyword) ||
          h.manufacturer.toLowerCase().includes(lowerKeyword) ||
          h.createdBy.includes(keyword)
      );
    }

    // ソート
    filteredHistory = filteredHistory.sort((a, b) => {
      switch (sort) {
        case 'product_name':
          return a.productName.localeCompare(b.productName, 'ja');
        case 'order_date_desc':
          return b.orderDate.localeCompare(a.orderDate);
        case 'order_date_asc':
          return a.orderDate.localeCompare(b.orderDate);
        default:
          return 0;
      }
    });

    // ページネーション
    const start = (page - 1) * limit;
    const paginatedHistory = filteredHistory.slice(start, start + limit);

    const response: HistoryListResponse = {
      success: true,
      data: {
        history: paginatedHistory,
        total: filteredHistory.length,
        page,
        limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
