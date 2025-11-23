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

## 結果ページ仕様

### ページ情報

- **URL**: `/mypage/eco-report/result`
- **アクセス**: 認証必須（TOC/Wholesale ユーザー）
- **パラメータ**: `?targetCode=xxx&closingDay=20&aggregationType=amount`

### UI仕様

#### ページタイトル
- テキスト: 「環境配慮商品購入レポート」
- スタイル: `text-3xl font-medium border-b-2 border-black`

#### 注意事項
```
※環境配慮商品情報は随時更新情報に基づきます。
※「総購入額」は環境配慮商品以外も含む全ての購入額です。
※「環境配慮商品合計」欄は、「エコマーク商品」「グリーン購入方適合商品」「GPNエコ商品ねっと掲載商品」のいずれかに該当する商品の合計金額・構成比となります。
```

#### 対象情報セクション
| 左側 | 右側 |
|------|------|
| `{対象コード}` 様 | 集計締日：**20**（赤字） 集計項目：税抜金額（円単位） |

#### データテーブル

##### テーブル構造（2分割）
- **上段テーブル**: 6ヶ月分（例: 2024/12 〜 2025/05）
- **下段テーブル**: 6ヶ月分 + 合計列（例: 2025/06 〜 2025/11 + 合計）

##### 行構成
| 行 | アイコン | 表示形式 |
|----|---------|---------|
| 総購入額 | なし | 金額のみ |
| エコマーク商品 | 緑バッジ（SVG） | 金額 + (構成比%) |
| グリーン購入法適合商品 | 緑バッジ（SVG） | 金額 + (構成比%) |
| GPNエコ商品ねっと掲載商品 | バッジ（SVG） | 金額 + (構成比%) |
| 環境配慮商品合計 | バッジ（SVG） | 金額 + (構成比%) |

##### ヘッダー行
- 1行目: 年月（例: 2024/12）- グレー背景
- 2行目: 期間範囲（例: 2024/11/21 ▼ 2024/12/20）

#### ボタン
- 「戻る」: `variant="secondary"`（グレー）
- 「印刷」: `variant="primary"`（オレンジ）

### 型定義

```typescript
interface EcoReportMonthData {
  month: string;              // "2024/12"
  startDate: string;          // "2024/11/21"
  endDate: string;            // "2024/12/20"
  totalPurchase: number;
  ecoMark: number;
  ecoMarkRatio: number;
  greenPurchase: number;
  greenPurchaseRatio: number;
  gpnEco: number;
  gpnEcoRatio: number;
  ecoTotal: number;
  ecoTotalRatio: number;
}

interface EcoReportResultData {
  targetCode: string;
  targetName: string;
  closingDay: number;
  aggregationType: AggregationType;
  aggregationLabel: string;
  monthlyData: EcoReportMonthData[];
  total: EcoReportTotalData;
}
```

### コンポーネント構成

- `EcoReportResult` - 結果表示コンポーネント（Organism）
- `EcoCategoryBadge` - カテゴリバッジ（SVGアイコン）（Atom）

### ファイル構成（追加分）

```
src/
├── app/
│   └── mypage/
│       └── eco-report/
│           └── result/
│               └── page.tsx      # 結果ページ
├── components/
│   └── eco-report/
│       ├── EcoReportResult.tsx   # 結果表示コンポーネント
│       ├── EcoCategoryBadge.tsx  # カテゴリバッジ
│       └── __tests__/
│           └── EcoReportResult.test.tsx
└── types/
    └── eco-report.ts             # 型定義追加
```

## デザイントークン

- プライマリカラー: `#2d2626`
- アクセントカラー: `#d4a017`（オレンジボタン）
- セクションヘッダー縦線: `#2d2626`
- カテゴリバッジ色:
  - エコマーク: `#4CAF50`
  - グリーン購入法: `#8BC34A`
  - GPNエコ: `#607D8B`
  - 環境配慮商品合計: `#FF9800`
