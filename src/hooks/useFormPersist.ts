'use client';

import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

interface UseFormPersistReturn<T> {
  getStoredData: () => T | null;
  clearStoredData: () => void;
}

/**
 * useFormPersist - フォームデータをLocalStorageに永続化するカスタムフック（SSR対応）
 * @param storageKey - LocalStorageのキー名
 * @param formData - フォームデータ
 * @param delay - デバウンス遅延時間（ミリ秒）
 */
function useFormPersist<T extends object>(
  storageKey: string,
  formData: T,
  delay: number = 1000
): UseFormPersistReturn<T> {
  const [isMounted, setIsMounted] = useState(false);

  // フォームデータの変更をデバウンス
  const debouncedFormData = useDebounce(formData, delay);

  // SSR対応: クライアントサイドでのみ動作
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * LocalStorageからフォームデータを取得
   * @returns 保存されたフォームデータまたはnull
   */
  const getStoredData = (): T | null => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load form data from localStorage:', error);
      return null;
    }
  };

  /**
   * LocalStorageにフォームデータを保存
   */
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(debouncedFormData));
    } catch (error) {
      console.error('Failed to save form data to localStorage:', error);
    }
  }, [debouncedFormData, storageKey, isMounted]);

  /**
   * LocalStorageからフォームデータを削除
   */
  const clearStoredData = (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear form data from localStorage:', error);
    }
  };

  /**
   * ページ離脱時の警告
   */
  useEffect(() => {
    if (!isMounted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // フォームデータが空でない場合のみ警告
      const hasData = Object.values(formData).some((value) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value.trim() !== '';
        return value != null;
      });

      if (hasData) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, isMounted]);

  return {
    getStoredData,
    clearStoredData,
  };
}

export default useFormPersist;
