import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RestockAlertsResponse } from '@/types/restock-alert';

/**
 * 販売再開メール一覧取得API
 *
 * GET /api/restock-alerts
 */
export async function GET(_request: NextRequest): Promise<NextResponse<RestockAlertsResponse>> {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          total: 0,
          error: '認証が必要です。ログインしてください。',
        },
        { status: 401 }
      );
    }

    // Composer API へのリクエスト
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/restock-alerts`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const result = await response.json();

        return NextResponse.json({
          success: true,
          data: result.data || [],
          total: result.total || 0,
        });
      } catch {
        console.log('Composer API not available, returning mock response');
      }
    }

    // モックレスポンス（開発用）
    const mockData = [
      {
        id: '1',
        productId: '704321',
        productCode: '704321',
        productName: 'ワイヤレスアンプ ATW-SP1920',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        productId: '708721',
        productCode: '708721',
        productName: 'レバーリングF GX Dタイプ3774GX-B 10冊',
        createdAt: '2024-01-16T10:00:00Z',
      },
      {
        id: '3',
        productId: '723371',
        productCode: '723371',
        productName: '881 ニトリスト・フィット100枚 S/ブルー',
        createdAt: '2024-01-17T10:00:00Z',
      },
      {
        id: '4',
        productId: '723372',
        productCode: '723372',
        productName: '881 ニトリスト・フィット100枚 M/ブルー',
        createdAt: '2024-01-18T10:00:00Z',
      },
      {
        id: '5',
        productId: '743229',
        productCode: '743229',
        productName: 'チェキ フィルム10枚×2 INSTAX MINI JP 2',
        createdAt: '2024-01-19T10:00:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockData,
      total: mockData.length,
    });
  } catch (error) {
    console.error('Restock alerts fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        error: 'データの取得中にエラーが発生しました。',
      },
      { status: 500 }
    );
  }
}
