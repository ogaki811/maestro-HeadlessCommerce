# MainBanner リファクタリング計画

## 概要

MainBannerコンポーネント（Molecule）のコード品質向上を目的としたリファクタリング

## 目的

- **保守性向上**: マジックナンバーを定数化し、設定変更を容易に
- **可読性向上**: Swiper設定を分離し、コンポーネントロジックを明確に
- **Tailwind CSS優先**: インラインスタイルをTailwindクラスに統一
- **型安全性**: 型定義を明示的にし、TypeScriptの恩恵を最大化
- **テストによる保護**: リグレッション防止のためTDDで実装

## 対象ファイル

- `src/components/common/MainBanner.tsx` - メインコンポーネント
- `src/components/common/MainBanner.css` - BEMスタイル
- `src/components/common/__tests__/MainBanner.test.tsx` - 新規作成

## 現在のコードの問題点

### 1. マジックナンバーの散在
- `spaceBetween={20}` (Line 105)
- `delay: 5000` (Line 111)
- `style={{ width: '360px', height: '200px', ... }}` (Line 151)
- `index < 2` (Line 152) - eager loading threshold

### 2. Swiper設定の可読性
- Lines 103-136: 長い設定オブジェクトがJSX内に埋め込まれている
- breakpointsの全てで `slidesPerView: 'auto'` が重複

### 3. インラインスタイルの使用
- Line 151: インラインスタイルがCSSクラスと混在
- Tailwind CSS優先原則に違反

### 4. クラス名の複雑な構築
- Lines 143-145: テンプレートリテラル内に複数の条件式

### 5. 型定義の明示性不足
- Line 140: `{ isActive }: { isActive: boolean }` がインラインで定義

## リファクタリング内容

### A. 定数の抽出

```typescript
// バナーサイズ定数
const BANNER_DIMENSIONS = {
  width: 360,
  height: 200,
} as const;

// Swiper設定定数
const SWIPER_SETTINGS = {
  autoplayDelay: 5000,
  eagerLoadCount: 2,
} as const;

// レスポンシブ用spaceBetween
const SPACE_BETWEEN_BREAKPOINTS = {
  320: 20,
  640: 20,
  1024: 24,
  1280: 30,
} as const;
```

### B. Swiper設定オブジェクトの分離

コンポーネント内で動的に生成:

```typescript
const swiperConfig = {
  modules: [Navigation, Pagination, Autoplay],
  spaceBetween: 20,
  centeredSlides: true,
  slidesPerView: 'auto' as const,
  loop: true,
  loopedSlides: banners.length,
  autoplay: {
    delay: SWIPER_SETTINGS.autoplayDelay,
    disableOnInteraction: false,
  },
  pagination: { clickable: true },
  navigation: true,
  breakpoints: {
    320: { spaceBetween: SPACE_BETWEEN_BREAKPOINTS[320] },
    640: { spaceBetween: SPACE_BETWEEN_BREAKPOINTS[640] },
    1024: { spaceBetween: SPACE_BETWEEN_BREAKPOINTS[1024] },
    1280: { spaceBetween: SPACE_BETWEEN_BREAKPOINTS[1280] },
  },
};
```

### C. Tailwind CSS化（インラインスタイル削除）

変更前:
```typescript
style={{ width: '360px', height: '200px', objectFit: 'contain', display: 'block' }}
```

変更後:
```typescript
className="ec-main-banner__image rounded-lg w-[360px] h-[200px] object-contain block"
```

**理由**: 開発ルール10「Tailwind CSS First」に準拠

### D. ヘルパー関数の作成

```typescript
/** アクティブ状態に応じたリンククラス名を生成 */
const getLinkClassName = (isActive: boolean): string => {
  const baseClasses = 'ec-main-banner__link block h-full';
  const activeClasses = isActive
    ? 'ec-main-banner__link--active scale-105'
    : 'scale-95';
  return `${baseClasses} ${activeClasses}`;
};

/** インデックスに応じた画像読み込み戦略を返す */
const getImageLoadingStrategy = (index: number): 'eager' | 'lazy' =>
  index < SWIPER_SETTINGS.eagerLoadCount ? 'eager' : 'lazy';
```

### E. 型定義の明示化

```typescript
/** SwiperSlideのレンダープロップス型 */
type SwiperSlideRenderProps = {
  isActive: boolean;
};
```

## リファクタリング後のコード構造

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { bannersApi } from '@/lib/api-client';
import type { BannerConfig } from '@/types/banner';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MainBanner.css';

// ===== 定数定義 =====
const BANNER_DIMENSIONS = { ... };
const SWIPER_SETTINGS = { ... };
const SPACE_BETWEEN_BREAKPOINTS = { ... };

