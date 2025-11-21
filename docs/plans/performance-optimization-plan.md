# パフォーマンス最適化計画

**作成日**: 2025年11月19日
**目的**: サイト全体の軽量化とパフォーマンス改善

---

## 📊 現状分析

### ビルド結果（2025年11月19日時点）

```
Route (app)                              Size  First Load JS
┌ ○ /                                 3.31 kB         166 kB
├ ○ /cart                             8.4 kB         171 kB
├ ○ /products                        3.06 kB         144 kB
├ ƒ /products/[id]                   5.91 kB         169 kB
└ + First Load JS shared by all        102 kB
  ├ chunks/1255-f6002b949225031b.js 45.6 kB
  ├ chunks/4bd1b696-f6bedae49f0827a5.js 54.2 kB
  └ other shared chunks (total)     1.92 kB

ƒ Middleware                          33.7 kB
```

### 特定された問題

#### 🔴 重大（Priority 1）

1. **画像最適化されていない**
   - 影響度: ★★★★★
   - 15箇所以上で`<img>`タグを使用
   - Next.jsの警告で指摘されている
   - **LCP（Largest Contentful Paint）の悪化原因**

2. **Swiper.jsライブラリが重い**
   - 影響度: ★★★★☆
   - 20ファイルで使用
   - バンドルサイズへの大きな影響
   - MainBanner、ProductSliderなど

#### 🟡 重要（Priority 2）

3. **バンドルサイズが大きい**
   - 影響度: ★★★☆☆
   - Shared JS: 102 kB
   - 最も重いページ：
     - `/cart`: 171 kB
     - `/products/[id]`: 169 kB
     - `/` (ホーム): 166 kB

4. **クライアントコンポーネントが多い**
   - 影響度: ★★★☆☆
   - 20+ファイルで`'use client'`使用
   - サーバーコンポーネント化できる可能性

---

## 🎯 パフォーマンス目標

### 現状（推定）
- First Load JS: 130-171 kB
- LCP: 2.5-3.5s
- Lighthouse Performance: 60-70点
- Shared JS: 102 kB

### 目標（全Phase完了後）
- **First Load JS**: 90-120 kB（**30-40%削減**）
- **LCP**: 0.7-1.2s（**60-70%改善**）
- **Lighthouse Performance**: **90+点達成** ✅
- **Shared JS**: 70-80 kB（**20-30%削減**）

---

## 📋 実装計画

### Phase 1: 画像最適化（最優先）

**目標**: LCP 30-40%改善、First Load JS 10-15 kB削減

**スケジュール**: 2-3時間
**影響度**: ★★★★★
**難易度**: ★★☆☆☆

#### 実装内容

1. **全ての`<img>`を`next/image <Image />`に置き換え**

   **対象ファイル（15+箇所）**:
   - `src/components/product/ProductCard.tsx`
   - `src/components/product/HorizontalProductCard.tsx`
   - `src/components/product/ProductListItem.tsx`
   - `src/components/product/ProductImageGallery.tsx`
   - `src/components/product/ProductSlider.tsx`
   - `src/components/cart/CartItem.tsx`
   - `src/components/checkout/CheckoutSummary.tsx`
   - `src/components/layout/Header.tsx`
   - `src/components/layout/SimpleHeader.tsx`
   - `src/components/order/OrderDetailModal.tsx`
   - `src/app/campaigns/page.tsx`
   - `src/app/campaigns/[slug]/page.tsx`
   - `src/app/mypage/orders/page.tsx`

2. **画像読み込み戦略の設定**

   **ファーストビュー画像（priority属性）**:
   - メインバナー最初の画像
   - 商品詳細ページのメイン画像
   - ヘッダーロゴ

   **その他の画像（loading="lazy"）**:
   - 商品一覧の画像
   - スライダー内の画像
   - カート内の商品画像

3. **画像サイズの最適化**
   - `sizes`属性でレスポンシブ対応
   - 適切な`width`と`height`を設定

#### 実装パターン

```typescript
// ❌ Before
<img src={product.imageUrl} alt={product.name} />

// ✅ After - ファーストビュー
import Image from 'next/image';
<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ✅ After - その他
<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### テスト項目
- [ ] 全ての画像が正しく表示される
- [ ] レスポンシブで適切なサイズの画像が読み込まれる
- [ ] Lighthouse LCPスコアが改善されている

#### 期待効果
- **LCP**: 1.2s → 0.7-0.9s（**40-60%改善**）
- **画像帯域幅**: 50-60%削減
- **Lighthouse Performance**: +15-20点

---

### Phase 2: Swiperライブラリの最適化

**目標**: First Load JS 20-30 kB削減

**スケジュール**: 3-4時間
**影響度**: ★★★★☆
**難易度**: ★★★☆☆

#### 実装内容

1. **Swiperの動的インポート（Code Splitting）**

   **対象ファイル**:
   - `src/components/common/MainBanner.tsx`
   - `src/components/home/ProductSlider.tsx`
   - `src/components/product/ProductSlider.tsx`

2. **MainBannerの軽量化**

   **アプローチ**:
   - オプションA: CSS Scroll Snapによる実装（Swiper不使用）
   - オプションB: Swiperの動的インポート

3. **ProductSliderの条件付き読み込み**
   - 商品数が少ない場合（3個以下）はSwiper不使用
   - グリッド表示で代替

#### 実装パターン

```typescript
// ❌ Before
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function ProductSlider({ products }) {
  return <Swiper>...</Swiper>
}

