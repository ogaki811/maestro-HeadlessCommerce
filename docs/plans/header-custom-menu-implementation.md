# ヘッダーカスタムメニュー機能 実装計画

## 概要

ユーザーがヘッダーメニューをカスタマイズできる機能の実装。ドロワーメニュー内で星アイコンをクリックすることで、選択したメニュー項目をヘッダー2段目に表示できる。

**作成日**: 2025-11-07
**ブランチ**: `feature/header-custom-menu`

---

## 機能要件

### 1. カスタムメニュー表示（ヘッダー2段目）
- **配置**: ハンバーガーメニュー（☰ メニュー）の直後
- **デフォルト選択**: 見積り依頼、クイックオーダー、マイカタログ、注文履歴（4項目）
- **ユーザーカスタマイズ**: ドロワーメニューから追加/削除可能
- **永続化**: localStorageに保存（ページリロード後も保持）

### 2. ドロワーメニュー拡張
- **星アイコン追加**: 各メニュー項目の右端に星ボタン配置
- **星の状態**:
  - 選択済み: ★（塗りつぶし）
  - 未選択: ☆（アウトライン）
  - ホバー時: 透明度変化
- **新規メニュー追加**:
  - 注文履歴: `/mypage/orders`
  - 承認（管理者のみ）: `/approval` + バッジ表示（件数3件）

### 3. ヘッダーレイアウト変更
- **ログアウトアイコン削除**: 1段目から削除
- **販売店選択の移動**: 2段目の左側 → 右側（ユーザー名の左）
- **既存ナビゲーションアイコン削除**: カスタムメニューに統合

---

## レイアウト仕様

### 変更前
```
【ヘッダー2段目】
[☰ メニュー] | 配送先 | 販売店選択 | ポイント | 見積り依頼 | クイックオーダー | マイカタログ | お問い合わせ | ユーザー名
```

### 変更後
```
【ヘッダー2段目-左】
[☰ メニュー] [📌 見積り依頼 | ⚡ クイック | 📁 マイカタログ | 📋 注文履歴] | 配送先 | ポイント

【ヘッダー2段目-右】
お問い合わせ | 販売店 | ユーザー名
```

---

## 技術設計

### 新規作成ファイル

#### 1. `src/store/useCustomMenuStore.ts`
**役割**: カスタムメニューの状態管理

```typescript
interface CustomMenuState {
  // 選択されたメニューID配列
  customMenuIds: string[];

  // メニューを追加
  addCustomMenu: (id: string) => void;

  // メニューを削除
  removeCustomMenu: (id: string) => void;

  // メニューが選択されているか確認
  isCustomMenu: (id: string) => boolean;

  // メニューのトグル（追加/削除の切り替え）
  toggleCustomMenu: (id: string) => void;
}
```

**デフォルト値**:
```typescript
customMenuIds: ['quote-request', 'quick-order', 'my-catalog', 'order-history']
```

**永続化**: `localStorage.getItem('custom-menu-ids')`（SSR対応）

---

#### 2. `src/components/layout/CustomMenuBar.tsx`
**階層**: Molecule
**役割**: カスタムメニュー表示バー

**使用する既存コンポーネント**:
- `Icon` (Atom) - アイコン表示
- `Badge` (Atom) - 承認件数表示

**Props**:
```typescript
interface CustomMenuBarProps {
  // 選択されたメニューID配列
  selectedMenuIds: string[];
}
```

**スタイル**:
- 背景色: `bg-gray-50`（視覚的分離）
- パディング: `px-4 py-2`
- アイコン間隔: `space-x-4`

---

### 修正ファイル

#### 3. `src/config/headerNavigationConfig.ts`

**拡張するインターフェース**:
```typescript
export interface NavigationIconConfig {
  id: string;
  href: string;
  label: string;
  iconPath: string | string[];
  text: string;

  // 新規追加プロパティ
  showInDrawer?: boolean;        // ドロワーメニューに表示
  customizable?: boolean;         // カスタムメニューに追加可能
  badge?: boolean;                // バッジ表示あり
  showForRoles?: string[];        // 表示対象ロール（将来実装）
  getBadgeCount?: () => number;   // バッジ件数取得（モック）
}
```

**追加メニュー**:
```typescript
{
  id: 'order-history',
  href: '/mypage/orders',
  label: '注文履歴',
  iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  text: '注文履歴',
  showInDrawer: true,
  customizable: true
},
{
  id: 'approval',
  href: '/approval',
  label: '承認',
  iconPath: 'M9 12l2 2 4-4M7 12h14a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2z',
  text: '承認',
  showInDrawer: true,
  customizable: true,
  badge: true,
  showForRoles: ['admin', 'manager'],
  getBadgeCount: () => 3  // モック: 承認待ち3件
}
```

---

#### 4. `src/components/layout/MobileMenu.tsx`

**変更点**:
1. **星アイコン追加**
   - 各メニュー項目の右端に配置
   - `useCustomMenuStore`で選択状態管理
   - ホバー時: `opacity-30 → opacity-100`
   - 選択済み: 塗りつぶし星（`fill="currentColor"`）
   - 未選択: アウトライン星（`fill="none"`）

2. **新規メニュー追加**
   - 注文履歴メニュー（154行目付近に挿入）
   - 承認メニュー（バッジ付き）

