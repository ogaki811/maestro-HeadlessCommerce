# 検索窓カテゴリフィルター機能実装計画

## 要件

1. **ヘッダー検索窓にカテゴリプルダウン追加**
   - 検索窓の先頭に「カテゴリ」プルダウンを配置
   - カテゴリは大中小の3階層構造

2. **カテゴリ選択時の動作**
   - カテゴリ選択時: そのカテゴリの商品一覧を表示
   - キーワード入力時: カテゴリ内で絞り込み検索

3. **カテゴリ階層設計**
   - 大カテゴリ: 文具・事務用品、家具、電化製品、収納用品 など
   - 中カテゴリ: 筆記用具、ノート類、デスク、チェア など
   - 小カテゴリ: ボールペン、シャープペンシル、メモ帳、ノート など

## 現在の実装

### 既存コンポーネント
- `SearchBar.tsx` (Molecule): シンプルな検索バー
- `SearchFilters.tsx` (Organism): サイドバーのフィルター
- `Header.tsx` (Organism): ヘッダーに検索窓あり

### 既存データ構造
```typescript
// 現在はシンプルな文字列型
export type Category = '文具・事務用品' | '家具' | '電化製品' | '収納用品';
```

## 設計方針

### 1. カテゴリ階層データ構造

```typescript
// 新しいカテゴリ階層構造
export interface CategoryHierarchy {
  id: string;
  name: string;
  slug: string;
  level: 'large' | 'medium' | 'small';
  parentId?: string;
  children?: CategoryHierarchy[];
}
```

### 2. 新規コンポーネント

#### CategorySelector (Molecule)
- ヘッダー検索窓用のカテゴリプルダウン
- 大中小の階層を選択可能
- TailwindCSS + Headless UI の Listbox使用

#### 配置イメージ
```
[カテゴリ▼] [🔍 商品名やメーカー、品番から探す              ] [検索]
```

### 3. コンポーネント階層

```
Header (Organism)
├─ CategorySelector (Molecule)  <- NEW
│  └─ カテゴリプルダウン
└─ 検索入力フィールド
```

## 実装手順（TDD）

### Phase 1: カテゴリデータ構造とConfig

1. **カテゴリ階層型定義**
   - `src/types/category.ts` 作成
   - CategoryHierarchy型定義

2. **カテゴリマスターデータ**
   - `src/config/categoriesConfig.ts` 作成
   - 大中小カテゴリの階層データ
   - ヘルパー関数（getCategoriesByLevel, getCategoryById など）

3. **テスト**
   - `src/config/__tests__/categoriesConfig.test.ts`
   - カテゴリ取得ロジックのテスト

### Phase 2: CategorySelectorコンポーネント（TDD）

1. **テストファイル作成（Red）**
   - `src/components/search/__tests__/CategorySelector.test.tsx`
   - レンダリング、選択動作、階層表示のテスト

2. **コンポーネント実装（Green）**
   - `src/components/search/CategorySelector.tsx`
   - プルダウン表示
   - 大カテゴリ → 中カテゴリ → 小カテゴリの選択
   - 選択状態の管理

3. **リファクタリング（Refactor）**
   - コードの整理
   - Tailwind CSS最適化

### Phase 3: Headerコンポーネント統合

1. **Header.tsxの更新**
   - CategorySelectorを検索窓に追加
   - カテゴリ選択状態の管理（useState）
   - 検索時にカテゴリパラメータを含める

2. **検索ロジック更新**
   - `/search?q=[keyword]&category=[categoryId]`
   - カテゴリ別フィルタリング

3. **テスト**
   - Header統合テスト
   - カテゴリ + キーワード検索のE2Eテスト

## 技術スタック

- **UI**: Tailwind CSS
- **ドロップダウン**: Headless UI Listbox または custom implementation
- **状態管理**: useState (ローカル状態)
- **テスト**: Jest + React Testing Library
- **Atomic Design**: CategorySelector (Molecule)

## データサンプル

```typescript
export const categories: CategoryHierarchy[] = [
  {
    id: 'stationery',
    name: '文具・事務用品',
    slug: 'stationery',
    level: 'large',
    children: [
      {
        id: 'writing-instruments',
        name: '筆記用具',
        slug: 'writing-instruments',
        level: 'medium',
        parentId: 'stationery',
        children: [
          {
            id: 'ballpoint-pens',
            name: 'ボールペン',
            slug: 'ballpoint-pens',
            level: 'small',
            parentId: 'writing-instruments',
          },
          {
            id: 'mechanical-pencils',
            name: 'シャープペンシル',
            slug: 'mechanical-pencils',
            level: 'small',
            parentId: 'writing-instruments',
          },
        ],
      },
      {
        id: 'notebooks',
        name: 'ノート類',
        slug: 'notebooks',
        level: 'medium',
        parentId: 'stationery',
        children: [
          {
            id: 'memo-pads',
            name: 'メモ帳',
            slug: 'memo-pads',
            level: 'small',
            parentId: 'notebooks',
          },
          {
            id: 'notebooks-a4',
            name: 'ノート（A4）',
            slug: 'notebooks-a4',
            level: 'small',
            parentId: 'notebooks',
          },
        ],
      },
    ],
  },
  // 他のカテゴリ...
];
```

## チェックリスト

### Phase 1: データ構造
- [ ] `src/types/category.ts` 作成
- [ ] `src/config/categoriesConfig.ts` 作成
- [ ] カテゴリヘルパー関数実装
- [ ] テスト作成・実行

### Phase 2: CategorySelector
- [ ] テストファイル作成（Red）
- [ ] コンポーネント実装（Green）
- [ ] リファクタリング（Refactor）
- [ ] テスト成功確認

### Phase 3: Header統合
- [ ] Header.tsx更新
- [ ] 検索ロジック更新
- [ ] 統合テスト
- [ ] E2Eテスト

### Phase 4: コミット・マージ
- [ ] コミットメッセージ作成（開発ルール準拠）
- [ ] プルリクエスト作成
- [ ] マージ

## 注意事項

- **既存機能への影響を最小化**: 既存の検索機能は維持
- **レスポンシブ対応**: モバイルでも使いやすいUI
- **アクセシビリティ**: キーボード操作対応
- **パフォーマンス**: カテゴリデータのメモ化
