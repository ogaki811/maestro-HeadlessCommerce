/**
 * API Client for Headless Commerce (Composer Backend)
 * ヘッドレスコマース用APIクライアント（Composerバックエンド）
 *
 * S3静的ホスティング対応: モックモード切り替え機能搭載
 */

import { getBusinessType, getApiEndpoint } from './frontend-context';

/**
 * モックモード判定
 * 環境変数 NEXT_PUBLIC_USE_MOCK_DATA が true の場合、モックデータを使用
 */
function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
}

/**
 * モックデータ取得ヘルパー
 * public/mock-api/ からJSONファイルを取得
 */
async function fetchMockData<T>(path: string): Promise<T> {
  const response = await fetch(`/mock-api/${path}.json`);
  if (!response.ok) {
    throw new Error(`Mock data not found: /mock-api/${path}.json`);
  }
  return response.json();
}

/**
 * API Client Configuration
 */
const API_CONFIG = {
  baseURL: typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000'
    : process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Create API headers with site ID, business type, and customer ID
 */
function createHeaders(customHeaders?: Record<string, string>): HeadersInit {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE;

  // Get customer ID from localStorage if authenticated
  let customerId = '';
  if (typeof window !== 'undefined') {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      try {
        const customer = JSON.parse(customerData);
        customerId = customer.id || '';

        if (!customerId) {
          console.warn('⚠️ Customer data exists but no ID found:', customer);
        }
      } catch (e) {
        console.error('❌ Failed to parse customer data:', e);
      }
    } else {
      console.warn('⚠️ No customer data in localStorage - user may not be logged in');
    }
  }

  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    'x-site-id': siteId || '',
    'x-business-type': businessType || '',
    ...customHeaders,
  };

  // Only add x-customer-id if available
  if (customerId) {
    headers['x-customer-id'] = customerId;
    console.log('✅ API headers created with customer ID:', customerId);
  } else {
    console.warn('⚠️ API request without customer ID - authentication may fail');
  }

  return headers;
}

/**
 * API Client
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: createHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: createHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },
};

/**
 * Products API
 */
export const productsApi = {
  /**
   * Get products list
   * モックモード対応: public/mock-api/products.json から取得
   */
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    // モックモードの場合
    if (isMockMode()) {
      const mockData = await fetchMockData<{
        products: any[];
        pagination: {
          page: number;
          perPage: number;
          total: number;
          totalPages: number;
        };
      }>('products');

      // パラメータによるフィルタリング（簡易版）
      let filteredProducts = mockData.products;

      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.productName.toLowerCase().includes(searchLower) ||
          p.productCode.toLowerCase().includes(searchLower)
        );
      }

      return {
        products: filteredProducts,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / (params?.limit || 20)),
        },
      };
    }

    // 本番APIモード
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get<{
      products: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/api/products${query ? `?${query}` : ''}`);
  },

  /**
   * Get product detail
   * モックモード対応: products.jsonから該当IDの商品を検索
   */
  async getProduct(id: string) {
    // モックモードの場合
    if (isMockMode()) {
      const mockData = await fetchMockData<{
        products: any[];
      }>('products');

      const product = mockData.products.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product not found: ${id}`);
      }
      return product;
    }

    // 本番APIモード
    return apiClient.get<any>(`/api/products/${id}`);
  },
};

/**
 * Cart API
 */
export const cartApi = {
  /**
   * Get cart
   * モックモード対応: localStorageから取得
   */
  async getCart() {
    // モックモードの場合
    if (isMockMode()) {
      const mockCart = typeof window !== 'undefined'
        ? localStorage.getItem('mock-cart')
        : null;

      if (mockCart) {
        return JSON.parse(mockCart);
      }

      // デフォルトの空カート
      const defaultCart = await fetchMockData<{
        items: any[];
        totalAmount: number;
        totalQuantity: number;
      }>('cart');

      return {
        cartId: 'mock-cart-id',
        items: defaultCart.items,
        total: defaultCart.totalAmount,
        itemCount: defaultCart.totalQuantity,
      };
    }

    // 本番APIモード
    return apiClient.get<{
      cartId?: string;
      items: any[];
      total: number;
      itemCount: number;
    }>('/api/cart');
  },

  /**
   * Add to cart
   * モックモード対応: localStorageに保存
   */
  async addToCart(productId: string, quantity: number) {
    // モックモードの場合
    if (isMockMode()) {
      const cart = await this.getCart();
      const existingItem = cart.items.find((item: any) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          addedAt: new Date().toISOString(),
        });
      }

      cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

      if (typeof window !== 'undefined') {
        localStorage.setItem('mock-cart', JSON.stringify(cart));
      }

      return {
        message: 'Product added to cart (mock)',
        cartId: 'mock-cart-id',
      };
    }

    // 本番APIモード
    return apiClient.post<{
      message: string;
      cartId: string;
    }>('/api/cart', { productId, quantity });
  },

  /**
   * Clear cart
   * モックモード対応: localStorageをクリア
   */
  async clearCart() {
    // モックモードの場合
    if (isMockMode()) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mock-cart');
      }

      return { message: 'Cart cleared (mock)' };
    }

    // 本番APIモード
    return apiClient.delete<{ message: string }>('/api/cart');
  },
};