// ===== デフォルトバナーデータ =====
const defaultBanners: BannerConfig[] = [ ... ];

// ===== 型定義 =====
type SwiperSlideRenderProps = { ... };

// ===== ヘルパー関数 =====
const getLinkClassName = (isActive: boolean) => { ... };
const getImageLoadingStrategy = (index: number) => { ... };

// ===== メインコンポーネント =====
export default function MainBanner() {
  const [banners, setBanners] = useState<BannerConfig[]>(defaultBanners);

  useEffect(() => {
    // API fetch logic
  }, []);

  if (banners.length === 0) {
    return null;
  }

  // Swiper設定（動的生成）
  const swiperConfig = { ... };

  return (
    <section className="ec-main-banner main-banner-section relative w-full bg-gray-100">
      <Swiper {...swiperConfig} className="ec-main-banner__container main-banner-slider">
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id} className="ec-main-banner__slide">
            {({ isActive }: SwiperSlideRenderProps) => (
              <Link
                href={banner.actionUrl || banner.linkUrl || '#'}
                className={getLinkClassName(isActive)}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.message || banner.title || 'バナー'}
                  className="ec-main-banner__image rounded-lg w-[360px] h-[200px] object-contain block"
                  loading={getImageLoadingStrategy(index)}
                />
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
```

## TDD実装フェーズ

### フェーズ1: テスト作成（Red）

`src/components/common/__tests__/MainBanner.test.tsx`

テスト項目:
1. デフォルトバナー6枚の表示
2. API fetch成功時のバナー切り替え
3. API失敗時のデフォルトバナー使用
4. バナーが0件の場合null返却
5. 最初の2枚がeager loading、残りがlazy loading
6. Swiperの設定値（loop, centeredSlides, autoplay等）
7. アクティブスライドのscale-105クラス適用
8. 非アクティブスライドのscale-95クラス適用

### フェーズ2: 実装（Green）

上記のリファクタリング内容を実装

### フェーズ3: テスト実行・確認

```bash
npm test -- MainBanner.test.tsx
```

カバレッジ60%以上を確認

## 影響範囲

### 変更あり
- `src/components/common/MainBanner.tsx` - リファクタリング

### 変更なし
- `src/components/common/MainBanner.css` - スタイル変更なし
- `src/app/page.tsx` - 使用箇所は影響なし
- 機能・見た目は完全に同一

## パフォーマンス影響

### Lighthouse監査

リファクタリング前後で以下のスコアを維持:
- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

**影響**: なし（コードの整理のみで、ロジック変更なし）

## テスト項目

### 1. ユニットテスト
- [ ] デフォルトバナー表示
- [ ] API成功時のバナー読み込み
- [ ] API失敗時のフォールバック
- [ ] 空配列時のnull返却
- [ ] Lazy loading戦略
- [ ] Swiper設定値
- [ ] クラス名生成ロジック

### 2. ビジュアル確認
- [ ] デスクトップ（1280px以上）での表示
- [ ] タブレット（768px-1023px）での表示
- [ ] モバイル（320px-767px）での表示
- [ ] スライダー自動再生動作
- [ ] 前へ/次へボタンの動作
- [ ] ページネーションドットの動作
- [ ] バナーリンクのクリック動作

### 3. TypeScriptビルド
- [ ] `npm run build` でエラーなし

### 4. Lighthouse監査
- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

## 注意事項

### コンソールログの絵文字について

Lines 87, 90にコンソールログで絵文字を使用:
```typescript
console.log('✅ Loaded banners from Composer API:', response.data.length);
console.error('❌ Failed to load banners from API, using default data:', error);
```

**開発ルール12**: 「Never use emoji icons in UI components」
**対応**: これはUIコンポーネントではなくコンソールログなので例外として許容。開発時のデバッグ用途。

### カスタムCSSの使用について

`MainBanner.css`でカスタムCSSを使用している理由:
- Swiperの内部要素（`.swiper-button-next`, `.swiper-pagination`等）は外部ライブラリ
- Tailwindのみでは詳細なカスタマイズが困難
- BEM命名規則に従い、保守性を確保

## 所要時間見積もり

- ドキュメント作成: 15分 ✅
- テスト作成: 30分
- リファクタリング実装: 30分
- テスト実行・修正: 20分
- Lighthouse監査: 10分
- ビルド確認: 5分
- コミット: 10分
- **合計**: 約2時間

## 関連ドキュメント

- `CLAUDE.md` - 開発ルール・Atomic Designガイドライン
- `docs/plans/banner-resize-360x200.md` - バナーサイズ変更の実装計画

## ブランチ情報

- **ブランチ名**: `feature/banner-resize-360x200`（既存ブランチを継続使用）
- **ベースブランチ**: `main`

## 作成日時

2025年11月14日
