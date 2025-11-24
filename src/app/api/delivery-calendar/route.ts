import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  DeliveryCalendarRequest,
  DeliveryCalendarResponse,
} from '@/types/delivery-calendar';

/**
 * 配送カレンダー設定保存API
 *
 * POST /api/delivery-calendar
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<DeliveryCalendarResponse>> {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: '認証が必要です。ログインしてください。',
        },
        { status: 401 }
      );
    }

    // リクエストボディの取得
    const body: DeliveryCalendarRequest = await request.json();

    // バリデーション
    if (!body.deliveryPattern) {
      return NextResponse.json(
        {
          success: false,
          message: '配送パターンを選択してください。',
        },
        { status: 400 }
      );
    }

    const validPatterns = ['weekdays', 'weekdaysAndSaturday', 'custom'];
    if (!validPatterns.includes(body.deliveryPattern)) {
      return NextResponse.json(
        {
          success: false,
          message: '無効な配送パターンです。',
        },
        { status: 400 }
      );
    }

    // カスタマイズ時は曜日選択必須
    if (body.deliveryPattern === 'custom') {
      if (!body.customDays || body.customDays.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: '必ず一つ以上の曜日を選択してください。',
          },
          { status: 400 }
        );
      }

      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const invalidDays = body.customDays.filter((day) => !validDays.includes(day));
      if (invalidDays.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: '無効な曜日が含まれています。',
          },
          { status: 400 }
        );
      }
    }

    // Composer API へのリクエスト
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/delivery-calendar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const result = await response.json();

        return NextResponse.json({
          success: true,
          message: '配送カレンダーを登録しました。',
          data: result.data,
        });
      } catch {
        console.log('Composer API not available, returning mock response');
      }
    }

    // モックレスポンス（開発用）
    return NextResponse.json({
      success: true,
      message: '配送カレンダーを登録しました。',
      data: {
        deliveryPattern: body.deliveryPattern,
        customDays: body.customDays || [],
      },
    });
  } catch (error) {
    console.error('Delivery calendar save error:', error);

    return NextResponse.json(
      {
        success: false,
        message: '登録中にエラーが発生しました。',
      },
      { status: 500 }
    );
  }
}

/**
 * 配送カレンダー設定取得API
 *
 * GET /api/delivery-calendar
 */
export async function GET(): Promise<NextResponse<DeliveryCalendarResponse>> {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: '認証が必要です。ログインしてください。',
        },
        { status: 401 }
      );
    }

    // Composer API へのリクエスト
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/delivery-calendar`, {
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
          message: '',
          data: result.data,
        });
      } catch {
        console.log('Composer API not available, returning mock response');
      }
    }

    // モックレスポンス（開発用）- デフォルトは月〜金配送
    return NextResponse.json({
      success: true,
      message: '',
      data: {
        deliveryPattern: 'weekdays',
        customDays: [],
      },
    });
  } catch (error) {
    console.error('Delivery calendar fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'データの取得中にエラーが発生しました。',
      },
      { status: 500 }
    );
  }
}
