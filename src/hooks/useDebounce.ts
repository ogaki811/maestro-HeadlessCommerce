import { useState, useEffect } from 'react';

/**
 * デバウンスフック
 * 値の変更を指定された遅延時間後に反映する
 * 検索入力などの頻繁な更新を最適化するのに使用
 *
 * @param value - デバウンスする値
 * @param delay - 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 指定された遅延後に値を更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数：値が変更されたら前のタイマーをキャンセル
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
