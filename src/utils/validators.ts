/**
 * バリデーション関連のユーティリティ関数
 */

import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, POSTAL_CODE_LENGTH } from '@/constants';

/**
 * メールアドレスの妥当性をチェック
 * @param email - メールアドレス
 * @returns バリデーション結果
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * パスワードの妥当性をチェック
 * @param password - パスワード
 * @returns バリデーション結果
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください`);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(`パスワードは${MAX_PASSWORD_LENGTH}文字以内で入力してください`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * パスワード強度を計算
 * @param password - パスワード
 * @returns 強度（0-100）
 */
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 15;
  if (/[!@#$%^&*]/.test(password)) strength += 10;

  return Math.min(strength, 100);
};

/**
 * 郵便番号の妥当性をチェック
 * @param postalCode - 郵便番号
 * @returns バリデーション結果
 */
export const validatePostalCode = (postalCode: string): boolean => {
  const cleaned = postalCode.replace(/[^0-9]/g, '');
  return cleaned.length === POSTAL_CODE_LENGTH;
};

/**
 * 電話番号の妥当性をチェック
 * @param phoneNumber - 電話番号
 * @returns バリデーション結果
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * 空文字チェック
 * @param value - チェックする値
 * @returns 空文字の場合true
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim() === '';
};

/**
 * 必須入力チェック
 * @param value - チェックする値
 * @param fieldName - フィールド名
 * @returns エラーメッセージ（問題なければnull）
 */
export const validateRequired = (
  value: string | null | undefined,
  fieldName: string
): string | null => {
  return isEmpty(value) ? `${fieldName}は必須です` : null;
};
