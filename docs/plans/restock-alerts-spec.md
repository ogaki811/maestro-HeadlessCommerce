# 販売再開メール一覧 - 仕様書

## 概要

在庫切れ商品の販売再開通知を受け取る設定をした商品の一覧表示・設定解除機能。

## ページ情報

- **URL**: `/mypage/restock-alerts`
- **アクセス**: 認証必須
- **メニュー**: マイページサイドバー「販売再開メール一覧」

## UI仕様

### ページタイトル
- テキスト: 「販売再開メール一覧」
- スタイル: `text-3xl font-medium text-gray-900 pb-2 border-b-2 border-black`

### 件数表示
- フォーマット: 「{件数}件あります。」
- 件数部分: `text-red-500 font-bold`

### テーブル

#### カラム構成
| カラム | 幅 | 内容 |
|--------|-----|------|
| 商品コード | 120px | 商品コード（テキスト） |
| 商品名 | flex | 商品名（リンク → 商品詳細ページ） |
| 操作 | 100px | 解除ボタン |

#### スタイル
- ヘッダー: `bg-gray-100 text-center`
- 商品名リンク: `text-blue-600 hover:underline`
- 解除ボタン: `variant="secondary"`（グレー）

### 空状態
- 登録がない場合はメッセージを表示
- 「販売再開メールの登録がありません。」

## 型定義

```typescript
interface RestockAlert {
  id: string;
  productId: string;      // 商品ID（詳細ページ遷移用）
  productCode: string;    // 商品コード（表示用）
  productName: string;    // 商品名
  createdAt: string;      // 登録日時
}

interface RestockAlertsResponse {
  success: boolean;
  data: RestockAlert[];
  total: number;
  error?: string;
}
```

## API仕様

### 一覧取得
```
GET /api/restock-alerts
```

**レスポンス:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "productId": "704321",
      "productCode": "704321",
      "productName": "ワイヤレスアンプ ATW-SP1920",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 5
}
```

### 解除
```
DELETE /api/restock-alerts/[id]
```

**レスポンス:**
```json
{
  "success": true,
  "message": "販売再開メールの登録を解除しました。"
}
```

## コンポーネント構成

### Atomic Design
- **RestockAlertList** (Organism): 一覧テーブル
- **Button** (既存Atom): 解除ボタン

### ファイル構成
```
src/
├── app/
│   ├── mypage/
│   │   └── restock-alerts/
│   │       └── page.tsx          # ページ更新
│   └── api/
│       └── restock-alerts/
│           ├── route.ts          # 一覧取得API
│           └── [id]/
│               └── route.ts      # 解除API
├── components/
│   └── restock-alert/
│       ├── RestockAlertList.tsx  # 一覧コンポーネント
│       ├── __tests__/
│       │   └── RestockAlertList.test.tsx
│       └── index.ts
└── types/
    └── restock-alert.ts          # 型定義
```

## テストケース

1. 一覧が正しく表示される
2. 件数が正しく表示される
3. 商品名がリンクになっている（/products/{id}へ遷移）
4. 解除ボタンがクリックできる
5. 解除後に一覧から削除される
6. データがない場合は空状態が表示される
7. ローディング状態が表示される
8. エラー時にエラーメッセージが表示される

## デザイントークン

- プライマリカラー: `#2d2626`
- 件数カラー: `text-red-500`
- リンクカラー: `text-blue-600`
- テーブルヘッダー: `bg-gray-100`
