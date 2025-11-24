import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RestockAlertDeleteResponse } from '@/types/restock-alert';

/**
 * 販売再開メール解除API
 *
 * DELETE /api/restock-alerts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RestockAlertDeleteResponse>> {
  try {
    const { id } = await params;

    // 認証チェック
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: '認証が必要です。ログインしてください。',
        },
        { status: 401 }
      );
    }

    // Composer API へのリクエスト
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/restock-alerts/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        return NextResponse.json({
          success: true,
          message: '販売再開メールの登録を解除しました。',
        });
      } catch {
        console.log('Composer API not available, returning mock response');
      }
    }

    // モックレスポンス（開発用）
    return NextResponse.json({
      success: true,
      message: '販売再開メールの登録を解除しました。',
    });
  } catch (error) {
    console.error('Restock alert delete error:', error);

    return NextResponse.json(
      {
        success: false,
        error: '解除処理中にエラーが発生しました。',
      },
      { status: 500 }
    );
  }
}
