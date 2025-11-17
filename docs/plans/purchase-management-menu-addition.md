# 購買管理メニュー追加 実装計画

## 概要

ヘッダーナビゲーションとドロワーメニューに「購買管理」メニューを追加します。

## 要件

### メニュー仕様
- **メニュー名**: 購買管理
- **ID**: `purchase-management`
- **リンク先**: `/purchase-management`
- **表示場所**:
  - ドロワーメニュー（モバイル/デスクトップ両方）
  - カスタムメニューバー（星アイコンで追加可能）
- **認証要件**: 認証済みユーザーのみ表示

### アイコン
購買管理にふさわしいアイコンとして、以下を使用：
- ショッピングバッグ + チェックマークの組み合わせ
- SVGパス: 複数のパス要素で構成

## 実装内容

### 1. drawerMenuConfig.ts の更新

**managementSection** に「購買管理」メニューを追加：

```typescript
{
  id: 'purchase-management',
  label: '購買管理',
  href: '/purchase-management',
  iconPath: [
    'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',  // ショッピングバッグ
    'M9 12l2 2 4-4'  // チェックマーク
  ],
  requiresAuth: true,
}
```

### 2. headerNavigationConfig.ts の更新

カスタムメニューバー対応として追加：

```typescript
{
  id: 'purchase-management',
  href: '/purchase-management',
  label: '購買管理',
  iconPath: [
    'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    'M9 12l2 2 4-4'
  ],
  text: '購買管理',
  showInDrawer: true,
  customizable: true
}
```

### 3. 購買管理ページの作成

`src/app/purchase-management/page.tsx` を作成：

- 認証保護ルート
- 基本的なページレイアウト
- 将来的な機能拡張のためのテンプレート構造

## 実装手順

1. ✅ 実装計画ドキュメントを作成（このファイル）
2. drawerMenuConfig.ts を更新
3. headerNavigationConfig.ts を更新
4. 購買管理ページの空テンプレートを作成
5. 開発サーバーで動作確認
6. 変更をコミット

## 技術的注意点

### アイコンの複数パス対応
両方の設定ファイルで `iconPath` を配列形式で定義し、MobileMenu.tsx と CustomMenuBar.tsx で既に対応済みの複数パスレンダリングを活用します。

### 既存コンポーネントの互換性
- MobileMenu.tsx: 既に `Array.isArray(item.iconPath)` で複数パス対応済み
- CustomMenuBar.tsx: 既に `Array.isArray(menu.iconPath)` で複数パス対応済み

### ルーティング
- App Router の protected ルートグループに配置
- 認証チェックはページレベルで実装

## 将来の拡張性

購買管理ページは以下の機能を実装する予定：
- 購買統計ダッシュボード
- 予算管理
- 発注承認フロー
- 購買履歴分析
- CSVエクスポート

## テスト計画

1. ドロワーメニューに「購買管理」が表示されること
2. カスタムメニューに追加可能なこと
3. クリックで `/purchase-management` に遷移すること
4. 未認証ユーザーには表示されないこと
5. アイコンが正しく表示されること（複数パス）

## 完了条件

- [x] 実装計画ドキュメント作成
- [ ] drawerMenuConfig.ts 更新
- [ ] headerNavigationConfig.ts 更新
- [ ] 購買管理ページ作成
- [ ] 動作確認
- [ ] コミット
