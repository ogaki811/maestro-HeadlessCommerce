import { useState } from 'react';

interface AddressData {
  prefecture: string;
  city: string;
  address: string;
  prefectureKana: string;
  cityKana: string;
  addressKana: string;
}

interface UsePostalCodeReturn {
  searchAddress: (postalCode: string) => Promise<AddressData | null>;
  loading: boolean;
  error: string | undefined;
  clearError: () => void;
}

/**
 * usePostalCode - 郵便番号から住所を検索するカスタムフック
 * zipcloud API (https://zipcloud.ibsnet.co.jp/doc/api) を使用
 */
function usePostalCode(): UsePostalCodeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * 郵便番号から住所を検索
   * @param postalCode - 郵便番号（ハイフンあり/なし両対応）
   * @returns 住所データまたはnull
   */
  const searchAddress = async (postalCode: string): Promise<AddressData | null> => {
    // 郵便番号のバリデーション
    const cleanCode = postalCode.replace(/[^0-9]/g, '');
    if (cleanCode.length !== 7) {
      setError('郵便番号は7桁で入力してください');
      return null;
    }

    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`
      );

      if (!response.ok) {
        throw new Error('住所の取得に失敗しました');
      }

      const data = await response.json();

      if (data.status !== 200) {
        throw new Error(data.message || '住所の取得に失敗しました');
      }

      if (!data.results || data.results.length === 0) {
        setError('該当する住所が見つかりませんでした');
        return null;
      }

      // 最初の結果を返す
      const result = data.results[0];
      return {
        prefecture: result.address1,
        city: result.address2,
        address: result.address3,
        prefectureKana: result.kana1,
        cityKana: result.kana2,
        addressKana: result.kana3,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '住所の取得に失敗しました';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * エラーをクリア
   */
  const clearError = (): void => {
    setError(undefined);
  };

  return {
    searchAddress,
    loading,
    error,
    clearError,
  };
}

export default usePostalCode;
