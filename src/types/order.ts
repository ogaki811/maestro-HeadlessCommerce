// 注文型定義

import { CartItem } from './product';
import { Coupon } from './cart';
import { ShippingAddress } from './user';

// 注文ステータス
export type OrderStatus =
  | 'pending' // 処理中
  | 'confirmed' // 確認済み
  | 'processing' // 準備中
  | 'shipped' // 発送済み
  | 'delivered' // 配達完了
  | 'cancelled' // キャンセル
  | 'returned'; // 返品

// 支払い方法
export type PaymentMethod =
  | 'credit_card'
  | 'bank_transfer'
  | 'convenience_store'
  | 'cash_on_delivery'
  | 'digital_wallet';

// 配送方法
export type DeliveryMethod = 'standard' | 'express' | 'same_day';

// 注文アイテム
export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

// 注文詳細
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];

  // 金額
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;

  // クーポン
  appliedCoupon?: Coupon;

  // 配送先
  shippingAddress: ShippingAddress;

  // 支払い・配送
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryDate?: string;
  deliveryTime?: string;

  // 備考
  note?: string;

  // タイムスタンプ
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

// 注文作成データ
export interface CreateOrderData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryDate?: string;
  deliveryTime?: string;
  appliedCoupon?: Coupon;
  note?: string;
}

// 注文フィルター
export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// 注文履歴
export interface OrderHistory {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
