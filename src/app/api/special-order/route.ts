import { NextRequest, NextResponse } from 'next/server';
import type { SpecialOrderRequest, SpecialOrderResponse } from '@/types/special-order';

/**
 * POST /api/special-order
 * 新規取寄せ依頼作成
 */
export async function POST(request: NextRequest) {
  try {
    const body: SpecialOrderRequest = await request.json();

    // バリデーション
    if (!body.type || !['quote', 'order'].includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          message: '種別が不正です',
        },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '商品情報が入力されていません',
        },
        { status: 400 }
      );
    }

    // 各アイテムのバリデーション
    for (const item of body.items) {
      if (!item.productName?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: '商品名は必須です',
          },
          { status: 400 }
        );
      }

      if (!item.unit?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: '単位は必須です',
          },
          { status: 400 }
        );
      }
    }

    // TODO: 実際の実装では、データベースに保存し、販売店にメール送信
    // 現在はモックレスポンスを返す
    console.log('Special order request:', {
      type: body.type,
      items: body.items,
      timestamp: new Date().toISOString(),
    });

    const orderId = `SO-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const response: SpecialOrderResponse = {
      success: true,
      message:
        body.type === 'quote'
          ? '見積依頼を送信しました。販売店から連絡があるまでお待ちください。'
          : '注文依頼を送信しました。販売店から連絡があるまでお待ちください。',
      data: {
        orderId,
        createdAt,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Special order API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'サーバーエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