/**
 * Orders API
 */
export const ordersApi = {
  /**
   * Get orders
   * モックモード対応: localStorageから取得
   */
  async getOrders(params?: { page?: number; limit?: number }) {
    // モックモードの場合
    if (isMockMode()) {
      const mockOrders = typeof window !== 'undefined'
        ? localStorage.getItem('mock-orders')
        : null;

      if (mockOrders) {
        const orders = JSON.parse(mockOrders);
        return {
          orders,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: orders.length,
            totalPages: Math.ceil(orders.length / (params?.limit || 10)),
          },
        };
      }

      // デフォルトの空注文履歴
      const defaultOrders = await fetchMockData<{
        orders: any[];
        pagination: any;
      }>('orders');

      return defaultOrders;
    }

    // 本番APIモード
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get<{
      orders: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/api/orders${query ? `?${query}` : ''}`);
  },

  /**
   * Create order
   * モックモード対応: localStorageに保存
   */
  async createOrder(data: {
    items: Array<{
      id: string;
      name: string;
      code: string;
      price: number;
      quantity: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    usePoints?: number;
  }) {
    // モックモードの場合
    if (isMockMode()) {
      const orderNumber = `MOCK-${Date.now()}`;
      const totalAmount = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrder = {
        orderId: `order_${Date.now()}`,
        orderNumber,
        totalAmount,
        pointsEarned: Math.floor(totalAmount * 0.01), // 1%ポイント還元
        pointsUsed: data.usePoints || 0,
        items: data.items,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        paymentMethod: data.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // 既存の注文履歴を取得
      const existingOrders = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('mock-orders') || '[]')
        : [];

      // 新しい注文を追加
      existingOrders.unshift(newOrder);

      if (typeof window !== 'undefined') {
        localStorage.setItem('mock-orders', JSON.stringify(existingOrders));
      }

      return {
        orderId: newOrder.orderId,
        orderNumber: newOrder.orderNumber,
        totalAmount: newOrder.totalAmount,
        pointsEarned: newOrder.pointsEarned,
        pointsUsed: newOrder.pointsUsed,
      };
    }

    // 本番APIモード
    return apiClient.post<{
      orderId: string;
      orderNumber: string;
      totalAmount: number;
      pointsEarned: number;
      pointsUsed: number;
    }>('/api/orders', data);
  },
};

/**
 * Banners API
 */
export const bannersApi = {
  /**
   * Get active banners (公開中のバナーのみ取得)
   */
  async getBanners() {
    return apiClient.get<{
      success: boolean;
      data: Array<{
        id: string;
        message: string;
        variant: 'info' | 'success' | 'warning' | 'error';
        imageUrl: string;
        actionLabel?: string;
        actionUrl?: string;
        publishStartDate?: string;
        publishEndDate?: string;
        createdAt: string;
        updatedAt: string;
      }>;
    }>('/api/banners');
  },
};

/**
 * Campaigns API
 */
export const campaignsApi = {
  /**
   * Get campaign detail by slug
   */
  async getCampaign(slug: string) {
    return apiClient.get<{
      success: boolean;
      data: {
        id: string;
        title: string;
        slug: string;
        description: string;
        content?: string;
        bannerImageUrl: string;
        thumbnailImageUrl?: string;
        startDate: string;
        endDate: string;
        publishStatus: 'draft' | 'published' | 'archived';
        productIds: string[];
        displayOrder: number;
        createdAt: string;
        updatedAt: string;
      };
    }>(`/api/campaigns/${slug}`);
  },
};