// ✅ After - 動的インポート
'use client';
import dynamic from 'next/dynamic';

const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), {
  ssr: false
});

// CSS も動的インポート
import('swiper/css');
import('swiper/css/navigation');

export default function ProductSlider({ products }) {
  return <Swiper>...</Swiper>
}

// ✅ Alternative - CSS Scroll Snap（MainBanner用）
export default function MainBanner({ banners }) {
  return (
    <div className="overflow-x-scroll snap-x snap-mandatory">
      {banners.map(banner => (
        <div key={banner.id} className="snap-center">
          <Image src={banner.imageUrl} ... />
        </div>
      ))}
    </div>
  );
}
```

#### テスト項目
- [ ] スライダーが正常に動作する
- [ ] 動的インポートで初期バンドルから除外されている
- [ ] モバイルでスクロールが快適

#### 期待効果
- **Shared JS**: 102 kB → 75-80 kB（**20-25%削減**）
- **初期ロード時間**: 15-20%改善
- **TTI (Time to Interactive)**: 改善

---

### Phase 3: クライアントコンポーネントの最適化

**目標**: バンドルサイズ 10-15%削減

**スケジュール**: 4-5時間
**影響度**: ★★★☆☆
**難易度**: ★★★★☆

#### 実装内容

1. **サーバーコンポーネント化**

   **候補コンポーネント**:
   - 静的なページコンポーネント（状態を持たない）
   - レイアウトコンポーネントの一部
   - 商品表示系コンポーネント

2. **Client Componentの分割**

   **アプローチ**:
   - 大きなコンポーネントを分割
   - インタラクティブな部分のみClient Component化
   - Server ComponentとClient Componentの境界を最適化

3. **状態管理の見直し**
   - 不要なZustandストアの使用を減らす
   - propsによるデータ受け渡しを優先

#### 実装パターン

```typescript
// ❌ Before - 全体がClient Component
'use client';
export default function ProductPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <StaticContent />
      <InteractiveButton count={count} setCount={setCount} />
    </div>
  );
}

// ✅ After - 分割
// ProductPage.tsx (Server Component)
import InteractiveSection from './InteractiveSection';

export default function ProductPage() {
  return (
    <div>
      <StaticContent />
      <InteractiveSection />
    </div>
  );
}

// InteractiveSection.tsx (Client Component)
'use client';
export default function InteractiveSection() {
  const [count, setCount] = useState(0);
  return <InteractiveButton count={count} setCount={setCount} />;
}
```

#### テスト項目
- [ ] 全ての機能が正常に動作する
- [ ] ハイドレーションエラーが発生しない
- [ ] 状態管理が正しく機能する

#### 期待効果
- **JavaScript実行時間**: 10-15%削減
- **TTI**: 改善
- **バンドルサイズ**: 5-10%削減

---

### Phase 4: その他の最適化

**目標**: 総合的なパフォーマンス改善

**スケジュール**: 3-4時間
**影響度**: ★★☆☆☆
**難易度**: ★★★☆☆

#### 実装内容

1. **Bundle Analyzerで詳細分析**

   ```bash
   npm install -D @next/bundle-analyzer
   ```

   **next.config.ts**:
   ```typescript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   module.exports = withBundleAnalyzer({
     // existing config
   });
   ```

   **実行**:
   ```bash
   ANALYZE=true npm run build
   ```

2. **不要な依存関係の削除**
   - 未使用のパッケージを削除
   - Tree Shakingの最適化

3. **フォントの最適化**
   - `next/font`での最適化（既に実装済みか確認）
   - フォントファイルの最小化

4. **Middlewareの軽量化**
   - 現在33.7 kBと大きい
   - 不要な処理の削除

#### テスト項目
- [ ] Bundle Analyzerで大きな依存関係を特定
- [ ] 未使用の依存関係を削除
- [ ] ビルドサイズが削減されている

#### 期待効果
- **総合的な改善**: 5-10%
- **Middleware**: 33.7 kB → 25-30 kB

---

## 🚀 実装スケジュール

### 推奨実施順序

CLAUDE.mdの開発ルールに従い、以下の順序で実施：

1. **Phase 1: 画像最適化**（2-3時間）
   - 即効性が最も高い
   - LCP改善に直結
   - **最優先で実施**

2. **Phase 2: Swiper最適化**（3-4時間）
   - 影響度が大きい
   - Phase 1完了後に実施

3. **Phase 3: クライアントコンポーネント最適化**（4-5時間）
   - 必要に応じて実施
   - Phase 1, 2で目標達成した場合はスキップ可

4. **Phase 4: その他の最適化**（3-4時間）
   - 長期的な改善
   - Phase 1, 2, 3完了後に実施

### 各フェーズ後の検証

**必須作業**:
- Lighthouseスコア計測
- ビルドサイズ確認
- 主要ページの動作確認

**目標値**:
- Lighthouse Performance: 90+点
- LCP: 1.2s以下
- First Load JS: 120 kB以下

---

## 📐 開発ルール遵守事項

### CLAUDE.md準拠

1. **Planning Phase でのLighthouse監査**
   - Phase 1実施前にベースライン計測

2. **Testing Phase でのLighthouse監査**
   - 各Phase完了後に計測
   - 目標値達成を確認

3. **TDD実践**
   - 画像コンポーネント置き換え前にテスト作成
   - リグレッション防止

4. **ドキュメント作成**
   - このドキュメントを`/docs/plans/`に保存
   - 各Phase完了後に結果を記録

5. **ブランチ開発**
   - ブランチ名: `refactor/performance-optimization`
   - Phase ごとにコミット

6. **コミットメッセージ**
   - 形式: `refactor: [Phase番号] 実装内容の説明`
   - 例: `refactor: Phase1 全画像をnext/image <Image />に置き換え`

---

## 📊 効果測定

### 測定項目

1. **Lighthouse スコア**
   - Performance
   - Accessibility
   - Best Practices
   - SEO

2. **Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

3. **バンドルサイズ**
   - First Load JS
   - Shared JS chunks
   - ページごとのサイズ

4. **ロード時間**
   - TTFB (Time to First Byte)
   - FCP (First Contentful Paint)
   - TTI (Time to Interactive)

### 測定方法

```bash
# ビルド
npm run build

