# 環境配慮商品購入レポート作成 - 仕様書

## 概要

過去一年分の環境配慮商品購入レポートを作成・ダウンロードする機能。

## ページ情報

- **URL**: `/mypage/eco-report`
- **アクセス**: 認証必須（TOC/Wholesale ユーザー）
- **レイアウト**: MyPageSidebar + メインコンテンツ（4カラムグリッド）

## UI仕様

### ページタイトル
- テキスト: 「環境配慮商品購入レポート作成」
- スタイル: 下線付き（オレンジのグラデーション線）

### 作成対象セクション

#### セクションヘッダー
- 縦線アクセント（#2d2626）+ 「作成対象」テキスト

#### 説明文
```
※過去一年分の環境配慮商品購入レポートを作成します。
※作成対象を選択し、「レポート作成」ボタンをクリックしてください。
※レポート作成には多少時間が掛かる場合があります。
```

#### フォームフィールド

| フィールド | タイプ | 説明 |
|-----------|--------|------|
| 対象コード | Select | ユーザー/会社コード選択 |
| 集計方式 | Select | 「金額ベース」「数量ベース」など |
| 集計締日 | Select | 1〜31日から選択（デフォルト: 20日） |

### ボタン
- テキスト: 「レポート作成」
- スタイル: オレンジ背景（#d4a017）、白文字
- サイズ: 幅広め（min-width: 200px程度）

## フォームオプション

### 集計方式オプション
```typescript
const AGGREGATION_TYPE_OPTIONS = [
  { value: 'amount', label: '金額ベース' },
  { value: 'quantity', label: '数量ベース' },
];
```

### 集計締日オプション
```typescript
// 1〜31日
const CLOSING_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));
```

## API仕様

### エンドポイント
```
POST /api/eco-report/generate
```

### リクエストボディ
```typescript
interface EcoReportRequest {
  targetCode: string;        // 対象コード
  aggregationType: 'amount' | 'quantity';  // 集計方式
  closingDay: number;        // 集計締日（1-31）
}
```

### レスポンス
- 成功時: PDF/Excelファイルをダウンロード
- エラー時: エラーメッセージ

### エラーケース
- 認証エラー: 401
- 権限エラー: 403
- データなし: 404
- サーバーエラー: 500

## コンポーネント構成

### 再利用コンポーネント
- `MyPageSidebar` - サイドバー
- `Header` / `Footer` - レイアウト
- `Breadcrumb` - パンくず
- `Button` - ボタン
- `Select` - セレクトボックス

### 新規コンポーネント
- `EcoReportForm` - レポート作成フォーム（Organism）

## ファイル構成

```
src/
├── app/
│   ├── mypage/
│   │   └── eco-report/
│   │       └── page.tsx          # ページ更新
│   └── api/
│       └── eco-report/
│           └── generate/
│               └── route.ts      # APIエンドポイント
├── components/
│   └── eco-report/
│       ├── EcoReportForm.tsx     # フォームコンポーネント
│       ├── __tests__/
│       │   └── EcoReportForm.test.tsx
│       └── index.ts
└── types/
    └── eco-report.ts             # 型定義
```

## 実装手順

1. 型定義の作成（`src/types/eco-report.ts`）
2. フォームコンポーネントの作成（`EcoReportForm`）
3. ページの更新（既存ページを機能実装）
4. APIエンドポイントの作成
5. テストの作成

## デザイントークン

- プライマリカラー: `#2d2626`
- アクセントカラー: `#d4a017`（オレンジボタン）
- セクションヘッダー縦線: `#2d2626`
