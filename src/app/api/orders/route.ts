/**
 * Orders API Route
 * 注文処理API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePrice, calculatePointsEarned } from '@/lib/pricing';
import type { BusinessType } from '@/constants/business-types';

/**
 * GET /api/orders
 * 注文履歴取得
 */
export async function GET(request: NextRequest) {
  try {
    const businessType = request.headers.get('x-business-type') as BusinessType;
    const customerId = request.headers.get('x-customer-id');

    if (!businessType || !customerId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          customerId,
          businessType,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: {
          customerId,
          businessType,
        },
      }),
    ]);

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        taxAmount: Number(order.taxAmount),
        shippingAmount: Number(order.shippingAmount),
        itemCount: order.orderItems.length,
        createdAt: order.createdAt,
        items: order.orderItems.map((item) => ({
          productCode: item.productCode,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * 注文作成
 */
export async function POST(request: NextRequest) {
  try {
    const businessType = request.headers.get('x-business-type') as BusinessType;
    const customerId = request.headers.get('x-customer-id');

    if (!businessType || !customerId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      cartId,
      shippingAddress,
      billingAddress,
      paymentMethod,
      usePoints = 0,
    } = body;

    if (!cartId || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                prices: {
                  where: {
                    businessType,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    let taxAmount = 0;

    const orderItems = cart.cartItems.map((item) => {
      const price = item.product.prices[0];
      const calculation = calculatePrice(
        {
          productId: item.productId,
          businessType,
          basePrice: Number(item.price),
          taxRate: price ? Number(price.taxRate) : 0.1,
          minOrderQty: price?.minOrderQty || 1,
          volumePrices: price?.volumePrices as any,
        },
        item.quantity
      );

      subtotal += calculation.totalPrice;
      taxAmount += calculation.taxAmount;

      return {
        productId: item.productId,
        productCode: item.product.code,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: calculation.unitPrice,
        totalPrice: calculation.totalPrice,
        taxRate: price ? price.taxRate : 0.1,
      };
    });

    // Calculate points
    const pointsEarned = calculatePointsEarned(businessType, subtotal);
    const pointsUsed = Math.min(usePoints, subtotal); // Can't use more points than order total
    const totalAmount = subtotal - pointsUsed;

    // Generate order number
    const orderNumber = `${businessType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          businessType,
          status: 'pending',
          totalAmount,
          taxAmount,
          shippingAmount: 0, // TODO: Calculate shipping
          pointsUsed,
          pointsEarned,
          paymentMethod,
          paymentStatus: 'pending',
          shippingAddress,
          billingAddress: billingAddress || shippingAddress,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Update customer points if applicable
      if (pointsUsed > 0 || pointsEarned > 0) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            points: {
              increment: pointsEarned - pointsUsed,
            },
          },
        });
      }

      // Clear cart
      await tx.cart.delete({
        where: { id: cartId },
      });

      return newOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      pointsEarned,
      pointsUsed,
    });
  } catch (error) {
    console.error('Create order API error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
