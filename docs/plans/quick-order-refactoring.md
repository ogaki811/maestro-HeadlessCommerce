# クイックオーダーページ リファクタリング計画

**作成日**: 2025-11-06
**担当**: Claude Code
**ステータス**: 承認済み・実装開始

---

## 📋 概要

クイックオーダーページを開発ルールに準拠するようリファクタリングする。

### 主な目的

1. styled-jsx（CSS-in-JS）を完全に削除し、Tailwind CSSに置き換え
2. Atomic Design原則に完全準拠したコンポーネント構造に再構築
3. TDD（テスト駆動開発）に従った実装
4. ビジネスロジックとプレゼンテーション層の適切な分離

---

## 📊 現状分析

### ファイル構成

```
src/
├── app/quick-order/page.tsx (229行 - 88行のCSS含む)
└── components/
    ├── quick-order/
    │   └── QuickOrderLineForm.tsx (381行 - 180行のCSS含む)
    └── common/
        ├── ProductCodeInput.tsx (199行 - 88行のCSS含む)
        └── ProductPreview.tsx (287行 - 多数のCSS含む)
```

### 問題点

| 問題 | 現状 | 影響 |
|------|------|------|
| カスタムCSS | 約556行 | 開発ルール違反（Tailwind優先） |
| API呼び出し | ページに直接記述 | 保守性低下 |
| confirm()使用 | ブラウザダイアログ | UX不良 |
| テスト | 0% | 品質リスク |
| Atomic Design | 不徹底 | 再利用性低下 |

---

## 🎯 リファクタリング目標

| 項目 | 現在 | 目標 |
|-----|------|------|
| カスタムCSS行数 | 556行 | 0行 |
| Tailwind使用率 | 0% | 100% |
| コンポーネント数 | 4個 | 11個 |
| テストカバレッジ | 0% | 80%以上 |
| ファイル最大行数 | 381行 | 150行以下 |
| Atomic Design準拠 | 不十分 | 完全準拠 |

---

## 🏗️ 新しいコンポーネント構造

### Atomic Design階層

#### Atoms（既存を使用）
- `Button`
- `Input`
- `NumberInput`

#### Molecules（新規作成）
1. **QuickOrderInputRow**
   - 商品コード入力 + 数量入力 + 追加ボタン
   - 責務: ユーザー入力の受付

2. **QuickOrderProductItem**
   - 追加済み商品1行の表示
   - 責務: 商品情報の表示と削除

3. **QuickOrderSummary**
   - 合計金額表示 + カート追加ボタン
   - 責務: サマリー情報と最終アクション

4. **QuickOrderHelpSection**
   - 使い方ガイド
   - 責務: ユーザーガイダンス

#### Organisms（リファクタリング）
1. **QuickOrderForm**
   - フォーム全体の統合
   - 責務: フォーム状態管理

2. **QuickOrderProductList**
   - 追加済み商品リスト
   - 責務: 商品リストの表示

#### 既存コンポーネントのリファクタリング
- `ProductCodeInput` - Tailwind化
- `ProductPreview` - Tailwind化

---

## 📁 最終的なファイル構成

```
src/
├── app/quick-order/
│   └── page.tsx                              (~80行)
├── components/
│   ├── quick-order/
│   │   ├── QuickOrderForm.tsx                (~120行)
│   │   ├── QuickOrderInputRow.tsx            (~60行)
│   │   ├── QuickOrderProductItem.tsx         (~80行)
│   │   ├── QuickOrderProductList.tsx         (~70行)
│   │   ├── QuickOrderSummary.tsx             (~50行)
│   │   ├── QuickOrderHelpSection.tsx         (~60行)
│   │   ├── __tests__/
│   │   │   ├── QuickOrderForm.test.tsx
│   │   │   ├── QuickOrderInputRow.test.tsx
│   │   │   ├── QuickOrderProductItem.test.tsx
│   │   │   ├── QuickOrderProductList.test.tsx
│   │   │   ├── QuickOrderSummary.test.tsx
│   │   │   └── QuickOrderHelpSection.test.tsx
│   │   └── index.ts
│   └── common/
│       ├── ProductCodeInput.tsx              (~80行, Tailwind)
│       ├── ProductPreview.tsx                (~150行, Tailwind)
│       └── __tests__/
│           ├── ProductCodeInput.test.tsx
│           └── ProductPreview.test.tsx
├── hooks/
│   ├── useQuickOrder.ts                      (~60行)
│   └── __tests__/
│       └── useQuickOrder.test.tsx
└── lib/
    └── api-client.ts                         (addToCartBatch追加)
```

