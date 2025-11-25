import { NextRequest, NextResponse } from 'next/server';
import type {
  TemplateListResponse,
  AddToTemplateRequest,
  AddToTemplateResponse,
  SortType,
} from '@/types/special-order';

/**
 * GET /api/special-order/templates
 * 定番一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = (searchParams.get('sort') || 'registered_date_desc') as SortType;
    const keyword = searchParams.get('keyword') || '';

    // TODO: 実際の実装では、データベースから定番を取得
    // 現在はモックデータを返す
    const mockTemplates = [
      {
        id: 'TPL-001',
        registeredDate: '2024/01/15',
        createdBy: '山田太郎',
        productName: 'デスクトップパソコン HP EliteDesk 800 G6',
        manufacturer: 'HP',
        quantity: 10,
        unit: '台',
        note: '部署用',
        isMyTemplate: true,
      },
      {
        id: 'TPL-002',
        registeredDate: '2024/01/10',
        createdBy: '佐藤花子',
        productName: 'モニターアーム エルゴトロン LX',
        manufacturer: 'エルゴトロン',
        quantity: 5,
        unit: '個',
        note: '',
        isMyTemplate: false,
      },
      {
        id: 'TPL-003',
        registeredDate: '2023/12/20',
        createdBy: '山田太郎',
        productName: 'オフィスチェア ハーマンミラー アーロン',
        manufacturer: 'ハーマンミラー',
        quantity: 3,
        unit: '脚',
        note: '会議室用',
        isMyTemplate: true,
      },
    ];

    // キーワードフィルタリング
    let filteredTemplates = mockTemplates;
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredTemplates = mockTemplates.filter(
        (t) =>
          t.productName.toLowerCase().includes(lowerKeyword) ||
          t.manufacturer.toLowerCase().includes(lowerKeyword) ||
          t.createdBy.includes(keyword)
      );
    }

    // ソート
    filteredTemplates = filteredTemplates.sort((a, b) => {
      switch (sort) {
        case 'product_name':
          return a.productName.localeCompare(b.productName, 'ja');
        case 'registered_date_desc':
          return b.registeredDate.localeCompare(a.registeredDate);
        case 'registered_date_asc':
          return a.registeredDate.localeCompare(b.registeredDate);
        default:
          return 0;
      }
    });

    // ページネーション
    const start = (page - 1) * limit;
    const paginatedTemplates = filteredTemplates.slice(start, start + limit);

    const response: TemplateListResponse = {
      success: true,
      data: {
        templates: paginatedTemplates,
        total: filteredTemplates.length,
        page,
        limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/special-order/templates
 * 履歴から定番登録
 */
export async function POST(request: NextRequest) {
  try {
    const body: AddToTemplateRequest = await request.json();

    if (!body.historyIds || body.historyIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '登録する履歴が選択されていません',
        },
        { status: 400 }
      );
    }

    // TODO: 実際の実装では、選択された履歴を定番に登録
    // 現在はモックレスポンスを返す
    console.log('Add to template request:', {
      historyIds: body.historyIds,
      timestamp: new Date().toISOString(),
    });

    const response: AddToTemplateResponse = {
      success: true,
      message: `${body.historyIds.length}件を定番に登録しました`,
      data: {
        added: body.historyIds.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Add to template API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
