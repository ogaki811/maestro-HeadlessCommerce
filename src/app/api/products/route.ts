/**
 * Products API Route
 * 商品取得API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { BusinessType } from '@/constants/business-types';

/**
 * GET /api/products
 * 商品一覧取得（商流別フィルタリング）
 */
export async function GET(request: NextRequest) {
  try {
    // Get business type from headers (set by middleware)
    const businessType = request.headers.get('x-business-type') as BusinessType;

    if (!businessType) {
      return NextResponse.json(
        { error: 'Business Type is required' },
        { status: 400 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
      availableFor: {
        has: businessType,
      },
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch products with prices
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          prices: {
            where: {
              businessType,
              isActive: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    // Transform to API response format
    const productsWithPrices = products.map((product) => {
      const price = product.prices[0];
      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        price: price ? Number(price.basePrice) : 0,
        taxRate: price ? Number(price.taxRate) : 0.1,
        minOrderQty: price?.minOrderQty || 1,
        volumePrices: price?.volumePrices,
        availableFor: product.availableFor,
      };
    });

    return NextResponse.json({
      products: productsWithPrices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
