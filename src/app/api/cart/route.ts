/**
 * Cart API Route
 * カート操作API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { BusinessType } from '@/constants/business-types';

/**
 * GET /api/cart
 * カート取得
 */
export async function GET(request: NextRequest) {
  try {
    const businessType = request.headers.get('x-business-type') as BusinessType;
    const customerId = request.headers.get('x-customer-id'); // From auth
    const sessionId = request.cookies.get('session-id')?.value;

    if (!businessType) {
      return NextResponse.json(
        { error: 'Business Type is required' },
        { status: 400 }
      );
    }

    // Find active cart
    const cart = await prisma.cart.findFirst({
      where: {
        businessType,
        ...(customerId ? { customerId } : { sessionId }),
        expiresAt: {
          gt: new Date(),
        },
      },
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

    if (!cart) {
      return NextResponse.json({
        cart: null,
        items: [],
        total: 0,
      });
    }

    // Calculate totals
    const items = cart.cartItems.map((item) => {
      const price = item.product.prices[0];
      const itemTotal = Number(item.price) * item.quantity;
      return {
        id: item.id,
        productId: item.productId,
        productCode: item.product.code,
        productName: item.product.name,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        totalPrice: itemTotal,
        minOrderQty: price?.minOrderQty || 1,
      };
    });

    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return NextResponse.json({
      cartId: cart.id,
      items,
      total,
      itemCount: items.length,
    });
  } catch (error) {
    console.error('Get cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * カートに商品追加
 */
export async function POST(request: NextRequest) {
  try {
    const businessType = request.headers.get('x-business-type') as BusinessType;
    const customerId = request.headers.get('x-customer-id');
    const sessionId = request.cookies.get('session-id')?.value;

    if (!businessType) {
      return NextResponse.json(
        { error: 'Business Type is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }

    // Get product with price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        prices: {
          where: {
            businessType,
            isActive: true,
          },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

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

    // Check minimum order quantity
    if (quantity < price.minOrderQty) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${price.minOrderQty}` },
        { status: 400 }
      );
    }

    // Find or create cart
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    let cart = await prisma.cart.findFirst({
      where: {
        businessType,
        ...(customerId ? { customerId } : { sessionId }),
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          businessType,
          customerId: customerId || undefined,
          sessionId: sessionId || undefined,
          expiresAt,
        },
      });
    }

    // Add or update cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: price.basePrice,
        },
      });
    }

    return NextResponse.json({
      message: 'Product added to cart',
      cartId: cart.id,
    });
  } catch (error) {
    console.error('Add to cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to add product to cart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * カートをクリア
 */
export async function DELETE(request: NextRequest) {
  try {
    const businessType = request.headers.get('x-business-type') as BusinessType;
    const customerId = request.headers.get('x-customer-id');
    const sessionId = request.cookies.get('session-id')?.value;

    if (!businessType) {
      return NextResponse.json(
        { error: 'Business Type is required' },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: {
        businessType,
        ...(customerId ? { customerId } : { sessionId }),
      },
    });

    if (cart) {
      await prisma.cart.delete({
        where: { id: cart.id },
      });
    }

    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
