/**
 * Product Detail API Route
 * 商品詳細取得API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { BusinessType } from '@/constants/business-types';

/**
 * GET /api/products/[id]
 * 商品詳細取得（商流別価格込み）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const businessType = request.headers.get('x-business-type') as BusinessType;

    if (!businessType) {
      return NextResponse.json(
        { error: 'Business Type is required' },
        { status: 400 }
      );
    }

    // Fetch product with business-type-specific price
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        prices: {
          where: {
            businessType,
            isActive: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is available for this business type
    if (!product.availableFor.includes(businessType)) {
      return NextResponse.json(
        { error: 'Product not available for this business type' },
        { status: 403 }
      );
    }

    const price = product.prices[0];

    if (!price) {
      return NextResponse.json(
        { error: 'Price not found for this business type' },
        { status: 404 }
      );
    }

    const productWithPrice = {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      price: Number(price.basePrice),
      taxRate: Number(price.taxRate),
      minOrderQty: price.minOrderQty,
      volumePrices: price.volumePrices,
      availableFor: product.availableFor,
      isActive: product.isActive,
    };

    return NextResponse.json(productWithPrice);
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
