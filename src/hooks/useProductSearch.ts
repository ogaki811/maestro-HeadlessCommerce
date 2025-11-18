/**
 * useProductSearch Hook
 * クイックオーダー用リアルタイム商品検索
 */

import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';
import { sampleProducts } from '@/data/sampleProducts';

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
  // 廃番商品対応
  discontinued?: boolean;
  discontinuedDate?: string;
  discontinuedReason?: string;
  alternativeProducts?: ProductSearchResult[]; // 代替商品情報
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

      // サンプルデータから商品を検索（API呼び出しをシミュレート）
      await new Promise(resolve => setTimeout(resolve, 200)); // 検索のシミュレーション

      try {
        // 商品コードで検索（大文字小文字を区別しない）
        const trimmedCode = debouncedCode.trim().toUpperCase();
        const product = sampleProducts.find(
          (p) => p.code.toUpperCase() === trimmedCode
        );

        if (product) {
          // 代替商品を検索（廃番商品の場合）
          let alternativeProducts: ProductSearchResult[] | undefined;
          if (product.discontinued && product.alternativeProductCodes) {
            alternativeProducts = product.alternativeProductCodes
              .map((altCode) => {
                const altProduct = sampleProducts.find(
                  (p) => p.code.toUpperCase() === altCode.toUpperCase()
                );
                if (!altProduct) return null;

                return {
                  id: altProduct.id,
                  code: altProduct.code,
                  name: altProduct.name,
                  description: '',
                  price: altProduct.price,
                  priceWithTax: Math.floor(altProduct.price * 1.1),
                  imageUrl: altProduct.image,
                  stock: typeof altProduct.stock === 'number' ? altProduct.stock : (altProduct.stock ? 100 : 0),
                  category: altProduct.category,
                  isAvailable: altProduct.stock ? true : false,
                };
              })
              .filter((p): p is ProductSearchResult => p !== null)
              .slice(0, 3); // 最大3件まで
          }

          // 商品が見つかった場合
          const searchResult: ProductSearchResult = {
            id: product.id,
            code: product.code,
            name: product.name,
            description: '', // サンプルデータには説明がないため空文字
            price: product.price,
            priceWithTax: Math.floor(product.price * 1.1), // 10%の消費税を加算
            imageUrl: product.image,
            stock: product.stock ? 100 : 0, // サンプルデータはboolean型なので数値に変換
            category: product.category,
            isAvailable: Boolean(product.stock),
            // 廃番商品情報
            discontinued: product.discontinued,
            discontinuedDate: product.discontinuedDate,
            discontinuedReason: product.discontinuedReason,
            alternativeProducts,
          };

          setResult(searchResult);

          // 廃番警告または在庫切れ警告
          if (product.discontinued) {
            setError({
              code: 'DISCONTINUED',
              message: 'この商品は廃番になりました',
            });
          } else if (!product.stock) {
            setError({
              code: 'OUT_OF_STOCK',
              message: 'この商品は在庫切れです',
            });
          } else {
            setError(null);
          }
        } else {
          // 商品が見つからなかった場合
          setResult(null);
          setError({
            code: 'NOT_FOUND',
            message: '商品が見つかりませんでした',
          });
        }
      } catch (err) {
        console.error('Product search error:', err);
        setResult(null);
        setError({
          code: 'SEARCH_ERROR',
          message: '検索エラーが発生しました',
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
