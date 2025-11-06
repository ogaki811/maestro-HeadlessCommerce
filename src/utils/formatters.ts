/**
 * フォーマット関連のユーティリティ関数
 */

/**
 * 価格を日本円フォーマットで表示
 * @param price - 価格（数値）
 * @returns フォーマットされた価格文字列（例: "¥1,234"）
 */
export const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};

/**
 * 日付を日本語フォーマットで表示
 * @param date - Date オブジェクト or 日付文字列
 * @returns フォーマットされた日付文字列（例: "2025年1月1日"）
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 日付を短い形式でフォーマット
 * @param date - Date オブジェクト or 日付文字列
 * @returns フォーマットされた日付文字列（例: "2025/01/01"）
 */
export const formatDateShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * 郵便番号をフォーマット
 * @param postalCode - 郵便番号（ハイフンあり/なし両対応）
 * @returns フォーマットされた郵便番号（例: "123-4567"）
 */
export const formatPostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/[^0-9]/g, '');
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return postalCode;
};

/**
 * 電話番号をフォーマット
 * @param phoneNumber - 電話番号
 * @returns フォーマットされた電話番号（例: "090-1234-5678"）
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phoneNumber;
};

/**
 * 数値を3桁カンマ区切りでフォーマット
 * @param num - 数値
 * @returns フォーマットされた文字列（例: "1,234"）
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
