/**
 * API Client for Headless Commerce (Composer Backend)
 * ヘッドレスコマース用APIクライアント（Composerバックエンド）
 */

import { getBusinessType, getApiEndpoint } from './frontend-context';

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
   */
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
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
   */
  async getProduct(id: string) {
    return apiClient.get<any>(`/api/products/${id}`);
  },
};

/**
 * Cart API
 */
export const cartApi = {
  /**
   * Get cart
   */
  async getCart() {
    return apiClient.get<{
      cartId?: string;
      items: any[];
      total: number;
      itemCount: number;
    }>('/api/cart');
  },

  /**
   * Add to cart
   */
  async addToCart(productId: string, quantity: number) {
    return apiClient.post<{
      message: string;
      cartId: string;
    }>('/api/cart', { productId, quantity });
  },

  /**
   * Clear cart
   */
  async clearCart() {
    return apiClient.delete<{ message: string }>('/api/cart');
  },
};

/**
 * Orders API
 */
export const ordersApi = {
  /**
   * Get orders
   */
  async getOrders(params?: { page?: number; limit?: number }) {
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
