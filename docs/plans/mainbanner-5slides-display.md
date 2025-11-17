# MainBanner 5個バナー表示実装計画

## 日付
2025-01-17

## 目的
1. バナーを5個並べて同時表示する
2. 最後のスライドに到達しても1番目の画像が見えるシームレスな無限ループを実装
3. **セレクトされている画像の大きさ（360px × 200px）はそのまま維持**

## 現状の問題点

### 問題1: 中央1つ+部分表示の設定
- 現在: `slidesPerView: 'auto'` + `centeredSlides: true`
- 結果: 中央に1つのバナーが大きく表示され、両端に部分的に表示される
- 要求: 5個のバナーを同時に並べて表示

### 問題2: 画像サイズの維持
- **要件**: 現在のスライド幅 `360px × 200px` を維持
- 5個表示に必要な最小幅: `360px × 5 + spaceBetween × 4 = 1800px + 80px = 1880px`
- **重要**: 画像サイズは変更せず、レスポンシブ対応で表示個数のみ調整

## Swiper公式仕様の確認

### slidesPerView設定
- **数値指定**: `slidesPerView: 5` - 5個同時表示
- **'auto'**: 各スライドの幅に基づいて自動計算
- **デフォルト**: `1`

### loop設定（無限ループ）
- 現在: `loop: true` + `loopAdditionalSlides: 1` - 既に有効
- 要求を満たす: 最後に到達しても1番目が見える
- **注意**: `loop + slidesPerView: 5`の互換性を確認する必要がある

### centeredSlides設定
- 現在: `true` - 中央寄せ
- 5個表示では: `false`の方が適切（均等配置）

## 実装アプローチ

### Phase 1: ドキュメント作成
このファイル自体

### Phase 2: Swiper設定変更

#### 変更内容
```typescript
// 変更前
const swiperConfig = {
  slidesPerView: 'auto' as const,
  centeredSlides: true,
  spaceBetween: 20,
  // ...
};

// 変更後
const swiperConfig = {
  slidesPerView: 5,  // 5個同時表示
  centeredSlides: false,  // 均等配置
  spaceBetween: 20,
  // loop: true は維持（無限ループ）
  // ...

  // レスポンシブ設定追加
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  },
};
```

### Phase 3: CSS調整

#### 変更内容
```css
/* 変更前・変更後ともに同じ */
.main-banner-slider .swiper-slide {
  width: 360px !important;  /* 固定幅を維持（要件） */
  height: 200px;
}

/* 画像サイズも維持 */
.ec-main-banner__image {
  width: 360px;
  height: 200px;
}
```

**重要**: 画像サイズは `360px × 200px` で固定（ユーザー要件）
レスポンシブ対応は `slidesPerView` の変更のみで対応

#### スケルトンローディングの調整
```typescript
// 変更前: 1つのスケルトン
<div className="w-[360px] h-[200px] bg-gray-200 rounded-lg animate-pulse" />

// 変更後: 5個のスケルトン（レスポンシブ）
<div className="flex gap-5 justify-center">
  {[1, 2, 3, 4, 5].map(i => (
    <div key={i} className="w-[360px] h-[200px] bg-gray-200 rounded-lg animate-pulse" />
  ))}
</div>
```

### Phase 4: レスポンシブ対応

#### ブレークポイント設計
- **320px-639px (モバイル)**: `slidesPerView: 1` - 1個表示
- **640px-1023px (タブレット)**: `slidesPerView: 2` - 2個表示
- **1024px-1279px (小デスクトップ)**: `slidesPerView: 3` - 3個表示
- **1280px-1535px (中デスクトップ)**: `slidesPerView: 4` - 4個表示
- **1536px以上 (大デスクトップ)**: `slidesPerView: 5` - 5個表示

### Phase 5: テスト

#### テスト項目
1. **5個表示の検証**
   - 大画面で5個のバナーが並んで表示されること
   - 各ブレークポイントで正しい数が表示されること
2. **無限ループの検証**
   - 最後のスライド後、最初のスライドに戻ること
   - シームレスにループすること
   - 初期化ジャンプがスケルトンで隠蔽されていること
3. **既存テストの通過**
   - 全12テストケースが成功すること
4. **パフォーマンス検証**
   - Lighthouse Performance 90+を維持
   - ロード時間が短縮されたまま（2枚ロード後表示）

## 実装後の期待値

### 表示
- **大画面（1536px以上）**: 5個のバナーが並んで表示
- **中画面（1280px-1535px）**: 4個のバナーが並んで表示
- **小画面（1024px-1279px）**: 3個のバナーが並んで表示
- **タブレット（640px-1023px）**: 2個のバナーが並んで表示
- **モバイル（320px-639px）**: 1個のバナーが表示

### ユーザー体験
- ✅ 5個のバナーが同時に見える（大画面）
- ✅ シームレスな無限ループ
- ✅ 高速な初期表示（2枚ロード後）
- ✅ 初期化ジャンプなし（スケルトンで隠蔽）
- ✅ レスポンシブ対応（全デバイス）

## リスク分析

### リスク1: Swiper v11のloop互換性
- **リスク**: `loop + slidesPerView: 5`で不安定になる可能性
- **軽減策**:
  - スケルトンローディングで初期化を隠蔽（既存）
  - `loopAdditionalSlides: 2`に増やす（5個表示用）
  - テストで動作確認

### リスク2: 小画面での表示
- **制約**: 360pxのバナーサイズは維持（ユーザー要件）
- **対応**:
  - ブレークポイントで`slidesPerView`を調整
  - モバイル（320px幅）では1個のみ表示
  - 画面幅が狭い場合はスクロールで対応
  - `overflow: visible`で両端を表示

### リスク3: パフォーマンス低下
- **リスク**: 5個表示でレンダリング負荷増加
- **軽減策**:
  - 既存の画像最適化を維持（priority, lazy loading）
  - Lighthouse計測で確認

## 参考資料
- Swiper公式API - slidesPerView: https://swiperjs.com/swiper-api#param-slidesPerView
- Swiper公式API - breakpoints: https://swiperjs.com/swiper-api#param-breakpoints
- Swiper公式API - loop: https://swiperjs.com/swiper-api#param-loop