3. **コンポーネント構造**:
```tsx
<Link href={icon.href} className="flex items-center justify-between">
  <div className="flex items-center">
    <Icon /> {/* アイコン */}
    <span>{icon.text}</span>
    {icon.badge && <Badge count={icon.getBadgeCount?.()} />}
  </div>

  {/* 星アイコン（カスタマイズ可能な項目のみ） */}
  {icon.customizable && (
    <button onClick={() => toggleCustomMenu(icon.id)}>
      <Icon name="star" fill={isCustomMenu ? "currentColor" : "none"} />
    </button>
  )}
</Link>
```

---

#### 5. `src/components/layout/Header.tsx`

**変更点**:

**A. 1段目: ログアウトアイコン削除（170-177行目）**
```tsx
// 削除
<button onClick={handleLogout} className="...">
  <svg>...</svg>
  <span>ログアウト</span>
</button>
```

**B. 2段目: CustomMenuBar追加（201行目付近）**
```tsx
<div className="flex items-center space-x-4">
  <button onClick={() => setIsMobileMenuOpen(true)}>
    <svg>...</svg>
    メニュー
  </button>

  {/* カスタムメニューバー（新規追加） */}
  {isAuthenticated && (
    <CustomMenuBar selectedMenuIds={customMenuIds} />
  )}

  {/* 既存: 配送先、ポイントなど */}
  <DeliveryAddressDisplay />
  <PointsDisplay />
</div>
```

**C. 2段目-右: 販売店選択を移動（218行目 → 237行目エリア）**
```tsx
<div className="flex items-center space-x-4">
  {/* 右側グループ: お問い合わせ */}
  <HeaderNavigationIcon id="contact" />

  {/* 販売店選択（左側から移動） */}
  <DealerSelectorButton />

  {/* ユーザー名 */}
  <UserNameDisplay />
</div>
```

**D. 既存ナビゲーションアイコン削除（220-232行目）**
```tsx
// 削除（カスタムメニューに統合）
{headerNavigationIcons
  .filter(icon => headerNavigationGroups.left.includes(icon.id))
  .map(icon => <HeaderNavigationIcon key={icon.id} {...icon} />)
}
```

---

## データフロー

```
【ユーザー操作】
  ↓
[ドロワーメニューで星クリック]
  ↓
useCustomMenuStore.toggleCustomMenu(id)
  ↓
localStorage更新
  ↓
Header.tsx が customMenuIds を参照
  ↓
CustomMenuBar にメニュー表示
```

---

## テスト仕様

### 1. `src/store/__tests__/useCustomMenuStore.test.ts`
- [ ] デフォルト値が正しく設定される
- [ ] `addCustomMenu` でメニュー追加
- [ ] `removeCustomMenu` でメニュー削除
- [ ] `toggleCustomMenu` で追加/削除切り替え
- [ ] `isCustomMenu` で選択状態確認
- [ ] localStorage永続化テスト
- [ ] SSR環境でエラーが出ない

### 2. `src/components/layout/__tests__/CustomMenuBar.test.tsx`
- [ ] 選択メニューが表示される
- [ ] メニュークリックでページ遷移
- [ ] バッジが正しく表示される
- [ ] 空の場合は何も表示されない

### 3. `src/components/layout/__tests__/MobileMenu.test.tsx`（拡張）
- [ ] 星アイコンが表示される
- [ ] 星クリックで選択状態が切り替わる
- [ ] 選択済み星が塗りつぶしで表示される
- [ ] 未選択星がアウトラインで表示される
- [ ] 注文履歴メニューが表示される
- [ ] 承認メニューとバッジが表示される

### 4. `src/components/layout/__tests__/Header.test.tsx`（拡張）
- [ ] ログアウトアイコンが非表示
- [ ] 販売店選択が右側に表示される
- [ ] CustomMenuBarが表示される
- [ ] 既存ナビゲーションアイコンが非表示

---

## アクセシビリティ対応

- [ ] 星ボタンに `aria-label` 追加（例: "カスタムメニューに追加"）
- [ ] キーボード操作対応（Enterキーで星トグル）
- [ ] スクリーンリーダー対応（選択状態を音声で通知）
- [ ] コントラスト比確認（WCAG AA基準）

---

## ロール対応（将来実装）

### 現在（モック）
- 承認メニューは全ユーザーに表示
- `getBadgeCount()` は固定値3を返す

### 将来実装時
```typescript
// useAuthStore でロール確認
const { user } = useAuthStore();
const isAdmin = user?.role === 'admin' || user?.role === 'manager';

// 条件付き表示
{icon.showForRoles && (
  isAdmin ? <MenuItem {...icon} /> : null
)}

// API呼び出し
const { data: approvalCount } = useSWR('/api/approval/count');
```

---

## パフォーマンス最適化

1. **メモ化**
```typescript
const selectedMenus = useMemo(() => {
  return headerNavigationIcons.filter(icon =>
    customMenuIds.includes(icon.id)
  );
}, [customMenuIds]);
```

2. **遅延レンダリング**
- CustomMenuBar は認証後のみ表示
- 未認証時はレンダリングしない

---

## 変更履歴

### 2025-11-07
- 初版作成
- デザインレビュー完了
- 技術設計確定
