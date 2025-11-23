# マイカタログ機能

## 概要

マイカタログは、企業共通のお気に入り機能として実装されたフォルダ管理型の商品カタログ機能です。
ユーザーは商品をフォルダに登録し、素早く再注文することができます。

## ページ構成

### 1. マイカタログ一覧ページ (`/my-catalog`)

フォルダ一覧を表示するページ。3種類のフォルダをカラムで表示します。

**ファイル**: `src/app/my-catalog/page.tsx`

#### フォルダ種別

| 種別 | 説明 | 共有範囲 |
|------|------|----------|
| 企業共通フォルダ | 全社で共有されるフォルダ | 全社員 |
| 部署共通フォルダ | 所属部署内で共有されるフォルダ | 部署内 |
| マイフォルダ | 個人専用のフォルダ | 本人のみ |

#### 機能

- 商品名・商品コードでの検索
- フォルダ一覧の表示（3カラムレイアウト）
- モバイル対応（横スクロール + ドットインジケーター）
- フォルダ名・順序変更（未実装）
- ダウンロード機能（未実装）

### 2. マイカタログ詳細ページ (`/my-catalog/[folderId]`)

フォルダ内の商品一覧を表示するページ。

**ファイル**: `src/app/my-catalog/[folderId]/page.tsx`

#### 機能

- 商品名・商品コードでの検索
- ソート機能（表示順、メモ順、商品コード順、商品名順）
- 商品選択（個別/全選択）
- 選択商品の一括カート追加
- 個別商品のカート追加
- 数量変更
- メモの編集

## コンポーネント構成

### Organisms（複合コンポーネント）

#### CatalogFolderColumn

フォルダ種別ごとのカラムを表示するコンポーネント。

**ファイル**: `src/components/my-catalog/CatalogFolderColumn.tsx`

**Props**:
```typescript
interface CatalogFolderColumnProps {
  type: 'company' | 'department' | 'personal';
  folders: CatalogFolder[];
}
```

#### CatalogItemCard

フォルダ内の商品カードコンポーネント。

**ファイル**: `src/components/my-catalog/CatalogItemCard.tsx`

**Props**:
```typescript
interface CatalogItemCardProps {
  item: CatalogItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
  onMemoChange?: (id: string, memo: string) => void;
  quantity?: number;
  memo?: string;
}
```

**機能**:
- 商品画像、商品名、商品コード、ブランド名、型番の表示
- 価格表示（定価、販売価格、割引率）
- チェックボックスによる選択
- 数量入力（増減ボタン付き）
- メモ入力欄
- カートに追加ボタン

## データ構造

### CatalogFolder

```typescript
interface CatalogFolder {
  id: string;
  name: string;
  type: 'company' | 'department' | 'personal';
  displayOrder: number;
  itemCount: number;
}
```

### CatalogItem

```typescript
interface CatalogItem {
  id: string;
  folderId: string;
  productId: string;
  productCode: string;
  productName: string;
  brandName: string;
  partNumber: string;
  imageUrl: string;
  standardPrice: number;
  salePrice: number;
  memo: string;
  orderComment: string;
  accountCode: string;
  displayOrder: number;
  stock: number;
}
```

## CSS クラス（BEM命名規則）

| クラス名 | 説明 |
|----------|------|
| `.ec-my-catalog` | 一覧ページのメインコンテナ |
| `.ec-my-catalog__title` | ページタイトル |
| `.ec-my-catalog__notice` | 通知エリア |
| `.ec-my-catalog__actions` | アクションボタンエリア |
| `.ec-my-catalog__search` | 検索ボックス |
| `.ec-my-catalog__buttons` | ボタングループ |
| `.ec-my-catalog__mobile-scroll` | モバイル横スクロールエリア |
| `.ec-my-catalog__folders` | フォルダ一覧（デスクトップ） |
| `.ec-my-catalog__hint` | ヒント表示エリア |
| `.ec-catalog-detail` | 詳細ページのメインコンテナ |
| `.ec-catalog-detail__title` | 詳細ページタイトル |
| `.ec-catalog-detail__toolbar` | ツールバー（検索・ソート） |
| `.ec-catalog-detail__items` | 商品一覧エリア |
| `.ec-catalog-item-card` | 商品カードコンポーネント |

## レスポンシブ対応

### 一覧ページ

- **デスクトップ (lg以上)**: 3カラムグリッド表示
- **モバイル**: 横スクロール + スナップスクロール + ドットインジケーター

### 詳細ページ

- **デスクトップ**: サイドバー + メインコンテンツの2カラム
- **モバイル**: 縦積み1カラム

## テスト

### 単体テスト

- `src/components/my-catalog/__tests__/CatalogItemCard.test.tsx`
- `src/app/my-catalog/__tests__/CatalogFolderDetailPage.test.tsx`

### テスト実行

```bash
# マイカタログ関連テストのみ実行
npm test -- my-catalog

# 全テスト実行
npm test
```

## 今後の実装予定

1. API連携（現在はモックデータを使用）
2. フォルダの作成・編集・削除機能
3. 商品の追加・削除機能
4. 一括カート追加の実装
5. CSVダウンロード機能
6. フォルダ名・順序変更機能