---

## 🔄 実装順序（TDD）

### Phase 1: 準備
- [x] リファクタリング計画作成
- [ ] 新しいブランチ作成: `refactor/quick-order-tailwind-atomic-design`

### Phase 2: Molecules（小さいコンポーネントから）
1. [ ] QuickOrderHelpSection
   - [ ] テスト作成
   - [ ] 実装
   - [ ] テスト実行

2. [ ] QuickOrderInputRow
   - [ ] テスト作成
   - [ ] 実装
   - [ ] テスト実行

3. [ ] QuickOrderProductItem
   - [ ] テスト作成
   - [ ] 実装
   - [ ] テスト実行

4. [ ] QuickOrderSummary
   - [ ] テスト作成
   - [ ] 実装
   - [ ] テスト実行

### Phase 3: Organisms（複雑なコンポーネント）
1. [ ] QuickOrderProductList
   - [ ] テスト作成
   - [ ] 実装
   - [ ] テスト実行

2. [ ] QuickOrderForm
   - [ ] テスト作成
   - [ ] 実装（リファクタリング）
   - [ ] テスト実行

### Phase 4: 既存コンポーネントのリファクタリング
1. [ ] ProductCodeInput
   - [ ] テスト確認
   - [ ] styled-jsx削除、Tailwind化
   - [ ] テスト実行

2. [ ] ProductPreview
   - [ ] テスト確認
   - [ ] styled-jsx削除、Tailwind化
   - [ ] テスト実行

### Phase 5: Hooks & API
1. [ ] useQuickOrder
   - [ ] テスト作成
   - [ ] 実装
   - [ ] テスト実行

2. [ ] api-client.ts
   - [ ] addToCartBatch追加
   - [ ] テスト実行

### Phase 6: Page
1. [ ] quick-order/page.tsx
   - [ ] リファクタリング
   - [ ] styled-jsx削除、Tailwind化
   - [ ] テスト実行

### Phase 7: 最終確認
- [ ] 全ユニットテスト実行
- [ ] E2Eテスト作成・実行
- [ ] ビルド確認
- [ ] 開発サーバーで動作確認

### Phase 8: コミット
- [ ] コミット作成
- [ ] プッシュ

---

## 🎨 Tailwind CSS変換例

### ページレイアウト

| 現在（styled-jsx） | Tailwind CSS |
|-------------------|--------------|
| `.quick-order-page` | `min-h-screen bg-white py-8` |
| `.container` | `max-w-7xl mx-auto px-4` |
| `.page-header` | `mb-8 pb-6 border-b-2 border-gray-200` |
| `.page-title` | `text-3xl font-bold text-gray-900 mb-2` |
| `.page-description` | `text-base text-gray-600` |

### フォームコンポーネント

| 現在（styled-jsx） | Tailwind CSS |
|-------------------|--------------|
| `.input-row` | `flex gap-4 items-end` |
| `.add-button` | `px-6 py-2.5 h-[2.625rem] bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400` |
| `.section-title` | `mb-4 text-xl font-semibold text-gray-900` |

### 商品リスト

| 現在（styled-jsx） | Tailwind CSS |
|-------------------|--------------|
| `.added-products-section` | `p-6 bg-gray-50 border border-gray-200 rounded-xl` |
| `.product-item` | `flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg` |
| `.product-item__image` | `w-15 h-15 object-cover rounded-md border border-gray-200` |

### ヘルプセクション

| 現在（styled-jsx） | Tailwind CSS |
|-------------------|--------------|
| `.help-section` | `p-6 bg-blue-50 border border-blue-200 rounded-xl` |
| `.help-title` | `mb-4 text-lg font-semibold text-blue-900` |
| `.help-note` | `p-3 bg-white border-l-4 border-blue-500 rounded text-sm text-gray-700` |

---

## ✅ 完了条件

- [ ] カスタムCSS 0行（styled-jsx完全削除）
- [ ] Tailwind CSS 100%使用
- [ ] 全コンポーネントがAtomic Design原則に準拠
- [ ] テストカバレッジ 80%以上
- [ ] 全テストが通過
- [ ] TypeScriptエラー 0件
- [ ] ビルド成功
- [ ] E2Eテスト成功
- [ ] 開発サーバーで正常動作

---

## 📝 備考

### 参考ドキュメント
- CLAUDE.md - 開発ルール
- Tailwind CSS公式ドキュメント
- Atomic Design原則

### 注意事項
- 既存の機能を損なわないこと
- すべての変更にテストを追加すること
- コミットメッセージは日本語で詳細に記述すること