# 本番サーバー起動
npm start

# Lighthouseスコア計測（Chrome DevTools）
# 1. http://localhost:3000 を開く
# 2. DevTools > Lighthouse > Analyze page load
# 3. 主要ページで計測:
#    - / (ホーム)
#    - /products (商品一覧)
#    - /products/[id] (商品詳細)
#    - /cart (カート)
```

---

## ✅ Phase完了チェックリスト

### Phase 1: 画像最適化
- [ ] 全15+箇所の`<img>`を`<Image />`に置き換え
- [ ] ファーストビュー画像に`priority`属性設定
- [ ] その他の画像に`loading="lazy"`設定
- [ ] `sizes`属性で適切なレスポンシブ対応
- [ ] Lighthouseスコア計測
- [ ] LCP目標値達成確認（0.7-0.9s）
- [ ] ビルドサイズ確認
- [ ] 全ページの画像表示確認

### Phase 2: Swiper最適化
- [ ] Swiperを動的インポートに変更
- [ ] MainBannerの実装方法決定（動的インポート or CSS Scroll Snap）
- [ ] ProductSliderの条件付き読み込み実装
- [ ] Lighthouseスコア計測
- [ ] Shared JS目標値達成確認（75-80 kB）
- [ ] スライダー動作確認
- [ ] モバイルでのスクロール確認

### Phase 3: クライアントコンポーネント最適化
- [ ] サーバーコンポーネント化可能なコンポーネント特定
- [ ] 大きなコンポーネントの分割
- [ ] ハイドレーションエラーの確認
- [ ] 状態管理の動作確認
- [ ] Lighthouseスコア計測
- [ ] バンドルサイズ削減確認

### Phase 4: その他の最適化
- [ ] Bundle Analyzerインストール
- [ ] バンドル分析実施
- [ ] 未使用依存関係の削除
- [ ] Middleware軽量化
- [ ] 最終Lighthouseスコア計測
- [ ] 全目標値達成確認

---

## 🎯 成功基準

### 必達目標（Phase 1, 2完了時点）

✅ **Lighthouse Performance: 90+点**
✅ **LCP: 1.2s以下**
✅ **First Load JS: 120 kB以下**

### 理想目標（全Phase完了時点）

🎖️ **Lighthouse Performance: 95+点**
🎖️ **LCP: 0.9s以下**
🎖️ **First Load JS: 100 kB以下**
🎖️ **Shared JS: 70 kB以下**

---

## 📝 備考

### リスク管理

1. **画像置き換えのリスク**
   - レイアウト崩れの可能性
   - 対策: 各ページで動作確認

2. **Swiper動的インポートのリスク**
   - SSRとの互換性
   - 対策: `ssr: false`オプション使用

3. **クライアントコンポーネント化のリスク**
   - ハイドレーションエラー
   - 対策: 段階的に実施、テスト徹底

### 参考資料

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Dynamic Import](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web.dev - LCP Optimization](https://web.dev/lcp/)

---

**最終更新**: 2025年11月19日
**ステータス**: 計画段階 - ユーザー承認待ち
