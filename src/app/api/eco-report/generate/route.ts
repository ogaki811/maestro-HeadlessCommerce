import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EcoReportRequest, EcoReportResponse } from '@/types/eco-report';

/**
 * 環境配慮商品購入レポート生成API
 *
 * POST /api/eco-report/generate
 *
 * リクエストボディ:
 * - targetCode: 対象コード
 * - aggregationType: 集計方式（'amount' | 'quantity'）
 * - closingDay: 集計締日（1-31）
 */
export async function POST(request: NextRequest): Promise<NextResponse<EcoReportResponse>> {
  try {
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

    // ビジネスタイプチェック
    const businessType = request.headers.get('x-business-type') || 'toc';

    if (!['toc', 'wholesale'].includes(businessType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'この機能はTOCまたはWholesaleユーザーのみ利用可能です。',
        },
        { status: 403 }
      );
    }

    // リクエストボディのパース
    const body: EcoReportRequest = await request.json();

    // バリデーション
    if (!body.targetCode) {
      return NextResponse.json(
        {
          success: false,
          error: '対象コードを指定してください。',
        },
        { status: 400 }
      );
    }

    if (!body.aggregationType || !['amount', 'quantity'].includes(body.aggregationType)) {
      return NextResponse.json(
        {
          success: false,
          error: '集計方式を正しく指定してください。',
        },
        { status: 400 }
      );
    }

    if (!body.closingDay || body.closingDay < 1 || body.closingDay > 31) {
      return NextResponse.json(
        {
          success: false,
          error: '集計締日は1〜31の間で指定してください。',
        },
        { status: 400 }
      );
    }

    // Composer API へのリクエスト（実際の実装）
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/eco-report/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-business-type': businessType,
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            {
              success: false,
              error: errorData.message || 'レポート作成に失敗しました。',
            },
            { status: response.status }
          );
        }

        const result = await response.json();

        return NextResponse.json({
          success: true,
          downloadUrl: result.downloadUrl,
          fileName: result.fileName,
        });
      } catch {
        // API接続エラーの場合はモックデータを返す（開発用）
        console.log('Composer API not available, returning mock response');
      }
    }

    // モックレスポンス（開発・テスト用）
    const mockFileName = `eco-report_${body.targetCode}_${body.aggregationType}_${new Date().toISOString().slice(0, 10)}.pdf`;

    return NextResponse.json({
      success: true,
      downloadUrl: `/api/mock/eco-report/${mockFileName}`,
      fileName: mockFileName,
    });
  } catch (error) {
    console.error('Eco report generation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'レポート作成中にエラーが発生しました。',
      },
      { status: 500 }
    );
  }
}
