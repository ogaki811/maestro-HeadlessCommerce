/**
 * useProductSearch Hook
 * クイックオーダー用リアルタイム商品検索
 */

import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

/**
 * 商品検索結果
 */
export interface ProductSearchResult {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  priceWithTax: number;
  imageUrl: string;
  stock: number;
  category: string;
  isAvailable: boolean;
}

/**
 * 商品検索エラー
 */
export interface ProductSearchError {
  code: string;
  message: string;
}

/**
 * リアルタイム商品検索hook
 *
 * @param productCode - 商品コード
 * @param delay - デバウンス時間（デフォルト: 300ms）
 * @returns 検索結果、エラー、検索中フラグ
 *
 * @example
 * const { result, error, isSearching } = useProductSearch(productCode, 300);
 */
export function useProductSearch(productCode: string, delay: number = 300) {
  const [result, setResult] = useState<ProductSearchResult | null>(null);
  const [error, setError] = useState<ProductSearchError | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // デバウンス処理
  const debouncedCode = useDebounce(productCode, delay);

  useEffect(() => {
    // 空文字または2文字未満の場合は検索しない
    if (!debouncedCode || debouncedCode.trim().length < 2) {
      setResult(null);
      setError(null);
      setIsSearching(false);
      return;
    }

    const searchProduct = async () => {
      setIsSearching(true);
      setError(null);

      try {
        // API呼び出し
        const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'toc-site-a';
        const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE || 'toc';
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000';

        // 顧客ID取得（localStorage から）
        let customerId = '';
        if (typeof window !== 'undefined') {
          const customerData = localStorage.getItem('customer');
          if (customerData) {
            try {
              const customer = JSON.parse(customerData);
              customerId = customer.id || '';
            } catch (e) {
              console.error('Failed to parse customer data:', e);
            }
          }
        }

        const url = new URL('/api/quick-order/search', apiEndpoint);
        url.searchParams.set('code', debouncedCode.trim());

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-site-id': siteId,
            'x-business-type': businessType,
            'x-customer-id': customerId,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setResult(data.product);

          // 在庫切れ警告
          if (data.warning) {
            setError({
              code: data.warning.code,
              message: data.warning.message,
            });
          } else {
            setError(null);
          }
        } else {
          setResult(null);
          setError({
            code: data.errorCode,
            message: data.errorMessage,
          });
        }
      } catch (err) {
        console.error('Product search error:', err);
        setResult(null);
        setError({
          code: 'NETWORK_ERROR',
          message: '通信エラーが発生しました',
        });
      } finally {
        setIsSearching(false);
      }
    };

    searchProduct();
  }, [debouncedCode]);

  return {
    result,
    error,
    isSearching,
    // ヘルパー
    hasResult: result !== null,
    hasError: error !== null && result === null,
  };
}
