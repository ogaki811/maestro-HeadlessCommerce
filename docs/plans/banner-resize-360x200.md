# メインバナーサイズ変更 実装計画

## 概要

トップページのメインバナー（MainBanner）のサイズを変更する

- **変更前**: 900px × 280px
- **変更後**: 360px × 200px

## 目的

ユーザーからの要望により、メインバナーのサイズを360×200に変更

## 対象コンポーネント

- **コンポーネント名**: MainBanner (Molecule)
- **ファイル**:
  - `src/components/common/MainBanner.tsx`
  - `src/components/common/MainBanner.css`
- **使用箇所**: `src/app/page.tsx` (トップページ)

## 変更内容

### 1. MainBanner.tsx

**変更箇所**: Line 150

```typescript
// 変更前
style={{ width: '900px', height: '280px', objectFit: 'contain', display: 'block' }}

// 変更後
style={{ width: '360px', height: '200px', objectFit: 'contain', display: 'block' }}
```

### 2. MainBanner.css

**変更箇所 1**: Line 3 - スライダー全体の高さ

```css
/* 変更前 */
height: 280px;

/* 変更後 */
height: 200px;
```

**変更箇所 2**: Line 12-13 - 各スライドのサイズ

```css
/* 変更前 */
height: 280px;
width: 900px !important;

/* 変更後 */
height: 200px;
width: 360px !important;
```

**変更箇所 3**: Line 30, 34 - ナビゲーションボタンの位置

```css
/* 変更前 */
.main-banner-slider .swiper-button-prev {
  left: calc(50% - 470px);  /* 900px/2 + 20px */
}
.main-banner-slider .swiper-button-next {
  right: calc(50% - 470px);
}

/* 変更後 */
.main-banner-slider .swiper-button-prev {
  left: calc(50% - 200px);  /* 360px/2 + 20px */
}
.main-banner-slider .swiper-button-next {
  right: calc(50% - 200px);
}
```

## 想定される影響

### 影響あり
- トップページ（`src/app/page.tsx`）のメインバナー表示サイズ
- バナー全体の見た目とレイアウト

### 影響なし
- 他のスライダーコンポーネント（ProductSlider等）
- バナー機能（自動再生、ナビゲーション、ページネーション）

## テスト項目

### 1. 表示確認
- [ ] デスクトップ（1280px以上）での表示
- [ ] タブレット（768px-1023px）での表示
- [ ] モバイル（320px-767px）での表示

### 2. 機能確認
- [ ] スライダー自動再生動作
- [ ] 前へ/次へボタンの動作
- [ ] ページネーションドットの動作
- [ ] バナーリンクのクリック動作

### 3. レスポンシブ確認
- [ ] 画面サイズ変更時のレイアウト崩れチェック
- [ ] 画像のアスペクト比維持確認
- [ ] objectFit: contain の動作確認

### 4. パフォーマンス
- [ ] TypeScriptビルドエラーなし
- [ ] Lighthouse監査（変更前後の比較）

## 注意事項

1. **画像対応**: 現在はSVGプレースホルダーを使用しているため、360×200でも問題なし
2. **CSS優先度**: `!important` が使用されているため、スタイル上書き時は注意
3. **モバイル対応**: @media (max-width: 1023px) でのボタン位置は変更不要（left: 10px, right: 10px）

## 所要時間見積もり

- ドキュメント作成: 10分
- コード変更: 10分
- 動作確認: 10分
- 品質チェック: 10分
- コミット: 10分
- **合計**: 約50分

## 関連ドキュメント

- CLAUDE.md - 開発ルール・Atomic Designガイドライン
- README.md - プロジェクト概要

## ブランチ情報

- **ブランチ名**: `feature/banner-resize-360x200`
- **ベースブランチ**: `main`

## 作成日時

2025年11月13日
