import { useState, useEffect, useRef } from 'react';

interface UseScrollDirectionReturn {
  isScrolled: boolean;
  showHeader: boolean;
}

/**
 * スクロール方向を検知するカスタムフック
 * @param threshold スクロール検知を開始する閾値（px）
 * @returns isScrolled: スクロール位置が閾値を超えたか, showHeader: ヘッダーを表示するか
 */
export function useScrollDirection(threshold: number = 100): UseScrollDirectionReturn {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const prevScrollYRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // スクロール位置が閾値以上でヘッダーを固定状態に
      if (currentScrollY > threshold) {
        setIsScrolled(true);

        // スクロール方向を判定
        if (currentScrollY < prevScrollYRef.current) {
          // 上スクロール: ヘッダーを表示
          setShowHeader(true);
        } else if (currentScrollY > prevScrollYRef.current) {
          // 下スクロール: ヘッダーを非表示
          setShowHeader(false);
        }
      } else {
        // トップ付近ではヘッダーを常に表示
        setIsScrolled(false);
        setShowHeader(true);
      }

      prevScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, showHeader };
}
